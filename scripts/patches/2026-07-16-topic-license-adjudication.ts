/**
 * Controlled migration for the 2026-07-16 topic/license residual.
 *
 * The script is intentionally fail-closed:
 * - the source population must remain exactly 556 findings;
 * - every finding must receive one deterministic semantic decision;
 * - every target topic must be canonical and licensed for its target category;
 * - --apply verifies every before-value and writes only the canonical bank files
 *   named by the manifest generated in the same run.
 */

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CANONICAL_DIR } from "../../lib/pipeline-paths";
import { collectQuestionPopulation, type QuestionPopulationKind } from "../../lib/question-population";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import { isCanonicalTopic, TOPICS, topicCategories } from "../../src/topics";
import type { BankEnvelope, Category } from "../../src/types";
import {
  analyzeTopicLicenses,
  type TopicLicenseFinding,
  type TopicLicenseIssue,
} from "../audit/audit-topic-license";

const EXPECTED_FINDINGS = 556;
const EXPECTED_SPLIT = {
  noncanonical_topic: 465,
  license_mismatch: 91,
  top_level_case_container: 91,
  top_level_scored_leaf: 275,
  embedded_scored_leaf: 190,
} as const;
const MANIFEST_PATH = "audit/topic-license-adjudication-2026-07-16.manifest.json";
const REPORT_PATH = "audit/topic-license-adjudication-2026-07-16.report.md";

type Decision = {
  category: Category;
  topic: string;
  reason: string;
};

type ManifestChange = {
  id: string;
  file: string;
  path: string;
  kind: QuestionPopulationKind;
  parentId: string | null;
  issue: TopicLicenseIssue;
  beforeCategory: Category;
  beforeTopic: string;
  afterCategory: Category;
  afterTopic: string;
  categoryChanged: boolean;
  reason: string;
};

const C = {
  MOC: "Management of Care",
  SAFETY: "Safety and Infection Prevention and Control",
  HPM: "Health Promotion and Maintenance",
  PSYCH: "Psychosocial Integrity",
  BCC: "Basic Care and Comfort",
  PHARM: "Pharmacological and Parenteral Therapies",
  RRP: "Reduction of Risk Potential",
  PA: "Physiological Adaptation",
} as const satisfies Record<string, Category>;

const exact = new Map<string, Decision>();
const assign = (ids: readonly string[], category: Category, topic: string, reason: string): void => {
  for (const id of ids) {
    if (exact.has(id)) throw new Error(`Duplicate exact adjudication: ${id}`);
    exact.set(id, { category, topic, reason });
  }
};

