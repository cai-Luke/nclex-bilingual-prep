import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gpt_format9c_noisy_respiratory_secretions";
export const ops: PatchOp[] = [
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "en"],
    before: "For dropdown 1, pooled secretions fit the upper-airway rattle without distress; dyspnea would involve subjective or observable breathing discomfort, and pulmonary edema would require supporting pulmonary findings.",
    after: "Pooled secretions fit the upper-airway rattle without distress; dyspnea would involve subjective or observable breathing discomfort, and pulmonary edema would require supporting pulmonary findings.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "zh"],
    before: "第 1 空中，无不适的上气道咕噜声符合分泌物积聚；呼吸困难应有主观或可观察的呼吸不适，肺水肿则需要相应肺部证据。",
    after: "无不适的上气道咕噜声符合分泌物积聚；呼吸困难应有主观或可观察的呼吸不适，肺水肿则需要相应肺部证据。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "en"],
    before: "For dropdown 2, the family should be told honestly that the sound is often upsetting to hear but is unlikely to discomfort the dying person; it does not prove choking or guarantee pain.",
    after: "The family should be told honestly that the sound is often upsetting to hear but is unlikely to discomfort the dying person; it does not prove choking or guarantee pain.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "zh"],
    before: "第 2 空中，应如实告诉家属：声音常让听者难受，但不太可能使临终患者不适；它不能证明窒息，也不意味着一定疼痛。",
    after: "应如实告诉家属：声音常让听者难受，但不太可能使临终患者不适；它不能证明窒息，也不意味着一定疼痛。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "3" }, "en"],
    before: "For dropdown 3, assessment, repositioning, and mouth care are appropriate initial measures; routine deep suction can cause burden, and medication is not automatic solely because the sound is present.",
    after: "Assessment, repositioning, and mouth care are appropriate initial measures; routine deep suction can cause burden, and medication is not automatic solely because the sound is present.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "3" }, "zh"],
    before: "第 3 空中，评估、改变体位及口腔护理是适当的初始措施；常规深部吸引可能增加负担，也不能仅因声音存在就自动用药。",
    after: "评估、改变体位及口腔护理是适当的初始措施；常规深部吸引可能增加负担，也不能仅因声音存在就自动用药。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
