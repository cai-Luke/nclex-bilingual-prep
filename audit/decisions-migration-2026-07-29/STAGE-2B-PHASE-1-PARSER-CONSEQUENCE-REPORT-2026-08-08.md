# Stage 2b Phase 1 — Amendment 4 parser consequence report

**Date:** 2026-08-08  
**Executing seat:** Codex / shell-capable implementation producer  
**Authorized order:** `DECISIONS-MIGRATION-STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-WORK-ORDER-2026-08-08.md`, revision 3, independently verified before execution at 18112 bytes / SHA-256 `e870e05304481120ad610a0d9da3f4e677b68356d111cbd8c93fadda7fb88095`

## 1. Opening measurement

Measured from live local disk before any repository write:

| item | observed state | §3 comparison |
|---|---:|---|
| Branch | `codex/decisions-migration` | Match |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | Recorded; §3 did not pin a commit |
| Tracked working tree | No staged or modified tracked path (`git diff --name-only` and `git diff --cached --name-only` both empty) | Match |
| `lib/decisions-format.ts` | 47250 bytes / SHA-256 `46b5f8c2d13203a155484bb5947acd7086a0d15a8f6c3066ce353cc103a7c256` | Length match |
| `scripts/tests/decisions-format.ts` | 35014 bytes / SHA-256 `cd3852f2a614781565d46105ff8bcc4d9f78ff077b80e6f6a1dc990882d1cdde` | Length match |
| `DECISIONS-FORMAT-FIXTURES-2026-07-28.md` | 16948 bytes / SHA-256 `953162c48cc6dd2efc57cafb0c6045705ab9537de19a1749b0ab94a52629c79e` | Length match |

`git status --porcelain` reported only the pre-existing untracked migration working set, including the authorized handoff and work order and the untracked `audit/decisions-migration-2026-07-29/` directory. This is context, not a §3 divergence. The two direct tracked-state checks were empty as stated above. All tracked prerequisites matched; execution continued.

## 2. Harness contract established from source

I read `scripts/tests/decisions-format.ts` in full before running it or editing it. The existing `F1`–`F13` fixtures are literal source strings exercised by bare top-level assertion blocks, while `M1`–`M19` are table-driven parser-rejection cases executed by a loop. `fixturePassed` only appends a display row to the in-memory `fixtureMatrix`; it is not itself an assertion.

A pass is signalled only after all top-level assertions, both programmatic CLI controls, and the spawned CLI control complete: the harness sorts and prints `Fixture matrix`, prints the negative and repaired control output, and finally prints `decisions-format tests passed`. An assertion or other uncaught throw makes the `tsx` process exit non-zero. Because the fixture matrix is printed late, an ordinary bare assertion failure before that point prevents the matrix from appearing. The harness creates its CLI controls beneath the OS temporary directory, initializes and stages a file in a temporary Git repository, and removes that directory in `finally` unless `DECISIONS_FORMAT_KEEP_FIXTURES=1`.

The existing declaration patterns used as scaffolding references were `F13`'s literal archive-index source plus a bare `parseArchiveIndexLines` assertion block, and `M19`'s `malformedCases` entry whose `issues` closure invokes `parseArchiveDocument` and whose expected parser code is checked by the existing loop.

## 3. Seven transcribed expectations and isolated executor

The fixture source strings and the following expectations were transcribed from `DECISIONS-FORMAT-FIXTURES-2026-07-28.md`, without consulting parser output.

### F14

Verbatim expectation:

~~~text
addressing=name  id=absent
blockKey=Most recent application of P27 (2026-07-12 pass)  file=archive
kind=X  status=SUPERSEDED  force=HISTORICAL  date=2026-07-29
originalKind=P  originalStatus=ACTIVE  retiredId=absent
origin.section=DECISIONS.md §4  origin.token=MIGRATION_BASELINE
statement=absent  body=opaque  bodyBytesPreserved=true
~~~

Implementing test code parses the literal F14 wrapper, requires an empty issue list, asserts each named field, and pins the exact opaque body bytes:

