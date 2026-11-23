/**
 * R2 B-2 tranche C1 (B-2R, Claude route): ekg_b3_mc_04 (banks/visual-canonical.json questions[26]).
 * P4 positional-reference / internal-token rewrite. Declared surface: testTakingStrategy.en, testTakingStrategy.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) c27bf6c3776297cef6286a75d406b1b9f224792e03edef62534828d7e29dc846. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "ekg_b3_mc_04";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["testTakingStrategy","en"],
    before: "Determine if the client is stable: BP 114/70, warm extremities, awake, and alert. For stable heart blocks (first-degree and Mobitz I), the standard action is monitoring and documentation rather than immediate invasive therapies. Eliminate options A, B, and D.",
    after: "Determine if the client is stable: BP 114/70, warm extremities, awake, and alert. For stable heart blocks (first-degree and Mobitz I), the standard action is monitoring and documentation rather than immediate invasive therapies. Eliminate external pacing, emergent cardiac catheterization, and immediate IV atropine.",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 3 occurrence(s); kinds RESTATE_CONTENT." }),
  setValue({ id: ID, path: ["testTakingStrategy","zh"],
    before: "确定患者是否稳定：血压114/70，四肢温暖，清醒且警觉。对于稳定的房室传导阻滞（一度和莫氏I型），标准措施是监测和记录，而不是立即进行侵入性治疗。排除选项B、C和D。",
    after: "确定患者是否稳定：血压114/70，四肢温暖，清醒且警觉。对于稳定的房室传导阻滞（一度和莫氏I型），标准措施是监测和记录，而不是立即进行侵入性治疗。排除体外起搏、紧急心脏导管插入术和立即静脉注射阿托品。",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 3 occurrence(s); kinds RESTATE_CONTENT_CORRECTION." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
