import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "trad_batchD_02";

export const ops: PatchOp[] = [
  setValue({
    id,
    path: ["topic"],
    before: "Maternal-Newborn Care & Teaching",
    after: "Laboratory & Diagnostic Tests",
  }),
  setValue({
    id,
    path: ["options", {"id": "C"}, "en"],
    before: "Hemoglobin of 14 g/dL.",
    after: "White blood cell count of 6.8 ×10³/µL.",
  }),
  setValue({
    id,
    path: ["options", {"id": "C"}, "zh"],
    before: "血红蛋白 14 g/dL。",
    after: "白细胞计数 6.8 ×10³/µL。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", {"refId": "C"}, "en"],
    before: "14 g/dL is within the normal range for hemoglobin.",
    after: "This white blood cell count is within the adult reference range. The result alone does not require reporting.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", {"refId": "C"}, "zh"],
    before: "14 g/dL 在血红蛋白的正常范围内。",
    after: "该白细胞计数在成人参考范围内，单凭这一结果无需向医生报告。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runPatch(ops);
}
