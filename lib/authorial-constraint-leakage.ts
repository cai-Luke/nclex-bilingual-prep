import { readFile, readdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { collectLearnerFacingFields, type LearnerFacingField } from "./producer-vocabulary-leakage";
import { parseBankText } from "../src/bankImport";
import { validateBankObject } from "../src/schema";
import type { Question } from "../src/types";

export type SurfaceClass =
  | "TASK_STEM_OR_INSTRUCTION"
  | "TEST_TAKING_STRATEGY"
  | "OPTION_OR_RESPONSE_TOKEN"
  | "RATIONALE"
  | "CASE_OR_EXHIBIT_PROSE"
  | "TITLE_LABEL_OR_GLOSSARY"
  | "OTHER_VISIBLE";

export type CandidateStrength = "HIGH" | "MEDIUM" | "ADVISORY";
export type SignatureFamily = "A_DIRECT_SCOPE_PROHIBITION" | "B_SCOPE_CONSTRUCTION" | "C_PROMPT_CHECKER_DIRECTIVE" | "D_CHINESE_COUNTERPART";

export type PromptProvenance = {
  signatureId: string;
  sourcePromptPath: string | null;
  sourceClause: string | null;
  sourceStatus: "active" | "portable" | "historical" | "unattributed";
  intendedRule: string;
  enforcement: "candidate-only" | "eligible-for-blocking";
};

export const AUTHORIAL_CONSTRAINT_PROVENANCE: PromptProvenance[] = [
  {
    signatureId: "imperative-do-not-independently-provider-verb",
    sourcePromptPath: "GeminiPrompt.md",
    sourceClause: "Do not imply that a nurse independently prescribes, diagnoses, performs surgery, inserts invasive provider-level devices, or changes medication orders without protocol/order support.",
    sourceStatus: "portable",
    intendedRule: "Keep provider-level prescribing, diagnosis, procedures, device insertion, and order changes outside unsupported independent nursing action.",
    enforcement: "eligible-for-blocking",
  },
  {
    signatureId: "imperative-provider-verb-independently",
    sourcePromptPath: "GeminiPrompt.md",
    sourceClause: "Do not imply that a nurse independently prescribes, diagnoses, performs surgery, inserts invasive provider-level devices, or changes medication orders without protocol/order support.",
    sourceStatus: "portable",
    intendedRule: "Keep provider-level actions outside unsupported independent nursing action.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "without-independently-provider-verb",
    sourcePromptPath: "GeminiPrompt.md",
    sourceClause: "Do not imply that a nurse independently prescribes, diagnoses, performs surgery, inserts invasive provider-level devices, or changes medication orders without protocol/order support.",
    sourceStatus: "portable",
    intendedRule: "Keep provider-level actions outside unsupported independent nursing action.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "select-only-within-nursing-scope",
    sourcePromptPath: "GeminiPrompt.md",
    sourceClause: "Do not teach unsafe scope of practice.",
    sourceStatus: "portable",
    intendedRule: "Keep keyed actions within nursing scope.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "choose-only-independent-nursing-actions",
    sourcePromptPath: "GeminiPrompt.md",
    sourceClause: "Do not key provider-only procedures as direct nursing actions unless framed as: prepare for; assist with; anticipate; obtain prescription/order; implement prescribed therapy; per protocol.",
    sourceStatus: "portable",
    intendedRule: "Frame provider-level procedures as collaboration or ordered/protocol care.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "do-not-select-provider-only-actions",
    sourcePromptPath: "GeminiPrompt.md",
    sourceClause: "Do not key provider-only procedures as direct nursing actions unless framed as: prepare for; assist with; anticipate; obtain prescription/order; implement prescribed therapy; per protocol.",
    sourceStatus: "portable",
    intendedRule: "Do not key provider-only procedures as independent nursing actions.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "do-not-assume-unstated-order-protocol",
    sourcePromptPath: "gpt-evergreen-generation-prompt.md",
    sourceClause: "When the keyed answer turns on a protocol, threshold, or facility rule, state the governing rule inside the stem or exhibit so the answer follows from stated facts, not from guideline recall that may drift.",
    sourceStatus: "active",
    intendedRule: "Make answer-bearing protocols explicit rather than relying on uncued assumptions.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "assume-no-order-protocol",
    sourcePromptPath: null,
    sourceClause: null,
    sourceStatus: "unattributed",
    intendedRule: "Possible closed-world construction disclaimer.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "private-blueprint-directive",
    sourcePromptPath: "GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md",
    sourceClause: "Do not expose the private blueprint as learner-facing chart text.",
    sourceStatus: "active",
    intendedRule: "Keep internal case-planning material off rendered case content.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "do-not-claim-validation",
    sourcePromptPath: "gpt-evergreen-generation-prompt.md",
    sourceClause: "Self-check in chat (do not claim validation — you cannot run the validator)",
    sourceStatus: "active",
    intendedRule: "Do not misrepresent producer self-checks as repository validation.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "do-not-invent-schema-fields",
    sourcePromptPath: "GeminiPrompt.md",
    sourceClause: "Do not invent schema fields.",
    sourceStatus: "portable",
    intendedRule: "Emit only supported schema fields.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "do-not-change-answer-key",
    sourcePromptPath: null,
    sourceClause: null,
    sourceStatus: "unattributed",
    intendedRule: "Possible checker mutation restriction.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "for-purposes-authoring-restriction",
    sourcePromptPath: null,
    sourceClause: null,
    sourceStatus: "unattributed",
    intendedRule: "Possible authorial restriction framed as learner context.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "learner-should-not-be-expected",
    sourcePromptPath: null,
    sourceClause: null,
    sourceStatus: "unattributed",
    intendedRule: "Possible commentary on item construction rather than clinical reasoning.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "zh-do-not-self-prescribe-insulin-dose",
    sourcePromptPath: "GeminiPrompt.md",
    sourceClause: "Do not imply that a nurse independently prescribes, diagnoses, performs surgery, inserts invasive provider-level devices, or changes medication orders without protocol/order support.",
    sourceStatus: "portable",
    intendedRule: "Chinese counterpart of the unsupported independent-prescribing guardrail.",
    enforcement: "eligible-for-blocking",
  },
  {
    signatureId: "zh-without-self-changing-prescription-measures",
    sourcePromptPath: "GeminiPrompt.md",
    sourceClause: "Do not imply that a nurse independently prescribes, diagnoses, performs surgery, inserts invasive provider-level devices, or changes medication orders without protocol/order support.",
    sourceStatus: "portable",
    intendedRule: "Chinese counterpart of the producer constraint against independently changing a prescription.",
    enforcement: "eligible-for-blocking",
  },
  {
    signatureId: "supplied-actions-ordering",
    sourcePromptPath: null,
    sourceClause: null,
    sourceStatus: "unattributed",
    intendedRule: "Observed producer-style reference to a supplied action set rather than an ordinary learner response demand.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "parallel-process-ordering-adjudication-note",
    sourcePromptPath: null,
    sourceClause: null,
    sourceStatus: "unattributed",
    intendedRule: "Observed adjudication-note shape explaining how parallel processes were forced into an ordered response.",
    enforcement: "candidate-only",
  },
  {
    signatureId: "zh-parallel-process-ordering-adjudication-note",
    sourcePromptPath: null,
    sourceClause: null,
    sourceStatus: "unattributed",
    intendedRule: "Observed Chinese counterpart of the parallel-process ordering adjudication note.",
    enforcement: "candidate-only",
  },
];

type Signature = {
  id: string;
  family: SignatureFamily;
  language: "en" | "zh";
  regex: RegExp;
  strength: CandidateStrength;
  verbGroup?: number;
};

const verbs = "prescribe|diagnose|order|change|adjust|titrate|insert|perform";
const verbOrGerund = "prescribe|prescribing|diagnose|diagnosing|order|ordering|change|changing|adjust|adjusting|titrate|titrating|insert|inserting|perform|performing";
const SIGNATURES: Signature[] = [
  { id: "imperative-do-not-independently-provider-verb", family: "A_DIRECT_SCOPE_PROHIBITION", language: "en", regex: new RegExp(`\\bDo not independently\\s+(${verbs})\\b`, "giu"), strength: "HIGH", verbGroup: 1 },
  { id: "imperative-provider-verb-independently", family: "A_DIRECT_SCOPE_PROHIBITION", language: "en", regex: new RegExp(`\\bDo not\\s+(${verbs})\\b[^.!?。！？]{0,100}\\bindependently\\b`, "giu"), strength: "MEDIUM", verbGroup: 1 },
  { id: "without-independently-provider-verb", family: "A_DIRECT_SCOPE_PROHIBITION", language: "en", regex: new RegExp(`\\bWithout independently\\s+(${verbOrGerund})\\b`, "giu"), strength: "MEDIUM", verbGroup: 1 },
  { id: "select-only-within-nursing-scope", family: "B_SCOPE_CONSTRUCTION", language: "en", regex: /\bSelect only actions within (?:the )?nursing scope\b/giu, strength: "MEDIUM" },
  { id: "choose-only-independent-nursing-actions", family: "B_SCOPE_CONSTRUCTION", language: "en", regex: /\bChoose only actions (?:that )?the nurse may perform independently\b/giu, strength: "MEDIUM" },
  { id: "do-not-select-provider-only-actions", family: "B_SCOPE_CONSTRUCTION", language: "en", regex: /\bDo not select provider[- ]only actions\b/giu, strength: "MEDIUM" },
  { id: "do-not-assume-unstated-order-protocol", family: "B_SCOPE_CONSTRUCTION", language: "en", regex: /\bDo not assume (?:an? )?(?:provider )?(?:order|protocol)(?: that is)? not stated\b/giu, strength: "MEDIUM" },
  { id: "assume-no-order-protocol", family: "B_SCOPE_CONSTRUCTION", language: "en", regex: /\bAssume no (?:standing )?(?:order|protocol)\b/giu, strength: "ADVISORY" },
  { id: "private-blueprint-directive", family: "C_PROMPT_CHECKER_DIRECTIVE", language: "en", regex: /\bdo not expose the private blueprint\b/giu, strength: "HIGH" },
  { id: "do-not-claim-validation", family: "C_PROMPT_CHECKER_DIRECTIVE", language: "en", regex: /\bdo not claim validation\b/giu, strength: "HIGH" },
  { id: "do-not-invent-schema-fields", family: "C_PROMPT_CHECKER_DIRECTIVE", language: "en", regex: /\bdo not invent schema fields\b/giu, strength: "HIGH" },
  { id: "do-not-change-answer-key", family: "C_PROMPT_CHECKER_DIRECTIVE", language: "en", regex: /\bdo not change the answer key\b/giu, strength: "HIGH" },
  { id: "for-purposes-authoring-restriction", family: "C_PROMPT_CHECKER_DIRECTIVE", language: "en", regex: /\bfor (?:the )?purposes of this question\b[^.!?。！？]{0,180}\b(?:do not|must not|should not)\b/giu, strength: "ADVISORY" },
  { id: "learner-should-not-be-expected", family: "C_PROMPT_CHECKER_DIRECTIVE", language: "en", regex: /\bthe learner should not be expected to\b/giu, strength: "ADVISORY" },
  { id: "zh-do-not-self-prescribe-insulin-dose", family: "D_CHINESE_COUNTERPART", language: "zh", regex: /不要自行开立胰岛素剂量/gu, strength: "HIGH" },
  { id: "zh-without-self-changing-prescription-measures", family: "D_CHINESE_COUNTERPART", language: "zh", regex: /但不由患者或护士自行更改处方的措施/gu, strength: "HIGH" },
  { id: "supplied-actions-ordering", family: "C_PROMPT_CHECKER_DIRECTIVE", language: "en", regex: /\bPlace the supplied actions in order\b/giu, strength: "ADVISORY" },
  { id: "parallel-process-ordering-adjudication-note", family: "C_PROMPT_CHECKER_DIRECTIVE", language: "en", regex: /\bSource-patient testing and exposed-worker testing are separate processes; do not delay indicated PEP for a source result\b/giu, strength: "ADVISORY" },
  { id: "zh-parallel-process-ordering-adjudication-note", family: "D_CHINESE_COUNTERPART", language: "zh", regex: /来源患者检测和暴露工作人员检测是两个独立过程；不得因等待来源结果而延迟已指征的 PEP/gu, strength: "ADVISORY" },
];

const provenanceById = new Map(AUTHORIAL_CONSTRAINT_PROVENANCE.map((entry) => [entry.signatureId, entry]));

export type AuthorialConstraintCandidate = {
  bankPath: string;
  topLevelQuestionId: string;
  embeddedQuestionId: string | null;
  itemType: string;
  jsonPath: string;
  surfaceClass: SurfaceClass;
  language: "en" | "zh" | "undetermined";
  fullFieldText: string;
  sentenceText: string;
  matchStart: number;
  matchEnd: number;
  sentenceStart: number;
  sentenceEnd: number;
  signatureId: string;
  signatureFamily: SignatureFamily;
  matchedVerb: string | null;
  promptSourcePath: string | null;
  promptSourceClause: string | null;
  promptSourceStatus: PromptProvenance["sourceStatus"];
  candidateStrength: CandidateStrength;
  blockingEligible: boolean;
  pairedPath: string | null;
  notes: string;
};

export function classifySurface(path: string): SurfaceClass {
  if (/(^|\.)(stem|clozeStem)\.(en|zh)$/.test(path) || /(^|\.)(instruction|selectionInstruction)\.(en|zh)$/.test(path)) return "TASK_STEM_OR_INSTRUCTION";
  if (/(^|\.)testTakingStrategy\.(en|zh)$/.test(path)) return "TEST_TAKING_STRATEGY";
  if (/(^|\.)rationale\./.test(path)) return "RATIONALE";
  if (/(^|\.)(options|tokens|choices|rows|columns|segments|dropdowns|blanks)\[/.test(path)) return "OPTION_OR_RESPONSE_TOKEN";
  if (/(^|\.)caseStudy\.(exhibits|stages)\[/.test(path)) return "CASE_OR_EXHIBIT_PROSE";
  if (/(^|\.)(title|prompt|caption|glossary)\b/.test(path) || /(^|\.)(termEn|termZh|defZh)$/.test(path)) return "TITLE_LABEL_OR_GLOSSARY";
  return "OTHER_VISIBLE";
}

function sentenceBounds(text: string, start: number, end: number): { start: number; end: number; text: string } {
  const left = Math.max(text.lastIndexOf(".", start - 1), text.lastIndexOf("!", start - 1), text.lastIndexOf("?", start - 1), text.lastIndexOf("。", start - 1), text.lastIndexOf("！", start - 1), text.lastIndexOf("？", start - 1), text.lastIndexOf("\n", start - 1));
  const tails = [".", "!", "?", "。", "！", "？", "\n"].map((mark) => text.indexOf(mark, end)).filter((index) => index >= 0);
  const rawStart = left + 1;
  const rawEnd = tails.length ? Math.min(...tails) + 1 : text.length;
  const leading = text.slice(rawStart, rawEnd).match(/^\s*/u)?.[0].length ?? 0;
  const trailing = text.slice(rawStart + leading, rawEnd).match(/\s*$/u)?.[0].length ?? 0;
  const sentenceStart = rawStart + leading;
  const sentenceEnd = rawEnd - trailing;
  return { start: sentenceStart, end: sentenceEnd, text: text.slice(sentenceStart, sentenceEnd) };
}

function pairedPathFor(field: LearnerFacingField, allFields: LearnerFacingField[]): string | null {
  const counterpart = field.path.endsWith(".en") ? `${field.path.slice(0, -3)}.zh` : field.path.endsWith(".zh") ? `${field.path.slice(0, -3)}.en` : null;
  if (!counterpart) return null;
  return allFields.some((candidate) => candidate.path === counterpart && candidate.embeddedQuestionId === field.embeddedQuestionId) ? counterpart : null;
}

export function isBlockingCandidate(candidate: Pick<AuthorialConstraintCandidate, "signatureId" | "surfaceClass">): boolean {
  return (candidate.surfaceClass === "TASK_STEM_OR_INSTRUCTION" || candidate.surfaceClass === "TEST_TAKING_STRATEGY") &&
    (candidate.signatureId === "imperative-do-not-independently-provider-verb" || candidate.signatureId === "without-independently-provider-verb" || candidate.signatureId === "zh-do-not-self-prescribe-insulin-dose" || candidate.signatureId === "zh-without-self-changing-prescription-measures");
}

export function scanQuestionForAuthorialConstraints(question: Question, bankPath: string): AuthorialConstraintCandidate[] {
  const fields = collectLearnerFacingFields(question);
  const candidates: AuthorialConstraintCandidate[] = [];
  for (const field of fields) {
    for (const signature of SIGNATURES) {
      if (field.language !== signature.language) continue;
      const regex = new RegExp(signature.regex.source, signature.regex.flags);
      for (const match of field.text.matchAll(regex)) {
        const matchStart = match.index ?? 0;
        const matchEnd = matchStart + match[0].length;
        const sentence = sentenceBounds(field.text, matchStart, matchEnd);
        const provenance = provenanceById.get(signature.id);
        const surfaceClass = classifySurface(field.path);
        const partial = { signatureId: signature.id, surfaceClass };
        candidates.push({
          bankPath,
          topLevelQuestionId: field.topLevelId,
          embeddedQuestionId: field.embeddedQuestionId ?? null,
          itemType: field.itemType,
          jsonPath: field.path,
          surfaceClass,
          language: field.language,
          fullFieldText: field.text,
          sentenceText: sentence.text,
          matchStart,
          matchEnd,
          sentenceStart: sentence.start,
          sentenceEnd: sentence.end,
          signatureId: signature.id,
          signatureFamily: signature.family,
          matchedVerb: signature.verbGroup ? normalizeProviderVerb(match[signature.verbGroup]?.toLowerCase()) : null,
          promptSourcePath: provenance?.sourcePromptPath ?? null,
          promptSourceClause: provenance?.sourceClause ?? null,
          promptSourceStatus: provenance?.sourceStatus ?? "unattributed",
          candidateStrength: signature.strength,
          blockingEligible: isBlockingCandidate(partial),
          pairedPath: pairedPathFor(field, fields),
          notes: provenance?.sourcePromptPath ? "candidate only until adjudicated" : "UNATTRIBUTED_CONSTRAINT_SHAPE; candidate only until adjudicated",
        });
      }
    }
  }
  return sortAuthorialConstraintCandidates(candidates);
}

function normalizeProviderVerb(value: string | undefined): string | null {
  if (!value) return null;
  const gerunds: Record<string, string> = {
    prescribing: "prescribe", diagnosing: "diagnose", ordering: "order", changing: "change",
    adjusting: "adjust", titrating: "titrate", inserting: "insert", performing: "perform",
  };
  return gerunds[value] ?? value;
}

export function sortAuthorialConstraintCandidates(candidates: AuthorialConstraintCandidate[]): AuthorialConstraintCandidate[] {
  return [...candidates].sort((a, b) =>
    a.bankPath.localeCompare(b.bankPath) ||
    a.topLevelQuestionId.localeCompare(b.topLevelQuestionId) ||
    (a.embeddedQuestionId ?? "").localeCompare(b.embeddedQuestionId ?? "") ||
    a.jsonPath.localeCompare(b.jsonPath) ||
    a.sentenceStart - b.sentenceStart ||
    a.matchStart - b.matchStart ||
    a.signatureId.localeCompare(b.signatureId));
}

export type AuthorialConstraintBankScan = { banksScanned: number; topLevelQuestionsScanned: number; scoredLeavesScanned: number; candidates: AuthorialConstraintCandidate[] };

export async function scanBundledAuthorialConstraints(directory = "banks"): Promise<AuthorialConstraintBankScan> {
  const files = (await readdir(directory)).filter((file) => file.endsWith(".json")).sort();
  const candidates: AuthorialConstraintCandidate[] = [];
  let topLevelQuestionsScanned = 0;
  let scoredLeavesScanned = 0;
  for (const file of files) {
    const raw = parseBankText(await readFile(join(directory, file), "utf8"));
    const validated = validateBankObject(raw, { rejectUnknownKeys: true, requireMeta: true });
    if (!validated.ok) throw new Error(`${file}: ${validated.reasons.join("; ")}`);
    topLevelQuestionsScanned += validated.value.questions.length;
    for (const question of validated.value.questions) {
      scoredLeavesScanned += question.itemType === "case_study" ? question.caseStudy.questions.length : 1;
      candidates.push(...scanQuestionForAuthorialConstraints(question, join(directory, basename(file))));
    }
  }
  return { banksScanned: files.length, topLevelQuestionsScanned, scoredLeavesScanned, candidates: sortAuthorialConstraintCandidates(candidates) };
}
