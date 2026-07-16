/** Final checker-oriented polish for the 2026-07-15 GPT coverage-balance batch 2 raw bank. */
import { setValue, runPatch } from "../patch-raw";

const advocacy1 = "gpt_balance2_2026_07_15_bt_client_advocacy_01";
const conflict5 = "gpt_balance2_2026_07_15_fib_conflict_resolution_05";
const conflict6 = "gpt_balance2_2026_07_15_hl_conflict_resolution_06";
const discharge7 = "gpt_balance2_2026_07_15_bt_discharge_planning_handoff_07";
const discharge8 = "gpt_balance2_2026_07_15_fib_discharge_planning_handoff_08";
const psych9 = "gpt_balance2_2026_07_15_hl_psychotropic_medications_09";
const endocrine12 = "gpt_balance2_2026_07_15_bt_cardiovascular_endocrine_medications_12";
const disaster13 = "gpt_balance2_2026_07_15_bt_disaster_emergency_preparedness_13";
const abg18 = "gpt_balance2_2026_07_15_bt_abg_acid_base_interpretation_18";

runPatch([
  setValue({
    id: advocacy1,
    path: ["meta", "source"],
    before: "The Joint Commission, R3 Report Issue 11: Pain Assessment and Management Standards for Hospitals, elements addressing individualized pain assessment, reassessment, and treatment, https://www.jointcommission.org/standards/r3-report/r3-report-issue-11-pain-assessment-and-management-standards-for-hospitals/",
    after: "American Society of Hematology, 2020 Guidelines for Sickle Cell Disease: Management of Acute and Chronic Pain, Recommendation 1a (rapid assessment and analgesia within 1 hour with reassessment every 30–60 minutes), https://pmc.ncbi.nlm.nih.gov/articles/PMC7322963/; The Joint Commission, R3 Report Issue 11, individualized pain assessment, reassessment, and treatment, https://digitalassets.jointcommission.org/api/public/content/565820ca0d27416d957efe6b6e1d4705?v=36bcc020",
    note: "Replace a retired topic page with the disease-specific timing rule and the checkable Joint Commission report.",
  }),
  setValue({
    id: conflict5,
    path: ["meta", "source"],
    before: "AHRQ TeamSTEPPS 3.0, Communication module, DESC Script (Describe, Express, Suggest, Consequences), https://www.ahrq.gov/teamstepps-program/curriculum/communication/index.html",
    after: "Agency for Healthcare Research and Quality, TeamSTEPPS 3.0, Tool: DESC (Describe, Express, Suggest, Consequences), https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/desc.html",
    note: "Route DESC to its exact Mutual Support tool page rather than the Communication module index.",
  }),
  setValue({
    id: conflict6,
    path: ["stem"],
    before: {
      en: "Highlight the statements that are constructive components of a DESC conflict-resolution message.",
      zh: "标出属于 DESC 冲突解决信息中建设性组成部分的语句。",
    },
    after: {
      en: "A family member is upset because the unit's quiet-hours policy requires late-night video calls that disturb a roommate to be moved from a semiprivate room to the family lounge. Highlight the nurse's statements that use constructive conflict-resolution communication.",
      zh: "一名家属因病区安静时段政策感到不满：如果深夜视频通话打扰室友，通话必须从半私密病房转移到家属休息室。标出护士使用建设性冲突解决沟通的陈述。",
    },
    note: "Replace the shared-infusion-pump DESC premise excluded by the commission and already present in batch 1.",
  }),
  setValue({
    id: conflict6,
    path: ["rationale"],
    before: {
      correct: {
        en: "A constructive DESC message objectively describes the event, expresses its impact or concern, suggests a specific change, and explains a shared consequence. Absolute blame and retaliatory threats make the conflict more personal and less solvable.",
        zh: "建设性的 DESC 信息应客观描述事件，表达其影响或担忧，提出具体改变，并说明共同后果。绝对化指责和报复性威胁会使冲突更个人化、更难解决。",
      },
      byChoice: [
        { refId: "s2", en: "This objectively describes a specific observable event.", zh: "这客观描述了一个具体、可观察的事件。" },
        { refId: "s3", en: "'Never care' is an absolute judgment about motive, not an objective description.", zh: "“从不在乎”是对动机的绝对化判断，不是客观描述。" },
        { refId: "s4", en: "This expresses a patient-safety concern and its impact.", zh: "这表达了患者安全方面的担忧及其影响。" },
        { refId: "s5", en: "This suggests a specific and feasible behavior change.", zh: "这提出了具体且可执行的行为改变。" },
        { refId: "s6", en: "This states the shared positive consequence of the proposed change.", zh: "这说明了建议改变所带来的共同积极后果。" },
        { refId: "s7", en: "A retaliatory threat escalates conflict and is not a constructive consequence statement.", zh: "报复性威胁会升级冲突，不是建设性的后果陈述。" },
      ],
    },
    after: {
      correct: {
        en: "Constructive conflict communication acknowledges the person's concern, describes the observable impact without blame, offers a feasible alternative, and seeks agreement. Character attacks and disproportionate threats escalate a nonviolent disagreement.",
        zh: "建设性冲突沟通应承认对方的关切，不带指责地描述可观察影响，提出可行替代方案，并寻求一致。人身指责和不相称的威胁会升级原本没有暴力的分歧。",
      },
      byChoice: [
        { refId: "s2", en: "Acknowledging the importance of family connection shows that the concern was heard without abandoning the boundary.", zh: "承认家属保持联系的重要性，表明护士听到了关切，同时没有放弃必要界限。" },
        { refId: "s3", en: "This objectively describes the current effect on the roommate without assigning a motive.", zh: "这客观描述了当前对室友的影响，没有推测或指责动机。" },
        { refId: "s4", en: "Moving to the available lounge is a specific alternative that preserves both connection and quiet hours.", zh: "转移到可用的家属休息室是具体替代方案，可同时维持联系并遵守安静时段。" },
        { refId: "s5", en: "Seeking agreement turns the alternative into a shared next step.", zh: "寻求一致可把替代方案转化为双方共同的下一步。" },
        { refId: "s6", en: "Calling the family selfish is a personal judgment that increases defensiveness.", zh: "称家属自私属于人身判断，会增加防御情绪。" },
        { refId: "s7", en: "An immediate removal threat is disproportionate when no aggression or refusal is described.", zh: "题干未描述攻击行为或拒绝配合，立即威胁驱离并不相称。" },
      ],
    },
  }),
  setValue({
    id: conflict6,
    path: ["testTakingStrategy"],
    before: {
      en: "Select objective, specific, future-focused language; reject blame words such as 'always' and threats unrelated to patient safety.",
      zh: "选择客观、具体、面向未来的语言；排除“总是”等指责词和与患者安全无关的威胁。",
    },
    after: {
      en: "Choose statements that acknowledge, describe facts, offer a workable option, and confirm the next step; reject labels and premature threats.",
      zh: "选择能够承认关切、描述事实、提出可行选择并确认下一步的陈述；排除贴标签和过早威胁。",
    },
  }),
  setValue({
    id: conflict6,
    path: ["glossary"],
    before: [
      { termEn: "DESC", termZh: "DESC", defZh: "描述、表达、建议和后果四步结构化冲突沟通法。" },
      { termEn: "objective language", termZh: "客观语言", defZh: "描述可观察事实而不推测动机或贴标签的表达。" },
    ],
    after: [
      { termEn: "acknowledgment", termZh: "承认关切", defZh: "表明已经听到并理解对方关注的问题。" },
      { termEn: "shared next step", termZh: "共同下一步", defZh: "双方同意并能够执行的后续行动。" },
    ],
  }),
  setValue({
    id: conflict6,
    path: ["meta", "source"],
    before: "AHRQ TeamSTEPPS 3.0, Communication module, DESC Script, https://www.ahrq.gov/teamstepps-program/curriculum/communication/index.html",
    after: "Agency for Healthcare Research and Quality, TeamSTEPPS 3.0, Conflict in Teams (including conflict with patients and family caregivers), https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/conflict.html; Tool: DESC, objective description, concerns, alternatives, and agreement, https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/desc.html",
  }),
  setValue({
    id: conflict6,
    path: ["highlight"],
    before: {
      segments: [
        { id: "s1", en: "During a private huddle, the charge nurse says:", zh: "在一次私下简短沟通中，责任护士说：" },
        { id: "s2", en: "Yesterday, the infusion pump was returned without its power cord.", zh: "昨天，输液泵归还时没有电源线。", selectable: true },
        { id: "s3", en: "You never care about the rest of the team.", zh: "你从来不在乎团队里的其他人。", selectable: true },
        { id: "s4", en: "I am concerned because this delayed a medication start.", zh: "我很担心，因为这延误了药物开始时间。", selectable: true },
        { id: "s5", en: "Please return the pump with all components and tell me immediately if one is missing.", zh: "请在归还输液泵时带齐所有部件；如有缺失，请立即告诉我。", selectable: true },
        { id: "s6", en: "That will help us start medications on time and avoid patient-safety delays.", zh: "这样能帮助我们按时开始用药，并避免患者安全方面的延误。", selectable: true },
        { id: "s7", en: "If it happens again, I will refuse to work with you.", zh: "如果再发生，我就拒绝和你一起工作。", selectable: true },
      ],
      correct: ["s2", "s4", "s5", "s6"],
    },
    after: {
      segments: [
        { id: "s1", en: "The nurse says:", zh: "护士说：" },
        { id: "s2", en: "I can see that staying connected tonight is important to your family.", zh: "我理解今晚保持联系对你们家人很重要。", selectable: true },
        { id: "s3", en: "The roommate is sleeping, and the video call can be heard across the room.", zh: "室友正在睡觉，而且整个房间都能听到视频通话。", selectable: true },
        { id: "s4", en: "The family lounge is open, so we can move there and continue the call.", zh: "家属休息室现在开放，我们可以转移到那里继续通话。", selectable: true },
        { id: "s5", en: "Can we agree to use the lounge for the rest of tonight's call?", zh: "我们能否商定今晚剩余的通话在家属休息室进行？", selectable: true },
        { id: "s6", en: "You are being selfish and inconsiderate.", zh: "你们这样做很自私，也不替别人考虑。", selectable: true },
        { id: "s7", en: "If you make one more sound, I will have security remove you immediately.", zh: "如果你们再发出一点声音，我就立即让保安把你们带走。", selectable: true },
      ],
      correct: ["s2", "s3", "s4", "s5"],
    },
  }),
  setValue({
    id: discharge7,
    path: ["meta", "source"],
    before: "42 CFR 482.43(c)(5), hospital discharge planning requirement to transfer necessary medical information to appropriate follow-up providers, https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.43",
    after: "The Joint Commission, Quick Safety Issue 52, Advancing Safety with Closed-Loop Communication of Test Results, responsibility, escalation, patient engagement, and follow-up, https://www.jointcommission.org/-/media/tjc/newsletters/qs-52-closed-loop-comm-12-3-19-final.pdf; 42 CFR 482.43(c)(5), transfer of necessary medical information at discharge, https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.43",
    note: "Add the exact closed-loop test-result source supporting ownership and patient notification.",
  }),
  setValue({
    id: discharge8,
    path: ["stem"],
    before: {
      en: "After teaching a new inhaler schedule, the nurse says, ‘Please explain in your own words when and how you will use each inhaler so I can check whether I explained it clearly.’ Enter the name of this communication method.",
      zh: "讲解新的吸入器用药时间表后，护士说：“请用自己的话说明你会在何时、如何使用每一种吸入器，以便我确认自己是否讲解清楚。”填写这种沟通方法的名称。",
    },
    after: {
      en: "Before discharge, the nurse starts a video call with the accepting home-health nurse while the client and daughter are present. The nurse reviews the wound-care plan, the receiving nurse confirms the first visit, and the client corrects the contact number. Enter the name for this transparent transfer of care between two team members in front of the client and family.",
      zh: "出院前，护士在患者和女儿在场时，与接收患者的居家护理护士进行视频通话。护士说明伤口护理计划，接收护士确认首次访视时间，患者纠正联系电话。填写这种在患者和家属面前由两名团队成员透明转移照护的名称。",
    },
    note: "Replace a near-exact duplicate of the live teach-back fill-in-the-blank item.",
  }),
  setValue({
    id: discharge8,
    path: ["rationale"],
    before: {
      correct: {
        en: "This is teach-back. The client explains the plan in the client's own words, allowing the nurse to identify misunderstandings and reteach without framing the interaction as a test of the client.",
        zh: "这是复述确认法（teach-back）。患者用自己的话说明计划，使护士能够发现误解并重新讲解，同时避免把交流变成对患者的考试。",
      },
      byChoice: [
        { refId: "b1", en: "The defining feature is asking the client to explain the plan in the client's own words, which is teach-back.", zh: "其定义性特征是请患者用自己的话说明计划，这就是复述确认法。" },
      ],
    },
    after: {
      correct: {
        en: "This is a warm handoff. The sending and receiving team members transfer care transparently in front of the client and family, who can hear, clarify, and correct the information.",
        zh: "这是暖式交接（warm handoff）。交出方和接收方团队成员在患者及家属面前透明转移照护，使患者和家属能够听取、澄清并纠正信息。",
      },
      byChoice: [
        { refId: "b1", en: "The defining feature is a transfer between two healthcare team members conducted in front of the client and family, which AHRQ calls a warm handoff.", zh: "其定义性特征是两名医疗团队成员在患者和家属面前完成照护转移，AHRQ 将其称为暖式交接。" },
      ],
    },
  }),
  setValue({
    id: discharge8,
    path: ["testTakingStrategy"],
    before: {
      en: "Look for the learner explaining the information back in their own words; that cue identifies teach-back.",
      zh: "看到学习者用自己的话复述信息，就是 teach-back 的关键线索。",
    },
    after: {
      en: "Distinguish a warm handoff from ordinary reporting by looking for both team members and the client or family participating in the transfer.",
      zh: "区分暖式交接和普通报告时，要寻找交出方、接收方以及患者或家属共同参与照护转移的线索。",
    },
  }),
  setValue({
    id: discharge8,
    path: ["glossary"],
    before: [
      { termEn: "teach-back", termZh: "复述确认法", defZh: "请患者用自己的话说明所理解内容，以确认沟通是否清楚。" },
      { termEn: "health literacy", termZh: "健康素养", defZh: "获取、理解并运用健康信息和服务的能力。" },
    ],
    after: [
      { termEn: "warm handoff", termZh: "暖式交接", defZh: "两名医疗团队成员在患者和家属面前透明完成的照护转移。" },
      { termEn: "accepting clinician", termZh: "接收临床人员", defZh: "确认接收信息和后续照护责任的医疗团队成员。" },
    ],
  }),
  setValue({
    id: discharge8,
    path: ["meta", "source"],
    before: "AHRQ, Health Literacy Universal Precautions Toolkit, 3rd Edition, Tool 5: Use the Teach-Back Method, https://www.ahrq.gov/health-literacy/improve/precautions/tool5.html",
    after: "Agency for Healthcare Research and Quality, Warm Handoff: Intervention, definition of a transparent transfer between two healthcare team members in front of the patient and family, https://www.ahrq.gov/patient-safety/reports/engage/interventions/warmhandoff.html",
  }),
  setValue({
    id: discharge8,
    path: ["blanks"],
    before: [
      {
        id: "b1",
        prompt: { en: "Communication method", zh: "沟通方法" },
        acceptable: ["teach-back", "teach back", "Teach-back", "Teach back", "复述确认法"],
      },
    ],
    after: [
      {
        id: "b1",
        prompt: { en: "Transfer-of-care method", zh: "照护转移方法" },
        acceptable: ["warm handoff", "warm-handoff", "Warm handoff", "Warm Handoff", "暖式交接"],
      },
    ],
  }),
  setValue({
    id: psych9,
    path: ["meta", "source"],
    before: "DailyMed, ZOLOFT (sertraline) prescribing information, Warnings and Precautions 5.2 Serotonin Syndrome, https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fe9e8b7d-61ea-409d-84aa-3ebd79a046b5",
    after: "DailyMed, ZOLOFT (sertraline) prescribing information, Warnings and Precautions 5.2 Serotonin Syndrome, https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fe9e8b7d-61ea-409d-84aa-3ebd79a046b5; DailyMed, LINEZOLID prescribing information, Warnings and Precautions 5.3, serotonin syndrome with serotonergic agents including SSRIs, https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=bc12bd87-5ef0-4ebe-bc00-cbd7896ce08c&type=display",
    note: "Add the interacting drug's exact label section to support the load-bearing combination.",
  }),
  setValue({
    id: endocrine12,
    path: ["meta", "source"],
    before: "DailyMed, JARDIANCE (empagliflozin) prescribing information, Warnings and Precautions 5.1 Ketoacidosis, https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=faf3dd6a-9cd0-39c2-0d2e-232cb3f67565",
    after: "DailyMed, JARDIANCE (empagliflozin) prescribing information, Warnings and Precautions 5.1 Ketoacidosis, including presentations below 250 mg/dL and treatment with insulin, fluid, and carbohydrate replacement, https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=faf3dd6a-9cd0-39c2-0d2e-232cb3f67565; 2024 international consensus report, Hyperglycemic Crises in Adults With Diabetes, fluids, insulin, potassium monitoring, ketones, and resolution criteria, https://diabetesjournals.org/care/article/47/8/1257/156808/Hyperglycemic-Crises-in-Adults-With-Diabetes-A",
    note: "Add the current consensus source supporting treatment and response monitoring, not only diagnosis and drug discontinuation.",
  }),
  setValue({
    id: disaster13,
    path: ["meta", "source"],
    before: "42 CFR 482.15(a)-(d), Emergency preparedness requirements for hospitals, including continuity of subsistence needs and alternate sources of energy, https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.15",
    after: "ASPR TRACIE, Utility Failures in Health Care Tip Sheet: Electricity, rapid assessment, incident-command triggers, relocation to powered areas, and backup-power capacity planning, https://files.asprtracie.hhs.gov/documents/utility-failures-in-health-care-electricity.pdf; 42 CFR 482.15(a)-(d), hospital emergency preparedness and alternate energy requirements, https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.15",
    note: "Add the exact federal utility-failure resource supporting incident command, relocation, and power-capacity monitoring.",
  }),
  setValue({
    id: abg18,
    path: ["stem"],
    before: {
      en: "Thirty minutes after IV hydromorphone, a postoperative client is difficult to arouse and has respirations of 6/min. ABG results are pH 7.24, PaCO2 60 mm Hg, and HCO3− 26 mEq/L. Complete the bow-tie.",
      zh: "术后患者静脉注射氢吗啡酮 30 分钟后难以唤醒，呼吸频率 6 次/分。动脉血气结果：pH 7.24、PaCO2 60 mm Hg、HCO3− 26 mEq/L。完成蝴蝶结图。",
    },
    after: {
      en: "Shortly after extubation in the postanesthesia care unit, a client who received rocuronium is awake and follows commands but cannot sustain a head lift, has a weak cough, and breathes shallowly at 8/min. Quantitative train-of-four ratio is 0.55. ABG results are pH 7.27, PaCO2 58 mm Hg, and HCO3− 26 mEq/L. Complete the bow-tie.",
      zh: "一名接受过罗库溴铵的患者在麻醉后监护室拔管不久，意识清醒并能遵从指令，但无法持续抬头、咳嗽无力，呼吸浅慢，频率为 8 次/分。定量四联刺激（TOF）比值为 0.55。动脉血气结果：pH 7.27、PaCO2 58 mm Hg、HCO3− 26 mEq/L。完成蝴蝶结图。",
    },
    note: "Replace the hydromorphone-apnea/naloxone pathway that materially collided with a live capnography item.",
  }),
  setValue({
    id: abg18,
    path: ["rationale"],
    before: {
      correct: {
        en: "The low pH with high PaCO2 and near-normal bicarbonate indicates acute respiratory acidosis from opioid-induced hypoventilation. The nurse must immediately support ventilation and administer naloxone according to the standing order or prescription. Respiratory/neurologic status and repeat gas exchange measurements determine response and recurrence.",
        zh: "pH 降低、PaCO2 升高且碳酸氢盐接近正常，提示阿片类药物导致低通气的急性呼吸性酸中毒。护士必须立即支持通气，并按照常备医嘱或处方给予纳洛酮。呼吸/神经状态和复查气体交换指标用于判断疗效及是否复发。",
      },
      byChoice: [
        { refId: "c1", en: "Acidemia with elevated PaCO2 and little bicarbonate elevation is an acute respiratory acidosis pattern, and the clinical cause is opioid hypoventilation.", zh: "酸血症伴 PaCO2 升高而碳酸氢盐升高不明显，符合急性呼吸性酸中毒；临床原因是阿片类低通气。" },
        { refId: "c2", en: "Primary metabolic acidosis would feature a reduced bicarbonate, which is not present.", zh: "原发代谢性酸中毒应表现为碳酸氢盐降低，而此处并未降低。" },
        { refId: "c3", en: "Chronic compensation would produce a more substantial bicarbonate increase and does not fit the abrupt post-opioid change.", zh: "慢性代偿应有更明显的碳酸氢盐升高，也不符合阿片给药后的急性变化。" },
        { refId: "a1", en: "A respiratory rate of 6/min with difficult arousal requires immediate airway positioning and assisted ventilation.", zh: "呼吸 6 次/分且难以唤醒，需要立即开放气道并辅助通气。" },
        { refId: "a2", en: "Naloxone reverses opioid effects and should be given according to the available standing order or prescription.", zh: "纳洛酮可逆转阿片效应，应按照现有常备医嘱或处方给予。" },
        { refId: "a3", en: "Paper-bag breathing further reduces ventilation and is unsafe in hypercapnic respiratory acidosis.", zh: "纸袋呼吸会进一步降低通气，在高碳酸血症性呼吸酸中毒中不安全。" },
        { refId: "a4", en: "Routine bicarbonate does not correct the primary problem of inadequate ventilation.", zh: "常规给予碳酸氢盐不能纠正通气不足这一原发问题。" },
        { refId: "p1", en: "Respiratory rate, depth, consciousness, and oxygenation show whether ventilation and opioid effects are improving.", zh: "呼吸频率、深度、意识和氧合可显示通气及阿片效应是否改善。" },
        { refId: "p2", en: "Repeat pH and PaCO2 directly track correction of the acute respiratory acidosis.", zh: "复查 pH 和 PaCO2 可直接追踪急性呼吸性酸中毒是否纠正。" },
        { refId: "p3", en: "INR does not assess ventilation or naloxone response.", zh: "INR 不能评估通气或纳洛酮反应。" },
        { refId: "p4", en: "Serum amylase is unrelated to the acute opioid respiratory event.", zh: "血清淀粉酶与急性阿片呼吸事件无关。" },
      ],
    },
    after: {
      correct: {
        en: "The low pH, high PaCO2, and near-normal bicarbonate indicate acute respiratory acidosis. Weakness, shallow ventilation, and a train-of-four ratio of 0.55 after rocuronium support residual neuromuscular blockade as the cause. Airway and ventilatory support take priority while anesthesia is urgently engaged and prescribed reversal is administered. Quantitative recovery and repeat respiratory/ABG findings determine whether the client has recovered safely.",
        zh: "pH 降低、PaCO2 升高且碳酸氢盐接近正常，提示急性呼吸性酸中毒。使用罗库溴铵后出现肌无力、浅慢呼吸且 TOF 比值为 0.55，支持残余神经肌肉阻滞为病因。应优先开放气道并支持通气，同时紧急联系麻醉团队并按医嘱给予拮抗药。定量恢复指标以及复查呼吸和动脉血气结果用于判断患者是否安全恢复。",
      },
      byChoice: [
        { refId: "c1", en: "Acidemia with elevated PaCO2 and little bicarbonate elevation is acute respiratory acidosis, and the weakness plus low train-of-four ratio identifies residual blockade-related hypoventilation.", zh: "酸血症伴 PaCO2 升高而碳酸氢盐升高不明显，属于急性呼吸性酸中毒；肌无力和低 TOF 比值提示残余阻滞导致低通气。" },
        { refId: "c2", en: "Primary metabolic acidosis would feature a reduced bicarbonate, which is not present.", zh: "原发代谢性酸中毒应表现为碳酸氢盐降低，而此处并未降低。" },
        { refId: "c3", en: "Chronic compensation would produce a larger bicarbonate increase and does not fit the abrupt postoperative weakness.", zh: "慢性代偿应有更明显的碳酸氢盐升高，也不符合术后突然出现的肌无力。" },
        { refId: "a1", en: "Shallow respirations and weak airway protection require immediate airway support and assisted ventilation while expert help is summoned.", zh: "浅慢呼吸和气道保护无力需要立即支持气道并辅助通气，同时呼叫专业团队。" },
        { refId: "a2", en: "Ventilatory support continues while the prescribed neuromuscular-blockade reversal is administered and recovery is reassessed.", zh: "在按医嘱给予神经肌肉阻滞拮抗药并重新评估恢复情况期间，应持续支持通气。" },
        { refId: "a3", en: "Ambulation is unsafe with residual weakness and does not restore ventilation.", zh: "存在残余肌无力时下床活动不安全，也不能恢复通气。" },
        { refId: "a4", en: "Routine bicarbonate does not correct the primary problem of inadequate ventilation.", zh: "常规给予碳酸氢盐不能纠正通气不足这一原发问题。" },
        { refId: "p1", en: "Quantitative train-of-four recovery to at least 0.9 supports adequate reversal of neuromuscular blockade.", zh: "定量 TOF 比值恢复至至少 0.9，支持神经肌肉阻滞已充分逆转。" },
        { refId: "p2", en: "Respiratory status and repeat pH and PaCO2 show whether ventilation and acute respiratory acidosis are improving.", zh: "呼吸状况以及复查 pH 和 PaCO2 可显示通气和急性呼吸性酸中毒是否改善。" },
        { refId: "p3", en: "INR does not assess neuromuscular recovery or ventilation.", zh: "INR 不能评估神经肌肉恢复或通气。" },
        { refId: "p4", en: "Serum amylase is unrelated to residual neuromuscular blockade.", zh: "血清淀粉酶与残余神经肌肉阻滞无关。" },
      ],
    },
  }),
  setValue({
    id: abg18,
    path: ["testTakingStrategy"],
    before: {
      en: "Read pH first, match the respiratory value moving in the opposite direction, then connect the ABG to the client's ventilation and medication exposure.",
      zh: "先看 pH，再找与其反向变化的呼吸指标，然后把 ABG 与患者通气情况和药物暴露联系起来。",
    },
    after: {
      en: "Interpret the ABG first, then use the postoperative weakness and quantitative train-of-four result to identify why ventilation is failing.",
      zh: "先解释动脉血气，再利用术后肌无力和定量 TOF 结果判断通气失败的原因。",
    },
  }),
  setValue({
    id: abg18,
    path: ["glossary"],
    before: [
      { termEn: "respiratory acidosis", termZh: "呼吸性酸中毒", defZh: "通气不足导致二氧化碳潴留和 pH 降低。" },
      { termEn: "hypoventilation", termZh: "低通气", defZh: "肺泡通气不足，导致二氧化碳清除减少。" },
      { termEn: "naloxone", termZh: "纳洛酮", defZh: "可逆转阿片类药物所致呼吸抑制的拮抗剂。" },
    ],
    after: [
      { termEn: "respiratory acidosis", termZh: "呼吸性酸中毒", defZh: "通气不足导致二氧化碳潴留和 pH 降低。" },
      { termEn: "residual neuromuscular blockade", termZh: "残余神经肌肉阻滞", defZh: "手术后神经肌肉阻滞药作用尚未充分消退所致的肌无力。" },
      { termEn: "train-of-four ratio", termZh: "四联刺激比值", defZh: "定量评估神经肌肉传导恢复程度的监测指标。" },
    ],
  }),
  setValue({
    id: abg18,
    path: ["meta", "source"],
    before: "Merck Manual Professional, Respiratory Acidosis, acute hypoventilation and ABG pattern, https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/acid-base-regulation-and-disorders/respiratory-acidosis ; CDC/NIOSH, Responding to a Suspected Opioid Overdose, ventilation support and naloxone, https://www.cdc.gov/niosh/substance-use/opioids/overdose-response/index.html",
    after: "American Society of Anesthesiologists, 2023 Practice Guidelines for Monitoring and Antagonism of Neuromuscular Blockade, quantitative monitoring and train-of-four recovery of at least 0.9, https://pubmed.ncbi.nlm.nih.gov/36520073/; DailyMed, BRIDION (sugammadex) prescribing information, ventilatory support until adequate spontaneous respiration and airway patency are restored, https://dailymed.nlm.nih.gov/dailymed/getFile.cfm?setid=5171d883-fe8f-482c-97ab-40b00975b64a&type=pdf; Merck Manual Professional, Respiratory Acidosis, acute hypoventilation and ABG pattern, https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/acid-base-regulation-and-disorders/respiratory-acidosis",
  }),
  setValue({
    id: abg18,
    path: ["bowtie"],
    before: {
      condition: {
        prompt: { en: "Most likely condition", zh: "最可能的病情" },
        tokens: [
          { id: "c1", en: "Acute respiratory acidosis from opioid-induced hypoventilation", zh: "阿片类药物低通气所致急性呼吸性酸中毒" },
          { id: "c2", en: "Primary metabolic acidosis", zh: "原发性代谢性酸中毒" },
          { id: "c3", en: "Chronic compensated respiratory acidosis", zh: "慢性代偿性呼吸性酸中毒" },
        ],
        correct: "c1",
      },
      actions: {
        prompt: { en: "Immediate actions", zh: "立即行动" },
        tokens: [
          { id: "a1", en: "Open the airway and support ventilation with bag-mask assistance as needed", zh: "开放气道，并按需要使用简易呼吸器面罩辅助通气" },
          { id: "a2", en: "Administer naloxone per standing order or prescription", zh: "按常备医嘱或处方给予纳洛酮" },
          { id: "a3", en: "Encourage rebreathing into a paper bag", zh: "鼓励用纸袋重复呼吸" },
          { id: "a4", en: "Give sodium bicarbonate routinely before improving ventilation", zh: "在改善通气前常规给予碳酸氢钠" },
        ],
        correct: ["a1", "a2"],
      },
      parameters: {
        prompt: { en: "Parameters to monitor", zh: "监测指标" },
        tokens: [
          { id: "p1", en: "Respiratory rate, level of consciousness, and oxygen saturation", zh: "呼吸频率、意识水平和血氧饱和度" },
          { id: "p2", en: "Repeat pH and PaCO2", zh: "复查 pH 和 PaCO2" },
          { id: "p3", en: "INR", zh: "国际标准化比值（INR）" },
          { id: "p4", en: "Serum amylase", zh: "血清淀粉酶" },
        ],
        correct: ["p1", "p2"],
      },
    },
    after: {
      condition: {
        prompt: { en: "Most likely condition", zh: "最可能的病情" },
        tokens: [
          { id: "c1", en: "Acute respiratory acidosis from residual neuromuscular blockade", zh: "残余神经肌肉阻滞所致急性呼吸性酸中毒" },
          { id: "c2", en: "Primary metabolic acidosis from hypoperfusion", zh: "低灌注所致原发性代谢性酸中毒" },
          { id: "c3", en: "Chronic compensated respiratory acidosis", zh: "慢性代偿性呼吸性酸中毒" },
        ],
        correct: "c1",
      },
      actions: {
        prompt: { en: "Immediate actions", zh: "立即行动" },
        tokens: [
          { id: "a1", en: "Open the airway, assist ventilation as needed, and summon anesthesia or rapid-response support", zh: "开放气道，按需辅助通气，并呼叫麻醉团队或快速反应支持" },
          { id: "a2", en: "Administer the prescribed neuromuscular-blockade reversal while continuing close respiratory monitoring", zh: "按医嘱给予神经肌肉阻滞拮抗药，同时继续密切监测呼吸" },
          { id: "a3", en: "Ambulate the client to clear the remaining anesthetic", zh: "让患者下床活动以清除残余麻醉药" },
          { id: "a4", en: "Give sodium bicarbonate routinely before restoring ventilation", zh: "在恢复通气前常规给予碳酸氢钠" },
        ],
        correct: ["a1", "a2"],
      },
      parameters: {
        prompt: { en: "Parameters to monitor", zh: "监测指标" },
        tokens: [
          { id: "p1", en: "Quantitative train-of-four recovery to at least 0.9", zh: "定量 TOF 比值恢复至至少 0.9" },
          { id: "p2", en: "Respiratory rate and depth, level of consciousness, and repeat pH and PaCO2", zh: "呼吸频率和深度、意识水平以及复查 pH 和 PaCO2" },
          { id: "p3", en: "INR", zh: "国际标准化比值（INR）" },
          { id: "p4", en: "Serum amylase", zh: "血清淀粉酶" },
        ],
        correct: ["p1", "p2"],
      },
    },
  }),
]);
