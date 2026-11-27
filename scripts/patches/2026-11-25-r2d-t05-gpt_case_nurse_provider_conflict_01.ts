/**
 * R2 D-2 tranche 5, unit 04: zh-only meaning repair for gpt_case_nurse_provider_conflict_01 (banks/gpt-canonical.json questions[298]).
 * Producer: Codex gpt-6.2-astra high. Independent checker route: Claude Opus 5.5.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T05/producer/04/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gpt_case_nurse_provider_conflict_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_2"},"exhibits",{"id":"stage_2_escalation"},"content","zh"],
    before: "护士未给予该氯化钾。她核对流程和化验，通知 charge nurse，并客观记录沟通、升级处理和结果。她说明该医嘱超过外周静脉补钾流程，患者肾功能正在恶化，住院医未提供越过流程的临床理由就否定了护士的担忧。charge nurse 同意该医嘱超出流程参数，并按指挥链政策联系 chief resident。患者继续心电监护：正常窦性心律，无异位搏动。生命体征：HR 80，BP 130/76，RR 16，SpO2 97%。无新症状。尚未给予钾。",
    after: "护士未给予该氯化钾。她核对流程和化验，通知当班负责护士，并客观记录沟通、升级处理和结果。她说明该医嘱超过外周静脉补钾流程，患者肾功能正在恶化，住院医未提供越过流程的临床理由就否定了护士的担忧。当班负责护士同意该医嘱超出流程参数，并按指挥链政策联系总住院医师。患者继续心电监护：正常窦性心律，无异位搏动。生命体征：HR 80，BP 130/76，RR 16，SpO2 97%。无新症状。尚未给予钾。",
  }),
  setValue({
    id: ID, path: ["caseStudy","stages",{"id":"stage_3"},"exhibits",{"id":"stage_3_resolution"},"content","zh"],
    before: "chief resident 复核情况后下达修正医嘱：氯化钾 10 mEq 加入 100 mL 生理盐水，经外周静脉 1 小时输完，共重复 4 剂；第二剂后复查血钾，并于 0600 抽基本代谢面板。值班住院医随后回电，承认流程要求，并请护士告知复查结果。护士于 2045 给予第一剂。2245 第二剂后，从对侧手臂抽取的急查血钾为 3.4 mEq/L。心律仍为正常窦性心律，无异位搏动。患者否认 IV 部位不适、心悸或肌肉症状。护士按修正医嘱继续第三剂，并记录原始医嘱、流程担忧、升级处理、修正医嘱、已给剂量、复查血钾和后续沟通。",
    after: "总住院医师复核情况后下达修正医嘱：氯化钾 10 mEq 加入 100 mL 生理盐水，经外周静脉 1 小时输完，共给 4 剂；第二剂后复查血钾，并于 0600 抽基本代谢面板。值班住院医随后回电，承认流程要求，并请护士告知复查结果。护士于 2045 给予第一剂。2245 第二剂后，从对侧手臂抽取的急查血钾为 3.4 mEq/L。心律仍为正常窦性心律，无异位搏动。患者否认 IV 部位不适、心悸或肌肉症状。护士按修正医嘱继续第三剂，并记录原始医嘱、流程担忧、升级处理、修正医嘱、已给剂量、复查血钾和后续沟通。",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_nurse_provider_conflict_01_q5"},"options",{"id":"C"},"zh"],
    before: "结束通话并立即联系 chief resident，不再直接说明安全问题",
    after: "结束通话并立即联系总住院医师，不再直接说明安全问题",
  }),
  setValue({
    id: ID, path: ["caseStudy","questions",{"id":"gpt_case_nurse_provider_conflict_01_q5"},"options",{"id":"B"},"zh"],
    before: "一边按原医嘱给予氯化钾，一边通知 charge nurse",
    after: "一边按原医嘱给予氯化钾，一边告知当班负责护士自己的安全顾虑",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
