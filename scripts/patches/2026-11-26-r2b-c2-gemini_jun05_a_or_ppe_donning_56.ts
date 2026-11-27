/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_or_ppe_donning_56 (banks/gemini-canonical.json questions[54]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) 0f6df46d710322c3b21f00937fe6678a2f80049e6c72865881553ed3c4f4cbf8. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_or_ppe_donning_56";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "According to CDC guidelines, the correct sequence for donning PPE is: 1. Hand hygiene is performed to prevent contamination. 2. The gown is put on first to cover the torso. 3. The mask or respirator is secured next. 4. Goggles or a face shield are applied to protect the eyes. 5. Gloves (E) are donned last, extending to cover the cuffs of the gown.",
    after: "According to CDC guidelines, the correct sequence for donning PPE is: 1. Hand hygiene is performed to prevent contamination. 2. The gown is put on first to cover the torso. 3. The mask or respirator is secured next. 4. Goggles or a face shield are applied to protect the eyes. 5. Gloves are donned last, extending to cover the cuffs of the gown.",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "根据美国CDC指南，穿戴个人防护装备（PPE）的正确顺序是：1. 进行手卫生（A）以防止污染。2. 先穿上隔离衣（B）以覆盖躯干。3. 接着戴上并固定好口罩或呼吸防护器（C）。4. 佩戴护目镜或面罩（D）以保护眼睛。5. 最后戴上手套（E），并拉长套住隔离衣的袖口。",
    after: "根据美国CDC指南，穿戴个人防护装备（PPE）的正确顺序是：1. 进行手卫生以防止污染。2. 先穿上隔离衣以覆盖躯干。3. 接着戴上并固定好口罩或呼吸防护器。4. 佩戴护目镜或面罩以保护眼睛。5. 最后戴上手套，并拉长套住隔离衣的袖口。",
    note: "R2 B-2R P4 reference rewrite: 5 edit(s) covering 5 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
