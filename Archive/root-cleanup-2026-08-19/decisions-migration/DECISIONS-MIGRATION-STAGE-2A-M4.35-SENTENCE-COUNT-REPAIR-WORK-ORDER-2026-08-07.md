# Stage 2a — M4.35 sentence-count repair — WORK ORDER

**Date:** 2026-08-07 · **Issuing seat:** Architect (Claude) · **Revision:** 1

**Class: bounded single-substring manifest repair, plus its verification and confirming read.** Two-byte substitution. It does not reopen M4.35's substance, does not reopen the other 77 reviewed units, does not authorize Stage 2b, and does not touch `DECISIONS.md`.

---

## 0. Defect

`TASK-2-TASK-3-REMEASUREMENT-2026-08-07.md` returns 1 REQUIRED REPAIR: `M4.35 / P28#0` now carries **4** statement sentence boundaries against the ratified one-to-three-sentence grammar at target §1.

**Cause, established rather than assumed.** The four-finding repair of 2026-08-06 restored E033's generation-prompt-parameter limb as a **new standalone sentence** in a statement already at the three-sentence ceiling. The 2026-08-04 Task 2 run measured `M4.35` at 3 and was correct for the bytes it read; the restoration post-dates it. The subsequent `draw` → `draw only` exclusivity correction landed *inside* that new sentence and did not create the defect. The live statement's four boundaries are:

1. `…and parent-case metadata never standing as evidence about a leaf.`
2. `Generation prompt parameters draw only from this same scored-leaf population.`
3. `…rather than an alias for either question denominator.`
4. `…unless a case-cadence target is separately ratified.`

**No substantive defect is established.** Every operative limb the fresh constitutional review cleared at `M4.35` remains present. This is a grammar-conformance defect in sentence *packaging*, not in content.

---

## 1. The repair, and why this form

**Replace exactly one substring. Two byte substitutions, no insertion or deletion.**

Current bytes:

```text
about a leaf. Generation prompt parameters draw only from
```

Replacement bytes:

```text
about a leaf; generation prompt parameters draw only from
```

`.` → `;` and `G` → `g`. Nothing else changes.

### 1.1 Parser basis, read from source

`countStatementSentences` in `lib/decisions-format.ts` (line 308) treats **only** `.`, `?`, and `!` as boundary candidates: `if (character !== "." && character !== "?" && character !== "!") continue;`. A semicolon is never a candidate. The merged sentence therefore contributes exactly one boundary — its terminal period — and the statement returns **3**.

This is a prediction to test, not a value to reconcile to. If the measured count is not 3, stop and return to the architect.

### 1.2 Why not fold the clause into the preceding sentence

The reviewing GPT seat proposed folding the limb in as a trailing coordinate: `…never standing as evidence about a leaf, and generation prompt parameters draw only from this same scored-leaf population.` That is a legitimate repair and was considered. It is rejected for three reasons:

1. **It moves freshly-verified bytes.** `Generation prompt parameters draw only from this same scored-leaf population.` was repaired on 2026-08-07 and Codex-verified with a byte-level reversal proof reconstructing `314491` / `9d328308…`. The semicolon form leaves every byte of the exclusivity clause untouched except its leading capital; the fold rewrites its opening.
2. **Coordination risk.** Sentence 1 ends in a `with`-absolute chain (`with each embedded leaf contributing…, and parent-case metadata never standing…`). Appending a finite coordinate after that chain requires the reader to jump back over the absolutes to attach it to the main clause. Recasting it as a third absolute (`and generation prompt parameters drawing only from…`) fixes the grammar but converts a flat declarative rule into an attendant circumstance, which is a force change. E033's source is finite — `therefore use only this scored-leaf population` — and finite it stays.
3. **The semicolon achieves the same grouping.** The stated merit of the fold was grouping the generation-prompt rule with the content-planning denominator, matching E033's structure. A semicolon-joined compound sentence groups them identically.

The authorization boundary at sentence 4 — `may not enter equal-average scored-item-type targets unless a case-cadence target is separately ratified` — is **not** the merge target and is not touched. Merging sentences 3 and 4 was also considered and rejected: item 12 records that boundary as carried by no other entry, and subordinating an authorization boundary into a long delivery sentence is a substantive risk this repair has no reason to take.

