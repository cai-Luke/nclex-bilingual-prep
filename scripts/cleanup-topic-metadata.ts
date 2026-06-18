import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { parseBankText } from "../src/bankImport";
import { validateBankObject } from "../src/schema";
import { TOPIC_CATEGORY_ORDER, TOPICS, aliasTopic, semanticAliasTopic, isCanonicalTopic, normalizeTopicKey, topicCategories } from "../src/topics";
import type { Category } from "../src/types";

type JsonRecord = Record<string, any>;

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

const idTopicOverrides = new Map<string, string>([
  ["claude_a_sata_eps_haloperidol_12", TOPICS.PSYCHOTROPIC_MEDICATIONS],
  ["claude_a_mc_metoprolol_assessment_10", TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS],
  ["claude_a_mc_ace_inhibitor_11", TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS],
  ["claude_a_mc_metformin_contrast_13", TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS],
  ["claude_a_cloze_aki_20", TOPICS.RENAL_GASTROINTESTINAL_DISORDERS],
  ["claude_a_mc_thyroid_storm_17", TOPICS.ENDOCRINE_NEUROLOGICAL_DISORDERS],
  ["claude_a_sata_mmr_vaccine_48", TOPICS.PEDIATRIC_ADOLESCENT_HEALTH],
  ["claude_a_matrix_wound_assessment_26", TOPICS.PERIOPERATIVE_CARE],
  ["claude_a_sata_tracheostomy_09", TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS],
  ["claude_a_mc_cauti_prevention_27", TOPICS.STANDARD_PRECAUTIONS_HYGIENE],

  ["gemini_jun05_a_mc_advance_directives_01", TOPICS.LEGAL_ETHICAL],
  ["gemini_jun05_a_sata_central_line_11", TOPICS.STANDARD_PRECAUTIONS_HYGIENE],
  ["gemini_jun05_a_or_chest_tube_disconnection_13", TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS],
  ["gemini_jun05_a_cloze_depression_23", TOPICS.SUICIDE_CRISIS_INTERVENTION],
  ["gemini_jun05_a_sata_pacemaker_41", TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS],
  ["gemini_jun05_a_sata_preeclampsia_31", TOPICS.MATERNAL_NEWBORN],
  ["gemini_jun05_a_matrix_cardiac_cath_18", TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS],
  ["gemini_jun05_a_mc_dysphagia_29", TOPICS.NUTRITIONAL_FLUID_SUPPORT],
  ["gemini_jun05_a_mc_ibd_diet_46", TOPICS.RENAL_GASTROINTESTINAL_DISORDERS],
  ["gemini_jun05_a_matrix_appendicitis_45", TOPICS.LAB_DIAGNOSTIC_TESTS],
  ["gemini_jun05_a_matrix_hip_precautions_50", TOPICS.MOBILITY_IMMOBILITY],
  ["gemini_jun05_b_cloze_dysphagia_19", TOPICS.NUTRITIONAL_FLUID_SUPPORT],
  ["gemini_jun05_b_fib_dosage_01", TOPICS.DOSAGE_CALCULATIONS],
  ["gemini_jun05_b_fib_dosage_02", TOPICS.DOSAGE_CALCULATIONS],
  ["gemini_jun05_b_fib_fluid_03", TOPICS.DOSAGE_CALCULATIONS],
  ["gemini_jun05_b_fib_vital_08", TOPICS.CARDIOVASCULAR_DISORDERS],
  ["gemini_jun05_b_cloze_aki_13", TOPICS.RENAL_GASTROINTESTINAL_DISORDERS],
  ["gemini_jun05_b_cloze_depression_14", TOPICS.SUICIDE_CRISIS_INTERVENTION],
  ["gemini_jun05_b_cloze_ipv_17", TOPICS.SUICIDE_CRISIS_INTERVENTION],
  ["gemini_jun05_b_cloze_cath_20", TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS],
  ["gemini_b10_07", TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS],
  ["gemini_b2_01", TOPICS.PSYCHOTROPIC_MEDICATIONS],
  ["gemini_b2_02", TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS],
  ["gemini_b2_04", TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS],
  ["gemini_b2_05", TOPICS.PSYCHOTROPIC_MEDICATIONS],
  ["gemini_b2_07", TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS],
  ["gemini_b2_09", TOPICS.PSYCHOTROPIC_MEDICATIONS],
  ["gemini_b3_03", TOPICS.PEDIATRIC_ADOLESCENT_HEALTH],
  ["gemini_b3_08", TOPICS.PEDIATRIC_ADOLESCENT_HEALTH],
  ["gemini_b5_02", TOPICS.SLEEP_REST],
  ["gemini_b5_06", TOPICS.SLEEP_REST],
  ["gemini_b5_09", TOPICS.SLEEP_REST],
  ["gemini_b9_04", TOPICS.MATERNAL_NEWBORN],
  ["gemini_c10_02", TOPICS.MATERNAL_NEWBORN],
  ["gemini_c10_06", TOPICS.PEDIATRIC_ADOLESCENT_HEALTH],
  ["gemini_c10_09", TOPICS.ENDOCRINE_NEUROLOGICAL_DISORDERS],
  ["gemini_c10_10", TOPICS.ELECTROLYTE_IMBALANCES],
  ["gemini_d1_10_cloze_mag_electrolyte_link", TOPICS.ELECTROLYTE_IMBALANCES],
  ["gemini_d10_07", TOPICS.ELIMINATION_COMFORT],
  ["gemini_d10_09", TOPICS.MATERNAL_NEWBORN],
  ["gemini_d10_10", TOPICS.ELECTROLYTE_IMBALANCES],
  ["gemini_d6_toddler_poisoning_02", TOPICS.PEDIATRIC_TODDLER_SAFETY],
  ["gemini_d6_toddler_lead_poisoning_07", TOPICS.PEDIATRIC_TODDLER_SAFETY],
  ["gemini_d6_toddler_drowning_safety_09", TOPICS.PEDIATRIC_TODDLER_SAFETY],
  ["gemini_d8_01", TOPICS.LAB_DIAGNOSTIC_TESTS],
  ["gemini_d8_07", TOPICS.LAB_DIAGNOSTIC_TESTS],
  ["gemini_c8_07", TOPICS.LAB_DIAGNOSTIC_TESTS],
  ["gemini_p1_02", TOPICS.PEDIATRIC_ADOLESCENT_HEALTH],
  ["gemini_p1_06", TOPICS.PEDIATRIC_ADOLESCENT_HEALTH],
  ["gemini_p1_07", TOPICS.STANDARD_PRECAUTIONS_HYGIENE],
  ["gemini_p1_10", TOPICS.ADULT_HEALTH],
  ["gemini_p9_sata_05", TOPICS.PEDIATRIC_TODDLER_SAFETY],
  ["gemini_p10_1", TOPICS.MENTAL_HEALTH_DISORDERS],
  ["gemini_p10_3", TOPICS.SUBSTANCE_USE_WITHDRAWAL],
  ["gemini_p10_5", TOPICS.MENTAL_HEALTH_DISORDERS],
  ["gemini_p10_6", TOPICS.MENTAL_HEALTH_DISORDERS],
  ["gemini_p10_8", TOPICS.MENTAL_HEALTH_DISORDERS],
  ["gemini_p10_10", TOPICS.MENTAL_HEALTH_DISORDERS],
  ["trad_ppt_20", TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS],
  ["trad_ppt_22", TOPICS.CARDIOVASCULAR_ENDOCRINE_MEDICATIONS],
  ["trad_ppt_24", TOPICS.MEDICATION_SAFETY_ADMIN],
  ["trad_batchB_05", TOPICS.LEGAL_ETHICAL],
  ["trad_batchC_03", TOPICS.PEDIATRIC_TODDLER_SAFETY],
  ["trad_batchC_12", TOPICS.SUICIDE_CRISIS_INTERVENTION],
  ["trad_batchC_13", TOPICS.PEDIATRIC_ADOLESCENT_HEALTH],
  ["trad_batchC_18", TOPICS.THERAPEUTIC_COMMUNICATION],
  ["trad_batchD_05", TOPICS.ELIMINATION_COMFORT],
  ["trad_batchD_11", TOPICS.PERIOPERATIVE_CARE],
  ["trad_batchD_23", TOPICS.PALLIATIVE_SUPPORTIVE_CARE],
  ["trad_batchD_24", TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS],

  ["gpt_canonical_mc_advance_directives_043", TOPICS.LEGAL_ETHICAL],
  ["gpt_canonical_sata_suicide_precautions_042", TOPICS.SUICIDE_CRISIS_INTERVENTION],
  ["gpt_canonical_or_chest_tube_disconnect_052", TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS],
  ["gpt_canonical_sata_clabsi_prevention_067", TOPICS.STANDARD_PRECAUTIONS_HYGIENE],
  ["gpt_canonical_or_suspected_stroke_072", TOPICS.ENDOCRINE_NEUROLOGICAL_DISORDERS],
  ["gpt_canonical_matrix_wound_assessment_077", TOPICS.PERIOPERATIVE_CARE],
  ["gpt_canonical_or_thyroidectomy_airway_095", TOPICS.PERIOPERATIVE_CARE],
  ["sata_newborn_safety_teaching_008", TOPICS.MATERNAL_NEWBORN],
  ["mc_suicide_precautions_010", TOPICS.SUICIDE_CRISIS_INTERVENTION],
  ["sata_pressure_injury_prevention_014", TOPICS.ELIMINATION_COMFORT],
  ["gpt_canonical_matrix_pressure_injury_040", TOPICS.ELIMINATION_COMFORT],
  ["mc_needlestick_first_action_006", TOPICS.STANDARD_PRECAUTIONS_HYGIENE],
  ["gpt_canonical_fib_pediatric_urine_output_049", TOPICS.PEDIATRIC_ADOLESCENT_HEALTH],
  ["gpt_canonical_or_cord_prolapse_078", TOPICS.MATERNAL_NEWBORN],
  ["gpt_canonical_matrix_depression_safety_083", TOPICS.SUICIDE_CRISIS_INTERVENTION],
  ["gpt_canonical_fib_adult_urine_output_087", TOPICS.ELIMINATION_COMFORT],
  ["gpt_canonical_matrix_needlestick_089", TOPICS.STANDARD_PRECAUTIONS_HYGIENE],
  ["gpt_canonical_cloze_opioid_safety_094", TOPICS.MEDICATION_SAFETY_ADMIN],
  ["gpt_canonical_matrix_post_cath_096", TOPICS.PROCEDURAL_COMPLICATIONS_DIALYSIS],
  ["gpt_canonical_or_telephone_order_110", TOPICS.MEDICATION_SAFETY_ADMIN],
  ["gpt_canonical_cloze_mania_safety_115", TOPICS.MENTAL_HEALTH_DISORDERS],
  ["gpt_canonical_cloze_sleep_hygiene_121", TOPICS.SLEEP_REST],

  ["case_preeclampsia_magnesium_01", TOPICS.MATERNAL_NEWBORN],
  ["preeclampsia_severe_features_sata", TOPICS.MATERNAL_NEWBORN],
  ["preeclampsia_initial_priority_mc", TOPICS.MATERNAL_NEWBORN],
  ["cs_ckd_01_q2", TOPICS.ELECTROLYTE_IMBALANCES],
  ["cs_schiz_01_q2", TOPICS.MENTAL_HEALTH_DISORDERS],
  ["cs_schiz_01_q5", TOPICS.PSYCHOTROPIC_MEDICATIONS],
  ["cs_hip_01_q1", TOPICS.MOBILITY_IMMOBILITY],
  ["cs_hip_01_q4", TOPICS.MOBILITY_IMMOBILITY],
  ["sa_post_mortem_01", TOPICS.PALLIATIVE_SUPPORTIVE_CARE],
  ["sa_vap_prevention_01", TOPICS.STANDARD_PRECAUTIONS_HYGIENE],
  ["sa_parkland_01", TOPICS.BURN_MANAGEMENT],
  ["gap_50_sic_07", TOPICS.MATERNAL_NEWBORN],
]);

