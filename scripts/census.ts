import { execSync } from "node:child_process";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBankText } from "../src/bankImport";
import { validateBankObject } from "../src/schema";
import { categories } from "../src/schema";
import { listVisualKinds } from "../src/visuals/registry";
import type { Question, QuestionVisual, RhythmStripVisual } from "../src/types";
import { computeCoverage } from "./coverage-report";

// ---- Types ----

type PerFileEntry = {
  file: string;
  schemaVersion: string | null;
  metaCount: number | null;
  questionsLength: number;
  mismatch: boolean;
};

type CensusData = {
  generatedAt: string;
  gitSha: string;
  perFile: PerFileEntry[];
  totals: {
    topLevel: number;
    caseStudyTopLevel: number;
    embeddedParts: number;
    gradedTotal: number;
  };
  byItemType: Record<string, number>;
  byCategory: Record<string, number>;
  withinCategory: Record<string, {
    topTopics: Array<{ topic: string; count: number }>;
    visualKinds: Record<string, number>;
  }>;
  byDifficulty: Record<string, number>;
  bySchemaVersion: Record<string, { questions: number; files: string[] }>;
  bySourceFile: Record<string, number>;
  visuals: {
    total: number;
    byKind: Record<string, number>;
    rhythmSubtypes: Record<string, number>;
    idsByKind: Record<string, string[]>;
  };
  caseStudies: Array<{ id: string; topic: string; parts: number; bank: string }>;
  idUniqueness: { duplicates: Array<{ id: string; files: string[] }> };
  targets: {
    categoryTargets: [string, number][];
    itemTypeAvg: number;
    underCategories: [string, number][];
    overCategories: [string, number][];
    underItemTypes: [string, number][];
  };
  prioritizeTopics: string[];
  avoidTopics: string[];
  docsDrift: { ok: boolean; findings: string[] };
};

// ---- File loading ----

export const getBankFiles = async () => {
  const bankFiles = await readdir("banks").then((files) =>
    files
      .filter((file) => file.endsWith(".json"))
      .sort()
      .map((file) => join("banks", file)),
  );
  return bankFiles.map((file) => resolve(file));
};

export const loadBank = async (file: string) => {
  const text = await readFile(file, "utf8");
  const raw = parseBankText(text);
  const result = validateBankObject(raw);
  if (!result.ok) {
    throw new Error(`${basename(file)} failed validation:\n${result.reasons.map((r) => `- ${r}`).join("\n")}`);
  }
  return result.value;
};

// ---- Git SHA ----

const getGitSha = (): string => {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
};

// ---- Visual traversal with owner ID ----

type VisualWithOwner = { visual: QuestionVisual; ownerId: string };

const collectVisualsWithOwner = (question: Question): VisualWithOwner[] => {
  const results: VisualWithOwner[] = [];
  if (question.visual) results.push({ visual: question.visual, ownerId: question.id });
  if (question.itemType === "case_study") {
    question.caseStudy.exhibits.forEach((exhibit) => {
      if (exhibit.visual) results.push({ visual: exhibit.visual, ownerId: question.id });
    });
    question.caseStudy.stages?.forEach((stage) => {
      stage.exhibits.forEach((exhibit) => {
        if (exhibit.visual) results.push({ visual: exhibit.visual, ownerId: question.id });
      });
    });
    question.caseStudy.questions.forEach((caseQuestion) => {
      if (caseQuestion.visual) results.push({ visual: caseQuestion.visual, ownerId: caseQuestion.id });
    });
  }
  return results;
};

// ---- Docs drift check (advisory, best-effort) ----

const checkDocsDrift = async (loadedFileBasenames: string[]): Promise<{ ok: boolean; findings: string[] }> => {
  const findings: string[] = [];
  const loadedFiles = new Set(loadedFileBasenames);

  const checkDoc = async (docPath: string) => {
    let text: string;
    try {
      text = await readFile(docPath, "utf8");
    } catch {
      return;
    }
    const matches = text.match(/\b[\w-]+-canonical\.json\b/g) ?? [];
    const mentioned = new Set(matches);
    for (const name of mentioned) {
      if (!loadedFiles.has(name)) {
        findings.push(`${basename(docPath)} references "${name}" but it is not in banks/`);
      }
    }
  };

  await Promise.all([checkDoc("PROJECT-HISTORY.md"), checkDoc("BANK-REVIEW-LEDGER.md")]);
  return { ok: findings.length === 0, findings };
};

