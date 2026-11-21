import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gpt_case_taco_vs_trali_01_bowtie";

export const ops: PatchOp[] = [
  setValue({
    id,
    path: ["stem", "en"],
    before: "After the transfusion is stopped, a 74-year-old client with CKD and compensated heart failure has improving dyspnea after oxygen, upright positioning, and ordered IV furosemide. During the second unit she developed SpO2 89% on room air, BP 168/96, JVD, new S3, worsening 2+ edema, oliguria, and bilateral crackles. Chest X-ray shows pulmonary vascular congestion, small pleural effusions, cardiomegaly, and a widened vascular pedicle. BNP rose from 280 to 890 pg/mL. Complete the bow-tie by selecting the most likely condition, two priority actions, and two parameters to monitor.",
    after: "A 74-year-old client with chronic kidney disease and compensated heart failure develops dyspnea during the second unit of a blood transfusion. The nurse stops the transfusion. SpO₂ is 89% on room air and blood pressure is 168/96 mm Hg. Findings include jugular venous distention, a new S3, worsening 2+ edema, oliguria, and bilateral crackles. Chest X-ray shows pulmonary vascular congestion, small pleural effusions, cardiomegaly, and a widened vascular pedicle. BNP has risen from 280 to 890 pg/mL. Select the most likely condition, two priority actions to take now, and two parameters to monitor for improvement.",
  }),
  setValue({
    id,
    path: ["stem", "zh"],
    before: "停止输血后，一名74岁慢性肾病并代偿期心衰患者在吸氧、坐位和按医嘱IV呋塞米后气短有所改善。第二单位输注期间，她出现室内空气SpO2 89%、BP 168/96、颈静脉怒张、新S3、2+水肿加重、少尿和双侧湿啰音。胸片显示肺血管淤血、少量胸腔积液、心影增大和血管蒂增宽。BNP从280升至890 pg/mL。请完成弓形题：选择最可能状况、两个优先措施和两个需要监测的参数。",
    after: "一名 74 岁患者有慢性肾病和代偿期心力衰竭，输注第 2 单位血液制品时出现呼吸困难。护士已停止输血。患者呼吸室内空气时 SpO₂ 为 89%，血压为 168/96 mm Hg。评估发现颈静脉怒张、新出现的第三心音、加重的 2+ 水肿、少尿和双肺湿啰音。胸片显示肺血管淤血、少量胸腔积液、心影增大和血管蒂增宽。BNP 由 280 升至 890 pg/mL。请选择最可能的病情、目前应优先采取的两项措施，以及用于判断病情是否改善的两个监测指标。",
  }),
  setValue({
    id,
    path: ["bowtie", "actions", "tokens", {"id": "act_oxygen_position"}, "en"],
    before: "Maintain high Fowler's position with supplemental oxygen and close respiratory monitoring",
    after: "Place the client in high Fowler’s position, provide supplemental oxygen, and monitor respiratory status closely",
  }),
  setValue({
    id,
    path: ["bowtie", "actions", "tokens", {"id": "act_oxygen_position"}, "zh"],
    before: "维持高Fowler体位、补充氧并密切监测呼吸状态",
    after: "协助患者取高坐卧位，给予氧疗，并密切监测呼吸状况",
  }),
  setValue({
    id,
    path: ["rationale", "correct", "en"],
    before: "The condition is TACO because the respiratory compromise occurs with hypertension, elevated filling-pressure findings, peripheral edema, pulmonary vascular congestion, cardiomegaly, BNP rise, and response to diuresis. Priorities are oxygenation/positioning and ordered diuresis with urine-output monitoring. The most useful monitoring parameters are oxygenation with weaning ability and urine output, because they track pulmonary improvement and volume removal.",
    after: "The onset of dyspnea during transfusion, together with hypertension, jugular venous distention, worsening edema, pulmonary vascular congestion, and a rise in BNP, points to transfusion-associated circulatory overload (TACO). Upright positioning and supplemental oxygen support breathing. Ordered diuresis helps remove excess fluid. Follow oxygen saturation and the need for supplemental oxygen to assess breathing, and follow urine output to assess the diuretic response.",
  }),
  setValue({
    id,
    path: ["rationale", "correct", "zh"],
    before: "最可能状况是TACO，因为呼吸受损同时伴高血压、充盈压升高表现、外周水肿、肺血管淤血、心影增大、BNP升高以及利尿后改善。优先措施是改善氧合/体位和按医嘱利尿并监测尿量。最有用的监测参数是氧合及能否降阶氧疗、尿量，因为它们反映肺部改善和容量排出。",
    after: "输血期间出现呼吸困难，同时伴有血压升高、颈静脉怒张、水肿加重、肺血管淤血及 BNP 升高，提示输血相关循环超负荷（TACO）。取坐位和吸氧有助于改善呼吸，按医嘱利尿有助于排出多余液体。监测血氧饱和度和补充氧气的需要以评估呼吸状况，并监测尿量以判断利尿效果。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", {"refId": "cond_taco"}, "en"],
    before: "Correct. This token matches the full overload pattern: hypertension, JVD, S3, edema, vascular congestion, BNP rise, and diuretic response.",
    after: "Hypertension, jugular venous distention, a new S3, worsening edema, and pulmonary vascular congestion point to excess circulatory volume. The rise in BNP supports that interpretation.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", {"refId": "cond_taco"}, "zh"],
    before: "正确。此项符合完整超负荷模式：高血压、颈静脉怒张、S3、水肿、血管淤血、BNP升高和利尿反应。",
    after: "血压升高、颈静脉怒张、新出现的第三心音、水肿加重及肺血管淤血均提示循环容量过多。BNP 升高也支持这一判断。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runPatch(ops);
}
