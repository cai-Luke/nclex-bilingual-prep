# Campaign 16 Phase E — Stage 2 Independent Claude Checker: Comparison and Adjudication

**Stage:** Phase E Stage 2 (§9), comparison and §9.4 acceptance rule.
**Governing authority:** `scratch/CAMPAIGN-16-PHASE-E-STAGE-REFERENCE-SEMANTIC-CENSUS-WORK-ORDER-2026-08-29.md`, SHA-256 `91e7434905f52ef90f7288def1aa6d17118c3708b7e99d76f0384bfeeafad390` (re-verified live this session).
**Machine-readable authority:** `comparison.json`. Where this prose and that file differ, that file governs.

## Terminal

`CAMPAIGN16_PHASE_E_BLOCKED_CHECKER_SAMPLE_DISAGREEMENT`

Phase E Stage 2 is **BLOCKED**. Two checker-selected producer no-leak rows returned `LEAK`. Under §9.4 second bullet this blocks Phase E closeout rather than being patched row-by-row, and §12 lists the identical condition as a stop condition. `CAMPAIGN16_PHASE_E_CHECK_COMPLETE` is not available and is not claimed.

Per §9.4, all evidence is preserved and the commission returns to the owner. The checker sample was **not** expanded and the producer census was **not** rerun.

## Order of operations

Producer verdicts were exposed only after all 259 checker rows were independently verified as locked, hashed and frozen on live disk. The §9.4 precondition — "comparison occurs only after every checker semantic row is locked and hashed" — was satisfied before any producer file was read. The eight-point pre-comparison verification is recorded in `verification.md`; every point passed.

No new semantic adjudication was performed. §9.4 requires none: for full-check-routed rows the locked checker verdict is authoritative, and a no-leak gate breach blocks rather than being re-adjudicated. Every comparison result below is mechanical.

## Selection re-derivation (§9.1)

The selection was re-derived independently from the producer candidate file rather than trusted:

- population 451 rows; producer verdicts `LEAK` 238, `NO_LEAK_NONANSWERING_DATA` 107, `NO_LEAK_COMPLETE_RECORD` 105, `REVIEW` 1;
- producer `bilingualRelation` is `PARALLEL` on all 451 rows, so criterion 3 selected nothing and the frozen `nonParallelPopulationIsEmpty` assertion holds;
- the 10% sample key `sha256("stage-ref-check|<bankPath>|<parentCaseId>|<partId>")`, included when the first unsigned digest byte mod 10 equals 0, applied to the 212 producer no-leak rows, selects 20;
- 238 + 1 + 20 = **259 selected rows across 73 packets**, exactly matching the frozen `checker-selection.json` set, per-reason counts and per-row reason assignment.

One cosmetic difference: the independent derivation labelled the sample reason `DETERMINISTIC_NO_LEAK_SAMPLE`; the frozen file uses `DETERMINISTIC_NOLEAK_SAMPLE`. Spelling only — the sets are identical. Not a finding.

## Producer / checker agreement on the 259 selected rows

| Measure | Count |
|---|---|
| Exact primary-verdict agreement | **201 / 259** |
| Disagreement, total | **58 / 259** |
| — recorded disagreement on full-check-routed rows (checker controls, non-blocking) | 51 |
| — no-leak subclass disagreement (checker subclass controls, gate still passes) | 5 |
| — **blocking no-leak gate breach** | **2** |
| Bilingual-relation disagreement | 0 |

Confusion matrix, producer → checker:

| Producer | Checker | Count |
|---|---|---|
| `LEAK` | `LEAK` | 188 |
| `LEAK` | `NO_LEAK_NONANSWERING_DATA` | 44 |
| `LEAK` | `NO_LEAK_COMPLETE_RECORD` | 4 |
| `LEAK` | `REVIEW` | 2 |
| `NO_LEAK_COMPLETE_RECORD` | `NO_LEAK_COMPLETE_RECORD` | 6 |
| `NO_LEAK_COMPLETE_RECORD` | `NO_LEAK_NONANSWERING_DATA` | 4 |
| `NO_LEAK_COMPLETE_RECORD` | `LEAK` | **1 (blocking)** |
| `NO_LEAK_NONANSWERING_DATA` | `NO_LEAK_NONANSWERING_DATA` | 7 |
| `NO_LEAK_NONANSWERING_DATA` | `NO_LEAK_COMPLETE_RECORD` | 1 |
| `NO_LEAK_NONANSWERING_DATA` | `LEAK` | **1 (blocking)** |
| `REVIEW` | `NO_LEAK_NONANSWERING_DATA` | 1 |

The dominant disagreement direction is producer over-calling leakage: 48 producer `LEAK` rows were downgraded to a no-leak verdict by the checker and 2 more to `REVIEW`, against 2 producer no-leak rows upgraded to `LEAK`. That asymmetry is context for the owner, not an adjudication — §9.4 gives the checker control of every selected row's disposition regardless of direction.

Accepted dispositions on the selected set (checker controls): `LEAK` 190, `NO_LEAK_NONANSWERING_DATA` 56, `NO_LEAK_COMPLETE_RECORD` 11, `REVIEW` 2.

## The §9.4 no-leak safety gate — BLOCK

20 checker-selected producer no-leak rows form the validity gate for accepting the 192 unchecked producer no-leak rows. All 20 entered through the deterministic 10% sample; none entered through a non-`PARALLEL` bilingual relation, because that population is empty.

- 18 of 20 returned a no-leak verdict — 13 exact-subclass agreements, 5 subclass disagreements that §9.4 explicitly records with the checker subclass controlling while the gate still passes.
- **2 of 20 returned `LEAK`**, which §9.4 defines as blocking.

### Breach row 1 — queueIndex 370

`banks/hard-cases-canonical.json` · `cs_thyroid_storm_main` / `cs_thyroid_storm_q2` · packet-062 · entered via `DETERMINISTIC_NOLEAK_SAMPLE`.

Producer `NO_LEAK_COMPLETE_RECORD`, no unsafe stages: the stem bases the task on the 0830 orders, so the orders stage is intended record.

Checker `LEAK`, unsafe stage `stage_1200`: the 1200 reassessment reports the client already received propranolol, propylthiouracil, Lugol's iodine and hydrocortisone *as prescribed*, stating the keyed sequence as accomplished fact and additionally reporting restored sinus rhythm, which validates the sequence as correct. The Simplified Chinese reassessment names the same four drugs in the same order.

The producer's stated basis addresses `stage_0830`, which both seats agree is required. It does not address `stage_1200`, which is the stage the checker identifies as leaking.

### Breach row 2 — queueIndex 395

`banks/hard-cases-canonical.json` · `opus_tpn_case_mucositis_01` / `opus_tpn_case_mucositis_01_q3` · packet-066 · entered via `DETERMINISTIC_NOLEAK_SAMPLE`.

Producer `NO_LEAK_NONANSWERING_DATA`, no unsafe stages: names `stage_3` as the most plausible cue and judges that it does not disclose the keyed coordination order.

Checker `LEAK`, unsafe stage `stage_3`: stage 3 narrates the resolution in the keyed order, with line removal following continued antibiotics and placement of replacement central access, cueing the final two steps of the ordering task. English and Chinese stage 3 carry the same sequence.

Both seats examined the same stage and reached opposite conclusions about whether its narration cues the keyed ordering. That is a genuine substantive split, not a formatting or identity artifact.

### Why this blocks rather than being patched

§9.4 is explicit that these rows are not patched row-by-row: a checker `LEAK` on a sampled producer no-leak row "demonstrates a producer false-negative or unresolved safety boundary inside the population being accepted without full checking." The 192 unchecked producer no-leak rows were to be accepted on the strength of this 20-row gate. Two breaches in 20 falsify the basis for that acceptance, so the unchecked residual cannot be accepted under this commission.

