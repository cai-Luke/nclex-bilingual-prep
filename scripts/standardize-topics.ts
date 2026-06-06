import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { parseBankText } from "../src/bankImport";
import { validateBankObject } from "../src/schema";

const categories = {
  MANAGEMENT_OF_CARE: "Management of Care",
  SAFETY_INFECTION: "Safety and Infection Control",
  HEALTH_PROMOTION: "Health Promotion and Maintenance",
  PSYCHOSOCIAL: "Psychosocial Integrity",
  BASIC_CARE: "Basic Care and Comfort",
  PHARMACOLOGICAL: "Pharmacological and Parenteral Therapies",
  REDUCTION_OF_RISK: "Reduction of Risk Potential",
  PHYSIOLOGICAL: "Physiological Adaptation",
};

// Target canonical topics
const CANONICAL_TOPICS = {
  // Management of Care
  PRIORITIZATION_DELEGATION: "Prioritization & Delegation",
  LEGAL_ETHICAL: "Legal & Ethical Principles",
  CLIENT_ADVOCACY: "Client Advocacy",
  DISCHARGE_HANDOFF: "Discharge Planning & Handoff",
  CONFIDENTIALITY_HIPAA: "Confidentiality & HIPAA",
  CONFLICT_RESOLUTION: "Conflict Resolution",

  // Safety and Infection Control
  TRANSMISSION_PRECAUTIONS: "Transmission-Based Precautions",
  STANDARD_PRECAUTIONS: "Standard Precautions & Hygiene",
  PPE_STERILE: "PPE & Sterile Technique",
  DISASTER_PREPAREDNESS: "Disaster & Emergency Preparedness",
  PATIENT_SAFETY: "Patient & Environment Safety",

  // Health Promotion and Maintenance
  MATERNAL_NEWBORN: "Maternal-Newborn Care & Teaching",
  PEDIATRIC_TODDLER_SAFETY: "Pediatric & Toddler Safety",
  PEDIATRIC_ADOLECENT_HEALTH: "Pediatric & Adolescent Health",
  ADULT_HEALTH: "Adult Health & Wellness",
  REPRODUCTIVE_ENDOCRINE: "Reproductive & Endocrine Health",
  CHRONIC_LIFESTYLE: "Chronic Disease Management & Lifestyle",

  // Psychosocial Integrity
  THERAPEUTIC_COMM: "Therapeutic Communication",
  SUBSTANCE_USE: "Substance Use & Withdrawal",
  SUICIDE_CRISIS: "Suicide & Crisis Intervention",
  MENTAL_HEALTH_DISORDERS: "Mental Health Disorders",
  ELECTROCONVULSIVE_THERAPY: "Electroconvulsive Therapy (ECT)",

  // Basic Care and Comfort
  NUTRITIONAL_SUPPORT: "Nutritional & Fluid Support",
  MOBILITY_IMMOBILITY: "Mobility & Immobility",
  ELIMINATION_COMFORT: "Elimination & Comfort",
  SLEEP_REST: "Sleep & Rest",
  PALLIATIVE_SUPPORTIVE: "Palliative & Supportive Care",

  // Pharmacological and Parenteral Therapies
  DOSAGE_CALCULATIONS: "Dosage Calculations",
  MEDICATION_SAFETY: "Medication Safety & Admin",
  ANTICOAGULANT_THERAPY: "Anticoagulant Therapy",
  CARDIO_ENDOCRINE_MEDS: "Cardiovascular & Endocrine Medications",
  PSYCHOTROPIC_MEDS: "Psychotropic Medications",
  PARENTERAL_NUTRITION: "Parenteral Nutrition",

  // Reduction of Risk Potential
  ABG_INTERPRETATION: "ABG & Acid-Base Interpretation",
  LAB_DIAGNOSTIC: "Laboratory & Diagnostic Tests",
  PERIOPERATIVE_CARE: "Perioperative Care",
  PROCEDURAL_COMPLICATIONS: "Procedural Complications & Dialysis",

  // Physiological Adaptation
  CARDIO_DISORDERS: "Cardiovascular Disorders",
  RENAL_GI_DISORDERS: "Renal & Gastrointestinal Disorders",
  DKA: "Diabetic Ketoacidosis (DKA)",
  RESPIRATORY_INFECTIOUS: "Respiratory & Infectious Disorders",
  ELECTROLYTE_IMBALANCES: "Electrolyte Imbalances",
  ENDOCRINE_NEURO_DISORDERS: "Endocrine & Neurological Disorders",
  SEPSIS_SHOCK: "Sepsis & Septic Shock",
  BURN_MANAGEMENT: "Burn Management",
};

