# R9 age-marker week-unit + subject-noun-modifier hardening — Codex spec

Status: approved, bounded, ready to implement. Not blocking any open batch — Batch 18 is closed and
unaffected (`population: "peds_infant"` was already correctly authored there regardless of this gap).

## Origin

Reviewing Batch 18's `gemini_gap_case_pyloric_stenosis_01/ex2_labs` (case stem: *"A 6-week-old male
infant is brought to the pediatric clinic..."*), the R9 gate WARNed instead of hard-failing when
`population` was hypothetically left unset. Tracing why surfaced two real bugs in
`scripts/exhibit-flowsheet-gate.ts`, both pre-existing and untouched by this week's R9
context-provenance fix (2026-07-13, `DECISIONS.md`) — that fix changed *where* the detector runs
stricter (case-wide `context` vs. local exhibit text), not the age-marker parsing itself.

## Bug 1 — non-month/year units silently misparse as years

`englishPediatricAgeMarkers` (~line 411-422):

```ts
const re = /\b(\d{1,3})\s*(?:-\s*)?(years?|yrs?|months?|mos?)(?:\s*-\s*old|\s+old)?\b/gi;
...
const pediatric = unit.startsWith("month") || unit.startsWith("mo") ? age < 216 : age < 18;
```

The unit alternation only recognizes `years?|yrs?|months?|mos?` — `weeks?`/`wks?` don't match at all
today, so "6-week-old" is currently invisible to this function entirely (it falls through to the
general noun-regex `unscoped` catch via the word "infant" elsewhere in the sentence, which is why
Batch 18 only WARNed rather than crashing — but a case with no bare pediatric noun nearby would
silently pass with **no signal at all**).

**Do not fix this by simply adding `weeks?` to the unit alternation.** The ternary treats *any*
non-month unit as years, comparing the raw number against `18`. A 20-week-old would parse as
`age=20`, fall into the `: age < 18` branch, and evaluate `20 < 18 → false` — silently
misclassified as **not pediatric**, which is worse than the current invisibility.

**Required fix:** give weeks their own branch with a week-scaled threshold, not a raw-number
comparison against the years threshold:

```ts
const re = /\b(\d{1,3})\s*(?:-\s*)?(years?|yrs?|months?|mos?|weeks?|wks?)(?:\s*-\s*old|\s+old)?\b/gi;
...
const pediatric = unit.startsWith("month") || unit.startsWith("mo")
  ? age < 216
  : unit.startsWith("week") || unit.startsWith("wk")
    ? age < 936 // 18 years in weeks (18 * 52), consistent with the months branch's 18*12
    : age < 18;
```

## Bug 2 — subject-noun check doesn't tolerate a male/female modifier

`englishAgeIsSubjectScoped` (~line 436-444), specifically:

```ts
if (/^\s*(?:patient|client|infant|toddler|newborn|neonate|child|adolescent|boy|girl)\b/i.test(after)) return true;
```

This requires the subject noun to be the *first* word immediately after the age marker. The actual
phrase "A 6-week-old **male infant** is brought..." leaves `male infant is brought...` in `after` —
`male` isn't in the noun list, so this specific check never fires (the case is only saved from total
invisibility by the third, chronology-verb check on the same line-group, which happens to also miss
here — see below).

**Required fix:** allow an optional `male\s+|female\s+` immediately before the noun list:

```ts
if (/^\s*(?:male\s+|female\s+)?(?:patient|client|infant|toddler|newborn|neonate|child|adolescent|boy|girl)\b/i.test(after)) return true;
```

Chinese does **not** need an equivalent change — `男婴`/`女婴`/`男童`/`女童`/`男孩`/`女孩` are already
single lexical tokens in `chineseAgeIsSubjectScoped`'s and `hasSubjectScopedChineseNoun`'s noun
alternations, so "male infant"/"female infant" etc. are already covered on the Chinese side.

## Bilingual parity — Chinese week unit (bring into this same bounded PR)

