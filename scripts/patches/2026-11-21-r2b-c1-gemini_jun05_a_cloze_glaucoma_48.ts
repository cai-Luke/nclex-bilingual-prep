/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_jun05_a_cloze_glaucoma_48 (banks/gemini-canonical.json questions[46]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) 452c953ae181a875d5cf53947a6c6afc0ee38955607015c945d2c93ebe678fa1. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_cloze_glaucoma_48";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Cataracts are caused by opacity of the lens, which blocks light entry and causes generalized blurring or cloudiness (o1 for dropdown 1). Primary open-angle glaucoma is caused by increased intraocular pressure damaging the optic nerve, leading to progressive tunnel vision or loss of peripheral vision (o2 for dropdown 2).",
    after: "Cataracts are caused by opacity of the lens, which blocks light entry and causes generalized blurring or cloudiness. Primary open-angle glaucoma is caused by increased intraocular pressure damaging the optic nerve, leading to progressive tunnel vision or loss of peripheral vision.",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "白内障是由于晶状体浑浊引起的，阻挡了光线进入，导致普遍的视物模糊或浑浊（下拉菜单1的o1）。原发性开角型青光眼是由于眼压增高损伤视神经引起的，导致渐进性管状视野或周边视力丧失（下拉菜单2的o2）。",
    after: "白内障是由于晶状体浑浊引起的，阻挡了光线进入，导致普遍的视物模糊或浑浊。原发性开角型青光眼是由于眼压增高损伤视神经引起的，导致渐进性管状视野或周边视力丧失。",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
