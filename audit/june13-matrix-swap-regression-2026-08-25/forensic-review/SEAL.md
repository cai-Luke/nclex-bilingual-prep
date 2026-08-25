# Phase A Seal

Sealed at: 2026-08-25T14:40:24Z
Sealed by: `shasum -a 256` over the four finalized Phase A files, one non-interleaved pass, immediately before any Phase B reveal artifact was opened.

| File | SHA-256 | Bytes |
|---|---|---|
| `00-opening-receipt.md` | `3a40938b9a84ab6ebb4b41e872d5eaefee91494da9741ad283dffb90d3fd88d0` | 2448 |
| `01-independent-reconstruction.md` | `f84e4cc4b98002fc395b38760ab81e47781815dd9a92697c727fa3976b33299d` | 4948 |
| `02-git-and-repair-history.md` | `e2c005f32a1d91045d5c19b69603a093d5e39982d2beb53af63681b9173e2c9b` | 10849 |
| `03-audit-workflow-analysis.md` | `435d516177c69521533c416e9651bec4673fc66a22b2e607f8e41ae57d0bb1f4` | 6902 |

Seal order: 00 → 01 → 02 → 03 → this SEAL.md. `00-opening-receipt.md`'s recorded hash is its **final** form (after the one edit that replaced the inline-placeholder seal block with a pointer to this file); files 01–03 were never edited after their initial write. No file in this directory is altered after this SEAL.md is written. Contamination status: none — no Phase B/reveal artifact (the five files listed in commission §2/§5) was opened before this seal.
