/**
 * R2 D-2 tranche 8, unit 13: zh-only meaning repair for dev_pca_max_dose_basal_01 (banks/device-canonical.json questions[2]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T08/producer/13/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "dev_pca_max_dose_basal_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["rationale","correct","zh"],
    before: "锁定间隔为10分钟，因此1小时内最多可给予 floor(60 ÷ 10) = 6次需求剂量。6次 × 0.2 mg = 1.2 mg。由于屏幕显示PCA+基础输注模式，还要加上0.2 mg/hr的基础输注：1.2 + 0.2 = 1.4 mg。",
    after: "锁定间隔为10分钟，因此1小时内最多可给予 60 ÷ 10 = 6次需求剂量（结果向下取整）。6次 × 0.2 mg = 1.2 mg。由于屏幕显示PCA+基础输注模式，还要加上0.2 mg/hr的基础输注：1.2 + 0.2 = 1.4 mg。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
