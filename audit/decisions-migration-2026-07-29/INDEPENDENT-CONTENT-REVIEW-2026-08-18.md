# Stage 2b Instrument B — Independent Constitutional Content Review

Date: 2026-08-18  
Executing seat: Codex, independent disk-reading/content-review seat  
Commission: §8.2 of the frozen Instrument B work order  
Disposition: ACCEPT

## Scope and disposition boundary

This report records the independent content review of the migrated DECISIONS.md target required by Instrument B §8.2. ACCEPT means that the 82 required review units were independently reviewed against their source material and no omission, added meaning, altered force, or unreviewable unit was found.

This is not a declaration that the repository conforms to every rule in DECISIONS.md. It is not Instrument A §8.1, a runtime/build verification, a promotion approval, a commit/merge approval, or a substitute for any later governance seat.

The review was activated by the externally supplied 2026-08-18 record that Instrument A Revision 2 had an architect disposition of ACCEPT, together with the already supplied Instrument A Revision 2 §7.1 item 11 PASS. Those are activation inputs, not new repository artifacts. The prior stop before activation is treated as a correct control outcome; no prior-stop defect or residue was repaired.

## Frozen identity and preconditions

The required frozen work-order identity was verified before any Instrument B action:

- Work order: DECISIONS-MIGRATION-STAGE-2B-INDEPENDENT-CONTENT-REVIEW-WORK-ORDER-2026-08-18.md
- Measured size: 10210 bytes
- SHA-256: 8414ea2507c1e9002ee725e64c863278e22d88c0f855274c0548d6302b9d89cd
- Authorized output path was absent before report creation: audit/decisions-migration-2026-07-29/INDEPENDENT-CONTENT-REVIEW-2026-08-18.md

The review therefore proceeded under the frozen work order as activated. No commission §8.1 action was performed.

## Reviewed identities

The target and source were read from committed Git objects, not inferred from a mutable worktree:

- Target commit: 345d0d9b72cd97b5f72bde29cd7822e96c94e8b7
- Target DECISIONS.md blob: 56964 bytes; SHA-256 3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8
- MIGRATION_BASELINE commit: d499cc1d0916e03830489ec9cd0324cd1a203a73
- Baseline DECISIONS.md blob: 76314 bytes; SHA-256 b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e
- Hardened pre-migration artifact commit: b5d0027d0aab6e2f4d82eeabb6d3da64cc75c5b4
- Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md was byte-identical to the baseline blob
- Ratified target-text manifest: audit/decisions-migration-2026-07-29/target-text-manifest.md
- Measured manifest: 332579 bytes; SHA-256 818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2

The full baseline SHA above is the resolved object named by the committed MIGRATION_BASELINE declaration. The abbreviated d499cc1 form is recorded only as an orientation alias.

## Review method

For each unit, I read the source bytes from the resolved baseline object and the corresponding target statement or archive boundary. The manifest and frozen phase-1 inventory/migration table were used for population and routing; source text controlled meaning. Earlier review artifacts were treated as leads only and their dispositions were not inherited.

The question applied to every unit was: does the migrated statement or wrapper preserve the source rule, scope, and force without omission or new meaning? Findings were classified only as omission, added meaning, or altered force. A unit that could not be reviewed would have blocked ACCEPT.

The deterministic target-reconciliation checker supplied structural lead evidence only. It reported:

- source accounting: 65 live statements, 13 wrappers, 1 E053 structural unit, and 1 E037 source row;
- destination allocation: P=37, R=6, I=19, T=3;
- all 13 baseline buffer spans/hash checks passed;
- the pre-migration snapshot matched the resolved baseline;
- no unaccounted source entry, duplicate destination, target block absent from the manifest, or manifest block absent from the target;
- Amendment 2 surfaces passed, Amendment 3 joins were present, and Amendment 4 E053 routing passed.

These checks did not replace the semantic review recorded below.

