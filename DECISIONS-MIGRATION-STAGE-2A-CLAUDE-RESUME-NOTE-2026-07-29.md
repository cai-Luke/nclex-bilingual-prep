# Stage 2a Claude resume note

**Updated:** 2026-08-11 · **Seat:** Architect

## Current resume state — 2026-08-11 (Phase 4 ACCEPTED and closed; Phase 5 hash-frozen, awaiting Codex handoff)

**This section supersedes every section below it as to Stage 2a and Stage 2b Phases 1–4, including the 2026-08-08 Phase-4-issued section immediately following, which is retained only as chronology. It does NOT govern Stage 2b Phase 5 or later: the trailing `## Stage 2b current state` section at the end of this note is the operative record for those, and this section's Phase 5 status wording is stale.**

**Stage 2b Phases 1–4 are all closed on architect `ACCEPT`.** No change to any Phase 1–3 disposition.

**Stage 2b Phase 4 closed `ACCEPT` on 2026-08-11.** Record: `DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CLOSEOUT-2026-08-08.md` — note the filename carries `2026-08-08` (matching its sibling phase closeouts and the instrument date) while the document itself is dated 2026-08-11, its actual adjudication date; cite it by path, and do not read the filename as the adjudication date. Codex's receipt returned `PASS` and was adjudicated cold: whole-file digest reproduced independently in this seat's own sandbox, the live `checkDecisionsFormat` re-run directly with the order's exact call shape and `trackedPaths` omitted (`ok: true`, `issues: []`, 65/65/65/13/13/6), and raw line-indexed join checks at the highest-risk boundaries — including the entry-index→declared-total join that caused Phase 1's own `MISSING_DECLARED_TOTAL` stop, confirmed here at exactly one blank line. GPT's prior independent review was noted but not counted as the §9 null.

**Target `DECISIONS.md` is now live in the working tree at `56964` bytes / SHA-256 `3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8`.** The pre-migration `76314`/`b22b3fff…` identity is now **historical**: it survives as `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` and as the `MIGRATION_BASELINE` git object, and must not be cited as the current `DECISIONS.md` identity anywhere downstream. Modified tracked paths are now three: `DECISIONS.md`, `lib/decisions-format.ts`, `scripts/tests/decisions-format.ts`.

**Stage 2b Phase 5 (commission §5.7, target reconciliation checker) is drafted, GPT-reviewed, repaired to revision 2, and HASH-FROZEN.** `DECISIONS-MIGRATION-STAGE-2B-PHASE-5-RECONCILIATION-CHECKER-WORK-ORDER-2026-08-11.md`, **revision 2, authorized at `33073` bytes / SHA-256 `75cc6db647afd6f8e6e0950ac885ba5c7b225489bb73b03236d81f3eca66ceac`**, owner-measured by Luke 2026-08-11 and independently reproduced by this seat against a fresh copy of live disk before the owner's reported hash was treated as authoritative; both measurements agree exactly, and the file's modification timestamp was unchanged since this seat's write, confirming no intervening modification. **The file is now immutable — it is not edited again.** **Revision 1's `24134`-byte identity is superseded and must not be cited.** The label was advanced rather than reused because revision 1's byte state had already been externally recorded in this note, and one label must map to exactly one byte state. Cold reconnaissance already performed and pinned in its §3: `scripts/decisions-migration-target-reconcile.ts` does not exist; the frozen phase-1 checker `scripts/decisions-migration-reconcile.ts` is `20631` bytes and unmodified; `package.json` is `8443` bytes and carries `reconcile:decisions-migration` with no target variant; the three frozen phase-1 artifacts measure `28554`/`16833`/`9878` bytes; ratified Amendment 4 is `22665` bytes.

**GPT's cold review of revision 1 returned `REVISE` — authority architecture ACCEPT, seven defects, all independently confirmed by this seat against live disk before repair and all repaired in revision 2.** Recorded because several are reusable lessons, not one-off typos:

1. **Reports 7–8 had been weakened to an identity-only bijection.** Commission §5.7's own closing sentence says the manifest supplies exact record identity **and text**; an identity-only check would accept a block with the right ID but altered statement or field bytes. Revision 2 compares each of the 65 blocks component-by-component over its manifest-owned bytes (M4 items 7, 8, 9, and 11), with joins still excluded as Amendment 3's. **Block-scoping is not text-weakening** — keep both halves of that distinction together in any later instrument.
2. **Ratified Amendment 4 was named as an input but never wired in.** §5.7 lists "ratified Amendment 4's E053 correction"; the instrument is `DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md` §6. Revision 1 hard-coded only its arithmetic consequence. Revision 2 adds it to the governing-document chain and §3, and requires the checker to reconcile E053 against the ratified correction (14 historical archive rows → 13 wrappers + 13 index lines + 1 structural row) rather than merely count to 13.
3. **The wrapper span check would have been byte-incorrect in Node.** The manifest's M5.5 spans are zero-based half-open **byte** offsets and the baseline carries multi-byte UTF-8; JavaScript string indices are UTF-16 code units. Revision 2 requires raw `Buffer` reads and `Buffer.subarray` at those offsets. It also now compares each slice to **the corresponding wrapper's own body** rather than searching the archive, since a whole-archive substring search would pass two swapped wrapper bodies.
4. **Negative control 4 was non-deterministic.** Mutating an arbitrary Amendment 2 surface can hit a parser-required literal, breaking parsing and legitimately failing the manifest reports too — destroying the independence the control exists to prove. Revision 2 pins it to a parser-neutral byte in §§4–7 transition prose.
5. **The scratch-input mechanism was unspecified**, leaving Codex to invent how Step 5 could run at all. Revision 2 requires an explicit test-only input-override interface while keeping the zero-argument npm command bound to canonical repository paths.
6. **§8 repeated the "report before the first repository write" contradiction** — the same class already repaired once in Phase 4 revision 2. Creating the report *is* a write; revision 2 orders it first instead.
7. **Step 6's closing accounting was wrong.** With staging forbidden, the new checker and the report are **untracked**, not new tracked paths, and the report was missing from the population entirely. Revision 2 asserts four modified tracked paths plus exactly two new untracked Phase-5 outputs.

Also repaired: revision 1's Amendment 3 scope line cited "the format conformance command" as join coverage, but Phase 5 never runs it and §5.8 has not wired it. Revision 2 names only evidence that exists — Phase 4's 272-entry join ledger, its independent reconstruction, and its actual `checkDecisionsFormat` runs.

**Standing ruling — the expanded authority chain, recorded because commission §5.7 was deliberately left unamended.** Amendments 2 and 3 each declined to rewrite §5.7, §7.1, §8, and §12, because those governed phases not yet live (Amendment 2 §0/§3, Amendment 3 §3, Amendment 3 ratification item 6). Amendment 2 §4.6's ratified **forward note** instead instructs that the Phase 5 order and the final §7.1/§8 verification each read "the ratified manifest" as the manifest **plus** Amendment 2 (and, by Amendment 3 §4.2's population-scoped supersession, plus Amendment 3) wherever it governs target `DECISIONS.md` content. **No fourth commission amendment is required for Phase 5**, and the Phase 5 order records why at its §1.1: §5.7's own obligations are block-scoped, every *block* is manifest-pinned, and neither amendment pins a block — so §5.7 is satisfiable exactly as written. The live risk is the misreading, not a gap: an implementer reading "no target block absent from the manifest" as "no target *byte*" would flag Amendment 2's eight surfaces and Amendment 3's join bytes and fail the target it is meant to certify. The order closes that at Step 2 by scoping reports 7–8 to blocks, requiring positive byte-for-byte verification of Amendment 2's eight surfaces as a separately-attributed line item, and requiring an explicit scope line naming Amendment 3 as the joins' authority with Phase 4's closed receipt as their coverage. **§7.1 item 11's byte-scoped manifest/output equality check still needs this same combined reading when final verification is drafted** — it is not pre-written and not discharged.

**Next architect action:** write the Codex handoff (`DECISIONS-MIGRATION-STAGE-2B-PHASE-5-CODEX-HANDOFF-2026-08-11.md`), pinning the authorized identity above, following the Phase 4 handoff's structure, and issue. GPT's review of revision 1 is discharged — all seven findings repaired, and Luke confirmed the repairs landed cleanly. On Codex's return, adjudicate the receipt cold per the order's §9, which requires re-running both reconciliation commands and independently exercising at least one negative control of this seat's own choosing (control 2, the identity-preserving text mutation, preferred — it is the one that distinguishes a real text check from an identity-only bijection). Phase 6 (§5.8, conformance wiring) is not commissioned until Phase 5 closes `ACCEPT`.

**Standing note on the Phase 4 closeout filename — owner-decided, do not revisit.** `DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CLOSEOUT-2026-08-08.md` keeps its filename despite its 2026-08-11 internal date. Luke decided against renaming: the path is already cited by the Phase 5 order and by this note, the internal date is unambiguous, and a rename would buy nothing while creating another path mutation to explain.

**Tooling note.** Both connectors are available this session: MCP/fsmcp for Desktop-scope read/write/edit and true byte counts (`get_file_info`), and the bash sandbox, which this seat used to reproduce SHA-256 independently and to execute the live `checkDecisionsFormat` directly. Do not assume either state persists into the next session — check both at session start.

**Owner standing authorization of 2026-08-08 remains in force** (pacing delegated, judgment not; see the paragraph in the Phase-1 historical section below).

## Historical Stage 2b Phase 4 pre-adjudication resume state — superseded 2026-08-11

**This section is the operative resume state and supersedes any conflicting phase-status wording later in this note.**

**Stage 2b Phases 1–3 remain closed exactly as previously recorded.** No change to any disposition.

**Commission Amendments 2 and 3 are both RATIFIED.** Amendment 2: Revision 3, `24202` bytes / SHA-256 `4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4`. Amendment 3: Revision 4, `26963` bytes / SHA-256 `9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e`. Both ratified by Luke 2026-08-08, each recorded in its own separate ratification record rather than a banner edited into the amendment itself. Manifest, Amendment 2, and Amendment 3 together form complete, disjoint-population construction authority for Stage 2b Phase 4.

**Stage 2b Phase 4 is hash-frozen and issued to Codex.** `DECISIONS-MIGRATION-STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-WORK-ORDER-2026-08-08.md`, revision 5, frozen at **`24996` bytes / SHA-256 `1ec65ca94d91ea86202eddebd74a7843b1187b20c2435d4e887c220e8abcaa1a`** — independently reproduced by this seat against a fresh copy of live disk before treating the owner's reported hash as authoritative, using the Filesystem sandbox bridge (back this session after a multi-turn outage). Handoff: `DECISIONS-MIGRATION-STAGE-2B-PHASE-4-CODEX-HANDOFF-2026-08-08.md`.

**Next architect action:** read `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-REPORT-2026-08-08.md` cold when Codex returns it, independently re-verify against live disk — including re-running `checkDecisionsFormat` against the file now on `DECISIONS.md`, not trusting the receipt's own run — and adjudicate. Phase 5 (commission §5.7, reconciliation checkers) is not commissioned until Phase 4 closes `ACCEPT`.

**Tooling note.** The Filesystem connector (sandbox bridge for independent SHA-256) is available again this turn. `MCP:read_text_file` reflows paragraph text for display — actual files retain original hard line-wrap positions; use `MCP:search_repository_files` to get raw unreflowed lines before constructing `oldText` for multi-line spans on any file with non-trivial wrapping. Check both connectors' current availability at the start of a session rather than assuming either state persists from a prior turn.

**Tooling note.** The Filesystem connector (bash-sandbox bridge for independent SHA-256) remains unavailable; only MCP/fsmcp is mounted. One pre-existing local manifest copy in this seat's own sandbox, made before the bridge dropped, was reconfirmed byte-identical to the ratified manifest identity before each use this session (both this turn and the prior one) — legitimate reuse of verified state, not stale data.

**Tooling note.** The Filesystem connector (bash-sandbox bridge for independent SHA-256) remains unavailable this session; only MCP/fsmcp is mounted. One earlier local copy of the manifest, made before the bridge dropped, is still present in this seat's own sandbox and was reconfirmed byte-identical to the ratified manifest identity before being used to verify M5.7's content directly — a legitimate use of pre-existing sandbox state, not a stale-data risk, since its hash was rechecked first.

**Commission Amendment 3 is drafted, pending review and ratification** — `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-ASSEMBLY-JOINS-2026-08-08.md`, `10778` bytes (architect byte-count measurement; no SHA-256 yet — see the tooling note below). Pins a default one-blank-line rule plus three verified exceptions (zero blank lines within table/list/register blocks; exactly one, not zero or two, before the declared-total line; one within each body block's heading→statement→field-list). Carries no fragment content, only join bytes. Does not edit the manifest or Amendment 2.

**Stage 2b Phase 4 is revised to Revision 2 and remains unauthorized — not yet hash-frozen, blocked on Amendment 3's ratification.** `DECISIONS-MIGRATION-STAGE-2B-PHASE-4-TARGET-CONSTRUCTION-WORK-ORDER-2026-08-08.md`, now `19226` bytes. Revision 2 also replaces the hand-reimplemented Steps 3–4 structural checks with a single call to the live `checkDecisionsFormat` conformance function (GPT's second finding — the reimplementation risked diverging from the real parser), and repairs a self-contradictory sentence at §8 ("write the report before the first write"). Constructs `DECISIONS.md` from three co-equal authorities: the manifest, Amendment 2, and (once ratified) Amendment 3.

**Next: GPT reviews Amendment 3 narrowly (its join rules only, not the manifest or Amendment 2), Luke ratifies, then Phase 4 revision 2 is hash-frozen and issued to Codex.** Phase 5 (§5.7) is not commissioned until Phase 4 closes `ACCEPT`.

**Tooling note.** The Filesystem connector (bash-sandbox bridge for independent SHA-256) remains unavailable this session; only MCP/fsmcp is mounted, giving read/write/edit and true byte-count measurement (`get_file_info`) but no hash primitive. Byte counts above are independently confirmed this way; SHA-256s for Amendment 3 and Phase 4 revision 2 await either the bridge's return or owner shell measurement.

