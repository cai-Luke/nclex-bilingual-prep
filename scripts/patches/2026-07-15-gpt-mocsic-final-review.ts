/** Final checker-oriented polish for the 2026-07-15 GPT MOC/SIC raw batch. */
import { setValue, runPatch } from "../patch-raw";

const advocacy1 = "gpt_mocsic_2026_07_15_bt_client_advocacy_01";
const advocacy2 = "gpt_mocsic_2026_07_15_sa_client_advocacy_02";
const advocacy3 = "gpt_mocsic_2026_07_15_mx_client_advocacy_03";
const conflict4 = "gpt_mocsic_2026_07_15_fb_conflict_resolution_04";
const conflict5 = "gpt_mocsic_2026_07_15_bt_conflict_resolution_05";
const conflict6 = "gpt_mocsic_2026_07_15_hl_conflict_resolution_06";
const hipaa7 = "gpt_mocsic_2026_07_15_bt_confidentiality_hipaa_07";
const hipaa8 = "gpt_mocsic_2026_07_15_or_confidentiality_hipaa_08";
const ppe12 = "gpt_mocsic_2026_07_15_sa_ppe_sterile_technique_12";
const hygiene13 = "gpt_mocsic_2026_07_15_bt_standard_precautions_hygiene_13";
const hygiene15 = "gpt_mocsic_2026_07_15_hl_standard_precautions_hygiene_15";
const disaster16 = "gpt_mocsic_2026_07_15_hl_disaster_emergency_preparedness_16";
const disaster17 = "gpt_mocsic_2026_07_15_fb_disaster_emergency_preparedness_17";
const disaster18 = "gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18";

