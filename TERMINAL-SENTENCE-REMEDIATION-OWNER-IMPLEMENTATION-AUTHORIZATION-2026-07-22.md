# Terminal-Sentence Remediation — Owner Implementation Authorization

Date: 2026-07-22
Owner seat: Project Shrimp owner
Status: **RATIFIED — controlling implementation authorization**

## 1. Purpose and authority

This document records the owner's explicit ratification of the revised implementation plan in:

- `TERMINAL-SENTENCE-REMEDIATION-IMPLEMENTATION-SPEC-2026-07-22.md`

The implementation spec is an architect-authored execution contract; it is **not** expected to authorize itself. This owner artifact supplies that authorization.

For this bounded lane, this document supersedes the pre-ratification statements in:

- `TERMINAL-SENTENCE-REMEDIATION-OWNER-DISPOSITION-2026-07-22.md`;
- `TERMINAL-SENTENCE-REMEDIATION-WORK-ORDER-2026-07-22.md`; and
- `TERMINAL-SENTENCE-REMEDIATION-OWNER-RATIFICATION-PACKET-2026-07-22.md`

that correctly stated, at the time they were written, that no implementation or bank mutation was yet authorized.

Those documents remain authoritative for their evidence, findings, operation classes, and unresolved-status language except where the revised implementation spec or this authorization expressly changes the execution ruling.

The owner ratifies D1–D7, the later queue-1731 amendment, and the revised pre-flight corrections incorporated into the implementation spec.

## 2. Authorized implementation boundary

Authorized under the gates and sequencing of the implementation spec:

- deterministic, field-scoped mutation of the 35 accepted in-scope records;
- the specifically ruled top-level retirements or conditional retirements;
- archive and post-removal verification artifacts for any retirement that fires;
- patch scripts, focused tests, audit evidence, ledger and census updates, a concise `PROJECT-HISTORY.md` closeout, and PR authorship;
- the separate post-remediation D7 validator lane only after the content remediation is clean.

Not authorized:

- merge to `main`;
- `DECISIONS.md` edits;
- queue 2235 mutation or re-adjudication;
- an embedded-leaf retirement mechanism;
- new findings or off-manifest remediation;
- a key or item-type change except where the implementation spec expressly permits one;
- content-gated bank mutation before independent checker approval.

## 3. Adjacent-field recurrence authorization

The owner expressly ratifies §5 of the implementation spec as a scoped item-coherence repair, superseding the earlier packet's provisional instruction to return every recurrence for separate litigation.

For rows 226, 656, 702, and 799, recurrence of the **same accepted defect** within the named live record may be corrected in the same item-level operation. This does not add a finding and does not authorize a corpus expansion.

Specifically for queue 702, `trad_batchB_14`, the owner authorizes both exact Chinese terminology corrections identified by the implementation pre-flight:

- `stem.zh`: `艰难克罗替尼` → `艰难梭菌`;
- `glossary[1].termZh`: `艰难克罗替尼` → `艰难梭菌`.

The implementer must still use exact field paths, assert one occurrence in each target field, and prove all non-target fields unchanged.

Any recurrence outside the four named records remains an owner-litigation input and must not be mutated in this lane.

## 4. Queue 226 terminology sign-off

The owner ratifies the bounded queue-226 correction as a deterministic terminology repair, not an unresolved clinical-content decision.

Live record identity:

- id: `gemini_jun05_a_mc_lithium_toxicity_36`;
- English item: lithium carbonate and lithium toxicity;
- Chinese defect: `地高辛锂中毒`, which inserts digoxin into the lithium-toxicity phrase.

Authorized correction:

- `stem.zh`: `地高辛锂中毒` → `锂中毒`.

This exact correction satisfies the implementation spec's required sign-off for queue 226. It does not change the clinical construct, response demand, options, key, or English text. Any additional recurrence found in the same record remains governed by §3 above.

## 5. Producer ≠ checker route

Missing authored-text approvals do **not** block the entire implementation commission. They gate only the units that require authored replacement or rebuild work.

### Stage A — Codex implementation/producer seat

Codex may immediately:

1. create the scoped implementation branch;
2. implement and apply WU-1 and WU-2;
3. implement and apply WU-3, including the owner-ratified queue-226 and queue-702 corrections above;
4. resolve queue 162's source-backed pre-authoring retain/retire test;
5. draft, but not apply, the replacement text and patch operations for WU-4, WU-5, WU-6, and rewrite-first WU-7 rows;
6. produce a checker packet containing exact before/after fields, sources, unchanged-key assertions, and the proposed patch paths.

### Stage B — independent Claude checker seat

Route the Stage-A authored-content packet to a separate Claude checker seat. The checker must not be the producer of the proposed replacement text.

The checker reviews:

- every `OP-C`, `OP-D`, and `OP-F1` bilingual replacement;
- any retained queue-162 rebuild;
- queue 735's whole-record Healthy People 2030 normalization;
- queue 1731 as a whole five-part case, not only `_q5`;
- queues 2123 and 2228 after their rewrite-first work;
- clinical/source support, bilingual parity, key preservation, response-surface integrity, leakage, and item-type suitability.

The checker returns a row-level signed disposition of `APPROVE_FOR_APPLY`, `REVISE`, or `RETURN_TO_OWNER`, with the exact reviewed field set.

### Stage C — Codex apply/closeout seat

Codex may apply only the Stage-B `APPROVE_FOR_APPLY` content-gated operations, then run the complete verification, retirement, ledger, census, history, and closeout path required by the implementation spec.

A Stage-B `REVISE` row returns to Codex for revision and another independent check. A `RETURN_TO_OWNER` row stops only that row unless its failure prevents a bank-level atomic work unit from being safely separated.

## 6. Governance interpretation

The implementation spec and this authorization deliberately separate three acts:

1. **owner authorization** — supplied by this document;
2. **content production and deterministic implementation** — Codex's seat;
3. **independent content approval** — the separate Claude checker seat.

Therefore:

- the old packet's no-authorization statement is historical and no longer blocks the lane;
- the queue-702 glossary correction is explicitly in scope;
- the absence of Stage-B approvals blocks only content-gated application, not mechanical work, terminology repairs, or drafting;
- `DECISIONS.md` remains deferred and untouched until the owner opens that separate litigation.
