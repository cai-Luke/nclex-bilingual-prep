You are independently evaluating whether all-stage visibility leaks an answer in bilingual NCLEX case-study parts. Use only the supplied packet. Do not use outside knowledge to re-grade clinical truth; the stored key and rationale identify the intended inference.

For every target, decide in order:

1. What exact decision or response is the active part testing?
2. Which visible stage facts are actually required to answer it?
3. Does any otherwise unnecessary exposed stage fact materially reduce the reasoning required by directly revealing or strongly cueing the keyed condition, action, priority, calculation or trend, response, outcome, ordering, or distractor elimination?
4. Is the part intentionally based on the complete record, making full-stage visibility appropriate?
5. If the intended stage boundary cannot be recovered safely, is REVIEW more accurate than forced certainty?
6. Is the leakage relation parallel in English and Simplified Chinese, or materially different?

A later timestamp is not automatically a leak. Extra data is not automatically useful. Strong cueing counts even if the answer is not verbatim. NO_LEAK_COMPLETE_RECORD requires positive evidence of complete-record intent and is not a default.

Primary verdicts:

- LEAK: at least one otherwise unnecessary exposed stage materially helps answer the active part.
- NO_LEAK_COMPLETE_RECORD: the authored evidence positively supports intentional use of the complete staged record.
- NO_LEAK_NONANSWERING_DATA: extra exposed stages do not materially help answer the active part.
- REVIEW: the intended progression, dependency, or answerability boundary cannot be recovered safely.

Bilingual relations:

- PARALLEL
- EN_ONLY_LEAK
- ZH_ONLY_LEAK
- MATERIAL_DIVERGENCE
- UNRESOLVED

Ordinary translation compression, punctuation, or sentence-count differences are not material divergence.

Return exactly one compact JSON object per line, in the packet's targetOrder, with no Markdown fence, preface, summary, or JSON array. Each row must have exactly this shape:

{"rowToken":"opaque token copied exactly","verdict":"LEAK | NO_LEAK_COMPLETE_RECORD | NO_LEAK_NONANSWERING_DATA | REVIEW","testedDecision":"one item-specific sentence, at most 30 words","requiredStageIds":["stage id"],"unsafeStageIds":["stage id"],"stageEnumeration":[{"stageId":"exact declared stage id","contribution":"REQUIRED | UNSAFE | NONANSWERING","evidenceIds":["packet-owned evidence id"],"basis":"one concise item-specific statement"}],"partEvidenceIds":["packet-owned target evidence id"],"stageEvidenceIds":["packet-owned stage evidence id"],"locus":{"stageId":"exact unsafe stage id or null","evidenceIds":["packet-owned evidence id"],"verbatimSpan":"exact minimal textual span or null"},"bilingualRelation":"PARALLEL | EN_ONLY_LEAK | ZH_ONLY_LEAK | MATERIAL_DIVERGENCE | UNRESOLVED","reason":"one to three item-specific sentences"}

Enumerate every declared stage exactly once and in authored order. Classify a stage REQUIRED if its facts are needed, UNSAFE if its otherwise unnecessary facts leak or strongly cue the tested response, and NONANSWERING otherwise. requiredStageIds must exactly equal the REQUIRED stages in enumeration order; unsafeStageIds must exactly equal the UNSAFE stages in enumeration order.

REQUIRED and UNSAFE enumeration entries need at least one evidence ID owned by that stage. NONANSWERING may use an empty evidenceIds array unless its basis discusses a concrete stage fact, in which case cite that fact. Use 1-4 target-owned partEvidenceIds and 1-8 stage-owned stageEvidenceIds. For a no-leak row, cite the strongest plausible exposed cue and explain why it does not materially answer the target.

LEAK requires a nonempty unsafeStageIds list. Its locus.stageId must be one unsafe stage; locus.evidenceIds must be nonempty evidence owned by that stage and included in stageEvidenceIds. If the cited evidence is textual, copy an exact minimal verbatimSpan from it; for genuinely structured or visual evidence the span may be null. Every non-LEAK row must have an empty unsafeStageIds list and locus exactly {"stageId":null,"evidenceIds":[],"verbatimSpan":null}.

REVIEW requires an item-specific reason naming the exact ambiguity. Do not recommend repairs or anchors. Do not provide confidence scores. Do not reuse generic reasons across targets.
