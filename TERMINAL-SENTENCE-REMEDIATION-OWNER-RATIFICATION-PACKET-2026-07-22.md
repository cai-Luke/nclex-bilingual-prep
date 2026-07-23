# Terminal-Sentence Remediation — Owner Ratification Packet

Date: 2026-07-22
Authoring seat: Claude, remediation architect
Status: decision packet for the owner. **No mutation authorized by this document.**
Inputs: `TERMINAL-SENTENCE-REMEDIATION-OWNER-DISPOSITION-2026-07-22.md` (controlling), `TERMINAL-SENTENCE-REMEDIATION-WORK-ORDER-2026-07-22.md`, `audit/terminal-sentence-remediation-2026-07-22/` (Claude Code reopen commission, R1–R5)

---

## 1. Status

The §8 reopen commission is complete and its completion gate is met. All 35 accepted rows now have live-disk evidence. Provisional operation classes are decided.

This seat has **reviewed the commission rather than accepted it**. Verification performed independently this session:

- **R4 corroborated directly.** `answerBody` is defined at `src/App.tsx:3261`; the generic `question.stem` render sits at 3265, four lines inside it; `trackedAnswerBody` at 3363 is rendered in both layout branches (3399, 3404) with no item-type gate between. Residual #3 of the work order is closed.
- **R2's seven consequential decisions re-derived from the evidence file**, not taken on report. For 890, 892, 921, 931 the live `stem` carries a distinct preceding clinical scenario absent from `clozeStem`, so deletion leaves a non-empty remainder — `OP-B` confirmed. For 922 `wholeField_en`/`wholeField_zh` are both true and both literal remainders are length 0 — `OP-C` confirmed. For 1103 and 1108 `stem_equals_cloze_en` and `stem_equals_cloze_zh` are both true — `OP-C` confirmed.
- **G2 precondition 1 checked independently across all 11 `OP-B` rows.** Every post-deletion remainder is free of `{{…}}` tokens, so the "zero placeholders in `stem` after mutation" precondition will hold. The commission did not report this; it holds.

Two findings from that review are recorded in §3. One of them changes how the mutation must be implemented.

---

## 2. Decided operation classes

| Class | Rows | Count |
|---|---|---:|
| `OP-A` mechanical text repair | 57 | 1 |
| `OP-B` bounded deletion | 888, 890, 892, 902, 904, 905, 920, 921, 931, 932, 933, 2413 | 12 |
| `OP-C` field replacement | 147, 922, 1103, 1108 | 4 |
| `OP-D` naturalization rewrite | 2176, 2178, 2185, 2190, 2219, 2231, 2238 | 7 |
| `OP-E` bilingual correction | 226, 656, 702, 799 | 4 |
| `OP-F` renderer/schema fork | 1486, 1492 | 2 |
| `OP-G` full item review | 162, 735, 1731, 2123, 2228 | 5 |

Total 35. Queue 2235 remains retained and outside scope.

Movement from the work order's provisional split: G2 owner-gated rows drop from 6 to 3 (890, 892, 921, 931 de-escalated to mechanical; 922 escalated). 1103 and 1108 confirm as `OP-C` by whole-stem duplication rather than by the literal terminal test.

---

## 3. Architect review findings

### 3.1 Mutation must be field-scoped, not record-scoped — **binding**

The commission reports anchor uniqueness as `occInField = 1` for all 35 rows and concludes "no anchor failures." That is correct as stated and understates a real hazard. The evidence file also carries `occInRecord`, and on seven rows the anchor appears **twice in the record**:

| Row | EN `occInRecord` | ZH `occInRecord` |
|---|---:|---:|
| 890 | 2 | 2 |
| 892 | 2 | 2 |
| 904 | 1 | **2** |
| 921 | 2 | 2 |
| 931 | 2 | 2 |
| 1103 | 2 | 2 |
| 1108 | 2 | 2 |

The second occurrence is `clozeStem` — which is precisely the field G2 precondition 2 requires to be byte-identical before and after. Any implementation that serialises the record and does a string replace, or that anchors at record scope rather than at `stem.en` / `stem.zh` specifically, will silently mutate the functional response surface and destroy the item.

Row 904 is the instructive case: its English anchor is unique in the record because `clozeStem.en` differs by one article ("wash **the** feet"), while its Chinese anchor collides because `clozeStem.zh` is identical. A per-row en/zh asymmetry of this kind cannot be handled by a uniform rule.

**Required of the implementation seat:** every mutation targets an explicit field path (`questions[i].stem.en`, `questions[i].stem.zh`), never the serialised record. Assert `clozeStem` byte-identity before and after on every G2 row. This is a hard gate, not a review note.

### 3.2 Adjacent-field residuals on the `OP-E` rows — check required, no finding added

Queues 226 and 702 are mistranslations of clinical entities (digoxin wrongly inserted into a lithium item; *C. difficile* rendered 艰难克罗替尼 rather than 艰难梭菌). The accepted finding covers the `stem` terminal only. Neither the census nor the checker examined whether the same mistranslation recurs in that item's `rationale`, `options`, or `glossary`.

This is the same structural blind spot as LIT-1: a terminal-sentence census cannot see adjacent fields. Correcting the stem while leaving a digoxin reference in the rationale would produce a repaired stem and an incoherent item.

**Not added as a finding.** Recorded as a required pre-mutation check on those two rows, and on 656/799 for consistency. If the check finds recurrence, that is an owner-litigation input, not an automatic expansion of scope.

---

## 4. Decisions required from the owner

### D1 — Queue 2413 operation boundary

