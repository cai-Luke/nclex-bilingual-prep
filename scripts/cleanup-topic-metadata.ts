import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { parseBankText } from "../src/bankImport";
import { validateBankObject } from "../src/schema";
import { TOPICS, aliasTopic, isCanonicalTopic } from "../src/topics";

type JsonRecord = Record<string, any>;

type TopicRule = {
  topic: string;
  reason: string;
  category?: string;
  test: (text: string, question: JsonRecord) => boolean;
};

type ProposedChange = {
  file: string;
  id: string;
  oldTopic: string;
  newTopic: string;
  category: string;
  itemType: string;
  reason: string;
};

const reportDate = "2026-06-16";
const dryRun = process.argv.includes("--dry-run") || !process.argv.includes("--allow-canonical");
const allowCanonicalWrite = process.argv.includes("--allow-canonical");
const reasonIndex = process.argv.indexOf("--reason");
const writeReason = reasonIndex >= 0 ? process.argv[reasonIndex + 1] : undefined;
const reportLabelIndex = process.argv.indexOf("--report-label");
const reportLabel = reportLabelIndex >= 0 ? process.argv[reportLabelIndex + 1] : undefined;

if (allowCanonicalWrite && !writeReason) {
  throw new Error('Canonical topic cleanup writes require --reason "..."');
}

const canonicalTopics = {
  ABG: TOPICS.ABG_ACID_BASE,
  ADULT_HEALTH: TOPICS.ADULT_HEALTH,
  ANTICOAGULANT: TOPICS.ANTICOAGULANT_THERAPY,
  BURN: TOPICS.BURN_MANAGEMENT,
  CARDIO: TOPICS.CARDIOVASCULAR_DISORDERS,
  CARDIO_ENDOCRINE_MEDS: TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS,
  CHRONIC_LIFESTYLE: TOPICS.CHRONIC_DISEASE_LIFESTYLE,
  CLIENT_ADVOCACY: TOPICS.CLIENT_ADVOCACY,
  CONFIDENTIALITY: TOPICS.CONFIDENTIALITY_HIPAA,
  CONFLICT: TOPICS.CONFLICT_RESOLUTION,
  DISASTER: TOPICS.DISASTER_EMERGENCY_PREPAREDNESS,
  DISCHARGE: TOPICS.DISCHARGE_HANDOFF,
  DKA: TOPICS.DIABETIC_KETOACIDOSIS,
  DOSAGE: TOPICS.DOSAGE_CALCULATIONS,
  ECT: TOPICS.ECT,
  ELECTROLYTES: TOPICS.ELECTROLYTE_IMBALANCES,
  ELIMINATION: TOPICS.ELIMINATION_COMFORT,
  ENDOCRINE_NEURO: TOPICS.ENDOCRINE_NEUROLOGICAL_DISORDERS,
  LABS: TOPICS.LAB_DIAGNOSTIC_TESTS,
  LEGAL: TOPICS.LEGAL_ETHICAL,
  MATERNAL_NEWBORN: TOPICS.MATERNAL_NEWBORN,
  MED_SAFETY: TOPICS.MEDICATION_SAFETY_ADMIN,
  MENTAL_HEALTH: TOPICS.MENTAL_HEALTH_DISORDERS,
  MOBILITY: TOPICS.MOBILITY_IMMOBILITY,
  NUTRITION: TOPICS.NUTRITIONAL_FLUID_SUPPORT,
  PALLIATIVE: TOPICS.PALLIATIVE_SUPPORTIVE_CARE,
  PARENTERAL_NUTRITION: TOPICS.PARENTERAL_NUTRITION,
  PATIENT_SAFETY: TOPICS.PATIENT_ENVIRONMENT_SAFETY,
  PEDIATRIC: TOPICS.PEDIATRIC_ADOLESCENT_HEALTH,
  PEDIATRIC_SAFETY: TOPICS.PEDIATRIC_TODDLER_SAFETY,
  PERIOP: TOPICS.PERIOPERATIVE_CARE,
  PPE: TOPICS.PPE_STERILE_TECHNIQUE,
  PROCEDURES: TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS,
  PSYCHOTROPIC: TOPICS.PSYCHOTROPIC_MEDICATIONS,
  RENAL_GI: TOPICS.RENAL_GASTROINTESTINAL_DISORDERS,
  REPRODUCTIVE_ENDOCRINE: TOPICS.REPRODUCTIVE_ENDOCRINE_HEALTH,
  RESPIRATORY: TOPICS.RESPIRATORY_INFECTIOUS_DISORDERS,
  SEPSIS: TOPICS.SEPSIS_SEPTIC_SHOCK,
  SLEEP: TOPICS.SLEEP_REST,
  STANDARD: TOPICS.STANDARD_PRECAUTIONS_HYGIENE,
  SUBSTANCE: TOPICS.SUBSTANCE_USE_WITHDRAWAL,
  SUICIDE_CRISIS: TOPICS.SUICIDE_CRISIS_INTERVENTION,
  THERAPEUTIC_COMM: TOPICS.THERAPEUTIC_COMMUNICATION,
  TRANSMISSION: TOPICS.TRANSMISSION_BASED_PRECAUTIONS,
  TRIAGE_DELEGATION: TOPICS.PRIORITIZATION_DELEGATION,
};

