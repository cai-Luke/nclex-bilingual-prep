/**
 * R2 B-2 tranche C1 (B-2R, Claude route): ekg_b4_sata_07 (banks/visual-canonical.json questions[39]).
 * P4 positional-reference / internal-token rewrite. Declared surface: testTakingStrategy.en, testTakingStrategy.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) acc2934379eb29a2b83cc84bbd62e5a5b38cac3d626d730f6e12ca5f9a11faac. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "ekg_b4_sata_07";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["testTakingStrategy","en"],
    before: "Identify the patient state: Cardiac arrest (VFib, unresponsive, pulseless). The primary therapies are CPR, early defibrillation (unsynchronized), and epinephrine. Eliminate options that indicate synchronized shock (option D) or inappropriate medications (option F).",
    after: "Identify the patient state: Cardiac arrest (VFib, unresponsive, pulseless). The primary therapies are CPR, early defibrillation (unsynchronized), and epinephrine. Eliminate options that indicate synchronized shock (cardioversion at 50 joules) or inappropriate medications (IV push metoprolol).",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 2 occurrence(s); kinds RESTATE_CONTENT_CORRECTION." }),
  setValue({ id: ID, path: ["testTakingStrategy","zh"],
    before: "确定患者状态：心脏骤停（室颤、无反应、无脉搏）。首要治疗是CPR、早期除颤（非同步）和肾上腺素。排除表示同步电击（选项D）或不合适药物（选项F）的选项。",
    after: "确定患者状态：心脏骤停（室颤、无反应、无脉搏）。首要治疗是CPR、早期除颤（非同步）和肾上腺素。排除表示同步电击（50 焦耳同步电复律）或不合适药物（静脉推注美托洛尔）的选项。",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 2 occurrence(s); kinds RESTATE_CONTENT_CORRECTION." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
