/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_jun05_a_cloze_breastfeeding_08 (banks/gemini-canonical.json questions[7]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) 54cb1937331a919b89d78993cf3d3d13f6c091e1e49509d3c3ac8c362ab600cf. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_cloze_breastfeeding_08";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Proper latch is the most critical factor in preventing nipple soreness. The infant's mouth should cover the nipple and a large portion of the areola (o2 for dropdown 1) to ensure the nipple is drawn deep into the mouth where it is protected from friction. The infant's lips should be flanged outward (o2 for dropdown 2), forming a wide seal against the breast.",
    after: "Proper latch is the most critical factor in preventing nipple soreness. The infant's mouth should cover the nipple and a large portion of the areola to ensure the nipple is drawn deep into the mouth where it is protected from friction. The infant's lips should be flanged outward, forming a wide seal against the breast.",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "正确的含接是预防乳头酸痛最关键的因素。婴儿的嘴应覆盖乳头和大部分乳晕（下拉菜单1的o2），以确保乳头被吸入嘴部深处，免受摩擦。婴儿的嘴唇应向外翻起（下拉菜单2的o2），与乳房形成宽阔的密封。",
    after: "正确的含接是预防乳头酸痛最关键的因素。婴儿的嘴应覆盖乳头和大部分乳晕，以确保乳头被吸入嘴部深处，免受摩擦。婴儿的嘴唇应向外翻起，与乳房形成宽阔的密封。",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
