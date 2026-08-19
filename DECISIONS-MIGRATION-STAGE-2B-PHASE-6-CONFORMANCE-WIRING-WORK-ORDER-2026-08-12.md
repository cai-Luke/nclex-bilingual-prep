# Stage 2b Phase 6 — permanent conformance wiring work order

**Date:** 2026-08-12 · **Seat:** Architect · **Revision:** 7
**Status:** DRAFT — not authorized until the owner hash-freezes this file and issues a handoff.
**Branch:** `codex/decisions-migration`
**Implementation producer:** Codex. The architect seat authored this order and neither implements nor executes it.

---

## 1. Scope

This order commissions **Phase 6 only**: commission §5.8, permanent conformance wiring.

It authorizes no part of commission §6 (post-migration reference-graph artifact), §7.1 (final verification),
or §8. It authorizes no change to `DECISIONS.md`, to the normalized archive, to the preservation snapshot,
to the ratified manifest, to `lib/decisions-format.ts`, to `scripts/decisions-format-conform.ts`, to either
reconciliation checker, or to any migration receipt already on disk.

Phase 6 is the last phase before repository conformance can be accepted. It installs the gate whose later
successful repository-conformance acceptance will close Amendment 1's rebinding window. Phase 6 does not
close that window itself — this phase expressly refuses to accept repository conformance — and §§8–9 below
exist to keep the window governed during the interval.

---

## 2. Governing authorities

| authority | bearing on this phase |
|---|---|
| `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md` §5.8 | the operative requirement: wire both fixture regressions and live repository conformance into the PR gate |
| Commission §5.2 items 7 and 12 | the only paths this phase may write |
| `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md` Clause A §1.2 | E038's `Evidence` may point at the normalized archive before it exists, but the archive must be created **and tracked** before repository conformance is accepted |
| Amendment 1 Clause B §2.2 | `MIGRATION_DATE` is a verification predicate on the Stage 2b content commit's `America/New_York` author date; rebinding is permitted until repository conformance is accepted |
| `DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md` | the manifest's ratification record |
| `DECISIONS-MIGRATION-STAGE-2B-PHASE-5-CLOSEOUT-2026-08-11.md` | Phase 5 `ACCEPT`; authorizes commissioning this phase |

**Do not read the manifest's own first line as its status.** `audit/decisions-migration-2026-07-29/target-text-manifest.md`
opens with a construction-era header reading `CANDIDATE, NOT RATIFIED`. That header is a preserved artifact of
the drafting period. Ratification lives in the separate record named above, because ratified documents are
never edited. The manifest is ratified. Cite the ratification record, never the header.

---

## 3. Reconnaissance — live state, measured by the architect seat on 2026-08-12

Recorded so the implementing seat can detect drift rather than rediscover the ground state. Every row below
was read from live disk in this seat's own session. Re-measure each before acting; a mismatch is a stop.

| item | measured state |
|---|---|
| Branch | `codex/decisions-migration` |
| Modified tracked paths | exactly four: `DECISIONS.md`, `lib/decisions-format.ts`, `package.json`, `scripts/tests/decisions-format.ts` |
| Staged paths | none |
| `.github/workflows/promotion-gate.yml` PR steps | eleven: checkout, setup-node, `npm ci`, `test-visuals`, `audit`, `test:validate-sweep`, `test:non-mcq-bias`, `test:schema-bank`, the three-command structured-measurement block, `test:coverage-report`, `census:check` |
| DECISIONS grammar in the gate | **absent.** No gate step runs `test:decisions-format`, and `scripts/audit.ts` contains no `decisions-format` reference, so there is no transitive coverage either |
| `test:decisions-format` | exists in `package.json`, maps to `scripts/tests/decisions-format.ts` |
| `scripts/decisions-format-conform.ts` | **exists, tracked, unmodified.** Absent from both the modified set and the untracked set |
| repository conformance package command | **absent.** No `package.json` script invokes `scripts/decisions-format-conform.ts`; its only current caller is the fixture suite's CLI test |
| `Archive/DECISIONS-ARCHIVE-2026-08-18.md` | present at `13997` bytes / SHA-256 `e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c`, **untracked** |
| `DECISIONS.md` | tracked and modified, `56964` bytes / SHA-256 `3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8` |
| M0.1 normalized-archive pin | `Archive/DECISIONS-ARCHIVE-2026-08-18.md` |
| `MIGRATION_DATE` | `2026-08-18`, bound by owner act 2026-08-06 |

Both §5.8 requirements are therefore unmet in CI today, and both are satisfiable without authoring new
TypeScript. This phase is wiring, not implementation.

