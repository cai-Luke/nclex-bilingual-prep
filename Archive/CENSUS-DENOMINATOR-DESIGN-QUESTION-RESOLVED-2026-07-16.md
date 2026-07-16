# Census Denominator — Resolved Design Question

Status: **RESOLVED 2026-07-16 in [PR #52](https://github.com/cai-Luke/nclex-bilingual-prep/pull/52).** The durable ruling is
[`DECISIONS.md` principle 28](../DECISIONS.md): scored leaves govern content planning; session units
govern delivery capacity and inventory. The original observation and regeneration warning are
preserved below for provenance.

---

# Census Denominator — Open Design Question

Status: **open design question. Not a fix spec. No implementation ratified.**
Raised 2026-07-16 (architect seat), out of the Burn Management topic audit.

Deliberately contains **no counts**. Every number this question touches must be regenerated at a
single named SHA across all 13 bundled banks. Figures quoted in session or in the superseded burn
review artifact were computed over a partial working copy and are leads to re-measure, not findings.

## The observation

`scripts/census.ts` builds its working set as:

```ts
const allQuestions: Question[] = banks.flatMap(({ envelope }) => envelope.questions);
```

That is top-level bank objects only. Consequences, as the code stands:

- `withinCategory[category].topTopics` filters and counts over that top-level list.
- `computeCoverage(allQuestions)` receives that same list. `computeCoverage` iterates exactly what it
  is passed; it does not independently descend into case leaves. Everything derived from it —
  `byCategory`, `byItemType`, `targets`, `underCategories`, `overCategories`, `underItemTypes`,
  `prioritizeTopics`, `avoidTopics` — inherits the top-level denominator.
- `totals.embeddedParts` **is** counted, but only as a total. Leaves do not contribute their own
  `category`, `topic`, `difficulty`, or `itemType` to any distribution.
- `collectVisualsWithOwner` **already descends** into `caseStudy.questions` (and exhibits/stages), so
  the visual census does traverse leaves. Visual-kind counts are therefore on a different traversal
  basis than category/topic counts, within the same file.

So the current distribution and generation-priority metrics are **top-level / session-unit metrics**.
That is not self-evidently wrong. It is, however, undeclared.

## Why this is a decision, not a bug

The intended denominator is an architectural choice about what a "question" is for planning purposes:

- A **session unit** — what a learner is served as one thing (a case study is one unit).
- A **graded leaf** — what is actually scored (a case study is a container of six).

Both are legitimate; they answer different questions. Content-generation priorities arguably want the
graded-leaf view, since that is where format and category exposure actually lands. Session pacing and
delivery arguably want the top-level view. The current code silently answers the first while being
read as if it answers the second.

**Do not simply "fix" this.** Making the census recurse would silently redefine every historical
metric and make past censuses incomparable without anyone noticing.

## What Codex should evaluate

A **dual-view** design:

1. **Top-level / session-unit distribution** — preserved, unchanged in meaning, explicitly labelled
   as such.
2. **Graded-leaf distribution** — standalone questions **plus** case leaves, **excluding** case
   containers.

Constraints on the graded-leaf view:

- Each leaf's **own** `category` / `topic` / `itemType` / `difficulty` governs. Not the parent case's.
  (This is the burn audit's "case-bound is not category evidence" rule expressed in code: a leaf that
  computes a prescribed IV volume is a Pharm item even when later leaves in the same case manage
  the patient.)
- **Never count containers and leaves in one undifferentiated denominator.** A `case_study` object
  and its six leaves are not seven graded items.
- Reuse the traversal that already exists in the file (`collectVisualsWithOwner` descends correctly);
  do not author a second, divergent traversal.
- Label which view every emitted metric belongs to. An unlabelled distribution is the defect.

Open sub-question for the architect, not for Codex to decide unilaterally: **which view should drive
`prioritizeTopics` / `underItemTypes` / `targets`?** Recommend proposing, not assuming.

## Regeneration contract

- One named SHA. All 13 bundled banks. State the SHA in the output.
- Regenerate `census`, `coverage-report`, and the topic/license residual reports together, from that
  same SHA, so the numbers are mutually comparable.
- Pending content promotions will move these numbers. Regenerate **after** promotion, not before, or
  state clearly that the run predates it.

## Related, already durable — do not restate

The population-helper contract from the burn audit is already recorded and needs no duplication:
deterministic recursive exact-topic extraction (stage 1); explicit semantic-residual review as
judgment work (stage 2); **no keyword-based detector** — that reproduces the
`gpt_case_gbs_respiratory_compromise_01_q1` "burning pain" mistag in executable form.
