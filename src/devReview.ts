import type { CaseStudyQuestion, Question, QuestionRecord, StandaloneQuestion } from "./types";

export type QuestionLookupEntry = {
  question: Question;
  sourceLabel: string;
  parentCaseStudy?: CaseStudyQuestion;
  embeddedPart?: StandaloneQuestion;
  pathLabel: string;
};

export type QuestionLookupResult = {
  requestedId: string;
  found: boolean;
  entry?: QuestionLookupEntry;
};

export type SweepEvidence = {
  location: string;
  quote: string;
};

export type SweepManifestRow = {
  qid: string;
  item_type: string;
  category: string;
  flag_type: string;
  priority: string;
  visual_value: string;
  target_renderer: string | null;
  quoted_evidence: SweepEvidence[];
  answer_key_trust: string;
  ambiguity_risk: string;
  recommended_action: string;
  action_rationale: string;
  needs_human_review: boolean;
  risk_tier: string;
  content_lane_status: string;
  parent_qid?: string;
  the_tell?: string;
  renderer_justification?: string;
  ambiguity_evidence?: string;
  trust_evidence?: string;
  possible_duplicate_qids?: string[];
  duplicate_claim?: string;
  [key: string]: unknown;
};

export type ParsedSweepManifest = {
  rows: SweepManifestRow[];
  errors: string[];
  warnings: string[];
};

const sweepEnums = {
  item_type: [
    "multiple_choice",
    "select_all",
    "ordered_response",
    "fill_in_blank",
    "matrix",
    "dropdown_cloze",
    "case_study",
    "case_study_part",
  ],
  flag_type: ["visual_replace_candidate", "visual_parallel_candidate", "human_review", "redundancy_candidate"],
  priority: ["high", "medium", "low"],
  visual_value: ["essential", "helpful", "none"],
  target_renderer: [
    "rhythm_strip",
    "capnography",
    "vitals_trend",
    "lab_trend",
    "mar",
    "io_record",
    "medication_label",
    "device_screen",
    "fetal_monitoring",
    "burn_map",
  ],
  answer_key_trust: ["high", "medium", "low", "not_assessed"],
  ambiguity_risk: ["low", "medium", "high"],
  recommended_action: [
    "replace_text_item_with_visual",
    "add_parallel_visual_item",
    "human_review_before_action",
    "possible_duplicate_review",
    "leave_after_review",
  ],
  risk_tier: ["low", "medium", "high"],
  content_lane_status: ["open", "blocked", "unknown"],
  evidence_location: [
    "stem",
    "option",
    "row",
    "column",
    "dropdown",
    "blank",
    "exhibit",
    "rationale.correct",
    "rationale.byChoice",
  ],
} as const;

const requiredSweepFields = [
  "qid",
  "item_type",
  "category",
  "flag_type",
  "priority",
  "visual_value",
  "quoted_evidence",
  "answer_key_trust",
  "ambiguity_risk",
  "recommended_action",
  "action_rationale",
  "needs_human_review",
  "risk_tier",
  "content_lane_status",
] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const parseQuestionIds = (value: string): string[] =>
  value
    .split(/[\s,]+/)
    .map((id) => id.trim())
    .filter(Boolean);

export const buildQuestionReviewIndex = (records: QuestionRecord[]): Map<string, QuestionLookupEntry> => {
  const index = new Map<string, QuestionLookupEntry>();
  records.forEach((record) => {
    index.set(record.question.id, {
      question: record.question,
      sourceLabel: record.sourceLabel,
      pathLabel: record.question.itemType === "case_study" ? "Case-study parent" : "Top-level question",
    });
    if (record.question.itemType !== "case_study") return;
    const parentCaseStudy = record.question;
    parentCaseStudy.caseStudy.questions.forEach((part, partIndex) => {
      index.set(part.id, {
        question: parentCaseStudy,
        sourceLabel: record.sourceLabel,
        parentCaseStudy,
        embeddedPart: part,
        pathLabel: `Embedded part ${partIndex + 1} of ${parentCaseStudy.id}`,
      });
    });
  });
  return index;
};

export const lookupQuestionIds = (
  ids: string[],
  index: Map<string, QuestionLookupEntry>,
): QuestionLookupResult[] =>
  ids.map((requestedId) => {
    const entry = index.get(requestedId);
    return entry ? { requestedId, found: true, entry } : { requestedId, found: false };
  });

