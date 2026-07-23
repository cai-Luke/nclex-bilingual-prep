import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type Json = Record<string, any>;

const outputDir = dirname(fileURLToPath(import.meta.url));
const repo = resolve(outputDir, "../../..");
const queuePath = join(repo, "audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl");
const sonnetDir = join(repo, "audit/terminal-sentence-sonnet-review-2026-07-21");
const batchesDir = join(sonnetDir, "batches");
const parseJsonl = (path: string): Json[] => readFileSync(path, "utf8").trim().split("\n").map(JSON.parse);
const stableLine = (value: unknown) => JSON.stringify(value);
const sha256 = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const git = (...args: string[]) => execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trimEnd();

const queue = parseJsonl(queuePath);
const batchFiles = readdirSync(batchesDir)
  .filter((name) => /^batch-\d{3}\.jsonl$/.test(name))
  .sort((a, b) => Number(a.slice(6, 9)) - Number(b.slice(6, 9)));
const delivered = batchFiles.flatMap((name) => parseJsonl(join(batchesDir, name)));
const sonnetByIndex = new Map(delivered.map((row) => [row.queueIndex, row]));
const queueByIndex = new Map(queue.map((row) => [row.queueIndex, row]));

const identityFields = [
  "queueIndex", "bankPath", "topLevelQuestionId", "embeddedQuestionId", "recordKind", "itemType",
  "terminalSentenceEn", "terminalSentenceZh",
];
const verdicts = new Set(["PASS", "FLAG", "REVIEW"]);
const classes = new Set([
  "LEGITIMATE_CLINICAL_FACT", "LEGITIMATE_RESPONSE_DEMAND", "LEGITIMATE_GOVERNING_PROTOCOL_OR_ORDER",
  "LEGITIMATE_CLIENT_QUOTE_OR_TEACHING", "LEGITIMATE_CALCULATION_OR_ROUNDING_INSTRUCTION", "LEGITIMATE_OTHER",
  "DUPLICATED_RESPONSE_SCAFFOLD", "RAW_TEMPLATE_OR_SCHEMA_LEAK", "AUTHORIAL_CONSTRAINT_LEAK",
  "CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE", "ANSWER_TELEGRAPHING_OR_ADJUDICATION_NOTE", "ITEM_DESIGN_COMPENSATION",
  "REDUNDANT_META_DISCLAIMER", "BILINGUAL_TERMINAL_DEFECT", "OTHER_CONFIRMED_TERMINAL_DEFECT",
  "AMBIGUOUS_TERMINAL_FUNCTION",
]);
const nextSteps = new Set([
  "NONE", "DELETION_CANDIDATE", "MOVE_OR_RESTATE_IN_RATIONALE", "FULL_ITEM_REVIEW",
  "RENDERER_OR_SCHEMA_PLACEMENT_CHECK", "BILINGUAL_REVIEW", "OWNER_ADJUDICATION",
]);
const counts = (values: string[]) => Object.fromEntries([...new Set(values)].sort().map((value) => [value, values.filter((x) => x === value).length]));

const deliveredIndexCounts = new Map<number, number>();
for (const row of delivered) deliveredIndexCounts.set(row.queueIndex, (deliveredIndexCounts.get(row.queueIndex) ?? 0) + 1);
const missingIndices = queue.filter((row) => !sonnetByIndex.has(row.queueIndex)).map((row) => row.queueIndex);
const duplicateIndices = [...deliveredIndexCounts].filter(([, count]) => count > 1).map(([index]) => index);
const extraIndices = delivered.filter((row) => !queueByIndex.has(row.queueIndex)).map((row) => row.queueIndex);
const outOfOrderIndices = delivered.flatMap((row, index) => index > 0 && row.queueIndex <= delivered[index - 1].queueIndex ? [row.queueIndex] : []);
const identityMismatches: Json[] = [];
for (const row of delivered) {
  const expected = queueByIndex.get(row.queueIndex);
  if (!expected) continue;
  const fields = identityFields.filter((field) => row[field] !== expected[field]);
  if (fields.length) identityMismatches.push({ queueIndex: row.queueIndex, fields });
}
const invalidEnums = delivered.flatMap((row) => {
  const fields: string[] = [];
  if (!verdicts.has(row.verdict)) fields.push("verdict");
  if (!classes.has(row.primaryClass)) fields.push("primaryClass");
  if (!Array.isArray(row.secondaryFlags) || row.secondaryFlags.some((value: string) => !classes.has(value))) fields.push("secondaryFlags");
  if (!nextSteps.has(row.nextStep)) fields.push("nextStep");
  return fields.length ? [{ queueIndex: row.queueIndex, fields }] : [];
});
const missingReasons = delivered.filter((row) => typeof row.reason !== "string" || !row.reason.trim()).map((row) => row.queueIndex);
const missingControls = delivered.filter((row) => {
  const expected = queueByIndex.get(row.queueIndex);
  return expected?.controlSelected && (!row.controlVerdict || !row.controlPrimaryClass || !row.controlReason);
}).map((row) => row.queueIndex);
const evidenceStringIndices = delivered.filter((row) => typeof row.quotedEvidence === "string").map((row) => row.queueIndex);
const evidenceArrayIndices = delivered.filter((row) => Array.isArray(row.quotedEvidence)).map((row) => row.queueIndex);
const otherEvidenceShapeIndices = delivered.filter((row) => typeof row.quotedEvidence !== "string" && !Array.isArray(row.quotedEvidence)).map((row) => row.queueIndex);

