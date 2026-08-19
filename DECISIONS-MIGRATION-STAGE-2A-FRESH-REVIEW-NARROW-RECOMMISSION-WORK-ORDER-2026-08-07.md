# Stage 2a — fresh-review narrow recommission work order

**Date:** 2026-08-07 · **Authoring seat:** Claude architect · **Revision:** 2

**Class: commission-required non-repair recommission, scoped to four disputed operative-limb dispositions inside the fresh full constitutional review.** This order does not repair, ratify, assemble, stage, commit, or modify the manifest or `DECISIONS.md`. It does not edit any existing receipt. It does not reopen any of the 74 units cleared by `DECISIONS-MIGRATION-STAGE-2A-FRESH-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-07.md` outside the four named in §3.

---

## 0. Trigger and architect adjudication

Codex's six-file fresh full constitutional review (commissioned by the parent order above) returned overall disposition **ACCEPT** in `FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md`. An independent GPT audit of that package found three concrete defects and one weaker imprecision in the Tranche B and Tranche E receipts and recommended **REVISE**, proposing a narrow recommission over `M4.25`, `E050`, `E052`, and (while at it) `E076`.

The architect seat independently verified all four claims against `git show MIGRATION_BASELINE:DECISIONS.md` (read via the live `DECISIONS.md`, confirmed byte-identical to baseline at 76314 bytes) and the live receipts themselves. All four are **CONFIRMED**:

- **`M4.25` / `P23#0` (Tranche B).** The receipt's fourth operative limb reads: "implementation ownership is carried by the executable layout path — `CARRIED BY \`src/examLayout.ts\` as the named implementation path, without making it an Owner of the whole constitutional statement.`" The parent order §4 defines `CARRIED BY <named target entry>` as naming *another target entry* and identifying its carrying target-statement clause — a code path is not a target entry. The same receipt's `M4.21` entry uses the construction correctly (`CARRIED BY M4.47 TARGET STATEMENT`), which confirms both the intended grammar and `M4.25`'s deviation from it. Source principle 23 additionally states the split-allowlist/code detail is "Moved to code/status — verify there, not here," which weighs against promoting that detail into an operative constitutional limb at all, as opposed to leaving it uncaptured or captured differently.
- **`E050` / `M5.5.9` (Tranche E).** The receipt reads: "the waiver is `SUPERSEDED BY current review-routing and workflow requirements`." Baseline source (§8): "superseded by principle 25 (§4), on stronger grounds: the fishbone qualifies because it *preserves exact values* (a partial H/H fishbone is value-complete), not because clinicians are used to seeing one. Vendor ubiquity is explicitly not a qualifying criterion under principle 25." The receipt names neither Principle 25 nor the exact-value/value-completeness ground, and its "workflow requirements" phrasing echoes the vendor-familiarity/workflow-habituation ground the source explicitly excludes as non-qualifying.
- **`E052` / `M5.5.11` (Tranche E).** The receipt reads: "the operative current validation/workflow boundary is `SUPERSEDED BY M4.50 and current schema/format gates`." Baseline source (§8) names the replacement control as the `CLAUDE.md` instruction to distrust the connector first and confirm with a second method, plus a one-time non-connector `grep` of the final tree at commit time — and explicitly identifies the JSON-quote-hygiene analogy (which `M4.50` is) as the named reasoning error being corrected: "Do not re-open this by citing 'banks are gated but markdown isn't.'" The receipt cites exactly the excluded analogy as the superseding authority.
- **`E076` / `M5.5.13` (Tranche E, weaker).** The receipt reads: "its appendix pointers are `SUPERSEDED BY current operational/source paths`." The parent order §4 item 3 requires a *named* later source for `SUPERSEDED BY`; "current operational/source paths" names no source. Lower priority than the three above; included here because a recommission is already open.

No defect was found in the manifest's own live target-statement bytes for any of these four units, and no defect was found in the wrapper-body byte reproduction for `E050`/`E052`/`E076` (independently reconfirmed against baseline in the same receipt). **The defect is confined to the receipts' operative-limb disposition language, not to the closed manifest.**

**Disposition of Codex's `ACCEPT`:** not ratified as written. Recorded state: the fresh full constitutional review is not cleanly discharged for `M4.25`, `E050`, `E052`, and `E076`. The other 74 of 78 reviewed units' `CLEAR` verdicts, and all Tranche F / M5 / M6 / F1–F9 results, are unchallenged by this order and are not reopened.

---

## 1. Subject identity and repository pins

Unchanged from the parent order:

- Manifest: `audit/decisions-migration-2026-07-29/target-text-manifest.md`, **314811 bytes / SHA-256 `e99335567d157a86f8f2b6f178b7222bf86ccfe15e5f827da5a03864c1d04b31`**.
- Branch: `codex/decisions-migration`; HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`.
- Live `DECISIONS.md`: **76314 bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`**.
- Owner-bound `MIGRATION_DATE`: **2026-08-18**.

The checker seat freshly hashes the manifest and `DECISIONS.md` at this recommission's opening — the pins above are not inherited as clearance — and independently re-hashes both at closeout per §7. Any mismatch at either measurement is a BLOCKER.

Read-only historical references for this order (never edited by it):

- `FRESH-FULL-REVIEW-TRANCHE-B-2026-08-07.md` — 22788 bytes.
- `FRESH-FULL-REVIEW-TRANCHE-E-2026-08-07.md` — 15586 bytes.
- `FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md` — 7943 bytes.

The manifest remains closed to every seat for this recommission's duration, as it was under the parent order.

### 1.1 This order's authorization identity

This revision is not executable until a hashing-capable seat (Luke, via `shasum -a 256`) returns this file's byte length and SHA-256 and the architect acknowledges them. From that acknowledgment onward this order is immutable, on the same terms as the parent order's §1.1.

