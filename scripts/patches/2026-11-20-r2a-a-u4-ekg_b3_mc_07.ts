/**
 * R2 A-1, Claude route, unit A-U4: ekg_b3_mc_07 (visual-canonical questions[29]).
 * Findings: F-17a (caption names the keyed diagnosis), F-17b (letter references in testTakingStrategy, P4).
 * Declared surface: visual.caption.{en,zh}, testTakingStrategy.{en,zh}. Stimulus data, selfCheck inputs and key unchanged.
 * Candidate only. Integration (in-place on banks/visual-canonical.json, ledger, census) belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "ekg_b3_mc_07";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["visual", "caption", "en"],
    before: "Complete AV dissociation on tele monitor",
    after: "Telemetry rhythm strip",
    note: "F-17a: neutral, non-diagnostic caption." }),
  setValue({ id: ID, path: ["visual", "caption", "zh"],
    before: "遥测监护仪上显示的完全性房室分离",
    after: "遥测心律条图" }),
  setValue({ id: ID, path: ["testTakingStrategy", "en"],
    before: "Identify the key phrase 'no temporal relationship to each other' (or 'AV dissociation'). Complete dissociation of atria and ventricles always indicates a Third-Degree (Complete) AV Block. Select Option D.",
    after: "Compare the atrial and ventricular activity in the stem: P waves and QRS complexes each keep their own regular rate, the ventricular rate is the slower of the two, and the PR interval varies because no P wave is conducted to the ventricles. Failure of every P wave to conduct is the defining feature of third-degree (complete) AV block. Do not rely on the term 'AV dissociation' alone, because AV dissociation also occurs with junctional or ventricular rhythms.",
    note: "F-17b: letter reference removed (P4); refers to option content. Drops the inaccurate 'always indicates' generalisation." }),
  setValue({ id: ID, path: ["testTakingStrategy", "zh"],
    before: "识别关键短语“彼此之间没有时间关系”（或“房室分离”）。心房和心室的完全分离总是提示三度（完全性）房室传导阻滞。选择选项B。",
    after: "比较题干中心房与心室的活动：P波和QRS波群各自保持规整的频率，心室率较慢，且由于没有任何P波下传至心室，PR间期多变。每个P波均不能下传是三度（完全性）房室传导阻滞的决定性特征。不要仅凭“房室分离”一词作判断，因为交界性或室性心律也可出现房室分离。" }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
