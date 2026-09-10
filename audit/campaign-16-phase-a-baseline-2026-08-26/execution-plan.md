# Campaign 16 Phase A Execution Plan

Mutable executor-owned plan. The immutable governing work order remains
`scratch/CAMPAIGN-16-QUALITY-CLOSEOUT-CHARTER-2026-08-26.md`.

1. Verify the charter SHA-256 and read the authorized boundary in the mandated order.
2. Record the A.0 repository identity and full dirty-path list; stop if any bank is dirty.
3. Run A.1 census generation, extract every requested measurement, calculate scored leaves, and run `census:check`.
4. Run A.2 as a parsed Node walk across every file in `banks/`, emitting a per-ID result and stopping on any presence.
5. Run A.3 with Trap 4 mitigation 1: validate every bundled bank first, independently enumerate successfully parsed and validated inputs, then capture non-strict and strict audit output without aborting on the expected strict exit 1.
6. Run A.4 through a narrow TypeScript measurement script that imports only `derivePopulation`, `stableJson`, and `sha256`, loads current and frozen bank payloads independently, resolves every target by ID, and emits all roster/hash/drift evidence.
7. Run A.5 with a raw-byte SHA-256 command over the independently enumerated 13 bundled bank files.
8. Write `baseline.md` and `baseline.json`, validate their internal agreement, inspect the complete worktree diff, and terminate with the charter's exact status token.

## Stop conditions

- Charter digest mismatch.
- Any dirty bank path at A.0.
- Any quarantined FIX ID found at A.2.
- Any mechanical failure that prevents a structurally complete required measurement.
- Any need to mutate a bank or begin Phase B–F.