// Canonical-topic/category mismatches: all 91 are explicitly grouped here.
assign(["claude_a_sata_hf_discharge_02", "gemini_b9_08"], C.HPM, TOPICS.CHRONIC_DISEASE_LIFESTYLE, "The item tests chronic-disease self-management teaching, not discharge coordination as a Management of Care construct.");
assign(["claude_a_mc_hip_replacement_21", "gemini_b9_03"], C.RRP, TOPICS.PERIOPERATIVE_CARE, "The tested construct is postoperative hip-arthroplasty care and complication prevention.");
assign(["claude_a_cloze_postop_ileus_30"], C.PA, TOPICS.RENAL_GASTROINTESTINAL_DISORDERS, "The item tests established postoperative ileus physiology rather than general perioperative risk monitoring.");
assign(["claude_a_mc_restraint_alternative_37"], C.MOC, TOPICS.LEGAL_ETHICAL, "The keyed action applies the least-restrictive-restraint legal and ethical standard.");
assign(["gemini_p4_09"], C.PHARM, TOPICS.ANTICOAGULANT_THERAPY, "The item tests antiplatelet therapy in acute coronary care.");
assign(["gemini_p5_02", "easy_adult_health_01", "gemini_jun05_a_cloze_croup_55"], C.PA, TOPICS.RESPIRATORY_INFECTIOUS_DISORDERS, "The item tests manifestations or acute management of a respiratory or infectious disorder.");
assign(["gemini_jun05_a_fib_copd_med_15", "gen_sic_batch2_4", "gpt_2026_07_03_2114_t2_04_kcl_duration_fib"], C.PHARM, TOPICS.DOSAGE_CALCULATIONS, "The tested construct is medication dose, volume, rate, or infusion-duration arithmetic.");
assign(["gemini_jun05_b_fib_vital_08", "gemini_c10_06", "gemini_c10_09", "gpt_canonical_fib_pediatric_urine_output_049", "gpt_2026_07_03_1344_t1_02", "cs_ckd_01_q2"], C.RRP, TOPICS.LAB_DIAGNOSTIC_TESTS, "The item tests interpretation of assessment, monitoring, or diagnostic findings in the Reduction of Risk Potential lane.");
assign(["gemini_jun05_b_cloze_geriatric_16"], C.HPM, TOPICS.ADULT_HEALTH, "The item tests preventive home-safety teaching for an older adult.");
assign(["gemini_jun05_b_or_transfusion_22"], C.PHARM, TOPICS.TRANSFUSION_BLOOD_PRODUCTS, "The ordered actions are specific to safe blood-product administration.");
assign(["gemini_jun05_b_or_seizure_29", "gemini_jun05_a_sata_seizure_precautions_34", "gpt_canonical_or_seizure_safety_032", "gap_50_sic_07"], C.SAFETY, TOPICS.PATIENT_ENVIRONMENT_SAFETY, "The tested construct is injury prevention during a seizure.");
assign(["gemini_jun05_a_mc_urine_output_19"], C.BCC, TOPICS.ELIMINATION_COMFORT, "The item tests urinary elimination assessment and catheter troubleshooting.");
assign(["gemini_b5_01", "gemini_b5_04", "gemini_b5_07", "gemini_c4_02", "gemini_c4_05", "gemini_c4_07", "gemini_c4_10", "gemini_d3_05", "gemini_d3_10", "gpt_canonical_fib_calorie_intake_122"], C.BCC, TOPICS.NUTRITIONAL_FLUID_SUPPORT, "The arithmetic concerns calories, macronutrients, or enteral feeding rather than medication dosing.");
assign(["gemini_b7_01", "gemini_b7_04", "gemini_b7_07"], C.RRP, TOPICS.LAB_DIAGNOSTIC_TESTS, "The item tests focused assessment or differential recognition for suspected appendicitis.");
assign(["gemini_b7_10"], C.RRP, TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS, "The item tests recognition and escalation of appendiceal perforation while awaiting surgery.");
assign(["gemini_c7_03", "gemini_c7_06", "gemini_c7_09"], C.PHARM, TOPICS.PARENTERAL_NUTRITION, "The tested construct is total parenteral nutrition administration or monitoring.");
assign(["gemini_c9_10", "gap_50_mc_12", "gpt_fresh_2026_06_22_moc_08", "gpt_deepen_2026_06_22_esc_03", "gpt_deepen_2026_06_22_esc_04", "gpt_deepen_2026_06_22_esc_08", "gpt_deepen_2026_06_22_esc_09", "gpt_deepen_2026_06_22_b_moc1_03", "gpt_deepen_2026_06_22_b_moc1_05", "trad_batchB_24"], C.SAFETY, TOPICS.DISASTER_EMERGENCY_PREPAREDNESS, "Disaster triage, incident command, and emergency resource allocation belong to the dedicated Safety category topic.");
assign(["gemini_d10_02"], C.PA, TOPICS.SEPSIS_SEPTIC_SHOCK, "The item tests organ-dysfunction findings in suspected sepsis.");
assign(["gemini_d10_03"], C.PHARM, TOPICS.MEDICATION_SAFETY_ADMIN, "The keyed action is safe sequencing of insulin and potassium replacement.");
assign(["gemini_d10_06", "sa_acid_base_01"], C.RRP, TOPICS.ABG_ACID_BASE, "The tested construct is ABG and acid-base interpretation.");
assign(["gemini_d3_01", "gemini_d3_03", "gemini_d3_08"], C.BCC, TOPICS.NUTRITIONAL_FLUID_SUPPORT, "The item tests dysphagia, aspiration prevention, or feeding support rather than infection isolation.");
assign(["gemini_d8_05", "gemini_d8_06"], C.RRP, TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS, "The item tests recognition of systemic complications arising from immobility.");
assign(["gemini_d8_10", "easy_adult_health_02"], C.BCC, TOPICS.SKIN_WOUND_CARE, "The item tests pressure-injury prevention or staging.");
assign(["gemini_jun05_a_or_trach_suction_51"], C.SAFETY, TOPICS.PPE_STERILE_TECHNIQUE, "The item tests the sterile sequence for tracheal suctioning.");
assign(["trad_pa_23"], C.PA, TOPICS.RENAL_GASTROINTESTINAL_DISORDERS, "The diet teaching is anchored to chronic renal disease.");
assign(["trad_batchD_11"], C.RRP, TOPICS.PERIOPERATIVE_CARE, "The item tests preoperative medication and supplement risk reduction.");
assign(["trad_batchD_14", "easy_resp_infect_02"], C.SAFETY, TOPICS.TRANSMISSION_BASED_PRECAUTIONS, "The tested construct is airborne isolation and transmission prevention.");
assign(["trad_batchD_15"], C.BCC, TOPICS.ELIMINATION_COMFORT, "The item tests safe oral hygiene and aspiration prevention during comfort care.");
assign(["gen_rrp_batch2_02"], C.SAFETY, TOPICS.STANDARD_PRECAUTIONS_HYGIENE, "The item tests central-line dressing infection prevention.");
assign(["easy_adult_health_03"], C.HPM, TOPICS.CHRONIC_DISEASE_LIFESTYLE, "The item tests lifestyle management of hypertension.");
assign(["easy_adult_health_04"], C.PHARM, TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS, "The item links premeal glucose monitoring to prandial insulin selection.");
assign(["easy_adult_health_05"], C.BCC, TOPICS.SLEEP_REST, "The tested construct is sleep hygiene.");
assign(["easy_resp_infect_03"], C.HPM, TOPICS.ADULT_HEALTH, "The item tests preventive adult influenza vaccination.");
assign(["easy_substance_03"], C.PA, TOPICS.ENDOCRINE_NEUROLOGICAL_DISORDERS, "The item tests the established neurologic and respiratory manifestations of opioid overdose.");
assign(["easy_substance_04"], C.PHARM, TOPICS.MEDICATION_SAFETY_ADMIN, "The item tests emergency naloxone administration.");
assign(["easy_mental_health_04"], C.PSYCH, TOPICS.SUICIDE_CRISIS_INTERVENTION, "The finding establishes an immediate suicide-safety crisis.");
assign(["easy_cardio_02"], C.PHARM, TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS, "The item tests safe nitroglycerin storage and use.");
assign(["gemini_backfill_hl_cardio_02"], C.RRP, TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS, "The item tests vascular complication cues after femoral catheterization.");
assign(["gpt_canonical_or_telephone_order_110", "gpt_canonical_or_medication_error_084"], C.MOC, TOPICS.LEGAL_ETHICAL, "The item tests order verification, error response, documentation, or reporting obligations.");
assign(["gpt_canonical_cloze_postpartum_depression_118"], C.PSYCH, TOPICS.SUICIDE_CRISIS_INTERVENTION, "The keyed postpartum-depression finding is an active self-harm emergency.");
assign(["gpt_fresh_2026_06_22_vis_06"], C.PHARM, TOPICS.ANTICOAGULANT_THERAPY, "The MAR problem tests safe transition between therapeutic anticoagulants.");
assign(["gpt_2026_07_03_2114_t2_06_pph_sequence_or"], C.PA, TOPICS.MATERNAL_NEWBORN, "The ordered response is specific to postpartum hemorrhage.");
assign(["gpt_canonical_or_suspected_stroke_072"], C.RRP, TOPICS.LAB_DIAGNOSTIC_TESTS, "The stroke-response sequence hinges on last-known-well, glucose, and urgent imaging.");
assign(["cs_copd_01_q3"], C.PA, TOPICS.RESPIRATORY_INFECTIOUS_DISORDERS, "The item prioritizes interventions for an established COPD exacerbation.");
assign(["cs_asthma_01_q4"], C.PHARM, TOPICS.MEDICATION_SAFETY_ADMIN, "The item tests medication selection and safety in asthma treatment.");
assign(["cs_schiz_01_q5"], C.PHARM, TOPICS.PSYCHOTROPIC_MEDICATIONS, "The item tests adverse-effect monitoring for an antipsychotic medication.");
assign(["cs_hip_01"], C.RRP, TOPICS.PERIOPERATIVE_CARE, "The case container centers on postoperative hip-arthroplasty care and complication prevention.");
assign(["sa_ped_dehydration_01"], C.PA, TOPICS.RENAL_GASTROINTESTINAL_DISORDERS, "The item tests severity of acute dehydration from vomiting and diarrhea.");

