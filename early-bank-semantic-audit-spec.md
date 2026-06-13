# EARLY-BANK-SEMANTIC-AUDIT-SPEC.md

A prioritized, batched adversarial **semantic** audit of the text banks (`gemini`, `gpt`, `claude`, `hard-cases`), deferred from the 2026-06-13 planning pass and parked here for an overnight run. It is a **specialization** of `NCLEX_Audit_Spec.md`: that document's mandate (§1), scope-declaration / Session Header (§2), evidentiary standards (§4), hallucination guards (§5), Finding (§6) and Single-Question Concern (§7) formats, output constraints (§9), and batch sizes (§10) are **inherited verbatim**. This file adds only what the parent spec leaves open for a *campaign*: prioritization, the two-track split, the currency live-source mandate, producer ≠ checker, a cure-first remedy policy, and the overnight batch plan.

Authority on conflict: `AGENTS.md` › `NCLEX_Audit_Spec.md` › this file.

## 0. Why this audit, and why not more

The 2026-06-13 whole-bank deterministic re-gate (PROJECT-HISTORY) proved the **structural** axis clean across every bank — shuffle, bilingual parity, answer-key integrity, count consistency, ID uniqueness, no unambiguous positional-language backlog. The looser U0/U1-era standards left **no structural debt**, so do **not** re-run structural checks here. The only axis the deterministic layer cannot see is **semantic**, and that is this campaign's entire job:

- `OG` **outdated guidance** — the highest-harm residual; a dated clinical value teaches the test-taker the wrong answer. The bank has shown isolated instances before (the pulseless-VT fix, the DKA potassium threshold). This is the priority track.
- `DC`/`AK` **contradiction / answer-key conflict** — two items teaching mutually exclusive facts, or equivalent scenarios keyed differently.
- `RI`/`SC`/`BD` **internal** — rationale-vs-key, scope conflation, bilingual divergence (ride-along single-item checks).
- **Redundancy** — concept duplication across the larger surface.

Unlike the rhythm-strip audit (cut-first, because that bank was over-supplied in a small concept space), **this bank's items have value** — so the default remedy here is **cure, not cut** (see §5).

## 1. Scope & exclusions

- **In scope:** the four text banks — `gemini-canonical.json` (771), `gpt-canonical.json` (242), `claude-canonical.json` (60), `hard-cases-canonical.json` (51) — including all embedded case-study parts.
- **Excluded:** the visual banks (`rhythm_strip` is under its own audit; the other visual kinds are recent and source-checked at promotion). Structural checks (re-gate cleared them). Recently source-checked provenance is **deprioritized**, not re-audited first: the `opus_*` case skeletons (74) and `gpt_case_*` items (166) went through current-era source review — audit them last or only on a targeted trigger.
- Never run the full surface as one session (parent spec §10). 1,608 graded items ⇒ this is a multi-session campaign; prioritize so the overnight run hits the highest-yield slice first.

## 2. Prioritization model — provenance risk × harm

Each item gets two tags; the audit queue is sorted by their product (harm-first).

**Provenance risk** (derive authoritative tiers from `BANK-REVIEW-LEDGER.md`; ID-prefix families below are the expected shape, calibrated 2026-06-13, Appendix A):

| Tier | Families | Rationale |
|---|---|---|
| **High** | `gemini_jun05`, `gemini_p*`, `gemini_b*`, `gemini_c*`, `gemini_d*`, `trad_*`, `gen_*`, `easy_*`, `gap_*` | early/consolidation Gemini output, generated before cross-model review matured (~600 items) |
| **Medium** | `claude_*`, `gpt_*` general | ledgered review complete, but pre-current-gate |
| **Low** | `opus_*`, `gpt_case_*`, `claude_cs_*` | current-era, source-checked at authorship |

**Harm / currency tier** — items whose topic is both high-stakes and guideline-volatile rank first. Calibrated currency clusters (Appendix A): immunization/screening (74), isolation/precautions (68), anticoagulation (41), sepsis (26), DKA/insulin (21), stroke (20), burn/Parkland (18), ACLS (9), BP targets (5). Cross with the high-stakes Client-Needs categories (Pharmacological, Management of Care prioritization/delegation).

