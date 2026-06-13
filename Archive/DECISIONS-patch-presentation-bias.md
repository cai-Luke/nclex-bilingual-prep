# DECISIONS.md patch — presentation normalization + non-MCQ bias rebaseline

Apply these edits to `DECISIONS.md`. Each op is declarative: locate the **ANCHOR** text and replace it with the **REPLACEMENT**, or insert where stated. No answer keys, IDs, or clinical content are touched — this is a documentation-only patch. Order of application does not matter; the anchors are disjoint.

---

## Op 1 — Add principle 16 (presentation-vs-content split)

**INSERT** the following new principle immediately after principle **15** (`**15. Bank patches are raw-scoped and declarative.**` and its paragraph), before the line `**Content generation freeze — lifted 2026-06-12.**`.

Note: principle 15 currently sits inside the `## Open threads / live state` section rather than under `## Standing principles`. Insert there, adjacent to it, to keep the two numbered-15/16 entries together; relocating both up to the principles block is optional and out of scope for this patch.

```markdown
**16. Answer-pattern bias is a presentation-layer problem first, a content problem only where shuffling cannot reach.**
Two distinct failure modes hide under "answer-pattern tell," and they have different owners. *Positional* tells — where the correct option sits, which dropdown index is keyed, which matrix column is correct, how shallow an ordered-response scramble is — are artifacts of how an item is *displayed*, carry no clinical meaning, and are fixed by a deterministic, ID-seeded permutation that provably preserves keys, IDs, rationale refs, and bilingual text. This is principle 1 generalized from MCQ option order to every non-MCQ structural axis: normalize display order, never rewrite content, to remove a positional tell. *Distributional* tells — SATA correct-count concentration, ordered-response template repetition — are properties of the item *content itself* and cannot be shuffled away (permuting options does not change how many are correct, nor how similar two stems are). These are the only bias findings that route to content authoring, and the lever is generation constraints on new items plus dilution over time, never mass edits to reviewed canonical content. The non-MCQ bias audit's `fix_class` encodes exactly this fork: `SHUFFLE_AT_PROMOTION` is mechanical and automatable; `REGENERATE` is a content-design backlog item. Verified by the 2026-06-12 rebaseline: deterministic normalization cleared every positional check globally (SATA position, dropdown index, matrix column/row, scramble depth all PASS), leaving only the two distributional families failing.
```

---

## Op 2 — Resolve the `max_cell_deviation_pp = 8` placeholder

**ANCHOR** (replace the whole block):

```markdown
**`max_cell_deviation_pp = 8` — placeholder.** The effect-size floor on positional uniformity checks is a guess; calibrate against the real bank once the audit runs.
```

**REPLACEMENT:**

```markdown
**`max_cell_deviation_pp = 8` — calibrated, retained.** The effect-size floor on positional uniformity checks held up against the 2026-06-12 post-normalization baseline: every positional check with usable n passed at 8pp (global SATA position n=536/412, dropdown index n=78/346, matrix column n=698/205/77, matrix row n≥48 across bands, ordered scramble depth at the bank level). No positional check sits in a marginal band that 8pp is hiding, so the value stays. Revisit only if a future lane lands a positional check that fails by a few pp at large n — that would be the signal the floor is too tight, not a content bug.
```

---

## Op 3 — Update the SATA-count thread with the rebaseline result and the generation-constraint decision

**ANCHOR** (replace the whole block):

```markdown
**SATA count null — resolved for Layer A.** The non-MCQ bias audit does not pretend the number-correct distribution is uniform. It uses the v2 spec's deterministic degeneracy rule instead: fail when one count covers more than 70% of SATA items or when a plausible count is absent. A future sourced NGN reference distribution may replace this fallback, but the current audit makes no unsupported statistical claim.
```

**REPLACEMENT:**