## The two checker `REVIEW` rows — both non-blocking, both dispositioned

Both carried-forward `REVIEW` rows sit on **producer `LEAK`** rows, so both fall under §9.4 third bullet, not the no-leak gate. Neither is a blocker. Their §9.4 disposition is accepted `REVIEW`: the stage boundary/intent remains genuinely unrecoverable from the current artifact, and each routes to later full-case review. Phase E does not force either into leak/no-leak.

- **queueIndex 204** · packet-035 · `banks/gpt-canonical.json` · `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q4` · producer `LEAK` → checker `REVIEW`. The vomiting trigger belongs to stage 2 and the home-discharge framing to stage 3, with no anchor field separating them; the verdict flips on a boundary the authored case never settles.
- **queueIndex 280** · packet-048 · `banks/gpt-canonical.json` · `gpt_case_mass_casualty_start_triage_01_q5` · producer `LEAK` → checker `REVIEW`. The keyed six-step decontamination order is enacted across stages 1 and 2 and the target casualty's decontamination spans both; unlike every sibling stem in this case, this one names no stage and carries no anchor.

Under a hypothetical passing gate these would still not have blocked. The block is caused solely by rows 370 and 395.

## Authority boundary observed

Per §6 and the work order's authority boundary, accepted `LEAK` and `REVIEW` rows are evidence for a later separately gated repair commission and are **not** repair authority. The 190 accepted `LEAK` rows on the selected set distribute as `banks/gpt-canonical.json` 114, `banks/hard-cases-canonical.json` 40, `banks/claude-canonical.json` 29, `banks/gemini-canonical.json` 7. No mutation is proposed here and no anchor recommendation is made.

Stage 3 was not entered. No `final-adjudication.jsonl`, `accepted-leak-roster.jsonl`, `accepted-review-roster.jsonl`, `final-report.md` or `closeout.md` exists, and none may be written until a terminal permits it — which this one does not.

## What the owner decides

§9.4 hands the block back rather than prescribing a remedy, and this commission has no authority to choose one. The live options visible from the evidence, none of them taken here:

1. accept the two checker `LEAK` upgrades and commission a broadened or full check of the 192 unchecked producer no-leak rows;
2. commission an independent third-seat adjudication of rows 370 and 395 specifically, on the theory that the gate breach is a two-row dispute rather than a population-wide false-negative rate;
3. re-scope Phase E.

Option 1 or 2 both require a new commission; §9.4 forbids this one from expanding the sample or rerunning the producer census on its own authority.

## Carried-forward findings

- **`checkerPacketSetSha256` documentation gap (unchanged, not an integrity failure).** The manifest's aggregate rollup is not reproducible from any plain derivation of the per-packet hashes and its recipe is recorded nowhere in the artifact set. Thirteen candidate derivations were tried this session — hex concatenation with and without separators and trailing newline, raw digest-byte concatenation, `packetId:hash` and `hash  path` line forms, sorted-hash concatenation, canonical-JSON of the packets array at two indents, and concatenation of the packet file bytes — and none reproduces `9b944b104dfa31e7d3a84418f3cc91d2e093ffb15eefe30ffb9a895e0b308c18`. The operative guarantee is unaffected: all 73 individual packet hashes match, all 73 files are present, there are no extras or omissions. The frozen manifest was **not** mutated to make the aggregate reproducible. Record the derivation if this manifest shape is reused.
- **Validator sentence counting.** Unchanged from Stage 2 collection: the generic validator splits sentences on `.` `!` `?`, so a period-bearing abbreviation inflates the count. One bounded mechanical retry was used on packet-001 for this; no verdict, stage list, evidence ID, bilingual relation or identity changed.
- **Antigravity canary.** Non-governing, never imported, never exposed to any semantic context. packet-026 was adjudicated by a formal blinded Stage 2 context.
