export type RepairChange = {
  id: string;
  path: Array<string | number | { id: string } | { refId: string }>;
  after: string;
  note: string;
};

export const repairChanges: RepairChange[] = [];

const add = (id: string, path: RepairChange["path"], after: string, note: string) => repairChanges.push({ id, path, after, note });
const pair = (id: string, path: RepairChange["path"], en: string, zh: string, note: string) => {
  add(id, [...path, "en"], en, `${note} (EN)`);
  add(id, [...path, "zh"], zh, `${note} (ZH)`);
};
const token = (id: string, zone: "condition" | "actions" | "parameters", tokenId: string, en: string, zh: string, note: string) => pair(id, ["bowtie", zone, "tokens", { id: tokenId }], en, zh, note);
const rationale = (id: string, refId: string, en: string, zh: string, note: string) => pair(id, ["rationale", "byChoice", { refId }], en, zh, note);

// 1. Caregiver role strain / dementia.
{
  const id = "gpt_case_caregiver_role_strain_dementia_01_bowtie";
  add(id, ["stem", "en"], "At the end of the initial home-health visit, Margaret has moderate dementia with worsening wandering, stove-use risk, weight loss, incontinence-related skin irritation, a recent unreported fall, medication-administration problems, and bedtime diphenhydramine use. Diane is the sole caregiver and reports severe sleep deprivation, weight loss, missed work, guilt, and fear of being judged. She raised her voice during an episode of agitation but did not strike, shove, threaten, or physically restrain Margaret, and she voluntarily requested home-health help. Complete the bow-tie by selecting the most likely condition, two priority actions, and two parameters to monitor.", "Pair the Chinese naturalization with a semantically identical English wording cleanup.");
  add(id, ["stem", "zh"], "初次居家护理访视结束时，Margaret 有中度痴呆，并出现走失加重、炉灶使用风险、体重下降、失禁相关皮肤刺激、近期未报告跌倒、给药困难以及睡前使用苯海拉明。Diane 是唯一照护者，报告严重睡眠剥夺、体重下降、误工、内疚和害怕被评判。她在激动发作中提高了音量，但没有打、推、威胁或身体限制 Margaret，并且主动请求居家护理帮助。请完成弓形题：选择最可能状况、两个优先行动和两个需要监测的参数。", "Naturalize mixed-language Chinese stem without changing facts.");
  token(id, "condition", "bt_cond_immediate_removal", "Caregiver stress without functional impairment or safety consequences", "不伴功能受损或安全后果的照护压力", "Remove unsupported immediate-removal premise while retaining a plausible lower-severity alternative.");
  token(id, "actions", "bt_act_resource_list_first", "Immediately list community resources without first validating Diane's distress.", "不先接纳 Diane 的痛苦，而是立即列出社区资源。", "Remove sibling-only quoted statement.");
  token(id, "actions", "bt_act_secure_home", "Mitigate immediate hazards with nonrestrictive wandering safeguards and prevent unsupervised stove access today.", "今天采用非限制性走失防护措施，并防止无人看护时接触炉灶，以减轻即时危险。", "Generalize keyed safety action to facts in the standalone stem.");
  token(id, "actions", "bt_act_report_diphenhydramine", "Contact the primary care provider to review bedtime diphenhydramine use and evaluate safer sleep options.", "联系初级保健医生复核睡前苯海拉明使用情况，并评估更安全的睡眠方案。", "Remove overclaimed causation while preserving provider-review action.");
  token(id, "actions", "bt_act_accuse_diane", "Accuse Diane of intentional abuse based only on her raised voice.", "仅根据 Diane 提高音量就指责她故意虐待。", "Remove sibling-only chair barricade.");
  token(id, "parameters", "bt_par_home_mods", "Completion of individualized home-safety changes addressing wandering, stove use, falls, and medication access", "针对走失、炉灶使用、跌倒和药物取用的个体化居家安全改造完成情况", "Replace sibling-specific modification checklist with standalone risks.");
  token(id, "parameters", "bt_par_caregiver_status", "Diane's sleep, appetite and weight, ability to work, and engagement with caregiver support and personal health follow-up", "Diane 的睡眠、食欲和体重、工作能力，以及参与照护者支持和自身健康随访的情况", "Remove presupposed referrals, enrollment, and scheduled follow-up.");
  rationale(id, "bt_cond_immediate_removal", "The stem shows severe sleep deprivation, weight loss, missed work, and safety strain, so describing this as stress without impairment or safety consequences understates the problem.", "题干显示严重睡眠剥夺、体重下降、误工和安全压力，因此将其描述为不伴功能受损或安全后果的压力低估了问题。", "Make lower-severity distractor rankable from standalone facts.");
  rationale(id, "bt_act_secure_home", "Wandering and stove access are immediate safety threats that require same-day, nonrestrictive risk reduction.", "走失和炉灶接触是即时安全威胁，需要当天采用非限制性措施降低风险。", "Remove barricade and supervision-change imports.");
  rationale(id, "bt_act_report_diphenhydramine", "Bedtime diphenhydramine use should be reviewed with the primary care provider in the context of confusion, falls, wandering, and severe caregiver sleep disruption.", "鉴于患者存在意识混乱、跌倒、走失以及照护者严重睡眠受扰，应与初级保健医生复核睡前苯海拉明使用情况。", "Remove definitive client-specific causation.");
  rationale(id, "bt_act_accuse_diane", "Accusation based only on a raised voice ignores the broader standalone pattern and can damage the therapeutic relationship, although safety assessment and policy-guided reporting remain necessary.", "仅凭提高音量就指责会忽略题干中的整体情况，并可能破坏治疗性关系；但仍需进行安全评估并按政策判断是否报告。", "Remove chair-barricade premise.");
  rationale(id, "bt_act_resource_list_first", "Resources are important, but giving a list before validating Diane's distress bypasses the emotional cue and may reduce engagement.", "资源很重要，但在接纳 Diane 的痛苦前就列清单会绕过情绪线索，并可能降低参与度。", "Remove quoted-statement premise.");
  rationale(id, "bt_par_home_mods", "Observable safety changes show whether the wandering, stove, fall, and medication risks identified in the stem are being reduced.", "可观察的安全改造可显示题干中的走失、炉灶、跌倒和用药风险是否正在降低。", "Align monitoring rationale to standalone risks.");
  rationale(id, "bt_par_caregiver_status", "Changes in sleep, nutrition, work function, support engagement, and personal health follow-up show whether caregiving is becoming sustainable.", "睡眠、营养、工作功能、支持参与和自身健康随访的变化可显示照护是否正变得可持续。", "Remove presupposed enrollment and referral completion.");
  rationale(id, "bt_par_spo2", "Oxygen saturation in isolation does not evaluate the primary caregiver-safety problem described in the stem.", "单独监测氧饱和度不能评价题干所述的主要照护者安全问题。", "Remove sibling-only normal oxygen-saturation assertion.");
  pair(id, ["rationale", "correct"], "The most likely condition is caregiver role strain. Diane's exhaustion, weight loss, missed work, guilt, impaired coping, and willingness to accept help fit role strain more than the alternatives. The priority actions are to reduce the wandering and stove hazards with nonrestrictive measures and to ask the primary care provider to review bedtime diphenhydramine use. Monitoring should focus on concrete safety changes and Diane's sleep, nutrition, work function, support engagement, and personal health follow-up.", "最可能状况是照护者角色压力。Diane 的疲惫、体重下降、误工、内疚、应对受损以及愿意接受帮助，更符合照护者角色压力，而不是其他选项。优先行动是采用非限制性措施降低走失和炉灶危险，并请初级保健医生复核睡前苯海拉明使用情况。监测应聚焦具体安全改造，以及 Diane 的睡眠、营养、工作功能、支持参与和自身健康随访。", "Reconcile correct rationale to repaired standalone surface.");
}