---

## 2. Seat and permitted writes

**Checker seat:** a non-author GPT/Codex checker seat. The Claude seat remains barred, unchanged from the parent order, because it authored the manifest population. Whichever seat executes this recommission necessarily does so with knowledge of §0's defect provenance — the four flagged units, the offending wording, and the architect's read of the expected corrected ground are stated in this order's own execution authority, so a literal blind pass is not achievable and is not required. What is required instead: a fresh source-to-target re-derivation against the baseline source and the live manifest for each of the four units, under §4's method. Knowledge of the defect provenance is permitted; neither the prior Tranche B/E receipts nor this order's §0 adjudication may be treated as clearance or substituted for that fresh baseline-source analysis — the checker's disposition for each unit must independently reach and cite the same baseline text it actually adjudicates, not adopt the architect's or GPT's characterization of it. A GPT checker seat may formalize the analysis in its own critique on these terms, since that analysis was not self-review (GPT did not author the receipts it is correcting) and is independently source-verified above.

The checker may write exactly one new file, named at §6. It may not edit `FRESH-FULL-REVIEW-TRANCHE-B-2026-08-07.md`, `FRESH-FULL-REVIEW-TRANCHE-E-2026-08-07.md`, `FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md`, any other existing review receipt, repair report, work order, resume note, manifest byte, `DECISIONS.md`, code file, Git index, ref, stash, or tracked/untracked input.

---

## 3. Review population

Exactly four units, all already-CLEAR-disposed by the fresh full constitutional review and reopened by this order alone:

- `M4.25` / `P23#0` (Tranche B).
- `E050` / `M5.5.9` (Tranche E).
- `E052` / `M5.5.11` (Tranche E).
- `E076` / `M5.5.13` (Tranche E).

---

## 4. Method

Same four-way operative-limb disposition grammar as the parent order §4 (`RETAINED IN <record> TARGET STATEMENT`, `CARRIED BY <named target entry>`, `SUPERSEDED BY <named later source>`, `DELETED — FINDING`; exhaustive; review rationale is never a carrier). For each of the four units:

- Re-derive operative limbs fresh against the baseline source. Do not inherit Codex's prior disposition as a starting point; the historical receipts and the GPT critique may be read only as defect provenance, per the parent order's §2 rule for first-review outputs.
- For `M4.25`: apply the four dispositions strictly. A code path may appear only as identifying detail inside a `RETAINED IN M4.25 TARGET STATEMENT` clause (or, if a genuinely separate target entry carries the limb, a proper `CARRIED BY`), never as the object of `CARRIED BY` itself. Weigh E022's "moved to code/status — verify there, not here" note in deciding whether the limb belongs in the operative population at all, or is better left uncaptured as implementation detail outside the constitutional statement's scope.
- For `E050` and `E052`: if a later source supersedes the archived operative limb, name it exactly as baseline §8 names it — Principle 25 on exact-value/value-completeness grounds for `E050`; the `CLAUDE.md` connector-distrust-and-confirm directive plus the one-time non-connector `grep` for `E052` — rather than substituting an analogized current control the baseline source itself warns against.
- For `E076`: name an exact later source per §4 item 3's grammar, or classify under one of the other three dispositions if no single named source applies.

---

## 5. Contact test and no-mutation rule

Same as the parent order §8: the checker must quote or precisely identify both the live manifest bytes and the baseline source bytes actually adjudicated for each of the four units. No repair is authorized here; findings are reported only. Any manifest edit, any modification of an existing artifact, any Git state change, or any write outside the one §6 deliverable is a BLOCKER.

---

## 6. Authorized deliverable

Write exactly one new file:

`audit/decisions-migration-2026-07-29/FRESH-REVIEW-NARROW-RECOMMISSION-SUPPLEMENTAL-DISPOSITION-2026-08-07.md`

It contains:

1. this order's measured revision-2 byte length and SHA-256, and the freshly measured manifest/`DECISIONS.md` identity, branch, and HEAD;
2. the four corrected unit adjudications under §4's method, each with the contact-test quotations required by §5;
3. an explicit statement of whether each correction changes that unit's verdict from `CLEAR`, and if so to what;
4. exactly one corrected composite disposition for the four-unit population, using the parent order's vocabulary: `ACCEPT`, `REVISE`, or `REFUSE`. `ACCEPT` states that all four units are freshly `CLEAR` under corrected operative-limb dispositions and that this corrected composite result supersedes the original receipt language on these four units only. `REVISE` states which unit(s) remain unresolved against the baseline source and what further correction they need. `REFUSE` states why the population cannot be adjudicated as commissioned;
5. an explicit statement that `FRESH-FULL-REVIEW-TRANCHE-B-2026-08-07.md`, `FRESH-FULL-REVIEW-TRANCHE-E-2026-08-07.md`, and `FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md` are superseded on these four units only by this supplemental record, and stand as originally written everywhere else. It may not edit those three files to say so.

---

## 7. Closeout

After the deliverable is written, independently remeasure and re-hash:

- this order's own byte length and SHA-256 — must equal the acknowledged revision-2 opening identity recorded at §1.1;
- the manifest — must remain exactly `314811` bytes / SHA-256 `e99335567d157a86f8f2b6f178b7222bf86ccfe15e5f827da5a03864c1d04b31`;
- `DECISIONS.md` — must remain exactly `76314` bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`;
- branch `codex/decisions-migration` and HEAD `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`, unchanged.

Any mismatch is a BLOCKER. Do not begin Task 2, Task 3, the derived date-occurrence report, Stage 2b, or owner ratification in the same turn. Return the supplemental disposition for adjudication first.
