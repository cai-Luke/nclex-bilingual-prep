# U1 / U2 · Content generation prompt spec (`cap_*`, `vit_*`)

Generation prompts for the two content lanes that open once the U1 (`capnography`) and U2 (`vitals_trend`) renderers land. Read `AGENTS.md`, `NCLEX-Question-Schema.md`, the existing **audit specification**, and `VISUAL-STIMULI-ROADMAP.md` first; they win on any conflict. Output is **raw** bank items that flow through the existing raw → review → promote → ledger pipeline; nothing here promotes itself.

---

## 0. Shared generation contract (both lanes)

These rules are prepended to both lane prompts.

**Coverage drives volume, not the other way around.** Generate against the gaps `coverage-report` reports for the kind, not to a target count. Precision over volume: a smaller set of items where the visual is genuinely load-bearing beats a large set padded with decorative charts.

**The visual must be load-bearing.** Before emitting an item, state in `meta.visual_justification` the single sentence test: *removing the visual makes this question unanswerable or changes its difficulty.* If you can't write that sentence truthfully, the item belongs in text — do not generate it. A visual that merely illustrates a fact the stem already states is a rejection, not a neutral.

**The answer must be uniquely determined by stem + visual.** The stem must supply every disambiguator the visual cannot carry (see lane-specific traps). If two options are both consistent with the visual under any reasonable reading, the item is defective — tighten the stem or change the visual. For select-all-that-apply (SATA) items this generalizes: **each keyed option must be supported, and each non-keyed option excluded, by stem + visual** — no keyed option may rest on a cue the visual doesn't carry, and no distractor may be defensible under a reasonable reading.

**Emit a complete raw item** per the schema doc: stem, options (with the standard count/format for the item type), `correct`, per-option `rationale` (why right / why each distractor is wrong), the `visual` spec object (`kind` + params that `validate` accepts), and `meta`. **All contract fields below live under the `meta` namespace** (see metadata-leakage rule). Include:
- `visual_justification` (above),
- `source` citation(s) for every clinical claim the answer turns on,
- `tier` per AGENTS.md (airway and high-alert content is strictest tier),
- `skill_signature`: a compact tag identifying the cue + decision point being tested (e.g., `cap:shark_fin/obstruction-vs-crisp`, `vit:narrowing-pulse-pressure/compensated-shock`). This is the unit `coverage-report` counts as *distinct* (not raw item count) and the unit the audit's duplicate check keys on.
- lane-specific contract fields (below).

