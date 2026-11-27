/**
 * R2 D-2 tranche 14, unit 12: zh-only meaning repair for gemini_c10_04 (banks/gemini-canonical.json questions[287]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T14/producer/12/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_c10_04";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["matrix","rows",{"id":"r4"},"zh"],
    before: "由 SSRIs 或 MAOIs 诱发。",
    after: "由 SSRI 类或 MAOI 类药物诱发。",
  }),
  setValue({
    id: ID, path: ["rationale","correct","zh"],
    before: "NMS 的特征是“铅管样”强直，由多巴胺耗竭（抗精神病药物）引起。5-羟色胺综合征的特征是反射亢进、肌阵挛，由 5-羟色胺过量（SSRIs 等）引起。两者都会引起发烧和意识状态改变。",
    after: "NMS 的特征是“铅管样”强直，由多巴胺耗竭（抗精神病药物）引起。5-羟色胺综合征的特征是反射亢进、肌阵挛，由 5-羟色胺过量（SSRI 类药物等）引起。两者都会引起发烧和意识状态改变。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
