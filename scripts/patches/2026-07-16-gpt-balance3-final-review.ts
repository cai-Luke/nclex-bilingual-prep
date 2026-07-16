/** Final checker-oriented polish for the 2026-07-16 GPT coverage-balance batch 3 raw bank. */
import { setValue, runPatch } from "../patch-raw";

const discharge1 = "gpt_balance3_2026_07_16_bt_discharge_planning_handoff_01";
const conflict6 = "gpt_balance3_2026_07_16_bt_conflict_resolution_06";
const conflict7 = "gpt_balance3_2026_07_16_hl_conflict_resolution_07";
const discharge8 = "gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08";
const dosage9 = "gpt_balance3_2026_07_16_bt_dosage_calculations_09";
const anticoag10 = "gpt_balance3_2026_07_16_or_anticoagulant_therapy_10";
const pn12 = "gpt_balance3_2026_07_16_hl_parenteral_nutrition_12";
const ppe14 = "gpt_balance3_2026_07_16_bt_ppe_sterile_technique_14";
const dialysis17 = "gpt_balance3_2026_07_16_hl_procedural_complications_dialysis_17";
const fetal18 = "gpt_balance3_2026_07_16_bt_intrapartum_fetal_monitoring_18";

runPatch([
  setValue({
    id: discharge1,
    path: ["meta", "source"],
    before: "42 CFR § 482.43(b)(1), Discharge planning—transfer or referral, https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.43",
    after: "Agency for Healthcare Research and Quality, Medications at Transitions and Clinical Handoffs (MATCH) Toolkit, comparison of transfer/discharge orders and resolution of dose discrepancies, https://www.ahrq.gov/patient-safety/settings/hospital/match/index.html; TeamSTEPPS 3.0, Tool: Handoff, transfer and confirmation of information, authority, and responsibility, https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/handoff.html; 42 CFR § 482.43(b)(1), transfer or referral of necessary medical information, https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.43",
    note: "Add exact medication-reconciliation and handoff-closure support to the discharge regulation.",
  }),
  setValue({
    id: conflict6,
    path: ["stem"],
    before: {
      en: "A nurse and respiratory therapist argue at the bedside about whether an awake, anxious, mechanically ventilated client meets the unit’s objective criteria for a spontaneous breathing trial. The disagreement has delayed the assessment for 40 minutes. Complete the bow-tie diagram.",
      zh: "护士和呼吸治疗师在床旁争论一名清醒、焦虑、机械通气患者是否符合科室进行自主呼吸试验的客观标准。争议已使评估延迟 40 分钟。请完成蝴蝶结图。",
    },
    after: {
      en: "At shift change, two nurses with an ongoing personal dispute refuse to give report directly to one another. The outgoing nurse leaves a note with a third coworker, but it omits the current insulin-infusion rate and the time of the last glucose check. The incoming nurse has not acknowledged accepting responsibility for the client. Complete the bow-tie diagram.",
      zh: "交班时，两名长期存在私人矛盾的护士拒绝彼此直接交接。交班护士把一张便条留给第三名同事，但便条未写明当前胰岛素输注速率和末次血糖检查时间。接班护士也尚未确认已接收该患者的照护责任。请完成蝴蝶结图。",
    },
    note: "Replace a material structural collision with the earlier interdisciplinary mobility-conflict bowtie.",
  }),
  setValue({
    id: conflict6,
    path: ["rationale", "correct"],
    before: {
      en: "This is unresolved interprofessional conflict that is delaying care and distressing the client. The nurse should move the discussion away from the bedside, use objective criteria and a shared patient goal, and obtain neutral clinical facilitation if agreement cannot be reached. Outcomes should focus on timely assessment and a clearly communicated plan.",
      zh: "这是未解决的跨专业冲突，已延误照护并使患者不安。护士应把讨论移出床旁，依据客观标准和共同的患者目标沟通；若仍无法达成一致，应请中立的临床负责人协调。评价重点是及时完成评估并形成明确传达的计划。",
    },
    after: {
      en: "The personal dispute has become an interpersonal conflict that is compromising a safety-critical handoff. The charge nurse should first restore a complete, direct transfer of information and responsibility, including confirmation by the receiving nurse. The conduct dispute can then be addressed separately without allowing it to delay or replace the handoff.",
      zh: "私人矛盾已演变为影响安全关键交接的人际冲突。责任护士应先恢复完整、直接的信息与照护责任转移，并由接班护士确认接收。之后可另行处理行为争议，不能让该争议延误或取代交接。",
    },
  }),
  setValue({
    id: conflict6,
    path: ["rationale", "byChoice"],
    before: [
      { refId: "c1", en: "The disagreement is affecting care delivery and therefore represents unresolved interprofessional conflict.", zh: "该分歧已影响照护实施，因此属于未解决的跨专业冲突。" },
      { refId: "c2", en: "Independent decision making does not justify an unresolved bedside argument that delays care.", zh: "独立决策不能合理化延误照护的床旁争论。" },
      { refId: "c3", en: "This is not task delegation; it is disagreement about a shared clinical assessment.", zh: "这不是任务委派，而是对共同临床评估的分歧。" },
      { refId: "a1", en: "A private, objective discussion protects the client and refocuses both clinicians on shared criteria.", zh: "私下依据客观标准讨论可保护患者，并让双方重新聚焦共同标准。" },
      { refId: "a2", en: "A neutral clinical leader can facilitate a timely decision when the clinicians remain deadlocked.", zh: "双方僵持时，中立的临床负责人可协助及时作出决定。" },
      { refId: "a3", en: "Continuing the argument at the bedside increases distress and does not resolve the delay.", zh: "继续在床旁争论会加重患者不安，也不能解决延误。" },
      { refId: "a4", en: "Unilaterally canceling the assessment bypasses collaboration and may withhold appropriate care.", zh: "单方面取消评估绕过协作，可能使患者失去适当照护。" },
      { refId: "p1", en: "Timely completion of the readiness assessment shows that the care delay was resolved.", zh: "及时完成准备度评估说明照护延误已解决。" },
      { refId: "p2", en: "A single documented and communicated plan shows that the team reached operational agreement.", zh: "形成并传达一项统一计划，说明团队已达成可执行的一致意见。" },
      { refId: "p3", en: "An apology may be helpful but does not prove that the clinical conflict was resolved.", zh: "道歉可能有帮助，但不能证明临床冲突已解决。" },
      { refId: "p4", en: "The next staffing schedule is unrelated to this immediate clinical disagreement.", zh: "下一班排班与当前临床分歧无关。" },
    ],
    after: [
      { refId: "c1", en: "The personal dispute is preventing complete information exchange and explicit acceptance of responsibility, so it is an interpersonal conflict compromising the handoff.", zh: "私人矛盾阻碍了完整信息交换和明确接收照护责任，因此属于影响交接的人际冲突。" },
      { refId: "c2", en: "An asynchronous handoff still requires complete information and a clear transfer of responsibility; neither is present.", zh: "异步交接仍需完整信息和明确的责任转移；本例两者均不具备。" },
      { refId: "c3", en: "The missing infusion and glucose details and absent receiver acknowledgment show that the disagreement is not resolved.", zh: "缺少输注及血糖信息且接收方未确认，说明争议尚未解决。" },
      { refId: "a1", en: "Charge-nurse facilitation restores the immediate safety function of handoff and supplies the missing high-risk information.", zh: "由责任护士协调可恢复交接的即时安全功能，并补齐缺失的高风险信息。" },
      { refId: "a2", en: "Receiver confirmation closes the transfer of responsibility; conduct review can follow after safe care continuity is established.", zh: "接收方确认可完成照护责任转移；在安全连续照护建立后再处理行为问题。" },
      { refId: "a3", en: "Reconstructing a current high-risk handoff indirectly from an incomplete note can perpetuate omissions and does not establish acceptance of responsibility.", zh: "根据不完整便条间接重建当前高风险交接，可能延续遗漏，也不能确认责任已被接收。" },
      { refId: "a4", en: "Completing conduct reports first leaves the client without a safe, acknowledged handoff while the dispute is processed.", zh: "先处理行为报告会使患者在争议处理期间缺少安全且经确认的交接。" },
      { refId: "p1", en: "Verification of the infusion rate and last glucose time shows that the omitted safety-critical information was transferred.", zh: "核实输注速率和末次血糖时间，说明缺失的安全关键信息已完成转移。" },
      { refId: "p2", en: "The incoming nurse's confirmation establishes who now holds responsibility for the client's care.", zh: "接班护士确认接收，明确了当前由谁承担患者照护责任。" },
      { refId: "p3", en: "Filing a conduct report may be appropriate later but does not demonstrate that the handoff itself is complete.", zh: "之后可能需要提交行为报告，但这不能证明交接本身已经完成。" },
      { refId: "p4", en: "Leaving on schedule is not evidence that information and responsibility transferred safely.", zh: "按时离岗不能证明信息和照护责任已安全转移。" },
    ],
  }),
  setValue({
    id: conflict6,
    path: ["testTakingStrategy"],
    before: {
      en: "In conflict questions, select actions that protect the client, return to objective data, and create a clear path to a decision.",
      zh: "处理冲突题时，选择能保护患者、回到客观资料并建立明确决策路径的措施。",
    },
    after: {
      en: "Separate the immediate patient-safety function from the later conduct issue: complete and acknowledge the handoff first.",
      zh: "区分即时患者安全任务与之后的行为问题：先完成交接并确认接收。",
    },
  }),
  setValue({
    id: conflict6,
    path: ["glossary"],
    before: [
      { termEn: "spontaneous breathing trial", termZh: "自主呼吸试验", defZh: "评估机械通气患者能否在较少支持下自主呼吸的试验" },
      { termEn: "interprofessional conflict", termZh: "跨专业冲突", defZh: "不同专业成员之间影响合作或照护的分歧" },
    ],
    after: [
      { termEn: "interpersonal conflict", termZh: "人际冲突", defZh: "因关系或个人矛盾而影响团队合作与安全照护的冲突" },
      { termEn: "handoff acceptance", termZh: "交接接收确认", defZh: "接收方明确确认已获得关键信息并承担照护责任" },
    ],
  }),
  setValue({
    id: conflict6,
    path: ["meta", "source"],
    before: "AACN Standards for Establishing and Sustaining Healthy Work Environments, Skilled Communication and True Collaboration standards, https://www.aacn.org/nursing-excellence/healthy-work-environments",
    after: "Agency for Healthcare Research and Quality, TeamSTEPPS 3.0, Conflict in Teams (interpersonal conflict and patient-safety effects), https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/conflict.html; Tool: Handoff, transfer and confirmation of information, authority, and responsibility, https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/handoff.html",
  }),
  setValue({
    id: conflict6,
    path: ["bowtie", "condition", "tokens"],
    before: [
      { id: "c1", en: "Unresolved interprofessional conflict delaying care", zh: "未解决的跨专业冲突导致照护延误" },
      { id: "c2", en: "Appropriate independent clinical decision making", zh: "适当的独立临床决策" },
      { id: "c3", en: "Routine task-delegation dispute", zh: "常规任务委派争议" },
    ],
    after: [
      { id: "c1", en: "Interpersonal conflict compromising transfer of responsibility", zh: "人际冲突影响照护责任转移" },
      { id: "c2", en: "Acceptable routine asynchronous handoff", zh: "可接受的常规异步交接" },
      { id: "c3", en: "Resolved documentation disagreement", zh: "已解决的记录分歧" },
    ],
  }),
  setValue({
    id: conflict6,
    path: ["bowtie", "actions", "tokens"],
    before: [
      { id: "a1", en: "Move the discussion away from the bedside and compare the objective trial criteria", zh: "将讨论移出床旁，并对照客观试验标准" },
      { id: "a2", en: "Request facilitation by the charge nurse or clinical leader if no agreement is reached", zh: "若无法达成一致，请责任护士或临床负责人协调" },
      { id: "a3", en: "Continue debating in front of the client until one clinician yields", zh: "继续在患者面前争论，直到一方让步" },
      { id: "a4", en: "Cancel the trial without further discussion", zh: "不再讨论，直接取消试验" },
    ],
    after: [
      { id: "a1", en: "Have the charge nurse facilitate an immediate direct handoff that includes the missing infusion and glucose information", zh: "由责任护士立即协调直接交接，并补充缺失的输注和血糖信息" },
      { id: "a2", en: "Obtain receiver confirmation and address the conduct dispute separately after safe responsibility transfer", zh: "取得接收方确认，并在安全完成责任转移后另行处理行为争议" },
      { id: "a3", en: "Ask the third coworker to reconstruct the handoff from the incomplete note", zh: "让第三名同事根据不完整便条重建交接内容" },
      { id: "a4", en: "Complete both nurses' conduct reports before resuming the handoff", zh: "先完成两名护士的行为报告，再继续交接" },
    ],
  }),
  setValue({
    id: conflict6,
    path: ["bowtie", "parameters", "tokens"],
    before: [
      { id: "p1", en: "Readiness assessment is completed without further delay", zh: "准备度评估不再延误并已完成" },
      { id: "p2", en: "One agreed plan is documented and communicated to the team", zh: "统一计划已记录并告知团队" },
      { id: "p3", en: "One clinician apologizes first", zh: "其中一名临床人员先道歉" },
      { id: "p4", en: "The next month’s staffing schedule", zh: "下个月的排班表" },
    ],
    after: [
      { id: "p1", en: "Current insulin-infusion rate and last glucose-check time are verified", zh: "当前胰岛素输注速率和末次血糖检查时间已核实" },
      { id: "p2", en: "Incoming nurse confirms receipt of information and responsibility", zh: "接班护士确认已接收信息和照护责任" },
      { id: "p3", en: "A conduct report is filed before transfer", zh: "责任转移前已提交行为报告" },
      { id: "p4", en: "Outgoing nurse leaves the unit on schedule", zh: "交班护士按时离开科室" },
    ],
  }),
  setValue({
    id: conflict7,
    path: ["stem"],
    before: {
      en: "During independent verification of an insulin-pump setting, a coworker repeatedly interrupts with nonurgent questions. Highlight the phrases that make the nurse’s response specific, respectful, and solution focused.",
      zh: "护士正在独立核对胰岛素泵设置时，一名同事反复用非紧急问题打断。请标出使护士回应具体、尊重且以解决问题为导向的语句。",
    },
    after: {
      en: "After a difficult rapid-response debrief, a coworker tells the nurse, “When you spoke over my assessment twice, the team did not hear the change in breath sounds.” Highlight the nurse’s replies that receive the feedback respectfully and support repair.",
      zh: "一次紧张的快速反应事件复盘后，一名同事告诉护士：“你两次打断我的评估，团队因此没有听到呼吸音的变化。”请标出护士既能尊重地接收反馈又有助于修复合作关系的回应。",
    },
    note: "Replace a DESC-like message that repeated the earlier batch's behavior-impact-request structure and 'you always' distractor.",
  }),
  setValue({
    id: conflict7,
    path: ["rationale", "correct"],
    before: {
      en: "A constructive response names the observable behavior, explains its safety impact, and makes a specific request. Global accusations and insults escalate conflict and are not solution focused.",
      zh: "建设性回应应指出可观察到的行为、说明其安全影响，并提出具体请求。笼统指责和侮辱会升级冲突，不能解决问题。",
    },
    after: {
      en: "Receiving feedback constructively means listening without defensiveness, restating the specific impact to confirm understanding, and committing to a concrete future behavior. Minimization and personal labels block repair.",
      zh: "建设性接收反馈意味着不带防御地倾听，复述具体影响以确认理解，并承诺今后的具体行为。淡化问题和给对方贴标签都会阻碍关系修复。",
    },
  }),
  setValue({
    id: conflict7,
    path: ["rationale", "byChoice"],
    before: [
      { refId: "s2", en: "This phrase identifies the specific behavior without labeling the coworker.", zh: "这句话指出了具体行为，没有给同事贴标签。" },
      { refId: "s3", en: "This phrase explains the patient-safety impact of the interruptions.", zh: "这句话说明了打断行为对患者安全的影响。" },
      { refId: "s4", en: "This phrase makes a clear and feasible request.", zh: "这句话提出了明确且可执行的请求。" },
      { refId: "s5", en: "“You always” is a global accusation likely to provoke defensiveness.", zh: "“你总是”属于笼统指责，容易引发防御。" },
      { refId: "s6", en: "Calling the coworker unsafe attacks the person rather than addressing the behavior.", zh: "称同事“不安全”是在攻击个人，而不是处理具体行为。" },
    ],
    after: [
      { refId: "s2", en: "Thanking the coworker and inviting clarification shows openness rather than defensiveness.", zh: "感谢同事并邀请进一步说明，体现开放态度而不是防御。" },
      { refId: "s3", en: "Restating the concrete effect confirms that the nurse understood the safety concern.", zh: "复述具体影响可确认护士理解了安全方面的担忧。" },
      { refId: "s4", en: "A specific future behavior turns the feedback into an actionable repair plan.", zh: "提出今后的具体行为，可把反馈转化为可执行的修复计划。" },
      { refId: "s5", en: "Normalizing all interruptions minimizes the reported impact and closes discussion.", zh: "把所有打断都说成正常现象，会淡化已报告的影响并中断讨论。" },
      { refId: "s6", en: "Calling the coworker overly sensitive labels the person instead of receiving the feedback.", zh: "称同事过于敏感是在给对方贴标签，而不是接收反馈。" },
    ],
  }),
  setValue({
    id: conflict7,
    path: ["testTakingStrategy"],
    before: {
      en: "Constructive conflict language usually contains behavior, impact, and a concrete request—not blame.",
      zh: "建设性冲突沟通通常包含“行为、影响和具体请求”，而不是责备。",
    },
    after: {
      en: "For feedback-repair questions, choose listening, accurate restatement, and a future action; reject minimizing or labeling.",
      zh: "处理反馈修复题时，选择倾听、准确复述和今后行动；排除淡化问题或贴标签。",
    },
  }),
  setValue({
    id: conflict7,
    path: ["glossary"],
    before: [
      { termEn: "assertive communication", termZh: "坚定沟通", defZh: "清楚表达安全需要，同时保持尊重" },
      { termEn: "independent verification", termZh: "独立核对", defZh: "由另一名合格人员独立检查关键设置或计算" },
    ],
    after: [
      { termEn: "formative feedback", termZh: "形成性反馈", defZh: "为改进今后团队表现而提供的具体、尊重且及时的信息" },
      { termEn: "repair plan", termZh: "关系修复计划", defZh: "在承认影响后约定的具体后续行为" },
    ],
  }),
  setValue({
    id: conflict7,
    path: ["meta", "source"],
    before: "AACN Standards for Establishing and Sustaining Healthy Work Environments, Skilled Communication standard, https://www.aacn.org/nursing-excellence/healthy-work-environments",
    after: "Agency for Healthcare Research and Quality, TeamSTEPPS 3.0, Mutual Support overview, Formative Feedback (timely, respectful, specific, directed toward improvement, and patient focused), https://www.ahrq.gov/teamstepps-program/curriculum/mutual/overview/index.html",
  }),
  setValue({
    id: conflict7,
    path: ["highlight", "segments"],
    before: [
      { id: "s1", en: "The nurse says,", zh: "护士说：" },
      { id: "s2", en: "“When nonurgent questions interrupt this verification,", zh: "“当非紧急问题打断这次核对时，", selectable: true },
      { id: "s3", en: "I can lose my place and miss a pump-setting error.", zh: "我可能会忘记核对到哪里，从而漏掉泵设置错误。", selectable: true },
      { id: "s4", en: "Please hold nonurgent questions until I say the check is complete.”", zh: "请把非紧急问题留到我说核对完成之后再问。”", selectable: true },
      { id: "s5", en: "“You always interrupt at the worst time.”", zh: "“你总是在最糟糕的时候打断我。”", selectable: true },
      { id: "s6", en: "“You are unsafe to work with.”", zh: "“和你一起工作很不安全。”", selectable: true },
    ],
    after: [
      { id: "s1", en: "The nurse replies,", zh: "护士回应：" },
      { id: "s2", en: "“Thank you for telling me; I want to understand what happened.", zh: "“谢谢你告诉我；我想了解当时发生了什么。", selectable: true },
      { id: "s3", en: "I hear that my interruptions kept your assessment from reaching the team.", zh: "我听到的是，我的打断使你的评估没有传达给团队。", selectable: true },
      { id: "s4", en: "At the next debrief, I will pause and ask whether you have finished before I respond.”", zh: "下次复盘时，我会先停下来确认你已经说完，再作回应。”", selectable: true },
      { id: "s5", en: "“Everyone interrupts during emergencies, so this is not worth discussing.”", zh: "“紧急情况下大家都会打断别人，所以这不值得讨论。”", selectable: true },
      { id: "s6", en: "“You are too sensitive about how people communicate.”", zh: "“你对别人的沟通方式太敏感了。”", selectable: true },
    ],
  }),
  setValue({
    id: discharge8,
    path: ["meta", "source"],
    before: "42 CFR § 482.43(b)(1), Discharge planning—transfer or referral, https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.43",
    after: "Agency for Healthcare Research and Quality, TeamSTEPPS 3.0, Tool: Handoff, transfer of recent treatment information and the continuing plan, https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/handoff.html; 42 CFR § 482.43(b)(1), transfer or referral of necessary medical information, https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.43",
    note: "Add exact handoff-content support for long-acting medication continuity.",
  }),
  setValue({
    id: dosage9,
    path: ["meta", "source"],
    before: "DailyMed, Doxorubicin Hydrochloride Injection prescribing information, Dosage and Administration (single-agent 60–75 mg/m² schedule) and Warnings—General/Cardiac Function, https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e0349f98-42fa-4003-b6d8-a1db1401b0ef",
    after: "DailyMed, Doxorubicin Hydrochloride for Injection prescribing information, Dosage and Administration 2.1 (single-agent 60–75 mg/m² schedule), Warnings and Precautions 5.1 cardiomyopathy, and 5.4 myelosuppression, https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5f71f79a-4f14-472d-b982-e28c3ce8f972",
    note: "Use a current exact label and name the sections supporting both the calculation range and monitoring parameters.",
  }),
  setValue({
    id: anticoag10,
    path: ["stem"],
    before: {
      en: "A client receiving an IV unfractionated heparin infusion has an anti-Xa level above the hospital protocol’s critical threshold. The hospital protocol specifies this exact sequence: (1) pause the infusion; (2) assess for bleeding and verify the result/specimen; (3) notify the prescriber and pharmacist with the findings; (4) when a revised rate is prescribed and restart criteria are met, restart at the new rate; (5) obtain a repeat anti-Xa level 6 hours after restart. Place the actions in protocol order.",
      zh: "一名接受静脉普通肝素输注的患者，其抗 Xa 水平超过医院流程的危急阈值。医院流程规定严格顺序为：（1）暂停输注；（2）评估出血并核实结果/标本；（3）将评估结果通知开方者和药师；（4）取得新速率医嘱且符合重启条件后，按新速率重新开始；（5）重启 6 小时后复查抗 Xa。请按流程排序。",
    },
    after: {
      en: "A client with creatinine clearance 72 mL/min receives enoxaparin 40 mg once daily for prophylaxis and is scheduled for epidural-catheter removal. The hospital protocol, consistent with the drug label, requires this exact sequence: (1) verify the last enoxaparin time and renal function; (2) after at least 12 hours since the last dose, assess for bleeding and new neurologic deficits and notify anesthesia that the removal interval is met; (3) an authorized clinician removes the catheter; (4) begin the scheduled neurologic and insertion-site monitoring; (5) if hemostasis is stable and no neurologic deficit is present, administer the next prescribed enoxaparin dose no earlier than 4 hours after removal. Place the actions in protocol order.",
      zh: "一名肌酐清除率 72 mL/min 的患者每日接受依诺肝素 40 mg 预防性用药，现计划拔除硬膜外导管。医院流程与药品说明书一致，并规定严格顺序：（1）核实末次依诺肝素给药时间和肾功能；（2）末次给药至少 12 小时后，评估出血及新发神经功能缺损，并通知麻醉团队已达到拔管时间间隔；（3）由获授权的临床人员拔除导管；（4）开始规定的神经功能和穿刺部位监测；（5）若止血稳定且无神经功能缺损，拔管至少 4 小时后再给予下一剂已开具的依诺肝素。请按流程排序。",
    },
    note: "Replace a material reskin of the live supratherapeutic-heparin protocol item with neuraxial enoxaparin safety.",
  }),
  setValue({
    id: anticoag10,
    path: ["meta", "source"],
    before: "DailyMed, Heparin Sodium in 5% Dextrose Injection prescribing information, sections 2.2, 5.2, and 5.5, https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=eede8a0c-5ae6-4166-84b3-12081405f08e",
    after: "DailyMed, Enoxaparin Sodium Injection prescribing information, Boxed Warning and Warnings and Precautions 5.1, neuraxial catheter removal timing, renal-function considerations, post-removal dosing, and neurologic monitoring, https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=21b095d1-5ade-43e9-9114-30fbfb2331c9",
  }),
  setValue({
    id: anticoag10,
    path: ["rationale", "correct"],
    before: {
      en: "The item tests the exact local sequence stated in the stem, not a universal nomogram. The sequence first stops further exposure, then gathers safety data, communicates findings for a revised order, restarts only under the protocol, and finally checks the response at the stated interval.",
      zh: "本题考查题干明确给出的本地流程，而不是把某一列线图当作通用规则。顺序是先停止继续暴露，再收集安全资料，沟通并取得调整医嘱，按流程重启，最后在规定间隔复查疗效。",
    },
    after: {
      en: "The item tests the exact facility sequence stated in the stem. For the stated prophylactic dose and renal function, the label supports waiting at least 12 hours before catheter removal and considering at least 4 hours before the next dose. These intervals do not eliminate neuraxial-hematoma risk, so neurologic and site monitoring begins immediately after removal.",
      zh: "本题考查题干明确给出的机构流程。对于题干所示预防剂量和肾功能，药品说明书支持拔管前至少等待 12 小时，并考虑拔管后至少等待 4 小时再给下一剂。这些时间间隔不能完全消除椎管内血肿风险，因此拔管后应立即开始神经功能和穿刺部位监测。",
    },
  }),
  setValue({
    id: anticoag10,
    path: ["rationale", "byChoice"],
    before: [
      { refId: "A", en: "Pausing the infusion is step 1 in the stated protocol.", zh: "暂停输注是题干流程的第 1 步。" },
      { refId: "B", en: "Bleeding assessment and result/specimen verification are step 2.", zh: "评估出血并核实结果/标本是第 2 步。" },
      { refId: "C", en: "The findings are communicated after the immediate assessment is completed.", zh: "完成即时评估后，再报告相关发现。" },
      { refId: "D", en: "Restart occurs only after a revised rate is prescribed and restart criteria are met.", zh: "只有取得新速率医嘱并符合重启条件后才重新开始输注。" },
      { refId: "E", en: "The repeat anti-Xa is obtained 6 hours after restart, making it the final step.", zh: "重启 6 小时后复查抗 Xa，因此是最后一步。" },
    ],
    after: [
      { refId: "A", en: "Last-dose timing and renal function determine which labeled catheter-removal interval applies.", zh: "末次给药时间和肾功能决定适用哪一项说明书拔管时间间隔。" },
      { refId: "B", en: "After the stated 12-hour interval, bleeding and neurologic assessment precede removal and provide the findings communicated to anesthesia.", zh: "达到题干规定的 12 小时间隔后，应在拔管前评估出血和神经功能，并把结果告知麻醉团队。" },
      { refId: "C", en: "Catheter removal follows confirmation that the protocol interval and pre-removal assessment requirements are met.", zh: "确认已符合流程时间间隔和拔管前评估要求后，方可拔除导管。" },
      { refId: "D", en: "Post-removal neurologic and site monitoring starts before the next anticoagulant dose because timing intervals do not eliminate hematoma risk.", zh: "时间间隔不能完全消除血肿风险，因此应在下一剂抗凝药前开始拔管后神经功能和穿刺部位监测。" },
      { refId: "E", en: "The next prescribed dose is last because the protocol requires both stable findings and at least 4 hours after removal.", zh: "下一剂已开具药物是最后一步，因为流程要求评估稳定且拔管后至少已过 4 小时。" },
    ],
  }),
  setValue({
    id: anticoag10,
    path: ["testTakingStrategy"],
    before: {
      en: "Use only the sequence supplied in the stem; do not substitute a remembered facility nomogram.",
      zh: "只使用题干提供的顺序，不要套用记忆中的其他机构列线图。",
    },
    after: {
      en: "Anchor the order to the two time gates: verify before the 12-hour removal gate, then monitor before the 4-hour post-removal dosing gate.",
      zh: "以两个时间节点排序：先在 12 小时拔管节点前完成核实，再于拔管后 4 小时给药节点前完成监测。",
    },
  }),
  setValue({
    id: anticoag10,
    path: ["glossary"],
    before: [
      { termEn: "anti-Xa level", termZh: "抗 Xa 水平", defZh: "用于评估普通肝素抗凝效应的实验室指标之一" },
      { termEn: "unfractionated heparin", termZh: "普通肝素", defZh: "需要根据实验室监测和临床情况调整的静脉抗凝药" },
    ],
    after: [
      { termEn: "neuraxial catheter", termZh: "椎管内导管", defZh: "置于硬膜外或蛛网膜下相关区域、用于镇痛或麻醉的导管" },
      { termEn: "neuraxial hematoma", termZh: "椎管内血肿", defZh: "椎管内出血形成的血肿，可能压迫神经并造成永久损伤" },
    ],
  }),
  setValue({
    id: anticoag10,
    path: ["options"],
    before: [
      { id: "C", en: "Notify the prescriber and pharmacist of the verified result and bleeding assessment.", zh: "将核实后的结果和出血评估告知开方者与药师。" },
      { id: "E", en: "Obtain a repeat anti-Xa level 6 hours after the infusion is restarted.", zh: "输注重新开始 6 小时后复查抗 Xa。" },
      { id: "A", en: "Pause the heparin infusion.", zh: "暂停肝素输注。" },
      { id: "D", en: "Restart at the newly prescribed rate when the protocol’s restart criteria are met.", zh: "符合流程重启条件后，按新医嘱速率重新开始输注。" },
      { id: "B", en: "Assess for bleeding and verify the result and specimen information.", zh: "评估出血，并核实结果和标本信息。" },
    ],
    after: [
      { id: "D", en: "Begin scheduled neurologic and catheter-site monitoring after removal.", zh: "拔管后开始规定的神经功能和导管部位监测。" },
      { id: "B", en: "After at least 12 hours, assess for bleeding and neurologic deficits and notify anesthesia that the interval is met.", zh: "至少 12 小时后，评估出血和神经功能缺损，并通知麻醉团队已达到时间间隔。" },
      { id: "E", en: "If findings remain stable, administer the next prescribed enoxaparin dose no earlier than 4 hours after removal.", zh: "若评估结果保持稳定，拔管至少 4 小时后再给予下一剂已开具的依诺肝素。" },
      { id: "A", en: "Verify the time of the last enoxaparin dose and the current renal function.", zh: "核实末次依诺肝素给药时间和当前肾功能。" },
      { id: "C", en: "Have the authorized clinician remove the epidural catheter.", zh: "由获授权的临床人员拔除硬膜外导管。" },
    ],
  }),
  setValue({
    id: pn12,
    path: ["highlight", "segments", { id: "s4" }, "en"],
    before: "lipase 620 units/L;",
    after: "lipase 620 units/L (reference 13–60 units/L);",
    note: "Supply the laboratory-specific reference interval required to interpret the lipase result closed-world.",
  }),
  setValue({
    id: pn12,
    path: ["highlight", "segments", { id: "s4" }, "zh"],
    before: "脂肪酶 620 units/L；",
    after: "脂肪酶 620 units/L（参考范围 13～60 units/L）；",
  }),
  setValue({
    id: pn12,
    path: ["rationale", "byChoice", 2],
    before: {
      refId: "s4",
      en: "Marked lipase elevation supports suspected acute pancreatitis in this context.",
      zh: "在此情境下，脂肪酶明显升高支持怀疑急性胰腺炎。",
    },
    after: {
      refId: "s4",
      en: "Lipase 620 units/L is more than 10 times the stated upper reference limit and, with characteristic pain, supports suspected acute pancreatitis.",
      zh: "脂肪酶 620 units/L 超过题干参考上限的 10 倍，结合典型疼痛，支持怀疑急性胰腺炎。",
    },
  }),
  setValue({
    id: pn12,
    path: ["meta", "source"],
    before: "DailyMed, SMOFlipid injection prescribing information, sections 5.7 Hypertriglyceridemia and 5.10 Monitoring/Laboratory Tests, https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e0e9d917-ff6f-488e-a6a8-0ad59dd17d80",
    after: "DailyMed, SMOFlipid prescribing information, Warnings and Precautions 5.7 and 5.10, stopping the adult infusion above triglycerides 400 mg/dL and monitoring for consequences including pancreatitis, https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e0e9d917-ff6f-488e-a6a8-0ad59dd17d80; American College of Gastroenterology, 2024 Guideline: Management of Acute Pancreatitis, characteristic pain plus lipase greater than 3 times the upper limit of normal, https://pmc.ncbi.nlm.nih.gov/articles/PMC13221274/",
    note: "Add the exact diagnostic support for the characteristic pain-plus-lipase cue cluster.",
  }),
  setValue({
    id: ppe14,
    path: ["rationale", "byChoice", 4, "en"],
    before: "Chemotherapy-rated double gloves and a protective gown reduce dermal exposure during cleanup; eye/face protection is added when splash risk exists.",
    after: "Current NIOSH spill-cleanup guidance calls for double chemotherapy gloves, a protective gown, eye/face protection, and respiratory protection.",
    note: "Add the respiratory protection omitted from the current NIOSH spill-cleanup PPE set.",
  }),
  setValue({
    id: ppe14,
    path: ["rationale", "byChoice", 4, "zh"],
    before: "化疗防护双层手套和防护衣可减少清理时的皮肤暴露；有飞溅风险时还需眼面防护。",
    after: "当前 NIOSH 泄漏清理指南要求使用化疗防护双层手套、防护衣、眼面防护和呼吸防护。",
  }),
  setValue({
    id: ppe14,
    path: ["bowtie", "actions", "tokens", { id: "a2" }, "en"],
    before: "Don chemotherapy-rated double gloves and an impermeable gown; add eye/face protection for splash risk",
    after: "Don double chemotherapy gloves, an impermeable gown, eye/face protection, and the plan-specified respirator",
  }),
  setValue({
    id: ppe14,
    path: ["bowtie", "actions", "tokens", { id: "a2" }, "zh"],
    before: "穿戴化疗防护双层手套和不渗透防护衣；有飞溅风险时加眼面防护",
    after: "穿戴化疗防护双层手套、不渗透防护衣、眼面防护及流程规定的呼吸防护",
  }),
  setValue({
    id: ppe14,
    path: ["meta", "source"],
    before: "NIOSH Alert: Preventing Occupational Exposures to Antineoplastic and Other Hazardous Drugs in Health Care Settings, DHHS (NIOSH) Publication 2004-165, spill control and PPE sections, https://www.cdc.gov/niosh/docs/2004-165/",
    after: "NIOSH, Managing Hazardous Drug Exposures: Information for Healthcare Settings, DHHS Publication 2023-130, spill-cleanup controls and PPE table, https://www.cdc.gov/niosh/docs/2023-130/2023-130.pdf; OSHA, Controlling Occupational Exposure to Hazardous Drugs, immediate soap-and-water cleansing after direct skin contact, https://www.osha.gov/hazardous-drugs/controlling-occex",
    note: "Use the current NIOSH spill PPE table and an exact occupational skin-decontamination source.",
  }),
  setValue({
    id: dialysis17,
    path: ["stem"],
    before: {
      en: "A client is 2 weeks post creation of a left forearm arteriovenous access and reports worsening hand symptoms during hemodialysis. Highlight the findings that support dialysis access–associated distal ischemia and require urgent vascular evaluation.",
      zh: "一名患者左前臂建立动静脉通路后 2 周，在血液透析期间出现逐渐加重的手部症状。请标出支持“透析通路相关远端缺血”并需要紧急血管评估的发现。",
    },
    after: {
      en: "A client is 2 weeks post creation of a left forearm arteriovenous access and reports worsening hand symptoms during hemodialysis. Highlight the findings that support dialysis access–associated distal ischemia and require prompt vascular evaluation.",
      zh: "一名患者左前臂建立动静脉通路后 2 周，在血液透析期间出现逐渐加重的手部症状。请标出支持“透析通路相关远端缺血”并需要尽快进行血管评估的发现。",
    },
    note: "Align urgency language with the KDOQI tool's early-referral lane for symptoms during dialysis without rest pain or tissue loss.",
  }),
  setValue({
    id: dialysis17,
    path: ["meta", "source"],
    before: "National Kidney Foundation, KDOQI Clinical Practice Guideline for Vascular Access: 2019 Update, section on AV access steal syndrome/dialysis access–associated hand ischemia, https://www.ajkd.org/article/S0272-6386(19)31137-0/fulltext",
    after: "National Kidney Foundation, KDOQI Vascular Access Guideline Implementation Tool, Management of Steal or AV Access-related Hand Ischemia, symptoms, examination findings, severity grading, and early/urgent referral lanes, https://www.kidney.org/sites/default/files/vait-18_management_of_steal_or_av_access-related_hand_ischemia.pdf",
    note: "Point directly to the open KDOQI implementation tool supporting every selected cue and the referral wording.",
  }),
  setValue({
    id: fetal18,
    path: ["meta", "source"],
    before: "ACOG Clinical Practice Update, Update on Criteria for Suspected Diagnosis of Intraamniotic Infection (2024), and NICHD fetal heart rate nomenclature, https://www.acog.org/clinical/clinical-guidance/clinical-practice-update/articles/2024/06/update-on-criteria-for-suspected-diagnosis-of-intraamniotic-infection",
    after: "American College of Obstetricians and Gynecologists, Committee Opinion No. 712, Intrapartum Management of Intraamniotic Infection, July 2024 diagnostic update and reaffirmed 2025 recommendations for intrapartum antibiotics, https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/08/intrapartum-management-of-intraamniotic-infection; Macones GA et al., 2008 NICHD Workshop Report on Electronic Fetal Monitoring, baseline tachycardia nomenclature, DOI: 10.1097/AOG.0b013e3181841395",
    note: "Use the current combined ACOG diagnostic/management page and add the exact fetal-baseline nomenclature source.",
  }),
]);
