// D-2 T02, unit 17. Candidate for independent translation review.
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gpt_2026_06_19_case_ici_pneumonitis_01_bowtie";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["bowtie", "actions", "tokens", {"id":"act_methylpred"}, "zh"],
    before: "按院内irAE肺炎方案医嘱开始methylprednisolone。",
    after: "按医嘱，依据院内免疫相关不良事件肺炎处置方案开始给予甲泼尼龙。",
  }),
  setValue({
    id, path: ["bowtie", "actions", "tokens", {"id":"act_continue_pembro"}, "zh"],
    before: "给予下一次pembrolizumab输注，以免中断癌症治疗。",
    after: "继续按计划输注下一次帕博利珠单抗，以免中断抗肿瘤治疗。",
  }),
  setValue({
    id, path: ["bowtie", "actions", "tokens", {"id":"act_wait_pulm"}, "zh"],
    before: "等肺科回电后再吸氧和给予corticosteroid。",
    after: "待呼吸科回电后再开始氧疗并给予糖皮质激素。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"cond_ici_pneumonitis"}, "zh"],
    before: "正确。pembrolizumab后的时间关系，加上双侧磨玻璃影、血氧下降、爆裂音和CRP升高，构成预期模式。",
    after: "正确。症状出现在帕博利珠单抗治疗后，伴双肺磨玻璃影、血氧饱和度下降、湿啰音和 CRP 升高，符合该病的表现。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"param_platelets"}, "zh"],
    before: "不正确。血小板计数正常，不能反映肺炎对吸氧和corticosteroid的反应。",
    after: "不正确。血小板计数正常，也不能反映肺炎经氧疗和糖皮质激素治疗后的反应。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"act_methylpred"}, "zh"],
    before: "正确。医嘱corticosteroid用于治疗免疫介导炎症过程，应在开始氧合支持后迅速执行。",
    after: "正确。医嘱中的糖皮质激素用于治疗免疫介导的炎症，应在开始氧疗后尽快给予。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", {"refId":"act_wait_pulm"}, "zh"],
    before: "不正确。肺科共同管理很重要，但等待会在病情恶化时延误已开立的吸氧和corticosteroid。",
    after: "不正确。呼吸科参与诊疗很重要，但在病情恶化时等待回电，会延误已开立的氧疗和糖皮质激素治疗。",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "该病情为免疫检查点抑制剂相关性肺炎，因为呼吸线索组合、CT模式、氧合下降、炎症指标和pembrolizumab时间关系符合免疫介导的肺部炎症。优先措施是立即支持氧合并执行医嘱corticosteroid治疗。监测SpO2趋势以及呼吸频率/呼吸做功，可评估气体交换和通气需求是否改善。",
    after: "此病情为免疫检查点抑制剂相关性肺炎。呼吸系统症状和体征、CT 表现、氧合下降、炎症指标以及症状与帕博利珠单抗给药的时间关系，均符合免疫介导的肺部炎症。应优先立即支持氧合，并按医嘱给予糖皮质激素。监测 SpO2 趋势、呼吸频率和呼吸做功，有助于判断气体交换是否改善以及通气需求是否减轻。",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "第4周期pembrolizumab后，患者出现新发干咳、双侧肺底爆裂音，SpO2从基线96%逐步降至室内空气91%，PaO2 68 mmHg，CRP升高，CT显示新发双侧下肺叶磨玻璃影，无胸腔积液、肺栓塞或淋巴管性癌病。肿瘤科医师开立医嘱：暂停pembrolizumab，收入院，吸氧以维持SpO2 >=94%，按院内irAE肺炎方案给予methylprednisolone，每2小时脉搏血氧监测，并请肺科会诊。请完成bow-tie，选择病情、两个优先措施和两个需监测参数。",
    after: "接受第 4 个周期的帕博利珠单抗治疗后，患者新出现干咳和双肺底湿啰音。SpO2 从基线的 96% 逐渐降至呼吸室内空气时的 91%，PaO2 为 68 mmHg，CRP 升高。CT 显示双肺下叶新出现磨玻璃影，未见胸腔积液、肺栓塞或淋巴管性癌病。肿瘤科医生下医嘱暂停帕博利珠单抗，收治入院，给予氧疗以维持 SpO2 ≥94%，按院内免疫相关不良事件（irAE）肺炎处置方案给予甲泼尼龙，每 2 小时监测一次脉搏血氧饱和度，并请呼吸科会诊。请完成 Bow-tie 题：选择患者的病情、两项优先措施和两项需监测的指标。",
  }),
];

runPatch(ops);
