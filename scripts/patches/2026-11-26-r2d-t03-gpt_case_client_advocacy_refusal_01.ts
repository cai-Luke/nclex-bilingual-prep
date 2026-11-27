/**
 * R2 D-2 tranche 3, unit 05: zh-only meaning repair for gpt_case_client_advocacy_refusal_01 (banks/gpt-canonical.json questions[300]).
 * Producer: Codex gpt-6.2-astra high, Astra route per CT-5(f). Checker: fresh Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T03/producer/05/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_case_client_advocacy_refusal_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","exhibits",{"id":"baseline_record"},"content","zh"],
    before: "患者：Margaret Ellison，82 岁。\n因 NYHA IV 级心力衰竭加重从家中入院，过去 5 天出现气促加重、水肿和进食不足。\n病史：缺血性心肌病，射血分数 15%；慢性肾病 4 期，基线肌酐 2.8 mg/dL；2 型糖尿病，使用基础胰岛素；进行性吞咽困难，过去 6 个月由言语语言病理科随访。过去 4 个月因液体负荷过多住院 3 次。近期曾转诊门诊姑息治疗，但被家属取消。\n预立医疗指示：儿子 David 被指定为医疗保健持久授权代理人，但只有在 Ellison 太太丧失决策能力时才生效。\n现有医嘱：呋塞米 40 mg IV 每 12 小时一次；限液 1,200 mL/日；低钠心脏饮食，按言语语言病理科建议给予糊状食物和花蜜稠液；每日体重；遥测监护。\n入院时对护士的表述：“我不想再要任何管子或机器了。我这一生过得很好。我想舒服一点。”\n初始评估：清醒、能交谈，人物、地点、时间和情境定向力均正常。Mini-Cog 4/5。情绪平静、能反思；否认抑郁或绝望，并表示自己“很平静”。生命体征：T 36.8 C，HR 92 次/分且不规则，BP 104/62，RR 22 次/分，SpO2 93%，经鼻导管吸氧 2 L/min。体重 68.4 kg；记录的干体重 64.2 kg。双下肺湿啰音，45 度可见颈静脉怒张，双下肢至小腿中段 3+ 凹陷性水肿，颞部消瘦。口腔黏膜湿润。可少量饮用花蜜稠水，但启动吞咽时间延长。\n入院实验室：BNP 2,840 pg/mL，Na 131 mEq/L，K 5.1 mEq/L，BUN 48 mg/dL，肌酐 3.2 mg/dL，eGFR 14 mL/min/1.73 m2，血糖 142 mg/dL，白蛋白 2.6 g/dL，Hgb 9.8 g/dL，WBC 6.2 ×10³/µL，血小板 188 ×10³/µL，INR 1.1，前白蛋白 11 mg/dL。",
    after: "患者：Margaret Ellison，82 岁。\n因 NYHA IV 级心力衰竭加重从家中入院，过去 5 天出现气促加重、水肿和进食不足。\n病史：缺血性心肌病，射血分数 15%；慢性肾病 4 期，基线肌酐 2.8 mg/dL；2 型糖尿病，使用基础胰岛素；进行性吞咽困难，过去 6 个月由言语语言病理科随访。过去 4 个月因液体负荷过多住院 3 次。近期曾转诊门诊姑息治疗，但被家属取消。\n预立医疗指示：儿子 David 被指定为医疗保健持久授权书指定的代理人，但只有在 Ellison 太太丧失决策能力时才生效。\n现有医嘱：呋塞米 40 mg IV 每 12 小时一次；限液 1,200 mL/日；低钠心脏饮食，按言语语言病理科建议给予糊状食物和花蜜样稠度的液体；每日称重；心电遥测监护。\n入院时对护士的表述：“我不想再要任何管子或机器了。我这一生过得很好。我想舒服一点。”\n初始评估：清醒、能交谈，人物、地点、时间和情境定向力均正常。Mini-Cog 4/5。情绪平静、能反思；否认抑郁或绝望，并表示自己“很平静”。生命体征：T 36.8 C，HR 92 次/分且不规则，BP 104/62，RR 22 次/分，SpO2 93%，经鼻导管吸氧 2 L/min。体重 68.4 kg；记录的干体重 64.2 kg。双下肺湿啰音，45 度可见颈静脉怒张，双下肢至小腿中段 3+ 凹陷性水肿，颞部消瘦。口腔黏膜湿润。可少量饮用花蜜样稠度的水，但启动吞咽时间延长。\n入院实验室：BNP 2,840 pg/mL，Na 131 mEq/L，K 5.1 mEq/L，BUN 48 mg/dL，肌酐 3.2 mg/dL，eGFR 14 mL/min/1.73 m2，血糖 142 mg/dL，白蛋白 2.6 g/dL，Hgb 9.8 g/dL，WBC 6.2 ×10³/µL，血小板 188 ×10³/µL，INR 1.1，前白蛋白 11 mg/dL。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_1"},"exhibits",{"id":"stage_1_update"},"content","zh"],
    before: "主治医师与家属讨论患者进行性吞咽困难和营养状况不佳，并建议放置 PEG 管以维持营养和水分。Ellison 太太听完解释后问：“这个管子能治好我的心脏吗？”以及“我以后还能不能吃一点东西？”随后她说：“我理解你们说的内容。我不想要喂食管。我想吃多少算多少，并且舒服一点。”\n医师记录：“患者表现出理解 PEG 置管风险与获益的能力，包括 PEG 不一定能消除误吸风险，以及不置管可能继续体重下降。她能清楚表达自己的价值观和理由。决策能力完整。患者此时拒绝 PEG。”\n儿子 David 对护士说：“她不知道自己在说什么。她老了，只是在放弃。你们要劝醒她。我是她的授权代理人——我要放这个管子。” 女儿 Karen 打电话到病区说：“我和我哥哥意见一致。我们希望什么都做。她只是害怕。你不能说服她吗？” 护士确认预立医疗指示规定：只有在 Ellison 太太丧失决策能力时，儿子的代理权才生效。\n生命体征：HR 88 次/分，BP 108/64，RR 20 次/分，SpO2 94%，吸氧 2 L/min。体重 67.8 kg。患者安静休息，可少量耐受糊状食物和花蜜稠液。遥测：心房颤动，心室率受控。",
    after: "主治医师与家属讨论患者进行性吞咽困难和营养状况不佳，并建议放置 PEG 管以维持营养和水分。Ellison 太太听完解释后问：“这个管子能治好我的心脏吗？”以及“我以后还能不能吃一点东西？”随后她说：“我理解你们说的内容。我不想要喂食管。我想吃多少算多少，尽量让自己舒服一点。”\n医师记录：“患者表现出理解 PEG 置管风险与获益的能力，包括 PEG 不一定能消除误吸风险，以及不置管可能继续体重下降。她能清楚表达自己的价值观和理由。决策能力完整。患者此时拒绝 PEG。”\n儿子 David 对护士说：“她不知道自己在说什么。她老了，只是在放弃。你们要劝醒她。我是她的授权代理人——我要放这个管子。” 女儿 Karen 打电话到病区说：“我和我兄弟意见一致。我们希望什么都做。她只是害怕。你不能说服她吗？” 护士确认预立医疗指示规定：只有在 Ellison 太太丧失决策能力时，儿子的代理权才生效。\n生命体征：HR 88 次/分，BP 108/64，RR 20 次/分，SpO2 94%，吸氧 2 L/min。体重 67.8 kg。患者安静休息，可少量耐受糊状食物和花蜜样稠度的液体。心电遥测：心房颤动，心室率受控。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_3"},"exhibits",{"id":"stage_3_update"},"content","zh"],
    before: "护士已在护理记录中记录 Ellison 太太反复且一致的拒绝，包括直接引语和决策能力相关观察；已告知护士长存在伦理问题；已申请姑息治疗；并安排次日上午由主治医师、姑息治疗团队、社工和两名成年子女参加家庭会议。David 表示他已联系律师，并“会拿到法院命令”要求放置 PEG。\nEllison 太太正在休息，并告诉护士，很高兴有人在听她说话。她询问在家接受临终关怀的选择。生命体征：HR 86 次/分，BP 102/58，RR 18 次/分，SpO2 95%，吸氧 2 L/min。体重 66.8 kg。午餐少量糊状食物可耐受。遥测无变化。\n姑息治疗护士执业者记录：“Ellison 太太表现出完整的决策能力，基于一致价值观进行推理，并对 PEG 置管作出知情、自愿的拒绝。建议与家属进行照护目标会议，制定以舒适为重点的照护计划，并根据患者明确表达的意愿转介临终关怀。”",
    after: "护士已在护理记录中记下 Ellison 太太反复且一致的拒绝，包括直接引语和决策能力相关观察；已告知护士长存在伦理问题；已申请姑息治疗；并安排次日上午由主治医师、姑息治疗团队、社工和两名成年子女参加家庭会议。David 表示他已联系律师，并“会拿到法院命令”要求放置 PEG。\nEllison 太太正在休息，并告诉护士，很高兴有人在听她说话。她询问在家接受临终关怀的选择。生命体征：HR 86 次/分，BP 102/58，RR 18 次/分，SpO2 95%，吸氧 2 L/min。体重 66.8 kg。午餐少量糊状食物可耐受。心电遥测结果无变化。\n姑息治疗执业护士记录：“Ellison 太太表现出完整的决策能力，基于一致价值观进行推理，并对 PEG 置管作出知情、自愿的拒绝。建议与家属进行照护目标会议，制定以舒适为重点的照护计划，并根据患者明确表达的意愿转介临终关怀。”",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_client_advocacy_refusal_01_q1"},"highlight","segments",{"id":"s5"},"zh"],
    before: "预立医疗指示说明，儿子的 DPOAHC 权限只有在 Ellison 太太丧失决策能力时才生效。",
    after: "预立医疗指示载明：只有在 Ellison 太太丧失决策能力时，其儿子才可依据医疗保健持久授权书（DPOAHC）代她作决定。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_client_advocacy_refusal_01_q1"},"highlight","segments",{"id":"s6"},"zh"],
    before: "Mini-Cog 得分为 4/5，画钟正常。",
    after: "简易认知筛查（Mini-Cog）得分为 4/5，画钟测试正常。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_client_advocacy_refusal_01_q1"},"highlight","segments",{"id":"s7"},"zh"],
    before: "David 说自己是授权代理人，并要求放置管子。",
    after: "David 表示自己是授权代理人，要求为母亲放置喂食管。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_client_advocacy_refusal_01_q2"},"options",{"id":"B"},"zh"],
    before: "应遵循 David 的决定，因为 DPOAHC 总是优先于患者当前选择。",
    after: "应遵循 David 的决定，因为医疗保健持久授权书指定的代理人总是优先于患者本人作决定。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_client_advocacy_refusal_01_q2"},"rationale","correct","zh"],
    before: "有决策能力的成年人有权接受或拒绝治疗。DPOAHC 文件本身有法律意义，但由于触发生效条件——丧失决策能力——尚未发生，因此目前尚未生效。",
    after: "有决策能力的成年人有权接受或拒绝治疗。虽然医疗保健持久授权书具有法律效力，但患者尚未丧失决策能力，因此文件规定的代理权仍未生效。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_client_advocacy_refusal_01_q2"},"stem","zh"],
    before: "阶段 1：David 坚称自己的 DPOAHC 身份允许他推翻母亲的拒绝并要求放置 PEG。此时应遵循谁的决定？",
    after: "阶段 1：David 坚称，作为医疗保健持久授权书指定的代理人，他有权推翻母亲的拒绝，要求为她放置 PEG 管。此时应遵循谁的决定？",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_client_advocacy_refusal_01_q3"},"options",{"id":"A"},"zh"],
    before: "为 Ellison 太太知情、自愿的拒绝进行倡导，防止其意愿被家属压力或医师摇摆态度覆盖。",
    after: "维护 Ellison 太太知情、自愿拒绝置管的决定，避免家属施压或医师的犹豫使其意愿得不到尊重。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_client_advocacy_refusal_01_q4"},"options",{"id":"F"},"zh"],
    before: "因为 David 持有 DPOAHC 文件且威胁升级，所以听从他的要求。",
    after: "由于 David 持有医疗保健持久授权书，并扬言要采取进一步行动，因此听从他的要求。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_client_advocacy_refusal_01_q4"},"options",{"id":"D"},"zh"],
    before: "申请姑息治疗和社工支持，并在 Ellison 太太同意且愿意参与的情况下协助安排结构化家庭会议。",
    after: "请求姑息治疗团队和社工提供支持；经 Ellison 太太同意，协助安排有明确议程的家庭会议，并让她按自己的意愿参与。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_client_advocacy_refusal_01_q5"},"options",{"id":"D"},"zh"],
    before: "先请 David 把 DPOAHC 文件带到病区，再采取进一步行动。",
    after: "请 David 先将医疗保健持久授权书带到病区，再采取进一步行动。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
