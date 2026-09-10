# Fail-open truth table

Scope: an active part in a schema-valid staged parent, global exhibits retained in every rendering row. `A` = primary `answerableAfterStageId`; `S` = legacy `stageId`; `prefix(S)` = all stages through a valid legacy reference. Unless specified S is absent. The proposed baseline is exactly the JSON object `{"kind":"baseline"}` with no extra keys. The new version token is unassigned; “new floor” means a separately approved feature floor. Current results were checked against unchanged live functions in [current-contract-probe.json](current-contract-probe.json); proposed results are requirements, not executed implementation tests.

Audit notation: `U` unresolved, `L` revealsAllStages, `M` strict missingRequiredAnchor. Default = WARN for findings; strict = FAIL only with L, otherwise WARN; raw gate blocks every finding. Invalid schema never constitutes a valid raw candidate. Direct audit results for malformed runtime inputs are diagnostic only: explicit-file audit fails loading; canonical sweep can skip invalid banks while Tier 0 rejects them.

| Input | Current schema / audit and raw policy | Current renderer | Recommended schema / audit and raw policy | Recommended renderer and safety disposition |
|---|---|---|---|---|
| A and S absent | Pass; L, raw blocks | All | Unchanged | All; omission never baseline |
| A empty or whitespace-only | Fail; if injected: U+L | All | Fail; same diagnostic | All if injected; never trim into an instruction |
| A null, number, boolean, array | Fail; if injected: U+L | All | Fail | All if injected; null is not a baseline default |
| A ordinary valid string | Pass at current feature floor; clean if S absent | Inclusive prefix(A) | Same acceptance and findings | Identical prefix and globals |
| A exact baseline object | Fail (object not string); injected U+L | All | Pass at new floor; resolved baseline, no L/U/M for A; raw stage policy passes if rest of case valid | Zero declared stages; global exhibits/title/summary retained |
| A baseline object under old declared floor | Fail shape today | All if injected | Bank validation fails feature floor; question import has no envelope-floor check, so separately validates shape | Runtime recognition still exact if injected; loading rejection is distinct from runtime semantics |
| A unknown ordinary string | Pass; U+L, raw blocks | All | Unchanged | All; no unknown-string-to-baseline conversion |
| A stale string after referenced stage deletion | Pass if remaining parent structure valid; U+L | All | Unchanged | All; removing any stage can never turn a string into baseline |
| A literal `baseline` or `@@case-baseline`, no such stage | Pass; U+L, raw blocks | All | Unchanged | All; neither string is reserved in recommended design |
| A exact baseline object; S valid ordinary | Fail today; injected U for A, no L | prefix(S) | Baseline primary resolves; S resolves; raw stage policy passes | Zero; intentional primary wins, like a valid ordinary primary already wins |
| A exact baseline object; S unknown | Fail today; injected U on both + L | All | Baseline resolves, but U on S remains; default/strict WARN, raw blocks | Zero; explicit baseline is not invalidated by unrelated legacy typo, which stays visible to audit |
| A absent; S valid | Pass; default clean, strict M; raw blocks | prefix(S) | Unchanged | prefix(S), preserving legacy behavior |
| A unknown string; S valid | Pass; U, default/strict WARN; raw blocks | prefix(S) | Unchanged | prefix(S); this was already resolved via legacy, not an all-stages fallback |
| A malformed object (`{}`, wrong kind, extra keys, or `{"kind":"baseline","stageId":"s1"}`); S absent | Fail; injected U+L | All | Fail; diagnostic U+L | All if injected; exact closed shape required, not just `value.kind` |
| Same malformed object; S valid | Fail; injected U only | prefix(S) | Fail; diagnostic U only | prefix(S); same legacy recovery, never baseline |
| A string equal to a real stage ID named `baseline` or `@@case-baseline` | Pass, ordinary clean | Inclusive prefix(A) | Unchanged | Ordinary prefix; no collision with object representation |
| No declared stages | Absent refs pass; present unresolved strings emit U but no L | [] | Exact baseline passes new feature floor, no-op resolved; unknown strings still U | []; no invented stage. Semantic review still checks available global evidence |
| No active part | Not an authoring baseline representation | [] | Unchanged | []; must not fake this condition to repair an active question |

Candidate A collision/staleness counterexample: suppose `A="@@case-baseline"` names an authored stage. Token-first lookup wrongly hides that stage immediately. Stage-first lookup preserves it initially, but deletion of the stage turns the SAME stale ordinary string into zero-stage baseline. Stage-first lookup alone is therefore insufficient. A safe sentinel requires enforced prohibition of that stage ID in the supported authoring/ingress domain, plus treatment of historical/imported/stored collisions and a fail-open collision policy; an exact-token scan of current banks cannot establish that global historical condition. The typed proposal avoids the collision and the deletion conversion without reserving any ordinary stage ID.

“No accidental baseline from a typo” is enforced as a representation distinction: all strings remain ordinary; malformed objects remain unresolved. No encoding can detect an author deliberately or accidentally replacing a value with an entire syntactically valid baseline instruction. Selection of a valid instruction remains semantic review, never an inference from an unresolved reference.

UI scope: overview `showAllStages` continues to reveal all stages intentionally, and unscoped stacked overview continues to show the whole case. Active-part split and controlled stacked modes must honor zero visible stages. This table concerns boundary resolution, not removal of existing overview behavior.
