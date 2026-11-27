/**
 * R2 D-2 tranche 7, unit 01: zh-only meaning repair for gpt_case_unsafe_assignment_01 (banks/gpt-canonical.json questions[290]).
 * Producer: Codex gpt-6.2-astra high. Independent checker route: Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T07/producer/01/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_case_unsafe_assignment_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","exhibits",{"id":"baseline_assignment"},"content","zh"],
    before: "Okonkwo护士抵达降级病房，并从值班主管护士Marcus Reilly处收到了口头排班任务。该降级病房获得了在分配给已验证相关胜任力的护士时管理部分低剂量血管活性药物输注和动脉导管的资格。他分给她三名患者：\n\n患者A — 58岁男性，冠状动脉搭桥术后第一天，两小时前从心脏ICU转入降级病房，正在进行低剂量去甲肾上腺素滴注（4 mcg/min），通过滴定维持平均动脉压 (MAP) 大于64 mmHg，并在左桡动脉置有动脉导管进行持续血压监测。他还有纵隔胸腔引流管连接至闭式引流系统。\n\n患者B — 62岁女性，颈动脉内膜剥脱术后八小时，需要根据病房的颈动脉内膜剥脱术后方案每小时进行一次神经评估（瞳孔反应、面部对称性、言语清晰度、握力、吞咽功能，以及维持收缩压在100至150 mmHg之间的血压参数）。她正在接受尼卡地平滴注（5 mg/hr），按方案滴定以保持收缩压在该范围内。\n\n患者C — 71岁女性，右膝关节全膝置换术后第二天，由于没有内外科床位而转入降级病房。她血流动力学稳定，正在服用口服止痛药，接受常规切口护理，并在物理治疗下走动。她的护理需求与内外科级别的病情一致。\n\n主管护士告诉Okonkwo护士：“我知道工作量很大，但我们人手不足。你会没事的——滴注已经在运行，设置都在病历里。只要注意观察就行了。”",
    after: "Okonkwo护士到达过渡监护病房。值班主管护士 Marcus Reilly（注册护士）口头向她分配了本班要照护的患者。该病房获准管理特定的低剂量血管活性药物输注和动脉导管，前提是由已通过相应胜任力验证的护士负责。他分给她三名患者：\n\n患者A — 58岁男性，冠状动脉搭桥术后第一天，两小时前从心脏ICU转入过渡监护病房，正在进行低剂量去甲肾上腺素滴注（4 mcg/min），通过滴定维持平均动脉压 (MAP) 大于64 mmHg，并在左桡动脉置有动脉导管进行持续血压监测。他还有纵隔胸腔引流管连接至闭式引流系统。\n\n患者B — 62岁女性，颈动脉内膜剥脱术后八小时，需要根据病房的颈动脉内膜剥脱术后方案每小时进行一次神经评估（瞳孔反应、面部对称性、言语清晰度、握力、吞咽功能，以及维持收缩压在100至150 mmHg之间的血压参数）。她正在接受尼卡地平滴注（5 mg/hr），按方案滴定以保持收缩压在该范围内。\n\n患者C — 71岁女性，右侧全膝关节置换术后第二天，由于没有内外科床位而转入过渡监护病房。她血流动力学稳定，正在服用口服止痛药，接受常规切口护理，并在物理治疗师协助下行走。按病情轻重判断，她所需的护理与普通内外科病房相符。\n\n主管护士告诉Okonkwo护士：“我知道工作量很大，但我们人手不足。你会没事的——滴注已经在运行，设置都在病历里。只要注意观察就行了。”",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_1"},"exhibits",{"id":"stage_1_interaction"},"content","zh"],
    before: "Okonkwo护士查阅了活页夹中的滴定方案，发现自己不知道如何将动脉导管传感器归零和校准，也不知道如何根据病房方案滴定去甲肾上腺素或尼卡地平。她还查看了颈动脉内膜剥脱术后神经评估表，发现其中包含了与她在原科室进行的常规神经检查不同的分级量表和特定的升级标准。\n\n她找到值班主管护士Marcus，说道：“我看过排班了。我对照顾患者C感到很从容——她的护理在我的记录胜任力范围内。但我从未获得过血管活性药物滴定或动脉导管管理的验证，也没有接受过你们颈动脉术后神经方案的培训。如果我独立管理患者A和B，我担心患者安全。”\n\nMarcus回答说：“今晚大家都很忙。我不能重新安排整个排班。滴注已经设置好了——别去动它们。如果出问题，叫我，我会来帮忙。”",
    after: "Okonkwo护士查阅了活页夹中的滴定方案，发现自己不知道如何给动脉测压传感器调零、调平，也不知道如何根据病房方案滴定去甲肾上腺素或尼卡地平。她还查看了颈动脉内膜剥脱术后神经评估表，发现其中包含了与她在原科室进行的常规神经检查不同的分级量表和特定的升级标准。\n\n她找到值班主管护士Marcus，说道：“我看过患者分工了。照顾患者C我有把握，她所需的护理在我已验证并记录在案的胜任力范围内。但我从未通过血管活性药物滴定或动脉导管管理的胜任力验证，也没有接受过你们颈动脉术后神经方案的培训。如果我独立管理患者A和B，我担心患者安全。”\n\nMarcus回答说：“今晚大家都很忙。我不能把所有患者重新分配一遍。滴注已经设置好了——别去动它们。如果出问题，叫我，我会来帮忙。”",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_3"},"exhibits",{"id":"stage_3_resolution"},"content","zh"],
    before: "在2115，主管Huang到达病房。她查看了排班板，确认了Okonkwo护士的胜任力档案不包括血管活性药物滴定或降级病房神经方案，并重新调整了排班：由具备降级病房资格的护士Keisha Williams (RN) 接管患者A和B的主要责任。Okonkwo护士继续负责患者C，并接手了第四名患者——一名病情稳定的胆囊切除术后患者，其护理需求在Okonkwo护士已验证的胜任力范围内。\n\n在2130，Okonkwo护士在床边向Keisha进行了患者A和B的交接报告。\n\n在2145，Keisha重新评估了患者B。她注意到，与复苏室记录中的即刻术后基线相比，患者B的言语现在有明显的含糊不清。增加尼卡地平后收缩压为148。Keisha根据颈动脉术后方案立即通知了外科医生，并下达了头部STAT CT的医嘱。\n\n在2200，Okonkwo护士根据机构的排班异议和事件报告政策，以事实和客观的方式记录了当晚的事件。\n\n在2230，Okonkwo护士根据机构政策完成了一份事件报告。",
    after: "在2115，主管Huang到达病房。她查看了患者分工表，确认了Okonkwo护士的胜任力档案不包括血管活性药物滴定或过渡监护病房神经方案，并重新分配了护理任务：由具备过渡监护病房资格的护士Keisha Williams (RN) 接管患者A和B的主要责任。Okonkwo护士继续负责患者C，并接手了第四名患者——一名病情稳定的胆囊切除术后患者，其护理需求在Okonkwo护士已验证的胜任力范围内。\n\n在2130，Okonkwo护士在床边向Keisha进行了患者A和B的交接报告。\n\n在2145，Keisha重新评估了患者B。她注意到，与复苏室记录中的即刻术后基线相比，患者B的言语现在有明显的含糊不清。增加尼卡地平后收缩压为148。Keisha根据颈动脉术后方案立即通知了外科医生，随后接到立即行头颅 CT 检查的医嘱。\n\n在2200，Okonkwo护士根据机构的护理任务分配异议和事件报告政策，以事实和客观的方式记录了当晚的事件。\n\n在2230，Okonkwo护士根据机构政策完成了一份事件报告。",
  }),
  setValue({
    id: ID, path: ["caseStudy","summary","zh"],
    before: "Dara Okonkwo护士（RN，BSN）在一个有36张床位的内外科病房工作了四年。她的胜任力档案记录了她在遥测监护、PCA泵管理、胸腔引流管护理和常规术后评估方面的资格。她从未获得过血管活性药物滴定、动脉导管血流动力学监测或特级护理（降级）病房特定神经评估方案的验证。她所在机构的调配政策规定：“被调配的护士应接受与其记录的胜任力一致的工作分配。当患者病情超出了被调配护士已验证的技能时，值班主管护士必须调整排班或安排胜任力匹配的支援。”\n\n今晚是一个12小时的夜班，当时由于呼吸道疾病暴发导致全院人手紧缺。总值班主管在1845将Okonkwo护士调配至降级病房。",
    after: "Dara Okonkwo护士（注册护士，护理学学士）在一个有36张床位的内外科病房工作了四年。她的胜任力档案记录了她在遥测监护、患者自控镇痛（PCA）泵管理、胸腔引流管护理和常规术后评估方面的资格。她从未通过血管活性药物滴定、动脉导管血流动力学监测或过渡监护病房（中间护理病房）特定神经评估方案的胜任力验证。她所在机构的调配政策规定：“被调配的护士应接受与其记录的胜任力一致的工作分配。当患者病情超出了被调配护士已验证的技能时，值班主管护士必须调整护理任务分配或安排胜任力匹配的支援。”\n\n今晚是一个12小时的夜班，当时由于呼吸道疾病暴发导致全院人手紧缺。总值班主管在1845将Okonkwo护士调配至过渡监护病房。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_unsafe_assignment_01_q2"},"options",{"id":"q2_o4"},"zh"],
    before: "Okonkwo护士不愿意接受降级病房的任何排班任务。",
    after: "Okonkwo护士不愿意接受过渡监护病房分配的任何护理任务。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_unsafe_assignment_01_q3"},"rationale","byChoice",{"refId":"q3_o4"},"zh"],
    before: "错误。患者A的胸管引流量问题已由主管护士处理；根本问题是Okonkwo护士无法独立监测这些高严重程度的变化趋势。",
    after: "错误。患者A的胸管引流量问题已由主管护士处理；根本问题是Okonkwo护士无法独立监测这些重症患者的病情变化趋势。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_unsafe_assignment_01_q3"},"stem","zh"],
    before: "在Okonkwo护士向符合资质的护士报告了即刻特定于患者的病情变化后，首要纠正的管理护理问题是什么？",
    after: "Okonkwo护士已将患者刚刚出现的病情变化报告给具备相应资质的护士。接下来应优先纠正哪个护理管理问题？",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_unsafe_assignment_01_q4"},"stem","zh"],
    before: "Okonkwo护士决定解决不安全排班的问题。哪些行动是恰当的？请选择所有适用项。",
    after: "Okonkwo护士决定处理护理任务分配不安全的问题。哪些行动是恰当的？请选择所有适用项。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_unsafe_assignment_01_q5"},"matrix","rows",{"id":"row_2"},"zh"],
    before: "“Marcus态度敷衍又懒惰，因为他不想更改排班。”",
    after: "“Marcus态度敷衍又懒惰，因为他不想调整患者分工。”",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_unsafe_assignment_01_q6"},"stem","zh"],
    before: "在2200，Okonkwo护士完成了有关排班隐患的记录。哪项行动是正确的？",
    after: "在2200，Okonkwo护士完成了有关护理任务分配安全隐患的记录。哪项行动是正确的？",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