// 2. Clustered infection-control care.
{
  const id = "gpt_case_infection_control_clustered_care_01_bowtie";
  pair(id, ["stem"], "A contaminated stethoscope from a client's MRSA contact-precautions room has been found in the clean utility room near a clean supply cart. A student also contaminated a door handle after CDI care, a soiled-linen handling concern was identified, and a visitor asked whether a smear-positive TB client could leave the AIIR. Complete the bow-tie for the priority cross-contamination problem.", "一件来自 MRSA 接触隔离病房的污染听诊器被发现放在清洁用物间、靠近清洁物品车。护生在 CDI 照护后也污染了门把手，同时发现一项污染布草处理问题，另有探视者询问痰涂片阳性结核病患者能否离开 AIIR。请完成针对优先交叉污染问题的蝴蝶结题。", "Remove stage and sibling room/client mappings from the standalone stem.");
  token(id, "condition", "bt_cond_mrsa_stethoscope", "Current cross-contamination risk from a contaminated MRSA dedicated device in the clean utility room", "污染的 MRSA 专用设备进入清洁用物间造成的当前交叉污染风险", "Correct Chinese active/current meaning while preserving keyed condition.");
  token(id, "condition", "bt_cond_linen_error", "Potential soiled-linen handling breach requiring policy verification", "需要按制度核实的潜在污染布草处理漏洞", "Remove Room 12, client mapping, and unsupported universal-policy premise.");
  token(id, "condition", "bt_cond_cdi_door_handle", "Door-handle contamination after CDI care", "CDI 照护后的门把手污染", "Remove sibling-only bare-hand mechanism.");
  token(id, "actions", "bt_act_scope_too_narrow", "Disinfect only the stethoscope without cleaning the counter or assessing nearby supplies.", "只消毒听诊器，不清洁柜台，也不评估附近物品。", "Remove Room 16 assignment.");
  token(id, "actions", "bt_act_wait_until_end_shift", "Wait until the end of the shift to address the stethoscope because other scheduled care is pending.", "因还有其他计划护理，等到班末再处理听诊器。", "Remove sibling-only dressing schedule.");
  token(id, "actions", "bt_act_notify_educate_log", "Provide immediate corrective education to the staff member involved and notify unit leadership so the breach is documented for infection-control follow-up.", "立即教育相关工作人员，并通知当班管理人员记录该漏洞，以便感染控制后续追踪。", "Use role-neutral escalation wording.");
  token(id, "actions", "bt_act_remove_disinfect_area", "Remove the stethoscope, disinfect contacted clean-utility surfaces, assess or remove nearby supplies per policy, complete the required disinfectant wet-contact time, and return the device to its designated isolation room.", "取走听诊器，消毒其接触过的清洁用物间表面，按制度评估或移除附近物品，完成规定的消毒剂湿接触时间后，将设备送回其指定隔离病房。", "Remove hidden Room 16 assignment while retaining keyed containment action.");
  token(id, "parameters", "bt_param_vanco_monitoring", "A client's antimicrobial monitoring results", "某患者的抗感染药物监测结果", "Remove Client C vancomy premise.");
  token(id, "parameters", "bt_param_client_b_sputum", "Another client's sputum-culture result", "另一名患者的痰培养结果", "Remove Client B and organism premises.");
  rationale(id, "bt_cond_linen_error", "A linen-handling concern requires policy verification, but it is less immediate than a contaminated device resting beside clean supplies.", "污染布草处理问题需要按制度核实，但其即时性低于放在清洁物品旁的污染设备。", "Remove facility-specific error assertion.");
  rationale(id, "bt_cond_cdi_door_handle", "The contaminated door handle requires targeted cleaning, but the device in a shared clean-supply area creates the broader immediate pathway.", "被污染的门把手需要定点清洁，但共享清洁供应区域内的污染设备形成了更广泛的即时传播路径。", "Remove bare-hand import.");
  rationale(id, "bt_act_remove_disinfect_area", "This addresses the device, contacted surfaces, nearby supplies, and full disinfection before the device returns to its designated isolation room.", "这同时处理设备、接触表面、附近物品，并在设备送回其指定隔离病房前完成完整消毒。", "Remove Room 16 premise.");
  rationale(id, "bt_act_notify_educate_log", "Staff education, unit-leadership notification, and event logging reduce recurrence and support infection-control follow-up.", "工作人员教育、通知当班管理人员和事件记录可减少复发，并支持感染控制追踪。", "Role-neutral escalation rationale.");
  rationale(id, "bt_param_client_b_sputum", "Another client's culture result may guide that client's care but does not evaluate containment of this breach.", "另一名患者的培养结果可指导其护理，但不能评价本次漏洞是否得到控制。", "Remove Client B organism premise.");
  rationale(id, "bt_param_vanco_monitoring", "Antimicrobial monitoring may guide an individual client's therapy but does not measure environmental containment.", "抗感染药物监测可指导个体患者治疗，但不能衡量环境控制效果。", "Remove Client C vancomy premise.");
  pair(id, ["rationale", "correct"], "The priority problem is the contaminated MRSA stethoscope in the clean utility room because it creates a direct fomite pathway into a shared supply area. The nurse must contain the environmental exposure immediately, correct the staff practice, and monitor sustained PPE compliance and equipment control. Other clients' treatment or culture results do not measure containment of this cross-contamination breach.", "优先问题是污染的 MRSA 听诊器进入清洁用物间，因为它把隔离区域污染物直接带入共享供应区域，形成污染媒介传播路径。护士必须立即控制环境暴露，纠正工作人员做法，并监测 PPE 依从性和设备管理能否持续。其他患者的治疗或培养结果不能衡量本次交叉污染漏洞是否得到控制。", "Reconcile correct rationale to role-neutral standalone surface.");
}