// A few noncanonical records require a category correction that is clearer by ID
// than by their scenario-like legacy topic string.
assign(["gpt_visual_smoke_2026_06_12_fib_device_enteral_duration_10"], C.BCC, TOPICS.NUTRITIONAL_FLUID_SUPPORT, "Enteral-pump duration is nutrition-support arithmetic, not medication dosing.");
assign(["opus_case_warfarin_bridge_q6"], C.MOC, TOPICS.DISCHARGE_HANDOFF, "The item tests return-to-work clearance and discharge safety coordination during anticoagulant initiation.");
assign(["gpt_case_gap_2026_06_11_post_stroke_rehab_part_4_cloze_priority"], C.MOC, TOPICS.PRIORITIZATION_DELEGATION, "The item tests priority selection within the post-stroke rehabilitation plan.");
assign(["gpt_case_gap_2026_06_11_case_adhf_01"], C.PA, TOPICS.CARDIOVASCULAR_DISORDERS, "The case container centers on established acute decompensated heart failure.");
assign(["gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02"], C.SAFETY, TOPICS.PATIENT_ENVIRONMENT_SAFETY, "The case container centers on post-fall safety assessment and escalation.");
assign(["gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01"], C.PHARM, TOPICS.MEDICATION_SAFETY_ADMIN, "The case container centers on opioid administration safety and respiratory reassessment.");
assign(["gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q4"], C.PHARM, TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS, "The item distinguishes magnesium seizure prophylaxis from antihypertensive drug therapy.");
assign(["gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q5"], C.PHARM, TOPICS.MEDICATION_SAFETY_ADMIN, "The item tests safe concurrent administration and monitoring of high-alert maternal medications.");
assign(["gpt_fresh_2026_06_22_vis_08"], C.PHARM, TOPICS.DOSAGE_CALCULATIONS, "The item calculates a maximum medication dose from PCA demand and lockout settings.");
assign(["q10_4"], C.PA, TOPICS.ENDOCRINE_NEUROLOGICAL_DISORDERS, "The item identifies the cause of autonomic dysreflexia.");
assign(["cs_thyroid_storm_q4"], C.PHARM, TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS, "The item tests adverse-effect monitoring for propylthiouracil.");
assign(["gpt_pharm_easy_medium_2026_06_21_b_fib_vancomycin_rate_02", "gpt_pharm_easy_medium_2026_06_21_b_fib_morphine_volume_03", "gpt_fresh_2026_06_22_vis_07"], C.PHARM, TOPICS.DOSAGE_CALCULATIONS, "The tested construct is medication rate or volume arithmetic.");
assign(["cs_ngn_002_disaster"], C.SAFETY, TOPICS.DISASTER_EMERGENCY_PREPAREDNESS, "The case container tests disaster triage and chemical-event response.");
assign(["gemini_sic_ngn_2026_06_21_q3", "gemini_sic_ngn_2026_06_21_q14"], C.SAFETY, TOPICS.PATIENT_ENVIRONMENT_SAFETY, "The item tests seizure injury precautions.");
assign(["gemini_sic_ngn_2026_06_21_q6", "gemini_sic_ngn_2026_06_21_q15"], C.SAFETY, TOPICS.TRANSMISSION_BASED_PRECAUTIONS, "The item distinguishes standard precautions from contact, droplet, and airborne isolation.");
assign(["q6_3"], C.PHARM, TOPICS.MEDICATION_SAFETY_ADMIN, "The item tests safe prioritization of osmotic-diuretic therapy.");
assign(["opus_agvd_case_agvhd_01_q4"], C.PHARM, TOPICS.MEDICATION_SAFETY_ADMIN, "The item tests narrow-therapeutic-index tacrolimus titration and toxicity monitoring.");
assign(["gpt_case_gap_2026_06_11_case_aki_02", "gpt_case_gap_2026_06_11_case_pancreatitis_03"], C.PA, TOPICS.RENAL_GASTROINTESTINAL_DISORDERS, "The case container centers on an established acute renal or gastrointestinal disorder.");
assign(["gpt_case_gap_2026_06_11_case_adrenal_crisis_04"], C.PA, TOPICS.ENDOCRINE_NEUROLOGICAL_DISORDERS, "The case container centers on an established adrenal crisis.");
assign(["gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01"], C.PA, TOPICS.RENAL_GASTROINTESTINAL_DISORDERS, "The case container centers on prerenal acute kidney injury; hyperkalemia is a complication within that stable renal rollup.");
assign(["gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01", "gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q4", "gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_bowtie"], C.RRP, TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS, "The record tests thrombectomy preparation or a post-reperfusion procedural complication.");
assign(["iot_hf_ckd_declining_output", "io_fib_hf_net_balance_01", "io_matrix_prerenal_aki_recheck_04", "io_matrix_bowel_prep_deficit_08"], C.BCC, TOPICS.NUTRITIONAL_FLUID_SUPPORT, "Intake/output and net fluid-balance work remains in the fluid-support rollup under the IV-fluid taxonomy ruling.");
assign(["gpt_case_major_burn_inhalation_fluid_creep_01"], C.PA, TOPICS.BURN_MANAGEMENT, "The case tests established burn complications and fluid-creep management; the closed burn ruling controls.");
assign(["gpt_injection_smoke_2026_06_15_mc_intradermal_01", "gpt_injection_smoke_2026_06_15_mc_subcutaneous_02", "gpt_injection_smoke_2026_06_15_mc_intramuscular_03", "gpt_injection_smoke_2026_06_15_mc_intravenous_04", "gpt_injection_smoke_2026_06_15_mc_layer_highlight_05", "gpt_injection_smoke_2026_06_15_sata_im_cues_06", "gpt_injection_smoke_2026_06_15_matrix_subq_cues_07", "gpt_injection_smoke_2026_06_15_matrix_route_match_08"], C.PHARM, TOPICS.MEDICATION_SAFETY_ADMIN, "The visual tests correct medication injection route or target-layer administration.");