// Exact Overrides mapping for specific original topic names (normalized)
const OVERRIDES: Record<string, string> = {
  "advocacy": CANONICAL_TOPICS.CLIENT_ADVOCACY,
  "ethical principles": CANONICAL_TOPICS.LEGAL_ETHICAL,
  "grief communication": CANONICAL_TOPICS.THERAPEUTIC_COMM,
  "refeeding syndrome": CANONICAL_TOPICS.MENTAL_HEALTH_DISORDERS,
  "respiratory acidosis": CANONICAL_TOPICS.ABG_INTERPRETATION,
  "metabolic acidosis": CANONICAL_TOPICS.ABG_INTERPRETATION,
  "metabolic alkalosis": CANONICAL_TOPICS.ABG_INTERPRETATION,
  "respiratory alkalosis": CANONICAL_TOPICS.ABG_INTERPRETATION,
  "copd": CANONICAL_TOPICS.RESPIRATORY_INFECTIOUS,
  "pneumonia": CANONICAL_TOPICS.RESPIRATORY_INFECTIOUS,
  "meningitis": CANONICAL_TOPICS.RESPIRATORY_INFECTIOUS,
  "tuberculosis": CANONICAL_TOPICS.RESPIRATORY_INFECTIOUS,
  "anaphylaxis": CANONICAL_TOPICS.RESPIRATORY_INFECTIOUS,
  "epiglottitis": CANONICAL_TOPICS.RESPIRATORY_INFECTIOUS,
  "stroke": CANONICAL_TOPICS.CARDIO_DISORDERS,
  "myasthenia gravis": CANONICAL_TOPICS.ENDOCRINE_NEURO_DISORDERS,
  "autonomic dysreflexia": CANONICAL_TOPICS.ENDOCRINE_NEURO_DISORDERS,
  "seizure precautions": CANONICAL_TOPICS.ENDOCRINE_NEURO_DISORDERS,
  "seizure safety": CANONICAL_TOPICS.ENDOCRINE_NEURO_DISORDERS,
  "latex allergy": CANONICAL_TOPICS.STANDARD_PRECAUTIONS,
  "chf": CANONICAL_TOPICS.CARDIO_DISORDERS,
  "mi": CANONICAL_TOPICS.CARDIO_DISORDERS,
  "hhs": CANONICAL_TOPICS.RENAL_GI_DISORDERS,
  "siadh": CANONICAL_TOPICS.ENDOCRINE_NEURO_DISORDERS,
  "diabetes mellitus": CANONICAL_TOPICS.MEDICATION_SAFETY,
  "comfort": CANONICAL_TOPICS.ELIMINATION_COMFORT,
  "hygiene": CANONICAL_TOPICS.ELIMINATION_COMFORT,
  "elimination": CANONICAL_TOPICS.ELIMINATION_COMFORT,
  "immobility": CANONICAL_TOPICS.MOBILITY_IMMOBILITY,
  "mobility": CANONICAL_TOPICS.MOBILITY_IMMOBILITY,
  "nutrition": CANONICAL_TOPICS.NUTRITIONAL_SUPPORT,
  "pain management": CANONICAL_TOPICS.PALLIATIVE_SUPPORTIVE,
  "oxygen therapy": CANONICAL_TOPICS.PALLIATIVE_SUPPORTIVE,
  "dvt prophylaxis": CANONICAL_TOPICS.PALLIATIVE_SUPPORTIVE,
  "safety": CANONICAL_TOPICS.PATIENT_SAFETY,
  "screening": CANONICAL_TOPICS.ADULT_HEALTH,
  "triage and prioritization": CANONICAL_TOPICS.PRIORITIZATION_DELEGATION,
  "prioritization": CANONICAL_TOPICS.PRIORITIZATION_DELEGATION,
  "hemodialysis": CANONICAL_TOPICS.PROCEDURAL_COMPLICATIONS,
  "peritonitis": CANONICAL_TOPICS.RENAL_GI_DISORDERS,
};

