# Exhibit Flowsheet Extraction — Deterministic Proposal + Worst-Case Smoke Batch

Date: 2026-07-03 (amended 2026-07-04 after smoke batch 1)
Status: implemented migration contract; the migration closed 2026-07-13. Rule F remains active as
the normative disposition rule referenced by `DECISIONS.md`; the smoke-batch and migration-history
sections below are retained as provenance. This spec originally defined (1) the deterministic
extraction contract and gate, and (2) a deliberately worst-case 6-panel smoke batch for Luke's
hand-adjudication before any migration windows were spent.
Companion to `Archive/root-cleanup-2026-07-05/CHART-FIDELITY-INVESTIGATION-2026-07-03.md`;
smoke-batch-1 results in
`Archive/root-cleanup-2026-07-05/EXHIBIT-FLOWSHEET-SMOKE-ADJUDICATION-2026-07-04.md`.

**Amendment log.** 2026-07-04, after smoke batch 1 (all 6 panels passed the gate; prior/trend/
serial selection and out-of-scope discipline were clean, but two gaps surfaced): (1) Rule C now
captures the byte-exact `sourceUnit` and defers canonicalization to the renderer, fixing the
platelet `18,000/µL` → `18,000 ×10⁹/L` 1000× defect; (2) new **GATE 4** (dimensional sanity)
recomputes value-in-unit against each analyte's `sanity{min,max}` so that value+unit mismatch fails
deterministically instead of relying on senior review; (3) new **Rule F** reclassifies
`post_intervention` from an `excludedValues` reason to a keyed `panel[]` entry with a `context` tag,
so a post-intervention reading (the current value) is no longer discarded. The smoke-batch templates
below are updated to the amended record shape for a confirmatory second run.

**2026-07-11 — Rule F refined (Luke ruling, architect-ratified).** Added the operative test for *when* `context: "post_intervention"` applies (directed-measurement or measurement-domain + temporal linkage via explicit language or unambiguous narrative/exhibit sequencing; co-location insufficient), with the `gpt_case_refeeding_syndrome_tpn_01` stages 2-3 worked example. Disposition-model refinement only; no schema, gate-logic, bank, or renderer change. Separately, Schema 2.0 makes the typed panel `bound` field the current authoring contract for censored values. The gate continues accepting the `comparator` exclusion reason only for compatibility with legacy/pre-2.0 staged artifacts; it is not a current authoring alternative to `bound`.

## What the probe changed

The investigation's "only ~9% convertible" number measured pre-formatted *layout* (`clean_kv`
newline blocks), not *extractability*. A deterministic verbatim-containment probe over the 242
convertible panels recovers ≥3 labeled parameters, each appearing verbatim in the source prose,
from **232 of 242 (96%)**, with **zero regex over-capture failures**. Luke's prior — that the
values are mechanically recoverable even when scattered — is correct. My earlier framing was
measuring the wrong axis.

But the probe relocates the risk rather than removing it. Of the 232 clean-extractable panels,
only **4 are "pure"** (little narrative remains after removing the values); **228 are "woven"** —
extraction succeeds but ≥8 words of clinically load-bearing prose remain (drain output, neuro exam,
line status, orders, social context). So the hard problem is not *can a model extract the values*
(it can, and we can check it deterministically). The hard problems are:

1. **Prior/trend/serial-value traps (7 panels + all serial-timepoint exhibits).** Constructions like
   `96/58 (down from 118/72 earlier)`, `64 kg (weight four weeks ago was 68 kg)`, and
   `BP 142/90 at 1:00 PM ... 138/88 at 1:30 PM` contain multiple values where only one (or none) is
   the "current" reading. A naive extractor silently grabs the wrong number. This is the
   clinical-safety defect class the deterministic-core principle exists to prevent.
2. **What happens to the residual narrative.** If a flowsheet *replaces* the exhibit, the 228 woven
   panels lose their surrounding clinical prose. If it *supplements*, vitals render twice. This is a
   product-design fork the smoke batch is designed to expose.

## The deterministic contract (how this stays inside DECISIONS principles 3, 8, 11)

The model never writes canonical values as authority. It emits a **proposed structured `panel`
that is a derived view of the prose**, and a deterministic gate reconciles it to the source:

- **GATE 1 — verbatim containment.** Every `value` string in the proposed panel must appear
  verbatim in the source `content.en`. Mechanical string search; a value that does not round-trip
  is auto-rejected. Catches hallucination and transposition.
- **GATE 2 — exclusion accounting (advisory source sweep + hard supplied-exclusion validation).**
  Every supplied `excludedValues[]` entry must be an allowlisted label, must round-trip verbatim,
  and must use a gate-accepted reason. Current Schema 2.0 extraction authors exclusions only for
  `{prior, trend, serial}`; censored values are keyed with `bound`. The gate additionally accepts
  legacy/pre-2.0 `comparator` exclusions so already-staged artifacts remain inspectable, but new
  extraction must not author `comparator` as an alternative to `bound`. The gate also runs a
  best-effort source sweep that WARNs when an allowlisted-looking measurement label appears in the
  source but is neither keyed nor excluded. That sweep is advisory rather than fail-closed because
  free-prose tokenizing cannot deterministically distinguish patient measurements from reference
  ranges, protocol thresholds, or name collisions. Authoritative completeness and current-vs-prior
  selection remain answer-key + Claude adjudication responsibilities. Off-allowlist tokens are out
  of scope and never appear here (Rule B). Note `post_intervention` is **not** an exclusion reason
  (see Rule F): a post-intervention reading is the current value and is *keyed*, not excluded.