// 3. Acute hemolytic transfusion reaction.
{
  const id = "gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie";
  token(id, "condition", "cond_a", "Acute hemolytic transfusion reaction", "急性溶血性输血反应", "Remove unestablished ABO etiology from keyed condition.");
  token(id, "condition", "cond_c", "Isolated septic transfusion reaction as the primary explanation", "以单纯脓毒性输血反应作为主要解释", "Make septic-reaction distractor rankable without an invented culture result.");
  token(id, "actions", "act_a", "Ensure the transfusion service receives the stopped unit, attached tubing, and required post-reaction patient sample according to protocol.", "按制度确保输血服务部门收到已停止输注的血袋、连接管路和所需的输血反应后患者样本。", "Tie handling details to protocol.");
  token(id, "parameters", "par_a", "Urine output and urine color", "尿量和尿液颜色", "Remove hidden Foley premise.");
  rationale(id, "cond_a", "Rapid onset during transfusion with hemoglobinuria, flank pain, hemolysis findings, shock, and DIC supports a severe acute hemolytic transfusion reaction.", "输血期间快速发作并伴血红蛋白尿、腰痛、溶血证据、休克和 DIC，支持严重急性溶血性输血反应。", "Remove ABO assertion from condition rationale.");
  rationale(id, "cond_c", "A septic transfusion reaction can share fever and hypotension, but it does not account as well for the prominent intravascular hemolysis pattern; contamination evaluation remains part of the reaction workup.", "脓毒性输血反应也可出现发热和低血压，但对明显的血管内溶血表现解释较差；输血反应调查仍需评估污染可能。", "Avoid categorical exclusion and invented culture result.");
  rationale(id, "act_a", "The transfusion service needs the stopped unit, tubing, labels, and required post-reaction sample for the reaction investigation before further transfusion decisions.", "输血服务部门需要已停止输注的血袋、管路、标签和所需的输血反应后样本进行调查，以支持后续输血决策。", "Use protocol-neutral transfusion-service wording.");
  rationale(id, "par_d", "Routine IV-site assessment is appropriate, but insertion-site appearance does not track the systemic hemolytic crisis.", "常规评估 IV 部位是合适的，但穿刺部位外观不能反映全身溶血危机的进展。", "Remove sibling-only normal IV-site finding.");
  pair(id, ["rationale", "correct"], "The condition is an acute hemolytic transfusion reaction. The priority actions are to ensure the transfusion-service investigation receives the required unit, tubing, and patient sample, and to escalate to higher-level care for shock, DIC, and oliguric acute kidney injury. The best monitoring parameters are urine output and color plus coagulation trends because these track the major organ-system threats.", "该病情是急性溶血性输血反应。优先措施是确保输血服务部门调查取得所需的血袋、管路和患者样本，并因休克、DIC 和少尿性急性肾损伤升级至更高级别护理。最佳监测参数是尿量和尿色以及凝血趋势，因为这些指标反映主要受威胁的器官系统。", "Remove ABO and Foley premises from correct rationale.");
  pair(id, ["glossary", 1] as any, "", "", "placeholder");
}