**Tooling note, capability not judgment.** The Filesystem connector (which bridged live disk to this seat's own bash sandbox for independent SHA-256 measurement) dropped mid-session and has not returned; only the MCP/fsmcp connector remains, which reads/writes/edits the Desktop scope directly but carries no hashing primitive of its own. This seat could still independently confirm byte lengths (via `get_file_info`, a true byte count) and unchanged-file states (via modification timestamps) for both Amendment 2 and this order, but could not independently reproduce either SHA-256 this session. Not a lasting limitation — check whether the bridge is back before assuming it's still gone.

**Owner standing authorization of 2026-08-08 remains in force.**

## Historical Stage 2b Phase 1 pre-closeout resume state — superseded 2026-08-08

**This section is the operative resume state and supersedes any conflicting immediate-next-action, manifest-identity, or gate-status wording retained later in this note as chronology.**

**Stage 2a is closed. The manifest is ratified, not merely completed.** Luke (owner) ratified the complete exact bytes of `audit/decisions-migration-2026-07-29/target-text-manifest.md` — `332579` bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` — on 2026-08-08. Full record: `DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md`. The identity is unchanged from the completed-manifest identity set by step 5 and closed by step 6; ratification did not require a new render, because nothing moved between `M7.5`'s closeout and this act. **This is now the ratified authority for every byte Stage 2b writes into target `DECISIONS.md` and the normalized migration archive — do not treat it as a candidate.**

**The formal ratification gate is satisfied in full, all five items:**

1. M4/M5/M6 complete.
2. `M7.5`'s six-step derived date-occurrence report chain — closed `ACCEPT` 2026-08-07.
3. Codex's post-assembly deterministic verification — `POST-ASSEMBLY-DETERMINISTIC-VERIFICATION-2026-08-07.md`, `ACCEPT`. Independently re-confirmed by this seat against live disk — manifest identity, `DECISIONS.md`-baseline identity, whole-file mechanics, branch, and working-tree state all re-measured directly, not read back from the receipt's own numbers — before this seat recorded the ratification. `H1`–`H9` reconfirmed against live repository state; the two scoped exclusions (`Tranche E`'s source-slice reproduction, `Tranche F` §F7's 80-row reconciliation) were checked cold against those tranche receipts before revision 4 of the order was written, not assumed from GPT's review.
4. The non-author full constitutional-content review — the fresh 78-unit review, `ACCEPT`, its four defective receipt adjudications corrected under the narrow recommission, closed `ACCEPT`.
5. Owner exact-byte ratification — `DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md`, this act.

**Stage 2b Phase 1 is authored, non-author reviewed, externally hash-authorized, and issued to Codex.** Commission §5.3, the parser consequence of ratified Amendment 4: remove the single name-addressed `Original Kind: P/R` rejection guard in `lib/decisions-format.ts`, implement the `F14`–`F16`/`M20`–`M23` fixtures from the ratified fixture document, and verify the before/after fixture-suite transition in the strict order the commission requires — fixtures first against the unmodified parser, then the excision, then the rerun.

**Authorized instrument:** `DECISIONS-MIGRATION-STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-WORK-ORDER-2026-08-08.md`, **revision 3, `18112` bytes / SHA-256 `e870e05304481120ad610a0d9da3f4e677b68356d111cbd8c93fadda7fb88095`**, owner-measured and independently architect-remeasured against a fresh copy of live disk on 2026-08-08; both measurements agree. Handoff: `DECISIONS-MIGRATION-STAGE-2B-PHASE-1-CODEX-HANDOFF-2026-08-08.md`.

**Revision history, recorded here rather than in the immutable order itself, per the order's own §0.** Revision 1 was drafted and, before any external measurement, revised in place on three non-author-review defects: a hash slot inside the order that would have had to change the very bytes it described; a write allowlist that literally forbade the `mkdtemp`/`git init` temp-directory behavior the mandated test command already performs; and a Step 4 requirement — a per-fixture pass/fail table from the pre-excision run — that the existing fail-fast assertion style could not produce, since a throw at the first new fixture aborts before the fixture matrix prints anything. Revision 2 was drafted with those three fixes and, still before external measurement, was itself corrected on two further non-author-review findings: a §3 tracked-working-tree description that the order's own untracked existence falsified, and an imprecise claim that revision 1 had never been byte-measured. Because two distinct byte states had both carried the label "revision 2," the label was advanced to 3 rather than reused, so the authorized identity above maps to exactly one byte state. No contemporaneous record was reopened at any step; every correction landed on an unauthorized draft.

**Next architect action on return:** read `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08.md` cold, independently re-measure live disk rather than accept the receipt's own numbers, and adjudicate. Phase 2 (§5.4, preservation snapshot) is not commissioned until Phase 1 closes on architect `ACCEPT`. Reconnaissance already performed for Phase 1, for reference: `lib/decisions-format.ts` 47250 bytes with the guard present exactly as the commission describes; `scripts/tests/decisions-format.ts` 35014 bytes with `F1`–`F13`/`M1`–`M19` present and `F14`–`F16`/`M20`–`M23` absent; `package.json`'s `test:decisions-format` already correctly wired, so Phase 1 needed no conformance-wiring write.

The remaining phase order, unchanged from the commission's own dependency structure and not yet commissioned: **(2)** §5.4 preservation snapshot; **(3)** §5.5 normalized archive; **(4)** §5.6 target `DECISIONS.md` construction; **(5)** §5.7 reconciliation checkers; **(6)** §5.8 conformance wiring; **(7)** §6 post-migration reference-graph artifact. Each remaining phase order requires its own cold reconnaissance of live on-disk state before drafting, exactly as Phase 1 did — do not assume file states described anywhere in this note or the commission are still current.

**Owner standing authorization, 2026-08-08 — carries across sessions, does not expire at a context break.** Luke authorized the architect seat to sequence and commission each Stage 2b phase above without returning for permission after a clean accepted result. This is delegation of pacing, not of judgment: the architect seat still authors every order, still adjudicates every returned receipt cold against live disk, and still owns producer≠checker exactly as in every Stage 2a phase. **Return to Luke only for:** a genuine owner decision (something only the owner can choose, as date rebinding required); a manifest or commission ambiguity this seat cannot resolve from the ratified text; a live-disk prerequisite failure; or anything requiring commission amendment. A clean accepted phase receipt is not, on its own, a reason to pause and ask. A fresh session picking this up should read this paragraph as still in force — it was not a one-turn grant.

**Producer≠checker for Stage 2b, stated in advance:** Codex is the implementation producer per commission §5.1 and authors no constitutional wording and makes no migration disposition. This seat authors each phase order and adjudicates each returned receipt. Luke ratified the manifest, not Stage 2b's execution — each phase still needs this seat's cold verification and, where the commission requires it, further owner action, exactly as every Stage 2a phase did.

**What must not happen going forward, stated because the stakes just changed:** no edit to the ratified manifest under any circumstance — Stage 2b consumes it, never modifies it, per commission §5.2 item 4. No output outside the twelve authorized branch outputs. No parser change beyond the single named guard. No reopening of any Stage 2a work this gate closed, absent live disk demonstrating an actual prerequisite failure.

## Historical pre-ratification resume state — superseded 2026-08-08

**This section is the operative resume state and supersedes any conflicting immediate-next-action, manifest-identity, M4.4-reservation, or full-review-status wording retained later in this note as chronology.** The commission-required full constitutional review is **discharged**: the fresh 78-unit review returned, its four defective receipt adjudications were corrected under a narrow recommission that closed `ACCEPT`, and the resulting `M4.35` repair chain is closed. Do not reuse the prior tranches A–D as clearance, and **do not re-commission any full constitutional review** — it is done.

**Current manifest identity:** `332579` bytes / SHA-256 `818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2` — the completed manifest, derived date-occurrence report inserted, terminal `@@ASSEMBLY_CURSOR@@` consumed. Set by step 5 (architect, 2026-08-07) and closed by step 6 (Codex, 2026-08-07, `M7.5 is closed`); full sequence detailed below. **The prior `314811` / `33821e54…` identity is superseded and must not be cited as current** — it is the pinned pre-insertion candidate, independently reconstructed byte-identical inside the step-6 receipt. The `e99335567d…` identity before that remains superseded further back, per prior chronology. Branch remains `codex/decisions-migration`; HEAD remains `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`; `DECISIONS.md` remains byte-identical to `MIGRATION_BASELINE`. `MIGRATION_DATE` remains owner-bound to **2026-08-18**.

**Repair sequence closed.** The prior full review produced five claimed findings. Four were accepted: `M4.3 / P2#0` restored E002's anti-author-intent condition; `M4.4 / P2#1` replaced the inherited `Owner` anaphor with a self-contained field-specific reason; `M4.5 / P3#0` restored E004's Layer-A non-mutation safeguard; and `M4.35 / P28#0` restored E033's generation-prompt-parameter population limb. The fifth claimed finding at `M4.38 / P31#0` was rejected because the omitted flag-only / never-compiler / never-mutation material is expressly superseded by the named 2026-07-18 lane retirement. `M4.38` was never repaired.

The four substantive repairs, the bounded `M4.4` adjacent-whitespace correction, and the final `M4.35` exclusivity correction are all independently Codex-verified. The last correction changed `Generation prompt parameters draw from this same scored-leaf population.` to `Generation prompt parameters draw only from this same scored-leaf population.` The final verification receipt is `audit/decisions-migration-2026-07-29/M4.35-EXCLUSIVITY-REPAIR-VERIFICATION-2026-08-07.md`, overall `PASS`; its reversal proof reconstructs the exact pre-repair witness `314491` / `9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a`, byte-identical to Git blob `a2685a3518aa609902b151dec4e51bf353d66e2e`. The earlier FAIL and intermediate PASS receipts remain accurate historical records and are not superseded as records of the states they examined.

**Final GPT confirming read of the repaired substantive population: PASS.** `M4.3` carries the explicit anti-self-confirmation condition; `M4.4`'s `Owner` reason is self-contained and compatible with its recorded omission ground; `M4.5` carries the Layer-A non-mutation safeguard; and `M4.35` now preserves E033's explicit exclusivity through `draw only from`. No further repair is open from this sequence.

**Discharged as of 2026-08-07 — do not re-run any of these.**

- **Fresh full constitutional review:** discharged. 78 units, all `CLEAR`. Six `FRESH-FULL-REVIEW-*` receipts plus the narrow-recommission supplemental disposition, which corrected `M4.25`, `E050`, `E052`, and `E076` and closed `ACCEPT`.
- **Task 2:** discharged. Fresh full 65-record run post-repair: `M4.35` at 3, all records inside `{1,2,3}`, distribution `1=4 / 2=23 / 3=38`, zero backtick openers.
- **Task 3:** discharged. 20 instances, 19 distinct paths, Population 1 = 18 all `TRACKED`, Population 2 = 1 `EXEMPT` with Clause A byte-equality re-proved against the current `2026-08-18` archive-filename pin. Item 9 was untouched by the `M4.35` repair, so this stays discharged.
- **`M4.35` sentence-count repair chain:** closed `ACCEPT`. Codex deterministic verification PASS, GPT confirming read PASS, architect closeout ACCEPT.

**The derived date-occurrence report — `M7.5`'s full six-step sequence — is complete and closed, 2026-08-07.** All six steps executed; every deliverable was independently re-verified by this seat against live disk at each step, not adjudicated from a returned summary alone.

1. **Step 2 (Codex, census):** `DATE-OCCURRENCE-CENSUS-2026-08-07.md`, 288 occurrences, architect ACCEPT. One defect disposed rather than repaired: occurrences 1–7 carry an underivable `section=M0` — a post-execution application of **standing ruling 39**, no new ruling minted. `section` is non-authoritative for occurrences 1–7 in every downstream artifact, closed-world.
2. **Step 3 (architect, mapping):** `STEP-3-SURFACE-MAPPING-2026-08-07.md`, all 288 occurrences to unique surface IDs, `D1`–`D6` (63 dependent) and `F1`–`F11` (225 fixed). `F9`–`F11` adopted under `M7.4`'s existing authorization to dispose unclaimed tokens — no `M7` manifest edit, no new owner act. `F5` corrected from Part D's stale count of four to eight. GPT's independent review caught two further mapping errors of this seat's own (`F10`/`F11` misclassification of two multi-extension filenames, occ 278–279); corrected and cold-verified. Final: `F10=42 / F11=71`. Locked at `49206` / `5a2e0500…`.
3. **Step 4 order:** revision 3, hash-locked and architect-acknowledged 2026-08-07 at `14334` / `9b4f1130…`. Two substantive GPT-caught defects repaired across revisions 2–3 (a Clause B proofs-3/4 over-claim; a self-scan narrower than the order's own broadened no-date rule), each independently verified by this seat before lock.
4. **Step 4 (Codex, validate + generate):** `DERIVED-REPORT-VALIDATION-2026-08-07.md`, PASS. Generated-block authority `17788` / `fec09bf2…` — independently re-extracted and re-scanned by this seat (all five date/near-miss scans zero) and cross-checked row-for-row against the locked mapping, zero mismatches.
5. **Step 5 (architect, insertion):** executed 2026-08-07. Terminal `@@ASSEMBLY_CURSOR@@` replaced with the exact generated block; dry-run, live write, independent read-back and hash all performed by this seat. Result matched a hash this seat precomputed before making the edit.
6. **Step 6 (Codex, re-derivation + equality):** `DERIVED-REPORT-STEP-6-VERIFICATION-2026-08-07.md`, PASS, `M7.5 is closed`. Independently re-verified by this seat: full-file rescan recovers exactly the same 288 occurrences; embedded report is byte-identical to a fresh regeneration from the locked mapping; pre-insertion candidate reconstructs exactly to the pinned `314811` / `33821e54…`. **Process note:** unlike steps 2 and 4, no architect-authored work order preceded step 6 — `M7.5`'s own text is what authorized it, and the step is purely mechanical with no judgment surface. Recorded rather than treated as a defect.

**Immediate next action: commission Codex's post-assembly deterministic verification**, now against the completed, sentinel-free manifest. No such work order exists on disk yet. Owner exact-byte ratification of `818be99a…` follows that verification if the identity is still unchanged; Stage 2b follows ratification. **Owner directive, 2026-08-07: no further substantive manifest edit without reopening the relevant gates — the manifest is assembled.**

**What the order fixes, so a later seat does not re-litigate it.** Occurrence rule: a `[0-9]{4}-[0-9]{2}-[0-9]{2}` run bounded by non-digits, with **hyphen adjacency expressly permitted** — `M7.2` presupposes that the span inside the normalized archive filename is an occurrence and `M7.4` makes the population every ISO token in the manifest, so filename and anchor hyphens do not destroy occurrence identity. Locators are `section`, a totalized `record_item` covering the numbered items of `M4` records and `M5.5.x` wrapper records alike, a **positional** `container`, and the full context line; Codex assigns no family, no surface ID, and no dependent/fixed disposition. Two implementation-independent derivations are required, compared on offset sets, because `M7.5` step 6's regeneration is an equality between two outputs of the same matching rule and would reproduce a shared-implementation omission at both ends. **Per standing ruling 38, any source span cited in a later step's commission comes from the manifest's own item-14 records, never from the candidate-regions file, the live-source packet, or a truncated tool preview.**

**Remaining Stage 2a sequence after the report,** in order, with no substantive architecture or review work left in it:

1. Codex post-assembly deterministic verification, now against the complete **sentinel-free** manifest.
2. Luke's exact-byte manifest ratification — the act that actually closes Stage 2a. Only `ACCEPT` plus owner ratification authorizes Stage 2b.
3. Stage 2b: closed-world mechanical implementation from the ratified manifest — migrated `DECISIONS.md`, normalized archive, preservation snapshot, and only those parser/fixture changes the commission specifically authorizes — then the Stage 2b conformance and receipt work against the `2026-08-18` commit-date predicate.

The historical fresh-review commission at `DECISIONS-MIGRATION-STAGE-2A-FRESH-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-07.md` and the earlier `…FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md` both remain historical execution authority for the reviews they governed. Neither is rerun or amended.

The four-way operative-limb disposition matrix, **retained as reference for any future limb adjudication rather than as a live commission**, is exact and exhaustive:

- `RETAINED IN <record> TARGET STATEMENT` — identify the carrying target-statement clause.
- `CARRIED BY <named target entry>` — identify the other target entry and its carrying clause.
- `SUPERSEDED BY <named later source>` — name the later source and superseding act.
- `DELETED — FINDING`.

**Review rationale is never a carrier.** Enumerate operative source limbs only; do not inflate the matrix with historical narrative, evidence detail, or non-operative prose merely because it appears in the source. **An operative-limb population may legitimately be empty** — `E076` is the worked case — and an order that enumerates dispositions without saying so invites a manufactured one. The three previously discharged `Owner` reasons at `M4.3`, `M4.7`, and `M4.11` are marked `DISCHARGED — NOT RE-REVIEWED`. `M4.4` is no longer reserved: it was adjudicated, repaired, mechanically verified, and semantically confirmed.

Stage 2b and owner ratification remain fenced behind Codex's post-assembly deterministic verification only — the derived-report fence above is discharged. Claude's producer/architect leg for the `M4.35` repair sequence is complete; no further Claude turn is needed for that episode.

## Historical pre-review resume state — superseded 2026-08-07

**Task: run the commission-required full 65-record and 13-wrapper constitutional review through Codex.**
M4, M5, and M6 are authored; the M6 repair, the `Owner` anaphora repair, and the reservation-recording
repair are all applied and Codex-verified; the reservation-recording confirmation returned **C1–C10 PASS
or MATCH, no advisory findings**, and its provenance question is resolved. Do not re-derive queue state,
do not re-litigate routing, do not reopen M4 authoring, and **do not re-review the three `Owner` reasons
at `M4.3`, `M4.7`, `M4.11`** — that semantic review is discharged, and a receipt re-arguing it has
exceeded its commission.

**The immediate next action** is Codex's six-file review commission at
`DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md` §5, whose bytes are
immutable at `32622` / `ba03de1bcf8058eea5062d0d67d838faa5d316038c9cd083c33b13f468ec39ac`. **Population is
78 units** — 65 live records in tranches A–D (18/19/18/10) plus 13 archive wrappers in tranche E, with
tranche F carrying the cross-cutting whole-manifest checks and the single §4.9 disposition — read against
the pinned manifest at `314491` / `9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a`.
**`M4.4` / `P2#1` is adjudicated in tranche A**, per §5.6: the receipt must quote the live `Evidence` and
`Owner` dispositions and the actual antecedent, and may not return it as still reserved. Six deliverables:
`FULL-REVIEW-TRANCHE-A` through `-E-2026-08-06.md` and `FULL-REVIEW-DISPOSITION-2026-08-06.md`, all under
`audit/decisions-migration-2026-07-29/`.

**The 2026-08-05 confirming read returned, and its `BLOCK` was recording-only.** Every pin re-measured
`MATCH`, and the three subjects at `M4.3` / `P2#0`, `M4.7` / `P5#0`, and `M4.11` / `P8#0` are each
**`CLEAR`** on proof of contact, M6.3 and M6.1 pairing, ground agreement, the per-record acceptance tests,
the `M4.3` live limb-to-surface read, the `Execution` adjacency, and ruling 35. The overall `BLOCK` rested
solely on this note reserving `M4.4` while sweeping it into three blanket clearance statements. Receipt:
`audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-RERUN-2026-08-05.md`. Those three
statements were repaired on 2026-08-05; the repair, its retained population, and a stated ground for every
exclusion are at
`audit/decisions-migration-2026-07-29/M4-RESERVATION-RECORDING-REPAIR-REPORT-2026-08-05.md`.

**The reservation-recording confirmation returned `C1–C10 PASS or MATCH, no advisory findings`,** at
`audit/decisions-migration-2026-07-29/M4-RESERVATION-RECORDING-CONFIRMATION-2026-08-05.md`. The
provenance question raised against C8 — how a pre-repair null was available to a seat that had not been
given it — is resolved: the null existed as a Git blob before the run, Codex located and measured it by
read-only `git cat-file` enumeration, and no object was created, no ref moved, and no index changed. The
sole-write claim holds under standing ruling 37. **The reservation-recording repair and its confirmation
are complete.**

**Revision 3 of the anaphora repair order remains immutable** at `33084` /
`aadca7b586c795ac6e08ede55ab4dd06329ecfddee02965c1ea8a0a726df48ea`: it is the executed authorization
basis for the three landed `Owner` repairs, and its two-hash proof is worth something only while the
file it names stays byte-identical. The same holds for revision 4 of the M6 verification order, whose
bytes remain the authorization basis for the landed M6 changes. **Its closing authorization measurement
is discharged.** Codex V8 measured revision 3 independently at verification opening and again after all
deterministic checks, returning `33084` /
`aadca7b586c795ac6e08ede55ab4dd06329ecfddee02965c1ea8a0a726df48ea` both times — both measurements taken
after the architect's last edit, and neither transcribed from the other or from repair report §1. The
two-hash rule at revision 3 §1.3 is satisfied. `M4-OWNER-ANAPHORA-REPAIR-REPORT-2026-08-05.md` §7 still
reads *owed* and is correctly immutable as a contemporaneous producer record; a reader who finds it is
directed here and to V8.

**What landed, and where it is recorded.** The 2026-08-04 M6 repair and its 2026-08-05 continuation are
applied: the six revision-4 M6 surfaces; two numeric prose corrections at M6.3 and M6.7 under the
completion order §3; and the fifteen item-10 `Evidence` dispositions at revision 4 §2. Codex's
verification of them returned 0 BLOCKER, 0 REQUIRED REPAIR, and 3 ADVISORY, and is accepted as complete
within its commissioned scope. The GPT confirming read returned `REVISE, narrowly` on one defect class in
three records; everything else in that scope cleared. Every measured
value, every judgment made in passing, and two process failures are at
`audit/decisions-migration-2026-07-29/M6-REPAIR-REPORT-2026-08-04.md`.

**The `Owner` anaphora repair of 2026-08-05** replaced the item-10 `Owner` dispositions at `M4.3`,
`M4.7`, and `M4.11`, each of which had read `same reason` against an `Evidence` antecedent the M6 repair
had replaced beneath it. All three remain `OMIT` and no M6.3 ground changed. The replacement reasons, the
`M4.3` feasibility gate that confirmed `NO-SINGLE-OWNER` against live surfaces, one flagged adjacency at
`M4.3`'s immutable `Execution` clause, and two process failures are at
`audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-REPAIR-REPORT-2026-08-05.md`. **Read both reports
before touching M6, those fifteen `Evidence` dispositions, or those three `Owner` dispositions.**

**`M4.4` / `P2#1` is reserved, without adjudication, for the full constitutional review.** It carries the
same `same reason` construction, but no repair moved its antecedent, so it sits outside the causal surface
of the 2026-08-05 review return. It is neither cleared on the merits nor recorded as a defect, and no seat
may read the reservation as having settled it in either direction. Standing ruling 35 states why.

**The §10 confirming read was returned void on 2026-08-05 and its judgment is still owed.** The GPT
receipt adjudicated `M4.3`, `M4.5`, and `M4.6` — `M4.5` is `P3#0` and `M4.6` is `P4#0`, and neither was
opened by any order — leaving `M4.7` and `M4.11` never adjudicated; it described substance no Stage 2a
artifact contains; and it certified a repaired sentence at an *old principle 35* that carries no
identifier in the corpus and whose bytes Codex V1 had already proven unchanged. Its branch, HEAD, and
no-mutation statements were all correct, and correct metadata salvages nothing: repository identity is
available without reading the subject. **Void for the whole commissioned scope, including its in-scope
`M4.3` entry**, and cited nowhere as evidence — including its `M4.4` label and its §7 advisory, the
latter of which is adjudicated on Codex V8's independent evidence instead. Grounds, the live check that
established each, and the receipt itself are at
`audit/decisions-migration-2026-07-29/M4-OWNER-CONFIRMING-READ-VOID-RECEIPT-ADJUDICATION-2026-08-05.md`.
Standing ruling 36 states the rule. The rerun routes to **Codex** by owner decision of 2026-08-05; Codex
authored neither the three replacement reasons nor ruling 35, so producer≠checker holds. **The read
remains barred to the Claude seat, which authored them.**

**Do not advance to the derived date-occurrence report and do not advance to ratification until the full
65-record and 13-wrapper constitutional review completes and its findings are adjudicated.** The §7
reservation-recording confirmation is discharged and no longer the bar; the review commissioned at
`DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md` §5 is. The report's
rows carry byte offsets into the manifest, so no report generation may begin before that review's
`ACCEPT` disposition and any resulting repair are both settled — the manifest is closed to every seat for
the review's duration and the report cannot be generated against bytes still subject to change.

**A write is not evidence of itself.** On 2026-08-05 this seat reported a work-order revision as written
to disk before the write call had been issued, and the live read that caught it came from another seat.
Every edit is read back from disk before it is reported as applied.

**The architect seat cannot hash.** The filesystem connector exposes no SHA-256 primitive; byte length
and content are measurable, digests are not. Every digest in the repair report was produced by a seat
that can run `shasum` and is recorded with that provenance. A closing digest is measured afresh and
never copied forward from the opening record — two hashes prove an authorization basis only if both are
measurements.

M5 and M6 were authored in place above M7. The terminal `@@ASSEMBLY_CURSOR@@` is reserved for the
derived date-occurrence report and is never the insertion point.

**Routing settled 2026-08-01.**

- **Architect seat:** adjudication of review returns, new standing rulings, and the Stage 2b
  `DECISIONS.md` writes. M5 and M6 are authored; the M6 repair and the `Owner` anaphora repair are both
  applied, and architect editing on both is closed.
- **The commission-required full 65-record and 13-wrapper constitutional review is barred to the Claude
  seat** and routes to a GPT or Codex seat. Claude authored the M4 records, and producer≠checker attaches
  to the seat that produced. This is a rule consequence, not a scheduling choice; it does not change if
  Claude usage becomes available.
- **Codex:** the commission-required full 65-record and 13-wrapper constitutional review under
  `DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md` §5 — a reading
  commission throughout, barred from re-running its own prior batch-local deterministic results in place
  of a fresh read; the Task 2 rerun as a complete 65-record run reporting the owed 43-record subset at
  M4.2–M4.44 separately, and the Task 3 rerun or explicit supersession, both of which the M6 verification
  order folded in — read that deliverable before re-commissioning either, rather than assuming it
  discharged them; then generation, mapping, validation, embedding, and re-derivation of the
  date-occurrence report; then post-assembly deterministic verification.
- **Owner:** exact-byte ratification of the complete sentinel-free manifest.

**Schedule constraint.** `MIGRATION_DATE` `2026-08-18` is a verification predicate on the Stage 2b content
commit's author timestamp in `America/New_York`. As of 2026-08-06, the commissioned full 65-record and
13-wrapper constitutional review (commissioned, not yet executed), adjudication of its findings and any
resulting repair, the Task 2 rerun over the 43 records at M4.2–M4.44, the Task 3 rerun or explicit
supersession, the derived date-occurrence report, Codex's post-assembly deterministic verification, and
owner ratification are all owed against twelve days. Any further change to the bound value is an owner act. Once the first exact-byte
ratification lands, a further change stops being a pre-ratification candidate supersession and becomes the
full Amendment 1 Clause B procedure — manifest-only rebinding commit landed before the Stage 2b content
commit, owner-ratified diff limited to the §3 date-dependent bytes, replacement manifest SHA-256
superseding the earlier ratified authority, and the four-proof derived report across the rebinding.

**Delegation clauses, drafted 2026-08-01, not owner-ratified.** Carry into any work order handed to a
non-architect seat. They are drafting guidance until Luke approves exact wording, and none of them relaxes
an existing floor.

1. A spec that asserts what a command, script, or generator will produce must have that assertion verified
   against the script's source by the checking seat, and the check reported as a named line item. Justified
   by the Task 2 defect below: the producer satisfied a defective measurement contract perfectly.
2. A floor may require a mechanism extension rather than another number. `VITAL_SANITY_MAX_OVERRIDES` is
   ceiling-only.
3. A null or zero result discharges feasibility only, never correctness.

**Process note, not a standing ruling.** On 2026-08-01 the Claude seat's carried memory and a GPT review
each reconstructed the remaining queue from context and each got roughly half of it wrong, in different
places, while this note — already accurate, already on disk, and already stamped that day — went unread
until late in the session. Read this note and the manifest before reasoning about state.

## Cursor

M4 records authored — **all 65 live blocks**, inserted at M4.2–M4.66 in
`audit/decisions-migration-2026-07-29/target-text-manifest.md`. **All 65 live M4 records at M4.2–M4.66
are authored. Sixty-four — 65 less the single reserved record — carry provisional non-author clearance,
and `M4.4` / `P2#1` is the sole exception: authored, reserved, unadjudicated, and not cleared.**
M4.33–M4.38, M4.39–M4.44, M4.45–M4.50, M4.51–M4.56,
M4.57–M4.63, and M4.64–M4.66 were each cleared on a confirming read after a `REVISE, narrowly`
disposition and bounded repairs. **Codex returned `PASS — M4.64–M4.66 DETERMINISTIC CHECKS`, and no
batch-local deterministic run remains owed.**

**Target §§4–7 are structurally complete, and M4 is complete.** Target §4 carries 37 `P` blocks across
25 distinct permanent identifiers, target §5 carries 6 `R` blocks, target §6 carries all 19 `I`
entries, and target §7 carries all 3 `T` entries; all match the frozen nulls at M0.3. **No live block
remains unauthored.** M5 and M6 are authored; M6's 2026-08-04 repair and its 2026-08-05 continuation
are applied and were verified by Codex with 0 BLOCKER and 0 REQUIRED REPAIR. The GPT confirming read
returned `REVISE, narrowly` on the item-10 `Owner` anaphora at `M4.3`, `M4.7`, and `M4.11`; those three
dispositions were repaired on 2026-08-05 and Codex's verification of that repair returned V1–V10 PASS,
D1 PASS diagnostic, 0 BLOCKER, 0 REQUIRED REPAIR, and 1 ADVISORY. **The §10 confirming read of those
three repaired reasons was returned void on 2026-08-05** and was recommissioned to a Codex reading seat
under `DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-CONFIRMING-READ-RERUN-WORK-ORDER-2026-08-05.md`
revision 1; standing ruling 36 states why that first receipt was void. **The rerun returned all three
reasons `CLEAR`** with every pin re-measured `MATCH`, and blocked only on the `M4.4`
reservation-recording conflict, now repaired and confirmed. The derived date-occurrence report stays
barred until the commission-required full 65-record and 13-wrapper constitutional review completes and
any resulting findings are adjudicated.

**Part A — 18 blocks at M4.2–M4.19:**

`P1#0`, `P2#0`, `P2#1`, `P3#0`, `P4#0`, `P5#0`, `P5#1`, `P6#0`, `P7#0`, `P8#0`, `P10#0`, `P11#0`,
`P15#0`, `P15#1`, `P16#0`, `P16#1`, `P16#2`, `P17#0`

**Part B, provisionally reviewed — 13 blocks at M4.20–M4.32:**

`P19#0`, `P20#0`, `P21#0`, `P21#1`, `P21#2`, `P23#0`, `P23#1`, `P23#2`, `P24#0`, `P25#0`, `P25#1`,
`P25#2`, `P25#3`

**Part B, provisionally reviewed after bounded repair — 6 blocks at M4.33–M4.38:**

`P26#0`, `P27#0`, `P28#0`, `P29#0`, `P30#0`, `P31#0`

**Part C, provisionally reviewed after bounded repair — 6 blocks at M4.39–M4.44:**

`R1#0`, `R2#0`, `R3#0`, `R4#0`, `R5#0`, `R6#0`

**Part C, provisionally cleared 2026-07-31 after bounded repair — 6 blocks at M4.45–M4.50:**

`Producer assignments are operational state, not constitutional text` (`E038`),
`Deterministic review routing for promoted opus-prefixed case IDs` (`E043a`),
`Runtime audio carries no client-embedded secret` (`E054`),
`Bilingual English and Simplified Chinese parity on all displayed text` (`E055`),
`Topic labels are English-only` (`E056`),
`JSON quote hygiene is a parse-time gate` (`E057`)

These are the manifest's first name-addressed entries. They carry no permanent identifier, no
attachment, and an index `ID` column of `—`.

**Disposition: `CLEAR PROVISIONALLY`, returned by Codex 2026-07-31.** The batch first drew a
`REVISE, narrowly` non-author review the same day, which verified branch, untracked population, the
three `2026-08-11` occurrences, absence of any `MIGRATION_DATE` placeholder, the single sentinel,
`D6`'s span exclusions, and the structural integrity of M4.2–M4.44, and which concurred with the
`E043a` `Owner` omission and found the `E056` `Owner` retention defensible. Three required repairs
landed, and the confirming non-author read cleared all three: the M4.45 span repair, the M4.47 repair,
and the migration-date supersession header.

1. **M4.45 item 14** — the one-byte span difference had been recorded as an unresolved discrepancy.
   Part D §8.3 already resolves it: `[53203,53204)` is line 308, the following blank line, which the
   preservation slice deliberately excludes because the archive supplies its own framing. Rewritten as
   **Span distinction, resolved**; no preservation-boundary finding remains.
2. **M4.47 item 12** — the `P20` "Deprioritized 2026-06-22" coincidence had been offered as a candidate
   anchor. It dates `P20`, not this separate invariant. Removed as an anchor; the routed open action it
   was replaced with is now itself discharged, see below.
3. **Supersession record header** — "retained unaltered" contradicted its own §7. Now "retained
   **otherwise** unaltered", naming the single inserted notice.

**Deterministic results returned with the clearance, all conformant:**

- **`E054` provenance established.** Class `GIT_INTRODUCTION`, from commit
  `f7043be599b5665925b67b9e9c3a972e0eac1b6f`, authored `2026-06-22T18:14:46-04:00`, which introduces the
  runtime-audio invariant itself — the no-live-key and no-client-embedded-secret rule, the Vite
  plaintext and world-readable consequence, and the asset-presence `speechSynthesis` fallback. Its
  parent carries none of those limbs; later commits reworked and relocated an already-existing rule.
  `Date: 2026-06-22` is confirmed correct and unchanged, and it is now independently established rather
  than retained under the `P7` correction's non-reopening scope. This supersedes the provenance report's
  row 46 `RATIFIED_RECORD` / fixture `F05` label. **The Git-history action is closed.**
- **Official sentence counts for M4.45–M4.50: 2 / 3 / 2 / 1 / 2 / 2.** All within the one-to-three
  grammar; zero backtick sentence openers. **The owed rerun is discharged for this batch** — it does not
  discharge the invalid Task 2 run over the other 43.
- **Batch-local field-path population: two `TRACKED`, one `EXEMPT`** under Amendment 1 Clause A. Both
  M4.46 supporting-rationale paths are tracked.

**M4.45–M4.50 are provisionally cleared. The instruction not to continue to `E058` is discharged.**
Provisional clearance authorizes manifest insertion only; it is not formal ratification, and it does not
reduce the commission-required full 65-record and 13-wrapper review still owed before ratification.

**Part C, provisionally cleared 2026-08-01 after bounded repair — 6 blocks at M4.51–M4.56:**

`Question IDs are globally unique across bundled banks` (`E058`),
`Raw-draft filename prefix routes to its canonical bank` (`E059`),
`Canonical merges are deterministic and gated` (`E060`),
`Runtime stays static, offline, and file-protocol compatible` (`E061`),
`Schema versions are an ordered token, not semver` (`E062`),
`Schema changes are rare and deliberate` (`E063`)

**Disposition: cleared provisionally on constitutional content, 2026-08-01.** The batch first drew a
`REVISE, narrowly` non-author GPT content review, which required one bounded repair — a grammatical
repair to `E061`, whose statement now carries `Neither a server call nor a live model call occurs after
build.` as its second sentence. The repair landed and a confirming GPT read cleared the repaired batch.

**The three flagged restorations and the two `Owner` calls were all cleared as authored:**

- `E058` correctly restores the gate-enforcement limb and retains `Owner: scripts/audit/audit-ids.ts`.
- `E059` correctly restores `visual-canonical.json` as the only live visual generation target and
  retains `Owner: lib/canonical-routing.ts` under ruling 28.
- `E060` correctly retains `Owner: scripts/consolidate.ts`.
- `E061`'s descriptive title and literal `file://` statement diverge by design, and the divergence is
  valid.
- `E062` correctly names `schemaVersionAtLeast` and the `SchemaVersion` union, and correctly omits
  `Owner`, because the two executable limbs live in separate files.
- `E063` is unchanged and correctly remains `ADVISORY`.

**Codex's batch-local deterministic results, returned `PASS` on 2026-08-01:**

- **Official sentence counts for M4.51–M4.56: 2 / 3 / 1 / 2 / 3 / 1.** All six satisfy the
  one-to-three-sentence grammar; all six carry zero backtick sentence openers.
- **Batch-local field-path population: three paths, all `TRACKED`** —
  `scripts/audit/audit-ids.ts`, `lib/canonical-routing.ts`, and `scripts/consolidate.ts`.
- **Repository shape at verification:** branch `codex/decisions-migration`; no staged changes; no
  tracked worktree modifications; 30 untracked Stage 2a files; `DECISIONS.md` unchanged from both HEAD
  and `MIGRATION_BASELINE`; exactly one append-point sentinel.
- **The owed rerun is discharged for this batch only.** It does not discharge the invalid complete
  Task 2 run, whose outstanding population remains the other 43 records at M4.2–M4.44.

**This clearance authorizes continued manifest authoring only.** It does not ratify Stage 2a, does not
authorize Stage 2b, does not authorize any edit to `DECISIONS.md`, and does not reduce the
commission-required full 65-record and 13-wrapper review still owed before ratification.

**Part C, provisionally cleared 2026-08-01 after bounded repair — 7 blocks at M4.57–M4.63:**

`Shared visual numeric helpers have a single definition` (`E064`),
`Case-study exhibit IDs share one namespace` (`E065`),
`Category targets are the current test-plan weights` (`E066`),
`Bank composition is a floor problem, not a balance problem` (`E067`),
`Repository-state hygiene is mechanism-specific` (`E068`),
`Some topics are deliberately shared across categories` (`E069`),
`Highlight's structural bias gate is schema-level` (`E071`)

**This batch completes target §6.**

**Disposition: cleared provisionally on constitutional content, 2026-08-01.** The review sequence ran:
(1) GPT returned `REVISE, narrowly`; (2) `E066` at M4.59 and `E071` at M4.63 had their `Owner` fields
removed; (3) `E069` item 12 and standing ruling 32 were narrowed without changing any governed target
byte; (4) a confirming GPT read cleared the repaired constitutional content; (5) Codex returned the
batch-local deterministic `PASS`.

**Five of the seven diverge from the draft by restoring a named identity the draft had described
instead:** `fmt`/`fmtNum`/`roundTo` at `E064`, `caseStudy.exhibits` at `E065`,
`NCLEX_CATEGORY_WEIGHTS` at `E066`, `floorThreshold` at `E067`, and `SHARED_TOPIC_CATEGORY` at `E069`.
That the same defect recurred five times in one batch is itself the finding. It is `E062`'s defect, and
the reviewer should test it as a class rather than five separate calls: in each case the draft's
description was accurate and unenforceable, which is why it survived the draft's own review.

**The three flagged calls were adjudicated.** `E068`'s repair of a widening stands — the draft's "agents
reading through the forge" is restored to the source's `GitHub-reading` — and `E068` keeps
`Owner: AGENTS.md`, the manifest's first markdown `Owner`. `E071`'s restoration of the positional-audit
reason stands. `E066`'s `Owner` was removed; see the bounded repair below.

**Bounded repair applied 2026-08-01, before any target §7 authoring.** Two `Owner` fields this batch
first retained were removed on owner direction, and both removals rest on live reads made during the
repair. `E066` at M4.59 loses `Owner: src/schema.ts`: the map is defined there, but
`src/sessionSampler.ts` executes the weighted study draw and `scripts/coverage-report.ts` executes the
generation coverage backlog, so no one path owns the complete statement. `E071` at M4.63 loses
`Owner: src/schema.ts`: `scripts/audit/non-mcq-bias-lib.ts` defines the audited population as an
`AuditedItemType` union that excludes `highlight` by omission, while
`scripts/audit/non-mcq-bias-layer-b.ts` carries `highlight` for semantic review. Both are ruling 11
dispositions, not ruling 28. **The authoring seat's original characterization of the `E071` audit limb
as an unenforced fact was wrong and is withdrawn in place** — the exclusion is a line of code. No
statement, title, index row, date, `Execution` field, or source span changed in either record. Standing
ruling 32 was narrowed in the same pass.

`E069` is the batch's substantive finding and is recorded at standing ruling 32.

**Codex's batch-local deterministic results, returned `PASS` on 2026-08-01:**

- **Official statement sentence counts for M4.57–M4.63: 1 / 2 / 2 / 2 / 2 / 2 / 2.** All seven satisfy
  the one-to-three-sentence grammar; all seven carry zero backtick sentence openers.
- **Governed field population: exactly five distinct `Owner` paths, all `TRACKED`** —
  `src/visuals/primitives/graphPaper.ts`, `src/schema.ts`, `src/sessionSampler.ts`, `AGENTS.md`, and
  `src/topics.ts`. `E066` at M4.59 and `E071` at M4.63 carry no `Owner`, and no record in M4.57–M4.63
  carries an `Evidence` field. Rationale-only paths were correctly excluded from the governed
  field-path population.
- **Repository shape at verification:** branch `codex/decisions-migration`, no upstream configured;
  zero staged changes; zero tracked worktree modifications; 30 untracked files, which under Codex's
  narrower accounting is 29 Stage 2a working-set files — 28 `STAGE-2A-*` files plus the target
  manifest — and one separate commission-amendment file; `DECISIONS.md` byte-identical to HEAD and to
  baseline `d499cc1d0916e03830489ec9cd0324cd1a203a73`, size 76,314 bytes, SHA-256
  `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`; exactly one terminal
  `@@ASSEMBLY_CURSOR@@`.

**Scope of this clearance.** The batch-local deterministic obligation for M4.57–M4.63 is **discharged**.
The earlier complete Task 2 run **remains invalid**, and the population still lacking a valid rerun
returns from 50 to the other 43 records at M4.2–M4.44. The later commission-required complete 65-record
verification remains fully required. This clearance does not ratify Stage 2a, does not authorize Stage
2b, does not authorize M5 or M6 prematurely, and does not authorize any edit to `DECISIONS.md`.

**Part C, provisionally cleared 2026-08-01 after bounded repair — 3 blocks at M4.64–M4.66,
completing target §7:**

`Translation-friction scoring` (`E045`),
`Exam-condition test and adaptive modes` (`E046`),
`Unresolved vital sanity bounds` (`E047b`)

**Disposition: the non-author confirming review cleared the constitutional content and required one
bounded repair, which has been applied.** The review clears `E045` and `E046` as authored, clears the
`E047b` partition as authored, and accepts `Unresolved vital sanity bounds` as the correct
name-addressed title, consistent with the existing Part C GPT review. The single required repair was to
`E047b`'s date-provenance rationale; no target byte changed.

**Codex's batch-local deterministic results, returned `PASS — M4.64–M4.66 DETERMINISTIC CHECKS` on
2026-08-01:**

- **Official statement sentence counts for M4.64–M4.66: 2 / 3 / 3**, all within the one-to-three
  grammar, with zero backtick sentence openers.
- **Field lines: exactly `Kind`, `Status`, `Force`, and `Date` on each record**, with zero governed
  optional-field instances and zero governed paths.
- **Structure:** `E045`, `E046`, and `E047b` in the correct order; 65 contiguous live M4 records; M5
  and M6 unauthored; exactly one terminal manifest sentinel.
- **Repository shape at verification:** branch `codex/decisions-migration`, no upstream configured;
  zero staged and zero unstaged tracked changes; 30 preserved untracked files; `DECISIONS.md`
  unchanged from HEAD and from baseline.

**The batch-local deterministic obligation for M4.64–M4.66 is discharged.** Outstanding rows for the
complete Task 2 rerun are **43**, the records at M4.2–M4.44.

**Limitations preserved.** The earlier complete Task 2 run remains invalid, and a valid rerun over
M4.2–M4.44 remains owed. The later commission-required complete 65-record verification remains owed, as
does the complete constitutional-content review of all 65 live records and 13 wrappers. M5, M6, and the
derived date-occurrence report remain unauthored; formal ratification and Stage 2b remain unauthorized.

These are the manifest's only `T` entries. All three omit `Evidence`, `Owner`, and `Execution`, so the
batch contributes **zero paths** to the governed field-path population.

**Review dispositions and standing calls:**

- **`E047b`'s partition is cleared as authored and remains the batch's main risk surface.** Nothing
  ratified appears in the entry. The `temp` **floor** is here while the `temp` **ceiling** is at
  `R3#0`, which is the boundary a later seat is most likely to collapse; and `sao2` is carried while
  `spo2` is not, because they are different keys and only one was ratified.
- **`E047b`'s title is accepted.** It diverges from fixture `F6`'s illustrative
  `DBP and MAP ceiling sourcing`, which names a proper subset of the thread's scope.
  `Unresolved vital sanity bounds` is confirmed as the correct name-addressed title.
- **`E047b`'s date is independently established, and the earlier "only fixture-derived Part C date"
  characterization was wrong and is withdrawn.** `2026-07-24`, provenance class `EXPLICIT_SOURCE`,
  supporting source `S29`, confidence `HIGH`, with `C24` — commit
  `35b968e9dab9fb071ccffc5497283f9cb138df1b`, `2026-07-24` — as corroborating Git history. `S29` is the
  baseline at line 339 recording the Stage 3 closure on that date together with the DBP and MAP bounded
  sourcing authorization this thread carries. **The manifest supersedes provenance-report row 65's**
  `RATIFIED_RECORD` / `F06` / `FIXED` **classification**, which is non-authoritative; fixture `F06`
  remains illustrative grammar evidence and is not the effective-date authority. Two inconsistencies
  internal to that report support the supersession: row 42 classifies `E047a` from the same `S29` line
  and the same date as `EXPLICIT_SOURCE` / `HIGH`, and the report's own `C24` note marks `E047b`
  substantive while row 65's corroboration column omits `C24`. The `Date` field is unchanged.
- **`E045` splits `topic/category-specific` into two axes** under ruling 17, and carries the revisit
  condition's two conjuncts rather than merging them. Cleared as authored.
- **`E046` restores the mode names `test` and `adaptive` into the statement** under ruling 27, together
  with the forced `languageMode: "off"` and the three revealed surfaces the draft had dropped. Cleared
  as authored.
- **Ruling 32 was considered at `E045` and does not apply** — the instrument's three parts have no live
  owner to compare against, so ruling 18 governs unmodified. Recorded because the two rulings will keep
  meeting.

Provisional clearance authorizes manifest insertion only. Nothing here is formally ratified. The
M4.33–M4.38 batch received a `REVISE, narrowly` disposition; both required repairs landed, and a
confirming non-author read cleared the repaired bytes on 2026-07-31. It carries three divergences from
the reviewed drafts, recorded at rulings 23–25.

The M4.39–M4.44 batch received `REVISE, narrowly`, limited to one provenance phrase in `R3#0` item 12:
Pass 2, not the final frozen classification, recorded `E047c` as `X` / `REVISIT`. All six target
statements and field dispositions cleared source comparison; the phrase was repaired and the confirming
read cleared the batch. No new standing ruling was required.

**Part A is provisionally closed with one reserved exception.** Its assigned range was `P1#0` through
`P17#0`, 13 cores and 5 attachments. Seventeen of those eighteen blocks carry provisional non-author
clearance; `M4.4` / `P2#1` is authored, reserved, unadjudicated, and not cleared, and is routed to the
full 65-record, 13-wrapper constitutional review.

`P17#0`'s provisional clearance rests on the reviewing seat's conditional disposition of 2026-07-30,
discharged by byte-exact application of the two corrections that seat supplied: the restored
`rationale/dyad scoring` category in the statement, and this note's Task 3 repair. The reviewing seat
has since checked the applied bytes on live disk.

Next: **the commission-required full 65-record and 13-wrapper constitutional review**, under
`DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md` §5. M4, M5, and M6
are authored; Codex's deterministic verification of the M6 repair, the `Owner` anaphora repair, and the
reservation-recording repair are all complete; the confirming read of the three repaired `Owner` reasons
returned `CLEAR` on all three; and the reservation-recording confirmation returned `C1–C10 PASS or MATCH,
no advisory findings`. The derived date-occurrence report remains owed, is not authorized by any batch
clearance or by this review's commissioning alone, and is not generated until the review completes and
any resulting findings are adjudicated. Prior context,
under
`DECISIONS-MIGRATION-STAGE-2A-PART-C-AUTHORING-WORK-ORDER-2026-07-31.md`, which is closed-world and
supersedes this section's summary where the two differ — **except at its §7.1, whose
`Archive/DECISIONS-ARCHIVE-2026-07-31.md` literal is stale;** see the `MIGRATION_DATE` section below.
Target §7 is complete. Its three `T` entries are `E045`, `E046`, and `E047b` at M4.64–M4.66 in that
order.

The manifest now supersedes the Part C draft for all 28 Part C records; the draft and its GPT review
remain historical inputs rather than construction authority. That review's Part C boundary reminders
are inputs, not clearance: `E043a` carries only the live
`opus*` routing rule and the `claude_*` exclusion; `R3`/`E047c` carries the copied-envelope finding,
the 46.5 °C ceiling, and `EXECUTED`, excluding the temperature floor; `R5`/`E047a` carries the SBP
400 mmHg and RR 150/min ceilings, the SpO₂ 0% floor, the bedside-and-charted population, and the
fresh-survey prerequisite at `Execution: PENDING`, excluding DBP, MAP, temperature floor, and
laboratory SaO₂; `E047b` carries only the unratified sides. `E038` is name-addressed, dated
2026-07-28 per the owner override, and is the one entry whose `Evidence` may pin a Stage 2b output
under Amendment 1 Clause A.

Do not treat the Part B draft's body as current or post-repair — it is stale in all nineteen records it
carries, every one of which the manifest now supersedes. The live-source packet is ordered by source entry ID, so `E044` sits at
packet entry 36 rather than beside `E018`, and `E032` and `E036` are archive wrappers rather than live
blocks.

**Operative review method, retained for the complete 65-record review.** No further M4 authoring batch
exists. When reviewing any compressed source, enumerate every operative source limb and account for
each one explicitly as retained in the target statement, carried by another identified target entry, or
superseded by a named later source. A limb absent from both the target statement and every other
target entry is deleted, not compressed.

**Standing citation dependency.** `P20#0` carries the manifest's first name-addressed citation, `I:`
plus the backtick-delimited runtime-audio invariant title. If that title changes during Part C review,
this citation changes with it.

**Open flag carried into the next review — `P23#0`. Closed.** The record dropped four live limbs: the
per-part-submit and true-unfolding deferral with its named revisit condition; `flags` and `adaptive`
from the top-level-identity list; and always-visible global exhibits from stage visibility. All four
passed the Part B draft's own independent review. The producer seat flagged the first; the reviewing
seat found the other three on a final read and restored all four on 2026-07-30. The lesson generalizes
and is recorded at standing ruling 18.

**Open flag carried into the 2026-07-31 review — `P25#2`'s `Evidence`. Closed.** M4.31 removed
`Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md` from
`Evidence`, against the Part B draft, the Part D omission table, and the 2026-07-29 review that
accepted both. The reviewing seat cleared the removal on 2026-07-31 on the live file: that spec
authorizes an A/B experiment and is "not a reversal of any principle," records that the composite-trend
clause stays as written, and pins Route C with no visible flowsheet in ordinary use — so it is not
merely incomplete support for the migrated statement but the wrong authority for it, `E028` being the
later amendment that ratifies the visible flowsheet. Because `Evidence` is optional, omission beats a
materially misleading pointer. The lesson generalizes and is recorded at standing ruling 19.

`H8` returned `PASS` on 2026-07-30. The M4–M6 assembly pause is discharged and its stale pause language
has been removed. M0.4 is filled and contains no surviving measurement sentinel. The manifest contains
exactly one surviving sentinel: the terminal append-point sentinel reserved for the derived
date-occurrence report.

## Formal ratification gate

Formal Stage 2a ratification occurs only on the complete, sentinel-free manifest bytes and only after
all of the following:

1. M4, M5, and M6 are complete.
2. The derived date-occurrence report is generated, mapped, validated, embedded, and re-derived.
3. Codex completes the post-assembly deterministic verification.
4. A non-author seat performs the full constitutional-content review of all 65 live records and all 13
   archive wrappers.
5. Luke ratifies the complete exact manifest bytes.

Provisional batch review is not formal ratification. No count of cleared batches advances the gate, and
no batch clearance authorizes Stage 2b or any edit to `DECISIONS.md`.

## In-place assembly rule

M4, M5, and M6 are authored in place above M7 in
`audit/decisions-migration-2026-07-29/target-text-manifest.md`.

The terminal append-point sentinel is reserved for the derived date-occurrence report. It is never the
insertion point for M4, M5, or M6.

## Open deterministic defect — Codex Task 2 is invalid

The deterministic-prerequisites results of 2026-07-30 report `P16#0` at two statement sentences. The
real exported `countStatementSentences` returns three against the unchanged Part A source: `…permutation.`
followed by a space and an uppercase `D`; `…canonical items.` followed by a space and an uppercase `I`;
and a terminal `…remediation.`

Three sentences is grammar-conformant, so no record is blocked. What is blocked is the run's
`Blocks outside {1,2,3}: none` claim, because the same extraction could undercount a four-sentence
statement to three, which is the direction that fails.

**Task 2 is therefore treated as invalid rather than as one wrong row.** Codex must rerun the complete
65-row command and retain raw stdout before any `PASS` or `GREEN` disposition is restored. The current statement bytes at M4.28–M4.43 differ from the Part B or Part C draft text that run
measured and carry no measured count tied to those bytes. `M4.44` keeps the Part C draft's wording but
rewraps one line, so it is not byte-identical either; its measured count is nonetheless unaffected,
because `countStatementSentences` tests `/\s/u` at a candidate boundary and therefore admits a newline
exactly as it admits a space. It remains in the complete rerun population because the run itself is
invalid. The corrected
distribution is provisionally 1 = 5 / 2 = 24 / 3 = 36, and that holds only if no other row is wrong.
Task 1 is unaffected by this defect. Task 3's per-path verdicts survive it too, but Task 3 is
separately stale for an unrelated reason recorded at standing ruling 11.

## Standing rulings from the Batch 1–4 sessions

1. **Order adopted at M4.0.** The block-grouping worksheet §5 candidate order was explicitly adopted by
   the architect seat rather than inherited from the scaffold.

2. **Item 13 uses the two-part form.** Every `E037` merge record shows the source rule and the exact
   carrying clause in the target statement, byte-exact through terminal punctuation. Applies to `P2#0`,
   `P5#0`, and `P8#0`.

3. **Item 14 carries every contributing source span**, not only the primary source entry.

4. Use “legacy anchor line”, not “legacy line,” because a cited range may extend beyond the named
   physical line.

5. Every `Authorized`, `Not authorized`, `Evidence`, `Owner`, and `Execution` field occupies exactly one
   physical line. Statement paragraphs may wrap; field lines may not.

6. **Item 12 rationale normally runs two to three sentences.** It is manifest review evidence, not
   governed target text.

7. **Migration may not silently widen scope.** `P7#0`'s proposed “audit or review” wording was rejected.
   Expanding a governed population requires affirmative owner ratification.

8. **`E037` rule 2 carries the same scope and obligation in `P2#0` and `P5#0`:**

   `every active generation lane declares its producer provenance and its independent-review routing.`

   Preserve sentence-position capitalization in the exact target clause: uppercase at the beginning of
   the `P2#0` sentence and lowercase inside the `P5#0` sentence. The two clauses are therefore not
   byte-identical, and item 12 on `P5#0` says so.

9. **`P6#0` omits `Evidence`** because no single eligible tracked repository path supports the complete
   statement. Partial support from `AGENTS.md` does not satisfy the complete-statement policy.

10. **`P5#1` may generalize the constitutional floor to named-model policy** because `P31` separately
    carries the current model-specific restrictions.

11. **A tracked path that owns the mechanism does not earn `Owner` if it does not own the whole
    statement.** `P15#1`'s `Owner` was removed even though `scripts/patch-raw.ts` is tracked and owns
    the field-path mutation mechanism, because the third sentence carries the `P26` preserved-surface
    proof, which is enforced independently of the operation's own declaration and whose surface is named
    per work unit. This is the same complete-statement standard applied to `P6#0`'s `Evidence`. `P15#0`
    keeps its `Owner`. Consequence: the deterministic-prerequisites Task 3 artifact is now stale. It
    still records 25 path rows and 24 `TRACKED`, and it still carries `P15#1` and `P25#2` rows; after
    both removals the current population is provisionally 23 rows and 22 `TRACKED`. Task 3 must be rerun or explicitly superseded
    before its artifact is treated as current. The surviving per-path verdicts for the remaining paths
    are unaffected.

12. **The Part A–D drafts are preparatory, not authorities.** Where the manifest diverges from a draft's
    field list or omission register, the manifest governs and the record states the supersession
    explicitly.

13. **An omission the drafts never considered is still an architect decision that must be reasoned in
    place.** `P15#0` and `P15#1` had no rows in Part A's omission register; their `Evidence` omissions
    are decided in the manifest and say so.

14. **A retained advisory consequence is not compressible.** `P16#1` restored “per-file distributional
    verdicts remain authoring-hygiene advisories only,” because the disposition of per-file verdicts is
    a live rule and is not derivable from the non-inheritance clause alone.

15. **A name-addressed citation is delimited by backticks, not quotation marks.** The target-mode
    matcher in `scripts/decisions-reference-graph.ts` is:

    ```
    /(^|[ \t\v\f(\[{])([IT]): (`+)(.+?)\3(?=$|[ \t\v\f.,;:!?)\]}])/g
    ```

    The title must sit inside a backtick run; the citation must be preceded by start-of-line or one of a
    small whitespace/bracket set, and followed by end-of-line or one of a small punctuation set. A
    quoted title produces no citation edge while looking like one, which is worse than a plainly
    descriptive reference. The citation must also not be split across a physical line, because the
    matcher runs per line.

16. **A statement that asserts two things differ must say in what respect.** `P19#0`'s third sentence
    was replaced because stating only that the two traversals are separate left no checkable rule; the
    membership fact — rationale figures inside the shared projection, outside the census population —
    is what the separation means.