const has = (text: string, pattern: RegExp): boolean => pattern.test(text);

const semanticDecision = (finding: TopicLicenseFinding): Decision | null => {
  const explicit = exact.get(finding.id);
  if (explicit) return explicit;

  const t = finding.topic.toLowerCase();

  if (finding.category === C.MOC) {
    if (has(t, /hipaa|confidential/)) return { category: C.MOC, topic: TOPICS.CONFIDENTIALITY_HIPAA, reason: "The record tests privacy or confidentiality obligations." };
    if (has(t, /caregiver|respite/)) return { category: C.MOC, topic: TOPICS.CAREGIVER_ROLE_STRAIN_FAMILY_COPING, reason: "The Management of Care construct is coordination of caregiver support or respite resources." };
    if (has(t, /discharge|handoff|referral|rehabilitation coordination|resource coordination|interprofessional diabetes|interpreter-supported|colostomy.*limited english|home oxygen|contact investigation/)) return { category: C.MOC, topic: TOPICS.DISCHARGE_HANDOFF, reason: "The record tests care coordination, referral, interpreter-supported transition, or discharge readiness." };
    if (has(t, /advocacy|informed refusal|communication & interpreter/)) return { category: C.MOC, topic: TOPICS.CLIENT_ADVOCACY, reason: "The record tests protection of the client's informed choices or access to care." };
    if (has(t, /consent|advance directive|code status|dnr|incident|documentation|error response|unsafe order|telephone order|verbal|impaired|against medical advice|mandatory|mandated|nonaccidental trauma|medication dose question/)) return { category: C.MOC, topic: TOPICS.LEGAL_ETHICAL, reason: "The record tests consent, reporting, documentation, scope, or another legal-ethical duty." };
    if (has(t, /delegat|supervision|assignment|scope of practice|priorit|triage|escalation|chain of command|emergency|intervention|response|sequence|resource management|ros[cC]|pulmonary edema|sepsis|septic|status epilepticus|thyroid storm|cardiac arrest|missed dose|acute graft|myocarditis|mucositis tpn|lithium toxicity/)) return { category: C.MOC, topic: TOPICS.PRIORITIZATION_DELEGATION, reason: "The record tests prioritization, delegation, escalation, or sequencing of urgent nursing actions." };
  }

  if (finding.category === C.SAFETY) {
    if (has(t, /pressure|wound|moisture/)) return { category: C.SAFETY, topic: TOPICS.SKIN_WOUND_CARE, reason: "The record tests pressure-injury or wound prevention in the Safety lane." };
    if (has(t, /transfusion|warfarin-enoxaparin/)) return { category: C.SAFETY, topic: has(t, /transfusion/) ? TOPICS.TRANSFUSION_BLOOD_PRODUCTS : TOPICS.MEDICATION_SAFETY_ADMIN, reason: "The record tests blood-product or high-alert medication safety." };
    if (has(t, /c\. difficile|clostridioides|tuberculosis|isolation|room placement|transmission/)) return { category: C.SAFETY, topic: TOPICS.TRANSMISSION_BASED_PRECAUTIONS, reason: "The tested construct is isolation or transmission prevention." };
    if (has(t, /ppe|sterile/)) return { category: C.SAFETY, topic: TOPICS.PPE_STERILE_TECHNIQUE, reason: "The record tests PPE use or sterile technique." };
    if (has(t, /sharps|exposure|\bcauti\b|infection prevention/)) return { category: C.SAFETY, topic: TOPICS.STANDARD_PRECAUTIONS_HYGIENE, reason: "The record tests routine exposure, device-infection, or hygiene precautions." };
    if (has(t, /disaster|chemical exposure/)) return { category: C.SAFETY, topic: TOPICS.DISASTER_EMERGENCY_PREPAREDNESS, reason: "The record tests disaster response or emergency preparedness." };
    if (has(t, /sepsis|urosepsis/)) return { category: C.PA, topic: TOPICS.SEPSIS_SEPTIC_SHOCK, reason: "The record tests established sepsis deterioration rather than environmental safety." };
    if (has(t, /malignant hyperthermia|rebreathing.*anesthesia/)) return { category: C.RRP, topic: TOPICS.PERIOPERATIVE_CARE, reason: "The record tests an anesthesia or perioperative complication." };
    if (has(t, /tube|tracheal/)) return { category: C.RRP, topic: TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS, reason: "The record tests airway-device monitoring or displacement as a procedural risk." };
    if (has(t, /fall|fire|oxygen|environment|equipment|restraint|seizure|delirium safety|safe mobility|child abuse|shaken baby|non-accidental|dic nursing/)) return { category: C.SAFETY, topic: TOPICS.PATIENT_ENVIRONMENT_SAFETY, reason: "The record tests immediate injury prevention or environmental safety." };
  }

  if (finding.category === C.HPM) {
    if (has(t, /pediatric|child|adolescent/)) return { category: C.HPM, topic: TOPICS.PEDIATRIC_ADOLESCENT_HEALTH, reason: "The record tests pediatric health promotion or family teaching." };
    if (has(t, /postpartum depression/)) return { category: C.PSYCH, topic: TOPICS.MENTAL_HEALTH_DISORDERS, reason: "The record tests recovery and teaching for a mental-health disorder." };
    if (has(t, /chronic|copd|pacemaker|celiac|diabetes|c\. difficile/)) return { category: C.HPM, topic: TOPICS.CHRONIC_DISEASE_LIFESTYLE, reason: "The record tests chronic-disease self-management or longitudinal lifestyle teaching." };
    if (has(t, /pca|analgesia|medication/)) return { category: C.PHARM, topic: TOPICS.MEDICATION_SAFETY_ADMIN, reason: "The teaching is specifically about safe medication administration." };
    if (has(t, /adult|screen|immuniz|vaccin|fall|delirium|sedation|teach-back/)) return { category: C.HPM, topic: TOPICS.ADULT_HEALTH, reason: "The record tests adult preventive care, wellness, or anticipatory teaching." };
  }

  if (finding.category === C.PSYCH) {
    if (has(t, /caregiver/)) return { category: C.PSYCH, topic: TOPICS.CAREGIVER_ROLE_STRAIN_FAMILY_COPING, reason: "The record tests caregiver burden or family coping." };
    if (has(t, /suicide|grief safety|violence|neglect|ipv/)) return { category: C.PSYCH, topic: TOPICS.SUICIDE_CRISIS_INTERVENTION, reason: "The record tests an immediate interpersonal or self-harm safety crisis." };
    if (has(t, /therapeutic communication|health literacy|adherence|tb adherence/)) return { category: C.PSYCH, topic: TOPICS.THERAPEUTIC_COMMUNICATION, reason: "The tested construct is therapeutic communication or adherence-support communication." };
    if (has(t, /lithium toxicity/)) return { category: C.PHARM, topic: TOPICS.PSYCHOTROPIC_MEDICATIONS, reason: "The record tests toxicity monitoring for a psychotropic medication." };
    if (has(t, /bipolar|mania|delirium|depression|intrusive|ostomy psychosocial|mental/)) return { category: C.PSYCH, topic: TOPICS.MENTAL_HEALTH_DISORDERS, reason: "The record tests recognition, adaptation, or recovery for a mental-health condition." };
  }

  if (finding.category === C.BCC) {
    if (has(t, /pressure|wound|skin inspection/)) return { category: C.BCC, topic: TOPICS.SKIN_WOUND_CARE, reason: "The record tests skin integrity, pressure-injury prevention, staging, or wound healing." };
    if (has(t, /ostomy|colostomy/)) return { category: C.BCC, topic: TOPICS.ELIMINATION_COMFORT, reason: "The record tests ostomy care as an elimination and comfort need." };
    if (has(t, /rehabilitation|mobility|immobility/)) return { category: C.BCC, topic: TOPICS.MOBILITY_IMMOBILITY, reason: "The record tests mobility, rehabilitation, or immobility care." };
    if (has(t, /pain|comfort/)) return { category: C.BCC, topic: TOPICS.PALLIATIVE_SUPPORTIVE_CARE, reason: "The record tests nonpharmacologic pain or supportive comfort care." };
    if (has(t, /warfarin-enoxaparin/)) return { category: C.PHARM, topic: TOPICS.ANTICOAGULANT_THERAPY, reason: "The record tests anticoagulant bridge management rather than a basic-care need." };
    if (has(t, /nutrition|refeeding|feeding|tpn|mucositis|dehydration|pancreatitis/)) return { category: C.BCC, topic: TOPICS.NUTRITIONAL_FLUID_SUPPORT, reason: "The record tests nutrition, hydration, feeding, or fluid support." };
    if (has(t, /delirium/)) return { category: C.BCC, topic: TOPICS.ELIMINATION_COMFORT, reason: "The record tests prevention of basic-care complications in a client with delirium." };
  }

  if (finding.category === C.PHARM) {
    if (has(t, /dose calculation|weight-based dosing|fib_|calculation/)) return { category: C.PHARM, topic: TOPICS.DOSAGE_CALCULATIONS, reason: "The tested construct is medication arithmetic." };
    if (has(t, /warfarin|heparin|enoxaparin|rivaroxaban|anticoagul|pulmonary embolism/)) return { category: C.PHARM, topic: TOPICS.ANTICOAGULANT_THERAPY, reason: "The record tests anticoagulant therapy, monitoring, reversal, or teaching." };
    if (has(t, /transfusion|blood product|cryoprecipitate/)) return { category: C.PHARM, topic: TOPICS.TRANSFUSION_BLOOD_PRODUCTS, reason: "The record tests blood-product administration, indication, or monitoring." };
    if (has(t, /tpn|parenteral nutrition|mucositis tpn/)) return { category: C.PHARM, topic: TOPICS.PARENTERAL_NUTRITION, reason: "The record tests parenteral nutrition therapy or monitoring." };
    if (has(t, /lithium|haloperidol|mania medication|psychotropic|antipsychotic|serotonin|nms|hyperthermic syndrome/)) return { category: C.PHARM, topic: TOPICS.PSYCHOTROPIC_MEDICATIONS, reason: "The record tests psychotropic therapy or toxicity monitoring." };
    if (has(t, /adenosine|atropine|diuretic|epinephrine|insulin safety|metformin|thyroid storm|vasopressor|cardiac arrest/)) return { category: C.PHARM, topic: TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS, reason: "The record tests cardiovascular or endocrine medication therapy." };
    if (has(t, /graft-versus-host|checkpoint inhibitor|myocarditis/)) return { category: C.PA, topic: TOPICS.ONCOLOGY_IMMUNOTHERAPY_COMPLICATIONS, reason: "The record tests an established oncology or immunotherapy complication rather than medication administration." };
    if (has(t, /fluid resuscitation|fluid bolus|septic shock response to fluids/)) return { category: C.PHARM, topic: TOPICS.MEDICATION_SAFETY_ADMIN, reason: "The item evaluates prescribed IV-fluid administration or response without testing fluid arithmetic." };
    if (has(t, /antibiotic|antimicrobial|vancomycin|gentamicin|cefazolin|tuberculosis|c\. difficile|corticosteroid|ethambutol|opioid|naloxone|potassium|infusion|medication|antimotility|status epilepticus|gbs treatment|organophosphate|osmotic|sedation|prerenal acute kidney injury/)) return { category: C.PHARM, topic: TOPICS.MEDICATION_SAFETY_ADMIN, reason: "The record tests safe medication selection, administration, monitoring, or adverse-effect response." };
  }

  if (finding.category === C.RRP) {
    if (has(t, /postpartum|preeclampsia|uterine atony/)) return { category: C.RRP, topic: TOPICS.MATERNAL_NEWBORN, reason: "The risk-potential construct is specific to a maternal complication." };
    if (has(t, /car-t|tumor lysis|checkpoint inhibitor|myocarditis/)) return { category: C.RRP, topic: TOPICS.ONCOLOGY_IMMUNOTHERAPY_COMPLICATIONS, reason: "The record tests monitoring or response to an oncology or immunotherapy complication." };
    if (has(t, /pressure|wound/)) return { category: C.RRP, topic: TOPICS.SKIN_WOUND_CARE, reason: "The record tests wound measurement, staging, or complication risk." };
    if (has(t, /postop|postoperative|perioperative|sedation|surgery|thyroidectomy|hemorrhage|or handoff|resuscitation response/)) return { category: C.RRP, topic: TOPICS.PERIOPERATIVE_CARE, reason: "The record tests perioperative readiness, deterioration, or complication monitoring." };
    if (has(t, /chest tube|tracheostomy|ventilator|intubation|anesthesia circuit|catheter|portable oxygen|procedur|dislodgement/)) return { category: C.RRP, topic: TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS, reason: "The record tests a procedure- or device-related complication." };
    if (has(t, /fluid balance/)) return { category: C.BCC, topic: TOPICS.NUTRITIONAL_FLUID_SUPPORT, reason: "The tested construct is intake/output or net fluid balance, which the IV-fluid ruling keeps outside calculation taxonomy." };
    if (has(t, /atrial fibrillation|acute heart failure|adhf|anticoagulation|blood replacement/)) return { category: C.RRP, topic: TOPICS.LAB_DIAGNOSTIC_TESTS, reason: "The record tests monitoring or evaluation data for cardiovascular risk reduction." };
    if (has(t, /stroke|kidney|aki|pancreatitis|adrenal|magnesium|sodium|hemoglobin|gb[sS]|intracranial|lithium|sepsis|septic|status epilepticus|c\. difficile|toxic megacolon|fracture|nonaccidental trauma|urine output|dehydration|cue|diagnostic|trend|pathophysiology/)) return { category: C.RRP, topic: TOPICS.LAB_DIAGNOSTIC_TESTS, reason: "The record tests recognition or interpretation of assessment, laboratory, or monitoring data." };
  }

  if (finding.category === C.PA) {
    if (has(t, /postpartum|preeclampsia|uterine atony/)) return { category: C.PA, topic: TOPICS.MATERNAL_NEWBORN, reason: "The established physiologic complication is specific to maternal-newborn care." };
    if (has(t, /transfusion|hemolytic reaction|blood product/)) return { category: C.PA, topic: TOPICS.TRANSFUSION_BLOOD_PRODUCTS, reason: "The established complication is a blood-product reaction." };
    if (has(t, /graft-versus-host|checkpoint inhibitor|myocarditis|tumor lysis|spinal cord compression|mucositis/)) return { category: C.PA, topic: TOPICS.ONCOLOGY_IMMUNOTHERAPY_COMPLICATIONS, reason: "The record tests an established oncology or immunotherapy complication." };
    if (has(t, /sepsis|septic|urosepsis/)) return { category: C.PA, topic: TOPICS.SEPSIS_SEPTIC_SHOCK, reason: "The record tests established sepsis or septic-shock physiology and management." };
    if (has(t, /burn|thermal/)) return { category: C.PA, topic: TOPICS.BURN_MANAGEMENT, reason: "The record falls within the closed Burn Management clinical rollup." };
    if (has(t, /refeeding|electrolyte|hyperkalemia|hypokalemia|fluid and electrolyte/)) return { category: C.PA, topic: TOPICS.ELECTROLYTE_IMBALANCES, reason: "The record tests an established electrolyte disorder or its physiologic consequences." };
    if (has(t, /thyroid|adrenal|hypoglycemia|lithium|status epilepticus|brain|intracranial|cushing|autonomic dysreflexia|guillain|gbs|tbi|neurolog|\bicp\b|delirium/)) return { category: C.PA, topic: TOPICS.ENDOCRINE_NEUROLOGICAL_DISORDERS, reason: "The record tests an established endocrine or neurologic disorder." };
    if (has(t, /c\. difficile|celiac|pancreatitis|variceal|gastrointestinal|pyloric|intussusception|kidney|renal|dehydration/)) return { category: C.PA, topic: TOPICS.RENAL_GASTROINTESTINAL_DISORDERS, reason: "The record tests an established renal or gastrointestinal disorder." };
    if (has(t, /copd|bronchospasm|intubat|airway|pulmonary embolism|respiratory|trache/)) return { category: C.PA, topic: TOPICS.RESPIRATORY_INFECTIOUS_DISORDERS, reason: "The record tests an established respiratory or infectious disorder." };
    if (has(t, /heart|myocardial|atrial|flutter|block|arrhythm|cardiac|shock|vfib|dic|ros[cC]|hemorrhage/)) return { category: C.PA, topic: TOPICS.CARDIOVASCULAR_DISORDERS, reason: "The record tests an established cardiovascular disorder or shock state." };
    if (has(t, /physiological adaptation/)) return { category: C.PA, topic: TOPICS.ENDOCRINE_NEUROLOGICAL_DISORDERS, reason: "The generic legacy label is resolved from the item's tested neurologic construct." };
  }

  return null;
};

