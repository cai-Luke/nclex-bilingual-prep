# NEXT SESSION — Harden the promotion gate, then close residual topic + dev work

Handoff for the next chat. The topic-vocabulary hygiene rollout that drove the previous handoff is
**substantially done** (see "Already done"); the live thread now is **tooling**: the promotion gate
has a real coverage hole and an unguarded manual merge step, both surfaced during the 2026-06-19
oncology/transfusion promotion. Fix those first, then mop up the residual-of-the-residual and resume
the parked dev feature. Implementation work here is Codex's seat; Claude authors the spec and reviews.

## Step 0 — re-orient before doing anything

- Repo: `/Users/holemini/Desktop/Project Shrimp/`. Reach it via the **`MCP:` / fsmcp.lukecai.com**
  connector (scoped to all of `/Users/holemini`). The `Filesystem:` connector is microscopy-only and
  **cannot see this repo** — an "access denied" there is a connector-selection error, not a missing file.
- **Read current state from disk first; it drifts between sessions.** For the gate work, pull in order:
  `scripts/promote.ts`, `scripts/audit/audit-integrity.ts`, `lib/case-completeness.ts`,
  `src/schema.ts`, `scripts/census.ts`, and `AGENTS.md` (Commands → promotion pipeline).
- **Verify before assuming "done."** This handoff may itself be stale next time — confirm against
  `PROJECT-HISTORY.md` (newest entries on top) and `git log` rather than trusting these notes.

## Primary task — harden the promotion gate

Five findings, evidence-verified on 2026-06-19. Suggested order: **#2 first** (biggest leverage,
absorbs #4 and half of #5), then **#1 + #3 together** (cheap, high-value, observability), then #5's
gate addition. All are local tooling changes — no schema or app-architecture churn.

1. **`audit:integrity` silently gives zero coverage on every `case_study` draft (bug, cheap fix).**
   Root cause is one inconsistency across four call sites: `src/schema.ts:189` *deliberately rejects*
   `_compileManifest` ("raw-only, must be stripped before canonical/import validation");
   `scripts/promote.ts:79` and `scripts/validate-bank.ts:32` strip before validating; but
   `scripts/audit/audit-integrity.ts:133` validates draft **and** promoted *without* stripping. A
   manifest-bearing draft fails `draftResult.ok` → `audit-integrity.ts:136` `skipped++; continue`. The
   shuffle-integrity equality check — per its own header the only thing catching manual
   post-promotion edits, promoter bypasses, and shuffle nondeterminism — therefore never runs on case
   studies, the most complex and most merge-exposed items, and the gap is invisible under a green PASS.
   **Fix:** `stripCompileManifests` on read in audit-integrity (both sides, mirroring promote). One line each.
   After this lands, update/delete the memory `project-audit-integrity-skips-case-drafts` — it documents
   the old behavior.

2. **The canonical merge is manual and *outside the gate* — the single highest-risk step (structural).**
   AGENTS.md spells it out: "Until a consolidate command exists this merge is manual: read-modify-write
   the target canonical, fail loud on any ID collision, bump meta.count, then delete the raw stub." On
   2026-06-19 that meant, by hand: append items, check collisions, bump `meta.count`, match
   `serializeBank`'s exact formatting to avoid a whole-file reformat diff, verify byte-equality vs
   promote output, delete intermediates + drafts — each a silent-failure opportunity.
   **Fix:** add `npm run consolidate` reusing the `CANONICAL_PREFIXES` table that *already exists* at
   `scripts/promote.ts:31` (today used only for a schema-version warning) to route each promoted
   intermediate into its canonical, recompute `meta.count` from `questions.length`, fail loud on
   top-level **and** nested-leaf ID collisions, serialize via `serializeBank`, and remove the stub.
   Collapses the riskiest hand-step into one deterministic, reviewable command — and moots #4.