- **GATE 3 — narrative preservation.** The prose `content` is **not** mutated. The structured panel
  is additive (new optional field); the exhibit keeps its full bilingual prose. This sidesteps the
  prose-surgery-on-canonical prohibition entirely — nothing is removed from reviewed content.
- **GATE 4 — dimensional sanity (added 2026-07-04 after the smoke batch).** Each keyed value,
  interpreted in its `sourceUnit`, must fall within the analyte's `sanity{min,max}` band from the
  registry (converting the source unit to canonical first). This is the deterministic catch for the
  value+unit mismatch class that GATE 1 structurally cannot see: GATE 1 proves the value string came
  from the prose, but a byte-exact value carrying the wrong unit scale still passes it. Platelets
  `18,000` interpreted as `×10⁹/L` is `18,000 ×10⁹/L`, which blows past the platelets
  `sanity.max = 2000` and fails GATE 4; interpreted correctly as `/µL` (= `18 ×10⁹/L`) it passes. A
  GATE 4 failure routes to human review rather than auto-rejecting, because it can also fire on a
  genuinely extreme-but-real value — but it converts a silent 1000× clinical misread into a loud
  stop. This is principle 3/11 applied: the one arithmetic check that closes the gap lives in a
  script, not in model judgment.
- **Producer≠checker.** The junior model (Codex/Gemini) proposes; the deterministic gate is the
  primary check (not a second LLM); Luke adjudicates the residual that the gate flags; a senior
  model (Sonnet in Claude Code) does a second-pass *semantic* review only on gate-passing panels
  (did it pick the clinically-current value when several round-trip verbatim?). The senior model is
  reviewing selection judgment, not re-doing OCR, because the gate already guarantees containment.

Note the boundary: GATE 1 proves a value *came from* the prose. It does **not** prove the model
picked the *right* value when several are present (the `(was 4.1)` case — both `3.2` and `4.1`
round-trip). That residual is irreducibly semantic and is exactly what Luke's adjudication + the
senior semantic pass exist to catch. The smoke batch is loaded with these so the reconciliation
rate is measured on the hard cases, not the easy ones.

## Reference/flag columns are explicitly OUT of this pass

This extraction emits values + units only. Deriving Epic-style H/L flags or reference-range columns
depends on the `lab_trend`/`vitals_trend` registry bands, and `lab_trend` bands are still marked
PLACEHOLDER pending source-verification. Values-only ships without that dependency; flag/range
columns are a separate, later decision gated on band verification.

## Extraction target specification (resolves the pre-handoff prompt-risk flags)

The gate is only as good as the definition of *what is a keyable measurement*. The rules below
close that definition so the junior model has no discretion on scope, format, or unit — discretion
is confined to the one irreducibly semantic call (current-vs-prior selection) that the senior pass
and human adjudication exist to check. All are normative for the smoke batch and the final
spec. Rules A–E fold in the pre-handoff review flags (Codex, 2026-07-03); Rule F and the `sourceUnit`
clause of Rule C were added 2026-07-04 after smoke batch 1.

