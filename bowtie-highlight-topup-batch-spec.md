# Bowtie & Highlight Top-Up — First Marginal-Fill Batch Spec

Date: 2026-07-02
Author: Claude (architect/review seat)
Status: ready for generation. This is a **content-lane** spec, not a Codex code task — it drives the generation → cross-model review → promote → ledger pipeline, no source or schema changes.

## 0. Why this is allowed to run now

Per the 2026-07-02 endgame rescope in `DECISIONS.md` (*"Content generation freeze — lifted … marginal fills carved out of the observation gate"* + *"Bowtie direct-generation lane — opened"*), census-obvious format top-ups are carved out of the observation gate. This batch closes the two largest format gaps, both justified by arithmetic already on disk in `BANK-CENSUS.md`:

- **bowtie: 110 vs 185 item-type target** (largest gap)
- **highlight: 112 vs 185 item-type target** (second largest)

This is the first exercise of the newly-opened **direct standalone-bowtie lane** — bowties here are generated directly, not harvested from a case-skeleton BOW-TIE SYNTHESIS zone. That lane's clinical-validity conditions (below) are load-bearing precisely because the compiler-authored origination requirement has been removed.

Nothing here sets direction: no new topic areas, no new visual kinds, no schema movement. If review reveals the direct bowtie lane produces weak differentials, the `DECISIONS.md` reversal clause applies (re-tighten to compiler-only) — flag it, don't push through.

## 1. Scope & counts

Two disjoint sub-batches, one file each, saved under `banks/banks-raw/`. Keep each batch small per the portable-prompt truncation caution (chat UIs cap output).

| Sub-batch | Item type | Count | Raw filename | Routes to |
|---|---|---|---|---|
| A | `bowtie` (standalone) | 6 | `banks-raw/<source>-bowtie-2026-07-02.json` | model-origin canonical by source prefix |
| B | `highlight` (standalone) | 6 | `banks-raw/<source>-highlight-2026-07-02.json` | model-origin canonical by source prefix |

`<source>` is the generating model's lane prefix (`gpt-`, `gemini-`, `claude-`) per `CANONICAL_PREFIXES` in `lib/canonical-routing.ts` — routing is by filename prefix, so name the file for whichever lane generates it. Do **not** route these to any visual-kind canonical; neither item type carries a load-bearing `question.visual` (bowtie is never split and has no stimulus visual; these highlights are text-passage items).

If a batch truncates mid-JSON, re-run for fewer items rather than repairing by hand. Two clean 6-item batches beat one truncated 12.

## 2. Topic targeting (from the census, not invented)

Weight generation toward the `PRIORITIZE_TOPICS` double-gaps in `BANK-CENSUS.md` — topics that are under-covered **and** name the target format in their "add:" list, so each item closes two gaps at once. As of the 2026-07-02 census:

**Bowtie priority topics** (census lists `bowtie` in their add-set):
- Therapeutic Communication
- Suicide & Crisis Intervention
- Reproductive & Endocrine Health
- Dosage Calculations
- Diabetic Ketoacidosis (DKA)
- Patient & Environment Safety
- Standard Precautions & Hygiene

**Highlight priority topics** (census lists `highlight` in their add-set):
- Burn Management
- Dosage Calculations
- Diabetic Ketoacidosis (DKA)
- intrapartum fetal monitoring

Spread the 6 items of each sub-batch across at least 4 distinct priority topics — do not stack 6 bowties on one topic. Respect `AVOID_TOPICS` (Cardiovascular Disorders, Mental Health Disorders, Medication Safety & Admin, Prioritization & Delegation, Legal & Ethical Principles, Transmission-Based Precautions, Procedural Complications & Dialysis) as a **soft** de-emphasis, not a ban. Re-pull `npm run coverage-report` at generation time if this batch is written more than a few days out — the priority/avoid sets drift as content lands.

## 3. Shape: defer to the schema, do not restate it

Per `DECISIONS.md` principle 21, the generating instances read the repo, so the prompt carries the semantic floor, not the schema shape. Use the existing portable prompt `NCLEX-Bank-Generation-Prompt.md` with the PARAMETERS block set for each sub-batch (`ITEM_TYPES: bowtie` / `ITEM_TYPES: highlight`, `INCLUDE_VISUALS: no`, priority/avoid topics from §2). Shape authority is `NCLEX-Question-Schema.md`:

- Standalone `bowtie` requires `schemaVersion "1.4"` or later; author at the current `"1.6"` unless a batch has a specific reason otherwise (`meta.schemaVersion` is validated at the floor, not pinned to exactly 1.4).
- `highlight` (including the Tier-0 structural gate) requires `"1.3"` or later; likewise author at `"1.6"`.
- Do not restate field shapes in the generation prompt — the schema doc and the validator own them.

## 4. Format-specific semantic floor (the part review actually gates)

These are the item-writing requirements the schema/validator can't enforce and that content review must check. Everything in the portable prompt's CONTENT REQUIREMENTS still applies (no filler distractors, per-choice clinical reasoning, closed-world stems, bilingual parity, specific `topic` labels, unique prefixed IDs); the additions below are what's specific to these two formats.

### Bowtie — the differential and parameter pools are the whole item

