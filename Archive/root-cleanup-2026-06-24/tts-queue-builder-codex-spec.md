# TTS Generation Queue Builder — Codex Spec

Implements the queue half of DECISIONS principle 20. Deterministic, no-API. Produces the work list for the (separate) generation pass and the size projection that answers "how big is the job." Run this and read its summary *before* spending any Gemini credits.

## Placement / invocation

- Script: `scripts/audio/build-tts-queue.ts` (new `audio/` grouping; flatten to `scripts/build-tts-queue.ts` if that better matches the repo's runner convention).
- npm alias: add `"tts-queue"` running it under the same runner the other `scripts/*.ts` use (tsx/ts-node — verify in `package.json`, do not introduce a new one).
- Load canonical banks the same way `scripts/census.ts` / `scripts/coverage-report.ts` do (same `parseBankText` / `validateBankObject` path and the same item enumeration that yields embedded case parts). **Do not re-implement bank loading or case recursion** — reuse the census traversal so the item set is provably identical.

## Determinism (principle 3)

Pure function of `banks/*.json` on disk. No network, no API key, no model call, no clock-dependent output except a `generatedAt`/`gitSha` provenance stamp matching `census.json`'s style. Same banks ⇒ byte-identical `clips`/`keys`. This is deterministic-core work; the model step is a separate script that consumes this output.

## Voiceable field map (authoritative — from `src/types.ts`)

Walk every `Question`. Each listed field is a `TextPair` (`{en, zh}`) unless noted; emit **two** clip rows per field (lang `en`, lang `zh`), except glossary as noted.

Common to all items (`CommonQuestion`):
- `stem`
- `rationale.correct`
- each `rationale.byChoice[]` → `{en, zh}` (path keyed by `refId`)
- `testTakingStrategy`
- `glossary[]`: `termEn` (lang `en`) and `termZh` (lang `zh`). **`defZh` is OUT for v1** (definition-reading is a separate feature with no English counterpart).

Per standalone `itemType`:
- `multiple_choice` / `select_all` / `ordered_response`: each `options[]` `{en, zh}` (path keyed by option `id`)
- `fill_in_blank`: each `blanks[].prompt`
- `matrix`: each `matrix.rows[]` `{en, zh}` and each `matrix.columns[]` `{en, zh}`
- `dropdown_cloze`: `clozeStem`; each `dropdowns[].options[]` `{en, zh}`
- `highlight`: each `highlight.segments[]` `{en, zh}`
- `bowtie`: each zone's optional `prompt`; each zone's `tokens[]` `{en, zh}` across `condition`, `actions`, `parameters`

Case study (`case_study` → `caseStudy`):
- `caseStudy.title`, `caseStudy.summary?`
- each `caseStudy.exhibits[]`: `title`, `content`
- each `caseStudy.stages[]?`: `title`, `trigger?`, `narrative?`, and that stage's `exhibits[]` (`title`, `content`)
- recurse into each `caseStudy.questions[]` (a `CaseSubQuestion`, i.e. a `StandaloneQuestion`) and apply the standalone map above; the sub-question's own `id` is its itemId
- the parent's own `CommonQuestion` fields (`stem`/`rationale`/`testTakingStrategy`/`glossary`) — extract **only if non-empty** (case parents frequently carry empty stem/rationale)

Never voice (skip): `correct`, `acceptable`, `numeric`, all `id`s, `selectable`, `timeOffset`, exhibit `type`, and any `visual` (visuals render deterministically as SVG — out of scope, principle 6).

## Normalize / hash / dedup

- `lang ∈ {"en","zh"}`.
- `normalizedText` = field string trimmed, internal whitespace runs collapsed to single spaces; otherwise content-preserving. Define this in **one** exported function (`normalizeForTts`) — the generation pass and the runtime resolver must import the same function, because the hash is the contract between them.
- `contentHash` = first 10 hex chars of `sha256(lang + "\u0000" + normalizedText)`. Lang is inside the hash so an identical en/zh string never collides across languages.
- `key` (stable field identity) = `${itemId}.${fieldPath}.${lang}`, `fieldPath` a stable dotted path: `stem`, `opt.<id>`, `rat.correct`, `rat.byChoice.<refId>`, `strategy`, `term.<idx>`, `cloze.stem`, `dd.<id>.<optId>`, `matrix.row.<id>`, `matrix.col.<id>`, `hl.<id>`, `bowtie.<zone>.prompt`, `bowtie.<zone>.<tokenId>`, `case.exhibit.<exhibitId>.content`, `case.stage.<stageId>.narrative`, sub-questions under `q.<subId>.<subPath>`. Sanitize to filename-safe characters.
- **Filename** = `${itemId}.${fieldPath}.${lang}.${contentHash}.opus` (principle 20: content hash in the name ⇒ re-voiced text gets a new file, stale audio can never play under fixed text).
- **Dedup by `contentHash`**: many keys → one clip → one generation call → one file. This is where shared glossary terms, repeated matrix column labels, and repeated dropdown options collapse. Keep both lists so the generation pass iterates *distinct clips* while the runtime maps *field key → file*.

## Output: `audio/manifest.queue.json`

```jsonc
{
  "generatedAt": "...", "gitSha": "...",
  "normalization": "v1",                 // bump ⇒ deliberately invalidates every hash
  "clips": [                              // DISTINCT clips to generate (deduped)
    { "contentHash": "...", "lang": "en", "text": "...", "chars": 0 }
  ],
  "keys": [                              // every voiceable field → its clip
    { "key": "...", "itemId": "...", "fieldPath": "...", "lang": "en", "contentHash": "..." }
  ],
  "summary": {
    "items": { "topLevel": 0, "embedded": 0, "graded": 0 },   // MUST equal census.json
    "keysTotal": 0,
    "distinctClips": 0,
    "distinctClipsByLang": { "en": 0, "zh": 0 },
    "charsTotal": 0,
    "estSecondsTotal": 0,                                       // chars / CHARS_PER_SECOND_*
    "estMB": { "opus_24k": 0, "opus_32k": 0 }                  // seconds * (3|4) KB/s
  }
}
```

Also print the `summary` to console, with a one-line headline: `<distinctClips> clips · ~<minutes> min audio · ~<MB@24k>–<MB@32k> MB Opus`.

Do **not** emit the lean runtime `audio/manifest.json` here — that lists clips that actually have a file and is produced by the generation/packaging pass (asset-presence is the runtime truth). This script only says what *should* exist and how big it is.

## Estimation constants (declared, projection-only, never gate anything)

- `CHARS_PER_SECOND_EN`, `CHARS_PER_SECOND_ZH` (zh is denser per character — separate constant). State the chosen values inline with a comment that they are projection-only.
- Opus byte rates: 24 kbps = 3 KB/s, 32 kbps = 4 KB/s.
- Label every derived size an estimate; the real number comes from the generation run.

## Acceptance criteria

- No network / key / model usage in the script or its transitive imports.
- Two runs on unchanged banks ⇒ byte-identical `clips` and `keys` (sort deterministically before serialize).
- `summary.items` equals `census.json` (`topLevel` 1524, `embedded` 721, `graded` 2245). Fail loud on mismatch — this is the built-in proof the traversal matches the census.
- Every `keys[].contentHash` resolves to a `clips[]` entry; zero orphans.
- `npm run tts-queue` exits 0 and prints the headline line.

## Out of scope (separate specs)

- Any Gemini call, PCM→Opus transcode, or write under `audio/*.opus` — generation pass.
- The lean runtime `audio/manifest.json`, `AUDIO_BASE`, and the `speechSynthesis` asset-presence fallback — app-layer resolver spec.
- `defZh` definition audio.
