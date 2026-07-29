# DECISIONS.md Format Parser and Conformance Checker — Implementer Work Order

**Date:** 2026-07-28
**Seat:** Implementer / producer.
**Status:** **OWNER-AUTHORIZED 2026-07-28. Final pre-commit clarifications adopted 2026-07-28.
Open work order; immutable during execution.**
**Authority:** Luke's ratification of the format contract and fixtures on 2026-07-28.

**Governing pair — read both in full before coding:**

1. `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md`
2. `DECISIONS-FORMAT-FIXTURES-2026-07-28.md`

The specification defines the grammar. The fixtures are the external null. If code and fixture
disagree, **the fixture wins until the architect seat rules otherwise.** The implementer may not edit
either governing file to make a test pass.

This is the first of two implementation commissions. It builds and proves the shared parser and the
conformance checker. A later, separate commission will harden
`scripts/decisions-reference-graph.ts` to consume the accepted parser. Do not combine the two.

---

## 1. Purpose and sequencing

Build the instrument before the migration uses it:

1. Implement the pure shared parser.
2. Encode every ratified fixture as a focused test.
3. Implement the filesystem-aware conformance checker on top of the parser.
4. Prove the checker fires through an independent negative control.
5. Stop. Do not migrate `DECISIONS.md`, create an archive, or modify the reference graph.

The current `DECISIONS.md` still uses the legacy format and is expected not to conform. Therefore,
this commission tests the checker against synthetic candidate documents assembled from the fixtures;
it does not wire the checker as a routine no-argument gate against the live document.

---

## 2. Preflight

All conditions must hold before implementation. Report each result.

1. Work from a clean branch cut from current `main`, named
   `codex/decisions-format-parser-conformance` (or the equivalent implementer prefix).
2. Record `git rev-parse HEAD` as `FORMAT_HEAD`.
3. Confirm both governing files are tracked at `FORMAT_HEAD` and contain
   `RATIFIED 2026-07-28 by Luke (owner)`.
4. Confirm `git status --porcelain` is empty.
5. Read `AGENTS.md` and classify this as **audit / maintenance tooling**.

If the ratified files or this work order are uncommitted, stop. A remote-reading or branch-isolated
implementer cannot be governed by files that exist only in another seat's working tree.

---

## 3. Writable paths

Exactly these paths may change:

- `lib/decisions-format.ts` — new shared pure parser.
- `scripts/decisions-format-conform.ts` — new filesystem-aware checker CLI.
- `scripts/tests/decisions-format.ts` — fixture, parser, checker, and negative-control tests.
- `package.json` — exactly one added script line:  
  `"test:decisions-format": "tsx scripts/tests/decisions-format.ts",`

Do not edit any other path. Stage by explicit path, never `git add -A` or a glob.

---

## 4. Shared parser contract

Implement `lib/decisions-format.ts` as pure functions over supplied text and explicit context. It may
not read the filesystem, invoke git, write files, inspect process arguments, or exit the process.

At minimum, expose typed operations sufficient for the checker to parse:

- live `P`/`R` cores and attachments;
- name-addressed `I`/`T` entries;
- entry-index rows, the exact declared-total line, and deterministic block keys;
- both ID-addressed and name-addressed archive wrappers with opaque verbatim bodies;
- archive-index lines for both addressing modes;
- retired-identifier register rows;
- statement sentence counts under the ratified boundary algorithm;
- kind/status compatibility from the taxonomy-derived table;
- structured issues carrying the ratified parser and conformance reason codes.

The public return shape is an implementation decision, but it must preserve every value asserted by
F1–F13, distinguish every M1–M18 parser reason, and support every C1–C8 conformance finding. Do not
collapse different reason codes into one syntax error.

### Sentence boundaries

Implement the algorithm literally from specification §2.1. In particular:

- periods inside `46.5` are not boundaries;
- the closed abbreviation list is exact and is not expanded by inference;
- `Dr.` before `Smith` is not a boundary;
- consecutive terminal punctuation counts once.

Do not substitute a general NLP sentence tokenizer whose behavior is outside the ratified contract.

### Fixture discipline

Encode every F, M, and C fixture in `scripts/tests/decisions-format.ts` as a named test mapped to
its fixture ID. Literal inputs must preserve the ratified punctuation and Unicode characters, including
the em dash, `°C`, `§`, and M1's ordinary hyphen.

Where the fixture document describes a multi-block or document-context failure rather than printing
a complete document, construct the smallest synthetic document that expresses exactly that case.
Do not add extra defects that could mask the expected reason.

The producer may not edit either fixture file. An apparent ambiguity is a stop-and-report condition,
not permission to choose a convenient interpretation.

---

## 5. Conformance checker

Implement `scripts/decisions-format-conform.ts` as a CLI consumer of the shared parser.

Required explicit invocation:

```text
npx tsx scripts/decisions-format-conform.ts \
  --root <repository-root> \
  --decisions <candidate-DECISIONS.md> \
  [--archive <candidate-archive.md>]
```