const exactTopicFixes = new Map<string, string>([
  ["dosage calculations", canonicalTopics.DOSAGE],
  ["grief and loss", canonicalTopics.THERAPEUTIC_COMM],
  ["hazardous materials", canonicalTopics.PATIENT_SAFETY],
  ["laboratory values", canonicalTopics.LABS],
  ["medication safety", canonicalTopics.MED_SAFETY],
  ["nutrition", canonicalTopics.NUTRITION],
  ["restraint monitoring", canonicalTopics.PATIENT_SAFETY],
  ["schizophrenia", canonicalTopics.MENTAL_HEALTH],
  ["sharps disposal", canonicalTopics.STANDARD],
  ["therapeutic communication", canonicalTopics.THERAPEUTIC_COMM],
  ["airborne precautions", canonicalTopics.TRANSMISSION],
  ["standard precautions", canonicalTopics.STANDARD],
  ["transmission-based precautions", canonicalTopics.TRANSMISSION],
  ["ppe doffing", canonicalTopics.PPE],
  ["ppe donning", canonicalTopics.PPE],
  ["mobility", canonicalTopics.MOBILITY],
  ["sleep hygiene", canonicalTopics.SLEEP],
  ["rest and sleep", canonicalTopics.SLEEP],
  ["radiation safety", canonicalTopics.PATIENT_SAFETY],
  ["seizure precautions", canonicalTopics.ENDOCRINE_NEURO],
  ["informed consent", canonicalTopics.LEGAL],
  ["advance directives", canonicalTopics.LEGAL],
  ["client advocacy", canonicalTopics.CLIENT_ADVOCACY],
  ["hipaa and confidentiality", canonicalTopics.CONFIDENTIALITY],
  ["client rights and refusal", canonicalTopics.LEGAL],
  ["delegation to uap", canonicalTopics.TRIAGE_DELEGATION],
  ["delegation to lpn", canonicalTopics.TRIAGE_DELEGATION],
  ["discharge planning", canonicalTopics.DISCHARGE],
  ["continuity of care", canonicalTopics.DISCHARGE],
  ["ethical principles", canonicalTopics.LEGAL],
  ["emergency severity index (esi) triage", canonicalTopics.TRIAGE_DELEGATION],
  ["disaster triage", canonicalTopics.DISASTER],
  ["incident reporting", canonicalTopics.LEGAL],
  ["crutch walking", canonicalTopics.MOBILITY],
  ["cane use", canonicalTopics.MOBILITY],
  ["wheelchair transfer safety", canonicalTopics.MOBILITY],
  ["diabetic foot care", canonicalTopics.ELIMINATION],
  ["bladder training", canonicalTopics.ELIMINATION],
  ["skin integrity", canonicalTopics.ELIMINATION],
  ["non-pharmacological comfort", canonicalTopics.PALLIATIVE],
  ["enteral nutrition", canonicalTopics.NUTRITION],
  ["positioning", canonicalTopics.MOBILITY],
  ["fluid balance", canonicalTopics.NUTRITION],
  ["elimination", canonicalTopics.ELIMINATION],
  ["droplet precautions", canonicalTopics.TRANSMISSION],
  ["contact precautions", canonicalTopics.TRANSMISSION],
  ["hand hygiene", canonicalTopics.STANDARD],
  ["neutropenic precautions", canonicalTopics.TRANSMISSION],
  ["blood transfusion", canonicalTopics.MED_SAFETY],
  ["total parenteral nutrition", canonicalTopics.PARENTERAL_NUTRITION],
  ["intravenous therapy", canonicalTopics.MED_SAFETY],
  ["insulin administration", canonicalTopics.MED_SAFETY],
  ["controlled substances", canonicalTopics.MED_SAFETY],
  ["assistive devices", canonicalTopics.MOBILITY],
  ["personal hygiene", canonicalTopics.ELIMINATION],
  ["non-pharmacological comfort (heat/cold therapy)", canonicalTopics.PALLIATIVE],
  ["rest and sleep (sleep hygiene)", canonicalTopics.SLEEP],
  ["elimination (bladder training)", canonicalTopics.ELIMINATION],
  ["personal hygiene (diabetic foot care)", canonicalTopics.ELIMINATION],
  ["nutrition (enteral feeding)", canonicalTopics.NUTRITION],
  ["fall prevention", canonicalTopics.PATIENT_SAFETY],
  ["fire safety", canonicalTopics.PATIENT_SAFETY],
  ["restraint safety", canonicalTopics.PATIENT_SAFETY],
  ["c. difficile care", canonicalTopics.TRANSMISSION],
  ["laboratory values (warfarin/inr)", canonicalTopics.LABS],
  ["laboratory values (heparin titration)", canonicalTopics.LABS],
  ["laboratory values (abg interpretation)", canonicalTopics.ABG],
  ["laboratory values (hba1c)", canonicalTopics.LABS],
  ["potential for complications (procedures)", canonicalTopics.PROCEDURES],
  ["potential for complications (blood transfusion)", canonicalTopics.PROCEDURES],
  ["therapeutic procedures (ng tube placement)", canonicalTopics.PROCEDURES],
  ["liver biopsy", canonicalTopics.PROCEDURES],
  ["central venous catheter", canonicalTopics.STANDARD],
  ["diagnostic tests", canonicalTopics.LABS],
  ["therapeutic procedures", canonicalTopics.PROCEDURES],
  ["therapeutic levels", canonicalTopics.LABS],
  ["postoperative complications", canonicalTopics.PERIOP],
  ["dvt", canonicalTopics.PROCEDURES],
  ["dvt management", canonicalTopics.PROCEDURES],
  ["developmental stages", canonicalTopics.PEDIATRIC],
  ["antepartum care", canonicalTopics.MATERNAL_NEWBORN],
  ["health screening", canonicalTopics.ADULT_HEALTH],
  ["aging process", canonicalTopics.ADULT_HEALTH],
  ["physical assessment", canonicalTopics.ADULT_HEALTH],
  ["lifestyle choices", canonicalTopics.CHRONIC_LIFESTYLE],
  ["newborn care", canonicalTopics.MATERNAL_NEWBORN],
  ["high risk behaviors", canonicalTopics.PEDIATRIC],
  ["postpartum care", canonicalTopics.MATERNAL_NEWBORN],
  ["prenatal nutrition", canonicalTopics.MATERNAL_NEWBORN],
  ["geriatric immunizations", canonicalTopics.ADULT_HEALTH],
  ["colorectal cancer screening", canonicalTopics.ADULT_HEALTH],
  ["12-month-old assessment", canonicalTopics.PEDIATRIC],
  ["menopause teaching", canonicalTopics.REPRODUCTIVE_ENDOCRINE],
  ["scoliosis screening", canonicalTopics.PEDIATRIC],
  ["levels of prevention", canonicalTopics.ADULT_HEALTH],
  ["defense mechanisms", canonicalTopics.MENTAL_HEALTH],
  ["crisis intervention", canonicalTopics.SUICIDE_CRISIS],
  ["substance use disorder", canonicalTopics.SUBSTANCE],
  ["personality disorders", canonicalTopics.MENTAL_HEALTH],
  ["alcohol withdrawal", canonicalTopics.SUBSTANCE],
  ["behavioral interventions", canonicalTopics.SUICIDE_CRISIS],
  ["mental health concepts", canonicalTopics.MENTAL_HEALTH],
  ["coping mechanisms", canonicalTopics.MENTAL_HEALTH],
  ["abuse and neglect", canonicalTopics.SUICIDE_CRISIS],
  ["cultural awareness", canonicalTopics.THERAPEUTIC_COMM],
  ["psychopathology", canonicalTopics.MENTAL_HEALTH],
  ["antibiotic safety", canonicalTopics.MED_SAFETY],
  ["system-specific assessment (respiratory)", canonicalTopics.RESPIRATORY],
  ["respiratory monitoring", canonicalTopics.RESPIRATORY],
  ["nursing interventions", canonicalTopics.RESPIRATORY],
]);

