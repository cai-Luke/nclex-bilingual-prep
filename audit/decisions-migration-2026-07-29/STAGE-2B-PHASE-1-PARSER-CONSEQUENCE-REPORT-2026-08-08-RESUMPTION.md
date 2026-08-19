# Stage 2b Phase 1 — F16 scaffolding correction and resumption report

**Correction instrument:** `DECISIONS-MIGRATION-STAGE-2B-PHASE-1-F16-CORRECTION-WORK-ORDER-2026-08-08.md`, revision 2, externally verified at 13236 bytes / SHA-256 `c7d29a7d984eabd1fa14812ea989da78748b55f0c2712f261d4a602205959cbf`

**Resumes from:** the closed `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08.md`, whose STOPPED disposition is not reopened.

## 1. Opening measurement

Measured from live local disk before the correction edit:

| item | observed state | required comparison |
|---|---:|---|
| Branch | `codex/decisions-migration` | Recorded; unchanged from STOPPED receipt |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | Recorded; unchanged from STOPPED receipt |
| Tracked modified paths | `scripts/tests/decisions-format.ts` only | Expected prior STOPPED state |
| Staged paths | None | Expected prior STOPPED state |
| `lib/decisions-format.ts` | 47250 bytes / SHA-256 `46b5f8c2d13203a155484bb5947acd7086a0d15a8f6c3066ce353cc103a7c256` | Exact match |
| `scripts/tests/decisions-format.ts` | 41230 bytes / SHA-256 `ad8cacbd0b96abc24a022a0c48d4271bc0f832a6a1fb7f20a29588359c126ea5` | Exact match |

The parser and test-file identities match the correction instrument's pinned prior state and the STOPPED receipt's closing measurement. The tracked tree has the expected pre-existing test modification and no staged path; the untracked migration working set is preserved as context. Execution continued.

## 2. F16 correction

The authorized substitution was applied only inside the F16 isolated fixture. The old `rows: []` expression was replaced with the exact populated I-kind entry-index scaffold; `archiveText`, `archiveSource`, the seven transcribed assertions, and every other line in the block were untouched. The source was read back from disk:

~~~ts
runIsolatedFixture("F16", () => {
  const result = checkDecisionsFormat({
    decisionsText: buildDecisions({
      rows: [{ kind: "I", summary: "Runtime audio carries no client-embedded secret" }],
      i: [f5],
      section8: f16,
    }),
    archiveText: f14,
    archiveSource: "Archive/DECISIONS-ARCHIVE-<date>.md",
  });
  assert.equal(result.ok, true, renderDecisionsFormatResult(result));
  assert.equal(result.decisions.archiveIndex[0].addressing, "name");
  assert.equal(result.decisions.archiveIndex[0].label, "Most recent application of P27 (2026-07-12 pass)");
  assert.equal(result.decisions.archiveIndex[0].blockKey, result.archive?.wrappers[0].blockKey);
  assert.equal(result.decisions.archiveIndex[0].label, result.archive?.wrappers[0].title);
  assert.equal(result.decisions.archiveIndex[0].pointer.file, "Archive/DECISIONS-ARCHIVE-<date>.md");
  assert.equal(
    result.decisions.archiveIndex[0].pointer.anchor,
    "most-recent-application-of-p27-2026-07-12-pass",
  );
  assert.deepEqual(result.decisions.retiredIdentifiers, []);
});
~~~

The read-back confirms the two archive inputs, the pointer assertions, and the absent-register assertion are unchanged.

## 3. Harness and seven expectations

The harness contract is unchanged from the parent receipt: F1–F13 remain bare assertion blocks; M1–M19 remain table-driven; the isolated executor records every new fixture outcome and defers one aggregate failure until after the matrix prints; and success still requires the existing controls plus the final success line. The seven expectations are also unchanged; only F16's incidental entry-index population changed.

F14 expectation, verbatim:

~~~text
addressing=name  id=absent
blockKey=Most recent application of P27 (2026-07-12 pass)  file=archive
kind=X  status=SUPERSEDED  force=HISTORICAL  date=2026-07-29
originalKind=P  originalStatus=ACTIVE  retiredId=absent
origin.section=DECISIONS.md §4  origin.token=MIGRATION_BASELINE
statement=absent  body=opaque  bodyBytesPreserved=true
~~~

