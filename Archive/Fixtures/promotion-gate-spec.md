# Promotion Gate — Specification

**Project:** Shrimp (bilingual NCLEX-RN bank, English / Simplified Chinese)
**For:** Claude Code (Sonnet / Codex)
**Goal:** Make answer placement correct by construction and well-formedness enforceable on every PR, so the next content generation run needs no manual fretting over answer-key position or stale rationales.

---

## 0. The two programs (non-negotiable boundary)

There are two distinct programs. They never share an entry point and never share mutable state.

- **The promoter** *produces* the bank: it applies the shuffle and writes output.
- **The gate** *checks* the bank: it can fail the promoter's output and must be able to do so independently.

A checker that runs inside the producer cannot independently fail the producer. The only thing they may share is one **pure, deterministic shuffle function** living in a common `lib/` — the promoter applies it, the gate re-applies it to assert equality. Neither imports the other's I/O.

---

## 1. The promoter (placement owned by code, not the LLM)

The LLM generates **content only**. Placement is computed by code.

- **`shuffle(item)`** — pure function in `lib/shuffle.ts`. Deterministic Fisher–Yates seeded by `item.id` (stable seed → reproducible permutation). Input: a draft item with options + per-option rationale. Output: same item with options reordered and the key re-pointed to the moved correct option.
- Rationales are stored **per-option** and carried with their option through the permutation, so a shuffle can never desynchronize a rationale from its answer.
- Entry point **`npm run promote`** reads the draft bank, applies `shuffle` to every item, writes the promoted bank. Idempotent for a given seed.

This deletes the unreliable step rather than verifying it: "did the shuffle run correctly" becomes an equality check (§2, integrity), not a statistical question. A seeded Fisher–Yates is uniform by construction, so distribution stops being something to prove each run.

---

## 2. The gate (two tiers)

Each check is a **module** that returns a structured result `{ name, status: PASS|FAIL|INSUFFICIENT, failures: [itemId], detail }`. Two surfaces over the modules: thin per-check scripts for development, and one aggregate the CI calls.

### Tier 0 — Precondition (hard-fail, short-circuit)

**`npm run validate:bank`** — structural well-formedness. There is no point auditing the positions of a structurally broken bank, so a failure here short-circuits the aggregate before any audit runs.

Checks: key points at an option that exists; option count within allowed range; no duplicate option contents within an item; required fields present; item IDs unique; (bilingual) both language variants present and option counts match across languages.

### Tier 1 — Standing audits (collect all, then fail)

**`npm run audit:references`** — positional-reference staleness and hazard inventory. **The most important standing check, because it governs LLM-generated content.**
- Extract explicit "Option X is correct / X is the answer" assertions; cross-check the named letter against the live key. FAIL on any mismatch (stale key).
- Inventory any rationale containing position/ordinal/spatial language. Bilingual patterns required: English (`Option A–D`, `first/second/last option`, `above/below`) **and** Simplified Chinese (`选项A/B/C/D`, `第一个/最后一个`, `以上/上述`).
- Once the position-agnostic generation rule (§3) is adopted, a hazard count > 0 is itself a **FAIL**, not a warning.

**`npm run audit:positions`** — distribution regression sanity check. Histogram of correct-answer position over the bank; chi-square vs uniform with an effect-size floor (`p < 0.01` AND max deviation from expected > 8pp → FAIL; expected count per position < 5 → INSUFFICIENT). This is a cheap regression guard against a broken seed or a non-code edit, not a proof of randomness.

**`npm run audit:integrity`** — shuffle-integrity equality check. Recompute `shuffle` from the pre-shuffle draft (the git source of truth) and assert the committed bank equals it exactly. Catches manual post-promotion edits, bypasses of the promoter, and any nondeterminism. Collapses the old content-survival diff into an equality check now that placement is code-owned.

### Aggregate

**`npm run audit`** — runs `validate:bank` (short-circuit on fail), then all Tier 1 modules, collects **every** failure into one report, exits non-zero if any failed. CI calls only this. (Wiring the checks as separate CI steps would let the first failure hide the rest; one aggregate shows every failure in a single run.)

---

## 3. Generation rule (drives the hazard class to zero)

Adopt as a content rule, enforced by `audit:references`: **rationales must be position-agnostic.** They reference option *content* ("furosemide is contraindicated because…"), never option letters or ordinal/spatial positions. A rationale that never names a letter cannot carry a stale letter — so stale answer-key references become structurally impossible rather than a bug to catch each run. This is the durable win; downstream auditing is the backstop, not the cure.

---

## 4. GitHub Action

`.github/workflows/promotion-gate.yml`: on `pull_request`, run `npm ci && npm run audit`. A non-zero exit blocks merge. This is what answers "is it good enough for main" — the gate decides, not gut feel — and it costs effectively nothing versus the model tokens previously spent shuffling and re-checking shuffles.

---

## 5. Acceptance

- Promoter and gate are separate entry points; their only shared code is the pure `shuffle` function.
- `npm run audit` is deterministic (fixed seed, sorted iteration): same bank → identical report.
- Zero per-item LLM calls in the gate.
- `audit:references` covers English and Simplified Chinese.
- Tier 0 short-circuits; Tier 1 collects all failures into one report.
- Reports name failing item IDs so repair is targeted.
