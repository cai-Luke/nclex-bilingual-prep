import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { basename, join, relative } from "node:path";

type Population = "canonical" | "raw" | "pending";
type JoinConfidence =
  | "exact_id"
  | "filename_slug"
  | "title_slug"
  | "topic_slug"
  | "fuzzy"
  | "none";

type SkeletonRecord = {
  path: string;
  filename: string;
  title: string;
  titleSlug: string;
  dpCount: number | null;
  hasBowtie: boolean;
  text: string;
};

type CaseRecord = {
  case_id: string;
  file: string;
  population: Population;
  lane: string;
  schemaVersion: string | null;
  ledger_vintage: string | null;
  topic: string;
  title: string;
  emitted_item_count: number;
  emitted_bowtie: boolean;
  bowtie_match_confidence: "strong" | "weak" | "none";
  skeleton_dp_count: number | null;
  skeleton_has_bowtie: boolean | null;
  shortfall: number | null;
  bowtie_dropped: boolean;
  join_confidence: JoinConfidence;
  skeleton_path: string | null;
  candidate_skeletons: Array<{
    path: string;
    title: string;
    score: number;
    signal: JoinConfidence;
  }>;
  cause_tag: "clean-small";
  completion_mode: "recompile" | "regenerate" | "confirm-join" | "none" | "tbd";
  priority: "P1" | "P2" | "P2-unconfirmed" | "R1" | "tolerated" | "full" | "needs-layer-b-dp-parse";
};

const ROOT = ".";
const BANKS_DIR = "banks";
const SKELETON_DIR = "Archive/case_sources";
const OUTPUT_DIR = "audit/case-completion";

const slug = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

const words = (value: string) =>
  new Set(
    slug(value)
      .split("_")
      .filter((word) => word.length >= 3 && !["case", "study", "unfolding", "opus", "patient"].includes(word)),
  );

const jaccard = (left: Set<string>, right: Set<string>) => {
  const union = new Set([...left, ...right]);
  if (union.size === 0) return 0;
  const overlap = [...left].filter((word) => right.has(word)).length;
  return overlap / union.size;
};

const walk = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walk(path) : Promise.resolve([path]);
    }),
  );
  return nested.flat();
};

const populationFor = (file: string): Population =>
  file.includes("banks-raw") ? "raw" : file.includes("Pending cases") ? "pending" : "canonical";

const laneFor = (caseId: string, file: string) => {
  const value = `${caseId} ${file}`.toLowerCase();
  if (value.includes("opus")) return "opus-skeleton";
  if (value.includes("gpt")) return "gpt";
  if (value.includes("gemini")) return "gemini";
  if (value.includes("claude")) return "claude";
  return "legacy-direct";
};