const ledger = readFileSync(join(sonnetDir, "batch-ledger.md"), "utf8");
const ledgerRanges = [...ledger.matchAll(/^\|\s*(\d{3})\s*\|\s*(\d+)–(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|/gm)].map((match) => ({
  batch: Number(match[1]), start: Number(match[2]), end: Number(match[3]), input: Number(match[4]), output: Number(match[5]),
}));
const deliveryText = readFileSync(join(sonnetDir, "delivery.md"), "utf8");
const bankPaths = [...new Set(queue.map((row) => row.bankPath))].sort();
const bankHashes = bankPaths.map((bankPath) => {
  const queueHashes = [...new Set(queue.filter((row) => row.bankPath === bankPath).map((row) => row.bankSha256))];
  const live = sha256(readFileSync(join(repo, bankPath)));
  return { bankPath, queueHashes, liveSha256: live, stable: queueHashes.length === 1 && queueHashes[0] === live };
});

const selection = new Map<number, Set<string>>();
const add = (index: number, reason: string) => {
  const reasons = selection.get(index) ?? new Set<string>();
  reasons.add(reason);
  selection.set(index, reasons);
};
for (const row of queue) {
  const sonnet = sonnetByIndex.get(row.queueIndex)!;
  if (sonnet.verdict === "FLAG") add(row.queueIndex, "SONNET_FLAG");
  if (sonnet.verdict === "REVIEW") add(row.queueIndex, "SONNET_REVIEW");
  if (sonnet.controlVerdict === "FLAG" || sonnet.controlVerdict === "REVIEW") add(row.queueIndex, "SONNET_CONTROL_FLAG_OR_REVIEW");
  if (sonnet.nextStep !== "NONE") add(row.queueIndex, "SONNET_NON_NONE_NEXT_STEP");
  if (row.queueIndex >= 2369 && row.queueIndex <= 2673) add(row.queueIndex, "NONCONFORMANT_TAIL");
  if (row.mechanicalSignals?.rawPlaceholderInStem || row.mechanicalSignals?.terminalContainsRawPlaceholder) add(row.queueIndex, "RAW_PLACEHOLDER_SIGNAL");
  if (row.mechanicalSignals?.exactEnglishTerminalRepeatedElsewhereInItem) add(row.queueIndex, "DUPLICATED_RESPONSE_SURFACE_SIGNAL");
  if (row.itemType === "fill_in_blank" && /\{\{[^{}]+\}\}/.test(row.fullStemEn + " " + row.fullStemZh)) add(row.queueIndex, "FILL_IN_BLANK_ORDINARY_STEM_PLACEHOLDER");
  if (row.itemType === "dropdown_cloze" && row.responseContext?.clozeStem && (
    row.fullStemEn.includes(row.responseContext.clozeStem.en) || row.fullStemZh.includes(row.responseContext.clozeStem.zh)
  )) add(row.queueIndex, "DROPDOWN_CLOZE_DUPLICATED_SURFACE");
}

const calibrationIds = new Set([
  "gap_50_mc_03", "gpt_gap_jun11_fib_scabies_precautions_03", "gpt_gap_jun11_fib_lung_cancer_screening_03",
  "opus_bcc_rehab_2026_06_10_04", "gpt_case_clozapine_toxicity_01_q5",
  "opus_case_lithium_toxicity_bowtie", "gemini_jun05_a_cloze_breastfeeding_08", "gemini_jun05_a_cloze_croup_55",
]);
for (const row of queue) if (calibrationIds.has(row.topLevelQuestionId) || calibrationIds.has(row.embeddedQuestionId)) add(row.queueIndex, "CALIBRATION_GATE");

const familyPattern = /this item|this question|本题|near-miss|near miss|excluded from this item|asks only|tests arithmetic only|still tested on the NCLEX|still tested on NCLEX|not a universal|not required to determine|options focus on|options are limited to/i;
for (const row of queue) if (familyPattern.test(row.terminalSentenceEn) || familyPattern.test(row.terminalSentenceZh)) add(row.queueIndex, "KNOWN_MISSED_FAMILY_EXPANSION");

const sampleHash = (row: Json) => sha256(`terminal-independent-checker-2026-07-22|${row.bankPath}|${row.topLevelQuestionId}|${row.embeddedQuestionId ?? ""}|${row.recordKind}`);
const otherwiseUnchecked = queue.filter((row) => row.queueIndex <= 2368 && sonnetByIndex.get(row.queueIndex)?.verdict === "PASS" && !selection.has(row.queueIndex));
const sampleReasons = new Map<number, Set<string>>();
const addSample = (row: Json, reason: string) => {
  const reasons = sampleReasons.get(row.queueIndex) ?? new Set<string>();
  reasons.add(reason);
  sampleReasons.set(row.queueIndex, reasons);
};
for (const row of otherwiseUnchecked) if (parseInt(sampleHash(row).slice(0, 2), 16) % 10 === 0) addSample(row, "GENERAL_MOD10");
const forceFloor = (rows: Json[], floor: number, reason: string) => {
  const sorted = [...rows].sort((a, b) => sampleHash(a).localeCompare(sampleHash(b)));
  const selected = sorted.filter((row) => sampleReasons.has(row.queueIndex)).length;
  for (const row of sorted.filter((row) => !sampleReasons.has(row.queueIndex)).slice(0, Math.max(0, floor - selected))) addSample(row, reason);
};
for (const itemType of [...new Set(otherwiseUnchecked.map((row) => row.itemType))].sort()) forceFloor(otherwiseUnchecked.filter((row) => row.itemType === itemType), 10, "ITEM_TYPE_FLOOR");
forceFloor(otherwiseUnchecked.filter((row) => row.recordKind === "TOP_LEVEL_CASE_CONTAINER"), 10, "CASE_CONTAINER_FLOOR");
forceFloor(otherwiseUnchecked.filter((row) => row.recordKind === "EMBEDDED_SCORED_LEAF"), 20, "EMBEDDED_LEAF_FLOOR");
for (const bankPath of [...new Set(otherwiseUnchecked.map((row) => row.bankPath))].sort()) {
  const rows = otherwiseUnchecked.filter((row) => row.bankPath === bankPath);
  forceFloor(rows, Math.min(10, rows.length), "BANK_FLOOR");
}
for (const row of otherwiseUnchecked) {
  const claudePrefix = row.topLevelQuestionId.startsWith("claude_") || (row.embeddedQuestionId ?? "").startsWith("claude_");
  if (claudePrefix && parseInt(sampleHash(row).slice(0, 2), 16) % 5 === 0) addSample(row, "CLAUDE_PREFIX_MOD5");
}
for (const [index] of sampleReasons) add(index, "DETERMINISTIC_PASS_SAMPLE");

const sampleManifest = [...sampleReasons]
  .sort(([a], [b]) => a - b)
  .map(([index, reasons]) => {
    const row = queueByIndex.get(index)!;
    const sonnet = sonnetByIndex.get(index)!;
    return {
      queueIndex: index, bankPath: row.bankPath, topLevelQuestionId: row.topLevelQuestionId,
      embeddedQuestionId: row.embeddedQuestionId, recordKind: row.recordKind, itemType: row.itemType,
      hash: sampleHash(row), selectionReasons: [...reasons].sort(), sonnetVerdict: sonnet.verdict,
      sonnetPrimaryClass: sonnet.primaryClass, producerConflictStatusKnownBeforeReview: "NONE_KNOWN_FOR_NON_CLAUDE_CHECKER",
    };
  });
const checkerPopulation = [...selection]
  .sort(([a], [b]) => a - b)
  .map(([index, reasons]) => {
    const row = queueByIndex.get(index)!;
    const sonnet = sonnetByIndex.get(index)!;
    return {
      queueIndex: index, bankPath: row.bankPath, topLevelQuestionId: row.topLevelQuestionId,
      embeddedQuestionId: row.embeddedQuestionId, recordKind: row.recordKind, itemType: row.itemType,
      selectionReasons: [...reasons].sort(), sonnetVerdict: sonnet.verdict, sonnetPrimaryClass: sonnet.primaryClass,
    };
  });

const liveBanks = new Map<string, Json>();
const livePopulationIdentity = checkerPopulation.map((populationRow) => {
  const queueRow = queueByIndex.get(populationRow.queueIndex)!;
  let bank = liveBanks.get(queueRow.bankPath);
  if (!bank) {
    bank = JSON.parse(readFileSync(join(repo, queueRow.bankPath), "utf8"));
    liveBanks.set(queueRow.bankPath, bank!);
  }
  const top = bank!.questions.find((question: Json) => question.id === queueRow.topLevelQuestionId);
  const item = queueRow.embeddedQuestionId
    ? top?.itemType === "case_study" ? top.caseStudy.questions.find((question: Json) => question.id === queueRow.embeddedQuestionId) : undefined
    : top;
  return {
    queueIndex: queueRow.queueIndex, bankPath: queueRow.bankPath, topLevelQuestionId: queueRow.topLevelQuestionId,
    embeddedQuestionId: queueRow.embeddedQuestionId,
    liveIdentityPresent: Boolean(item),
    liveStemMatchesQueue: item ? item.stem?.en === queueRow.fullStemEn && item.stem?.zh === queueRow.fullStemZh : false,
  };
});
const missingLivePopulationIdentities = livePopulationIdentity.filter((row) => !row.liveIdentityPresent);
const changedLivePopulationStems = livePopulationIdentity.filter((row) => row.liveIdentityPresent && !row.liveStemMatchesQueue);

const startingStatus = [
  "?? TERMINAL-SENTENCE-CHECKER-PILOT-OPUS-RECOVERY-REVIEW-2026-07-22.md",
  "?? TERMINAL-SENTENCE-CHECKER-PILOT-OWNER-EVALUATION-2026-07-22.md",
  "?? TERMINAL-SENTENCE-CHECKER-PILOT-RESULTS-2026-07-22.md",
  "?? TERMINAL-SENTENCE-INDEPENDENT-CHECKER-PILOT-SPEC-2026-07-22.md",
  "?? TERMINAL-SENTENCE-INDEPENDENT-CHECKER-SALVAGE-SPEC-2026-07-22.md",
  "?? audit/terminal-sentence-independent-checker-pilot-2026-07-22/",
  "?? audit/terminal-sentence-sonnet-review-2026-07-21/",
].join("\n");
const reconciliation = {
  mechanicalStatus: bankHashes.some((entry) => !entry.stable) || missingLivePopulationIdentities.length || changedLivePopulationStems.length
    ? "BLOCKED_CONCURRENT_BANK_CHANGE"
    : missingIndices.length || duplicateIndices.length || extraIndices.length
      ? "BLOCKED_INCOMPLETE_OR_IDENTITY_MISMATCH"
      : "NONCONFORMANT_BUT_ANALYZABLE",
  branch: git("branch", "--show-current"), head: git("rev-parse", "HEAD"), startingChangedPaths: startingStatus.split("\n").filter(Boolean),
  queueCount: queue.length, queueUniqueIndexCount: new Set(queue.map((row) => row.queueIndex)).size,
  sonnetBatchCount: batchFiles.length, sonnetBatchFiles: batchFiles, deliveredRowCount: delivered.length,
  deliveredCoverage: { missingIndices, duplicateIndices, extraIndices, outOfOrderIndices }, identityMismatches,
  invalidEnums, missingReasons, missingControls,
  quotedEvidenceShape: {
    arrayCount: evidenceArrayIndices.length, stringCount: evidenceStringIndices.length, otherCount: otherEvidenceShapeIndices.length,
    stringIndices: evidenceStringIndices, otherIndices: otherEvidenceShapeIndices,
  },
  batchLedgerRanges: ledgerRanges,
  deliveryClaims: {
    completeClaimPresent: deliveryText.includes("SONNET_BATCH_DELIVERY_COMPLETE"),
    noSemanticGeneratorClaimPresent: deliveryText.includes("Semantic generator/classifier script:** none"),
    perBatchPythonBuilderDisclosurePresent: deliveryText.includes("per-batch Python script"),
    inconsistency: "Delivery denies a semantic generator/classifier while disclosing per-batch Python builders that assembled semantic dispositions into JSONL; the salvage spec treats this as nonconformant and unresolved by assumption.",
  },
  bankHashes,
  liveCheckerPopulationIdentity: {
    presentCount: livePopulationIdentity.filter((row) => row.liveIdentityPresent).length,
    missingCount: missingLivePopulationIdentities.length,
    changedStemCount: changedLivePopulationStems.length,
    missing: missingLivePopulationIdentities,
    changedStems: changedLivePopulationStems,
  },
  sonnetCounts: { verdict: counts(delivered.map((row) => row.verdict)), primaryClass: counts(delivered.map((row) => row.primaryClass)) },
  checkerPopulationCount: checkerPopulation.length, sampleCount: sampleManifest.length,
  selectionReasonCounts: counts(checkerPopulation.flatMap((row) => row.selectionReasons)),
};

writeFileSync(join(outputDir, "mechanical-reconciliation.json"), JSON.stringify(reconciliation, null, 2) + "\n");
writeFileSync(join(outputDir, "checker-population.jsonl"), checkerPopulation.map(stableLine).join("\n") + "\n");
writeFileSync(join(outputDir, "sample-manifest.jsonl"), sampleManifest.map(stableLine).join("\n") + "\n");
console.log(JSON.stringify({ mechanicalStatus: reconciliation.mechanicalStatus, checkerPopulationCount: checkerPopulation.length, sampleCount: sampleManifest.length }, null, 2));
