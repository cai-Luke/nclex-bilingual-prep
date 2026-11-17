# IV push sequence — architect conformance ruling and Astra finalization

**Implementation seat:** Codex / GPT-6 Astra (independent clinical checker, then mechanical integration gate)
**Model:** GPT-6 Astra
**Reasoning effort:** high
**Independent review:** Astra is the non-Claude checker outside the producer's delegation tree; authoring GPT provides spec conformance only.
**Date:** 2026-11-16
**Mode:** Review then conditional same-ID canonical application; no branch consolidation or remote publication.

## 0. Architect ruling

SPEC_CONFORMANCE_ACCEPTED_FOR_INDEPENDENT_REVIEW. All four deviations D-1 through D-4 in producer HANDOFF.md §5 are accepted as within the amended work order. D-1 scopes the flush by residual medication rather than a relative sequence term; D-2 scopes the check by preparation-area location and vial object; D-3 restores bilingual stem parity; D-4 conveys the selected-step limitation via clinical content rather than producer language. This is not clinical/content clearance under P2/P5.

I inspected the live amended work order, patch, before/after, target bank excerpts, proof scripts and saved test outputs. The first 1160 lines of live bank and baseline match as returned; the candidate differs in exactly the 20 authorized lines within that excerpt. The connector truncates complete bank reads at 300000 characters, so I have not independently hashed or compared every byte of the full files or rerun shell checks. Astra must verify the complete live bytes. HEAD observed 65756ab on codex/publication-reconciliation-2026-10-02; six unrelated untracked documents remain. Preserve them. The full producer suite and expected pre-existing warning are documented in HANDOFF.

## 1. Read and review

Read AGENTS.md, the applicable live governance and schema, scratch/IV-PUSH-SEQUENCE-CLAUDE-CODE-WORK-ORDER-2026-11-16.md, and HANDOFF.md in this directory. Inspect the retained actual baseline, candidate, patch and proofs, not just the receipt. Establish the current repository status/HEAD and SHA-256 hashes using local shell. Producer's baseline 949f8245698958b5bcab2ea3d095f22de316503aff5263f74e2151dba72ee553; candidate 99000aa3459be4c710985386ca160f64720a3ad1da6619600af5956066ff6a56. Hashes are traceability anchors, not an owner-imposed freezing requirement. A mismatch requires reconciliation before application; do not force stale preconditions or quietly rebase on changed clinical inputs.

Independently derive the clinical judgment from authoritative sources and candidate text in both languages. Check initial vs final medication verification, patient identity, pre-injection assessments and compatibility, immediate labeling, rate and volume of subsequent flush, Five Rights not a universal sequence, and item-level answer uniqueness. Record actual access and supporting sections; Open RN was blocked for the producer, IHI not retrieved. Use accessible authoritative alternatives as needed.

The principal residual: option C says "In the medication preparation area, compare the medication vial label with the medication administration record." Does this uniquely denote the initial check or could a competent learner legitimately place it after drawing up, relying on a repeat check model? The permutation proof assumes C<A; if removed, exactly two orders survive (C,A,B,E,D and A,C,B,E,D). Independently justify that premise or reject the candidate. Likewise verify D concerns the dose just administered rather than a pre-dose flush. The proof is a conditional enumeration, not a semantic oracle. Check that all clinically meaningful prerequisites are sourced and that any safety advice is not overbroad.

Do not rewrite learner-facing content as the checker and then certify it yourself. If a substantive change is required, record a minimal repair request and stop; return to the producer (or a separately commissioned producer) for a candidate requiring independent review. Do not escalate scope to other questions. If only mechanical integration defects arise, resolve within P15 and document.

## 2. Conditional integration

Write a durable, source-backed content verdict and scope verification artifact for this exact candidate before active canonical application. If accepted, the owner has requested Astra finalize the item: mechanically apply the reviewed patch via HANDOFF §9 and P15; no new item, raw promotion/consolidation, schema, grading, storage, runtime, governance or history edits to learner data. Verify full baseline/candidate equivalence outside the 20 allowed leaf paths using an independent field diff; preserve ID, key, display order, glossary, meta and other questions. Copy the patch into scripts/patches with only the necessary import path adjustment; run the canonical in-place command with --allow-canonical, --reason, --strict-parity, identical explicit --in and --out. Compare resulting canonical hash to the reviewed candidate. Record actual producer, checker, architect and integration seats in BANK-REVIEW-LEDGER.md contemporaneously. Preserve any prior review artifacts and update PROJECT-HISTORY.md in accordance with live AGENTS.md, distinguishing uncommitted local integration from accepted/merged publication.

Run final bank validation, aggregate audit, census:check (no drift expected), the relevant regression tests, TypeScript and build on final inputs. Reuse prior proof where inputs demonstrably identical and permitted; report expected no-raw INSUFFICIENT and baseline distribution advisory, investigate any new failure. No unrelated worktree cleanup or regenerated census to hide failures.

P20 is PARKED/ADVISORY/INACTIVE. The inspected audio directory lists only manifest.queue.json and the live source uses speechSynthesis. Check whether any actual maintained/runtime-served audio for changed text could be stale; where none, record deferred queue refresh and do not revive the audio lane. Do not introduce new audio integration.

The audit:references false-negative is a separate tooling issue (ASCII-only parentheses and A-D range reported by producer), not an authorization to change audit policy or survey the corpus. Record it as a deferred finding with exact witness; do not fix in this pass.

Stop on local finalized candidate and acceptance receipt. Preserve current checkout and six unrelated untracked root docs. No staging, commit, merge, branch consolidation, push or deploy without separate explicit owner authorization. Return exact changed paths, final hashes, gate results and publication status.

Terminal: IV_PUSH_CORRECTION_INTEGRATED_LOCAL or IV_PUSH_CORRECTION_REVIEW_BLOCKED, with reason.

SEND TO: Codex — GPT-6 Astra — high