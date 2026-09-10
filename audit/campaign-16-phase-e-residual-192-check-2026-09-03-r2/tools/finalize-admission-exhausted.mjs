import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  REPO,
  WORK_ORDER,
  WORK_ORDER_SHA,
  out,
  json,
  sha,
  shaBytes,
  pretty,
  write,
  deepEqual,
  git,
} from "./lib.mjs";

const rootRel = "audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2";
const terminal = "CAMPAIGN16_PHASE_E_RESIDUAL_192_BLOCKED_ADMISSION_EXHAUSTED";
const opening = json(`${rootRel}/opening-preservation.json`);
const binding = json(`${rootRel}/input-binding-manifest.json`);
const index = json(`${rootRel}/packet-index.json`);
const manifest = json(`${rootRel}/packet-build-manifest.json`);
const rowMap = json(`${rootRel}/sealed/row-map.json`);
const residual = fs.readFileSync(out("residual-population.jsonl"), "utf8").trim().split(/\r?\n/u).map(JSON.parse);
const residualByPart = new Map(residual.map((row) => [row.partId, row]));

const processFiles = fs.readdirSync(out("raw"))
  .filter((name) => name.endsWith(".process.json"))
  .map((name) => ({ name, receipt: JSON.parse(fs.readFileSync(out(`raw/${name}`), "utf8")) }))
  .sort((a, b) => a.receipt.startedAtUtc.localeCompare(b.receipt.startedAtUtc));

const attempts = processFiles.map(({ receipt }) => {
  const packet = index.packets.find((entry) => entry.packetId === receipt.packetId);
  const validationPath = out(`validation/${receipt.packetId}-attempt-${receipt.attempt}.json`);
  const validation = fs.existsSync(validationPath) ? JSON.parse(fs.readFileSync(validationPath, "utf8")) : null;
  const usage = receipt.semanticMetadata?.usage ?? {};
  const modelUsage = receipt.semanticMetadata?.modelUsage ?? {};
  const modelInferenceOccurred =
    (receipt.semanticMetadata?.durationApiMs ?? 0) > 0 ||
    (usage.input_tokens ?? 0) > 0 ||
    (usage.output_tokens ?? 0) > 0 ||
    Object.keys(modelUsage).length > 0;
  return {
    recordType: "SEMANTIC_DISPATCH_ATTEMPT",
    packetId: receipt.packetId,
    attempt: receipt.attempt,
    sessionId: receipt.semanticMetadata?.sessionId ?? null,
    startedAtUtc: receipt.startedAtUtc,
    endedAtUtc: receipt.endedAtUtc,
    wallTimeSeconds: receipt.wallTimeSeconds,
    packetSha256: receipt.packet.sha256,
    outputSha256: receipt.outputSha256,
    liveRows: packet?.liveRows ?? null,
    parentCases: packet?.parentCases ?? null,
    controls: packet?.controls ?? null,
    stages: packet?.stages ?? null,
    distinctStageTokens: packet?.distinctStageTokens ?? null,
    bytes: packet?.bytes ?? receipt.packet.bytes,
    requestedModel: "opus",
    modelUsage,
    usage,
    totalCostUsd: receipt.semanticMetadata?.totalCostUsd ?? null,
    phaseT: validation?.phaseT?.result ?? null,
    phaseR: validation?.phaseR?.result ?? null,
    controlScores: validation?.controlScores ?? [],
    calibrationVoid: validation?.calibrationVoid ?? null,
    mechanicalRetry: receipt.invocation.mechanicalRetry,
    modelInferenceOccurred,
    terminalReason: receipt.semanticMetadata?.terminalReason ?? null,
    admittedLiveRows: 0,
  };
});
write("cost-ledger.jsonl", `${attempts.map(JSON.stringify).join("\n")}\n`);

const byAttempt = new Map(attempts.map((attempt) => [`${attempt.packetId}:${attempt.attempt}`, attempt]));
const required = [
  "r2-cal-a:1",
  "r2-cal-b:1",
  "r2-cal-a-superseding-1:1",
  "r2-cal-a-superseding-1:2",
  "r2-cal-a-superseding-2:1",
  "r2-cal-a-superseding-2:2",
];
if (required.some((key) => !byAttempt.has(key))) throw new Error("incomplete calibration attempt history");
const finalAttempt = byAttempt.get("r2-cal-a-superseding-2:2");
if (finalAttempt.phaseT !== "PASS" || finalAttempt.phaseR !== "PASS" || finalAttempt.calibrationVoid !== true) {
  throw new Error("final superseding return is not the expected mechanically valid control void");
}
const authAttempt = byAttempt.get("r2-cal-a-superseding-2:1");
if (authAttempt.modelInferenceOccurred || authAttempt.totalCostUsd !== 0 || authAttempt.terminalReason !== "api_error") {
  throw new Error("attempt 1 is not the recorded zero-inference authentication failure");
}

