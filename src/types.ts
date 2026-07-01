export type TextPair = {
  en: string;
  zh: string;
};

export type SchemaVersion = "1.0" | "1.1" | "1.2" | "1.3" | "1.4" | "1.5" | "1.6" | "1.7";

export type StandaloneItemType =
  | "multiple_choice"
  | "select_all"
  | "ordered_response"
  | "fill_in_blank"
  | "matrix"
  | "dropdown_cloze"
  | "highlight"
  | "bowtie";

export type ItemType = StandaloneItemType | "case_study";

export type Difficulty = "easy" | "medium" | "hard";

export type Category =
  | "Management of Care"
  | "Safety and Infection Control"
  | "Health Promotion and Maintenance"
  | "Psychosocial Integrity"
  | "Basic Care and Comfort"
  | "Pharmacological and Parenteral Therapies"
  | "Reduction of Risk Potential"
  | "Physiological Adaptation";

export type NgnSkill =
  | "recognize_cues"
  | "analyze_cues"
  | "prioritize_hypotheses"
  | "generate_solutions"
  | "take_action"
  | "evaluate_outcomes";

export type GlossaryTerm = {
  termEn: string;
  termZh: string;
  defZh: string;
};

export type RationaleChoice = {
  refId: string;
  en: string;
  zh: string;
};

export type Rationale = {
  correct: TextPair;
  byChoice?: RationaleChoice[];
  visuals?: QuestionVisual[];
};

// Visual types now live with their kind module (see src/visuals/). Re-exported
// here so existing importers keep working; the union is assembled in
// src/visuals/types.ts (the single append-only touch-point for new kinds).
export type { QuestionVisual } from "./visuals/types";
export type { RhythmClass, RhythmStripVisual } from "./visuals/kinds/rhythmStrip";

import type { QuestionVisual } from "./visuals/types";

export type CommonQuestion = {
  id: string;
  itemType: ItemType;
  category: Category;
  topic: string;
  difficulty: Difficulty;
  ngnSkill?: NgnSkill;
  stem: TextPair;
  rationale: Rationale;
  testTakingStrategy: TextPair;
  glossary: GlossaryTerm[];
  visual?: QuestionVisual;
};

export type Option = {
  id: string;
  en: string;
  zh: string;
};

export type OptionQuestion = CommonQuestion & {
  itemType: "multiple_choice" | "select_all" | "ordered_response";
  options: Option[];
  correct: string[];
};

export type MultipleChoiceQuestion = OptionQuestion & {
  itemType: "multiple_choice";
};

export type SelectAllQuestion = OptionQuestion & {
  itemType: "select_all";
};

export type OrderedResponseQuestion = OptionQuestion & {
  itemType: "ordered_response";
};

export type FillInBlankQuestion = CommonQuestion & {
  itemType: "fill_in_blank";
  blanks: Array<{
    id: string;
    prompt: TextPair;
    acceptable?: string[];
    numeric?: {
      value: number;
      tolerance: number;
      unit?: string;
    };
  }>;
};

export type MatrixQuestion = CommonQuestion & {
  itemType: "matrix";
  matrix: {
    rows: Option[];
    columns: Option[];
    selectionMode: "single_per_row" | "multiple_per_row";
  };
  correct: Array<{
    rowId: string;
    columnIds: string[];
  }>;
};

export type DropdownClozeQuestion = CommonQuestion & {
  itemType: "dropdown_cloze";
  clozeStem: TextPair;
  dropdowns: Array<{
    id: string;
    options: Option[];
    correct: string;
  }>;
};

export type HighlightSegment = {
  id: string;
  en: string;
  zh: string;
  selectable?: boolean;
};

export type HighlightQuestion = CommonQuestion & {
  itemType: "highlight";
  highlight: {
    segments: HighlightSegment[];
    correct: string[];
  };
};

export type BowtieToken = {
  id: string;
  en: string;
  zh: string;
};

export type BowtieZone<C> = {
  prompt?: TextPair;
  tokens: BowtieToken[];
  correct: C;
};

export type BowtieQuestion = CommonQuestion & {
  itemType: "bowtie";
  bowtie: {
    condition: BowtieZone<string>;
    actions: BowtieZone<string[]>;
    parameters: BowtieZone<string[]>;
  };
};

export type StandaloneQuestion =
  | MultipleChoiceQuestion
  | SelectAllQuestion
  | OrderedResponseQuestion
  | FillInBlankQuestion
  | MatrixQuestion
  | DropdownClozeQuestion
  | HighlightQuestion
  | BowtieQuestion;

export type CaseStudyExhibit = {
  id: string;
  type?: string;
  title: TextPair;
  content: TextPair;
  visual?: QuestionVisual;
};

