/** Producer-side source-pin polish for the 2026-07-16 GPT scored-format Batch 7C raw bank. */
import { setValue, runPatch } from "../patch-raw";

const exerciseHypoglycemia = "gpt_format7c_exercise_hypoglycemia_bowtie";
const sepsisTriage = "gpt_format7c_sepsis_triage_cues_highlight";
const sepsisReassessment = "gpt_format7c_sepsis_reassessment_highlight";

runPatch([
  setValue({
    id: exerciseHypoglycemia,
    path: ["meta", "source"],
    before: "CDC, About Diabetes Self-Management Education and Support, 7 self-care behaviors and personalized planning, https://www.cdc.gov/diabetes/education-support-programs/index.html; ADA Standards of Care in Diabetes—2026, Section 5 Hypoglycemia, https://diabetesjournals.org/care/article/49/Supplement_1/S89/163932/5-Facilitating-Positive-Health-Behaviors-and-Well; Section 7 Recommendation 7.11, https://diabetesjournals.org/care/article/49/Supplement_1/S150/163922/7-Diabetes-Technology-Standards-of-Care-in",
    after: "CDC, About Diabetes Self-Management Education and Support, 7 self-care behaviors and personalized planning, https://www.cdc.gov/diabetes/education-support-programs/index.html; ADA Standards of Care in Diabetes—2026, Section 5 Physical Activity and Exercise, https://diabetesjournals.org/care/article/49/Supplement_1/S89/163932/5-Facilitating-Positive-Health-Behaviors-and-Well; Section 6 Recommendations 6.10 and 6.14–6.15, recurrent hypoglycemia review, glucose treatment, and CGM, https://diabetesjournals.org/care/article/49/Supplement_1/S132/163927/6-Glycemic-Goals-Hypoglycemia-and-Hyperglycemic; Section 7 Recommendation 7.11, glucose monitoring before, during, and after exercise, https://diabetesjournals.org/care/article/49/Supplement_1/S150/163922/7-Diabetes-Technology-Standards-of-Care-in",
    note: "Correct the mislabeled ADA section and add the exact hypoglycemia and exercise-monitoring recommendation pins.",
  }),
  setValue({
    id: sepsisTriage,
    path: ["meta", "source"],
    before: "Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2026, screening statements, blood lactate recommendation, and medical-emergency/resuscitation good-practice statement, https://www.sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines",
    after: "Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2026, screening and biomarkers statements, blood lactate recommendation, and medical-emergency/resuscitation good-practice statement, https://sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026",
    note: "Pin the current guideline page directly and name the biomarkers lane supporting the diagnostic caution.",
  }),
  setValue({
    id: sepsisReassessment,
    path: ["meta", "source"],
    before: "Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2026, frequent ongoing reassessment after fluids, serial lactate recommendation, capillary-refill adjunct recommendation, and MAP guidance, https://www.sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines",
    after: "Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2026, fluid-resuscitation reassessment remarks, serial lactate recommendation, capillary-refill adjunct recommendation, and initial MAP target recommendation, https://sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026",
    note: "Pin the current guideline page directly and identify the exact recommendation lanes used by the keyed cues.",
  }),
]);
