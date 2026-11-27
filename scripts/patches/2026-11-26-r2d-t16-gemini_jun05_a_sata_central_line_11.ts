/**
 * R2 D-2 tranche 16, unit 03: zh-only meaning repair for gemini_jun05_a_sata_central_line_11 (banks/gemini-canonical.json questions[10]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T16/producer/03/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_sata_central_line_11";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["rationale","correct","zh"],
    before: "为了预防 CLABSIs，护士应擦拭接头（消毒屏障擦拭 15 秒）、进行手部卫生、每 7 天更换一次透明敷料（如果松动或污染则立即更换），并每日评估导管的必要性。不推荐在穿刺部位涂抹抗生素软膏，因为这会促进真菌感染和产生耐药性。",
    after: "为了预防导管相关性血流感染（CLABSI），护士应擦拭接头（消毒屏障擦拭 15 秒）、进行手部卫生、每 7 天更换一次透明敷料（如果松动或污染则立即更换），并每日评估导管的必要性。不推荐在穿刺部位涂抹抗生素软膏，因为这会促进真菌感染和产生耐药性。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