---

## 4. Write allowlist

Exactly two **persistent paths inside the Project Shrimp repository** may change:

1. `package.json` — one added script key, defined in §5. No other key, value, dependency, or formatting change.
2. `.github/workflows/promotion-gate.yml` — one added step, defined in §6. No other step, name, ordering, runner, Node version, or cache change.

One receipt is created:

3. `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-6-CONFORMANCE-WIRING-REPORT-2026-08-12.md`

Any other persistent repository path is a stop. `package.json` was read-only under the Phase 5 order; that
restriction was phase-scoped and is lifted here by commission §5.2 item 12 and §5.8. It does not become
generally writable — only the single key below is authorized.

**This allowlist governs the Project Shrimp worktree only.** Temporary files and directories outside the
repository are permitted scratch, are not Phase 6 outputs, and are not measured as such. Two such uses are
required by this order:

- the `/tmp` locality-baseline copies mandated by §10 steps 1, 4, and 5;
- the temporary fixture repository that `npm run test:decisions-format` creates for itself. Live
  `scripts/tests/decisions-format.ts` calls `mkdtemp` under the system temp directory, writes fixture files
  there, and runs `git init -q` and `git add -- tracked-owner.ts` inside that disposable repository in order
  to exercise the tracked-path predicate. That behavior is **mandated** by this order and is not a violation
  of it.

No scratch file may ever be copied into the Project Shrimp repository except through the two authorized
repository writes above.

---

## 5. The package command

Add exactly one key to `scripts` in `package.json`:

```json
"conform:decisions": "tsx scripts/decisions-format-conform.ts --root . --decisions DECISIONS.md --archive Archive/DECISIONS-ARCHIVE-2026-08-18.md"
```

Constraints:

- Insert it immediately after the existing `reconcile:decisions-migration-target` key, preserving the file's
  existing two-space indentation and key ordering conventions.
- `test:decisions-format` is **retained unchanged**, satisfying §5.8's preference for the already-existing
  fixture command. Do not rename, merge, or re-point it.
- The `--archive` argument names the normalized migration archive only. **Do not pass
  `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md`**; §5.8 expressly forbids validating the preservation
  snapshot as an archive wrapper document, and doing so would also violate commission §5.4.
- The archive path is written as a literal. **Do not introduce globbing, environment-variable interpolation,
  date computation, directory scanning, or any other dynamic path mechanism.** A dynamic mechanism would let a
  rebinding pass silently, which is the specific failure §7 exists to prevent.
- `--root .` is required by the CLI and supplies the `git ls-files` root from which tracked-path validation is
  computed.

Record the `package.json` byte length before and after, and the exact added line, in the receipt.

---

## 6. The workflow edit

Append exactly one step to the end of the `gate` job's `steps` list in
`.github/workflows/promotion-gate.yml`, immediately after the existing `Check census drift` step:

```yaml
      - name: Test DECISIONS format and repository conformance
        run: |
          npm run test:decisions-format
          npm run conform:decisions
```

Constraints:

- The step runs both §5.8 requirements in order: parser/fixture regressions first, then live
  `DECISIONS.md` + normalized archive conformance with tracked-path validation.
- The block-scalar form is required so both commands run as gate-blocking steps under one name.
- **No grammar logic may be duplicated in YAML.** The workflow names commands and nothing else. No `if:`
  guard, no `continue-on-error`, no path filter, no matrix, no conditional skip.
- Do not reorder, rename, or modify any existing step. Do not change `node-version: 22` or the cache setting.

Record the workflow byte length before and after, and the exact added lines, in the receipt.

---

## 7. Archive-path pin — fail closed on disagreement

This check runs twice, and its second operand differs between the two runs, because the `conform:decisions`
command does not exist until step 4. In both runs, read the normalized-archive filename pinned at manifest
`M0.1` from `audit/decisions-migration-2026-07-29/target-text-manifest.md`, from the table row labelled
`Normalized migration archive filename`.

**Pre-edit, before step 4.** Compare byte-for-byte:

1. the M0.1 pin;
2. the `--archive` literal prescribed by §5 of this order;
3. the filename of the archive actually present on disk.

**Post-edit, after step 5.** Compare byte-for-byte:

1. the M0.1 pin;
2. the `--archive` argument as actually written into the `conform:decisions` key in `package.json`;
3. the filename of the archive actually present on disk.

All three must be identical. Any disagreement among them is **stop condition 1** — do not "correct" either
side, do not choose the one that looks newer, and do not proceed with a mismatch recorded as a note. Return
to the architect seat.