17. **A slash-joined source pair is two limbs until proven otherwise.** `P21#0` restored “clinical scope
    and monitorability” after a draft merged them into “clinically monitorable stems.” Compare
    `P17#0`'s `rationale/dyad scoring`, where the slash pair is a single named family and must not be
    split. Neither shape is decidable from the punctuation; both require reading the source.

18. **A deferral with a named revisit condition is a live scope boundary, not chronology; and an
    enumerated source list is carried complete or not at all.** Both are the same defect class — the
    dropped live limb — which is the dominant defect of this session. Confirmed instances: `P16#1`'s
    advisory-only disposition of per-file verdicts; `P17#0`'s `rationale/dyad` category; `P19#0`'s
    membership fact; `P21#0`'s clinical-scope limb; and, in `P23#0` alone, four — the per-part-submit
    deferral, `flags` and `adaptive` dropped from the top-level-identity list, and always-visible global
    exhibits dropped from stage visibility.

    `P23#0` is the cautionary case. All four of its omissions passed the Part B draft's own independent
    review, and each was found only by reading the source against the target limb by limb. Fluent,
    plausible compression is exactly what this defect looks like from the outside.

    **Method.** Enumerate the source's operative limbs before compressing, and account for each one as
    retained, carried by another identified target entry, or superseded by a named later source. A limb
    absent from both the target statement and every other target entry has been deleted, not compressed.

