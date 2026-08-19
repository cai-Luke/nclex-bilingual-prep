# Stage 2a — bounded four-finding repair work order, and next-review commission handoff

**Date:** 2026-08-06 · **Authoring seat:** Architect · **Revision:** 1

**Class: review-return repair, routed.** This order adjudicates the 2026-08-06 full constitutional
review return (`FULL-REVIEW-DISPOSITION-2026-08-06.md` and tranches A–E) as narrowed by the GPT
adjudication of the same date. It authorizes repair of **exactly four** manifest findings and commissions
Codex verification and a confirming read. It does **not** authorize Stage 2b, does not touch `M4.38` /
`P31#0`, and does not itself constitute the fresh full constitutional review GPT's adjudication requires
next — that review is commissioned separately, at §8, and is not executed by this order.

**Origin and adjudication accepted in full.** The 2026-08-06 Codex review (`FULL-REVIEW-TRANCHE-A`
through `-E` and `FULL-REVIEW-DISPOSITION`, all 2026-08-06) returned a five-item finding inventory under
disposition `REVISE`. GPT's adjudication of that return accepted four findings, rejected one, and found a
cross-cutting classification defect in tranches A–D. This seat re-derived each of GPT's six specific
claims independently against the live tranche and manifest bytes before accepting them:

1. **`M4.3` / `P2#0` — accepted.** Tranche A's verdict, quoted: *"E002's condition that deterministic
   checks must not merely confirm the author's intent is absent from the live subject."* Confirmed against
   the live `M4.3` item 8 statement, which omits that condition, and against source `E002`'s L4, which
   states it.
2. **`M4.4` / `P2#1` — accepted.** Tranche A's verdict, quoted: *"the reserved M4.4 item-10 Owner note
   uses 'same reason' to inherit the ARCHIVE-ONLY Evidence ground, but Owner is governed independently by
   M6.1/M6.3 and the whole-statement ownership test."* Confirmed: the live item 10 `Owner` disposition
   reads `` `OMIT`; same reason `` and M6.3 row 5 assigns `Owner` the ground `ARCHIVE-ONLY`, a both-field
   ground under M6.1 — legitimate as a ground, but the anaphor states no Owner-specific basis, which is
   the defect ruling 35 already governs.
3. **`M4.5` / `P3#0` — accepted.** Tranche A's verdict, quoted: *"E004's explicit prohibition that the
   offline semantic handoff must not modify Layer A is absent from the live subject."* Confirmed against
   the live item 8 statement and source `E004`'s L5.
4. **`M4.35` / `P28#0` — accepted.** Tranche B's verdict, quoted: *"E033 expressly binds generation
   prompt parameters to the scored-leaf population. M4.35 names content-planning reports but omits that
   separate prompt-parameter limb."* Confirmed against the live item 8 statement and source `E033`'s L5.
5. **`M4.38` / `P31#0` — rejection accepted; no repair authorized.** The live item 12 rationale, read in
   full, already states: *"the flag-only review role, the never-compiler and never-mutation limbs, and
   the cross-references to the retiring P8, P18, and P22 are dropped as superseded by the 2026-07-18 lane
   retirement."* `M5.5.2` independently confirms a named later source for that retirement: wrapper `E036`,
   titled *"Forward case-generation lane lapse note (2026-07-18)"*, dated `2026-07-18`. Under the full-
   review work order §5.4 item 1 (ruling 18), a limb accounted for as superseded by a named later source is
   not a deletion defect. Tranche B's `FINDING` verdict on this record misapplied ruling 18 by treating an
   already-documented supersession as a silent omission. **This order does not open `M4.38` in any way.**
6. **Tranches A–D's limb-disposition classification — defect confirmed, no repair authorized under this
   order.** Every enumerated source limb in every record read in tranches A and B (and, by the same
   template, presumably C and D) carries the identical disposition string *"carried (retained or
   compressed in target/rationale)."* That string is not one of the four dispositions the full-review work
   order §5.4 item 1 requires — retained in the target statement, carried by a named target entry,
   superseded by a named later source, or deleted — and it does not distinguish a limb actually present in
   the target statement from one merely described in item-12 rationale prose, which GPT correctly notes is
   not itself a carrier of governed constitutional text. This is a defect in the **review's own method**,
   not in the manifest, and it is repaired by re-commissioning the review under corrected instructions
   (§8), not by editing manifest bytes.

**Also accepted:** Codex's re-adjudication of the `Owner` field at `M4.3`, `M4.7`, and `M4.11` in tranche A
exceeded the full-review work order §5.10, which bars re-review of those three discharged reasons. Those
three `Field-by-field disposition` subsections in tranche A are unauthorized surplus. They are not cited
as clearance for anything here, and this order does not rely on them.

---

## 1. Identity, pinned