This check is the whole reason the path is a literal. A dynamic mechanism would make the three agree by
construction and prove nothing.

---

## 8. Lifecycle condition — a rebinding invalidates this phase's conformance result

Amendment 1 Clause B permits rebinding `MIGRATION_DATE` until repository conformance is accepted, and Clause A
requires any change to the manifest-pinned archive filename or date to return to Stage 2a for owner
ratification.

Accordingly, this condition is binding and must be reproduced verbatim in the receipt:

> Any `MIGRATION_DATE` rebinding, or any manifest supersession affecting the M0.1 normalized-archive
> filename, occurring before repository conformance is accepted, **invalidates the Phase 6 conformance
> result**. The result does not become valid again until the `conform:decisions` command in `package.json` is
> updated to the new M0.1 filename under whatever authority then governs, and all of the following are
> reproduced against the new pin: three-way pin equality per §7; the fixture regression command; the live
> conformance command, with the expected result appropriate to the archive's trackedness at that time; both
> reconciliation commands; the TypeScript build check; and byte identity of the protected surfaces enumerated
> in §10 step 11, measured between the opening and closing state of that revalidation run itself. Protected-
> surface byte identity after a rebinding never means equality to the pre-rebinding Phase 6 digests: an
> authorized rebinding necessarily changes the ratified manifest, the migrated `DECISIONS.md`, the
> date-dependent archive surfaces, and the package command's archive argument. That is a verification set,
> not a re-execution of §10 — §10 contains one-time wiring and receipt steps that cannot be performed twice.
> A rebinding is never reconciled by editing the archive filename alone, and never by editing the package
> command alone.

This is a standing property of the wiring, not a one-time execution step. A later seat that rebinds the date
and reruns only the reconciliation checkers has not discharged it.

---

## 9. The tracked-path boundary, and what Phase 6 may not accept

This is the structural constraint that bounds this phase, and it must be understood before execution rather
than discovered during it.

`scripts/decisions-format-conform.ts` populates `trackedPaths` from `git ls-files` and passes it to
`checkDecisionsFormat`, which raises code `UNTRACKED_PATH` with message `<field> path is not tracked: <path>`
for any `Evidence` or `Owner` value not in that set.

`Archive/DECISIONS-ARCHIVE-2026-08-18.md` is **currently untracked**, and E038's `Evidence` field points at it
under the Clause A exception. Therefore `npm run conform:decisions` **cannot exit 0 today**, and is not
expected to. It becomes capable of exiting 0 only once a later authorized seat tracks the archive.
Under this order's no-staging constraint that cannot happen here; it normally happens through the Stage 2b
content commit that tracks the migrated `DECISIONS.md` and the normalized archive. That commit's
`America/New_York` author date does **not** bind `MIGRATION_DATE`. Amendment 1 Clause B makes the author date
a verification predicate, not a derivation: the owner act binds the candidate date, and the eventual commit's
author date must satisfy that binding, or the date is rebound under Clause B.

Phase 6 therefore stops short of accepting repository conformance. Its executable claim is that the wiring is
correct and that the **only** remaining obstacle is the not-yet-made content commit.

**Predicted result of the live run, which is evidence rather than failure:**

- `npm run test:decisions-format` exits `0`.
- `npm run conform:decisions` exits `1`.
- Its output contains **exactly one** finding.
- That finding's code is `UNTRACKED_PATH`.
- Its message is `Evidence path is not tracked: Archive/DECISIONS-ARCHIVE-2026-08-18.md`.
- Its `block=` attribution is exactly `Producer assignments are operational state, not constitutional text` —
  E038's target-grammar block key, confirmed live at `DECISIONS.md:792` with its `Evidence` field at line 802.

Record the finding verbatim, including the rendered `[FAIL]` line exactly as emitted.

**This prediction is scoped to this pre-content-commit execution and is not a permanent expected result.** It
holds only while the normalized archive is untracked. Once a later authorized seat legitimately tracks the
archive, the correct result of `conform:decisions` is exit `0`, and an acceptance run that still reports
`UNTRACKED_PATH` at that point is a failure rather than a confirmation.

**Any departure from that prediction is a stop**, in either direction:

- more than one finding;
- any finding whose code is not `UNTRACKED_PATH`;
- any `UNTRACKED_PATH` finding naming a path other than the normalized archive;
- exit `0` — which would mean tracked-path validation is not actually running, and the wiring proves nothing.

That last case matters most. An unexpected pass here is a worse outcome than the predicted fail, because it
would mean the gate step is inert. Do not treat it as good news.

