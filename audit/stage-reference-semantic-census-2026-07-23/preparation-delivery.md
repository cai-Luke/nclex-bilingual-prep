# Stage-Reference Semantic Census — Stage A Preparation Delivery

Date: 2026-07-23
Status: `CALIBRATION_DISPATCH_READY_AWAITING_OWNER_DISPATCH`

## Snapshot

- Branch at start and delivery: `codex/terminal-sentence-remediation-2026-07-22`
- HEAD at start and delivery: `6bc81eb2aaa214075cb826a34abf95cfea7ac622`
- Combined bank snapshot SHA-256: `0a3483f65f8672d85212c91e91bbdf5672731d832e19964d19e316d253a6c307`
- Pre-existing changed path at start: untracked `STAGE-REFERENCE-SEMANTIC-CENSUS-GEMINI-CALIBRATION-SPEC-2026-07-23.md`
- Initial Stage A implementation changed `audit/stage-reference-semantic-census-2026-07-23/**` only.
- No bank, runtime, schema, test, governance, ledger, census, history, or package file changed.
- The owner-authorized final dispatch correction also amended the root commission
  `STAGE-REFERENCE-SEMANTIC-CENSUS-GEMINI-CALIBRATION-SPEC-2026-07-23.md`;
  no other path outside the audit directory changed.

Bundled-bank SHA-256 snapshot:

| Bank | SHA-256 |
|---|---|
| `banks/burn-canonical.json` | `5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f` |
| `banks/capnography-canonical.json` | `36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c` |
| `banks/claude-canonical.json` | `25f53ded1ac21da4ca9d211040c3f6110ebee38d72ba41d0fc64fe358ba73b71` |
| `banks/device-canonical.json` | `83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5` |
| `banks/gemini-canonical.json` | `3dc416a4652f5f5712219dde7de87b92f0697fac953750b8abb8fc0dbb976bb6` |
| `banks/gpt-canonical.json` | `a33580581e47a2e4209a6afd44a1726788767e4a2c3d53fb4c3f49d5e33fde44` |
| `banks/hard-cases-canonical.json` | `8068c6917e53257a31c7299454c213f61bea62e61d7cf185cb1a09386f4e4862` |
| `banks/io-canonical.json` | `2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645` |
| `banks/lab-canonical.json` | `1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05` |
| `banks/mar-canonical.json` | `f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e` |
| `banks/medlabel-canonical.json` | `cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993` |
| `banks/visual-canonical.json` | `e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4` |
| `banks/vitals-canonical.json` | `5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d` |

The same hashes were verified after generation and after the byte-identical rebuild: `BANK_HASH_STABILITY 13/13`.

## Delivered population and packets

- Live `revealsAllStages` targets: **451**
- Parent cases: **93**
- Packets: **76**
- Oversized single-case packets: **16**, each explicitly marked `oversizedSingleCase: true`; no case or evidence was truncated.
- Largest packet: **378,331 UTF-8 bytes**, an explicitly marked oversized single case.
- Largest ordinary packet: within the 300,000-byte limit.
- Largest target count in any packet: **13**, within the 20-target limit.

The live population rederived the historical orientation count of 451. All 451 selected audit findings resolved to exactly one parsed live parent case and embedded part. The population contains no duplicate identity tuple or queue index. Every parent case remains whole within one packet.

## Calibration correction

The original Codex-selected 32-row manifest and monolithic 2,619,198-byte calibration input were invalidated and removed before any Gemini run.

The architect/checker subsequently supplied a valid `calibration/selection-manifest.json` conforming to `calibration/selection-manifest.template.json`: 32 ordered live targets across 12 parent cases, with no case contributing more than four targets. The builder:

- never creates, proposes, replaces, or overrides the selection;
- requires exactly 32 live identities in increasing population order;
- requires at least 12 parent cases and no more than four targets per case;
- requires one item-specific architect selection reason per row;
- rejects extra target fields so a hidden verdict cannot be embedded accidentally;
- writes `calibration/selection-review.md` for concise human review;
- strips all selection reasons from Gemini-facing data;
- materializes complete cases into `calibration/shards/calibration-shard-###.json`;
- applies the same 20-target and 300,000-byte limits as the full packet path, with an explicit oversized-single-case exception;
- writes a small aggregate `calibration/calibration-input.json` containing assignments and shard hashes rather than all selected-case evidence.

The real calibration materialization produced nine shards:

| Shard | Targets | Cases | UTF-8 bytes | Oversized single case |
|---|---:|---:|---:|---|
| `calibration-shard-001` | 4 | 1 | 195,890 | no |
| `calibration-shard-002` | 3 | 1 | 238,542 | no |
| `calibration-shard-003` | 3 | 1 | 140,935 | no |
| `calibration-shard-004` | 3 | 1 | 245,465 | no |
| `calibration-shard-005` | 8 | 3 | 269,054 | no |
| `calibration-shard-006` | 3 | 1 | 231,100 | no |
| `calibration-shard-007` | 4 | 2 | 244,243 | no |
| `calibration-shard-008` | 2 | 1 | 117,573 | no |
| `calibration-shard-009` | 2 | 1 | 205,499 | no |