const extractSection = (text: string, heading: string, nextHeadings: string[]) => {
  const next = nextHeadings.map((candidate) => candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const pattern = new RegExp(
    `(?:\\*\\*)?${heading}(?:\\*\\*)?\\s*\\n([\\s\\S]*?)(?=\\n\\s*(?:\\*\\*)?(?:${next})(?:\\*\\*)?|$)`,
    "i",
  );
  return text.match(pattern)?.[1] ?? null;
};

const parseSkeleton = async (path: string): Promise<SkeletonRecord> => {
  const text = await readFile(path, "utf8");
  const titleBlock = extractSection(text, "CASE TITLE", [
    "PATIENT BACKGROUND",
    "INITIAL PRESENTATION",
    "ASSESSMENT FINDINGS",
  ]);
  const title = titleBlock?.split("\n").map((line) => line.trim()).find(Boolean) ?? basename(path, ".md");
  const dpBlock = extractSection(text, "KEY DECISION POINTS", [
    "COMMON NURSING ERRORS",
    "EXPECTED LEARNING OBJECTIVES",
    "BOW-TIE SYNTHESIS",
  ]);
  const dpMatches = dpBlock?.match(/^\s*\d+\.\s+/gm);
  return {
    path,
    filename: basename(path, ".md"),
    title,
    titleSlug: slug(title),
    dpCount: dpBlock === null ? null : (dpMatches?.length ?? 0),
    hasBowtie: /(?:\*\*)?BOW-TIE SYNTHESIS(?:\*\*)?/i.test(text),
    text,
  };
};

const ledgerVintageFor = (ledger: string, caseId: string) => {
  const line = ledger.split("\n").find((candidate) => candidate.includes(caseId));
  return line?.match(/20\d{2}-\d{2}-\d{2}/)?.[0] ?? null;
};

const opusNumber = (value: string) => value.toLowerCase().match(/opus[_-]?(\d+)/)?.[1] ?? null;

const candidatesFor = (caseRecord: { case_id: string; topic: string; title: string }, skeletons: SkeletonRecord[]) => {
  const caseText = `${caseRecord.case_id} ${caseRecord.topic} ${caseRecord.title}`;
  const caseWords = words(caseText);
  const caseNumber = opusNumber(caseRecord.case_id);
  return skeletons
    .map((skeleton) => {
      const titleExact =
        skeleton.titleSlug === slug(caseRecord.title) ||
        skeleton.titleSlug === slug(caseRecord.topic);
      const filenameNumber = caseNumber !== null && opusNumber(skeleton.filename) === caseNumber;
      const score = Math.max(
        jaccard(caseWords, words(skeleton.title)),
        jaccard(caseWords, words(skeleton.filename.replace(/opus[_-]?\d+/i, ""))),
      );
      const signal: JoinConfidence = skeleton.text.includes(caseRecord.case_id)
        ? "exact_id"
        : filenameNumber && score >= 0.3
          ? "filename_slug"
          : titleExact
            ? "title_slug"
            : slug(caseRecord.topic) === skeleton.titleSlug
              ? "topic_slug"
              : score >= 0.25
                ? "fuzzy"
                : "none";
      const boostedScore = Math.min(1, score + (filenameNumber ? 0.25 : 0) + (titleExact ? 0.35 : 0));
      return { skeleton, score: Number(boostedScore.toFixed(3)), signal };
    })
    .filter((candidate) => candidate.signal !== "none")
    .sort((left, right) => right.score - left.score || left.skeleton.path.localeCompare(right.skeleton.path));
};

const highConfidenceMatch = (
  candidates: ReturnType<typeof candidatesFor>,
): ReturnType<typeof candidatesFor>[number] | null => {
  if (candidates.length === 0) return null;
  const first = candidates[0];
  const second = candidates[1];
  const strongSignal = ["exact_id", "filename_slug", "title_slug"].includes(first.signal);
  const separated = second === undefined || first.score - second.score >= 0.2;
  return strongSignal && separated ? first : null;
};

const distributionKey = (population: Population, lane: string) => `${population}/${lane}`;

const main = async () => {
  const skeletonPaths = (await walk(SKELETON_DIR)).filter((path) => path.endsWith(".md")).sort();
  const skeletons = await Promise.all(skeletonPaths.map(parseSkeleton));
  const ledger = await readFile("BANK-REVIEW-LEDGER.md", "utf8");
  const bankPaths = (await walk(BANKS_DIR)).filter((path) => path.endsWith(".json")).sort();

  const parsedBanks: Array<{
    file: string;
    population: Population;
    schemaVersion: string | null;
    questions: Array<Record<string, any>>;
  }> = [];
  const parseFailures: Array<{ file: string; error: string }> = [];
  for (const file of bankPaths) {
    try {
      const raw = JSON.parse(await readFile(file, "utf8")) as {
        meta?: { schemaVersion?: string };
        questions?: Array<Record<string, any>>;
      };
      parsedBanks.push({
        file,
        population: populationFor(file),
        schemaVersion: raw.meta?.schemaVersion ?? null,
        questions: Array.isArray(raw.questions) ? raw.questions : [],
      });
    } catch (error) {
      parseFailures.push({ file, error: error instanceof Error ? error.message : String(error) });
    }
  }

  const bowties = parsedBanks.flatMap((bank) =>
    bank.questions
      .filter((question) => question.itemType === "bowtie")
      .map((question) => ({ id: String(question.id ?? ""), topicSlug: slug(String(question.topic ?? "")) })),
  );
  const rows: CaseRecord[] = [];

  for (const bank of parsedBanks) {
    for (const question of bank.questions) {
      if (question.itemType !== "case_study" || !Array.isArray(question.caseStudy?.questions)) continue;
      const caseId = String(question.id ?? "");
      const topic = String(question.topic ?? "");
      const title = String(question.caseStudy?.title?.en ?? "");
      const strictBowties = bowties.filter((bowtie) => bowtie.id.startsWith(`${caseId}_`));
      const weakBowties = strictBowties.length === 0
        ? bowties.filter((bowtie) => bowtie.topicSlug !== "" && bowtie.topicSlug === slug(topic))
        : [];
      const emittedBowtie = strictBowties.length === 1 || weakBowties.length === 1;
      const bowtieConfidence = strictBowties.length === 1 ? "strong" : weakBowties.length === 1 ? "weak" : "none";
      const candidateMatches = candidatesFor({ case_id: caseId, topic, title }, skeletons);
      const highMatch = highConfidenceMatch(candidateMatches);
      const selected = highMatch?.skeleton ?? candidateMatches[0]?.skeleton ?? null;
      const joinConfidence = highMatch?.signal ?? candidateMatches[0]?.signal ?? "none";
      const skeletonDpCount = selected?.dpCount ?? null;
      const shortfall = skeletonDpCount === null ? null : skeletonDpCount - question.caseStudy.questions.length;
      const bowtieDropped = Boolean(selected?.hasBowtie && !emittedBowtie);
      const underCompiled = (shortfall ?? 0) > 0 || bowtieDropped;
      const high = highMatch !== null;
      const emittedCount = question.caseStudy.questions.length;

      let priority: CaseRecord["priority"];
      let completionMode: CaseRecord["completion_mode"];
      if (selected && selected.dpCount === null) {
        priority = "needs-layer-b-dp-parse";
        completionMode = "tbd";
      } else if (high && underCompiled && emittedCount < 4) {
        priority = "P1";
        completionMode = "recompile";
      } else if (high && underCompiled && (emittedCount <= 5 || bowtieDropped)) {
        priority = "P2";
        completionMode = "recompile";
      } else if (selected && underCompiled) {
        priority = "P2-unconfirmed";
        completionMode = "confirm-join";
      } else if (emittedCount < 4) {
        priority = "R1";
        completionMode = "regenerate";
      } else if (emittedCount >= 6) {
        priority = "full";
        completionMode = "none";
      } else {
        priority = "tolerated";
        completionMode = "none";
      }

      rows.push({
        case_id: caseId,
        file: relative(ROOT, bank.file),
        population: bank.population,
        lane: laneFor(caseId, bank.file),
        schemaVersion: bank.schemaVersion,
        ledger_vintage: ledgerVintageFor(ledger, caseId),
        topic,
        title,
        emitted_item_count: emittedCount,
        emitted_bowtie: emittedBowtie,
        bowtie_match_confidence: bowtieConfidence,
        skeleton_dp_count: skeletonDpCount,
        skeleton_has_bowtie: selected?.hasBowtie ?? null,
        shortfall,
        bowtie_dropped: bowtieDropped,
        join_confidence: joinConfidence,
        skeleton_path: high ? selected?.path ?? null : null,
        candidate_skeletons: candidateMatches.slice(0, 5).map((candidate) => ({
          path: candidate.skeleton.path,
          title: candidate.skeleton.title,
          score: candidate.score,
          signal: candidate.signal,
        })),
        cause_tag: "clean-small",
        completion_mode: completionMode,
        priority,
      });
    }
  }

  const priorityRank: Record<CaseRecord["priority"], number> = {
    P1: 0,
    P2: 1,
    "P2-unconfirmed": 2,
    R1: 3,
    "needs-layer-b-dp-parse": 4,
    tolerated: 5,
    full: 6,
  };
  rows.sort((left, right) =>
    priorityRank[left.priority] - priorityRank[right.priority] ||
    left.population.localeCompare(right.population) ||
    left.case_id.localeCompare(right.case_id),
  );

  const distribution: Record<string, Record<string, number>> = {};
  for (const row of rows) {
    const key = distributionKey(row.population, row.lane);
    distribution[key] ??= {};
    const countKey = row.emitted_item_count >= 7 ? "7+" : String(row.emitted_item_count);
    distribution[key][countKey] = (distribution[key][countKey] ?? 0) + 1;
  }

  const geminiQueue = rows.filter((row) =>
    row.lane === "opus-skeleton" &&
    ["P1", "P2", "P2-unconfirmed", "needs-layer-b-dp-parse"].includes(row.priority),
  );
  const summary = {
    generatedAt: new Date().toISOString(),
    skeletonCount: skeletons.length,
    caseCount: rows.length,
    parseFailures,
    distribution,
    priorityCounts: Object.fromEntries(
      [...new Set(rows.map((row) => row.priority))].sort().map((priority) => [
        priority,
        rows.filter((row) => row.priority === priority).length,
      ]),
    ),
    opusPriorityCounts: Object.fromEntries(
      ["P1", "P2", "P2-unconfirmed", "R1", "needs-layer-b-dp-parse", "tolerated", "full"].map((priority) => [
        priority,
        rows.filter((row) => row.lane === "opus-skeleton" && row.priority === priority).length,
      ]),
    ),
  };

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(join(OUTPUT_DIR, "layer-a.json"), `${JSON.stringify({ summary, rows }, null, 2)}\n`);
  await writeFile(
    join(OUTPUT_DIR, "gemini-layer-b-queue.jsonl"),
    geminiQueue.map((row) => JSON.stringify(row)).join("\n") + (geminiQueue.length > 0 ? "\n" : ""),
  );

  const report = [
    "# Case Completion Reconciliation — Layer A",
    "",
    `Generated: ${summary.generatedAt}`,
    `Skeleton sources: ${summary.skeletonCount}`,
    `JSON cases: ${summary.caseCount}`,
    `JSON parse failures: ${parseFailures.length}`,
    "",
    "## Opus-Origin Buckets",
    "",
    ...Object.entries(summary.opusPriorityCounts).map(([priority, count]) => `- ${priority}: ${count}`),
    "",
    "## Count Distribution",
    "",
    "| population/lane | 2 | 3 | 4 | 5 | 6 | 7+ |",
    "|---|---:|---:|---:|---:|---:|---:|",
    ...Object.entries(distribution).map(([key, counts]) =>
      `| ${key} | ${counts["2"] ?? 0} | ${counts["3"] ?? 0} | ${counts["4"] ?? 0} | ${counts["5"] ?? 0} | ${counts["6"] ?? 0} | ${counts["7+"] ?? 0} |`,
    ),
    "",
    "## Gemini Queue",
    "",
    `Rows requiring capped join confirmation or DP alignment: ${geminiQueue.length}`,
    "",
    "| priority | case | emitted | skeleton DP | join | candidate |",
    "|---|---|---:|---:|---|---|",
    ...geminiQueue.map((row) =>
      `| ${row.priority} | ${row.case_id} | ${row.emitted_item_count} | ${row.skeleton_dp_count ?? "?"} | ${row.join_confidence} | ${row.candidate_skeletons[0]?.path ?? "none"} |`,
    ),
    "",
    "Layer A does not authorize recompilation from a fuzzy or topic-only match. Gemini may confirm alignment and identify missing DPs, but must not edit any source or bank file. Claude performs final review.",
    "",
  ].join("\n");
  await writeFile(join(OUTPUT_DIR, "LAYER-A-REPORT.md"), report);

  const prompt = `# Gemini Layer B — Case Completion Alignment

Use only the rows in \`gemini-layer-b-queue.jsonl\`. This is a capped classification task.

For each row:
1. Read the compiled case and every listed candidate skeleton.
2. Confirm exactly one skeleton match, or return \`join_verdict: "unresolved"\`.
3. If matched, align numbered skeleton decision points to emitted embedded items.
4. Return only missing decision points and whether any authored bowtie is a clean 1/2/2 source.
5. Do not rewrite JSON, edit skeleton prose, propose clinical cures, or mutate files.

Output one JSON object per input row:

\`\`\`json
{"case_id":"...","join_verdict":"confirmed|rejected|unresolved","skeleton_path":"...|null","join_evidence":"brief","missing_dps":[{"dp_index":1,"dp_skill":"recognize_cues","dp_summary":"brief"}],"bowtie_source_valid":"yes|no|not_present","notes":"brief"}
\`\`\`

Claude is the final reviewer. A Gemini confirmation is advisory and does not itself authorize promotion.
`;
  await writeFile(join(OUTPUT_DIR, "GEMINI-LAYER-B-PROMPT.md"), prompt);

  console.log(`Layer A wrote ${rows.length} case rows from ${skeletons.length} skeletons.`);
  console.log(`Gemini queue: ${geminiQueue.length} row(s).`);
  console.log(`Artifacts: ${OUTPUT_DIR}/`);
};

await main();