## Full coverage ledger — 65 live statements

The source ranges below are byte ranges in the baseline DECISIONS.md blob, expressed as half-open intervals.

| # | Manifest / target unit | Source | Independent finding |
|---:|---|---|---|
| 1 | M4.2 / P1#0 / E001 | [7776,8570) | None. Preserves deterministic item-ID-seeded option/answer placement, model non-placement, and all-item-type scope. |
| 2 | M4.3 / P2#0 / E002 | [8570,9412) | None. Preserves independent semantic/clinical/provenance/contract review, mechanical self-certification limits, and active-lane provenance declarations. |
| 3 | M4.4 / P2#1 / E003 | [9412,10344) | None. Preserves the authoring-seat and blind-seat prohibitions and assigns semantic re-derivation to the content-review gate and conformance to the architect. |
| 4 | M4.5 / P3#0 / E004 | [10344,11231) | None. Preserves the deterministic core, capped semantic residual, offline/no-live-model boundary, and non-mutating finding merge. |
| 5 | M4.6 / P4#0 / E005 | [11231,11639) | None. Preserves rationale linkage to option content rather than letter, ordinal, or spatial position, including bilingual rationale treatment. |
| 6 | M4.7 / P5#0 / E006 | [11639,12062) | None. Preserves the independent-review/promotion requirement for generated learner-facing clinical content and the generator’s inability to self-review. |
| 7 | M4.8 / P5#1 / E007 | [12062,12410) | None. Preserves named-model restriction policy as a constitutional floor and the P31 routing relationship. |
| 8 | M4.9 / P6#0 / E008 | [12410,13512) | None. Preserves deterministic/data-derived visual default, AI medical-imagery prohibition, selfCheck/registry testing, the separate licensed-image lane, and load-bearing stimulus requirement. |
| 9 | M4.10 / P7#0 / E009 | [13512,13744) | None. Preserves the five-evidenced-findings threshold, probable-finding threshold, verbatim evidence/reconciliation, confidence, and dismissal recording. |
| 10 | M4.11 / P8#0 / E039a | [53204,53661) | None. Preserves upstream ownership of clinical truth and answer logic, read-only downstream transformation, no invented claims, and dropping underspecified decision points. |
| 11 | M4.12 / P10#0 / E010 | [13744,14789) | None. Preserves default Study weighting, anti-clustering rule, strict-exam separation, case exclusion from the weighted draw, and separate/deferred difficulty adaptivity. |
| 12 | M4.13 / P11#0 / E011 | [14789,15922) | None. Preserves typed visual answers, exact selfCheck/build-failure behavior, enumerated same-unit derivations, and the no-conversion/no-dosage-engine boundary. |
| 13 | M4.14 / P15#0 / E012 | [15922,16386) | None. Preserves raw-scoped patching, canonical read-only status absent explicit in-place/ledger authority, and declarative precondition/no-arbitrary-mutation behavior. |
| 14 | M4.15 / P15#1 / E013 | [16386,18274) | None. Preserves exact field-path before/after targeting, replacement-record semantics, and P26 protection for the rest of the surface. |
| 15 | M4.16 / P16#0 / E014 | [18274,19722) | None. Preserves positional versus distributional bias distinction, deterministic shuffle versus authoring/regeneration, no hand-editing canonical logic, and incidental-dilution limits. |
| 16 | M4.17 / P16#1 / E015 | [19722,22368) | None. Preserves learner-draw population checking, canonical-file provenance boundary, global verdict, per-file advisory status, and insufficient-observation non-failure. |
| 17 | M4.18 / P16#2 / E016 | [22368,22670) | None. Preserves visual-canonical SATA varying correct counts where truth permits and the prohibition on retire-and-replace remediation. |
| 18 | M4.19 / P17#0 / E017 | [22670,23124) | None. Preserves earned/possible NGN score, session/feedback-only partial credit, SRS full-marks boundary, and the listed out-of-scope areas. |
| 19 | M4.20 / P19#0 / E018 | [23124,24133) | None. Preserves rationale visuals as explanation slots, structural validation without placement/selfCheck coupling, load-bearing question visuals, and the full-schema versus narrower-census distinction. |
| 20 | M4.21 / P20#0 / E044 | [56919,58058) | None. Preserves pre-generated/local-first/content-hashed audio, inactive settled status, runtime invariant treatment, and lane-trigger boundaries. |
| 21 | M4.22 / P21#0 / E019 | [24133,25173) | None. Preserves the semantic prompt floor: no filler, keyed rationales/distractors, closed-world scope, clinical scope/monitorability, no lazy provider notification, unique order, bounded highlights, blanks, bilingual fields, and missing keyed IDs as failure. |
| 22 | M4.23 / P21#1 / E020 | [25173,26287) | None. Preserves construction method as distinct from learner-facing wording, naturalized scaffolding, and placement of constraints in facts/choices/rationale rather than disclaimers. |
| 23 | M4.24 / P21#2 / E021 | [26287,28613) | None. Preserves functional construction-language requirements and limits the terminal sweep to a heuristic rather than proof. |
| 24 | M4.25 / P23#0 / E022 | [28613,30089) | None. Preserves presentation-only splitting, one top-level case identity/submit/score, top-level grading/storage/SRS/progress/flags/adaptive/summary, deferred per-part behavior with revisit condition, global and active-stage visibility, fail-open behavior, and measured geometry/proof-render requirements. |
| 25 | M4.26 / P23#1 / E023 | [30089,30817) | None. Preserves shape-aware one-series/full-width and two-series/split presentation, structured density predicate, and presentation-not-validity status. |
| 26 | M4.27 / P23#2 / E024 | [30817,32618) | None. Preserves embedded case-leaf planning, rewrite/replace default, whole-case retirement only without coherent replacement, and absence of a leaf-removal mechanism. |
| 27 | M4.28 / P24#0 / E025 | [32618,34428) | None. Preserves measurements as prose supplements except pure key/value pointers, identity-before-display/conversion, typed/canonical/display boundaries, censored typed data, and staging/ledger-only non-rendering dispositions. |
| 28 | M4.29 / P25#0 / E026 | [34428,35775) | None. Preserves necessary value-complete artifacts, meaningful affordance, vendor/absent/stem-value exclusions, necessity gate, exact-value waiver boundary, and repeated-one-timepoint closure. |
| 29 | M4.30 / P25#1 / E027 | [35775,36934) | None. Preserves distinct chart/renderer-table affordances, necessity/multitimepoint conditions, table-as-non-second-truth, and sparse-not-invalid status under P7/P25 rather than P29. |
| 30 | M4.31 / P25#2 / E028 | [36934,38883) | None. Preserves unified-vitals-chart precedence, visible flowsheet/fallback, per-vital flowsheet/readout resolution, carried fences, single-series reference bands, and no schema/bank/clinical change. |
| 31 | M4.32 / P25#3 / E029 | [38883,39231) | None. Preserves visible flowsheet re-addition, hidden-table testing, and the stated no-further-architect-input condition. |
| 32 | M4.33 / P26#0 / E030 | [39231,40746) | None. Preserves independent precondition for dispositional suppression and the exclusion/skip/empty/off-allowlist cases, including exclusion as a positive sampling signal. |
| 33 | M4.34 / P27#0 / E031 | [40746,41665) | None. Preserves the incident/condition-gone requirement for relaxation, every-rule-failure requirement, and retire-with-incident/SUPERSEDED rather than deletion. |
| 34 | M4.35 / P28#0 / E033 | [42598,44464) | None. Preserves scored-leaf planning versus session delivery/inventory/recursive visual structure and the non-average treatment of case containers. |
| 35 | M4.36 / P29#0 / E034 | [44464,47377) | None. Preserves sparse one-series/one-row lab validity, absence of a cardinality floor, and proof-render requirement for presentation. |
| 36 | M4.37 / P30#0 / E035 | [47377,50753) | None. Preserves adult bands, pediatric age/sex/assay absence, fail-closed pediatric bands with valid trajectory, intended high therapeutic anticoagulation values, and the specified H/L/reference-column and evidence boundaries. |
| 37 | M4.38 / P31#0 / E074 | [74491,75189) | None. Preserves raw-volume/no-direct-canonical restrictions, no content-judgment audit, and rejection of a residual lane lacking both pair-specific treatment and keyed English/Chinese quotation. The source’s obsolete flag-only/never-compiler/mutation clauses were intentionally omitted under the ratified retired-lane routing and do not constitute an omission. |
| 38 | M4.39 / R1 / E070 | [71397,72065) | None. Preserves standalone bowtie direct generation in the normal pipeline and does not relax the governing discipline. |
| 39 | M4.40 / R2 / E049 | [62908,64005) | None. Preserves analyte-aware unit policy keyed by analyte and source unit, permissive-source/byte-exact treatment, display policy, and one-table ownership. |
| 40 | M4.41 / R3 / E047c | [59048,62233) | None. Preserves the shared vitals-sanity paragraph’s corrected temperature ceiling, inherited renderer envelope, evidence, owner, and execution requirements. |
| 41 | M4.42 / R4 / E072 | [72488,73454) | None. Preserves full-schema per-kind parity baseline, no cross-file assertion, rebaseline scope for identity drift and population changes, and bootstrap-unavailable handling. |
| 42 | M4.43 / R5 / E047a | [59048,62233) | None. Preserves the ratified SBP 400, RR 150, and spo2 0 bounds, bedside/charted scope, and pending constraints without treating the filing correction as a force change. |
| 43 | M4.44 / R6 / E073 | [73454,74491) | None. Preserves PR/post-merge distinction, no redundancy, incremental evidence, and evidence/owner requirements for further gate expansion. |
| 44 | M4.45 / I / E038 | [52641,53204) | None. Preserves the durable producer-assignment rule, PROJECT-HISTORY verification, and substitution-only-callout behavior; the generalization is the ratified target form and does not add a new obligation. |
| 45 | M4.46 / I / E043a | [51342,51986) and [56543,56891) | None. Preserves live opus-prefixed routing, GPT producer identity, Claude exclusion/non-Claude review, and survival after retirement of the conditional lane; the retired direct-GPT replacement prose was not part of this live invariant. |
| 46 | M4.47 / I / E054 | [67121,67556) | None. Preserves no client secret/live API, speechSynthesis fallback, and Vite environment exposure boundary. |
| 47 | M4.48 / I / E055 | [67556,67609) | None. Preserves English/Chinese parity. |
| 48 | M4.49 / I / E056 | [67609,67792) | None. Preserves English-only question.topic validation and CJK failure behavior. |
| 49 | M4.50 / I / E057 | [67792,68108) | None. Preserves parse-time ASCII structural quote hygiene, Chinese-only zh content, and programmatic-edit requirement. |
| 50 | M4.51 / I / E058 | [68108,68236) | None. Preserves global question-ID uniqueness including embedded items and its gate status. |
| 51 | M4.52 / I / E059 | [68236,68713) | None. Preserves fixed canonical routing, no prose-copy substitution, frozen original canonicals, visual target treatment, and no new per-kind exception. |
| 52 | M4.53 / I / E060 | [68713,68821) | None. Preserves deterministic and gated canonical merging and the no-hand-merge boundary. |
| 53 | M4.54 / I / E061 | [68821,68922) | None. Preserves the static/offline/file:// architecture and no post-build server/live-model requirement. |
| 54 | M4.55 / I / E062 | [68922,69436) | None. Preserves ordered schema-version tokens, minor-version ceiling, index comparator, and code-owned union. |
| 55 | M4.56 / I / E063 | [69436,69478) | None. Preserves rare and deliberate schema-change policy. |
| 56 | M4.57 / I / E064 | [69478,69635) | None. Preserves single definitions for formatting, numeric formatting, and rounding helpers and prohibits kind-specific redefinition. |
| 57 | M4.58 / I / E065 | [69635,69844) | None. Preserves one exhibit-ID namespace across top-level and stages and permits an empty top-level array. |
| 58 | M4.59 / I / E066 | [69844,70144) | None. Preserves category targets as current test-plan weighting, weighted draw, backlog interpretation, and uniform item-type treatment. |
| 59 | M4.60 / I / E067 | [70144,70497) | None. Preserves floor-not-balance composition, floorThreshold, and quality-over-census priority. |
| 60 | M4.61 / I / E068 | [70497,70847) | None. Preserves mechanism-specific GitHub/disk repository-state handling, unrelated-change preservation, and no assumption of state equality. |
| 61 | M4.62 / I / E069 | [70847,71397) | None. Preserves the cross-category shared-topic map and the instruction not to correct it through this invariant. |
| 62 | M4.63 / I / E071 | [72065,72488) | None. Preserves selectable-distractor schema, passage-order/no-shuffle behavior, null bias treatment, and semantic-quality content review. |
| 63 | M4.64 / T / E045 | [58058,58439) | None. Preserves the unresolved translation-friction sampler question and its revisit condition requiring topic/category specificity and miss-predictiveness. |
| 64 | M4.65 / T / E046 | [58439,58952) | None. Preserves the unresolved real-simulator-versus-removal question, placeholder feedback, and deferred translation. |
| 65 | M4.66 / T / E047b | [59048,62233) | None. Preserves the unresolved DBP/MAP sourcing, temperature-floor, sao2, and related open vital-sanity constraints without converting them to a completed ratification. |