No-argument production wiring is deliberately deferred until migration. The CLI must:

- report every failure, not only the first;
- exit non-zero on any failure;
- identify the source file, line or block when available, assertion, and exactly one reason code
  from the closed sets in the fixture file;
- use the tracked-file index beneath `--root` for `Evidence` and `Owner` path checks;
- reject path-shaped prose or symbols that are not tracked paths;
- never weaken assertion 15 to accommodate migration-map placeholders;
- implement every deterministic assertion in specification §8 that is applicable to the supplied
  candidate documents.

The parser owns grammar. The checker may orchestrate cross-block, section, index, archive, allocation,
and tracked-path assertions, but may not reimplement heading or field grammar independently.

### Migration pointer boundary

This commission does not resolve the migration map's prose owners and evidence labels. Later
migration work must resolve a value to a real tracked path or omit the optional field and enumerate
the omission in its receipt. Do not add aliases, pseudo-path acceptance, basename guessing, or a
migration grace mode to the checker.

---

## 6. Required tests and negative control

`npm run test:decisions-format` must cover all of the following:

1. F1–F13 parse with every asserted value.
2. M1–M18 reject for the stated parser reason, not merely any reason.
3. C1–C8 produce the stated conformance finding code.
4. Live and archive field vocabularies remain separate.
5. Kind/status compatibility rejects `P + REVISIT`, `R + CONDITIONAL`, `I + PARKED`, and every other
   combination excluded by the ratified table while accepting every listed combination.
6. Declared-total syntax, presence, and equality are tested separately.
7. Index/body equality catches equal-count, different-member defects.
8. Reordering distinct block keys between index and body produces `INDEX_ORDER_MISMATCH`.
9. Name-addressed title collisions fail.
10. Both archive addressing modes parse, join to their index lines, and preserve opaque body bytes.
11. Allocation is checked over live + retired + never-assigned IDs, while the live set may be gappy.
12. `Evidence`/`Owner` accept a tracked path and reject an untracked pseudo-path.
13. The CLI reports multiple independent defects in one run and exits non-zero.

### Negative control

Create a temporary synthetic candidate inside the test process; do not add a committed broken file.
Inject at least four independent defects that do not structurally mask one another, including:

- one malformed heading (`HEADING_SHAPE`);
- one missing index/body member with equal declared count preserved (`INDEX_BODY_MISMATCH`);
- one untracked `Owner` or `Evidence` value (`UNTRACKED_PATH`);
- one archive/index mismatch (`ARCHIVE_INDEX_MISMATCH`).

Assert that the CLI output names all four defects individually and distinguishably. Then run the same
candidate after repair and assert exit 0. A failure caused by one early parse collapse is a smoke
test, not the required negative control.

---

## 7. Non-goals

Do not under this commission:

1. Edit `DECISIONS.md`.
2. Create or edit anything under `Archive/`.
3. Edit the ratified specification, fixtures, taxonomy, closure work order, or this work order.
4. Touch `scripts/decisions-reference-graph.ts` or regenerate its JSON output.
5. Add `conform:decisions-format` to `package.json` or wire CI. The live document has not migrated.
6. Implement migration, resolve the 80-row pointer inventory, compress entries, or write E038/E074.
7. Update `PROJECT-HISTORY.md`; publication of accepted status belongs to the post-review/merge seat.
8. Touch application runtime, banks, schema, visuals, or `.github/workflows/`.

---

## 8. Verification

Report actual commands and outputs, not claims about them.

1. `npm run test:decisions-format` — exit 0, including the negative-control assertions.
2. `npx tsc -b --pretty false` — exit 0.
3. Direct CLI pass against the repaired synthetic candidate — exit 0 and full output.
4. Direct CLI negative control — non-zero and full output naming every injected defect.
5. `git diff --stat "$FORMAT_HEAD"..HEAD -- DECISIONS.md Archive scripts/decisions-reference-graph.ts DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md DECISIONS-FORMAT-FIXTURES-2026-07-28.md` — empty.
6. `git diff --name-only "$FORMAT_HEAD"..HEAD` — exactly the four writable paths in §3.
7. `git diff --numstat "$FORMAT_HEAD"..HEAD -- package.json` — exactly one added line and zero removed.
8. `git status --porcelain` — empty after the final commit.

No full application build or bank gate is required: this is isolated maintenance tooling and is not
imported by the application build path.

---

## 9. Handoff

Return:

- preflight results and `FORMAT_HEAD`;
- a fixture matrix F1–F13, M1–M18, and C1–C8 with pass/rejection/finding code;
- negative-control and repaired-control outputs;
- all §8 verification outputs;
- the exact exported parser API;
- any ambiguity or mismatch found in the ratified pair, reported without editing around it;
- confirmation that graph hardening and migration were not begun.

Acceptance of this pass authorizes a separate graph-hardening commission. It does not authorize the
migration itself.
