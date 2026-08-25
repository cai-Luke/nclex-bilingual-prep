/**
 * Restore the eight GPT matrix correct mappings broken by the uniform c1/c2
 * swap in 91ab960. The exact restoration oracle is 91ab960^:
 * b3a68e890988ca7155dcc8113881b3a36ddf6826.
 */
import { runPatch, setValue } from "../patch-raw";

runPatch([
  setValue({
    id: "gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02",
    path: ["caseStudy", "questions", { id: "gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q2" }, "correct"],
    before: [
      { rowId: "r1", columnIds: ["c2"] },
      { rowId: "r2", columnIds: ["c2"] },
      { rowId: "r3", columnIds: ["c2"] },
      { rowId: "r4", columnIds: ["c2"] },
      { rowId: "r5", columnIds: ["c1"] },
    ],
    after: [
      { rowId: "r1", columnIds: ["c1"] },
      { rowId: "r2", columnIds: ["c1"] },
      { rowId: "r3", columnIds: ["c1"] },
      { rowId: "r4", columnIds: ["c1"] },
      { rowId: "r5", columnIds: ["c2"] },
    ],
    note: "Restore the oracle mapping for the embedded post-fall matrix.",
  }),
  setValue({
    id: "gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03",
    path: ["caseStudy", "questions", { id: "gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1" }, "correct"],
    before: [
      { rowId: "r1", columnIds: ["c2"] },
      { rowId: "r2", columnIds: ["c2"] },
      { rowId: "r3", columnIds: ["c2"] },
      { rowId: "r4", columnIds: ["c2"] },
      { rowId: "r5", columnIds: ["c1"] },
    ],
    after: [
      { rowId: "r1", columnIds: ["c1"] },
      { rowId: "r2", columnIds: ["c1"] },
      { rowId: "r3", columnIds: ["c1"] },
      { rowId: "r4", columnIds: ["c1"] },
      { rowId: "r5", columnIds: ["c2"] },
    ],
    note: "Restore the oracle mapping for the embedded pressure-injury matrix.",
  }),
  setValue({
    id: "gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04",
    path: ["caseStudy", "questions", { id: "gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q1" }, "correct"],
    before: [
      { rowId: "r1", columnIds: ["c2"] },
      { rowId: "r2", columnIds: ["c1"] },
      { rowId: "r3", columnIds: ["c2"] },
      { rowId: "r4", columnIds: ["c1"] },
      { rowId: "r5", columnIds: ["c2"] },
    ],
    after: [
      { rowId: "r1", columnIds: ["c1"] },
      { rowId: "r2", columnIds: ["c2"] },
      { rowId: "r3", columnIds: ["c1"] },
      { rowId: "r4", columnIds: ["c2"] },
      { rowId: "r5", columnIds: ["c1"] },
    ],
    note: "Restore the oracle mapping for the embedded delirium-orientation matrix.",
  }),
  setValue({
    id: "gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02",
    path: ["caseStudy", "questions", { id: "gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q2" }, "correct"],
    before: [
      { rowId: "r1", columnIds: ["c1"] },
      { rowId: "r2", columnIds: ["c2"] },
      { rowId: "r3", columnIds: ["c1"] },
      { rowId: "r4", columnIds: ["c1"] },
      { rowId: "r5", columnIds: ["c1"] },
    ],
    after: [
      { rowId: "r1", columnIds: ["c2"] },
      { rowId: "r2", columnIds: ["c1"] },
      { rowId: "r3", columnIds: ["c2"] },
      { rowId: "r4", columnIds: ["c2"] },
      { rowId: "r5", columnIds: ["c2"] },
    ],
    note: "Restore the oracle mapping for the embedded discharge-readiness matrix.",
  }),
  setValue({
    id: "gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_contact_diarrhea_09",
    path: ["correct"],
    before: [
      { rowId: "r1", columnIds: ["c2"] },
      { rowId: "r2", columnIds: ["c1"] },
      { rowId: "r3", columnIds: ["c2"] },
      { rowId: "r4", columnIds: ["c1"] },
      { rowId: "r5", columnIds: ["c2"] },
    ],
    after: [
      { rowId: "r1", columnIds: ["c1"] },
      { rowId: "r2", columnIds: ["c2"] },
      { rowId: "r3", columnIds: ["c1"] },
      { rowId: "r4", columnIds: ["c2"] },
      { rowId: "r5", columnIds: ["c1"] },
    ],
    note: "Restore the oracle mapping for the standalone contact-precautions matrix.",
  }),
  setValue({
    id: "gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_stroke_rehab_10",
    path: ["correct"],
    before: [
      { rowId: "r1", columnIds: ["c2"] },
      { rowId: "r2", columnIds: ["c1"] },
      { rowId: "r3", columnIds: ["c2"] },
      { rowId: "r4", columnIds: ["c2"] },
      { rowId: "r5", columnIds: ["c1"] },
    ],
    after: [
      { rowId: "r1", columnIds: ["c1"] },
      { rowId: "r2", columnIds: ["c2"] },
      { rowId: "r3", columnIds: ["c1"] },
      { rowId: "r4", columnIds: ["c1"] },
      { rowId: "r5", columnIds: ["c2"] },
    ],
    note: "Restore the oracle mapping for the standalone stroke-rehabilitation matrix.",
  }),
  setValue({
    id: "gpt_2026_06_13_case_delirium_uti_01",
    path: ["caseStudy", "questions", { id: "gpt_2026_06_13_case_delirium_uti_01_q1" }, "correct"],
    before: [
      { rowId: "r1", columnIds: ["c2"] },
      { rowId: "r2", columnIds: ["c2"] },
      { rowId: "r3", columnIds: ["c1"] },
      { rowId: "r4", columnIds: ["c2"] },
      { rowId: "r5", columnIds: ["c1"] },
    ],
    after: [
      { rowId: "r1", columnIds: ["c1"] },
      { rowId: "r2", columnIds: ["c1"] },
      { rowId: "r3", columnIds: ["c2"] },
      { rowId: "r4", columnIds: ["c1"] },
      { rowId: "r5", columnIds: ["c2"] },
    ],
    note: "Restore the oracle mapping for the embedded acute-delirium matrix.",
  }),
  setValue({
    id: "gpt_2026_06_13_case_delirium_uti_01",
    path: ["caseStudy", "questions", { id: "gpt_2026_06_13_case_delirium_uti_01_q4" }, "correct"],
    before: [
      { rowId: "r1", columnIds: ["c2"] },
      { rowId: "r2", columnIds: ["c2"] },
      { rowId: "r3", columnIds: ["c2"] },
      { rowId: "r4", columnIds: ["c1"] },
      { rowId: "r5", columnIds: ["c1"] },
    ],
    after: [
      { rowId: "r1", columnIds: ["c1"] },
      { rowId: "r2", columnIds: ["c1"] },
      { rowId: "r3", columnIds: ["c1"] },
      { rowId: "r4", columnIds: ["c2"] },
      { rowId: "r5", columnIds: ["c2"] },
    ],
    note: "Restore the oracle mapping for the embedded intervention-response matrix.",
  }),
]);