## Full coverage ledger — 13 archive-wrapper boundaries

For each wrapper, review covered the source content and whether the archive label/boundary was truthful. It did not re-review the archived body byte-for-byte; the frozen structural/hash controls cover that separate property.

| # | Wrapper source unit | Source | Independent finding |
|---:|---|---|---|
| 66 | M5-01 / E032 — Most recent application of P27 and its rejected alternatives (2026-07-12 pass) | [41665,42597) | None. The archive wrapper preserves the historical application label and does not present it as a live P27 rule. |
| 67 | M5-02 / E036 — Forward case-generation lane lapse note (2026-07-18) | [50844,51342) | None. The wrapper truthfully identifies the lapsed historical lane note and leaves the universal rules to their explicit merge targets. |
| 68 | M5-03 / E039b — Lane-specific detail of P8 (forward case-generation pipeline) | [53661,54291) | None. The wrapper truthfully identifies conditional/lapsed P8 lane detail as historical and preserves the live universal P8 core separately. |
| 69 | M5-04 / E040 — P9 conditional skeleton English-only | [54292,54790) | None. The wrapper truthfully identifies the retired conditional principle and its historical status. |
| 70 | M5-05 / E041 — P12 conditional author-side currency | [54791,55582) | None. The wrapper truthfully identifies the retired conditional principle and its historical status. |
| 71 | M5-06 / E042 — P18 conditional fact-check/flag-review chain | [55583,56120) | None. The wrapper truthfully identifies the retired conditional principle and its historical status. |
| 72 | M5-07 / E043b — P22 conditional-principle prose | [56121,56543) | None. The wrapper truthfully separates retired conditional prose from the live opus-prefixed routing invariant. |
| 73 | M5-08 / E048 — CBC American-conventional superseded original | [62297,62907) | None. The wrapper truthfully labels the superseded historical unit and does not present it as the active analyte-aware rule. |
| 74 | M5-09 / E050 — Fishbone workflow-familiarity waiver, superseded | [64005,64356) | None. The wrapper truthfully labels the superseded historical waiver. |
| 75 | M5-10 / E051 — Vitals sanity passes every real value, withdrawn | [64357,64837) | None. The wrapper truthfully labels the withdrawn claim as historical and non-governing. |
| 76 | M5-11 / E052 — Governance-markdown encoding gate, withdrawn | [64838,66593) | None. The wrapper truthfully labels the withdrawn governance gate as historical and non-governing. |
| 77 | M5-12 / E075 — Study-session distribution pointer | [75189,75483) | None. The wrapper truthfully identifies the historical implementation pointer and does not create a second live rule. |
| 78 | M5-13 / E076 — Session artifacts and implemented-spec pointers | [75484,76314) | None. The wrapper truthfully identifies the historical pointer list and does not present it as an active constitutional statement. |

