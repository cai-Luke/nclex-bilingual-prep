# Mobile Calculator / Study Action-Clearance R1 Integration Receipt

**Terminal:** `PROJECT_SHRIMP_MOBILE_CALCULATOR_R1_INTEGRATED_PUBLISHED`
**Date:** 2026-09-17

## Integration lineage

- Starting local `main`: `adcbff3baedf61461ba73b14b7d029f8324c8bfc`
- Starting `origin/main`: `adcbff3baedf61461ba73b14b7d029f8324c8bfc`
- Accepted review SHA: `7cdff193f6c7863ba800491c14f60a9629a60d07`
- Integration method: fast-forward only from `adcbff3` to `7cdff19`; no merge, squash, cherry-pick, rebase, force, or production rewrite.
- History publication commit: `149a970` (`docs: publish mobile calculator clearance R1 integration`)
- Final integration-receipt commit: this commit

The accepted sequence remains linear and present: production `3fac6f1`, producer evidence tip `1a2afd7`, and independent acceptance `7cdff19`. The exact producer and independent receipts remain under the accepted review tree.

## Bounded final verification

Run from final production source after the history publication:

| Check | Result |
|---|---|
| `npx tsc -b --pretty false` | PASS |
| `npm run build` | PASS; file-compatible production build generated |
| `git diff --check` | PASS |

Fresh smoke outputs are retained in this directory. The historical Playwright module path recorded by the accepted receipt was unavailable, so the same accepted runners were executed with the available Playwright Core 1.58.2 module; no project dependency or runner source was changed.

| Smoke | Result |
|---|---|
| HTTP calculator runner, ordinary ready-Submit/open-calculator flow and bounded matrix | PASS, 2,263 checks; [results](final2-http/results.json); [log](final2-http.log) |
| `file://` calculator runner, ordinary flow/arithmetic/submit-next/focus-minimize | PASS, 93 checks; [results](final2-file/results.json); [log](final2-file.log) |
| HTTP accepted cloze regression | PASS, 160 checks; [results](final2-cloze-http/results.json); [log](final2-cloze-http.log) |
| `file://` accepted cloze regression | PASS, 5 checks; [results](final2-cloze-file/results.json); [log](final2-cloze-file.log) |

The inherited file-mode manifest diagnostics remain limited to the accepted manifest CORS / paired `net::ERR_FAILED` signature. No new production defect or unrelated failure was observed.

## Scope and limitations carried forward

This integration performed no production repair, rereview, or redesign. The accepted evidence remains authoritative for the typed baseline `OVERLAP` witness, including the 348.4375 × 43.59375 Submit intersection, the repaired ready-Submit clearance, normal Study interaction, desktop/crossover and Preview behavior, focus/lifetime behavior, reduced-height scrolling, and case submission. The accepted evidence also records actual Chrome safe-area inset 0px, a passing simulated 24px inset path, and the remaining limitation that physical nonzero-inset behavior is unverified.

## Owner checkout preservation

Before integration, `main` had zero tracked edits and 16 pre-existing untracked owner/work-order entries. They were not read for content, staged, altered, cleaned, or removed. The new calculator integration evidence and receipt are the only task-owned additions; the unrelated owner material remains preserved and visible in `git status`.

After this receipt is committed, final `main` will contain the accepted review, the separate history publication, and this integration receipt. Calculator R1 is integrated/published and is no longer active implementation scope.
