/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_mc_pad_care_54 (banks/gemini-canonical.json questions[52]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) c587a3f4e2a4a1e7d91219f2e815656febf09731d58dbc24bb4d371952293424. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_mc_pad_care_54";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "在外周动脉疾病（PAD）中，下肢血流受损。必须避免引起血管收缩或对血流产生机械性阻碍的动作。坐着时跷二郎腿（D）会限制动脉血流，是禁忌动作。直接使用热敷（A）由于患者感觉减退而非常危险。将双腿抬高到心脏水平以上（B）会减少重力辅助的血流，加重缺血。紧身弹力袜（C）用于静脉疾病，但在PAD中会限制动脉血流。",
    after: "在外周动脉疾病（PAD）中，下肢血流受损。必须避免引起血管收缩或对血流产生机械性阻碍的动作。坐着时跷二郎腿会限制动脉血流，是禁忌动作。直接使用热敷由于患者感觉减退而非常危险。将双腿抬高到心脏水平以上会减少重力辅助的血流，加重缺血。紧身弹力袜用于静脉疾病，但在PAD中会限制动脉血流。",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