// Remove the placeholder inserted above; glossary is handled as exact object fields by the builder.
repairChanges.pop();
repairChanges.pop();
{
  const id = "gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie";
  add(id, ["glossary", 1, "termEn"], "Acute hemolytic transfusion reaction", "Replace unsupported ABO glossary focus.");
  add(id, ["glossary", 1, "termZh"], "急性溶血性输血反应", "Replace unsupported ABO glossary focus.");
  add(id, ["glossary", 1, "defZh"], "输血后迅速发生红细胞破坏，可伴休克、血红蛋白尿和凝血异常。", "Define repaired condition without assigning ABO etiology.");
}

// 4. Client advocacy / refusal.
{
  const id = "gpt_case_client_advocacy_refusal_01_bowtie";
  token(id, "condition", "bt_cond_active_surrogate", "Active surrogate decision-making after loss of decisional capacity", "患者丧失决策能力后的有效代理决策", "Remove unintroduced DPOAHC holder.");
  token(id, "condition", "bt_cond_autonomous_refusal", "Capacitated client's autonomous refusal challenged by continued treatment planning", "有决策能力患者的自主拒绝受到继续治疗规划的挑战", "Remove dormant-surrogate premise from keyed condition.");
  token(id, "actions", "bt_action_schedule_peg", "Schedule the PEG consult without patient consent to move the treatment plan forward", "未经患者同意安排 PEG 会诊，以继续推进治疗计划", "Remove hidden family-conflict motive.");
  token(id, "actions", "bt_action_family_meeting", "Facilitate the interdisciplinary family meeting with palliative care and appropriate support services", "在姑息治疗和适当支持服务参与下促成跨专业家庭会议", "Remove unestablished social-work involvement.");
  token(id, "actions", "bt_action_defer_son", "Defer to a family member's demand despite the client's documented capacity and refusal", "尽管患者已有决策能力和拒绝记录，仍听从家属要求", "Remove son and DPOAHC-document premises.");
  rationale(id, "bt_cond_autonomous_refusal", "This is the correct condition because the client has documented capacity and her refusal is being challenged by continued treatment planning.", "这是正确情况，因为患者有已记录的决策能力，而继续治疗规划正在挑战她的拒绝决定。", "Remove dormant-surrogate assertion.");
  rationale(id, "bt_cond_active_surrogate", "This would apply only after loss of decisional capacity, which is not the case here.", "只有在患者丧失决策能力后才适用；本题并非如此。", "Remove unintroduced surrogate identity.");
  rationale(id, "bt_action_family_meeting", "This addresses family concerns through interdisciplinary support without moving decision authority away from the patient.", "这通过跨专业支持处理家属关切，同时不把决定权从患者身上移开。", "Remove hidden social-work involvement.");
  rationale(id, "bt_action_schedule_peg", "Proceeding with a refused consult can become coercive and fails to honor the capacitated client's autonomy.", "继续安排患者已拒绝的会诊可能形成胁迫，也未尊重有决策能力患者的自主权。", "Remove family-conflict motive.");
  rationale(id, "bt_action_defer_son", "A family member does not replace the decision of a client with documented decisional capacity.", "家属不能取代已有决策能力记录的患者作出决定。", "Remove son and DPOAHC premises.");
  rationale(id, "bt_param_nutrition_labs", "Albumin and prealbumin values do not determine whether the advocacy intervention protected the client's refusal and autonomy.", "白蛋白和前白蛋白数值不能判断倡导干预是否保护了患者的拒绝决定和自主权。", "Remove overbroad nutrition-trend characterization.");
  pair(id, ["rationale", "correct"], "The synthesis is an autonomy and advocacy problem, not an impaired-capacity decision case. The priority nursing actions are to communicate and escalate so treatment planning honors the documented refusal, and to support a structured interdisciplinary family meeting. Monitoring should focus on whether orders and the care plan continue to match the client's goals and whether she feels respected and free from coercion.", "本题综合的是自主权和护理倡导问题，而不是决策能力受损的情境。优先护理措施是沟通并在必要时逐级上报，使治疗规划尊重已有记录的拒绝决定，同时支持结构化跨专业家庭会议。监测重点应放在医嘱和照护计划是否持续符合患者目标，以及患者是否感到受尊重且未受胁迫。", "Remove hidden surrogate scenario and scope overstatement.");
}

