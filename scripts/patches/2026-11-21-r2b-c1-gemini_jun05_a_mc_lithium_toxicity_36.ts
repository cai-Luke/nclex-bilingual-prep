/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_jun05_a_mc_lithium_toxicity_36 (banks/gemini-canonical.json questions[35]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) 4f8a584e9aeb1abf5b6734140c467b3da756cbd01528f457391482ae4050720c. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_mc_lithium_toxicity_36";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "轻微手震颤、轻度口渴和一过性轻度恶心（A）是锂治疗在治疗浓度水平（0.6-1.2 mEq/L）下的预期、常见副作用。锂中毒的早期体征（浓度 1.5-2.0 mEq/L）包括粗大性手震颤、持续性腹泻、呕吐、肌无力和轻度认知错乱（B）。严重中毒（>2.0 mEq/L）可导致癫痫发作、心血管虚脱和多器官损伤（C）。",
    after: "轻微手震颤、轻度口渴和一过性轻度恶心是锂治疗在治疗浓度水平（0.6-1.2 mEq/L）下的预期、常见副作用。锂中毒的早期体征（浓度 1.5-2.0 mEq/L）包括粗大性手震颤、持续性腹泻、呕吐、肌无力和轻度认知错乱。严重中毒（>2.0 mEq/L）可导致癫痫发作、心血管虚脱和多器官损伤。",
    note: "R2 B-2R P4 reference rewrite: 3 edit(s) covering 3 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
