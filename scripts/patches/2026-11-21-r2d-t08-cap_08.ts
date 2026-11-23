/**
 * R2 D-2 tranche 8, unit 08: zh-only meaning repair for cap_08 (banks/capnography-canonical.json questions[5]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T08/producer/08/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "cap_08";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["stem","zh"],
    before: "一名年轻成年患者出现急性焦虑、手指麻木和呼吸急促。护士连接了EtCO2监护仪并观察到以下波形。下列哪种情况与此表现最一致？",
    after: "一名年轻成年患者出现急性焦虑、手指麻木和呼吸急促。护士连接了呼气末二氧化碳（EtCO2）监护仪并观察到以下波形。下列哪种情况与此表现最一致？",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
