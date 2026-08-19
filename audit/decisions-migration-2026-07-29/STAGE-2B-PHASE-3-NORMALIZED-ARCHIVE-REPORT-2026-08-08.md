# Stage 2b Phase 3 — normalized migration archive report

**Authorized order:** `DECISIONS-MIGRATION-STAGE-2B-PHASE-3-NORMALIZED-ARCHIVE-WORK-ORDER-2026-08-08.md`, revision 2, independently verified at 25386 bytes / SHA-256 `16cc3c1303a53dcb74971123cd4473fb1162848730c9db76d4d35d670e5df553`

## 1. Opening measurement

Measured before any Phase 3 repository write:

| item | observed state | required comparison |
|---|---:|---|
| Branch | `codex/decisions-migration` | Match |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | Match |
| Staged paths | None | Match |
| Modified tracked paths | Exactly `lib/decisions-format.ts` and `scripts/tests/decisions-format.ts` | Match; accepted Phase 1 output |
| `lib/decisions-format.ts` | 47075 bytes / SHA-256 `10e59335d02eb90163b465570c4e467323d3ff9d224585774e264846590fe1e4` | Match |
| `scripts/tests/decisions-format.ts` | 41335 bytes / SHA-256 `251b55697b202845e805201c7f972c54bac2688e9156b6ba598e11454a75d15f` | Match |
| `DECISIONS.md` | 76314 bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | Match |
| Preservation snapshot | 76314 bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | Match |
| Prior archive | 37094 bytes / SHA-256 `d311813aeca181da908ea33907fdb919385b2c8171afad0003c3389b40e067a7` | Match |
| Ratified manifest | 332579 bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` | Match |
| Phase 3 archive | Absent | Match |
| Phase 3 report | Absent before this first Phase 3 write | Match |

The untracked governance working set is context. No third tracked path is modified and nothing is staged.

## 2. Baseline resolution and object measurement

The committed commission declaration was read with:

~~~sh
git show HEAD:DECISIONS-MIGRATION-COMMISSION-2026-07-29.md | sed -n 's/.*MIGRATION_BASELINE = \([0-9a-f][0-9a-f]*\).*/\1/p' | head -1
~~~

It yielded d499cc1. Resolving that prefix against git rev-list --all yielded exactly:

~~~text
d499cc1d0916e03830489ec9cd0324cd1a203a73
~~~

The full baseline object was materialized ephemerally before any archive construction:

~~~sh
git show d499cc1d0916e03830489ec9cd0324cd1a203a73:DECISIONS.md > /var/folders/xg/4dvh83z944d7xxvff879ywgr0000gn/T/tmp.m7fmXS5ojR/baseline-DECISIONS.md
~~~

It measured 76314 bytes / SHA-256 b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e, strict UTF-8 decode PASS, final byte 0x0a, CRLF count 0, and bare-CR count 0.

## 3. Manifest measurement

The live manifest measured 332579 bytes / SHA-256 818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2. M0.1 names exactly Archive/DECISIONS-ARCHIVE-2026-08-18.md. M5.0 and M5.1–M5.5.13 were read from the live manifest; no draft, review receipt, or protected surface was construction authority.

## 4. Fourteen-slice proof table

Every source slice was independently read from the full baseline object and matched the live manifest:

| unit | source span | bytes | SHA-256 | final byte | separator |
|---|---:|---:|---|---|---|
| E038 displaced prose | [52641,53203) | 562 | d5603bebbc00308c04f938279960c2873a849ae1c622419a7095c0bf3789c3cf | 0x0a | preamble insertion |
| E032 | [41665,42597) | 932 | ce225de0bc3b233986e8a968b54a1810f49defe82b5e190d10f9b7ab8d20174b | 0x0a | 1 LF |
| E036 | [50844,51342) | 498 | 746a9c648223c2f2a0c1b1ce4c64ea1e62b4e12083f26fb1094a933f2b68a0b0 | not 0x0a | 2 LFs |
| E039b | [53661,54291) | 630 | 781b8f8cde02d07338aebec48298d3833d2f8627d7780f8cd50587144d2c4d47 | 0x0a | 1 LF |
| E040 / P9 | [54292,54790) | 498 | b5259fd359f139364f79de63a040c64cfe1fa499757b0d4df8de674904d3600b | 0x0a | 1 LF |
| E041 / P12 | [54791,55582) | 791 | b11d42ed7b9d1647f9987563eedee5e9c0a384082f05583a3be3701692054e19 | 0x0a | 1 LF |
| E042 / P18 | [55583,56120) | 537 | 2d6de6b17fc06f5505faa09ddeeaabf5df78904f9ff7d2022d864ada7453d8eb | 0x0a | 1 LF |
| E043b / P22 | [56121,56543) | 422 | 4350881da63237d4c260d5a130132af3f45752231553050aad5fb8b8870b0a68 | not 0x0a | 2 LFs |
| E048 | [62297,62907) | 610 | 600ffba62e19db1e17e9d2eb8190ae2538135e63c88642fa27da7068fc274fa6 | 0x0a | 1 LF |
| E050 | [64005,64356) | 351 | 55d77725bb717a2e6d740776c3156acbc4ca82440e20511f1ba3c4a6d5657438 | 0x0a | 1 LF |
| E051 | [64357,64837) | 480 | 0e22abba431d56e29150e2dd3c5e609053b659adc1598904e9ee96b077338e27 | 0x0a | 1 LF |
| E052 | [64838,66593) | 1755 | d9e68b9dd5b29f17da155e2021b9b72da91172c677ce8cf445de48da676a4d76 | 0x0a | 1 LF |
| E075 | [75189,75483) | 294 | 0755d97e56843a9d966093d7d5e63273592ae5f82a9d92e6b52db7748f2b848d | 0x0a | 1 LF |
| E076 | [75484,76314) | 830 | 3b4454aa392a128b3e074d570c7df0e50fe95927b01329936eabf0194b294039 | 0x0a | none |

The exact order is E032, E036, E039b, E040, E041, E042, E043b, E048, E050, E051, E052, E075, E076. E036 and E043b are the only bodies without a final LF; E076 owns the archive terminal LF.

## 5. Construction procedure

An ephemeral Python construction script read only the full baseline object and the live ratified manifest. It extracted the exact M5.2 markdown fence, appended its terminal LF, replaced the one directive line including its LF with baseline bytes [52641,53203), then appended each M5.5.1–M5.5.13 exact heading, exact field block, one blank line, pinned source slice, and pinned separator. It asserted every source length and SHA before assembly and wrote only an OS-temporary candidate. No working-tree DECISIONS.md, preservation snapshot, prior archive, review receipt, or draft was used as source material.

## 6. Pre-write candidate identity and checks

The complete ephemeral candidate measured 13997 bytes / SHA-256 e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c.

The current accepted lib/decisions-format.ts parsed it with issues length 0 and wrapper count 13. The ordered wrapper identities and all manifest-pinned metadata matched. The candidate is strict UTF-8, ends in exactly 0x0a owned by E076, contains the E038 slice exactly once, contains the directive zero times, and has the M5.2 preamble proof exact.

Population proof: 4 ID-addressed wrappers (P9, P12, P18, P22), 9 name-addressed wrappers, retired-ID set {P9, P12, P18, P22}, and zero Retired ID fields on name-addressed wrappers. The M5.6 block contains 13 lines; its manifest-to-wrapper bijection passed with addressing-specific labels, exact archive pointer file, and exact anchors. E038 has no index line. Parsing M5.6 under target section 8 with the current index parser produced 13 lines and zero issues.

## 7. Per-wrapper preservation table

| wrapper | parsed body bytes | pinned source bytes | source-prefix SHA result | separator suffix |
|---|---:|---:|---|---|
| E032 | 933 | 932 | ce225de0bc3b233986e8a968b54a1810f49defe82b5e190d10f9b7ab8d20174b | exact 1 LF |
| E036 | 500 | 498 | 746a9c648223c2f2a0c1b1ce4c64ea1e62b4e12083f26fb1094a933f2b68a0b0 | exact 2 LFs |
| E039b | 631 | 630 | 781b8f8cde02d07338aebec48298d3833d2f8627d7780f8cd50587144d2c4d47 | exact 1 LF |
| E040 / P9 | 499 | 498 | b5259fd359f139364f79de63a040c64cfe1fa499757b0d4df8de674904d3600b | exact 1 LF |
| E041 / P12 | 792 | 791 | b11d42ed7b9d1647f9987563eedee5e9c0a384082f05583a3be3701692054e19 | exact 1 LF |
| E042 / P18 | 538 | 537 | 2d6de6b17fc06f5505faa09ddeeaabf5df78904f9ff7d2022d864ada7453d8eb | exact 1 LF |
| E043b / P22 | 424 | 422 | 4350881da63237d4c260d5a130132af3f45752231553050aad5fb8b8870b0a68 | exact 2 LFs |
| E048 | 611 | 610 | 600ffba62e19db1e17e9d2eb8190ae2538135e63c88642fa27da7068fc274fa6 | exact 1 LF |
| E050 | 352 | 351 | 55d77725bb717a2e6d740776c3156acbc4ca82440e20511f1ba3c4a6d5657438 | exact 1 LF |
| E051 | 481 | 480 | 0e22abba431d56e29150e2dd3c5e609053b659adc1598904e9ee96b077338e27 | exact 1 LF |
| E052 | 1756 | 1755 | d9e68b9dd5b29f17da155e2021b9b72da91172c677ce8cf445de48da676a4d76 | exact 1 LF |
| E075 | 295 | 294 | 0755d97e56843a9d966093d7d5e63273592ae5f82a9d92e6b52db7748f2b848d | exact 1 LF |
| E076 | 830 | 830 | 3b4454aa392a128b3e074d570c7df0e50fe95927b01329936eabf0194b294039 | exact empty suffix |

All 13 source-prefix hashes equal the manifest pins, and every suffix equals its manifest separator exactly.

## 8. Repository write and read-back

After all pre-write checks passed, the only archive write was the byte-preserving copy:

~~~sh
cp -p /var/folders/xg/4dvh83z944d7xxvff879ywgr0000gn/T/tmp.aNRku4F41n/candidate.md Archive/DECISIONS-ARCHIVE-2026-08-18.md
~~~

The archive was then measured from live disk at 13997 bytes / SHA-256 `e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c`. A binary `cmp` against the ephemeral candidate returned `cmp_exit=0`. A fresh parse of the live archive with the current accepted parser returned `issues=0` and `wrappers=13`.

The fresh read-back proof independently confirmed: the preamble is exact with the E038 bytes inserted once; the E038 directive occurs zero times; all thirteen wrapper bodies begin with their manifest-pinned baseline slice and end with the exact manifest separator; the final archive byte is E076's source LF; and the M5.6 block has thirteen lines whose exact archive-file pointers resolve to the live wrapper headings.

## 9. Unchanged surfaces and closing state

The protected and pre-existing surfaces remained unchanged at close:

| item | closing measurement |
|---|---:|
| `DECISIONS.md` | 76314 bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |
| `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | 76314 bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |
| `Archive/DECISIONS-ARCHIVE-2026-07-14.md` | 37094 bytes / SHA-256 `d311813aeca181da908ea33907fdb919385b2c8171afad0003c3389b40e067a7` |
| `audit/decisions-migration-2026-07-29/target-text-manifest.md` | 332579 bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` |
| accepted Phase 1 `lib/decisions-format.ts` | 47075 bytes / SHA-256 `10e59335d02eb90163b465570c4e467323d3ff9d224585774e264846590fe1e4` |
| accepted Phase 1 `scripts/tests/decisions-format.ts` | 41335 bytes / SHA-256 `251b55697b202845e805201c7f972c54bac2688e9156b6ba598e11454a75d15f` |

Branch remained `codex/decisions-migration` at HEAD `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`. The only modified tracked paths are the two accepted Phase 1 files; nothing is staged. The only Phase 3 outputs are this report and `Archive/DECISIONS-ARCHIVE-2026-08-18.md`. No `.gitattributes`, Phase 4 output, commit, or push was created.

## 10. Overall disposition

**PASS** — the normalized Phase 3 archive was constructed solely from the resolved baseline object and ratified manifest, all required byte/parser/index proofs passed before and after the authorized writes, and every protected surface and closing-state invariant remained unchanged. Phase 4 is not commissioned by this receipt.
