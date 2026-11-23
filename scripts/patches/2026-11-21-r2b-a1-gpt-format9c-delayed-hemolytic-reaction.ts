import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gpt_format9c_delayed_hemolytic_reaction";
export const ops: PatchOp[] = [
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "en"],
    before: "For dropdown 1, delayed hemolytic transfusion reaction fits the 8-day onset and immune hemolysis pattern; febrile nonhemolytic reaction and bacterial contamination usually present during or soon after transfusion with fever or rigors.",
    after: "Delayed hemolytic transfusion reaction fits the 8-day onset and immune hemolysis pattern; febrile nonhemolytic reaction and bacterial contamination usually present during or soon after transfusion with fever or rigors.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "1" }, "zh"],
    before: "第 1 空中，迟发性溶血性输血反应符合 8 天后发病及免疫性溶血模式；非溶血性发热反应和细菌污染通常在输血期间或不久后出现发热或寒战。",
    after: "迟发性溶血性输血反应符合 8 天后发病及免疫性溶血模式；非溶血性发热反应和细菌污染通常在输血期间或不久后出现发热或寒战。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "en"],
    before: "For dropdown 2, the new DAT and alloantibody with hemolysis indicate delayed immune destruction of transfused RBCs; isolated fluid overload would not explain the antibody findings, and dilution alone would not raise bilirubin and LDH.",
    after: "The new DAT and alloantibody with hemolysis indicate delayed immune destruction of transfused RBCs; isolated fluid overload would not explain the antibody findings, and dilution alone would not raise bilirubin and LDH.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "2" }, "zh"],
    before: "第 2 空中，新出现 DAT 阳性和同种抗体并伴溶血，提示输注红细胞的迟发免疫性破坏；单纯液体过多不能解释抗体发现，单纯稀释也不会使胆红素和 LDH 升高。",
    after: "新出现 DAT 阳性和同种抗体并伴溶血，提示输注红细胞的迟发免疫性破坏；单纯液体过多不能解释抗体发现，单纯稀释也不会使胆红素和 LDH 升高。",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "3" }, "en"],
    before: "For dropdown 3, absent hemoglobinuria is compatible because it is uncommon in delayed reactions; it neither excludes the diagnosis nor proves TACO.",
    after: "Absent hemoglobinuria is compatible because it is uncommon in delayed reactions; it neither excludes the diagnosis nor proves TACO.",
  }),
  setValue({
    id,
    path: ["rationale", "byChoice", { refId: "3" }, "zh"],
    before: "第 3 空中，无血红蛋白尿仍与诊断相容，因为迟发反应中并不常见；它既不能排除诊断，也不能证明 TACO。",
    after: "无血红蛋白尿仍与诊断相容，因为迟发反应中并不常见；它既不能排除诊断，也不能证明 TACO。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