const loadBanks = async (): Promise<Array<{ file: string; path: string; bank: BankEnvelope }>> => {
  const files = (await readdir(CANONICAL_DIR)).filter((file) => file.endsWith(".json")).sort();
  const loaded = [];
  for (const file of files) {
    const path = join(CANONICAL_DIR, file);
    const parsed = validateBankObject(parseBankText(await readFile(path, "utf8")), { rejectUnknownKeys: true });
    if (!parsed.ok) throw new Error(`${file}: ${parsed.reasons.join("\n")}`);
    loaded.push({ file: basename(file), path, bank: parsed.value });
  }
  return loaded;
};

const buildManifest = (loaded: Array<{ file: string; bank: BankEnvelope }>): ManifestChange[] => {
  const analysis = analyzeTopicLicenses(loaded);
  if (analysis.findings.length !== EXPECTED_FINDINGS) {
    throw new Error(`Expected ${EXPECTED_FINDINGS} findings, found ${analysis.findings.length}; source population drifted.`);
  }
  for (const [key, expected] of Object.entries(EXPECTED_SPLIT)) {
    const actual = analysis.findings.filter((finding) => finding.issue === key || finding.kind === key).length;
    if (actual !== expected) throw new Error(`Expected ${expected} ${key} findings, found ${actual}; source population drifted.`);
  }
  const changes = analysis.findings.map((finding): ManifestChange => {
    if (finding.issue === "license_mismatch" && !exact.has(finding.id)) {
      throw new Error(`License mismatch lacks an explicit item-level adjudication: ${finding.id}`);
    }
    const decision = semanticDecision(finding);
    if (!decision) throw new Error(`No semantic adjudication for ${finding.id} (${finding.category} / ${finding.topic}).`);
    if (!isCanonicalTopic(decision.topic)) throw new Error(`${finding.id}: noncanonical target ${decision.topic}`);
    if (!topicCategories(decision.topic).includes(decision.category)) {
      throw new Error(`${finding.id}: ${decision.topic} is not licensed for ${decision.category}`);
    }
    return {
      id: finding.id,
      file: finding.file,
      path: finding.path,
      kind: finding.kind,
      parentId: finding.parentId,
      issue: finding.issue,
      beforeCategory: finding.category,
      beforeTopic: finding.topic,
      afterCategory: decision.category,
      afterTopic: decision.topic,
      categoryChanged: finding.category !== decision.category,
      reason: decision.reason,
    };
  });
  const ids = new Set(changes.map((change) => change.id));
  if (ids.size !== changes.length) throw new Error("Finding IDs are not unique; refusing ambiguous migration.");
  return changes;
};

