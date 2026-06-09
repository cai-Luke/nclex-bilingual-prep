# Project Shrimp Dev Feature Spec — Question ID Lookup & Review Console

## Purpose

Add a developer-only way to open specific question IDs from the app UI so audit outputs can be reviewed by a human without manually reading JSON.

This feature is for review/debugging only. It must not change the learner-facing study flow, grading logic, production bank schema, or canonical question content.

Example target IDs:

* `gemini_b9_10`
* `gemini_b2_08`
* `gemini_c10_07`

## Context

The project has grown large enough that audit tools can identify suspicious question IDs faster than humans can locate them in JSON. A developer review console should let the reviewer paste one or many IDs, open the matching question using the existing app renderer, inspect metadata/rationale, and optionally record local review notes.

## Non-goals

Do not create or edit canonical question content.

Do not add new question schema fields.

Do not change grading behavior.

Do not expose this as a prominent learner-facing feature.

Do not add server/API dependencies.

Do not import audit findings into bundled banks.

## UX Requirements

### 1. Developer entry point

Add a developer-only entry point available by one or more of these mechanisms:

* URL query/hash flag: `?dev=1`
* localStorage flag: `shrimpDevTools=true`
* small “Developer” link only visible when dev mode is active

Preferred: support `?dev=1` and store the dev flag in localStorage so it remains available during a review session.

The learner-facing default UI should remain unchanged when dev mode is off.

### 2. Question ID lookup

Create a “Question Lookup” or “Review Console” screen with:

* A multiline input box accepting question IDs separated by commas, spaces, or newlines.
* A button labeled “Open IDs” or “Find questions.”
* A result list showing each requested ID in the same order entered.
* For each result:

  * Found / not found status
  * Source bank label
  * Question ID
  * Item type
  * Category
  * Topic
  * Difficulty
  * Whether the item has a visual
  * Whether the item is a case-study parent or embedded case-study part, if applicable

### 3. Direct URL support

Support opening one or more IDs directly from the URL.

Accept either of these shapes if they are easy to implement in the existing app routing style:

```text
?dev=1&qid=gemini_b9_10
?dev=1&qids=gemini_b9_10,gemini_b2_08,gemini_c10_07
```

If the app uses hash-state instead of route paths, use the project’s existing navigation style rather than adding a router dependency.

### 4. Question preview

When a found ID is selected, render the question using existing question/session components as much as possible.

The preview should show:

* Stem
* Options / rows / dropdowns / blanks
* Case-study exhibits and embedded parts where applicable
* Visual stimulus if present
* Correct answer
* Rationale
* Per-choice rationale
* Test-taking strategy
* Glossary
* English/Chinese toggle behavior consistent with the rest of the app

The preview must be read-only and must not alter real learner progress, answer history, missed status, or active sessions.

A useful default is “review mode”: show the correct answer and rationale immediately.

### 5. Case-study handling

The lookup must handle both top-level case-study IDs and embedded case-study part IDs.

If a top-level case-study ID is opened:

* Show the full case study.
* Show all embedded questions/parts.
* Allow jumping to a specific embedded part if the user selects one.

If an embedded part ID is opened:

* Show the parent case study context/exhibits.
* Scroll or focus the matching embedded part.
* Clearly label the parent case-study ID.

If embedded parts do not currently have globally indexed IDs, implement the index in a way that can still find them by their existing embedded `id` fields.

### 6. Manifest/audit helper, optional but high value

Add an optional “Paste audit manifest” box that accepts JSONL rows from `manifest.jsonl`.

Minimum useful behavior:

* Parse JSONL.
* Extract `qid`.
* Let the reviewer filter by:

  * `disposition`
  * `visual_value`
  * `target_renderer`
  * `base_item_trust`
  * `needs_human_review`
* Clicking a manifest row opens the matching question preview.
* Show the manifest row’s rationale fields next to the question:

  * `the_tell`
  * `renderer_justification`
  * `ambiguity_note`
  * `trust_note`
  * `disposition_rationale`

Do not persist pasted audit manifests into the canonical bank.

### 7. Local review notes

Add lightweight local-only review notes.

For each question, allow the developer to mark:

* `unreviewed`
* `looks_ok`
* `needs_fix`
* `duplicate_or_redundant`
* `visual_candidate`
* `reject_audit_flag`

Also allow a free-text note.

Store notes in localStorage or IndexedDB under a developer-specific key such as:

```text
shrimpDevReviewNotesByQuestionId
```

Provide an “Export review notes” button that downloads JSON such as:

```json
{
  "exportedAt": "ISO timestamp",
  "notes": {
    "gemini_b9_10": {
      "status": "needs_fix",
      "note": "Human reviewer should check rationale/key.",
      "updatedAt": "ISO timestamp"
    }
  }
}
```

Do not write these notes back into question bank files automatically.

## Implementation Guidance

Prefer small, localized additions.

Likely implementation pieces:

* Add a question indexing helper that walks bundled questions and returns a map by ID.
* Include top-level items and embedded case-study parts in the index.
* Reuse existing question rendering components rather than building a second renderer.
* Add a dev-only component such as `DeveloperReviewConsole`.
* Add app state to switch to the dev console when dev mode is active.
* Keep the feature compatible with the existing static/offline build.

Suggested helper shape:

```ts
type QuestionLookupResult = {
  requestedId: string;
  found: boolean;
  question?: Question;
  parentCaseStudy?: CaseStudyQuestion;
  embeddedPart?: Question;
  sourceLabel?: string;
  pathLabel?: string;
};
```

Add tests or at least manual checks for:

* Exact lookup of a normal standalone question ID.
* Exact lookup of a case-study parent ID.
* Exact lookup of an embedded case-study part ID.
* Multiple pasted IDs.
* Missing ID.
* Dev mode off: no visible learner-facing change.
* Dev preview does not write progress/session state.

## Acceptance Criteria

The feature is complete when:

1. Visiting the app with dev mode enabled exposes a Question Lookup / Review Console.
2. Pasting `gemini_b9_10`, `gemini_b2_08`, and `gemini_c10_07` produces either found previews or explicit not-found rows.
3. A found question can be reviewed entirely from the UI, including answer key and rationale.
4. Multiple IDs can be pasted at once.
5. Case-study IDs and embedded case-study part IDs are handled gracefully.
6. Learner-facing UI is unchanged when dev mode is disabled.
7. No canonical bank files are modified.
8. These commands pass:

```sh
npm run validate-bank -- banks/*.json
npm run coverage-report
npm run build
```

If visual renderer tests are relevant to touched code, also run:

```sh
npm run test-visuals
```

## Project History Update

If this lands, update `PROJECT-HISTORY.md` with a short entry under the current work/milestones noting that a developer-only question ID lookup and review console was added for audit triage.
