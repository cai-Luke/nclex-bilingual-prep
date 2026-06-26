import type { AuditResult } from "./types";

export type GateVerdict = {
  exitCode: 0 | 1;
  message: string;
  failedIds: string[];
};

// Enforce-by-default (Phase 2, 2026-06-26): the mechanical non-MCQ bias axis blocks in
// CI audit, local `npm run audit`, and local `npm run promote` unless explicitly opted
// out for a diagnostic observe-only run via BIAS_GATE_ENFORCE_MECHANICAL=0. The
// mechanical axis only FAILs on a genuine post-shuffle positional tell (a normalization
// bypass), so there is no legitimate silent-pass case other than diagnostics.
export function isMechanicalBiasEnforced(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.BIAS_GATE_ENFORCE_MECHANICAL !== "0";
}

export function gateVerdict(allResults: AuditResult[], blockingResults: AuditResult[]): GateVerdict {
  const anyFailed = blockingResults.some((result) => result.status === "FAIL");
  const failedIds = [...new Set(blockingResults.flatMap((result) => result.failures))];

  if (anyFailed) {
    const failedCheckCount = blockingResults.filter((result) => result.status === "FAIL").length;
    return {
      exitCode: 1,
      failedIds,
      message: `GATE FAILED — ${failedIds.length} item(s) across ${failedCheckCount} check(s).`,
    };
  }

  const someWarn = allResults.some((result) => result.status === "WARN");
  const someInsufficient = allResults.some((result) => result.status === "INSUFFICIENT");

  if (someWarn) {
    return {
      exitCode: 0,
      failedIds: [],
      message: "GATE PASSED (warnings present).",
    };
  }

  if (someInsufficient) {
    return {
      exitCode: 0,
      failedIds: [],
      message: "GATE PASSED (some checks INSUFFICIENT — bank may be too small for full analysis).",
    };
  }

  return {
    exitCode: 0,
    failedIds: [],
    message: "GATE PASSED — clean.",
  };
}