~~~ts
const parsed = parseArchiveDocument(f14);
assert.deepEqual(parsed.issues, []);
const wrapper = parsed.wrappers[0];
assert.equal(wrapper.addressing, "name");
assert.equal(wrapper.id, undefined);
assert.equal(wrapper.blockKey, "Most recent application of P27 (2026-07-12 pass)");
assert.equal(wrapper.originalKind, "P");
assert.equal(wrapper.originalStatus, "ACTIVE");
assert.equal(wrapper.retiredId, undefined);
assert.deepEqual(wrapper.origin, { section: "DECISIONS.md §4", token: "MIGRATION_BASELINE" });
assert.equal(
  wrapper.body,
  "**Applied 2026-07-12.** The historical application body remains byte-for-byte unchanged.",
);
~~~

### F15

Verbatim expectation:

~~~text
addressing=name  id=absent
blockKey=CBC American-conventional units (superseded original ruling)  file=archive
kind=X  status=SUPERSEDED  force=HISTORICAL  date=2026-07-29
originalKind=R  originalStatus=SUPERSEDED  retiredId=absent
origin.section=DECISIONS.md §8  origin.token=MIGRATION_BASELINE
statement=absent  body=opaque  bodyBytesPreserved=true
~~~

Implementing test code parses the literal F15 wrapper, requires an empty issue list, asserts each named field, and pins the exact opaque body bytes:

~~~ts
const parsed = parseArchiveDocument(f15);
assert.deepEqual(parsed.issues, []);
const wrapper = parsed.wrappers[0];
assert.equal(wrapper.addressing, "name");
assert.equal(wrapper.id, undefined);
assert.equal(wrapper.blockKey, "CBC American-conventional units (superseded original ruling)");
assert.equal(wrapper.originalKind, "R");
assert.equal(wrapper.originalStatus, "SUPERSEDED");
assert.equal(wrapper.retiredId, undefined);
assert.deepEqual(wrapper.origin, { section: "DECISIONS.md §8", token: "MIGRATION_BASELINE" });
assert.equal(wrapper.body, "The original 2026-07-04 ruling body remains byte-for-byte unchanged.");
~~~

### F16

Verbatim expectation:

~~~text
kind=archiveIndexLine  addressing=name
label=Most recent application of P27 (2026-07-12 pass)
pointer.file=Archive/DECISIONS-ARCHIVE-<date>.md
pointer.anchor=most-recent-application-of-p27-2026-07-12-pass
matches=F14  expectedLabel=wrapper.title  registerRow=absent
~~~

Implementing test code runs the literal F16 line and literal F14 wrapper through the conformance join, requires the join to be clean, then pins the addressing, label, pointer, wrapper-key/title match, and absent register row:

~~~ts
const result = checkDecisionsFormat({
  decisionsText: buildDecisions({ rows: [], section8: f16 }),
  archiveText: f14,
  archiveSource: "Archive/DECISIONS-ARCHIVE-<date>.md",
});
assert.equal(result.ok, true, renderDecisionsFormatResult(result));
assert.equal(result.decisions.archiveIndex[0].addressing, "name");
assert.equal(result.decisions.archiveIndex[0].blockKey, result.archive?.wrappers[0].blockKey);
assert.equal(result.decisions.archiveIndex[0].label, result.archive?.wrappers[0].title);
assert.deepEqual(result.decisions.retiredIdentifiers, []);
~~~

### M20

Verbatim expectation:

~~~text
A wrapper headed `### CBC American-conventional units (superseded original ruling)` whose field list includes `- **Retired ID:** R2` → `REJECT: INVALID_FIELD_VALUE`.
~~~

Implementing assertion:

~~~ts
expectParserCode("M20", parseArchiveDocument(candidate).issues, "INVALID_FIELD_VALUE");
~~~

### M21

Verbatim expectation:

~~~text
`### P22 — CONDITIONAL conditional-principle prose` with `Original Kind: P` and no `Retired ID` line → `REJECT: MISSING_FIELD`.
~~~

Implementing assertion:

~~~ts
expectParserCode("M21", parseArchiveDocument(candidate).issues, "MISSING_FIELD");
~~~

### M22

Verbatim expectation:

~~~text
`### P22 — CONDITIONAL conditional-principle prose` carrying `- **Retired ID:** P18` → `REJECT: INVALID_FIELD_VALUE`.
~~~

Implementing assertion:

~~~ts
expectParserCode("M22", parseArchiveDocument(candidate).issues, "INVALID_FIELD_VALUE");
~~~

### M23

Verbatim expectation:

~~~text
A name-addressed wrapper headed `### P27 Most recent application (2026-07-12 pass)` → `REJECT: HEADING_SHAPE`.
~~~

Implementing assertion:

