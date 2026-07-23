import { setValue } from "../patch-raw";
import {
  runContentGatedPatch,
  type ContentChange,
} from "./terminal-sentence-content-gated-runner";

const changes: ContentChange[] = [];

function addStem(queue: number, id: string, before: { en: string; zh: string }, after: { en: string; zh: string }): void {
  changes.push({
    queue,
    id,
    path: ["stem"],
    before,
    after,
    op: setValue({
      id,
      path: ["stem"],
      before,
      after,
      note: `Queue ${queue}: content-gated bilingual stem repair.`,
    }),
  });
}

function addField(
  queue: number,
  id: string,
  path: ContentChange["path"],
  before: unknown,
  after: unknown,
  note: string,
): void {
  changes.push({
    queue,
    id,
    path,
    before,
    after,
    op: setValue({ id, path, before, after, note }),
  });
}

addStem(
  1486,
  "gpt_gap_jun11_fib_scabies_precautions_03",
  {
    en: "A client in a long-term care facility has suspected classic scabies. To reduce transmission during hands-on care, the nurse should initiate {{b1}} and avoid direct skin-to-skin contact until at least {{b2}} after effective treatment begins.",
    zh: "一名长期护理机构患者疑似普通疥疮。为减少在直接护理中的传播，护士应启动 {{b1}}，并在有效治疗开始后至少 {{b2}} 内避免直接皮肤接触。",
  },
  {
    en: "A client in a long-term care facility has suspected classic scabies. The nurse plans transmission precautions for hands-on care and determines how long direct skin-to-skin contact must be avoided after effective treatment begins.",
    zh: "一名长期护理机构患者疑似普通疥疮。护士正在规划直接护理时的传播预防措施，并确定有效治疗开始后应避免直接皮肤接触多长时间。",
  },
);

addStem(
  1492,
  "gpt_gap_jun11_fib_lung_cancer_screening_03",
  {
    en: "A 52-year-old adult who currently smokes asks about lung cancer screening. Under current USPSTF criteria, annual low-dose CT screening is considered when smoking exposure is at least {{b1}} pack-years and continues through age {{b2}} if the client remains otherwise eligible.",
    zh: "一名52岁且目前吸烟的成年人询问肺癌筛查。根据当前USPSTF标准，若吸烟暴露至少为 {{b1}} 包年，并且患者仍符合其他条件，则每年低剂量CT筛查可持续到 {{b2}} 岁。",
  },
  {
    en: "A 52-year-old adult who currently smokes asks about annual low-dose CT screening for lung cancer. The nurse reviews the USPSTF smoking-exposure threshold and the upper age through which screening may continue when the client remains otherwise eligible.",
    zh: "一名 52 岁且目前吸烟的成年人询问每年低剂量 CT 肺癌筛查。护士复核 USPSTF 的吸烟暴露阈值，以及患者仍符合其他条件时可继续筛查的最高年龄。",
  },
);

