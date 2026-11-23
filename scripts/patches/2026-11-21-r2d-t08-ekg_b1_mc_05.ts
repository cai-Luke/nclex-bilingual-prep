/**
 * R2 D-2 tranche 8, unit 14: zh-only meaning repair for ekg_b1_mc_05 (banks/visual-canonical.json questions[7]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T08/producer/14/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "ekg_b1_mc_05";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"D"},"zh"],
    before: "正确。胰高血糖素是β受体阻滞剂中毒的解毒剂，因为它能通过非β受体通路刺激cAMP的产生。",
    after: "正确。胰高血糖素是β受体阻滞剂中毒的解毒剂，因为它能通过非β受体通路刺激环磷酸腺苷（cAMP）的产生。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
