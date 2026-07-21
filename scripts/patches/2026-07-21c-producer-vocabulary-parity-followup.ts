import { setValue, runPatch } from "../patch-raw";

/**
 * Follow-up to 2026-07-21-producer-vocabulary-naturalization.ts.
 * Independent content review (2026-07-21) found nine learner-facing fields where the
 * same producer/checker-vocabulary defect survived the first pass: Chinese counterparts
 * (封闭/封闭式/来源支持) left unnaturalized after their paired English field was fixed,
 * one item where English and Chinese were both missed within an already-touched item
 * (q13_s7), and one item entirely outside the original 30/15 baseline ("closed scenario").
 * See audit/producer-vocabulary-leakage-2026-07-21/independent-review-report.md.
 */
runPatch([
  setValue({
    id: "gpt_format9c_noisy_respiratory_secretions",
    path: ["rationale", "byChoice", { refId: "3" }, "zh"],
    before: "第 3 空中，评估、改变体位及口腔护理是来源支持的初始措施；常规深部吸引可能增加负担，也不能仅因声音存在就自动用药。",
    after: "第 3 空中，评估、改变体位及口腔护理是适当的初始措施；常规深部吸引可能增加负担，也不能仅因声音存在就自动用药。",
    note: "Chinese parity: 来源支持 (source-supported) mirrors the removed English term; paired English already reads 'appropriate initial measures'.",
  }),
  setValue({
    id: "gpt_format7b_inpatient_alcohol_withdrawal_pathway",
    path: ["testTakingStrategy", "zh"],
    before: "按照题干给出的封闭式流程：先评估，再启动已开立的方案，然后实施监测和支持，最后评价反应。",
    after: "按照题干给出的流程：先评估，再启动已开立的方案，然后实施监测和支持，最后评价反应。",
    note: "Chinese parity: named strategy item; paired English already reads 'Follow the pathway stated in the stem'.",
  }),
  setValue({
    id: "gpt_format10c_parenteral_nutrition_discontinuation_plan",
    path: ["stem", "zh"],
    before: "一名患者可靠的口服及肠内摄入已连续 24 小时达到营养支持团队设定的个体化非 PN 目标。团队写下以下封闭式停用方案：先核实并记录目标已达到；调整专门用于持续 PN 的计划胰岛素；1800 将 PN 降至 50% 持续 1 小时；1900 停止 PN；1930 检查床旁血糖。请按顺序排列措施。题干时间属于本次处方，并非普遍 PN 减量方案。",
    after: "一名患者可靠的口服及肠内摄入已连续 24 小时达到营养支持团队设定的个体化非 PN 目标。团队记录以下肠外营养停用方案：先核实并记录目标已达到；调整专门用于持续 PN 的计划胰岛素；1800 将 PN 降至 50% 持续 1 小时；1900 停止 PN；1930 检查床旁血糖。请按顺序排列措施。题干时间属于本次处方，并非普遍 PN 减量方案。",
    note: "Chinese parity: named stem item; paired English already reads 'The team documents the following parenteral-nutrition discontinuation plan'.",
  }),
  setValue({
    id: "gpt_deepen_2026_06_23_cue_02",
    path: ["rationale", "correct", "zh"],
    before: "被标出的发现符合题干中的封闭式升级规则：CIWA-Ar 高分、伴现实检验受损的幻觉、超过阈值的发热和心动过速，以及定向障碍。",
    after: "被标出的发现符合题干中的升级标准：CIWA-Ar 高分、伴现实检验受损的幻觉、超过阈值的发热和心动过速，以及定向障碍。",
    note: "Chinese parity: paired English already reads 'the escalation criteria stated in the stem'.",
  }),
  setValue({
    id: "gpt_mocsic_2026_07_15_or_confidentiality_hipaa_08",
    path: ["rationale", "correct", "zh"],
    before: "题干中的机构政策明确了封闭式顺序：远程锁定或清除设备，通知隐私/信息安全部门，记录丢失事实且不篡改证据，最后完成正式事件报告。",
    after: "题干中的机构政策明确了以下顺序：远程锁定或清除设备，通知隐私/信息安全部门，记录丢失事实且不篡改证据，最后完成正式事件报告。",
    note: "Chinese parity: paired English already reads 'The policy stated in the stem establishes this sequence'.",
  }),
  setValue({
    id: "gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13",
    path: ["testTakingStrategy", "zh"],
    before: "把已启动的计划视为封闭规则。只选择能够保持唯一身份，并通过指定追踪、家属和媒体职能传递信息的行动。",
    after: "把已启动的计划视为应遵循的规程。只选择能够保持唯一身份，并通过指定追踪、家属和媒体职能传递信息的行动。",
    note: "Chinese parity: named strategy item; paired English already reads 'Use the activated plan as the governing protocol'.",
  }),
  setValue({
    id: "gpt_balance6a_2026_07_16_or_procedural_complications_dialysis_14",
    path: ["rationale", "correct", "zh"],
    before: "混浊透出液伴腹痛需要迅速评估腹透相关腹膜炎。根据题干给出的稳定、封闭流程，应先通知腹透临床医生，在不造成危险延误的情况下于首次抗生素前采集指定透出液检查，然后立即开始医嘱经验性治疗，最后根据临床反应和结果调整治疗。",
    after: "混浊透出液伴腹痛需要迅速评估腹透相关腹膜炎。针对病情稳定的患者，按照题干给出的流程，应先通知腹透临床医生，在不造成危险延误的情况下于首次抗生素前采集指定透出液检查，然后立即开始医嘱经验性治疗，最后根据临床反应和结果调整治疗。",
    note: "Chinese parity: paired English already reads 'Under the pathway stated in the stem for a stable client'.",
  }),
  setValue({
    id: "gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13",
    path: ["rationale", "byChoice", { refId: "q13_s7" }, "en"],
    before: "Unverified bedside disclosure violates the closed information pathway and may spread misinformation.",
    after: "Unverified bedside disclosure violates the designated information-management process and may spread misinformation.",
    note: "Missed by the first pass (phrase 'closed information pathway' not in the finite lexicon). Reworded to match the sibling rationale in the same item (q13_s6: 'the designated reunification and information-management process').",
  }),
  setValue({
    id: "gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13",
    path: ["rationale", "byChoice", { refId: "q13_s7" }, "zh"],
    before: "床旁披露未经核实的信息违反封闭的信息通道，也可能传播错误信息。",
    after: "床旁披露未经核实的信息违反指定的信息管理流程，也可能传播错误信息。",
    note: "Chinese parity for q13_s7; mirrors q13_s6 Chinese ('指定的团聚和信息管理流程').",
  }),
  setValue({
    id: "gpt_format10c_pediatric_rabies_pep_sequence",
    path: ["rationale", "correct", "en"],
    before: "Immediate wound washing and irrigation is the first action. The exposure then requires urgent medical and public-health risk assessment; in this closed scenario, that assessment determines PEP is indicated. For an immunocompetent child who has never been vaccinated, the day-0 visit bundles HRIG infiltrated into and around the wound when feasible with the first vaccine dose at a separate anatomic site. Remaining vaccine doses are scheduled for days 3, 7, and 14.",
    after: "Immediate wound washing and irrigation is the first action. The exposure then requires urgent medical and public-health risk assessment; in this case, that assessment has already determined that PEP is indicated. For an immunocompetent child who has never been vaccinated, the day-0 visit bundles HRIG infiltrated into and around the wound when feasible with the first vaccine dose at a separate anatomic site. Remaining vaccine doses are scheduled for days 3, 7, and 14.",
    note: "Outside the original 30/15 baseline (phrase 'closed scenario' not in the finite lexicon). Naturalized to match the stem, which already states the health department determined PEP is indicated.",
  }),
  setValue({
    id: "gpt_format10c_pediatric_rabies_pep_sequence",
    path: ["rationale", "correct", "zh"],
    before: "首先立即清洗和冲洗伤口。随后需要紧急医学及公共卫生风险评估；在本题封闭情境中，评估已判定需要 PEP。对免疫功能正常且从未接种过狂犬病疫苗的儿童，第 0 天就诊应把尽可能浸润于伤口内及周围的 HRIG，与在不同解剖部位给予的首剂疫苗作为同一次就诊的组合里程碑。其余疫苗安排在第 3、7 和 14 天。",
    after: "首先立即清洗和冲洗伤口。随后需要紧急医学及公共卫生风险评估；在本例中，评估已判定需要 PEP。对免疫功能正常且从未接种过狂犬病疫苗的儿童，第 0 天就诊应把尽可能浸润于伤口内及周围的 HRIG，与在不同解剖部位给予的首剂疫苗作为同一次就诊的组合里程碑。其余疫苗安排在第 3、7 和 14 天。",
    note: "Chinese parity for the rabies PEP item.",
  }),
]);