Per the project's bilingual invariant (`CLAUDE.md`), the Chinese age-marker path has the identical
week gap and should be closed in the same pass, not left as a silent asymmetry:

`chinesePediatricAgeMarkers` (~line 424-434):

```ts
const re = /(\d{1,3})\s*(岁|个月|月龄)/g;
...
const pediatric = match[2] === "岁" ? age < 18 : age < 216;
```

Add a 周/周龄 (week) alternative with the matching week-scaled threshold:

```ts
const re = /(\d{1,3})\s*(岁|个月|月龄|周|周龄)/g;
...
const pediatric = match[2] === "岁" ? age < 18 : (match[2] === "周" || match[2] === "周龄") ? age < 936 : age < 216;
```

## Explicitly out of scope for this PR

**"Day-old" neonatal wording** (e.g., "a 3-day-old infant") is the analogous missing unit one level
down and is a reasonable next candidate, but do not fold it into this pass casually. If Codex wants
to take it in the same PR, it needs its own explicit unit branch (day-scaled threshold, e.g.
`age < 6570` for 18 years in days) and its own regression fixtures, called out as a separate section
— not silently bundled into the week fix's diff.

## Required regression fixtures

Add to `scripts/tests/exhibit-flowsheet-gate.ts`, alongside the existing pediatric-detector fixtures
(the file already has a `pediatricSource`/`populationRecord` helper pattern to follow, and a
context-vs-local split pattern from the 2026-07-13 R9 fix's own fixtures — reuse both):

1. **Positive, context-only, week unit:** `"A 6-week-old male infant is brought to the pediatric
   clinic by his mother..."` as case-wide `context` only (local exhibit text has none of it, matching
   the real pyloric-stenosis shape):
   - `population` unset → `subjectScoped` FAIL
   - `population: "adult"` → still FAIL
   - `population: "peds_infant"` → no FAIL

2. **Week-vs-years misparse guard:** `"A 20-week-old infant is admitted with poor feeding."` — must
   resolve pediatric (age markers should NOT evaluate 20 against the years threshold and pass it as
   non-pediatric). Assert the marker is detected and, when `population` is unset, produces a FAIL.

3. **Related-person boundary preserved:** `"The adult client's 6-week-old infant is brought in for a
   well-child visit."` as context — must **not** produce a subject-scoped FAIL (this is the
   established `(?:patient|client)'s\s+(?:infant|...)` exclusion in `englishAgeIsSubjectScoped`'s
   first check, which must keep working once weeks are recognized as age markers at all). With
   `population: "adult"`, assert no FAIL; assert the existing `unscoped` WARN path still fires.

4. **Existing fixtures must stay green, unmodified:** the `"A 5-year-old client is admitted..."`
   context-only positive fixture and the `opus27_case_ipv_prenatal_care_01`-modeled related-child
   negative fixture added in the 2026-07-13 R9 context-provenance PR. Do not touch those fixtures —
   only add new ones.

5. **Chinese week parity fixture:** a `"6周龄患儿因发热入院。"`-style local-text positive (mirroring
   the existing Chinese fixture loop's style — `pediatricSource(...)` with only `zhText` populated)
   should hard-FAIL when `population` is unset, matching the existing loop's assertion style.

## Verification expected before PR

- `npx tsc -b`
- `npm run test:flowsheet-gate` (new fixtures pass, all existing fixtures unchanged and still pass)
- No bank, ledger, or census changes — this is a pure `scripts/exhibit-flowsheet-gate.ts` +
  `scripts/tests/exhibit-flowsheet-gate.ts` diff. Do not touch `banks/*.json`,
  `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md`, `PROJECT-HISTORY.md`, or `census.json` in this
  PR — those get updated by the checker seat (Claude Code) after independent re-verification, same as
  every other flowsheet tooling PR this cycle.

## Routing

Independent Claude/Sonnet checker-seat review as usual: re-derive the regex behavior against the
required fixtures above plus the real `gemini_gap_case_pyloric_stenosis_01` source text, confirm no
regression against every existing pediatric-detector fixture, then merge.
