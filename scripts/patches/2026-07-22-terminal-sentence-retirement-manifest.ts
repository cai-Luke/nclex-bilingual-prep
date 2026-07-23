export const RETIRE_IDS = [
  "claude_moc_deleg_matrix_08",
] as const;

export const QUARANTINE_FIX_IDS = [] as const;
export const REMOVAL_IDS = [...RETIRE_IDS, ...QUARANTINE_FIX_IDS] as const;

if (
  RETIRE_IDS.length !== 1
  || QUARANTINE_FIX_IDS.length !== 0
  || new Set(REMOVAL_IDS).size !== 1
) {
  throw new Error("Terminal-sentence retirement manifest reconciliation failed");
}
