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
const opening = json(`${rootRel}/opening-preservation.json`);
const binding = json(`${rootRel}/input-binding-manifest.json`);
const index = json(`${rootRel}/packet-index.json`);
const prompt = json(`${rootRel}/packet-build-manifest.json`).template;
const processFiles = fs.readdirSync(out("raw"))
  .filter((name) => name.endsWith(".process.json"))
  .sort((a, b) => {
    const left = JSON.parse(fs.readFileSync(out(`raw/${a}`), "utf8"));
    const right = JSON.parse(fs.readFileSync(out(`raw/${b}`), "utf8"));
    return left.startedAtUtc.localeCompare(right.startedAtUtc);
  });

const attempts = processFiles.map((name) => {
  const processReceipt = JSON.parse(fs.readFileSync(out(`raw/${name}`), "utf8"));
  const item = index.packets.find((entry) => entry.packetId === processReceipt.packetId);
  const validationPath = out(`validation/${processReceipt.packetId}-attempt-${processReceipt.attempt}.json`);
  const validation = fs.existsSync(validationPath)
    ? JSON.parse(fs.readFileSync(validationPath, "utf8"))
    : null;
  const usage = processReceipt.semanticMetadata?.usage ?? {};
  const modelUsage = processReceipt.semanticMetadata?.modelUsage ?? {};
  const modelInferenceOccurred =
    (processReceipt.semanticMetadata?.durationApiMs ?? 0) > 0 ||
    (usage.input_tokens ?? 0) > 0 ||
    (usage.output_tokens ?? 0) > 0 ||
    Object.keys(modelUsage).length > 0;
  return {
    recordType: "SEMANTIC_DISPATCH_ATTEMPT",
    packetId: processReceipt.packetId,
    attempt: processReceipt.attempt,
    sessionId: processReceipt.semanticMetadata?.sessionId ?? null,
    startedAtUtc: processReceipt.startedAtUtc,
    endedAtUtc: processReceipt.endedAtUtc,
    wallTimeSeconds: processReceipt.wallTimeSeconds,
    liveRows: item?.liveRows ?? null,
    parentCases: item?.parentCases ?? null,
    controls: item?.controls ?? null,
    stages: item?.stages ?? null,
    distinctStageTokens: item?.distinctStageTokens ?? null,
    bytes: item?.bytes ?? processReceipt.packet.bytes,
    packetSha256: processReceipt.packet.sha256,
    outputSha256: processReceipt.outputSha256,
    requestedModel: "opus",
    modelUsage,
    usage,
    totalCostUsd: processReceipt.semanticMetadata?.totalCostUsd ?? null,
    phaseT: validation?.phaseT?.result ?? null,
    phaseR: validation?.phaseR?.result ?? null,
    calibrationVoid: validation?.calibrationVoid ?? null,
    mechanicalRetry: processReceipt.invocation.mechanicalRetry,
    modelInferenceOccurred,
    terminalReason: processReceipt.semanticMetadata?.terminalReason ?? null,
    isError: processReceipt.semanticMetadata?.isError ?? null,
    admittedLiveRows: 0,
  };
});
write("cost-ledger.jsonl", `${attempts.map(JSON.stringify).join("\n")}\n`);

const latest = attempts.at(-1);
if (
  latest?.packetId !== "r2-cal-a-superseding-2" ||
  latest.attempt !== 1 ||
  latest.modelInferenceOccurred ||
  latest.totalCostUsd !== 0 ||
  latest.terminalReason !== "api_error"
) {
  throw new Error("latest attempt is not the expected zero-inference authentication failure");
}

