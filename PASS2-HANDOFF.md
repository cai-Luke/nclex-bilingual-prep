# Pass 2 Handoff

Pass 2 is complete as of 2026-06-05. A later v1.1 hard-case pass added `case_study`; this file remains a historical Pass 2 handoff.

For the living project record, see `PROJECT-HISTORY.md`.

## Completed scope

- All six locked schema item types render and grade in sessions:
  - `multiple_choice`
  - `select_all`
  - `ordered_response`
  - `fill_in_blank`
  - `matrix`
  - `dropdown_cloze`
- Session answers use the shared structured `AnswerState` model from `src/grading.ts`.
- Shared grading covers all six item types.
- Existing progress records gain SRS fields on the next answered question:
  - `srsDueAt`
  - `srsIntervalDays`
  - `srsEase`
  - `srsLapses`
- Home shows due-review count and includes a Spaced review deck.
- English Web Speech TTS can be enabled in Settings.
- `npm run coverage-report` scans bundled `/banks/*.json` plus optional exported/uploaded bank files passed as CLI args.
- Bundled banks at Pass 2 handoff included GPT, Claude, and Gemini canonical source files; see `PROJECT-HISTORY.md` for the current count.
- Production builds are post-processed for double-click `file://` use.
- Set-style grading now rejects duplicate submitted IDs.
- The in-app AI warning footer was removed for the girlfriend handoff; AI-generation context will be given verbally instead.

## Last verification

Run on 2026-06-05:

- `npm run validate-bank -- banks/*.json`
- `npm run coverage-report`
- `npm run build`
- Served preview smoke check at `http://127.0.0.1:4173/`
  - `dist/index.html` returned `200 OK`
  - generated JS asset returned `200 OK`
  - generated CSS asset returned `200 OK`

Playwright is not installed in this workspace, so the most recent verification did not include automated browser clicks.

## Notes for the next pass

- `NCLEX-Question-Schema.md` remains authoritative. It is now v1.1 current, with v1.0 standalone-bank compatibility.
- The app is still a static Vite + React + TypeScript app with no runtime server/API dependency.
- Browser-based visual smoke testing would be a useful next verification upgrade if Playwright or the in-app browser tool is available.
