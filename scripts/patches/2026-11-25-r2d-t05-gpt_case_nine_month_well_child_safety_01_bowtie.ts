/**
 * R2 D-2 tranche 5, unit 02: zh-only meaning repair for gpt_case_nine_month_well_child_safety_01_bowtie (banks/gpt-canonical.json questions[349]).
 * Producer: Codex gpt-6.2-astra high. Independent checker route: Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T05/producer/02/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_case_nine_month_well_child_safety_01_bowtie";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["stem","zh"],
    before: "Liam 进行 9 个月婴儿保健访视期间，他伸手去够一个化妆包，包内有一瓶未盖好瓶盖的液体对乙酰氨基酚。护士立即将化妆包和药物移到 Liam 无法触及之处。他的照护者 Danielle 对 Liam 温暖且细心，并主动说明自己如何给药。她说着说着流下眼泪，表示自己缺少可靠的支持或指导，之前听从了非正式建议。Danielle 报告曾给 Liam 服用 15 mL、浓度为 160 mg/5 mL 的对乙酰氨基酚；诊所病历中的体重分档剂量表为 Liam 列出的剂量是 3.75 mL。目前病历尚未记录最近一次 15 mL 给药的时间、这种剂量给了几次，也未记录 Liam 是否还服用了其他含对乙酰氨基酚的产品。请完成弓形题：选择最可能的状况、两项优先护理措施和两项用于评价的参数。",
    after: "Liam 进行 9 个月婴儿保健访视期间，他伸手去够一个化妆包，包内有一瓶未盖好瓶盖的液体对乙酰氨基酚。护士立即将化妆包和药物移到 Liam 无法触及之处。他的照护者 Danielle 对 Liam 温暖且细心，并主动说明自己如何给药。她说着说着流下眼泪，表示自己缺少可靠的支持或指导，之前听从了非正式建议。Danielle 报告曾给 Liam 服用 15 mL、浓度为 160 mg/5 mL 的对乙酰氨基酚；诊所病历中的体重分档剂量表为 Liam 列出的剂量是 3.75 mL。目前病历尚未记录最近一次 15 mL 给药的时间、这种剂量的给药频率，也未记录 Liam 是否还服用了其他含对乙酰氨基酚的产品。请完成弓形题：选择最可能的状况、两项优先护理措施和两项用于评价的参数。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