const totalCostUsd = attempts.reduce((sum, attempt) => sum + (attempt.totalCostUsd ?? 0), 0);
const semanticAttemptsWithInference = attempts.filter((attempt) => attempt.modelInferenceOccurred).length;
const status = {
  statusVersion: "3.0",
  status: "PAUSED_CLAUDE_AUTHENTICATION_UNAVAILABLE",
  terminalEmitted: false,
  workOrderSha256: sha(WORK_ORDER),
  instrument: "campaign16_phase_e_residual_192_v2",
  D_cal: attempts.length,
  D_calAccountingNote: "Conservatively counts every immutable dispatch receipt, including the zero-inference authentication failure.",
  semanticAttemptsWithInference,
  D_main: 0,
  totalCostUsd,
  calibrationReportExists: fs.existsSync(out("calibration-report.json")),
  mainPassAuthorized: false,
  superseding2: {
    packetId: "r2-cal-a-superseding-2",
    liveRows: index.packets.find((entry) => entry.packetId === "r2-cal-a-superseding-2").liveRows,
    controls: index.packets.find((entry) => entry.packetId === "r2-cal-a-superseding-2").controls,
    parentCases: index.packets.find((entry) => entry.packetId === "r2-cal-a-superseding-2").parentCases,
    stages: index.packets.find((entry) => entry.packetId === "r2-cal-a-superseding-2").stages,
    distinctStageTokens: index.packets.find((entry) => entry.packetId === "r2-cal-a-superseding-2").distinctStageTokens,
    bytes: index.packets.find((entry) => entry.packetId === "r2-cal-a-superseding-2").bytes,
    packetSha256: index.packets.find((entry) => entry.packetId === "r2-cal-a-superseding-2").sha256,
    semanticTemplateSha256: prompt.sha256,
    attempt1: {
      sessionId: latest.sessionId,
      result: "AUTHENTICATION_FAILURE_BEFORE_INFERENCE",
      phaseTHarvestClassification: latest.phaseT,
      phaseR: latest.phaseR,
      modelInferenceOccurred: false,
      inputTokens: latest.usage.input_tokens ?? 0,
      outputTokens: latest.usage.output_tokens ?? 0,
      apiDurationMs: 0,
      totalCostUsd: latest.totalCostUsd,
      terminalReason: latest.terminalReason,
      semanticResultAvailable: false,
    },
  },
  nextSafeStep: {
    prerequisite: "Restore Claude CLI authentication outside this commission, then rerun the full section 11.7 resume gate.",
    action: "Redispatch the same immutable r2-cal-a-superseding-2 packet in a fresh context under a new attempt number, without semantic coaching or prior-output exposure.",
    mechanicalErrorReceipt: null,
  },
  note: "This is not calibration-report.json and does not satisfy the calibration-ready stop.",
};
write("partial-progress.json", pretty(status));
write("calibration-status-incomplete.json", pretty(status));

const parseStatus = (buffer) => {
  const fields = buffer.toString("utf8").split("\0").filter(Boolean);
  const rows = [];
  for (let i = 0; i < fields.length; i += 1) {
    const state = fields[i].slice(0, 2);
    const filePath = fields[i].slice(3);
    if (state[0] === "R" || state[0] === "C") {
      rows.push({ status: state, path: fields[++i], sourcePath: filePath });
    } else {
      rows.push({ status: state, path: filePath });
    }
  }
  return rows;
};
const currentOutside = parseStatus(execFileSync("git", ["status", "--porcelain=v1", "-z", "--untracked-files=all"], { cwd: REPO }))
  .filter((entry) => entry.path !== rootRel && !entry.path.startsWith(`${rootRel}/`));
