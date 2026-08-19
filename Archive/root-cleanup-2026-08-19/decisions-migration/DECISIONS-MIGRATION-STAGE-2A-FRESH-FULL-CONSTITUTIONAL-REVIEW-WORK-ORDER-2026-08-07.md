# Stage 2a — fresh full constitutional review work order

**Date:** 2026-08-07 · **Authoring seat:** GPT architect · **Revision:** 1

**Class: commission-required non-author review; manifest closed.** This order commissions a fresh constitutional-content review of the current Stage 2a manifest after the four-finding repair sequence and its bounded follow-up corrections. It does not repair, ratify, assemble, stage, commit, or modify the manifest or `DECISIONS.md`.

The prior order `DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md` revision 1 and its tranche outputs remain historical records of the first full-review run. They are not execution authority for this run: that order hard-pins the pre-repair `314491`-byte manifest, treats `M4.4` as reserved, describes the run as the first review, and its tranche A–D limb accounting admitted review rationale as a carrier. No prior tranche clearance is inherited here.

---

## 1. Subject identity and repository pins

The review subject is the live file:

`audit/decisions-migration-2026-07-29/target-text-manifest.md`

Expected identity at review opening:

- byte length: **`314811`**
- SHA-256: **`e99335567d157a86f8f2b6f178b7222bf86ccfe15e5f827da5a03864c1d04b31`**
- branch: **`codex/decisions-migration`**
- HEAD: **`05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`**
- `MIGRATION_BASELINE`: **`d499cc1d0916e03830489ec9cd0324cd1a203a73`**
- live `DECISIONS.md`: **`76314` bytes / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`**, byte-identical to baseline
- owner-bound `MIGRATION_DATE`: **`2026-08-18`**

The manifest identity is re-measured before review begins and again after the final receipt is written. Any mismatch is a BLOCKER. The manifest is closed to every seat for the full duration of this review.

### 1.1 This order's authorization identity

This revision is not executable until a hashing-capable seat returns this file's byte length and SHA-256 and the architect acknowledges them. From that acknowledgment onward this order is immutable. The checking seat independently remeasures the same order after its last authorized receipt write; opening and closing identities must match exactly.

---

## 2. Seat and permitted writes

**Review seat:** Codex, or another non-author GPT/Codex checker seat. The producing Claude seat is barred from this review because it authored the manifest population. Producer≠checker attaches to the produced constitutional bytes, not to a model name.

The checker may write exactly six new review files listed at §7. It may not edit any existing review receipt, repair report, work order, resume note, manifest byte, `DECISIONS.md`, code file, Git index, ref, stash, or tracked/untracked input.

The first full-review outputs may be read only as historical defect provenance when useful; they are never evidence that a current record is clear and may not substitute for a fresh source-to-target read.

---

## 3. Review population

Population is unchanged from commission §4.9:

- **Tranche A:** 18 live records, `M4.2`–`M4.19`.
- **Tranche B:** 19 live records, `M4.20`–`M4.38`.
- **Tranche C:** 18 live records, `M4.39`–`M4.56`.
- **Tranche D:** 10 live records, `M4.57`–`M4.66`.
- **Tranche E:** 13 archive wrappers, `M5.5.1`–`M5.5.13`, plus their M5.6 index lines and the M5.7 retired register.
- **Tranche F:** structural and cross-cutting surfaces: M5.1–M5.4, all of M6, and the whole-manifest checks at §6 below.

That is **65 live records + 13 wrappers = 78 reviewed units**, plus the structural surfaces.

The authorities remain those named by the ratified commission and the 2026-08-06 full-review order §5.3: `git show MIGRATION_BASELINE:DECISIONS.md`, the live-source packet, the commission and Amendment 1, the ratified taxonomy/format/fixtures, and live repository files for claims about code. Architect Part A–D drafts and `.frozen` snapshots are not content authorities.

---

## 4. Operative-limb review method — replaces the first run's A–D method

For every live record and every wrapper source unit, enumerate **operative source limbs only** before comparing them with the target. Do not manufacture limbs from forcing-incident narrative, historical chronology, evidence detail, examples, implementation anecdotes, or explanatory prose that itself imposes no live obligation.

Every operative source limb receives exactly one of these dispositions:

1. **`RETAINED IN <record> TARGET STATEMENT`** — quote or precisely identify the target-statement clause that carries it.
2. **`CARRIED BY <named target entry>`** — name the other target entry and identify its carrying target-statement clause.
3. **`SUPERSEDED BY <named later source>`** — name the later source and the superseding act or rule.
4. **`DELETED — FINDING`** — the operative limb is absent from the target and from every legitimate carrier and has not been superseded.

These four are exhaustive. **Review rationale is never a carrier.** A limb appearing only in item 12 rationale, an omission explanation, a review note, or another non-target reasoning surface is not retained by that appearance.

A record verdict is `CLEAR`, `FINDING`, or `QUESTION`. `QUESTION` is used only when the authorities genuinely do not resolve the call; it is not a softer finding and it does not default to no change.

### 4.1 Population-resizing and exact-word checks

Apply standing rulings 7, 18, 25, 29, and 32. A migration may neither widen nor narrow a governed population without owner ratification. Conjunctions, predicates, exclusivity words, enumerated sets, and named identities are operative when they change the governed population or condition. The just-repaired E033 `only` is the canonical example: `draw from` was not equivalent to `draw only from`.

Where a source-listed set corresponds to live data owned by a tracked path, compare the source list with the live owner before deciding whether the source list itself should be retained.

### 4.2 `Evidence` and `Owner`

Apply the field-specific tests already ratified in target §1 and reflected in M6.1:

- `Owner` names the one tracked path that owns the whole live statement; a separately enforced operative limb in another tracked path defeats a candidate owner.
- `Evidence` names the one tracked source carrying evidence, measurement, provenance, or method the statement is forbidden to restate; partial evidentiary support is permitted, but the source may not contradict or materially misrepresent any retained limb.

For every present or omitted `Evidence`/`Owner`, compare the record's item 10 disposition with M6.3 and M6.1. Do not inherit a reason from another field.

**Discharged exception:** the `Owner` reasons at `M4.3 / P2#0`, `M4.7 / P5#0`, and `M4.11 / P8#0` have already received their required independent semantic read and are marked **`DISCHARGED — NOT RE-REVIEWED`** for the Owner-reason subcheck. The rest of each record remains in the ordinary review population.

