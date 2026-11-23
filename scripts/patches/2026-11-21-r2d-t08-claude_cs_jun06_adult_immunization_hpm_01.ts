/**
 * R2 D-2 tranche 8, unit 09: zh-only meaning repair for claude_cs_jun06_adult_immunization_hpm_01 (banks/hard-cases-canonical.json questions[31]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T08/producer/09/declared-surface.json (round 1);
 * HOLD return 1 revises only the fields in scratch/dogfood-r2-2026-11-20/D-2/T08/return-1/09/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "claude_cs_jun06_adult_immunization_hpm_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","exhibits",{"id":"history"},"content","zh"],
    before: "2型糖尿病,服用二甲双胍。无已知免疫缺陷。免疫接种情况:上次Td/Tdap为12年前;本季未接种流感疫苗;未接种肺炎球菌疫苗;未接种带状疱疹疫苗。从未进行结直肠癌筛查。不吸烟。",
    after: "2型糖尿病,服用二甲双胍。无已知免疫缺陷。免疫接种情况:上次接种破伤风-白喉疫苗(Td)/百白破成人型疫苗(Tdap)为12年前;本季未接种流感疫苗;未接种肺炎球菌疫苗;未接种带状疱疹疫苗。从未进行结直肠癌筛查。不吸烟。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"claude_cs_jun06_adult_immunization_hpm_01_part_3"},"rationale","byChoice",{"refId":"D"},"zh"],
    before: "Tdap为灭活疫苗,推荐每次妊娠期接种;避免接种是错误的。",
    after: "百白破成人型疫苗(Tdap)为灭活疫苗,推荐每次妊娠期接种;避免接种是错误的。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"claude_cs_jun06_adult_immunization_hpm_01_part_3"},"rationale","correct","zh"],
    before: "减毒活疫苗(如麻腮风疫苗、水痘疫苗、鼻喷活流感疫苗)在妊娠期及如接受化疗等明显免疫低下患者中属禁忌,因为减毒的病原体可能致病。而灭活疫苗如注射型流感疫苗和Tdap不仅安全,且在妊娠期推荐接种。",
    after: "减毒活疫苗(如麻腮风疫苗、水痘疫苗、鼻喷活流感疫苗)在妊娠期及如接受化疗等明显免疫低下患者中属禁忌,因为减毒的病原体可能致病。而灭活疫苗如注射型流感疫苗和百白破成人型疫苗(Tdap)不仅安全,且在妊娠期推荐接种。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
