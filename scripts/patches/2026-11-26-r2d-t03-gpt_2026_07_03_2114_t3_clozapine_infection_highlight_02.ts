/**
 * R2 D-2 tranche 3, unit 02: zh-only meaning repair for gpt_2026_07_03_2114_t3_clozapine_infection_highlight_02 (banks/gpt-canonical.json questions[552]).
 * Producer: Codex gpt-6.2-astra high, Astra route per CT-5(f). Checker: fresh Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T03/producer/02/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_2026_07_03_2114_t3_clozapine_infection_highlight_02";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["highlight","segments",{"id":"s2"},"zh"],
    before: "患者因 treatment-resistant schizophrenia 服用 clozapine。",
    after: "患者因难治性精神分裂症服用氯氮平。",
  }),
  setValue({
    id: ID, path: ["highlight","segments",{"id":"s4"},"zh"],
    before: "患者报告新出现 sore throat 和疼痛性口腔溃疡。",
    after: "患者诉新近出现咽痛和疼痛性口腔溃疡。",
  }),
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"s3"},"zh"],
    before: "发热伴寒战可能提示感染，符合 protocol 中给 clozapine 前需跟进的触发条件。",
    after: "发热伴寒战可能提示感染，符合机构规程中应在给予氯氮平前进一步评估的条件。",
  }),
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"s4"},"zh"],
    before: "新发 sore throat 和口腔溃疡可能提示有 neutropenia 风险患者发生感染。",
    after: "对于有中性粒细胞减少风险的患者，新发咽痛和口腔溃疡可能是感染的表现。",
  }),
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"s6"},"zh"],
    before: "轻度流口水可见于 clozapine，用药中需监测，但不是此 protocol 中感染或 ANC 的触发条件。",
    after: "服用氯氮平时可能出现轻度流涎，需要监测，但这一表现并不符合本规程中有关感染或绝对中性粒细胞计数的暂缓给药条件。",
  }),
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"s7"},"zh"],
    before: "因 clozapine 可导致便秘，应监测排便；但昨天排便本身不是此处紧急 protocol 触发条件。",
    after: "氯氮平可能引起便秘，因此应监测排便情况；不过，患者昨天有过排便，这本身并未达到此处规程要求紧急处理的条件。",
  }),
  setValue({
    id: ID, path: ["rationale","correct","zh"],
    before: "clozapine 可导致 severe neutropenia，并增加严重感染风险。根据题干给出的 protocol，发热伴寒战、新发 sore throat 或口腔溃疡，以及 ANC 850/uL 都要求给药前暂缓剂量并通知开方者。",
    after: "氯氮平可能导致严重中性粒细胞减少，增加严重感染的风险。根据所述规程，发热伴寒战、新发咽痛或口腔溃疡，以及绝对中性粒细胞计数为 850/uL，均提示应暂缓本次给药并通知处方医师。",
  }),
  setValue({
    id: ID, path: ["stem","zh"],
    before: "给药记录显示 clozapine 200 mg 睡前口服。机构 protocol 规定：若出现感染迹象或 absolute neutrophil count 低于 1,000/uL，应暂缓 clozapine 并通知开方者。请标出今晚给药前需要跟进的发现。",
    after: "给药记录显示，患者睡前口服氯氮平 200 mg。本机构规程规定，若出现感染迹象或绝对中性粒细胞计数低于 1,000/uL，应暂缓给予氯氮平并通知处方医师。请标出今晚给药前需要进一步评估的发现。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
