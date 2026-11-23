/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_d2_doac_03 (banks/gemini-canonical.json questions[401]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) ebf728ca0aaeb02ab1e2b781b3dfbf86763cdc190b794209ff6df786de2b72f2. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_d2_doac_03";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Aspirin and NSAIDs like ibuprofen increase the risk of bleeding when combined with anticoagulants. St. John's Wort is a potent inducer of CYP3A4 and P-gp, which can decrease the serum levels and efficacy of rivaroxaban. Vitamin C and Acetaminophen (E) generally do not have significant interactions with DOACs.",
    after: "Aspirin and NSAIDs like ibuprofen increase the risk of bleeding when combined with anticoagulants. St. John's Wort is a potent inducer of CYP3A4 and P-gp, which can decrease the serum levels and efficacy of rivaroxaban. Vitamin C and Acetaminophen generally do not have significant interactions with DOACs.",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "阿司匹林 和布洛芬等非甾体抗炎药 与抗凝药合用时会增加出血风险。圣约翰草 是 CYP3A4 和 P-gp 的强效诱导剂，会降低利伐沙班的血清水平和疗效。维生素 C 和对乙酰氨基酚 (E) 通常与 DOACs 没有显著的相互作用。",
    after: "阿司匹林 和布洛芬等非甾体抗炎药 与抗凝药合用时会增加出血风险。圣约翰草 是 CYP3A4 和 P-gp 的强效诱导剂，会降低利伐沙班的血清水平和疗效。维生素 C 和对乙酰氨基酚通常与 DOACs 没有显著的相互作用。",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