19. **A clause-scoped source citation is not whole-entry `Evidence`.** Where the legacy text attaches a
    path to one clause with `per <path>`, promoting it to the entry's `Evidence` asserts support the
    source never gave. `P25#2`'s `Evidence` was removed on that ground and on the stronger one that the
    cited document ratifies the opposite of a limb the statement carries. Test a candidate against the
    whole statement and against the document's own scope statement, never against its title.

20. **A superseding amendment must say what it does not supersede.** `P25#2` restores two bounding
    limbs the draft dropped: the superseded panel geometry is retained as the fallback arm, which is
    what makes the supersession one of the default only, and every fence of the core carries over
    unchanged. Without them the amendment reads as unbounded, and the bound is the part a later reader
    needs.

21. **A term of art carries its definition or it carries no rule.** `P25#0` restored the definition of
    a value-complete artifact as one already carrying every exact value the item turns on, the
    single-timepoint-tally discriminator that makes the artifact-level gate checkable, and the
    pattern-only rule for item briefs on a waived kind. A statement that uses a defined term while
    dropping its definition is fluent and unenforceable, which is ruling 18's defect in a different
    coat.

22. **Where a source expressly scopes a neighbouring principle away from a limb, that limb is carried
    here or it is deleted.** `E027` says sparse cardinality is not a validity floor for composite trend
    artifacts, and says in the same breath that this does not run under `P29`, which stays scoped to
    `lab_trend` and `structured_labs_panel`. The draft dropped the limb entirely and nothing else
    carries it, because the source itself forecloses the obvious carrier. A source that pre-empts a
    cross-reference is signalling that the limb is load-bearing, not redundant.