// ---- Core census computation ----

const computeCensus = async (): Promise<CensusData> => {
  const files = await getBankFiles();
  const banks: Array<{ file: string; envelope: Awaited<ReturnType<typeof loadBank>> }> = [];
  for (const file of files) {
    banks.push({ file, envelope: await loadBank(file) });
  }

  // Per-file metadata
  const perFile: PerFileEntry[] = banks.map(({ file, envelope }) => {
    const schemaVersion = envelope.meta?.schemaVersion ?? null;
    const metaCount = envelope.meta?.count ?? null;
    const questionsLength = envelope.questions.length;
    return {
      file: basename(file),
      schemaVersion,
      metaCount,
      questionsLength,
      mismatch: metaCount !== null && metaCount !== questionsLength,
    };
  });

  // Flat question list
  const allQuestions: Question[] = banks.flatMap(({ envelope }) => envelope.questions);

  const withinCategory: CensusData["withinCategory"] = {};
  for (const category of categories) {
    const questions = allQuestions.filter((question) => question.category === category);
    const topicCounts = new Map<string, number>();
    const visualCounts = new Map<string, number>();
    for (const question of questions) {
      topicCounts.set(question.topic, (topicCounts.get(question.topic) ?? 0) + 1);
      for (const { visual } of collectVisualsWithOwner(question)) {
        visualCounts.set(visual.kind, (visualCounts.get(visual.kind) ?? 0) + 1);
      }
    }
    withinCategory[category] = {
      topTopics: [...topicCounts.entries()]
        .sort(([leftTopic, leftCount], [rightTopic, rightCount]) =>
          rightCount - leftCount || leftTopic.localeCompare(rightTopic))
        .slice(0, 10)
        .map(([topic, count]) => ({ topic, count })),
      visualKinds: Object.fromEntries(
        [...visualCounts.entries()].sort(([left], [right]) => left.localeCompare(right)),
      ),
    };
  }

  // Top-level vs embedded split
  let topLevel = 0;
  let caseStudyTopLevel = 0;
  let embeddedParts = 0;
  for (const q of allQuestions) {
    topLevel += 1;
    if (q.itemType === "case_study") {
      caseStudyTopLevel += 1;
      embeddedParts += q.caseStudy.questions.length;
    }
  }

  // Coverage (reuses coverage-report logic)
  const coverage = computeCoverage(allQuestions);

  // bySchemaVersion
  const bySchemaVersion: Record<string, { questions: number; files: string[] }> = {};
  for (const entry of perFile) {
    const ver = entry.schemaVersion ?? "unknown";
    if (!bySchemaVersion[ver]) bySchemaVersion[ver] = { questions: 0, files: [] };
    bySchemaVersion[ver].questions += entry.questionsLength;
    bySchemaVersion[ver].files.push(entry.file);
  }

  // bySourceFile
  const bySourceFile: Record<string, number> = Object.fromEntries(
    perFile.map(({ file, questionsLength }) => [file, questionsLength]),
  );

  // Visual counts + ID enumeration
  const visualKindCounts = new Map<string, number>();
  const visualIdsByKind = new Map<string, string[]>();
  const rhythmSubtypeCounts = new Map<string, number>();

  for (const question of allQuestions) {
    for (const { visual, ownerId } of collectVisualsWithOwner(question)) {
      const kind = visual.kind;
      visualKindCounts.set(kind, (visualKindCounts.get(kind) ?? 0) + 1);
      const ids = visualIdsByKind.get(kind) ?? [];
      ids.push(ownerId);
      visualIdsByKind.set(kind, ids);
      if (visual.kind === "rhythm_strip") {
        const rhythm = (visual as RhythmStripVisual).rhythm;
        rhythmSubtypeCounts.set(rhythm, (rhythmSubtypeCounts.get(rhythm) ?? 0) + 1);
      }
    }
  }

  const allKinds = [...listVisualKinds()].sort();
  const byKind: Record<string, number> = Object.fromEntries(
    allKinds.map((kind) => [kind, visualKindCounts.get(kind) ?? 0]),
  );
  const idsByKind: Record<string, string[]> = Object.fromEntries(
    allKinds.map((kind) => [kind, [...new Set(visualIdsByKind.get(kind) ?? [])].sort()]),
  );
  const rhythmSubtypes: Record<string, number> = Object.fromEntries(
    [...rhythmSubtypeCounts.entries()].sort(([a], [b]) => a.localeCompare(b)),
  );

  // Case study inventory
  const caseStudies: CensusData["caseStudies"] = [];
  for (const { file, envelope } of banks) {
    for (const question of envelope.questions) {
      if (question.itemType === "case_study") {
        caseStudies.push({
          id: question.id,
          topic: question.topic,
          parts: question.caseStudy.questions.length,
          bank: basename(file),
        });
      }
    }
  }

  // Cross-bank ID uniqueness
  const idToFiles = new Map<string, string[]>();
  for (const { file, envelope } of banks) {
    const b = basename(file);
    for (const question of envelope.questions) {
      const ids = [question.id];
      if (question.itemType === "case_study") {
        question.caseStudy.questions.forEach((eq) => ids.push(eq.id));
      }
      for (const id of ids) {
        const existing = idToFiles.get(id) ?? [];
        existing.push(b);
        idToFiles.set(id, existing);
      }
    }
  }
  const duplicates = [...idToFiles.entries()]
    .filter(([, fs]) => fs.length > 1)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, fs]) => ({ id, files: fs }));

  const docsDrift = await checkDocsDrift(perFile.map((e) => e.file));

  return {
    generatedAt: new Date().toISOString(),
    gitSha: getGitSha(),
    perFile,
    totals: { topLevel, caseStudyTopLevel, embeddedParts, gradedTotal: topLevel + embeddedParts },
    byItemType: Object.fromEntries(coverage.byItemType),
    byCategory: Object.fromEntries(coverage.byCategory),
    withinCategory,
    byDifficulty: Object.fromEntries(coverage.byDifficulty),
    bySchemaVersion,
    bySourceFile,
    visuals: { total: coverage.totalVisuals, byKind, rhythmSubtypes, idsByKind },
    caseStudies,
    idUniqueness: { duplicates },
    targets: {
      categoryTargets: coverage.categoryTargets,
      itemTypeAvg: coverage.itemTypeAverage,
      underCategories: coverage.underCategories,
      overCategories: coverage.overCategories,
      underItemTypes: coverage.underItemTypes,
    },
    prioritizeTopics: coverage.prioritizeTopics,
    avoidTopics: coverage.avoidTopics,
    docsDrift,
  };
};