---

## 2. Identities

| item | value |
|---|---|
| Branch / HEAD | `codex/decisions-migration` / `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| Manifest, pre-repair | `314811` / `e99335567d157a86f8f2b6f178b7222bf86ccfe15e5f827da5a03864c1d04b31` |
| `DECISIONS.md` | `76314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` — unchanged throughout |
| `MIGRATION_DATE` | `2026-08-18` |

**The substitution is length-preserving, so the post-repair manifest is expected to remain `314811` bytes with a different SHA-256.** Byte length is therefore worthless as a change proof here. **Every check in this order is SHA-based.** A closeout that reports only length is void.

### 2.1 Authorization identity

Not executable until a hashing-capable seat returns this file's byte length and SHA-256 and the architect acknowledges them. Immutable from that point. The architect records this order's identity before the first edit and again after, per the two-hash rule.

---

## 3. Seats

- **Architect (Claude):** executes the substitution. Dry-run first; read back from disk after; write the repair report.
- **Codex:** deterministic verification (§4). Producer≠checker holds — Codex did not author the statement.
- **Non-Claude confirming read (GPT or Codex, not the author):** targeted semantic read of `M4.35` only (§5). **Barred to the Claude seat**, which authored both the original statement and this replacement wording.

---

## 4. Codex verification

1. **Locality.** Prove the manifest differs from its pre-repair state in exactly one substring, at `M4.35` item 8, and that the diff is exactly `.`→`;` and `G`→`g`. Report pre- and post- SHA-256.
2. **Item 9 untouched.** Prove `M4.35`'s field lines are byte-identical. Task 3 stays discharged only if this passes.
3. **The other 77 units.** Prove byte-identity for all 64 other live records and all 13 wrappers, so the fresh constitutional review remains usable for them. Any other changed byte is a **BLOCKER**.
4. **Fresh full Task 2.** Re-run complete over all 65 records under the method of `DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md` §2, including the script-source line item. `M4.35` must return 3; every record must be in `{1,2,3}`; report the full distribution and any record whose count differs from the 2026-08-07 run.
5. **File integrity.** Strict UTF-8, zero U+FFFD, zero CRLF, final byte LF, exactly one terminal `@@ASSEMBLY_CURSOR@@`.
6. **Repository state.** `git status --porcelain` before and after; `DECISIONS.md` byte-identical to `MIGRATION_BASELINE`; no staged change, no tracked modification, no ref movement.

Deliverable: `audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-REPAIR-VERIFICATION-2026-08-07.md`.

## 5. Confirming read — M4.35 only

The confirming seat reads the repaired statement against baseline `E033` at `[42737,43333)` and answers, each explicitly:

1. Does the exclusivity limb still bind as a flat declarative rule, with `only` intact and its force undiminished by the semicolon?
2. Does `this same scored-leaf population` still resolve to the population defined earlier in the now-merged sentence?
3. Are all limbs the fresh review cleared at `M4.35` still present — scored-leaf planning population, container exclusion, per-leaf attribution, parent-metadata-is-not-evidence, generation-prompt exclusivity, delivery/session-unit population, capacity warnings not moving the denominator, visual inventory as a third population, and the `case_study` case-cadence authorization boundary?
4. Is the entry still one paragraph of one to three sentences under target §1?

Deliverable: `audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-CONFIRMING-READ-2026-08-07.md`.

## 6. Review-identity consequence

The fresh full constitutional review and its narrow-recommission supplement were discharged against manifest `e99335567d…`. That identity ceases to exist on repair. **The review is not thereby voided.** Its 77 untouched units are preserved by the §4.3 byte-identity proof, and `M4.35` alone is re-confirmed by §5. A full 78-unit rerun is **not** commissioned and is expressly not required.

The architect records the new manifest identity and this preservation reasoning in the repair report and the resume note once Codex returns the post-repair SHA.

## 7. Sequence

Repair → Codex verification → confirming read → architect adjudication → **then** the derived date-occurrence report. The report carries byte offsets into the manifest and may not be generated against bytes still subject to change. Stage 2b and owner ratification remain fenced.
