/**
 * R2 D-2 tranche 6, unit 03: zh-only meaning repair for gpt_case_pe_2026_06_16_case_pulmonary_embolism_01 (banks/hard-cases-canonical.json questions[54]).
 * Producer: Codex gpt-6.2-astra high. Independent checker route: Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T06/producer/03/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_case_pe_2026_06_16_case_pulmonary_embolism_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage2"},"exhibits",{"id":"stage2_update"},"content","zh"],
    before: "急查结果：肌钙蛋白I 0.38 ng/mL，BNP 620 pg/mL，D-二聚体 >5,000 ng/mL FEU，血红蛋白11.4 g/dL，血小板192 ×10³/µL，aPTT 29秒，INR 1.0，肌酐1.0 mg/dL，钾4.3 mEq/L，乳酸3.2 mmol/L。非再呼吸面罩下ABG：pH 7.47，PaCO2 28 mmHg，PaO2 68 mmHg，HCO3 20 mEq/L，SaO2 93%。胸片未见浸润、气胸或胸腔积液。CT肺动脉造影显示大型骑跨型肺栓塞，延伸至双侧肺叶动脉，RV/LV比值1.4，室间隔向左心室弓形移位；未见主动脉夹层内膜片。医嘱按本机构PE方案给予UFH：80 units/kg静脉推注，随后18 units/kg/hr持续泵入，每6小时监测aPTT，目标aPTT 60-80秒。骨科医师确认手术部位无活动性出血。护士于09:20给予推注并开始泵入。09:30复查生命体征：HR 118次/分，BP 98/66 mmHg，RR 28次/分，非再呼吸面罩下SpO2 93%。过去1小时尿量20 mL。",
    after: "急查结果：肌钙蛋白I 0.38 ng/mL，脑钠肽（BNP）620 pg/mL，D-二聚体 >5,000 ng/mL FEU，血红蛋白11.4 g/dL，血小板192 ×10³/µL，aPTT 29秒，INR 1.0，肌酐1.0 mg/dL，钾4.3 mEq/L，乳酸3.2 mmol/L。使用非再呼吸面罩时的动脉血气分析：pH 7.47，PaCO2 28 mmHg，PaO2 68 mmHg，HCO3 20 mEq/L，SaO2 93%。胸片未见浸润、气胸或胸腔积液。CT肺动脉造影显示大型骑跨型肺栓塞，延伸至双侧肺叶动脉，右/左心室比值1.4，室间隔向左心室弓形移位；未见主动脉夹层内膜片。医嘱按本机构肺栓塞方案给予普通肝素（UFH）：80 单位/kg静脉推注，随后18 单位/kg/hr持续泵入，每6小时监测aPTT，目标aPTT 60-80秒。骨科医师确认手术部位无活动性出血。护士于09:20给予推注并开始泵入。09:30复查生命体征：HR 118次/分，BP 98/66 mmHg，RR 28次/分，非再呼吸面罩下SpO2 93%。过去1小时尿量20 mL。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage3"},"exhibits",{"id":"stage3_update"},"content","zh"],
    before: "肺科团队将PE归类为中危/次大面积PE，因为有右心负荷增加和心肌标志物阳性，但没有持续性收缩压低于90 mmHg。由于患者血流动力学稳定且为大型骨科手术后第2天，未给予全身溶栓。计划转入ICU、继续治疗剂量UFH、严密监测，并在出现持续低血压或梗阻性休克时升级处理。10:00：胸痛6/10，HR 112次/分，BP 102/70 mmHg，RR 26次/分，非再呼吸面罩下SpO2 94%，30分钟尿量25 mL。12:00：HR 106次/分，BP 108/72 mmHg，RR 24次/分，非再呼吸面罩下SpO2 95%，胸痛4/10，能说完整句子，过去2小时尿量35 mL/hr。手术敷料仍清洁、干燥、完整。13:30：肌钙蛋白I 0.42 ng/mL，乳酸2.4 mmol/L。首次aPTT计划15:20抽血，24小时后计划复查超声心动图。",
    after: "肺科团队将此次肺栓塞归为中危（次大面积）肺栓塞，因为有右心负荷增加和心肌标志物阳性，但没有持续性收缩压低于90 mmHg。由于患者血流动力学稳定且为大型骨科手术后第2天，未给予全身溶栓。计划转入ICU、继续给予治疗剂量的普通肝素、严密监测，并在出现持续低血压或梗阻性休克时升级处理。10:00：胸痛6/10，HR 112次/分，BP 102/70 mmHg，RR 26次/分，非再呼吸面罩下SpO2 94%，30分钟尿量25 mL。12:00：HR 106次/分，BP 108/72 mmHg，RR 24次/分，非再呼吸面罩下SpO2 95%，胸痛4/10，能说完整句子，过去2小时尿量35 mL/hr。手术敷料仍清洁、干燥、完整。13:30：肌钙蛋白I 0.42 ng/mL，乳酸2.4 mmol/L。首次aPTT计划15:20抽血，24小时后计划复查超声心动图。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q5"},"options",{"id":"E"},"zh"],
    before: "将患者置于平卧位或Trendelenburg位，以增加静脉回流并改善血压。",
    after: "将患者置于平卧位或头低足高位，以增加静脉回流并改善血压。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q5"},"options",{"id":"C"},"zh"],
    before: "保持高Fowler位或半卧位。",
    after: "保持床头抬高，使患者取高坐卧位或半卧位。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q5"},"rationale","byChoice",{"refId":"E"},"zh"],
    before: "平卧或Trendelenburg位可能加重右心室扩张，并在梗阻性生理状态下降低左心室充盈。",
    after: "平卧或头低足高位可能加重右心室扩张，并在梗阻性生理状态下降低左心室充盈。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q2"},"matrix","rows",{"id":"r4"},"zh"],
    before: "非再呼吸面罩下ABG显示pH 7.47、PaCO2 28、PaO2 68",
    after: "使用非再呼吸面罩时，动脉血气分析显示pH 7.47、PaCO2 28、PaO2 68",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
