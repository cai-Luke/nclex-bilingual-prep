# IV push sequence correction — published review evidence

Item: `claude_a_or_iv_push_safety_14` in `banks/claude-canonical.json`. Ledger entry: [BANK-REVIEW-LEDGER.md](../../BANK-REVIEW-LEDGER.md#2026-11-16--iv-push-sequence-r2-reviewed-local-canonical-correction).

These files are byte-identical copies of the governing review artifacts. The originals are under the gitignored `scratch/iv-push-sequence-2026-11-16/`, and the copies were made on 2026-11-17 so that the ledger's evidence links resolve in the repository. The copied files are left unedited, so paths inside them still point at `scratch/`. The working scratch directory also holds bulk outputs (scope and uniqueness proofs, patch-run and validation logs, intermediate gate records); those stay local and are indexed by hash in `r2/ASTRA-R2-FINAL-RECEIPT.json`.

| File | Role | SHA-256 |
|---|---|---|
| `r1/HANDOFF.md` | Producer handoff, r1 candidate (Claude Code / Claude Opus 5.5) | `6730fe75a22b8c6d883d2b6f0989ee94645777e2d2099da5fd6cd7367e736d89` |
| `r1/ASTRA-FINALIZATION-WORK-ORDER.md` | Checker/integration authority | `a4709de36b1b2a6278fc37b1d9f8d4d0776445bb30e0cbf0ed6c98b7d6d9fd5a` |
| `r1/ASTRA-CONTENT-VERDICT.md` | Independent verdict: r1 **blocked** (GPT-6 Astra) | `8cc81474c3dff0a6df7decee698d67aaab818bb2d238755c8cbc293dd65d5311` |
| `r1/ASTRA-PRODUCER-REPAIR-REQUEST.md` | Repair request returned to producer | `80e9c51cb6291239a591dbe33e87844d1384325acbb3e28263d0aaba54e71a4a` |
| `r2/HANDOFF-r2.md` | Producer handoff, r2 repair candidate | `8a05dde9f5087b1f89da45cf0e1d11191564ab0368f033df80d635638b9bcaf1` |
| `r2/ASTRA-FINALIZATION-R2-ADDENDUM.md` | r2 review/integration authority | `f274728c6d06996562e2f0a23db574a8d5c062db3fdc12af13b62de655c173a1` |
| `r2/ASTRA-R2-CONTENT-VERDICT.md` | Independent verdict: r2 **accepted** | `84c0c0a5efd7c40e03c4b49131f54632d156933ca1a2ad45e3921d3ff883ccb9` |
| `r2/ASTRA-R2-INTEGRATION-RECEIPT.md` | Canonical integration receipt | `3b7812a4c732ba5ded91a3e3e068e6366ef6d45a3bb1a3fd0d688612c16b5564` |
| `r2/ASTRA-R2-FINAL-RECEIPT.json` | Final gate and preservation receipt | `cf8d55b511b49e308fb0cc497357e37c224b0fda7d959773b96ad883f4873fa9` |

Canonical SHA-256 chain: baseline `949f8245…e553` → rejected r1 `99000aa3…6a56` → accepted and applied r2 `60b2812e1136c2dc3a068e56ba4ae0b59adcbe3589a77355f586a8b141d87e69`.
