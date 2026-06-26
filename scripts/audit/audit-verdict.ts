import type { AuditResult } from "./types";

export type GateVerdict = {
  exitCode: 0 | 1;
  message: string;
  failedIds: string[];
};

export function isMechanicalBiasEnforced(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.BIAS_GATE_ENFORCE_MECHANICAL === "1";
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
