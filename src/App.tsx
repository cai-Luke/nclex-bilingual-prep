import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  AudioLines,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileJson,
  Flag,
  FlaskConical,
  Home,
  Import,
  Library,
  ListChecks,
  Image,
  MoveDown,
  MoveUp,
  Play,
  Search,
  RotateCcw,
  Settings as SettingsIcon,
  SlidersHorizontal,
  Volume2,
  Wrench,
  XCircle,
} from "lucide-react";
import { loadBundledRecords } from "./banks";
import { importQuestionsFromText, toExportEnvelope } from "./bankImport";
import {
  type AnswerState,
  getAnswerCompleteness,
  getCorrectAnswer,
  getInitialAnswer,
  gradeQuestion,
  scoreQuestion,
} from "./grading";
import {
  buildQuestionReviewIndex,
  lookupQuestionIds,
  parseQuestionIds,
  parseSweepManifest,
  sortSweepRows,
  type SweepManifestRow,
} from "./devReview";
import {
  clearActiveSession,
  isDueForReview,
  loadActiveSession,
  loadAnswerEvents,
  loadFlags,
  loadFlashcardProgress,
  loadProgress,
  loadSettings,
  loadUploadedRecords,
  recordFlashcardReview,
  recordAnswer,
  saveActiveSession,
  saveSettings,
  saveQuestionFlag,
  saveUploadedRecords,
} from "./storage";
import { categories, difficulties } from "./schema";
import {
  findFirstSkippedQuestionIndex,
  findNextPendingQuestionIndex,
  findNextSkippedQuestionIndex,
} from "./sessionNavigation";
import { buildWeightedSession } from "./sessionSampler";
import { VisualStimulus } from "./visuals";
import { mulberry32 } from "./visuals/primitives/prng";
import type {
  AdaptiveSessionSnapshot,
  AnswerEvent,
  CaseStudyExhibit,
  Difficulty,
  FlashcardProgress,
  GlossaryTerm,
  ImportSummary,
  ItemScore,
  LanguageMode,
  Option,
  OptionQuestion,
  Question,
  QuestionFlag,
  QuestionProgress,
  QuestionRecord,
  SessionMode,
  SessionOrder,
  SessionPhase,
  SessionStatusFilter,
  Settings,
  StudyMode,
  StoredSessionSnapshot,
} from "./types";

type View =
  | "home"
  | "builder"
  | "dashboard"
  | "flashcards"
  | "library"
  | "import"
  | "settings"
  | "review"
  | "session"
  | "summary";

type SessionState = {
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

type Filters = {
  category: string;
  topic: string;
  difficulty: string;
  source: string;
};

const blankFilters: Filters = {
  category: "all",
  topic: "all",
  difficulty: "all",
  source: "all",
};

type BuilderFilters = {
  categories: string[];
  status: SessionStatusFilter;
  mode: SessionMode;
  withVisuals: boolean;
};

const blankBuilderFilters: BuilderFilters = {
  categories: [],
  status: "all",
  mode: "study",
  withVisuals: false,
};

type FlashcardTerm = GlossaryTerm & {
  id: string;
  categories: string[];
  topics: string[];
  questionIds: string[];
};

const DEFAULT_SESSION_COUNT = 50;
const DEV_TOOLS_KEY = "shrimpDevTools";

const readDevStartup = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const requestedIds = parseQuestionIds(params.get("qids") ?? params.get("qid") ?? "");
    const queryEnabled = params.get("dev") === "1";
    const storedEnabled = window.localStorage.getItem(DEV_TOOLS_KEY) === "true";
    if (queryEnabled) window.localStorage.setItem(DEV_TOOLS_KEY, "true");
    return {
      enabled: queryEnabled || storedEnabled,
      requestedIds,
      openConsole: queryEnabled || (storedEnabled && requestedIds.length > 0),
    };
  } catch {
    return { enabled: false, requestedIds: [], openConsole: false };
  }
};

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