**Rule A — the measurement allowlist is closed, and it defines scope, label, and unit.**
A number is *accountable* (eligible to be keyed or to require exclusion) only if its source label
maps to an entry in a closed allowlist — the vital-sign and lab-analyte lexicon already owned by
`src/visuals/kinds/vitals_trend` (`VITAL_DEFS`) and `src/visuals/kinds/lab_trend` (`ANALYTE_DEFS`).
Each allowlist entry carries a canonical `label` (the panel renders this, not the source's wording)
and a canonical `unit`. The extractor supplies the *value*; `label` and `unit` come from the
registry, never from parsing. This resolves the unitless-measure flag: HR->`bpm`, RR->`/min`,
SpO2->`%`, Temp->`°C`, and every analyte inherits its registry unit. A label that does not map to
the allowlist is not a measurement for this lane.

*Registry access (implementation note).* `VITAL_DEFS` and `ANALYTE_DEFS` are currently **private
module constants** (`vitals_trend/index.ts:6`, `lab_trend/index.ts:28`). The prose gate reasons
about them by reference, but the implementation-phase gate script needs machine access. The clean
move is a small shared allowlist module (e.g. `src/visuals/kinds/_shared/measurementAllowlist.ts`)
that both renderers and the gate import — deriving `{ key, label, unit }` from the existing defs so
there is a single source of truth and no duplicated lexicon. This is a Codex implementation task,
not a smoke-batch prerequisite; the smoke batch uses the enumerated keys below directly.

*The v1 allowlist keys (from the live registries).* Vitals (`VitalKey`): `hr`, `sbp`, `dbp`, `map`,
`rr`, `spo2`, `temp`. Lab analytes (`LabAnalyteKey`): `sodium`, `potassium`, `chloride`,
`bicarbonate`, `anion_gap`, `bun`, `creatinine`, `glucose`, `calcium`, `ionized_calcium`,
`magnesium`, `phosphate`, `lactate`, `troponin_t`, `bnp`, `wbc`, `hemoglobin`, `hematocrit`,
`platelets`, `inr`, `ptt`, `ph`, `paco2`, `pao2`, `hco3_abg`, `ast`, `alt`, `total_bilirubin`,
`ammonia`.

*BP composite policy (resolves the sbp/dbp flag).* The vitals registry has **no `bp` key** — it has
separate `sbp` and `dbp`, each `mmHg`, each with its own normal band (`sbp` 90–120, `dbp` 60–80). So
a source `blood pressure 96/58` extracts as **two keyed entries**, `sbp` value `96` and `dbp` value
`58`, never a composite `bp` entry with value `96/58`. A composite would map to no allowlist entry
(failing this rule) and would break any future per-parameter flag derivation. Note the byte-exact
consequence for GATE 1 (Rule E): the keyed value `96` must round-trip against the `96` inside the
source token `96/58`, which it does as a substring — the gate checks substring containment, so
`96` and `58` each round-trip individually.

*Intentionally out-of-scope lab values (call-out, not a miss).* Because the allowlist is closed to
the registry, several clinically important smoke-batch values are **deliberately not extracted**,
and this is correct behavior, not extractor failure: serum **lithium** level, **eGFR**, serum
**osmolality**, **albumin**, **prealbumin**, **triglycerides**, **C-reactive protein (CRP)**,
**alkaline phosphatase**, and body **weight (kg)**. None has a registry entry, so under Rule B they
are out of scope by construction — neither keyed nor listed in `excludedValues`. If any of these
later warrants a flowsheet row, it must first be added to the registry (with a source-verified
reference band), which is a separate, gated change. The smoke-batch adjudication should treat their
absence from the panel as expected.

*Source-label synonym map (implementation note).* The deterministic gate must own a small synonym
map from common prose labels to allowlist keys; this is not left to fuzzy model judgment. Smoke-batch
examples include `heart rate`/`HR`/`sinus tachycardia at ___ bpm` -> `hr`, `respiratory rate`/`RR`
-> `rr`, `SpO₂`/`SpO2` -> `spo2`, `temperature`/`T` -> `temp`, `blood pressure`/`BP` -> `sbp` +
`dbp`, `blood glucose`/`glucose` -> `glucose`, `phosphorus` -> `phosphate`, `Hgb`/`hemoglobin` ->
`hemoglobin`, and `total bilirubin` -> `total_bilirubin`. The implementation-phase shared
allowlist module should export this synonym map alongside `{ key, label, unit }`; the junior model
may use the same map in the handoff prompt, but the gate is the authority.

**Rule B — everything off the allowlist is out of scope by construction, not "excluded with reason."**
GATE 2 accounting applies *only* to allowlisted labels. Durations (`24 hours`, `every 12 hours`,
`10 to 14 days`), dose frequencies and amounts, pain scores (`5 out of 10`), GCS component and total
scores (`(3)`, `total 12`), reflex grades (`3+`), capillary-refill seconds, catheter/line sizes,
anatomic levels (`T8`), motor-strength grades (`3 out of 5`), and drain volumes are **never**
accountable tokens. They are not keyed and not listed in `excludedValues`; they are simply not in
scope. This resolves the noisy-accounting flag: `excludedValues` stays small and meaningful,
reserved for allowlisted measurements that were deliberately set aside (a prior/trend/serial value
of a vital or analyte). Reference ranges and protocol thresholds attached to an allowlisted label
(`magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL)`, lithium therapeutic/toxic thresholds, etc.) are
also non-patient comparator values, not patient measurements; they are neither keyed nor excluded.
Urine output is allowlist-*optional*: include `urine_output_ml` only if the migration wants it; if
excluded from the allowlist it is out of scope like the rest.

**Rule C — one canonical value per measurement; the source unit is captured, canonicalization is deferred to the renderer.**
When a measurement appears with a parenthetical unit conversion (`38.9 °C (102.0 °F)`,
`WBC 0.3 × 10³/µL`), the canonical value is keyed once and the alternate-unit form is neither keyed
nor an excluded value — it is suppressed as a `unit_alias`. Keying both double-counts; forcing the
conversion into `excludedValues` with a prior/trend reason mislabels it (it is the same reading, not
a prior one). The same "one measurement, key once" principle covers a value restated by a second
**modality** in one assessment window — a vitals `HR 118` and the concurrent ECG's `sinus tachycardia
at 118 bpm`, the same number from two corroborating instruments. Key it once from the primary
(vitals) mention; the modality restatement is neither keyed again nor an `excludedValues` entry,
exactly like a unit alias. This is distinct from Rule D, which excludes an exhibit only when a
parameter carries two **different** current values a single cell cannot hold; identical values from
corroborating modalities carry no such ambiguity and stay in `extract`. (Amended 2026-07-05 after the
batch-12 clozapine `day18_assessment` escalation.)

*The keyed value is byte-exact; the keyed `unit` is the source's unit, not the registry's.* This is
the fix for the smoke-batch platelet defect (`platelets 18,000/µL` keyed as `18,000 ×10⁹/L` — a
1000× error, because `18,000/µL` = `18 ×10⁹/L`). The registry canonical unit must **not** be stamped
onto an unconverted source value. Instead, each panel entry carries a required `sourceUnit` field
holding the byte-exact unit expression as written in the prose (`/µL`, `× 10³/µL`, `mg/dL`, `mmHg`,
etc.), and the extractor never converts. Canonical display conversion is the **renderer's** job:
`lab_trend`/`vitals_trend` already own `canonicalUnit` + `altUnits` per analyte, so the one
dimensional operation lives in the single audited place that has the conversion factors, not in the
extractor. This keeps GATE 1 intact (the value still round-trips verbatim) and removes the
value+unit mismatch class entirely: the extractor emits `{ value: "18,000", sourceUnit: "/µL" }` and
the renderer converts to `18 ×10⁹/L` at display time. A `sourceUnit` that is neither the registry
`canonicalUnit` nor a listed `altUnit` (nor a recognized plain variant like `/µL` / `K/µL`) fails
the gate for human review rather than rendering wrong.

For CBC-style prose where the source embeds a legacy unit/count notation, `unitAliases[]` still
records the byte-exact source unit expression for audit visibility, in addition to the per-entry
`sourceUnit`. The smoke batch therefore treats `WBC 0.3 × 10³/µL` as keyed `wbc` value `0.3`,
`sourceUnit "× 10³/µL"`, with `unitAliases: [{ "aliasOf": "wbc", "value": "0.3 × 10³/µL" }]`. The
gate recognizes a token as a unit alias only when it is a same-measurement conversion adjacent to a
keyed value; anything else remains accountable.

**Rule D — an exhibit with >=2 current readings of one parameter (same client) is OUT of the extraction lane (deterministic exclusion; amended 2026-07-05).**
The flowsheet lane emits at most one current value per allowlisted parameter per exhibit, **for the
same client / same flowsheet subject**. Set prior/trend history aside first: a value explicitly marked
superseded ("down from", "was", "baseline N", "earlier", "prior") is excluded with reason
`prior`/`trend` (Rule handled) and does not count here. If, for one client, an allowlisted parameter
still carries **>=2 current readings with differing values** in one exhibit, the exhibit is flagged
`serial` and **excluded from flowsheet extraction entirely** — it stays prose. (Two mentions of the
*same* value via corroborating modalities — a vitals HR and the concurrent ECG rate both `118` — are
**one reading, keyed once** per Rule C, not a serial trigger: identical values carry none of the
choose-among-differing-values ambiguity Rule D exists to prevent.) This reaches two shapes: (i) a time
series across distinct timepoints (Panel 5: BP at 1:00/1:30/2:00/2:30 PM), and (ii) a **closely-spaced
confirmatory repeat** where two current readings jointly establish one clinical state ("166/112 and
164/110 mm Hg 20 minutes apart" — the ACOG severe-range confirmation), neither reading marked
historical. Rationale: a single-column flowsheet has one cell per parameter and no timepoint axis, so
two current readings can only flatten into an ambiguous two-value cell or drop silently to one — the
misrepresent/drop failure this rule prevents — and in the confirmatory case the untouched prose ("...
20 minutes apart") represents the pattern *better* than a single-column flowsheet could, so
`skip_serial` preserves clinical fidelity rather than sacrificing it. A genuine series is what
`vitals_trend`/`lab_trend` exist for, reachable only through the load-bearing-visual gate (Principle
6). **No confirmatory carve-out:** the confirmation-vs-trend distinction is clinically real but has no
deterministic separator (both are low-delta, same-parameter, multi-reading shapes), so admitting
confirmatory repeats to `extract` would require model judgment on lane membership, which this rule
forbids by design.

*Same-subject guard (resolves the multi-victim over-capture).* The ">=2 current readings" trigger is
scoped to **one client**. A multi-victim scene (mass-casualty triage) that carries several patients'
vitals in one exhibit is **not** `serial` — it is `extract` with an **empty `panel[]`**, because the
record shape has no per-victim attribution field and keying any single victim's vitals would
misattribute them to "the" client (batch 10 `#17` `disaster_triage`). Multiple readings of one
parameter across *different subjects* never make an exhibit serial; only >=2 current readings of one
parameter for *the same subject* do.

*Detector status (advisory, not authority).* The independent mechanical serial re-check keys on >=2
distinct timepoint tokens plus >=2 label occurrences. The confirmatory shape defeats both halves — "20
minutes apart" is one relative-gap token (not two timepoints), and "Blood pressure readings: ..." is a
single label occurrence carrying two values — so the detector can neither re-confirm the skip nor flag
the mislabel. A value-pair-count branch and a direct duplicate-current-label record guard are queued
for Codex (`EXHIBIT-FLOWSHEET-CODEX-NOTE-serial-confirmatory-readings-2026-07-05.md`). Lane-membership
authority remains the checker seat + adjudication, per producer≠checker; the detector only routes
candidates.

**Rule E — values are byte-identical after one NFC pass; `sourceSpan` is the exact enclosing sentence.**
GATE 1 containment is byte-exact: each keyed `value` must be a verbatim substring of `content.en`
after a single declared Unicode NFC normalization (so `SpO₂`, `× 10³/µL`, superscript/subscript
digits, comma thousands `18,000`, and en-dash ranges `40–50` are stable on both sides of the
compare). `sourceSpan` must be the **exact enclosing sentence** from `content.en` — itself
containment-checked as a verbatim substring — so the value can be eyeballed in context in one glance
and a paraphrased span is auto-rejected. No paraphrase, no normalization of the source, no
reformatting of the value.

**Rule F — a post-intervention reading is the current value: keyed with `context`, never excluded (added 2026-07-04 after the smoke batch).**
A value framed as the effect of an intervention (`Blood pressure after labetalol: 148/94`) is the
*most current* reading, not a superseded one. The first-pass spec mislabeled `post_intervention` as
an `excludedValues` reason alongside `prior`/`trend`/`serial` — but those three denote values that
are genuinely *not current* (a superseded earlier reading), whereas a post-intervention value is the
live reading and the only one for that parameter in the exhibit. Excluding it discards live clinical
data: in the smoke batch it produced a flowsheet for a magnesium-toxicity / severe-hypertension
patient with **no blood pressure at all**, which is worse than showing the reading. Corrected rule:
a post-intervention reading is **keyed in `panel[]`** with an optional `context: "post_intervention"`
annotation on the entry, and `post_intervention` is removed from the current-authoring
`excludedValues` reason enum (now `{prior, trend, serial}`). Whether the `context` annotation renders as a footnote ("after
labetalol") or is audit-only is a renderer decision, not an extraction one. This was **not** a Codex
error — Codex applied the enum as written; it is a gap in the spec's disposition model, now closed.

*Operative test — when `context: "post_intervention"` applies (added 2026-07-11, Luke ruling, architect-ratified).* Keying a post-intervention reading (above) is not the same as *tagging* it. `context: "post_intervention"` applies to a keyed current measurement only when the source establishes that the measurement occurred **after an intervention directed at that measurement or measurement domain.** Temporal linkage may be explicit language ("after," "following") or unambiguous narrative/exhibit sequencing; **mere co-location in the same exhibit, panel, or timestamp is insufficient.** A background cause of the whole panel (TPN initiation, an evolving disease process) is not a directed intervention and tags nothing. This is an **adjudication rule, not a gate check**: whether an intervention targets a given analyte is the irreducibly semantic call the deterministic gate cannot make (the gate validates only that any supplied `context` is in the closed tag set). Its enforcement is the always-sampled 100% review of every `post_intervention` tag (migration batch protocol), never a deterministic heuristic.

Worked example (`gpt_case_refeeding_syndrome_tpn_01`, stages 2-3). Stage 2 prose: "the nurse administered KCl … sodium phosphate … magnesium sulfate … per protocol … Sliding-scale regular insulin was added … Repeat labs now: potassium 2.9, phosphorus 1.3, magnesium 1.3, glucose 226, creatinine 0.9." **Potassium, phosphate, magnesium** (electrolyte-repletion domain) and **glucose** (insulin) are directed reassessments → tagged. **Creatinine** (no directed intervention) and **all six vitals** (no directed agent) are current values → **not** tagged. Stage 3 ("After interventions, repeat labs …") is identical. The rule closes two symmetric errors this record surfaced: (a) TPN initiation — the true cause of the falling electrolytes — occurs in **stage 1** (already `skip_serial`), so "untag stage 2 because TPN is the cause" misattributes stage 1's causation to stage 2; (b) uniformly tagging the whole stage-2 panel over-applies the tag to creatinine and vitals. The directed-measurement test yields the correct split where both blanket dispositions fail.

**Emitted record shape (updated).** The per-exhibit object has an explicit top-level field for each
of the four dispositions:

```json
{
  "exhibitRef": "<case>/<exhibit>",
  "lane": "extract",
  "panel": [
    { "label": "<allowlist key>", "value": "<byte-exact scalar substring without comparator>", "sourceUnit": "<byte-exact source unit expr>", "sourceSpan": "<verbatim enclosing sentence>", "bound": "> or < (optional; Schema 2.0 censored values only)", "context": "post_intervention (optional; omit if none)" }
  ],
  "excludedValues": [
    { "label": "<allowlist key>", "value": "<byte-exact substring>", "reason": "prior|trend|serial", "sourceSpan": "<verbatim enclosing sentence>" }
  ],
  "unitAliases": [
    { "aliasOf": "<allowlist key>", "value": "<byte-exact substring>" }
  ]
}
```

- `panel[]` — keyed current measurements (allowlisted only). Each entry carries `sourceUnit` (the
  byte-exact unit expression from the prose, per Rule C — the renderer canonicalizes, not the
  extractor) and `sourceSpan`. BP splits to `sbp`/`dbp` per Rule A. The optional `context` field
  carries `"post_intervention"` only when Rule F's operative test is met; omit it otherwise. Under
  Schema 2.0, a censored value stores its scalar in `value` and its comparator in typed `bound`.
- `excludedValues[]` — allowlisted measurements that are genuinely *not current*, with `reason` from
  the closed enum `{prior, trend, serial}`. Off-allowlist tokens never appear here, and a
  post-intervention value is **keyed**, not excluded (Rule F). The gate's additional acceptance of
  legacy/pre-2.0 `comparator` exclusions is compatibility-only and does not expand this authoring enum.
- `unitAliases[]` — alternate-unit conversions of a keyed measurement (Rule C); audit-visible,
  neither keyed nor excluded.
- `lane` — `"extract"` for a normal panel, or `"skip_serial"` for a Rule D serial exhibit. A
  `skip_serial` object carries **only** `{ "exhibitRef", "lane": "skip_serial" }` and omits the three
  arrays entirely.
- Every keyed entry must additionally pass **GATE 4** (dimensional sanity): value-in-`sourceUnit`,
  converted to canonical, falls within the analyte's `sanity{min,max}`.

## Worst-case smoke batch (6 panels for hand-adjudication)

These are **not** representative — they are the deliberately hardest panels, chosen to surface every
failure mode: two parenthetical prior-value traps, the two highest-residual woven panels, one
serial-timepoint exhibit (multiple readings over time), and one scattered post-intervention panel
where the extractor recovered only 2 canonical parameters. If junior extraction + senior audit hold
up here, the easy 96% is trivial. Fill the `panel[]` and `excludedValues[]` for each, then Luke
adjudicates whether every keyed value is the clinically-current one and every excluded value was
correctly set aside. Each template below is pre-populated with its `exhibitRef` and `lane`; the
junior model fills `panel[]` (with `sourceUnit` and optional `context` per Rules C/F),
`excludedValues[]` (reason enum `{prior, trend, serial}`), and `unitAliases[]` per the record shape
above (Panel 5 is pre-set to `skip_serial` and should be left as-is if the serial detector agrees).

### Panel 1: `opus_tpn_case_mucositis_01/exhibit_baseline` (hard-cases)

**Why this is worst-case:** prior-value trap + 23 params + heavy residual

Source exhibit title (EN): Assessment & Baseline Labs (Start of Shift)

Source `content.en`:
```
Baseline assessment at start of night shift: Temperature 38.9 °C (102.0 °F) orally (elevated from 37.2 °C twelve hours earlier), heart rate 112 and regular, blood pressure 96/58 (down from 118/72 earlier in the day), respiratory rate 22, SpO₂ 95% on room air. Weight is 64.2 kg, up 1.8 kg from admission weight of 62.4 kg. The patient is alert but appears fatigued and in significant distress from pain. Oral examination reveals confluent, deep ulcerations across the buccal mucosa, tongue, and soft palate with white-yellow pseudomembranes and areas of bleeding — consistent with World Health Organization grade IV mucositis. Lips are cracked and bleeding. Thick, ropy saliva pools in the oropharynx. The patient gags and winces when attempting to open her mouth fully. Skin is warm, flushed, and dry. The right upper arm PICC dressing is intact but the insertion site shows new erythema extending approximately 2 cm from the insertion point, with mild tenderness on palpation; no purulent drainage is visible, but the area was not erythematous at the previous dressing assessment 48 hours ago. Abdomen is soft, mildly distended, with hypoactive bowel sounds. No stool in 3 days. Peripheral edema is trace bilateral in the lower extremities. Urine output has been 120 mL over the last 8 hours (approximately 15 mL/hr), decreased from 40–50 mL/hr the day prior.

Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated). Blood cultures were drawn from the PICC and peripherally at the time of the temperature spike but results are pending.
```

Source `content.zh` is present in-bank; extraction operates on `content.en` (values are language-neutral tokens), and the ZH prose is left untouched under GATE 3.

Expected output (fill `panel[]` / `excludedValues[]` / `unitAliases[]` per the record shape; empty arrays are valid if a disposition has no members):
```json
{
  "exhibitRef": "opus_tpn_case_mucositis_01/exhibit_baseline",
  "lane": "extract",
  "panel": [
    { "label": "", "value": "", "sourceUnit": "", "sourceSpan": "" }
  ],
  "excludedValues": [
    { "label": "", "value": "", "reason": "", "sourceSpan": "" }
  ],
  "unitAliases": [
    { "aliasOf": "", "value": "" }
  ]
}
```

### Panel 2: `opus_case_lithium_toxicity_01/exhibit_admission` (claude)

**Why this is worst-case:** prior-value trap (weight 4wk ago; creatinine baseline)

Source exhibit title (EN): Admission Assessment & Labs (0800)

Source `content.en`:
```
ASSESSMENT FINDINGS
Temperature 37.1 °C, heart rate 102 and regular, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air. Weight 64 kg (her documented outpatient weight four weeks ago was 68 kg). Mucous membranes dry and tacky. Skin turgor decreased, with tenting over the sternum lasting three seconds. Pupils equal, round, reactive, 3 mm bilaterally. Coarse, irregular tremor in both hands at rest and with intention; no tremor at her last outpatient visit per psychiatry notes. Deep tendon reflexes 3+ bilaterally at the patellar and Achilles tendons with three beats of non-sustained ankle clonus. Gait not assessed because of unsteadiness; the patient is placed on fall precautions. Bowel sounds hyperactive in all four quadrants. Abdomen soft, non-tender. Lungs clear bilaterally. Heart sounds regular, no murmur. Peripheral pulses palpable but thready. Capillary refill 3 seconds in the fingernail beds. Foley catheter inserted per ED; urine output in the ED over the preceding two hours was 40 mL total (approximately 0.3 mL/kg/hr). The patient is able to follow simple commands but drifts off between questions. Glasgow Coma Scale: eye opening to voice (3), confused verbal responses (4), localizes to pain (5) — total 12.

LABORATORY DATA
Serum lithium level: 2.8 mEq/L (therapeutic range per clinic protocol: 0.6–1.2 mEq/L; levels above 1.5 mEq/L are considered toxic). Sodium 148 mEq/L, potassium 3.1 mEq/L, chloride 96 mEq/L, bicarbonate 30 mEq/L, BUN 38 mg/dL, creatinine 1.9 mg/dL (baseline 0.9 mg/dL), glucose 142 mg/dL, calcium 9.4 mg/dL, magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL), phosphorus 3.8 mg/dL. eGFR calculated at 28 mL/min/1.73 m². Serum osmolality 312 mOsm/kg (reference 275–295). ECG: sinus tachycardia at 102 bpm, flattened T waves in leads V4–V6, no ST changes, QTc 460 ms.
```

Source `content.zh` is present in-bank; extraction operates on `content.en`, ZH prose untouched under GATE 3.

Expected output (fill `panel[]` / `excludedValues[]` / `unitAliases[]` per the record shape; empty arrays are valid if a disposition has no members):
```json
{
  "exhibitRef": "opus_case_lithium_toxicity_01/exhibit_admission",
  "lane": "extract",
  "panel": [
    { "label": "", "value": "", "sourceUnit": "", "sourceSpan": "" }
  ],
  "excludedValues": [
    { "label": "", "value": "", "reason": "", "sourceSpan": "" }
  ],
  "unitAliases": [
    { "aliasOf": "", "value": "" }
  ]
}
```

### Panel 3: `opus_scc_case_01/exh_stage3` (hard-cases)

**Why this is worst-case:** highest residual (301 words) — 8 vitals embedded in surgical narrative with several trend values

Source exhibit title (EN): Clinical Course — Postoperative Day 1

Source `content.en`:
```
Approximately 30 hours after admission (roughly 18 hours after posterior laminectomy): The patient is transferred back to the oncology unit from the PACU. She is awake, alert, and oriented. Surgical site dressing at the posterior thoracic spine is clean, dry, and intact with a Jackson-Pratt drain in place with 40 mL of serosanguineous output over the past 8 hours. Vital signs: temperature 37.8 °C, heart rate 78, blood pressure 124/74, respiratory rate 16, SpO₂ 97% on 2 L nasal cannula. Pain is 5 out of 10 at the surgical site, managed on IV hydromorphone. On neurological reassessment: lower extremity motor strength is now 3 out of 5 bilaterally in hip flexors and quadriceps — improved from the 2 out of 5 seen preoperatively. Ankle dorsiflexion is 2 out of 5 bilaterally (improved on the left from 1 out of 5). She can wiggle all toes weakly on command. Deep tendon reflexes remain hyperreflexic (3+) but clonus is no longer sustained — only 1 beat at the left ankle, absent on the right. Babinski sign remains positive bilaterally. Sensory level has improved: she now perceives light touch beginning at T8 and pinprick at T9. Perineal sensation remains absent. The indwelling urinary catheter remains in place, draining clear yellow urine at 60 mL per hour. Blood glucose is 210 mg/dL; a sliding-scale insulin order is in place. Repeat labs: hemoglobin 9.6 g/dL (dropped from 10.8, expected surgical loss), creatinine 0.9 mg/dL (stable), corrected calcium 10.4 mg/dL (slightly improved from 10.8, bisphosphonate and steroids helping), alkaline phosphatase 298 U/L (stable). The dexamethasone is continued at 4 mg IV every 6 hours with a planned taper over the coming weeks. Radiation oncology plans to initiate adjuvant radiation to the T6–T8 field in 10 to 14 days once the surgical wound has begun to heal. The patient's mood is cautiously hopeful. She asks the nurse, "Will I need to learn to use a wheelchair?"
```

Source `content.zh` is present in-bank; extraction operates on `content.en`, ZH prose untouched under GATE 3.

Expected output (fill `panel[]` / `excludedValues[]` / `unitAliases[]` per the record shape; empty arrays are valid if a disposition has no members):
```json
{
  "exhibitRef": "opus_scc_case_01/exh_stage3",
  "lane": "extract",
  "panel": [
    { "label": "", "value": "", "sourceUnit": "", "sourceSpan": "" }
  ],
  "excludedValues": [
    { "label": "", "value": "", "reason": "", "sourceSpan": "" }
  ],
  "unitAliases": [
    { "aliasOf": "", "value": "" }
  ]
}
```

### Panel 4: `opus1_case_tha_discharge_lep_01/pod2_update` (claude)

**Why this is worst-case:** woven labs+vitals with serial creatinine + heavy social/discharge prose

Source exhibit title (EN): Coordination update, renal trend, and teach-back session

Source `content.en`:
```
About 42 hr after surgery: T 36.9 °C, HR 74, BP 128/72, RR 14, SpO₂ 98% on room air. Pain 3/10 at rest and 5/10 with movement. Incision clean with staples intact and no signs of infection. Repeat creatinine 1.4 mg/dL after hydration and adequate oral intake; eGFR 39 mL/min. Hgb 10.0 g/dL.

Social work/case management interviews the client using a telephone interpreter. Her son can be present on the day of discharge and the following day, but not beyond that. She receives Meals on Wheels and has Medicare with a supplemental plan. Case management determines that she qualifies for Medicare home health services because she is homebound and requires skilled nursing plus home PT. The home health referral is initiated.

PT session: Client demonstrates safe walker use on level ground with standby assistance and can perform sit-to-stand from a raised toilet seat independently. Stairs have not yet been attempted. Afternoon PT stair training is planned.

Interpreter-mediated education: A certified in-person Mandarin interpreter is present. The nurse teaches posterior hip precautions, rivaroxaban purpose and 10 mg once-daily schedule for 35 days, bleeding signs, missed-dose instructions, pain medication safety, and when to call the surgeon or seek emergency care. The client accurately repeats key points in Mandarin, demonstrates hip precautions with a model, and identifies the rivaroxaban pill. She states she would need her son to call the surgeon because she cannot navigate the English phone tree alone. The nurse flags this as a remaining barrier.

Afternoon PT: Client negotiates four stairs up and down with a walker and one handrail with standby assistance. PT clears her for discharge home with home PT, front-wheeled walker, raised toilet seat, and reacher/grabber. The nurse requests a Mandarin-translated home exercise program. The surgeon writes a discharge order for postoperative day 3 morning pending nursing confirmation of discharge readiness.
```

Source `content.zh` is present in-bank; extraction operates on `content.en`, ZH prose untouched under GATE 3.

Expected output (fill `panel[]` / `excludedValues[]` / `unitAliases[]` per the record shape; empty arrays are valid if a disposition has no members):
```json
{
  "exhibitRef": "opus1_case_tha_discharge_lep_01/pod2_update",
  "lane": "extract",
  "panel": [
    { "label": "", "value": "", "sourceUnit": "", "sourceSpan": "" }
  ],
  "excludedValues": [
    { "label": "", "value": "", "reason": "", "sourceSpan": "" }
  ],
  "unitAliases": [
    { "aliasOf": "", "value": "" }
  ]
}
```

### Panel 5: `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage3_reassessment` (gpt)

**Why this is worst-case:** SERIAL timepoints — four BP readings over 90 min, no single "current" value. **Under Rule D this exhibit is now a deterministic `skip_serial` — it is excluded from extraction and stays prose.** It remains in the smoke batch as the ground-truth check that the serial detector fires here and the junior model correctly emits `{ lane: "skip_serial" }` rather than inventing a single BP. Adjudicate: did the detector catch it, or did the model try to extract anyway?

Source exhibit title (EN): Reassessment findings

Source `content.en`:
```
At 1:00 PM BP is 142/90. At 1:30 PM BP is 138/88; headache is 4/10; visual spots have resolved; facial edema is unchanged; DTRs are 2+ with no clonus; RR 16/min; patient is alert. Urine output second hour is 45 mL. Magnesium continues at 2 g/hr. Later BP: 140/86 at 2:00 PM and 136/84 at 2:30 PM. Provider plan: continue magnesium for 24 hours from the loading dose, start nifedipine ER 30 mg every 12 hours for maintenance BP control, and repeat HELLP panel in 6 hours.
```

Source `content.zh` is present in-bank; extraction operates on `content.en`, ZH prose untouched under GATE 3.

Expected output (serial exhibit — Rule D; the junior model should reproduce this `skip_serial` object and emit no arrays):
```json
{
  "exhibitRef": "gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage3_reassessment",
  "lane": "skip_serial"
}
```

BP recurs at four distinct timepoints, so the serial detector fires and no
`panel`/`excludedValues`/`unitAliases` arrays are emitted. If the junior model returns a populated
`panel[]` here, that is the failure this panel is designed to catch.

### Panel 6: `case_preeclampsia_magnesium_01/toxicity_assessment` (hard-cases)

**Why this is worst-case:** short + scattered; only 2 canonical params recovered mechanically; the BP is a **post-intervention** value (`after labetalol`). Under **Rule F** this is the current (and only) BP in the exhibit, so it must be **keyed in `panel[]` with `context: "post_intervention"`**, not excluded. The first smoke batch excluded it (per the then-current enum), which left the flowsheet with no blood pressure at all — the defect Rule F now closes. Adjudicate: did the model key sbp/dbp 148/94 with the context tag rather than dropping them?

Source exhibit title (EN): Focused assessment

Source `content.en`:
```
Client is difficult to arouse. RR 10/min. SpO2 93% on room air. Patellar reflexes absent. Urine output 20 mL in the past hour.
Blood pressure after labetalol: 148/94 mm Hg.
```

Source `content.zh` is present in-bank; extraction operates on `content.en`, ZH prose untouched under GATE 3.

Expected output (fill `panel[]` / `excludedValues[]` / `unitAliases[]` per the record shape; empty arrays are valid if a disposition has no members):
```json
{
  "exhibitRef": "case_preeclampsia_magnesium_01/toxicity_assessment",
  "lane": "extract",
  "panel": [
    { "label": "", "value": "", "sourceUnit": "", "sourceSpan": "", "context": "post_intervention" }
  ],
  "excludedValues": [
    { "label": "", "value": "", "reason": "", "sourceSpan": "" }
  ],
  "unitAliases": [
    { "aliasOf": "", "value": "" }
  ]
}
```

## Adjudication rubric (what Luke records per panel)

For each panel, mark:
- **Containment:** did every keyed value round-trip verbatim? (deterministic — the gate answers this)
- **Selection correctness:** is every keyed value the *current* reading, not a prior/trend value? (human)
- **Exclusion correctness:** was every non-keyed measurement correctly excluded with the right reason? (human)
- **Context correctness:** `post_intervention` disposition follows Rule F's operative test; reference
  Rule F rather than restating its semantics here. (human)
- **Residual integrity:** if this panel were rendered as a flowsheet alongside the untouched prose,
  does the combination read cleanly or is the duplication distracting? (human — the product-design call)
- **Cost signal:** subjective note on junior-model effort and senior-audit effort, for the
  windows-cost estimate.

## Decision this smoke batch informs

- If selection + exclusion correctness are high on these worst-case panels → junior extraction with
  the deterministic gate + senior semantic pass is trustworthy; scope the full 232-panel migration.
- If the prior/trend/serial panels show mis-selection the gate can't catch → restrict the migration
  to the non-trap subset and hand-author the traps, or pivot to structured-first authoring for new
  content only (leave legacy prose alone).
- Either way, the residual-integrity calls decide replace-vs-supplement, which is the actual schema
  shape question.

## What this did not do

No schema change, no bank edit, no renderer, no new visual kind, no windows spent. Read-only scan +
this proposal only.