const broadTopics = new Set<string>([
  canonicalTopics.PATIENT_SAFETY,
  canonicalTopics.ECT,
  canonicalTopics.TRANSMISSION,
  canonicalTopics.STANDARD,
  canonicalTopics.PPE,
  canonicalTopics.SUICIDE_CRISIS,
  canonicalTopics.ADULT_HEALTH,
  canonicalTopics.PROCEDURES,
  canonicalTopics.ELIMINATION,
]);

const idTopicOverrides = new Map<string, string>([
  ["claude_a_sata_eps_haloperidol_12", canonicalTopics.PSYCHOTROPIC],
  ["claude_a_mc_metoprolol_assessment_10", canonicalTopics.CARDIO_ENDOCRINE_MEDS],
  ["claude_a_mc_ace_inhibitor_11", canonicalTopics.CARDIO_ENDOCRINE_MEDS],
  ["claude_a_mc_metformin_contrast_13", canonicalTopics.CARDIO_ENDOCRINE_MEDS],
  ["claude_a_cloze_aki_20", canonicalTopics.RENAL_GI],
  ["claude_a_mc_thyroid_storm_17", canonicalTopics.ENDOCRINE_NEURO],
  ["claude_a_sata_mmr_vaccine_48", canonicalTopics.PEDIATRIC],
  ["claude_a_matrix_wound_assessment_26", canonicalTopics.PERIOP],
  ["claude_a_sata_tracheostomy_09", canonicalTopics.PROCEDURES],
  ["claude_a_mc_cauti_prevention_27", canonicalTopics.STANDARD],

  ["gemini_jun05_a_mc_advance_directives_01", canonicalTopics.LEGAL],
  ["gemini_jun05_a_sata_central_line_11", canonicalTopics.STANDARD],
  ["gemini_jun05_a_or_chest_tube_disconnection_13", canonicalTopics.PROCEDURES],
  ["gemini_jun05_a_cloze_depression_23", canonicalTopics.SUICIDE_CRISIS],
  ["gemini_jun05_a_sata_pacemaker_41", canonicalTopics.PROCEDURES],
  ["gemini_jun05_a_sata_preeclampsia_31", canonicalTopics.MATERNAL_NEWBORN],
  ["gemini_jun05_a_matrix_cardiac_cath_18", canonicalTopics.PROCEDURES],
  ["gemini_jun05_a_mc_dysphagia_29", canonicalTopics.NUTRITION],
  ["gemini_jun05_a_mc_ibd_diet_46", canonicalTopics.RENAL_GI],
  ["gemini_jun05_a_matrix_appendicitis_45", canonicalTopics.LABS],
  ["gemini_jun05_a_matrix_hip_precautions_50", canonicalTopics.MOBILITY],
  ["gemini_jun05_b_cloze_dysphagia_19", canonicalTopics.NUTRITION],
  ["gemini_jun05_b_fib_dosage_01", canonicalTopics.DOSAGE],
  ["gemini_jun05_b_fib_dosage_02", canonicalTopics.DOSAGE],
  ["gemini_jun05_b_fib_fluid_03", canonicalTopics.DOSAGE],
  ["gemini_jun05_b_fib_vital_08", canonicalTopics.CARDIO],
  ["gemini_jun05_b_cloze_aki_13", canonicalTopics.RENAL_GI],
  ["gemini_jun05_b_cloze_depression_14", canonicalTopics.SUICIDE_CRISIS],
  ["gemini_jun05_b_cloze_ipv_17", canonicalTopics.SUICIDE_CRISIS],
  ["gemini_jun05_b_cloze_cath_20", canonicalTopics.PROCEDURES],
  ["gemini_b10_07", canonicalTopics.PROCEDURES],
  ["gemini_b2_01", canonicalTopics.PSYCHOTROPIC],
  ["gemini_b2_02", canonicalTopics.CARDIO_ENDOCRINE_MEDS],
  ["gemini_b2_04", canonicalTopics.CARDIO_ENDOCRINE_MEDS],
  ["gemini_b2_05", canonicalTopics.PSYCHOTROPIC],
  ["gemini_b2_07", canonicalTopics.CARDIO_ENDOCRINE_MEDS],
  ["gemini_b2_09", canonicalTopics.PSYCHOTROPIC],
  ["gemini_b3_03", canonicalTopics.PEDIATRIC],
  ["gemini_b3_08", canonicalTopics.PEDIATRIC],
  ["gemini_b5_02", canonicalTopics.SLEEP],
  ["gemini_b5_06", canonicalTopics.SLEEP],
  ["gemini_b5_09", canonicalTopics.SLEEP],
  ["gemini_b9_04", canonicalTopics.MATERNAL_NEWBORN],
  ["gemini_c10_02", canonicalTopics.MATERNAL_NEWBORN],
  ["gemini_c10_06", canonicalTopics.PEDIATRIC],
  ["gemini_c10_09", canonicalTopics.ENDOCRINE_NEURO],
  ["gemini_c10_10", canonicalTopics.ELECTROLYTES],
  ["gemini_d1_10_cloze_mag_electrolyte_link", canonicalTopics.ELECTROLYTES],
  ["gemini_d10_07", canonicalTopics.ELIMINATION],
  ["gemini_d10_09", canonicalTopics.MATERNAL_NEWBORN],
  ["gemini_d10_10", canonicalTopics.ELECTROLYTES],
  ["gemini_d6_toddler_poisoning_02", canonicalTopics.PEDIATRIC_SAFETY],
  ["gemini_d6_toddler_lead_poisoning_07", canonicalTopics.PEDIATRIC_SAFETY],
  ["gemini_d6_toddler_drowning_safety_09", canonicalTopics.PEDIATRIC_SAFETY],
  ["gemini_d8_01", canonicalTopics.LABS],
  ["gemini_d8_07", canonicalTopics.LABS],
  ["gemini_c8_07", canonicalTopics.LABS],
  ["gemini_p1_02", canonicalTopics.PEDIATRIC],
  ["gemini_p1_06", canonicalTopics.PEDIATRIC],
  ["gemini_p1_07", canonicalTopics.STANDARD],
  ["gemini_p1_10", canonicalTopics.ADULT_HEALTH],
  ["gemini_p9_sata_05", canonicalTopics.PEDIATRIC_SAFETY],
  ["gemini_p10_1", canonicalTopics.MENTAL_HEALTH],
  ["gemini_p10_3", canonicalTopics.SUBSTANCE],
  ["gemini_p10_5", canonicalTopics.MENTAL_HEALTH],
  ["gemini_p10_6", canonicalTopics.MENTAL_HEALTH],
  ["gemini_p10_8", canonicalTopics.MENTAL_HEALTH],
  ["gemini_p10_10", canonicalTopics.MENTAL_HEALTH],
  ["trad_ppt_20", canonicalTopics.CARDIO_ENDOCRINE_MEDS],
  ["trad_ppt_22", canonicalTopics.CARDIO_ENDOCRINE_MEDS],
  ["trad_ppt_24", canonicalTopics.MED_SAFETY],
  ["trad_batchB_05", canonicalTopics.LEGAL],
  ["trad_batchC_03", canonicalTopics.PEDIATRIC_SAFETY],
  ["trad_batchC_12", canonicalTopics.SUICIDE_CRISIS],
  ["trad_batchC_13", canonicalTopics.PEDIATRIC],
  ["trad_batchC_18", canonicalTopics.THERAPEUTIC_COMM],
  ["trad_batchD_05", canonicalTopics.ELIMINATION],
  ["trad_batchD_11", canonicalTopics.PERIOP],
  ["trad_batchD_23", canonicalTopics.PALLIATIVE],
  ["trad_batchD_24", canonicalTopics.PROCEDURES],

  ["gpt_canonical_mc_advance_directives_043", canonicalTopics.LEGAL],
  ["gpt_canonical_sata_suicide_precautions_042", canonicalTopics.SUICIDE_CRISIS],
  ["gpt_canonical_or_chest_tube_disconnect_052", canonicalTopics.PROCEDURES],
  ["gpt_canonical_sata_clabsi_prevention_067", canonicalTopics.STANDARD],
  ["gpt_canonical_or_suspected_stroke_072", canonicalTopics.ENDOCRINE_NEURO],
  ["gpt_canonical_matrix_wound_assessment_077", canonicalTopics.PERIOP],
  ["gpt_canonical_or_thyroidectomy_airway_095", canonicalTopics.PERIOP],
  ["sata_newborn_safety_teaching_008", canonicalTopics.MATERNAL_NEWBORN],
  ["mc_suicide_precautions_010", canonicalTopics.SUICIDE_CRISIS],
  ["sata_pressure_injury_prevention_014", canonicalTopics.ELIMINATION],
  ["gpt_canonical_matrix_pressure_injury_040", canonicalTopics.ELIMINATION],
  ["mc_needlestick_first_action_006", canonicalTopics.STANDARD],
  ["gpt_canonical_fib_pediatric_urine_output_049", canonicalTopics.PEDIATRIC],
  ["gpt_canonical_or_cord_prolapse_078", canonicalTopics.MATERNAL_NEWBORN],
  ["gpt_canonical_matrix_depression_safety_083", canonicalTopics.SUICIDE_CRISIS],
  ["gpt_canonical_fib_adult_urine_output_087", canonicalTopics.ELIMINATION],
  ["gpt_canonical_matrix_needlestick_089", canonicalTopics.STANDARD],
  ["gpt_canonical_cloze_opioid_safety_094", canonicalTopics.MED_SAFETY],
  ["gpt_canonical_matrix_post_cath_096", canonicalTopics.PROCEDURES],
  ["gpt_canonical_or_telephone_order_110", canonicalTopics.MED_SAFETY],
  ["gpt_canonical_cloze_mania_safety_115", canonicalTopics.MENTAL_HEALTH],
  ["gpt_canonical_cloze_sleep_hygiene_121", canonicalTopics.SLEEP],

  ["case_preeclampsia_magnesium_01", canonicalTopics.MATERNAL_NEWBORN],
  ["preeclampsia_severe_features_sata", canonicalTopics.MATERNAL_NEWBORN],
  ["preeclampsia_initial_priority_mc", canonicalTopics.MATERNAL_NEWBORN],
  ["cs_ckd_01_q2", canonicalTopics.ELECTROLYTES],
  ["cs_schiz_01_q2", canonicalTopics.MENTAL_HEALTH],
  ["cs_schiz_01_q5", canonicalTopics.PSYCHOTROPIC],
  ["cs_hip_01_q1", canonicalTopics.MOBILITY],
  ["cs_hip_01_q4", canonicalTopics.MOBILITY],
  ["sa_post_mortem_01", canonicalTopics.PALLIATIVE],
  ["sa_vap_prevention_01", canonicalTopics.STANDARD],
  ["sa_parkland_01", canonicalTopics.BURN],
  ["gap_50_sic_07", canonicalTopics.MATERNAL_NEWBORN],
]);

