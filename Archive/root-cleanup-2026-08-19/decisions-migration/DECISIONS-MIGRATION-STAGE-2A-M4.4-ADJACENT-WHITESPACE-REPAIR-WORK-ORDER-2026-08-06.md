# Stage 2a — `M4.4`-adjacent whitespace repair work order

**Date:** 2026-08-06/07 · **Authoring seat:** Architect · **Revision:** 2

**Class: bounded manifest defect repair, not yet executed.** This order authorizes exactly one further
manifest edit: a whitespace-only correction to the text immediately adjacent to `M4.4 / P2#1` item 10's
final `Owner` repair, diagnosed by Codex's `FOUR-FINDING-REPAIR-VERIFICATION-2026-08-06.md` FAIL and a
subsequent chat-only GPT forensic pass. It does not reopen the substantive four-repair population, does
not touch any semantic byte, and is not executed by this order — it is written, read back, and its
identity is returned for hashing, per the person's instruction to stop before editing the manifest.

**Revision 2.** Revision 1 is superseded before being hashed and was never executed; no edit was made
under it. This revision corrects three wording defects found before hashing: an unproven causal-mechanism
claim at §1, a malformed sentence at §1, and an incorrect step reference in §7's closing paragraph. The
substantive repair — the three whitespace corrections, the combined open/replacement substrings, the
−4 byte delta, and the `314806` expected post-repair length — is unchanged.

---

## 0. Diagnosis accepted: `BOUNDED MANIFEST DEFECT`

Codex's verification returned FAIL: the live manifest correctly contains all four final repair spans,
but reversing them in memory does not reproduce the pinned pre-repair identity — a 4-byte discrepancy
between a 315-byte sum of recorded span deltas and a 319-byte live-to-pinned-null delta. The verification
receipt makes no attempt to explain or repair that discrepancy; it is accepted here as authoritative for
what it certifies and is not altered.

The later forensic diagnosis, returned in chat only and not written as a repository artifact, attributes
the 4-byte gap to unauthorized whitespace drift immediately adjacent to the `M4.4` `Owner` repair — inside
the `Execution` field clause that follows it, not inside the `Owner` clause itself. This seat independently
re-verified that diagnosis against live disk before accepting it; §2 records what was checked.

**Identities, pinned:**

| item | value |
|---|---|
| `FOUR-FINDING-REPAIR-VERIFICATION-2026-08-06.md` | remains an accurate, immutable FAIL receipt; not superseded, not altered, not reopened by this order |
| Exact pre-repair witness, unreachable Git blob | `a2685a3518aa609902b151dec4e51bf353d66e2e` — this seat has no git-object-inspection tool and did not independently confirm this blob; it is transcribed from the forensic diagnosis and is a claim this order relies on without this seat's own verification |
| Witness identity | `314491` bytes / SHA-256 `9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a` — matches the pre-repair identity pinned throughout this workstream since 2026-08-06 |
| Current live manifest | `314810` bytes (confirmed independently by this seat via `MCP:get_file_info` immediately before drafting this order) / Codex SHA-256 `72ae9a0a81295a6c4f7565ae1140a0e36e5852874df0cbc37bf46e339d2be5ab` (transcribed from the FAIL receipt; not independently computable by this seat) |
| Diagnosis | exactly four net-extra whitespace bytes outside the authorized `Owner` replacement surface, confirmed by this seat's own arithmetic at §2, not merely transcribed |

**What is not reopened:**

- No semantic byte in the final `Owner` clause. Its wording is untouched by this order.
- No M6 byte.
- No `M4.38` / `P31#0` byte.
- No `Evidence` substance (the clause preceding `Owner` in item 10).
- No `Execution` *substance* — the field's wording is unchanged. Only its surrounding whitespace layout
  (a line break and a run of indentation spaces) is in scope.

---

## 1. What the defect actually is

`M4.4` item 10's final `Owner` correction is semantically correct and byte-identical to the wording
authorized by completion-order revision 2 §4. The exact pre-repair witness and Codex's forensic
comparison nevertheless prove that three adjacent whitespace boundaries inside the following `Execution`
clause differ from the authorized pre-repair surrounding bytes, for a net +4-byte defect. The historical
edit operation that introduced those wrap changes is not material to this repair and is not inferred
here. The three proven boundary differences are opened narrowly by this order.

