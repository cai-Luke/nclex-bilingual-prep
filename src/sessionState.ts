import { questionFingerprint } from "./completedMemory";
import type { AnswerState } from "./grading";
import type {
  AdaptiveSessionSnapshot,
  LaunchIntent,
  SessionReturnView,
  SubmittedAttempt,
  StoredSessionSnapshot,
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
  launchIntent: LaunchIntent;
  returnView: SessionReturnView;
  requestedCount: number;
  fingerprints: Record<string, string>;
  attempts: Record<string, SubmittedAttempt>;
  recovery?: string[];
  retainedSnapshot?: StoredSessionSnapshot;
  adaptive?: AdaptiveSessionSnapshot;
};

export type BuildSessionStateParams = {
  launchIntent?: LaunchIntent;
  returnView?: SessionReturnView;
  requestedCount?: number;
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
  launchIntent = "remediation",
  returnView = "home",
  requestedCount = questions.length,
}: BuildSessionStateParams): SessionState => ({
  id,
  mode,
  questions,
  poolIds,
  launchIntent,
  returnView,
  requestedCount,
  attempts: {},
  fingerprints: Object.fromEntries(questions.map((q) => [q.id, questionFingerprint(q)])),
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