**Top priority = High-provenance × currency-volatile topic.** That is the overnight slice.

## 3. Two tracks (different methods — keep them in separate sessions)

The parent spec (§3) requires each session to declare a category subset; these two tracks have genuinely different methods and must not be mixed in one session.

**Track 1 — Currency (`OG`).** Per-item; requires **live source verification**. Highest harm. Batched by currency cluster. *Hard requirement:* every `OG` finding quotes the bank's claim verbatim (parent §4.1) **and** cites a current authoritative source — body + year + the superseded-vs-current value (e.g. CDC/ACIP immunization schedule, USPSTF screening interval, AHA ACLS, Surviving Sepsis, ADA, ACOG, CDC isolation precautions). **No live source ⇒ `REVIEW`, never `FIX`.** This track therefore needs an agent with web access; without it, the whole track degrades to flagging suspected-stale items for human source-check.

**Track 2 — Coherence (`DC`/`AK` + `RI`/`SC`/`BD` + redundancy).** Cross-item; needs candidate pairs assembled first (Layer A, §4). `DC`/`AK` use the two-question Finding format (parent §6); `RI`/`SC`/`BD` and concept-redundancy use the Single-Question / pair forms. Redundancy verdicts default to keeping the stronger item (necessity-clean, source-reviewed, better distractors) and cutting the dominated one — but only when one is genuinely strictly dominated.

## 4. Deterministic Layer A prefilter (Codex; no model tokens)

Productionize the 2026-06-13 prototype (Appendix B). It assigns the two tags per item and assembles the model pass's input, so the capped model sessions are precise and harm-sorted:

- **Provenance tag** from `BANK-REVIEW-LEDGER.md` + ID prefix (§2 tiers).
- **Currency-cluster tag** from a curated volatile-topic keyword map over `topic` + `stem.en` (Appendix A clusters). Emits the Track-1 queue.
- **DC/AK candidate pairs**: cluster items by normalized `topic` and/or `meta.skill_signature`; within a cluster, surface pairs whose keyed answers *could* conflict (same scenario shape, different correct action). Emits the Track-2 candidate list — the model never hunts pairs blind.
- **Redundancy clusters**: group by `(topic, itemType[, skill_signature])`; size ≥3 is a candidate cluster.
- Output: a harm-sorted JSONL work queue (`id`, `bank`, `provenance_tier`, `currency_cluster`, `track`, `pair_with[]`). No verdicts in Layer A.

## 5. Remedy & verdict vocabulary (cure-first)

Inherits the parent's `FIX`/`REVIEW`/`DISMISS` and adds `CUT`. **Default is `FIX`, not `CUT`** — the inverse of the rhythm audit, because these items carry real concept value.

| Verdict | Meaning |
|---|---|
| `FIX` | Cure the item: correct the dated value / inconsistency. **Both `en` and `zh`** must change together (principle 9); an `OG` cure that updates only English is incomplete. |
| `CUT` | Remove — reserved for a strictly-dominated redundant duplicate or an item that is clinically wrong and not worth repairing. |
| `REVIEW` | Human/expert judgment required (e.g. an `OG` suspicion with no retrievable live source, or a contested currency call). |
| `DISMISS` | No finding meets the evidentiary standard / reconciliation is stronger (parent §4.5). |

## 6. Producer ≠ checker

The auditing model must **not** be a model that generated the batch under review (DECISIONS principle 2). Audit Gemini-provenance content with a non-Gemini model; audit GPT-provenance with a non-GPT model; and so on. State the reviewing model in the Session Header.

## 7. Output — a proposal, never a canonical edit

These are **canonical** banks (read-only to the agent; principle 15). Each session emits two artifacts:

1. The **findings report** in the parent spec's format (Session Header; Findings sorted HIGH→MEDIUM→LOW→DISMISSED; verbatim evidence; mandatory Alternative Interpretation; ≤3,000 words per 50-item batch).
2. A machine-readable **patch/cut manifest** (JSONL, one row per actioned item): `id`, `bank`, `category_code`, `verdict`, `confidence`, `source` (for `OG`), and either a declarative `fix` (`{field, before, after}` for both `en`/`zh`) or a `cut` reason.

