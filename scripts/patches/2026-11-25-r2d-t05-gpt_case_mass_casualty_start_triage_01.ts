/**
 * R2 D-2 tranche 5, unit 01: zh-only meaning repair for gpt_case_mass_casualty_start_triage_01 (banks/gpt-canonical.json questions[294]).
 * Producer: Codex gpt-6.2-astra high. Independent checker route: Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T05/producer/01/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_case_mass_casualty_start_triage_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","exhibits",{"id":"baseline_protocol_resources"},"content","zh"],
    before: "机构流程：这家22床社区急诊在急性伤员数超过可用治疗空间时进入一级资源受限MCI模式。流程要求在入口处进行START分诊；任何有化学污染的伤员进入急诊治疗区前必须完成体表去污；治疗优先级为红色/立即优先于黄色/延迟，再优先于绿色/轻伤；黑色/预期死亡伤员在资源允许时仅给予舒适护理。救护车入口外的去污站可用。\n\n1854资源：3名RN、1名急诊医师、1名PA；1间创伤间和2间复苏间；2台呼吸机，其中1台已用于滞留ICU患者；血库可立即提供4单位O阴性PRBC；有标准气道设备、albuterol、烧伤护理和复苏用品。已召回2名护士，但尚未到达。\n\n事件：三英里外化肥混合厂发生工业爆炸并释放无水氨。7名伤员在8分钟内通过救护车和私家车抵达。",
    after: "机构流程：这家22床社区急诊在急性伤员数超过可用治疗空间时进入一级资源受限的大规模伤亡事件（MCI）应对模式。流程要求在入口处进行START分诊；任何有化学污染的伤员进入急诊治疗区前必须完成体表去污；治疗优先级为红色/立即优先于黄色/延迟，再优先于绿色/轻伤；黑色/预期死亡伤员在资源允许时仅给予舒适护理。救护车入口外的去污站可用。\n\n1854资源：3名RN、1名急诊医师、1名PA；1间创伤间和2间复苏间；2台呼吸机，其中1台已用于在急诊等候转入ICU的患者；血库可立即提供4单位O阴性PRBC；有标准气道设备、沙丁胺醇、烧伤护理和复苏用品。已召回2名护士，但尚未到达。\n\n事件：化肥混合厂发生工业爆炸并释放无水氨。7名伤员在8分钟内通过救护车和私家车抵达。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_1"},"exhibits",{"id":"stage_1_update"},"content","zh"],
    before: "1854-1909：charge nurse在6分钟内完成7名伤员的START评估。D和G被识别为化学污染伤员，完成去污并重新分诊前不得进入急诊。D被转移到室外去污站；穿戴PPE的人员脱去衣物，并按机构流程开始充分冲洗。去污过程中，D的喘鸣持续，RR升至36。G留在急诊入口外，随后发现无脉搏。A重新开放气道后仍无呼吸、无脉搏；按MCI流程不再启动进一步复苏。C首先进入创伤间；止血带有效，建立IV通路，HR 128，BP 88/62，仍仅对声音有反应。E进入复苏间；开始烧伤补液，HR 102，BP 118/74，RR 24，室内空气SpO2 94%。B和F被引导至候诊区并给予基本指示。",
    after: "1854-1909：当班负责护士在6分钟内完成7名伤员的START评估。D和G被识别为化学污染伤员，完成去污并重新分诊前不得进入急诊。D被转移到室外去污站；穿戴个人防护装备的工作人员脱去D的污染衣物，并按机构流程开始充分冲洗。去污过程中，D的喘鸣持续，RR升至36。G留在急诊入口外，随后发现无脉搏。A重新开放气道后仍无呼吸、无脉搏；按MCI流程不再启动进一步复苏。C首先进入创伤间；止血带有效，建立IV通路，HR 128，BP 88/62，仍仅对声音有反应。E进入复苏间；开始烧伤补液，HR 102，BP 118/74，RR 24，室内空气SpO2 94%。B和F被引导至候诊区并给予基本指示。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_2"},"exhibits",{"id":"stage_2_update"},"content","zh"],
    before: "1909-1934：D完成机构规定的去污冲洗并重新评估：清醒定向，不用听诊器即可听到喘鸣，RR 34，室内空气SpO2 89%，HR 112，BP 134/86。确认可进入急诊后，被转入第二间复苏间。给予15 L/min非再呼吸面罩湿化氧；医嘱雾化albuterol和IV dexamethasone；准备气道设备、连续脉搏血氧监测、支气管扩张治疗和困难气道备用方案。第一次albuterol后SpO2升至92%，但喘鸣仍在；请求麻醉科待命。C在1 L温生理盐水后BP降至82/58，HR 134，止血带仍在位，意识恶化为仅对疼痛有反应。启动大量输血；开始2单位O阴性PRBC；联系骨科进行急诊手术固定。E在500 mL LR后仍稳定：HR 98，BP 122/76，RR 22，2 L鼻导管SpO2 95%；给予morphine并启动烧伤中心转运。G在急诊外确认死亡，并按MCI太平间流程覆盖。1929又到达2名护士；一名分配给D，一名开始正式评估B和F。",
    after: "1909-1934：D完成机构规定的去污冲洗并重新评估：清醒，定向力正常，不用听诊器即可听到喘鸣，RR 34，室内空气SpO2 89%，HR 112，BP 134/86。确认可进入急诊后，被转入第二间复苏间。给予15 L/min非再呼吸面罩湿化氧；医嘱雾化吸入沙丁胺醇和静脉给予地塞米松；准备气道设备、连续脉搏血氧监测、支气管扩张治疗和困难气道备用方案。首次沙丁胺醇治疗后SpO2升至92%，但喘鸣仍在；请求麻醉科待命。C在1 L温生理盐水后BP降至82/58，HR 134，止血带仍在位，意识恶化为仅对疼痛有反应。启动大量输血；开始2单位O阴性PRBC；联系骨科进行急诊手术固定。E在500 mL LR后仍稳定：HR 98，BP 122/76，RR 22，2 L鼻导管SpO2 95%；给予吗啡并启动烧伤中心转运。G在急诊外确认死亡，并按MCI太平间流程覆盖。1929又到达2名护士；一名分配给D，一名开始正式评估B和F。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_3"},"exhibits",{"id":"stage_3_update"},"content","zh"],
    before: "1934-2009：C在急诊外固定和止血后返回。HR 108，BP 98/64，RR 20，4 L鼻导管SpO2 97%。共输注4单位PRBC；现在对声音有反应并能按指令动作；过去1小时尿量25 mL。D在追加albuterol和dexamethasone后改善：喘鸣减轻，吸氧下SpO2 94%，RR 24，能完整说话。由于严重氨暴露到院后仍可能恶化，她继续接受观察/住院级监测，以防再次气道受损和非心源性肺水肿。E已被烧伤中心接收，血流动力学稳定，疼痛4/10，等待直升机转运。B的裂伤已冲洗和缝合，给予破伤风预防，并带伤口护理指导出院。F鼓膜完整，神经检查正常，头痛改善；观察后带爆炸伤注意事项出院。2000，charge nurse完成重新分诊巡视：5名接受治疗，2名死亡（A和G），2名出院（B和F），1名等待转运（E），2名在急诊内改善（C和D）。",
    after: "1934-2009：C在急诊外固定和止血后返回。HR 108，BP 98/64，RR 20，4 L鼻导管SpO2 97%。共输注4单位PRBC；现在对声音有反应并能按指令动作；过去1小时尿量25 mL。D在追加沙丁胺醇和地塞米松后改善：喘鸣减轻，吸氧下SpO2 94%，RR 24，能完整说话。由于严重氨暴露到院后仍可能恶化，她继续接受观察/住院级监测，以防再次气道受损和非心源性肺水肿。E已被烧伤中心接收，血流动力学稳定，疼痛4/10，等待直升机转运。B的裂伤已冲洗和缝合，给予破伤风预防，并带伤口护理指导出院。F鼓膜完整，神经检查正常，头痛改善；观察后带爆炸伤注意事项出院。2000，当班负责护士完成重新分诊巡视：5名接受治疗，2名死亡（A和G），2名出院（B和F），1名等待转运（E），2名在急诊内改善（C和D）。",
  }),
  setValue({
    id: ID, path: ["caseStudy","summary","zh"],
    before: "一家人员和治疗空间有限的社区急诊在工业爆炸和无水氨释放后接收7名伤员。charge nurse必须应用START分诊，防止急诊被化学污染，将稀缺资源分配给可挽救伤员，并评估MCI应对是否有效。",
    after: "一家人员和治疗空间有限的社区急诊在工业爆炸和无水氨释放后接收7名伤员。当班负责护士必须应用START分诊，防止急诊被化学污染，将稀缺资源分配给可挽救伤员，并评估大规模伤亡事件应对是否有效。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_mass_casualty_start_triage_01_q3"},"rationale","byChoice",{"refId":"d_direct"},"zh"],
    before: "这是误用单个患者ABCs；带污染进入急诊会暴露员工和其他伤员，削弱应对能力。",
    after: "这是把针对单个患者的气道、呼吸和循环（ABC）评估原则误用于此处；带污染进入急诊会暴露员工和其他伤员，削弱应对能力。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_mass_casualty_start_triage_01_q3"},"testTakingStrategy","zh"],
    before: "两个立即处理患者之间比较时，在ABCs之外加入可行性和安全性：谁现在能安全接受有效干预？",
    after: "两个立即处理患者之间比较时，除评估气道、呼吸和循环（ABC）外，还要考虑救治的可行性和安全性：谁现在能安全接受有效干预？",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