// ---- Markdown rendering ----

const renderCensus = (census: CensusData): string => {
  const lines: string[] = [];
  lines.push("<!-- GENERATED by `npm run census`. Do not hand-edit. -->");
  lines.push("");
  lines.push("# NCLEX Bank Census");
  lines.push("");
  lines.push(`Generated: ${census.generatedAt}`);
  lines.push(`Git SHA: ${census.gitSha}`);
  lines.push("");

  lines.push("## Per-File Summary");
  lines.push("");
  lines.push("| File | Schema | meta.count | questions | Mismatch |");
  lines.push("|------|--------|-----------|-----------|---------|");
  for (const entry of census.perFile) {
    const mismatch = entry.mismatch ? "YES" : "—";
    lines.push(`| ${entry.file} | ${entry.schemaVersion ?? "—"} | ${entry.metaCount ?? "—"} | ${entry.questionsLength} | ${mismatch} |`);
  }
  lines.push("");

  lines.push("## Totals");
  lines.push("");
  lines.push(`- Top-level questions: ${census.totals.topLevel}`);
  lines.push(`- Case study top-level: ${census.totals.caseStudyTopLevel}`);
  lines.push(`- Embedded parts: ${census.totals.embeddedParts}`);
  lines.push(`- Graded total: ${census.totals.gradedTotal}`);
  lines.push("");

  lines.push("## By Category");
  lines.push("");
  for (const [cat, cnt] of Object.entries(census.byCategory)) {
    lines.push(`- ${cat}: ${cnt}`);
  }
  lines.push("");

  lines.push("## Within-Category Concentration");
  lines.push("");
  for (const [category, detail] of Object.entries(census.withinCategory)) {
    lines.push(`### ${category}`);
    lines.push("");
    lines.push(`Top topics: ${detail.topTopics.map(({ topic, count }) => `${topic} (${count})`).join(", ") || "none"}`);
    const visuals = Object.entries(detail.visualKinds);
    lines.push(`Visual kinds: ${visuals.map(([kind, count]) => `${kind} (${count})`).join(", ") || "none"}`);
    lines.push("");
  }

  lines.push("## By Item Type");
  lines.push("");
  for (const [it, cnt] of Object.entries(census.byItemType)) {
    lines.push(`- ${it}: ${cnt}`);
  }
  lines.push("");

  lines.push("## By Difficulty");
  lines.push("");
  for (const [d, cnt] of Object.entries(census.byDifficulty)) {
    lines.push(`- ${d}: ${cnt}`);
  }
  lines.push("");

  lines.push("## By Schema Version");
  lines.push("");
  for (const [ver, data] of Object.entries(census.bySchemaVersion)) {
    lines.push(`- v${ver}: ${data.questions} questions (${data.files.join(", ")})`);
  }
  lines.push("");

  lines.push("## By Source File");
  lines.push("");
  for (const [file, cnt] of Object.entries(census.bySourceFile)) {
    lines.push(`- ${file}: ${cnt}`);
  }
  lines.push("");

  lines.push("## Visuals");
  lines.push("");
  lines.push(`Total visuals: ${census.visuals.total}`);
  lines.push("");
  lines.push("### By Kind");
  lines.push("");
  for (const [kind, cnt] of Object.entries(census.visuals.byKind)) {
    const ids = census.visuals.idsByKind[kind] ?? [];
    const idSnippet =
      ids.length > 0
        ? ` (${ids.slice(0, 5).join(", ")}${ids.length > 5 ? `, …+${ids.length - 5}` : ""})`
        : "";
    lines.push(`- ${kind}: ${cnt}${idSnippet}`);
  }
  lines.push("");
  lines.push("### Rhythm Subtypes");
  lines.push("");
  const rhythmEntries = Object.entries(census.visuals.rhythmSubtypes);
  if (rhythmEntries.length === 0) {
    lines.push("- (none)");
  } else {
    for (const [rhythm, cnt] of rhythmEntries) {
      lines.push(`- ${rhythm}: ${cnt}`);
    }
  }
  lines.push("");

  lines.push("## Case Studies");
  lines.push("");
  if (census.caseStudies.length === 0) {
    lines.push("None.");
  } else {
    lines.push("| ID | Topic | Parts | Bank |");
    lines.push("|----|-------|-------|------|");
    for (const cs of census.caseStudies) {
      lines.push(`| ${cs.id} | ${cs.topic} | ${cs.parts} | ${cs.bank} |`);
    }
  }
  lines.push("");

  lines.push("## ID Uniqueness");
  lines.push("");
  if (census.idUniqueness.duplicates.length === 0) {
    lines.push("No duplicates detected.");
  } else {
    lines.push("Duplicates found:");
    for (const dup of census.idUniqueness.duplicates) {
      lines.push(`- \`${dup.id}\`: appears in ${dup.files.join(", ")}`);
    }
  }
  lines.push("");

  lines.push("## Targets");
  lines.push("");
  lines.push("Category targets (2026 NCLEX-RN test-plan weights):");
  for (const [category, target] of census.targets.categoryTargets) {
    lines.push(`- ${category}: ${target.toFixed(1)}`);
  }
  lines.push(`Item type average: ${census.targets.itemTypeAvg.toFixed(1)}`);
  lines.push("");
  if (census.targets.underCategories.length > 0) {
    lines.push("Under-served categories:");
    for (const [cat, cnt] of census.targets.underCategories) {
      lines.push(`- ${cat}: ${cnt}`);
    }
    lines.push("");
  }
  if (census.targets.overCategories.length > 0) {
    lines.push("Over-served categories:");
    for (const [cat, cnt] of census.targets.overCategories) {
      lines.push(`- ${cat}: ${cnt}`);
    }
    lines.push("");
  }
  if (census.targets.underItemTypes.length > 0) {
    lines.push("Under-served item types:");
    for (const [it, cnt] of census.targets.underItemTypes) {
      lines.push(`- ${it}: ${cnt}`);
    }
    lines.push("");
  }

  lines.push("## Prompt Parameters");
  lines.push("");
  lines.push("PRIORITIZE_TOPICS:");
  for (const item of census.prioritizeTopics) {
    lines.push(`- ${item}`);
  }
  lines.push("");
  lines.push("AVOID_TOPICS:");
  if (census.avoidTopics.length > 0) {
    for (const item of census.avoidTopics) {
      lines.push(`- ${item}`);
    }
  } else {
    lines.push("- none");
  }
  lines.push("");

  lines.push("## Docs Drift");
  lines.push("");
  if (census.docsDrift.ok) {
    lines.push("All references in project docs match the bank.");
  } else {
    lines.push("Warnings:");
    for (const finding of census.docsDrift.findings) {
      lines.push(`- ${finding}`);
    }
  }
  lines.push("");

  return lines.join("\n");
};

