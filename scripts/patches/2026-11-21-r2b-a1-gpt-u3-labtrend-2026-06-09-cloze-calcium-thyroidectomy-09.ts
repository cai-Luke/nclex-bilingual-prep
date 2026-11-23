import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gpt_u3_labtrend_2026_06_09_cloze_calcium_thyroidectomy_09";
export const ops: PatchOp[] = [
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "en"],
    before: "Dropdown 1 should identify hypocalcemia because calcium is decreasing below the reference range after thyroid surgery.",
    after: "The fall in calcium below the reference range after thyroid surgery indicates hypocalcemia.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "zh"],
    before: "第 1 个下拉框应选择低钙血症，因为甲状腺术后血钙下降到参考范围以下。",
    after: "甲状腺术后血钙降至参考范围以下，提示低钙血症。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "en"],
    before: "Dropdown 2 should prioritize airway because severe hypocalcemia can cause laryngospasm.",
    after: "Airway assessment is the priority because severe hypocalcemia can cause laryngospasm.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "zh"],
    before: "第 2 个下拉框应优先选择气道，因为严重低钙血症可导致喉痉挛。",
    after: "应优先评估气道，因为严重低钙血症可导致喉痉挛。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