const naturalized = [
  {
    queue: 2176,
    id: "gpt_format10b_free_water_deficit",
    before: {
      en: "A client with hypernatremia has a supplied total body water (TBW) estimate of 36 L. The measured serum sodium is 158 mEq/L, and the clinician's target sodium for this calculation is 140 mEq/L. Use: free-water deficit = TBW × (measured sodium ÷ target sodium − 1). Calculate the deficit in liters and round to the nearest tenth. This item asks only for the mathematical deficit; do not choose a fluid, infusion rate, correction speed, or volume-status diagnosis.",
      zh: "一名高钠血症患者的总身体水量（TBW）估计值已给定为 36 L。实测血清钠为 158 mEq/L，本次计算的目标钠由临床人员设为 140 mEq/L。使用公式：自由水缺失量 = TBW ×（实测钠 ÷ 目标钠 − 1）。计算缺失量，单位为升，并四舍五入到小数点后一位。本题只要求数学上的缺失量；不要选择液体、输注速度、纠正速度或容量状态诊断。",
    },
    after: {
      en: "A client with hypernatremia has a supplied total body water (TBW) estimate of 36 L. The measured serum sodium is 158 mEq/L, and the clinician's target sodium for this calculation is 140 mEq/L. Use: free-water deficit = TBW × (measured sodium ÷ target sodium − 1). Calculate the deficit in liters and round to the nearest tenth.",
      zh: "一名高钠血症患者的总身体水量（TBW）估计值已给定为 36 L。实测血清钠为 158 mEq/L，本次计算的目标钠由临床人员设为 140 mEq/L。使用公式：自由水缺失量 = TBW ×（实测钠 ÷ 目标钠 − 1）。计算缺失量，单位为升，并四舍五入到小数点后一位。",
    },
  },
  {
    queue: 2178,
    id: "gpt_format10b_rapid_shallow_breathing_index",
    before: {
      en: "During a spontaneous breathing assessment, the respiratory rate is 24 breaths/min and tidal volume is 300 mL. Use RSBI = respiratory frequency ÷ tidal volume in liters. Convert tidal volume to liters, calculate breaths/min/L, and round to the nearest whole number. This item asks only for documentation of the index; RSBI alone is not required to determine spontaneous-breathing-trial readiness.",
      zh: "在一次自主呼吸评估中，呼吸频率为 24 次/分，潮气量为 300 mL。使用公式：RSBI = 呼吸频率 ÷ 以升为单位的潮气量。先把潮气量换算为升，再计算 breaths/min/L，并四舍五入至最接近的整数。本题只要求记录该指数；RSBI 单独并不是判断自主呼吸试验准备度的必需条件。",
    },
    after: {
      en: "During a spontaneous breathing assessment, the respiratory rate is 24 breaths/min and tidal volume is 300 mL. Use RSBI = respiratory frequency ÷ tidal volume in liters. Convert tidal volume to liters, calculate breaths/min/L, and round to the nearest whole number.",
      zh: "在一次自主呼吸评估中，呼吸频率为 24 次/分，潮气量为 300 mL。使用公式：RSBI = 呼吸频率 ÷ 以升为单位的潮气量。先把潮气量换算为升，再计算 breaths/min/L，并四舍五入至最接近的整数。",
    },
  },
  {
    queue: 2185,
    id: "gpt_format8a_haloperidol_qtcf",
    before: {
      en: "A client receiving haloperidol has an ECG with a measured QT interval of 360 ms and an RR interval of 0.729 second. Use the FDA E14 Fridericia correction: QTcF = QT ÷ RR^(1/3), with RR expressed in seconds. Calculate the QTcF and round to the nearest whole millisecond. This item asks only for the corrected interval; do not make a medication decision from this number alone.",
      zh: "一名使用氟哌啶醇的患者，其心电图测得 QT 间期为 360 ms，RR 间期为 0.729 秒。请使用 FDA E14 的 Fridericia 校正公式：QTcF = QT ÷ RR^(1/3)，其中 RR 以秒表示。计算 QTcF，并四舍五入至最接近的整数毫秒。本题只要求计算校正后间期；不能仅凭该数值决定是否用药。",
    },
    after: {
      en: "A client receiving haloperidol has an ECG with a measured QT interval of 360 ms and an RR interval of 0.729 second. Use the FDA E14 Fridericia correction: QTcF = QT ÷ RR^(1/3), with RR expressed in seconds. Calculate the QTcF and round to the nearest whole millisecond.",
      zh: "一名使用氟哌啶醇的患者，其心电图测得 QT 间期为 360 ms，RR 间期为 0.729 秒。请使用 FDA E14 的 Fridericia 校正公式：QTcF = QT ÷ RR^(1/3)，其中 RR 以秒表示。计算 QTcF，并四舍五入至最接近的整数毫秒。",
    },
  },
  {
    queue: 2190,
    id: "gpt_format8a_pf_ratio",
    before: {
      en: "An adult receiving supplemental oxygen has a PaO₂ of 72 mm Hg while the FiO₂ is 0.40. Use P/F ratio = PaO₂ ÷ FiO₂. Calculate the P/F ratio and enter a whole number in mm Hg. This question asks only for the ratio; a ratio alone does not diagnose ARDS.",
      zh: "一名接受补充氧疗的成人，PaO₂ 为 72 mm Hg，FiO₂ 为 0.40。请使用：P/F 比值 = PaO₂ ÷ FiO₂。计算 P/F 比值并以整数填写，单位为 mm Hg。本题只要求计算比值；单凭该比值不能诊断 ARDS。",
    },
    after: {
      en: "An adult receiving supplemental oxygen has a PaO₂ of 72 mm Hg while the FiO₂ is 0.40. Use P/F ratio = PaO₂ ÷ FiO₂. Calculate the P/F ratio and enter a whole number in mm Hg.",
      zh: "一名接受补充氧疗的成人，PaO₂ 为 72 mm Hg，FiO₂ 为 0.40。请使用：P/F 比值 = PaO₂ ÷ FiO₂。计算 P/F 比值并以整数填写，单位为 mm Hg。",
    },
  },
  {
    queue: 2219,
    id: "gpt_format9c_pn_peripheral_central_access",
    before: {
      en: "The nutrition-support service uses the following criteria for peripheral and central parenteral nutrition: peripheral PN may be used for a short anticipated duration when the final osmolarity is no more than 900 mOsm/L and the peripheral site can be closely monitored; more hyperosmolar PN requires central venous administration. A 7-day PN order has a final osmolarity of 820 mOsm/L and is prescribed through a healthy forearm peripheral IV. Apply only the criteria stated here; this item does not present 900 mOsm/L as a universal limit outside this context.",
      zh: "营养支持团队采用以下外周和中心静脉肠外营养标准：当预计疗程较短、最终渗透浓度不超过 900 mOsm/L，且可密切监测外周静脉部位时，可采用外周肠外营养；渗透浓度更高的 PN 需要中心静脉给药。一份预计 7 天的 PN 医嘱最终渗透浓度为 820 mOsm/L，拟经健康的前臂外周静脉输注。仅应用此处给出的标准；本题不把 900 mOsm/L 描述为所有情境下的通用上限。",
    },
    after: {
      en: "The nutrition-support service uses the following criteria for peripheral and central parenteral nutrition: peripheral PN may be used for a short anticipated duration when the final osmolarity is no more than 900 mOsm/L and the peripheral site can be closely monitored; more hyperosmolar PN requires central venous administration. A 7-day PN order has a final osmolarity of 820 mOsm/L and is prescribed through a healthy forearm peripheral IV.",
      zh: "营养支持团队采用以下外周和中心静脉肠外营养标准：当预计疗程较短、最终渗透浓度不超过 900 mOsm/L，且可密切监测外周静脉部位时，可采用外周肠外营养；渗透浓度更高的 PN 需要中心静脉给药。一份预计 7 天的 PN 医嘱最终渗透浓度为 820 mOsm/L，拟经健康的前臂外周静脉输注。",
    },
  },
  {
    queue: 2231,
    id: "gpt_format11b_pediatric_oxygenation_index",
    before: {
      en: "An invasively ventilated child has a mean airway pressure of 18 cm H2O, FiO2 of 0.60, and arterial PaO2 of 72 mm Hg. Use oxygenation index: OI = mean airway pressure × FiO2 × 100 ÷ PaO2. Calculate the oxygenation index and round to the nearest tenth. This item tests arithmetic only; do not diagnose pediatric ARDS or change ventilator settings from this number alone.",
      zh: "一名接受有创机械通气的儿童平均气道压为 18 cm H2O，FiO2 为 0.60，动脉 PaO2 为 72 mm Hg。使用氧合指数公式：OI = 平均气道压 × FiO2 × 100 ÷ PaO2。计算氧合指数，并四舍五入到小数点后一位。本题仅测试计算；不能仅凭该数值诊断儿童 ARDS 或调整呼吸机设置。",
    },
    after: {
      en: "An invasively ventilated child has a mean airway pressure of 18 cm H2O, FiO2 of 0.60, and arterial PaO2 of 72 mm Hg. Use oxygenation index: OI = mean airway pressure × FiO2 × 100 ÷ PaO2. Calculate the oxygenation index and round to the nearest tenth.",
      zh: "一名接受有创机械通气的儿童平均气道压为 18 cm H2O，FiO2 为 0.60，动脉 PaO2 为 72 mm Hg。使用氧合指数公式：OI = 平均气道压 × FiO2 × 100 ÷ PaO2。计算氧合指数，并四舍五入到小数点后一位。",
    },
  },
  {
    queue: 2238,
    id: "gpt_format11c_water_deprivation_desmopressin_interpretation",
    before: {
      en: "In a monitored endocrine unit, a stable client with hypotonic polyuria undergoes a supervised water-deprivation test with protocol stop criteria and serial laboratory monitoring. Baseline serum sodium is 143 mEq/L, plasma osmolality is 292 mOsm/kg, and urine osmolality is 82 mOsm/kg. During deprivation, urine osmolality remains 86–94 mOsm/kg without meaningful concentration; serum sodium rises to 147 mEq/L and plasma osmolality to 304 mOsm/kg, and the test is stopped at the protocol weight-loss limit. After supervised desmopressin administration, urine osmolality rises to 612 mOsm/kg. Partial and indeterminate response patterns are excluded from this item.",
      zh: "在内分泌监护病区，一名情况稳定、存在低渗性多尿的患者接受有停止标准和连续实验室监测的监督性禁水试验。基线血钠 143 mEq/L，血浆渗透压 292 mOsm/kg，尿渗透压 82 mOsm/kg。禁水期间尿渗透压保持在 86–94 mOsm/kg，无有意义浓缩；血钠升至 147 mEq/L、血浆渗透压升至 304 mOsm/kg，并在达到方案体重下降上限时停止试验。监督下给予去氨加压素后，尿渗透压升至 612 mOsm/kg。本题排除部分性和不确定反应模式。",
    },
    after: {
      en: "In a monitored endocrine unit, a stable client with hypotonic polyuria undergoes a supervised water-deprivation test with protocol stop criteria and serial laboratory monitoring. Baseline serum sodium is 143 mEq/L, plasma osmolality is 292 mOsm/kg, and urine osmolality is 82 mOsm/kg. During deprivation, urine osmolality remains 86–94 mOsm/kg without meaningful concentration; serum sodium rises to 147 mEq/L and plasma osmolality to 304 mOsm/kg, and the test is stopped at the protocol weight-loss limit. After supervised desmopressin administration, urine osmolality rises to 612 mOsm/kg.",
      zh: "在内分泌监护病区，一名情况稳定、存在低渗性多尿的患者接受有停止标准和连续实验室监测的监督性禁水试验。基线血钠 143 mEq/L，血浆渗透压 292 mOsm/kg，尿渗透压 82 mOsm/kg。禁水期间尿渗透压保持在 86–94 mOsm/kg，无有意义浓缩；血钠升至 147 mEq/L、血浆渗透压升至 304 mOsm/kg，并在达到方案体重下降上限时停止试验。监督下给予去氨加压素后，尿渗透压升至 612 mOsm/kg。",
    },
  },
] as const;