function classifyTopic(topicString: string, category: string): string {
  const normalizedTopic = topicString.trim().toLowerCase().replace(/\s+/g, " ");

  // 1. Check direct override mapping
  if (OVERRIDES[normalizedTopic]) {
    return OVERRIDES[normalizedTopic];
  }

  // 2. Rule matching
  
  // Dosage calculation rule
  if (
    normalizedTopic.includes("dosage") ||
    normalizedTopic.includes("calculation") ||
    normalizedTopic.includes("infusion rate") ||
    normalizedTopic.includes("flow rate") ||
    normalizedTopic.includes("iv rates")
  ) {
    return CANONICAL_TOPICS.DOSAGE_CALCULATIONS;
  }

  // Anticoagulant rule
  if (
    normalizedTopic.includes("warfarin") ||
    normalizedTopic.includes("heparin") ||
    normalizedTopic.includes("anticoagulant") ||
    normalizedTopic.includes("doac")
  ) {
    return CANONICAL_TOPICS.ANTICOAGULANT_THERAPY;
  }

  // DKA rule
  if (
    normalizedTopic.includes("dka") ||
    normalizedTopic.includes("diabetic ketoacidosis")
  ) {
    return CANONICAL_TOPICS.DKA;
  }

  // Sepsis rule
  if (
    normalizedTopic.includes("sepsis") ||
    normalizedTopic.includes("septic")
  ) {
    return CANONICAL_TOPICS.SEPSIS_SHOCK;
  }

  // Burn rule
  if (
    normalizedTopic.includes("burn")
  ) {
    return CANONICAL_TOPICS.BURN_MANAGEMENT;
  }

  // Prioritization & Delegation
  if (
    normalizedTopic.includes("priorit") ||
    normalizedTopic.includes("delegat") ||
    normalizedTopic.includes("triage") ||
    normalizedTopic.includes("lpn") ||
    normalizedTopic.includes("uap") ||
    normalizedTopic.includes("floating nurse") ||
    normalizedTopic.includes("staff assignment") ||
    normalizedTopic.includes("room assignment")
  ) {
    return CANONICAL_TOPICS.PRIORITIZATION_DELEGATION;
  }

  // Confidentiality
  if (
    normalizedTopic.includes("hipaa") ||
    normalizedTopic.includes("confidentiality")
  ) {
    return CANONICAL_TOPICS.CONFIDENTIALITY_HIPAA;
  }

  // Conflict resolution
  if (normalizedTopic.includes("conflict")) {
    return CANONICAL_TOPICS.CONFLICT_RESOLUTION;
  }

  // Legal and Ethical
  if (
    normalizedTopic.includes("consent") ||
    normalizedTopic.includes("ethical") ||
    normalizedTopic.includes("legal") ||
    normalizedTopic.includes("discharge planning") ||
    normalizedTopic.includes("against medical advice") ||
    normalizedTopic.includes("elopement") ||
    normalizedTopic.includes("scope of practice") ||
    normalizedTopic.includes("malpractice") ||
    normalizedTopic.includes("liability") ||
    normalizedTopic.includes("advocac")
  ) {
    return CANONICAL_TOPICS.LEGAL_ETHICAL;
  }

  // Discharge / Handoff
  if (
    normalizedTopic.includes("handoff") ||
    normalizedTopic.includes("discharge") ||
    normalizedTopic.includes("continuity of care")
  ) {
    return CANONICAL_TOPICS.DISCHARGE_HANDOFF;
  }

  // Transmission precautions
  if (
    normalizedTopic.includes("precaution") ||
    normalizedTopic.includes("isolation") ||
    normalizedTopic.includes("norovirus") ||
    normalizedTopic.includes("difficile") ||
    normalizedTopic.includes("ebola") ||
    normalizedTopic.includes("infection control")
  ) {
    return CANONICAL_TOPICS.TRANSMISSION_PRECAUTIONS;
  }

  // Standard Precautions & Hygiene
  if (
    normalizedTopic.includes("hand hygiene") ||
    normalizedTopic.includes("handwashing") ||
    normalizedTopic.includes("hygiene")
  ) {
    return CANONICAL_TOPICS.STANDARD_PRECAUTIONS;
  }

  // PPE & Sterile Field
  if (
    normalizedTopic.includes("ppe") ||
    normalizedTopic.includes("sterile") ||
    normalizedTopic.includes("specimen")
  ) {
    return CANONICAL_TOPICS.PPE_STERILE;
  }

  // Disaster Preparedness
  if (
    normalizedTopic.includes("disaster") ||
    normalizedTopic.includes("bioterrorism")
  ) {
    return CANONICAL_TOPICS.DISASTER_PREPAREDNESS;
  }

  // Patient Safety
  if (
    normalizedTopic.includes("safety") ||
    normalizedTopic.includes("fall") ||
    normalizedTopic.includes("lifting") ||
    normalizedTopic.includes("restraint") ||
    normalizedTopic.includes("fire") ||
    normalizedTopic.includes("chemical splash") ||
    normalizedTopic.includes("specimens") ||
    normalizedTopic.includes("injury") ||
    normalizedTopic.includes("allergy")
  ) {
    return CANONICAL_TOPICS.PATIENT_SAFETY;
  }

  // Maternal Newborn
  if (
    normalizedTopic.includes("newborn") ||
    normalizedTopic.includes("neonatal") ||
    normalizedTopic.includes("pregnancy") ||
    normalizedTopic.includes("prenatal") ||
    normalizedTopic.includes("postpartum") ||
    normalizedTopic.includes("maternal") ||
    normalizedTopic.includes("breastfeeding") ||
    normalizedTopic.includes("fetal") ||
    normalizedTopic.includes("fundal") ||
    normalizedTopic.includes("leopold") ||
    normalizedTopic.includes("due date") ||
    normalizedTopic.includes("labor") ||
    normalizedTopic.includes("delivery") ||
    normalizedTopic.includes("placenta") ||
    normalizedTopic.includes("contraceptive") ||
    normalizedTopic.includes("post-partum")
  ) {
    return CANONICAL_TOPICS.MATERNAL_NEWBORN;
  }

  // Toddler/Pediatric Safety
  if (
    normalizedTopic.includes("toddler safety") ||
    normalizedTopic.includes("pediatric safety") ||
    normalizedTopic.includes("lead poisoning") ||
    normalizedTopic.includes("reye") ||
    normalizedTopic.includes("car seat") ||
    normalizedTopic.includes("poisoning")
  ) {
    return CANONICAL_TOPICS.PEDIATRIC_TODDLER_SAFETY;
  }

  // Pediatric & Adolescent Health
  if (
    normalizedTopic.includes("adolescent") ||
    normalizedTopic.includes("toddler development") ||
    normalizedTopic.includes("infant development") ||
    normalizedTopic.includes("developmental stages") ||
    normalizedTopic.includes("pediatric oral") ||
    normalizedTopic.includes("pediatric dehydration") ||
    normalizedTopic.includes("pediatric fluid") ||
    normalizedTopic.includes("pediatric asthma") ||
    normalizedTopic.includes("childhood") ||
    normalizedTopic.includes("pediatric croup") ||
    normalizedTopic.includes("infant/toddler")
  ) {
    return CANONICAL_TOPICS.PEDIATRIC_ADOLECENT_HEALTH;
  }

  // Reproductive & Endocrine Health
  if (
    normalizedTopic.includes("menopause") ||
    normalizedTopic.includes("osteoporosis") ||
    normalizedTopic.includes("arthritis")
  ) {
    return CANONICAL_TOPICS.REPRODUCTIVE_ENDOCRINE;
  }

  // Chronic Disease Management & Lifestyle
  if (
    normalizedTopic.includes("sick-day") ||
    normalizedTopic.includes("gerd") ||
    normalizedTopic.includes("lifestyle") ||
    normalizedTopic.includes("discharge teaching") ||
    normalizedTopic.includes("skin cancer") ||
    normalizedTopic.includes("peripheral arterial disease")
  ) {
    return CANONICAL_TOPICS.CHRONIC_LIFESTYLE;
  }

  // Adult Health & Wellness
  if (
    normalizedTopic.includes("screening") ||
    normalizedTopic.includes("healthy people") ||
    normalizedTopic.includes("immuniz") ||
    normalizedTopic.includes("vaccin") ||
    normalizedTopic.includes("wellness") ||
    normalizedTopic.includes("assessment") && category === categories.HEALTH_PROMOTION
  ) {
    return CANONICAL_TOPICS.ADULT_HEALTH;
  }

  // Therapeutic Communication
  if (
    normalizedTopic.includes("therapeutic comm") ||
    normalizedTopic.includes("communication")
  ) {
    return CANONICAL_TOPICS.THERAPEUTIC_COMM;
  }

  // Substance Use & Withdrawal
  if (
    normalizedTopic.includes("substance") ||
    normalizedTopic.includes("withdrawal") ||
    normalizedTopic.includes("alcohol") ||
    normalizedTopic.includes("opioid")
  ) {
    return CANONICAL_TOPICS.SUBSTANCE_USE;
  }

  // Suicide & Crisis
  if (
    normalizedTopic.includes("suicide") ||
    normalizedTopic.includes("crisis") ||
    normalizedTopic.includes("grief") ||
    normalizedTopic.includes("end-of-life") ||
    normalizedTopic.includes("abuse") ||
    normalizedTopic.includes("violence")
  ) {
    return CANONICAL_TOPICS.SUICIDE_CRISIS;
  }

  // Electroconvulsive Therapy
  if (
    normalizedTopic.includes("ect") ||
    normalizedTopic.includes("electroconvulsive")
  ) {
    return CANONICAL_TOPICS.ELECTROCONVULSIVE_THERAPY;
  }

  // Mental Health Disorders
  if (
    category === categories.PSYCHOSOCIAL ||
    normalizedTopic.includes("schizophrenia") ||
    normalizedTopic.includes("bipolar") ||
    normalizedTopic.includes("mania") ||
    normalizedTopic.includes("eating disorder") ||
    normalizedTopic.includes("anorexia") ||
    normalizedTopic.includes("bulimia") ||
    normalizedTopic.includes("depression") ||
    normalizedTopic.includes("anxiety") ||
    normalizedTopic.includes("ptsd") ||
    normalizedTopic.includes("ocd") ||
    normalizedTopic.includes("compulsive") ||
    normalizedTopic.includes("delirium") ||
    normalizedTopic.includes("hallucinations") ||
    normalizedTopic.includes("personality disorder") ||
    normalizedTopic.includes("psychosocial") ||
    normalizedTopic.includes("psychosis") ||
    normalizedTopic.includes("coping") ||
    normalizedTopic.includes("mental health")
  ) {
    return CANONICAL_TOPICS.MENTAL_HEALTH_DISORDERS;
  }

  // Nutritional Support
  if (
    normalizedTopic.includes("nutrition") ||
    normalizedTopic.includes("calorie") ||
    normalizedTopic.includes("diet") ||
    normalizedTopic.includes("feeding") ||
    normalizedTopic.includes("intake") ||
    normalizedTopic.includes("weight change")
  ) {
    return CANONICAL_TOPICS.NUTRITIONAL_SUPPORT;
  }

  // Mobility
  if (
    normalizedTopic.includes("mobility") ||
    normalizedTopic.includes("immobility") ||
    normalizedTopic.includes("assistive device") ||
    normalizedTopic.includes("aids") ||
    normalizedTopic.includes("positioning") ||
    normalizedTopic.includes("ambulation") ||
    normalizedTopic.includes("crutch") ||
    normalizedTopic.includes("walker") ||
    normalizedTopic.includes("cane") ||
    normalizedTopic.includes("transfer")
  ) {
    return CANONICAL_TOPICS.MOBILITY_IMMOBILITY;
  }

  // Sleep and rest
  if (
    normalizedTopic.includes("sleep") ||
    normalizedTopic.includes("rest") ||
    normalizedTopic.includes("insomnia")
  ) {
    return CANONICAL_TOPICS.SLEEP_REST;
  }

  // Palliative and supportive care
  if (
    normalizedTopic.includes("palliative") ||
    normalizedTopic.includes("pain") ||
    normalizedTopic.includes("oxygen") ||
    normalizedTopic.includes("comfort") ||
    normalizedTopic.includes("tracheostomy suctioning") ||
    normalizedTopic.includes("dvt prophylaxis")
  ) {
    return CANONICAL_TOPICS.PALLIATIVE_SUPPORTIVE;
  }

  // Elimination
  if (
    normalizedTopic.includes("elimination") ||
    normalizedTopic.includes("bowel") ||
    normalizedTopic.includes("urinary") ||
    normalizedTopic.includes("catheter") ||
    normalizedTopic.includes("ostomy") ||
    normalizedTopic.includes("ileostomy") ||
    normalizedTopic.includes("constipation") ||
    normalizedTopic.includes("dysphagia") ||
    normalizedTopic.includes("post-mortem care") ||
    normalizedTopic.includes("toileting")
  ) {
    return CANONICAL_TOPICS.ELIMINATION_COMFORT;
  }

  // Medication Safety & Administration
  if (
    normalizedTopic.includes("medication") ||
    normalizedTopic.includes("drug") ||
    normalizedTopic.includes("administration") ||
    normalizedTopic.includes("infusion") ||
    normalizedTopic.includes("iv potassium") ||
    normalizedTopic.includes("insulin") ||
    normalizedTopic.includes("safety") && category === categories.PHARMACOLOGICAL ||
    normalizedTopic.includes("metformin") ||
    normalizedTopic.includes("vancomycin") ||
    normalizedTopic.includes("aminoglycoside") ||
    normalizedTopic.includes("nitroglycerin") ||
    normalizedTopic.includes("furosemide") ||
    normalizedTopic.includes("digoxin") ||
    normalizedTopic.includes("beta blocker") ||
    normalizedTopic.includes("maoi")
  ) {
    return CANONICAL_TOPICS.MEDICATION_SAFETY;
  }

  // Anticoagulant Therapy (fallback)
  if (
    normalizedTopic.includes("coagulant") ||
    category === categories.PHARMACOLOGICAL && (normalizedTopic.includes("apixaban") || normalizedTopic.includes("rivaroxaban"))
  ) {
    return CANONICAL_TOPICS.ANTICOAGULANT_THERAPY;
  }

  // Parenteral Nutrition
  if (normalizedTopic.includes("tpn") || normalizedTopic.includes("parenteral nutrition")) {
    return CANONICAL_TOPICS.PARENTERAL_NUTRITION;
  }

  // Cardio and Endocrine Meds
  if (
    category === categories.PHARMACOLOGICAL && (
      normalizedTopic.includes("ace") ||
      normalizedTopic.includes("glucocorticoid") ||
      normalizedTopic.includes("steroid") ||
      normalizedTopic.includes("lithium") ||
      normalizedTopic.includes("magnesium sulfate") ||
      normalizedTopic.includes("phenytoin")
    )
  ) {
    return CANONICAL_TOPICS.CARDIO_ENDOCRINE_MEDS;
  }

  // Psychotropic meds
  if (
    category === categories.PHARMACOLOGICAL && (
      normalizedTopic.includes("antipsychotic") ||
      normalizedTopic.includes("serotonin") ||
      normalizedTopic.includes("antidepressant")
    )
  ) {
    return CANONICAL_TOPICS.PSYCHOTROPIC_MEDS;
  }

  // ABG Interpretation
  if (
    normalizedTopic.includes("abg") ||
    normalizedTopic.includes("acid-base")
  ) {
    return CANONICAL_TOPICS.ABG_INTERPRETATION;
  }

  // Laboratory and diagnostic
  if (
    normalizedTopic.includes("laboratory") ||
    normalizedTopic.includes("lab value") ||
    normalizedTopic.includes("diagnostic") ||
    normalizedTopic.includes("tests") ||
    normalizedTopic.includes("mri") ||
    normalizedTopic.includes("ct with") ||
    normalizedTopic.includes("pacemaker safety") ||
    normalizedTopic.includes("pacing") ||
    normalizedTopic.includes("interpretation") && category === categories.REDUCTION_OF_RISK
  ) {
    return CANONICAL_TOPICS.LAB_DIAGNOSTIC;
  }

  // Perioperative Care
  if (
    normalizedTopic.includes("postoperative") ||
    normalizedTopic.includes("preoperative") ||
    normalizedTopic.includes("post-op") ||
    normalizedTopic.includes("pre-op") ||
    normalizedTopic.includes("perioperative") ||
    normalizedTopic.includes("post-operative") ||
    normalizedTopic.includes("surgery")
  ) {
    return CANONICAL_TOPICS.PERIOPERATIVE_CARE;
  }

  // Procedural complications & Dialysis
  if (
    category === categories.REDUCTION_OF_RISK ||
    normalizedTopic.includes("catheterization") ||
    normalizedTopic.includes("complication") ||
    normalizedTopic.includes("thoracentesis") ||
    normalizedTopic.includes("paracentesis") ||
    normalizedTopic.includes("tracheostomy care") ||
    normalizedTopic.includes("hemodialysis") ||
    normalizedTopic.includes("dialysis") ||
    normalizedTopic.includes("transfusion reaction") ||
    normalizedTopic.includes("chest tube") ||
    normalizedTopic.includes("urine output monitoring") ||
    normalizedTopic.includes("gastric residual")
  ) {
    return CANONICAL_TOPICS.PROCEDURAL_COMPLICATIONS;
  }

  // Cardiovascular Disorders
  if (
    normalizedTopic.includes("heart") ||
    normalizedTopic.includes("cardiac") ||
    normalizedTopic.includes("myocardial") ||
    normalizedTopic.includes("infarction") ||
    normalizedTopic.includes("angina") ||
    normalizedTopic.includes("ecg") ||
    normalizedTopic.includes("electrocardiogram") ||
    normalizedTopic.includes("tamponade") ||
    normalizedTopic.includes("shock") && !normalizedTopic.includes("septic") ||
    normalizedTopic.includes("hemodynamic") ||
    normalizedTopic.includes("aneurysm") ||
    normalizedTopic.includes("embolism") ||
    normalizedTopic.includes("hypertension") && category === categories.PHYSIOLOGICAL ||
    normalizedTopic.includes("arterial")
  ) {
    return CANONICAL_TOPICS.CARDIO_DISORDERS;
  }

  // Renal & Gastrointestinal
  if (
    normalizedTopic.includes("kidney") ||
    normalizedTopic.includes("renal") ||
    normalizedTopic.includes("pancreatitis") ||
    normalizedTopic.includes("ibd") ||
    normalizedTopic.includes("bowel disease") ||
    normalizedTopic.includes("glaucoma") ||
    normalizedTopic.includes("cataract") ||
    normalizedTopic.includes("appendicitis") ||
    normalizedTopic.includes("cholecystitis") ||
    normalizedTopic.includes("cirrhosis") ||
    normalizedTopic.includes("gerd") ||
    normalizedTopic.includes("hhs") ||
    normalizedTopic.includes("gi bleed") ||
    normalizedTopic.includes("ulcerative colitis") ||
    normalizedTopic.includes("crohn")
  ) {
    return CANONICAL_TOPICS.RENAL_GI_DISORDERS;
  }

  // Respiratory and infectious
  if (
    category === categories.PHYSIOLOGICAL && (
      normalizedTopic.includes("asthma") ||
      normalizedTopic.includes("copd") ||
      normalizedTopic.includes("pneumonia") ||
      normalizedTopic.includes("meningitis") ||
      normalizedTopic.includes("epiglottitis") ||
      normalizedTopic.includes("croup") ||
      normalizedTopic.includes("tuberculosis") ||
      normalizedTopic.includes("respiratory") ||
      normalizedTopic.includes("anaphylaxis") ||
      normalizedTopic.includes("bronch") ||
      normalizedTopic.includes("effusion")
    )
  ) {
    return CANONICAL_TOPICS.RESPIRATORY_INFECTIOUS;
  }

  // Electrolyte Imbalances
  if (
    normalizedTopic.includes("electrolyte") ||
    normalizedTopic.includes("potassium") ||
    normalizedTopic.includes("calcium") ||
    normalizedTopic.includes("sodium") ||
    normalizedTopic.includes("magnesium") ||
    normalizedTopic.includes("phosphate")
  ) {
    return CANONICAL_TOPICS.ELECTROLYTE_IMBALANCES;
  }

  // Endocrine & Neurological
  if (
    category === categories.PHYSIOLOGICAL && (
      normalizedTopic.includes("adrenal") ||
      normalizedTopic.includes("cushing") ||
      normalizedTopic.includes("addison") ||
      normalizedTopic.includes("siadh") ||
      normalizedTopic.includes("insipidus") ||
      normalizedTopic.includes("thyroid") ||
      normalizedTopic.includes("intracranial") ||
      normalizedTopic.includes("icp") ||
      normalizedTopic.includes("posturing") ||
      normalizedTopic.includes("myasthenia") ||
      normalizedTopic.includes("seizure") ||
      normalizedTopic.includes("autonomic") ||
      normalizedTopic.includes("dehydration") ||
      normalizedTopic.includes("diabetes") ||
      normalizedTopic.includes("neurological") ||
      normalizedTopic.includes("spinal") ||
      normalizedTopic.includes("cranial") ||
      normalizedTopic.includes("parkinson") ||
      normalizedTopic.includes("alzheimer") ||
      normalizedTopic.includes("multiple sclerosis") ||
      normalizedTopic.includes("head injury")
    )
  ) {
    return CANONICAL_TOPICS.ENDOCRINE_NEURO_DISORDERS;
  }

  // Fallback default categorization by category
  if (category === categories.MANAGEMENT_OF_CARE) return CANONICAL_TOPICS.LEGAL_ETHICAL;
  if (category === categories.SAFETY_INFECTION) return CANONICAL_TOPICS.PATIENT_SAFETY;
  if (category === categories.HEALTH_PROMOTION) return CANONICAL_TOPICS.ADULT_HEALTH;
  if (category === categories.PSYCHOSOCIAL) return CANONICAL_TOPICS.MENTAL_HEALTH_DISORDERS;
  if (category === categories.BASIC_CARE) return CANONICAL_TOPICS.ELIMINATION_COMFORT;
  if (category === categories.PHARMACOLOGICAL) return CANONICAL_TOPICS.MEDICATION_SAFETY;
  if (category === categories.REDUCTION_OF_RISK) return CANONICAL_TOPICS.PROCEDURAL_COMPLICATIONS;
  if (category === categories.PHYSIOLOGICAL) return CANONICAL_TOPICS.CARDIO_DISORDERS; // Default fallback

  return topicString; // unmodified fallback if absolutely nothing fits
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const bankDir = "banks";
  const files = await readdir(bankDir);
  const jsonFiles = files.filter(f => f.endsWith(".json") && f !== "Pending cases").map(f => join(bankDir, f));

  console.log(`Scanning and standardizing question banks... Dry run: ${isDryRun}`);

  for (const file of jsonFiles) {
    try {
      const text = await readFile(file, "utf8");
      const data = JSON.parse(text);
      const questions = data.questions || [];

      let modifiedCount = 0;
      const originalUniqueTopics = new Set<string>();
      const newUniqueTopics = new Set<string>();

      const processQuestion = (q: any) => {
        const originalTopic = q.topic || "";
        originalUniqueTopics.add(originalTopic);
        
        const canonicalTopic = classifyTopic(originalTopic, q.category);
        newUniqueTopics.add(canonicalTopic);

        if (originalTopic !== canonicalTopic) {
          q.topic = canonicalTopic;
          modifiedCount++;
        }

        if (q.itemType === "case_study" && q.caseStudy && q.caseStudy.questions) {
          for (const eq of q.caseStudy.questions) {
            const eqOriginalTopic = eq.topic || "";
            originalUniqueTopics.add(eqOriginalTopic);

            const eqCanonicalTopic = classifyTopic(eqOriginalTopic, eq.category);
            newUniqueTopics.add(eqCanonicalTopic);

            if (eqOriginalTopic !== eqCanonicalTopic) {
              eq.topic = eqCanonicalTopic;
              modifiedCount++;
            }
          }
        }
      };

      for (const q of questions) {
        processQuestion(q);
      }

      console.log(`\nFile: ${basename(file)}`);
      console.log(`- Questions/parts modified: ${modifiedCount}`);
      console.log(`- Unique topics count: ${originalUniqueTopics.size} -> ${newUniqueTopics.size}`);

      if (modifiedCount > 0 && !isDryRun) {
        const updatedText = JSON.stringify(data, null, 2);

        // Pre-validate before writing
        const parsedObj = parseBankText(updatedText);
        const validation = validateBankObject(parsedObj);
        if (!validation.ok) {
          console.error(`Validation failed for the updated object of ${basename(file)}!`);
          validation.reasons.forEach((reason) => console.error(`- ${reason}`));
          process.exit(1);
        }

        await writeFile(file, updatedText, "utf8");
        console.log(`- Successfully updated and validated on disk.`);
      } else if (modifiedCount > 0 && isDryRun) {
        console.log(`- [Dry run] Skip writing updates to disk.`);
      } else {
        console.log(`- No updates required.`);
      }

    } catch (err) {
      console.error(`Error processing file ${basename(file)}:`, err);
      process.exit(1);
    }
  }

  console.log("\nFinished topic standardization!");
}

main().catch(console.error);
