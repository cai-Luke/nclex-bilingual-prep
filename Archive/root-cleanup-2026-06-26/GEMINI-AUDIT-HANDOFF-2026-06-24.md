# GEMINI-AUDIT-HANDOFF-2026-06-24.md

Flag-only coherence review of two straggler pairs that have **no clean Claude
or GPT reviewer**, for manual adjudication by Luke in the Antigravity IDE.

## Why Gemini

Both pairs are `claude_moc_*` (Claude-authored) × `gpt_*` (GPT-generated).
Claude is producer-conflicted on the `claude_moc` end; GPT-5/Codex is
producer-conflicted on the GPT-generated end (generation conflict). Gemini is
the only non-producer for both, and its role is **flag-only / non-mutating**
(DECISIONS principle: Gemini never mutates). So Gemini surfaces the candidate
contradiction with evidence; **Luke adjudicates**. No canonical writes by any
party here.

## The two pairs

Both are `delegation_scope`, NGN format. Read each item live at its path.

**Pair 1 — matrix × matrix (delegation/assignment grids)**
| id | bank | path | type |
|---|---|---|---|
| `claude_moc_deleg_matrix_08` | `claude-canonical.json` | `questions[76]` | matrix |
| `gpt_canonical_matrix_scope_assignment_050` | `gpt-canonical.json` | `questions[49]` | matrix |

**Pair 2 — highlight × highlight (LPN scope)**
| id | bank | path | type |
|---|---|---|---|
| `claude_moc_lpn_deleg_hl_b01` | `claude-canonical.json` | `questions[83]` | highlight |
| `gpt_hl_moc_lpn_scope_05` | `gpt-canonical.json` | `questions[313]` | highlight |

## Gemini's task (flag-only)

For each pair, produce a finding **only if** there is real evidence, under the
parent rules (`Archive/root-specs-2026-06-18/NCLEX_Audit_Spec.md` §4–§7):

- **DC** — do the two items teach *incompatible* delegation/scope rules for the
  same task/role?
- **AK** — same scenario type, *divergent keyed answer* (which cell/highlight is
  marked correct)?
- **RI / BD** — internal inconsistency, or EN↔ZH divergence that changes the
  delegation rule (`can`→`cannot` delegate, role swap, etc.). Style-only ZH
  divergence is not a finding.
- Quote verbatim from **both** IDs. Give a mandatory **Alternative
  Interpretation** (the strongest reconciliation). LOW confidence + a plausible
  reconciliation → flag as DISMISS-leaning, not a hard contradiction.

Gemini does not assign final verdicts or edit anything — it hands the flagged
evidence to Luke.

## Decisions for Luke to adjudicate

Walk each pair through this, top to bottom. Stop at the first that resolves it.

1. **Is the divergence real, or an artifact of different scenarios?** Two
   delegation items can look contradictory while testing different
   patients/acuity/tasks. If the scenarios aren't truly comparable → **no
   finding** (DISMISS).

2. **If comparable and divergent: real contradiction, or legitimate
   jurisdictional variation?** Delegation/scope rules (LPN IV push, LPN blood
   administration, LPN initial assessment, UAP scope) vary by state. This app
   targets **New York RN licensure** — anchor the call on the **NY Nurse
   Practice Act / NY scope of practice**, not a generic or other-state rule. A
   divergence that's just NY-vs-elsewhere is a *currency/scope* correction on
   the off-jurisdiction item, not a both-sides contradiction.

3. **If a real same-jurisdiction contradiction: which side is correct?** Per
   NCSBN delegation principles (right task/circumstance/person/direction/
   supervision) + NY scope. The wrong side gets the repair; the right side is
   the reference. Record the authoritative basis (body + year).

4. **Severity** (harm-if-real, independent of confidence): `blocker` if it flips
   a keyed answer or teaches unsafe delegation; `major` if it leaves the learner
   with an unresolvable ambiguity; `minor` if it's wording only.

5. **Redundancy?** If the two are near-duplicates testing the same point with no
   added nuance, consider `discard` (CUT) of the weaker rather than keeping both.

6. **Disposition per item:** `keep` / `patch` / `source_check` / `hold` /
   `discard`. Anything touching NY scope or a specific delegation rule that needs
   a citation → `source_check` + `needsHumanReview` until the source is pinned.

## Completion status

Gemini review is complete. Luke accepted the recommendations already recorded in:

- `ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md`
- `audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-24.manifest.jsonl`

Both pairs were adjudicated as DISMISS/keep, with no canonical edits and no
follow-up repair work. Do not re-open these two pairs unless Luke explicitly
asks for a new adjudication.

## Output already recorded

The dispositions were recorded into the shared pilot artifacts so the two
stragglers close in the same ledger as the rest:

- Findings → `ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md` under a
  "Gemini-flagged / Luke-adjudicated" session header (reviewing model: Gemini
  flag + human adjudication).
- Manifest rows → the coherence manifest
  `audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-24.manifest.jsonl`,
  same schema as pilot §5, `reviewingModel: "gemini+human"`.

No canonical edits; repairs (if any) become later patch specs.