const includes = (...needles: string[]) => (text: string) => needles.some((needle) => text.includes(needle));
const matches = (pattern: RegExp) => (text: string) => pattern.test(text);

const rules: TopicRule[] = [
  {
    topic: canonicalTopics.DOSAGE,
    reason: "numeric dosage calculation",
    category: "Pharmacological and Parenteral Therapies",
    test: (text, question) =>
      question.itemType === "fill_in_blank" &&
      Array.isArray(question.blanks) &&
      question.blanks.some((blank: JsonRecord) => blank.numeric) &&
      matches(/\b(mg|mcg|ml|units?|tablets?|tabs?|kg|lb|hr|hour|dose|rate|half-life|calculate|available medication)\b/i)(text),
  },
  {
    topic: canonicalTopics.DOSAGE,
    reason: "explicit dosage calculation",
    category: "Pharmacological and Parenteral Therapies",
    test: matches(/\b(calculate|flow rate|infusion rate|ml\/hr|mcg\/kg\/min|how many tablets?|how many ml|available medication|pharmacy dispenses)\b/i),
  },
  {
    topic: canonicalTopics.ANTICOAGULANT,
    reason: "anticoagulant therapy",
    test: matches(/\b(warfarin|heparin|enoxaparin|dabigatran|apixaban|rivaroxaban|inr|aptt|ptt)\b/i),
  },
  {
    topic: canonicalTopics.PARENTERAL_NUTRITION,
    reason: "TPN/parenteral nutrition",
    test: matches(/\b(tpn|total parenteral nutrition|parenteral nutrition)\b/i),
  },
  {
    topic: canonicalTopics.PSYCHOTROPIC,
    reason: "psychotropic medication",
    category: "Pharmacological and Parenteral Therapies",
    test: matches(/\b(clozapine|haloperidol|chlorpromazine|fluoxetine|selegiline|serotonin syndrome|neuroleptic malignant|nms|dantrolene|bromocriptine|antipsychotic|antidepressant|extrapyramidal|eps)\b/i),
  },
  {
    topic: canonicalTopics.CARDIO_ENDOCRINE_MEDS,
    reason: "cardio/endocrine medication",
    category: "Pharmacological and Parenteral Therapies",
    test: matches(/\b(metoprolol|lisinopril|ace inhibitor|beta blocker|digoxin|nitroglycerin|furosemide|insulin|metformin|prednisone|corticosteroid|glucocorticoid|magnesium sulfate|phenytoin|alendronate|levothyroxine)\b/i),
  },
  {
    topic: canonicalTopics.MED_SAFETY,
    reason: "medication administration/safety",
    category: "Pharmacological and Parenteral Therapies",
    test: matches(/\b(medication|drug|administer|iv push|pca|opioid|naloxone|potassium|vancomycin|aminoglycoside|trough|peak|adverse effect|side effect|withhold)\b/i),
  },
  {
    topic: canonicalTopics.TRIAGE_DELEGATION,
    reason: "prioritization/delegation/staffing",
    test: matches(/\b(delegate|delegation|uap|lpn|licensed practical nurse|assignment|assignments|float|floating|staff|triage|assess first|seen first|priority client|most appropriate for the nurse to delegate)\b/i),
  },
  {
    topic: canonicalTopics.CONFIDENTIALITY,
    reason: "confidentiality/HIPAA",
    category: "Management of Care",
    test: matches(/\b(hipaa|confidentiality|employer|privacy|disclose|disclosure|medical record)\b/i),
  },
  {
    topic: canonicalTopics.CONFLICT,
    reason: "conflict resolution",
    category: "Management of Care",
    test: includes("conflict"),
  },
  {
    topic: canonicalTopics.DISCHARGE,
    reason: "discharge/referral/handoff/continuity",
    category: "Management of Care",
    test: (text) => {
      if (/\b(discharge teaching|teaching after discharge|home teaching|sick-day|self-management)\b/i.test(text)) {
        return false;
      }
      return matches(
        /\b(handoff|transfer report|continuity|case management|home health|referral|speech-language pathologist|interdisciplinary|discharge planning|discharge barrier|discharge readiness|discharge coordination)\b/i,
      )(text);
    },
  },
  {
    topic: canonicalTopics.CLIENT_ADVOCACY,
    reason: "client advocacy",
    category: "Management of Care",
    test: matches(/\b(advocacy|advocate|client refuses|refusal)\b/i),
  },
  {
    topic: canonicalTopics.LEGAL,
    reason: "legal/ethical/consent/directive",
    category: "Management of Care",
    test: matches(/\b(advance directive|living will|durable power|consent|informed consent|ethical|legal|against medical advice|ama|scope of practice|malpractice|liability|elopement|mandated report|reporting)\b/i),
  },
  {
    topic: canonicalTopics.TRANSMISSION,
    reason: "transmission-based precautions/isolation",
    test: matches(/\b(contact precautions|droplet precautions|airborne precautions|isolation|n95|negative-pressure|negative pressure|c\\. difficile|clostridioides|tuberculosis|measles|varicella|pertussis|norovirus|ebola)\b/i),
  },
  {
    topic: canonicalTopics.STANDARD,
    reason: "standard precautions/hand hygiene/sharps",
    test: matches(/\b(hand hygiene|handwashing|wash hands|standard precautions|sharps|needle recapping|dispose of the syringe)\b/i),
  },
  {
    topic: canonicalTopics.PPE,
    reason: "PPE/sterile technique",
    test: matches(/\b(ppe|personal protective equipment|donning|doffing|sterile field|sterile technique|sterile gloves|surgical asepsis|specimen collection)\b/i),
  },
  {
    topic: canonicalTopics.DISASTER,
    reason: "disaster/emergency preparedness",
    category: "Safety and Infection Control",
    test: matches(/\b(disaster|bioterrorism|dirty bomb|mass casualty|decontamination)\b/i),
  },
  {
    topic: canonicalTopics.PATIENT_SAFETY,
    reason: "environmental safety/restraints/radiation/chemical exposure",
    category: "Safety and Infection Control",
    test: matches(/\b(fall|restraint|bed alarm|safety|radiation|brachytherapy|chemical splash|eyewash|eye irrigation|hazard|fire|surgical time-out|timeout|violent|agitated|weapon)\b/i),
  },
  {
    topic: canonicalTopics.MATERNAL_NEWBORN,
    reason: "maternal-newborn content",
    test: matches(/\b(pregnan|prenatal|antepartum|postpartum|newborn|neonatal|breastfeeding|fetal|labor|delivery|fundus|lochia|preeclampsia|eclampsia|magnesium sulfate|apgar|contracept)\b/i),
  },
  {
    topic: canonicalTopics.PEDIATRIC_SAFETY,
    reason: "pediatric/toddler safety",
    category: "Health Promotion and Maintenance",
    test: matches(/\b(car seat|reye|lead poisoning|toddler safety|poisoning prevention)\b/i),
  },
  {
    topic: canonicalTopics.PEDIATRIC,
    reason: "pediatric/adolescent health",
    test: matches(/\b(infant|toddler|child|adolescent|pediatric|12-month|school-age|scoliosis|developmental|immunization|vaccine|croup|pyloric|intussusception)\b/i),
  },
  {
    topic: canonicalTopics.REPRODUCTIVE_ENDOCRINE,
    reason: "reproductive/endocrine health promotion",
    category: "Health Promotion and Maintenance",
    test: matches(/\b(menopause|osteoporosis|alendronate|hormone|thyroid screening)\b/i),
  },
  {
    topic: canonicalTopics.CHRONIC_LIFESTYLE,
    reason: "chronic disease/lifestyle teaching",
    category: "Health Promotion and Maintenance",
    test: matches(/\b(sick-day|lifestyle|smoking cessation|exercise|diet teaching|chronic disease|peripheral arterial disease|skin cancer|gerd)\b/i),
  },
  {
    topic: canonicalTopics.ADULT_HEALTH,
    reason: "adult screening/wellness/immunization",
    category: "Health Promotion and Maintenance",
    test: matches(/\b(screening|colonoscopy|colorectal|mammogram|immunization|vaccine|wellness|primary prevention|secondary prevention|tertiary prevention|health promotion|aging)\b/i),
  },
  {
    topic: canonicalTopics.THERAPEUTIC_COMM,
    reason: "therapeutic communication",
    category: "Psychosocial Integrity",
    test: matches(/\b(therapeutic communication|client says|nurse response|respond|grief|loss|denial|open-ended|reflection)\b/i),
  },
  {
    topic: canonicalTopics.SUBSTANCE,
    reason: "substance use/withdrawal",
    category: "Psychosocial Integrity",
    test: matches(/\b(alcohol withdrawal|substance use|opioid withdrawal|detox|ciwa|delirium tremens)\b/i),
  },
  {
    topic: canonicalTopics.SUICIDE_CRISIS,
    reason: "suicide/crisis/violence/abuse",
    category: "Psychosocial Integrity",
    test: matches(/\b(suicide|self-harm|crisis|violence|abuse|neglect|domestic violence|assault|homicidal)\b/i),
  },
  {
    topic: canonicalTopics.ECT,
    reason: "explicit ECT content",
    category: "Psychosocial Integrity",
    test: matches(/\b(electroconvulsive|\\bect\\b)\b/i),
  },
  {
    topic: canonicalTopics.MENTAL_HEALTH,
    reason: "mental health disorder/content",
    category: "Psychosocial Integrity",
    test: matches(/\b(delirium|dementia|schizophrenia|bipolar|mania|depression|anxiety|ocd|ptsd|personality disorder|anorexia|bulimia|eating disorder|hallucination|catatonia|psychosis|coping)\b/i),
  },
  {
    topic: canonicalTopics.NUTRITION,
    reason: "nutrition/feeding/fluid support",
    category: "Basic Care and Comfort",
    test: matches(/\b(nutrition|diet|feeding|enteral|ng tube feeding|calorie|protein|dysphagia|aspiration precautions|food choices|fluid intake)\b/i),
  },
  {
    topic: canonicalTopics.MOBILITY,
    reason: "mobility/positioning/assistive device",
    category: "Basic Care and Comfort",
    test: matches(/\b(mobility|ambulat|transfer|cane|walker|crutch|wheelchair|positioning|hip arthroplasty|immobility|range of motion)\b/i),
  },
  {
    topic: canonicalTopics.SLEEP,
    reason: "sleep/rest",
    category: "Basic Care and Comfort",
    test: matches(/\b(sleep|rest|insomnia|cpap|sleep apnea)\b/i),
  },
  {
    topic: canonicalTopics.PALLIATIVE,
    reason: "pain/comfort/palliative/supportive care",
    category: "Basic Care and Comfort",
    test: matches(/\b(palliative|end-of-life|pain|comfort|heat therapy|cold therapy|oxygen device|tracheostomy suction|non-pharmacological comfort)\b/i),
  },
  {
    topic: canonicalTopics.ELIMINATION,
    reason: "elimination/hygiene/skin integrity",
    category: "Basic Care and Comfort",
    test: matches(/\b(elimination|bowel|urinary|catheter|ostomy|constipation|toileting|bed bath|hygiene|skin integrity|pressure injur|braden|foot care|post-mortem)\b/i),
  },
  {
    topic: canonicalTopics.ABG,
    reason: "ABG/acid-base",
    test: matches(/\b(abg|acid-base|paco2|hco3|ph\\s*[0-9])\b/i),
  },
  {
    topic: canonicalTopics.LABS,
    reason: "laboratory/diagnostic tests",
    category: "Reduction of Risk Potential",
    test: matches(/\b(laboratory|lab value|diagnostic|ct scan|mri|pacemaker|troponin|platelet|hemoglobin|hematocrit|hba1c|lithium level|therapeutic level|inr|aptt)\b/i),
  },
  {
    topic: canonicalTopics.PERIOP,
    reason: "perioperative/postoperative care",
    test: matches(/\b(preoperative|postoperative|post-op|post-operative|perioperative|surgery|surgical|thyroidectomy|wound finding|expected healing)\b/i),
  },
  {
    topic: canonicalTopics.PROCEDURES,
    reason: "procedural complication/dialysis/tube/drain",
    category: "Reduction of Risk Potential",
    test: matches(/\b(chest tube|thoracentesis|paracentesis|liver biopsy|hemodialysis|dialysis|ng tube|nasogastric|tracheostomy care|blood transfusion|transfusion reaction|procedure-related|complication|water-seal drainage|catheterization)\b/i),
  },
  {
    topic: canonicalTopics.DKA,
    reason: "DKA/HHS",
    test: matches(/\b(dka|diabetic ketoacidosis|hhs|hyperosmolar)\b/i),
  },
  {
    topic: canonicalTopics.SEPSIS,
    reason: "sepsis/shock",
    test: matches(/\b(sepsis|septic shock|lactate|fluid resuscitation|vasopressor)\b/i),
  },
  {
    topic: canonicalTopics.BURN,
    reason: "burn management",
    test: matches(/\b(burn|parkland|tbsa)\b/i),
  },
  {
    topic: canonicalTopics.RESPIRATORY,
    reason: "respiratory/infectious disorder",
    category: "Physiological Adaptation",
    test: matches(/\b(copd|asthma|pneumonia|croup|epiglottitis|tuberculosis|meningitis|respiratory|stridor|wheezing|bronch|anaphylaxis|pulmonary embolism|oxygen saturation|pneumothorax)\b/i),
  },
  {
    topic: canonicalTopics.ELECTROLYTES,
    reason: "electrolyte imbalance",
    test: matches(/\b(electrolyte|potassium|sodium|calcium|magnesium|phosphate|hypokal|hyperkal|hyponat|hypernat|hypocal|hypercal|hypomag|hypophos)\b/i),
  },
  {
    topic: canonicalTopics.RENAL_GI,
    reason: "renal/GI disorder",
    category: "Physiological Adaptation",
    test: matches(/\b(kidney|renal|acute kidney injury|aki|pancreatitis|appendicitis|cholecystitis|cirrhosis|peritonitis|bowel obstruction|ileus|gi bleed|crohn|ulcerative colitis|gerd|pyloric stenosis|intussusception|fluid volume excess|dehydration)\b/i),
  },
  {
    topic: canonicalTopics.ENDOCRINE_NEURO,
    reason: "endocrine/neurological disorder",
    test: matches(/\b(stroke|seizure|intracranial|icp|cushing's triad|head injury|traumatic brain|spinal cord|autonomic dysreflexia|myasthenia|thyroid storm|addison|adrenal|siadh|diabetes insipidus|diabetes mellitus|hyperglycemia|hypoglycemia|neurologic|neurological)\b/i),
  },
  {
    topic: canonicalTopics.CARDIO,
    reason: "cardiovascular disorder",
    category: "Physiological Adaptation",
    test: matches(/\b(myocardial infarction|\\bmi\\b|heart failure|cardiac|cardiovascular|chest pain|angina|ecg|ekg|dysrhythmia|hypertension|hypotension|aneurysm|tamponade|hemodynamic|pulmonary edema)\b/i),
  },
];

const normalizeTopic = (topic: string) => topic.trim().toLowerCase().replace(/\s+/g, " ");

const textFromValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(textFromValue).join(" ");
  if (typeof value === "object") return Object.values(value).map(textFromValue).join(" ");
  return "";
};

const questionText = (question: JsonRecord, parentContext = "") =>
  `${question.id ?? ""} ${question.stem?.en ?? ""} ${textFromValue(question.options)} ${textFromValue(question.matrix)} ${textFromValue(
    question.dropdowns,
  )} ${textFromValue(question.clozeStem)} ${textFromValue(question.rationale)} ${textFromValue(question.glossary)} ${parentContext}`
    .toLowerCase()
    .replace(/\s+/g, " ");

const classifyByContent = (question: JsonRecord, parentContext = "") => {
  const text = questionText(question, parentContext);
  return rules.find((rule) => (!rule.category || rule.category === question.category) && rule.test(text, question));
};

const updateQuestionTopic = (
  question: JsonRecord,
  file: string,
  changes: ProposedChange[],
  unresolved: ProposedChange[],
  suggestions: ProposedChange[],
  parentContext = "",
) => {
  if (typeof question.topic !== "string") return;

  const oldTopic = question.topic;
  const override = idTopicOverrides.get(question.id);
  const exact = aliasTopic(oldTopic) ?? exactTopicFixes.get(normalizeTopic(oldTopic));
  const contentMatch = classifyByContent(question, parentContext);

  if (exact && exact !== oldTopic) {
    changes.push({
      file,
      id: question.id ?? "(missing id)",
      oldTopic,
      newTopic: exact,
      category: question.category ?? "(missing category)",
      itemType: question.itemType ?? "(missing itemType)",
      reason: "exact topic normalization",
    });
    question.topic = exact;
    return;
  }

  const suggestedTopic = override ?? contentMatch?.topic;
  if (!isCanonicalTopic(oldTopic)) {
    if (suggestedTopic && suggestedTopic !== oldTopic) {
      suggestions.push({
        file,
        id: question.id ?? "(missing id)",
        oldTopic,
        newTopic: suggestedTopic,
        category: question.category ?? "(missing category)",
        itemType: question.itemType ?? "(missing itemType)",
        reason: override ? "curated ID suggestion" : contentMatch?.reason ?? "content rule suggestion",
      });
      return;
    }
    unresolved.push({
      file,
      id: question.id ?? "(missing id)",
      oldTopic,
      newTopic: "(unresolved)",
      category: question.category ?? "(missing category)",
      itemType: question.itemType ?? "(missing itemType)",
      reason: "no exact alias matched; no suggestion available",
    });
  }
};

const getBankFiles = async () => {
  const files = await readdir("banks");
  return files.filter((file) => file.endsWith(".json")).map((file) => join("banks", file));
};

const formatReport = (changes: ProposedChange[], unresolved: ProposedChange[], suggestions: ProposedChange[], reviewSuggestions: ProposedChange[]) => {
  const byFile = new Map<string, ProposedChange[]>();
  const byOldTopic = new Map<string, number>();
  for (const change of changes) {
    byFile.set(change.file, [...(byFile.get(change.file) ?? []), change]);
    byOldTopic.set(change.oldTopic, (byOldTopic.get(change.oldTopic) ?? 0) + 1);
  }

  const lines = [
    "# Topic Metadata Cleanup",
    "",
    `Date: ${reportDate}`,
    `Mode: ${dryRun ? "dry run" : "applied"}`,
    allowCanonicalWrite ? `Write reason: ${writeReason}` : "Write reason: none; canonical banks were not modified",
    "",
    `Exact topic updates: ${changes.length}`,
    `Suggestions requiring review: ${suggestions.length}`,
    `Unresolved noncanonical topics: ${unresolved.length}`,
    `Broad-topic review suggestions: ${reviewSuggestions.length}`,
    "",
    "## Updates by Previous Topic",
    "",
    ...Array.from(byOldTopic.entries())
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([topic, count]) => `- ${topic}: ${count}`),
    "",
    "## Updates by File",
    "",
  ];

  for (const [file, fileChanges] of Array.from(byFile.entries()).sort()) {
    lines.push(`### ${file}`, "");
    lines.push("| Question ID | Category | Type | Old topic | New topic | Rule |");
    lines.push("|---|---|---|---|---|---|");
    for (const change of fileChanges) {
      lines.push(
        `| \`${change.id}\` | ${change.category} | ${change.itemType} | ${change.oldTopic} | ${change.newTopic} | ${change.reason} |`,
      );
    }
    lines.push("");
  }

  if (unresolved.length > 0) {
    lines.push("## Unresolved Human Decisions", "");
    lines.push("| Question ID | Category | Type | Topic | Suggested topic | Reason |");
    lines.push("|---|---|---|---|---|---|");
    for (const item of unresolved) {
      lines.push(`| \`${item.id}\` | ${item.category} | ${item.itemType} | ${item.oldTopic} | ${item.newTopic} | ${item.reason} |`);
    }
    lines.push("");
  }

  if (suggestions.length > 0) {
    lines.push("## Suggestions Requiring Review", "");
    lines.push("| Question ID | Category | Type | Current topic | Suggested topic | Reason |");
    lines.push("|---|---|---|---|---|---|");
    for (const item of suggestions) {
      lines.push(`| \`${item.id}\` | ${item.category} | ${item.itemType} | ${item.oldTopic} | ${item.newTopic} | ${item.reason} |`);
    }
    lines.push("");
  }

  if (reviewSuggestions.length > 0) {
    lines.push("## Broad-Topic Review Suggestions", "");
    lines.push("| Question ID | Category | Type | Current topic | Suggested topic | Reason |");
    lines.push("|---|---|---|---|---|---|");
    for (const item of reviewSuggestions) {
      lines.push(`| \`${item.id}\` | ${item.category} | ${item.itemType} | ${item.oldTopic} | ${item.newTopic} | ${item.reason} |`);
    }
    lines.push("");
  }

  return `${lines.join("\n").replace(/\n+$/, "")}\n`;
};

