# Stage 2b Phase 5 — location-binding repair receipt

**Date:** 2026-08-11
**Seat:** Codex / implementation producer
**Scope:** Narrow Phase 5 location-binding repair only

## Opening measurement and census — Step 1

The authorized repair order was confirmed at `31308` bytes / SHA-256
`fd252a87340e0dc44c71d35a4342bd7cd47a4547e31714f8c75a604b246e34f4`.

- Branch: `codex/decisions-migration`.
- HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`.
- Staged paths: none.
- Modified tracked paths: exactly `DECISIONS.md`, `lib/decisions-format.ts`, `package.json`, and
  `scripts/tests/decisions-format.ts`.
- File-level opening status: 126 lines total, including 122 untracked file paths.
- Snapshot equality: `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` is byte-identical to
  `git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md`.

| input | bytes | SHA-256 / comparison |
|---|---:|---|
| Phase 5 revision-2 work order | 33073 | `75cc6db647afd6f8e6e0950ac885ba5c7b225489bb73b03236d81f3eca66ceac` |
| `DECISIONS.md` | 56964 | `3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8` |
| preservation snapshot | 76314 | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`; exact baseline equality |
| normalized archive | 13997 | `e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c` |
| ratified Stage 2a manifest | 332579 | `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` |
| ratified Amendment 2 | 24202 | `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4` |
| ratified Amendment 3 | 26963 | `9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e` |
| ratified Amendment 4 | 22665 | `5d70d7f61ef1243a70ea59b8de0aee7b25dada45672ee93e203e808dfff14827` |
| `package.json` | 8542 | `8f0ade576da1515e7400b7f6c54990b4ae71ea2cd5b1846b7f788d71ab4af582` |
| target checker, opening bytes | 35743 | `bd06826939ed881a4394decf2f48f7e3c6d8d0b6b9fe39c7b7663f7096866c89` |
| original Phase 5 receipt | 14247 | `d1faf387c451346aec4311e6a041f4f29e62f7546d8b80070bad479c5079b195` |
| frozen historical checker | 20631 | `be8f258b6d0145b91a5e4605f920c84e668a0396742b3fb88773c0bcbb5f8420` |
| frozen inventory | 28554 | `cfae5a898c1520173d835af5d0e29b4c0bfd2b135a40fb4335de82b34da1333e` |
| frozen migration table | 16833 | `89a2812dc955a61e45723bf6c242e247f467df71c7daa301b4fde2fcae1a4535` |
| frozen outline | 9878 | `3821323c711866e655fd25b044add86c33cdc859762a4aa6f62d522ff158440e` |

The checker was read in full. Ratified Amendment 2 §2, ratified Amendment 4 §6, manifest M5.4, and
manifest M5.6 were read directly. The public parser surfaces confirmed from `lib/decisions-format.ts`
are `LiveEntry.section`, `LiveEntry.line`, `EntryIndexRow.line`,
`EntryIndex.declaredTotalLine`, and `ArchiveIndexLine.line`.

The preserved original target-checker transcript is 1905 bytes / SHA-256
`29efcc7c0f2318a51f9dac52d63c454c2ac624c9a81a8377fe694e159aa25c75`.

### Complete verbatim opening `git status --porcelain=v1 --untracked-files=all`

```text
 M DECISIONS.md
 M lib/decisions-format.ts
 M package.json
 M scripts/tests/decisions-format.ts
?? Archive/DECISIONS-ARCHIVE-2026-08-18.md
?? Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-RATIFICATION-2026-08-08.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-STRUCTURAL-SURFACES-2026-08-08.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-ASSEMBLY-JOINS-2026-08-08.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-RATIFICATION-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-BLOCK-GROUPING-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-OCCURRENCE-CENSUS-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-ADDENDUM-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DERIVED-REPORT-VALIDATION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-COMPLETION-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-FRESH-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-FRESH-REVIEW-NARROW-RECOMMISSION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-GPT-DETERMINISTIC-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HEADER-MEASUREMENT-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-CONFIRMING-READ-RERUN-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-RESERVATION-RECORDING-REPAIR-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.35-EXCLUSIVITY-REPAIR-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.35-SENTENCE-COUNT-REPAIR-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.4-ADJACENT-WHITESPACE-REPAIR-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-PRE-CENSUS-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-BINDING-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-AUTHORING-WORK-ORDER-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PATH-CANDIDATE-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-F16-CORRECTION-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-2-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-2-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-3-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-3-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-5-CODEX-HANDOFF-2026-08-11.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-CODEX-HANDOFF-2026-08-11.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-WORK-ORDER-2026-08-11.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-5-RECONCILIATION-CHECKER-WORK-ORDER-2026-08-11.md
?? audit/decisions-migration-2026-07-29/DATE-OCCURRENCE-CENSUS-2026-08-07.md
?? audit/decisions-migration-2026-07-29/DERIVED-REPORT-STEP-6-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/DERIVED-REPORT-VALIDATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FOUR-FINDING-REPAIR-REPORT-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FOUR-FINDING-REPAIR-VERIFICATION-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-A-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-B-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-C-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-D-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-E-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-REVIEW-NARROW-RECOMMISSION-SUPPLEMENTAL-DISPOSITION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-COMMISSION-STATUS-RECORD-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-DISPOSITION-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-A-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-B-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-C-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-D-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-E-2026-08-06.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-REPAIR-REPORT-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-RERUN-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-VOID-RECEIPT-ADJUDICATION-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-RESERVATION-RECORDING-CONFIRMATION-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-RESERVATION-RECORDING-REPAIR-REPORT-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4.35-EXCLUSIVITY-REPAIR-REPORT-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-EXCLUSIVITY-REPAIR-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-CONFIRMING-READ-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-REPAIR-REPORT-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-REPAIR-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.4-ADJACENT-WHITESPACE-REPAIR-REPORT-2026-08-06.md
?? audit/decisions-migration-2026-07-29/M4.4-ADJACENT-WHITESPACE-REPAIR-VERIFICATION-2026-08-06.md
?? audit/decisions-migration-2026-07-29/M5-REPAIR-INDEPENDENT-COLD-REVIEW-FINAL-2026-08-04.md
?? audit/decisions-migration-2026-07-29/M6-PARTIAL-M6-ONLY-SNAPSHOT-2026-08-04.md.frozen
?? audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen
?? audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen
?? audit/decisions-migration-2026-07-29/M6-REPAIR-PRE-CENSUS-2026-08-04.md
?? audit/decisions-migration-2026-07-29/M6-REPAIR-REPORT-2026-08-04.md
?? audit/decisions-migration-2026-07-29/M6-REPAIR-VERIFICATION-2026-08-04.md
?? audit/decisions-migration-2026-07-29/POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08-RESUMPTION.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-TARGET-RECONCILE-REPORT-2026-08-11.md
?? audit/decisions-migration-2026-07-29/STEP-3-SURFACE-MAPPING-2026-08-07.md
?? audit/decisions-migration-2026-07-29/TASK-2-TASK-3-REMEASUREMENT-2026-08-07.md
?? audit/decisions-migration-2026-07-29/target-text-manifest.md
?? scripts/decisions-migration-target-reconcile.ts
```