This is a formatting defect, not a wording defect. No semantic text changes as a result of this
correction; only physical whitespace layout in the manifest changes.

---

## 2. Verification performed before drafting this order

- **Current manifest byte length**, read live via `MCP:get_file_info`: `314810` bytes, matching both the
  FAIL receipt's own measurement and this seat's post-edit measurement recorded in the repair report §5.
  Confirmed, not merely transcribed.
- **The live `M4.4` item 10 text**, read in full from disk (`Filesystem:read_text_file`, head to line
  465), confirmed to read exactly:

  ```text
  `Owner` — `OMIT`; no single live tracked path owns the whole spec-conformance/content-review split,
      whose narrowing history and forcing incident survive only in archived material. `Execution` —
      `OMIT`; the frozen classification carries no execution state and the entry decides a review-routing
      practice with no implementable owner.
  ```

  This matches the "current shape" the forensic diagnosis describes, confirmed independently rather than
  taken on the diagnosis's word.
- **Uniqueness of the edit target**, confirmed via `MCP:search_repository_files` for the fragment
  `the frozen classification carries no execution state and the entry decides a review-routing`: exactly
  one match repository-wide, at `target-text-manifest.md`, inside `M4.4` item 10. No other record in this
  65-record manifest shares this boilerplate closely enough to collide with it.
- **Arithmetic of the three authorized corrections**, independently computed rather than accepted on
  assertion. Each correction only swaps a separator; everything else in the span is common to both sides
  and cancels out of the delta:
  - Correction 1 swaps `\n    ` (5 bytes: one LF, four spaces) for a single space (1 byte): **−4**.
  - Correction 2 swaps a single space (1 byte) for `\n    ` (5 bytes): **+4**.
  - Correction 3 swaps `\n    ` (5 bytes) for a single space (1 byte): **−4**.
  - Net: **−4 bytes**, matching the diagnosis's claimed delta exactly.
- **Resulting byte length**: `314810 − 4 = 314806`, matching the diagnosis's stated expectation exactly,
  independently recomputed rather than copied.

The Git-blob claim at §0 is the one item in the diagnosis this seat's available tools cannot check; it is
carried forward as an unverified transcription, flagged as such, rather than presented as confirmed.

---

## 3. Scope

### 3.1 Open

- Exactly one further manifest substring: the `Execution`-clause whitespace inside `M4.4` item 10, per §4.
- This order's own authorization identity, measured and recorded externally per §5, on the same mechanism
  as the completion order's revision 2 — with the one change §5 states, learned from the prior round's
  documentation-location mistake.
- The eventual repair report and Codex verification receipt, per §5 and §6 (not written or run by this
  order).

### 3.2 Closed — unchanged by this order

- `M4.3`, `M4.5`, and `M4.35`, byte-identical to their landed final state.
- `M4.4`'s `Owner` clause wording — the words themselves, not the adjacent whitespace this order opens.
- `M4.38` / `P31#0`, in full.
- All of M6.
- `DECISIONS.md`.
- `FOUR-FINDING-REPAIR-VERIFICATION-2026-08-06.md` — the FAIL receipt is not altered, not superseded, and
  is not treated as anything other than an accurate record of the state it examined.
- Both prior work orders (`FOUR-FINDING-REPAIR-WORK-ORDER` revision 1 and
  `FOUR-FINDING-REPAIR-COMPLETION-WORK-ORDER` revision 2), neither reopened nor amended.

---

## 4. The three authorized boundary corrections

All three fall inside the same contiguous span — the `Execution` field clause of `M4.4` item 10 — and are
executed as one atomic edit over that full span, so that the match is proven unique by the same large
exact context that makes each individual correction unambiguous. The three corrections, stated
individually for audit clarity, then the single combined edit that is actually applied:

1. `` `Execution` —\n    `OMIT` `` → `` `Execution` — `OMIT` `` *(remove the line break and indentation
   between the em dash and `OMIT`; join onto one line)*
2. `the frozen classification carries no execution` → `the frozen classification carries\n    no
   execution` *(insert a line break and four-space indent after "carries")*
