/**
 * R2 D-2 tranche 8, unit 11: zh-only meaning repair for cs_sepsis_shock_01 (banks/hard-cases-canonical.json questions[36]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T08/producer/11/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "cs_sepsis_shock_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"cs_sepsis_shock_01_part_1"},"rationale","correct","zh"],
    before: "客户的发烧、心动过速和呼吸急促符合SIRS的标准。低血压和精神状态改变是脓毒症引起的器官功能障碍的关键指标，标志着病情正向脓毒性休克发展。糖尿病史是感染的风险因素，但不是当前炎症反应或器官衰竭的直接发现。注意：Sepsis-3共识（2016年）以器官功能障碍（SOFA/qSOFA评分）而非SIRS标准定义脓毒症。SIRS仍是NCLEX-RN护理教育的基础内容，在初级护理课程中继续出现。",
    after: "客户的发烧、心动过速和呼吸急促符合SIRS的标准。低血压和精神状态改变是脓毒症引起的器官功能障碍的关键指标，标志着病情正向脓毒性休克发展。糖尿病史是感染的风险因素，但不是当前炎症反应或器官衰竭的直接发现。注意：第三版脓毒症国际共识（Sepsis-3，2016年）以器官功能障碍（SOFA/qSOFA评分）而非SIRS标准定义脓毒症。SIRS仍是NCLEX-RN护理教育的基础内容，在初级护理课程中继续出现。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