---

## 10. Execution steps

Perform in order. Stop at the first divergence; do not continue to "gather more information."

1. Record opening state: branch, HEAD, `git status --porcelain=v1 --untracked-files=all` full path/status set,
   and SHA-256 for `package.json`, `.github/workflows/promotion-gate.yml`, `DECISIONS.md`,
   `Archive/DECISIONS-ARCHIVE-2026-08-18.md`, `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md`,
   `scripts/decisions-format-conform.ts`, `scripts/tests/decisions-format.ts`,
   `scripts/decisions-migration-target-reconcile.ts`, `lib/decisions-format.ts`, and the ratified manifest.
   Every load-bearing surface in that set is measured by digest. For the already-modified or untracked
   subset a digest is indispensable rather than merely tidy, because status cannot detect in-place mutation:
   `scripts/tests/decisions-format.ts` is already `M` and is the file step 6 executes;
   `scripts/decisions-migration-target-reconcile.ts` is already `??` at `47448` bytes and is the checker step
   9 executes; the preservation snapshot, the normalized archive, and the ratified manifest are already `??`.
   `.github/workflows/promotion-gate.yml` and `scripts/decisions-format-conform.ts` are by contrast currently
   clean tracked paths, digested for uniformity of evidence rather than because status would miss a change to
   them. Then copy `package.json` and `.github/workflows/promotion-gate.yml` byte-identically to a scratch
   location outside the repository, under `/tmp`, and record each copy's SHA-256 as equal to its in-repo
   opening digest. Those copies are the locality baseline for steps 4 and 5. Never copy a scratch file back
   into the repository. Use `--untracked-files=all`; the default
   `git status --porcelain` collapses wholly-untracked directories and must not be used as preservation
   evidence.
2. Perform the §7 **pre-edit** three-way pin comparison. Stop on any disagreement.
3. Run `npm run test:decisions-format` against the unmodified tree and record exit code and output. It must
   exit `0` before any edit; a pre-existing failure is a stop.
4. Apply the §5 `package.json` edit. Re-read the file and confirm it parses as JSON and that exactly one key
   was added. Then prove edit locality against the step 1 scratch copy: reconstruct the expected post-edit
   bytes by inserting exactly the §5 line into the preserved opening copy at the prescribed position, and
   compare that reconstruction byte-for-byte against the live file. They must be identical. The JSON parse
   and the key count are semantic checks and are **not sufficient on their own** — `package.json` is already
   `M` before this phase, so neither they nor closing status can distinguish the authorized line from an
   unrelated in-place change to surrounding bytes.
5. Apply the §6 workflow edit. Re-read the file and confirm the YAML is well-formed and that exactly one step
   was added. Then prove edit locality the same way: reconstruct the expected post-edit bytes from the
   preserved opening copy plus exactly the §6 block, and compare byte-for-byte against the live file.
6. Run `npm run test:decisions-format`. Record exit code and output. Must exit `0`.
7. Run `npm run conform:decisions`. Record exit code and complete output verbatim. Compare against the §9
   prediction. Stop on any departure.
8. Perform the §7 **post-edit** three-way pin comparison against the now-written command.
9. Run `npm run reconcile:decisions-migration` and `npm run reconcile:decisions-migration-target`. Both must
   still exit `0`; this phase must not disturb Phase 5's accepted state.
10. Run `npx tsc -b --pretty false` and record the result.
11. Record closing state exactly as in step 1, and compare both directions. Two distinct claims are required
    and must not be conflated. **First**, the full `--untracked-files=all` path/status set is compared
    bidirectionally; among paths that existed at step 1, only `package.json` and the workflow may differ.
    **Second**, each protected surface enumerated in step 1 — `DECISIONS.md`, the normalized archive, the
    preservation snapshot, the ratified manifest, `lib/decisions-format.ts`,
    `scripts/decisions-format-conform.ts`, `scripts/tests/decisions-format.ts`, and
    `scripts/decisions-migration-target-reconcile.ts` — is proved byte-identical to its opening digest. Byte
    identity is claimed **only** for those enumerated surfaces. Do not report or imply that every pre-existing
    dirty or untracked path was byte-compared; the status set alone cannot support that claim.
12. Stage nothing, commit nothing, and push nothing **in the Project Shrimp repository**: its index and its
    branch and ref state remain untouched. The worktree is necessarily touched — the two mutations authorized
    by §§4–6 are worktree edits, and the worktree is already dirty at opening — but no other worktree change
    is permitted. This does not reach staging performed by the fixture suite inside its own disposable
    temporary repository, which steps 3 and 6 mandate.
