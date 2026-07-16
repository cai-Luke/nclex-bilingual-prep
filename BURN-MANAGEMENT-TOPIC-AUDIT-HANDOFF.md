# Burn Management Topic Audit — Handoff

Deferred from the 2026-07-15 GPT-5.6 Sol format-gap batch promotion. See `BANK-REVIEW-LEDGER.md`
(2026-07-15 entry) and `TOPIC-VOCABULARY-DECISIONS.md` § "GPT-5.6 Sol format-gap batch review (Jul 15)"
for the full litigation history. This file is the scoped follow-up task, not a new discussion.

## Decision already made (do not reopen)

`Burn Management` stays STRICT `Physiological Adaptation` for now. The batch's two items
(`gpt_fmtgap_2026_07_14_hl_burn_inhalation_06`, `gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15`) were
recategorized to PA and promoted — done, live on `main`. That fix cost nothing and matches the
standing Jun 16 Gemini-pass precedent (`gemini_u5_fib_or_2026_06_09_fib_tbsa_04` was corrected
*into* PA for the same reason).

## What's actually open

GPT-5.6 Sol proposed widening `Burn Management` to SHARED `[Reduction of Risk Potential,
Physiological Adaptation]`, citing the live split as evidence of intentional taxonomy. Claude's
review found the cited evidence was incomplete (2 outlier categories omitted) and that a prior
ruling already went the other way. GPT accepted the pushback and re-proposed: audit the full
population by tested construct, *not* by current category, before deciding anything. That audit is
this handoff.

## Scope: all 29 live `Burn Management` items

| Category (current) | Count | IDs |
|---|---|---|
| Physiological Adaptation | 18 | `gpt_case_major_burn_inhalation_fluid_creep_01_bowtie`, `gpt_2026_07_03_1344_t1_05`, `burn_fib_parkland_first8h_leg_arm_08`, `burn_fib_parkland_rate_arm_trunk_genitalia_04`, `burn_fib_parkland_total_posterior_03`, `gemini_u5_fib_or_2026_06_09_fib_tbsa_04`, `sa_parkland_01`, `gpt_fmtgap_2026_07_14_hl_burn_inhalation_06`, `gemini_c10_08`, `gemini_d9_10`, `burn_mc_resuscitation_threshold_02`, `easy_burns_01`, `easy_burns_02`, `gemini_d9_01`, `gemini_d9_07`, `gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15`, `burn_sata_parkland_chain_06`, `gemini_d9_04` |
| Reduction of Risk Potential | 9 | `gpt_deepen_2026_06_23_bow_03`, `gemini_b7_02`, `gemini_jun05_a_fib_parkland_burn_47`, `gemini_jun05_b_fib_burn_06`, `gemini_p6_burn_01`, `gemini_p6_burn_03`, `gemini_p6_burn_04`, `gemini_b7_08`, `gemini_b7_05` |
| Pharmacological and Parenteral Therapies | 1 | `gemini_p6_burn_02` |
| Safety and Infection Control | 1 | `easy_burns_03` |

(Re-pull with the one-liner in the ledger entry's verification note if the census has moved since.)

## Task

For each item, read the stem + keyed rationale and classify by the construct **actually tested**,
ignoring its current category entirely — current category is not evidence, that's the mistake this
audit exists to not repeat:

1. Acute physiologic instability and treatment (shock, resuscitation, established complications)
2. Complication assessment or surveillance (recognizing a developing problem)
3. Decontamination and emergency procedure
4. Medication or fluid administration
5. Environmental or prevention-oriented safety

Then choose one of three outcomes — don't prejudge which:

1. Keep `Burn Management` STRICT PA; correct every item that drifted (retag category, or reroute
   non-PA-construct items to a different existing/new topic).
2. Share `Burn Management` across `[PA, RRP]` with the construct boundary documented and every
   item's category checked against it.
3. Keep `Burn Management` PA-only; route the narrower non-PA constructs (decon, prevention/safety,
   med/fluid-only items) to other existing topics instead of stretching this one's license.

## Where the answer goes

Record the outcome as a new dated entry under `TOPIC-VOCABULARY-DECISIONS.md`'s Burn Management
open question (added 2026-07-15), update `src/topics.ts` if the license changes, and re-run
`npm run test:topic-vocabulary` + the promotion gate on any bank file touched. This is a
classification/judgment task (read each stem, decide the construct) — not scriptable beyond
extracting the worklist above.
