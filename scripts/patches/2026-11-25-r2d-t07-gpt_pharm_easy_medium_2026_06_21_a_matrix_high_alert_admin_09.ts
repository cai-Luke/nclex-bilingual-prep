/**
 * R2 D-2 tranche 7, unit 03: zh-only meaning repair for gpt_pharm_easy_medium_2026_06_21_a_matrix_high_alert_admin_09 (banks/gpt-canonical.json questions[328]).
 * Producer: Codex gpt-6.2-astra high. Independent checker route: Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T07/producer/03/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_pharm_easy_medium_2026_06_21_a_matrix_high_alert_admin_09";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["matrix","rows",{"id":"r1"},"zh"],
    before: "核对药瓶与给药记录后，用胰岛素注射器抽取 insulin lispro。",
    after: "核对药瓶与给药记录后，用胰岛素注射器抽取赖脯胰岛素。",
  }),
  setValue({
    id: ID, path: ["matrix","rows",{"id":"r2"},"zh"],
    before: "为减少注射次数，把 insulin glargine 和 insulin lispro 抽入同一支注射器。",
    after: "为减少注射次数，把甘精胰岛素和赖脯胰岛素抽入同一支注射器。",
  }),
  setValue({
    id: ID, path: ["matrix","rows",{"id":"r3"},"zh"],
    before: "因患者主诉肌肉痉挛，将 potassium chloride 静脉推注。",
    after: "因患者主诉肌肉痉挛，将氯化钾静脉推注。",
  }),
  setValue({
    id: ID, path: ["matrix","rows",{"id":"r4"},"zh"],
    before: "再次给予 IV hydromorphone 前检查呼吸频率和镇静程度。",
    after: "再次静脉给予氢吗啡酮前检查呼吸频率和镇静程度。",
  }),
  setValue({
    id: ID, path: ["matrix","rows",{"id":"r5"},"zh"],
    before: "病历缺少当前体重时，先澄清 heparin 负荷剂量医嘱。",
    after: "病历缺少当前体重时，先核实肝素单次快速给药的医嘱。",
  }),
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"r2"},"zh"],
    before: "Glargine 不应与 lispro 或其他胰岛素在同一注射器中混合。",
    after: "甘精胰岛素不应与赖脯胰岛素或其他胰岛素混在同一支注射器中。",
  }),
  setValue({
    id: ID, path: ["rationale","correct","zh"],
    before: "高警示药物的安全做法包括使用正确注射器、核对标签、重复给阿片前监测，以及澄清按体重给药的抗凝医嘱。Insulin glargine 不应与其他胰岛素混合，potassium chloride 不应静脉推注。",
    after: "高警示药物的安全做法包括使用正确注射器、核对标签、再次给予阿片类药物前进行监测，以及澄清按体重给药的抗凝医嘱。甘精胰岛素不应与其他胰岛素混合，氯化钾不应静脉推注。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
