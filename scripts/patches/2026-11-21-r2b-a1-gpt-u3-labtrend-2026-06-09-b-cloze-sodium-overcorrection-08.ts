import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gpt_u3_labtrend_2026_06_09_b_cloze_sodium_overcorrection_08";
export const ops: PatchOp[] = [
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "en"],
    before: "Dropdown 1 should focus on the rate of sodium rise, which is rapid over the displayed time window.",
    after: "The rapid rise in serum sodium over the time shown suggests that correction may be too fast.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "zh"],
    before: "第 1 个下拉框应关注血钠上升速度；图示时间窗内上升很快。",
    after: "图中这段时间内血钠迅速升高，提示纠正速度可能过快。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "en"],
    before: "Dropdown 2 should choose notification and reassessment rather than making sodium rise even faster.",
    after: "Notify the provider so the infusion plan can be reassessed before serum sodium rises even faster.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "zh"],
    before: "第 2 个下拉框应选择通知和重新评估，而不是让血钠升得更快。",
    after: "应通知医嘱开立者，以便重新评估输注方案，避免血钠上升得更快。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
