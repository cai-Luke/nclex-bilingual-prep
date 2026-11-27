/**
 * R2 D-2 tranche 14, unit 20: zh-only meaning repair for gemini_d2_doac_01 (banks/gemini-canonical.json questions[395]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T14/producer/20/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_d2_doac_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"D"},"zh"],
    before: "华法林需要常规监测 INR，但阿哌沙班等 DOACs 不需要。",
    after: "华法林需要常规监测 INR，但阿哌沙班等直接口服抗凝药物（DOAC）不需要。",
  }),
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"C"},"zh"],
    before: "服药依从性对 DOACs 至关重要，因为如果漏服，其抗凝作用会迅速消失。",
    after: "服药依从性对直接口服抗凝药物（DOAC）至关重要，因为如果漏服，其抗凝作用会迅速消失。",
  }),
  setValue({
    id: ID, path: ["testTakingStrategy","zh"],
    before: "区分华法林和 DOACs（阿哌沙班、利伐沙班）。DOACs 不需要频繁的血液监测或维生素 K 饮食限制，但由于半衰期短，需要严格遵守服药规定。",
    after: "区分华法林和直接口服抗凝药物（DOAC，如阿哌沙班、利伐沙班）。DOAC 不需要频繁的血液监测或维生素 K 饮食限制，但由于半衰期短，需要严格遵守服药规定。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
