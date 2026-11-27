/**
 * R2 D-2 tranche 6, unit 01: zh-only meaning repair for gpt_case_opioid_recovery_relapse_risk_01 (banks/gpt-canonical.json questions[350]).
 * Producer: Codex gpt-6.2-astra high. Independent checker route: Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T06/producer/01/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_case_opioid_recovery_relapse_risk_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","exhibits",{"id":"baseline_background"},"content","zh"],
    before: "Marcus Delaney，38 岁，患有阿片类物质使用障碍（OUD），已恢复约 5 个月。他通过门诊药物辅助治疗（MAT）项目每日舌下使用丁丙诺啡/纳洛酮 16 mg/4 mg，并每周参加团体咨询。既往有 2 次复发，最近一次在 8 个月前，涉及静脉使用海洛因，并发生非致死性过量，急救人员用纳洛酮逆转。其恢复支持包括戒毒互助会赞助人、女友 Tanya 和母亲。Tanya 接受过纳洛酮给药培训，家中备有纳洛酮。",
    after: "Marcus Delaney，38 岁，患有阿片类物质使用障碍（OUD），已处于康复期约 5 个月。他通过门诊药物辅助治疗（MAT）项目每日舌下使用丁丙诺啡/纳洛酮 16 mg/4 mg，并每周参加团体咨询。既往有 2 次复发，最近一次在 8 个月前，涉及静脉使用海洛因，并发生非致死性过量，急救人员用纳洛酮逆转。其恢复支持包括匿名戒毒互助会的同伴辅导员、女友 Tanya 和母亲。Tanya 接受过纳洛酮给药培训，家中备有纳洛酮急救套装。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_1"},"exhibits",{"id":"stage_1_update"},"content","zh"],
    before: "Marcus 接受酮咯酸 15 mg IV 和对乙酰氨基酚 1,000 mg PO。45 分钟后，疼痛从 8/10 降至 6/10；HR 94，BP 138/86，RR 16，SpO2 99%。他仍焦虑，询问镇静是否会使用芬太尼，并说：“我不能用芬太尼。我会马上回到起点。”随后他低声说：“有时候我觉得如果不用再面对这些，会不会更容易。”护士请他说明时，他说：“我不是那个意思。我不会伤害自己。我只是觉得恢复太累了。每次出问题，我都觉得自己离再次使用只差一个糟糕的一天。”他还没有联系 Tanya 或赞助人，因为不想“麻烦”他们。区域麻醉团队讨论超声引导臂丛神经阻滞，以避免全身性阿片使用；Marcus 同意但仍紧张。医生确认使用神经阻滞镇痛、丙泊酚短暂程序镇静，并继续多模式非阿片镇痛。丁丙诺啡/纳洛酮暂缓医嘱仍需在漏服前澄清。",
    after: "Marcus 接受酮咯酸 15 mg IV 和对乙酰氨基酚 1,000 mg PO。45 分钟后，疼痛从 8/10 降至 6/10；HR 94，BP 138/86，RR 16，SpO2 99%。他仍焦虑，询问镇静是否会使用芬太尼，并说：“我不能用芬太尼。我会马上回到起点。”随后他低声说：“有时候我觉得如果不用再面对这些，会不会更容易。”护士请他说明时，他说：“我不是那个意思。我不会伤害自己。我只是觉得恢复太累了。每次出问题，我都觉得自己只要再遇上糟糕的一天，就可能再次用药。”他还没有联系 Tanya 或互助会的同伴辅导员，因为不想“麻烦”他们。区域麻醉团队讨论超声引导臂丛神经阻滞，以避免全身性阿片使用；Marcus 同意但仍紧张。医生确认使用神经阻滞镇痛、丙泊酚短暂程序镇静，并继续多模式非阿片镇痛。丁丙诺啡/纳洛酮暂缓医嘱仍需在漏服前澄清。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_2"},"exhibits",{"id":"stage_2_update"},"content","zh"],
    before: "在神经阻滞起效的情况下，Marcus 在丙泊酚镇静下成功闭合复位。他醒来后定向力正常，无恶心。术后生命体征：HR 82，BP 126/78，RR 14，SpO2 99%。神经阻滞仍有效时疼痛 2/10。急诊医生已与 MAT 处方医生沟通。现医嘱为：继续丁丙诺啡/纳洛酮 16 mg/4 mg 舌下每日一次，因今晨已服药，下一剂为明早通常服药时间；对乙酰氨基酚 1,000 mg PO 每 6 小时；布洛芬 400 mg PO 每 6 小时随食物服用，从下一个预定 NSAID 间隔开始，以避免与酮咯酸重叠；冰敷和抬高；5 天后骨科随访；48 小时内 MAT 随访；告知石膏并发症返回就诊警示。Tanya 到达时情绪激动，在 Marcus 听不到的走廊问护士：“他是不是又用了？请直接告诉我真相。”她报告他近期失眠、情绪不稳，并曾在凌晨 2 点发现他独自坐在车里。Marcus 后来说：“她不信任我。没人信任我。如果所有人还把我当瘾君子，看我保持干净有什么意义？”他的眼睛发红，抠石膏边缘，直接询问时否认自杀意念，并说：“我现在真的觉得很孤单。”",
    after: "在神经阻滞起效的情况下，Marcus 在丙泊酚镇静下成功闭合复位。他醒来后定向力正常，无恶心。术后生命体征：HR 82，BP 126/78，RR 14，SpO2 99%。神经阻滞仍有效时疼痛 2/10。急诊医生已与 MAT 处方医生沟通。现医嘱为：继续丁丙诺啡/纳洛酮 16 mg/4 mg 舌下每日一次，因今晨已服药，下一剂为明早通常服药时间；对乙酰氨基酚 1,000 mg PO 每 6 小时；布洛芬 400 mg PO 每 6 小时随食物服用，从下一次非甾体抗炎药（NSAID）的预定给药时间开始，以避免与酮咯酸重叠；冰敷和抬高；5 天后骨科随访；48 小时内 MAT 随访；告知石膏并发症返回就诊警示。Tanya 到达时情绪激动，在 Marcus 听不到的走廊问护士：“他是不是又用了？请直接告诉我真相。”她报告他近期失眠、情绪不稳，并曾在凌晨 2 点发现他独自坐在车里。Marcus 后来说：“她不信任我。没人信任我。如果所有人还把我当瘾君子，那我坚持戒毒又有什么意义？”他的眼睛发红，抠石膏边缘，直接询问时否认自杀意念，并说：“我现在真的觉得很孤单。”",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_3"},"exhibits",{"id":"stage_3_update"},"content","zh"],
    before: "神经阻滞开始减退。Marcus 报告左腕疼痛升至 5/10。生命体征：HR 88，BP 132/82，RR 16，SpO2 99%。用药核对确认他已于今晨服用今日丁丙诺啡/纳洛酮，下一次医嘱剂量为明早。他已按时服用对乙酰氨基酚和布洛芬。他坐立不安，说：“这种情况正是以前让我再次使用的原因——疼痛、感觉很糟、不能工作。我知道有一种东西五分钟内就能让疼痛消失。”他停顿后说：“我不会那么做。但如果说我没想到它，那就是撒谎。”Tanya 在场并显得惊慌。Marcus 尚未致电赞助人，因为戴石膏不能开车而不确定是否参加明晚的 NA 会议，也尚未确认 MAT 随访。他询问布洛芬是否足够、如果夜里疼痛严重该怎么办，以及 Tanya 大约一年前的纳洛酮套装是否仍有效。",
    after: "神经阻滞开始减退。Marcus 报告左腕疼痛升至 5/10。生命体征：HR 88，BP 132/82，RR 16，SpO2 99%。用药核对确认他已于今晨服用今日丁丙诺啡/纳洛酮，下一次医嘱剂量为明早。他已按时服用对乙酰氨基酚和布洛芬。他坐立不安，说：“这种情况正是以前让我再次使用的原因——疼痛、感觉很糟、不能工作。我知道有一种东西五分钟内就能让疼痛消失。”他停顿后说：“我不会那么做。但如果说我没想到它，那就是撒谎。”Tanya 在场并显得惊慌。Marcus 尚未致电互助会的同伴辅导员，因为戴石膏不能开车而不确定是否参加明天的匿名戒毒互助会（NA）聚会，也尚未确认 MAT 随访。他询问布洛芬是否足够、如果夜里疼痛严重该怎么办，以及 Tanya 大约一年前的纳洛酮套装是否仍有效。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_opioid_recovery_relapse_risk_01_q1"},"highlight","segments",{"id":"h7"},"zh"],
    before: "他尚未联系 Tanya 或赞助人。",
    after: "他尚未联系 Tanya 或互助会的同伴辅导员。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_opioid_recovery_relapse_risk_01_q1"},"rationale","correct","zh"],
    before: "重要线索包括“如果不用面对这些会不会更容易”的含糊表述、灾难化的复发表述、流泪和情绪痛苦、回避 Tanya 和赞助人、把联系支持者说成“麻烦别人”，以及担心阿片暴露会诱发复发。否认自伤很重要，但不能取消继续监测的需要；生命体征改善、中等疼痛和非法物质尿筛阴性不是主要心理社会线索。",
    after: "重要线索包括“如果不用面对这些会不会更容易”的含糊表述、灾难化的复发表述、流泪和情绪痛苦、回避 Tanya 和互助会的同伴辅导员、把联系支持者说成“麻烦别人”，以及担心阿片暴露会诱发复发。否认自伤很重要，但不能取消继续监测的需要；生命体征改善、中等疼痛和非法物质尿筛阴性不是主要心理社会线索。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_opioid_recovery_relapse_risk_01_q4"},"stem","zh"],
    before: "对于 Marcus 在阶段 2 说“如果所有人还把我当瘾君子，看我保持干净有什么意义？”，哪些护理回应是恰当的？选择所有适用项。",
    after: "对于 Marcus 在阶段 2 说“如果所有人还把我当瘾君子，那我坚持戒毒又有什么意义？”，哪些护理回应是恰当的？选择所有适用项。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_opioid_recovery_relapse_risk_01_q6"},"matrix","rows",{"id":"r1"},"zh"],
    before: "Marcus 离院前已联系赞助人，并确认 48 小时内 MAT 预约。",
    after: "Marcus 离院前已联系互助会的同伴辅导员，并确认 48 小时内 MAT 预约。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_opioid_recovery_relapse_risk_01_q6"},"rationale","byChoice",{"refId":"r3"},"zh"],
    before: "Tanya 掌握纳洛酮准备，能在过量紧急情况下支持减害。",
    after: "Tanya 做好使用纳洛酮的准备，有助于在发生药物过量时减少伤害。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