// 5. Lateral incivility.
{
  const id = "gpt_case_lateral_incivility_01_bowtie";
  token(id, "condition", "bt_c1", "Client-safety communication breakdown after an incomplete, dismissive handoff", "不完整且轻慢的交接导致患者安全沟通中断", "Remove need for a hidden peer pattern while preserving communication-safety construct.");
  token(id, "actions", "bt_a2", "Speak privately with the staff member responsible for the handoff about specific observed behaviors, patient-care impact, and policy-based documentation", "私下与负责该次交接的工作人员讨论具体观察到的行为、对患者护理的影响，以及按政策记录", "Replace hidden actor name with self-contained role description.");
  token(id, "actions", "bt_a3", "Address the interpersonal conflict before contacting the hospitalist", "先处理人际冲突，再联系住院医", "Remove hidden actor name.");
  token(id, "parameters", "bt_p3", "Whether the staff members become personal friends during breaks", "相关工作人员是否在休息时成为私人朋友", "Remove hidden actor names.");
  rationale(id, "bt_c1", "The incomplete, dismissive handoff omitted critical medication and monitoring information and contributed to a missed safety check.", "不完整且轻慢的交接遗漏了关键用药和监测信息，并导致一次安全监测漏做。", "Use standalone handoff facts only.");
  rationale(id, "bt_a2", "This addresses the responsible staff member's conduct without public shaming and creates accountability through policy-based documentation.", "这能在不公开羞辱的情况下处理相关工作人员的行为，并通过按政策记录建立问责。", "Remove hidden actor identity.");
  pair(id, ["rationale", "correct"], "The bow-tie centers on a client-safety communication breakdown after an incomplete, dismissive handoff. The immediate action is provider notification because the systolic blood pressure exceeds the ordered threshold and the client is symptomatic. The second priority is structured, private follow-up with the staff member responsible for the handoff and policy-based documentation. Monitoring must evaluate both the corrected blood-pressure monitoring process and the professionalism and completeness of later handoffs.", "本蝴蝶结题的核心是不完整且轻慢的交接造成患者安全沟通中断。立即措施是通知住院医，因为收缩压超过医嘱阈值且患者有症状。第二个优先事项是与负责该次交接的工作人员进行结构化、私下的跟进，并按政策记录。监测必须同时评价血压监测流程是否纠正，以及后续交接是否专业且完整。", "Remove hidden lateral-incivility pattern and actor identity.");
}

// 6. Mass-casualty START triage.
{
  const id = "gpt_case_mass_casualty_start_triage_01_bowtie";
  pair(id, ["stem"], "The ED is in activated MCI mode after seven casualties arrive from an industrial explosion with ammonia release. START triage is complete, one contaminated red-category casualty has completed decontamination, scarce blood and treatment spaces are being allocated, and the charge nurse must synthesize the safest condition, actions, and monitoring parameters.", "7 名来自工业爆炸并伴氨释放事件的伤员到达后，急诊已启动 MCI 模式。START 分诊已完成，一名受污染的红色伤员已完成去污，有限血制品和治疗空间正在分配，当班护士负责人必须综合判断最安全的情境、行动和监测参数。", "Remove stage reference and untranslated role label.");
  token(id, "actions", "action_cpr_expectant", "Begin full CPR and advanced resuscitation for casualties categorized black/expectant after START assessment", "为 START 评估后被归为黑色/预期死亡类别的伤员开始完整 CPR 和高级复苏", "Replace undefined casualty letters with self-contained triage status.");
  token(id, "actions", "action_bypass_decon", "Bring a contaminated casualty with stridor directly into the ED before decontamination", "将一名伴喘鸣的受污染伤员在去污前直接带入急诊", "Replace undefined casualty letter with self-contained findings.");
  rationale(id, "condition_hazmat_only", "The event involves multiple simultaneous casualties and resource allocation, not only a single chemical-exposure problem.", "该事件涉及多名同时到达的伤员和资源分配，而不只是单一化学暴露问题。", "Remove sibling-only injury types.");
  rationale(id, "action_cpr_expectant", "Full resuscitation for black/expectant casualties would consume scarce resources needed by salvageable casualties during the initial MCI response.", "在 MCI 初始应对中，为黑色/预期死亡伤员实施完整复苏会消耗可挽救伤员所需的稀缺资源。", "Use self-contained category rather than hidden casualty letters.");
  rationale(id, "action_bypass_decon", "Bypassing decontamination for a contaminated casualty risks contaminating the ED and exposing staff or other casualties.", "让受污染伤员绕过去污会污染急诊，并使工作人员或其他伤员暴露。", "Use self-contained contamination premise.");
  rationale(id, "param_salvageable_trajectory", "Improvement among red- and yellow-category salvageable casualties shows whether scarce resources reached those most likely to benefit.", "红色和黄色可挽救伤员的改善情况可显示稀缺资源是否到达最可能获益者。", "Remove undefined casualty letters and sibling-only trajectories.");
}

