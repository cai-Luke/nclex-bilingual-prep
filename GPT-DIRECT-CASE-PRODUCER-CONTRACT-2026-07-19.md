# GPT Direct-Case Producer Contract — Pilot Revision 1

Date: 2026-07-19

Status: **active pilot contract**

Applies to: direct GPT-authored unfolding `case_study` commissions that explicitly incorporate this
contract, beginning with Pilot Cases C and D

## 1. Purpose and seat

This contract governs one producer authoring one coherent case in one GPT context. It adds an
explicit design-and-audit phase between the clinical commission and final JSON without restoring the
retired one-question-per-NCJMM-step skeleton pipeline.

The producer owns the patient, episode, progression, exhibits, item formats, distractors, rationales,
bilingual copy, and final case structure. The producer is not the checker. Generated output remains
raw and unreviewed until a separate non-GPT checker verifies clinical keys, source support,
collisions, leakage, bilingual parity, and any visual.

The individual commission owns the topic, output path, ID namespace, comparator fences, governing
sources, and topic-specific constraints. On conflict, the individual commission may narrow this
contract but may not waive repository schema, runtime visibility, source fidelity, or independent
review.

## 2. Repository authority and read order

Before authoring, read:

1. `AGENTS.md`;
2. `PROJECT-HISTORY.md`;
3. `NCLEX-Question-Schema.md`;
4. `src/types.ts`, `src/schema.ts`, and `src/examLayout.ts` for any field or runtime behavior used;
5. the individual Case C or Case D commission;
6. the named comparator items and current valid examples of every intended embedded item type.

The repository owns all JSON shapes, enums, version floors, rendering behavior, and validation rules.
Do not reproduce a remembered schema or trust an older prompt when live code differs.

## 3. Final disk boundary

Create exactly the raw bank path named by the individual commission. Do not return question JSON in
chat. Before writing, confirm that the target path is absent. If it exists, stop and report the
collision; do not overwrite, rename, or create an alternate copy.

The file must contain one complete valid bank object with exactly one top-level case container and no
standalone companion item. Only the target raw path may be created or changed. Do not edit existing
raw drafts, canonical banks, schema, code, ledgers, census, history, decisions, this contract, or the
individual commission. Do not run promotion, consolidation, or any command that treats the draft as
reviewed content.

This pilot does **not** authorize a new `_caseDesignManifest`, `_compileManifest` mode, sidecar file,
or other off-schema key. The design artifacts below are producer work products and final-receipt
claims until a separate code commission adds a supported raw-only manifest and gate.

If the premise cannot clear source, collision, coherence, visibility, response-demand, or leakage
review, leave the target path absent and return a documented block. Do not silently substitute a new
topic.

## 4. Producer-owned design space

The producer owns:

- patient identity and clinically relevant history;
- the exact trigger, mechanism, and clinical progression;
- stage count, boundaries, timestamps, and narrative flow;
- exhibit selection and composition;
- normally 5–6 embedded scored parts, their formats, and order;
- the specific scored decisions, distractors, rationales, strategies, and glossary;
- natural `ngnSkill` and difficulty assignments within the commissioned hard case.

Normally use at least three embedded formats, but do not force a format that distorts the clinical
decision. `bowtie` cannot be embedded. Do not add a standalone bowtie or other companion item. Do not
pad to six with a weak or duplicate response demand.

English is the primary exam surface. Every learner-visible field requires natural, clinically
faithful Simplified-Chinese parity. Translation may not change thresholds, timing, sequence,
certainty, severity, or clinical meaning.

## 5. Required authoring sequence

Complete these phases in order in the same producer context.

### Phase 1 — collision and source preflight

Before designing the case:

- inspect every named comparator and every live raw draft not explicitly excluded by the individual
  commission;
- compare decisive cue cluster, tested inference, keyed pathway, serial template, and response
  demand—not wording, demographics, or item format;
- open every source needed for a likely keyed claim at passage level;
- identify any claim whose exact support is unavailable or outside the source's declared scope.

A case wrapper does not make an occupied standalone construct new. A source homepage or abstract is
not passage-level support. If an essential claim cannot be supported exactly, redesign before writing
JSON or block the premise.

### Phase 2 — private case blueprint

Before composing learner-facing stems, choices, or rationales, build a concise internal blueprint.
Do not create an extra repository file. The blueprint must include:

#### A. Stage plan

For every stage, record:

- stage ID and clock time or elapsed interval;
- new exhibits/data introduced;
- what changed clinically;
- what care, review, notification, or escalation occurred before the next stage;
- the intended maximum defensible conclusion from that stage.

#### B. Part allocation

For every proposed part, record:

- visible-through stage;
- item type;
- exact scored construct;
- learner response demand;
- decisive evidence;
- comparator basis when change over time is load-bearing;
- exact source claim supporting the key;
- short answer-bearing atoms that would reveal the inference if stated elsewhere.

A scored construct is the exact judgment being graded, not merely an NGN skill. A response demand is
the learner operation: identify findings, interpret a trajectory, prioritize a hypothesis, choose an
action, or evaluate an outcome.

#### C. Claim coverage

For every material keyed claim, record:

- exact source passage or named closed-world protocol;
- population and care setting;
- threshold operands and denominators;
- timing and comparison interval;
- whether the source actually covers the claimed phase of care.

#### D. Reverse-leakage matrix

Compare every later learner-visible surface against every earlier part. Include later stems, choices,
stage titles, captions, exhibits, diagnosis labels, management actions, and exact repeated
trajectories. Mark whether any earlier answer-bearing atom is exposed and how it was removed.

### Phase 3 — blueprint gate

Do not write final JSON until all of the following are true:

1. The episode earns case form through temporal change, exhibit integration, intervention, and
   reassessment.
2. Every part has a distinct scored construct and response demand.
3. At least two parts integrate exhibits or time rather than one isolated sentence or value.
4. At least one intervention is followed by evidence supporting a genuine evaluation-of-outcomes
   decision.
5. Every material keyed claim has exact support within source scope.
6. Every stage transition includes clinically defensible care and escalation for the findings already
   present.
7. No later learner-visible surface answers an earlier part.
8. No keyed option or row receives separate credit for evidence already fully contained in another
   keyed option or trajectory.

If a part fails, remove or redesign it. Do not preserve it through paraphrase, format substitution, or
weak distractors.

### Phase 4 — JSON authoring

Write the complete bilingual case to the exact target path using the current schema. Do not expose
the private blueprint as learner-facing chart text. Source pins belong in the supported question-level
`meta.source` field.

Use simple local IDs for dropdowns such as `dd1`, `dd2`, and `dd3`; both `clozeStem.en` and
`clozeStem.zh` must use byte-exact placeholders such as `{{dd1}}` matching `dropdowns[].id`.

### Phase 5 — final audit

After drafting, repeat:

- named-comparator and live-raw collision review;
- stage-reference and visibility review;
- criterion/source transcription review;
- stage-transition legitimacy review;
- independent-evidence review;
- reverse-order leakage review from the last part to Part 1;
- bilingual clinical-parity review;
- item-type mechanical review against the live schema.

## 6. Binding stage-visibility contract

The live renderer is cumulative and fail-open. For the active part it uses a resolvable
`answerableAfterStageId`, otherwise a resolvable `stageId`, and otherwise reveals **all stages**.
Therefore:

- If the case declares `caseStudy.stages`, every embedded part must include an explicit
  `answerableAfterStageId` that byte-exactly resolves to a declared stage.
- The first declared stage must be a real baseline stage with at least one exhibit. Part 1 must be
  anchored to that baseline stage; opening parts may not omit visibility metadata.
- `stageId` is optional descriptive metadata for this pilot. If used, it must also resolve.
- Top-level `caseStudy.exhibits` are visible during every part and may contain only genuinely
  invariant information safe under unrestricted navigation.
- Stage-gated observations, labs, tracings, interventions, and reassessments belong in stages, not in
  top-level exhibits.
- A rationale may not rely on data later than the part's `answerableAfterStageId`.

An absent or unresolved visibility anchor is blocking even if schema validation itself does not reject
it.

## 7. Distinct-demand and independent-evidence rules

Every embedded part must test a different clinical judgment. Changing item format does not create a
new construct.

Do not:

- ask one part to identify deterioration and another to select the same findings as deterioration;
- ask one part to interpret a trajectory and a later part to name the diagnosis that the later stem
  already states;
- key both a current value and a trajectory ending in that same value as separate evidence;
- award multiple rows for synonymous manifestations of one cue unless the item explicitly tests
  separate judgments;
- create an ordered response when the steps are concurrent or branch-dependent in the presented
  context.

For SATA, highlight, matrix, and multi-blank items, each keyed element must represent an independent
evidence or action unit.