const sharedAttemptHistory = [
  { semanticCycle: 0, packetId: "r2-cal-a", attempt: 1, result: "CONTROL_VOID", phaseT: "PASS", phaseR: "PASS", controlFailure: "POSITIVE_MISS" },
  { semanticCycle: 1, packetId: "r2-cal-a-superseding-1", attempt: 1, result: "MECHANICAL_FAILURE", phaseT: "FAIL", phaseR: "NOT_RUN", errors: json(`${rootRel}/validation/r2-cal-a-superseding-1-attempt-1.json`).phaseT.errors },
  { semanticCycle: 1, packetId: "r2-cal-a-superseding-1", attempt: 2, result: "CONTROL_VOID", phaseT: "PASS", phaseR: "PASS", mechanicalRetry: true, controlFailure: "NEGATIVE_FALSE_POSITIVE" },
  { semanticCycle: 2, packetId: "r2-cal-a-superseding-2", attempt: 1, result: "AUTHENTICATION_FAILURE_BEFORE_INFERENCE", modelInferenceOccurred: false, totalCostUsd: 0 },
  { semanticCycle: 2, packetId: "r2-cal-a-superseding-2", attempt: 2, result: "CONTROL_VOID", phaseT: "PASS", phaseR: "PASS", controlFailure: "NEGATIVE_FALSE_POSITIVE" },
];
const unresolved = rowMap.rows
  .filter((row) => row.packetId === "r2-cal-a-superseding-2" && row.role === "LIVE")
  .map((row) => {
    const source = residualByPart.get(row.questionId);
    if (!source) throw new Error(`missing residual source for ${row.questionId}`);
    return {
      queueIndex: source.queueIndex,
      bankPath: source.bankPath,
      parentCaseId: source.parentCaseId,
      questionId: row.questionId,
      terminalReason: "No control-qualified calibration return after the initial packet and two permitted semantic redispatch cycles.",
      attemptHistory: sharedAttemptHistory,
    };
  })
  .sort((a, b) => a.queueIndex - b.queueIndex);
if (unresolved.length !== 9) throw new Error(`expected 9 unresolved calibration rows, found ${unresolved.length}`);
write("admitted/unresolved-roster.jsonl", `${unresolved.map(JSON.stringify).join("\n")}\n`);