for (const entry of naturalized) addStem(entry.queue, entry.id, entry.before, entry.after);

const pnRationaleBefore = {
  en: "Under the ASPEN-based criteria stated in the stem, the short duration and 820 mOsm/L formulation fit peripheral PN. The key nursing implication is frequent assessment of the peripheral site for phlebitis, infiltration, pain, erythema, or loss of patency. If the formulation is changed to 1150 mOsm/L, the same criteria support central venous access with the catheter tip in the central circulation rather than continuing through the peripheral IV.",
  zh: "根据题干所述的 ASPEN 标准，短期疗程及 820 mOsm/L 配方符合外周 PN。关键护理监测是频繁评估外周部位是否出现静脉炎、渗漏、疼痛、红斑或通畅性丧失。若配方改为 1150 mOsm/L，同一标准支持使用导管尖端位于中心循环的中心静脉通路，而不是继续通过该外周静脉。",
};
const pnRationaleAfter = {
  en: `${pnRationaleBefore.en} The 900 mOsm/L criterion is applied within this nutrition-support service's stated protocol and should not be treated as a universal limit independent of formulation, access, patient, and institutional factors.`,
  zh: `${pnRationaleBefore.zh} 此处的 900 mOsm/L 标准适用于该营养支持团队所述方案，不应脱离配方、通路、患者和机构因素而视为通用上限。`,
};
addField(2219, "gpt_format9c_pn_peripheral_central_access", ["rationale", "correct"], pnRationaleBefore, pnRationaleAfter, "Queue 2219: relocate the context-specific threshold caution to the rationale.");

