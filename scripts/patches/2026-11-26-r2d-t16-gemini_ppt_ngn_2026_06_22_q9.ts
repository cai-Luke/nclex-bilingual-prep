/**
 * R2 D-2 tranche 16, unit 13: zh-only meaning repair for gemini_ppt_ngn_2026_06_22_q9 (banks/gemini-canonical.json questions[840]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T16/producer/13/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_ppt_ngn_2026_06_22_q9";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"cond_serotonin"},"zh"],
    before: "5-羟色胺综合征由 MAOIs 与 5-羟色胺能药物合用引起，而非简单由饮食中的苯丙氨酸引起。",
    after: "5-羟色胺综合征由 MAOI 类药物与 5-羟色胺能药物合用引起，而非简单由饮食中的苯丙氨酸引起。",
  }),
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"cond_tardive"},"zh"],
    before: "迟发性运动障碍是多巴胺受体拮抗剂（抗精神病药）的并发症，不是 MAOIs 的并发症。",
    after: "迟发性运动障碍是多巴胺受体拮抗剂（抗精神病药）的并发症，不是 MAOI 类药物的并发症。",
  }),
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"act_check_otc"},"zh"],
    before: "非处方减充血药含有拟交感神经药，与 MAOIs 相互作用会引起危险的血压飙升。",
    after: "非处方减充血药含有拟交感神经药，与 MAOI 类药物相互作用会引起危险的血压飙升。",
  }),
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"param_liver"},"zh"],
    before: "MAOIs 通过肝脏代谢，可引起药物诱导性肝炎；肝功能检查可评估肝毒性。",
    after: "MAOI 类药物通过肝脏代谢，可引起药物诱导性肝炎；肝功能检查可评估肝毒性。",
  }),
  setValue({
    id: ID, path: ["rationale","correct","zh"],
    before: "像苯乙肼这样的 MAOIs 会阻止酪胺的分解。摄入富含酪胺的食物（陈年奶酪、肉类、红葡萄酒、生啤酒）会导致严重的血管收缩和危及生命的高血压危象。许多非处方（OTC）感冒/咳嗽药含有拟交感神经药（如伪麻黄碱），会产生协同作用导致严重高血压，因此必须核对。护士必须监测血压并汇报严重头痛（高血压危象的首要症状）。由于 MAOIs 具有肝毒性风险，还需要定期监测肝功能酶（AST/ALT）。肾功能和视力不是首要的监测参数。",
    after: "像苯乙肼这样的 MAOI 类药物会阻止酪胺的分解。摄入富含酪胺的食物（陈年奶酪、腌制/陈年肉类、红葡萄酒、生啤酒）会导致严重的血管收缩和危及生命的高血压危象。许多非处方（OTC）感冒/咳嗽药含有拟交感神经药（如伪麻黄碱），会产生协同作用导致严重高血压，因此必须核对。护士必须监测血压并汇报严重头痛（高血压危象的首要症状）。由于 MAOI 类药物具有肝毒性风险，还需要定期监测肝功能酶（AST/ALT）。肾功能和视力不是首要的监测参数。",
  }),
  setValue({
    id: ID, path: ["testTakingStrategy","zh"],
    before: "将 MAOIs（苯乙肼、反苯环丙胺、异卡波肼）与严格的低酪胺饮食（避免陈年奶酪、熏肉）和伪麻黄碱相互作用联系起来，以预防高血压危象。",
    after: "将 MAOI 类药物（苯乙肼、反苯环丙胺、异卡波肼）与严格的低酪胺饮食（避免陈年奶酪、腌制肉类）和伪麻黄碱相互作用联系起来，以预防高血压危象。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