const count = (changes: readonly ManifestChange[], predicate: (change: ManifestChange) => boolean): number => changes.filter(predicate).length;
const escapeCell = (value: string | null): string => (value ?? "—").replace(/\|/g, "\\|").replace(/\n/g, "<br>");

const renderReport = (changes: readonly ManifestChange[]): string => {
  const issueOrder: TopicLicenseIssue[] = ["noncanonical_topic", "license_mismatch"];
  const kindOrder: QuestionPopulationKind[] = ["top_level_case_container", "top_level_scored_leaf", "embedded_scored_leaf"];
  const lines = [
    "# Topic-License Semantic Adjudication — 2026-07-16",
    "",
    "Status: controlled migration manifest for the complete current-HEAD topic/license residual.",
    "",
    "This report records semantic decisions, not merely string aliases. Case-study containers are reported separately and are never counted as scored leaves.",
    "",
    "## Summary",
    "",
    `- Unique records adjudicated: ${changes.length}`,
    `- Noncanonical-topic findings: ${count(changes, (change) => change.issue === "noncanonical_topic")}`,
    `- Canonical topic/category license mismatches: ${count(changes, (change) => change.issue === "license_mismatch")}`,
    `- Case-study containers: ${count(changes, (change) => change.kind === "top_level_case_container")}`,
    `- Standalone scored leaves: ${count(changes, (change) => change.kind === "top_level_scored_leaf")}`,
    `- Embedded scored leaves: ${count(changes, (change) => change.kind === "embedded_scored_leaf")}`,
    `- Scored leaves: ${count(changes, (change) => change.kind !== "top_level_case_container")}`,
    `- Category corrections: ${count(changes, (change) => change.categoryChanged)}`,
    "",
    "The topic-license gate validates vocabulary membership and declared category licenses only. It cannot enforce the clinical boundary among categories licensed for a SHARED topic; those boundaries were handled here by semantic review and remain a human-review responsibility.",
    "",
  ];

  for (const issue of issueOrder) {
    lines.push(`## ${issue}`, "");
    for (const kind of kindOrder) {
      const rows = changes.filter((change) => change.issue === issue && change.kind === kind);
      lines.push(`### ${kind} (${rows.length})`, "");
      if (rows.length === 0) {
        lines.push("None.", "");
        continue;
      }
      lines.push(
        "| ID | File | Parent | Before | After | Category changed | Adjudication |",
        "|---|---|---|---|---|---|---|",
      );
      for (const row of rows) {
        lines.push(`| \`${row.id}\` | ${row.file} | ${escapeCell(row.parentId)} | ${escapeCell(row.beforeCategory)} / ${escapeCell(row.beforeTopic)} | ${escapeCell(row.afterCategory)} / ${escapeCell(row.afterTopic)} | ${row.categoryChanged ? "yes" : "no"} | ${escapeCell(row.reason)} |`);
      }
      lines.push("");
    }
  }
  return lines.join("\n");
};

