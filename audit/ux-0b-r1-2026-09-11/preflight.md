# UX-0B R1 preflight

Disk-reading implementation seat, 2026-09-11. Original checkout:
`/Users/holemini/Desktop/Project Shrimp`, branch `codex/ux-0c-finite-vocab-pass`,
HEAD `4a0e589358896cdadf7f3e0e59bcee4c52e96f8a`. Four non-MCQ audit files
are modified; an ordered-response spec and the architect-review directory are
untracked. The previous attempt also changed App.tsx and styles.css there.

Correction worktree: `/Users/holemini/Desktop/Project Shrimp UX-0B-R1`, branch
`codex/ux-0b-r1-startup-freshness`, cut from that exact committed baseline.
`git status --short --branch` was clean before applying the correction.
The previous two-file patch was captured separately for transfer; unrelated
files stay in the original checkout. Local and remote state are not equated.

Read AGENTS.md, the root parent spec, the full R1 work order (copied here as
work-order.md), current App/session guard/storage/navigation/state/sampler
owners, focused guard tests, parent receipt and browser evidence, and relevant
project history/decisions. The prior claim that the parent spec was absent was
incorrect: it is present in the reviewed committed baseline.

No launch-topology or persistence drift from the R1 baseline was found.
`requestSessionStart` is the sole request boundary; its held callback calls
`performSessionStart`. Only that function and its adaptive helper call
`buildSessionState` (baseline lines 619 and 642).

| Direct caller | Baseline App.tsx line |
| --- | ---: |
| Library one-question practice wrapper | 877 |
| Home Study all | 982 |
| Home weighted practice | 984 |
| Home mistakes | 986 |
| Home answered | 987 |
| Home due | 988 |
| Builder Study/Test/Adaptive | 1004 |
| Library filtered Study | 1054 |
| Library filtered Test | 1055 |
| Summary related practice | 1144 |

`saveActiveSession` and `clearActiveSession` are bound only to the ordered
coordinator in App.tsx (409-410); no other application caller bypasses it.

| Coordinator operation | Baseline App.tsx line |
| --- | ---: |
| Invalid hydration clear | 528 |
| Completed-session effect clear | 540 |
| Ordinary autosave | 543 |
| Replacement save, awaited before visibility | 631 |
| Explicit finish clear | 660 |
| Adaptive target completion clear | 761 |
| Adaptive exhausted-pool clear | 767 |
| Normal completion clear | 805 |

Planned production edits: App.tsx and styles.css only. Transfer the readiness
gate, keep Custom session navigation available, place the startup message in
main, retain the final readiness state update, and preserve the parent guard
and ordered write lane. Extend the ignored parent browser driver into tracked
scripts/tests/session-start-browser.mjs for repeatable R1 and parent evidence.
No delegated implementation or independent review is claimed.