const updateQuestionTopic = (
  question: JsonRecord,
  file: string,
  changes: ProposedChange[],
  unresolved: ProposedChange[],
  suggestions: ProposedChange[],
  untrusted: ProposedChange[],
  crossCategoryBlocks: ProposedChange[],
  parentContext = "",
) => {
  if (typeof question.topic !== "string") return;

  const oldTopic = question.topic;
  
  if (isCanonicalTopic(oldTopic)) {
    return; // Guard 1: Never reclassify an already-canonical topic
  }

  const isValidCategory = (cat: string) => TOPIC_CATEGORY_ORDER.includes(cat as Category);
  const isTrusted = question.category && isValidCategory(question.category);

  if (!isTrusted) {
    untrusted.push({
      file,
      id: question.id ?? "(missing id)",
      oldTopic,
      newTopic: "(untrusted)",
      category: question.category ?? "(missing category)",
      itemType: question.itemType ?? "(missing itemType)",
      reason: "category untrusted",
    });
    return;
  }

  const exact = aliasTopic(oldTopic);
  
  if (exact) {
    const licensedCategories = topicCategories(exact);
    if (!licensedCategories.includes(question.category)) {
      crossCategoryBlocks.push({
        file,
        id: question.id ?? "(missing id)",
        oldTopic,
        newTopic: exact,
        category: question.category ?? "(missing category)",
        itemType: question.itemType ?? "(missing itemType)",
        reason: "lexical alias matches but topic is not licensed for this category",
      });
      return;
    }

    if (exact !== oldTopic) {
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
    }
    return;
  }

  const override = idTopicOverrides.get(question.id);
  const semantic = semanticAliasTopic(oldTopic);

  if (override) {
    suggestions.push({
      file,
      id: question.id ?? "(missing id)",
      oldTopic,
      newTopic: override,
      category: question.category ?? "(missing category)",
      itemType: question.itemType ?? "(missing itemType)",
      reason: "curated ID suggestion",
    });
    return;
  }

  if (semantic) {
    suggestions.push({
      file,
      id: question.id ?? "(missing id)",
      oldTopic,
      newTopic: semantic,
      category: question.category ?? "(missing category)",
      itemType: question.itemType ?? "(missing itemType)",
      reason: "semantic alias suggestion",
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
};

const getBankFiles = async () => {
  const files = await readdir("banks");
  return files.filter((file) => file.endsWith(".json")).map((file) => join("banks", file));
};

const formatReport = (changes: ProposedChange[], unresolved: ProposedChange[], suggestions: ProposedChange[], untrusted: ProposedChange[], crossCategoryBlocks: ProposedChange[]) => {
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
    `Category untrusted rows: ${untrusted.length}`,
    `Blocked cross-category lexical aliases: ${crossCategoryBlocks.length}`,
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

  if (untrusted.length > 0) {
    lines.push("## Category Untrusted", "");
    lines.push("| Question ID | Category | Type | Current topic | Suggested topic | Reason |");
    lines.push("|---|---|---|---|---|---|");
    for (const item of untrusted) {
      lines.push(`| \`${item.id}\` | ${item.category} | ${item.itemType} | ${item.oldTopic} | ${item.newTopic} | ${item.reason} |`);
    }
    lines.push("");
  }

  if (crossCategoryBlocks.length > 0) {
    lines.push("## Blocked Cross-Category Lexical Aliases", "");
    lines.push("| Question ID | Category | Type | Current topic | Blocked target topic | Reason |");
    lines.push("|---|---|---|---|---|---|");
    for (const item of crossCategoryBlocks) {
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
const untrusted: ProposedChange[] = [];
const crossCategoryBlocks: ProposedChange[] = [];

// Semantic context extraction
const extractContext = (question: JsonRecord, parentContext = "") => {
  const stem = question.stem?.en ?? "";
  
  let correctOptionText = "";
  if (question.itemType === "multiple_choice" && Array.isArray(question.options)) {
    const correctOption = question.options.find((o: any) => o.correct);
    if (correctOption) correctOptionText = correctOption.text?.en ?? "";
  } else if (question.itemType === "select_all_that_apply" && Array.isArray(question.options)) {
    correctOptionText = question.options.filter((o: any) => o.correct).map((o: any) => o.text?.en ?? "").join(" ");
  }

  const rationale = question.rationale?.en ?? "";

  return { stem, correctOptionText, rationale, parentContext };
};

const fullUnresolvedList: any[] = [];

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
        ? `${question.caseStudy?.title?.en ?? ""}`
        : "";

    const preLen = unresolved.length;
    updateQuestionTopic(question, file, fileChanges, unresolved, suggestions, untrusted, crossCategoryBlocks, parentContext);
    
    if (unresolved.length > preLen) {
       fullUnresolvedList.push({
         id: question.id,
         category: question.category,
         oldTopic: question.topic,
         context: extractContext(question, parentContext)
       });
    }

    if (question.itemType === "case_study" && Array.isArray(question.caseStudy?.questions)) {
      for (const embedded of question.caseStudy.questions) {
        const childPreLen = unresolved.length;
        updateQuestionTopic(embedded, file, fileChanges, unresolved, suggestions, untrusted, crossCategoryBlocks, parentContext);
        if (unresolved.length > childPreLen) {
           fullUnresolvedList.push({
             id: embedded.id || question.id,
             category: embedded.category,
             oldTopic: embedded.topic,
             context: extractContext(embedded, parentContext)
           });
        }
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

await mkdir("audit", { recursive: true });
const reportSuffix = reportLabel ? `.${reportLabel}` : dryRun ? ".dry-run" : "";
const reportPath = `audit/topic-vocabulary-migration-${reportDate}${reportSuffix}.report.md`;
await writeFile(reportPath, formatReport(allChanges, unresolved, suggestions, untrusted, crossCategoryBlocks));

// Split unresolved into Gemini vs GPT/Claude manifests for semantic pass
const unresolvedGemini = fullUnresolvedList.filter(q => q.id && q.id.startsWith("gemini"));
const unresolvedGptClaude = fullUnresolvedList.filter(q => !q.id || !q.id.startsWith("gemini"));

await writeFile(`audit/unresolved_gemini.json`, JSON.stringify(unresolvedGemini, null, 2));
await writeFile(`audit/unresolved_gpt_claude.json`, JSON.stringify(unresolvedGptClaude, null, 2));

console.log(`${dryRun ? "Would update" : "Updated"} ${allChanges.length} topic assignments across ${bankFiles.length} bank files.`);
console.log(`${suggestions.length} noncanonical topic assignments have suggestions requiring review.`);
console.log(`${untrusted.length} noncanonical topic assignments are category-untrusted.`);
console.log(`${crossCategoryBlocks.length} noncanonical topic assignments were blocked due to cross-category rules.`);
console.log(`${unresolved.length} noncanonical topic assignments require human decisions.`);
console.log(`Generated audit/unresolved_gemini.json with ${unresolvedGemini.length} rows.`);
console.log(`Generated audit/unresolved_gpt_claude.json with ${unresolvedGptClaude.length} rows.`);
console.log(`Report: ${reportPath}`);