export default function App() {
  const devStartup = useMemo(readDevStartup, []);
  const bundled = useMemo(() => loadBundledRecords(), []);
  const [uploadedRecords, setUploadedRecords] = useState<QuestionRecord[]>([]);
  const [uploadedLoaded, setUploadedLoaded] = useState(false);
  const [progress, setProgress] = useState<Record<string, QuestionProgress>>({});
  const [flags, setFlags] = useState<Record<string, QuestionFlag>>({});
  const [answerEvents, setAnswerEvents] = useState<AnswerEvent[]>([]);
  const [flashcardProgress, setFlashcardProgress] = useState<Record<string, FlashcardProgress>>({});
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [view, setView] = useState<View>(devStartup.openConsole ? "review" : "home");
  const [session, setSession] = useState<SessionState | null>(null);
  const [sessionReturnView, setSessionReturnView] = useState<View>("home");
  const [filters, setFilters] = useState<Filters>(blankFilters);
  const [builderFilters, setBuilderFilters] = useState<BuilderFilters>(blankBuilderFilters);
  const [sessionHydrated, setSessionHydrated] = useState(false);

  useEffect(() => {
    void Promise.all([loadUploadedRecords(), loadProgress(), loadFlags(), loadAnswerEvents(), loadFlashcardProgress()]).then(
      ([nextUploadedRecords, nextProgress, nextFlags, nextAnswerEvents, nextFlashcardProgress]) => {
        setUploadedRecords(nextUploadedRecords);
        setProgress(nextProgress);
        setFlags(nextFlags);
        setAnswerEvents(nextAnswerEvents);
        setFlashcardProgress(nextFlashcardProgress);
        setUploadedLoaded(true);
      },
    );
  }, []);

  const allRecords = useMemo(() => [...bundled.records, ...uploadedRecords], [bundled.records, uploadedRecords]);
  const recordsById = useMemo(
    () => new Map(allRecords.map((record) => [record.question.id, record] as const)),
    [allRecords],
  );
  const filteredRecords = useMemo(() => applyFilters(allRecords, filters), [allRecords, filters]);
  const builderRecords = useMemo(
    () => applyBuilderFilters(allRecords, builderFilters, progress, flags),
    [allRecords, builderFilters, progress, flags],
  );
  const missedRecords = useMemo(
    () => allRecords.filter((record) => progress[record.question.id]?.missed),
    [progress, allRecords],
  );
  const answeredRecords = useMemo(
    () => allRecords.filter((record) => (progress[record.question.id]?.seen ?? 0) > 0),
    [progress, allRecords],
  );
  const dueRecords = useMemo(
    () => allRecords.filter((record) => isDueForReview(progress[record.question.id])),
    [progress, allRecords],
  );
  const flaggedRecords = useMemo(
    () => allRecords.filter((record) => flags[record.question.id]?.flagged),
    [flags, allRecords],
  );
  const flashcardDeck = useMemo(() => buildFlashcardDeck(allRecords), [allRecords]);

  useEffect(() => {
    if (!uploadedLoaded || sessionHydrated) return;
    void loadActiveSession().then((snapshot) => {
      if (snapshot) {
        const hydrated = hydrateSession(snapshot, recordsById);
        if (hydrated) {
          setSession(hydrated);
        } else {
          void clearActiveSession();
        }
      }
      setSessionHydrated(true);
    });
  }, [recordsById, sessionHydrated, uploadedLoaded]);

  useEffect(() => {
    if (!sessionHydrated || !session) return;
    if (session.completed) {
      void clearActiveSession();
      return;
    }
    void saveActiveSession(toStoredSession(session));
  }, [session, sessionHydrated]);

  const updateSettings = (next: Settings) => {
    setSettings(next);
    saveSettings(next);
  };

  const startSession = (
    records: QuestionRecord[],
    mode: SessionMode,
    title: string,
    options: { count?: number; order?: SessionOrder; returnView?: View; weighting?: "nclex" } = {},
  ) => {
    if (records.length === 0) return;
    setSessionReturnView(options.returnView ?? "home");
    if (mode === "adaptive") {
      startAdaptiveSession(records, title, Math.max(1, options.count ?? 75));
      return;
    }
    let orderedRecords: QuestionRecord[];
    const requestedCount = Math.max(1, Math.min(options.count ?? records.length, records.length));
    if (options.order === "sequential") {
      orderedRecords = [...records];
    } else if (options.weighting === "nclex") {
      const seed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
      orderedRecords = buildWeightedSession(records, requestedCount, progress, mulberry32(seed), {
        now: new Date(),
      });
    } else {
      const unseen = shuffle(records.filter((r) => (progress[r.question.id]?.seen ?? 0) === 0));
      const seen = shuffle(records.filter((r) => (progress[r.question.id]?.seen ?? 0) > 0));
      orderedRecords = [...unseen, ...seen];
    }
    const selectedRecords = orderedRecords.slice(0, requestedCount);
    setSession({
      id: createSessionId(),
      mode,
      questions: selectedRecords.map((record) => record.question),
      poolIds: selectedRecords.map((record) => record.question.id),
      index: 0,
      answers: {},
      results: {},
      scores: {},
      skippedQuestionIds: [],
      phase: "questions",
      languageMode: mode === "test" ? "off" : settings.languageMode,
      title,
      startedAt: new Date().toISOString(),
    });
    setView("session");
  };

  const startAdaptiveSession = (records: QuestionRecord[], title: string, requestedCount: number) => {
    const selectedRecords = shuffle(records);
    const firstRecord = selectRecordForDifficulty(selectedRecords, "medium");
    if (!firstRecord) return;
    const targetCount = Math.max(1, Math.min(requestedCount, selectedRecords.length));
    setSession({
      id: createSessionId(),
      mode: "adaptive",
      questions: [firstRecord.question],
      poolIds: selectedRecords.map((record) => record.question.id),
      index: 0,
      answers: {},
      results: {},
      scores: {},
      skippedQuestionIds: [],
      phase: "questions",
      languageMode: "off",
      title,
      startedAt: new Date().toISOString(),
      adaptive: {
        targetCount,
        currentDifficulty: "medium",
        rollingResults: [],
        difficultyHistory: [{ questionId: firstRecord.question.id, difficulty: firstRecord.question.difficulty }],
      },
    });
    setView("session");
  };

  const finishSession = () => {
    void clearActiveSession();
    setSession((current) => (current ? { ...current, completed: true } : current));
    setView("summary");
  };

  const updateAnswer = (questionId: string, answer: AnswerState) => {
    setSession((current) => {
      if (!current) return current;
      return { ...current, answers: { ...current.answers, [questionId]: answer } };
    });
  };

  const submitCurrent = async () => {
    if (!session) return;
    const question = session.questions[session.index];
    if (Object.prototype.hasOwnProperty.call(session.results, question.id)) return;
    const answer = session.answers[question.id] ?? getInitialAnswer(question);
    const score = scoreQuestion(question, answer);
    const wasCorrect = gradeQuestion(question, answer);
    const nextProgress = await recordAnswer(question.id, wasCorrect);
    setProgress((current) => ({ ...current, [question.id]: nextProgress }));
    setAnswerEvents(await loadAnswerEvents());
    setSession((current) => {
      if (!current) return current;
      if (Object.prototype.hasOwnProperty.call(current.results, question.id)) return current;
      return {
        ...current,
        results: { ...current.results, [question.id]: wasCorrect },
        scores: { ...current.scores, [question.id]: score },
        skippedQuestionIds: current.skippedQuestionIds.filter((questionId) => questionId !== question.id),
        adaptive: current.adaptive ? updateAdaptiveAfterAnswer(current.adaptive, question, wasCorrect) : undefined,
      };
    });
  };

  const skipCurrent = () => {
    setSession((current) => {
      if (!current || current.mode !== "study" || current.phase === "skipped-prompt") return current;
      const question = current.questions[current.index];
      if (Object.prototype.hasOwnProperty.call(current.results, question.id)) return current;
      const skippedQuestionIds = Array.from(new Set([...current.skippedQuestionIds, question.id]));
      if (current.phase === "skipped-review") {
        const nextSkippedIndex = findNextSkippedQuestionIndex(
          current.questions.map((item) => item.id),
          current.index,
          new Set(skippedQuestionIds),
        );
        return nextSkippedIndex >= 0
          ? { ...current, index: nextSkippedIndex, skippedQuestionIds }
          : { ...current, skippedQuestionIds, phase: "skipped-prompt" };
      }
      const nextIndex = findNextPendingQuestionIndex(
        current.questions.map((item) => item.id),
        current.index,
        new Set(Object.keys(current.results)),
        new Set(skippedQuestionIds),
      );
      if (nextIndex >= 0) {
        return { ...current, index: nextIndex, skippedQuestionIds };
      }
      return { ...current, skippedQuestionIds, phase: "skipped-prompt" };
    });
  };

  const reviewSkippedQuestions = () => {
    setSession((current) => {
      if (!current || current.mode !== "study") return current;
      const index = findFirstSkippedQuestionIndex(
        current.questions.map((question) => question.id),
        new Set(current.skippedQuestionIds),
      );
      return index >= 0 ? { ...current, index, phase: "skipped-review" } : current;
    });
  };

  const goNext = () => {
    setSession((current) => {
      if (!current) return current;
      if (current.mode === "adaptive" && current.adaptive) {
        if (current.index < current.questions.length - 1) return { ...current, index: current.index + 1 };
        if (current.questions.length >= current.adaptive.targetCount) {
          void clearActiveSession();
          setView("summary");
          return { ...current, completed: true };
        }
        const nextRecord = selectNextAdaptiveRecord(current, recordsById);
        if (!nextRecord) {
          void clearActiveSession();
          setView("summary");
          return { ...current, completed: true };
        }
        return {
          ...current,
          questions: [...current.questions, nextRecord.question],
          index: current.index + 1,
          adaptive: {
            ...current.adaptive,
            difficultyHistory: [
              ...current.adaptive.difficultyHistory,
              { questionId: nextRecord.question.id, difficulty: nextRecord.question.difficulty },
            ],
          },
        };
      }
      if (current.mode === "study") {
        if (current.phase === "skipped-review") {
          const nextSkippedIndex = findFirstSkippedQuestionIndex(
            current.questions.map((question) => question.id),
            new Set(current.skippedQuestionIds),
          );
          if (nextSkippedIndex >= 0) return { ...current, index: nextSkippedIndex };
        } else {
          const nextIndex = findNextPendingQuestionIndex(
            current.questions.map((question) => question.id),
            current.index,
            new Set(Object.keys(current.results)),
            new Set(current.skippedQuestionIds),
          );
          if (nextIndex >= 0) return { ...current, index: nextIndex };
          if (current.skippedQuestionIds.length > 0) return { ...current, phase: "skipped-prompt" };
        }
      } else if (current.index < current.questions.length - 1) {
        return { ...current, index: current.index + 1 };
      }
      if (current.mode !== "study" || current.skippedQuestionIds.length === 0) {
        void clearActiveSession();
        setView("summary");
        return { ...current, completed: true };
      }
      return { ...current, phase: "skipped-prompt" };
    });
  };

  const toggleFlag = async (questionId: string) => {
    const existing = flags[questionId];
    const next: QuestionFlag = {
      questionId,
      flagged: !existing?.flagged,
      note: existing?.note,
      updatedAt: new Date().toISOString(),
    };
    await saveQuestionFlag(next);
    setFlags((current) => {
      const copy = { ...current };
      if (!next.flagged && !next.note?.trim()) {
        delete copy[questionId];
      } else {
        copy[questionId] = next;
      }
      return copy;
    });
  };

  const reviewFlashcard = async (termId: string, remembered: boolean) => {
    const next = await recordFlashcardReview(termId, remembered);
    setFlashcardProgress((current) => ({ ...current, [termId]: next }));
  };

  const openBuilder = (overrides: Partial<BuilderFilters> = {}) => {
    setBuilderFilters({ ...blankBuilderFilters, ...overrides });
    setView("builder");
  };

  const practiceOne = (record: QuestionRecord) => {
    startSession([record], "study", record.question.stem.en, {
      order: "sequential",
      returnView: "library",
    });
  };

  const existingIds = useMemo(() => new Set(allRecords.map((record) => record.question.id)), [allRecords]);
  const activeSession = session && !session.completed ? session : null;
  const relatedPracticePool = useMemo(() => buildRelatedPracticePool(session, allRecords, progress), [session, allRecords, progress]);
  const sessionReturnLabel = sessionReturnView === "library" ? "Library" : "Home";

  return (
    <div className={`app-shell ${view === "session" ? "session-active" : ""}`}>
      <header className="app-header">
        <button className="brand" type="button" onClick={() => setView("home")}>
          <FlaskConical aria-hidden="true" />
          <span>NCLEX Bilingual Prep</span>
        </button>
        <nav aria-label="Main navigation">
          <button className={view === "home" ? "active" : ""} type="button" onClick={() => setView("home")}>
            <Home aria-hidden="true" />
            <span>Home</span>
          </button>
          <button className={view === "builder" ? "active" : ""} type="button" onClick={() => openBuilder(builderFilters)}>
            <SlidersHorizontal aria-hidden="true" />
            <span>Builder</span>
          </button>
          <button className={view === "dashboard" ? "active" : ""} type="button" onClick={() => setView("dashboard")}>
            <BarChart3 aria-hidden="true" />
            <span>Dashboard</span>
          </button>
          <button className={view === "flashcards" ? "active" : ""} type="button" onClick={() => setView("flashcards")}>
            <Brain aria-hidden="true" />
            <span>Vocab</span>
          </button>
          <button className={view === "library" ? "active" : ""} type="button" onClick={() => setView("library")}>
            <Library aria-hidden="true" />
            <span>Library</span>
          </button>
          <button className={view === "import" ? "active" : ""} type="button" onClick={() => setView("import")}>
            <Import aria-hidden="true" />
            <span>Import</span>
          </button>
          <button className={view === "settings" ? "active" : ""} type="button" onClick={() => setView("settings")}>
            <SettingsIcon aria-hidden="true" />
            <span>Settings</span>
          </button>
          {devStartup.enabled && (
            <button className={view === "review" ? "active" : ""} type="button" onClick={() => setView("review")}>
              <Wrench aria-hidden="true" />
              <span>Developer</span>
            </button>
          )}
        </nav>
      </header>

      <main>
        {bundled.errors.length > 0 && (
          <section className="warning-band">
            <strong>Bundled bank validation issue</strong>
            {bundled.errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </section>
        )}

        {view === "home" && (
          <HomeView
            total={allRecords.length}
            missed={missedRecords.length}
            answered={answeredRecords.length}
            due={dueRecords.length}
            flagged={flaggedRecords.length}
            vocab={flashcardDeck.length}
            activeSession={activeSession}
            onResume={() => setView("session")}
            onStudy={() => startSession(allRecords, "study", "Study all questions")}
            onTest={(count) =>
              startSession(allRecords, "test", `Test · ${count} questions`, { count, weighting: "nclex" })
            }
            onMistakes={() => startSession(missedRecords, "study", "Review mistakes")}
            onAnswered={() => startSession(answeredRecords, "study", "Review answered questions")}
            onDue={() => startSession(dueRecords, "study", "Spaced review")}
            onCustom={() => openBuilder()}
            onDashboard={() => setView("dashboard")}
            onFlashcards={() => setView("flashcards")}
            onImport={() => setView("import")}
            onLibrary={() => setView("library")}
          />
        )}

        {view === "builder" && (
          <SessionBuilderView
            records={builderRecords}
            filters={builderFilters}
            setFilters={setBuilderFilters}
            onStart={() => {
              const label = builderFilters.mode === "adaptive" ? "Adaptive exam practice" : "Custom session";
              startSession(
                builderRecords,
                builderFilters.mode,
                label,
                builderFilters.mode === "adaptive" ? {} : { count: DEFAULT_SESSION_COUNT },
              );
            }}
          />
        )}

        {view === "dashboard" && (
          <DashboardView
            records={allRecords}
            progress={progress}
            flags={flags}
            answerEvents={answerEvents}
            onPracticeCategory={(category) => openBuilder({ categories: [category], status: "incorrect", mode: "study" })}
            onPracticeUnseen={() => openBuilder({ status: "unseen", mode: "study" })}
            onPracticeFlagged={() => openBuilder({ status: "flagged", mode: "study" })}
          />
        )}

        {view === "flashcards" && (
          <FlashcardsView
            deck={flashcardDeck}
            progress={flashcardProgress}
            voiceEnabled={settings.voiceEnabled}
            onReview={reviewFlashcard}
          />
        )}

        {view === "library" && (
          <LibraryView
            records={filteredRecords}
            allRecords={allRecords}
            progress={progress}
            flags={flags}
            filters={filters}
            setFilters={setFilters}
            onStudy={() => startSession(filteredRecords, "study", "Filtered study set")}
            onTest={() => startSession(filteredRecords, "test", "Filtered test set")}
            onToggleFlag={toggleFlag}
            onPracticeOne={practiceOne}
          />
        )}

        {view === "import" && (
          <ImportView
            existingIds={existingIds}
            allRecords={allRecords}
            onImported={async (records) => {
              const next = [...uploadedRecords, ...records];
              await saveUploadedRecords(records);
              setUploadedRecords(next);
            }}
          />
        )}

        {view === "settings" && <SettingsView settings={settings} updateSettings={updateSettings} />}

        {view === "review" && devStartup.enabled && (
          <DeveloperReviewConsole
            records={allRecords}
            initialIds={devStartup.requestedIds}
            initialLanguageMode={settings.languageMode}
          />
        )}

        {view === "session" && session && (
          <SessionView
            session={session}
            progress={progress}
            flags={flags}
            voiceEnabled={settings.voiceEnabled}
            onAnswer={updateAnswer}
            onSubmit={submitCurrent}
            onSkip={skipCurrent}
            onNext={goNext}
            onReviewSkipped={reviewSkippedQuestions}
            onFinish={finishSession}
            onLanguageModeChange={(languageMode) => setSession((current) => (current ? { ...current, languageMode } : current))}
            onToggleFlag={toggleFlag}
            onExit={() => setView(sessionReturnView)}
            exitLabel={sessionReturnLabel}
          />
        )}

        {view === "summary" && session && (
          <SummaryView
            session={session}
            flags={flags}
            onToggleFlag={toggleFlag}
            voiceEnabled={settings.voiceEnabled}
            defaultLanguageMode={session.languageMode}
            onHome={() => setView(sessionReturnView)}
            homeLabel={sessionReturnView === "library" ? "Back to Library" : "Home"}
            relatedCount={relatedPracticePool.length}
            onPracticeRelated={() =>
              startSession(relatedPracticePool, "study", "Practice related", {
                count: DEFAULT_SESSION_COUNT,
                order: "sequential",
              })
            }
          />
        )}
      </main>

    </div>
  );
}

function HomeView({
  total,
  missed,
  answered,
  due,
  flagged,
  vocab,
  activeSession,
  onResume,
  onStudy,
  onTest,
  onMistakes,
  onAnswered,
  onDue,
  onCustom,
  onDashboard,
  onFlashcards,
  onImport,
  onLibrary,
}: {
  total: number;
  missed: number;
  answered: number;
  due: number;
  flagged: number;
  vocab: number;
  activeSession: SessionState | null;
  onResume: () => void;
  onStudy: () => void;
  onTest: (count: number) => void;
  onMistakes: () => void;
  onAnswered: () => void;
  onDue: () => void;
  onCustom: () => void;
  onDashboard: () => void;
  onFlashcards: () => void;
  onImport: () => void;
  onLibrary: () => void;
}) {
  const [testCount, setTestCount] = useState(DEFAULT_SESSION_COUNT);
  const testCounts = [10, 25, 50];
  return (
    <section className="home-grid">
      <div className="hero-panel">
        <p className="eyebrow">Offline bilingual NCLEX-RN practice</p>
        <h1>Train in English. Check reasoning in Chinese.</h1>
        <div className="metric-row">
          <Metric label="Questions" value={total} />
          <Metric label="Answered" value={answered} />
          <Metric label="Due review" value={due} />
          <Metric label="Mistakes" value={missed} />
          <Metric label="Flagged" value={flagged} />
          <Metric label="Vocab terms" value={vocab} />
        </div>

        {activeSession && (
          <button className="primary-action resume-action" type="button" onClick={onResume}>
            <Play aria-hidden="true" />
            <span>Resume session</span>
          </button>
        )}

        <div className="test-launcher">
          <div className="test-launcher-head">
            <div>
              <p className="eyebrow">Recommended</p>
              <strong>Answer {testCount}, then review</strong>
            </div>
            <div className="segmented count-toggle" role="group" aria-label="Number of questions">
              {testCounts.map((count) => (
                <button
                  key={count}
                  type="button"
                  className={testCount === count ? "active" : ""}
                  aria-pressed={testCount === count}
                  onClick={() => setTestCount(count)}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
          <button className="primary-action test-start" type="button" onClick={() => onTest(testCount)} disabled={total === 0}>
            <CheckCircle2 aria-hidden="true" />
            <span>Start test · {testCount} questions</span>
          </button>
        </div>

        <div className="action-row secondary-actions">
          <button className="secondary-action" type="button" onClick={onStudy} disabled={total === 0}>
            <BookOpen aria-hidden="true" />
            <span>Study all questions</span>
          </button>
          <button className="secondary-action" type="button" onClick={onCustom} disabled={total === 0}>
            <SlidersHorizontal aria-hidden="true" />
            <span>Custom session</span>
          </button>
          <button className="secondary-action" type="button" onClick={onDue} disabled={due === 0}>
            <RotateCcw aria-hidden="true" />
            <span>Spaced review</span>
          </button>
          <button className="secondary-action" type="button" onClick={onMistakes} disabled={missed === 0}>
            <RotateCcw aria-hidden="true" />
            <span>Review mistakes</span>
          </button>
          <button className="secondary-action" type="button" onClick={onAnswered} disabled={answered === 0}>
            <ListChecks aria-hidden="true" />
            <span>Review answered</span>
          </button>
        </div>
      </div>

      <div className="utility-grid">
        <button className="utility-card" type="button" onClick={onDashboard}>
          <BarChart3 aria-hidden="true" />
          <span>Performance dashboard</span>
        </button>
        <button className="utility-card" type="button" onClick={onFlashcards}>
          <Brain aria-hidden="true" />
          <span>Vocab flashcards</span>
        </button>
        <button className="utility-card" type="button" onClick={onImport}>
          <FileJson aria-hidden="true" />
          <span>Import a bank</span>
        </button>
        <button className="utility-card" type="button" onClick={onLibrary}>
          <Library aria-hidden="true" />
          <span>Browse library</span>
        </button>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function SessionBuilderView({
  records,
  filters,
  setFilters,
  onStart,
}: {
  records: QuestionRecord[];
  filters: BuilderFilters;
  setFilters: (filters: BuilderFilters) => void;
  onStart: () => void;
}) {
  const selectedCategoryCount = filters.categories.length + (filters.withVisuals ? 1 : 0);
  const toggleCategory = (category: string) => {
    const selected = filters.categories.includes(category);
    setFilters({
      ...filters,
      categories: selected ? filters.categories.filter((item) => item !== category) : [...filters.categories, category],
    });
  };

  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Session builder</p>
          <h2>{records.length} questions in pool</h2>
        </div>
        <button className="primary-action" type="button" onClick={onStart} disabled={records.length === 0}>
          <Play aria-hidden="true" />
          <span>{filters.mode === "adaptive" ? "Start adaptive exam" : "Start session"}</span>
        </button>
      </div>

      <div className="builder-panel">
        <div className="builder-mode" role="group" aria-label="Session mode">
          {(["study", "test", "adaptive"] as const).map((mode) => (
            <button
              className={filters.mode === mode ? "active" : ""}
              type="button"
              key={mode}
              onClick={() => setFilters({ ...filters, mode })}
            >
              {mode === "study" ? <BookOpen aria-hidden="true" /> : mode === "test" ? <CheckCircle2 aria-hidden="true" /> : <BarChart3 aria-hidden="true" />}
              <span>{mode === "study" ? "Study" : mode === "test" ? "Test" : "Adaptive"}</span>
            </button>
          ))}
        </div>

        <div className="filters builder-filters">
          <div className="topic-picker">
            <div className="topic-picker-header">
              <div>
                <span>Categories</span>
                <strong>{selectedCategoryCount === 0 ? "All categories" : `${selectedCategoryCount} selected`}</strong>
              </div>
              <button
                type="button"
                className={selectedCategoryCount === 0 ? "active" : ""}
                onClick={() => setFilters({ ...filters, categories: [], withVisuals: false })}
              >
                All categories
              </button>
            </div>
            <div className="topic-chip-grid" aria-label="Categories">
              <button
                className={filters.withVisuals ? "topic-chip selected image-chip" : "topic-chip image-chip"}
                type="button"
                aria-pressed={filters.withVisuals}
                onClick={() => setFilters({ ...filters, withVisuals: !filters.withVisuals })}
              >
                <Image aria-hidden="true" />
                <span>Questions with images</span>
              </button>
              {categories.map((category) => {
                const selected = filters.categories.includes(category);
                return (
                  <button
                    className={selected ? "topic-chip selected" : "topic-chip"}
                    type="button"
                    key={category}
                    aria-pressed={selected}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
          <SelectFilter
            label="Status pool"
            value={filters.status}
            values={["all", "unseen", "answered", "incorrect", "flagged", "due"]}
            onChange={(status) => setFilters({ ...filters, status: status as SessionStatusFilter })}
          />
        </div>

        <div className="builder-summary">
          <span className="type-pill">{filters.mode === "adaptive" ? "Exam-condition practice" : "Custom practice"}</span>
          <span>{records.length} questions in pool</span>
          {filters.mode === "adaptive" && <span>No pass/fail estimate; difficulty changes by rolling performance.</span>}
        </div>
      </div>

      <div className="question-list">
        {records.slice(0, 8).map((record) => (
          <article className="question-row compact-row" key={record.question.id}>
            <div>
              <span className="type-pill">{formatItemType(record.question.itemType)}</span>
              <h3>{record.question.stem.en}</h3>
              <p>
                {record.question.category} · {record.question.topic} · {record.question.difficulty}
                {hasVisualStimulus(record.question) ? " · Image question" : ""}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LibraryView({
  records,
  allRecords,
  progress,
  flags,
  filters,
  setFilters,
  onStudy,
  onTest,
  onToggleFlag,
  onPracticeOne,
}: {
  records: QuestionRecord[];
  allRecords: QuestionRecord[];
  progress: Record<string, QuestionProgress>;
  flags: Record<string, QuestionFlag>;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onStudy: () => void;
  onTest: () => void;
  onToggleFlag: (questionId: string) => void;
  onPracticeOne: (record: QuestionRecord) => void;
}) {
  const topics = uniqueSorted(allRecords.map((record) => record.question.topic));
  const sources = uniqueSorted(allRecords.map((record) => record.sourceLabel));

  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Library</p>
          <h2>{records.length} matching questions</h2>
        </div>
        <div className="action-row compact">
          <button type="button" onClick={onStudy} disabled={records.length === 0}>
            <BookOpen aria-hidden="true" />
            <span>Study</span>
          </button>
          <button type="button" onClick={onTest} disabled={records.length === 0}>
            <CheckCircle2 aria-hidden="true" />
            <span>Test</span>
          </button>
        </div>
      </div>

      <div className="filters">
        <SelectFilter
          label="Category"
          value={filters.category}
          values={["all", ...categories]}
          onChange={(category) => setFilters({ ...filters, category })}
        />
        <SelectFilter
          label="Topic"
          value={filters.topic}
          values={["all", ...topics]}
          onChange={(topic) => setFilters({ ...filters, topic })}
        />
        <SelectFilter
          label="Difficulty"
          value={filters.difficulty}
          values={["all", ...difficulties]}
          onChange={(difficulty) => setFilters({ ...filters, difficulty })}
        />
        <SelectFilter
          label="Source"
          value={filters.source}
          values={["all", ...sources]}
          onChange={(source) => setFilters({ ...filters, source })}
        />
      </div>

      <div className="question-list">
        {records.map((record) => {
          const itemProgress = progress[record.question.id];
          const flagged = flags[record.question.id]?.flagged;
          return (
            <article
              className="question-row interactive-row"
              key={record.question.id}
              role="button"
              tabIndex={0}
              onClick={() => onPracticeOne(record)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onPracticeOne(record);
                }
              }}
            >
              <div>
                <span className="type-pill">{record.question.itemType.replace(/_/g, " ")}</span>
                <h3>{record.question.stem.en}</h3>
                <p>
                  {record.question.category} · {record.question.topic} · {record.question.difficulty} · {record.sourceLabel}
                </p>
              </div>
              <div className="row-status">
                <button
                  className={`icon-action ${flagged ? "flagged" : ""}`}
                  type="button"
                  aria-label={flagged ? "Remove flag" : "Flag for review"}
                  title={flagged ? "Remove flag" : "Flag for review"}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFlag(record.question.id);
                  }}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <Flag aria-hidden="true" />
                </button>
                {flagged && <span className="type-pill">Flagged</span>}
                {isDueForReview(itemProgress) && <span className="type-pill">Due</span>}
                {itemProgress?.missed && <span className="missed-pill">Missed</span>}
                {itemProgress && <span>{itemProgress.correct}/{itemProgress.seen}</span>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DashboardView({
  records,
  progress,
  flags,
  answerEvents,
  onPracticeCategory,
  onPracticeUnseen,
  onPracticeFlagged,
}: {
  records: QuestionRecord[];
  progress: Record<string, QuestionProgress>;
  flags: Record<string, QuestionFlag>;
  answerEvents: AnswerEvent[];
  onPracticeCategory: (category: string) => void;
  onPracticeUnseen: () => void;
  onPracticeFlagged: () => void;
}) {
  const answeredRecords = records.filter((record) => (progress[record.question.id]?.seen ?? 0) > 0);
  const flaggedCount = records.filter((record) => flags[record.question.id]?.flagged).length;
  const unseenCount = records.length - answeredRecords.length;
  const totalAttempts = records.reduce((sum, record) => sum + (progress[record.question.id]?.seen ?? 0), 0);
  const totalCorrect = records.reduce((sum, record) => sum + (progress[record.question.id]?.correct ?? 0), 0);
  const categoryRows = aggregateRows(records, progress, flags, (record) => record.question.category);
  const topicRows = aggregateRows(records, progress, flags, (record) => record.question.topic);
  const difficultyRows = aggregateRows(records, progress, flags, (record) => record.question.difficulty);
  const itemTypeRows = aggregateRows(records, progress, flags, (record) => formatItemType(record.question.itemType));
  const weakTopics = topicRows
    .filter((row) => row.attempts >= 3 && row.accuracy < 0.7)
    .sort((left, right) => left.accuracy - right.accuracy)
    .slice(0, 6);
  const recordsById = new Map(records.map((record) => [record.question.id, record]));
  const topicCategory = new Map(records.map((record) => [record.question.topic, record.question.category] as const));
  const recentEvents = answerEvents.filter((event) => recordsById.has(event.questionId)).slice(-20);

  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Performance dashboard</p>
          <h2>Mastery and coverage</h2>
        </div>
        <div className="action-row compact">
          <button type="button" onClick={onPracticeUnseen} disabled={unseenCount === 0}>
            <BookOpen aria-hidden="true" />
            <span>Unseen</span>
          </button>
          <button type="button" onClick={onPracticeFlagged} disabled={flaggedCount === 0}>
            <Flag aria-hidden="true" />
            <span>Flagged</span>
          </button>
        </div>
      </div>

      <div className="dashboard-metrics">
        <Metric label="Available" value={records.length} />
        <Metric label="Seen" value={answeredRecords.length} />
        <Metric label="Unseen" value={unseenCount} />
        <Metric label="Flagged" value={flaggedCount} />
        <Metric label="Attempts" value={totalAttempts} />
        <Metric label="Correct" value={totalCorrect} />
      </div>

      <section className="dashboard-panel">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow">Weak areas</p>
            <h3>Minimum 3 attempts before a topic is labeled weak</h3>
          </div>
        </div>
        {weakTopics.length === 0 ? (
          <p className="muted-copy">No weak topic labels yet. More answered questions will make this more honest.</p>
        ) : (
          <div className="weak-topic-list">
            {weakTopics.map((topic) => (
              <button
                type="button"
                key={topic.label}
                onClick={() => {
                  const category = topicCategory.get(topic.label);
                  if (category) onPracticeCategory(category);
                }}
              >
                <span>{topic.label}</span>
                <strong>{Math.round(topic.accuracy * 100)}%</strong>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-panel">
        <p className="eyebrow">Recent trend</p>
        {recentEvents.length === 0 ? (
          <p className="muted-copy">Trend bars begin with newly answered questions.</p>
        ) : (
          <div className="trend-strip" aria-label="Recent answer trend">
            {recentEvents.map((event) => (
              <span className={event.wasCorrect ? "correct" : "incorrect"} key={event.id} title={event.answeredAt} />
            ))}
          </div>
        )}
      </section>

      <div className="dashboard-grid">
        <StatsTable title="By category" rows={categoryRows} />
        <StatsTable title="By topic" rows={topicRows.slice(0, 10)} />
        <StatsTable title="By difficulty" rows={difficultyRows} />
        <StatsTable title="By item type" rows={itemTypeRows} />
      </div>
    </section>
  );
}

function StatsTable({ title, rows }: { title: string; rows: AggregateRow[] }) {
  return (
    <section className="dashboard-panel">
      <h3>{title}</h3>
      <div className="stats-table">
        {rows.map((row) => (
          <div key={row.label}>
            <span>{row.label}</span>
            <span>{row.seen}/{row.available} seen</span>
            <strong>{row.attempts === 0 ? "New" : `${Math.round(row.accuracy * 100)}%`}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function FlashcardsView({
  deck,
  progress,
  voiceEnabled,
  onReview,
}: {
  deck: FlashcardTerm[];
  progress: Record<string, FlashcardProgress>;
  voiceEnabled: boolean;
  onReview: (termId: string, remembered: boolean) => Promise<void>;
}) {
  const [category, setCategory] = useState("all");
  const [topic, setTopic] = useState("all");
  const [readyNow, setReadyNow] = useState(true);
  const [sessionDeck, setSessionDeck] = useState<FlashcardTerm[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const categoriesInDeck = uniqueSorted(deck.flatMap((term) => term.categories));
  const topicsInDeck = uniqueSorted(deck.flatMap((term) => term.topics));
  const card = sessionDeck[index % Math.max(1, sessionDeck.length)];

  useEffect(() => {
    const filteredDeck = deck.filter((term) => {
      if (category !== "all" && !term.categories.includes(category)) return false;
      if (topic !== "all" && !term.topics.includes(topic)) return false;
      if (readyNow && progress[term.id] && !isDueForReview(progress[term.id])) return false;
      return true;
    });
    setSessionDeck(shuffle(filteredDeck));
    setIndex(0);
    setRevealed(false);
  }, [category, topic, readyNow, deck]);

  const gradeCard = async (remembered: boolean) => {
    if (!card) return;
    await onReview(card.id, remembered);
    setRevealed(false);
    setIndex((current) => current + 1);
  };

  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Vocabulary flashcards</p>
          <h2>{sessionDeck.length} cards ready</h2>
        </div>
        <label className="toggle-row compact-toggle">
          <input type="checkbox" checked={readyNow} onChange={(event) => setReadyNow(event.target.checked)} />
          <span>Ready now</span>
        </label>
      </div>

      <div className="filters flashcard-filters">
        <div className="flashcard-topic-filter">
          <SelectFilter label="Topic" value={topic} values={["all", ...topicsInDeck]} onChange={setTopic} />
        </div>
        <SelectFilter label="Category" value={category} values={["all", ...categoriesInDeck]} onChange={setCategory} />
      </div>

      {!card ? (
        <div className="dashboard-panel">
          <p className="muted-copy">No cards match the current filters.</p>
        </div>
      ) : (
        <article className="flashcard">
          <div className="flashcard-top">
            <span className="type-pill">Appears in {card.questionIds.length} questions</span>
            <SpeakButton text={card.termEn} enabled={voiceEnabled} label={`Read ${card.termEn}`} />
          </div>
          <button className="flashcard-face" type="button" onClick={() => setRevealed(true)}>
            <strong>{card.termEn}</strong>
            {revealed && (
              <span>
                {card.termZh}
                <small>{card.defZh}</small>
              </span>
            )}
          </button>
          <div className="session-actions">
            <button type="button" onClick={() => setRevealed((current) => !current)}>
              {revealed ? "Hide" : "Flip"}
            </button>
            <button type="button" onClick={() => gradeCard(false)}>
              <RotateCcw aria-hidden="true" />
              <span>Again</span>
            </button>
            <button className="primary-action" type="button" onClick={() => gradeCard(true)}>
              <CheckCircle2 aria-hidden="true" />
              <span>Got it</span>
            </button>
          </div>
        </article>
      )}
    </section>
  );
}

function SelectFilter({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {values.map((item) => (
          <option key={item} value={item}>
            {item === "all" ? "All" : item}
          </option>
        ))}
      </select>
    </label>
  );
}

function ImportView({
  existingIds,
  allRecords,
  onImported,
}: {
  existingIds: Set<string>;
  allRecords: QuestionRecord[];
  onImported: (records: QuestionRecord[]) => Promise<void>;
}) {
  const [sourceLabel, setSourceLabel] = useState("Claude");
  const [text, setText] = useState("");
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState("");

  const importNow = async () => {
    setError("");
    setSummary(null);
    try {
      const { records, summary: nextSummary } = importQuestionsFromText(text, new Set(existingIds), sourceLabel);
      await onImported(records);
      setSummary(nextSummary);
      if (records.length > 0) setText("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(toExportEnvelope(allRecords.map((record) => record.question)), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nclex-exported-library.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Import</p>
          <h2>Add a generated bank</h2>
        </div>
        <button type="button" onClick={exportAll} disabled={allRecords.length === 0}>
          <Download aria-hidden="true" />
          <span>Export all</span>
        </button>
      </div>

      <div className="import-panel">
        <label>
          <span>Source label</span>
          <input value={sourceLabel} onChange={(event) => setSourceLabel(event.target.value)} />
        </label>
        <label>
          <span>Paste JSON</span>
          <textarea value={text} onChange={(event) => setText(event.target.value)} spellCheck={false} />
        </label>
        <label className="file-input">
          <FileJson aria-hidden="true" />
          <span>Upload .json</span>
          <input
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              void file.text().then(setText);
            }}
          />
        </label>
        <button className="primary-action" type="button" onClick={importNow} disabled={text.trim().length === 0}>
          <Import aria-hidden="true" />
          <span>Import bank</span>
        </button>
      </div>

      {summary && (
        <div className="result-panel">
          <strong>
            imported {summary.imported} of {summary.total}; skipped {summary.skipped.length}
          </strong>
          {summary.regeneratedIds.length > 0 && (
            <p>{summary.regeneratedIds.length} duplicate ids were regenerated during import.</p>
          )}
          {summary.skipped.map((item) => (
            <p key={`${item.index}-${item.id ?? "unknown"}`}>
              #{item.index + 1} {item.id ? `(${item.id}) ` : ""}
              {item.reasons.join("; ")}
            </p>
          ))}
        </div>
      )}
      {error && <div className="error-panel">{error}</div>}
    </section>
  );
}

function SettingsView({ settings, updateSettings }: { settings: Settings; updateSettings: (settings: Settings) => void }) {
  return (
    <section className="stack narrow">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Settings</p>
          <h2>Defaults</h2>
        </div>
      </div>
      <div className="settings-grid">
        <label>
          <span>Chinese display</span>
          <select
            value={settings.languageMode}
            onChange={(event) => updateSettings({ ...settings, languageMode: event.target.value as LanguageMode })}
          >
            <option value="off">Off</option>
            <option value="on-tap">On tap</option>
            <option value="always">Always</option>
          </select>
        </label>
        <label>
          <span>Default mode</span>
          <select
            value={settings.defaultMode}
            onChange={(event) => updateSettings({ ...settings, defaultMode: event.target.value as StudyMode })}
          >
            <option value="study">Study</option>
            <option value="test">Test</option>
          </select>
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={settings.voiceEnabled}
            onChange={(event) => updateSettings({ ...settings, voiceEnabled: event.target.checked })}
          />
          <span>English audio buttons</span>
        </label>
      </div>
    </section>
  );
}

type DevReviewStatus =
  | "unreviewed"
  | "looks_ok"
  | "needs_fix"
  | "duplicate_or_redundant"
  | "visual_candidate"
  | "reject_audit_flag";

type DevReviewNote = {
  status: DevReviewStatus;
  note: string;
  updatedAt: string;
};

const DEV_REVIEW_NOTES_KEY = "shrimpDevReviewNotesByQuestionId";
const manifestFilterFields = [
  "flag_type",
  "recommended_action",
  "visual_value",
  "target_renderer",
  "answer_key_trust",
  "priority",
  "risk_tier",
  "content_lane_status",
] as const;

type ManifestFilterField = (typeof manifestFilterFields)[number];
type ManifestFilters = Record<ManifestFilterField, string>;

const blankManifestFilters = Object.fromEntries(
  manifestFilterFields.map((field) => [field, "all"]),
) as ManifestFilters;

const loadDevReviewNotes = (): Record<string, DevReviewNote> => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(DEV_REVIEW_NOTES_KEY) ?? "{}") as unknown;
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? parsed as Record<string, DevReviewNote>
      : {};
  } catch {
    return {};
  }
};

function DeveloperReviewConsole({
  records,
  initialIds,
  initialLanguageMode,
}: {
  records: QuestionRecord[];
  initialIds: string[];
  initialLanguageMode: LanguageMode;
}) {
  const reviewIndex = useMemo(() => buildQuestionReviewIndex(records), [records]);
  const [idInput, setIdInput] = useState(initialIds.join("\n"));
  const [openedIds, setOpenedIds] = useState(initialIds);
  const [selectedId, setSelectedId] = useState(initialIds[0] ?? "");
  const [languageMode, setLanguageMode] = useState<LanguageMode>(initialLanguageMode);
  const [manifestText, setManifestText] = useState("");
  const [manifestRows, setManifestRows] = useState<SweepManifestRow[]>([]);
  const [manifestErrors, setManifestErrors] = useState<string[]>([]);
  const [manifestWarnings, setManifestWarnings] = useState<string[]>([]);
  const [manifestFilters, setManifestFilters] = useState<ManifestFilters>(blankManifestFilters);
  const [visualWorkMode, setVisualWorkMode] = useState(false);
  const [notes, setNotes] = useState<Record<string, DevReviewNote>>(loadDevReviewNotes);

  const results = useMemo(() => lookupQuestionIds(openedIds, reviewIndex), [openedIds, reviewIndex]);
  const selectedEntry = selectedId ? reviewIndex.get(selectedId) : undefined;
  const selectedManifestRow = manifestRows.find((row) => row.qid === selectedId);
  const selectedQuestion = selectedEntry?.embeddedPart ?? selectedEntry?.question;

  const manifestFilterOptions = useMemo(
    () =>
      Object.fromEntries(
        manifestFilterFields.map((field) => [
          field,
          [...new Set(manifestRows.map((row) => String(row[field] ?? "null")))].sort(),
        ]),
      ) as Record<ManifestFilterField, string[]>,
    [manifestRows],
  );
  const visibleManifestRows = useMemo(
    () =>
      sortSweepRows(
        manifestRows.filter((row) =>
          manifestFilterFields.every((field) => {
            const filter = manifestFilters[field];
            return filter === "all" || String(row[field] ?? "null") === filter;
          }),
        ),
        visualWorkMode,
      ),
    [manifestFilters, manifestRows, visualWorkMode],
  );

  useEffect(() => {
    if (!selectedEntry?.embeddedPart) return;
    requestAnimationFrame(() => {
      document.querySelector(`[data-case-part-id="${CSS.escape(selectedEntry.embeddedPart?.id ?? "")}"]`)
        ?.scrollIntoView({ block: "center" });
    });
  }, [selectedEntry]);

  const openIds = (ids: string[]) => {
    setOpenedIds(ids);
    setSelectedId(ids[0] ?? "");
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("dev", "1");
      url.searchParams.delete("qid");
      if (ids.length > 0) url.searchParams.set("qids", ids.join(","));
      else url.searchParams.delete("qids");
      window.history.replaceState(null, "", url);
    } catch {
      // URL synchronization is optional in restricted browser contexts.
    }
  };

  const selectQuestion = (qid: string) => {
    setSelectedId(qid);
    if (!openedIds.includes(qid)) setOpenedIds((current) => [...current, qid]);
  };

  const parseManifest = () => {
    const parsed = parseSweepManifest(manifestText);
    setManifestRows(parsed.rows);
    setManifestErrors(parsed.errors);
    setManifestWarnings(parsed.warnings);
    setManifestFilters(blankManifestFilters);
    if (parsed.rows.length > 0) selectQuestion(sortSweepRows(parsed.rows, false)[0].qid);
  };

  const updateNote = (patch: Partial<Pick<DevReviewNote, "status" | "note">>) => {
    if (!selectedId) return;
    setNotes((current) => {
      const existing = current[selectedId] ?? { status: "unreviewed", note: "", updatedAt: "" };
      const next = {
        ...current,
        [selectedId]: { ...existing, ...patch, updatedAt: new Date().toISOString() },
      };
      try {
        window.localStorage.setItem(DEV_REVIEW_NOTES_KEY, JSON.stringify(next));
      } catch {
        // Keep the in-memory note when storage is unavailable.
      }
      return next;
    });
  };

  const exportNotes = () => {
    const blob = new Blob(
      [JSON.stringify({ exportedAt: new Date().toISOString(), notes }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "shrimp-dev-review-notes.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const activeNote = notes[selectedId] ?? { status: "unreviewed", note: "", updatedAt: "" };

  return (
    <section className="dev-review-console">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Developer only</p>
          <h2>Question Review Console</h2>
          <p>Read-only bank rendering for sweep and audit triage. No learner progress is written here.</p>
        </div>
        <div className="dev-review-heading-actions">
          <LanguageTabs value={languageMode} onChange={setLanguageMode} />
          <button type="button" onClick={exportNotes}>
            <Download aria-hidden="true" />
            <span>Export review notes</span>
          </button>
        </div>
      </div>

      <div className="dev-review-layout">
        <aside className="dev-review-sidebar">
          <section className="dev-review-panel">
            <label>
              <span>Question IDs (comma, space, or newline separated)</span>
              <textarea
                className="dev-id-input"
                value={idInput}
                onChange={(event) => setIdInput(event.target.value)}
                spellCheck={false}
              />
            </label>
            <button className="primary-action" type="button" onClick={() => openIds(parseQuestionIds(idInput))}>
              <Search aria-hidden="true" />
              <span>Open IDs</span>
            </button>
            <div className="dev-result-list">
              {results.map((result) => {
                const displayQuestion = result.entry?.embeddedPart ?? result.entry?.question;
                return (
                  <button
                    className={selectedId === result.requestedId ? "active" : ""}
                    type="button"
                    key={result.requestedId}
                    onClick={() => result.found && selectQuestion(result.requestedId)}
                    disabled={!result.found}
                  >
                    <strong>{result.requestedId}</strong>
                    <span>{result.found ? "Found" : "Not found"}</span>
                    {result.entry && displayQuestion && (
                      <small>
                        {result.entry.sourceLabel} · {formatItemType(displayQuestion.itemType)} · {result.entry.pathLabel}
                      </small>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="dev-review-panel">
            <label>
              <span>Paste v3 sweep manifest JSONL</span>
              <textarea
                className="dev-manifest-input"
                value={manifestText}
                onChange={(event) => setManifestText(event.target.value)}
                spellCheck={false}
              />
            </label>
            <button type="button" onClick={parseManifest} disabled={!manifestText.trim()}>
              Parse manifest
            </button>
            {manifestErrors.length > 0 && (
              <div className="dev-validation-errors">
                <strong>Rejected rows / validation errors</strong>
                {manifestErrors.map((error, index) => <p key={`${error}-${index}`}>{error}</p>)}
              </div>
            )}
            {manifestWarnings.map((warning) => (
              <p className="dev-untrusted-note" key={warning}>{warning}</p>
            ))}
            {manifestRows.length > 0 && (
              <>
                <label className="toggle-row">
                  <input
                    type="checkbox"
                    checked={visualWorkMode}
                    onChange={(event) => setVisualWorkMode(event.target.checked)}
                  />
                  <span>Visual work mode</span>
                </label>
                <div className="dev-manifest-filters">
                  {manifestFilterFields.map((field) => (
                    <label key={field}>
                      <span>{field}</span>
                      <select
                        value={manifestFilters[field]}
                        onChange={(event) =>
                          setManifestFilters((current) => ({ ...current, [field]: event.target.value }))
                        }
                      >
                        <option value="all">All</option>
                        {manifestFilterOptions[field].map((value) => (
                          <option value={value} key={value}>{value}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
                <div className="dev-manifest-list">
                  {visibleManifestRows.map((row) => (
                    <button
                      className={selectedId === row.qid ? "active" : ""}
                      type="button"
                      key={`${row.qid}-${row.flag_type}`}
                      onClick={() => selectQuestion(row.qid)}
                    >
                      <strong>{row.qid}</strong>
                      <span>{row.priority} · {row.flag_type}</span>
                      <small>{row.answer_key_trust} trust · {row.risk_tier} risk</small>
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>
        </aside>

        <div className="dev-review-main">
          {!selectedEntry && (
            <section className="dev-review-empty">
              <h3>Select a found question</h3>
              <p>Use ID lookup or a parsed manifest row to open the production question renderer.</p>
            </section>
          )}

          {selectedEntry && selectedQuestion && (
            <>
              <section className="dev-review-summary">
                <div>
                  <strong>{selectedId}</strong>
                  <span>{selectedEntry.sourceLabel}</span>
                </div>
                <div className="question-meta">
                  <span className="type-pill">{formatItemType(selectedQuestion.itemType)}</span>
                  <span>{selectedQuestion.category}</span>
                  <span>{selectedQuestion.topic}</span>
                  <span>{selectedQuestion.difficulty}</span>
                  <span>{hasVisualStimulus(selectedEntry.question) ? "Has visual" : "No visual"}</span>
                  <span>{selectedEntry.pathLabel}</span>
                </div>
              </section>

              {selectedManifestRow && (
                <ManifestEvidencePanel row={selectedManifestRow} onOpenQid={selectQuestion} />
              )}

              <QuestionCard
                key={`${selectedEntry.question.id}-${selectedId}`}
                question={selectedEntry.question}
                answer={getCorrectAnswer(selectedEntry.question)}
                submitted
                result
                languageMode={languageMode}
                flagged={false}
                voiceEnabled={false}
                onAnswer={() => undefined}
                onSubmit={() => undefined}
                onToggleFlag={() => undefined}
                reviewMode
                focusedPartId={selectedEntry.embeddedPart?.id}
              />

              <section className="dev-review-notes">
                <label>
                  <span>Review status</span>
                  <select
                    value={activeNote.status}
                    onChange={(event) => updateNote({ status: event.target.value as DevReviewStatus })}
                  >
                    <option value="unreviewed">Unreviewed</option>
                    <option value="looks_ok">Looks OK</option>
                    <option value="needs_fix">Needs fix</option>
                    <option value="duplicate_or_redundant">Duplicate or redundant</option>
                    <option value="visual_candidate">Visual candidate</option>
                    <option value="reject_audit_flag">Reject audit flag</option>
                  </select>
                </label>
                <label>
                  <span>Local note</span>
                  <textarea
                    value={activeNote.note}
                    onChange={(event) => updateNote({ note: event.target.value })}
                  />
                </label>
              </section>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ManifestEvidencePanel({
  row,
  onOpenQid,
}: {
  row: SweepManifestRow;
  onOpenQid: (qid: string) => void;
}) {
  const detailRows = [
    ["The tell", row.the_tell],
    ["Renderer justification", row.renderer_justification],
    ["Ambiguity evidence", row.ambiguity_evidence],
    ["Trust evidence", row.trust_evidence],
    ["Action rationale", row.action_rationale],
    ["Duplicate claim", row.duplicate_claim],
  ].filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].trim().length > 0);

  return (
    <section className="dev-evidence-panel">
      <div className="dev-evidence-heading">
        <div>
          <span className="missed-pill">Untrusted audit output</span>
          <h3>Quoted evidence beside live question</h3>
        </div>
        <span>{row.priority} priority · {row.answer_key_trust} answer-key trust · {row.risk_tier} risk</span>
      </div>
      <div className="dev-quoted-evidence">
        {row.quoted_evidence.map((evidence, index) => (
          <blockquote key={`${evidence.location}-${index}`}>
            <strong>{evidence.location}</strong>
            <p>{evidence.quote}</p>
          </blockquote>
        ))}
      </div>
      {detailRows.map(([label, value]) => (
        <div className="dev-evidence-detail" key={label}>
          <strong>{label}</strong>
          <p>{value}</p>
        </div>
      ))}
      {row.possible_duplicate_qids && row.possible_duplicate_qids.length > 0 && (
        <div className="dev-duplicate-links">
          <strong>Possible duplicates</strong>
          {row.possible_duplicate_qids.map((qid) => (
            <button type="button" key={qid} onClick={() => onOpenQid(qid)}>{qid}</button>
          ))}
        </div>
      )}
    </section>
  );
}

function SessionView({
  session,
  progress,
  flags,
  voiceEnabled,
  onAnswer,
  onSubmit,
  onSkip,
  onNext,
  onReviewSkipped,
  onFinish,
  onLanguageModeChange,
  onToggleFlag,
  onExit,
  exitLabel,
}: {
  session: SessionState;
  progress: Record<string, QuestionProgress>;
  flags: Record<string, QuestionFlag>;
  voiceEnabled: boolean;
  onAnswer: (questionId: string, answer: AnswerState) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onNext: () => void;
  onReviewSkipped: () => void;
  onFinish: () => void;
  onLanguageModeChange: (mode: LanguageMode) => void;
  onToggleFlag: (questionId: string) => void;
  onExit: () => void;
  exitLabel: string;
}) {
  if (session.phase === "skipped-prompt") {
    return (
      <section className="session-shell">
        <div className="session-topbar">
          <button type="button" onClick={onExit}>
            <ChevronLeft aria-hidden="true" />
            <span>{exitLabel}</span>
          </button>
          <div>
            <strong>{session.title}</strong>
            <span>{session.skippedQuestionIds.length} skipped</span>
          </div>
          <LanguageTabs value={session.languageMode} onChange={onLanguageModeChange} />
        </div>

        <div className="session-empty-state">
          <p className="eyebrow">Study session</p>
          <h2>Questions deferred</h2>
          <p>You skipped some questions. Review them now or end this session.</p>
          <p className="muted-copy">
            Answered {Object.keys(session.results).length} · Skipped {session.skippedQuestionIds.length}
          </p>
          <div className="action-row">
            <button className="primary-action" type="button" onClick={onReviewSkipped}>
              <RotateCcw aria-hidden="true" />
              <span>Review skipped questions</span>
            </button>
            <button type="button" onClick={onFinish}>End session</button>
          </div>
        </div>
      </section>
    );
  }

  const question = session.questions[session.index];
  const answer = session.answers[question.id] ?? getInitialAnswer(question);
  const submitted = Object.prototype.hasOwnProperty.call(session.results, question.id);
  const result = session.results[question.id];
  const totalTarget = session.adaptive?.targetCount ?? session.questions.length;
  const isLast =
    session.mode === "adaptive"
      ? session.index === session.questions.length - 1 && session.questions.length >= totalTarget
      : session.mode === "test"
        ? session.index === session.questions.length - 1
        : session.phase === "skipped-review"
          ? session.skippedQuestionIds.length === 0
          : findNextPendingQuestionIndex(
              session.questions.map((item) => item.id),
              session.index,
              new Set(Object.keys(session.results)),
              new Set(session.skippedQuestionIds),
            ) < 0 && session.skippedQuestionIds.length === 0;

  return (
    <section className="session-shell">
      <div className="session-topbar">
        <button type="button" onClick={onExit}>
          <ChevronLeft aria-hidden="true" />
          <span>{exitLabel}</span>
        </button>
        <div>
          <strong>{session.title}</strong>
          <span>
            Question {session.index + 1} of {totalTarget}
            {session.mode === "adaptive" ? ` · current band ${session.adaptive?.currentDifficulty ?? "medium"}` : ""}
          </span>
        </div>
        <LanguageTabs value={session.languageMode} onChange={onLanguageModeChange} />
      </div>

      <QuestionCard
        key={question.id}
        question={question}
        answer={answer}
        submitted={submitted}
        result={result}
        languageMode={session.languageMode}
        progress={progress[question.id]}
        flagged={flags[question.id]?.flagged ?? false}
        voiceEnabled={voiceEnabled}
        onAnswer={(next) => onAnswer(question.id, next)}
        onSubmit={onSubmit}
        onToggleFlag={() => onToggleFlag(question.id)}
      />

      <div className="session-actions">
        <button type="button" onClick={onFinish}>
          End set
        </button>
        {submitted ? (
          <button className="primary-action" type="button" onClick={onNext}>
            <span>{isLast ? "Finish" : "Next"}</span>
            <ChevronRight aria-hidden="true" />
          </button>
        ) : session.mode === "study" ? (
          <button className="secondary-action" type="button" onClick={onSkip}>
            Skip for now
          </button>
        ) : (
          <span />
        )}
      </div>
    </section>
  );
}

function LanguageTabs({ value, onChange }: { value: LanguageMode; onChange: (mode: LanguageMode) => void }) {
  return (
    <div className="segmented" role="group" aria-label="Chinese display">
      {(["off", "on-tap", "always"] as const).map((mode) => (
        <button className={value === mode ? "active" : ""} type="button" key={mode} onClick={() => onChange(mode)}>
          {mode === "off" ? "EN" : mode === "on-tap" ? "Tap ZH" : "EN/ZH"}
        </button>
      ))}
    </div>
  );
}

function QuestionCard({
  question,
  answer,
  submitted,
  result,
  languageMode,
  progress,
  flagged,
  voiceEnabled,
  onAnswer,
  onSubmit,
  onToggleFlag,
  reviewMode = false,
  focusedPartId,
}: {
  question: Question;
  answer: AnswerState;
  submitted: boolean;
  result?: boolean;
  languageMode: LanguageMode;
  progress?: QuestionProgress;
  flagged: boolean;
  voiceEnabled: boolean;
  onAnswer: (answer: AnswerState) => void;
  onSubmit: () => void;
  onToggleFlag: () => void;
  reviewMode?: boolean;
  focusedPartId?: string;
}) {
  const [activeTerm, setActiveTerm] = useState<GlossaryTerm | null>(null);
  const readyToSubmit = getAnswerCompleteness(question, answer);
  const score = submitted ? scoreQuestion(question, answer) : undefined;
  const showsPartialCredit = !reviewMode && score !== undefined && score.possible > 1;

  return (
    <article className="question-card">
      <div className="question-meta">
        <span className="type-pill">{formatItemType(question.itemType)}</span>
        <span>{question.category}</span>
        <span>{question.topic}</span>
        <span>{question.difficulty}</span>
        {flagged && <span className="type-pill">Flagged</span>}
        {progress?.missed && <span className="missed-pill">Review</span>}
        {isDueForReview(progress) && <span className="type-pill">Due</span>}
        {!reviewMode && (
          <button
            className={`icon-action flag-action ${flagged ? "flagged" : ""}`}
            type="button"
            aria-label={flagged ? "Remove flag" : "Flag for review"}
            title={flagged ? "Remove flag" : "Flag for review"}
            onClick={onToggleFlag}
          >
            <Flag aria-hidden="true" />
          </button>
        )}
      </div>

      <VisualStimulus visual={question.visual} languageMode={languageMode} />

      <div className="stem-row">
        <BilingualText
          pair={question.stem}
          mode={languageMode}
          className="stem"
          glossary={question.glossary}
          onTerm={setActiveTerm}
        />
        <SpeakButton text={question.stem.en} enabled={voiceEnabled} label="Read stem" />
        <ReadAllButton question={question} enabled={voiceEnabled} />
      </div>

      {activeTerm && (
        <div className="term-popover">
          <button type="button" onClick={() => setActiveTerm(null)} aria-label="Close term">
            x
          </button>
          <strong>
            {activeTerm.termEn} · {activeTerm.termZh}
          </strong>
          <p>{activeTerm.defZh}</p>
        </div>
      )}

      <QuestionAnswerControl
        question={question}
        answer={answer}
        submitted={submitted}
        languageMode={languageMode}
        voiceEnabled={voiceEnabled}
        onTerm={setActiveTerm}
        onAnswer={onAnswer}
        focusedPartId={focusedPartId}
      />

      {!submitted && !reviewMode && (
        <button className="primary-action submit-button" type="button" disabled={!readyToSubmit} onClick={onSubmit}>
          <CheckCircle2 aria-hidden="true" />
          <span>Submit answer</span>
        </button>
      )}

      {submitted && (
        <div className={`answer-banner ${reviewMode || result ? "correct" : "incorrect"}`}>
          {reviewMode || result ? <CheckCircle2 aria-hidden="true" /> : <XCircle aria-hidden="true" />}
          <div>
            <strong>{reviewMode ? "Correct answer shown" : result ? "Correct" : "Review this one"}</strong>
            {showsPartialCredit && score && (
              <span>
                {score.earned} of {score.possible} points
                {!result && score.earned > 0 ? " · Partial credit earned; scheduled for review until fully correct." : ""}
              </span>
            )}
          </div>
        </div>
      )}

      {submitted && <RationalePanel question={question} voiceEnabled={voiceEnabled} languageMode={languageMode} />}
    </article>
  );
}

function QuestionAnswerControl({
  question,
  answer,
  submitted,
  languageMode,
  voiceEnabled,
  onTerm,
  onAnswer,
  focusedPartId,
}: {
  question: Question;
  answer: AnswerState;
  submitted: boolean;
  languageMode: LanguageMode;
  voiceEnabled: boolean;
  onTerm: (term: GlossaryTerm) => void;
  onAnswer: (answer: AnswerState) => void;
  focusedPartId?: string;
}) {
  if (
    question.itemType === "multiple_choice" ||
    question.itemType === "select_all" ||
    question.itemType === "ordered_response"
  ) {
    return (
      <OptionAnswerControl
        question={question}
        answer={answer}
        submitted={submitted}
        languageMode={languageMode}
        voiceEnabled={voiceEnabled}
        onTerm={onTerm}
        onAnswer={onAnswer}
      />
    );
  }
  if (question.itemType === "fill_in_blank") {
    return (
      <FillInBlankControl
        question={question}
        answer={answer}
        submitted={submitted}
        languageMode={languageMode}
        onAnswer={onAnswer}
      />
    );
  }
  if (question.itemType === "matrix") {
    return (
      <MatrixControl
        question={question}
        answer={answer}
        submitted={submitted}
        languageMode={languageMode}
        onTerm={onTerm}
        onAnswer={onAnswer}
      />
    );
  }
  if (question.itemType === "highlight") {
    return (
      <HighlightControl
        question={question}
        answer={answer}
        submitted={submitted}
        languageMode={languageMode}
        onAnswer={onAnswer}
      />
    );
  }
  if (question.itemType === "bowtie") {
    return (
      <BowtieControl
        question={question}
        answer={answer}
        submitted={submitted}
        languageMode={languageMode}
        onTerm={onTerm}
        onAnswer={onAnswer}
      />
    );
  }
  if (question.itemType === "case_study") {
    return (
      <CaseStudyControl
        question={question}
        answer={answer}
        submitted={submitted}
        languageMode={languageMode}
        voiceEnabled={voiceEnabled}
        onTerm={onTerm}
        onAnswer={onAnswer}
        focusedPartId={focusedPartId}
      />
    );
  }
  return (
    <DropdownClozeControl
      question={question}
      answer={answer}
      submitted={submitted}
      languageMode={languageMode}
      onAnswer={onAnswer}
    />
  );
}

function BowtieControl({
  question,
  answer,
  submitted,
  languageMode,
  onTerm,
  onAnswer,
}: {
  question: Extract<Question, { itemType: "bowtie" }>;
  answer: AnswerState;
  submitted: boolean;
  languageMode: LanguageMode;
  onTerm: (term: GlossaryTerm) => void;
  onAnswer: (answer: AnswerState) => void;
}) {
  const zoneConfig = [
    { name: "actions", label: "Actions to take", targetCount: 2 },
    { name: "condition", label: "Most likely condition", targetCount: 1 },
    { name: "parameters", label: "Parameters to monitor", targetCount: 2 },
  ] as const;
  const placements = answer.bowtie ?? {};

  const updateZone = (
    zoneName: (typeof zoneConfig)[number]["name"],
    tokenIds: string[],
  ) => {
    onAnswer({
      ...answer,
      bowtie: {
        ...placements,
        [zoneName]: tokenIds,
      },
    });
  };

  return (
    <div className="bowtie-panel" aria-label="Bowtie response diagram">
      {zoneConfig.map(({ name, label, targetCount }) => {
        const zone = question.bowtie[name];
        const tokenById = new Map(zone.tokens.map((token) => [token.id, token]));
        const current = Array.from(new Set((placements[name] ?? []).filter((id) => tokenById.has(id)))).slice(0, targetCount);
        const correctIds = new Set(Array.isArray(zone.correct) ? zone.correct : [zone.correct]);
        const prompt = zone.prompt ?? { en: label, zh: name === "actions" ? "应采取的措施" : name === "condition" ? "最可能的病情" : "应监测的指标" };

        const placeToken = (tokenId: string) => {
          if (submitted || current.includes(tokenId) || current.length >= targetCount) return;
          updateZone(name, [...current, tokenId]);
        };
        const clearSlot = (slotIndex: number) => {
          if (submitted) return;
          updateZone(name, current.filter((_, index) => index !== slotIndex));
        };

        return (
          <section className={`bowtie-zone bowtie-${name}`} key={name}>
            <div className="bowtie-zone-heading">
              <BilingualText pair={prompt} mode={languageMode} glossary={question.glossary} onTerm={onTerm} />
            </div>
            <div className="bowtie-slots">
              {Array.from({ length: targetCount }, (_, slotIndex) => {
                const token = tokenById.get(current[slotIndex] ?? "");
                const correct = token ? correctIds.has(token.id) : false;
                const statusClass = submitted ? (correct ? "correct" : "incorrect") : token ? "filled" : "";
                return (
                  <button
                    className={`bowtie-slot ${statusClass}`}
                    type="button"
                    key={`${name}-${slotIndex}`}
                    disabled={submitted || !token}
                    aria-pressed={Boolean(token)}
                    aria-label={
                      token
                        ? `${label} slot ${slotIndex + 1}: ${token.en}. ${submitted ? (correct ? "Correct." : "Incorrect.") : "Activate to clear."}`
                        : `${label} slot ${slotIndex + 1}: empty`
                    }
                    onClick={() => clearSlot(slotIndex)}
                  >
                    <span className="bowtie-slot-number">{slotIndex + 1}</span>
                    {token ? (
                      <BilingualText pair={token} mode={languageMode} glossary={question.glossary} onTerm={onTerm} />
                    ) : (
                      <span className="bowtie-empty">Choose a token</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="bowtie-token-pool" aria-label={`${label} token choices`}>
              {zone.tokens.map((token) => {
                const selected = current.includes(token.id);
                return (
                  <button
                    className={`bowtie-token ${selected ? "selected" : ""}`}
                    type="button"
                    key={token.id}
                    disabled={submitted || selected || current.length >= targetCount}
                    aria-pressed={selected}
                    aria-label={`${token.en}${selected ? ", placed" : ""}`}
                    onClick={() => placeToken(token.id)}
                  >
                    <BilingualText pair={token} mode={languageMode} glossary={question.glossary} onTerm={onTerm} />
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div className="bowtie-key">
                <strong>Correct:</strong>
                {zone.tokens
                  .filter((token) => correctIds.has(token.id))
                  .map((token) => (
                    <BilingualText
                      pair={token}
                      mode={languageMode}
                      glossary={question.glossary}
                      onTerm={onTerm}
                      className="bowtie-key-token"
                      key={token.id}
                    />
                  ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function HighlightControl({
  question,
  answer,
  submitted,
  languageMode,
  onAnswer,
}: {
  question: Extract<Question, { itemType: "highlight" }>;
  answer: AnswerState;
  submitted: boolean;
  languageMode: LanguageMode;
  onAnswer: (answer: AnswerState) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const selectedIds = answer.segments ?? [];
  const correctIds = new Set(question.highlight.correct);
  const showZh = languageMode === "always" || (languageMode === "on-tap" && revealed);

  const toggleSegment = (segmentId: string) => {
    if (submitted) return;
    onAnswer({
      ...answer,
      segments: selectedIds.includes(segmentId)
        ? selectedIds.filter((id) => id !== segmentId)
        : [...selectedIds, segmentId],
    });
  };

  const renderLine = (locale: "en" | "zh") => (
    <p className={`highlight-line ${locale === "zh" ? "chinese-line" : ""}`} lang={locale === "zh" ? "zh-Hans" : undefined}>
      {question.highlight.segments.map((segment, index) => {
        const text = segment[locale];
        const selected = selectedIds.includes(segment.id);
        const correct = correctIds.has(segment.id);
        const statusClass = submitted
          ? selected && correct
            ? "correct"
            : selected
              ? "incorrect"
              : correct
                ? "missed"
                : ""
          : selected
            ? "selected"
            : "";
        return (
          <span className="highlight-segment-wrap" key={`${locale}-${segment.id}`}>
            {index > 0 && " "}
            {segment.selectable ? (
              <button
                className={`highlight-segment ${statusClass}`}
                type="button"
                aria-pressed={selected}
                disabled={submitted}
                onClick={() => toggleSegment(segment.id)}
              >
                {text}
              </button>
            ) : (
              <span className="highlight-static">{text}</span>
            )}
          </span>
        );
      })}
    </p>
  );

  return (
    <div className="highlight-panel">
      {renderLine("en")}
      {languageMode === "on-tap" && !revealed && (
        <button className="inline-reveal" type="button" onClick={() => setRevealed(true)}>
          需要中文
        </button>
      )}
      {showZh && renderLine("zh")}
      {submitted && (
        <div className="highlight-legend" aria-label="Highlight answer legend">
          <span className="correct">Correct selection</span>
          <span className="incorrect">Incorrect selection</span>
          <span className="missed">Missed correct selection</span>
        </div>
      )}
    </div>
  );
}

function OptionAnswerControl({
  question,
  answer,
  submitted,
  languageMode,
  voiceEnabled,
  onTerm,
  onAnswer,
}: {
  question: Extract<Question, { options: Option[]; correct: string[] }>;
  answer: AnswerState;
  submitted: boolean;
  languageMode: LanguageMode;
  voiceEnabled: boolean;
  onTerm: (term: GlossaryTerm) => void;
  onAnswer: (answer: AnswerState) => void;
}) {
  const selectedIds = answer.optionIds ?? (question.itemType === "ordered_response" ? question.options.map((option) => option.id) : []);
  const optionsById = new Map(question.options.map((option) => [option.id, option]));

  const toggleOption = (optionId: string) => {
    if (submitted || question.itemType === "ordered_response") return;
    if (question.itemType === "multiple_choice") {
      onAnswer({ ...answer, optionIds: [optionId] });
      return;
    }
    onAnswer({
      ...answer,
      optionIds: selectedIds.includes(optionId)
        ? selectedIds.filter((id) => id !== optionId)
        : [...selectedIds, optionId],
    });
  };

  const moveOrderedOption = (optionId: string, direction: -1 | 1) => {
    if (submitted) return;
    const currentIndex = selectedIds.indexOf(optionId);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= selectedIds.length) return;
    const next = [...selectedIds];
    [next[currentIndex], next[nextIndex]] = [next[nextIndex], next[currentIndex]];
    onAnswer({ ...answer, optionIds: next });
  };

  if (question.itemType === "ordered_response") {
    return (
      <div className="ordered-list">
        {selectedIds.map((optionId, index) => {
          const option = optionsById.get(optionId);
          if (!option) return null;
          const correctIndex = question.correct.indexOf(optionId);
          const statusClass = submitted ? (correctIndex === index ? "correct" : "incorrect") : "";
          return (
            <div className={`ordered-row ${statusClass}`} key={option.id}>
              <span className="order-number">{index + 1}</span>
              <BilingualText pair={option} mode={languageMode} glossary={question.glossary} onTerm={onTerm} />
              <SpeakButton text={option.en} enabled={voiceEnabled} label={`Read option ${option.id}`} />
              <div className="order-buttons">
                <button type="button" onClick={() => moveOrderedOption(option.id, -1)} disabled={submitted || index === 0}>
                  <MoveUp aria-hidden="true" />
                  <span className="sr-only">Move up</span>
                </button>
                <button
                  type="button"
                  onClick={() => moveOrderedOption(option.id, 1)}
                  disabled={submitted || index === selectedIds.length - 1}
                >
                  <MoveDown aria-hidden="true" />
                  <span className="sr-only">Move down</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="options-list">
      {question.options.map((option) => {
        const selected = selectedIds.includes(option.id);
        const correct = question.correct.includes(option.id);
        const statusClass = submitted ? (correct ? "correct" : selected ? "incorrect" : "") : selected ? "selected" : "";
        return (
          <button
            className={`option-row ${statusClass}`}
            key={option.id}
            type="button"
            onClick={() => toggleOption(option.id)}
            aria-pressed={selected}
          >
            <span className="option-control" aria-hidden="true">
              {question.itemType === "multiple_choice" ? (selected ? "●" : "○") : selected ? "☑" : "☐"}
            </span>
            <span className="option-id">{option.id}</span>
            <BilingualText pair={option} mode={languageMode} glossary={question.glossary} onTerm={onTerm} />
            <SpeakButton text={option.en} enabled={voiceEnabled} label={`Read option ${option.id}`} />
          </button>
        );
      })}
    </div>
  );
}

function FillInBlankControl({
  question,
  answer,
  submitted,
  languageMode,
  onAnswer,
}: {
  question: Extract<Question, { itemType: "fill_in_blank" }>;
  answer: AnswerState;
  submitted: boolean;
  languageMode: LanguageMode;
  onAnswer: (answer: AnswerState) => void;
}) {
  const blanks = answer.blanks ?? {};
  return (
    <div className="blank-list">
      {question.blanks.map((blank) => {
        const value = blanks[blank.id] ?? "";
        const isCorrect = gradeQuestion({ ...question, blanks: [blank] }, { blanks: { [blank.id]: value } });
        const statusClass = submitted ? (isCorrect ? "correct" : "incorrect") : "";
        return (
          <label className={`blank-row ${statusClass}`} key={blank.id}>
            <BilingualText pair={blank.prompt} mode={languageMode} />
            <div className="blank-input-row">
              <input
                value={value}
                disabled={submitted}
                inputMode={blank.numeric ? "decimal" : "text"}
                onChange={(event) => onAnswer({ ...answer, blanks: { ...blanks, [blank.id]: event.target.value } })}
              />
              {blank.numeric?.unit && <span>{blank.numeric.unit}</span>}
            </div>
          </label>
        );
      })}
    </div>
  );
}

function MatrixControl({
  question,
  answer,
  submitted,
  languageMode,
  onTerm,
  onAnswer,
}: {
  question: Extract<Question, { itemType: "matrix" }>;
  answer: AnswerState;
  submitted: boolean;
  languageMode: LanguageMode;
  onTerm: (term: GlossaryTerm) => void;
  onAnswer: (answer: AnswerState) => void;
}) {
  const matrixAnswer = answer.matrix ?? {};
  const correctByRow = new Map(question.correct.map((entry) => [entry.rowId, entry.columnIds]));
  const toggleCell = (rowId: string, columnId: string) => {
    if (submitted) return;
    const current = matrixAnswer[rowId] ?? [];
    const next =
      question.matrix.selectionMode === "single_per_row"
        ? [columnId]
        : current.includes(columnId)
          ? current.filter((id) => id !== columnId)
          : [...current, columnId];
    onAnswer({ ...answer, matrix: { ...matrixAnswer, [rowId]: next } });
  };

  return (
    <div className="matrix-wrap">
      <table className="matrix-table">
        <thead>
          <tr>
            <th scope="col">Finding</th>
            {question.matrix.columns.map((column) => (
              <th scope="col" key={column.id}>
                <BilingualText pair={column} mode={languageMode} glossary={question.glossary} onTerm={onTerm} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {question.matrix.rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">
                <BilingualText pair={row} mode={languageMode} glossary={question.glossary} onTerm={onTerm} />
              </th>
              {question.matrix.columns.map((column) => {
                const selected = matrixAnswer[row.id]?.includes(column.id) ?? false;
                const correct = correctByRow.get(row.id)?.includes(column.id) ?? false;
                const statusClass = submitted ? (correct ? "correct" : selected ? "incorrect" : "") : selected ? "selected" : "";
                return (
                  <td className={statusClass} key={column.id}>
                    <button type="button" onClick={() => toggleCell(row.id, column.id)} aria-pressed={selected}>
                      {question.matrix.selectionMode === "single_per_row" ? (selected ? "●" : "○") : selected ? "☑" : "☐"}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DropdownClozeControl({
  question,
  answer,
  submitted,
  languageMode,
  onAnswer,
}: {
  question: Extract<Question, { itemType: "dropdown_cloze" }>;
  answer: AnswerState;
  submitted: boolean;
  languageMode: LanguageMode;
  onAnswer: (answer: AnswerState) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const dropdowns = answer.dropdowns ?? {};
  const showZh = languageMode === "always" || (languageMode === "on-tap" && revealed);

  return (
    <div className="cloze-panel">
      <ClozeLine
        text={question.clozeStem.en}
        question={question}
        selections={dropdowns}
        submitted={submitted}
        locale="en"
        interactive
        onSelect={(dropdownId, optionId) => onAnswer({ ...answer, dropdowns: { ...dropdowns, [dropdownId]: optionId } })}
      />
      {languageMode === "on-tap" && !revealed && (
        <button className="inline-reveal" type="button" onClick={() => setRevealed(true)}>
          需要中文
        </button>
      )}
      {showZh && (
        <ClozeLine
          text={question.clozeStem.zh}
          question={question}
          selections={dropdowns}
          submitted={submitted}
          locale="zh"
        />
      )}
    </div>
  );
}

function ClozeLine({
  text,
  question,
  selections,
  submitted,
  locale,
  interactive = false,
  onSelect,
}: {
  text: string;
  question: Extract<Question, { itemType: "dropdown_cloze" }>;
  selections: Record<string, string>;
  submitted: boolean;
  locale: "en" | "zh";
  interactive?: boolean;
  onSelect?: (dropdownId: string, optionId: string) => void;
}) {
  const dropdownById = new Map(question.dropdowns.map((dropdown) => [dropdown.id, dropdown]));
  const parts = text.split(/(\{\{[^{}]+\}\})/g);
  return (
    <p className={`cloze-line ${locale === "zh" ? "chinese-line" : ""}`}>
      {parts.map((part, index) => {
        const match = part.match(/^\{\{([^{}]+)\}\}$/);
        if (!match) return <span key={`${part}-${index}`}>{part}</span>;
        const dropdown = dropdownById.get(match[1].trim());
        if (!dropdown) return <span key={`${part}-${index}`}>{part}</span>;
        const value = selections[dropdown.id] ?? "";
        const statusClass = submitted ? (value === dropdown.correct ? "correct" : "incorrect") : "";
        if (!interactive) {
          const selectedOption = dropdown.options.find((option) => option.id === value);
          return (
            <span className={`cloze-token ${statusClass}`} key={`${dropdown.id}-${index}`}>
              {selectedOption ? (locale === "en" ? selectedOption.en : selectedOption.zh) : "____"}
            </span>
          );
        }
        return (
          <select
            className={`cloze-select ${statusClass}`}
            key={`${dropdown.id}-${index}`}
            value={value}
            disabled={submitted}
            onChange={(event) => onSelect?.(dropdown.id, event.target.value)}
          >
            <option value="">Choose</option>
            {dropdown.options.map((option) => (
              <option key={option.id} value={option.id}>
                {locale === "en" ? option.en : option.zh}
              </option>
            ))}
          </select>
        );
      })}
    </p>
  );
}

function CaseStudyControl({
  question,
  answer,
  submitted,
  languageMode,
  voiceEnabled,
  onTerm,
  onAnswer,
  focusedPartId,
}: {
  question: Extract<Question, { itemType: "case_study" }>;
  answer: AnswerState;
  submitted: boolean;
  languageMode: LanguageMode;
  voiceEnabled: boolean;
  onTerm: (term: GlossaryTerm) => void;
  onAnswer: (answer: AnswerState) => void;
  focusedPartId?: string;
}) {
  const caseAnswers = answer.caseStudy ?? {};
  const updateCaseAnswer = (questionId: string, nextAnswer: AnswerState) => {
    onAnswer({ ...answer, caseStudy: { ...caseAnswers, [questionId]: nextAnswer } });
  };

  return (
    <div className="case-study-panel">
      <div className="case-study-header">
        <BilingualText pair={question.caseStudy.title} mode={languageMode} glossary={question.glossary} onTerm={onTerm} />
        {question.caseStudy.summary && (
          <BilingualText pair={question.caseStudy.summary} mode={languageMode} glossary={question.glossary} onTerm={onTerm} />
        )}
      </div>

      <div className="case-exhibits">
        {question.caseStudy.exhibits.map((exhibit) => (
          <CaseExhibit key={exhibit.id} exhibit={exhibit} languageMode={languageMode} glossary={question.glossary} onTerm={onTerm} />
        ))}
      </div>

      {question.caseStudy.stages?.map((stage) => (
        <section className="case-stage" key={stage.id}>
          <BilingualText pair={stage.title} mode={languageMode} className="case-stage-title" />
          <div className="case-exhibits">
            {stage.exhibits.map((exhibit) => (
              <CaseExhibit key={exhibit.id} exhibit={exhibit} languageMode={languageMode} glossary={question.glossary} onTerm={onTerm} />
            ))}
          </div>
        </section>
      ))}

      <div className="case-question-list">
        {question.caseStudy.questions.map((caseQuestion, index) => {
          const caseAnswer = caseAnswers[caseQuestion.id] ?? getInitialAnswer(caseQuestion);
          const caseResult = submitted ? gradeQuestion(caseQuestion, caseAnswer) : undefined;
          const caseScore = submitted ? scoreQuestion(caseQuestion, caseAnswer) : undefined;
          const statusClass = submitted ? (caseResult ? "correct" : "incorrect") : "";
          return (
            <section
              className={`case-question ${statusClass} ${focusedPartId === caseQuestion.id ? "focused" : ""}`}
              key={caseQuestion.id}
              data-case-part-id={caseQuestion.id}
            >
              <div className="case-question-heading">
                <span className="type-pill">Part {index + 1}</span>
                <span className="type-pill">{formatItemType(caseQuestion.itemType)}</span>
                {submitted && (
                  <span className={caseResult ? "type-pill" : "missed-pill"}>
                    {caseResult
                      ? "Correct"
                      : caseScore && caseScore.possible > 1
                        ? `${caseScore.earned} of ${caseScore.possible} points · Review`
                        : "Review"}
                  </span>
                )}
              </div>
              <VisualStimulus visual={caseQuestion.visual} languageMode={languageMode} />
              <div className="stem-row">
                <BilingualText
                  pair={caseQuestion.stem}
                  mode={languageMode}
                  className="case-question-stem"
                  glossary={caseQuestion.glossary}
                  onTerm={onTerm}
                />
                <SpeakButton text={caseQuestion.stem.en} enabled={voiceEnabled} label={`Read case part ${index + 1}`} />
                <ReadAllButton question={caseQuestion} enabled={voiceEnabled} />
              </div>
              <QuestionAnswerControl
                question={caseQuestion}
                answer={caseAnswer}
                submitted={submitted}
                languageMode={languageMode}
                voiceEnabled={voiceEnabled}
                onTerm={onTerm}
                onAnswer={(nextAnswer) => updateCaseAnswer(caseQuestion.id, nextAnswer)}
              />
              {submitted && <RationalePanel question={caseQuestion} title="Part rationale" voiceEnabled={voiceEnabled} languageMode={languageMode} />}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function CaseExhibit({
  exhibit,
  languageMode,
  glossary,
  onTerm,
}: {
  exhibit: CaseStudyExhibit;
  languageMode: LanguageMode;
  glossary: GlossaryTerm[];
  onTerm: (term: GlossaryTerm) => void;
}) {
  return (
    <section className="case-exhibit">
      <BilingualText pair={exhibit.title} mode={languageMode} className="case-exhibit-title" glossary={glossary} onTerm={onTerm} />
      <VisualStimulus visual={exhibit.visual} languageMode={languageMode} />
      <BilingualText pair={exhibit.content} mode={languageMode} className="case-exhibit-content" glossary={glossary} onTerm={onTerm} />
    </section>
  );
}

function BilingualText({
  pair,
  mode,
  className = "",
  glossary = [],
  onTerm,
}: {
  pair: { en: string; zh: string };
  mode: LanguageMode;
  className?: string;
  glossary?: GlossaryTerm[];
  onTerm?: (term: GlossaryTerm) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const showZh = mode === "always" || (mode === "on-tap" && revealed);

  return (
    <span className={`bilingual-text ${className}`}>
      <span className="english-line" onClick={() => mode === "on-tap" && setRevealed(true)}>
        <GlossaryText text={pair.en} glossary={glossary} onTerm={onTerm} />
      </span>
      {mode === "on-tap" && !revealed && (
        <button className="inline-reveal" type="button" onClick={() => setRevealed(true)}>
          需要中文
        </button>
      )}
      {showZh && <span className="chinese-line">{pair.zh}</span>}
    </span>
  );
}

function GlossaryText({
  text,
  glossary,
  onTerm,
}: {
  text: string;
  glossary: GlossaryTerm[];
  onTerm?: (term: GlossaryTerm) => void;
}) {
  if (!onTerm || glossary.length === 0) return <>{text}</>;
  const terms = glossary
    .filter((term) => term.termEn.trim().length > 0)
    .sort((left, right) => right.termEn.length - left.termEn.length);
  if (terms.length === 0) return <>{text}</>;
  const expression = new RegExp(`(${terms.map((term) => escapeRegex(term.termEn)).join("|")})`, "gi");
  const parts = text.split(expression);
  return (
    <>
      {parts.map((part, index) => {
        const term = terms.find((candidate) => candidate.termEn.toLowerCase() === part.toLowerCase());
        if (!term) return <span key={`${part}-${index}`}>{part}</span>;
        return (
          <button className="term-button" type="button" key={`${part}-${index}`} onClick={(event) => {
            event.stopPropagation();
            onTerm(term);
          }}>
            {part}
          </button>
        );
      })}
    </>
  );
}

function SpeakButton({ text, enabled, label }: { text: string; enabled: boolean; label: string }) {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  return (
    <button className="speak-button" type="button" aria-label={label} title={label} onClick={() => speakEnglish(text)}>
      <Volume2 aria-hidden="true" />
    </button>
  );
}

// Collects the English text to read aloud for a "read all" pass: the stem,
// followed by each answer option (when the item type has them).
function collectReadableEnglish(question: Question): string[] {
  const parts: string[] = [question.stem.en];
  if (question.itemType === "highlight") {
    parts.push(question.highlight.segments.map((segment) => segment.en).join(" "));
    return parts;
  }
  if (question.itemType === "bowtie") {
    for (const zone of [question.bowtie.condition, question.bowtie.actions, question.bowtie.parameters]) {
      if (zone.prompt) parts.push(zone.prompt.en);
      parts.push(...zone.tokens.map((token) => token.en));
    }
    return parts;
  }
  const options = (question as Partial<OptionQuestion>).options;
  if (Array.isArray(options)) {
    for (const option of options) {
      parts.push(`${option.id}. ${option.en}`);
    }
  }
  return parts;
}

function ReadAllButton({ question, enabled }: { question: Question; enabled: boolean }) {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const label = "Read stem and options";
  return (
    <button
      className="speak-button read-all-button"
      type="button"
      aria-label={label}
      title={label}
      onClick={() => speakEnglishSequence(collectReadableEnglish(question))}
    >
      <AudioLines aria-hidden="true" />
      <span>All</span>
    </button>
  );
}

function RationalePanel({
  question,
  title = "Rationale",
  voiceEnabled = false,
  languageMode,
}: {
  question: Question;
  title?: string;
  voiceEnabled?: boolean;
  languageMode: LanguageMode;
}) {
  const choiceRationales = question.rationale.byChoice ?? [];
  return (
    <section className="rationale-panel">
      <div className="rationale-heading">
        <h3>{title}</h3>
        <SpeakButton text={question.rationale.correct.en} enabled={voiceEnabled} label="Read rationale" />
      </div>
      <div className="dual-copy">
        <p>{question.rationale.correct.en}</p>
        <p lang="zh-Hans">{question.rationale.correct.zh}</p>
      </div>
      {question.rationale.visuals && question.rationale.visuals.length > 0 && (
        <div className="rationale-visuals">
          {question.rationale.visuals.map((visual, index) => (
            <VisualStimulus key={index} visual={visual} languageMode={languageMode} />
          ))}
        </div>
      )}
      {choiceRationales.length > 0 && (
        <>
          <h4>Per choice</h4>
          <div className="choice-rationales">
            {choiceRationales.map((choice) => (
              <div key={choice.refId}>
                <strong>{choice.refId}</strong>
                <p>{choice.en}</p>
                <p lang="zh-Hans">{choice.zh}</p>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="rationale-heading">
        <h4>Strategy</h4>
        <SpeakButton text={question.testTakingStrategy.en} enabled={voiceEnabled} label="Read strategy" />
      </div>
      <div className="dual-copy">
        <p>{question.testTakingStrategy.en}</p>
        <p lang="zh-Hans">{question.testTakingStrategy.zh}</p>
      </div>
      <div className="glossary-strip">
        {question.glossary.map((term) => (
          <span key={term.termEn}>
            {term.termEn} · {term.termZh}
          </span>
        ))}
      </div>
    </section>
  );
}

function SummaryView({
  session,
  flags,
  onToggleFlag,
  voiceEnabled,
  defaultLanguageMode,
  onHome,
  homeLabel,
  relatedCount,
  onPracticeRelated,
}: {
  session: SessionState;
  flags: Record<string, QuestionFlag>;
  onToggleFlag: (questionId: string) => void;
  voiceEnabled: boolean;
  defaultLanguageMode: LanguageMode;
  onHome: () => void;
  homeLabel: string;
  relatedCount: number;
  onPracticeRelated: () => void;
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [reviewScope, setReviewScope] = useState<"missed" | "answered" | "flagged">("missed");
  const [languageMode, setLanguageMode] = useState<LanguageMode>(defaultLanguageMode);
  const answered = Object.keys(session.results).length;
  const correct = Object.values(session.results).filter(Boolean).length;
  const incorrect = answered - correct;
  const skipped = session.skippedQuestionIds.length;
  const hasCompleteScores =
    answered > 0 &&
    Object.keys(session.scores).length === answered &&
    Object.keys(session.results).every((questionId) => session.scores[questionId]?.possible > 0);
  const pointTotals = hasCompleteScores
    ? Object.keys(session.results).reduce<ItemScore>(
        (total, questionId) => ({
          earned: total.earned + session.scores[questionId].earned,
          possible: total.possible + session.scores[questionId].possible,
        }),
        { earned: 0, possible: 0 },
      )
    : undefined;
  const scorePercent = pointTotals ? Math.round((pointTotals.earned / pointTotals.possible) * 100) : undefined;
  const answeredQuestions = session.questions.filter((question) =>
    Object.prototype.hasOwnProperty.call(session.results, question.id),
  );
  const missed = session.questions.filter((question) => session.results[question.id] === false);
  const byCategory = answeredQuestions.reduce<Record<string, { total: number; correct: number }>>((acc, question) => {
    const current = acc[question.category] ?? { total: 0, correct: 0 };
    current.total += 1;
    if (session.results[question.id]) current.correct += 1;
    acc[question.category] = current;
    return acc;
  }, {});
  const byDifficulty = answeredQuestions.reduce<Record<string, { total: number; correct: number }>>((acc, question) => {
    const current = acc[question.difficulty] ?? { total: 0, correct: 0 };
    current.total += 1;
    if (session.results[question.id]) current.correct += 1;
    acc[question.difficulty] = current;
    return acc;
  }, {});
  const byTopic = answeredQuestions.reduce<Record<string, { total: number; correct: number }>>((acc, question) => {
    const current = acc[question.topic] ?? { total: 0, correct: 0 };
    current.total += 1;
    if (session.results[question.id]) current.correct += 1;
    acc[question.topic] = current;
    return acc;
  }, {});
  const topicRows = Object.entries(byTopic).sort(([leftTopic, leftCounts], [rightTopic, rightCounts]) => {
    const leftAccuracy = leftCounts.correct / leftCounts.total;
    const rightAccuracy = rightCounts.correct / rightCounts.total;
    return leftAccuracy - rightAccuracy || rightCounts.total - leftCounts.total || leftTopic.localeCompare(rightTopic);
  });
  const flaggedQuestions = answeredQuestions.filter((question) => flags[question.id]?.flagged);
  const reviewQuestions =
    reviewScope === "missed" ? missed : reviewScope === "answered" ? answeredQuestions : flaggedQuestions;
  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="stack">
      <div className="summary-hero">
        <p className="eyebrow">{session.mode === "adaptive" ? "Exam-condition practice" : "Summary"}</p>
        <h2>
          {scorePercent !== undefined ? `Score ${scorePercent}%` : `Mastered ${correct} / ${answered}`}
        </h2>
        {pointTotals && (
          <p className="summary-score-detail">
            {pointTotals.earned} of {pointTotals.possible} points · Mastered {correct}/{answered}
          </p>
        )}
        <p className="summary-counts">
          Answered {answered} · Mastered {correct} · Review {incorrect} · Skipped {skipped}
        </p>
        {session.mode === "adaptive" && (
          <p className="muted-copy">Adaptive practice changes difficulty by rolling performance. It is not a pass/fail or readiness estimate.</p>
        )}
        <div className="action-row">
          <button className="primary-action" type="button" onClick={onHome}>
            <Home aria-hidden="true" />
            <span>{homeLabel}</span>
          </button>
          <button type="button" onClick={onPracticeRelated} disabled={relatedCount === 0}>
            <RotateCcw aria-hidden="true" />
            <span>Practice related</span>
          </button>
        </div>
      </div>

      <div className="category-breakdown">
        {Object.entries(byCategory).map(([category, counts]) => (
          <div key={category}>
            <span>{category}</span>
            <strong>
              {counts.correct}/{counts.total}
            </strong>
          </div>
        ))}
      </div>

      {Object.keys(byDifficulty).length > 0 && (
        <div className="category-breakdown">
          {Object.entries(byDifficulty).map(([difficulty, counts]) => (
            <div key={difficulty}>
              <span>{difficulty}</span>
              <strong>
                {counts.correct}/{counts.total}
              </strong>
            </div>
          ))}
        </div>
      )}

      {topicRows.length > 0 && (
        <section className="stack compact-stack">
          <h3>Topics from this set</h3>
          <div className="category-breakdown">
            {topicRows.map(([topic, counts]) => (
              <div key={topic}>
                <span>{topic}</span>
                <strong>
                  {counts.correct}/{counts.total}
                </strong>
              </div>
            ))}
          </div>
        </section>
      )}

      {session.adaptive && (
        <section className="dashboard-panel">
          <h3>Difficulty trajectory</h3>
          <div className="difficulty-trajectory">
            {session.adaptive.difficultyHistory.map((entry, index) => (
              <span className={`difficulty-dot ${entry.difficulty} ${entry.correct === false ? "missed" : ""}`} key={`${entry.questionId}-${index}`}>
                {entry.difficulty[0].toUpperCase()}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="stack compact-stack">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Review this set</p>
            <h3>{reviewQuestions.length} question{reviewQuestions.length === 1 ? "" : "s"}</h3>
          </div>
          <div className="action-row compact">
            {flaggedQuestions.length > 0 && (
              <button className="secondary-action" type="button" onClick={() => setReviewScope("flagged")}>
                <Flag aria-hidden="true" />
                <span>Flagged this set ({flaggedQuestions.length})</span>
              </button>
            )}
            <LanguageTabs value={languageMode} onChange={setLanguageMode} />
          </div>
        </div>

        <div className="segmented" role="group" aria-label="Review scope">
          {[
            ["missed", "Missed only"],
            ["answered", "All answered"],
            ["flagged", "Flagged"],
          ].map(([scope, label]) => (
            <button
              className={reviewScope === scope ? "active" : ""}
              type="button"
              key={scope}
              onClick={() => setReviewScope(scope as "missed" | "answered" | "flagged")}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="question-list">
          {reviewQuestions.length === 0 && (
            <div className="session-empty-state">
              <p>
                {reviewScope === "flagged"
                  ? "No flagged answered questions in this set."
                  : reviewScope === "missed"
                    ? "No missed answered questions in this set."
                    : "No answered questions in this set."}
              </p>
            </div>
          )}
          {reviewQuestions.map((question) => {
            const expanded = expandedIds.has(question.id);
            const result = session.results[question.id];
            return (
              <article className="summary-review-item" key={question.id}>
                <button
                  className="question-row interactive-row summary-review-toggle"
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => toggleExpanded(question.id)}
                >
                  <div>
                    <span className="type-pill">{formatItemType(question.itemType)}</span>
                    {!result && <span className="missed-pill">Missed</span>}
                    <h3>
                      <SummaryStemText pair={question.stem} mode={languageMode} />
                    </h3>
                    <p>{question.topic}</p>
                  </div>
                  <div className="row-status">
                    <span className={result ? "type-pill" : "missed-pill"}>{result ? "Correct" : "Missed"}</span>
                    <ChevronDown className={expanded ? "summary-review-chevron expanded" : "summary-review-chevron"} aria-hidden="true" />
                  </div>
                </button>
                {expanded && (
                  <div
                    className="summary-review-body"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <QuestionCard
                      question={question}
                      answer={session.answers[question.id] ?? getInitialAnswer(question)}
                      submitted
                      result={result}
                      languageMode={languageMode}
                      flagged={flags[question.id]?.flagged ?? false}
                      voiceEnabled={voiceEnabled}
                      onAnswer={() => undefined}
                      onSubmit={() => undefined}
                      onToggleFlag={() => onToggleFlag(question.id)}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}

function SummaryStemText({ pair, mode }: { pair: { en: string; zh: string }; mode: LanguageMode }) {
  return (
    <span className="bilingual-text">
      <span className="english-line">{pair.en}</span>
      {mode !== "off" && <span className="chinese-line">{pair.zh}</span>}
    </span>
  );
}

const applyFilters = (records: QuestionRecord[], filters: Filters) =>
  records.filter((record) => {
    if (filters.category !== "all" && record.question.category !== filters.category) return false;
    if (filters.topic !== "all" && record.question.topic !== filters.topic) return false;
    if (filters.difficulty !== "all" && record.question.difficulty !== filters.difficulty) return false;
    if (filters.source !== "all" && record.sourceLabel !== filters.source) return false;
    return true;
  });

const hasVisualStimulus = (question: Question): boolean => {
  if (question.visual !== undefined) return true;
  if (question.itemType !== "case_study") return false;
  return (
    question.caseStudy.exhibits.some((exhibit) => exhibit.visual !== undefined) ||
    (question.caseStudy.stages?.some((stage) => stage.exhibits.some((exhibit) => exhibit.visual !== undefined)) ?? false) ||
    question.caseStudy.questions.some((caseQuestion) => hasVisualStimulus(caseQuestion))
  );
};

const applyBuilderFilters = (
  records: QuestionRecord[],
  filters: BuilderFilters,
  progress: Record<string, QuestionProgress>,
  flags: Record<string, QuestionFlag>,
) =>
  records.filter((record) => {
    if (filters.categories.length > 0 && !filters.categories.includes(record.question.category)) return false;
    if (filters.withVisuals && !hasVisualStimulus(record.question)) return false;
    const itemProgress = progress[record.question.id];
    if (filters.status === "unseen") return (itemProgress?.seen ?? 0) === 0;
    if (filters.status === "answered") return (itemProgress?.seen ?? 0) > 0;
    if (filters.status === "incorrect") return (itemProgress?.incorrect ?? 0) > 0;
    if (filters.status === "flagged") return flags[record.question.id]?.flagged ?? false;
    if (filters.status === "due") return isDueForReview(itemProgress);
    return true;
  });

const buildRelatedPracticePool = (
  session: SessionState | null,
  records: QuestionRecord[],
  progress: Record<string, QuestionProgress>,
) => {
  if (!session) return [];
  const missedTopics = uniqueSorted(
    session.questions.filter((question) => session.results[question.id] === false).map((question) => question.topic),
  );
  if (missedTopics.length === 0) return [];
  const servedIds = new Set(session.questions.map((question) => question.id));
  const candidates = records.filter(
    (record) => missedTopics.includes(record.question.topic) && !servedIds.has(record.question.id),
  );
  const unseen = candidates.filter((record) => (progress[record.question.id]?.seen ?? 0) === 0);
  const seen = candidates.filter((record) => (progress[record.question.id]?.seen ?? 0) > 0);
  return [...shuffle(unseen), ...shuffle(seen)].slice(0, DEFAULT_SESSION_COUNT);
};

type AggregateRow = {
  label: string;
  available: number;
  seen: number;
  attempts: number;
  correct: number;
  flagged: number;
  accuracy: number;
};

const aggregateRows = (
  records: QuestionRecord[],
  progress: Record<string, QuestionProgress>,
  flags: Record<string, QuestionFlag>,
  labelFor: (record: QuestionRecord) => string,
): AggregateRow[] => {
  const rows = new Map<string, Omit<AggregateRow, "accuracy">>();
  records.forEach((record) => {
    const label = labelFor(record);
    const current = rows.get(label) ?? {
      label,
      available: 0,
      seen: 0,
      attempts: 0,
      correct: 0,
      flagged: 0,
    };
    const itemProgress = progress[record.question.id];
    current.available += 1;
    current.seen += (itemProgress?.seen ?? 0) > 0 ? 1 : 0;
    current.attempts += itemProgress?.seen ?? 0;
    current.correct += itemProgress?.correct ?? 0;
    current.flagged += flags[record.question.id]?.flagged ? 1 : 0;
    rows.set(label, current);
  });
  return Array.from(rows.values())
    .map((row) => ({ ...row, accuracy: row.attempts > 0 ? row.correct / row.attempts : 0 }))
    .sort((left, right) => right.attempts - left.attempts || left.label.localeCompare(right.label));
};

const buildFlashcardDeck = (records: QuestionRecord[]): FlashcardTerm[] => {
  const terms = new Map<
    string,
    GlossaryTerm & {
      categories: Set<string>;
      topics: Set<string>;
      questionIds: Set<string>;
    }
  >();

  records.forEach((record) => {
    const questionTerms = collectGlossarySources(record.question);
    questionTerms.forEach(({ term, category, topic, questionId }) => {
      const id = normalizeTermId(term);
      const existing =
        terms.get(id) ??
        ({
          ...term,
          categories: new Set<string>(),
          topics: new Set<string>(),
          questionIds: new Set<string>(),
        } satisfies GlossaryTerm & {
          categories: Set<string>;
          topics: Set<string>;
          questionIds: Set<string>;
        });
      existing.categories.add(category);
      existing.topics.add(topic);
      existing.questionIds.add(questionId);
      terms.set(id, existing);
    });
  });

  return Array.from(terms.entries())
    .map(([id, term]) => ({
      id,
      termEn: term.termEn,
      termZh: term.termZh,
      defZh: term.defZh,
      categories: Array.from(term.categories).sort(),
      topics: Array.from(term.topics).sort(),
      questionIds: Array.from(term.questionIds).sort(),
    }))
    .sort((left, right) => left.termEn.localeCompare(right.termEn));
};

const collectGlossarySources = (question: Question) => {
  const sources = question.glossary.map((term) => ({
    term,
    category: question.category,
    topic: question.topic,
    questionId: question.id,
  }));
  if (question.itemType === "case_study") {
    question.caseStudy.questions.forEach((caseQuestion) => {
      caseQuestion.glossary.forEach((term) => {
        sources.push({
          term,
          category: caseQuestion.category,
          topic: caseQuestion.topic,
          questionId: question.id,
        });
      });
    });
  }
  return sources;
};

const normalizeTermId = (term: GlossaryTerm) => `${term.termEn.trim().toLowerCase()}|${term.termZh.trim()}`;

const createSessionId = () => `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const toStoredSession = (session: SessionState): StoredSessionSnapshot => ({
  id: session.id,
  mode: session.mode,
  questionIds: session.questions.map((question) => question.id),
  poolIds: session.poolIds,
  index: session.index,
  answers: session.answers as Record<string, unknown>,
  results: session.results,
  scores: session.scores,
  skippedQuestionIds: session.skippedQuestionIds,
  phase: session.phase,
  languageMode: session.languageMode,
  title: session.title,
  startedAt: session.startedAt,
  updatedAt: new Date().toISOString(),
  adaptive: session.adaptive,
});

const hydrateSession = (
  snapshot: StoredSessionSnapshot,
  recordsById: Map<string, QuestionRecord>,
): SessionState | null => {
  const questions = snapshot.questionIds
    .map((questionId) => recordsById.get(questionId)?.question)
    .filter((question): question is Question => Boolean(question));
  if (questions.length === 0) return null;
  const poolIds = snapshot.poolIds.filter((questionId) => recordsById.has(questionId));
  const questionIds = new Set(questions.map((question) => question.id));
  const skippedQuestionIds = snapshot.mode === "study"
    ? Array.from(new Set(snapshot.skippedQuestionIds ?? [])).filter(
        (questionId) => questionIds.has(questionId) && !Object.prototype.hasOwnProperty.call(snapshot.results, questionId),
      )
    : [];
  const requestedPhase = snapshot.mode === "study" ? snapshot.phase ?? "questions" : "questions";
  const phase = skippedQuestionIds.length === 0 && requestedPhase !== "questions" ? "questions" : requestedPhase;
  return {
    id: snapshot.id,
    mode: snapshot.mode,
    questions,
    poolIds: poolIds.length > 0 ? poolIds : questions.map((question) => question.id),
    index: Math.min(snapshot.index, questions.length - 1),
    answers: snapshot.answers as Record<string, AnswerState>,
    results: snapshot.results,
    scores: snapshot.scores ?? {},
    skippedQuestionIds,
    phase,
    languageMode: snapshot.languageMode,
    title: snapshot.title,
    startedAt: snapshot.startedAt,
    adaptive: snapshot.adaptive,
  };
};

const difficultyOrder: Difficulty[] = ["easy", "medium", "hard"];

const difficultyIndex = (difficulty: Difficulty) => difficultyOrder.indexOf(difficulty);

const selectRecordForDifficulty = (records: QuestionRecord[], targetDifficulty: Difficulty) => {
  const rankedDifficulties = [...difficultyOrder].sort(
    (left, right) => Math.abs(difficultyIndex(left) - difficultyIndex(targetDifficulty)) - Math.abs(difficultyIndex(right) - difficultyIndex(targetDifficulty)),
  );
  for (const difficulty of rankedDifficulties) {
    const match = records.find((record) => record.question.difficulty === difficulty);
    if (match) return match;
  }
  return records[0];
};

const selectNextAdaptiveRecord = (session: SessionState, recordsById: Map<string, QuestionRecord>) => {
  const served = new Set(session.questions.map((question) => question.id));
  const candidates = session.poolIds
    .filter((questionId) => !served.has(questionId))
    .map((questionId) => recordsById.get(questionId))
    .filter((record): record is QuestionRecord => Boolean(record));
  return selectRecordForDifficulty(candidates, session.adaptive?.currentDifficulty ?? "medium");
};

const updateAdaptiveAfterAnswer = (adaptive: AdaptiveSessionSnapshot, question: Question, wasCorrect: boolean): AdaptiveSessionSnapshot => {
  const rollingResults = [...adaptive.rollingResults.slice(-3), wasCorrect];
  const rollingAccuracy = rollingResults.filter(Boolean).length / rollingResults.length;
  const currentIndex = difficultyIndex(adaptive.currentDifficulty);
  const nextDifficulty =
    rollingResults.length >= 3 && rollingAccuracy >= 0.75
      ? difficultyOrder[Math.min(difficultyOrder.length - 1, currentIndex + 1)]
      : rollingResults.length >= 3 && rollingAccuracy <= 0.4
        ? difficultyOrder[Math.max(0, currentIndex - 1)]
        : adaptive.currentDifficulty;
  const difficultyHistory = adaptive.difficultyHistory.some((entry) => entry.questionId === question.id)
    ? adaptive.difficultyHistory.map((entry) => (entry.questionId === question.id ? { ...entry, correct: wasCorrect } : entry))
    : [...adaptive.difficultyHistory, { questionId: question.id, difficulty: question.difficulty, correct: wasCorrect }];

  return {
    ...adaptive,
    currentDifficulty: nextDifficulty,
    rollingResults,
    difficultyHistory,
  };
};

const uniqueSorted = (values: string[]) => Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const formatItemType = (itemType: Question["itemType"]) =>
  itemType === "multiple_choice"
    ? "Single best answer"
    : itemType === "select_all"
      ? "SATA"
      : itemType === "case_study"
        ? "Case study"
        : itemType === "highlight"
          ? "Highlight"
          : itemType === "bowtie"
            ? "Bowtie"
        : itemType.replace(/_/g, " ");

// Tracks the last single-tap utterance so that re-tapping the *same* text
// alternates the playback rate (normal -> 0.8x -> normal ...). Playing any new
// text, or using the sequential reader, resets this back to normal.
let lastSpokenText: string | null = null;
let lastPlayWasSlow = false;

const SLOW_RATE = 0.8;

const speakUtterance = (text: string, rate: number) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  const voice = window.speechSynthesis.getVoices().find((candidate) => candidate.lang.toLowerCase().startsWith("en-us"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
};

const speakEnglish = (text: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  let rate = 1;
  if (text === lastSpokenText) {
    // Same element re-tapped: "I didn't catch that" -> alternate the rate.
    lastPlayWasSlow = !lastPlayWasSlow;
    rate = lastPlayWasSlow ? SLOW_RATE : 1;
  } else {
    lastSpokenText = text;
    lastPlayWasSlow = false;
  }
  speakUtterance(text, rate);
};

// Reads several pieces of text in order (e.g. stem then each option). Always
// plays at normal rate and clears the single-tap alternation state.
const speakEnglishSequence = (texts: string[]) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const parts = texts.map((text) => text.trim()).filter((text) => text.length > 0);
  if (parts.length === 0) return;
  lastSpokenText = null;
  lastPlayWasSlow = false;
  parts.forEach((part) => speakUtterance(part, 1));
};
