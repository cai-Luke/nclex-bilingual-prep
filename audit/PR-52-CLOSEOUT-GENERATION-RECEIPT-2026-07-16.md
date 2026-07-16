# PR #52 Closeout Generation Receipt

Generated after all coupled outputs were regenerated from the clean implementation commit named below.

INPUT_SHA: `43a1087d48e1f622922abdd271d6d82f5f4a2b62`

## Commands and SHA-256 Checksums

### `npm run census`

| Artifact | SHA-256 |
|---|---|
| `census.json` | `09231abd01ac252d1914b7ec89f7b20b8b10f2594391799c20458dcb1cc0e23f` |
| `BANK-CENSUS.md` | `b3d7862337e58d35d933d334b48b25c14eac5742db5bfb94e50a49888638aea4` |

### `npm run coverage-report -- --output=audit/coverage-report-current-head.md`

| Artifact | SHA-256 |
|---|---|
| `audit/coverage-report-current-head.md` | `46205edafd3842d97fc085db2c46510cc773fe40f44792e094c7e76d00f4c158` |

### `npm run topic-vocabulary:dry-run -- --report-label current-head`

| Artifact | SHA-256 |
|---|---|
| `audit/topic-vocabulary-migration-2026-06-16.current-head.report.md` | `87f037c413eac9bf4659da889e40128fef0f0e6237a41488dee0ff7b78535b12` |
| `audit/unresolved_gemini.current-head.json` | `4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` |
| `audit/unresolved_gpt_claude.current-head.json` | `4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` |

### `npm run audit:topic-license -- --output=audit/topic-license.current-head.report.md`

| Artifact | SHA-256 |
|---|---|
| `audit/topic-license.current-head.report.md` | `64cb522df3272bf204ac413ef07532258b2fe07412c9c79f49dde9977916e763` |

### `npm run export-topic-vocab`

| Artifact | SHA-256 |
|---|---|
| `docs/topic-vocabulary.md` | `2d92c620b9914c71c740b10c1781d4a6252eb83ebe32154fe017f5e211630974` |

The receipt is not self-hashed. Generated files identify `INPUT_SHA` directly where their formats permit; residual JSON arrays and generated vocabulary documentation are bound to the same input through this receipt.