// 7. GBS respiratory compromise.
{
  const id = "gpt_case_gbs_respiratory_compromise_01_bowtie";
  token(id, "condition", "cond_gbs_resp_failure", "Guillain-Barre syndrome with impending respiratory failure", "格林-巴利综合征伴即将发生的呼吸衰竭", "Remove sibling-only AIDP subtype.");
  token(id, "actions", "act_continue_ivig", "Evaluate the diaphoresis and hemodynamic changes for an infusion-related safety concern; continue IVIG as ordered only if it is safe to do so", "评估出汗和血流动力学变化是否提示输注相关安全问题；仅在确认安全时按医嘱继续 IVIG", "Make IVIG continuation conditional on safety evaluation.");
  token(id, "parameters", "param_repeat_csf", "Serial CSF protein levels to guide acute airway decisions", "以连续 CSF 蛋白水平指导急性气道决策", "Remove presupposed prior CSF test.");
  rationale(id, "cond_gbs_resp_failure", "Confirmed GBS with progressive weakness, ineffective cough, impaired gag reflex, low respiratory-mechanics measurements, and limited speech supports impending respiratory failure.", "已确诊 GBS，并出现进行性无力、咳嗽无效、咽反射受损、呼吸力学指标降低和说话受限，支持即将发生的呼吸衰竭。", "Remove sibling-only diagnostic studies and AIDP subtype.");
  rationale(id, "cond_myasthenic_crisis", "The client already has confirmed GBS, and the progressive weakness with autonomic instability is better explained by that diagnosis.", "患者已确诊 GBS，进行性无力伴自主神经不稳定更符合该诊断。", "Remove sibling-only reflex, CSF, and nerve-conduction findings.");
  rationale(id, "cond_transverse_myelitis", "The confirmed GBS diagnosis and current peripheral weakness and respiratory findings make transverse myelitis the less likely explanation.", "已确诊 GBS，且当前周围性无力和呼吸表现使横贯性脊髓炎成为较不可能的解释。", "Remove sibling-only sensory, MRI, and bowel/bladder findings.");
  rationale(id, "act_continue_ivig", "IVIG treats the underlying immune process, but the diaphoresis and hemodynamic changes during infusion require safety evaluation; continuation is appropriate only when no infusion-related safety concern is identified.", "IVIG 用于治疗基础免疫过程，但输注期间的出汗和血流动力学变化需要进行安全评估；只有未发现输注相关安全问题时才适合继续。", "Add source-supported infusion-safety qualification.");
  rationale(id, "param_repeat_csf", "Serial CSF protein levels do not guide immediate airway stabilization or ventilatory support decisions.", "连续 CSF 蛋白水平不能指导即时气道稳定或通气支持决策。", "Remove sibling-only prior diagnostic-CSF premise.");
  pair(id, ["rationale", "correct"], "The bow-tie center is Guillain-Barre syndrome with impending respiratory failure. The priority actions are emergent airway stabilization and evaluation of the concurrent diaphoresis and hemodynamic changes before IVIG is continued as ordered. Ongoing monitoring should focus on respiratory mechanics and autonomic stability, not SpO2 alone or serial CSF protein.", "弓形题中心是格林-巴利综合征伴即将发生的呼吸衰竭。优先行动是紧急稳定气道，并在按医嘱继续 IVIG 前评估同时出现的出汗和血流动力学变化。持续监测应聚焦呼吸力学和自主神经稳定性，而不是单独看 SpO2 或连续 CSF 蛋白。", "Reconcile keyed action and condition to safe standalone surface.");
}

// 8. HIPAA disclosure breach.
{
  const id = "gpt_case_hipaa_disclosure_breach_01_bowtie";
  token(id, "actions", "bt_a1", "Ask the coworker to exit the record immediately and notify unit leadership according to facility policy", "立即要求该同事退出病历，并按机构制度通知当班管理人员", "Remove hidden coworker name and untranslated charge-nurse label.");
  token(id, "actions", "bt_a4", "Accept the coworker's statement that no disclosure occurred and do not report the access", "接受该同事称未披露信息的说法，不上报此次访问", "Remove hidden coworker name.");
  token(id, "parameters", "bt_p2", "Completion of targeted corrective education and follow-up safeguards identified through the privacy investigation", "完成隐私调查所确定的针对性纠正教育和后续防护措施", "Remove unrelated HIM fax and private-space premises.");
  token(id, "parameters", "bt_p3", "The client's current vital signs, wound appearance, and pain score", "该患者当前的生命体征、伤口外观和疼痛评分", "Remove unestablished postoperative status.");
  token(id, "parameters", "bt_p4", "Whether a family member calls before the end of the shift", "家属是否在本班结束前来电", "Remove Robert identity and prior-call premise.");
  rationale(id, "bt_c3", "The stem states that the coworker had no care role; it provides no permitted healthcare-operations or education purpose for the access.", "题干说明该同事没有照护职责，也未提供允许其访问的医疗运营或教育目的。", "Remove curiosity and orthopedic-note motive.");
  rationale(id, "bt_a1", "This immediately mitigates the active exposure and starts the facility reporting chain.", "这可立即控制正在发生的暴露，并启动机构上报链。", "Remove hidden coworker name.");
  rationale(id, "bt_a4", "Lack of onward disclosure does not make unauthorized viewing permissible; the event still requires reporting.", "没有继续传播并不代表未经授权查看是允许的；该事件仍需上报。", "Remove hidden coworker name.");
  rationale(id, "bt_p2", "Corrective education and safeguards identified through the investigation show whether the response addresses recurrence risk as well as the individual incident.", "调查确定的纠正教育和防护措施可显示处理是否同时针对复发风险和个别事件。", "Remove unrelated sibling system events.");
  rationale(id, "bt_p3", "Clinical assessment may be important for care but does not evaluate privacy containment or reporting.", "临床评估对护理可能重要，但不能评价隐私事件控制或上报。", "Remove postoperative premise.");
  rationale(id, "bt_p4", "A family member's call does not measure whether the unauthorized access was contained and investigated.", "家属来电不能衡量未经授权访问是否得到控制和调查。", "Remove Robert and restriction premises.");
  pair(id, ["rationale", "correct"], "The coworker's EHR access without a care role is unauthorized PHI access, not incidental disclosure or approved operations access. The immediate nursing actions are to stop further access, notify unit leadership according to policy, and complete the facility incident report with relevant access and mitigation details. Evaluation focuses on Privacy Officer investigation, audit-trail preservation, and the corrective safeguards identified through that investigation; unrelated clinical findings or family calls do not measure breach containment.", "该同事在无照护职责的情况下访问电子病历，属于未经授权访问 PHI，而不是偶然披露或被批准的运营访问。护士的即时行动是阻止进一步访问，按制度通知当班管理人员，并在机构事件报告中记录相关访问和控制细节。评价重点是隐私官调查、审计追踪保存以及调查确定的纠正防护措施；无关的临床发现或家属来电不能衡量隐私事件是否得到控制。", "Remove curiosity, orthopedic-note, Robert, postoperative, and sibling-system premises.");
}

