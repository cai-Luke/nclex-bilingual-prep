/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_b1_04 (banks/gemini-canonical.json questions[179]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) e8dcff96c832194764ef35db8bdc50c7c626f63632d95af896f24db06716b1af. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_b1_04";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Inferior wall MIs (Right Coronary Artery involvement) often involve the SA and AV nodes, leading to bradycardia and Type I AV blocks. They are frequently associated with RV infarction. Vagal stimulation in inferior MIs commonly causes N/V (E). Left bundle branch block is more common in anterior wall MIs.",
    after: "Inferior wall MIs (Right Coronary Artery involvement) often involve the SA and AV nodes, leading to bradycardia and Type I AV blocks. They are frequently associated with RV infarction. Vagal stimulation in inferior MIs commonly causes N/V. Left bundle branch block is more common in anterior wall MIs.",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "下壁心肌梗死（涉及右冠状动脉）常波及窦房结和房室结，导致心动过缓（A）和I型房室传导阻滞（B）。它们经常与右心室梗死（D）相关。下壁梗死中的迷走神经刺激通常会引起恶心/呕吐（E）。左束支传导阻滞（C）在前壁梗死中更常见。",
    after: "下壁心肌梗死（涉及右冠状动脉）常波及窦房结和房室结，导致心动过缓和I型房室传导阻滞。它们经常与右心室梗死相关。下壁梗死中的迷走神经刺激通常会引起恶心/呕吐。左束支传导阻滞在前壁梗死中更常见。",
    note: "R2 B-2R P4 reference rewrite: 5 edit(s) covering 5 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
