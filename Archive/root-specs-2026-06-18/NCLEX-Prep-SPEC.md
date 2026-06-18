# NCLEX Bilingual Prep — Build Spec (for Codex)

**Status:** Product context + historical build spec. For current implementation status, read `PROJECT-HISTORY.md` first.
**Owner:** Luke
**Primary user:** girlfriend studying for the **NCLEX-RN**; strong clinical/science background, weaker English reading.
**Implementer:** Codex for app code. Other LLMs may generate or review question content, but should not be treated as app-architecture owners.
**Content source:** banks generated offline by any frontier chat model (see `NCLEX-Bank-Generation-Prompt.md`) and promoted into top-level `/banks` after review. A live Gemini/API generation path is **not implemented** and remains optional future work.
**Runtime:** static SPA, runs fully offline. Authored/built on the Mac mini; the built artifact runs on her MacBook.

---

## 0. One-paragraph summary

A static, offline single-page web app that presents NCLEX-RN practice questions — each question, option, and rationale in **both English and Chinese**, with Chinese as a toggleable scaffold. English is always the primary surface (the real exam is English-only); Chinese is revealed on demand so she can verify comprehension and absorb the clinical reasoning in her stronger language. Questions are **not generated in-app**: Luke generates banks offline by pasting a portable prompt into frontier chat models (spending chat usage, not API credits), reviews/audits the content, promotes vetted JSON into top-level `/banks`, and the app bundles those files at build time. The built artifact is copied to her MacBook and runs with no network, no API key, no server. The app tracks scores, resurfaces missed questions, supports resumable/custom/adaptive sessions, and includes a coverage report for steering future generation.

---

## 1. Design principles (read these before coding)

1. **English-primary, Chinese-as-scaffold.** Never make Chinese the default reading surface for the *question stem* — she must train on English. Chinese is a reveal/toggle. The one place Chinese earns equal billing is the **rationale**, where deep understanding of clinical reasoning matters more than language practice.
2. **One model call produces everything bilingual.** A single structured-JSON generator response returns the question, options, correct answer(s), per-option rationale, a test-taking strategy note, and a mini glossary — each with `en` and `zh` fields. Do **not** make a second "translation" call.
3. **Banks come from a folder, not an API.** Models generate JSON written to `banks-raw/`; an audit pass (§2.1, `NCLEX-Bank-Audit-TASK.md`) vets/promotes accepted content into top-level `banks/*.json`, and the build bundles those top-level files (Vite glob import) so questions are present offline with no fetch. Luke generates by pasting the portable prompt (`NCLEX-Bank-Generation-Prompt.md`) into any frontier chat model. In-app file upload (§6.8) is a convenience for adding a *trusted* bank without rebuilding (it skips the clinical audit). A live API generation path is optional future work (§4). All paths emit the identical schema (§5).
4. **Provider-swappable / model-agnostic.** Nothing in the app depends on Gemini. The portable prompt is plain text that any model runs; the optional live path goes through one thin `QuestionProvider` interface. Keep prompt + schema in one shared module so both paths and the coverage tool reuse them.
5. **One-off, low-ceremony, offline-first.** Personal tool, not a product. No auth, no accounts, no analytics, **no backend or network required at runtime.** Favor the simplest thing that works.

---

## 2. Tech stack (recommended)

- **Vite + React + TypeScript** SPA.
- **Styling:** the current app uses plain CSS in `src/styles.css`; Tailwind is not installed. Do not add Tailwind unless it is a deliberate new dependency decision.
- **Bank loading:** bundle top-level `/banks/*.json` at build via `import.meta.glob("../banks/*.json", { eager: true, import: "default" })` in `src/banks.ts` — no runtime fetch, so it works from `file://` with no server. Nested files under `banks/` are not bundled.
- **IndexedDB** (via `idb`) for *mutable state only*: progress, scores, missed-question flags, SRS state, resumable sessions, flashcard progress, and banks added via in-app upload. Bundled banks are read-only and live in the build.
- **localStorage** for UI settings (language-toggle default, mode, voice on/off). No API key needed unless the optional live path (§4) is built.
- **Browser Web Speech API** (`speechSynthesis`) for English TTS — free, offline, no model call.
- No state library needed; React state + a small settings context is enough.

Codex may substitute equivalents, but keep it a static-buildable SPA whose `dist/` opens and runs offline.

