# Verification continuation — stopped on pre-existing survey drift

The continuation order authorized remaining verification and strictly in-scope corrections. Entry checks found no implementation or preservation drift. No source, test, schema-document, or bank edits were made during this continuation.

Passed in the required sequence:

- `npm run test:schema-bank`
- `TMPDIR=/tmp/ npm run test:audit-stage-refs`
- `npm run test:raw-gate`
- `npm run test:exam-layout`
- `npm run test:review-prompt`

`npm run test:single-row-lab-panels` then failed (exit 1) at its existing saved-manifest equality assertion, `scripts/tests/single-row-lab-panels.ts:217`. The saved artifact is `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json`, outside the R2 authorized mutation surface and protected as an unrelated opening path.

## Diagnosis

There are 40 differing field values between the computed survey and the saved manifest. They concern existing content represented in the survey. No semantic adjudication or bank correction was attempted.

A read-only diagnostic reconstructed the original generator, schema, and allowed-key module bytes from Git only after verifying each SHA-256 against the original opening manifest. It ran them against the unchanged opening bank bytes. The resulting survey is byte-identical to the current implementation's survey. Both differ from the saved manifest:

- Opening/current computed survey SHA-256: `6e4a5cc93a4f943f75d91fc1707bad44abf5ebd376e843ee5dc21d9072f398dc`
- Saved manifest SHA-256: `f042bd39094e543ab30d6a6dd87081b1ebdead6d7182fa07711ebb53d0552942`

This proves pre-existing drift rather than a typed-baseline output regression. See `opening-survey-drift-proof.json` and `survey-drift-diagnostic.json`.

## Scope and stopping condition

Refreshing the saved survey artifact would mutate a protected unrelated path outside R2. Changing live banks is forbidden. Weakening or bypassing the required equality assertion is not an in-scope correction. The producer therefore stopped under §S and continuation §3 without performing any of those actions.

The remaining mandatory suites, dedicated-suite reruns, final full verification path, production build identity, and externally witnessed production file smoke remain pending. No build was performed and no smoke witness is requested for an unfinished build. The new survey typed-object assertion occurs after the failed equality assertion and was not reached by this run.

## Preservation and disposition

The original opening-state.json remains unchanged. Protected opening paths, all 16 bank-tree files, branch/HEAD, and stopped implementation source hashes still match. No unauthorized untracked files were created. Historical stopped receipts remain preserved under `historical-stopped-*`; test-results.json retains earlier failures and subsequent successes.

Architect/owner disposition is needed for the pre-existing survey-manifest mismatch before this commission can satisfy its mandatory verification. No readiness, acceptance, commit, push, merge, deployment, or bank publication is claimed.