## Full coverage ledger — E053 structural unit

| # | Source unit | Target unit | Independent finding |
|---:|---|---|---|
| 79 | E053, baseline DECISIONS.md line 359, closing archive pointer | Target §8 opening structural prose | None. The target prose is structural rather than a wrapper or index line and names the historical archive, the normalized migration archive, and Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md as required by Amendment 4. |

## Full coverage ledger — E037 merged placements

E037 has one source row but three target placements. It is therefore counted once in source-row accounting and three times in review-unit coverage.

| # | Source unit | Target placement | Independent finding |
|---:|---|---|---|
| 80 | E037 rule 1, baseline DECISIONS.md lines 302–305 | M4.11 / P8 / E039a | None. The upstream-owner/read-only-downstream rule is preserved in the universal P8 core without inventing a separate E037 principle number. |
| 81 | E037 rule 2, baseline DECISIONS.md lines 302–305 | M4.3 / P2 / E002 | None. The active-lane producer-provenance and independent-review-routing requirement is preserved in P2. |
| 82 | E037 rule 2, baseline DECISIONS.md lines 302–305 | M4.7 / P5 / E006 | None. The same rule is preserved at the generated-content/promotion boundary in P5; the duplicated target placement is required by the frozen migration routing and is not a semantic contradiction. |