| item | value |
|---|---|
| Repository | `Project Shrimp`, local worktree |
| Branch | `codex/decisions-migration` |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` (confirmed via `repository_status`, no staged/modified files, only pre-existing untracked Stage 2a paths) |
| `DECISIONS.md` | `76314` bytes, byte-identical to `MIGRATION_BASELINE`; not touched by this order |
| `target-text-manifest.md`, pre-repair | `314491` bytes; SHA-256 `9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a`, as pinned by the full-review work order and every 2026-08-06 review deliverable, and consistent with this seat's own directory-size read (`307.12 KB`) at session start |

**This seat has no hashing primitive.** The SHA-256 above is transcribed from six independently-authored
2026-08-06 files that agree on it byte-for-byte (the work order, the disposition, and tranches A–D), not
computed here. Codex re-measures both the opening and closing manifest identity at verification per §6;
this order's own repair claims do not depend on the closing hash being anything other than a fresh
measurement.

**This order opens exactly four manifest substrings and no other manifest byte.** `DECISIONS.md`, all of
M0–M3, M5–M7, and every M4 record other than the four named below (including `M4.38` explicitly) are
closed. A change to any closed byte is a BLOCKER.

---

## 2. Scope — the four repairs

### 2.1 `M4.3` / `P2#0` — item 8 statement

**Open substring:** the item 8 statement bytes, live text below, read from the manifest immediately before
edit.

**Defect:** omits E002's condition that a self-certifying deterministic check must not merely confirm the
author's intent.

**Repair:** insert the missing condition into the existing sentence, changing no other word.

- Before: `...deterministic checks that have an independent null. Every active generation lane...`
- After: `...deterministic checks that have an independent null and do not merely confirm the author's
  intent. Every active generation lane...`

**Not touched:** the item 12 rationale, which remains a compressed summary and is not amended to recite
this clause. This is consistent with every other record's rationale, which does not recite every retained
limb; the rationale under-describing a retained clause is not itself a defect this order's commission
reaches, and no other rationale in this file is held to a higher standard.

### 2.2 `M4.4` / `P2#1` — item 10 `Owner` disposition

**Open substring:** the `` `Owner` — `OMIT`; same reason. `` clause only, inside item 10.

**Defect:** the `Owner` disposition states no ground of its own; it inherits the `Evidence` clause by
anaphor, which ruling 35 forbids where the referring field has its own eligibility test.

**Derivation.** M6.3 row 5 assigns `Owner` the ground `ARCHIVE-ONLY`, unchanged and not reopened by this
order. M6.1 defines it, both fields: *"The substance lives only in material that is no tracked repository
path — archived narrative, pre-compression governance text, or a dated work artifact."* Applied to
`Owner`'s own whole-statement-ownership test rather than copied from `Evidence`'s: the material that would
let a reader name a single tracked path as owning the spec-conformance/content-review split — the
narrowing history and its forcing incident — survives only in archived material, so no live tracked path
carries the basis for a single-owner claim. This is derived from the record's own item 8 and item 12 text
plus the M6.1 definition, states no M6.1 ground token verbatim, and does not refer to the `Evidence`
clause or to any other record.

**Repair:**

- Before: `` `Owner` — `OMIT`; same reason. ``
- After: `` `Owner` — `OMIT`; the material that would establish a single tracked owner for the
  spec-conformance/content-review split — the narrowing history and its forcing incident — survives only
  in archived material, and no live tracked path carries it. ``

**Not touched:** the `Evidence` clause immediately before it, and the `Execution` clause immediately
after it, both of which remain byte-identical.

### 2.3 `M4.5` / `P3#0` — item 8 statement

**Open substring:** the item 8 statement bytes.

**Defect:** omits E004's explicit prohibition that the offline semantic handoff must not modify Layer A.

**Repair:** extend the closing sentence to carry the non-mutation condition.

- Before: `...No API key or live model call belongs in the repository; semantic findings enter through an
  offline validated handoff.`
- After: `...No API key or live model call belongs in the repository; semantic findings enter through an
  offline validated handoff that merges them without modifying Layer A.`

**Not touched:** item 12 rationale, on the same ground as §2.1.

### 2.4 `M4.35` / `P28#0` — item 8 statement

**Open substring:** the item 8 statement bytes.

**Defect:** omits E033's express binding of generation prompt parameters to the scored-leaf population;
the live statement names content-planning reports but not the separate prompt-parameter limb.

**Repair:** add one sentence carrying the omitted limb, placed immediately after the sentence it
qualifies and before the delivery/inventory sentence, changing no other word.

- Before: `...and parent-case metadata never standing as evidence about a leaf. Delivery and inventory
  reports measure what can be served...`
- After: `...and parent-case metadata never standing as evidence about a leaf. Generation prompt
  parameters draw from this same scored-leaf population. Delivery and inventory reports measure what can
  be served...`

**Not touched:** item 12 rationale, on the same ground as §2.1.

---

## 3. What this order does not authorize

- No edit to `M4.38` / `P31#0`, in any byte, for any reason. GPT's rejection is accepted in full at §0
  item 5.
- No edit to the `Owner`/`Evidence` reasoning at `M4.3`, `M4.7`, or `M4.11` beyond what §2.1 opens (which
  is the item 8 statement, not the M6-adjacent Owner/Evidence clauses at those three records — those
  remain discharged under the 2026-08-05 repair and are not reopened here).