F15 expectation, verbatim:

~~~text
addressing=name  id=absent
blockKey=CBC American-conventional units (superseded original ruling)  file=archive
kind=X  status=SUPERSEDED  force=HISTORICAL  date=2026-07-29
originalKind=R  originalStatus=SUPERSEDED  retiredId=absent
origin.section=DECISIONS.md §8  origin.token=MIGRATION_BASELINE
statement=absent  body=opaque  bodyBytesPreserved=true
~~~

F16 expectation, verbatim:

~~~text
kind=archiveIndexLine  addressing=name
label=Most recent application of P27 (2026-07-12 pass)
pointer.file=Archive/DECISIONS-ARCHIVE-<date>.md
pointer.anchor=most-recent-application-of-p27-2026-07-12-pass
matches=F14  expectedLabel=wrapper.title  registerRow=absent
~~~

M20 expectation, verbatim:

~~~text
A wrapper headed `### CBC American-conventional units (superseded original ruling)` whose field list includes `- **Retired ID:** R2` → `REJECT: INVALID_FIELD_VALUE`.
~~~

M21 expectation, verbatim:

~~~text
`### P22 — CONDITIONAL conditional-principle prose` with `Original Kind: P` and no `Retired ID` line → `REJECT: MISSING_FIELD`.
~~~

M22 expectation, verbatim:

~~~text
`### P22 — CONDITIONAL conditional-principle prose` carrying `- **Retired ID:** P18` → `REJECT: INVALID_FIELD_VALUE`.
~~~

M23 expectation, verbatim:

~~~text
A name-addressed wrapper headed `### P27 Most recent application (2026-07-12 pass)` → `REJECT: HEADING_SHAPE`.
~~~

## 4. Fresh pre-excision run

Command: `npm run test:decisions-format`

Raw stdout (2094 bytes), verbatim:

~~~text

> nclex-bilingual-prep@0.1.0 test:decisions-format
> tsx scripts/tests/decisions-format.ts

Fixture matrix
F1: PASS
F2: PASS
F3: PASS
F4: PASS
F5: PASS
F6: PASS
F7: PASS
F8: PASS
F9: PASS
F10: PASS
F11: PASS
F12: PASS
F13: PASS
F14: FAIL AssertionError: F14: expected no issues, got INVALID_FIELD_VALUE: Name-addressed archive wrapper cannot have Original Kind P
+ actual - expected

+ [
+   {
+     blockKey: 'Most recent application of P27 (2026-07-12 pass)',
+     code: 'INVALID_FIELD_VALUE',
+     line: 1,
+     message: 'Name-addressed archive wrapper cannot have Original Kind P',
+     source: 'archive.md'
+   }
+ ]
- []

F15: FAIL AssertionError: F15: expected no issues, got INVALID_FIELD_VALUE: Name-addressed archive wrapper cannot have Original Kind R
+ actual - expected

+ [
+   {
+     blockKey: 'CBC American-conventional units (superseded original ruling)',
+     code: 'INVALID_FIELD_VALUE',
+     line: 1,
+     message: 'Name-addressed archive wrapper cannot have Original Kind R',
+     source: 'archive.md'
+   }
+ ]
- []

F16: FAIL AssertionError: [FAIL] INVALID_FIELD_VALUE Archive/DECISIONS-ARCHIVE-<date>.md:1 block=Most recent application of P27 (2026-07-12 pass) — Name-addressed archive wrapper cannot have Original Kind P

false !== true

