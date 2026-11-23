/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_c10_02 (banks/gemini-canonical.json questions[285]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) e81b6a4a699b0190069d8da9c6fca8d524078d7ba93c466405021c29c7450805. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_c10_02";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Preeclampsia with severe features is defined by BP ≥160/110 mmHg (r1), thrombocytopenia <100,000/mm³ (r2), renal insufficiency (creatinine >1.1 mg/dL or doubling of baseline, r4), or cerebral/visual disturbances. Proteinuria ≥300 mg/24h (r3) meets the diagnostic threshold for preeclampsia, but is not itself a severe-features criterion — placing it in the 'Without Severe Features' category. Note: gestational hypertension is elevated BP without proteinuria or end-organ damage and is a distinct diagnosis not shown here.",
    after: "Preeclampsia with severe features is defined by BP ≥160/110 mmHg, thrombocytopenia <100,000/mm³, renal insufficiency (creatinine >1.1 mg/dL or doubling of baseline, r4), or cerebral/visual disturbances. Proteinuria ≥300 mg/24h meets the diagnostic threshold for preeclampsia, but is not itself a severe-features criterion — placing it in the 'Without Severe Features' category. Note: gestational hypertension is elevated BP without proteinuria or end-organ damage and is a distinct diagnosis not shown here.",
    note: "R2 B-2R P4 reference rewrite: 3 edit(s) covering 3 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "重度子痫前期的诊断标准包括血压 ≥160/110 mmHg（r1）、血小板减少症 <100 ×10³/µL（r2）、肾功能不全（肌酐 >1.1 mg/dL 或较基线翻倍，r4）或脑/视觉症状。24 小时尿蛋白 ≥300 mg（r3）符合子痫前期的诊断阈值，但本身并非重度特征的判断标准，因此归入”非重度子痫前期”类别。注：妊娠期高血压是无尿蛋白或器官损害的高血压，属不同诊断，未在本题中呈现。",
    after: "重度子痫前期的诊断标准包括血压 ≥160/110 mmHg、血小板减少症 <100 ×10³/µL、肾功能不全（肌酐 >1.1 mg/dL 或较基线翻倍，r4）或脑/视觉症状。24 小时尿蛋白 ≥300 mg 符合子痫前期的诊断阈值，但本身并非重度特征的判断标准，因此归入”非重度子痫前期”类别。注：妊娠期高血压是无尿蛋白或器官损害的高血压，属不同诊断，未在本题中呈现。",
    note: "R2 B-2R P4 reference rewrite: 3 edit(s) covering 3 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
