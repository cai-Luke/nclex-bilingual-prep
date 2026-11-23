import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gpt_u3_labtrend_2026_06_09_cloze_magnesium_decline_08";
export const ops: PatchOp[] = [
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "en"],
    before: "Dropdown 1 should identify dysrhythmia risk because the visual shows worsening hypomagnesemia, not high magnesium or platelet loss.",
    after: "The trend shows worsening hypomagnesemia, which increases the risk of dysrhythmias. It does not indicate high magnesium or platelet loss.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "zh"],
    before: "第 1 个下拉框应选择心律失常风险，因为图中显示低镁血症恶化，而不是高镁或血小板减少。",
    after: "图中显示低镁血症加重，心律失常的风险增加。该趋势并不提示高镁血症或血小板减少。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "en"],
    before: "Dropdown 2 should identify magnesium replacement with monitoring because the trend is low and symptomatic.",
    after: "The falling magnesium level and associated symptoms support prescribed magnesium replacement with cardiac monitoring.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "zh"],
    before: "第 2 个下拉框应选择补镁并监测，因为趋势显示血镁偏低且已有症状。",
    after: "血镁持续下降并伴有症状，因此应按医嘱补镁并进行心电监测。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
