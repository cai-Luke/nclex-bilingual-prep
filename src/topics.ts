import type { Category } from "./types";

export const TOPIC_CATEGORY_ORDER = [
  "Management of Care",
  "Safety and Infection Control",
  "Health Promotion and Maintenance",
  "Psychosocial Integrity",
  "Basic Care and Comfort",
  "Pharmacological and Parenteral Therapies",
  "Reduction of Risk Potential",
  "Physiological Adaptation",
] as const satisfies readonly Category[];

export const TOPICS = {
  ABG_ACID_BASE: "ABG & Acid-Base Interpretation",
  ADULT_HEALTH: "Adult Health & Wellness",
  ANTICOAGULANT_THERAPY: "Anticoagulant Therapy",
  BURN_MANAGEMENT: "Burn Management",
  CARDIOVASCULAR_DISORDERS: "Cardiovascular Disorders",
  CARDIOVASCULAR_ENDOCRINE_MEDICATIONS: "Cardiovascular & Endocrine Medications",
  CHRONIC_DISEASE_LIFESTYLE: "Chronic Disease Management & Lifestyle",
  CLIENT_ADVOCACY: "Client Advocacy",
  CONFIDENTIALITY_HIPAA: "Confidentiality & HIPAA",
  CONFLICT_RESOLUTION: "Conflict Resolution",
  DIABETIC_KETOACIDOSIS: "Diabetic Ketoacidosis (DKA)",
  DISASTER_EMERGENCY_PREPAREDNESS: "Disaster & Emergency Preparedness",
  DISCHARGE_HANDOFF: "Discharge Planning & Handoff",
  DOSAGE_CALCULATIONS: "Dosage Calculations",
  ECT: "Electroconvulsive Therapy (ECT)",
  ELECTROLYTE_IMBALANCES: "Electrolyte Imbalances",
  ELIMINATION_COMFORT: "Elimination & Comfort",
  ENDOCRINE_NEUROLOGICAL_DISORDERS: "Endocrine & Neurological Disorders",
  LAB_DIAGNOSTIC_TESTS: "Laboratory & Diagnostic Tests",
  LEGAL_ETHICAL: "Legal & Ethical Principles",
  MATERNAL_NEWBORN: "Maternal-Newborn Care & Teaching",
  MEDICATION_SAFETY_ADMIN: "Medication Safety & Admin",
  MENTAL_HEALTH_DISORDERS: "Mental Health Disorders",
  MOBILITY_IMMOBILITY: "Mobility & Immobility",
  NUTRITIONAL_FLUID_SUPPORT: "Nutritional & Fluid Support",
  ONCOLOGY_IMMUNOTHERAPY_COMPLICATIONS: "Oncology & Immunotherapy Complications",
  PALLIATIVE_SUPPORTIVE_CARE: "Palliative & Supportive Care",
  PARENTERAL_NUTRITION: "Parenteral Nutrition",
  PATIENT_ENVIRONMENT_SAFETY: "Patient & Environment Safety",
  PEDIATRIC_ADOLESCENT_HEALTH: "Pediatric & Adolescent Health",
  PEDIATRIC_TODDLER_SAFETY: "Pediatric & Toddler Safety",
  PERIOPERATIVE_CARE: "Perioperative Care",
  PPE_STERILE_TECHNIQUE: "PPE & Sterile Technique",
  PRIORITIZATION_DELEGATION: "Prioritization & Delegation",
  PROCEDURAL_COMPLICATIONS_DIALYSIS: "Procedural Complications & Dialysis",
  PSYCHOTROPIC_MEDICATIONS: "Psychotropic Medications",
  RENAL_GASTROINTESTINAL_DISORDERS: "Renal & Gastrointestinal Disorders",
  REPRODUCTIVE_ENDOCRINE_HEALTH: "Reproductive & Endocrine Health",
  RESPIRATORY_INFECTIOUS_DISORDERS: "Respiratory & Infectious Disorders",
  SEPSIS_SEPTIC_SHOCK: "Sepsis & Septic Shock",
  SKIN_WOUND_CARE: "Skin & Wound Care",
  SLEEP_REST: "Sleep & Rest",
  STANDARD_PRECAUTIONS_HYGIENE: "Standard Precautions & Hygiene",
  SUBSTANCE_USE_WITHDRAWAL: "Substance Use & Withdrawal",
  SUICIDE_CRISIS_INTERVENTION: "Suicide & Crisis Intervention",
  THERAPEUTIC_COMMUNICATION: "Therapeutic Communication",
  TRANSMISSION_BASED_PRECAUTIONS: "Transmission-Based Precautions",
} as const;