## 8. Source-fidelity rules

### Criterion transcription

When a key depends on a published criterion, preserve the source's:

- numerator and denominator;
- threshold and comparison operator;
- population;
- setting and phase of care;
- timing interval;
- qualifying comparator;
- treatment context.

Do not substitute predicted value with personal best, facility treatment with failed home treatment,
one interval with another, or a related population/setting with the sourced one.

### Source scope

Do not extend a source beyond what it covers. If a guideline excludes ICU, procedural, intubation, or
post-intubation management, it cannot support a keyed claim in that phase. Obtain an additional exact
professional source or named valid local protocol before retaining the part.

Every material dose, interval, threshold, range, equation, and reassessment time must be sourced or
explicitly owned by a named closed-world order/protocol. A local protocol may make a sequence
gradeable; it may not make an externally false premise correct.

## 9. Stage-transition and serial-measurement rules

At every transition ask:

1. What changed?
2. What care, notification, review, or escalation should occur now?
3. Is it clinically defensible to wait until the next staged measurement?

Do not let the case continue routine treatment and data collection after the existing evidence already
requires concurrent senior, specialist, rapid-response, critical-care, operative, or airway
escalation.

When serial measurements are load-bearing, the internal blueprint must also record for each timepoint:

- support conditions and measurement context;
- bedside findings;
- intervention since the prior measurement;
- intended inference;
- maximum defensible conclusion.

Values obtained under materially different oxygen, ventilation, medication, or device support cannot
by themselves establish improvement in underlying physiology. The keyed conclusion must remain
within what the contextualized comparison supports.

## 10. Leakage standard

The learner may navigate directly to any part before aggregate submission. Selecting a later part may
reveal its cumulative stages while earlier parts remain unanswered.

A later stage may introduce new data, but no later stem, choice, exhibit, caption, stage title, or
diagnosis label may state the interpretation, priority, or action that an earlier part asks the
learner to infer. Repeating the exact earlier trajectory and then labeling its endpoint is direct
leakage even if the later part asks a different format.

If leakage cannot be removed without collapsing either response demand, merge, replace, or omit one of
the parts. Do not merely paraphrase the disclosure.

## 11. Producer receipt

After writing, return a compact receipt rather than JSON. It must include:

- exact path, parent case ID, and embedded-part count;
- chosen episode and why it earns case form;
- one row per part with: part ID, visible-through stage, item type, scored construct, response demand,
  comparator basis or `n/a`, and source-pin status;
- stage-reference result confirming every `answerableAfterStageId` resolves;
- serial-context result when applicable;
- nearest-comparator result for every part;
- `pairwise reverse-leakage matrix clear` or the unresolved pair(s);
- `independent evidence accounting clear` or the duplicated keyed evidence;
- visual kind or `none`;
- `normalization and validation deferred to Codex/checker (no command execution in producer seat)`.

A blocked receipt names the exact source, collision, coherence, visibility, transition, or leakage
reason and confirms that the target path remains absent.

## 12. Checker handoff and acceptance

Codex/checker runs the exact normalization and validation commands named by the individual commission.
Normalization is a dry run. Use `--write` only after reviewing normalizer-owned deterministic repairs.
Any JSON repair must load, mutate, and re-serialize the object programmatically.

A separate non-GPT checker then independently:

- opens every source pin and verifies each clinical key;
- checks criterion transcription and source scope;
- tests collisions and pairwise leakage claims;
- reviews stage-transition legitimacy and serial measurement context;
- verifies bilingual clinical parity;
- inspects any visual against source data and its proof contract.

Promotion, consolidation, ledgering, census regeneration, and raw-file deletion remain outside the
producer commission.

Acceptance requires:

- [ ] one complete 5–6-part raw case at the exact path, or an absent path with a documented block;
- [ ] only the target raw path changed;
- [ ] explicit baseline stage and a resolving `answerableAfterStageId` on every embedded part;
- [ ] distinct scored construct and response demand for every part;
- [ ] exact source coverage for every material keyed claim;
- [ ] clinically legitimate stage transitions;
- [ ] contextualized serial comparisons when applicable;
- [ ] no duplicate keyed evidence;
- [ ] pairwise reverse leakage clear under unrestricted navigation;
- [ ] named comparator and live-raw preflight complete;
- [ ] current-schema mechanical review complete;
- [ ] independent non-GPT review still pending.
