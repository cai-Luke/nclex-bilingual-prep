/**
 * R2 D-2 T08 follow-up 1 (AM-10, NF-D8-1): zh-only meaning repair for cs_sepsis_shock_01 (banks/hard-cases-canonical.json questions[36]).
 * The triage_vitals exhibit zh rendered the English "Alert to person only" (orientation to person only) as
 * 仅对人有反应 ("responds only to people"). It now reads 仅对人物有定向力. Every other byte of the exhibit is unchanged.
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f) and AM-10. Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T08/followup-1/producer/declared-surface.json.
 * Only one zh leaf changes. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "cs_sepsis_shock_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","exhibits",{"id":"triage_vitals"},"content","zh"],
    before: "生命体征：\n- 体温：102.0 °F (38.9 °C)\n- 心率：118次/分钟\n- 呼吸频率：24次/分钟\n- 血压：94/52 mmHg\n- 血氧饱和度：室内空气下为91%\n\n神经系统：\n- 仅对人有反应，对时间和地点定向障碍。烦躁不安。\n\n皮肤：\n- 温暖、潮红、干燥。\n\n尿液：\n- 深琥珀色，浑浊，有浓烈气味。",
    after: "生命体征：\n- 体温：102.0 °F (38.9 °C)\n- 心率：118次/分钟\n- 呼吸频率：24次/分钟\n- 血压：94/52 mmHg\n- 血氧饱和度：室内空气下为91%\n\n神经系统：\n- 仅对人物有定向力，对时间和地点定向障碍。烦躁不安。\n\n皮肤：\n- 温暖、潮红、干燥。\n\n尿液：\n- 深琥珀色，浑浊，有浓烈气味。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