const applyManifest = async (
  loaded: Array<{ file: string; path: string; bank: BankEnvelope }>,
  changes: readonly ManifestChange[],
): Promise<void> => {
  const byFile = new Map<string, ManifestChange[]>();
  for (const change of changes) byFile.set(change.file, [...(byFile.get(change.file) ?? []), change]);

  for (const entry of loaded) {
    const fileChanges = byFile.get(entry.file);
    if (!fileChanges) continue;
    const records = new Map(collectQuestionPopulation(entry.bank).map((record) => [record.path, record]));
    for (const change of fileChanges) {
      const record = records.get(change.path);
      if (!record || record.question.id !== change.id || record.kind !== change.kind || record.parentId !== change.parentId) {
        throw new Error(`${change.id}: record identity or kind drifted at ${change.file}:${change.path}`);
      }
      if (record.question.category !== change.beforeCategory || record.question.topic !== change.beforeTopic) {
        throw new Error(`${change.id}: before-values drifted; refusing write.`);
      }
      record.question.category = change.afterCategory;
      record.question.topic = change.afterTopic;
    }
    if (entry.bank.meta) entry.bank.meta.count = entry.bank.questions.length;
    const validated = validateBankObject(entry.bank, { rejectUnknownKeys: true });
    if (!validated.ok) throw new Error(`${entry.file}: post-migration validation failed:\n${validated.reasons.join("\n")}`);
    await writeFile(entry.path, `${JSON.stringify(entry.bank, null, 2)}\n`, "utf8");
  }
};