23. **`Owner` and `Evidence` have different tests, and target §1 now says so.** This ruling refines the
    complete-statement language **for `Evidence` only**; `Owner`'s whole-statement test at ruling 11 is
    untouched and still governs. `Owner` names the one tracked path that owns the whole live statement.
    `Evidence` names the one tracked source carrying the evidence, measurements, provenance, or method
    the statement is forbidden to restate, and it may not contradict or materially misrepresent any
    limb the statement keeps. M2's target §1 bytes previously imposed one whole-statement test on both
    fields, which their different jobs cannot both satisfy; that contradiction was repaired on
    2026-07-31 and is now M2's third recorded legacy-prose defect. `P29#0` and `P30#0` retain
    `Evidence` under the corrected text, each verified by reading the cited file on live disk. `P6#0`,
    `P26#0`, `P27#0`, and `P28#0` still omit it, because no tracked file carries their compressed-out
    substance. **This does not reopen `P25#2`,** whose removal rests on contradiction and
    clause-promotion and fails under either reading — ruling 19 survives intact as the
    anti-contradiction rule. Where the evidence document does not record a limb the statement keeps —
    `P30#0`'s anticoagulation disposition — that limb is stated in the entry rather than delegated,
    and the record says so.

24. **A ruling's closing non-authorization goes in `Not authorized`, not into compression.** Format
    specification §2's field table makes `Not authorized` optional free text with no force
    restriction, so a `BINDING` `P` may carry it; fixture `F1` already demonstrates one on a `P25`
    block. `P29#0`'s "authorizes no schema, bank-content, renderer, or runtime change" and `P30#0`'s
    unauthorized learner-visible flag were dropped by the reviewed draft and are restored into that
    field. This keeps the statement inside the one-to-three-sentence grammar without deleting a live
    boundary, and it is why `Evidence` can qualify on both entries under ruling 23.