Both anchors verified unique in `stem.en`. Choose:

- **B1** — delete the whole parenthetical `(a foundational infection-response framework still tested on the NCLEX-RN)`.
- **B2 (recommended)** — delete only `still tested on the NCLEX-RN`, retaining `(a foundational infection-response framework)`.

B2 excises exactly the exam-process commentary and preserves a clinical gloss that carries teaching value and was never defective. The Chinese edit must be derived from the live string `（一个在NCLEX-RN中仍会考核的基础性感染反应框架）` — the checker's Chinese quote for this row is a reconstruction and must never anchor the edit.

### D2 — Queue 147 and LIT-1, ruled together

`stem` is the whole field in both languages, so replacement is forced. Separately, `caseStudy.summary` restates the same precipitating mechanism that the first embedded question asks the learner to identify.

Options: (a) fold LIT-1 into scope and remediate `stem` + `summary` together; (b) remediate `stem` only and open LIT-1 as its own lane; (c) reject LIT-1.

**Recommend (a).** Under §3.5 of the work order `summary` is optional and may be deleted outright, so the operation is cheap. Option (b) records a closure on 147 that is not true.

### D3 — `OP-C` replacement text — 147, 922, 1103, 1108

Four rows need authored replacement text. This seat does not author clinical content; that is the content lane. Constraints each replacement must satisfy:

- non-empty `en` and `zh` (schema hard requirement);
- zero `{{…}}` tokens in `stem`;
- for 922, 1103, 1108: must not duplicate `clozeStem` in either language, and must supply the clinical setup that `clozeStem` alone does not carry;
- for 147: neutral presenting framing that does not name the precipitant, since `caseStudy.title` already carries navigation.

1103 and 1108 are the heaviest: `stem` is byte-identical to `clozeStem`, so there is no existing scenario text to trim toward — genuinely new setup prose is required.

### D4 — G3 fork, 1486 and 1492

R3 measured the corpus: 214 `fill_in_blank` items, exactly 2 carrying `{{…}}` in `stem`, both on-manifest.

**Recommend F1** (content-side stem rewrite, relying on `blanks[].prompt`). The blast radius is two rows, both blanks already carry self-contained `prompt` pairs and `acceptable`/`numeric` bindings, and no corpus population forces the schema/renderer extension. F2 would be a schema-tier change with a full bank-impact survey for a two-row problem.

### D5 — `OP-D` naturalization text — 7 rows, plus 162

Clinical claims. Per the `AGENTS.md` escalation trigger these must be verified against the sourced reference lane, never authored from conversation. Each rewrite relocates a valid clinical boundary out of self-referential framing and into clinical context or `rationale`. Content lane, producer ≠ checker on review.

162 has a lever worth using: its own `rationale.correct.zh` already carries a compliant scope statement, so the stem sentence can be removed or naturalized without losing the information.

### D6 — `OP-G` review outcomes — 162, 735, 1731, 2123, 2228

No mechanical operation is defined until review completes. The sharpest is **1731**: the terminal concedes an indicated intervention omitted from the response set. Deleting the sentence without completing the option set makes the item *worse* — the concession is currently the only thing preventing a defensible complaint that a correct action is missing.

### D7 — LIT-2, placeholder validation gap

`extractPlaceholders` runs only on `clozeStem`, never on `stem` (`src/schema.ts:148/909/910`). This is the structural gap that let the G2 and G3 classes reach canonical banks, and it will let them recur after remediation.

Options: authorize a validator guard as a separate schema-tier lane, or defer. **Recommend authorizing it as its own lane after remediation lands**, so the guard is written against a clean corpus rather than one it would immediately fail.

---

## 5. Closed items

- **LIT-3 — resolved, no litigation.** The malformed SATA token 择所有适用项 not preceded by 选 occurs exactly twice corpus-wide, both on-manifest (656, 799).
- **Work order residual #3 — closed** by R4, independently corroborated in §1.
- **Checker zh unreliability — bounded.** Measured 1 reconstruction in 34 quoted rows (~3%), the single case being 2413. The §4 rule stands regardless: checker quotes are never mutation anchors, and every anchor a mutation needs is now available verbatim from live disk.

---

## 6. Standing residuals

1. **The corpus remains uncleared.** These 35 rows are the accepted subset of a formally rejected census (`CHECKER_REJECT_REQUIRE_NEW_CENSUS`). Remediating all 35 clears nothing corpus-wide, and no downstream artifact may state otherwise.
2. **R3's negative result was not independently reproduced by this seat.** The two banks holding the relevant items exceed the connector's 2 MiB search ceiling. It is a deterministic scan from a seat with full disk access and is accepted as such, but it is a single-seat result.
3. **§3.2 adjacent-field recurrence is unmeasured** on the `OP-E` rows pending the §3.2 check.
4. **Nothing is authorized for implementation.** No bank, runtime, commit, or push authorization exists anywhere in this chain. The owner disposition withheld it; neither the work order nor this packet grants it.

---

## 7. What lands after ratification

On the owner's rulings for D1–D7, the remaining path is: content lane authors the `OP-C`/`OP-D`/`OP-F1` text → producer ≠ checker review → a Codex implementation spec carrying the field-scoped mutation gate from §3.1 → the full bank-content verification path (`validate-bank`, `scan-unknown-keys`, `audit`, `census`/`census:check`, `tsc -b`, `build`, plus the per-group regressions in §10 of the work order) → `BANK-REVIEW-LEDGER.md` entry → census.

`DECISIONS.md` is architect-seat-only and requires the owner's explicit wording approval. Nothing has been written there by this chain.