M1: REJECT HEADING_SHAPE
M2: REJECT DERIVED_ID
M3: REJECT DUPLICATE_CORE
M4: REJECT ORPHAN_ATTACHMENT
M5: REJECT EMPTY_FIELD
M6: REJECT FIELD_ORDER
M7: REJECT UNKNOWN_FIELD
M8: REJECT STATEMENT_LENGTH
M9: REJECT STATEMENT_SHAPE
M10: REJECT KIND_SECTION
M11: REJECT ANCHOR_CITATION
M12: REJECT ID_ON_NAME_ADDRESSED
M13: REJECT ARCHIVE_BLOCK_IN_DECISIONS
M14: REJECT TITLE_COLLISION
M15: REJECT MISSING_FIELD
M16: REJECT INVALID_FIELD_VALUE
M17: REJECT STATUS_KIND
M18: REJECT DECLARED_TOTAL_SHAPE
M19: REJECT MISSING_FIELD
M20: PASS
M21: PASS
M22: PASS
M23: PASS
C1: FINDING MISSING_DECLARED_TOTAL
C2: FINDING INDEX_BODY_MISMATCH
C3: FINDING INDEX_ORDER_MISMATCH
C4: FINDING DECLARED_TOTAL_MISMATCH
C5: FINDING UNTRACKED_PATH
C6: FINDING ALLOCATION_GAP
C7: FINDING ARCHIVE_INDEX_MISMATCH
C8: FINDING RETIRED_ID_CONFLICT
~~~

Raw stderr (1351 bytes), verbatim:

~~~text
/Users/holemini/Desktop/Project Shrimp/scripts/tests/decisions-format.ts:1247
    throw new Error(`Isolated fixture failures: ${isolatedFailures.map(
          ^

Error: Isolated fixture failures: F14: AssertionError: F14: expected no issues, got INVALID_FIELD_VALUE: Name-addressed archive wrapper cannot have Original Kind P
+ actual - expected

+ [
+   {
+     blockKey: 'Most recent application of P27 (2026-07-12 pass)',
+     code: 'INVALID_FIELD_VALUE',
+     line: 1,
+     message: 'Name-addressed archive wrapper cannot have Original Kind P',
+     source: 'archive.md'
+   }
+ ]
- []
 | F15: AssertionError: F15: expected no issues, got INVALID_FIELD_VALUE: Name-addressed archive wrapper cannot have Original Kind R
+ actual - expected

+ [
+   {
+     blockKey: 'CBC American-conventional units (superseded original ruling)',
+     code: 'INVALID_FIELD_VALUE',
+     line: 1,
+     message: 'Name-addressed archive wrapper cannot have Original Kind R',
+     source: 'archive.md'
+   }
+ ]
- []
 | F16: AssertionError: [FAIL] INVALID_FIELD_VALUE Archive/DECISIONS-ARCHIVE-<date>.md:1 block=Most recent application of P27 (2026-07-12 pass) — Name-addressed archive wrapper cannot have Original Kind P

false !== true

    at <anonymous> (/Users/holemini/Desktop/Project Shrimp/scripts/tests/decisions-format.ts:1247:11)

Node.js v25.9.0
~~~

Exit code: `1`.

| fixture | prediction | observed outcome | comparison |
|---|---|---|---|
| F1–F13 | PASS | PASS | Match |
| M1–M19 | Existing rejection codes continue to pass | Existing rejection codes continue to pass | Match |
| F14 | FAIL under name-addressed `Original Kind: P` guard | FAIL: `INVALID_FIELD_VALUE: Name-addressed archive wrapper cannot have Original Kind P` | Match |
| F15 | FAIL under name-addressed `Original Kind: R` guard | FAIL: `INVALID_FIELD_VALUE: Name-addressed archive wrapper cannot have Original Kind R` | Match |
| F16 | FAIL solely on F14's P-guard rejection | FAIL solely on `INVALID_FIELD_VALUE: Name-addressed archive wrapper cannot have Original Kind P` | Match |
| M20–M23 | PASS on their existing reason codes | PASS | Match |

The exact prediction gate passed, so execution proceeded to the frozen order's §5 Steps 5–7.

## 5. Excision and read-back seam

The exact three-line substring was checked before editing: occurrence count 1, length 175 bytes, byte range [38508, 38683) in the 47250-byte pre-excision parser. Only this block was deleted:

~~~ts
      if (originalKind && originalKind !== "I" && originalKind !== "T") {
        invalid(`Name-addressed archive wrapper cannot have Original Kind ${originalKind}`);
      }
~~~

The post-edit parser measured 47075 bytes, and the deleted substring's remaining occurrence count was 0. The read-back seam is:

~~~ts
    } else {
      if (fieldResult.values.has("Retired ID")) invalid("Name-addressed archive wrapper forbids Retired ID");
    }
~~~

No other parser change was made.

## 6. Post-excision run

Command: npm run test:decisions-format

Raw stdout (1771 bytes), verbatim:

~~~text

> nclex-bilingual-prep@0.1.0 test:decisions-format
> tsx scripts/tests/decisions-format.ts

Fixture matrix
F1: PASS
F2: PASS
F3: PASS
F4: PASS
F5: PASS
F6: PASS
F7: PASS
F8: PASS
F9: PASS
F10: PASS
F11: PASS
F12: PASS
F13: PASS
F14: PASS
F15: PASS
F16: PASS
M1: REJECT HEADING_SHAPE
M2: REJECT DERIVED_ID
M3: REJECT DUPLICATE_CORE
M4: REJECT ORPHAN_ATTACHMENT
M5: REJECT EMPTY_FIELD
M6: REJECT FIELD_ORDER
M7: REJECT UNKNOWN_FIELD
M8: REJECT STATEMENT_LENGTH
M9: REJECT STATEMENT_SHAPE
M10: REJECT KIND_SECTION
M11: REJECT ANCHOR_CITATION
M12: REJECT ID_ON_NAME_ADDRESSED
M13: REJECT ARCHIVE_BLOCK_IN_DECISIONS
M14: REJECT TITLE_COLLISION
M15: REJECT MISSING_FIELD
M16: REJECT INVALID_FIELD_VALUE
M17: REJECT STATUS_KIND
M18: REJECT DECLARED_TOTAL_SHAPE
M19: REJECT MISSING_FIELD
M20: PASS
M21: PASS
M22: PASS
M23: PASS
C1: FINDING MISSING_DECLARED_TOTAL
C2: FINDING INDEX_BODY_MISMATCH
C3: FINDING INDEX_ORDER_MISMATCH
C4: FINDING DECLARED_TOTAL_MISMATCH
C5: FINDING UNTRACKED_PATH
C6: FINDING ALLOCATION_GAP
C7: FINDING ARCHIVE_INDEX_MISMATCH
C8: FINDING RETIRED_ID_CONFLICT
Negative control output
[FAIL] HEADING_SHAPE negative-DECISIONS.md:33 block=P4 - Malformed heading — Invalid entry heading: P4 - Malformed heading
[FAIL] INDEX_BODY_MISMATCH negative-DECISIONS.md assertion=12 — Index-only keys: P2#0; body-only keys: P3#0
[FAIL] UNTRACKED_PATH negative-DECISIONS.md:14 assertion=15 block=P1#0 — Owner path is not tracked: not-a-real-owner.ts
[FAIL] ARCHIVE_INDEX_MISMATCH negative-DECISIONS.md assertion=14 — Archive index/wrapper mismatch for Missing archive wrapper
Repaired control output
[PASS] DECISIONS format conforms
live blocks: 2
index rows: 2
archive wrappers: 0
archive index lines: 0
retired-register rows: 0
decisions-format tests passed
~~~

Raw stderr was empty (0 bytes):

~~~text
~~~

Exit code: 0. F1–F13 and M1–M19 continued to pass; F14, F15, and F16 passed after the excision; M20–M23 continued to pass on their existing reason codes; and the suite reached its final success line.

## 7. Closing measurement

Measured from live local disk after the post-excision run:

| item | closing state |
|---|---:|
| Branch | codex/decisions-migration |
| HEAD | 05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5 |
| lib/decisions-format.ts | 47075 bytes / SHA-256 10e59335d02eb90163b465570c4e467323d3ff9d224585774e264846590fe1e4 |
| scripts/tests/decisions-format.ts | 41335 bytes / SHA-256 251b55697b202845e805201c7f972c54bac2688e9156b6ba598e11454a75d15f |

git diff --cached --name-only was empty. git diff --name-only listed only the two authorized modified source files. The only newly named report under the allowlist is this resumption report:

~~~text
 M lib/decisions-format.ts
 M scripts/tests/decisions-format.ts
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08-RESUMPTION.md
~~~

No repository path outside the resumption allowlist changed. No commit, push, branch operation, or manifest edit was performed.

## 8. Overall disposition

**PASS** — the authorized F16 scaffold correction reproduced the frozen pre-excision prediction exactly, the exact single parser excision made all seven new fixtures pass without regression, and the suite exited zero.