Execution is **Luke's**: cures land via the `patch-raw` canonical-correction path (`--allow-canonical --reason`, which forces a ledger entry; principle 15) or a manual edit; cuts, the `BANK-REVIEW-LEDGER.md` entry, and `npm run census && npm run census:check` are done at execution time. Verify the manifest in the developer Review Console (`?dev=1`, `qids=`) against the rendered items before acting. A `FIX` row that changes only one language, or proposes a clinical change without a cited source, is a spec violation — downgrade to `REVIEW`.

## 8. Overnight batch plan (drawer-ready; run in this order)

High-provenance × currency-volatile first. Each session ≤100 items, one track, category-focused, non-producer model, web access on for Track 1.

| # | Track | Focus | ~Items | Live sources |
|---|---|---|---|---|
| 1 | Currency | Immunization & screening | ~74 | CDC/ACIP schedule, USPSTF intervals |
| 2 | Currency | Isolation & transmission-based precautions | ~68 | CDC isolation precautions guideline |
| 3 | Currency | Anticoagulation + DKA/insulin | ~62 | ADA Standards of Care; anticoag reversal/monitoring labels |
| 4 | Currency | Sepsis + burn/Parkland + stroke + ACLS + BP (smaller high-harm clusters, may split) | ~78 | Surviving Sepsis, ABLS/ABA, AHA stroke & ACLS, ACC/AHA BP |
| 5+ | Coherence | `DC`/`AK` + redundancy over the largest Layer-A candidate clusters; `RI`/`SC`/`BD` ride along | per cluster | n/a (internal) |

Sessions 1–4 are the high-yield overnight; restrict to **High-provenance** items first, expand to Medium only after. Coherence sessions follow once Layer A has assembled candidate pairs. Stop the overnight after a sane session count and report coverage rather than forcing the whole surface in one night.

## 9. Done criteria (per session)

- [ ] Session Header complete; reviewing model is a non-producer; track + category focus + provenance filter declared.
- [ ] Every `OG` finding carries a verbatim bank quote **and** a cited current source with the superseded-vs-current value; otherwise `REVIEW`.
- [ ] Findings sorted HIGH→MEDIUM→LOW→DISMISSED; under the word budget; every finding has an Alternative Interpretation.
- [ ] Manifest emitted; every `FIX` changes both `en` and `zh`; `CUT` reserved for strict-dominated redundancy / unsalvageable items.
- [ ] Verified in the Review Console; Luke executes cures (`patch-raw --allow-canonical --reason`) / cuts + ledger + census.

## Appendix A — calibration (2026-06-13, text banks incl. embedded)

- Provenance families: `gpt_*` 183, `gpt_case_*` 166, hardcase-core 155, `gemini_d*` 100, `gemini_c*` 99, `gemini_b*` 98, `trad_*` 96, `gemini_p*` 94, `gemini_jun05` 83, `opus_*` 74, `easy_*` 50, `gap_*` 50, `gemini_gapfill` 50, `claude_*` 50, `gen_*` 47, `claude_cs_*` 25, `gen_rrp` 20, `gen_hpm` 16. High-provenance (early Gemini + consolidations) ≈ 600 items.
- Currency clusters (`topic`+`stem.en` keyword scan; magnitudes, lightly noisy): immunization/screening 74, isolation/precautions 68, anticoagulation 41, sepsis 26, DKA/insulin 21, stroke 20, burn/Parkland 18, ACLS 9, BP targets 5.
- Category mix is near-even (test-plan weighting held): PhysAdapt 240, Psychosocial 197, HPM 192, BC&C 190, RRP 181, MoC 180, Pharm 172, Safety 161.

## Appendix B — Layer A signal definitions

Reuse `coverage-report.ts`'s topic normalizer and counters. Audit-specific additions: the provenance-tier map (ledger + ID-prefix families, §2); the currency-volatile keyword map (Appendix A clusters); `(topic[, skill_signature])` clustering for DC/AK candidate pairing and redundancy. Emits the harm-sorted JSONL queue in §4. No clinical judgment in Layer A — it only routes work to the capped model sessions.