// Canonical vocabulary pending a reviewed live-bank migration.
export const STRICT_TOPIC_CATEGORY: Record<Category, readonly string[]> = {
  "Management of Care": [
    TOPICS.PRIORITIZATION_DELEGATION,
    TOPICS.LEGAL_ETHICAL,
    TOPICS.CLIENT_ADVOCACY,
    TOPICS.CONFIDENTIALITY_HIPAA,
    TOPICS.DISCHARGE_HANDOFF,
    TOPICS.CONFLICT_RESOLUTION,
  ],
  "Safety and Infection Control": [
    TOPICS.PATIENT_ENVIRONMENT_SAFETY,
    TOPICS.TRANSMISSION_BASED_PRECAUTIONS,
    TOPICS.STANDARD_PRECAUTIONS_HYGIENE,
    TOPICS.PPE_STERILE_TECHNIQUE,
    TOPICS.DISASTER_EMERGENCY_PREPAREDNESS,
  ],
  "Health Promotion and Maintenance": [
    TOPICS.PEDIATRIC_ADOLESCENT_HEALTH,
    TOPICS.PEDIATRIC_TODDLER_SAFETY,
    TOPICS.ADULT_HEALTH,
    TOPICS.REPRODUCTIVE_ENDOCRINE_HEALTH,
    TOPICS.CHRONIC_DISEASE_LIFESTYLE,
  ],
  "Psychosocial Integrity": [
    TOPICS.THERAPEUTIC_COMMUNICATION,
    TOPICS.MENTAL_HEALTH_DISORDERS,
    TOPICS.SUBSTANCE_USE_WITHDRAWAL,
    TOPICS.SUICIDE_CRISIS_INTERVENTION,
    TOPICS.ECT,
  ],
  "Basic Care and Comfort": [
    TOPICS.NUTRITIONAL_FLUID_SUPPORT,
    TOPICS.MOBILITY_IMMOBILITY,
    TOPICS.ELIMINATION_COMFORT,
    TOPICS.SLEEP_REST,
    TOPICS.PALLIATIVE_SUPPORTIVE_CARE,
    TOPICS.SKIN_WOUND_CARE,
  ],
  "Pharmacological and Parenteral Therapies": [
    TOPICS.DOSAGE_CALCULATIONS,
    TOPICS.ANTICOAGULANT_THERAPY,
    TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS,
    TOPICS.PSYCHOTROPIC_MEDICATIONS,
    TOPICS.PARENTERAL_NUTRITION,
  ],
  "Reduction of Risk Potential": [
    TOPICS.ABG_ACID_BASE,
    TOPICS.PERIOPERATIVE_CARE,
    TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS,
  ],
  "Physiological Adaptation": [
    TOPICS.CARDIOVASCULAR_DISORDERS,
    TOPICS.RESPIRATORY_INFECTIOUS_DISORDERS,
    TOPICS.RENAL_GASTROINTESTINAL_DISORDERS,
    TOPICS.ENDOCRINE_NEUROLOGICAL_DISORDERS,
    TOPICS.ELECTROLYTE_IMBALANCES,
    TOPICS.DIABETIC_KETOACIDOSIS,
    TOPICS.SEPSIS_SEPTIC_SHOCK,
    TOPICS.BURN_MANAGEMENT,
  ],
};

export const SHARED_TOPIC_CATEGORY: Record<string, readonly Category[]> = {
  [TOPICS.MEDICATION_SAFETY_ADMIN]: [
    "Pharmacological and Parenteral Therapies",
    "Safety and Infection Control",
  ],
  [TOPICS.LAB_DIAGNOSTIC_TESTS]: [
    "Reduction of Risk Potential",
    "Pharmacological and Parenteral Therapies",
  ],
  [TOPICS.MATERNAL_NEWBORN]: [
    "Health Promotion and Maintenance",
    "Reduction of Risk Potential",
    "Physiological Adaptation",
  ],
  [TOPICS.ONCOLOGY_IMMUNOTHERAPY_COMPLICATIONS]: [
    "Physiological Adaptation",
    "Reduction of Risk Potential",
  ],
};