~~~ts
expectParserCode("M23", parseArchiveDocument(candidate).issues, "HEADING_SHAPE");
~~~

The new `runIsolatedFixture` executor wraps each of these seven tests independently. It records `PASS`, or `FAIL` plus the thrown assertion name and message, appends that outcome to the existing fixture matrix, and continues to the next isolated fixture. After the existing controls complete, the harness prints the complete sorted matrix first; only then does it aggregate any isolated failures into one thrown process-level error. Thus all seven outcomes survive a non-zero pre-excision run, while the same permanent mechanism still fails any future regression.

## 4. Pre-excision run

Command: `npm run test:decisions-format`

Raw stdout (2199 bytes), verbatim:

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
[FAIL] MISSING_DECLARED_TOTAL DECISIONS.md assertion=13 — Entry index has no valid declared-total line

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

Raw stderr (1668 bytes), verbatim:

~~~text
/Users/holemini/Desktop/Project Shrimp/scripts/tests/decisions-format.ts:1243
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
[FAIL] MISSING_DECLARED_TOTAL DECISIONS.md assertion=13 — Entry index has no valid declared-total line

false !== true

    at <anonymous> (/Users/holemini/Desktop/Project Shrimp/scripts/tests/decisions-format.ts:1243:11)

Node.js v25.9.0
npm notice
npm notice New minor version of npm available! 11.12.1 -> 11.19.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.19.0
npm notice To update run: npm install -g npm@11.19.0
npm notice
~~~

Exit code: `1`.

| fixture | predicted pre-excision outcome | observed outcome and recorded reason | comparison |
|---|---|---|---|
| F14 | FAIL under the name-addressed `Original Kind: P` guard | FAIL — `INVALID_FIELD_VALUE: Name-addressed archive wrapper cannot have Original Kind P` | Match |
| F15 | FAIL under the name-addressed `Original Kind: R` guard | FAIL — `INVALID_FIELD_VALUE: Name-addressed archive wrapper cannot have Original Kind R` | Match |
| F16 | Cannot pass because F14 is rejected | FAIL — the F14 guard was present, but the result also contained `MISSING_DECLARED_TOTAL: Entry index has no valid declared-total line` | **Divergence** |
| M20 | PASS by observing the already-produced `INVALID_FIELD_VALUE` rejection | PASS | Match |
| M21 | PASS by observing the already-produced `MISSING_FIELD` rejection | PASS | Match |
| M22 | PASS by observing the already-produced `INVALID_FIELD_VALUE` rejection | PASS | Match |
| M23 | PASS by observing the already-produced `HEADING_SHAPE` rejection | PASS | Match |

The additional F16 `MISSING_DECLARED_TOTAL` finding diverged from the commission's prediction that F16 would be unable to pass because F14 was rejected. Under §5 Step 4 and §7 stop condition 2, execution stopped immediately. No fixture was adjusted and the parser remained unmodified.

## 5. Excision and read-back seam

Not executed. Step 4 diverged, so the order prohibited proceeding to the §6 excision. There is no post-excision seam to quote; the parser remained at its opening bytes.

## 6. Post-excision run

Not run. The Step 4 stop condition barred Steps 5–6.

## 7. Closing measurement

Measured from live local disk after the stop:

| item | closing state |
|---|---:|
| Branch | `codex/decisions-migration` |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| `lib/decisions-format.ts` | 47250 bytes / SHA-256 `46b5f8c2d13203a155484bb5947acd7086a0d15a8f6c3066ce353cc103a7c256` |
| `scripts/tests/decisions-format.ts` | 41230 bytes / SHA-256 `ad8cacbd0b96abc24a022a0c48d4271bc0f832a6a1fb7f20a29588359c126ea5` |

The parser's length and SHA-256 are identical to the opening measurement, confirming it was not modified. HEAD and branch are unchanged. `git diff --cached --name-only` was empty. `git diff --name-only` named only `scripts/tests/decisions-format.ts`; expanded porcelain status additionally named only this report among the Phase 1 paths:

~~~text
 M scripts/tests/decisions-format.ts
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08.md
~~~

No repository path outside the frozen §4 allowlist changed during this execution. The pre-existing untracked migration working set remains context and was not modified by this order.

## 8. Overall disposition

**STOPPED** — §7 stop condition 2 governs because F16's pre-excision result included an unpredicted `MISSING_DECLARED_TOTAL` finding in addition to the expected F14-guard consequence.
