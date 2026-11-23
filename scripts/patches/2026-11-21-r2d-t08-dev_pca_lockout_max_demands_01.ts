/**
 * R2 D-2 tranche 8, unit 12: zh-only meaning repair for dev_pca_lockout_max_demands_01 (banks/device-canonical.json questions[1]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T08/producer/12/declared-surface.json (round 1);
 * HOLD return 1 revises only the fields in scratch/dogfood-r2-2026-11-20/D-2/T08/return-1/12/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "dev_pca_lockout_max_demands_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["rationale","correct","zh"],
    before: "锁定间隔为8分钟。1小时内最多给予的需求剂量次数 = floor(60 ÷ 8) = floor(7.5) = 7次。不完整的间隔不能再给予一次完整剂量。",
    after: "锁定间隔为8分钟。1小时内最多给予的需求剂量次数 = 向下取整(60 ÷ 8) = 向下取整(7.5) = 7次。不完整的间隔不能再给予一次完整剂量。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