const totalCostUsd = attempts.reduce((sum, attempt) => sum + (attempt.totalCostUsd ?? 0), 0);
const summedWallTimeSeconds = attempts.reduce((sum, attempt) => sum + attempt.wallTimeSeconds, 0);
const inferenceAttempts = attempts.filter((attempt) => attempt.modelInferenceOccurred);
const scoredControls = attempts.flatMap((attempt) => attempt.controlScores);
const controlClassifications = Object.fromEntries(
  ["PASS", "POSITIVE_MISS", "POSITIVE_LOCUS_MISS", "NEGATIVE_FALSE_POSITIVE", "SUBCLASS_ADVISORY"]
    .map((classification) => [classification, scoredControls.filter((score) => score.classification === classification).length]),
);
const status = {
  statusVersion: "4.0",
  status: "BLOCKED_ADMISSION_EXHAUSTED",
  terminal,
  terminalEmitted: true,
  workOrderSha256: sha(WORK_ORDER),
  instrument: "campaign16_phase_e_residual_192_v2",
  reason: "The final permitted CAL-A semantic redispatch was mechanically valid but control-voided by one negative false positive.",
  D_cal: attempts.length,
  D_calAccountingNote: "Conservatively counts all immutable dispatch receipts, including one zero-inference authentication failure.",
  inferenceBearingDispatches: inferenceAttempts.length,
  D_main: 0,
  semanticRedispatchCyclesForCalA: 2,
  totalCostUsd,
  summedSerialWallTimeSeconds: summedWallTimeSeconds,
  finalReturn: {
    packetId: finalAttempt.packetId,
    attempt: finalAttempt.attempt,
    sessionId: finalAttempt.sessionId,
    liveRows: finalAttempt.liveRows,
    parentCases: finalAttempt.parentCases,
    controls: finalAttempt.controls,
    bytes: finalAttempt.bytes,
    stages: finalAttempt.stages,
    distinctStageTokens: finalAttempt.distinctStageTokens,
    wallTimeSeconds: finalAttempt.wallTimeSeconds,
    modelUsage: finalAttempt.modelUsage,
    totalCostUsd: finalAttempt.totalCostUsd,
    phaseT: finalAttempt.phaseT,
    phaseR: finalAttempt.phaseR,
    controlScores: finalAttempt.controlScores,
    calibrationVoid: finalAttempt.calibrationVoid,
  },
  cumulativeControlClassifications: controlClassifications,
  historicalFailureObservations: {
    duplicateStageKeyRows: 0,
    missingOrForeignKeyRows: 1,
    fillerBasisRows: 1,
    otherSlotFillingReflexObserved: true,
    primaryFinding: "No duplicate stage key recurred under v2. The slot-filling reflex did recur once as an empty foreign key with filler basis in r2-cal-a-superseding-1 attempt 1; its bounded retry corrected both defects, and r2-cal-a-superseding-2 attempt 2 was mechanically clean.",
    prohibitedClaimMade: false,
  },
  unresolvedRows: unresolved,
  calibrationReportExists: fs.existsSync(out("calibration-report.json")),
  calibrationReady: false,
  mainPassAuthorized: false,
  mainPassPacketsCreated: false,
};
if (status.calibrationReportExists) throw new Error("calibration-report.json must remain absent on blocked calibration");
write("blocked-evidence.json", pretty(status));
write("partial-progress.json", pretty(status));
write("calibration-status-incomplete.json", pretty({ ...status, note: "Calibration did not qualify; this is not calibration-report.json." }));

const parseStatus = (buffer) => {
  const fields = buffer.toString("utf8").split("\0").filter(Boolean);
  const rows = [];
  for (let i = 0; i < fields.length; i += 1) {
    const state = fields[i].slice(0, 2);
    const filePath = fields[i].slice(3);
    if (state[0] === "R" || state[0] === "C") rows.push({ status: state, path: fields[++i], sourcePath: filePath });
    else rows.push({ status: state, path: filePath });
  }
  return rows;
};
const currentOutside = parseStatus(execFileSync("git", ["status", "--porcelain=v1", "-z", "--untracked-files=all"], { cwd: REPO }))
  .filter((entry) => entry.path !== rootRel && !entry.path.startsWith(`${rootRel}/`));
const openingOutside = opening.openingDirtyPaths.map(({ status: state, path: filePath, sourcePath }) => ({ status: state, path: filePath, ...(sourcePath ? { sourcePath } : {}) }));
const dirtyChecks = opening.openingDirtyPaths.map((entry) => {
  const absolute = path.join(REPO, entry.path);
  const currentHash = fs.existsSync(absolute) && fs.statSync(absolute).isFile() ? shaBytes(fs.readFileSync(absolute)) : null;
  let indexEntry = null;
  if (entry.status !== "??") { try { indexEntry = git(["ls-files", "-s", "--", entry.path]) || null; } catch {} }
  return { path: entry.path, match: currentHash === entry.worktreeSha256 && indexEntry === entry.indexEntry };
});
const boundChecks = binding.boundFiles.map((entry) => ({ path: entry.path, match: entry.type !== "file" || (fs.existsSync(path.join(REPO, entry.path)) && sha(entry.path) === entry.sha256) }));
const bankChecks = opening.banks.map((entry) => ({ path: entry.path, match: sha(entry.path) === entry.expectedSha256 }));
const packetChecks = index.packets.map((entry) => ({
  packetId: entry.packetId,
  bytesMatch: fs.statSync(out(entry.path)).size === entry.bytes,
  sha256Match: shaBytes(fs.readFileSync(out(entry.path))) === entry.sha256,
}));
const outputChecks = attempts.map((attempt) => ({
  packetId: attempt.packetId,
  attempt: attempt.attempt,
  match: shaBytes(fs.readFileSync(out(`outputs/${attempt.packetId}-attempt-${attempt.attempt}.jsonl`))) === attempt.outputSha256,
}));
const lockChecks = fs.readdirSync(out("locks")).filter((name) => name.endsWith(".json")).sort().map((name) => {
  const lock = JSON.parse(fs.readFileSync(out(`locks/${name}`), "utf8"));
  return {
    name,
    packetMatch: shaBytes(fs.readFileSync(out(`packets/${lock.packetId}.json`))) === lock.packetSha256,
    outputMatch: shaBytes(fs.readFileSync(out(`outputs/${lock.packetId}-attempt-${lock.attempt}.jsonl`))) === lock.outputSha256,
    validationMatch: shaBytes(fs.readFileSync(out(`validation/${lock.packetId}-attempt-${lock.attempt}.json`))) === lock.validationSha256,
    reconstructedMatch: shaBytes(fs.readFileSync(out(`reconstructed/${lock.packetId}-attempt-${lock.attempt}.jsonl`))) === lock.reconstructedSha256,
    rowMapMatch: lock.rowMapSha256 == null || shaBytes(fs.readFileSync(out("sealed/row-map.json"))) === lock.rowMapSha256,
  };
});
const noMainArtifacts = ["packets", "outputs", "raw", "locks", "reconstructed", "reconstruction", "validation"]
  .every((directory) => fs.readdirSync(out(directory)).every((name) => !name.includes("main")));