## Finding classification

| Failure mode | Count |
|---|---:|
| Omission | 0 |
| Added meaning | 0 |
| Altered force | 0 |
| Unreviewable unit | 0 |
| Total review units | 82 |

The following were explicitly considered and resolved as non-findings because the frozen source/routing controls require them:

- P31 omits obsolete clauses tied to the retired forward lane while preserving the live restrictions and residual-lane rule.
- E043a preserves the live opus-prefixed routing rule while E043b archives the retired conditional prose.
- E038 is a durable current producer-assignment rule rather than a dated historical callout, with PROJECT-HISTORY verification retained.
- E053 is structural §8 prose naming the three required archives; it is not counted as a wrapper or live principle.
- E037 is merged into E039a, E002, and E006 without receiving a new permanent principle number.
- R3, R5, and T E047b share the source paragraph but preserve their separately ratified, unresolved, and corrected target scopes.

No source-versus-target conflict remained unresolved. No unit required authoring replacement constitutional wording. No target, source, manifest, phase artifact, script, workflow, or unrelated file was edited.

## Required activation record

Instrument A Revision 2 §7.1 item 11 PASS was supplied as the entry condition for Instrument B and is recorded here explicitly: the Instrument A independent-content-review gate is PASS. The architect’s 2026-08-18 ACCEPT disposition for Instrument A Revision 2 was also supplied externally as the activation record. This report does not re-adjudicate either Instrument A or the repository’s broader conformance.

## Final disposition

ACCEPT — Instrument B §8.2 independent constitutional content review only.

The disposition is based on fresh review of all 65 live statements, all 13 archive-wrapper boundaries, the E053 structural §8 unit, and all three E037 target placements. It is not a statement that any other commission, build gate, promotion gate, or repository conformance obligation has passed.