```markdown
**SATA count null — resolved for Layer A; now the dominant residual, routed to generation.** The non-MCQ bias audit does not pretend the number-correct distribution is uniform. It uses the v2 spec's deterministic degeneracy rule instead: fail when one count covers more than 70% of SATA items or when a plausible count is absent. A future sourced NGN reference distribution may replace this fallback, but the current audit makes no unsupported statistical claim. After the 2026-06-12 presentation normalization, `correct_count_distribution` is the largest remaining FAIL surface (global n=255, plus most banks with usable n) and is unreachable by shuffling (principle 16) — every generator converges on the same count concentration independently. **Decision:** generation prompts (`Opus-Harness-Bank-Prompt.md` and the GPT/Gemini lane prompts) carry an explicit SATA correct-count constraint going forward — spread counts across the legal 2…N−1 range per batch, no single count exceeding ~50% of SATA items (the audit trips at 70%, so 50% leaves headroom for honest clinical clustering), and the no-tools harness declares a count manifest at end-of-batch so it self-checks before handoff. Existing FAILs are **not** edited; they dilute as constrained new content lands.
```

---

## Op 4 — Add an ordered-response-template thread (no existing anchor; new entry)

**INSERT** immediately after the SATA block edited in Op 3.

```markdown
**Ordered-response template repetition — content backlog, constraint pending metric confirmation.** The second distributional residual (`template_repetition`, global n=164 FAIL). Trips when one stem/option template exceeds the configured share (`template_repeat_max_share = 0.15`). Unreachable by shuffling — it is a property of how items are framed, not how options are ordered. **Decision:** generation prompts require varied ordered-response framings (prioritization vs. procedure-sequence vs. escalation-sequence), varied option counts (4/5/6), and varied clinical scaffolding, same dilution model as SATA counts. **Open:** confirm exactly what the audit lib keys on as a "template" (the normalization in `non-mcq-bias-lib.ts`) before finalizing the prompt wording, so the constraint targets the same signal the metric measures rather than a proxy. Until confirmed, treat these FAILs as backlog, not actionable.
```

---

## Op 5 — Record the deferred decisions (audit placement + extending promote-time normalization)

**INSERT** as a new thread immediately after the block added in Op 4.

```markdown
**Non-MCQ bias audit — advisory now, gate deferred; promote-time normalization extension open.** Three linked decisions from the 2026-06-12 rebaseline, deliberately left open:
- *Audit placement.* The non-MCQ bias audit stays **advisory** — run on demand against explicit paths, including post-GPT-cleanup raw banks pre-promotion, where catching count concentration makes regeneration cheap rather than permanent dilution debt. It is **not** wired into `npm run audit` or the promotion gate as a blocking check yet. The advisory period is the trial that decides whether it earns gate status once the baseline is clean of presentation-sensitive failures (it now is) and the distributional backlog is shrinking.
- *Promote-time normalization.* `lib/shuffle.ts` + `promote.ts` currently normalize **option order** at promotion. The 2026-06-12 normalizer extended deterministic display-order normalization to dropdown options, matrix columns, and ordered-response pools as a standalone canonical-maintenance pass. **Open:** whether to fold that extended normalization into `promote.ts` so future promotions normalize all structural axes at the gate and canonical rebaselines never recur. Leaning yes; the standalone pass was the rebaseline vehicle, not the steady state.
- *Loose thread to close first.* `gpt-gap-jun12-rrp-bcc` still shows `ordered_response / scramble_depth` FAIL with `fix_class: SHUFFLE_AT_PROMOTION` post-rebaseline (n=3). Either that bank bypassed the normalizer or it is small-n mean-Kendall noise. Resolve before promoting it: if it bypassed, that is direct evidence the promote path does not yet apply extended normalization — which decides the bullet above.
```

---

## Op 6 — Add the session artifact entry

**ANCHOR** (the `## Session artifacts` list item for the non-mcq spec):

```markdown
- `non-mcq-bias-audit-spec.md` — forward-looking structural-bias audit across non-MCQ types.
```

**REPLACEMENT:**

```markdown
- `non-mcq-bias-audit-spec.md` — forward-looking structural-bias audit across non-MCQ types.
- `presentation-normalization-spec.md` (Codex, implemented 2026-06-12) — deterministic display-order normalization across dropdown/matrix/ordered-response axes, ID-seeded, key-preserving, dry-run-default; the rebaseline vehicle for principle 16.
```
