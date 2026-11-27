/**
 * R2 D-2 tranche 4, unit 02: zh-only meaning repair for gpt_case_hipaa_disclosure_breach_01 (banks/gpt-canonical.json questions[292]).
 * Producer: Codex gpt-6.2-astra high, Astra route per CT-5(f). Checker: fresh Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T04/producer/02/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_case_hipaa_disclosure_breach_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","exhibits",{"id":"baseline_profile_policy"},"content","zh"],
    before: "Torrance女士左胫骨平台骨折ORIF术后第1天。她清醒、定向力正常，并参与自己的照护。病历中列出的紧急/授权联系人仅为成年女儿Megan Torrance。机构政策要求发现或目击潜在隐私泄露的护士立即控制暴露、通知 charge nurse、完成电子事件报告，并确保同班次通知单元经理和隐私官。事件报告属于质量改进文件，不得在病历中提及。",
    after: "Torrance女士左胫骨平台骨折ORIF术后第1天。她清醒、定向力正常，并参与自己的照护。病历中列出的紧急/授权联系人仅为成年女儿Megan Torrance。机构政策要求发现或目击潜在隐私泄露的护士立即控制暴露、通知当班带班护士、完成电子事件报告，并确保同班次通知病区护理管理者和隐私官。事件报告属于质量改进文件，不得在病历中提及。",
  }),
  setValue({
    id: ID, path: ["caseStudy","exhibits",{"id":"baseline_assessment_labs"},"content","zh"],
    before: "0715生命体征：T 99 °F (37.2 °C)，HR 78次/分，BP 134/82 mm Hg，RR 14次/分，室内空气SpO2 97%。敷料清洁、干燥、完整；远端神经血管状态完整。疼痛4/10。0600化验：Hgb 11.4 g/dL，肌酐1.3 mg/dL，eGFR 52 mL/min，血糖168 mg/dL。Torrance女士表示担心自己要停工多久，以及雇主是否会知道她病情细节。",
    after: "0715生命体征：T 99 °F (37.2 °C)，HR 78次/分，BP 134/82 mm Hg，RR 14次/分，室内空气SpO2 97%。敷料清洁、干燥、完整；远端神经血管状态完整。疼痛4/10。0600化验：Hgb 11.4 g/dL，肌酐1.3 mg/dL，eGFR 52 mL/min，血糖168 mg/dL。Torrance女士表示担心自己要停工多久，以及雇主是否会知道她的具体病情。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_1"},"exhibits",{"id":"stage_1_privacy_events"},"content","zh"],
    before: "0745：一名来电者自称是患者丈夫Robert Torrance，要求得知化验结果和出院时间；Robert未列为授权联系人。0830：Casey护士被分配在另一护理区且无照护职责，却因个人对骨科记录感兴趣而浏览Torrance女士的手术记录和MAR。0945：雇主将传真发到护理单元，要求入院记录、手术报告和预计返工日期以处理工伤赔偿；未附患者签署的授权书。1015：一名护生用个人智能手机拍摄伤口，准备课堂汇报；医院身份腕带可见，且无书面同意。1025：两名护士在走廊交班，按姓名讨论另一名患者的HIV状态和用药，旁边访客能够听到。1030时Torrance女士临床状况仍稳定。",
    after: "0745：一名来电者自称是患者丈夫Robert Torrance，要求得知化验结果和出院时间；Robert未列为授权联系人。0830：Casey护士被分配在另一护理区且无照护职责，却因自己对骨科记录感兴趣而浏览Torrance女士的手术记录和MAR。0945：雇主将传真发到护理单元，索取入院记录、手术报告和预计返工日期以处理工伤赔偿；未附患者签署的授权书。1015：一名护生用个人智能手机拍摄伤口，准备课堂汇报；医院身份腕带可见，且无书面同意。1025：两名护士在走廊交班，按姓名讨论另一名患者的HIV状态和用药，旁边访客能够听到。1030时Torrance女士临床状况仍稳定。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_2"},"exhibits",{"id":"stage_2_actions"},"content","zh"],
    before: "Jordan护士对每次暴露实时采取控制措施，同时正式跟进持续进行。Torrance女士表示她与Robert已合法分居，不希望他获得任何信息；仍只授权Megan。Casey护士不以为然，称自己没有分享信息。charge nurse确认该访问未经授权，并要求完成事件报告和通知隐私官。Jordan护士未向雇主释放资料，妥善保管传真并联系HIM；HIM说明释放资料需要患者签署授权或有效法律依据，且必须由HIM处理。护生确认照片未分享；Jordan护士停止进一步分享，妥善保护图像和设备以等待隐私官或信息安全人员指示，并在指导老师参与下立即上报，由相关人员评估可能的云端同步。Jordan护士将走廊交班移至私密区域。到1200，事件报告已完成，且未记录在病历中。",
    after: "Jordan护士对每次暴露实时采取控制措施，同时正式跟进持续进行。Torrance女士表示她与Robert已合法分居，不希望他获得任何信息；仍只授权Megan。Casey护士不以为然，称自己没有分享信息。当班带班护士确认该访问未经授权，并要求完成事件报告和通知隐私官。Jordan护士未向雇主提供病历资料，妥善保管传真并联系健康信息管理部门（HIM）。该部门说明对外提供病历资料需要患者签署授权或有效法律依据，且必须由HIM处理。护生确认照片未分享；Jordan护士停止进一步分享，妥善保护图像和设备以等待隐私官或信息安全人员指示，并在指导老师参与下立即上报，由相关人员评估可能的云端同步。Jordan护士请交班护士移至私密区域。到1200，事件报告已完成，且未记录在病历中。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_3"},"exhibits",{"id":"stage_3_evaluation"},"content","zh"],
    before: "1430，隐私官表示将使用电子病历审计追踪，通过正式隐私事件判定流程调查Casey护士的访问。护生照片也作为潜在隐私事件审查。1500，HIM确认没有患者签署授权或有效法律依据，不会向雇主释放资料。1530，Torrance女士询问自己的病历是否出了问题；Jordan护士承认机构已知晓相关关注点并由隐私官处理，但不透露工作人员姓名或调查细节。1700，正在审查的防护措施包括在传真机旁张贴标识，提醒将病历请求转至HIM；指导老师强化禁止可识别患者照片的政策；开展最低必要访问和审计追踪的短讲；并复习在私密空间交班。到1900，患者临床状况仍稳定。",
    after: "1430，隐私官表示将依据电子病历访问日志，通过正式隐私事件判定流程调查Casey护士的访问。护生照片也作为潜在隐私事件审查。1500，HIM确认没有患者签署授权或有效法律依据，不会向雇主提供病历资料。1530，Torrance女士询问自己的病历是否出了问题；Jordan护士承认机构已知晓相关关注点并由隐私官处理，但不透露工作人员姓名或调查细节。1700，正在审查的防护措施包括在传真机旁张贴标识，提醒将病历请求转至HIM；指导老师强化禁止可识别患者照片的政策；开展最低必要访问和审计追踪的在职培训；并复习在私密空间交班。到1900，患者临床状况仍稳定。",
  }),
  setValue({
    id: ID, path: ["caseStudy","summary","zh"],
    before: "Elaine Torrance女士，58岁，因左胫骨平台骨折行切开复位内固定术后，目前病情稳定。白班期间，Jordan护士必须识别、控制、上报并评价多起隐私风险和未经授权的PHI暴露。",
    after: "58 岁的 Elaine Torrance 女士因左胫骨平台骨折行切开复位内固定术，目前术后病情稳定。白班期间，注册护士 Jordan 需要识别多起隐私风险和未经授权接触受保护健康信息（PHI）的事件，及时控制暴露、上报，并评估处理效果。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_hipaa_disclosure_breach_01_q1"},"rationale","correct","zh"],
    before: "未核实且未授权的来电、因好奇查看病历、雇主未授权索取病历、在个人设备上形成可识别患者身份的照片，以及在走廊可被旁人听到的交班，均属于实际或潜在隐私问题。常规评估中的疼痛报告是负责护士用于照护的信息，本身不是隐私事件。",
    after: "未核实且未授权的来电、因好奇查看病历、雇主未授权索取病历、在个人设备上形成可识别患者身份的照片，以及访客能听到的走廊交班，均属于实际或潜在隐私问题。常规评估中的疼痛报告是负责护士用于照护的信息，本身不是隐私事件。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_hipaa_disclosure_breach_01_q3"},"options",{"id":"q3_d"},"zh"],
    before: "Torrance女士担心雇主会得知她病情细节",
    after: "Torrance女士担心雇主会得知她的具体病情",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_hipaa_disclosure_breach_01_q3"},"rationale","byChoice",{"refId":"q3_e"},"zh"],
    before: "照片需要紧急控制和上报，但在本病例中仍限于一台设备且未传送；Casey护士访问电子病历是范围最广的已发生访问暴露。",
    after: "这张照片也需要紧急控制并上报。不过，就病例所述情况而言，照片目前仅存于一台设备，尚未发送；Casey 护士未经授权查阅电子病历，是已发生的访问事件中涉及信息范围最广的一起。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_hipaa_disclosure_breach_01_q3"},"rationale","correct","zh"],
    before: "Casey护士在没有照护、会诊、付款或运营职责的情况下，故意打开Torrance女士的手术记录和MAR。这是工作人员已完成的PHI暴露，需要立即控制并正式上报。照片同样严重，但本病例将Casey护士的电子病历访问设定为范围更广、可由审计追踪且有持续系统风险的优先事件。",
    after: "Casey 护士并未参与 Torrance 女士的照护、会诊、费用结算或相关运营工作，却有意打开了她的手术报告和给药记录。这意味着工作人员已经未经授权接触了受保护健康信息，应立即控制暴露并正式上报。拍照同样严重，但在本病例中，Casey 护士访问电子病历涉及范围更广，系统留有访问记录，且存在持续的系统访问风险。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_hipaa_disclosure_breach_01_q4"},"options",{"id":"q4_b"},"zh"],
    before: "要求Casey护士退出病历，通知 charge nurse，完成事件报告，并且不要把事件报告写入病历。",
    after: "要求 Casey 护士退出该患者的病历，通知当班带班护士，完成事件报告，并将事件报告与患者病历分开保存。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_hipaa_disclosure_breach_01_q4"},"rationale","byChoice",{"refId":"q4_b"},"zh"],
    before: "这符合机构流程：先控制正在发生的访问，通知 charge nurse，再在临床病历之外完成正式报告。",
    after: "这符合机构规定的顺序：先制止正在发生的未经授权访问，通知当班带班护士，再通过独立于临床病历的渠道完成正式上报。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_hipaa_disclosure_breach_01_q5"},"options",{"id":"q5_a"},"zh"],
    before: "立即要求Casey护士关闭病历或退出登录，然后通知 charge nurse 并按隐私事件上报链处理。",
    after: "立即要求 Casey 护士关闭该病历或退出登录，随后通知当班带班护士，按规定逐级上报隐私事件。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_hipaa_disclosure_breach_01_q5"},"options",{"id":"q5_b"},"zh"],
    before: "先完成电子事件报告，提交后再告知 charge nurse。",
    after: "先填好电子事件报告，待提交后再通知当班带班护士。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_hipaa_disclosure_breach_01_q5"},"rationale","byChoice",{"refId":"q5_b"},"zh"],
    before: "提交报告是必要的，但流程顺序是先控制暴露并通知 charge nurse。",
    after: "必须提交报告，但按机构流程，应先控制暴露并通知当班带班护士。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_hipaa_disclosure_breach_01_q5"},"rationale","correct","zh"],
    before: "第一步是立即减轻/控制暴露：让Casey护士离开病历，停止正在发生的未经授权访问。随后通知 charge nurse，并按机构上报链处理。纪律处分和正式通知患者应由管理层和隐私官流程处理，而不是发现事件的护士自行处理。",
    after: "首先应立即控制暴露，请 Casey 护士退出病历，制止正在发生的未经授权访问。随后通知当班带班护士，并按机构规定逐级上报。纪律处分和通知患者由管理层及隐私官依流程处理，发现事件的护士不应自行决定。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_hipaa_disclosure_breach_01_q5"},"stem","zh"],
    before: "Jordan护士看到Casey护士正在无照护职责地查看Torrance女士病历。护士的第一步行动是什么？",
    after: "Jordan 护士看到 Casey 护士正在查看 Torrance 女士的病历，而她并不负责该患者的照护。Jordan 首先应做什么？",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_hipaa_disclosure_breach_01_q6"},"options",{"id":"q6_c"},"zh"],
    before: "护理单元未向Robert或雇主释放PHI。",
    after: "护理单元没有向 Robert 或雇主披露受保护健康信息（PHI）。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