// ---- Check mode ----

const strip = ({ generatedAt: _a, gitSha: _b, ...rest }: CensusData) => rest;

const checkDrift = async (): Promise<void> => {
  let committed: CensusData;
  try {
    const text = await readFile("census.json", "utf8");
    committed = JSON.parse(text) as CensusData;
  } catch {
    console.error("census.json not found — run `npm run census` to generate it first.");
    process.exit(1);
  }

  const fresh = await computeCensus();

  const committedStr = JSON.stringify(strip(committed), null, 2);
  const freshStr = JSON.stringify(strip(fresh), null, 2);

  if (committedStr === freshStr) {
    console.log("census.json is up to date.");
    if (!fresh.docsDrift.ok) {
      console.warn("Docs drift warnings (advisory):");
      for (const finding of fresh.docsDrift.findings) {
        console.warn(`  - ${finding}`);
      }
    }
    return;
  }

  console.error("census.json is stale. Run `npm run census` to regenerate.");
  const committedLines = committedStr.split("\n");
  const freshLines = freshStr.split("\n");
  const maxLen = Math.max(committedLines.length, freshLines.length);
  let shown = 0;
  let total = 0;
  for (let i = 0; i < maxLen; i++) {
    const old = committedLines[i] ?? "";
    const neo = freshLines[i] ?? "";
    if (old !== neo) {
      total++;
      if (shown < 20) {
        console.error(`  line ${i + 1} - ${old}`);
        console.error(`  line ${i + 1} + ${neo}`);
        shown++;
      }
    }
  }
  if (total > shown) console.error(`  … and ${total - shown} more differences`);
  process.exit(1);
};

// ---- Entry point ----
//
// Guard the side-effecting run so this module can be imported for its exported
// helpers (e.g. by scripts/audio/build-tts-queue.ts) without regenerating
// census.json / BANK-CENSUS.md.

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const isCheck = process.argv.includes("--check");

  if (isCheck) {
    await checkDrift();
  } else {
    const census = await computeCensus();
    await writeFile("census.json", JSON.stringify(census, null, 2) + "\n", "utf8");
    await writeFile("BANK-CENSUS.md", renderCensus(census), "utf8");
    const { topLevel, embeddedParts } = census.totals;
    console.log(`Census written to census.json and BANK-CENSUS.md`);
    console.log(`  ${topLevel} top-level, ${embeddedParts} embedded parts, ${census.visuals.total} visuals`);
    if (census.idUniqueness.duplicates.length > 0) {
      console.warn(`  ${census.idUniqueness.duplicates.length} ID collision(s) detected`);
    }
    if (!census.docsDrift.ok) {
      console.warn("  Docs drift warnings:");
      for (const finding of census.docsDrift.findings) {
        console.warn(`    - ${finding}`);
      }
    }
  }
}