const oiRationaleBefore = {
  en: "OI = 18 × 0.60 × 100 ÷ 72 = 1080 ÷ 72 = 15.0. The supplied FiO2 is already a decimal, so it is not converted to 60 before the equation.",
  zh: "OI = 18 × 0.60 × 100 ÷ 72 = 1080 ÷ 72 = 15.0。题干中的 FiO2 已是小数，因此代入公式前不能再转换为 60。",
};
const oiRationaleAfter = {
  en: `${oiRationaleBefore.en} Oxygenation index is interpreted with the full pediatric ARDS assessment and does not by itself establish a diagnosis or dictate ventilator changes.`,
  zh: `${oiRationaleBefore.zh} 氧合指数需结合完整的儿童 ARDS 评估解读，不能单独确立诊断或决定呼吸机调整。`,
};
addField(2231, "gpt_format11b_pediatric_oxygenation_index", ["rationale", "correct"], oiRationaleBefore, oiRationaleAfter, "Queue 2231: relocate the clinical interpretation caution to the rationale.");

addStem(
  2123,
  "gpt_balance6a_2026_07_16_mx_discharge_planning_handoff_09",
  {
    en: "A client will begin home enteral feeding with a pump. Classify each transition element as ready for discharge or unresolved. This item tests transition readiness, not bedside tube-placement verification.",
    zh: "一名患者将开始使用泵进行居家肠内营养。请将每项过渡要素分类为“已准备好出院”或“尚未解决”。本题考查过渡准备情况，不考查床旁导管位置核实技术。",
  },
  {
    en: "A client will begin home enteral feeding with a pump. Classify each transition element as ready for discharge or unresolved.",
    zh: "一名患者将开始使用泵进行居家肠内营养。请将每项过渡要素分类为“已准备好出院”或“尚未解决”。",
  },
);