const strictTopicCategoryEntries = TOPIC_CATEGORY_ORDER.flatMap((category) =>
  STRICT_TOPIC_CATEGORY[category].map((topic) => [topic, [category] as readonly Category[]] as const),
);

export const TOPIC_CATEGORY_ENTRIES = [
  ...strictTopicCategoryEntries,
  ...Object.entries(SHARED_TOPIC_CATEGORY),
] as const;

export const CANONICAL_TOPIC_LIST = TOPIC_CATEGORY_ENTRIES.map(([topic]) => topic);
export const CANONICAL_TOPICS: ReadonlySet<string> = new Set(CANONICAL_TOPIC_LIST);

export const normalizeTopicKey = (topic: string): string => topic.trim().toLowerCase().replace(/\s+/g, " ");

const selfAliasEntries = CANONICAL_TOPIC_LIST.map((topic) => [normalizeTopicKey(topic), topic] as const);

export const TOPIC_ALIAS_ENTRIES = [
  ...selfAliasEntries,
  ["abg", "ABG & Acid-Base Interpretation"],
  ["abg interpretation", "ABG & Acid-Base Interpretation"],
  ["abg and acid-base interpretation", "ABG & Acid-Base Interpretation"],
  ["acid-base interpretation", "ABG & Acid-Base Interpretation"],
  ["advance directives", "Legal & Ethical Principles"],
  ["advocacy", "Client Advocacy"],
  ["airborne precautions", "Transmission-Based Precautions"],
  ["alcohol withdrawal", "Substance Use & Withdrawal"],
  ["antepartum care", "Maternal-Newborn Care & Teaching"],
  ["antibiotic safety", "Medication Safety & Admin"],
  ["assistive devices", "Mobility & Immobility"],
  ["bladder training", "Elimination & Comfort"],
  ["blood transfusion", "Medication Safety & Admin"],
  ["c. difficile care", "Transmission-Based Precautions"],
  ["cane use", "Mobility & Immobility"],
  ["central venous catheter", "Standard Precautions & Hygiene"],
  ["client advocacy", "Client Advocacy"],
  ["client rights and refusal", "Legal & Ethical Principles"],
  ["colorectal cancer screening", "Adult Health & Wellness"],
  ["comfort", "Elimination & Comfort"],
  ["contact precautions", "Transmission-Based Precautions"],
  ["controlled substances", "Medication Safety & Admin"],
  ["continuity of care", "Discharge Planning & Handoff"],
  ["copd", "Respiratory & Infectious Disorders"],
  ["crisis intervention", "Suicide & Crisis Intervention"],
  ["crutch walking", "Mobility & Immobility"],
  ["developmental stages", "Pediatric & Adolescent Health"],
  ["diagnostic tests", "Laboratory & Diagnostic Tests"],
  ["disaster triage", "Disaster & Emergency Preparedness"],
  ["discharge planning", "Discharge Planning & Handoff"],
  ["droplet precautions", "Transmission-Based Precautions"],
  ["dvt", "Procedural Complications & Dialysis"],
  ["dvt management", "Procedural Complications & Dialysis"],
  ["elimination", "Elimination & Comfort"],
  ["emergency severity index (esi) triage", "Prioritization & Delegation"],
  ["enteral nutrition", "Nutritional & Fluid Support"],
  ["ethical principles", "Legal & Ethical Principles"],
  ["fall prevention", "Patient & Environment Safety"],
  ["fire safety", "Patient & Environment Safety"],
  ["fluid balance", "Nutritional & Fluid Support"],
  ["grief and loss", "Therapeutic Communication"],
  ["grief communication", "Therapeutic Communication"],
  ["hand hygiene", "Standard Precautions & Hygiene"],
  ["hazardous materials", "Patient & Environment Safety"],
  ["health screening", "Adult Health & Wellness"],
  ["hipaa and confidentiality", "Confidentiality & HIPAA"],
  ["hygiene", "Elimination & Comfort"],
  ["informed consent", "Legal & Ethical Principles"],
  ["insulin administration", "Medication Safety & Admin"],
  ["intravenous therapy", "Medication Safety & Admin"],
  ["laboratory values", "Laboratory & Diagnostic Tests"],
  ["laboratory values (abg interpretation)", "ABG & Acid-Base Interpretation"],
  ["laboratory values (hba1c)", "Laboratory & Diagnostic Tests"],
  ["laboratory values (heparin titration)", "Laboratory & Diagnostic Tests"],
  ["laboratory values (warfarin/inr)", "Laboratory & Diagnostic Tests"],
  ["latex allergy", "Standard Precautions & Hygiene"],
  ["lifestyle choices", "Chronic Disease Management & Lifestyle"],
  ["medication safety", "Medication Safety & Admin"],
  ["menopause teaching", "Reproductive & Endocrine Health"],
  ["mobility", "Mobility & Immobility"],
  ["neutropenic precautions", "Transmission-Based Precautions"],
  ["newborn care", "Maternal-Newborn Care & Teaching"],
  ["non-pharmacological comfort", "Palliative & Supportive Care"],
  ["non-pharmacological comfort (heat/cold therapy)", "Palliative & Supportive Care"],
  ["nutrition", "Nutritional & Fluid Support"],
  ["nutrition (enteral feeding)", "Nutritional & Fluid Support"],
  ["pain management", "Palliative & Supportive Care"],
  ["personal hygiene", "Elimination & Comfort"],
  ["personal hygiene (diabetic foot care)", "Elimination & Comfort"],
  ["postoperative complications", "Perioperative Care"],
  ["ppe doffing", "PPE & Sterile Technique"],
  ["ppe donning", "PPE & Sterile Technique"],
  ["potential for complications (blood transfusion)", "Procedural Complications & Dialysis"],
  ["potential for complications (procedures)", "Procedural Complications & Dialysis"],
  ["radiation safety", "Patient & Environment Safety"],
  ["rest and sleep", "Sleep & Rest"],
  ["rest and sleep (sleep hygiene)", "Sleep & Rest"],
  ["restraint monitoring", "Patient & Environment Safety"],
  ["restraint safety", "Patient & Environment Safety"],
  ["schizophrenia", "Mental Health Disorders"],
  ["seizure precautions", "Endocrine & Neurological Disorders"],
  ["sharps disposal", "Standard Precautions & Hygiene"],
  ["sleep hygiene", "Sleep & Rest"],
  ["standard precautions", "Standard Precautions & Hygiene"],
  ["therapeutic communication", "Therapeutic Communication"],
  ["therapeutic levels", "Laboratory & Diagnostic Tests"],
  ["therapeutic procedures", "Procedural Complications & Dialysis"],
  ["therapeutic procedures (ng tube placement)", "Procedural Complications & Dialysis"],
  ["total parenteral nutrition", "Parenteral Nutrition"],
  ["transmission-based precautions", "Transmission-Based Precautions"],
  ["triage and prioritization", "Prioritization & Delegation"],
  ["wheelchair transfer safety", "Mobility & Immobility"],
] as const satisfies readonly (readonly [string, string])[];

export const TOPIC_ALIASES: ReadonlyMap<string, string> = new Map(TOPIC_ALIAS_ENTRIES);

export const isCanonicalTopic = (topic: string): boolean => CANONICAL_TOPICS.has(topic);

export const aliasTopic = (topic: string): string | undefined => TOPIC_ALIASES.get(normalizeTopicKey(topic));

export const topicCategories = (topic: string): readonly Category[] => {
  const entry = TOPIC_CATEGORY_ENTRIES.find(([candidate]) => candidate === topic);
  return entry?.[1] ?? [];
};

export const topicsByCategory = (): Record<Category, readonly string[]> => {
  const grouped = Object.fromEntries(TOPIC_CATEGORY_ORDER.map((category) => [category, [...STRICT_TOPIC_CATEGORY[category]]])) as Record<
    Category,
    string[]
  >;

  for (const [topic, categories] of Object.entries(SHARED_TOPIC_CATEGORY)) {
    for (const category of categories) {
      grouped[category].push(topic);
    }
  }

  return grouped;
};