const validateSweepRow = (row: Record<string, unknown>, line: number): string[] => {
  const errors: string[] = [];
  requiredSweepFields.forEach((field) => {
    if (!(field in row) || row[field] === null || row[field] === undefined || row[field] === "") {
      errors.push(`Line ${line}: required field ${field} is missing.`);
    }
  });

  const enumFields = [
    "item_type",
    "flag_type",
    "priority",
    "visual_value",
    "answer_key_trust",
    "ambiguity_risk",
    "recommended_action",
    "risk_tier",
    "content_lane_status",
  ] as const;
  enumFields.forEach((field) => {
    if (!(sweepEnums[field] as readonly unknown[]).includes(row[field])) {
      errors.push(`Line ${line}: ${field} has an invalid v3 value.`);
    }
  });

  if (
    row.target_renderer !== null &&
    row.target_renderer !== undefined &&
    !(sweepEnums.target_renderer as readonly unknown[]).includes(row.target_renderer)
  ) {
    errors.push(`Line ${line}: target_renderer has an invalid post-roadmap value.`);
  }
  if (row.needs_human_review !== true) {
    errors.push(`Line ${line}: needs_human_review must be true.`);
  }
  if (!Array.isArray(row.quoted_evidence) || row.quoted_evidence.length === 0) {
    errors.push(`Line ${line}: quoted_evidence must be a non-empty array.`);
  } else {
    row.quoted_evidence.forEach((evidence, evidenceIndex) => {
      if (
        !isRecord(evidence) ||
        !(sweepEnums.evidence_location as readonly unknown[]).includes(evidence.location) ||
        !nonEmptyString(evidence.quote)
      ) {
        errors.push(`Line ${line}: quoted_evidence[${evidenceIndex}] is invalid.`);
      }
    });
  }
  if (row.item_type === "case_study_part" && !nonEmptyString(row.parent_qid)) {
    errors.push(`Line ${line}: parent_qid is required for case_study_part.`);
  }
  if (row.target_renderer !== null && row.target_renderer !== undefined && !nonEmptyString(row.renderer_justification)) {
    errors.push(`Line ${line}: renderer_justification is required when target_renderer is set.`);
  }
  if (row.flag_type === "redundancy_candidate") {
    if (!Array.isArray(row.possible_duplicate_qids) || row.possible_duplicate_qids.length === 0) {
      errors.push(`Line ${line}: redundancy_candidate requires possible_duplicate_qids.`);
    }
    if (!nonEmptyString(row.duplicate_claim)) {
      errors.push(`Line ${line}: redundancy_candidate requires duplicate_claim.`);
    }
  }
  if (row.flag_type === "visual_replace_candidate") {
    if (row.visual_value !== "essential" || row.recommended_action !== "replace_text_item_with_visual") {
      errors.push(`Line ${line}: visual_replace_candidate fields are inconsistent.`);
    }
    if (row.target_renderer === null || row.target_renderer === undefined || row.answer_key_trust !== "high") {
      errors.push(`Line ${line}: visual_replace_candidate requires a renderer and high answer-key trust.`);
    }
  }
  if (row.content_lane_status === "blocked" && row.recommended_action === "replace_text_item_with_visual") {
    errors.push(`Line ${line}: blocked content lanes cannot recommend visual replacement.`);
  }
  return errors;
};

export const parseSweepManifest = (text: string): ParsedSweepManifest => {
  const rows: SweepManifestRow[] = [];
  const errors: string[] = [];
  text.split(/\r?\n/).forEach((lineText, index) => {
    if (!lineText.trim()) return;
    const line = index + 1;
    try {
      const parsed = JSON.parse(lineText) as unknown;
      if (!isRecord(parsed)) {
        errors.push(`Line ${line}: expected a JSON object.`);
        return;
      }
      const rowErrors = validateSweepRow(parsed, line);
      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
        return;
      }
      rows.push(parsed as SweepManifestRow);
    } catch (error) {
      errors.push(`Line ${line}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  return {
    rows,
    errors,
    warnings: rows.length > 0
      ? ["Client-side v3 row checks passed. Audit output remains untrusted until human review; use npm run validate-sweep for the full manifest + summary gate."]
      : [],
  };
};

const priorityRank = { high: 0, medium: 1, low: 2 } as const;
const trustRank = { low: 0, medium: 1, not_assessed: 2, high: 3 } as const;
const riskRank = { high: 0, medium: 1, low: 2 } as const;

export const sortSweepRows = (rows: SweepManifestRow[], visualWorkMode: boolean): SweepManifestRow[] =>
  [...rows].sort((left, right) => {
    if (visualWorkMode) {
      const leftVisual = left.flag_type.startsWith("visual_") ? 0 : 1;
      const rightVisual = right.flag_type.startsWith("visual_") ? 0 : 1;
      if (leftVisual !== rightVisual) return leftVisual - rightVisual;
    } else {
      const leftVisual = left.flag_type.startsWith("visual_") ? 1 : 0;
      const rightVisual = right.flag_type.startsWith("visual_") ? 1 : 0;
      if (leftVisual !== rightVisual) return leftVisual - rightVisual;
    }
    return (
      (priorityRank[left.priority as keyof typeof priorityRank] ?? 9) -
        (priorityRank[right.priority as keyof typeof priorityRank] ?? 9) ||
      (trustRank[left.answer_key_trust as keyof typeof trustRank] ?? 9) -
        (trustRank[right.answer_key_trust as keyof typeof trustRank] ?? 9) ||
      (riskRank[left.risk_tier as keyof typeof riskRank] ?? 9) -
        (riskRank[right.risk_tier as keyof typeof riskRank] ?? 9)
    );
  });