## Ten-surface repair record — Steps 2–3

The checker now constructs one exact physical-line representation with `targetText.split("\\n")`.
Its 1-based line accessor and inclusive range slicer reject out-of-range or inverted boundaries; the
slicer reconstructs selected lines with exactly `\\n`. CR bytes are retained in line content, so a
CRLF scratch input cannot be silently normalized. `lastNonBlankBefore` uses blankness only to select
an ending boundary and does not alter any included bytes.

An independent scan of physical target lines uses the parser-equivalent
`/^## (\\d+)(?:\\.|\\s|$)/` shape. Sections 3, 4, 5, 6, 7, and 8 must each have exactly one
top-level heading. Missing or duplicate required headings are named failures. No authority payload is
used to locate its own target surface.

| governed surface | authority | independent structural locator | exact comparison and retained uniqueness |
|---|---|---|---|
| §3 introduction | ratified Amendment 2 §2.1 | unique raw-text §3 heading through the last nonblank physical line before `parsed.index.rows[0].line - 2` | extracted string `===` authority payload; global exact-occurrence count must also equal 1 |
| §3 table header | ratified Amendment 2 §2.2 | exact physical line at `parsed.index.rows[0].line - 2` | physical line `===` authority header; global exact-occurrence count must also equal 1 |
| §3 separator | ratified Amendment 2 §2.2 | exact physical line at `parsed.index.rows[0].line - 1` | physical line `===` authority separator; global exact-occurrence count must also equal 1 |
| §3 declared total | ratified Amendment 2 §2.2 | exact physical line at the range-checked `parsed.index.declaredTotalLine`, after the last parsed index row | physical line `===` authority total; global exact-occurrence count must also equal 1 |
| §4 heading/transition | ratified Amendment 2 §2.3 | unique raw-text §4 heading through the last nonblank physical line before the minimum line of parsed entries reporting `section === 4` | extracted string `===` authority payload; global exact-occurrence count must also equal 1 |
| §5 heading/transition | ratified Amendment 2 §2.3 | unique raw-text §5 heading through the last nonblank physical line before the minimum line of parsed entries reporting `section === 5` | extracted string `===` authority payload; global exact-occurrence count must also equal 1 |
| §6 heading/transition | ratified Amendment 2 §2.3 | unique raw-text §6 heading through the last nonblank physical line before the minimum line of parsed entries reporting `section === 6` | extracted string `===` authority payload; global exact-occurrence count must also equal 1 |
| §7 heading/transition | ratified Amendment 2 §2.3 | unique raw-text §7 heading through the last nonblank physical line before the minimum line of parsed entries reporting `section === 7` | extracted string `===` authority payload; global exact-occurrence count must also equal 1 |
| §8 structural introduction / E053 | manifest M5.4 | unique raw-text §8 heading through the last nonblank physical line before `parsed.archiveIndex[0].line` | extracted string `===` M5.4 payload; global exact-occurrence count must also equal 1 |
| §8 archive-index block | manifest M5.6 | physical lines from `parsed.archiveIndex[0].line` through `parsed.archiveIndex[12].line + 1`, inclusive | extracted string `===` M5.6 payload; global exact-occurrence count must also equal 1 |

All required parser populations and boundary orderings are checked before slicing: the index must have
a first row; the first-row offsets must follow the unique §3 heading; the declared-total line must be
defined, in range, and after the index body; §§4–7 must each have parsed entries; the archive index must
contain exactly 13 entries; and the thirteenth label must have a following pointer line. A failed
prerequisite produces a named failure and never falls back to authority-text search.

## E053 target-shape repair — Step 4

The additional E053 shape predicate now inspects the independently extracted target §8 structural
introduction. It fails when any physical line of that target surface begins with `- **`. It no longer
inspects the manifest-derived `e053Payload`; exact M5.4 location equality remains a separate required
predicate.

## Checker diff from opening bytes

Opening checker: `35743` bytes / SHA-256
`bd06826939ed881a4394decf2f48f7e3c6d8d0b6b9fe39c7b7663f7096866c89`.

Closing checker: `47448` bytes / SHA-256
`bd89de205fa873f8f65824e607a950c68dfe33cdc926dc1317e1d63b7aac2639`.

The complete opening-to-closing diff is 449 lines / 19565 bytes / SHA-256
`fadc5ce20d294cbc7262b0c7fb0249c62d6da608ec01eb0e971ec7f48caa11a3`.