const clozapineParent = "gpt_case_clozapine_toxicity_01";
const stage2Selector = { id: "stage_2" };
const stage2ExhibitSelector = { id: "day18_assessment" };
const q5Selector = { id: "gpt_case_clozapine_toxicity_01_q5" };
const stage2BeforeEn = "Current dose: clozapine 250 mg/day in divided doses. The client reports new chest pressure that began yesterday, mild shortness of breath when walking to the dining hall, fatigue, sore throat that began this morning, and feeling hot. Hallucinations remain improved. Bowel movements are occurring every other day with the bowel regimen.\n\nVital signs and exam: T 101.7 °F (38.7 °C), HR 118 at rest, BP 110/70 sitting, RR 22, SpO2 95% on room air. New S3 gallop, bibasilar crackles, pharyngeal erythema without exudate, and new mild bilateral ankle edema. The client appears fatigued and is lying in bed.\n\nStat labs: WBC 3.1 ×10³/µL, ANC 980/µL, Hgb 14.2 g/dL, platelets 210 ×10³/µL. Troponin I 0.48 ng/mL, CRP 68 mg/L, BNP 420 pg/mL, AST 52 U/L, ALT 48 U/L, fasting glucose 124 mg/dL. ECG: sinus tachycardia at 118 bpm, nonspecific ST-T wave changes, QTc 448 ms.";
const stage2BeforeZh = "当前剂量：氯氮平 250 mg/日，分次给药。患者报告从昨天开始的新发胸部压迫感、走到餐厅时轻度气短、疲乏、今晨开始咽痛，以及主观发热感。幻听仍有改善。使用肠道方案后每隔一天排便。\n\n生命体征和体格检查：T 101.7 °F (38.7 °C)，静息 HR 118，坐位 BP 110/70，RR 22，室内空气 SpO2 95%。新出现 S3 奔马律、双肺底湿啰音、无渗出的咽部红斑，以及新发轻度双踝水肿。患者显得疲乏，躺在床上。\n\n急查实验室：WBC 3.1 ×10³/µL，ANC 980/µL，Hgb 14.2 g/dL，血小板 210 ×10³/µL。肌钙蛋白 I 0.48 ng/mL，CRP 68 mg/L，BNP 420 pg/mL，AST 52 U/L，ALT 48 U/L，空腹血糖124 mg/dL。心电图：窦性心动过速118次/分，非特异性 ST-T 改变，QTc 448 ms。";
addField(
  1731,
  clozapineParent,
  ["caseStudy", "stages", stage2Selector, "exhibits", stage2ExhibitSelector, "content", "en"],
  stage2BeforeEn,
  `${stage2BeforeEn} On receiving the ANC result, the nurse immediately initiates the facility's neutropenic-precautions protocol while preparing the remaining time-critical actions.`,
  "Queue 1731: incorporate neutropenic precautions into the Stage 2 state as already initiated.",
);
addField(
  1731,
  clozapineParent,
  ["caseStudy", "stages", stage2Selector, "exhibits", stage2ExhibitSelector, "content", "zh"],
  stage2BeforeZh,
  `${stage2BeforeZh} 收到 ANC 结果后，护士立即启动机构的中性粒细胞减少防护方案，同时准备其余具有时效性的措施。`,
  "Queue 1731: paired Chinese incorporation of already-initiated precautions.",
);
addField(
  1731,
  clozapineParent,
  ["caseStudy", "questions", q5Selector, "stem"],
  {
    en: "The Stage 2 clozapine dose has not yet been given. Place the time-critical actions in the safest order. Neutropenic precautions should also be initiated, but these options focus on the serial steps that have clear ordering constraints.",
    zh: "阶段2的氯氮平剂量尚未给予。请按最安全顺序排列具有时效性的措施。也应启动中性粒细胞减少防护，但以下选项聚焦于有明确先后关系的连续步骤。",
  },
  {
    en: "The Stage 2 clozapine dose has not yet been given, and neutropenic precautions are in place. Place the remaining time-critical actions in the safest order.",
    zh: "阶段 2 的氯氮平剂量尚未给予，且中性粒细胞减少防护已启动。请按最安全顺序排列其余具有时效性的措施。",
  },
  "Queue 1731: rewrite q5 after incorporating the concurrent precaution into the case state.",
);

