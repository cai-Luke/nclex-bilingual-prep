# U1 / U2 · Adversarial audit spec (`cap_*`, `vit_*`)

Visual-kind extension of the project's existing **audit specification**. That doc and `AGENTS.md` govern; this only adds the kind-specific check batteries and the determinacy stance for visual items. Same ethos as the parent: **precision over volume** — flag substantive defects with a demonstration, not stylistic nits.

---

## 1. What this audit is for (and what it is not)

`validate` and `selfCheck` are the **machine gates**: they prove the spec is well-formed and that the rendered artifact is arithmetically/structurally consistent with the keyed answer (plotted == data, MAP computed, plateau == labeled EtCO2). The audit **assumes those passed** and never re-does them.

The audit is the **judgment gate** for the three things a machine check structurally cannot see:

1. **Clinical validity** — is the morphology→meaning or trend→meaning claim actually true, and current?
2. **Load-bearing-ness** — is the visual doing work, or is it decorative (illustrating a fact the stem already states)?
3. **Determinacy** — is the keyed answer the *unique* answer given stem + visual, or is a distractor also consistent under a reasonable reading? For SATA items: is *every* keyed option supported and *every* non-keyed option excluded by stem + visual?

Determinacy is the dominant failure mode for visual items and gets the most adversarial pressure.

---

## 2. Adversarial method

The auditor's stance is to **break the item**, not approve it. For each item, actively attempt:

- **Find a second reading.** Is there a plausible clinical reading of the visual under which a distractor is correct, or the keyed answer is wrong? If yes, that is the defect.
- **Strip the visual.** Re-read the stem alone. If the answer is still determinable, the visual is decorative → defect.
- **Strip the stem context.** Read the visual alone. If it determines the answer without the stem's disambiguators, fine for some items — but if the answer *requires* a disambiguator the stem omits, the answer is under-determined → defect.
- **Re-derive every clinical claim** from an authoritative source, independent of the citation the generator supplied. A wrong-but-cited claim is still wrong.

**Demonstrability rule (precision over volume):** a flag is only logged if the auditor can state the defect concretely — the alternative reading, the missing disambiguator, the incorrect fact with a counter-source, or the decorative-visual restatement. "Feels off" is not a flag. This keeps the audit high-signal and the disposition queue short.

**Provenance rule (defines a valid clinical-validity flag).** Any clinical-validity flag — and any "verified correct" sign-off on a clinical claim — must log: the **source name**, its **publication or access date**, and the **exact claim validated**. "Verified against current guidelines" with no named source is not a weak flag; it is a non-flag and is rejected under the demonstrability rule. This forces the re-derivation in §2 to actually happen rather than be asserted, and it's the guard against AI auditors that rubber-stamp.

---

## 3. Severity & disposition

| Severity | Definition | Disposition |
|---|---|---|
| **Blocker** | Clinically wrong claim; keyed answer not uniquely determined by stem+visual; visual is decorative; answer contradicts the rendered artifact in a way `selfCheck` didn't catch. | **Reject** (back to generation) — never promote. |
| **Major** | A distractor is weak/also-arguable but the keyed answer still wins; rationale doesn't actually explain the visual cue; reference band/range cited but stale or wrong age band; **mechanical duplicate** (see §3a). | **Revise** — fix and re-audit. |
| **Minor** | Wording, formatting, distractor balance, style. | **Promote with note** or batch-fix. |

Promotion requires zero open Blockers and zero open Majors. Log each flag to the ledger with item ID, severity, the demonstration, and disposition.

---

## 3a. Redundancy — handled upstream, not as a correctness blocker

A redundant item is still *correct and promotable*; "we have too many of these" is a portfolio decision, not a defect in the item. So redundancy is split:

- **Coverage signal (not a flag).** Educational uniqueness is owned by `coverage-report`, which counts **distinct `skill_signature`s**, not raw items. When a `skill_signature` is saturated, that is surfaced to the *generation* prompt so the next batch targets a different decision point — redundancy is prevented before the visual-content cost is paid, which is the whole point. Recurring same-signature output is reported in the batch-pattern summary (§6), not adjudicated item-by-item.
- **Mechanical duplicate (Major).** Only when an item shares **both** the same `skill_signature` **and** the same scenario template as an already-promoted item — i.e., a near-verbatim clone with no new decision point — is it a Major "duplicate." This is a mechanical match, not the squishy "materially different decision point?" judgment the demonstrability rule exists to avoid. Disposition: revise to a genuinely different signature, or drop.

What the audit does **not** do is reject a correct item merely for testing the same *cue* as another with a different scenario; that's a coverage signal, full stop.

---

## 4. `cap_*` check battery