A bowtie's clinical validity lives in its three zones. The direct lane is only sound if each zone survives review as if a case-skeleton author had supplied it:

- **Condition differential:** the two competing conditions must *genuinely compete* with the keyed condition — same presenting picture, distinguished only by the confirming data. A "competing" condition that any nurse rules out from the stem alone is filler and fails review. This is the single most likely failure mode of direct generation and the primary thing review is gating.
- **Actions:** the two correct priority actions must both be defensible first-line actions for the keyed condition; the two wrong actions must be realistic wrong-priority or unsafe choices, not nonsense.
- **Parameters:** the two confirming parameters must actually confirm the keyed condition; the two "irrelevant" parameters must be *genuinely irrelevant to this differential* — not merely less important, and not a parameter that would in fact help distinguish the conditions (that would make it relevant and the item wrong). A mismatched-template distractor lifted from an unrelated condition (e.g. refeeding-shift parameters attached to a hypokalemia item) reads as irrelevant but is lazy; prefer parameters that are plausibly-tempting-but-truly-orthogonal for this specific vignette.
- **Self-contained stem:** because standalone bowtie has no case exhibits, the synthesis vignette must carry every fact the three zones resolve against. No dangling reference to data that would have lived in a case chart.

### Highlight — cue quality and the anti-"highlight everything" gate

- The passage must contain at least one genuine selectable **distractor** segment (a clinically-plausible-but-not-correct sentence/phrase) — this is Tier-0 enforced, but review must confirm the distractor is a *real* near-miss, not an obviously-irrelevant throwaway that makes the gate pass trivially.
- The correct selection must be a bounded, defensible set — the finding(s) that actually answer the stem — not "most of the passage." An item where selecting nearly everything scores correct defeats the format.
- Passage segment order is clinically meaningful and is never shuffled (it's real chart/narrative order); write it as it would actually appear.
- Bilingual parity applies at the segment level: the EN and ZH passages must segment to the same clinical units so the selectable set maps cleanly across languages.

## 5. Distributional hygiene (per-batch, not self-healing)

Per the 2026-07-02 correction in `DECISIONS.md`, the SATA-count and ordered-response-template backlogs are **frozen debt** — this batch neither worsens nor heals them, and neither format is a SATA/ordered-response type, so those specific gates don't apply here. The applicable discipline: don't let the 6-item batch itself become degenerate on any axis review can see (all 6 on one topic, near-identical stems, repeated differential structures across bowties). Vary clinical scaffolding across the batch.

## 6. Review & promotion chain (producer ≠ checker)

Standard pipeline, no shortcuts. The generating model **never** reviews its own batch (`DECISIONS.md` principle 2/5). Route each raw file:

1. **Generate** → save raw under `banks/banks-raw/` with the correct source-prefixed filename (§1).
2. **Normalize** → `npm run normalize-raw-bank -- banks/banks-raw/<file>.json` (dry-run; `--write` only after reviewing the report).
3. **Validate** → `npm run validate-bank -- banks/banks-raw/<file>.json`.
4. **Cross-model review** → a non-generating model flags per the §4 floor. Not Gemini for content-judgment review (standing restriction; Gemini is raw-volume/flag-only). If Gemini *generated* a sub-batch, route its review to GPT or Claude; if GPT generated it, route to Claude.
5. **Claude promotion gate** → I adjudicate the §4 clinical-validity floor, especially the bowtie differential/parameter pools, before anything lands. This is the last step before promotion.
6. **Promote** → `npm run promote` (shuffle + validate → `banks/_promoted/`).
7. **Audit** → `npm run audit` (raw draft + staged promoted file both present for `audit:integrity`).
8. **Consolidate** → `npm run consolidate -- --dry-run` then `npm run consolidate` (route, ID-collision gate, recount).
9. **Census + docs** → `npm run census` (regenerates `census.json` + `BANK-CENSUS.md`), commit both alongside the bank change or `census:check` fails CI.
10. **Ledger** → update `BANK-REVIEW-LEDGER.md`: status, and the deleted raw source filename under Merged Source Batches. `Chain:` line names the generate + non-generating-reviewer + Claude-gate roles (no case-skeleton fact-check step applies here — these are direct standalone items, not skeleton-derived, so do **not** write the forward-case `Opus → GPT compile → Gemini review` chain; write the direct-lane chain actually used).
11. **Delete raw** only after merge + audit pass + ledger update.

## 7. Acceptance

- [ ] Two raw batches generated (6 bowtie, 6 highlight), each spread across ≥4 §2 priority topics
- [ ] Each sub-batch reviewed by a non-generating model, then Claude-gated on the §4 floor
- [ ] Bowtie differentials confirmed genuinely-competing; "irrelevant" parameters confirmed truly orthogonal — the direct-lane clinical-validity conditions
- [ ] Highlight correct-sets confirmed bounded (not "highlight everything"); distractor segments confirmed real near-misses
- [ ] `validate-bank`, `promote`, `audit`, `consolidate` all green; no ID collisions
- [ ] `npm run census` regenerated and committed; `BANK-CENSUS.md` shows bowtie/highlight counts moved up
- [ ] `BANK-REVIEW-LEDGER.md` updated with correct direct-lane `Chain:` line and deleted raw filenames
- [ ] No source, schema, sampler, or visual-canonical changes touched by this batch
