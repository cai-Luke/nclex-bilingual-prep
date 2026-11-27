/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_mc_ect_prep_42 (banks/gemini-canonical.json questions[40]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) 581c66ebd24137a500175113024e8d13bb0e3e050d9a67b5be664d92e4036503. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_mc_ect_prep_42";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "ECT 需要全身麻醉和肌肉松弛剂。因此，患者在术前必须禁食（NPO）至少 6 至 8 小时（A）以防误吸。术前应暂停使用抗惊厥药物（C），因为它们会升高抽搐阈值，使治疗失效。头发必须清洁、干燥，不能使用发胶/喷雾（D）以防灼伤。术前直接饮水（B）违反了禁食规定。",
    after: "ECT 需要全身麻醉和肌肉松弛剂。因此，患者在术前必须禁食（NPO）至少 6 至 8 小时以防误吸。术前应暂停使用抗惊厥药物，因为它们会升高抽搐阈值，使治疗失效。头发必须清洁、干燥，不能使用发胶/喷雾以防灼伤。术前直接饮水违反了禁食规定。",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
