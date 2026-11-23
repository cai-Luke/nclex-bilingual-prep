/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_jun05_a_cloze_siadh_di_38 (banks/gemini-canonical.json questions[36]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) ae966a35ef615aabc634181fafe726a7970c8d49d7c7f59f3eaefd76a5fcbadf. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_cloze_siadh_di_38";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Diabetes insipidus (DI) is caused by a deficiency of antidiuretic hormone (ADH), leading to the inability of kidneys to concentrate urine. This results in massive excretion of dilute urine with a low specific gravity (<1.005) (o1 for dropdown 1). Due to excessive water loss, the blood becomes concentrated, causing hypernatremia (high serum sodium >145 mEq/L) (o2 for dropdown 2). SIADH is the opposite (fluid retention, high urine specific gravity, dilutional hyponatremia).",
    after: "Diabetes insipidus (DI) is caused by a deficiency of antidiuretic hormone (ADH), leading to the inability of kidneys to concentrate urine. This results in massive excretion of dilute urine with a low specific gravity (<1.005). Due to excessive water loss, the blood becomes concentrated, causing hypernatremia (high serum sodium >145 mEq/L). SIADH is the opposite (fluid retention, high urine specific gravity, dilutional hyponatremia).",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "尿崩症（DI）是由于抗利尿激素（ADH）缺乏引起的，导致肾脏无法浓缩尿液。这导致排出大量稀释的尿液，尿比重降低（<1.005）（下拉菜单1的o1）。由于水分过度流失，血液被浓缩，导致高钠血症（血清钠增高>145 mEq/L）（下拉菜单2的o2）。SIADH 则相反（液体潴留、高尿比重、稀释性低钠血症）。",
    after: "尿崩症（DI）是由于抗利尿激素（ADH）缺乏引起的，导致肾脏无法浓缩尿液。这导致排出大量稀释的尿液，尿比重降低（<1.005）。由于水分过度流失，血液被浓缩，导致高钠血症（血清钠增高>145 mEq/L）。SIADH 则相反（液体潴留、高尿比重、稀释性低钠血症）。",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
