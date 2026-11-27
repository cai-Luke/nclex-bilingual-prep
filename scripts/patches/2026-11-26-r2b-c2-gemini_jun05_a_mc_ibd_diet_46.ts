/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_mc_ibd_diet_46 (banks/gemini-canonical.json questions[44]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) 186bcec97b925d6bfadd71d5d39b4cbeb2e770978d4f2e1b14488930dd7dfc93. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_mc_ibd_diet_46";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "溃疡性结肠炎急性发作期，肠道有炎症且蠕动亢进。患者需要低渣（低纤维）饮食（B），以最大程度减少肠道刺激、减少粪便体积并促进愈合。为解决因蛋白质丢失和吸收不良引起的营养不良和肌肉萎缩，高蛋白、高热量饮食是必不可少的。在发作期，禁食高纤维食物（A, C, D），因为它们会加重症状。",
    after: "溃疡性结肠炎急性发作期，肠道有炎症且蠕动亢进。患者需要低渣（低纤维）饮食，以最大程度减少肠道刺激、减少粪便体积并促进愈合。为解决因蛋白质丢失和吸收不良引起的营养不良和肌肉萎缩，高蛋白、高热量饮食是必不可少的。在发作期，禁食高纤维食物（A, C, D），因为它们会加重症状。",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