export type CaseStudyStage = {
  id: string;
  title: TextPair;
  trigger?: TextPair;
  narrative?: TextPair;
  timeOffset?: string;
  exhibits: CaseStudyExhibit[];
};

export type CaseSubQuestion = StandaloneQuestion & {
  stageId?: string;
  answerableAfterStageId?: string;
};

export type CaseStudyQuestion = CommonQuestion & {
  itemType: "case_study";
  caseStudy: {
    title: TextPair;
    summary?: TextPair;
    exhibits: CaseStudyExhibit[];
    stages?: CaseStudyStage[];
    questions: CaseSubQuestion[];
  };
};

export type Question = StandaloneQuestion | CaseStudyQuestion;

export type BankEnvelope = {
  meta?: {
    schemaVersion: SchemaVersion;
    exam?: "NCLEX-RN";
    topic?: string;
    category?: Category | "mixed";
    difficulty?: Difficulty | "mixed";
    count?: number;
  };
  questions: Question[];
};

export type SourceKind = "bundled" | "uploaded";

export type QuestionRecord = {
  question: Question;
  sourceKind: SourceKind;
  sourceLabel: string;
  importedAt?: string;
  originalId?: string;
};

export type QuestionProgress = {
  questionId: string;
  seen: number;
  correct: number;
  incorrect: number;
  correctStreak: number;
  missed: boolean;
  lastSeenAt?: string;
  srsDueAt?: string;
  srsIntervalDays?: number;
  srsEase?: number;
  srsLapses?: number;
};

export type ItemScore = {
  earned: number;
  possible: number;
};

export type LanguageMode = "off" | "on-tap" | "always";
export type StudyMode = "study" | "test";
export type ThemeMode = "light" | "dark";
export type TextSizeMode = "compact" | "default" | "large";
export type SessionMode = StudyMode | "adaptive";
export type SessionOrder = "random" | "sequential";
export type SessionStatusFilter = "all" | "unseen" | "answered" | "incorrect" | "flagged" | "due";
export type SessionPhase = "questions" | "skipped-prompt" | "skipped-review";

export type Settings = {
  languageMode: LanguageMode;
  defaultMode: StudyMode;
  voiceEnabled: boolean;
  themeMode: ThemeMode;
  textSizeMode: TextSizeMode;
};

export type AdaptiveSessionSnapshot = {
  targetCount: number;
  currentDifficulty: Difficulty;
  rollingResults: boolean[];
  difficultyHistory: Array<{
    questionId: string;
    difficulty: Difficulty;
    correct?: boolean;
  }>;
};

export type StoredSessionSnapshot = {
  id: string;
  mode: SessionMode;
  questionIds: string[];
  poolIds: string[];
  index: number;
  answers: Record<string, unknown>;
  results: Record<string, boolean>;
  scores?: Record<string, ItemScore>;
  skippedQuestionIds?: string[];
  phase?: SessionPhase;
  languageMode: LanguageMode;
  title: string;
  startedAt: string;
  updatedAt: string;
  adaptive?: AdaptiveSessionSnapshot;
};

export type QuestionFlag = {
  questionId: string;
  flagged: boolean;
  note?: string;
  updatedAt: string;
};

export type LanguageMiss = {
  questionId: string;
  markedAt: string;
};

export type AnswerEvent = {
  id: string;
  questionId: string;
  wasCorrect: boolean;
  answeredAt: string;
  sessionId?: string;
  sessionMode?: SessionMode;
  languageModeAtAnswer?: LanguageMode;
};

export type CaseAnswerPartEvent = {
  id: string;
  questionId: string;
  partId: string;
  wasCorrect: boolean;
  sessionId: string;
  sessionMode: SessionMode;
  languageModeAtAnswer: LanguageMode;
  answeredAt: string;
};

export type RevealBlock =
  | "stem"
  | "choices"
  | "exhibit"
  | "case_stage"
  | "rationale"
  | "glossary"
  | "other";

export type TranslationRevealEvent = {
  id: string;
  sessionId: string;
  questionId: string;
  partId?: string;
  block: RevealBlock;
  itemType: ItemType;
  category: Category;
  topic: string;
  revealedAt: string;
  elapsedMsOnQuestion: number;
  answeredBeforeReveal: boolean;
  submittedBeforeReveal: boolean;
  revealCountForQuestion: number;
};

export type FlashcardProgress = {
  termId: string;
  seen: number;
  correct: number;
  incorrect: number;
  correctStreak: number;
  lastSeenAt?: string;
  srsDueAt?: string;
  srsIntervalDays?: number;
  srsEase?: number;
  srsLapses?: number;
};

export type ImportSummary = {
  imported: number;
  total: number;
  skipped: Array<{ index: number; id?: string; reasons: string[] }>;
  regeneratedIds: Array<{ from: string; to: string }>;
};
