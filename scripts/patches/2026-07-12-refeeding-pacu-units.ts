/** Owner-adjudicated bilingual PACU unit clarification for the refeeding baseline. */
import { replaceText, runPatch } from "../patch-raw";

const id = "gpt_case_refeeding_syndrome_tpn_01";
const contentPath = ["caseStudy", "exhibits", { id: "baseline_record" }, "content"] as const;

runPatch([
  replaceText({
    id,
    path: [...contentPath, "en"],
    before: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000. AST 28, ALT 22, total bilirubin 0.6.",
    after: "PACU labs 6 hours earlier: Na 138 mEq/L, K 3.5 mEq/L, Cl 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.8 mg/dL, glucose 156 mg/dL, calcium 8.4 mg/dL, phosphorus 2.8 mg/dL, magnesium 1.8 mg/dL, albumin 2.1 g/dL, prealbumin 8 mg/dL, WBC 9,200/µL, Hgb 11.0 g/dL, platelets 210,000/µL. AST 28 U/L, ALT 22 U/L, total bilirubin 0.6 mg/dL.",
    note: "Owner-approved conventional unit tokens only; analyte wording, values, and order preserved.",
  }),
  replaceText({
    id,
    path: [...contentPath, "zh"],
    before: "6 小时前 PACU 化验：Na 138，K 3.5，Cl 102，碳酸氢盐 24，BUN 18，肌酐 0.8，葡萄糖 156，钙 8.4，磷 2.8，镁 1.8，白蛋白 2.1，前白蛋白 8，WBC 9,200，Hgb 11.0，血小板 210,000。AST 28，ALT 22，总胆红素 0.6。",
    after: "6 小时前 PACU 化验：Na 138 mEq/L，K 3.5 mEq/L，Cl 102 mEq/L，碳酸氢盐 24 mEq/L，BUN 18 mg/dL，肌酐 0.8 mg/dL，葡萄糖 156 mg/dL，钙 8.4 mg/dL，磷 2.8 mg/dL，镁 1.8 mg/dL，白蛋白 2.1 g/dL，前白蛋白 8 mg/dL，WBC 9,200/µL，Hgb 11.0 g/dL，血小板 210,000/µL。AST 28 U/L，ALT 22 U/L，总胆红素 0.6 mg/dL。",
    note: "ZH analyte-value-unit sequence mirrors the approved EN additions without renaming analytes.",
  }),
]);