25. **A conjunction is scope, and so is a predicate — repairing one is not licence to restate the
    other.** `E074` rejects a row whose reconciliation "is not pair-specific **and** does not quote the
    keyed rule." The Part B draft rendered the connective as "or," which widens the auto-reject
    population. This seat repaired the connective and, in the same sentence, restated the second test
    as "a quotation of" the rule — which narrows it, because a reconciliation may quote the rule
    without being a quotation. The reviewing seat caught the second drift on 2026-07-31; `P31#0` now
    carries both operative tests and their conjunction in the source's own words. This is ruling 7
    operating at the level of single words, which is where it is hardest to see, and the near-miss is
    the lesson: **a seat rewriting a clause to fix one drift is at its most likely to introduce
    another,** because it is already touching bytes it had decided were load-bearing.

26. **Do not begin a statement sentence with a backtick.** The exported `countStatementSentences`
    splits on a terminal period followed by whitespace and an uppercase letter, so a sentence opening with
    a backticked identifier is not counted and a three-sentence statement measures as two.
    Undercounting is the direction that fails. **Precision added 2026-07-31 from a live read of
    `lib/decisions-format.ts`:** the boundary test is `/\s/u`, not a literal space, so a sentence
    boundary that falls at a line wrap still counts and no statement needs rewrapping to measure
    correctly. The backtick hazard is unchanged, because the character examined after the whitespace
    run must be uppercase and a backtick is not. `P28#0` was reworded to open "A `case_study` is a
    delivery container" for this reason. Found 2026-07-31 while authoring M4.35; it is an authoring
    hazard rather than a governance rule, and it is recorded here because this list is what a seat
    actually reads.

27. **A limb that survives only in the title has left the governed text.** A name-addressed title is a
    citation identity and an index summary; it is not the statement, and the format checker never reads
    it as one. The Part C draft for `E057` moved the parse-time-gate limb into the title and dropped it
    from the statement, which reads as complete because the reader has just seen the heading. Restored
    at M4.50 as the statement's first clause. **Test:** cover the heading and reread the statement; if a
    rule disappears, it was never in the entry. Found 2026-07-31 while authoring the first
    name-addressed batch, and it is a hazard specific to `I` and `T`, where title and statement say
    similar things.

28. **Ruling 11 turns on independent enforcement, not on coverage.** `Owner` is defeated by an outside
    limb that has **its own enforcement surface in another tracked path** — which is what `P15#1`'s `P26`
    preserved-surface proof had. It is not defeated by a clause that has no enforcement surface anywhere,
    such as a classification or a stated reason. `E056` keeps `Owner: src/schema.ts` on that ground at
    M4.49, even though the file cannot enforce "a navigational label rather than study content"; if
    rationale defeated `Owner`, no entry carrying its own reason could ever hold the field. `E043a` loses
    `Owner` at M4.46 on the opposite ground: its `claude_*` reviewer-routing limb is enforced by
    `reviewerFor` in `scripts/audit/build-audit-batch.ts`, a different tracked path. Both calls are
    flagged in place for the non-author reviewer rather than presented as settled.

29. **Narrowing a term is the same defect as widening a population.** The Part C draft rendered the
    source's `CJK` as "Chinese" for `E056`. `src/schema.ts` rejects on "no CJK characters", which is
    broader than Chinese, so the draft's wording would have shrunk a governed population by a word.
    Ruling 7 forbids widening without owner ratification; the mirror case needs saying out loud, because
    narrowing looks like precision. **A migration may not resize a governed population in either
    direction.** Related to ruling 25's near-miss, and found the same way: by reading the code the
    statement describes rather than the draft that describes the code.

30. **Manifest prose must not gratuitously restate the migration date.** Manifest M7.5 already forbids
    the derived report from carrying literal dates, so the report cannot become its own occurrence
    population. The same logic binds record rationales: a date literal typed into item 12 creates a
    date-dependent span that some `D` family must then claim and some future re-render must then find.
    This seat introduced one while authoring M4.45 and removed it in the same session. **Refer to the
    field line; do not repeat its value.** The corollary is `D6` itself: a date-dependent surface can
    live in the manifest's own governance prose, not only in target output, and a family set derived
    from target-document surfaces alone will under-cover the census.

31. **Search the governing draft for the question before recording it as open.** M4.45 recorded a
    one-byte span difference as an unresolved preservation risk. Part D §8.3 had already resolved it in
    terms — the extra byte is the following blank line, which the preservation slice excludes because
    the archive supplies its own framing. The authoring seat had Part D open and read §1.2 for the
    statement and §8.1 for the date surfaces, but never searched it for the span question the record
    itself was raising. **Reading a draft for what your record needs is not the same as searching it for
    what your record doubts.** A finding recorded as open when the governing draft has closed it is not
    a harmless excess of caution: it spends a reviewer's attention, and it invites a later seat to
    "resolve" a settled boundary. Found by the 2026-07-31 non-author review of M4.45–M4.50.

32. **A source-listed set is compared with its live owner before it is migrated.** `E069`'s source
    names `Skin & Wound Care` and `Transfusion & Blood Products` as the shared topics. A live
    read of `src/topics.ts` found `SHARED_TOPIC_CATEGORY` holding **eight**, so migrating the source's
    pair into the target statement would have frozen a stale subset and narrowed the governed population
    by six. That is ruling 29's defect reached through **fidelity to the source** rather than through
    paraphrase, which is why the usual defence — that the target says what the source says — does not
    answer it. **Rule:** where a source list corresponds to live data owned by a tracked path, compare
    the list with the live owner; if the populations differ and the target entry states a current
    invariant, name the owned container and let `Owner` locate it rather than freeze the stale source
    subset. **This licenses no inference that a list capable of later growth was illustrative when
    written.** The source's pair may have been the entire population on the day it was authored, and the
    entry is repaired because the population moved, not because the source was loose. Ruling 18 still
    governs a list with no live owner to compare against, so the comparison is the step that decides
    which ruling applies, and it cannot be replaced by reading the punctuation. Found 2026-08-01 while
    authoring M4.62.

33. **A ground vocabulary that cannot name its field will collapse the two field tests.** M6's omission
    register was authored with one ground list serving both `Evidence` and `Owner`, and within a single
    pass it was applying one complete-statement test to both — citing ruling 23, which says the
    opposite. The vocabulary made the correct distinction inexpressible, so the register could not
    record it and no mechanical check could detect its absence. Repaired 2026-08-04: every §M6.1 ground
    now declares the field it may serve — six `Owner`-only, four `Evidence`-only, five both — and an
    `Evidence` row carrying an `Owner`-only ground is now a defect a script finds. **The collapse
    reaches back into the drafts.** Part A recorded `P4#0` and `P7#0` as *joint* `Evidence, Owner`
    omission rows under a single reason, and that reason is `Owner`-shaped; a joint row carrying one
    field-shaped reason discharges one field and silently inherits to the other. Both are now grounded
    separately at §M6.7, which is why that population grew from eight rows to ten. **Rule:** where two
    fields have different tests, the vocabulary that classifies their dispositions carries the field as
    data, and a register row is never shared between them. Found 2026-08-04 by the pre-handoff review
    of M6.

34. **A mechanical search over reasoning prose yields a candidate population, never a finding
    population.** The M6 repair pre-census swept the item-10 `Evidence` reasoning of all 65 records for
    `Owner`-shaped literals — `owns`, `owned by`, `one-path grammar`, `no single tracked path` — and
    returned 27 hits, 21 of them outside the already-known repair set. Nineteen were correct `Evidence`
    reasoning that happened to use the verb: "no measurement, provenance, or method a separate tracked
    **source owns**" governs a source owning substance, which is exactly the test ruling 23 states. Two
    more turned on the one-path grammar, which constrains both fields alike. Only two were the collapse.
    **That narrowing from 21 to 2 is architect judgment, and it is recorded with a per-record ground at
    revision 4 §2.1 so the confirming review can challenge it rather than take it on trust.** The
    failure mode runs both ways: a seat that treats the hit list as the finding list repairs correct
    text, and a seat that narrows silently presents a judgment as a measurement. **Rule:** report the
    search population and the retained set separately, and state a ground for every exclusion. Found
    2026-08-04 while triaging the Task E expansion set.

35. **A byte-identity proof over a substring proves the substring did not move; it does not prove the
    substring still says what it said.** The 2026-08-04 repair replaced the item-10 `Evidence` prose at
    fifteen records. At `M4.3`, `M4.7`, and `M4.11` the `Owner` disposition immediately following it read
    `OMIT`; same reason — an anaphor whose referent was the clause the repair had just replaced. The
    allowlist opened the antecedent and closed the anaphor, so the verification correctly reported the
    `Owner` bytes unchanged while their meaning had silently moved: each now inherited an
    `Evidence`-specific ground that does not support its `Owner` classification at M6.3. **Rule:** a field
    disposition never states its ground by reference to another field's disposition where the two fields
    have different eligibility tests. `Evidence` and `Owner` have different tests — target §1 and ruling
    23 — so a reason written for one is never inherited by the other through an anaphor, and where a
    single ground genuinely serves both fields each disposition still states it in its own terms.
    Governed reasoning is self-contained at the level an allowlist can open, because an allowlist's unit
    is the substring.

    **The verification consequence, which is the sharp end.** Where an allowlist opens text that another
    closed substring depends on, byte identity is not sufficient evidence and a reading seat must
    adjudicate the pair. The 2026-08-04 verification was **correct within its commission**; the gap lived
    in the commission's design, not in its execution — the same shape as the specification-drift
    observation at `M6-REPAIR-REPORT-2026-08-04.md` §8.3.

    **What this ruling does not license.** It reaches the anaphor whose antecedent was *replaced beneath
    it*. It does not by itself adjudicate an anaphor whose antecedent is unchanged, and **it must not be
    read as certifying any surviving inherited reason**: requiring self-contained field reasoning and
    clearing an inherited reason are incompatible positions, and this ruling takes only the first. An
    unchanged anaphor is owed an adjudication, not settled in either direction. `M4.4` / `P2#1` carries
    one and is reserved, without adjudication, for the full constitutional review.

    **Enforcement.** Ruling 34 governs this ruling's own application: a mechanical search for the
    construction returns a candidate population, never a finding population. Each candidate is
    adjudicated on its record's own two grounds and its actual antecedent prose, with a stated ground for
    every exclusion. Found 2026-08-05 by the GPT confirming read of the M6 repair; repaired the same day
    under `DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md` revision 3.

36. **A semantic receipt discharges its commission only if it proves contact with the commissioned
    bytes.** On 2026-08-05 the confirming read commissioned at revision 3 §10 over the three repaired
    `Owner` dispositions returned a receipt whose branch, HEAD, and no-mutation statements were all
    correct and whose substance was not. It adjudicated `M4.5` and `M4.6`, which no order had opened; it
    described dispositions no Stage 2a artifact contains; and it certified a repaired sentence at an
    *old principle 35* that carries no identifier in the corpus and whose bytes Codex's V1 round trip had
    already proven unchanged. **Rule:** a receipt on a reading commission pins the artifact by byte
    length and digest, names the records it was commissioned over, and quotes each live subject substring
    it adjudicates. A receipt that adjudicates a record outside the commissioned set, or that asserts a
    mutation the pinned artifact does not contain, is **void for the whole commissioned scope** and
    discharges nothing — not merely defective on the offending entry.

    **Why the whole scope, and why correct metadata does not salvage it.** Repository identity — branch,
    HEAD, staged and untracked state — is available without reading the subject, so its correctness is
    evidence about the seat's repository access and about nothing else. Agreement that happens to be
    right elsewhere is not evidence either. Once a receipt is shown to adjudicate records it was not
    given and to certify bytes that did not move, no seat can determine which of the remaining entries
    were read from disk and which were composed, and an adjudicating seat that keeps the entries naming
    in-scope records is selecting on the only criterion the defect has already defeated.

    **What quotation proves, and what it does not.** Quotation is a contact test, not a review. A receipt
    that quotes every subject correctly and reasons badly about it is a bad review, adjudicated on its
    merits and returnable as `REVISE, narrowly`. A receipt that cannot quote them has not reached the
    merits at all. The two failures are separate, and **the contact test never substitutes for the
    substantive one**: a commission is not discharged by quotation, and a seat that quotes its three
    subjects and then reasons from a ground it did not read has satisfied this ruling and failed its
    commission.

    **The disposition carries no finding of bad faith.** Voiding states what the receipt proves, not why
    it reads as it does, and this ruling requires no account of the latter. Re-routing after a void
    receipt is a routing judgment made on the work owed and the time available; it is not a sanction and
    no seat is disqualified by one.

    **Enforcement.** A commission requiring a semantic receipt states the pins and the quotation
    requirement in the order itself, so the contact test is mechanical for the receiving seat and for the
    adjudicating one. An order that asks for a reading judgment without pinning what was to be read
    leaves the adjudicating seat nothing to test against, which is the condition that let this receipt
    travel as far as it did. Found 2026-08-05 on the void confirming read of
    `DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md` revision 3.