// 9. Neutropenic fever / nadir.
{
  const id = "gpt_case_neutropenic_fever_nadir_01_bowtie";
  token(id, "condition", "cond_drug_reaction", "Acute medication-related reaction as the primary explanation", "以急性药物相关反应作为主要解释", "Remove recent-transfusion and unsupported allergic-manifestation premises.");
  token(id, "condition", "cond_dehydration", "Simple volume depletion without systemic infection", "不伴全身感染的单纯容量不足", "Remove poor-intake/GI-loss antecedent.");
  token(id, "actions", "act_culture_first", "Delay fluid resuscitation until additional diagnostic specimens are collected and new antimicrobial orders are obtained", "延迟补液复苏，直到采集更多诊断标本并获得新的抗感染药物医嘱", "Remove prior-culture and broadened-antibiotic antecedents.");
  token(id, "parameters", "param_cxr", "Chest-imaging findings as the immediate response marker", "将胸部影像结果作为即时反应指标", "Remove prior chest-imaging premise.");
  rationale(id, "cond_neutropenic_sepsis", "This condition best integrates severe neutropenia, persistent fever, hypotension, elevated lactate, oliguria, and delayed capillary refill.", "该状况最能整合严重中性粒细胞减少、持续发热、低血压、乳酸升高、少尿和毛细血管再充盈延迟。", "Remove asserted lactate trend.");
  rationale(id, "cond_dehydration", "Simple volume depletion does not adequately explain persistent fever in a client with severe neutropenia plus the current hypoperfusion findings.", "单纯容量不足不能充分解释严重中性粒细胞减少患者的持续发热和当前低灌注表现。", "Remove poor-intake and prior-fluid response premises.");
  rationale(id, "cond_drug_reaction", "A medication-related reaction remains a differential consideration, but the severe neutropenia, persistent fever, and hypoperfusion pattern more strongly support progression toward sepsis.", "药物相关反应仍需鉴别，但严重中性粒细胞减少、持续发热和低灌注表现更支持向脓毒症进展。", "Remove asserted transfusion history and absent allergic signs.");
  rationale(id, "act_bolus", "Fluid resuscitation addresses the immediate perfusion threat shown by hypotension, oliguria, delayed refill, and elevated lactate.", "补液复苏针对低血压、少尿、再充盈延迟和乳酸升高所显示的即时灌注威胁。", "Remove asserted lactate trend and prior-fluid context.");
  rationale(id, "act_culture_first", "Additional diagnostic specimens and antimicrobial decisions matter, but they must not delay the initial perfusion-restoring intervention.", "更多诊断标本和抗感染药物决策很重要，但不能延误最初恢复灌注的措施。", "Remove prior-culture premise.");
  rationale(id, "param_cxr", "Chest imaging may help source evaluation when indicated, but it is not the immediate response marker for this hemodynamic crisis.", "有指征时胸部影像可帮助寻找感染来源，但不是本次血流动力学危机的即时反应指标。", "Remove prior chest X-ray premise.");
  pair(id, ["rationale", "correct"], "The picture is neutropenic fever progressing toward sepsis: persistent fever with hypotension, tachycardia, elevated lactate, oliguria, and delayed capillary refill. The first priorities are perfusion support and rapid escalation; mean arterial pressure, urine output, and serial lactate measurements show whether resuscitation is working.", "本题符合中性粒细胞减少性发热向脓毒症进展：持续发热伴低血压、心动过速、乳酸升高、少尿和毛细血管再充盈延迟。首要任务是支持灌注和快速升级处理；平均动脉压、尿量及连续乳酸测量可显示复苏是否有效。", "Remove poor intake, prior fluids, altered response, and asserted lactate trend.");
}

