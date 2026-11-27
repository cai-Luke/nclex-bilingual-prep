/**
 * R2 D-2 tranche 7, unit 02: zh-only meaning repair for gpt_case_unsafe_premature_discharge_01 (banks/gpt-canonical.json questions[296]).
 * Producer: Codex gpt-6.2-astra high. Independent checker route: Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T07/producer/02/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_case_unsafe_premature_discharge_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","exhibits",{"id":"baseline_summary"},"content","zh"],
    before: "一名 71 岁女性，有射血分数降低型心衰（EF 30%）、2 型糖尿病、高血压和轻度慢性肾病。4 天前因买不起 furosemide 续药而停药，发生急性失代偿性心衰入院。住院期间接受 IV furosemide，改为新的口服 torsemide 40 mg 每日一次，lisinopril 增至每日 20 mg，并新增 carvedilol。她独居在无电梯的二楼公寓，家中没有体重秤；女儿住在 90 分钟路程外且全职工作。由于床位周转压力，医生今晨开立出院医嘱，目标上午 11:00 出院。",
    after: "一名 71 岁女性，有射血分数降低型心衰（EF 30%）、2 型糖尿病、高血压和轻度慢性肾病。呋塞米用完后，她无力支付续药费用，4 天前因急性失代偿性心衰入院。住院期间先静脉给予呋塞米，随后改为口服托拉塞米 40 mg 每日一次，赖诺普利增至每日 20 mg，并新开卡维地洛处方。她独居在无电梯的二楼公寓，家中没有体重秤；女儿住在 90 分钟路程外且全职工作。由于床位周转压力，医生今晨开立出院医嘱，目标上午 11:00 出院。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_1"},"exhibits",{"id":"stage_1_teaching_ambulation"},"content","zh"],
    before: "回授时，患者说 torsemide 可能是降血压药，不确定如果一夜体重增加超过 2 lb 该怎么做，也说不出哪些警示症状需要联系医护人员。她询问 torsemide 是否和 furosemide 一样，以及保险是否会支付。药房试算显示新的利尿剂每月自付 95 美元。她表示每月社会保障收入约 1,400 美元，上月因买不起 furosemide 才停药。步行试验：约 40 英尺后，她停下抓住扶手，说非常喘。HR 110，RR 28，室内空气 SpO2 89%。她需要休息 2 分钟并经鼻导管吸氧 2 L/min，才恢复至 SpO2 93%。她说自己的公寓要上一层楼，不知道自己能否做到。回床休息 5 分钟后：HR 96，RR 24，室内空气 SpO2 92%。08:45，床位管理询问该床是否能在 11:00 空出，因为急诊有 3 名患者在等待监护床位。",
    after: "护士使用回授法时，患者说托拉塞米可能是降血压药，不确定如果一夜体重增加超过 2 lb 该怎么做，也说不出哪些警示症状需要联系医护人员。她询问托拉塞米是否和呋塞米一样，以及保险能否报销。药房试算显示新的利尿剂每月自付 95 美元。她表示每月靠约 1,400 美元生活，上月因买不起呋塞米才停药。步行试验：约 40 英尺后，她停下抓住扶手，说非常喘。HR 110，RR 28，室内空气 SpO2 89%。她需要休息 2 分钟并经鼻导管吸氧 2 L/min，才恢复至 SpO2 93%。她说自己的公寓要上一层楼，不知道自己能否做到。回床休息 5 分钟后：HR 96，RR 24，室内空气 SpO2 92%。08:45，床位管理询问该床是否能在 11:00 空出，因为急诊有 3 名患者在等待监护床位。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_unsafe_premature_discharge_01_q1"},"highlight","segments",{"id":"q1_s7"},"zh"],
    before: "患者无法说明 torsemide 的用途、体重突然增加时该怎么做，或哪些症状需要联系医护人员。",
    after: "患者无法说明托拉塞米的用途、体重突然增加时该怎么做，或哪些症状需要联系医护人员。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_unsafe_premature_discharge_01_q1"},"highlight","segments",{"id":"q1_s8"},"zh"],
    before: "新的利尿剂每月自付 95 美元，而药费负担正是她之前停用 furosemide 的原因。",
    after: "新的利尿剂每月自付 95 美元，而药费负担正是她之前停用呋塞米的原因。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
