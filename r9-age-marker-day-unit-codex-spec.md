# R9 age-marker day-unit extension — Codex spec

Status: implemented and merged in PR #42 on 2026-07-13. Final independent review added explicit
Chinese `6569日龄` and `6570日龄` boundary fixtures before merge; implementation otherwise follows
this approved bounded work order. Sequencing note: the week-unit fix from
`r9-age-marker-week-unit-codex-spec.md` has **already landed on live disk** —
`englishPediatricAgeMarkers`/`chinesePediatricAgeMarkers` in `scripts/exhibit-flowsheet-gate.ts`
already carry the `weeks?|wks?`/`周|周龄` branches at the `age < 936` threshold, and
`englishAgeIsSubjectScoped` already carries the optional `male\s+|female\s+` modifier —
confirmed by direct read 2026-07-13. The stale Batch 18 history wording was reconciled after this
implementation landed. Because the week fix already shipped, this was a standalone follow-on PR, not a
bundled section of that spec — consistent with that spec's own instruction to keep day-old wording
out of the week-fix diff.

## Origin

The week-unit spec explicitly deferred day-scaled age markers ("a 3-day-old infant") as "a
reasonable next candidate" needing its own unit branch and its own fixtures. This spec fulfills
that deferral. Independently reasoned and cross-checked against a GPT review pass (2026-07-13) that
proposed substantially the same contract; the day-scaled threshold (`age < 6570`, 18 years in days)
was already anticipated verbatim in the original week-unit spec's deferral note.

## Why a separate regex, not a third branch on the existing one

`englishPediatricAgeMarkers`'s current regex unifies years/months/weeks in one alternation with a
shared `\d{1,3}` capture and an **optional** `-old` suffix:

```ts
const re = /\b(\d{1,3})\s*(?:-\s*)?(years?|yrs?|months?|mos?|weeks?|wks?)(?:\s*-\s*old|\s+old)?\b/gi;
```

Days cannot simply extend this alternation, for two independent reasons:

1. **Digit width.** The day threshold is `age < 6570` (18 × 365), a four-digit number. The shared
   capture is `\d{1,3}`, which caps at 999 and would silently truncate/misparse any legitimate
   large day count. Years/months/weeks never need more than three digits (max legitimate values
   18, 216, 936), so widening the shared capture to `\d{1,4}` for all four units is unnecessary
   churn — better to give days their own capture group sized to what days actually need.
2. **The `-old` suffix must be *mandatory* for days, not optional.** Bare "N years"/"N months"
   without "-old" is usually genuinely an age statement in clinical prose. Bare "N days" is not —
   "3 days of fever," "for 3 days," "postoperative day 3," "POD 3," and "a 3-day course" are all
   duration/timeline phrases with no age meaning, and every one of them would false-positive if
   days shared the existing optional-old suffix. "Day N" (number *after* "day") does not match this
   pattern's number-then-unit order at all, so "postoperative day 3" and "POD 3" are excluded by
   construction, not by the old-suffix requirement — but "a 3-day course" and "3 days of fever" only
   miss because "old" is required.

**Required fix — a separate day-only regex, run alongside the existing one, merged before subject
scoping:**

```ts
const englishDayAgeMarkers = (text: string): AgeMarker[] => {
  const markers: AgeMarker[] = [];
  const re = /\b(\d{1,4})\s*(?:-\s*)?days?(?:\s*-\s*old|\s+old)\b/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const age = Number(match[1]);
    if (age < 6570) markers.push({ index: match.index, length: match[0].length });
  }
  return markers;
};
```

Update `englishPediatricAgeMarkers` to concatenate its existing markers with
`englishDayAgeMarkers(text)` before returning, so every call site (`detectPediatricContext`'s local
and context-text passes) picks up day markers automatically with no ripple change elsewhere. Do
**not** inline the day regex into the existing function's single regex — keep it a separate
function, called and merged, mirroring how this spec's Chinese counterpart stays a separate
alternative inside its own regex (below) rather than a bolt-on to the English one.

## Chinese eligible forms

```ts
const re = /(\d{1,4})\s*(日龄|天龄|天大(?:的)?)/g;
```