// 10. Unsafe premature discharge.
{
  const id = "gpt_case_unsafe_premature_discharge_01_bowtie";
  token(id, "actions", "bt_act_team", "Engage case management, social work, clinical pharmacy, and home-health planning to assess and arrange feasible support for the identified barriers", "协调个案管理、社工、临床药师和居家护理规划，评估并安排可行支持以处理已识别障碍", "Remove unconditional family-support and resource-availability premises.");
  token(id, "parameters", "bt_param_function", "Assess ambulation and stair tolerance with oxygen saturation and recovery time", "评估步行和爬楼耐受，同时监测氧饱和度和恢复时间", "Remove implied prior stair trial and home-oxygen baseline.");
  rationale(id, "bt_act_team", "Interdisciplinary planning can assess and address medication affordability, the home environment, monitoring needs, and transition-support options without assuming a specific resource is already available.", "跨专业规划可评估并处理药物可负担性、居家环境、监测需求和过渡支持选项，而不假定某项资源已经可用。", "Remove family and confirmed-resource premises.");
  rationale(id, "bt_param_function", "Ambulation and stair assessment with oxygen saturation and recovery time shows whether the client can navigate the home environment safely.", "结合氧饱和度和恢复时间评估步行与爬楼，可显示患者能否安全应对居家环境。", "Remove unestablished baseline and prior stair performance.");
  pair(id, ["rationale", "correct"], "The priority condition is unsafe premature discharge: the client is improving medically but cannot yet safely transition home. The two priority actions are to pause the unsafe discharge through provider communication and escalation, and to engage interdisciplinary planning to assess and arrange feasible support for the identified barriers. The key monitoring parameters are repeat teach-back and functional assessment of ambulation and stair tolerance; BNP and inpatient weight are useful treatment-response data but do not show whether the discharge barriers have been resolved.", "优先问题是不安全的过早出院：患者医学上正在改善，但尚不能安全过渡回家。两个优先措施是通过与医生沟通并在必要时逐级上报来暂缓不安全出院，以及协调跨专业规划以评估并安排处理已识别障碍的可行支持。关键监测参数是再次回授，以及对步行和爬楼耐受的功能评估；BNP 和住院体重是有用的治疗反应资料，但不能说明出院障碍是否已经解决。", "Remove family/resource availability and prior stair-performance assumptions.");
}

// 11. Postpartum hemorrhage.
{
  const id = "gpt_pph_2026_06_16_case_01_bowtie";
  rationale(id, "bt_cond_coagulopathy", "The boggy uterus that repeatedly loses tone supports uterine atony; no standalone finding identifies primary coagulopathy as the main cause of the hemorrhage.", "子宫松软且反复失去张力支持子宫收缩乏力；题干没有发现表明原发性凝血障碍是出血主要原因。", "Remove sibling-only coagulation values.");
  rationale(id, "bt_par_creatinine", "Creatinine is not provided and would not directly measure immediate uterine response or ongoing blood-loss trajectory.", "题干未提供肌酐，而且肌酐不能直接衡量子宫的即时反应或持续失血趋势。", "Remove baseline/serial creatinine and urine-output premises.");
  pair(id, ["rationale", "correct"], "Persistent bleeding with a boggy uterus that will not sustain tone after massage identifies uterine atony. Exploration has ruled out retained fragments and unrepaired lacerations, and no standalone finding identifies primary coagulopathy as the main driver. Priority actions are continuous uterine compression and a safe uterotonic; misoprostol avoids the listed alternatives' hypertension- and asthma-related concerns. The most immediate response parameters are uterine tone and measured blood-loss trend.", "持续出血并伴有按摩后不能维持张力的松软子宫，指向子宫收缩乏力。探查已排除胎盘碎片残留和未修补裂伤，题干也没有发现表明原发性凝血障碍是主要驱动因素。优先措施是持续子宫压迫和安全宫缩药；米索前列醇可避开列出替代药物与高血压和哮喘相关的顾虑。最直接的反应监测参数是子宫张力和定量失血趋势。", "Remove sibling-only coagulation profile.");
}

// 12. Exercise-associated hypoglycemia prevention.
{
  const id = "gpt_format7c_exercise_hypoglycemia_bowtie";
  token(id, "actions", "act_hypo_safety", "Before the next ride, obtain rapid-acting carbohydrate and clear instructions for treating a low reading; follow those instructions promptly if symptoms or a low reading occur.", "下次骑车前备好速效碳水化合物并获得处理低血糖读数的明确指导；出现症状或低血糖读数时及时按指导处理。", "Remove presupposed existing plan and current carbohydrate access while preserving immediate-safety identity.");
  rationale(id, "act_hypo_safety", "Immediate safety requires arranging access to rapid-acting carbohydrate and clear treatment instructions before the next ride, then using them promptly if symptoms or a low reading occur.", "近期安全需要在下次骑车前备好速效碳水化合物并获得明确处理指导，出现症状或低血糖读数时及时按指导处理。", "Remove existing-plan premise.");
  pair(id, ["rationale", "correct"], "The repeated low-glucose episodes occur specifically during or shortly after the new exercise routine, while nonexercise readings remain in the stated range and illness cues are absent. This supports activity-associated hypoglycemia caused by a self-management plan that has not yet been aligned with the new routine. Priority actions are to involve the diabetes prescriber or DSMES team in an individualized exercise-day plan and, before the next ride, to obtain rapid-acting carbohydrate and clear low-glucose treatment instructions. Glucose around exercise and recurrence or timing of symptoms show whether the revised plan works.", "低血糖反复发生在新锻炼过程中或结束后不久，而非锻炼日血糖仍处于题干范围，并且没有疾病线索，因此最符合自我管理方案尚未与新锻炼习惯协调所导致的运动相关低血糖。优先措施是请糖尿病开立者或 DSMES 团队共同制定个体化锻炼日方案，并在下次骑车前备好速效碳水化合物、获得明确的低血糖处理指导。监测锻炼前后血糖以及症状或低血糖是否再次出现，可判断调整后的方案是否有效。", "Remove existing-plan and current-access premises.");
  pair(id, ["testTakingStrategy"], "Resolve the condition by matching timing and glucose pattern. Choose actions that establish immediate low-glucose safety and involve the diabetes team in planning for future exercise.", "根据症状发生时间和血糖模式判断状况。选择能建立即时低血糖安全措施，并由糖尿病团队共同制定后续锻炼计划的行动。", "Remove existing-plan premise without restoring authorial constraint leakage.");
}
