/**
 * R2 D-2 tranche 3, unit 03: zh-only meaning repair for gpt_balance5_2026_07_16_bt_cardiovascular_endocrine_medications_12 (banks/gpt-canonical.json questions[607]).
 * Producer: Codex gpt-6.2-astra high, Astra route per CT-5(f). Checker: fresh Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T03/producer/03/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_balance5_2026_07_16_bt_cardiovascular_endocrine_medications_12";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["bowtie","actions","tokens",{"id":"q12_a2"},"zh"],
    before: "确保从最后一次 lisinopril 到第一次 sacubitril/valsartan 至少间隔 36 小时",
    after: "确保从末次给予赖诺普利到首次给予沙库巴曲缬沙坦至少间隔 36 小时",
  }),
  setValue({
    id: ID, path: ["bowtie","actions","tokens",{"id":"q12_a3"},"zh"],
    before: "现在给予一半 sacubitril/valsartan 剂量，以缩短洗脱期",
    after: "现在给予半量沙库巴曲缬沙坦，以缩短洗脱期",
  }),
  setValue({
    id: ID, path: ["bowtie","actions","tokens",{"id":"q12_a1"},"zh"],
    before: "暂缓 sacubitril/valsartan，并澄清转换医嘱",
    after: "暂缓本次沙库巴曲缬沙坦给药，并核实换药医嘱",
  }),
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"q12_a2"},"zh"],
    before: "药品说明书要求从 ACE 抑制剂转换为 sacubitril/valsartan 时至少间隔 36 小时。",
    after: "药品说明书要求从 ACE 抑制剂转换为 沙库巴曲缬沙坦 时至少间隔 36 小时。",
  }),
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"q12_p2"},"zh"],
    before: "Sacubitril/valsartan 会降低血压并可引起症状性低血压，因此必须评估临床耐受性。",
    after: "沙库巴曲缬沙坦可降低血压，并可能引起症状性低血压，因此必须评估患者的耐受情况。",
  }),
  setValue({
    id: ID, path: ["rationale","correct","zh"],
    before: "Sacubitril/valsartan 不得在使用 ACE 抑制剂后的 36 小时内给药。仅间隔 12 小时时，护士应暂缓并澄清医嘱，确保完成整个洗脱期。安全开始用药后，应重点监测血管性水肿和血压耐受性。",
    after: "使用 ACE 抑制剂后 36 小时内不得给予沙库巴曲缬沙坦。目前仅过去 12 小时，护士应暂缓给药并核实医嘱，确保完成整个洗脱期。安全开始用药后，应重点监测有无血管性水肿，评估血压变化和患者的耐受情况。",
  }),
  setValue({
    id: ID, path: ["stem","zh"],
    before: "一名心力衰竭患者现在应使用 sacubitril/valsartan。用药记录显示最后一次 lisinopril 给药是在 12 小时前。患者目前没有血管性水肿，血流动力学稳定。请完成蝴蝶结图。",
    after: "一名心力衰竭患者已到沙库巴曲缬沙坦的给药时间。给药记录显示，末次给予赖诺普利是在 12 小时前。患者目前无血管性水肿，血流动力学稳定。请完成蝴蝶结图。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
