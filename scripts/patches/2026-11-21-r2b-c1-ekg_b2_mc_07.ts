/**
 * R2 B-2 tranche C1 (B-2R, Claude route): ekg_b2_mc_07 (banks/visual-canonical.json questions[19]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) 3056d31426ad3d0ad55f9a06f46dfe82d812a167cbf0e4ecffefe247add2e7b8. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "ekg_b2_mc_07";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Atrial flutter is defined by regular, rapid atrial waves presenting as a 'saw-tooth' pattern, termed flutter (F) waves. The atrial rate is typically 250-350 bpm. The AV node acts as a gatekeeper, conducting only a fraction of these impulses (conduction ratio). Here, the atrial rate is 300 bpm and the ventricular rate is 75 bpm, representing a 4:1 conduction ratio (4 atrial waves to 1 QRS complex).",
    after: "Atrial flutter is defined by regular, rapid atrial waves presenting as a 'saw-tooth' pattern, termed flutter waves (F waves). The atrial rate is typically 250-350 bpm. The AV node acts as a gatekeeper, conducting only a fraction of these impulses (conduction ratio). Here, the atrial rate is 300 bpm and the ventricular rate is 75 bpm, representing a 4:1 conduction ratio (4 atrial waves to 1 QRS complex).",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds RESTATE_NON_OPTION_TOKEN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "心房扑动的定义为规则、快速的心房波呈“锯齿状”表现，称为扑动（F）波。心房率通常在 250-350 次/分之间。房室结起到门卫的作用，只下传这些冲动中的一部分（传导比例）。这里心房率为 300次/分，心室率为 75次/分，代表了 4:1 的传导比例（4个心房波对应1个QRS波群）。",
    after: "心房扑动的定义为规则、快速的心房波呈“锯齿状”表现，称为扑动波（F 波）。心房率通常在 250-350 次/分之间。房室结起到门卫的作用，只下传这些冲动中的一部分（传导比例）。这里心房率为 300次/分，心室率为 75次/分，代表了 4:1 的传导比例（4个心房波对应1个QRS波群）。",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds RESTATE_NON_OPTION_TOKEN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