const bankFiles = await getBankFiles();
const allChanges: ProposedChange[] = [];
const unresolved: ProposedChange[] = [];
const suggestions: ProposedChange[] = [];
const reviewSuggestions: ProposedChange[] = [];

for (const file of bankFiles) {
  const text = await readFile(file, "utf8");
  const raw = parseBankText(text);
  const validated = validateBankObject(raw);
  if (!validated.ok) {
    throw new Error(`${basename(file)} failed validation before topic cleanup:\n${validated.reasons.join("\n")}`);
  }

  const data = raw as JsonRecord;
  const fileChanges: ProposedChange[] = [];

  for (const question of data.questions ?? []) {
    const parentContext =
      question.itemType === "case_study"
        ? `${textFromValue(question.stem)} ${textFromValue(question.caseStudy?.title)} ${textFromValue(question.caseStudy?.summary)} ${textFromValue(
            question.caseStudy?.exhibits,
          )} ${textFromValue(question.caseStudy?.stages)}`
        : "";

    updateQuestionTopic(question, file, fileChanges, unresolved, suggestions);

    if (question.itemType === "case_study" && Array.isArray(question.caseStudy?.questions)) {
      for (const embedded of question.caseStudy.questions) {
        updateQuestionTopic(embedded, file, fileChanges, unresolved, suggestions, parentContext);
      }
    }
  }

  const result = validateBankObject(data);
  if (!result.ok) {
    throw new Error(`${basename(file)} failed validation after topic cleanup:\n${result.reasons.join("\n")}`);
  }

  if (!dryRun && fileChanges.length > 0) {
    await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
  }

  allChanges.push(...fileChanges);
}

