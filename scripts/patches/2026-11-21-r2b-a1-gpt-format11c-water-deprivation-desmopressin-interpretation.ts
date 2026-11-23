import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gpt_format11c_water_deprivation_desmopressin_interpretation";
export const ops: PatchOp[] = [
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "en"],
    before: "For dropdown 1, urine osmolality stays extremely low through deprivation, so concentration is absent; primary polydipsia would show substantial concentration as endogenous vasopressin acts.",
    after: "Urine osmolality stays extremely low through deprivation, so concentration is absent; primary polydipsia would show substantial concentration as endogenous vasopressin acts.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "zh"],
    before: "第 1 空中，禁水期间尿渗透压始终极低，因此浓缩反应缺失；原发性多饮在内源性加压素作用下应出现明显浓缩。",
    after: "禁水期间尿渗透压始终极低，因此浓缩反应缺失；原发性多饮在内源性加压素作用下应出现明显浓缩。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "en"],
    before: "For dropdown 2, the marked post-desmopressin increase establishes complete central DI; complete nephrogenic DI would remain poorly concentrated, and primary polydipsia would have concentrated during deprivation.",
    after: "The marked post-desmopressin increase establishes complete central DI; complete nephrogenic DI would remain poorly concentrated, and primary polydipsia would have concentrated during deprivation.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "zh"],
    before: "第 2 空中，去氨加压素后显著升高确定为完全性中枢性尿崩症；完全性肾性尿崩症仍会浓缩不良，原发性多饮则会在禁水期间浓缩。",
    after: "去氨加压素后显著升高确定为完全性中枢性尿崩症；完全性肾性尿崩症仍会浓缩不良，原发性多饮则会在禁水期间浓缩。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "3" }, "en"],
    before: "For dropdown 3, ongoing hypotonic water loss with a serum sodium of 147 mEq/L creates concern for hypernatremia and worsening hyperosmolality, not dilutional hyponatremia.",
    after: "Ongoing hypotonic water loss with a serum sodium of 147 mEq/L creates concern for hypernatremia and worsening hyperosmolality, not dilutional hyponatremia.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "3" }, "zh"],
    before: "第 3 空中，持续低渗水丢失且血钠 147 mEq/L，需担忧高钠血症和高渗状态加重，而不是稀释性低钠血症。",
    after: "持续低渗水丢失且血钠 147 mEq/L，需担忧高钠血症和高渗状态加重，而不是稀释性低钠血症。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
