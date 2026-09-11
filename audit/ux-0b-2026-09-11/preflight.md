# UX-0B preflight — 2026-09-11

Disk-reading Codex seat. Input is accepted UX-0A at `d64f9f7f82f23626daf1d8cfa43ba9abf0d86fcf` on local `codex/ux-0a-learner-truthfulness`; Luke accepted it in this task before UX-0B began. UX-0B work is on `codex/ux-0b-session-protection`, cut from that accepted snapshot. No remote state is assumed. The unrelated untracked `ORDERED-RESPONSE-SHUFFLE-QUALITY-FLOOR-CODEX-SPEC-2026-09-11.md` is preserved.

Pre-edit search confirms one construction entry, `startSession(records, mode, title, options)` in `src/App.tsx`, with `startAdaptiveSession` called only by that entry. The two `buildSessionState` calls are inside these functions. There is no bypassing learner constructor.

Direct launch callers (line numbers at the input commit):

| Caller | Line |
|---|---:|
| Library `practiceOne` wrapper | 821 |
| Home Study all | 919 |
| Home recommended weighted count | 921 |
| Home Review mistakes | 923 |
| Home Review answered | 924 |
| Home Spaced review | 925 |
| Builder Study/Test/Adaptive | 941 |
| Library filtered Study | 987 |
| Library filtered Test | 988 |
| Summary Practice related | 1077 |

Active-session storage callers are only in `src/App.tsx`:

| Operation | Context | Line |
|---|---|---:|
| load | hydration after uploaded records load | 508 |
| clear | invalid hydration cleanup | 514 |
| clear | completed-session autosave effect | 524 |
| save | ordinary autosave effect | 527 |
| clear | explicit `finishSession` | 604 |
| clear | adaptive target completion | 705 |
| clear | adaptive pool exhaustion | 711 |
| clear | normal completion | 749 |

Launch topology and active persistence mechanics still match the frozen source. Accepted UX-0A intentionally moved Dashboard weak-topic routing to Library; other Dashboard launch routes still use Builder. This is the authorized prerequisite change, not an unexpected bypass.

One pre-existing prose limitation in UX-0B §3 is recorded explicitly: `sessionReturnView` is runtime App state, while `StoredSessionSnapshot` and `toStoredSession` do not persist a return destination. This is already true in the frozen `a639b5f` source. The work will preserve runtime cancel/confirm return context exactly as required by scenarios 8–17 and will not add persisted fields or claim return-context durability across reloads. No post-freeze session-shape drift or storage escalation is required.

All construction remains deferred until the gate authorizes it. Every application active-session save/clear will use one ordered coordinator, and the new snapshot write will finish before a new session becomes visible. Banks, grading, sampling rules, storage internals, and persisted shapes remain outside this change.
