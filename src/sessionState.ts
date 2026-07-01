import type { AnswerState } from "./grading";
import type {
  AdaptiveSessionSnapshot,
  ItemScore,
  LanguageMode,
  Question,
  SessionMode,
  SessionPhase,
} from "./types";

export type SessionState = {
  id: string;
  mode: SessionMode;
  questions: Question[];
  poolIds: string[];
  index: number;
  answers: Record<string, AnswerState>;
  results: Record<string, boolean>;
  scores: Record<string, ItemScore>;
  skippedQuestionIds: string[];
  phase: SessionPhase;
  languageMode: LanguageMode;
  title: string;
  startedAt: string;
  completed?: boolean;
  adaptive?: AdaptiveSessionSnapshot;
};

export type BuildSessionStateParams = {
  id: string;
  mode: SessionMode;
  questions: Question[];
  poolIds: string[];
  languageMode: LanguageMode;
  title: string;
  startedAt: string;
  adaptive?: AdaptiveSessionSnapshot;
};

export const buildSessionState = ({
  id,
  mode,
  questions,
  poolIds,
  languageMode,
  title,
  startedAt,
  adaptive,
}: BuildSessionStateParams): SessionState => ({
  id,
  mode,
  questions,
  poolIds,
  index: 0,
  answers: {},
  results: {},
  scores: {},
  skippedQuestionIds: [],
  phase: "questions",
  languageMode,
  title,
  startedAt,
  ...(adaptive ? { adaptive } : {}),
});