const retinalId = "gpt_format11b_retinal_detachment_emergency_cues";
addStem(
  2228,
  retinalId,
  {
    en: "An adult calls an eye clinic about new visual symptoms. Highlight only the findings that require urgent retinal evaluation for possible retinal tear or detachment under the National Eye Institute pathway. Stable longstanding findings are included as near-misses.",
    zh: "一名成人致电眼科门诊咨询新出现的视觉症状。仅标出依据美国国家眼科研究所路径需要紧急视网膜评估、可能提示视网膜裂孔或脱离的发现。记录中包含稳定的长期表现作为近似干扰项。",
  },
  {
    en: "An adult calls an eye clinic about visual changes. Highlight the findings that require urgent retinal evaluation for a possible retinal tear or detachment.",
    zh: "一名成人致电眼科门诊咨询视觉变化。请标出需要紧急视网膜评估、可能提示视网膜裂孔或脱离的发现。",
  },
);

const segmentRewrites = [
  ["s0", "Telephone note:", "Caller report:", "电话记录：", "来电者报告："],
  ["s1", "Bright flashes began suddenly in the left peripheral vision this morning.", "Bright flashes suddenly appeared in the left peripheral vision this morning.", "今天早晨左侧周边视野突然出现明亮闪光。", "今天早晨，左侧周边视野突然出现明亮闪光。"],
  ["s2", "Within an hour, the client noticed a shower of many new dark floaters.", "Over the next hour, many new dark floaters appeared like a shower.", "一小时内，患者注意到大量新发暗色飞蚊，像阵雨一样。", "随后一小时内，大量新发暗色飞蚊如阵雨般出现。"],
  ["s3", "A gray curtain now seems to move inward from the temporal side.", "A gray curtain has begun moving inward from the temporal side of the visual field.", "现在感觉灰色帘幕从颞侧向中央移动。", "灰色帘幕开始从颞侧视野向中央移动。"],
  ["s4", "The client cannot see objects in part of the outer visual field.", "Objects are no longer visible in part of the outer visual field.", "患者看不到外侧视野一部分的物体。", "外侧视野的一部分已看不到物体。"],
  ["s5", "These new symptoms started the day after a ball struck the eye.", "A ball struck the eye yesterday; the flashes, new floaters, and field change all began after the injury.", "这些新症状在眼睛被球击中后的第二天开始。", "昨天眼睛被球击中；闪光、新发飞蚊和视野变化均在受伤后出现。"],
  ["s6", "Two small floaters have been unchanged for 5 years.", "Two small floaters have remained unchanged for 5 years.", "两个小飞蚊已 5 年无变化。", "两个小飞蚊已持续 5 年且没有变化。"],
  ["s7", "Nighttime glare has gradually increased over 10 months.", "Nighttime glare has increased gradually over 10 months without a sudden change.", "夜间眩光在 10 个月内逐渐加重。", "夜间眩光在 10 个月内逐渐加重，没有突然变化。"],
] as const;

