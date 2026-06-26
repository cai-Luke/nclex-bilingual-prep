export type CheckStatus = "PASS" | "FAIL" | "INSUFFICIENT" | "WARN";

export type AuditResult = {
  /** Canonical check name (matches npm run script name) */
  name: string;
  status: CheckStatus;
  /** Item IDs (or file basenames for structural checks) that triggered failures */
  failures: string[];
  /** Human-readable summary shown in the aggregate report */
  detail: string;
};