const openingOutside = opening.openingDirtyPaths.map(({ status: state, path: filePath, sourcePath }) => ({
  status: state,
  path: filePath,
  ...(sourcePath ? { sourcePath } : {}),
}));
const dirtyChecks = opening.openingDirtyPaths.map((entry) => {
  const absolute = path.join(REPO, entry.path);
  const currentHash = fs.existsSync(absolute) && fs.statSync(absolute).isFile()
    ? shaBytes(fs.readFileSync(absolute))
    : null;
  let indexEntry = null;
  if (entry.status !== "??") {
    try { indexEntry = git(["ls-files", "-s", "--", entry.path]) || null; } catch {}
  }
  return { path: entry.path, match: currentHash === entry.worktreeSha256 && indexEntry === entry.indexEntry };
});
const boundChecks = binding.boundFiles.map((entry) => ({
  path: entry.path,
  match: entry.type !== "file" || (fs.existsSync(path.join(REPO, entry.path)) && sha(entry.path) === entry.sha256),
}));
const bankChecks = opening.banks.map((entry) => ({ path: entry.path, match: sha(entry.path) === entry.expectedSha256 }));
const packetChecks = index.packets.map((entry) => {
  const absolute = out(entry.path);
  return {
    packetId: entry.packetId,
    bytesMatch: fs.statSync(absolute).size === entry.bytes,
    sha256Match: shaBytes(fs.readFileSync(absolute)) === entry.sha256,
  };
});
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
    rowMapMatch: shaBytes(fs.readFileSync(out("sealed/row-map.json"))) === lock.rowMapSha256,
  };
});
const preservation = {
  preservationVersion: "3.0",
  checkedAtUtc: new Date().toISOString(),
  headOpening: opening.head,
  headCurrent: git(["rev-parse", "HEAD"]),
  branchOpening: opening.branch,
  branchCurrent: git(["branch", "--show-current"]),
  workOrderMatch: sha(WORK_ORDER) === WORK_ORDER_SHA,
  statusOutsideOwnedRootExactMatch: deepEqual(currentOutside, openingOutside),
  dirtyChecks,
  boundChecks,
  bankChecks,
  packetChecks,
  outputChecks,
  lockChecks,
  noMainPackets: !index.packets.some((entry) => entry.packetId.includes("main")),
};
preservation.pass =
  preservation.headCurrent === preservation.headOpening &&
  preservation.branchCurrent === preservation.branchOpening &&
  preservation.workOrderMatch &&
  preservation.statusOutsideOwnedRootExactMatch &&
  [...dirtyChecks, ...boundChecks, ...bankChecks].every((entry) => entry.match) &&
  packetChecks.every((entry) => entry.bytesMatch && entry.sha256Match) &&
  outputChecks.every((entry) => entry.match) &&
  lockChecks.every((entry) => Object.entries(entry).filter(([key]) => key.endsWith("Match")).every(([, value]) => value)) &&
  preservation.noMainPackets;
write("preservation-verification.json", pretty(preservation));
write("RESUMPTION-NOTE.md", `# Campaign 16 Phase E Residual-192 R2 — authentication pause\n\nStatus: **PAUSED_CLAUDE_AUTHENTICATION_UNAVAILABLE**. No frozen executor terminal is emitted.\n\n- Frozen work-order SHA-256: \`${WORK_ORDER_SHA}\`\n- \`r2-cal-a-superseding-2\` was built with the same 9 live rows, 4 fresh controls, fresh tokens, 9 parent cases, 27 distinct stages, and ${status.superseding2.bytes.toLocaleString("en-US")} serialized bytes.\n- All 37 validator self-tests and the complete synthetic Phase T/Phase R preflight passed before dispatch.\n- Attempt 1 reached the Claude CLI but failed authentication before inference: 0 input tokens, 0 output tokens, 0 API milliseconds, and $0 cost. The harvested text is mechanically invalid and supplies no semantic result.\n- Cumulative recorded dispatch receipts: \`D_cal = ${attempts.length}\`; inference-bearing attempts: \`${semanticAttemptsWithInference}\`; \`D_main = 0\`; cost: \`$${totalCostUsd.toFixed(6)}\`.\n- \`calibration-report.json\` was not emitted, calibration-ready was not reached, and no main-pass packet was created or dispatched.\n\nRestore Claude CLI authentication before resuming. Then rerun the complete §11.7 resume gate and dispatch the same immutable packet to a fresh context under a new attempt number, with no semantic-prompt change, coaching, or prior-output exposure.\n`);

console.log(JSON.stringify({
  status: status.status,
  D_cal: status.D_cal,
  semanticAttemptsWithInference,
  totalCostUsd,
  preservationPass: preservation.pass,
  calibrationReportExists: status.calibrationReportExists,
  noMainPackets: preservation.noMainPackets,
}, null, 2));
if (!preservation.pass) process.exitCode = 1;
