/**
 * R2 D-2 tranche 15, unit 12: zh-only meaning repair for gemini_gapfill_case_2026_06_10_case_imm_01 (banks/gemini-canonical.json questions[756]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T15/producer/12/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_gapfill_case_2026_06_10_case_imm_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gemini_gapfill_case_2026_06_10_case_imm_01_q2"},"rationale","byChoice",{"refId":"o5"},"zh"],
    before: "Tdap或Td建议每10年接种一次；在缺乏免疫接种记录的情况下，若患者已到接种时间或接种史不明，护士应预计需要接种。",
    after: "百白破(Tdap)或破伤风-白喉(Td)疫苗建议每10年接种一次；在缺乏免疫接种记录的情况下，若患者已到接种时间或接种史不明，护士应预计需要接种。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gemini_gapfill_case_2026_06_10_case_imm_01_q2"},"rationale","correct","zh"],
    before: "≥65岁的成人需要接种高剂量流感、肺炎球菌、带状疱疹和Tdap（如果到期）疫苗。HPV疫苗不适用于该年龄段。",
    after: "≥65岁的成人需要接种高剂量流感、肺炎球菌、带状疱疹和百白破(Tdap)疫苗（如果到期）。HPV疫苗不适用于该年龄段。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