```diff
diff --git a/tmp/project-shrimp-phase5-location-opening-checker.ts b/scripts/decisions-migration-target-reconcile.ts
index 2206666..6004439 100644
--- a/tmp/project-shrimp-phase5-location-opening-checker.ts
+++ b/scripts/decisions-migration-target-reconcile.ts
@@ -106,6 +106,7 @@ type TargetComponents = {
   indexRow?: string;
 };
 type Report = { number: number; title: string; detail: string; failures: string[] };
+type PhysicalLines = { values: string[] };
 
 function sha256(value: Buffer | string): string {
   return createHash("sha256").update(value).digest("hex");
@@ -119,6 +120,87 @@ function strictUtf8(value: Buffer, source: string): string {
   }
 }
 
+function physicalLines(text: string): PhysicalLines {
+  return { values: text.split("\n") };
+}
+
+function lineAt(
+  lines: PhysicalLines,
+  lineNumber: number,
+  label: string,
+  failures: string[],
+): string | null {
+  if (!Number.isInteger(lineNumber) || lineNumber < 1 || lineNumber > lines.values.length) {
+    failures.push(`${label}: line ${lineNumber} is outside 1..${lines.values.length}`);
+    return null;
+  }
+  return lines.values[lineNumber - 1];
+}
+
+function sliceLines(
+  lines: PhysicalLines,
+  startLine: number,
+  endLine: number,
+  label: string,
+  failures: string[],
+): string | null {
+  if (
+    !Number.isInteger(startLine) ||
+    !Number.isInteger(endLine) ||
+    startLine < 1 ||
+    endLine > lines.values.length ||
+    endLine < startLine
+  ) {
+    failures.push(
+      `${label}: invalid line range ${startLine}..${endLine} for 1..${lines.values.length}`,
+    );
+    return null;
+  }
+  return lines.values.slice(startLine - 1, endLine).join("\n");
+}
+
+function lastNonBlankBefore(
+  lines: PhysicalLines,
+  beforeLine: number,
+  floorLine: number,
+  label: string,
+  failures: string[],
+): number | null {
+  if (
+    !Number.isInteger(beforeLine) ||
+    !Number.isInteger(floorLine) ||
+    floorLine < 1 ||
+    beforeLine > lines.values.length + 1 ||
+    beforeLine <= floorLine
+  ) {
+    failures.push(
+      `${label}: invalid backward boundary before ${beforeLine} with floor ${floorLine}`,
+    );
+    return null;
+  }
+  for (let lineNumber = beforeLine - 1; lineNumber >= floorLine; lineNumber -= 1) {
+    const value = lineAt(lines, lineNumber, label, failures);
+    if (value === null) return null;
+    if (!/^\s*$/.test(value)) return lineNumber;
+  }
+  failures.push(`${label}: no nonblank line exists before ${beforeLine} at or after ${floorLine}`);
+  return null;
+}
+
+function compareLocatedSurface(
+  name: string,
+  actual: string | null,
+  expected: string | undefined,
+  authority: string,
+  failures: string[],
+): void {
+  if (expected === undefined) {
+    failures.push(`${name}: expected payload is absent from ${authority}`);
+  } else if (actual !== null && actual !== expected) {
+    failures.push(`${name}: location-bound target bytes differ from ${authority}`);
+  }
+}
+
 function parseOverrides(argv: string[]): { target: string; archive: string; snapshot: string } {
   const result = { target: PATHS.target, archive: PATHS.archive, snapshot: PATHS.snapshot };
   const seen = new Set<string>();
@@ -399,7 +481,9 @@ function reportLine(report: Report): string {
 }
 
 function main(): void {
-  const overrides = parseOverrides(process.argv.slice(2));
+  const overrideArguments = process.argv.slice(2);
+  const overrides = parseOverrides(overrideArguments);
+  const testOverrideActive = overrideArguments.length > 0;
   const globalFailures: string[] = [];
 
   const manifestBuffer = readFileSync(PATHS.manifest);
@@ -464,6 +548,7 @@ function main(): void {
 
   const parsedTarget = parseDecisionsDocument(targetText, overrides.target);
   const parsedArchive = parseArchiveDocument(archiveText, overrides.archive);
+  const targetLines = physicalLines(targetText);
   const targetEntryGroups = new Map<string, LiveEntry[]>();
   for (const entry of parsedTarget.entries) {
     const group = targetEntryGroups.get(entry.blockKey) ?? [];
@@ -710,16 +795,169 @@ function main(): void {
     report8.failures.push(`target parse issue: ${formatted}`);
   }
 
-  const amendment2Failures: string[] = [];
-  const surfaces = amendment2Surfaces(amendment2Text, amendment2Failures);
+  const amendment2AuthorityFailures: string[] = [];
+  const amendment2LocationFailures: string[] = [];
+  const amendment2UniquenessFailures: string[] = [];
+  const e053LocationFailures: string[] = [];
+  const e053UniquenessFailures: string[] = [];
+  const archiveIndexLocationFailures: string[] = [];
+  const archiveIndexUniquenessFailures: string[] = [];
+  const requiredSectionUniquenessFailures: string[] = [];
+  const amendment4BaseFailures: string[] = [];
+
+  const surfaces = amendment2Surfaces(amendment2Text, amendment2AuthorityFailures);
+  const surfaceByName = new Map(surfaces.map((surface) => [surface.name, surface.payload]));
+
+  const sectionOccurrences = new Map<number, number[]>();
+  for (let index = 0; index < targetLines.values.length; index += 1) {
+    const match = /^## (\d+)(?:\.|\s|$)/.exec(targetLines.values[index]);
+    if (!match) continue;
+    const section = Number(match[1]);
+    if (section < 3 || section > 8) continue;
+    const occurrences = sectionOccurrences.get(section) ?? [];
+    occurrences.push(index + 1);
+    sectionOccurrences.set(section, occurrences);
+  }
+  const sectionLines = new Map<number, number>();
+  for (let section = 3; section <= 8; section += 1) {
+    const occurrences = sectionOccurrences.get(section) ?? [];
+    if (occurrences.length === 1) {
+      sectionLines.set(section, occurrences[0]);
+      continue;
+    }
+    const message = `§${section} top-level section locator found ${occurrences.length} headings; expected exactly 1`;
+    requiredSectionUniquenessFailures.push(message);
+    if (section === 8) {
+      e053LocationFailures.push(message);
+      archiveIndexLocationFailures.push(message);
+    } else {
+      amendment2LocationFailures.push(message);
+    }
+  }
+
+  const section3Line = sectionLines.get(3);
+  if (parsedTarget.index.rows.length === 0) {
+    amendment2LocationFailures.push("§3 surfaces: parsed entry index has no rows");
+  } else if (section3Line !== undefined) {
+    const firstIndexRowLine = parsedTarget.index.rows[0].line;
+    const headerLine = firstIndexRowLine - 2;
+    const separatorLine = firstIndexRowLine - 1;
+    if (headerLine <= section3Line) {
+      amendment2LocationFailures.push(
+        `§3 surfaces: derived header line ${headerLine} is not strictly after section heading line ${section3Line}`,
+      );
+    } else {
+      const introductionEnd = lastNonBlankBefore(
+        targetLines,
+        headerLine,
+        section3Line,
+        "§3 introduction",
+        amendment2LocationFailures,
+      );
+      const introduction = introductionEnd === null
+        ? null
+        : sliceLines(
+            targetLines,
+            section3Line,
+            introductionEnd,
+            "§3 introduction",
+            amendment2LocationFailures,
+          );
+      compareLocatedSurface(
+        "§3 introduction",
+        introduction,
+        surfaceByName.get("§3 introduction"),
+        "ratified Amendment 2 §2.1",
+        amendment2LocationFailures,
+      );
+    }
+    compareLocatedSurface(
+      "§3 table header",
+      lineAt(targetLines, headerLine, "§3 table header", amendment2LocationFailures),
+      surfaceByName.get("§3 table header"),
+      "ratified Amendment 2 §2.2",
+      amendment2LocationFailures,
+    );
+    compareLocatedSurface(
+      "§3 table separator",
+      lineAt(targetLines, separatorLine, "§3 table separator", amendment2LocationFailures),
+      surfaceByName.get("§3 table separator"),
+      "ratified Amendment 2 §2.2",
+      amendment2LocationFailures,
+    );
+
+    const declaredTotalLine = parsedTarget.index.declaredTotalLine;
+    const lastIndexRowLine = parsedTarget.index.rows.at(-1)?.line ?? firstIndexRowLine;
+    if (declaredTotalLine === undefined) {
+      amendment2LocationFailures.push("§3 declared total: parser exposed no declared-total line");
+    } else if (declaredTotalLine <= lastIndexRowLine) {
+      amendment2LocationFailures.push(
+        `§3 declared total: line ${declaredTotalLine} is not after last index row line ${lastIndexRowLine}`,
+      );
+    } else {
+      compareLocatedSurface(
+        "§3 declared total",
+        lineAt(
+          targetLines,
+          declaredTotalLine,
+          "§3 declared total",
+          amendment2LocationFailures,
+        ),
+        surfaceByName.get("§3 declared total"),
+        "ratified Amendment 2 §2.2",
+        amendment2LocationFailures,
+      );
+    }
+  }
+
+  for (const section of [4, 5, 6, 7] as const) {
+    const entries = parsedTarget.entries.filter((entry) => entry.section === section);
+    const sectionLine = sectionLines.get(section);
+    const name = `§${section} heading/transition`;
+    if (entries.length === 0) {
+      amendment2LocationFailures.push(`${name}: parser exposed no entries in section ${section}`);
+      continue;
+    }
+    if (entries.some((entry) => entry.section !== section)) {
+      amendment2LocationFailures.push(`${name}: an entry used for the boundary reports another section`);
+      continue;
+    }
+    if (sectionLine === undefined) continue;
+    const firstEntryLine = Math.min(...entries.map((entry) => entry.line));
+    if (firstEntryLine <= sectionLine) {
+      amendment2LocationFailures.push(
+        `${name}: first entry line ${firstEntryLine} is not after section heading line ${sectionLine}`,
+      );
+      continue;
+    }
+    const endLine = lastNonBlankBefore(
+      targetLines,
+      firstEntryLine,
+      sectionLine,
+      name,
+      amendment2LocationFailures,
+    );
+    const actual = endLine === null
+      ? null
+      : sliceLines(targetLines, sectionLine, endLine, name, amendment2LocationFailures);
+    compareLocatedSurface(
+      name,
+      actual,
+      surfaceByName.get(name),
+      "ratified Amendment 2 §2.3",
+      amendment2LocationFailures,
+    );
+  }
+
   for (const surface of surfaces) {
     const occurrences = countOccurrences(targetText, surface.payload);
     if (occurrences !== 1) {
-      amendment2Failures.push(`${surface.name}: exact ratified payload occurs ${occurrences} times in target; expected 1`);
+      amendment2UniquenessFailures.push(
+        `${surface.name}: global exact-payload uniqueness found ${occurrences} occurrences; expected 1`,
+      );
     }
   }
 
-  const amendment4Failures: string[] = [];
   const amendment4Section = amendment4Text.slice(
     amendment4Text.indexOf("## 6. E053 correction"),
     amendment4Text.indexOf("\n---", amendment4Text.indexOf("## 6. E053 correction")),
@@ -730,41 +968,129 @@ function main(): void {
     "3. **The normalized migration archive therefore carries exactly 13 wrappers and 13 archive-index lines.**",
     "4. **Reconciliation:** 65 live blocks + 13 archive wrappers + 1 structural `E053` row + 1 `MERGE_INTO` row (`E037` → `E039a`, `E002`, `E006`) = **80** original inventory rows accounted for.",
   ]) {
-    if (!amendment4Section.includes(required)) amendment4Failures.push(`ratified Amendment 4 §6 is missing: ${required}`);
+    if (!amendment4Section.includes(required)) amendment4BaseFailures.push(`ratified Amendment 4 §6 is missing: ${required}`);
   }
   const historicalArchiveIds = migrationRows
     .filter((row) => row.destination === "ARCHIVE")
     .map((row) => row.id);
   if (historicalArchiveIds.length !== 14 || !historicalArchiveIds.includes("E053")) {
-    amendment4Failures.push(`frozen migration table historical ARCHIVE population is ${historicalArchiveIds.length} and E053 membership=${historicalArchiveIds.includes("E053")}; expected 14 and true`);
+    amendment4BaseFailures.push(`frozen migration table historical ARCHIVE population is ${historicalArchiveIds.length} and E053 membership=${historicalArchiveIds.includes("E053")}; expected 14 and true`);
   }
   if (!outlineDestinations.includes("E053") || tableAfterHeading(outlineText, "### Authoritative destination table").filter((row) => cleanCell(row[1] ?? "") === "§8").length !== 14) {
-    amendment4Failures.push("frozen outline does not classify E053 within exactly 14 historical §8 destinations");
+    amendment4BaseFailures.push("frozen outline does not classify E053 within exactly 14 historical §8 destinations");
   }
-  if (!inventoryIds.includes("E053")) amendment4Failures.push("frozen inventory is missing E053");
-  if (wrapperSourceIds.includes("E053")) amendment4Failures.push("E053 incorrectly has an archive wrapper record");
+  if (!inventoryIds.includes("E053")) amendment4BaseFailures.push("frozen inventory is missing E053");
+  if (wrapperSourceIds.includes("E053")) amendment4BaseFailures.push("E053 incorrectly has an archive wrapper record");
   const e053Payload = fencedAfter(
     manifestText.slice(manifestText.indexOf("### M5.4 "), manifestText.indexOf("### M5.5 ")),
     "### M5.4 Target §8 structural introduction — `E053`",
     "markdown",
   );
-  if (e053Payload === null || countOccurrences(targetText, e053Payload) !== 1) {
-    amendment4Failures.push("target §8 does not contain the manifest-pinned structural E053 payload exactly once");
-  } else if (e053Payload.split("\n").some((line) => line.startsWith("- **"))) {
-    amendment4Failures.push("target structural E053 prose takes the forbidden archive-index line shape");
-  }
   const archiveIndexPayload = fencedAfter(
     manifestText.slice(manifestText.indexOf("### M5.6 "), manifestText.indexOf("### M5.7 ")),
     "### M5.6 The thirteen archive-index lines, assembled",
     "markdown",
   );
-  if (archiveIndexPayload === null || countOccurrences(targetText, archiveIndexPayload) !== 1) {
-    amendment4Failures.push("target §8 does not contain the manifest-pinned 13-line archive-index block exactly once");
+
+  let targetE053Surface: string | null = null;
+  const section8Line = sectionLines.get(8);
+  if (parsedTarget.archiveIndex.length !== PINNED.archiveIndexLines) {
+    const message = `§8 structural extraction requires ${PINNED.archiveIndexLines} parsed archive-index entries; found ${parsedTarget.archiveIndex.length}`;
+    e053LocationFailures.push(message);
+    archiveIndexLocationFailures.push(message);
+  } else if (section8Line !== undefined) {
+    const firstArchiveLine = parsedTarget.archiveIndex[0].line;
+    if (firstArchiveLine <= section8Line) {
+      e053LocationFailures.push(
+        `§8 structural introduction: first archive-index line ${firstArchiveLine} is not after section heading line ${section8Line}`,
+      );
+    } else {
+      const e053EndLine = lastNonBlankBefore(
+        targetLines,
+        firstArchiveLine,
+        section8Line,
+        "§8 structural introduction / E053",
+        e053LocationFailures,
+      );
+      targetE053Surface = e053EndLine === null
+        ? null
+        : sliceLines(
+            targetLines,
+            section8Line,
+            e053EndLine,
+            "§8 structural introduction / E053",
+            e053LocationFailures,
+          );
+      compareLocatedSurface(
+        "§8 structural introduction / E053",
+        targetE053Surface,
+        e053Payload ?? undefined,
+        "manifest M5.4",
+        e053LocationFailures,
+      );
+    }
+
+    const thirteenthLabelLine = parsedTarget.archiveIndex[12].line;
+    const pointerLine = thirteenthLabelLine + 1;
+    if (lineAt(targetLines, pointerLine, "§8 archive-index final pointer", archiveIndexLocationFailures) !== null) {
+      const actualArchiveIndex = sliceLines(
+        targetLines,
+        firstArchiveLine,
+        pointerLine,
+        "§8 archive-index block",
+        archiveIndexLocationFailures,
+      );
+      compareLocatedSurface(
+        "§8 archive-index block",
+        actualArchiveIndex,
+        archiveIndexPayload ?? undefined,
+        "manifest M5.6",
+        archiveIndexLocationFailures,
+      );
+    }
+  }
+
+  if (targetE053Surface !== null && targetE053Surface.split("\n").some((line) => line.startsWith("- **"))) {
+    e053LocationFailures.push("target §8 structural introduction contains an archive-index-shaped line beginning `- **`");
+  }
+
+  if (e053Payload === null) {
+    e053UniquenessFailures.push("manifest M5.4 expected payload is missing");
+  } else {
+    const occurrences = countOccurrences(targetText, e053Payload);
+    if (occurrences !== 1) {
+      e053UniquenessFailures.push(
+        `manifest M5.4 global exact-payload uniqueness found ${occurrences} occurrences; expected 1`,
+      );
+    }
+  }
+  if (archiveIndexPayload === null) {
+    archiveIndexUniquenessFailures.push("manifest M5.6 expected payload is missing");
+  } else {
+    const occurrences = countOccurrences(targetText, archiveIndexPayload);
+    if (occurrences !== 1) {
+      archiveIndexUniquenessFailures.push(
+        `manifest M5.6 global exact-payload uniqueness found ${occurrences} occurrences; expected 1`,
+      );
+    }
   }
   if (parsedArchive.wrappers.length !== 13 || parsedTarget.archiveIndex.length !== 13) {
-    amendment4Failures.push(`corrected E053 reconciliation found ${parsedArchive.wrappers.length} wrappers and ${parsedTarget.archiveIndex.length} archive-index lines; expected 13 and 13`);
+    amendment4BaseFailures.push(`corrected E053 reconciliation found ${parsedArchive.wrappers.length} wrappers and ${parsedTarget.archiveIndex.length} archive-index lines; expected 13 and 13`);
   }
 
+  const amendment2Failures = [
+    ...amendment2AuthorityFailures,
+    ...amendment2LocationFailures,
+    ...amendment2UniquenessFailures,
+  ];
+  const amendment4Failures = [
+    ...amendment4BaseFailures,
+    ...e053LocationFailures,
+    ...e053UniquenessFailures,
+    ...archiveIndexLocationFailures,
+    ...archiveIndexUniquenessFailures,
+  ];
+
   const reports = [report1, report2, report3, report4, report5, report6, report7, report8];
   for (const report of reports) console.log(reportLine(report));
   console.log(
@@ -776,6 +1102,12 @@ function main(): void {
   console.log(
     `Amendment 4 E053 [${amendment4Failures.length === 0 ? "PASS" : "FAIL"}] — historical 14-entry ARCHIVE classification reconciled to 13 wrappers + 13 index lines + one structural E053 row, with no E053 wrapper or index-line shape.`,
   );
+  if (testOverrideActive) {
+    const verdict = (failures: readonly string[]) => failures.length === 0 ? "PASS" : "FAIL";
+    console.log(
+      `Structural diagnostics [TEST] — required sections unique [${verdict(requiredSectionUniquenessFailures)}]; Amendment 2 location-bound [${verdict(amendment2LocationFailures)}]; Amendment 2 global uniqueness [${verdict(amendment2UniquenessFailures)}]; M5.4 location-bound [${verdict(e053LocationFailures)}]; M5.4 global uniqueness [${verdict(e053UniquenessFailures)}]; M5.6 location-bound [${verdict(archiveIndexLocationFailures)}]; M5.6 global uniqueness [${verdict(archiveIndexUniquenessFailures)}]; parsed §8 archive-index count [${parsedTarget.archiveIndex.length === PINNED.archiveIndexLines ? "PASS" : "FAIL"}] (${parsedTarget.archiveIndex.length}).`,
+    );
+  }
   const allFailures = [
     ...globalFailures.map((message) => `Authority/input: ${message}`),
     ...reports.flatMap((report) => report.failures.map((message) => `Report ${report.number}: ${message}`)),
```

