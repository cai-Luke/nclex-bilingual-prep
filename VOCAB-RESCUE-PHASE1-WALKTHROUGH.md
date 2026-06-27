# Vocab Rescue Phase 1 Walkthrough

Date: 2026-06-27

Status: unfinished product work. Phase 1 is an instrument MVP, not the final vocabulary-learning feature.

## Why this exists

The old vocabulary feature worked mechanically, but it behaved like a standalone glossary deck. The product question is narrower: when Luke's learner misses an NCLEX question, was the block actually English nursing/medical wording?

Phase 1 adds a local, manual signal for that question: "Missed because of the English." Terms from those questions then feed a Vocab Rescue scope inside the existing flashcard view.

This is meant to produce useful learner feedback before investing in richer vocab cards, cloze drills, English definitions, or a separate vocabulary curriculum.

## Product invariant

English remains the exam surface. Chinese remains the learner scaffold.

This phase should help the learner understand English NCLEX wording well enough to answer questions. It should not become Chinese recall practice or English-to-Chinese matching.

## What Phase 1 shipped

- Added `LanguageMiss` in `src/types.ts`.
- Added IndexedDB store `languageMisses` in `src/storage.ts` and bumped the DB version to `3`.
- Added `loadLanguageMisses()` and `recordLanguageMiss()`, with the same memory fallback pattern used by existing progress/flags storage.
- Loaded language misses into app state in `src/App.tsx`.
- Added a manual language-miss toggle on incorrect submitted questions with glossary terms.
- Gated the toggle from parent props so test/adaptive/dev flows do not infer permission accidentally.
- Allowed marking missed questions from summary review.
- Added a Summary action, "Review missed terms", that opens Vocab with a one-shot focused Rescue set for that completed session.
- Added a `Rescue | All` scope control to the existing flashcard view.
- Added a small `Vocab Rescue` chip on cards whose terms came from manually language-tagged questions.
- Kept existing flashcard card content, SRS review behavior, topic/category filters, ready-now filter, and randomized session feel.

## What this intentionally did not do

- No question schema change.
- No bank JSON change.
- No content pipeline change.
- No generated glossary regeneration.
- No `defEn` or `clinicalUseEn`.
- No English-to-Chinese quiz.
- No automatic "wrong because vocabulary" classifier.
- No mid-test interruption.
- No new navigation item.
- No deck management redesign.

## How to exercise it manually

1. Start a Study session.
2. Answer a question incorrectly.
3. If the question has glossary terms, the incorrect-answer review area should show:
   - `Missed because of the English`
   - `是英文卡住了`
4. Click it. The control changes to:
   - `Added to Vocab Rescue`
   - `已加入词汇救援`
5. Finish the session and go to Summary.
6. Expand a missed question. The same language-miss control should be available there for missed questions.
7. Click `Review missed terms` from Summary.
8. Vocab opens in Rescue scope and shows terms from missed questions in that session.
9. Switch to All. The one-shot Summary focus clears.
10. Leave Vocab and return through normal Vocab nav. It should use the durable Rescue set, not the stale session handoff.

## Data behavior

`languageMisses` is local app storage only:

```ts
type LanguageMiss = {
  questionId: string;
  markedAt: string;
};
```

Presence means the learner manually marked that question as an English-language miss. Absence means not marked.

This is intentionally independent of `progress[questionId].missed`. A question can remain in Vocab Rescue because it is currently missed, because it was manually language-tagged, or both.

## Important implementation note

The original spec suggested clearing summary focus with a Flashcards unmount cleanup. This app runs under React StrictMode in development, so an unmount cleanup can fire during the development-only remount cycle and clear the Summary handoff immediately.

The implemented behavior clears stale `rescueFocusIds` at the App level when leaving the Flashcards view, and normal direct Vocab entry clears it before opening Vocab.

## Future phase questions

Before making Phase 2, interview the learner. Useful prompts:

- When you miss a question, can you tell whether the obstacle was English wording, nursing concept, or both?
- Which English terms actually slowed you down during review?
- Does seeing Chinese support after the miss help, or does it become a crutch?
- Would an English clinical-use sentence help more than a Chinese definition?
- Should Vocab Rescue be only terms from manually tagged questions, or also all missed-question terms?
- Do you want vocabulary practice embedded in rationale review, or separated into a short rescue queue?
- Are cloze cards useful, or would they feel like another test?

## Likely next moves

- Add a tiny local count/readout for manually tagged language misses if the interview shows the signal is useful.
- Consider richer card backs only after deciding the content lane: `defEn`, `clinicalUseEn`, examples, or none.
- Consider separating "missed question terms" from "manually language-miss terms" if the current Rescue scope feels too broad.
- Add focused browser regression coverage once the UI direction settles.

## Verification from Phase 1

- `npx tsc -b --pretty false`
- `npm run build`