for (const file of bankFiles) {
  const data = parseBankText(await readFile(file, "utf8")) as JsonRecord;
  for (const question of data.questions ?? []) {
    const check = (item: JsonRecord) => {
      const match = classifyByContent(item);
      if (match && broadTopics.has(item.topic) && match.topic !== item.topic) {
        reviewSuggestions.push({
          file,
          id: item.id ?? "(missing id)",
          oldTopic: item.topic,
          newTopic: match.topic,
          category: item.category ?? "(missing category)",
          itemType: item.itemType ?? "(missing itemType)",
          reason: match.reason,
        });
      }
    };
    check(question);
    if (Array.isArray(question.caseStudy?.questions)) {
      for (const embedded of question.caseStudy.questions) check(embedded);
    }
  }
}

await mkdir("audit", { recursive: true });
const reportSuffix = reportLabel ? `.${reportLabel}` : dryRun ? ".dry-run" : "";
const reportPath = `audit/topic-vocabulary-migration-${reportDate}${reportSuffix}.report.md`;
await writeFile(reportPath, formatReport(allChanges, unresolved, suggestions, reviewSuggestions));

console.log(`${dryRun ? "Would update" : "Updated"} ${allChanges.length} topic assignments across ${bankFiles.length} bank files.`);
console.log(`${suggestions.length} noncanonical topic assignments have suggestions requiring review.`);
console.log(`${unresolved.length} noncanonical topic assignments require human decisions.`);
console.log(`${reviewSuggestions.length} broad canonical topic assignments may deserve review.`);
console.log(`Report: ${reportPath}`);