runPatch([
  setValue({
    id: advocacy1,
    path: ["meta", "source"],
    before: "American Nurses Association, Code of Ethics for Nurses, Provision 3: The nurse establishes a trusting relationship and advocates for the rights, health, and safety of recipients of nursing care, https://codeofethics.ana.org/provisions",
    after: "American Nurses Association, 2025 Code of Ethics for Nurses, Provision 3.2 (Advocating for Persons Who Receive Nursing Care), discussion of informed consent free from undue influence, https://codeofethics.ana.org/provision-3-2; American Nurses Association, Provision 1.4 (The Right to Self-Determination), https://codeofethics.ana.org/provision-1-4",
    note: "Replace the topic-level ethics page with the provisions supporting voluntariness and self-determination.",
  }),
  setValue({
    id: advocacy2,
    path: ["meta", "source"],
    before: "American Nurses Association, Code of Ethics for Nurses, Provision 3: The nurse establishes a trusting relationship and advocates for the rights, health, and safety of recipients of nursing care, https://codeofethics.ana.org/provisions",
    after: "U.S. Department of Justice, Access to Medical Care for Individuals with Mobility Disabilities, accessible examination equipment, lift transfers, trained assistance, and equal access to care, https://www.ada.gov/resources/medical-care-mobility/",
    note: "Use the exact federal accessibility guidance supporting the load-bearing transfer and access rules.",
  }),
  setValue({
    id: advocacy3,
    path: ["rationale", "correct"],
    before: {
      en: "Custody does not erase the client's right to respectful, confidential, clinically appropriate care. The nurse should communicate directly with the client, limit nonclinical observers when feasible, explain necessary restraints and advocate for reassessment, and avoid disclosing unrelated health information.",
      zh: "被羁押并不会取消患者获得尊重、保密和适当临床护理的权利。护士应直接与患者沟通，在可行时限制无临床需要的旁观者，解释必要约束并倡导重新评估，不应披露无关健康信息。",
    },
    after: {
      en: "Custody does not erase the capable client's autonomy, privacy, or right to clinically appropriate care. The nurse should communicate directly with the client, limit nonclinical observers when feasible, document the client's own treatment preferences, and avoid disclosing unrelated health information.",
      zh: "被羁押并不会取消有决策能力患者的自主权、隐私权或获得适当临床护理的权利。护士应直接与患者沟通，在可行时限制无临床需要的旁观者，记录患者本人的治疗意愿，并避免披露无关健康信息。",
    },
    note: "Remove the ambiguous assumption that a custodial restraint necessarily has a clinical indication.",
  }),
  setValue({
    id: advocacy3,
    path: ["rationale", "byChoice", 2],
    before: {
      refId: "r3",
      en: "Explaining and reassessing restraints supports the least-restrictive approach.",
      zh: "解释并重新评估约束有助于采用限制最少的方式。",
    },
    after: {
      refId: "r3",
      en: "Documenting the capable client's own preferences preserves the client as the source of treatment decisions.",
      zh: "记录有决策能力患者本人的意愿，可确保治疗决定以患者选择为准。",
    },
  }),
  setValue({
    id: advocacy3,
    path: ["matrix", "rows", { id: "r3" }],
    before: {
      id: "r3",
      en: "Explain the clinical reason for any restraint and request reassessment when it may no longer be needed",
      zh: "解释任何约束的临床原因，并在可能不再需要时要求重新评估",
    },
    after: {
      id: "r3",
      en: "Document the capable client's own treatment preferences in the care plan",
      zh: "在护理计划中记录有决策能力患者本人的治疗意愿",
    },
  }),
  setValue({
    id: advocacy3,
    path: ["glossary", 1],
    before: {
      termEn: "least restrictive",
      termZh: "限制最少原则",
      defZh: "在达到安全目标的前提下使用最少限制",
    },
    after: {
      termEn: "decision-making capacity",
      termZh: "决策能力",
      defZh: "理解相关信息并作出和表达医疗决定的能力",
    },
  }),
  setValue({
    id: advocacy3,
    path: ["meta", "source"],
    before: "American Nurses Association, Code of Ethics for Nurses, Provision 3: The nurse establishes a trusting relationship and advocates for the rights, health, and safety of recipients of nursing care, https://codeofethics.ana.org/provisions",
    after: "American Nurses Association, 2025 Code of Ethics for Nurses, Provision 1.4 (The Right to Self-Determination), https://codeofethics.ana.org/provision-1-4; Provision 3.1 (Privacy and Confidentiality), https://codeofethics.ana.org/provision-3-1; U.S. Department of Health and Human Services, HIPAA disclosures involving individuals in lawful custody, https://www.hhs.gov/hipaa/for-professionals/faq/2073/may-covered-entity-collect-use-disclose-criminal-data-under-hipaa.html",
  }),
  setValue({
    id: conflict4,
    path: ["meta", "source"],
    before: "AHRQ TeamSTEPPS 3.0, Mutual Support and Conflict Resolution tools, https://www.ahrq.gov/teamstepps-program/curriculum/mutual/index.html",
    after: "Agency for Healthcare Research and Quality, TeamSTEPPS 3.0, Mutual Support overview (Two-Challenge Rule and chain-of-command escalation), https://www.ahrq.gov/teamstepps-program/curriculum/mutual/overview/index.html",
  }),
  setValue({
    id: conflict5,
    path: ["stem"],
    before: {
      en: "A medical-surgical unit receives a float nurse from an ambulatory clinic. The charge nurse assigns the float nurse two clients receiving titrated vasoactive infusions. The float nurse says, “I have never managed these infusions.” Another nurse replies, “Everyone is busy; just take them.” Voices rise, and the assignment remains unresolved. Complete the bow-tie diagram.",
      zh: "内外科病区接收一名来自门诊的支援护士。责任护士安排其照护两名正在接受需滴定血管活性药输注的患者。支援护士说：“我从未管理过这些输注。”另一名护士回答：“大家都很忙，你就接吧。”双方声音越来越大，分配仍未解决。完成蝴蝶结图。",
    },
    after: {
      en: "A physical therapist arrives to ambulate a postoperative client. The bedside nurse reports that the client became dizzy and nearly fell when standing 10 minutes earlier. The therapist points to the existing ambulation order and says delaying will impede recovery; the nurse responds, “You never listen to nursing.” Voices rise, the client remains seated, and the plan is unresolved. Facility policy requires a new bedside safety assessment after symptoms during mobility and agreement on readiness criteria before another attempt. Complete the bow-tie diagram.",
      zh: "物理治疗师前来协助一名术后患者下床行走。床旁护士报告，患者在 10 分钟前站立时出现头晕，险些跌倒。治疗师指着现有的行走医嘱说，延迟活动会妨碍康复；护士回应：“你从来不听护理人员的意见。”双方声音越来越大，患者仍坐着，计划尚未解决。机构政策要求患者在活动中出现症状后重新进行床旁安全评估，并在再次尝试前就可活动标准达成一致。完成蝴蝶结图。",
    },
    note: "Replace a material collision with an existing unsafe float-assignment/vasoactive-infusion item.",
  }),
  setValue({
    id: conflict5,
    path: ["rationale"],
    before: {
      correct: {
        en: "The central problem is an unresolved assignment conflict involving a competency mismatch. A structured huddle and competency-based reassignment address both safety and conflict. Client acuity and the float nurse's verified competencies are the key parameters.",
        zh: "核心问题是尚未解决的工作分配冲突，并伴有能力不匹配。结构化团队沟通和基于能力的重新分配可同时处理安全与冲突。患者病情严重度和支援护士经核实的能力是关键指标。",
      },
      byChoice: [
        { refId: "c1", en: "The stated lack of experience with titrated vasoactive infusions identifies a competency-assignment mismatch.", zh: "明确表示没有管理需滴定血管活性药输注的经验，提示能力与分配不匹配。" },
        { refId: "c2", en: "The conflict is not merely a personality issue because the assignment carries a concrete safety mismatch.", zh: "这不只是性格冲突，因为分配存在具体安全不匹配。" },
        { refId: "c3", en: "There is no cue that the float nurse is refusing all work.", zh: "没有线索表明支援护士拒绝所有工作。" },
        { refId: "a1", en: "A brief structured huddle moves the discussion from accusation to shared safety facts.", zh: "简短结构化沟通可把讨论从指责转向共同关注的安全事实。" },
        { refId: "a2", en: "Reassigning according to verified competency protects clients while preserving a workable assignment.", zh: "依据经核实的能力重新分配可保护患者并维持可执行的安排。" },
        { refId: "a3", en: "Ordering acceptance suppresses a valid safety concern.", zh: "命令其接受会压制合理的安全担忧。" },
        { refId: "a4", en: "Documenting insubordination before resolving the assignment escalates blame and delays safety action.", zh: "在解决分配前先记录违抗，会加剧指责并延误安全行动。" },
        { refId: "p1", en: "Acuity determines which clients require specialized monitoring and rapid titration.", zh: "病情严重度决定哪些患者需要专业监测和快速滴定。" },
        { refId: "p2", en: "Verified competencies determine a safe assignment for the float nurse.", zh: "经核实的能力决定支援护士可安全承担的工作。" },
        { refId: "p3", en: "Seniority does not substitute for competency with the assigned therapy.", zh: "资历不能替代对所分配治疗的实际能力。" },
        { refId: "p4", en: "Preference for a particular hallway is not the safety-driving parameter.", zh: "对某个走廊的偏好不是决定安全的指标。" },
      ],
    },
    after: {
      correct: {
        en: "The central problem is unresolved informational conflict about whether current assessment findings support safe mobilization. A brief huddle using the new findings and an agreed reassessment plan address both safety and teamwork. Current symptoms and a shared, closed-loop plan are the key parameters.",
        zh: "核心问题是：当前评估结果是否支持安全活动这一信息性冲突尚未解决。利用新评估结果进行简短团队沟通，并就重新评估计划达成一致，可同时处理安全与团队协作。当前症状以及经过闭环确认的共同计划是关键指标。",
      },
      byChoice: [
        { refId: "c1", en: "The clinicians are using different information to judge whether the care plan can proceed safely, which is informational conflict.", zh: "两名临床人员依据不同信息判断护理计划能否安全实施，属于信息性冲突。" },
        { refId: "c2", en: "The raised voices add interpersonal tension, but the unresolved task-related safety information is the primary problem.", zh: "声音升高增加了人际紧张，但主要问题仍是与任务相关的安全信息尚未解决。" },
        { refId: "c3", en: "The client has not refused rehabilitation; the team has not yet agreed that another attempt is safe.", zh: "患者并未拒绝康复；是团队尚未就再次尝试是否安全达成一致。" },
        { refId: "a1", en: "Pausing and huddling lets the team replace accusation with the client's current safety data.", zh: "暂停活动并进行团队沟通，可使团队用患者当前的安全数据取代相互指责。" },
        { refId: "a2", en: "Assigning the reassessment and agreeing on readiness criteria creates an actionable shared plan.", zh: "明确由谁重新评估并商定可活动标准，可形成可执行的共同计划。" },
        { refId: "a3", en: "An existing order does not erase the new symptoms or the inline reassessment policy.", zh: "现有医嘱不能忽略新出现的症状，也不能取代题干中的重新评估政策。" },
        { refId: "a4", en: "Filing a complaint first does not resolve the client's immediate mobility plan.", zh: "先提出投诉不能解决患者当前的活动计划。" },
        { refId: "p1", en: "Current symptoms and reassessment findings determine whether another attempt meets the stated policy.", zh: "当前症状和重新评估结果决定再次尝试是否符合题干政策。" },
        { refId: "p2", en: "A shared plan and closed-loop role confirmation show that both clinicians know the next safe step.", zh: "共同计划和闭环角色确认表明两名临床人员都清楚下一项安全步骤。" },
        { refId: "p3", en: "The original order is relevant background but cannot substitute for reassessment after the new symptoms.", zh: "原医嘱是相关背景，但不能替代出现新症状后的重新评估。" },
        { refId: "p4", en: "Each clinician's usual workflow does not resolve the case-specific safety question.", zh: "各自惯常的工作方式不能解决本病例的具体安全问题。" },
      ],
    },
  }),
  setValue({
    id: conflict5,
    path: ["testTakingStrategy"],
    before: {
      en: "In assignment conflicts, separate the interpersonal heat from the objective safety variable: competency matched to acuity.",
      zh: "在工作分配冲突中，应把人际情绪与客观安全变量分开：让能力与病情严重度匹配。",
    },
    after: {
      en: "When voices rise, identify the task-related information that remains unresolved, then choose actions that create a shared, checkable plan.",
      zh: "当双方声音升高时，先找出尚未解决的任务相关信息，再选择能形成共同且可核实计划的措施。",
    },
  }),
  setValue({
    id: conflict5,
    path: ["glossary"],
    before: [
      { termEn: "float nurse", termZh: "支援护士", defZh: "临时到非固定病区工作的护士" },
      { termEn: "competency", termZh: "胜任能力", defZh: "安全完成特定任务所需的知识和技能" },
    ],
    after: [
      { termEn: "informational conflict", termZh: "信息性冲突", defZh: "因对任务相关事实、观点或方案理解不同而产生的分歧" },
      { termEn: "huddle", termZh: "临时团队沟通", defZh: "为更新情况并调整当前计划而进行的简短团队会议" },
    ],
  }),
  setValue({
    id: conflict5,
    path: ["meta", "source"],
    before: "AHRQ TeamSTEPPS 3.0, Mutual Support and Conflict Resolution tools, https://www.ahrq.gov/teamstepps-program/curriculum/mutual/index.html",
    after: "Agency for Healthcare Research and Quality, TeamSTEPPS 3.0, Conflict in Teams (informational conflict), https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/conflict.html; Team Leadership overview (huddles and shared plans), https://www.ahrq.gov/teamstepps-program/curriculum/team/overview/index.html",
  }),
  setValue({
    id: conflict5,
    path: ["bowtie"],
    before: {
      condition: {
        prompt: { en: "Primary problem", zh: "主要问题" },
        tokens: [
          { id: "c1", en: "Unresolved assignment conflict with a competency mismatch", zh: "能力不匹配导致的未解决工作分配冲突" },
          { id: "c2", en: "A personality conflict without a safety issue", zh: "不涉及安全问题的性格冲突" },
          { id: "c3", en: "Refusal by the float nurse to accept any clients", zh: "支援护士拒绝接收任何患者" },
        ],
        correct: "c1",
      },
      actions: {
        prompt: { en: "Actions to take", zh: "应采取的措施" },
        tokens: [
          { id: "a1", en: "Hold a brief structured huddle focused on the safety concern", zh: "围绕安全担忧进行简短结构化沟通" },
          { id: "a2", en: "Reassign clients according to verified competencies", zh: "根据经核实的能力重新分配患者" },
          { id: "a3", en: "Direct the float nurse to accept the assignment without further discussion", zh: "要求支援护士不再讨论并接受分配" },
          { id: "a4", en: "Begin disciplinary documentation before changing the assignment", zh: "在调整分配前先开始纪律记录" },
        ],
        correct: ["a1", "a2"],
      },
      parameters: {
        prompt: { en: "Parameters to verify", zh: "需要核实的指标" },
        tokens: [
          { id: "p1", en: "Acuity and therapy needs of the assigned clients", zh: "所分配患者的病情严重度和治疗需求" },
          { id: "p2", en: "The float nurse's documented competencies", zh: "支援护士记录在案的胜任能力" },
          { id: "p3", en: "Which nurse has worked at the facility longest", zh: "哪名护士在本机构工作时间最长" },
          { id: "p4", en: "Which hallway the float nurse prefers", zh: "支援护士偏好哪个走廊" },
        ],
        correct: ["p1", "p2"],
      },
    },
    after: {
      condition: {
        prompt: { en: "Primary problem", zh: "主要问题" },
        tokens: [
          { id: "c1", en: "Unresolved informational conflict about safe mobilization", zh: "关于安全活动的未解决信息性冲突" },
          { id: "c2", en: "An interpersonal conflict without a client-safety issue", zh: "不涉及患者安全问题的人际冲突" },
          { id: "c3", en: "Client refusal of postoperative rehabilitation", zh: "患者拒绝术后康复" },
        ],
        correct: "c1",
      },
      actions: {
        prompt: { en: "Actions to take", zh: "应采取的措施" },
        tokens: [
          { id: "a1", en: "Pause ambulation and hold a brief huddle using the current assessment data", zh: "暂停行走，并利用当前评估数据进行简短团队沟通" },
          { id: "a2", en: "Agree who will reassess the client and which findings permit another attempt", zh: "明确由谁重新评估，并商定哪些结果允许再次尝试" },
          { id: "a3", en: "Proceed solely because the original ambulation order remains active", zh: "仅因原行走医嘱仍有效就继续活动" },
          { id: "a4", en: "File a conduct complaint before resolving the current mobility plan", zh: "在解决当前活动计划前先提出行为投诉" },
        ],
        correct: ["a1", "a2"],
      },
      parameters: {
        prompt: { en: "Parameters to verify", zh: "需要核实的指标" },
        tokens: [
          { id: "p1", en: "The client's current symptoms and reassessment findings", zh: "患者当前症状和重新评估结果" },
          { id: "p2", en: "The shared plan and closed-loop confirmation of roles", zh: "共同计划以及对角色的闭环确认" },
          { id: "p3", en: "The original mobility order without the new assessment", zh: "未结合新评估结果的原活动医嘱" },
          { id: "p4", en: "Each clinician's preferred usual workflow", zh: "每名临床人员偏好的惯常工作方式" },
        ],
        correct: ["p1", "p2"],
      },
    },
  }),
  setValue({
    id: conflict6,
    path: ["meta", "source"],
    before: "AHRQ TeamSTEPPS 3.0, Mutual Support and Conflict Resolution tools, https://www.ahrq.gov/teamstepps-program/curriculum/mutual/index.html",
    after: "Agency for Healthcare Research and Quality, TeamSTEPPS 3.0, Tool: DESC (describe objectively, express concerns, suggest alternatives, seek agreement), https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/desc.html",
  }),
  setValue({
    id: hipaa7,
    path: ["stem"],
    before: {
      en: "During bedside shift report in a semiprivate room, the nurse discusses a client's new cancer diagnosis and genetic test results in a normal speaking voice. The roommate's visitors are seated a few feet away and can hear the report. The curtain is closed, but no effort is made to limit what is said or who can hear it. Complete the bow-tie diagram.",
      zh: "在半私密病房进行床旁交班时，护士以正常音量讨论一名患者的新发癌症诊断和基因检测结果。室友的访客坐在几英尺外，能够听到交班内容。虽然拉上了帘子，但没有采取措施限制谈话内容或听众。完成蝴蝶结图。",
    },
    after: {
      en: "During bedside shift report in a semiprivate room, the nurse discusses a client's new cancer diagnosis and genetic test results in a normal speaking voice. The roommate's visitors are seated a few feet away and can hear the report. The curtain is closed, but no effort is made to limit what is said or who can hear it. Facility policy requires suspected privacy incidents to be reported for review. Complete the bow-tie diagram.",
      zh: "在半私密病房进行床旁交班时，护士以正常音量讨论一名患者的新发癌症诊断和基因检测结果。室友的访客坐在几英尺外，能够听到交班内容。虽然拉上了帘子，但没有采取措施限制谈话内容或听众。机构政策要求报告疑似隐私事件以供审查。完成蝴蝶结图。",
    },
    note: "Make the incident-reporting action closed-world.",
  }),
  setValue({
    id: hipaa7,
    path: ["rationale", "byChoice", 5],
    before: { refId: "a3", en: "Speaking faster does not prevent others from hearing protected information.", zh: "说得更快不能阻止他人听到受保护信息。" },
    after: { refId: "a3", en: "A promise from the visitors does not contain or assess a disclosure that has already occurred.", zh: "访客承诺不再传播，不能控制或评估已经发生的披露。" },
  }),
  setValue({
    id: hipaa7,
    path: ["rationale", "byChoice", 6],
    before: { refId: "a4", en: "Continuing because the roommate already knows is unsupported and ignores the visitors.", zh: "因为室友可能已经知道就继续谈话没有依据，也忽略了访客。" },
    after: { refId: "a4", en: "Routine documentation without privacy review does not follow the incident-reporting policy.", zh: "仅作常规记录而不进行隐私审查，不符合题干中的事件报告政策。" },
  }),
  setValue({
    id: hipaa7,
    path: ["rationale", "byChoice", 9],
    before: { refId: "p3", en: "The curtain color has no privacy relevance.", zh: "帘子的颜色与隐私无关。" },
    after: { refId: "p3", en: "Following a usual bedside-handoff workflow does not establish that reasonable safeguards were used in this situation.", zh: "遵循惯常床旁交班流程并不能证明本情境中采取了合理保护措施。" },
  }),
  setValue({
    id: hipaa7,
    path: ["rationale", "byChoice", 10],
    before: { refId: "p4", en: "The client's meal preference does not define the disclosure.", zh: "患者的饮食偏好不能界定此次披露。" },
    after: { refId: "p4", en: "The visitors' claimed level of attention does not define which information was audible or who could hear it.", zh: "访客声称是否留意，并不能界定哪些信息可被听到或谁在可听范围内。" },
  }),
  setValue({
    id: hipaa7,
    path: ["bowtie", "actions", "tokens", { id: "a3" }],
    before: { id: "a3", en: "Continue the report but speak more quickly", zh: "继续交班但说得更快" },
    after: { id: "a3", en: "Ask the visitors to promise not to repeat what they heard", zh: "要求访客承诺不传播所听到的内容" },
  }),
  setValue({
    id: hipaa7,
    path: ["bowtie", "actions", "tokens", { id: "a4" }],
    before: { id: "a4", en: "Continue because the roommate may already know", zh: "因为室友可能已经知道而继续" },
    after: { id: "a4", en: "Document the report as routine and take no further action", zh: "把交班记录为常规事项，不再采取其他措施" },
  }),
  setValue({
    id: hipaa7,
    path: ["bowtie", "parameters", "tokens", { id: "p3" }],
    before: { id: "p3", en: "The color of the privacy curtain", zh: "隐私帘的颜色" },
    after: { id: "p3", en: "Whether the report followed the unit's usual bedside-handoff workflow", zh: "交班是否遵循病区惯常的床旁交班流程" },
  }),
  setValue({
    id: hipaa7,
    path: ["bowtie", "parameters", "tokens", { id: "p4" }],
    before: { id: "p4", en: "The client's meal preference", zh: "患者的饮食偏好" },
    after: { id: "p4", en: "Whether the visitors say they were paying attention", zh: "访客是否声称自己当时在留意交班内容" },
  }),
  setValue({
    id: hipaa7,
    path: ["meta", "source"],
    before: "45 CFR 164.530(c), HIPAA Privacy Rule administrative, technical, and physical safeguards, https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E/section-164.530",
    after: "U.S. Department of Health and Human Services, HIPAA Privacy Rule guidance, Incidental Uses and Disclosures (reasonable safeguards and avoidable disclosures), https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/incidental-uses-and-disclosures/index.html",
  }),
  setValue({
    id: hipaa8,
    path: ["meta", "source"],
    before: "45 CFR 164.530(c), HIPAA Privacy Rule administrative, technical, and physical safeguards, https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E/section-164.530",
    after: "U.S. Department of Health and Human Services Health Sector Cybersecurity Coordination Center, HPH Mobile Device Security Checklist (remote wiping and immediate reporting of lost or stolen devices), https://www.hhs.gov/sites/default/files/hph-mobile-device-security-checklist-tlpclear.pdf",
  }),
  setValue({
    id: ppe12,
    path: ["meta", "source"],
    before: "CDC, Sequence for Putting On Personal Protective Equipment (PPE) and How to Safely Remove PPE, https://www.cdc.gov/hai/pdfs/ppe/ppe-sequence.pdf",
    after: "American Association for Respiratory Care, AARC Clinical Practice Guidelines: Artificial Airway Suctioning (2022), sterile technique for open suctioning, https://www.aarc.org/wp-content/uploads/2022/10/cpg-artificial-airway-suctioning.pdf; CDC, Core Infection Prevention and Control Practices, PPE selected for anticipated exposure, https://www.cdc.gov/infection-control/hcp/core-practices/index.html",
  }),
  setValue({
    id: hygiene13,
    path: ["rationale", "byChoice", 9],
    before: { refId: "p3", en: "The vial's label color does not assess exposure.", zh: "药瓶标签颜色不能评估暴露。" },
    after: { refId: "p3", en: "A preservative does not make reentry with a used syringe safe or identify exposed clients.", zh: "防腐剂不能使已使用注射器再次穿刺变得安全，也不能识别暴露患者。" },
  }),
  setValue({
    id: hygiene13,
    path: ["rationale", "byChoice", 10],
    before: { refId: "p4", en: "The colleague's meal break time is unrelated.", zh: "同事的用餐休息时间与事件无关。" },
    after: { refId: "p4", en: "The labeled expiration date does not determine the scope of exposure after unsafe entry.", zh: "发生不安全穿刺后，标示有效期不能确定暴露范围。" },
  }),
  setValue({
    id: hygiene13,
    path: ["bowtie", "parameters", "tokens", { id: "p3" }],
    before: { id: "p3", en: "The color of the vial label", zh: "药瓶标签颜色" },
    after: { id: "p3", en: "Whether the vial contains a preservative", zh: "药瓶是否含防腐剂" },
  }),
  setValue({
    id: hygiene13,
    path: ["bowtie", "parameters", "tokens", { id: "p4" }],
    before: { id: "p4", en: "The colleague's scheduled meal break", zh: "同事计划的用餐休息时间" },
    after: { id: "p4", en: "Whether the vial remains within its labeled expiration date", zh: "药瓶是否仍在标示有效期内" },
  }),
  setValue({
    id: hygiene15,
    path: ["stem"],
    before: {
      en: "Review the medication-preparation note. Highlight the actions that break standard precautions or safe medication-preparation practice.",
      zh: "查看配药记录。突出显示违反标准预防或安全配药操作的行为。",
    },
    after: {
      en: "Review the medication-preparation and administration note. Highlight the actions that break standard precautions or safe medication practice.",
      zh: "查看配药与给药记录。突出显示违反标准预防或安全用药操作的行为。",
    },
  }),
  setValue({
    id: hygiene15,
    path: ["rationale", "correct"],
    before: {
      en: "Preparing medication in a clean area and disinfecting a vial stopper are appropriate. Handling a phone with gloved hands and returning to preparation, carrying an uncapped needle, and storing medication beside a sink create contamination or sharps risks.",
      zh: "在清洁区域配药并消毒药瓶塞是适当做法。戴手套操作手机后继续配药、携带未加保护帽的针头以及在水槽旁存放药物都会造成污染或锐器风险。",
    },
    after: {
      en: "Preparing medication in a clean area and disinfecting a vial stopper are appropriate. Handling a phone with gloved hands and returning to preparation, recapping a used needle with two hands, and storing medication beside a sink create contamination or sharps risks.",
      zh: "在清洁区域配药并消毒药瓶塞是适当做法。戴手套操作手机后继续配药、用双手回套已使用针头，以及在水槽旁存放药物都会造成污染或锐器风险。",
    },
  }),
  setValue({
    id: hygiene15,
    path: ["rationale", "byChoice", 3],
    before: { refId: "s5", en: "Walking with an uncapped needle creates a preventable sharps hazard.", zh: "携带未加保护帽的针头行走会造成可预防的锐器危险。" },
    after: { refId: "s5", en: "Two-handed recapping of a used needle is a prohibited work practice that increases sharps-injury risk.", zh: "用双手回套已使用针头属于禁止的操作，会增加锐器伤风险。" },
  }),
  setValue({
    id: hygiene15,
    path: ["highlight", "segments", { id: "s5" }],
    before: { id: "s5", en: "The nurse walks across the room carrying an uncapped needle.", zh: "护士手持未加保护帽的针头走过房间。", selectable: true },
    after: { id: "s5", en: "After giving the injection, the nurse recaps the used needle with two hands before walking to the sharps container.", zh: "给药后，护士在走向锐器盒前用双手回套已使用的针头。", selectable: true },
  }),
  setValue({
    id: hygiene15,
    path: ["meta", "source"],
    before: "CDC, Preventing Unsafe Injection Practices, https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html",
    after: "CDC, Preventing Unsafe Injection Practices, https://www.cdc.gov/injection-safety/hcp/clinical-safety/index.html; Occupational Safety and Health Administration, Bloodborne Pathogens Standard, 29 CFR 1910.1030(d)(2)(vii), prohibition on contaminated-needle recapping except narrow exceptions and prohibition on two-handed recapping, https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1030",
  }),
  setValue({
    id: disaster16,
    path: ["rationale", "correct"],
    before: {
      en: "The ventilated client nearest the smoke is in immediate danger and must not be left behind. Propping a smoke door open defeats compartmentation, using an elevator violates policy, and beginning vertical evacuation before horizontal relocation reverses the stated sequence. Moving an ambulatory client beyond the smoke barrier is appropriate.",
      zh: "离烟雾最近的机械通气患者处于直接危险中，不能被留在原处。撑开防烟门会破坏分区，使用电梯违反政策，在完成水平疏散前开始垂直疏散颠倒了题干顺序。将能行走的患者转移到防烟屏障之外是适当的。",
    },
    after: {
      en: "The ventilated client nearest the smoke is in immediate danger and must not be left behind. Using an elevator violates policy, and beginning vertical evacuation before horizontal relocation reverses the stated sequence. Closing the smoke-compartment door after passage and moving an ambulatory client beyond the smoke barrier are appropriate.",
      zh: "离烟雾最近的机械通气患者处于直接危险中，不能被留在原处。使用电梯违反政策，在完成水平疏散前开始垂直疏散颠倒了题干顺序。人员通过后确认防烟分区门关闭，以及将能行走的患者转移到防烟屏障之外，均为适当做法。",
    },
  }),
  setValue({
    id: disaster16,
    path: ["rationale", "byChoice", 2],
    before: { refId: "s4", en: "Propping the door open allows smoke spread and defeats compartmentation.", zh: "撑开门会使烟雾扩散并破坏分区。" },
    after: { refId: "s4", en: "Verifying that the smoke-compartment door closes after passage is consistent with the containment policy.", zh: "人员通过后确认防烟分区门关闭，符合控制烟雾的政策。" },
  }),
  setValue({
    id: disaster16,
    path: ["highlight", "segments", { id: "s4" }],
    before: { id: "s4", en: "Another staff member props one smoke door open for easier traffic.", zh: "另一名工作人员为方便通行把一扇防烟门撑开。", selectable: true },
    after: { id: "s4", en: "Another staff member verifies that the smoke-compartment door closes after the evacuation group passes.", zh: "另一名工作人员在疏散小组通过后确认防烟分区门关闭。", selectable: true },
    note: "Remove a local motif collision with an existing fire-door item while preserving the broader evacuation task.",
  }),
  setValue({
    id: disaster16,
    path: ["highlight", "correct"],
    before: ["s2", "s4", "s5", "s7"],
    after: ["s2", "s5", "s7"],
  }),
  setValue({
    id: disaster16,
    path: ["meta", "source"],
    before: "Centers for Medicare & Medicaid Services, Emergency Preparedness Rule, 42 CFR 482.15, https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.15",
    after: "ASPR TRACIE, St. Louis Hospital Evacuation and Transportation Plan, definitions and use of immediate-danger, horizontal, vertical, and smoke-compartment evacuation, https://files.asprtracie.hhs.gov/documents/st-louis-hospital-evacuation-and-transportation-plan-508.pdf; exact sequence and elevator restriction are supplied by the facility policy in the item",
  }),
  setValue({
    id: disaster17,
    path: ["meta", "source"],
    before: "Centers for Medicare & Medicaid Services, Emergency Preparedness Rule, 42 CFR 482.15, https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.15",
    after: "ASPR TRACIE, St. Louis Hospital Evacuation and Transportation Plan, vertical evacuation defined as movement to a different floor within the facility, https://files.asprtracie.hhs.gov/documents/st-louis-hospital-evacuation-and-transportation-plan-508.pdf",
  }),
  setValue({
    id: disaster18,
    path: ["rationale", "correct"],
    before: {
      en: "Before an authenticated all-clear, the unit follows secure-in-place actions and does not open the door for an unverified voice. After the all-clear, staff transition to clinical triage in the designated safe area.",
      zh: "在收到经验证的解除警报前，病区应执行就地防护措施，不因未经核实的声音而开门。解除警报后，工作人员转入指定安全区域开展临床分诊。",
    },
    after: {
      en: "Before an authenticated all-clear, the unit follows secure-in-place actions and does not open the door for an unverified voice. After the all-clear, staff transition to clinical triage in the designated safe area; resuming routine operations would skip the plan's post-event response.",
      zh: "在收到经验证的解除警报前，病区应执行就地防护措施，不因未经核实的声音而开门。解除警报后，工作人员转入指定安全区域开展临床分诊；直接恢复常规运行会跳过计划规定的事件后应对。",
    },
  }),
  setValue({
    id: disaster18,
    path: ["dropdowns", { id: "2" }, "options", { id: "o3" }],
    before: { id: "o3", en: "discard the emergency plan", zh: "丢弃应急计划" },
    after: { id: "o3", en: "resume routine unit operations without reporting to the designated safe area", zh: "不前往指定安全区域报到，直接恢复病区常规运行" },
  }),
  setValue({
    id: disaster18,
    path: ["meta", "source"],
    before: "Cybersecurity and Infrastructure Security Agency, Active Shooter Preparedness, https://www.cisa.gov/topics/physical-security/active-shooter-preparedness",
    after: "Cybersecurity and Infrastructure Security Agency, Hospitals and Healthcare Facilities Security Action Guide, lockdown, safe-location, patient-security, and device-silencing guidance, https://www.cisa.gov/sites/default/files/publications/19_0515_cisa_action-guide-hospitals-and-healthcare.pdf; the authenticated all-clear and post-event sequence are supplied by the facility plan in the item",
  }),
]);