3. `entry decides a review-routing\n    practice` → `entry decides a review-routing practice` *(remove
   the line break and indentation between "review-routing" and "practice"; join onto one line)*

**Combined open substring** (verified unique repository-wide at §2):

```text
`Execution` —
    `OMIT`; the frozen classification carries no execution state and the entry decides a review-routing
    practice with no implementable owner.
```

**Combined replacement:**

```text
`Execution` — `OMIT`; the frozen classification carries
    no execution state and the entry decides a review-routing practice with no implementable owner.
```

Every word in both spans is identical; only three whitespace positions move. Net byte delta: **−4**.
Expected post-repair manifest byte length: **`314806`**.

**Not touched:** the `Owner` clause and its own line-wrap (ending `...content-review split,\n    whose
narrowing history...archived material. `), which precedes this span and is not opened by this order, and
the sentence-final period after "owner", which is unchanged in both spans.

**Execution condition, when this order proceeds to execution (not now):** dry-run first, against a fresh
live re-read of the exact open substring immediately before the call; apply live only on an exact-one
match; read back afterward via targeted search for the replacement text.

---

## 5. Authorization identity — corrected mechanism

Learning directly from the completion order's documentation-location mistake, this order requires only:

1. This order is written and read back in full.
2. A hashing-capable seat returns its byte length and SHA-256.
3. The architect seat acknowledges that returned identity before executing §4.
4. This order is not edited again after that measurement is taken.
5. The eventual repair report records that externally returned identity and the architect's
   acknowledgment as provenance — wherever in the sequence the report happens to be written. **This order
   does not require the repair report to exist, or to carry that identity, before execution.** The
   sequencing requirement that caused the prior defect — that the report must already contain the
   identity at the moment of the edit — is not repeated here.
6. Codex independently remeasures this order (byte length and SHA-256) after execution. The step-2 and
   step-6 measurements must match exactly; inequality is a BLOCKER.

---

## 6. Post-repair Codex verification (not run by this order)

After this order is hash-locked (§5 steps 1–3) and the whitespace correction lands, Codex verifies, and
writes a **new** verification receipt — it does not alter or supersede
`FOUR-FINDING-REPAIR-VERIFICATION-2026-08-06.md`, which stands as the accurate record of the defect this
order corrects:

1. Live manifest byte length is exactly `314806`.
2. The three whitespace operations at §4 are the only new differences from the failed-verification
   state — i.e., a diff between the FAIL-state manifest and the corrected manifest shows nothing else.
3. Reversing exactly the four substantive final repairs (per completion-order §6's method, unchanged)
   from the corrected live manifest reproduces the exact pinned witness: `314491` bytes, SHA-256
   `9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a`.
4. The resulting reconstructed witness is byte-identical to Git blob `a2685a3518aa609902b151dec4e51bf353d66e2e`
   — a check this seat cannot itself perform and defers entirely to Codex.
5. `M4.38` / `P31#0` and all of M6 remain byte-identical to their pre-repair state.
6. The final `M4.4` `Owner` wording is unchanged from what completion-order §4 specified — this order
   touches only the adjacent `Execution` clause's whitespace, never the `Owner` clause's words.
7. Zero true `same reason` occurrences remain in live M4 (the same whole-phrase check the FAIL receipt
   already ran and passed at its check 8, reconfirmed here since a manifest edit intervened).
8. Branch, HEAD, `DECISIONS.md`, encoding, and terminal-cursor invariants are unchanged.
9. This order's own opening and closing identities (§5 steps 2 and 6) are equal.

---

## 7. Blockers

Execution of §4 stops and returns to the person on any of: this order's opening identity not returned and
acknowledged before the edit; a live re-read of the combined open substring at §4 that does not match
exactly; more than one match, or zero matches, for that substring anywhere in the manifest; any attempted
edit to `M4.3`, `M4.5`, `M4.35`, `M4.38`, any M6 byte, or the `Owner` clause's own wording; a post-edit
byte length other than `314806`; or an opening/closing identity mismatch on this order once both are
measured.

**Not yet done under this order:** the whitespace edit itself, any repair report, Codex verification, the
new verification receipt, the confirming read, and the resume-note update. All remain contingent on §5
steps 1–3 being completed. Per instruction, this order stops here: it is
not executed, and only its byte length is returned for hashing.
