/**
 * R2 D-2 tranche 4, unit 01: zh-only meaning repair for gpt_case_gallstone_pancreatitis_01 (banks/hard-cases-canonical.json questions[50]).
 * Producer: Codex gpt-6.2-astra high, Astra route per CT-5(f). Checker: fresh Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T04/producer/01/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_case_gallstone_pancreatitis_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","exhibits",{"id":"ex_admission_assessment"},"content","zh"],
    before: "T 37.3 C，HR 112，BP 118/74，RR 24，室内空气 SpO2 96%。出汗，黏膜发黏，轻度巩膜黄染。腹部膨隆，上腹明显压痛和自愿性肌紧张；肠鸣音减弱。双肺清，左肺底稍减弱。无 Grey Turner 征或 Cullen 征。清醒定向；无自发手足搐搦或面肌抽动。",
    after: "体温 37.3 °C，心率 112，血压 118/74，呼吸频率 24，呼吸室内空气时 SpO2 为 96%。患者出汗，黏膜发黏，巩膜轻度黄染。腹部膨隆，上腹部压痛明显，可见自主性腹肌紧张，肠鸣音减弱。双肺呼吸音清，左肺底呼吸音稍减弱。格雷–特纳征（Grey Turner 征）和卡伦征（Cullen 征）均阴性。患者清醒，定向力正常，无自发性手足搐搦或面肌抽动。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_1"},"exhibits",{"id":"stage_1_update"},"content","zh"],
    before: "医嘱：目标导向乳酸林格液，根据低血容量给予 bolus/调速并复评容量超负荷；ondansetron IV PRN；hydromorphone IV PRN；主动呕吐期间禁食；留置 Foley。最初 2 小时尿量 45 mL（22 mL/hr），随后第 2-4 小时改善为 110 mL（55 mL/hr）。第 4 小时 Chvostek 征和 Trousseau 征阳性，伴指尖和口周麻木。监护示窦性心动过速，无 QT 延长。已通知医嘱者；医嘱 calcium gluconate 2 g 加入 50 mL D5W，经输液泵 20 分钟 IV 输入，并持续心电监护。",
    after: "医嘱给予目标导向的乳酸林格液补液，针对低血容量快速补液或调整输液速度，并复评有无容量超负荷。按需静脉给予昂丹司琼和氢吗啡酮；仍在呕吐期间禁食禁饮，并留置导尿管。最初 2 小时尿量为 45 mL（22 mL/hr），第 2–4 小时增至 110 mL（55 mL/hr）。第 4 小时，面神经叩击征（Chvostek 征）和 Trousseau 征均阳性，伴指尖及口周刺麻感。心电监护显示窦性心动过速，QT 间期未延长。已通知诊疗人员，医嘱将葡萄糖酸钙 2 g 加入 50 mL D5W，经输液泵在 20 分钟内静脉输注，并持续心电监护。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_gallstone_pancreatitis_01_q1"},"rationale","byChoice",{"refId":"r_calcium"},"zh"],
    before: "胰腺炎中的总钙和离子钙降低反映钙被 sequestration/皂化消耗和炎症较重，而不是胆源性病因。",
    after: "胰腺炎患者的总钙和离子钙均降低，反映钙被组织结合、滞留，且炎症较重，不能据此判断病因为胆源性。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_gallstone_pancreatitis_01_q2"},"clozeStem","zh"],
    before: "患者真正低钙血症最直接由 {{1}} 引起。确认这并非仅由低白蛋白造成的假性低钙血症的依据是 {{2}}。Chvostek 征阳性、Trousseau 征阳性和口周麻木提示 {{3}}。",
    after: "患者真正的低钙血症最直接的原因是 {{1}}。提示这并非仅由低白蛋白引起的假性低钙血症的依据是 {{2}}。面神经叩击征（Chvostek 征）和 Trousseau 征均阳性，并伴口周刺麻感，提示 {{3}}。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_gallstone_pancreatitis_01_q2"},"rationale","byChoice",{"refId":"3"},"zh"],
    before: "Chvostek 征和 Trousseau 征阳性加感觉异常是症状，不是偶然化验异常；需要升级处理并按医嘱补钙。",
    after: "面神经叩击征（Chvostek 征）和 Trousseau 征阳性，并伴感觉异常，说明患者已有临床表现，并非偶然发现的化验异常。应及时升级处理，并按医嘱补钙。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_gallstone_pancreatitis_01_q4"},"options",{"id":"A"},"zh"],
    before: "将尿量下降和乳酸升高通知医嘱者；重新评估容量状态，并预期可能需要补液 bolus 或调整输液速度。",
    after: "将尿量下降和乳酸升高的情况报告给诊疗人员，重新评估容量状态，并预期可能需要快速补液或调整输液速度。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_gallstone_pancreatitis_01_q4"},"rationale","byChoice",{"refId":"E"},"zh"],
    before: "有效阿片类镇痛是合适的；不应因过时的 Oddi 括约肌担忧而不足量治疗严重胰腺炎疼痛。高血糖应按医嘱处理。",
    after: "应使用阿片类药物充分镇痛，不应因对奥迪括约肌（Oddi 括约肌）的旧有顾虑，使严重胰腺炎患者的疼痛得不到充分缓解。高血糖应按医嘱处理。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