## Constitutional and canonical verification — Step 5

`npx tsc -b --pretty false` exited 0 with the following complete verbatim output (zero bytes):

```text
```

`npm run reconcile:decisions-migration` exited 0 with the following complete verbatim output:

```text

> nclex-bilingual-prep@0.1.0 reconcile:decisions-migration
> tsx scripts/decisions-migration-reconcile.ts

DECISIONS migration reconciliation passed.
inventory=80; independent=79; STAY=65; ARCHIVE=14; MERGE_INTO=1
sections: §4=37 (25 permanent numbers), §5=6, §6=19, §7=3, §8=14
```

`npm run reconcile:decisions-migration-target` exited 0 with the following complete verbatim output:

```text

> nclex-bilingual-prep@0.1.0 reconcile:decisions-migration-target
> tsx scripts/decisions-migration-target-reconcile.ts

Report 1 [PASS] — source-row accounting: 65 live / 13 wrappers / 1 structural E053 / 1 MERGE_INTO E037 = 80
Report 2 [PASS] — section totals and identifier allocation: P=37 / R=6 / I=19 / T=3; allocation unions P1–P31 and R1–R6
Report 3 [PASS] — wrapper source-span and hash preservation: 13 baseline Buffer spans verified and matched to the corresponding parsed wrapper body
Report 4 [PASS] — preservation snapshot exact equality: snapshot bytes compared directly to git-show MIGRATION_BASELINE:DECISIONS.md
Report 5 [PASS] — no unaccounted source entry: the independently pinned 80-row population is fully covered by target dispositions
Report 6 [PASS] — no duplicate destination accounting: each of the 80 source rows occupies exactly one of the four target disposition classes
Report 7 [PASS] — no target block absent from the manifest: 65 live blocks checked by identity and exact manifest-owned heading/statement/field/index bytes
Report 8 [PASS] — no manifest block absent from target output: 65 manifest records checked by identity and exact manifest-owned heading/statement/field/index bytes
Amendment 2 surfaces [PASS] — eight ratified structural surfaces checked byte-for-byte in target DECISIONS.md.
Amendment 3 joins [SCOPE] — join bytes and the end-of-document byte are outside this Phase 5 checker's byte-verification scope; authority is ratified Amendment 3, covered by Phase 4's 272-entry join ledger, independent whole-document reconstruction, and pre/post-write checkDecisionsFormat runs accepted at Phase 4 closeout.
Amendment 4 E053 [PASS] — historical 14-entry ARCHIVE classification reconciled to 13 wrappers + 13 index lines + one structural E053 row, with no E053 wrapper or index-line shape.
DECISIONS target reconciliation passed.
```