---

## 2.1 Bank file naming convention & vetting pipeline

**Current bundled source of truth:** top-level `banks/*.json` contains reviewed/canonical source files. Generated batches may start as one file per model per batch, but accepted items are often consolidated into canonical source banks after review. See `BANK-REVIEW-LEDGER.md` for the operational status.

```
banks-raw/<source>-<YYYY-MM-DD>[-<suffix>].json   # raw model output — NOT bundled
        │  (audit pass — see NCLEX-Bank-Audit-TASK.md)
        ▼
top-level banks/<source-or-canonical>.json         # vetted — THIS is what the build bundles
  e.g.  banks/claude-canonical.json
        banks/gpt-canonical.json
        banks/gemini-canonical.json
        banks/hard-cases-canonical.json
```

- **Pipeline roles (settled, trust conditional):** Any frontier model can generate raw question drafts into `banks-raw/`. Gemini is fast and token-efficient, but should only be used with tight generation guard rails because observed hard-case output included placeholder distractors, generic rationales, broad/wrong topic labels, and loose schema behavior. **Codex** runs or coordinates the audit pass that vets accepted content into top-level `banks/*.json`. Generator and reviewer are always different models when possible. `banks-raw/` is immutable (provenance + re-audit). Full rationale in `NCLEX-Bank-Audit-TASK.md` §7.
- **Top-level only is bundled.** The current loader and coverage script scan top-level `banks/*.json`. Subdirectories such as `banks/Pending cases/` are holding/rejected/archive areas and are not part of the learner's bundled bank unless a file is deliberately moved or merged into a top-level bank.
- **Source label is the filename stem.** The app currently stores `sourceLabel` as `claude-canonical`, `gemini-canonical`, etc. It does not parse dates, suffixes, or mtimes from filenames.
- **Question IDs are the storage keys.** Progress, flags, sessions, and answer history key by `question.id`. Keep IDs globally unique across bundled top-level banks, usually by source/batch prefixes. Uploaded imports regenerate colliding IDs, but bundled banks should avoid collisions rather than relying on filename namespacing.

---

## 2.5 Deployment & bank delivery

