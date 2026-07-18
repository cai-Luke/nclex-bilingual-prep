/** Sequence repair and collision replacement for GPT scored-format batch 9C. */
import { runPatch, setValue } from "../patch-raw";

const missedPills = "gpt_format9c_missed_combined_pills";
const palliative = "gpt_format9c_palliative_agitation_plan";

runPatch([
  setValue({
    id: missedPills,
    path: ["stem"],
    before: {
      en: "A client missed 2 consecutive active combined oral contraceptive pills in the first week of the pack and had unprotected intercourse 3 days ago. Ulipristal acetate is not being used. Place the supplied CDC actions in the order the client should carry them out today and over the next 7 days.",
      zh: "一名患者在复方口服避孕药周期的第 1 周连续漏服了 2 片含激素药片，并在 3 天前有无保护性交。本题不使用醋酸乌利司他。请按患者今天及随后 7 天应执行的顺序排列所给 CDC 措施。",
    },
    after: {
      en: "At 0900, a client reports missing 2 consecutive active combined oral contraceptive pills in the first week of the pack. The usual pill time is 2100, and unprotected intercourse occurred 3 days ago. Ulipristal acetate is not being used. Place the supplied CDC actions in the time-anchored order the client should carry them out starting now and over the next 7 days.",
      zh: "0900，一名患者报告在复方口服避孕药周期的第 1 周连续漏服了 2 片含激素药片。平时服药时间为 2100，3 天前曾有无保护性交。本题不使用醋酸乌利司他。请按患者从现在开始及随后 7 天应执行的时间顺序排列所给 CDC 措施。",
    },
    note: "Add explicit clock anchors so the keyed response tests a real timeline rather than ordering simultaneous CDC recommendations.",
  }),
  setValue({
    id: missedPills,
    path: ["rationale"],
    before: {
      correct: {
        en: "For at least 2 consecutive missed hormonal pills, take the most recent missed pill as soon as possible and discard any earlier missed pill, then continue the remaining pills at the usual time even if this means 2 pills in one day. Use condoms or abstain until hormonal pills have been taken for 7 consecutive days. Because the missed pills occurred in week 1 and unprotected intercourse occurred in the previous 5 days, consider emergency contraception other than ulipristal acetate.",
        zh: "连续漏服至少 2 片含激素药片时，应尽快服用最近漏服的一片，并丢弃更早漏服的药片；随后按平时时间继续服用剩余药片，即使同一天需要服用 2 片。应使用安全套或禁欲，直到连续服用含激素药片 7 天。由于漏服发生在第 1 周，且过去 5 天内有无保护性交，应考虑醋酸乌利司他以外的紧急避孕。",
      },
      byChoice: [
        { refId: "A", en: "The CDC pathway first corrects the missed dose by taking the most recent missed pill and discarding earlier missed pills.", zh: "CDC 路径首先处理漏服：服用最近漏服的一片，并丢弃更早漏服的药片。" },
        { refId: "B", en: "After the missed-dose correction, the client continues the pack on schedule, even if two pills are taken on the same day.", zh: "处理漏服后，应按计划继续本周期，即使同一天需要服用两片。" },
        { refId: "C", en: "Backup protection continues until seven consecutive hormonal pills have been taken.", zh: "备用避孕应持续到连续服用含激素药片 7 天。" },
        { refId: "D", en: "Week-1 missed pills plus unprotected intercourse in the previous five days trigger consideration of emergency contraception other than ulipristal acetate.", zh: "第 1 周漏服且过去 5 天内有无保护性交，需要考虑醋酸乌利司他以外的紧急避孕。" },
      ],
    },
    after: {
      correct: {
        en: "At 0900, take the most recent missed hormonal pill and discard the earlier missed pill. Because the missed pills occurred in week 1 and unprotected intercourse occurred within the previous 5 days, address emergency contraception other than ulipristal acetate today without delay rather than postponing it behind the seven-day backup interval. At the usual 2100 time, take the next scheduled pill and continue the pack. Use condoms or abstain until hormonal pills have been taken for 7 consecutive days.",
        zh: "0900，应服用最近漏服的一片含激素药片，并丢弃更早漏服的一片。由于漏服发生在第 1 周，且过去 5 天内有无保护性交，应在今天尽快处理醋酸乌利司他以外的紧急避孕，而不能推迟到 7 天备用避孕期之后。到平时 2100 的服药时间，应服用下一片计划药片并继续本周期。应使用安全套或禁欲，直到连续服用含激素药片 7 天。",
      },
      byChoice: [
        { refId: "A", en: "The 0900 action corrects the missed dose immediately by taking the most recent missed pill and discarding the earlier one.", zh: "0900 的措施立即处理漏服：服用最近漏服的一片，并丢弃更早的一片。" },
        { refId: "D", en: "The emergency-contraception window is time sensitive, so the week-1 indication is addressed today rather than after the backup interval.", zh: "紧急避孕有时间窗，因此第 1 周漏服所触发的考虑应在今天处理，而不是等备用避孕期结束。" },
        { refId: "B", en: "The next scheduled pill is taken at the stated usual time of 2100, even though this produces two pills on the same day.", zh: "下一片计划药片应在题干给出的平时服药时间 2100 服用，即使因此同一天服用两片。" },
        { refId: "C", en: "Backup protection is the ongoing step and continues until seven consecutive hormonal pills have been taken.", zh: "备用避孕是持续性措施，应继续到连续服用含激素药片 7 天。" },
      ],
    },
  }),
  setValue({
    id: missedPills,
    path: ["testTakingStrategy"],
    before: {
      en: "Anchor the order to the missed-pill correction: take the most recent missed pill, continue the pack, protect for seven consecutive active pills, and address the week-1 emergency-contraception condition.",
      zh: "以漏服补救为主线：先服最近漏服的一片，再继续本周期，连续 7 天使用备用保护，并处理第 1 周紧急避孕条件。",
    },
    after: {
      en: "Use the stated clock times and do not defer a time-sensitive emergency-contraception decision until after the seven-day backup period.",
      zh: "使用题干给出的具体时间点，不要把有时间窗的紧急避孕决定推迟到 7 天备用避孕期之后。",
    },
  }),
  setValue({
    id: missedPills,
    path: ["options"],
    before: [
      { id: "C", en: "Use condoms or abstain from sexual intercourse until hormonal pills have been taken for 7 consecutive days.", zh: "使用安全套或禁欲，直到连续服用含激素药片 7 天。" },
      { id: "A", en: "Take the most recent missed active pill as soon as possible and discard the other missed active pill.", zh: "尽快服用最近漏服的一片含激素药片，并丢弃另一片更早漏服的药片。" },
      { id: "D", en: "Because the pills were missed in week 1 and unprotected intercourse occurred 3 days ago, consider emergency contraception other than ulipristal acetate.", zh: "由于第 1 周漏服且 3 天前有无保护性交，应考虑醋酸乌利司他以外的紧急避孕。" },
      { id: "B", en: "Continue taking the remaining pills at the usual time, even if this means taking 2 pills on the same day.", zh: "按平时时间继续服用剩余药片，即使这意味着同一天服用 2 片。" },
    ],
    after: [
      { id: "C", en: "For any intercourse from now until 7 consecutive hormonal pills have been taken, use condoms or abstain.", zh: "从现在起直到连续服用含激素药片 7 天，发生任何性交时均应使用安全套或禁欲。" },
      { id: "A", en: "At 0900, take the most recent missed active pill and discard the earlier missed active pill.", zh: "0900，服用最近漏服的一片含激素药片，并丢弃更早漏服的一片。" },
      { id: "D", en: "Today without delay, address emergency contraception and consider an appropriate method other than ulipristal acetate.", zh: "今天尽快处理紧急避孕，并考虑醋酸乌利司他以外的适当方法。" },
      { id: "B", en: "At the usual 2100 pill time, take the next scheduled active pill and then continue the pack daily.", zh: "到平时 2100 的服药时间，服用下一片计划含激素药片，之后每天继续本周期。" },
    ],
  }),
  setValue({
    id: missedPills,
    path: ["correct"],
    before: ["A", "B", "C", "D"],
    after: ["A", "D", "B", "C"],
    note: "Move the time-sensitive emergency-contraception decision ahead of the 2100 dose and ongoing seven-day backup interval.",
  }),
  setValue({ id: palliative, path: ["topic"], before: "Palliative & Supportive Care", after: "Nutritional & Fluid Support" }),
  setValue({
    id: palliative,
    path: ["stem"],
    before: {
      en: "A comfort-focused client in the last days of life develops distressing agitation and possible delirium. The individualized plan directs the nurse to review reversible causes, use immediate environmental and nonpharmacologic measures, administer an existing PRN order if distress persists, reassess 30 minutes after administration, and seek specialist advice if distress continues or unwanted sedation occurs. Place the actions in order.",
      zh: "一名以舒适照护为目标、处于生命最后阶段的患者出现明显激越及可能的谵妄。个体化方案要求护士先查找可逆原因，立即采取环境和非药物措施；若不适持续，则执行已有 PRN 医嘱；给药后 30 分钟复评；若不适仍持续或出现不希望的镇静，则寻求专科建议。请按顺序排列。",
    },
    after: {
      en: "A client's gastrostomy feeding tube will not flush. Stop the feeding and medication administration. Tube placement has been verified according to facility policy. Place the supplied ASPEN-based declogging actions in order. Any enzyme preparation or mechanical declogging device must be authorized by the prescriber and facility protocol.",
      zh: "一名患者的胃造口喂养管无法冲洗。停止喂养和经管给药。已依机构政策确认导管位置。请按顺序排列所给的、基于 ASPEN 的疏通措施。任何酶制剂或机械疏通装置均须经处方人员授权并符合机构流程。",
    },
    note: "Replace the Batch 8 palliative-plan template collision with a distinct enteral-tube patency sequence.",
  }),
  setValue({
    id: palliative,
    path: ["rationale"],
    before: {
      correct: {
        en: "The closed-world plan begins with assessment for reversible causes such as pain, urinary retention, constipation, medication effects, or environmental factors. Immediate calming and environmental measures follow. If distress persists, the nurse administers the existing PRN order, reassesses at the plan's specified 30-minute interval for distress and sedation, and escalates to specialist advice if symptoms persist or unwanted sedation develops. No drug or dose is invented.",
        zh: "该限定方案首先评估疼痛、尿潴留、便秘、药物影响或环境因素等可逆原因，然后立即采取安抚和环境措施。若不适持续，护士执行已有 PRN 医嘱；按方案规定在 30 分钟后复评不适和镇静情况；若症状仍持续或出现不希望的镇静，则升级寻求专科建议。本题不自行指定药物或剂量。",
      },
      byChoice: [
        { refId: "A", en: "Reviewing reversible causes comes first because correcting one may relieve the agitation without additional medication.", zh: "先查找可逆原因，因为纠正原因可能无需额外药物即可缓解激越。" },
        { refId: "B", en: "A calm environment, familiar reassurance, and reduction of stimulation are immediate measures after the focused review.", zh: "安静环境、熟悉的安慰及减少刺激，是重点评估后的立即措施。" },
        { refId: "C", en: "The existing PRN order is used only when distress persists despite the initial measures.", zh: "只有初始措施后不适仍持续时，才执行已有 PRN 医嘱。" },
        { refId: "D", en: "The plan establishes reassessment 30 minutes after administration to evaluate relief and unwanted sedation.", zh: "方案规定给药后 30 分钟复评，以评估缓解程度和不希望的镇静。" },
        { refId: "E", en: "Persistent distress or unwanted sedation after reassessment triggers specialist escalation.", zh: "复评后不适持续或出现不希望的镇静，应升级寻求专科建议。" },
      ],
    },
    after: {
      correct: {
        en: "First rule out an external clamp, kink, or connector obstruction. Water is the first-line declogging fluid; use a large enteral syringe with gentle back-and-forth pressure and allow time for the water to penetrate the clog. If water fails, an institution-approved pancreatic-enzyme solution, enzymatic kit, or mechanical device is second line when authorized. If patency still cannot be restored, stop repeated attempts and arrange expert evaluation or tube replacement. Acidic beverages can worsen formula-protein precipitation, and excessive force or sharp objects can damage the tube.",
        zh: "首先排除外部夹闭、扭结或连接处阻塞。水是首选疏通液；应使用大容量肠内注射器轻柔地来回加压，并留出时间让水渗入堵塞物。若水无效，在获得授权时可使用机构认可的胰酶溶液、酶疏通套件或机械装置作为二线措施。若仍不能恢复通畅，应停止反复尝试，并安排专科评估或更换导管。酸性饮料可能加重配方蛋白沉淀，过度用力或尖锐物也可能损坏导管。",
      },
      byChoice: [
        { refId: "A", en: "A visible external obstruction is corrected before any solution is forced into the tube.", zh: "在向导管内推注任何液体前，应先纠正可见的外部阻塞。" },
        { refId: "B", en: "Warm water with gentle pressure is the first-line attempt to restore patency.", zh: "用温水轻柔加压是恢复通畅的首选尝试。" },
        { refId: "C", en: "Authorized enzyme preparations or declogging devices are second-line options after water fails.", zh: "水冲洗无效后，经授权的酶制剂或疏通装置属于二线选择。" },
        { refId: "D", en: "Persistent occlusion after the approved sequence requires expert evaluation or tube replacement rather than escalating force.", zh: "完成批准的步骤后仍堵塞，应安排专科评估或更换导管，而不是加大力量。" },
      ],
    },
  }),
  setValue({
    id: palliative,
    path: ["testTakingStrategy"],
    before: {
      en: "Follow the individualized plan's serial logic: cause review, immediate comfort, existing PRN treatment, timed reassessment, then escalation.",
      zh: "按照个体化方案的连续逻辑：原因评估、立即舒适措施、执行已有 PRN 治疗、按时复评、再升级。",
    },
    after: {
      en: "Use the least forceful reversible step first: external mechanics, water, authorized second-line declogging, then expert evaluation.",
      zh: "先采用力量最小且可逆的步骤：检查外部机械问题、用水冲洗、使用经授权的二线疏通措施，最后安排专科评估。",
    },
  }),
  setValue({
    id: palliative,
    path: ["glossary"],
    before: [
      { termEn: "delirium", termZh: "谵妄", defZh: "急性波动性注意力和认知改变，可引起激越或不安。" },
      { termEn: "reversible cause", termZh: "可逆原因", defZh: "可识别并可能纠正的诱因，如疼痛、尿潴留或药物影响。" },
      { termEn: "unwanted sedation", termZh: "不希望的镇静", defZh: "超出照护目标、影响交流或舒适的过度嗜睡。" },
    ],
    after: [
      { termEn: "tube occlusion", termZh: "导管堵塞", defZh: "喂养管管腔被配方、药物或沉积物阻塞。" },
      { termEn: "enteral syringe", termZh: "肠内注射器", defZh: "为肠内连接系统设计、用于冲洗或给药的大容量注射器。" },
      { termEn: "declogging", termZh: "疏通", defZh: "采用批准的方法恢复喂养管管腔通畅。" },
    ],
  }),
  setValue({
    id: palliative,
    path: ["meta", "source"],
    before: "NICE NG31, Care of dying adults in the last days of life, recommendations 1.5.23-1.5.28 (explore causes of agitation/delirium; nonpharmacological management; treat reversible causes; trial medicine when appropriate; seek specialist advice if no response or unwanted sedation), https://www.nice.org.uk/guidance/ng31/chapter/Recommendations",
    after: "ASPEN Safe Practices for Enteral Nutrition Therapy, Section 7, EAD patency and tube-occlusion recommendations (external obstruction check; water first line; authorized pancreatic-enzyme solution, enzymatic kit, or mechanical device second line; avoid acidic beverages and excessive pressure), https://aspenjournals.onlinelibrary.wiley.com/doi/10.1177/0148607116673053",
  }),
  setValue({
    id: palliative,
    path: ["options"],
    before: [
      { id: "D", en: "Thirty minutes after the PRN medicine, reassess agitation, comfort, and the presence of unwanted sedation.", zh: "PRN 药物后 30 分钟，复评激越、舒适程度及是否出现不希望的镇静。" },
      { id: "A", en: "Perform a focused review for reversible contributors such as pain, urinary retention, constipation, medication effects, or environmental triggers.", zh: "重点评估疼痛、尿潴留、便秘、药物影响或环境诱因等可逆因素。" },
      { id: "E", en: "Seek specialist palliative advice if significant distress persists or unwanted sedation is present after reassessment.", zh: "若复评后明显不适仍持续或出现不希望的镇静，寻求姑息治疗专科建议。" },
      { id: "B", en: "Reduce noise and stimulation, use calm familiar reassurance, and address immediate comfort needs.", zh: "减少噪声和刺激，给予平静熟悉的安慰，并处理即时舒适需求。" },
      { id: "C", en: "Because distress persists despite those measures, administer the medication already authorized by the PRN order.", zh: "由于上述措施后不适仍持续，执行已有 PRN 医嘱中的药物。" },
    ],
    after: [
      { id: "D", en: "If patency is still not restored, stop repeated attempts and notify the prescriber or nutrition-support team for tube evaluation or replacement.", zh: "若仍未恢复通畅，停止反复尝试，并通知处方人员或营养支持团队评估或更换导管。" },
      { id: "A", en: "Inspect the full external tubing and connectors; release any closed clamp and straighten any kink.", zh: "检查全部外部管路和连接处；打开关闭的夹子并拉直任何扭结。" },
      { id: "C", en: "If water fails, use the institution-approved pancreatic-enzyme preparation, enzymatic kit, or mechanical declogging device as authorized.", zh: "若水冲洗无效，按授权使用机构认可的胰酶制剂、酶疏通套件或机械疏通装置。" },
      { id: "B", en: "Using a large enteral syringe, instill warm water with gentle back-and-forth pressure and allow it time to penetrate the clog.", zh: "使用大容量肠内注射器，以轻柔来回压力注入温水，并留出时间让水渗入堵塞物。" },
    ],
  }),
  setValue({
    id: palliative,
    path: ["correct"],
    before: ["A", "B", "C", "D", "E"],
    after: ["A", "B", "C", "D"],
  }),
  setValue({
    id: palliative,
    path: ["id"],
    before: palliative,
    after: "gpt_format9c_enteral_tube_occlusion",
    note: "Give the replacement construct an accurate globally unique id.",
  }),
]);