const verifyAppliedManifest = async (
  loaded: Array<{ file: string; bank: BankEnvelope }>,
): Promise<void> => {
  const parsed = JSON.parse(await readFile(MANIFEST_PATH, "utf8")) as { changes?: ManifestChange[] };
  const changes = parsed.changes;
  if (!Array.isArray(changes) || changes.length !== EXPECTED_FINDINGS) {
    throw new Error(`Applied manifest must contain exactly ${EXPECTED_FINDINGS} changes.`);
  }
  for (const [key, expected] of Object.entries(EXPECTED_SPLIT)) {
    const actual = changes.filter((change) => change.issue === key || change.kind === key).length;
    if (actual !== expected) throw new Error(`Applied manifest has ${actual} ${key} rows; expected ${expected}.`);
  }
  const byFile = new Map(loaded.map((entry) => [entry.file, new Map(collectQuestionPopulation(entry.bank).map((record) => [record.path, record]))]));
  for (const change of changes) {
    const record = byFile.get(change.file)?.get(change.path);
    if (!record || record.question.id !== change.id || record.kind !== change.kind || record.parentId !== change.parentId) {
      throw new Error(`${change.id}: applied record identity or kind does not match the manifest.`);
    }
    if (record.question.category !== change.afterCategory || record.question.topic !== change.afterTopic) {
      throw new Error(`${change.id}: applied category/topic does not match the manifest.`);
    }
  }
  const remaining = analyzeTopicLicenses(loaded).findings;
  if (remaining.length !== 0) throw new Error(`Applied banks still contain ${remaining.length} topic/license findings.`);
  console.log(`Verified ${changes.length} applied changes and zero remaining topic/license findings.`);
};

const run = async (): Promise<void> => {
  const loaded = await loadBanks();
  if (process.argv.includes("--verify")) {
    await verifyAppliedManifest(loaded);
    return;
  }
  const changes = buildManifest(loaded);
  const manifest = {
    meta: {
      generatedAt: "2026-07-16",
      source: "current canonical banks",
      expectedUniqueFindings: EXPECTED_FINDINGS,
      caseContainers: count(changes, (change) => change.kind === "top_level_case_container"),
      standaloneScoredLeaves: count(changes, (change) => change.kind === "top_level_scored_leaf"),
      embeddedScoredLeaves: count(changes, (change) => change.kind === "embedded_scored_leaf"),
      limitation: "Vocabulary membership only: the hygiene gate cannot enforce clinical boundaries among categories licensed for a SHARED topic.",
    },
    changes,
  };
  await mkdir(dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await writeFile(REPORT_PATH, renderReport(changes), "utf8");
  console.log(`Adjudicated ${changes.length} findings; manifest: ${MANIFEST_PATH}; report: ${REPORT_PATH}`);
  if (process.argv.includes("--apply")) {
    await applyManifest(loaded, changes);
    console.log(`Applied ${changes.length} controlled topic/license changes.`);
  } else {
    console.log("Dry run only. Re-run with --apply after reviewing the manifest and report.");
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) await run();
