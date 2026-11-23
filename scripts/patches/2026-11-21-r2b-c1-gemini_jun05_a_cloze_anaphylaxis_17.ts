/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_jun05_a_cloze_anaphylaxis_17 (banks/gemini-canonical.json questions[16]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) fa0f0f560ef0003f2d12e8f26baf9d7a4a456abb3901df7bdbc074bfebf32d33. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_cloze_anaphylaxis_17";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "The client is experiencing anaphylaxis, a life-threatening systemic hypersensitivity reaction. The first action must be to remove the offending allergen by stopping the infusion (o1 for dropdown 1). The first-line drug of choice for anaphylaxis is epinephrine (o2 for dropdown 2) administered intramuscularly, which causes bronchodilation and vasoconstriction.",
    after: "The client is experiencing anaphylaxis, a life-threatening systemic hypersensitivity reaction. The first action must be to remove the offending allergen by stopping the infusion. The first-line drug of choice for anaphylaxis is epinephrine administered intramuscularly, which causes bronchodilation and vasoconstriction.",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "患者正在经历过敏性休克，这是一种危及生命的全身性超敏反应。第一步行动必须是通过停止输液来清除致敏过敏原（下拉菜单1的o1）。治疗过敏性休克的首选一线药物是肌肉注射肾上腺素（下拉菜单2的o2），可引起支气管扩张和血管收缩。",
    after: "患者正在经历过敏性休克，这是一种危及生命的全身性超敏反应。第一步行动必须是通过停止输液来清除致敏过敏原。治疗过敏性休克的首选一线药物是肌肉注射肾上腺素，可引起支气管扩张和血管收缩。",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