1. **Morphology→meaning is correct and current** (clinical truth — the part no machine gate covers). Verify `pattern_keyed`'s clinical meaning against an authoritative source independent of the item's citation, logging provenance per §2. Note: whether the rendered strip *geometrically is* the named pattern is now a `selfCheck` build gate (U1 §5), so the audit does **not** re-eyeball shape for drift. The one residual the machine can't judge is **weak instantiation**: a technically valid strip whose params render the pattern ambiguous (e.g., a borderline-low `shark_fin severity` that clears the floor but reads near-normal). If a clinician would hesitate to label the strip as `pattern_keyed`, that's a Blocker — but state *why* (which param, what it renders as), not "looks off."
2. **Flat-strip determinacy (highest-risk).** When `pattern_keyed === 'flat'`, confirm `meta.stem_disambiguators` actually narrows to one answer. Adversarially test apnea vs esophageal placement vs disconnection: if the stem doesn't exclude two of the three, it's a Blocker.
3. **Crisp-vs-shark-fin distractor integrity.** For obstruction items, confirm at least one distractor is a crisp-waveform condition (pulmonary edema, hyperventilation) and that the rationale correctly explains why morphology — not the EtCO2 number alone — selects the answer.
4. **Disease vs obstruction.** If the answer names a specific disease, confirm the stem (not the strip) carries the disease-specific evidence; the strip may only establish "obstruction present."
5. **No deferred-pattern leakage.** Confirm no item leans on a hypo-/hyperventilation morphology the renderer doesn't commit to.
6. **Decorative check.** Strip the strip; if the EtCO2 number in text would answer it, Blocker.

---

## 5. `vit_*` check battery

1. **Trend is real and load-bearing.** Confirm each `expected_trend` is present in the rendered series (this is `selfCheck`'s job — spot-confirm it ran) **and** that the answer actually turns on it. A trend that's present but irrelevant to the answer means the visual is decorative.
2. **Cause determinacy (highest-risk).** The trend shape under-determines cause. Adversarially list every condition consistent with the *same chart*; confirm the stem rules out all but the keyed cause, and that each distractor is excluded by the *stem*, not silently by the chart. If two causes survive stem + chart, Blocker.
3. **Derived values.** Confirm `derived_values_keyed` (MAP, pulse pressure) were computed by `selfCheck`, not hand-keyed, and that the rounding rule recorded in the schema doc was applied. Re-derive one by hand as a spot check.
4. **Reference ranges/thresholds current and age-correct.** Independently verify any range or MAP perfusion threshold the answer turns on against the reviewed reference table, logging provenance per §2. Confirm the item's `population`/age band matches the scenario (a pediatric stem keyed against adult bands is the silent-corruption case); wrong-age or stale ranges are Major.
5. **Compensated-phase honesty.** For shock-progression items keyed to the compensated phase, confirm the BP/pulse-pressure pattern shown is physiologically faithful (narrowing pulse pressure with maintained-then-falling SBP), not a cartoon.
6. **Decorative check.** Strip the chart; if a one-line text trend statement would answer it, Blocker.

---

## 5a. Cross-cutting checks (both lanes)

These run on every `cap_*` and `vit_*` item regardless of kind, in addition to the parent audit spec's bank-wide bilingual/contradiction passes.

1. **Bilingual disambiguator parity.** Confirm every load-bearing `stem_disambiguators` entry and any in-visual text is equally present and equally unambiguous in both the English and Simplified-Chinese stems. Adversarially run the determinacy check (§2) **in each language separately** — an item where the answer is unique in English but under-determined in Chinese (or vice versa) is a Blocker. This is the visual-item-specific addition to the parent spec's bilingual-divergence pass.
2. **Metadata-leakage enforcement.** Confirm the learner-export allowlist test (generation spec) exists and passes for the batch: no `meta.*` field (`pattern_keyed`, `expected_trend`, `derived_values_keyed`, `stem_disambiguators`, `skill_signature`, `visual_justification`) appears in any learner-facing export. This is an answer-key integrity check, not a quality one — a leak is a Blocker. The auditor verifies the gate ran; it does not hand-inspect every export.

---

## 6. Audit run mechanics

- Run **after** generation's `validate`/`selfCheck` pass, **before** human review/promotion. Audit and human review are complementary; the audit produces the demonstrated-defect list that focuses the human reviewer.
- AI-assisted is fine for drafting flags; a human signs the disposition for any Blocker on strictest-tier (airway, high-alert) content per AGENTS.md.
- Partition audit work by lane (`cap_*`, `vit_*`) with disjoint queues; one auditor owns a lane per pass for consistent calibration.
- Output: per-item flag log to the ledger (ID, severity, demonstration, disposition), plus a short batch summary of defect *patterns* so recurring generation errors get fixed at the prompt level, not item-by-item.
