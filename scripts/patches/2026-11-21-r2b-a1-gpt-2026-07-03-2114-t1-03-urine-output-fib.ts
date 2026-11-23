import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gpt_2026_07_03_2114_t1_03_urine_output_fib";
export const ops: PatchOp[] = [
  setValue({
    id,
    path: ["rationale", "correct", "en"],
    before: "Use the rule stated in the stem: 0.5 mL × 76 kg × 4 hr = 152 mL. The answer is a total volume for the 4-hour window, not an hourly rate.",
    after: "Use the rule stated in the stem: 0.5 mL × 76 kg × 4 hr = 152 mL. This calculation gives the total volume for the 4-hour window, not an hourly rate.",
  }),
  setValue({
    id,
    path: ["rationale", "correct", "zh"],
    before: "使用题干给出的规则：0.5 mL × 76 kg × 4 hr = 152 mL。答案是 4 小时内的总尿量，不是每小时尿量。",
    after: "使用题干给出的规则：0.5 mL × 76 kg × 4 hr = 152 mL。该计算得出的是 4 小时内的总尿量，不是每小时尿量。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