const preservation = {
  preservationVersion: "4.0",
  checkedAtUtc: new Date().toISOString(),
  headOpening: opening.head,
  headCurrent: git(["rev-parse", "HEAD"]),
  branchOpening: opening.branch,
  branchCurrent: git(["branch", "--show-current"]),
  workOrderMatch: sha(WORK_ORDER) === WORK_ORDER_SHA,
  semanticTemplateMatch: shaBytes(fs.readFileSync(out(manifest.template.path))) === manifest.template.sha256,
  statusOutsideOwnedRootExactMatch: deepEqual(currentOutside, openingOutside),
  dirtyChecks,
  boundChecks,
  bankChecks,
  packetChecks,
  outputChecks,
  lockChecks,
  noMainArtifacts,
  calibrationReportAbsent: !fs.existsSync(out("calibration-report.json")),
};
preservation.pass =
  preservation.headCurrent === preservation.headOpening && preservation.branchCurrent === preservation.branchOpening &&
  preservation.workOrderMatch && preservation.semanticTemplateMatch && preservation.statusOutsideOwnedRootExactMatch &&
  [...dirtyChecks, ...boundChecks, ...bankChecks].every((entry) => entry.match) &&
  packetChecks.every((entry) => entry.bytesMatch && entry.sha256Match) && outputChecks.every((entry) => entry.match) &&
  lockChecks.every((entry) => Object.entries(entry).filter(([key]) => key.endsWith("Match")).every(([, value]) => value)) &&
  preservation.noMainArtifacts && preservation.calibrationReportAbsent;
write("preservation-verification.json", pretty(preservation));
write("RESUMPTION-NOTE.md", `# Campaign 16 Phase E Residual-192 R2 — blocked calibration closeout\n\nTerminal: **${terminal}**\n\n- Frozen work-order SHA-256: \`${WORK_ORDER_SHA}\`\n- Final \`r2-cal-a-superseding-2\` semantic return passed every Phase T gate and Phase R assertion, with zero duplicate, missing/foreign-key, or filler-basis rows.\n- All three positive controls and their loci passed. The negative control was returned \`LEAK\`, producing one \`NEGATIVE_FALSE_POSITIVE\` and voiding the packet.\n- This was semantic redispatch cycle 2, the final permitted cycle for the same 9 live rows. Their exact identities and attempt histories are frozen in \`admitted/unresolved-roster.jsonl\`.\n- Conservative dispatch accounting: \`D_cal = ${attempts.length}\`, including one zero-inference authentication receipt; inference-bearing dispatches: ${inferenceAttempts.length}; \`D_main = 0\`; total cost: \`$${totalCostUsd.toFixed(6)}\`.\n- \`calibration-report.json\` and the calibration-ready terminal were not emitted. No main-pass packet was created or dispatched.\n`);

console.log(JSON.stringify({ terminal, unresolvedRows: unresolved.length, D_cal: attempts.length, inferenceBearingDispatches: inferenceAttempts.length, D_main: 0, totalCostUsd, finalPhaseT: finalAttempt.phaseT, finalPhaseR: finalAttempt.phaseR, finalCalibrationVoid: finalAttempt.calibrationVoid, finalControlClassifications: finalAttempt.controlScores.map((score) => score.classification), preservationPass: preservation.pass, calibrationReportExists: false, noMainArtifacts }, null, 2));
if (!preservation.pass) process.exitCode = 1;
