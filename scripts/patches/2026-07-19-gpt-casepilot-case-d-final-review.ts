/**
 * Case D (Acute asthma in the emergency department) — final-review repair.
 * Findings: Codex checker report 2026-07-19, confirmed independently by Claude.
 *
 * 1. The 10:15 reassessment reported SpO2 97% after oxygen was increased,
 *    with no titration, described as "protocol-directed" care. GINA's
 *    stated adult target ceiling on supplemental oxygen is 95%, not 97%.
 *    Fixed to show oxygen titrated down once the target range was reached,
 *    with SpO2/PaO2 lowered to values consistent with that target.
 * 2. Part 5's matrix rationale asserts specific comparability rules (no
 *    positive-pressure ventilation preserves PaCO2/pH comparability;
 *    increased oxygen means PaO2/SpO2 improvement can't establish improved
 *    gas exchange) that the cited GINA pages support only in general terms
 *    (controlled oxygen, reassessment, ABGs, PEF), not as an exact stated
 *    rule. Added an additional exact source for the oxygenation-under-
 *    supplemental-O2 ("corrected hypoxemia") claim per the producer
 *    contract's source-scope requirement.
 */
import { setValue, runPatch } from "../patch-raw";

const id = "gpt_casepilot_2026_07_19_d_case";

const stage1015Content = [
  "caseStudy",
  "stages",
  { id: "gpt_casepilot_2026_07_19_d_stage_1015" },
  "exhibits",
  { id: "gpt_casepilot_2026_07_19_d_exhibit_1015_reassessment" },
  "content",
] as const;

const part5Source = [
  "caseStudy",
  "questions",
  { id: "gpt_casepilot_2026_07_19_d_part_5_support_limited_reassessment" },
  "meta",
  "source",
] as const;

runPatch([
  setValue({
    id,
    path: [...stage1015Content, "en"],
    before:
      "Protocol-directed acute-asthma treatment has continued under critical-care review. Oxygen delivery was increased from the prior controlled low-flow device to a higher-concentration mask. The client is awake, speaks in full sentences, and uses fewer accessory muscles. Respiratory rate is 26/min with deeper breaths, and bilateral air entry is stronger. Peak expiratory flow is 52% predicted using the same meter and technique. SpO₂ is 97% on the increased oxygen support. ABG on the higher oxygen support: pH 7.38, PaCO₂ 38 mm Hg, PaO₂ 92 mm Hg, HCO₃⁻ 22 mEq/L.",
    after:
      "Protocol-directed acute-asthma treatment has continued under critical-care review. Oxygen delivery was increased from the prior controlled low-flow device to a higher-concentration mask, then titrated down once SpO₂ reached the target range. The client is awake, speaks in full sentences, and uses fewer accessory muscles. Respiratory rate is 26/min with deeper breaths, and bilateral air entry is stronger. Peak expiratory flow is 52% predicted using the same meter and technique. SpO₂ is 95% on the titrated oxygen support. ABG on this oxygen support: pH 7.38, PaCO₂ 38 mm Hg, PaO₂ 80 mm Hg, HCO₃⁻ 22 mEq/L.",
    note: "GINA's adult target ceiling on supplemental oxygen is 95%; the untitrated 97% conflicted with guidance. Values lowered to a target-consistent, physiologically plausible pairing.",
  }),
  setValue({
    id,
    path: [...stage1015Content, "zh"],
    before:
      "在重症团队评估下，已继续按路径进行急性哮喘治疗。给氧方式已从先前的控制性低流量装置提高为较高氧浓度的面罩。患者清醒，能说完整句子，辅助呼吸肌使用减少。呼吸频率26次/分，呼吸较深，双侧空气进入增强。使用同一峰流量计和同样方法，呼气峰流量为预计值的52%。在增加的氧支持下SpO₂为97%。在较高氧支持下的动脉血气：pH 7.38，PaCO₂ 38 mm Hg，PaO₂ 92 mm Hg，HCO₃⁻ 22 mEq/L。",
    after:
      "在重症团队评估下，已继续按路径进行急性哮喘治疗。给氧方式已从先前的控制性低流量装置提高为较高氧浓度的面罩，待SpO₂达到目标范围后再下调滴定。患者清醒，能说完整句子，辅助呼吸肌使用减少。呼吸频率26次/分，呼吸较深，双侧空气进入增强。使用同一峰流量计和同样方法，呼气峰流量为预计值的52%。在滴定后的氧支持下SpO₂为95%。在该氧支持下的动脉血气：pH 7.38，PaCO₂ 38 mm Hg，PaO₂ 80 mm Hg，HCO₃⁻ 22 mEq/L。",
    note: "ZH parity for the titrated-oxygen fix.",
  }),
  setValue({
    id,
    path: [...part5Source],
    before:
      "Global Initiative for Asthma (GINA), Global Strategy for Asthma Management and Prevention, 2026, pp. 185 and 189, controlled oxygen context, frequent reassessment, lung-function measurement, and deterioration/response review, https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf",
    after:
      "Global Initiative for Asthma (GINA), Global Strategy for Asthma Management and Prevention, 2026, pp. 185 and 189, controlled oxygen context, frequent reassessment, lung-function measurement, and deterioration/response review, https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf; Respiratory Therapy Zone, ABG Oxygenation Interpretation: PaO2, SaO2, and Hypoxemia (corrected hypoxemia under supplemental oxygen does not represent true normalization of gas exchange), https://www.respiratorytherapyzone.com/abg-oxygenation-interpretation/",
    note: "GINA supports the general acute-care context but not the exact PaO2/SpO2-under-supplemental-oxygen comparability rule keyed by row r3; added an exact additional source for that claim per the producer contract's source-scope rule.",
  }),
]);