3. **`audit:integrity` conflates two skip reasons (observability, ~10 min).** The same `skipped`
   counter covers "no promoted file found" (benign, `audit-integrity.ts:125`) and "draft failed
   validation" (a real coverage hole, `:136`), and the summary only ever prints "not yet promoted" —
   so a validation-failure skip (i.e. #1) is indistinguishable from routine housekeeping. **Fix:**
   split and label the counters; a draft that fails its *own* validation mid-integrity should be a loud
   WARN/FAIL, not a silent skip. Ship alongside #1.

4. **Intermediates are written into `banks/` root (housekeeping).** `PROMOTED_DIR = "banks"`
   (`scripts/promote.ts:21`) drops transient files beside the canonicals; they must be hand-deleted,
   pollute `git status` mid-merge, and a stray one is a candidate for accidental bundling (bundled banks
   = the top-level `banks/*.json` glob). **Fix:** stage to `banks/_promoted/` (gitignored) or hand
   intermediates in-memory to `consolidate`.

5. **Cross-bank / nested-leaf ID-collision detection is advisory-only (gate gap).** `scripts/census.ts:271`
   builds `idUniqueness` recursing into embedded case questions across all banks, but reports collisions
   as a `console.warn` (`census.ts:568`), **not** a gate failure; the `audit` gate has no cross-bank ID
   check, and schema enforces only within-bank uniqueness (`schema.ts:684`, `:786`). A merge that
   introduced a duplicate top-level or embedded ID would pass `npm run audit` clean. Since IDs key
   progress/flags/sessions/history, that's a real correctness hazard. **Fix:** have `consolidate`
   hard-fail on cross-bank collision, or add a cross-bank uniqueness check to the gate.

**FYI / interim:** until #1 lands, the case-study integrity substitute is "re-run `npm run promote` and
diff the merged canonical byte-for-byte against the fresh promote output" (used 2026-06-19); worth a
line in AGENTS.md. The `.fixed.json` suffix from `fix-bank-quotes` flows through promote into ledger
provenance as cosmetic noise — low priority.

## Already done — do not redo

- **Topic-vocabulary hygiene rollout (the previous handoff's task) is substantially complete.** The
  gating decision was resolved by splitting residual by topic-field authorship and running a
  **non-Gemini** classifier (in-harness GPT-5 with a no-Gemini guard); the Gemini-52 slice was kept
  separate. The 835 GPT/Claude residual pass ran and **493 in-category topic updates were applied** to
  canonical banks with an execution manifest (`audit/topic-residual-proposals-2026-06-17.*`,
  `audit/residual-rerun-2026-06-18.*`). Wound/pressure-injury and transfusion topics were made shared
  across the relevant categories. See PROJECT-HISTORY entries dated 2026-06-17/18.
- **Layers 1–4 of the topic system** (the prior "do not redo" list): `src/topics.ts` as single source
  of truth, generated `docs/topic-vocabulary.md`, the closed-vocabulary TOPIC FIELD RULE injected into
  the live generation prompts, the migration refit, and the exact-only write pass.
- **2026-06-19 promotion:** 5 GPT oncology/transfusion `case_study`+`bowtie` pairs merged into
  `gpt-canonical.json` (281→291); raw drafts + case sources archived; see `BANK-REVIEW-LEDGER.md`.

## Still pending (secondary — after the gate work)

1. **Residual-of-the-residual topic rows.** The harder **cross-category** proposals (~66
   `category_and_topic`) plus blocked-cross-category / unresolved / category-untrusted / context-
   incomplete rows **remain unapplied** (PROJECT-HISTORY:87, :96). These need per-category human review
   and an approved execution manifest before any canonical write, honoring the same guards.
2. **Targeting-freeze lift + coverage recompute.** Rollout steps 5–6 of the old plan — recompute
   `coverage-report` against clean topics, then lift the accurate-targeting half of the freeze — are
   **not recorded as done** in PROJECT-HISTORY (the only "freeze lifted" note there is the unrelated
   visual-renderer freeze). Verify whether this actually landed; if not, do it once the residual rows above settle.
3. **Resume development — the parked "suggested readings / Saunders" feature.** No trace in `src/`
   (unbuilt). It keys off the now-cleaned category metadata: a category→Saunders unit/concept map
   (reference the named unit, not page numbers — multiple editions circulate) surfaced on the summary
   screen for missed categories. The zero-schema first step is a lightweight "Review these areas" rollup
   on `SummaryView` (missed categories/topics); the Saunders map is the small app-side addition on top.
   Revisit with fresh observation of how the partner actually uses the GPT remediation step.

## Open vocabulary questions (decide as they come up)

- **RRP lacks an assessment/monitoring home** — GCS scoring and ET-suctioning were forced into
  Laboratory & Diagnostic Tests / Procedural Complications & Dialysis. Consider whether RRP needs a
  cleaner assessment/monitoring topic, or leave as recorded compromises.
- Granularity check (e.g. rhythm-strip/EKG under Cardiovascular Disorders?) and any near-empty topics
  worth dropping — both answerable from the recomputed coverage report, not by guessing.
