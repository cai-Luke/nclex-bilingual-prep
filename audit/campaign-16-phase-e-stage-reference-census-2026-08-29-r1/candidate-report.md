# Campaign 16 Phase E R1 — Candidate Semantic Census

Status: **PRODUCER CANDIDATE — NOT ACCEPTED DISPOSITION**

This Stage 1 artifact records Codex/GPT candidate classifications only. It is not Phase E closeout, does not authorize repair, and has not been independently checked. Stage 2, Stage 3, Phase F, and the checker root remain closed.

## Scope and isolation

- Frozen live population: **451** targets across **93** parent cases and **75** packets.
- Candidate coverage: **451/451**, exact queue order and identity.
- Semantic contexts: **75/75**; one fresh context per packet, with packet/output hashes frozen in `semantic-contexts.jsonl`.
- Each context received one packet and the closed semantic contract only; no running totals, historical semantic outputs, checker output, or repair proposals were supplied.
- Every packet output passed the Phase-E-local candidate validator before acceptance. Aggregate rows are an exact byte concatenation of accepted packet outputs; no semantic row was rewritten by orchestration.

## Candidate counts

| Primary verdict | Rows |
|---|---:|
| LEAK | 238 |
| NO_LEAK_COMPLETE_RECORD | 105 |
| NO_LEAK_NONANSWERING_DATA | 107 |
| REVIEW | 1 |

| Primary verdict | Distinct parent cases |
|---|---:|
| LEAK | 83 |
| NO_LEAK_COMPLETE_RECORD | 73 |
| NO_LEAK_NONANSWERING_DATA | 59 |
| REVIEW | 1 |

| Bilingual relation | Rows |
|---|---:|
| PARALLEL | 451 |

| Bank | Rows |
|---|---:|
| banks/claude-canonical.json | 58 |
| banks/gemini-canonical.json | 46 |
| banks/gpt-canonical.json | 243 |
| banks/hard-cases-canonical.json | 104 |

| Item type | Rows |
|---|---:|
| dropdown_cloze | 51 |
| fill_in_blank | 9 |
| highlight | 14 |
| matrix | 97 |
| multiple_choice | 146 |
| ordered_response | 35 |
| select_all | 99 |

| Part ordinal | Rows |
|---|---:|
| 1 | 93 |
| 2 | 86 |
| 3 | 82 |
| 4 | 83 |
| 5 | 63 |
| 6 | 44 |

| Declared stage count | Rows |
|---|---:|
| 1 | 96 |
| 2 | 32 |
| 3 | 305 |
| 4 | 18 |

## Evidence summary

- Candidate LEAK rows cite 339 unsafe-stage references.
- All 451 rows carry part evidence and stage evidence validated against their frozen packet catalogs.
- `REVIEW` remains a bounded candidate disposition where authored progression cannot safely be recovered; it is not forced into leak/no-leak.
- Counts are descriptive Stage 1 output only. They were not exposed to packet-scoped semantic contexts and are not accepted Phase E dispositions.