Every real shard is below both ordinary limits; no oversized-single-case exception was needed. The aggregate input is 11,281 UTF-8 bytes. Its 32 identities exactly match the architect manifest in order, and the shards concatenate to the same aggregate order. All 12 cases remain whole within one shard. `selectionReason` is absent from the aggregate and all nine Gemini-facing shards.

## Shard dispatch contract

The corrected commission now requires one fresh Gemini session per calibration shard in aggregate order. Each session may read only `AGENTS.md`, the authorized Gemini-facing commission sections, exact aggregate identity metadata, and its one assigned shard. It writes only:

- `gemini/calibration-shards/calibration-shard-###.jsonl`;
- `gemini/calibration-shards/calibration-shard-###-run.json`.

The validator supports shard-local validation with `--mode calibration-shard`. After all nine shard outputs and factual run records validate, `--reconcile-calibration` concatenates the unchanged JSONL rows in aggregate order, validates the final 32/32 with `--mode calibration`, and writes:

- `gemini/calibration-output.jsonl`;
- `gemini/calibration-run.md`.

Gemini does not summarize other sessions. Codex performs no semantic edit during concatenation.

The architect/checker froze the independent 32-row hidden key and instantiated `calibration/hidden-key-freeze-attestation.json`. Codex then ran `--check-dispatch-readiness`, which returned:

```text
CALIBRATION_DISPATCH_READY 32/32 targets across 9 shards
```

The frozen key has 32 lines and SHA-256 `e3a9048515be5c1d4b0126878f578fba2faf28808a0e50c948b9b25cdc66e209`, matching the architect return and attestation. Codex checked only its byte hash and line count, not its verdict contents.

## Deterministic rebuild

The deterministic population and packet surface remains byte-identical after the calibration-layer correction:

- `population.jsonl`
- `population-summary.json`
- `packet-manifest.json`
- every `packets/packet-###.json`

Combined population/packet surface SHA-256: `5eec10b3c257668fe8e73dc9e3fa9e872e8c8c11c16c3c6174e4e7183ae2a1f0`.

The real selection, aggregate input, human selection review, and nine shard files also reproduced byte-for-byte on a second corrected-builder run.

Combined real-calibration surface SHA-256: `b2a34a2c253531572120fee7ac2b01b438ee9de616876510fe6d7b97b2954513`.

## Verification

- Strict parsing and schema validation: all 13 bundled banks passed.
- `npm run test:audit-stage-refs`: passed.
- Current `npm run audit:stage-refs` canonical sweep: completed with the expected advisory population.
- Population uniqueness and live-object resolution: passed, 451/451.
- Packet target reconciliation: passed, 451/451.
- Packet manifest reconciliation: passed, 76/76.
- Evidence-ID uniqueness: passed for every packet.
- Packet byte-limit, target-limit, and complete-case grouping checks: passed; 16 unavoidable oversized single cases are explicitly marked.
- Architect manifest reconciliation: passed, 32/32 ordered live targets across 12 cases; maximum four per case.
- Real calibration aggregate/shard reconciliation: passed, 32/32 across nine shards.
- Real calibration shard hashes and byte counts: passed, 9/9.
- Complete-case shard grouping: passed, 12/12 cases.
- Shard evidence-ID uniqueness and target projection: passed, 9/9 shards and 2,030 evidence IDs.
- Human `selection-review.md` reconciliation: passed, 32/32 rows.
- Architect-reason stripping: passed for the aggregate and 9/9 Gemini-facing shards.
- Validator synthetic rejection tests: passed, 12/12.
- Hidden-key freeze readiness gate: passed with `CALIBRATION_DISPATCH_READY 32/32 targets across 9 shards`.
- Empty shard-output reconciliation negative gate: passed with `CALIBRATION_PARTIAL_CONTEXT_LIMIT`.
- TypeScript project build: passed.
- Task-local whitespace/diff checks: passed.
- End bank-hash stability: passed, 13/13.

Synthetic validator tests covered missing, duplicate, extra, and out-of-order targets; wrong identity; unknown verdict; foreign and cross-case evidence; undeclared unsafe stages; unsupported `LEAK`; no-leak with unsafe stages; `REVIEW` with unsafe stages; and repeated boilerplate.

## Boundary confirmation

Gemini has not been run. No Gemini output or run-record path exists. Codex authored no semantic leak verdict, calibration key, score, anchor recommendation, bank mutation, or remediation proposal during Stage A. The real calibration selection and hidden key are owned by the architect/checker. Mechanical dispatch is ready; the owner may now start the nine fresh Gemini sessions. The process must stop after aggregate validation for independent Stage C scoring.
