# Stage 2 semantic dispatch prompt template

One fresh Claude context per checker packet. Substitute `<NNN>`, `<COUNT>`, and `<QLIST>`
(the packet's `queueIndexes`, comma-separated, from `checker-packet-manifest.json`).
For a 1-target packet, replace the ascending-order wording with "queueIndex is exactly <Q> —
a GLOBAL index; do NOT renumber it to 1 because it is the only target in this packet."

After the context returns: `npx tsx tools/validate-checker-output.ts --packet packet-<NNN>
--input reviews/packet-<NNN>.jsonl`, then `python3 tools/harvest.py` to lock everything valid.

---

You are an independent semantic reviewer for a nursing-exam case-study stage-reference audit. One task, one input file.

INPUT (read in full):
/Users/holemini/Desktop/Project Shrimp/audit/campaign-16-phase-e-stage-reference-check-2026-08-29-r1/checker-packets/packet-<NNN>.json

STRICT ISOLATION — hard rules:
- Read ONLY that one packet file. Do not read any other checker packet, anything under audit/campaign-16-phase-e-stage-reference-census-2026-08-29-r1/ (another reviewer's output; it must not influence you), any other reviews/*.jsonl, or any bank file.
- Do not search the repository. Everything you need is inside the packet.
- Form your own independent judgment. There is no expected answer and no target distribution.

PACKET CONTENTS:
- `semanticContract`: the governing adjudication contract (§6). Read it first and follow it exactly.
- `cases[]`: complete parent-case evidence — stem/title/summary, `globalExhibits`, `stages[]` (id, title, trigger, exhibits), `siblingPartOutlines[]` (other parts of the same case, context only).
- `cases[].targets[]`: the parts you must adjudicate, each with `queueIndex`, `packetId`, `bankPath`, `parentCaseId`, `partId`, `partOrdinal`, `itemType`, `stem`, `response` (including the keyed correct answer), `rationale`, `anchorState`, `declaredStageIds`, `rendererVisibleStageIds`.
- `evidenceCatalog[]`: every citable evidenceId with surface, jsonPath and text.

AUDITED BEHAVIOR: the current renderer exposes ALL stages at once, so when a learner answers an early part, later-stage material is already visible. Decide, per target part, whether that full-stage exposure materially helps answer that part.

FOR EACH TARGET, work the §6.1 questions in order:
1. What exact decision is this part testing? Use the stored key/rationale only to identify the intended inference — do not re-grade the key.
2. Which visible stage facts are actually needed to answer it?
3. Does any OTHERWISE UNNECESSARY exposed stage fact materially reduce the reasoning required, by directly revealing or strongly cueing the keyed decision?
4. Or does the case/part intentionally operate on a complete record, making full-stage visibility appropriate?
5. If the intended stage boundary cannot be recovered safely from the authored case, is REVIEW more accurate than forced certainty?
6. Is the leakage relation the same in English and Simplified Chinese, or materially different?

Calibration from the contract:
- A later timestamp is NOT automatically a leak.
- Extra data is NOT automatically useful data.
- Strong cueing counts as leakage even when the answer never appears verbatim.
- NO_LEAK_COMPLETE_RECORD requires positive evidence of complete-record intent; it is not a fallback for hard legacy cases.
- Punctuation, sentence count, or ordinary translation compression alone is NOT material bilingual divergence.

OUTPUT — write (create; overwrite if present):
/Users/holemini/Desktop/Project Shrimp/audit/campaign-16-phase-e-stage-reference-check-2026-08-29-r1/reviews/packet-<NNN>.jsonl

One JSON object per line, no blank lines, no markdown fences, no commentary in the file. Exactly one row per target, ASCENDING queueIndex. This packet has <COUNT> targets with queueIndex values <QLIST>.

Each row uses EXACTLY these 13 keys, no others:
{"queueIndex":<int>,"packetId":"packet-<NNN>","bankPath":"<verbatim>","parentCaseId":"<verbatim>","partId":"<verbatim>","verdict":"<LEAK|NO_LEAK_COMPLETE_RECORD|NO_LEAK_NONANSWERING_DATA|REVIEW>","testedDecision":"<one item-specific sentence, max 30 words>","requiredStageIds":[...],"unsafeStageIds":[...],"partEvidenceIds":[...],"stageEvidenceIds":[...],"bilingualRelation":"<PARALLEL|EN_ONLY_LEAK|ZH_ONLY_LEAK|MATERIAL_DIVERGENCE|UNRESOLVED>","reason":"<1-3 item-specific sentences>"}

HARD VALIDATION RULES (machine-validated; any violation is rejected):
- Copy `queueIndex`, `packetId`, `bankPath`, `parentCaseId`, `partId` VERBATIM from each target. queueIndex is a GLOBAL index — never renumber it to its position within this packet.
- `requiredStageIds` and `unsafeStageIds` may contain ONLY ids from that target's `declaredStageIds`.
- `unsafeStageIds` must be NON-EMPTY when verdict is LEAK, and EMPTY ([]) for every other verdict.
- `requiredStageIds` may be [] when global/baseline context suffices.
- `partEvidenceIds`: 1-4 ids from evidenceCatalog, same parentCaseId, surface PART_STEM/PART_RESPONSE/PART_KEY/PART_RATIONALE, owned by THIS part.
- `stageEvidenceIds`: 1-6 ids from evidenceCatalog, same parentCaseId, surface STAGE. For a no-leak row cite the most plausible exposed cue and explain why it does not answer the part.
- `testedDecision`: max 30 words, item-specific.
- `reason`: 1-3 item-specific sentences, distinct per row; identical reasoning on 3+ rows is rejected as boilerplate.
- CRITICAL FORMATTING: the validator counts sentences by splitting on `.` `!` `?`. Use NO period-bearing abbreviations and NO decimal numbers in `reason` or `testedDecision` — write "Dr Reeves" not "Dr. Reeves"; never "e.g.", "i.e.", "vs.", "Mr.", "Mrs.", "No.", "approx."; avoid decimals entirely by rephrasing. At most 3 sentence-ending marks per reason.
- No confidence score, no replacement prose, no anchor recommendation, no totals. Exactly 13 keys.

Self-verify before reporting: <COUNT> lines; queueIndex exactly <QLIST> ascending; each line parses with exactly 13 keys; every cited evidenceId literally appears in the packet's evidenceCatalog; every stage id appears in that target's declaredStageIds; each reason has at most 3 sentence-ending marks.

Report back: row count, verdict per queueIndex, and confirmation you read only the one packet file.
