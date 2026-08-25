# Gemini P27 Calibration Package — V2 Correction Work Order

**Date:** 2026-08-25  
**Seat:** Codex  
**Role:** deterministic package-correction operator only  
**Judgment authority:** none  

## 0. Purpose

Correct two mechanical/provenance defects found in the external Gemini P27 calibration input package produced under `GEMINI-P27-CALIBRATION-PACKAGE-CODEX-WORK-ORDER-2026-08-25.md`.

The original package is evidence and MUST remain byte-unchanged:

`/Users/holemini/Desktop/gemini-p27-calibration-input-2026-08-25/`

Create a corrected sibling package instead:

`/Users/holemini/Desktop/gemini-p27-calibration-input-2026-08-25-v2/`

Do not modify the live `Project Shrimp` repository except for no writes at all under this correction commission. Do not modify or delete Gemini Run 1 artifacts.

## 1. Defects to correct

### Defect A — global pair numbering is false in the package

The package receipt / Module A verification claims the 46 pair rows have complete unique global `pairNumber` values 1 through 46.

Actual package bytes do not satisfy that claim:
- historical Part A rows use local numbers 1–31;
- historical Part B rows restart at local numbers 1–15;
- both `module-a/pair-scope.json` and `module-a/pairs.jsonl` therefore contain duplicate `pairNumber` values rather than a global 1–46 sequence.

The P27 requalification work order requires exactly 46 output rows with globally sequential pair numbers 1–46.

**Required correction:**
- Preserve historical/local numbering explicitly as metadata.
- In both `module-a/pair-scope.json` and `module-a/pairs.jsonl`:
  - set global `pairNumber` to 1–46 in file/scope order;
  - add `part` with value `A` or `B`;
  - add `partPairNumber` preserving the historical local numbering (Part A 1–31, Part B 1–15).
- The first 31 rows map global 1–31 to Part A local 1–31.
- The final 15 rows map global 32–46 to Part B local 1–15.
- Do not change item IDs, item JSON values, source-bank metadata, snapshot SHA, or parent-case context values.

### Defect B — unique scoped-item count is internally contradictory

The top-level package receipt reports 68 unique scoped IDs. `module-a/snapshot-proof.md` reports 63 unique IDs for the same 46-pair scope.

Controller re-derivation from the exact 46 endpoint pairs confirms:

**68 unique pair-end item IDs**

This is the metric to state. The `63` claim is erroneous.

**Required correction:**
- Independently recompute the unique set from all `itemAId` + `itemBId` values in the v2 scope.
- Require exactly 68 unique pair-end item IDs.
- Update `snapshot-proof.md`, `package-verification.md`, and `PACKAGE-RECEIPT.md` so the metric is defined consistently as **unique pair-end item IDs**.
- Do not mix parent case-container IDs into this metric. If parent-container counts are reported at all, label them separately and unambiguously.

## 2. V2 construction rule

Build v2 by copying the v1 package to the new sibling directory, then changing only the minimum package metadata necessary to correct Defects A and B plus all dependent checksum/receipt fields.

The following substantive inputs must remain value-identical to v1:
- every historical item object;
- every parent-case context object;
- snapshot commit `59664cacfe4cfbd43d212f84c5d164a09557c958`;
- historical Gemini cross-product spec;
- all Module B historical snapshot/export inputs;
- Campaign 14 work order;
- Module B reservations;
- Module B `MODULE_B_SUPPLEMENT_NOT_RECOVERED` state.

Do NOT resume the Batch 13 search in this correction pass. Do NOT synthesize or reconstruct the missing supplement.

## 3. Required verification

Before issuing the v2 receipt, mechanically prove:

1. `module-a/pair-scope.json` parses and has exactly 46 rows.
2. `module-a/pairs.jsonl` parses and has exactly 46 rows.
3. In each artifact, global `pairNumber` is exactly `[1, 2, ..., 46]` with no duplicate or missing value.
4. Rows 1–31 have `part: "A"` and `partPairNumber` 1–31.
5. Rows 32–46 have `part: "B"` and `partPairNumber` 1–15.
6. Corresponding rows in `pair-scope.json` and `pairs.jsonl` have identical global/local pair identity metadata and identical item IDs.
7. Union of all `itemAId` and `itemBId` values is exactly 68 unique pair-end item IDs.
8. Every one of those 68 pair-end IDs remains sourced from historical Git tree `59664cacfe4cfbd43d212f84c5d164a09557c958` and remains mechanically equal to the prior packaged item value.
9. All packaged parent-context values remain mechanically equal to v1.
10. Module B files other than dependent top-level checksum/receipt metadata are byte-identical to v1.
11. No prohibited held-out answer/result artifact is present.
12. No symlink is present.
13. The live Project Shrimp repository and Gemini Run 1 artifacts were not modified.

Do not claim any mechanical invariant that was not actually tested.

## 4. Hashes and provenance

Recompute SHA-256 for all v2 package artifacts affected by the correction and update the v2 manifest/receipt accordingly.

Record:
- v1 package path and original receipt SHA-256 if independently verified;
- v2 package path;
- v2 receipt SHA-256;
- exact files that differ between v1 and v2;
- statement that differences are limited to pair-identity metadata, corrected count prose, and dependent checksums/receipt metadata.

Do not silently overwrite old hashes.

## 5. Prohibited work

Do not:
- inspect historical Gemini findings/manifests;
- inspect Phase B merged adjudication or architect quality handoff content;
- inspect Campaign 14 Codex preflight result/report, cleared/blocked roster, packet plan, later packet outputs, promotion receipts, or ledger outcome;
- perform clinical review;
- make a P27 requalification judgment;
- change learner-facing question content;
- continue searching for the missing Batch 13 supplement;
- modify the v1 package;
- modify the live repo.

## 6. Terminal outcomes

On full success, return exactly:

`GEMINI_P27_CALIBRATION_PACKAGE_V2_READY`

If any substantive historical item/parent input would need to change to satisfy verification, stop and return:

`GEMINI_P27_CALIBRATION_PACKAGE_V2_BLOCKED`

If v1 cannot be preserved byte-unchanged, stop and return:

`GEMINI_P27_CALIBRATION_PACKAGE_V1_PRESERVATION_FAILED`

The receipt must remain factual and must not contain a P27 qualification verdict.
