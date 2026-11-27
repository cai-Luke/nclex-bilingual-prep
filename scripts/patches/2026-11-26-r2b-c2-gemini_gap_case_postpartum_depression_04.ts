/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_gap_case_postpartum_depression_04 (banks/gemini-canonical.json questions[800]).
 * P4 positional-reference / internal-token rewrite. Declared surface: caseStudy.questions[3].rationale.correct.en, caseStudy.questions[3].rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) ab8025c547ebd9b1f61a25e9058c10ebd0787be9c4f81d065b1c5930b36719ef. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_gap_case_postpartum_depression_04";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["caseStudy","questions",3,"rationale","correct","en"],
    before: "Validating the mother's feelings (r1) reduces guilt and promotes treatment adherence. Coordinating support (r2) ensures safety, reduces exhaustion, and provides rest. Advising the client to avoid talking about negative thoughts (r3) is contraindicated; expressing feelings is therapeutic, while suppression increases isolation and prevents safety monitoring.",
    after: "Validating the mother's feelings reduces guilt and promotes treatment adherence. Coordinating support ensures safety, reduces exhaustion, and provides rest. Advising the client to avoid talking about negative thoughts is contraindicated; expressing feelings is therapeutic, while suppression increases isolation and prevents safety monitoring.",
    note: "R2 B-2R P4 reference rewrite: 3 edit(s) covering 3 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["caseStudy","questions",3,"rationale","correct","zh"],
    before: "认可母亲的感受 (r1) 可减少内疚感并促进治疗依从性。协调支持 (r2) 可确保安全、减轻疲劳并提供休息。建议患者避免谈论消极想法 (r3) 是禁忌的；表达感受具有治疗作用，而压抑则会增加孤立感并防碍安全监测。",
    after: "认可母亲的感受可减少内疚感并促进治疗依从性。协调支持可确保安全、减轻疲劳并提供休息。建议患者避免谈论消极想法是禁忌的；表达感受具有治疗作用，而压抑则会增加孤立感并防碍安全监测。",
    note: "R2 B-2R P4 reference rewrite: 3 edit(s) covering 3 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