The command wrapper emitted one conventional leading LF before the npm banner. Excluding that
non-transcript framing byte, the canonical target-checker transcript is 1905 bytes / SHA-256
`29efcc7c0f2318a51f9dac52d63c454c2ac624c9a81a8377fe694e159aa25c75` and is byte-for-byte
identical (`cmp` exit 0) to the 1905-byte transcript extracted before implementation from the
preserved original Phase 5 receipt. No report line or transcript byte diverged.

## Negative-control matrix — Step 6

All fixtures were ephemeral copies beneath `/tmp/project-shrimp-phase5-location.xzNEgl`; that entire
scratch directory was removed after execution. Every run used the existing three-flag test interface.
Every run exited 1. Immediately after every run, canonical `DECISIONS.md`, normalized archive, and
preservation snapshot hashes were rechecked as
`3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8`,
`e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c`, and
`b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`, respectively.

### Control 1 — delete one complete live block

Command:

```text
npx tsx scripts/decisions-migration-target-reconcile.ts --target /tmp/project-shrimp-phase5-location.xzNEgl/c1/target.md --archive /tmp/project-shrimp-phase5-location.xzNEgl/c1/archive.md --snapshot /tmp/project-shrimp-phase5-location.xzNEgl/c1/snapshot.md
```

Exit: 1. Reports 1, 2, 7, and 8 failed. Exact relevant failures:

```text
FAIL: Report 1: target live blocks: found 64, pinned 65
FAIL: Report 2: P blocks: found 36, pinned 37
FAIL: Report 2: 1 is in pinned P1–P31 but not P allocation union
FAIL: Report 7: live-block bijection cardinality differs: target 64, manifest 65
FAIL: Report 8: live-block bijection cardinality differs: target 64, manifest 65
FAIL: Report 8: P1#0: target block occurrences 0, target index-row occurrences 1
```

### Control 2 — identity-preserving live statement mutation

Command:

```text
npx tsx scripts/decisions-migration-target-reconcile.ts --target /tmp/project-shrimp-phase5-location.xzNEgl/c2/target.md --archive /tmp/project-shrimp-phase5-location.xzNEgl/c2/archive.md --snapshot /tmp/project-shrimp-phase5-location.xzNEgl/c2/snapshot.md
```

Exit: 1. Reports 7 and 8 failed; all other numbered reports passed. Exact relevant failures:

```text
FAIL: Report 7: P1#0: exact statement bytes differ from manifest
FAIL: Report 8: P1#0: exact statement bytes differ from manifest
```

### Control 3 — normalized wrapper-body mutation

Command:

```text
npx tsx scripts/decisions-migration-target-reconcile.ts --target /tmp/project-shrimp-phase5-location.xzNEgl/c3/target.md --archive /tmp/project-shrimp-phase5-location.xzNEgl/c3/archive.md --snapshot /tmp/project-shrimp-phase5-location.xzNEgl/c3/snapshot.md
```

Exit: 1. Report 3 failed; all other numbered reports passed. Exact relevant failure:

```text
FAIL: Report 3: E040/P9#0: corresponding wrapper body does not preserve its pinned baseline span
```

### Control 4 — preservation-snapshot mutation

Command:

```text
npx tsx scripts/decisions-migration-target-reconcile.ts --target /tmp/project-shrimp-phase5-location.xzNEgl/c4/target.md --archive /tmp/project-shrimp-phase5-location.xzNEgl/c4/archive.md --snapshot /tmp/project-shrimp-phase5-location.xzNEgl/c4/snapshot.md
```

Exit: 1. Report 4 failed; all other numbered reports passed. Exact relevant failure:

```text
FAIL: Report 4: preservation snapshot differs from MIGRATION_BASELINE (snapshot 76314 bytes/b4d0693e03899f69ddbec1045d237048f7ef9bc9d24c19662b4b8e828c5564f1, baseline 76314 bytes/b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e)
```

### Control 5 — uncompensated §4 transition mutation

Command:

```text
npx tsx scripts/decisions-migration-target-reconcile.ts --target /tmp/project-shrimp-phase5-location.xzNEgl/c5/target.md --archive /tmp/project-shrimp-phase5-location.xzNEgl/c5/archive.md --snapshot /tmp/project-shrimp-phase5-location.xzNEgl/c5/snapshot.md
```

Exit: 1. Reports 1–8 remained pass; Amendment 2 failed. Exact diagnostic and failures:

```text
Structural diagnostics [TEST] — required sections unique [PASS]; Amendment 2 location-bound [FAIL]; Amendment 2 global uniqueness [FAIL]; M5.4 location-bound [PASS]; M5.4 global uniqueness [PASS]; M5.6 location-bound [PASS]; M5.6 global uniqueness [PASS]; parsed §8 archive-index count [PASS] (13).
FAIL: Amendment 2 surfaces: §4 heading/transition: location-bound target bytes differ from ratified Amendment 2 §2.3
FAIL: Amendment 2 surfaces: §4 heading/transition: global exact-payload uniqueness found 0 occurrences; expected 1
```

### Control 6 — Amendment 2 compensated relocation

The canonical §4 transition had one parser-neutral byte corrupted. A pristine §4 payload remained an
exact substring after a non-newline sentinel in synthetic §9, so it was not a structural heading.

Command:

```text
npx tsx scripts/decisions-migration-target-reconcile.ts --target /tmp/project-shrimp-phase5-location.xzNEgl/c6/target.md --archive /tmp/project-shrimp-phase5-location.xzNEgl/c6/archive.md --snapshot /tmp/project-shrimp-phase5-location.xzNEgl/c6/snapshot.md
```

Exit: 1. Required-section uniqueness was `PASS`; Amendment 2 global uniqueness was `PASS`; Amendment
2 location-bound equality was `FAIL`. Reports 1–8, M5.4, M5.6, and the 13-entry archive-index count
remained pass. Exact diagnostic and failure:

```text
Structural diagnostics [TEST] — required sections unique [PASS]; Amendment 2 location-bound [FAIL]; Amendment 2 global uniqueness [PASS]; M5.4 location-bound [PASS]; M5.4 global uniqueness [PASS]; M5.6 location-bound [PASS]; M5.6 global uniqueness [PASS]; parsed §8 archive-index count [PASS] (13).
FAIL: Amendment 2 surfaces: §4 heading/transition: location-bound target bytes differ from ratified Amendment 2 §2.3
```

### Control 7 — M5.4 / E053 compensated relocation

One parser-neutral byte in canonical §8 introduction prose was corrupted. A pristine M5.4 payload
remained an exact substring after a non-newline sentinel in synthetic §9.

Command:

```text
npx tsx scripts/decisions-migration-target-reconcile.ts --target /tmp/project-shrimp-phase5-location.xzNEgl/c7/target.md --archive /tmp/project-shrimp-phase5-location.xzNEgl/c7/archive.md --snapshot /tmp/project-shrimp-phase5-location.xzNEgl/c7/snapshot.md
```

Exit: 1. Required-section uniqueness was `PASS`; M5.4 global uniqueness was `PASS`; M5.4
location-bound equality was `FAIL`. Reports 1–8, both Amendment 2 predicates, both M5.6 predicates,
and the 13-entry archive-index count remained pass. Exact diagnostic and failure:

```text
Structural diagnostics [TEST] — required sections unique [PASS]; Amendment 2 location-bound [PASS]; Amendment 2 global uniqueness [PASS]; M5.4 location-bound [FAIL]; M5.4 global uniqueness [PASS]; M5.6 location-bound [PASS]; M5.6 global uniqueness [PASS]; parsed §8 archive-index count [PASS] (13).
FAIL: Amendment 4 E053: §8 structural introduction / E053: location-bound target bytes differ from manifest M5.4
```

### Control 8 — M5.6 compensated relocation

One byte in descriptive prose after the em dash of the first canonical §8 archive label was corrupted;
the label key and pointer remained intact. A pristine 26-line M5.6 payload was appended beneath
synthetic §9 and remained outside section-8-scoped parsing.

Command:

```text
npx tsx scripts/decisions-migration-target-reconcile.ts --target /tmp/project-shrimp-phase5-location.xzNEgl/c8/target.md --archive /tmp/project-shrimp-phase5-location.xzNEgl/c8/archive.md --snapshot /tmp/project-shrimp-phase5-location.xzNEgl/c8/snapshot.md
```

Exit: 1. Required-section uniqueness was `PASS`; M5.6 global uniqueness was `PASS`; M5.6
location-bound equality was `FAIL`; the parser still returned exactly 13 canonical archive-index
entries. Reports 1–8, both Amendment 2 predicates, and both M5.4 predicates remained pass. Amendment
4 was the only other displayed aggregate to fail. Exact diagnostic and failure:

```text
Structural diagnostics [TEST] — required sections unique [PASS]; Amendment 2 location-bound [PASS]; Amendment 2 global uniqueness [PASS]; M5.4 location-bound [PASS]; M5.4 global uniqueness [PASS]; M5.6 location-bound [FAIL]; M5.6 global uniqueness [PASS]; parsed §8 archive-index count [PASS] (13).
FAIL: Amendment 4 E053: §8 archive-index block: location-bound target bytes differ from manifest M5.6
```

## Closing measurement and exact set comparison — Step 7

All read-only inputs retained their Step 1 size and digest. The preservation snapshot remained
byte-identical (`cmp` exit 0) to `git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md`.

