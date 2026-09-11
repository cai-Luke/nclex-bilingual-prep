# UX-0C preflight — 2026-09-11

Disk-reading Codex seat. UX-0A was accepted by Luke before UX-0B began. UX-0B reached its implementation-ready terminal at `efbc6c7f8b6bb02b679edc0e9b9e76f7b8fc5eee`; UX-0C began afterward on `codex/ux-0c-finite-vocab-pass`, cut from that snapshot. Work is serial as requested. No remote identity is assumed, and no delegation is used.

The current `FlashcardsView`, `buildFlashcardDeck`, `recordFlashcardReview`, and review-schedule helper still match the frozen forcing premises. Before this change, the view stores duplicate card objects in `sessionDeck`, uses modulo lookup, increments forever after either review action, and rebuilds on deck/filter/Rescue identity changes. The flashcard review owner still uses the existing scheduling calculation. No `UX0C_SOURCE_DRIFT` or storage escalation was found.

The unrelated untracked `ORDERED-RESPONSE-SHUFFLE-QUALITY-FLOOR-CODEX-SPEC-2026-09-11.md` is preserved. Banks, schema, storage, scheduling, glossary derivation, Rescue membership derivation, and Campaign 16 state remain outside scope.

The pass will use frozen IDs, an explicit scope/category/topic/readiness/effective-Rescue-membership key, finite completion, and explicit restart from current eligibility. It will remain mounted view state only. Vocab's initial mount will wait for the existing learner-data hydration to finish so its first eligible snapshot uses loaded progress.