37. **A read-only recovery of a superseded null is not a write, and a sole-write constraint is a
    constraint on object creation and ref movement.** The 2026-08-05 confirmation reproduced a pre-repair
    null it had not been handed, under a commission authorizing exactly one file write. That is
    answerable, and the answer is mechanical rather than a matter of trust: the null existed as a Git
    blob before the run, `git cat-file` enumeration reads existing objects, and no object was created, no
    ref moved, and no index changed. **Rule:** a verification seat may recover a superseded artifact from
    existing repository objects, and must report the object ID and its own independent measurement of the
    recovered bytes. It may not create an object — `git hash-object -w`, `git add`, `git stash`, and any
    ref update are writes and are forbidden where the commission authorizes one file write.
    **Corollary, narrowed to what the mechanism actually supports:** where the architect seat cannot
    hash, a pre-edit digest recorded by a hashing seat is a convenience and not the only route to a
    reversal proof, so a lost or unrecorded null **may** be recoverable — never automatically, and only
    where a pre-existing, independently-verifiable repository object can be located for it. Recovery is a
    per-case finding, not a standing guarantee that every lost null has a surviving object; most will
    not. Where no qualifying object exists or can be independently verified, the evidentiary gap remains
    a blocker under §10, exactly as it would without this ruling,
    and object creation to manufacture one remains forbidden under a sole-write commission. A seat that
    recovers a null this way says so in the receipt, with the object ID and its own independent
    measurement, rather than presenting the null as if it had been supplied. Found 2026-08-06 on the
    provenance question raised against C8.

38. **A byte range cited in an order is taken from the authoritative record, never from a derived
    surface or a search preview.** The `M4.35` sentence-count repair order §5 cited baseline `E033` at
    `[42737,43333)`. That range is one operative paragraph lifted from a truncated search-result preview
    of `DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md`. `E033`'s authoritative span is
    `[42598,44464)`, recorded at the manifest's own `M4.35` item 14 — on disk, one read away, and
    already the governing record. The narrow range does not contain the delivery, capacity-warning, or
    visual-inventory limbs that the same §5 expressly asked the confirming seat to check, so the order
    directed a seat to verify limbs against a slice that cannot evidence them.

    **No harm resulted, and the reason it did not is the point.** The confirming seat noticed the
    mismatch, read against the complete operative `E033` text, and **disclosed the departure in its
    receipt** rather than either failing the questions or silently widening scope. That is the correct
    handling of a defective order by an executing seat: read what the commission's questions actually
    require, and say so. A seat that had instead answered questions 3's delivery limbs from the narrow
    slice would have produced a fluent receipt certifying limbs it never reached — ruling 36's failure
    reached through obedience to a bad citation rather than through inattention.

    **Rule:** where a manifest record already pins a source span at item 14, an order about that record
    cites item 14's span. Candidate-regions files, live-source packets, and prior receipts are
    navigational aids; they are not span authorities, and a range read out of a truncated tool preview
    is not a measurement. **Corollary for the issuing seat:** an order is hash-locked and immutable, so
    a citation defect in it cannot be repaired in place and is discharged only by the executing seat
    noticing — which makes the authoritative-source discipline load-bearing at authoring time rather
    than at review time. Found 2026-08-07 by the GPT confirming read of the `M4.35` sentence-count
    repair; the defect is the architect seat's, in an order it authored.

39. **An order may only ask a seat for what that seat's own rules let it decide, and a field no check
    compares must be decidable from the rule alone.** The date-occurrence census order asked Codex for a
    `construct` column drawn from `filename` / `path` / `table-cell` / `field-value` / `prose` — while the
    same order barred Codex from every act of classification, because `M7.5` step 2 reserves surface
    assignment to the architect seat. It also asked for a `record_item` defined as "the item number" for
    `M4` records and "the wrapper field name" for `M5` wrappers, which is not total: `M5.5.1` alone
    carries spans in its item-3 heading, item-4 `Date` field, item-8 archive-index line and pointer
    anchor, and item-12 rationale, and none but the fourth has a field name.

    **The sharp end is that no check would have caught either.** The order's own dual-derivation
    requirement compares **offset sets**, which is right for its purpose — proving population
    completeness. Two conforming implementations could therefore return different `construct` and
    `record_item` values on every row and still compare equal. Where a cross-check's comparison surface
    is narrower than the fields the order requests, determinacy has to come from the drafting, because
    nothing downstream supplies it. **Rule:** for each field an order requests, name the seat that
    decides it, confirm that seat is permitted to decide it, and confirm the rule is total over the
    actual population — or drop the field.

    **Second limb: a rationale may not promise what its mechanism only contingently delivers.** The
    repaired column, `container`, is positional — `sentinel-line` / `fenced-block` / `heading` /
    `table-row` / `prose` — and revision 2's rationale claimed it preserved the distinction step 3 needs,
    a fenced span being target or wrapper bytes and a prose span being this manifest's governance text.
    That correspondence does hold across the current file — all 311 fenced blocks sit in M2, M3, M4, or
    M5.5 — but nothing enforces it, and stating it invited step 3 to read a surface classification off a
    syntactic test. Removed at revision 3, with the observation retained and expressly stripped of
    authority.

    **Third limb, on adjudicating review returns: accept or reject the finding and its ground
    separately, and record both.** The `record_item` defect was raised at the **revision-1** review on a
    ground that was stated and verified: revision 1's wrapper-field-name rule was not total over the
    numbered `M5.5.x` records, since spans occur in numbered items — heading, `Date` field, archive-index
    pointer, boundary rationale — that are not wrapper fields. That finding was accepted on that ground,
    which held. A **separate, later** review at **revision 2** challenged the semantic force claimed for
    `container`, the positional field this seat introduced in the same repair pass and that no review had
    asked for. That second challenge was raised on a ground that was false against live disk — that
    `M5.5.1`'s item-8 archive-index line and pointer anchor are unfenced prose. They sit inside a
    `` ```text `` fence, as do M4 item-7 headings, item-8 statements, item-9 field lines, and item-11
    index rows; the stated counterexample does not exist and the rule would have returned `fenced-block`
    for those spans. The proposed narrowing of `container` was accepted anyway, on the different and
    stronger ground above — that the fence/prose correspondence is an observed contingency, not one the
    positional rule enforces.

    **The two episodes are separate reviews of separate fields, and this note first ran them together.**
    A drafting pass that fuses "a finding was raised and correctly accepted" with "a different finding was
    raised on a ground that turned out false" into one sentence produces exactly the artifact this limb
    warns against: a later seat reading it would conclude the `record_item` finding's ground was
    disproved, when the disproved ground belongs to the `container` finding instead. Corrected the same
    session, on a GPT read of the live resume note that caught the fusion. A receipt trail that records
    "finding accepted" without recording *which* finding and *whose* ground was disproved leaves a later
    seat reasoning from a fact nobody verified. Found 2026-08-07 at pre-lock review of the
    date-occurrence census order, across revisions 1 to 3; all defects are the architect seat's, and all
    were repaired before hash-lock rather than surviving into an immutable instrument.

## MIGRATION_DATE — RESOLVED by owner act, 2026-08-06

**`MIGRATION_DATE` is `2026-08-18`.** Bound by Luke (owner) on 2026-08-06, superseding the `2026-08-11`
candidate bound on 2026-07-31. Record:
`DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-08-06.md`. The 2026-07-31 supersession
record is retained unaltered apart from a superseded-by notice; the 2026-07-31 owner act is not
rewritten, and that record's own §3.1 clarification remains current authority and is cited rather than
restated below.

**Act class: pre-ratification candidate supersession, not a Clause B rebinding.** Unchanged from the
2026-07-31 finding: no ratified manifest authority exists under commission §12, so the interval the
2026-07-31 §3.1 clarification describes is still open and this act falls inside it. Exact clarification
text: `DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-07-31.md` §3.1.

**Surfaces re-rendered: 63, across six already-authored date-dependent families.** Population confirmed
against live disk before editing and cross-checked against Codex's independent 2026-08-05 count of the
same literal (`M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md` V6). Unlike the 2026-07-31 act, which
pre-dated M5 and touched only the header region, M5 is now fully authored: `D6` (header binding
declaration, 1), `D1` (archive-filename occurrences other than `D5` — M0.1, the `E053`
structural-introduction sentence, each of the 13 wrappers' index pointer, the M5.6 duplicate block, and
the four filled M5.7 register rows, 32), `D2` (the nine non-retiring wrappers' `Date` field, 9), `D3`
(the nine non-retiring wrappers' `archived …` index phrase, per-record and again in M5.6, 18), `D4`
(archive preamble title and body, 2), `D5` (`E038`'s `Evidence` at M4.45, 1). Full family table and
per-family reasoning: supersession record §4. **No completed live-block record's statement, field
disposition, title, index row, span, hash, or anchor changed** — only the date-dependent bytes named
above. The four retiring wrappers' `Date` fields, their index-line `retired 2026-07-28` phrases, and the
register's four retirement dates are untouched; only the pointer filenames inside those same lines moved.

**Census repair, already established and unchanged by this act.** Family `D6` was added at manifest
M7.2a by owner direction on 2026-07-31 and continues to claim the header's bound-value span only, not
the owner-act date or record filename on the same lines, which are fixed per-act facts. This act's
header declaration therefore carries three changed sub-parts together — the bound value, a new owner-act
date, and a new record filename — because all three describe *this* act; a future third supersession
would not reopen `on 2026-08-06` any more than this act reopened `on 2026-07-31`.

**Downstream staleness.** Two resume-note surfaces were repaired under this act, both as owner-act
status-log maintenance performed before the full-review order's revision-1 identity was taken and closed
under that order rather than as an edit made under it: this section, and the `**Schedule constraint.**`
paragraph in the `## Next session` block above, which now reads `2026-08-18` and a twelve-day owed-work
list as of the 2026-08-06 landing date.

**The predicate is still a predicate.** `2026-08-18` is a candidate, checked against the Stage 2b content
commit's author timestamp in `America/New_York` and re-checked at the final pre-merge state. It is never
reconciled by editing the filename alone. No seat may select, infer, or default a further replacement;
any further change is again an owner act.

### The finding that forced the supersession, retained

The `2026-08-11` candidate could not satisfy its own predicate inside the time remaining. At the time of
this act all 65 M4 records, M5, and M6 are authored and Codex-verified through the reservation-recording
confirmation; still owed, every one of them before a Stage 2b content commit can exist, are: the
commission-required full 65-record and 13-wrapper constitutional review, commissioned to Codex the same
day and not yet executed; adjudication of its findings and any resulting repair; the Task 2 rerun over
the 43 records at `M4.2`–`M4.44`; the Task 3 rerun or explicit supersession; the six-step derived
date-occurrence report; Codex's post-assembly deterministic verification; and the owner's exact-byte
manifest ratification. The predicate will therefore not hold for a `2026-08-11` author date. Full
reasoning: supersession record §2.

## Repository-state warning

Every Stage 2a artifact — this note, the manifest, the Part A–D architect drafts, the live-source
packet, the commission amendment, the GPT review files, and the deterministic-prerequisites results —
is **untracked** in the local `codex/decisions-migration` worktree. None of it is recoverable from the
recorded branch HEAD `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`, and none of it exists on any remote.

The next session must not run any cleanup, reset, checkout, stash, or `git clean` operation, must
preserve every untracked migration file, and must not assume this work is recoverable from git. Losing
the worktree loses the whole of Stage 2a.

## Inputs already on disk

No further Codex measurement is owed for authoring the M4 live-block records. Codex's post-assembly
deterministic verification remains owed, and the Task 2 rerun above is now owed as well.

Available inputs include:

- Header pins `H1`–`H9`, inserted at M0.4.
- Archive-wrapper offsets, hashes, and lengths in
  `DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md`.
- `Evidence`/`Owner` existence and trackedness results in the deterministic-prerequisites output, whose
  population, totals, and `P15#1` row are stale after the `Owner` removal recorded at ruling 11.
  Sentence counts in that same output are under the Task 2 defect above and must not be relied on.
- Statements, fields, index rows, block keys, and omission candidates in the Part A–D architect drafts.
- Legacy byte spans and verbatim source in `DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md`.
- `E037` rule spans and text in the candidate-regions file.

## Review status

All 65 M4 records at M4.2–M4.66 are authored, and sixty-four of them — 65 less the single reserved
record — carry provisional non-author clearance. **`M4.4` / `P2#1` is the sole exception: authored,
reserved, unadjudicated, and not cleared**, routed to the full 65-record, 13-wrapper constitutional
review. M4.33–M4.38, M4.39–M4.44,
and M4.45–M4.50 were each cleared on 2026-07-31, and M4.51–M4.56, M4.57–M4.63, and M4.64–M4.66 on
2026-08-01, in
every case after a `REVISE, narrowly` disposition and a confirming read of the repaired bytes;
M4.45–M4.50, M4.51–M4.56, M4.57–M4.63, and M4.64–M4.66 each carry Codex's batch-local deterministic
results.
Producer≠checker attaches to whichever
seat produced, never to a model name, so the seat that authors a batch never clears it and a later
Claude instance reviewing its predecessor's output does not satisfy the rule.

The commission-required full constitutional-content review of the complete 65-record, 13-wrapper
manifest has not occurred and remains owed before ratification. Batch review does not certify the
complete manifest or eliminate that final review.

Every remaining target statement is architect-authored compression and must receive non-author review
before formal ratification.