**Bilingual disambiguator parity.** This is an English / Simplified-Chinese bank. Any in-visual text (axis labels, units, the EtCO2 number's unit) and — critically — every load-bearing `stem_disambiguators` entry must be equally present and equally unambiguous in *both* languages. A disambiguator that uniquely determines the answer in English but is vague or absent in the Chinese stem makes determinacy hold in one language and break in the other. Generate both stems against the same disambiguator set; don't let translation drop or soften a cue the answer depends on.

**Metadata is never learner-visible.** `pattern_keyed`, `expected_trend`, `derived_values_keyed`, `stem_disambiguators`, `skill_signature`, and `visual_justification` encode the answer and the reasoning path. They live under `meta.*`, the learner export is **allowlist / deny-by-default** (only explicitly listed fields ship), and a test asserts no `meta.*` field appears in any learner-facing export. A naive serialization that dumps the item object would otherwise publish the key.

**Stay inside the renderer.** Only use committed params/patterns the renderer's `validate` accepts. Do not request deferred patterns (capnography `hypoventilation`/`hyperventilation`) or single-timepoint vitals charts. If the clinical idea needs something the renderer can't carry honestly, write it as a text item in the appropriate topical lane instead.

**IDs:** disjoint prefixes `cap_*` and `vit_*`, sequential within lane, same collision-proof scheme as the rhythm-strip lanes.

---

## 1. `cap_*` — capnography generation prompt

### Role
You generate NCLEX-RN items where the **shape of an EtCO2 capnogram** is the load-bearing cue. The renderer supports exactly five patterns; the morphology→meaning mapping below is verified and is the only mapping you may key answers to.

### Verified clinical anchors (cite these; do not extend them)
- **Normal** — rectangular: sharp upstroke, flat alveolar plateau, quick return to baseline; EtCO2 35–45 mmHg. Adequate ventilation and perfusion.
- **Shark-fin** — sloped/prolonged upstroke with loss of the flat plateau (alpha angle opens); obstructive/reactive airway (asthma, COPD, bronchospasm). Steeper slope = worse obstruction. **A crisp upright waveform means there is no bronchospasm** — use this as your primary distractor anchor.
- **Flat** — no CO2: apnea, esophageal intubation, or circuit disconnection. (Cardiac arrest with compressions gives a *low attenuated* trace, not a flat line — that is the `rosc` family, not `flat`.)
- **ROSC** — abrupt EtCO2 rise during CPR; the `rosc` step-up.
- **Rebreathing** — inspiratory baseline fails to return to zero (elevated baseline); exhausted soda lime or a faulty valve.

### Lane-specific traps the stem must resolve
1. **Flat is ambiguous.** A flat strip alone cannot distinguish apnea vs esophageal placement vs disconnection. The stem must give the disambiguator (e.g., "immediately after intubation, absent chest rise, gurgling over the epigastrium" → esophageal). The keyed answer must be the *only* one consistent with stem + strip.
2. **Shark-fin doesn't name the disease.** It signals obstruction, not asthma-vs-COPD. If the answer is a specific disease, the stem (history, age, triggers) must carry that; the strip only carries "obstruction present."
3. **Crisp-waveform distractors.** For an obstruction item, include a high-quality distractor that would produce a crisp waveform with a different EtCO2 (pulmonary edema → crisp + rising EtCO2; hyperventilation → crisp + low EtCO2). This tests the rule that morphology, not just the number, is the cue.

### `meta` contract fields for `cap_*`
- `pattern_keyed`: the capnography pattern the answer depends on.
- `stem_disambiguators`: list the stem facts that make the answer unique (required when `pattern_keyed === 'flat'`).
- `source`: authoritative citation for the morphology→meaning claim.

### High-yield targets (fill against coverage gaps)
Bronchospasm recognition (shark-fin vs crisp), esophageal vs tracheal placement (flat immediately post-intubation), ROSC recognition during a code, rebreathing troubleshooting. Do **not** generate items whose only cue is the EtCO2 number.

---

## 2. `vit_*` — vitals_trend generation prompt

### Role
You generate items where a **trend or relationship across a vitals time-series** is the load-bearing cue. Single-timepoint vitals belong in text — do not generate them here.

### Clinical anchors
Key answers to recognizable physiologic trajectories, e.g.:
- **Compensated → decompensated shock:** HR rising while BP is initially maintained by a *narrowing pulse pressure*, then SBP/MAP falling. Recognizing the compensated phase (normal-ish BP, tachycardia, narrow pulse pressure) is high-yield.
- **Sepsis progression:** rising HR/RR (± temp), then falling BP.
- **Postoperative hemorrhage:** rising HR, narrowing pulse pressure, falling BP over serial readings.
- **Response to intervention:** vitals normalizing after fluids/pressors/antipyretics.

Use **current, cited** normal ranges and the MAP perfusion threshold from the reviewed reference table in the schema doc; do not hardcode ranges in the item. Where MAP is load-bearing, supply SBP/DBP and let `selfCheck` compute `MAP = DBP + (SBP − DBP)/3` — never hand-key MAP.

### Lane-specific trap the stem must resolve
A trend shape under-determines the cause. Rising HR + falling BP fits hemorrhage, sepsis, anaphylaxis, cardiogenic shock, and more. The stem (procedure, history, context) must constrain to the keyed cause, and distractors should be alternative causes that the *stem* — not the chart — rules out. Verify no distractor interpretation fits the same chart **and** the same stem.

### `meta` contract fields for `vit_*` (these feed `selfCheck`)
- `expected_trend`: explicit, machine-checkable — `{ vital, direction: 'up'|'down'|'flat', window: [startHr, endHr] }`, one per load-bearing trend. `selfCheck` asserts each holds in the rendered series. If you can't name the trend the answer turns on, the item is decorative — drop it.
- `derived_values_keyed`: any computed value the answer uses (e.g., MAP, pulse pressure) so `selfCheck` recomputes rather than trusts.
- `reference_bands`: which series show a normal band, the cited range, and the **`population`/age band** the ranges come from (required — adult vs pediatric ranges differ and the wrong band silently corrupts a "below normal" cue).
- `source`: citation for any range/threshold the answer turns on.

### High-yield targets (fill against coverage gaps)
Sepsis recognition, shock progression (narrowing pulse pressure → falling MAP), postoperative deterioration, evaluating response to an intervention.

---

## 3. Output & handoff

- Write raw items to the kind's raw staging location per the schema doc (the canonical `banks/visual-canonical.json` is the *promote* target, not the raw target).
- Each batch is small and reviewable; attach the `coverage-report` gaps the batch addresses so review can see intent.
- Every item must independently pass `validate` and `selfCheck` *before* it enters human review — a `selfCheck` failure is a build failure, not a review note. Items go to the **audit pass** (next spec) before promotion.