Covers `3日龄新生儿`, `3天龄婴儿`, `3天大的婴儿`. The last form is deliberately included: it is the
structural counterpart to the already-tested `9个月大的患儿` construction — confirmed live in
`scripts/tests/exhibit-flowsheet-gate.ts`'s Chinese pediatric-marker fixture loop, which includes
`"9个月大的患儿因发热入院。"` as a passing positive fixture today. Bare `3天` (no 日龄/天龄/天大
suffix) does not match and stays correctly excluded — the same "of days" vs. "days old" distinction
as the English side, enforced the same way (the unit token is part of the match, not optional).

Extend `chinesePediatricAgeMarkers`'s existing regex to add the day alternative directly (unlike
English, the Chinese function's existing structure already merges multiple unit tokens in one
regex, so a fourth alternative is the natural fit, not a separate function):

```ts
const re = /(\d{1,3})\s*(岁|个月|月龄|周|周龄)|(\d{1,4})\s*(日龄|天龄|天大(?:的)?)/g;
```

If merging into one regex with two capture-group pairs is awkward given the existing match-handling
code, an equally acceptable shape is a second Chinese day-marker function analogous to
`englishDayAgeMarkers`, concatenated the same way. Either shape is fine; keep whichever reads
cleaner against the existing function's control flow. The threshold logic either way:

```ts
const pediatric = unit === "岁"
  ? age < 18
  : unit === "周" || unit === "周龄"
    ? age < 936
    : unit === "日龄" || unit === "天龄" || unit.startsWith("天大")
      ? age < 6570
      : age < 216;
```

## Threshold

`age < 6570` (18 × 365 days), consistent with the existing deliberately scaled approximations
(18 × 12 = 216 months, 18 × 52 = 936 weeks) — no leap-year adjustment, matching the project's
established rounding convention for these thresholds.

## Scoping

Merge the resulting day markers into the existing marker list; reuse `englishAgeIsSubjectScoped` /
`chineseAgeIsSubjectScoped` **unchanged**. Do not create day-specific kinship or subject-scoping
logic — the existing modifier (`male\s+|female\s+`) and possessive-exclusion boundaries already
apply positionally to any `AgeMarker`, regardless of which regex produced it.

## Required fixtures

Add to `scripts/tests/exhibit-flowsheet-gate.ts`, following the existing
`pediatricSource`/`populationRecord` helper pattern and the context-vs-local split pattern from the
2026-07-13 R9 context-provenance fix:

| Fixture | Expected |
|---|---|
| `"A 3-day-old male newborn is admitted..."`, context-only | `population` unset/`"adult"` → FAIL; `"peds_infant"` → no FAIL |
| `"A 1000-day-old child..."` | pediatric FAIL — proves four-digit parsing (would silently misparse under `\d{1,3}`) |
| `"A 6569-day-old client..."` | pediatric FAIL (just under threshold) |
| `"A 6570-day-old client..."` | not pediatric by age (exactly at threshold, exclusive) |
| `"The adult client's 3-day-old infant..."` | no subject-scoped FAIL; retains existing `unscoped` WARN |
| `"The adult client is postoperative day 3..."` | no pediatric signal at all |
| `"The adult client has had fever for 3 days."` | no pediatric signal at all |
| `"3日龄新生儿因..."` and `"3天大的婴儿因..."` | pediatric FAIL when `population` unset |
| `"成人患者术后第3天..."` and `"成人患者发热3天。"` | no pediatric signal |
| `"成人患者的3日龄新生儿..."` | related-person boundary preserved — no subject-scoped FAIL |

Existing fixtures (weeks, months, years, related-person exclusions, the `9个月大的患儿` Chinese
positive) must stay green, unmodified.

## Explicitly out of scope for this PR

Nothing further deferred — this closes the day-unit gap the week-unit spec flagged. Any future
sub-day granularity (hours-old neonates) is a new, separate proposal if it's ever needed; not
anticipated here.

## Verification expected before PR

- `npx tsc -b`
- `npm run test:flowsheet-gate` (new fixtures pass, all existing fixtures unchanged and still pass)
- No bank, ledger, or census changes — pure `scripts/exhibit-flowsheet-gate.ts` +
  `scripts/tests/exhibit-flowsheet-gate.ts` diff. `PROJECT-HISTORY.md`'s stale "not yet fixed" note
  on the week fix is a separate, pre-existing doc-drift item — flag it in the PR description for the
  checker seat, do not silently correct it as a ride-along here.

## Routing

Independent Claude/Sonnet checker-seat review as usual: re-derive the regex behavior against the
required fixtures above, confirm no regression against every existing pediatric-detector fixture,
then merge.