13. Only now write the §11 receipt. It is the single path this order authorizes to come into existence after
    the closing measurement, and it is therefore not an unexpected difference under step 11. Do not write it,
    or any draft or partial of it, before step 11 is complete: a receipt present at closing-measurement time
    would fail step 11's comparison against a file this order itself authorized.

---

## 11. Receipt

Write `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-6-CONFORMANCE-WIRING-REPORT-2026-08-12.md`
containing:

1. This order's identity as hash-frozen by the owner, quoted from the handoff.
2. Opening and closing measurements from steps 1 and 11, with the two-directional comparison result.
3. The exact added `package.json` line and the exact added workflow lines, together with the step 4 and step
   5 locality proofs: each preserved opening digest, the reconstruction method used, and the byte-comparison
   result.
4. Byte lengths before and after for both edited files, with the arithmetic shown.
5. Every command run, with exit code and verbatim output, including the predicted `conform:decisions`
   failure.
6. The §7 pin comparison, both times, showing all three compared values.
7. The §8 lifecycle condition, reproduced verbatim.
8. An explicit statement that repository conformance is **not** accepted by this phase, and why.
9. A statement that no stop condition fired. This receipt is a **success-path artifact only.** If any stop
   fires before step 11 completes, **no Phase 6 receipt is created at all**: capture the measured state at the
   moment of the stop and return it directly to the architect seat, rather than writing a receipt that would
   have to claim a closing comparison that was never performed.

Name only evidence that exists. Do not claim a check this order did not require.

---

## 12. Stop conditions

1. Any disagreement among the three §7 values.
2. `test:decisions-format` failing against the unmodified tree.
3. Any departure from the §9 prediction, including an unexpected exit `0`.
4. Either reconciliation command failing at step 9.
5. `npx tsc -b --pretty false` failing.
6. Any Project Shrimp repository path outside the §4 allowlist differing between opening and closing
   measurement.
7. Any need to author, rename, or re-point a script other than the single authorized key.
8. Any temptation to make `conform:decisions` pass by tracking the archive, editing E038, omitting
   `--root`, or dropping tracked-path validation. Tracking the archive is a content-commit act reserved to a
   later step and is **not authorized here**.
9. Either locality reconstruction in step 4 or step 5 failing to compare byte-identical against the live
   file, even where the JSON or YAML is well-formed and the added key or step is correct.

A stop is a successful control. Return to the architect seat with the state as measured.

---

## 13. Not authorized

- Any edit to `DECISIONS.md`, the normalized archive, the preservation snapshot, or the ratified manifest.
- Any edit to `lib/decisions-format.ts`, `scripts/decisions-format-conform.ts`,
  `scripts/decisions-migration-reconcile.ts`, or `scripts/decisions-migration-target-reconcile.ts`.
- Any `git add`, `git commit`, `git push`, `git stash`, `git clean`, `git checkout`, or `git reset`
  **against the Project Shrimp repository**. The migration's new artifacts — the normalized archive, the
  preservation snapshot, the ratified manifest, and every governance receipt — are untracked and exist on no
  remote, so a destructive command is unrecoverable. Several migration-touched paths are tracked and
  currently modified; that does not soften this prohibition. Isolated temporary repositories created and
  destroyed by mandated tests fall entirely outside it.
- Any edit to `PROJECT-HISTORY.md` — commission §5.2 item 11 is a later phase.
- Any post-migration reference-graph work — commission §6.
- Binding or rebinding `MIGRATION_DATE`. That is an owner act under Amendment 1 Clause B.
- Accepting repository conformance.

---

## 14. Disposition and closure

Phase 6 closes on architect `ACCEPT` only after:

1. Codex's receipt is adjudicated cold from live disk by the architect seat, not from the receipt's own
   narrative;
2. a **non-producer** seat independently executes the post-edit fixture command from step 6, the live
   conformance command from step 7, and both reconciliation commands from step 9, reproducing the exit codes
   and the verbatim `conform:decisions` finding. Step 3 is **not** independently reproduced: it runs against
   the pre-edit tree, which no longer exists at closeout, and recreating it would require mutating or
   reverting the tree. The producer's step 3 result stands as temporal evidence in the receipt;
3. the §7 post-edit pin comparison is independently reproduced.

Phase 6 closure does not authorize the Stage 2b content commit, does not accept repository conformance, and
does not close the Amendment 1 rebinding window. The content commit, its `MIGRATION_DATE` predicate check,
and the acceptance run that must exit `0` are a separately commissioned step.
