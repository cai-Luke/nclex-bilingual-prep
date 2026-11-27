/**
 * R2 D-2 tranche 7, unit 04: zh-only meaning repair for gpt_pharm_easy_medium_2026_06_21_b_mc_potassium_iv_push_12 (banks/gpt-canonical.json questions[343]).
 * Producer: Codex gpt-6.2-astra high. Independent checker route: Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T07/producer/04/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_pharm_easy_medium_2026_06_21_b_mc_potassium_iv_push_12";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["options",{"id":"D"},"zh"],
    before: "只静推一半剂量，稍后复查 potassium。",
    after: "仅静脉推注医嘱剂量的一半，稍后复查血钾。",
  }),
  setValue({
    id: ID, path: ["options",{"id":"A"},"zh"],
    before: "将 potassium chloride 静脉推注，5 分钟内慢慢推完。",
    after: "将氯化钾静脉推注，5 分钟内慢慢推完。",
  }),
  setValue({
    id: ID, path: ["options",{"id":"C"},"zh"],
    before: "因 IV push 不安全，改为 IM 给予 potassium chloride。",
    after: "因静脉推注不安全，改为肌内注射氯化钾。",
  }),
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"A"},"zh"],
    before: "即使慢速，IV push potassium 仍不安全。",
    after: "即使放慢速度，静脉推注钾剂仍不安全。",
  }),
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"C"},"zh"],
    before: "护士不能自行把 potassium 改为 IM 给药。",
    after: "护士不能自行将钾剂的给药途径改为肌内注射。",
  }),
  setValue({
    id: ID, path: ["rationale","correct","zh"],
    before: "Potassium chloride 不应 IV push。护士应暂停不安全医嘱，并澄清稀释输注、适当速度和监测要求。慢速静推、擅自改为 IM 或自行给半量都是不安全变通。",
    after: "氯化钾不得静脉推注。护士应暂停不安全医嘱，并核实稀释后输注的要求，包括适当的输注速度和所需监测。慢速静脉推注、擅自改为肌内注射或自行减为半量都不安全。",
  }),
  setValue({
    id: ID, path: ["stem","zh"],
    before: "护士收到新医嘱：“Potassium chloride 40 mEq IV push now，用于 potassium 3.0 mEq/L。”护士最佳行动是什么？",
    after: "护士收到新医嘱：“因血钾为 3.0 mEq/L，立即静脉推注氯化钾 40 mEq。”护士最佳行动是什么？",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
