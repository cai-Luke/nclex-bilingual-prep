/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_backfill_bt_wellness_09 (banks/gemini-canonical.json questions[793]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) a3d5e6e9545766ccbcf2b0e7df841d0f9786e521c7f0fbe5ef1e2fa674171649. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_backfill_bt_wellness_09";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "The client has multiple lifestyle, immunization, and pharmacological coordination gaps, which fit the diagnosis of Ineffective health maintenance (c1). Impaired gas exchange (c2) is a physiological nursing diagnosis, which is not the primary focus of a routine wellness screening. Deficient knowledge (c3) is too narrow and doesn't fully capture the clinical need for preventative immunizations and lifestyle modifications. The priority nursing actions are: 1) Provide education on using a spacer with the MDI (a1) to ensure the medication is deposited in the lungs instead of the oropharynx, improving drug absorption. 2) Administer recommended preventative immunizations (PCV20 and influenza vaccine) (a2) to protect this high-risk COPD client from respiratory infections. Instructing the client to quit cold turkey without cessation support (a3) is ineffective. Rescue albuterol should only be used as-needed (PRN) for acute symptoms, not scheduled daily (a4). Key monitoring parameters include direct observation of MDI/spacer technique (p1) to confirm learning, and tracking smoking cessation progress (p2). ABGs (p3) and sputum cultures (p4) are not indicated for baseline wellness screening in a stable client.",
    after: "The client has multiple lifestyle, immunization, and pharmacological coordination gaps, which fit the diagnosis of Ineffective health maintenance. Impaired gas exchange is a physiological nursing diagnosis, which is not the primary focus of a routine wellness screening. Deficient knowledge is too narrow and doesn't fully capture the clinical need for preventative immunizations and lifestyle modifications. The priority nursing actions are: 1) Provide education on using a spacer with the MDI to ensure the medication is deposited in the lungs instead of the oropharynx, improving drug absorption. 2) Administer recommended preventative immunizations (PCV20 and influenza vaccine) to protect this high-risk COPD client from respiratory infections. Instructing the client to quit cold turkey without cessation support is ineffective. Rescue albuterol should only be used as-needed (PRN) for acute symptoms, not scheduled daily. Key monitoring parameters include direct observation of MDI/spacer technique to confirm learning, and tracking smoking cessation progress. ABGs and sputum cultures are not indicated for baseline wellness screening in a stable client.",
    note: "R2 B-2R P4 reference rewrite: 11 edit(s) covering 11 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "患者在生活方式、疫苗接种和药物协调方面存在多项差距，这符合低效健康维护 (c1) 的诊断。气体交换受损 (c2) 属于生理性护理诊断，并非常规健康筛查的主要焦点。知识缺乏 (c3) 过于局限，不能完全涵盖对预防性免疫接种和生活方式调整的临床需求。优先的护理措施是：1) 提供使用储雾罐配合 MDI 的教育 (a1)，以确保药物沉积在肺部而非口咽部，从而改善药物吸收。2) 给予推荐的预防性疫苗（PCV20 和流感疫苗）(a2)，以保护这名高危 COPD 患者免受呼吸道感染。指导患者在没有任何戒烟支持的情况下硬性戒烟 (a3) 是无效的。急救用沙丁胺醇应仅在急性症状发作时按需使用（PRN），不能每日定时计划使用 (a4)。关键的监测参数包括直接观察 MDI/储雾罐使用技术 (p1) 以确认学习效果，以及追踪戒烟进展 (p2)。动脉血气分析 (p3) 和痰培养 (p4) 不适用于稳定患者的基线健康维护监测。",
    after: "患者在生活方式、疫苗接种和药物协调方面存在多项差距，这符合低效健康维护的诊断。气体交换受损属于生理性护理诊断，并非常规健康筛查的主要焦点。知识缺乏过于局限，不能完全涵盖对预防性免疫接种和生活方式调整的临床需求。优先的护理措施是：1) 提供使用储雾罐配合 MDI 的教育，以确保药物沉积在肺部而非口咽部，从而改善药物吸收。2) 给予推荐的预防性疫苗（PCV20 和流感疫苗），以保护这名高危 COPD 患者免受呼吸道感染。指导患者在没有任何戒烟支持的情况下硬性戒烟是无效的。急救用沙丁胺醇应仅在急性症状发作时按需使用（PRN），不能每日定时计划使用。关键的监测参数包括直接观察 MDI/储雾罐使用技术以确认学习效果，以及追踪戒烟进展。动脉血气分析和痰培养不适用于稳定患者的基线健康维护监测。",
    note: "R2 B-2R P4 reference rewrite: 11 edit(s) covering 11 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
