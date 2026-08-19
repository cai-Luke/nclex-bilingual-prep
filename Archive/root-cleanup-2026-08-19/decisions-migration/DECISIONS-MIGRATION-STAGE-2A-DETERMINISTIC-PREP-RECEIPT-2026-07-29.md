# Stage 2a deterministic-prep receipt

- Branch: `codex/decisions-migration`
- HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`
- Upstream state: no upstream configured
- Full `MIGRATION_BASELINE`: `d499cc1d0916e03830489ec9cd0324cd1a203a73`
- Tracked state before generation: clean
- Baseline-versus-working-tree `DECISIONS.md`: byte-identical by `git diff --quiet`

## Whole baseline

- Byte length: `76314`
- SHA-256: `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`
- Encoding: valid UTF-8 (fatal decode succeeded)
- Trailing newline: present

## Substantive output identities

- `DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md`: 6376 bytes; SHA-256 `71d7b36bc32c11cacf1849daec5f0c1b972bc33b8d174df80ab368cab8335b39`
- `DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md`: 109379 bytes; SHA-256 `6c1dcf6b651cdc3a797d2ed9442a6102327d3a937fb419930aca5374cab788da`
- `DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md`: 58126 bytes; SHA-256 `180156dc6b52cac90aaffd699f86438f0d15d8566d24f12bbb2e688837a94f0a`

## Reconciliation

- Archive spans: 13/13 verified, in bounds, non-overlapping
- Archive body bytes: `8628`
- Newline assertions: pass
- E076 EOF assertion: pass
- Live source-packet records: 65
- Live kind totals: 37 P / 6 R / 19 I / 3 T
- Scaffold accounting: 65 / 13 / 1 / 1 = 80
- Retired-register scaffold rows: 6

## Architect-review boundary markers

- Records: `E039a`, `E047c`, `E047a`, `E043a`, `E047b`
- Meaning: shared/discontiguous source context is supplied verbatim; no semantic boundary was guessed.

## Final repository status

- Tracked state: clean; no tracked or staged path changed, verified after deleting the temporary generator.
- Staging/commit/push/upstream creation: none.
- Expected untracked files preserved/produced:
  - `DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md`
  - `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md`
  - `DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-CODEX-HANDOFF-2026-07-29.md`
  - `DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md`
  - `DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md`
  - `DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md`
  - `DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md`
  - `DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md`
