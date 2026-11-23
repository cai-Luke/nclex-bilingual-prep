/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_b1_02 (banks/gemini-canonical.json questions[177]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) f1c2cbf8f04d812c91d5cef4d87af3d2a39ac6aa945433b5c86fdd47bfc7891d. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_b1_02";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Management of Addison's disease involves preventing crisis and managing electrolyte imbalances. Low-potassium diet is needed as these clients are prone to hyperkalemia. Salt intake must increase with stress/heat due to mineralocorticoid deficiency. Medical alerts are vital for emergencies. Replacement is lifelong. Rapid weight gain (E) can indicate over-replacement.",
    after: "Management of Addison's disease involves preventing crisis and managing electrolyte imbalances. Low-potassium diet is needed as these clients are prone to hyperkalemia. Salt intake must increase with stress/heat due to mineralocorticoid deficiency. Medical alerts are vital for emergencies. Replacement is lifelong. Rapid weight gain can indicate over-replacement.",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "艾迪生病的管理包括预防危机和管理电解质紊乱。由于此类患者易发生高钾血症，因此需要低钾饮食（A）。由于盐皮质激素缺乏，在压力/高温下必须增加盐摄入量（B）。医疗警示（C）对急救至关重要。替代治疗（D）是终生的。体重快速增加（E）可能表示替代过度。",
    after: "艾迪生病的管理包括预防危机和管理电解质紊乱。由于此类患者易发生高钾血症，因此需要低钾饮食。由于盐皮质激素缺乏，在压力/高温下必须增加盐摄入量。医疗警示对急救至关重要。替代治疗是终生的。体重快速增加可能表示替代过度。",
    note: "R2 B-2R P4 reference rewrite: 5 edit(s) covering 5 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