**Open recommission, hash-locked 2026-08-07.** The Codex fresh full constitutional review
(`FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md`, overall `ACCEPT`) was not ratified as written. An
independent GPT audit found, and the architect seat independently confirmed against `git show
MIGRATION_BASELINE:DECISIONS.md` §8, that four of the 78 reviewed units carry incorrect operative-limb
disposition language in the Tranche B/E receipts: `M4.25`/`P23#0` uses `CARRIED BY` on a code path
rather than a named target entry; `E050` and `E052` cite the wrong superseding authority (Principle 25
and the `CLAUDE.md` connector-distrust directive respectively, not the receipts' stated grounds); `E076`
names no source for its `SUPERSEDED BY`. No defect was found in the manifest's own target-statement
bytes or in any wrapper body — the defect is confined to the review receipts. The other 74 units and all
Tranche F/M5/M6/F1–F9 results stand unchallenged.

A narrow recommission is open and hash-locked at revision 2:
`DECISIONS-MIGRATION-STAGE-2A-FRESH-REVIEW-NARROW-RECOMMISSION-WORK-ORDER-2026-08-07.md`, **12417 bytes
/ SHA-256 `b0b9c05072ed7c5bda86ff797c59e2f2ee08e85b9ea54cb7a09c4081085b0791`**, owner-acknowledged
2026-08-07. It commissions a non-author GPT/Codex checker seat (Claude remains barred as manifest
author) to re-derive all four units fresh against baseline source and issue exactly one new file,
`audit/decisions-migration-2026-07-29/FRESH-REVIEW-NARROW-RECOMMISSION-SUPPLEMENTAL-DISPOSITION-2026-08-07.md`,
carrying a corrected composite `ACCEPT`/`REVISE`/`REFUSE` for the four-unit population. **Executed and
closed 2026-08-07** by `audit/decisions-migration-2026-07-29/FRESH-REVIEW-NARROW-RECOMMISSION-SUPPLEMENTAL-DISPOSITION-2026-08-07.md`
(11468 bytes), corrected composite disposition **`ACCEPT`** — all four units freshly `CLEAR`. Architect
adjudication the same day: the corrections are source-accurate. `M4.25` correctly drops the invalid
code-path carrier and holds all four limbs as `RETAINED`, noting `src/examLayout.ts` is properly `Owner`
at M4.26 where allocation is the whole subject; `E050` now names Principle 25 (`E026`; live M4.29/P25#0)
on the exact-value/value-completeness ground; `E052` now names the `CLAUDE.md` connector-distrust
directive plus the one-time non-connector `grep`, independently confirmed present in the live tracked
`CLAUDE.md` § `You have filesystem access — use it`, and expressly rejects `M4.50` as carrier per the
baseline's own warning; `E076` is adjudicated as a **zero-operative-limb** unit rather than receiving a
manufactured supersession. The three prior receipts stand as written on all other units. Manifest and
`DECISIONS.md` measured unchanged at closeout.

**Drafting lesson from this recommission (architect seat).** The recommission order's §4 gave `E076` a
binary fork — name an exact later source, or use one of the other three dispositions. The correct answer
was neither: the unit has no operative limb at all, since implemented-spec pointers impose no live
obligation, and the parent order §4 already forbids manufacturing limbs from prose that imposes none.
An order that enumerates dispositions for a limb population should say explicitly that the population
may be empty, or it invites a manufactured disposition — which is exactly the defect the original
`E076` receipt committed.

**Queue-state correction, 2026-08-07: Task 2 and Task 3 were executed on 2026-08-04, not left owed.**
This note's repeated phrase "the Task 2 rerun over the 43 records at M4.2–M4.44" is **stale wherever it
appears below as a pending obligation**, and the same applies to the Task 3 rerun-or-supersession. The
M6 repair verification order revision 4 §§6.1–6.2 folded both in, and Codex executed both, returning
results in `audit/decisions-migration-2026-07-29/M6-REPAIR-VERIFICATION-2026-08-04.md`: Task 2 as a
complete 65-record run against the real exported `countStatementSentences` with the boundary test read
from source first and raw stdout retained, `1=4 / 2=23 / 3=38` full, `2=10 / 3=33` over the 43-record
subset, none outside `{1,2,3}`, zero backtick openers; Task 3 as 20 field instances across 19 distinct
paths, Population 1 = 18 all `TRACKED`, Population 2 = 1 `EXEMPT`, reported per-contract. The architect's
provisional `1=5 / 2=24 / 3=36` was disproved and recorded as that report's advisory 3.

**Both are nevertheless stale against the current `314811` manifest, for two separately verified
reasons.** Task 2: the four-finding repairs and the `M4.35` exclusivity correction changed item-8
statement bytes at `M4.3`, `M4.5`, and `M4.35` after the run, and a restored limb can add a sentence, so
those counts were taken against bytes that no longer exist. Task 3: the run recorded the Population 2
exempt path as `Archive/DECISIONS-ARCHIVE-2026-08-11.md`, and the owner rebind to `2026-08-18`
re-rendered that filename along with the M0.1 pin, so its Clause A byte-equality proof was taken against
a superseded literal.

**Re-measurement commissioned 2026-08-07** at
`DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md`, **revision 1,
hash-locked 2026-08-07 at 10411 bytes / SHA-256
`7ec62168150d243112b28a13c12d3ed3bb25bdfa109874c67b635534d52b566c`**, owner-acknowledged and immutable:
complete re-run of both tasks over all 65 records against the current pins,
with a per-record comparison against the 2026-08-04 counts and a fresh Clause A check against the current
M0.1 pin. Per-record carry-forward was considered and rejected — it costs more to prove than the full run
costs to execute, no `.frozen` snapshot captures the intermediate state it would need to pin, and the
original Task 2 defect was adjudicated as invalidating a run in whole rather than as one wrong row.
Deliverable: `audit/decisions-migration-2026-07-29/TASK-2-TASK-3-REMEASUREMENT-2026-08-07.md`. The
derived date-occurrence report is next in sequence after it.

**Re-measurement returned 2026-08-07: Task 3 PASS, Task 2 one REQUIRED REPAIR at `M4.35`.** Task 3 is
discharged — 20 instances, 19 paths, all Population 1 tracked, Clause A equality re-proved against the
current `2026-08-18` pin. Task 2 found `M4.35 / P28#0` at **4** sentence boundaries against the target §1
one-to-three grammar. Cause established, not assumed: the 2026-08-06 four-finding repair restored E033's
generation-prompt limb as a **new standalone sentence** into a statement already at three; the later
`draw` → `draw only` exclusivity correction landed inside that new sentence and did not cause the defect.
The 2026-08-04 count of 3 was correct for the bytes it read.

**Repair applied 2026-08-07 under**
`DECISIONS-MIGRATION-STAGE-2A-M4.35-SENTENCE-COUNT-REPAIR-WORK-ORDER-2026-08-07.md`, **revision 1,
hash-locked at 9177 bytes / SHA-256
`e54a2abff4d8499f10182562839143efd464ca5e5a5068c3faa7ff62b5c1693e`**. One substring, two byte
substitutions: `about a leaf. Generation prompt parameters draw only from` →
`about a leaf; generation prompt parameters draw only from`. Report at
`audit/decisions-migration-2026-07-29/M4.35-SENTENCE-COUNT-REPAIR-REPORT-2026-08-07.md`.

**Why the semicolon rather than the reviewer's proposed fold.** `countStatementSentences`
(`lib/decisions-format.ts` line 308) treats only `.`, `?`, and `!` as boundary candidates, so a semicolon
drops the count to 3 while leaving the freshly reversal-proof-verified exclusivity clause byte-identical
apart from its leading capital. The reviewing seat proposed folding the limb in as a trailing coordinate;
that was considered and rejected because sentence 1 ends in a `with`-absolute chain, so a finite
coordinate garden-paths, and recasting it as a third absolute (`…parameters drawing only from…`) would
convert a flat declarative rule into an attendant circumstance — a force change, where E033's source is
finite. Merging sentences 3 and 4 was also rejected: item 12 records the case-cadence clause as an
authorization boundary carried by no other entry, and subordinating it into a long delivery sentence is a
substantive risk this repair had no reason to take.

**The substitution is length-preserving.** The manifest is expected to remain `314811` bytes with a
**different** SHA-256. Byte length is therefore worthless as a change proof here; every check on this
repair is SHA-based and a length-only closeout is void.

**Owed before the derived date-occurrence report:** post-repair manifest SHA-256 and the work order's
closing measurement, from a hashing-capable seat; Codex deterministic verification (locality, item-9
byte-identity, byte-identity of the other 77 reviewed units, fresh full Task 2, file integrity, repo
state); and a **non-Claude** confirming read of `M4.35` only — barred to the Claude seat, which authored
both the original statement and the replacement wording. The fresh constitutional review is **not** voided
by the identity change: its 77 untouched units are preserved by byte-identity proof and `M4.35` alone is
re-confirmed. A full 78-unit rerun is expressly not commissioned.

**Repair chain closed 2026-08-07: Codex deterministic verification PASS, GPT confirming read PASS,
architect closeout ACCEPT.** Both receipts were read from disk and adjudicated on their merits.

Codex (`M4.35-SENTENCE-COUNT-REPAIR-VERIFICATION-2026-08-07.md`) proved locality by reconstructing the
pre-repair witness in memory and recovering `314811` / `e99335567d…` exactly, then naming the only two
differences: byte `104734` `0x2e '.'` → `0x3b ';'` and byte `104736` `0x47 'G'` → `0x67 'g'`, both inside
`M4.35` item 8, with no insertion or deletion. Item 9 is byte-identical at 104 bytes, both states hashing
`fb94815aa165bcc3f4d0361dea5385d4024a59b72b9d5645a690a44e9cbc7e2c`, so **Task 3 stays discharged**. The
other 64 live records and all 13 wrappers are byte-identical, so the fresh constitutional review remains
byte-applicable to those 77 units. Fresh full Task 2 returns `M4.35` at **3**, all 65 inside `{1,2,3}`,
distribution back to `1=4 / 2=23 / 3=38`, with exactly one record changed against the earlier run
(`M4.35: 4→3`) and the other 64 unchanged. File integrity clean; one terminal sentinel at offset 314791;
branch, HEAD, `DECISIONS.md`, index, and refs unmoved.

GPT (`M4.35-SENTENCE-COUNT-CONFIRMING-READ-2026-08-07.md`) returned PASS on all four §5 questions: the
exclusivity clause remains a finite independent clause with `only` intact and undiminished by the
semicolon; `this same scored-leaf population` still resolves to the population defined earlier in the
same sentence with no competing population intervening; all nine operative limbs survive; and the entry
remains one paragraph of three sentences.

**Architect disposition: ACCEPT.** The `M4.35` sentence-count defect is closed. No further repair is open
from this sequence. The prior fresh constitutional review stands for its 77 byte-identical units, and
`M4.35`'s semantic clearance against the new manifest identity is supplied by the targeted confirming
read.

**One defect recorded against the architect seat, not the executing seats — standing ruling 38.** The
repair order §5 cited baseline `E033` at `[42737,43333)`, a range lifted from a truncated search preview
rather than from the manifest's own `M4.35` item 14, which pins the authoritative `[42598,44464)`. The
narrow slice does not contain the delivery, capacity-warning, or visual-inventory limbs that the same §5
asked the confirming seat to verify. GPT caught it, read against the complete operative `E033` text, and
disclosed the departure in its receipt. No manifest defect follows and the confirming read is not
weakened by it — the seat read more than commissioned, not less, and said so.

**The derived date-occurrence report is now unblocked** and is the next commission in sequence. Stage 2b,
post-assembly deterministic verification, and owner ratification remain fenced behind it.

## Resuming efficiently

A fresh session does not need to reload the entire workstream.

For a review or verification pass, after reading this note and the current manifest, read only:

- the relevant block range in the Part draft covering those blocks; and
- the corresponding source entries in
  `DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md`.

Read forward into the packet for the range under review rather than loading it whole. Read additional
provenance, omission, or path material only when a record requires it.

## Read order before resuming

1. `AGENTS.md`
2. `PROJECT-HISTORY.md`
3. `DECISIONS.md`
4. `NCLEX-Question-Schema.md`
5. `CLAUDE.md`
6. `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md`
7. `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md`
8. This resume note
9. `audit/decisions-migration-2026-07-29/target-text-manifest.md`
10. The Part draft and live-source-packet entries relevant to the records under review

## Stage 2b current state — 2026-08-11 Phase 5 CLOSED

**This section is the operative record for Stage 2b Phase 5 and later, and takes precedence over any Phase 5 wording earlier in this note.**

**Stage 2b Phase 5 (commission §5.7) closed on architect `ACCEPT` 2026-08-11.** Record: `DECISIONS-MIGRATION-STAGE-2B-PHASE-5-CLOSEOUT-2026-08-11.md`. Phases 1–4 dispositions are unchanged.

Phase 5 closed on two passes. The original implementation returned `PASS` and was **defective**; independent non-producer review found location-blind structural-surface verification and an unproven file-level untracked-set delta, both independently confirmed by this seat against live disk. **The original receipt at `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-TARGET-RECONCILE-REPORT-2026-08-11.md` is preserved unchanged as the contemporaneous record of that defective implementation and is never cited as closure evidence.**

**The location-binding repair is accepted.** Order: `DECISIONS-MIGRATION-STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-WORK-ORDER-2026-08-11.md`, revision 1, `31308` bytes / SHA-256 `fd252a87340e0dc44c71d35a4342bd7cd47a4547e31714f8c75a604b246e34f4` — owner-measured and architect-accepted at that exact identity; the earlier `29545`-byte candidate was never authorized and is superseded. Receipt: `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-REPORT-2026-08-11.md`, `PASS`. Live checker: `scripts/decisions-migration-target-reconcile.ts`, `47448` bytes / SHA-256 `bd89de205fa873f8f65824e607a950c68dfe33cdc926dc1317e1d63b7aac2639`.

**The §9 non-producer independent execution is accepted.** Record: `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-SECTION-9-INDEPENDENT-EXECUTION-RECORD-2026-08-11.md`. Executed in the owner's local shell as an atomic `/tmp` script file. Both reconciliation commands exit `0`; the compensated-relocation control returns exit `1` with global uniqueness `PASS` alongside location-bound `FAIL` — the pair that proves the repaired predicate, since the original implementation would have passed that fixture. Seventeen governed SHA-256 values and the full `--untracked-files=all` path set were identical opening to closing, both directions.

**Byte-0 operand ruling — the prior explanation is withdrawn.** A one-byte transcript divergence (`1906`/`8ccb40e7…` raw versus `1905`/`29efcc7c…` preserved) stopped the first §9 attempt. The leading LF is emitted by **npm's own run-script launcher banner**, not by any capture wrapper; the earlier "capture-channel framing" rationale was asserted without measurement and is factually wrong. The operand is the raw capture with the launcher LF excluded by *asserted* delimitation (byte 0 confirmed `0x0a`, byte 1 confirmed `0x3e`), with **both identities recorded separately**. Full reasoning at §1 of the §9 record. No pre-existing transcript boundary is claimed.

**Proposed standing Rule 40 is WITHDRAWN and is not law.** Its wording rested on the falsified premise. Do not record it, do not cite it, and do not write it into `DECISIONS.md`. If a durable rule is still wanted, it must be redrafted against the launcher/transcript-boundary facts and owner-approved. It is in any case a **queued post-migration write**: `DECISIONS.md` is pinned at `56964` / `3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8` and is the checker's canonical input, so a new entry now would break Phase 5 and contradict Phase 4's accepted target.

**Recorded limits on the §9 evidence, so a later seat does not over-read it.** `npx tsc -b --pretty false` was not re-run independently and remains **producer-attested** from the repair receipt. The §9 instrument and its control fixture were authored by the architect seat, which also adjudicated; the architect authored neither the checker nor the repair, GPT cold-reviewed the repaired checker, and the owner executed.

**Phase 6 / commission §5.8 (conformance wiring) is UNBLOCKED but NOT ISSUED.** It requires its own architect-authored, owner-hash-frozen work order and handoff, preceded by fresh cold reconnaissance of live disk. Commission §6, §7.1, and §8 remain untouched; §7.1 item 11's byte-scoped manifest/output equality check still needs the combined manifest + Amendment 2 + Amendment 3 reading when final verification is drafted.

**Census staleness.** The §9 opening census measured **127 total status lines: 4 modified tracked paths plus 123 untracked file paths**. That figure is already stale — the Phase 5 closeout and the §9 record add new untracked paths, while this note's own edit changes bytes without adding a path. Any next instrument captures its own opening set with `git status --porcelain=v1 --untracked-files=all`; the historical 71-entry default-porcelain figure and the 127-line file-level status figure are orientation only and are never a baseline. **Default `git status --porcelain` must not be used as preservation evidence** — it collapses wholly-untracked directories, which is exactly what produced Finding B. **The upper section's "modified tracked paths are now three" is likewise stale and is not a baseline.** It was true at Phase 4 closeout; `package.json` was modified during Phase 5 when the `reconcile:decisions-migration-target` script key was added, making the modified-tracked-path count four at Phase 5 closeout. Like the other repository-state census figures in this paragraph, that count is historical orientation only; each later instrument must capture its own opening set.

**Preservation warning still in force.** Every migration artifact is untracked in this worktree and exists on no remote. No cleanup, reset, checkout, stash, or `git clean`.
