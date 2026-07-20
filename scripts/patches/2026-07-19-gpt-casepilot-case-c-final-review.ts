/**
 * Case C (Serial Fetal Assessment During Labor Induction) — final-review repair.
 * Findings: Codex checker report 2026-07-19, confirmed independently by Claude.
 *
 * 1. Reverse leakage into Part 4: the 10:30 narrative stated "after continued
 *    observation," directly revealing Part 4's dd2 keyed action (continue CTG
 *    and assess sustained improvement). Reworded to a neutral time transition.
 * 2. Baseline terminology drift: the 10:09 exhibit labeled an instantaneous
 *    point value "a baseline of 150/min" and folded in "the next 5 minutes"
 *    of observation into an "immediate response" exhibit; the 10:30 exhibit
 *    then called a range "145 to 150/min" the baseline. Fixed to keep 10:09
 *    genuinely immediate and to document one determined baseline value at
 *    10:30, consistent with the case's own glossary definition of baseline.
 * 3. Part 5 option D named the FHR event "an acceleration ... after
 *    stimulation," leaking Part 4's dd1 classification. Replaced with a
 *    distinct wrong-answer construct (mistaking a completed bedside review
 *    for a substitute for ongoing surveillance).
 * 4. Part 2 stem said findings "increase concern" including ongoing oxytocin,
 *    which was already present at the 09:00 baseline rather than newly
 *    arising at 10:00. Reworded to "contribute to current concern."
 */
import { setValue, runPatch } from "../patch-raw";

const id = "gpt_casepilot_2026_07_19_c_case";

const stage1009Content = [
  "caseStudy",
  "stages",
  { id: "gpt_casepilot_2026_07_19_c_stage_response_1009" },
  "exhibits",
  { id: "gpt_casepilot_2026_07_19_c_exhibit_response_1009" },
  "content",
] as const;

const stage1030Content = [
  "caseStudy",
  "stages",
  { id: "gpt_casepilot_2026_07_19_c_stage_reassessment_1030" },
  "exhibits",
  { id: "gpt_casepilot_2026_07_19_c_exhibit_ctg_1030" },
  "content",
] as const;

const stage1030Narrative = [
  "caseStudy",
  "stages",
  { id: "gpt_casepilot_2026_07_19_c_stage_reassessment_1030" },
  "narrative",
] as const;

const part5OptionD = [
  "caseStudy",
  "questions",
  { id: "gpt_casepilot_2026_07_19_c_part_5_closing_plan" },
  "options",
  { id: "d" },
] as const;

const part5ByChoiceD = [
  "caseStudy",
  "questions",
  { id: "gpt_casepilot_2026_07_19_c_part_5_closing_plan" },
  "rationale",
  "byChoice",
  3,
] as const;

const part2Stem = [
  "caseStudy",
  "questions",
  { id: "gpt_casepilot_2026_07_19_c_part_2_escalation_cues" },
  "stem",
] as const;