| input | closing bytes | closing SHA-256 / comparison |
|---|---:|---|
| Phase 5 revision-2 work order | 33073 | `75cc6db647afd6f8e6e0950ac885ba5c7b225489bb73b03236d81f3eca66ceac` |
| `DECISIONS.md` | 56964 | `3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8` |
| preservation snapshot | 76314 | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`; exact baseline equality |
| normalized archive | 13997 | `e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c` |
| ratified Stage 2a manifest | 332579 | `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` |
| ratified Amendment 2 | 24202 | `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4` |
| ratified Amendment 3 | 26963 | `9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e` |
| ratified Amendment 4 | 22665 | `5d70d7f61ef1243a70ea59b8de0aee7b25dada45672ee93e203e808dfff14827` |
| `package.json` | 8542 | `8f0ade576da1515e7400b7f6c54990b4ae71ea2cd5b1846b7f788d71ab4af582` |
| target checker, closing bytes | 47448 | `bd89de205fa873f8f65824e607a950c68dfe33cdc926dc1317e1d63b7aac2639` |
| original Phase 5 receipt | 14247 | `d1faf387c451346aec4311e6a041f4f29e62f7546d8b80070bad479c5079b195` |
| frozen historical checker | 20631 | `be8f258b6d0145b91a5e4605f920c84e668a0396742b3fb88773c0bcbb5f8420` |
| frozen inventory | 28554 | `cfae5a898c1520173d835af5d0e29b4c0bfd2b135a40fb4335de82b34da1333e` |
| frozen migration table | 16833 | `89a2812dc955a61e45723bf6c242e247f467df71c7daa301b4fde2fcae1a4535` |
| frozen outline | 9878 | `3821323c711866e655fd25b044add86c33cdc859762a4aa6f62d522ff158440e` |

The complete verbatim closing `git status --porcelain=v1 --untracked-files=all` output is:

```text
 M DECISIONS.md
 M lib/decisions-format.ts
 M package.json
 M scripts/tests/decisions-format.ts
?? Archive/DECISIONS-ARCHIVE-2026-08-18.md
?? Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-RATIFICATION-2026-08-08.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-STRUCTURAL-SURFACES-2026-08-08.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-ASSEMBLY-JOINS-2026-08-08.md
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-RATIFICATION-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-BLOCK-GROUPING-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-OCCURRENCE-CENSUS-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-ADDENDUM-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DERIVED-REPORT-VALIDATION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-COMPLETION-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-FRESH-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-FRESH-REVIEW-NARROW-RECOMMISSION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-GPT-DETERMINISTIC-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HEADER-MEASUREMENT-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-CONFIRMING-READ-RERUN-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-RESERVATION-RECORDING-REPAIR-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.35-EXCLUSIVITY-REPAIR-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.35-SENTENCE-COUNT-REPAIR-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.4-ADJACENT-WHITESPACE-REPAIR-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-PRE-CENSUS-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-BINDING-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-AUTHORING-WORK-ORDER-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PATH-CANDIDATE-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-F16-CORRECTION-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-2-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-2-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-3-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-3-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CLOSEOUT-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CODEX-HANDOFF-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-WORK-ORDER-2026-08-08.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-5-CODEX-HANDOFF-2026-08-11.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-CODEX-HANDOFF-2026-08-11.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-WORK-ORDER-2026-08-11.md
?? DECISIONS-MIGRATION-STAGE-2B-PHASE-5-RECONCILIATION-CHECKER-WORK-ORDER-2026-08-11.md
?? audit/decisions-migration-2026-07-29/DATE-OCCURRENCE-CENSUS-2026-08-07.md
?? audit/decisions-migration-2026-07-29/DERIVED-REPORT-STEP-6-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/DERIVED-REPORT-VALIDATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FOUR-FINDING-REPAIR-REPORT-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FOUR-FINDING-REPAIR-VERIFICATION-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-A-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-B-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-C-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-D-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-TRANCHE-E-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FRESH-REVIEW-NARROW-RECOMMISSION-SUPPLEMENTAL-DISPOSITION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-COMMISSION-STATUS-RECORD-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-DISPOSITION-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-A-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-B-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-C-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-D-2026-08-06.md
?? audit/decisions-migration-2026-07-29/FULL-REVIEW-TRANCHE-E-2026-08-06.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-REPAIR-REPORT-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-RERUN-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-VOID-RECEIPT-ADJUDICATION-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-RESERVATION-RECORDING-CONFIRMATION-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4-RESERVATION-RECORDING-REPAIR-REPORT-2026-08-05.md
?? audit/decisions-migration-2026-07-29/M4.35-EXCLUSIVITY-REPAIR-REPORT-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-EXCLUSIVITY-REPAIR-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-CONFIRMING-READ-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-REPAIR-REPORT-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-REPAIR-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/M4.4-ADJACENT-WHITESPACE-REPAIR-REPORT-2026-08-06.md
?? audit/decisions-migration-2026-07-29/M4.4-ADJACENT-WHITESPACE-REPAIR-VERIFICATION-2026-08-06.md
?? audit/decisions-migration-2026-07-29/M5-REPAIR-INDEPENDENT-COLD-REVIEW-FINAL-2026-08-04.md
?? audit/decisions-migration-2026-07-29/M6-PARTIAL-M6-ONLY-SNAPSHOT-2026-08-04.md.frozen
?? audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-RESUME-NOTE-SNAPSHOT-2026-08-04.md.frozen
?? audit/decisions-migration-2026-07-29/M6-PRE-REPAIR-SNAPSHOT-2026-08-04.md.frozen
?? audit/decisions-migration-2026-07-29/M6-REPAIR-PRE-CENSUS-2026-08-04.md
?? audit/decisions-migration-2026-07-29/M6-REPAIR-REPORT-2026-08-04.md
?? audit/decisions-migration-2026-07-29/M6-REPAIR-VERIFICATION-2026-08-04.md
?? audit/decisions-migration-2026-07-29/POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-2026-08-07.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08-RESUMPTION.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-2-PRESERVATION-SNAPSHOT-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-REPORT-2026-08-08.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-REPORT-2026-08-11.md
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-TARGET-RECONCILE-REPORT-2026-08-11.md
?? audit/decisions-migration-2026-07-29/STEP-3-SURFACE-MAPPING-2026-08-07.md
?? audit/decisions-migration-2026-07-29/TASK-2-TASK-3-REMEASUREMENT-2026-08-07.md
?? audit/decisions-migration-2026-07-29/target-text-manifest.md
?? scripts/decisions-migration-target-reconcile.ts
```

The closing census has 127 status lines versus 126 at opening. Exact sorted set comparison in both
directions produced:

```text
closing − opening:
?? audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-REPORT-2026-08-11.md

opening − closing:
(empty)
```

Thus the closing untracked path set equals the opening untracked path set plus exactly the authorized
repair report. No opening untracked path disappeared and no other untracked path appeared. The
modified tracked paths remain exactly `DECISIONS.md`, `lib/decisions-format.ts`, `package.json`, and
`scripts/tests/decisions-format.ts`; the staged-path set is empty. Relative to the captured opening
checker bytes, the only executable implementation diff is
`scripts/decisions-migration-target-reconcile.ts`; the only new repository path is this report.

## Overall disposition

`PASS` — all authorized location-binding repairs, canonical gates, eight negative controls, frozen-identity checks, and exact opening-to-closing path-set checks passed.