### 4.3 `M4.4 / P2#1`

`M4.4` is **not reserved**. Its final `Owner` reason is live, self-contained, repaired, mechanically verified, and semantically confirmed. Review the record normally against E003. Do not repeat the historical reservation or treat its duration as evidence in either direction.

### 4.4 `M4.38 / P31#0`

The first review's claimed deletion finding is not inherited. Re-derive E074 fresh. In particular, test the record's explicit statement that the flag-only review role, never-compiler/never-mutation limbs, and P8/P18/P22 cross-references are superseded by the named 2026-07-18 lane retirement. If that supersession is supported, classify those limbs `SUPERSEDED BY ...`; do not call them deleted merely because they are absent from the target statement.

---

## 5. Per-record obligations

Each of the 78 unit entries in the tranche receipts contains:

1. record locator and permanent identifier or name-addressed title;
2. source entry ID(s) and source locator;
3. operative source-limb enumeration using only the four §4 dispositions;
4. target-statement semantic-preservation verdict;
5. field-by-field disposition check, including field-specific `Evidence`/`Owner` treatment;
6. effective-date check;
7. verdict `CLEAR`, `FINDING`, or `QUESTION`, with a concise ground;
8. enough verbatim live subject text to satisfy the contact test without reproducing long source passages.

A zero-finding tranche is permissible but does not reduce the per-record obligation.

---

## 6. Tranche F whole-manifest checks

Freshly perform and report these checks; do not import the first review's result as clearance:

- **F1:** exactly 65 entry-index rows, each matching its block heading/summary; declared total 65.
- **F2:** live composition exactly 37 `P` blocks across 25 distinct live P identifiers, 6 `R`, 19 `I`, 3 `T`.
- **F3:** P/R core-versus-attachment grouping and contiguous attachment ordinals.
- **F4:** name-addressed title uniqueness across live I/T titles and all 13 wrapper labels; no reserved P/R prefix shape; wrapper labels match §8 index labels.
- **F5:** every I:/T: citation matches the target matcher, is physically intact, and resolves.
- **F6:** every present `Evidence`/`Owner` path is tracked, with the single E038 Clause-A future-output exception checked against the pinned archive filename.
- **F7:** exact 80-row reconciliation: 65 live + 13 wrappers + E053 structural + E037 MERGE_INTO.
- **F8:** retired register exactly P9/P12/P18/P22 RETIRED and P13/P14 NEVER ASSIGNED, agreeing with the four ID-addressed wrappers.
- **F9:** no Stage 2b implementation/parser work has begun; `DECISIONS.md`, relevant Stage 2b paths, branch, and HEAD remain at the pinned state.

For tranche E, independently reproduce all 13 wrapper source slices and hashes from `MIGRATION_BASELINE` and verify archive/index/register correspondence as required by commission §4.9.

Sentence-count grammar, Task 2, Task 3, and the derived date-occurrence report remain separately owed and are not discharged here.

---

## 7. Authorized deliverables

Write exactly these six new files under `audit/decisions-migration-2026-07-29/`:

- `FRESH-FULL-REVIEW-TRANCHE-A-2026-08-07.md`
- `FRESH-FULL-REVIEW-TRANCHE-B-2026-08-07.md`
- `FRESH-FULL-REVIEW-TRANCHE-C-2026-08-07.md`
- `FRESH-FULL-REVIEW-TRANCHE-D-2026-08-07.md`
- `FRESH-FULL-REVIEW-TRANCHE-E-2026-08-07.md`
- `FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md`

Each file opens with:

- this work order's measured revision-1 byte length and SHA-256;
- the freshly measured manifest identity;
- branch and HEAD;
- the tranche population;
- confirmation that no prior full-review tranche was used as clearance.

The disposition file carries tranche F and exactly one overall result: **`ACCEPT`**, **`REVISE`**, or **`REFUSE`**.

---

## 8. Contact test and no-mutation rule

The checker must prove contact with the current `314811`-byte subject. A receipt that adjudicates records outside its tranche, quotes a subject that does not exist in the pinned manifest, or asserts a mutation absent from the pinned manifest is void for that tranche. Correct branch/HEAD metadata cannot salvage a failed contact test.

Quotation proves contact, not correctness. Substantive reasoning is still required.

No repair is authorized. Findings and questions are reported only. Any manifest edit, any modification of an existing artifact, any Git state change, or any write outside the six §7 receipts is a BLOCKER.

---

## 9. Closeout

After the sixth receipt is written, independently remeasure:

- this order's byte length and SHA-256 — must equal the acknowledged opening identity;
- the manifest — must remain exactly `314811` bytes / `e99335567d157a86f8f2b6f178b7222bf86ccfe15e5f827da5a03864c1d04b31`;
- branch, HEAD, and `DECISIONS.md` baseline identity.

Do not begin Task 2, Task 3, the derived date-occurrence report, Stage 2b, or owner ratification in the same verification turn. Return the six review artifacts for adjudication first.
