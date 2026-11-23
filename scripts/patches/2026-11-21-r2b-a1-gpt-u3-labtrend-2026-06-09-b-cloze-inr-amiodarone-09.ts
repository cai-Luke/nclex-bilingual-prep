import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gpt_u3_labtrend_2026_06_09_b_cloze_inr_amiodarone_09";
export const ops: PatchOp[] = [
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "en"],
    before: "Dropdown 1 should identify bleeding risk because a rising INR means increasing anticoagulant effect.",
    after: "A rising INR indicates increasing anticoagulant effect and a greater risk of bleeding.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "zh"],
    before: "第 1 个下拉框应选择出血风险，因为 INR 上升表示抗凝作用增强。",
    after: "INR 上升表示抗凝作用增强，出血风险随之增加。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "en"],
    before: "Dropdown 2 should prioritize assessment and provider notification because the next warfarin dose may need adjustment.",
    after: "Assess for bleeding and notify the provider before the next warfarin dose because that dose may need adjustment.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "zh"],
    before: "第 2 个下拉框应优先选择评估和通知医嘱开立者，因为下一剂华法林可能需要调整。",
    after: "应评估有无出血，并在下一剂华法林给药前通知医嘱开立者，因为可能需要调整该剂量。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
