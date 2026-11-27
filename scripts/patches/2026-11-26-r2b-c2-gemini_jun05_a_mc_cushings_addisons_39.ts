/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_mc_cushings_addisons_39 (banks/gemini-canonical.json questions[37]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) 0ab809d823bab420a7fe78f144227787db0660c4b61763e3e27ffff427a8b627. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_mc_cushings_addisons_39";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "艾迪生病的特征是肾上腺激素（醛固酮、皮质醇）分泌不足。醛固酮缺乏导致钠流失（低钠血症）和钾潴留（高钾血症）。皮质醇缺乏导致糖异生减少，引起低血糖（B）。库欣综合征代表相反的状态（皮质醇/醛固酮过多，导致高钠血症、低钾血症和高血糖）。",
    after: "艾迪生病的特征是肾上腺激素（醛固酮、皮质醇）分泌不足。醛固酮缺乏导致钠流失（低钠血症）和钾潴留（高钾血症）。皮质醇缺乏导致糖异生减少，引起低血糖。库欣综合征代表相反的状态（皮质醇/醛固酮过多，导致高钠血症、低钾血症和高血糖）。",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
