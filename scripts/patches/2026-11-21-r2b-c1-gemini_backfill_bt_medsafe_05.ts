/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_backfill_bt_medsafe_05 (banks/gemini-canonical.json questions[789]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) 604ed0564435f8b2a401e74f544e5100f4e661a2096bd1a1561eb48ad0fb204f. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_backfill_bt_medsafe_05";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "The client is demonstrating features of heparin-induced thrombocytopenia (HIT), a serious immune-mediated reaction that typically occurs 5 to 10 days after starting heparin therapy. It is characterized by a >50% drop in platelet count from baseline. Despite the low platelet count, HIT is a paradoxically highly prothrombotic state. The priority actions are to immediately stop the heparin infusion (a1) and eliminate all exposure to heparin, including heparin flushes and heparin-coated lines (a2), to halt the immunological process. Transfusing platelets (a3) is contraindicated because it can cause severe thrombotic events by fuel to the active immune complexes. Initiating warfarin (a4) in the acute phase is also contraindicated because it rapidly depletes protein C, risking skin necrosis and gangrene. Non-heparin anticoagulants (e.g., argatroban) must be used. Monitoring parameters include daily platelet counts (p1) to track recovery, and close clinical monitoring for signs of new arterial or venous thrombosis (p2). Monitoring aPTT (p3) is no longer the primary indicator once heparin is stopped.",
    after: "The client is demonstrating features of heparin-induced thrombocytopenia (HIT), a serious immune-mediated reaction that typically occurs 5 to 10 days after starting heparin therapy. It is characterized by a >50% drop in platelet count from baseline. Despite the low platelet count, HIT is a paradoxically highly prothrombotic state. The priority actions are to immediately stop the heparin infusion and eliminate all exposure to heparin, including heparin flushes and heparin-coated lines, to halt the immunological process. Transfusing platelets is contraindicated because it can cause severe thrombotic events by fuel to the active immune complexes. Initiating warfarin in the acute phase is also contraindicated because it rapidly depletes protein C, risking skin necrosis and gangrene. Non-heparin anticoagulants (e.g., argatroban) must be used. Monitoring parameters include daily platelet counts to track recovery, and close clinical monitoring for signs of new arterial or venous thrombosis. Monitoring aPTT is no longer the primary indicator once heparin is stopped.",
    note: "R2 B-2R P4 reference rewrite: 7 edit(s) covering 7 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "该患者表现出肝素诱导的血小板减少症 (HIT) 的特征，这是一种严重的免疫介导反应，通常在开始肝素治疗后 5 至 10 天发生。其特点是血小板计数较基线值下降 >50%。尽管血小板计数较低，但反常的是，HIT 处于一种高度促血栓状态。优先的措施是立即停止肝素输注 (a1) 并消除所有肝素暴露，包括肝素冲洗液和含肝素涂层的管路 (a2)，以阻止免疫病理过程。在 HIT 中禁用血小板输注 (a3)，因为输入血小板会加剧活动性免疫复合物反应并引起严重的血栓事件。在急性期也禁用启动华法林治疗 (a4)，因为它会迅速耗竭蛋白 C，存在皮肤坏死和坏疽的风险。必须使用非肝素类抗凝剂（如阿加曲班）。监测的参数包括每日血小板计数 (p1) 以追踪恢复情况，以及密切监测新发动脉或静脉血栓形成 (p2) 的临床征象。一旦停止使用肝素，监测 aPTT (p3) 便不再是首要监测指标。",
    after: "该患者表现出肝素诱导的血小板减少症 (HIT) 的特征，这是一种严重的免疫介导反应，通常在开始肝素治疗后 5 至 10 天发生。其特点是血小板计数较基线值下降 >50%。尽管血小板计数较低，但反常的是，HIT 处于一种高度促血栓状态。优先的措施是立即停止肝素输注并消除所有肝素暴露，包括肝素冲洗液和含肝素涂层的管路，以阻止免疫病理过程。在 HIT 中禁用血小板输注，因为输入血小板会加剧活动性免疫复合物反应并引起严重的血栓事件。在急性期也禁用启动华法林治疗，因为它会迅速耗竭蛋白 C，存在皮肤坏死和坏疽的风险。必须使用非肝素类抗凝剂（如阿加曲班）。监测的参数包括每日血小板计数以追踪恢复情况，以及密切监测新发动脉或静脉血栓形成的临床征象。一旦停止使用肝素，监测 aPTT 便不再是首要监测指标。",
    note: "R2 B-2R P4 reference rewrite: 7 edit(s) covering 7 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