- No change to any M6 byte: not the ground vocabulary, not the 110-row register, not the derived counts.
  `ARCHIVE-ONLY` remains M6.3 row 5's assigned ground for `M4.4`'s `Owner`; this order's §2.2 repair states
  that ground's substance in Owner-specific prose and does not reclassify it.
- No new standing ruling. GPT's adjudication states none is necessary, and this seat agrees: ruling 18
  (limb enumeration) and the full-review work order §5.4 already govern both the carrier distinction and
  the `M4.38` error; ruling 35 already governs the `M4.4` anaphor defect.
- No resolution of the tranche A–D classification defect noted at §0 item 6. That defect is repaired by
  re-commissioning the review (§8), not by an edit here.
- No advance to Stage 2b, ratification, or the derived date-occurrence report.

---

## 4. Execution

Edits are applied by the architect seat directly to `target-text-manifest.md`, each preceded by a `dryRun`
against a live re-read of the exact substring, matching the pattern established at the 2026-08-05 `Owner`
anaphora repair. Each edit is verified read-back after the live call; a returned diff is not treated as
proof until the substring is independently re-read.

---

## 5. Repair report

The architect seat writes exactly one new file:
`audit/decisions-migration-2026-07-29/FOUR-FINDING-REPAIR-REPORT-2026-08-06.md`, carrying: the four
before/after substrings verbatim; confirmation that no other manifest byte changed (a repository-relative
diff of touched line ranges only); and the post-edit manifest byte length as measured by this seat (this
seat can count bytes of the substrings it inserts and can obtain a live byte-length read of the file, but
cannot produce a SHA-256; that digest is Codex's at §6).

---

## 6. Codex verification commission

One deliverable: `audit/decisions-migration-2026-07-29/FOUR-FINDING-REPAIR-VERIFICATION-2026-08-06.md`.
No repair, no staging, no commit, no push, no stash, reset, clean, or checkout.

| # | proof | disposition |
|---:|---|---|
| V1 | exactly four substrings changed in the manifest, and they are the four named at §2, each reported with its before/after bytes | PASS / FAIL |
| V2 | every other manifest byte is unchanged — reported as a whole-file digest comparison against the §1 pre-repair identity, not merely a claim | PASS / FAIL |
| V3 | `M4.38` / `P31#0` is byte-identical to its pre-repair state | PASS / FAIL |
| V4 | all of M6 is byte-identical, reported as a whole-section digest | PASS / FAIL |
| V5 | manifest strict UTF-8, `U+FFFD` 0, CRLF 0, bare CR 0, final LF present, exactly one `@@ASSEMBLY_CURSOR@@` and terminal, plus measured byte length, physical line count, and SHA-256 | PASS / FAIL |
| V6 | `DECISIONS.md` byte-identical to `MIGRATION_BASELINE`; branch and HEAD unchanged; `git status --porcelain` shows untracked Stage 2a paths only | PASS / FAIL |
| V7 | zero occurrences of `same reason` remain anywhere in the manifest's M4 records | PASS / FAIL |

## 7. Confirming read

After V1–V7 clear. Routes to GPT or Codex, whichever did not author this repair's derivation review —
producer≠checker: this seat (Claude) authored the repair, so review routes away from Claude, consistent
with standing routing. Scope: that each of the four replacement substrings is self-contained, carries the
identified missing limb and no other change in substance, and (for `M4.4`) is consistent with M6.3 row 5's
unchanged `ARCHIVE-ONLY` ground rather than asserting a different one.

---

## 8. Next commission — fresh full constitutional review (not executed by this order)

Per GPT's adjudication, after §7 clears, a fresh full constitutional review is commissioned against the
replacement manifest identity. This order records its required shape so the commissioning seat does not
have to re-derive it; it does not issue the commission itself, since the replacement identity does not
exist until §6 completes.

The new review must:

1. enumerate only operative source limbs per record, stating an explicit ground for excluding headings,
   status labels, forcing incidents, implementation history, and other non-operative material, rather than
   enumerating everything a source paragraph contains;
2. classify every operative limb in exactly one of four forms, each with the required detail:
   - `RETAINED IN <record> TARGET STATEMENT` — quoting the carrying clause;
   - `CARRIED BY <named target entry>` — quoting the carrying clause;
   - `SUPERSEDED BY <named later source>` — stating the superseding act;
   - `DELETED — FINDING`;
3. never treat item-12 review rationale as a carrier of target substance — rationale explains a
   compression, it does not itself supply the missing bytes;
4. mark the `Owner` reasons at `M4.3`, `M4.7`, and `M4.11` as `DISCHARGED — NOT RE-REVIEWED`, not
   re-adjudicate them;
5. review the complete 65-record, 13-wrapper population without treating this repair's four corrected
   records, or any prior tranche's clear calls, as prior evidence — each is re-derived cold.

This order takes no position on which seat the next review routes to; that is an owner or architect-seat
routing decision made when §7 clears.

---

## 9. Blockers

Execution stops and returns to the architect seat on any of: any edit outside the four §2 substrings; any
change to `M4.38`; any change to M6; a `dryRun` whose diff touches bytes outside the four opened
substrings; or a live re-read that does not match the "before" text quoted at §2 for any of the four
records.
