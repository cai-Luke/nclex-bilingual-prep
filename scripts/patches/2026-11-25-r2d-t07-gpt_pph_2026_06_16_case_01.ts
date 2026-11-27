/**
 * R2 D-2 tranche 7, unit 05: zh-only meaning repair for gpt_pph_2026_06_16_case_01 (banks/hard-cases-canonical.json questions[58]).
 * Producer: Codex gpt-6.2-astra high. Independent checker route: Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T07/producer/05/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_pph_2026_06_16_case_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_2"},"exhibits",{"id":"stage_2_update"},"content","zh"],
    before: "尽管持续按摩并增加催产素输注，子宫仍间歇性变硬后数秒内又松弛。定量失血 1,200 mL。生命体征：HR 132，BP 80/52，RR 26，室内空气 SpO2 95%。患者意识混乱、明显苍白，毛细血管再充盈 4 秒。医师排除胎盘碎片残留及未修补的宫颈/阴道裂伤。可用宫缩药包括甲基麦角新碱 0.2 mg IM、米索前列醇 800 mcg 经直肠给药、卡前列素 250 mcg IM。急查化验：Hgb 8.1 g/dL，Hct 24.3%，血小板 162 ×10³/µL，纤维蛋白原 280 mg/dL，INR 1.1，aPTT 30 秒。已送 2 单位 PRBC 配血。病区方案医嘱：对一线宫缩药反应不佳的产后出血，在分娩后 3 小时内给予氨甲环酸 1 g IV，10 分钟输注。",
    after: "尽管持续按摩并增加催产素输注，子宫仍间歇性变硬后数秒内又松弛。定量失血 1,200 mL。生命体征：HR 132，BP 80/52，RR 26，室内空气 SpO2 95%。患者意识混乱、明显苍白，毛细血管再充盈 4 秒。医师排除胎盘碎片残留及未修补的宫颈/阴道裂伤。可用宫缩药包括甲基麦角新碱 0.2 mg 肌内注射、米索前列醇 800 mcg 经直肠给药、卡前列素 250 mcg 肌内注射。急查化验：Hgb 8.1 g/dL，Hct 24.3%，血小板 162 ×10³/µL，纤维蛋白原 280 mg/dL，INR 1.1，aPTT 30 秒。已送检标本，进行血型鉴定和交叉配血，拟备 2 单位浓缩红细胞。病区方案医嘱：对一线宫缩药反应不佳的产后出血，在分娩后 3 小时内给予氨甲环酸 1 g，经静脉输注，历时 10 分钟。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_3"},"exhibits",{"id":"stage_3_update"},"content","zh"],
    before: "已给予米索前列醇 800 mcg 经直肠给药，氨甲环酸 1 g IV 10 分钟输注，医师进行了积极双手子宫压迫。现在子宫坚硬，位于脐水平。恶露为中等量暗红色，无血块。定量失血停留在 1,450 mL，15 分钟内无进一步活动性增加。生命体征：HR 112，BP 94/60，RR 20，鼻导管 2 L 下 SpO2 97%。患者清醒、定向力正常，但疲乏，变换体位时仍轻度头晕。第 1 单位 PRBC 正通过专用大口径 IV 输注；已医嘱随后输注第 2 单位。复查化验：Hgb 7.4 g/dL，Hct 22.1%，血小板 148 ×10³/µL，纤维蛋白原 240 mg/dL，INR 1.2，aPTT 32 秒。Foley 尿量 25 mL/hr，为浓缩琥珀色尿。继续每 15 分钟检查子宫底。",
    after: "米索前列醇 800 mcg 已经直肠给药，并在 10 分钟内静脉输注氨甲环酸 1 g，医师积极实施双手子宫压迫。现在子宫坚硬，位于脐水平。恶露为中等量暗红色，无血块。定量测得的失血量已稳定在 1,450 mL，过去 15 分钟未见新增失血。生命体征：HR 112，BP 94/60，RR 20，鼻导管 2 L 下 SpO2 97%。患者清醒、定向力正常，但疲乏，变换体位时仍轻度头晕。第 1 单位浓缩红细胞正通过专用的大口径静脉通路输注；已医嘱随后输注第 2 单位。复查化验：Hgb 7.4 g/dL，Hct 22.1%，血小板 148 ×10³/µL，纤维蛋白原 240 mg/dL，INR 1.2，aPTT 32 秒。留置导尿管引出的尿量为 25 mL/hr，尿液浓缩，呈琥珀色。继续每 15 分钟检查子宫底。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_pph_2026_06_16_case_01_q1"},"rationale","byChoice",{"refId":"seg_resp"},"zh"],
    before: "无胸痛或气短较为 reassuring，但不能说明出血来源或严重程度。",
    after: "没有胸痛或气短是令人稍感安心的表现，但不能据此判断出血来源。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_pph_2026_06_16_case_01_q5"},"matrix","rows",{"id":"row_uop"},"zh"],
    before: "Foley 尿量为 25 mL/hr，呈浓缩琥珀色。",
    after: "留置导尿管引出的尿量为 25 mL/hr，尿液浓缩，呈琥珀色。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