- **Mac mini = authoring/build machine.** Repo lives in a folder there. Luke generates banks (paste prompt → model → JSON), saves raw output outside the bundled top-level banks, reviews/audits it, promotes accepted content into top-level `/banks`, and builds.
- **MacBook = runtime.** Copy the built `dist/` to her MacBook; she opens it (or it's served by any trivial static server). Fully offline — no key, no network.
- **"Loading questions every so often" — two supported ways:**
  1. **Rebuild + sync (zero interaction for her):** save the model's output as `banks-raw/<source>-<date>.json` (§2.1), run the audit pass to promote vetted questions into `banks/`, rebuild, sync `dist/` to her MacBook (shared folder / Syncthing / iCloud / `scp`). New questions just appear. A one-line script (`add-bank.sh <source> <file>`: copy into `banks-raw/` with the dated name → audit → `npm run build` → rsync) makes this a single command for Luke.
  2. **In-app upload (no rebuild):** open the app, upload the `.json`, it's stored in IndexedDB and merged with the bundled banks. Good for quick adds or when Luke isn't at the Mac mini.
- Recommend supporting both; (1) is the smoothest for her day-to-day, (2) is the convenient escape hatch.

---

## 2.6 Remote bank updates (optional, Pass 2)

**Honest take first:** given she works through ~100 questions slowly over many days, **you probably don't need remote push.** Refreshing her bank every week or two via §2.5 (rebuild+sync, or walk over and upload) is genuinely simpler and adds zero code. Consider the below only if you want hands-off updates without touching her MacBook.

**If you do want it — the elegant, low-complexity version:** add a single **"Update questions"** button that fetches new banks from **one CORS-open static URL** and merges them into IndexedDB (dedup by `id`). Network is used only at that tap; the app stays offline otherwise.

- **Host:** use something that sends permissive CORS headers so a `file://` build can fetch it. **GitHub Pages or a raw gist** are ideal and you already use GitHub. Push = commit/update one file.
- **Shape:** host reviewed bank files plus a small `manifest.json` listing their filenames. The "Update" button fetches the manifest, downloads files it has not seen, validates them, and dedupes by `question.id` with an explicit collision policy. Do not assume filename namespacing exists unless it has been deliberately implemented.
- **Why not Google Drive:** Drive's browser-facing download URLs involve redirects/confirm tokens and inconsistent CORS, so in-browser `fetch()` is flaky. It works fine as *your* storage, but it's a poor CDN for a client app. GitHub Pages/gist is strictly simpler and more reliable here.
- **Privacy caveat:** GitHub Pages / gists are public (gists unlisted, not private). For generic NCLEX practice questions that's typically fine — just don't put anything sensitive in them.

This is self-contained and never touches the offline core: if the fetch fails, she still has every bundled + previously-synced question.

---

## 3. Optional live generation path (future — skippable)

> The app is fully functional without this. The runtime is offline and bank-driven (§2.5). Build this only if Luke later wants in-app generation. If built, it must stay optional and never block offline use.

If implemented, the cleanest option given an always-on Mac mini is a **tiny local proxy** there holding the key in `.env`, exposing one `POST /generate` route to Gemini, hit only when Luke is generating on the Mac mini. Avoid putting a key in her MacBook build. A pure client-side variant (key in `localStorage`, direct calls to `generativelanguage.googleapis.com`) is possible but exposes the key in-browser and may hit CORS — not worth it for this use case.

Route any live generation through the same `QuestionProvider` interface and the same schema (§5), so its output is indistinguishable from a pasted bank.

---

## 4. Live generation integration (only if §3 live path is built)

> Skip for the MVP. The portable prompt (`NCLEX-Bank-Generation-Prompt.md`) already covers offline generation; this section is just the in-app equivalent.

### 4.1 Model
- No live API path is implemented today.
- If this is ever built, verify provider, model name, request shape, JSON-mode support, CORS behavior, and auth handling against current official docs before coding. Do not copy stale model strings from old planning notes.

### 4.2 Structured output
- Use the chosen provider's structured JSON mode and supply/describe a response schema matching §5. Validate the parsed result against the schema client-side; on parse/validation failure, retry once, then surface a clean error.

### 4.3 Generation request shape
Inputs the UI passes to the provider:
- `count` (1–10 per batch)
- `category` (NCLEX client-needs category, or "mixed")
- `topic` (free-text or preset, e.g. "heart failure", "insulin administration", "prioritization")
- `itemTypes` (subset of supported types — see §7)
- `difficulty` (`easy` | `medium` | `hard` | `mixed`)

### 4.4 Prompt (system/instruction — give Codex this as the basis)
> You are an NCLEX-RN item writer. Generate {count} practice questions matching the current NCSBN NCLEX-RN test plan and Next-Generation NCLEX (NGN) formats. Each item must test clinical judgment, be unambiguous, have defensible correct answer(s), and use plausible distractors. For every item provide complete English text AND a faithful, natural Simplified-Chinese translation of the stem, every option, and every rationale — translations must preserve clinical meaning, not be literal word-for-word. Write rationales that explain WHY the correct answer is correct and WHY each distractor is wrong, in clinical-reasoning terms. Include a short list of key medical/nursing terms appearing in the item with English term, Simplified-Chinese term, and a one-line Chinese definition. Output ONLY valid JSON matching the provided schema. No markdown, no commentary.

Codex should refine wording during iteration. Keep difficulty/category/topic/itemType injected from the request.

---

## 5. Question JSON schema

**Current schema: `1.1`** — adds hard/NGN `case_study` support on top of the `1.0` standalone-item core. **`NCLEX-Question-Schema.md` is current and authoritative.** The app's TS type, validator, commit-time check, and generation prompt should implement it verbatim, and shape changes require a `schemaVersion` bump + migration.

Stable core (unchanged from 1.0):
- **Base item types (6):** `multiple_choice`, `select_all`, `ordered_response`, `fill_in_blank`, `matrix`, `dropdown_cloze`.
- **v1.1 adds:** hard/NGN **case studies** (multi-item, shared-stem units — render/grade as atomic units).
- **Category enum (8):** Management of Care; Safety and Infection Control; Health Promotion and Maintenance; Psychosocial Integrity; Basic Care and Comfort; Pharmacological and Parenteral Therapies; Reduction of Risk Potential; Physiological Adaptation.
- **Every text field is bilingual** `{ en, zh }`; rationale carries `correct` + `byChoice[]` (keyed by `refId`).
- **Answers are type-specific:** `correct[]` of option ids for option types; `blanks[]` for fill-in; `matrix.correct[]` of `{rowId,columnIds}`; per-dropdown `correct` for cloze.
- **`highlight` / hot-spot** remains future.

Codex: generate the TS types and validator from the authoritative `1.1` schema; encode its validation rules as the importer's per-item checks and the commit-time `validate-bank` CLI.

---

## 6. Features

### 6.1 Two modes
- **Study mode (default):** Chinese freely available; rationale shown immediately after answering; glossary + TTS on; no scoring pressure.
- **Test mode:** stem and options render **English-only by default**; a per-question "需要中文 / Show Chinese" reveal exists but is visually de-emphasized; rationale appears only after submitting; running score tracked. Simulates the real (English-only) exam while leaving a safety net.

### 6.2 Bilingual toggles
- Global toggle: "Chinese: off / on-tap / always."
  - **off** — English only (test-mode default).
  - **on-tap** — tap any line to reveal its Chinese inline.
  - **always** — show EN with ZH beneath (study-mode default).
- Rationale panel always offers both languages regardless of stem setting.

### 6.3 Glossary / term help
- Key terms from `glossary` are tappable in the stem/options; tapping shows the Chinese term + Chinese definition in a popover.

### 6.4 Bank loading & persistence
- **Bundled banks (read-only):** all top-level `/banks/*.json` files are compiled into the build and loaded into memory on startup. This is the main library.
- **Uploaded banks (mutable):** banks added via in-app upload (§6.8) are stored in IndexedDB and merged with the bundled set at runtime.
- **Mutable state in IndexedDB:** per-question history (seen/correct/incorrect counts, last-seen date), missed-question flags, scores, SRS scheduling state, resumable sessions, answer events, and flashcard progress. Keyed by `question.id`.
- Browse / filter the merged library by category, topic, difficulty, and source label (source label comes from the filename stem for bundled banks or the import form for uploaded banks).
- **Missed-question store:** any item answered wrong is flagged; a "Review mistakes" deck resurfaces them. Clear-on-mastery (e.g., answered right twice → unflag).

### 6.5 Answering UX
- Per item type (grading defined in the schema doc): radio (`multiple_choice`), checkboxes (`select_all`, all-or-nothing), drag-to-order (`ordered_response`), text/number input (`fill_in_blank`), one-selection-per-row grid (`matrix`), inline `<select>` per blank (`dropdown_cloze`).
- After submit: mark correct/incorrect, highlight the correct answer(s), expand rationale (`correct` + `byChoice`) and the strategy note.

### 6.6 Audio (nice-to-have)
- Speaker icon on stem and each option → `speechSynthesis` reads the English aloud (en-US voice). Helps with pronunciation and listening. No ZH TTS needed.

### 6.7 Session summary
- End of a test-mode set: score, breakdown by category, list of missed items with a one-tap "add to review."

### 6.8 Import a bank (in-app, supplements the folder)
A convenience for adding questions without a rebuild. Inputs:
- **Paste JSON** into a textarea, and/or
- **Upload a `.json` file** produced by the portable prompt.

**Importer must be tolerant** — chat models don't always return clean JSON:
- Strip surrounding markdown code fences (```json … ```), backticks, and any leading/trailing prose; extract the first complete top-level JSON object or array.
- Accept **either** the wrapped form `{ "meta": {...}, "questions": [...] }` **or** a bare `[...]` array.
- Validate each question against the §5 schema; **skip + report** invalid items rather than failing the whole import (e.g. "imported 5 of 6; 1 skipped: missing `stem.zh`").
- **Source label for uploads:** the current import UI uses a user-entered source label. It does not parse filename dates/suffixes. If an uploaded question ID already exists, the importer regenerates that uploaded ID and reports it.
- Merge into IndexedDB (don't overwrite bundled banks). Offer "export all questions as JSON" — useful both for backup and for **feeding the coverage tool (§6.9)** the full current library, including uploads.

> **Caution:** in-app upload runs only the *structural* validator, **not the clinical audit** (§2.1 / `NCLEX-Bank-Audit-TASK.md`). Use it for already-vetted files or content you trust. The `banks-raw/` → audit → `banks/` path is the one that guarantees clinical vetting; uploads bypass it.

> The same fence-stripping + per-item validation logic is what Luke uses when committing files to `/banks` — reuse it as a shared module / a tiny `validate-bank` CLI so bad JSON is caught before it's committed, not at runtime.

### 6.9 Topic-coverage-aware generation (Pass 2)
Goal: when generating new banks, *softly* steer toward topics the existing library hasn't covered well — bias, not hard exclusion (already-seen topics can still recur, just less often).

Mechanism (agent-side, not in the app):
- `npm run coverage-report` reads top-level `/banks/*.json` (plus optional exported/uploaded bank files passed as CLI args) and tallies coverage: counts per `topic`, per `category`, and per `itemType`, plus difficulty spread. Add a source breakdown only if it is needed; the current script does not report one.
- It emits (a) a short human-readable **coverage report**, and (b) a **gap-weighted topic list** — under-covered topics to prioritize and over-covered ones to de-emphasize.
- That list is dropped into the portable prompt's new `PRIORITIZE_TOPICS` / `AVOID_TOPICS` parameters before Luke pastes it into a model. So the loop is: analyze `/banks` → fill prompt params → generate → commit → repeat.
- Keep it deterministic and cheap (plain counting + simple normalization of topic strings; optionally fuzzy-group near-duplicate topic labels). No model needed for the analysis itself.

This is the same scope tier as SRS (§10) — a Pass 2 enhancement, not MVP.

---

## 7. NCLEX domain reference (so generated content is realistic)

Tell the generator to follow the **current NCSBN NCLEX-RN test plan**; verify specifics at the NCSBN site since the plan updates periodically. As of the last published plan:

**Client-needs categories** (use for `category` and for "mixed" balancing):
- Safe and Effective Care Environment — *Management of Care*; *Safety and Infection Control*
- Health Promotion and Maintenance
- Psychosocial Integrity
- Physiological Integrity — *Basic Care and Comfort*; *Pharmacological and Parenteral Therapies*; *Reduction of Risk Potential*; *Physiological Adaptation*

**Next-Gen (NGN) clinical-judgment focus** — questions should exercise the NCJMM steps: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, evaluate outcomes.

**Supported item types:** the six base types (`multiple_choice`, `select_all`, `ordered_response`, `fill_in_blank` incl. dosage calc, `matrix`/grid, `dropdown_cloze`) plus **v1.1 case studies** (multi-item, shared-stem; rendered/graded atomically). `highlight` / enhanced hot-spot remains future.

---

## 8. Screens

1. **Home** — "Import a bank" (paste/upload), "Study a saved set", "Review mistakes". Optional "Generate live" only if §3/§4 are built.
2. **Question view** — stem, options, language toggles, glossary popovers, audio, submit.
3. **Rationale view** (post-submit, can be same screen expanded) — correct answer, per-option reasoning, strategy, glossary; both languages.
4. **Summary** — score + breakdown + missed-item actions.
5. **Settings** — default language-toggle behavior, default mode, voice on/off, import/export, source filter. (API key fields only if the optional §3/§4 live path is built.)
6. **Library / browse** — list + filter questions by category/topic/difficulty/source; entry point to "Study a saved set."
7. **Session builder** (Pass 3) — filter pools (category/topic/difficulty/item-type/status) → build a custom or adaptive session; "Resume session" if one is open.
8. **Dashboard** (Pass 3) — mastery by category/topic/difficulty, coverage, trend, flagged/unseen counts; tap a weak area to launch a filtered session.
9. **Flashcards** (Pass 3) — SRS vocabulary deck from glossary terms (EN↔ZH, TTS).

Keep it phone-friendly (she'll likely study on a phone).

---

## 9. Build plan — three passes

Historical build outline. Pass 1, Pass 2, and the major Pass 3 study-workflow features are now implemented; use `PROJECT-HISTORY.md` for the current status and verification baseline.

### Pass 1 — MVP (shippable on its own)
Everything needed for her to study real bilingual questions offline on her MacBook.
1. **Scaffold + schema:** Vite/React/TS; the §5 schema as the shared TS type + a `validate-bank` helper (reused by import and by a commit-time check).
2. **Bank loading:** bundle top-level `/banks/*.json` via glob import; commit a small **starter bank** (~15–25 questions, MC + SATA, mixed categories) so the app isn't empty on first open. IndexedDB for mutable state.
3. **Render + answer:** bilingual rendering with the language-toggle modes (§6.2); MC + SATA answering/grading; rationale panel (correct + per-option, both languages); glossary popovers.
4. **Modes + flow:** Study vs Test mode (§6.1); session summary with score + per-category breakdown; missed-question store + "Review mistakes" deck.
5. **In-app import (§6.8):** paste/upload, tolerant parse, provenance tagging, export-all.
6. **Mobile-friendly layout; AI-generated-content caveat handled according to §11.**

*Deferred to Pass 2 from MVP:* item types beyond MC/SATA, TTS, SRS, coverage tool, live API.

### Pass 2 — Enhancements (all within schema v1.0)
1. **Remaining item types — completing the locked six:** fill-in-the-blank (dosage calc — high value, easy), ordered/drag, matrix/grid, dropdown cloze.
2. **Spaced-repetition scheduling** over the question history (§6.4 state).
3. **Topic-coverage-aware generation tool (§6.9):** the `/banks` coverage analyzer + gap-weighted topic output feeding the prompt params.
4. **English TTS** (§6.6) and polish (empty states, richer import reporting).
5. **Optional live Gemini path** (§3/§4) — only if still wanted.
6. **Optional remote bank updates** (§2.6) — "Update questions" button fetching from a CORS-open URL — only if manual updates prove annoying.

### Pass 3 — Final features (implemented)

Built on Pass 1–2 infrastructure (IndexedDB history, SRS engine, filtering, the renderer). Targets **schema v1.1** (hard/NGN case studies included — see §5). The backbone is the **resumable session engine + custom session builder**; dashboard drill-down and adaptive mode ride on it.

**Cross-cutting requirement — resumable sessions (build first).** She studies in fragments between patients, so the app must **never impose a clock** and every session type must persist in-progress state to IndexedDB and resume cleanly: items served, answers given, score so far, queue remaining, and (adaptive) the current difficulty estimate. Home shows a "Resume session" entry when one is open. This is what makes "her own timer" work — the app paces nothing; she stops and resumes at will.

1. **Custom session builder.** One screen to assemble a session from filters — category (8 + mixed), topic, difficulty, item type, source, and **status pool** (unseen / answered / answered-incorrectly / flagged / due / all), plus count and order (random/sequential). This subsumes the earlier "review answered" and "topic deep-dive" asks: review = status filter; deep-dive = topic filter. *Case studies are atomic:* a multi-item case is selected and presented as one unit (all child items together), never split across a session boundary.

2. **Performance dashboard.** Persistent, computed from IndexedDB history. Accuracy by category / topic / difficulty / item type; coverage (seen vs available); accuracy trend over time; counts (answered / correct / flagged / unseen). Weak-area surfacing requires a **minimum sample size** before labeling a topic weak (don't judge off 1–2 questions). Tap a weak topic → launches a pre-filtered custom session (dashboard → builder). **Honest framing only — no pass-probability / readiness score** (§11 reasoning); mastery and strengths/weaknesses, never a predicted outcome. Optional per-source (filename provenance) accuracy view — useful to Luke, not to her.

3. **Flashcard / vocabulary mode.** Deck auto-built from all `glossary` entries across vetted questions (dedup by term). Card = EN term ↔ ZH term + ZH definition, flip, English TTS. Reuse the Pass 2 **SRS engine** as a *separate* schedule from question-SRS. Filter by category/topic (inherited from the source question). Optional: "appears in N questions" link-back. This is her bespoke medical-English trainer — the thing no commercial tool offers an ESL candidate.

4. **Flag for review.** Toggle a flag on any question (in-session or in browse), stored in IndexedDB by `question.id`. The flagged pool feeds the session builder's status filter and shows on the dashboard. *Optional cheap add (only if desired):* a free-text note per question stored alongside the flag — keep it minimal, not required.

5. **Simplified adaptive exam mode.** A session mode that nudges difficulty by rolling performance to mimic the NCLEX CAT *feel* — no IRT. Start at medium; keep a rolling-accuracy window; step difficulty up after sustained correct, down after misses; draw the next item from the current band of the remaining unseen pool. Stop rule: configurable fixed length (e.g. ~75–145 to echo the NCLEX range). **Pausable/resumable per the cross-cutting requirement; an *elapsed* timer may be shown for information but never a countdown.** Case studies presented atomically (don't adjust difficulty mid-case; use the case's tagged difficulty). End screen = performance by category + difficulty trajectory, **explicitly labeled "exam-condition practice," not a pass/fail or readiness estimate.**

> Token economy: build order is resumable-session engine + builder (backbone) → dashboard → flashcards → flag → adaptive mode. Flashcards and dashboard lean on existing SRS/history, so they're low-risk. If the window runs long, the natural cut line is **adaptive mode** (most novel, fully optional); the other four are the higher-value, lower-risk core.

### Beyond the build (future)
- **Case studies / hard NGN practice:** landed in **schema v1.1** and the app renders/grades them. No further schema work needed unless new item types are added.
- **`highlight` / enhanced hot-spot items:** still future — would need a v1.x type block.
- **Image generation for image-dependent NGN items:** the remaining content gap. Out of scope for the app build — it's a *generation-pipeline* problem (see §10).

---

## 10. Scope notes

**Built:** the six locked standalone item types, case studies, spaced repetition, topic-coverage tool, TTS, resumable/custom/adaptive sessions, dashboard, flags, and flashcards.

**Optional future:** live API generation and remote bank updates.

**Future (not built):** `highlight` / hot-spot (needs a v1.x type block); image-dependent NGN items (see image-generation note below).

**Genuinely out of scope (the app build):**
- Accounts, multi-user, cloud sync, analytics, telemetry.
- Chinese TTS.
- Any claim of clinical accuracy or exam-content guarantees — see §11.
- A runtime that requires network/server (must stay offline).
- **AI-generated medical images** — see below.

### Image generation — parking lot (a future *generation* pass, not the app)
The one remaining content gap: image-dependent items (ECG strips, wounds, charts). This belongs to the question-generation pipeline, not the app, and is genuinely hard for a reason that's worth stating plainly: **medical image accuracy is safety-critical**, and current image models don't reliably produce clinically correct illustrations — a wrong ECG actively teaches the wrong thing, which is worse than omitting it. Realistic options when/if you do a truly-final generation pass:
- **Curate, don't generate** — attach real openly-licensed (e.g. CC) clinical images mapped to topics. Avoids both fabrication and the prior commercial-image vendor-lockout problem; main cost is sourcing + verification.
- **Limit to data-derived visuals** — lab-value tables, simple charts, I/O grids are *data*, not images, and can be rendered deterministically and verified.
- **Omit and flag** — keep image-dependent items out and note the gap honestly.
Recommendation: do **not** AI-generate medical images. If images are added, curate licensed real ones with human verification. Until then, the bank stays text/data-only, which is fine for the large majority of NCLEX content.

---

## 11. Quality & safety notes

- Questions are **AI-generated practice aids, not verified exam content.** The current app intentionally does not show a persistent AI warning footer; communicate the caveat outside the study UI and keep the content-review ledger current. Rationales should be checked against authoritative sources, and **medication-math items especially must be independently verified.**
- Validate every question against the §5 schema at import and at commit time; never render a partially-parsed item.
- Since multiple models author content, expect occasional bad/ambiguous items — the missed-question and source-filter features double as a way to spot a model that's producing weak questions.

---

## 12. Decisions (resolved)

1. **Exam:** NCLEX-**RN**. ✓
2. **Runtime/architecture:** static offline SPA; **no API key, no server at runtime.** Authored/built on the Mac mini, runs on her MacBook. ✓
3. **Bank source of truth:** `banks-raw/` (raw model output) → audit → `banks/*.json` (vetted, bundled at build); in-app upload as a supplement. ✓
4. **Bank delivery:** rebuild + sync `dist/` (primary) and/or in-app upload (ad hoc) — §2.5. ✓
5. **Starter/current banks:** yes — current canonical bank status lives in `PROJECT-HISTORY.md` and `BANK-REVIEW-LEDGER.md`. ✓
6. **Repo:** standalone folder on the Mac mini. ✓
7. **Live Gemini/API path:** optional future work; not implemented. ✓
8. **Schema:** now `1.1` (hard/NGN case studies). ✓
9. **Pass 3 features:** custom session builder, performance dashboard, flashcard/vocab mode, flag-for-review, simplified adaptive exam mode — all on a resumable-session engine (no imposed clock). Test-mode timer dropped in favor of adaptive mode + her own pacing. ✓
10. **Images:** not AI-generated; future curate-licensed-only if ever. ✓