for (const [segmentId, beforeEn, afterEn, beforeZh, afterZh] of segmentRewrites) {
  const selector = { id: segmentId };
  addField(2228, retinalId, ["highlight", "segments", selector, "en"], beforeEn, afterEn, `Queue 2228: rewrite segment ${segmentId} into an atomic clinical record statement.`);
  addField(2228, retinalId, ["highlight", "segments", selector, "zh"], beforeZh, afterZh, `Queue 2228: paired Chinese rewrite for segment ${segmentId}.`);
}

const selfReferential = /this (?:item|question)|tests? arithmetic|apply only|near-miss|本题|仅应用|近似干扰/i;
runContentGatedPatch({
  bankPath: "banks/gpt-canonical.json",
  reason: "apply Claude-approved terminal-sentence content-gated GPT repairs",
  changes,
  assertPostconditions(bank) {
    for (const queue of [1486, 1492]) {
      const id = queue === 1486 ? "gpt_gap_jun11_fib_scabies_precautions_03" : "gpt_gap_jun11_fib_lung_cancer_screening_03";
      const question = bank.questions.find((entry: any) => entry.id === id);
      if (/\{\{[^}]+\}\}/.test(`${question.stem.en} ${question.stem.zh}`)) {
        throw new Error(`queue ${queue} ordinary stem retains placeholders`);
      }
      if (!question.blanks?.length) throw new Error(`queue ${queue} lost blanks`);
    }
    for (const entry of naturalized) {
      const question = bank.questions.find((candidate: any) => candidate.id === entry.id);
      if (selfReferential.test(`${question.stem.en} ${question.stem.zh}`)) {
        throw new Error(`queue ${entry.queue} retains self-referential framing`);
      }
    }
    const transition = bank.questions.find((entry: any) => entry.id === "gpt_balance6a_2026_07_16_mx_discharge_planning_handoff_09");
    if (selfReferential.test(`${transition.stem.en} ${transition.stem.zh}`)) throw new Error("queue 2123 retains construct commentary");
    if (!transition.matrix.rows.every((row: any) => /plan|demonstrate|contact|delivery|support|video|ordered|after-hours|方案|回示|联系|送达|支持|视频|订购|非工作时间/i.test(`${row.en} ${row.zh}`))) {
      throw new Error("queue 2123 contains a row outside transition readiness");
    }
    const clozapine = bank.questions.find((entry: any) => entry.id === clozapineParent);
    if (clozapine.caseStudy.questions.length !== 6) throw new Error("queue 1731 no longer preserves all six live case parts");
    const q5 = clozapine.caseStudy.questions.find((entry: any) => entry.id === q5Selector.id);
    if (q5.itemType !== "ordered_response" || q5.correct.join(",") !== "A,B,C,D,E") {
      throw new Error("queue 1731 q5 format or key changed");
    }
    const retinal = bank.questions.find((entry: any) => entry.id === retinalId);
    if (retinal.highlight.correct.join(",") !== "s1,s2,s3,s4,s5") throw new Error("queue 2228 highlight key changed");
    if (selfReferential.test(`${retinal.stem.en} ${retinal.stem.zh}`)) throw new Error("queue 2228 retains construction commentary");
  },
});