runPatch([
  setValue({
    id,
    path: [...stage1009Content, "en"],
    before:
      "The fetal heart rate rises from 155/min to 175/min for 20 seconds, then returns to a baseline of 150/min. Variability is 8 to 10 beats/min. No decelerations occur during the next 5 minutes. Maternal pulse remains 88/min.",
    after:
      "The fetal heart rate rises from 155/min to 175/min for 20 seconds, then returns to 150/min. Variability is 8 to 10 beats/min. No deceleration occurs in this immediate window. Maternal pulse remains 88/min.",
    note: "Keep the 10:09 exhibit genuinely immediate; remove premature 'baseline' label and the folded-in 5-minute window.",
  }),
  setValue({
    id,
    path: [...stage1009Content, "zh"],
    before:
      "胎心率由155次/分升至175次/分，持续20秒后回到150次/分的基线。变异幅度为8至10次/分。随后5分钟内无减速。产妇脉搏仍为88次/分。",
    after:
      "胎心率由155次/分升至175次/分，持续20秒后回到150次/分。变异幅度为8至10次/分。此即刻时段内无减速。产妇脉搏仍为88次/分。",
    note: "ZH parity for the immediate-window fix.",
  }),
  setValue({
    id,
    path: [...stage1030Content, "en"],
    before:
      "During the 20-minute observation period, the fetal baseline remains 145 to 150/min, variability remains 10 beats/min, accelerations are present, and no decelerations occur.",
    after:
      "After the 20-minute observation period, the fetal baseline is reassessed at 148/min, variability remains 10 beats/min, accelerations are present, and no decelerations occur.",
    note: "Document one determined baseline value after the stable observation period instead of a range, matching the case's own glossary definition of baseline.",
  }),
  setValue({
    id,
    path: [...stage1030Content, "zh"],
    before:
      "在20分钟观察期间，胎心率基线维持在145至150次/分，变异幅度维持在10次/分，可见加速，且无减速。",
    after:
      "经过20分钟观察后，胎心率基线复评为148次/分，变异幅度维持在10次/分，可见加速，且无减速。",
    note: "ZH parity for the determined-baseline fix.",
  }),
  setValue({
    id,
    path: [...stage1030Narrative, "en"],
    before: "The team reassesses the maternal-fetal picture after continued observation.",
    after: "The team reassesses the maternal-fetal picture at the next scheduled review.",
    note: "Remove reverse leakage: this line stated the exact action Part 4's dd2 asks the learner to infer (continued CTG/observation).",
  }),
  setValue({
    id,
    path: [...stage1030Narrative, "zh"],
    before: "团队在继续观察后再次评估母胎整体情况。",
    after: "团队在下一次计划复核时再次评估母胎整体情况。",
    note: "ZH parity for the leakage fix.",
  }),
  setValue({
    id,
    path: [...part5OptionD, "en"],
    before: "Discontinue CTG because an acceleration occurred after stimulation",
    after: "Discontinue CTG because the senior-midwife and obstetric review at 10:08 already assessed the fetal status",
    note: "Remove leakage of Part 4's dd1 classification ('acceleration'); test a distinct wrong-answer construct instead.",
  }),
  setValue({
    id,
    path: [...part5OptionD, "zh"],
    before: "因刺激后出现胎心加速而停止胎心监护",
    after: "因10:08已由高级助产士和产科医生完成评估而停止胎心监护",
    note: "ZH parity for the option D rewrite.",
  }),
  setValue({
    id,
    path: [...part5ByChoiceD, "en"],
    before: "An acceleration is reassuring but does not remove the ongoing intrapartum risk factors or end surveillance.",
    after: "The earlier bedside review assessed the clinical picture at that time; it does not substitute for ongoing surveillance while risk factors and labor continue.",
    note: "Rationale rewritten to match the new option D construct without naming the FHR classification.",
  }),
  setValue({
    id,
    path: [...part5ByChoiceD, "zh"],
    before: "胎心加速令人放心，但不会消除持续存在的产时危险因素，也不能终止监护。",
    after: "此前的床旁复核仅评估了当时的临床情况，并不能替代产程和危险因素持续存在期间的持续监护。",
    note: "ZH parity for the byChoice rewrite.",
  }),
  setValue({
    id,
    path: [...part2Stem, "en"],
    before:
      "Highlight the findings from the 10:00 review that increase concern and should be included when requesting urgent senior-midwife or obstetric review.",
    after:
      "Highlight the findings from the 10:00 review that contribute to current concern and should be included when requesting urgent senior-midwife or obstetric review.",
    note: "Ongoing oxytocin (a keyed segment) was already present at 09:00 rather than newly arising at 10:00; 'increase' overstated it.",
  }),
  setValue({
    id,
    path: [...part2Stem, "zh"],
    before: "请标出10:00复核中会增加担忧、并应在请求高级助产士或产科医生紧急复核时报告的发现。",
    after: "请标出10:00复核中构成当前担忧、并应在请求高级助产士或产科医生紧急复核时报告的发现。",
    note: "ZH parity for the Part 2 stem fix.",
  }),
]);
