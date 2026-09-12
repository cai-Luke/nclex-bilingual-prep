import { captureAttempt, questionFingerprint, makeCompletedSet, entryCompatibility, answerFitsQuestion } from "./completedMemory";
import { commitSubmission, completeSession, loadCompletedSet, subscribePersistence, type PersistenceStatus } from "./storage";
import type { CompletedSet, LaunchIntent, SessionReturnView, SubmittedAttempt } from "./types";
import { formatCaseVisibilityBoundary } from "./caseVisibilityBoundary";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import {
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  AudioLines,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileJson,
  Flag,
  Home,
  Import,
  Library,
  Image,
  MoveDown,
  MoveUp,
  Play,
  Search,
  Copy,
  RotateCcw,
  Settings as SettingsIcon,
  SlidersHorizontal,
  Volume2,
  Wrench,
  XCircle,
} from "lucide-react";
import { loadBundledRecords } from "./banks";
import { bankProvenance, type BankProvenanceEntry } from "./bankProvenance";
import { importQuestionsFromText, toExportEnvelope } from "./bankImport";
import {
  type AnswerState,
  getAnswerCompleteness,
  getCorrectAnswer,
  getInitialAnswer,
  gradeStandaloneQuestion,
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
  loadActiveSession,
  loadAnswerEvents,
  loadFlags,
  loadProgress,
  loadSettings,
  loadUploadedRecords,
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
import { buildWeightedSession, buildUnweightedSession, selectExplicitPopulation } from "./sessionSampler";
import { buildSessionState, type SessionState } from "./sessionState";
import { createOrderedSessionPersistence, createSessionStartGuard, type SessionStartStatus } from "./sessionStartGuard";
import { formatItemType } from "./itemTypes";
import { buildQuestionRescuePromptText } from "./reviewPrompt";
import { StructuredMeasurementsStimulus } from "./StructuredMeasurementsStimulus";
import { ExamCalculator } from "./ExamCalculatorPanel";
import { VisualStimulus } from "./visuals";
import { mulberry32 } from "./visuals/primitives/prng";
import { STANDALONE_SPLIT_VISUAL_KINDS, getVisibleCaseStages, usesStandaloneVisualSplit } from "./examLayout";
import { useAppUpdate } from "./appUpdate";
import { formatAppBuildDiagnostic } from "../lib/app-update-core";
import type { AppBuildInfo } from "../lib/app-build-info";
import type {
  AdaptiveSessionSnapshot,
  AnswerEvent,
  Category,
  CaseStudyQuestion,
  CaseStudyExhibit,
  Difficulty,
  GlossaryTerm,
  ImportSummary,
  ItemScore,
  ItemType,
  LanguageMode,
  Option,
  OptionQuestion,
  Question,
  QuestionFlag,
  QuestionProgress,
  QuestionRecord,
  QuestionVisual,
  SessionMode,
  SessionOrder,
  SessionStatusFilter,
  Settings,
  StandaloneQuestion,
  StoredSessionSnapshot,
  TextSizeMode,
  ThemeMode,
} from "./types";

type View =
  | "home"
  | "builder"
  | "dashboard"
  | "library"
  | "import"
  | "settings"
  | "previewLab"
  | "review"
  | "session"
  | "summary"
  | "needsReview"
  | "saved"
  | "lastSet"
  | "inspect";

const returnLabel = (view: SessionReturnView) => ({home:"Home",library:"Library",needsReview:"Needs review",saved:"Saved",lastSet:"Last set",builder:"Customize"}[view]);

const RevealAllContext = createContext(0);
const HistoricalAttemptContext = createContext<SubmittedAttempt | null>(null);

type GptRescuePrompt = {
  label: string;
  text: string;
  prominent?: boolean;
};

function optionMarker(index: number): string {
  return index < 26 ? String.fromCharCode(65 + index) : String(index + 1);
}

function buildChoiceMarkerMap(question: Question): Map<string, string> {
  const markers = new Map<string, string>();

  switch (question.itemType) {
    case "multiple_choice":
    case "select_all":
    case "ordered_response":
      question.options.forEach((option, index) => {
        markers.set(option.id, optionMarker(index));
      });
      break;
    case "bowtie":
      ([
        ["condition", "S"],
        ["actions", "A"],
        ["parameters", "P"],
      ] as const).forEach(([zoneName, prefix]) => {
        question.bowtie[zoneName].tokens.forEach((token, index) => {
          markers.set(token.id, `${prefix}${index + 1}`);
        });
      });
      break;
    case "dropdown_cloze":
      question.dropdowns.forEach((dropdown, index) => {
        markers.set(dropdown.id, `D${index + 1}`);
      });
      break;
    case "matrix":
      question.matrix.rows.forEach((row, index) => {
        markers.set(row.id, `R${index + 1}`);
      });
      break;
    case "highlight":
      question.highlight.segments
        .filter((segment) => segment.selectable)
        .forEach((segment, index) => {
          markers.set(segment.id, `H${index + 1}`);
        });
      break;
    case "fill_in_blank":
      question.blanks.forEach((blank, index) => {
        markers.set(blank.id, `B${index + 1}`);
      });
      break;
    case "case_study":
      break;
  }

  return markers;
}

const standaloneRescueLabel = "Copy question for GPT / 复制问题给 GPT";
const casePartRescueLabel = "Copy case part for GPT / 复制案例部分给 GPT";

const makeRescuePrompt = (
  question: StandaloneQuestion,
  answer: AnswerState,
  prominent: boolean,
  parentCase?: CaseStudyQuestion,
): GptRescuePrompt => ({
  label: parentCase ? casePartRescueLabel : standaloneRescueLabel,
  prominent,
  text: buildQuestionRescuePromptText({ question, answer, parentCase }),
});

const makeCasePartRescuePrompts = (
  parentCase: CaseStudyQuestion,
  answer: AnswerState,
  prominent: boolean,
): Record<string, GptRescuePrompt> => {
  const caseAnswers = answer.caseStudy ?? {};
  return Object.fromEntries(
    parentCase.caseStudy.questions.flatMap((part) => {
      const partAnswer = caseAnswers[part.id] ?? getInitialAnswer(part);
      return gradeStandaloneQuestion(part, partAnswer)
        ? []
        : [[part.id, makeRescuePrompt(part, partAnswer, prominent, parentCase)]];
    }),
  );
};

type CaseStudyLayoutMode = "split" | "stacked";
type TermSelectHandler = (term: GlossaryTerm, anchor?: HTMLElement) => void;
type ActiveTermPopover = {
  term: GlossaryTerm;
  style?: CSSProperties;
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

const DEFAULT_SESSION_COUNT = 50;
const DEV_TOOLS_KEY = "shrimpDevTools";
const APP_ICON_SRC = "./icon-192.png";

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
  const { currentBuild, updateAvailable } = useAppUpdate();
  const bundled = useMemo(() => loadBundledRecords(), []);
  const [uploadedRecords, setUploadedRecords] = useState<QuestionRecord[]>([]);
  const [uploadedLoaded, setUploadedLoaded] = useState(false);
  const [progress, setProgress] = useState<Record<string, QuestionProgress>>({});
  const [flags, setFlags] = useState<Record<string, QuestionFlag>>({});
  const [answerEvents, setAnswerEvents] = useState<AnswerEvent[]>([]);
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [view, setView] = useState<View>(devStartup.openConsole ? "review" : "home");
  const [session, setSessionState] = useState<SessionState | null>(null);
  const sessionRef = useRef<SessionState | null>(null);
  const setSession = (update: SessionState | null | ((current: SessionState | null) => SessionState | null)) => {
    const next = typeof update === "function" ? update(sessionRef.current) : update;
    sessionRef.current = next;
    setSessionState(next);
  };
  const [persistenceStatus, setPersistenceStatus] = useState<PersistenceStatus>({ durability: "durable" });
  const [lastSet, setLastSet] = useState<CompletedSet | null>(null);
  const [completion, setCompletion] = useState<CompletedSet | null>(null);
  const [pendingCompletion, setPendingCompletion] = useState<{ snapshot: StoredSessionSnapshot; record: CompletedSet } | null>(null);
  const [working, setWorking] = useState(false);
  const submitPromiseRef = useRef<Promise<void> | null>(null);
  const finishingRef = useRef(false);
  const [inspection, setInspection] = useState<QuestionRecord | null>(null);
  const [inspectionReturn, setInspectionReturn] = useState<SessionReturnView>("library");
  const [launchNotice, setLaunchNotice] = useState("");
  useEffect(() => subscribePersistence(setPersistenceStatus), []);
  useEffect(() => { void loadCompletedSet().then(setLastSet); }, []);
  const [sessionReturnView, setSessionReturnView] = useState<SessionReturnView>("home");
  const [showStudyDataDelayNotice, setShowStudyDataDelayNotice] = useState(false);
  const [filters, setFilters] = useState<Filters>(blankFilters);
  const [builderFilters, setBuilderFilters] = useState<BuilderFilters>(blankBuilderFilters);
  const [sessionHydrated, setSessionHydrated] = useState(false);
  const [sessionStartStatus, setSessionStartStatus] = useState<SessionStartStatus>("idle");
  const [sessionStartError, setSessionStartError] = useState(false);
  const [sessionPersistence] = useState(() => createOrderedSessionPersistence({
    save: saveActiveSession,
  }));
  const [sessionStartGuard] = useState(() => createSessionStartGuard({
    onStatusChange: setSessionStartStatus,
    onError: () => setSessionStartError(true),
  }));
  const replacementDialogRef = useRef<HTMLDialogElement>(null);
  const keepCurrentSetRef = useRef<HTMLButtonElement>(null);
  const sessionStartControlRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.themeMode;
  }, [settings.themeMode]);

  useEffect(() => {
    document.documentElement.dataset.textSize = settings.textSizeMode;
  }, [settings.textSizeMode]);

  useEffect(() => {
    void Promise.all([
      loadUploadedRecords(),
      loadProgress(),
      loadFlags(),
      loadAnswerEvents(),
    ]).then(
      ([
        nextUploadedRecords,
        nextProgress,
        nextFlags,
        nextAnswerEvents,
      ]) => {
        setUploadedRecords(nextUploadedRecords);
        setProgress(nextProgress);
        setFlags(nextFlags);
        setAnswerEvents(nextAnswerEvents);
        // Keep this as the final learner-data state update. Session starts are only allowed after this barrier opens.
        setUploadedLoaded(true);
      },
    );
  }, []);

  useEffect(() => {
    if (uploadedLoaded) {
      setShowStudyDataDelayNotice(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setShowStudyDataDelayNotice(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [uploadedLoaded]);

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
    () => allRecords.filter((record) => progress[record.question.id]?.needsReview),
    [progress, allRecords],
  );
  const answeredRecords = useMemo(
    () => allRecords.filter((record) => (progress[record.question.id]?.seen ?? 0) > 0),
    [progress, allRecords],
  );
  const flaggedRecords = useMemo(
    () => allRecords.filter((record) => flags[record.question.id]?.flagged),
    [flags, allRecords],
  );

  useEffect(() => {
    if (!uploadedLoaded || sessionHydrated) return;
    let cancelled = false;
    void loadActiveSession().then((snapshot) => {
      if (cancelled) return;
      const hydrated = snapshot ? hydrateSession(snapshot, recordsById) : null;
      if (hydrated) { setSession(hydrated); setSessionReturnView(hydrated.returnView); }
      setSessionHydrated(true);
      sessionStartGuard.resolveHydration(hydrated);
    });
    return () => { cancelled = true; };
  }, [recordsById, sessionHydrated, uploadedLoaded, sessionPersistence, sessionStartGuard]);

  useEffect(() => {
    if (!sessionHydrated || !session) return;
    // The replacement write owns this interval; an old async answer may still finish.
    if (sessionStartGuard.status === "starting") return;
    if (session.completed || session.recovery?.length || submitPromiseRef.current || finishingRef.current) return;
    void sessionPersistence.save(toStoredSession(session));
  }, [session, sessionHydrated, sessionPersistence, sessionStartGuard]);

  useEffect(() => {
    const dialog = replacementDialogRef.current;
    if (sessionStartStatus === "confirming") {
      if (dialog && !dialog.open) dialog.showModal();
      keepCurrentSetRef.current?.focus();
    } else if (dialog?.open) {
      dialog.close();
    }
  }, [sessionStartStatus]);


  const updateSettings = (next: Settings) => {
    setSettings(next);
    saveSettings(next);
  };

  const requestSessionStart = (
    records: QuestionRecord[],
    mode: SessionMode,
    title: string,
    options: { count?: number; order?: SessionOrder; returnView?: SessionReturnView; weighting?: "nclex"; launchIntent?: LaunchIntent; population?: "needsReview" | "saved" } = {},
  ) => {
    if (!uploadedLoaded || records.length === 0 || sessionStartGuard.status !== "idle" || submitPromiseRef.current || finishingRef.current) return;
    const requestedRecords = [...records];
    const requestedOptions = { ...options };
    sessionStartControlRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSessionStartError(false);
    sessionStartGuard.request(() => performSessionStart(requestedRecords, mode, title, requestedOptions), session);
  };

  const keepCurrentSet = () => {
    if (!sessionStartGuard.cancel()) return;
    replacementDialogRef.current?.close();
    if (sessionStartControlRef.current?.isConnected) sessionStartControlRef.current.focus();
    sessionStartControlRef.current = null;
  };

  const confirmSessionStart = () => {
    void sessionStartGuard.confirm();
    replacementDialogRef.current?.close();
    sessionStartControlRef.current = null;
  };

  const performSessionStart = async (
    records: QuestionRecord[],
    mode: SessionMode,
    title: string,
    options: { count?: number; order?: SessionOrder; returnView?: SessionReturnView; weighting?: "nclex"; launchIntent?: LaunchIntent; population?: "needsReview" | "saved" },
  ) => {
    let nextSession: SessionState | undefined;
    if (mode === "adaptive") {
      nextSession = performAdaptiveSessionStart(records, title, Math.max(1, options.count ?? 75));
    } else {
      let orderedRecords: QuestionRecord[];
      const requestedCount = Math.max(1, options.count ?? records.length);
      if (options.population) {
        orderedRecords = selectExplicitPopulation(records, options.population, requestedCount, progress, flags);
      } else if (options.order === "sequential") {
        orderedRecords = shuffle(records.slice(0, requestedCount));
      } else if (options.weighting === "nclex") {
        const seed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
        orderedRecords = buildWeightedSession(records, requestedCount, progress, mulberry32(seed), {
          revisitMissed: settings.revisitMissed,
        });
      } else {
        orderedRecords = buildUnweightedSession(records, requestedCount, progress, Math.random, mode !== "study" || options.launchIntent === "remediation" || settings.revisitMissed);
      }
      const selectedRecords = orderedRecords.slice(0, requestedCount);
      setLaunchNotice(selectedRecords.length < requestedCount ? `This set contains ${selectedRecords.length} of ${requestedCount} requested questions with your current choices.` : "");
      if (!selectedRecords.length) return;
      nextSession = buildSessionState({
        id: createSessionId(),
        launchIntent: options.launchIntent ?? "ordinary", returnView: options.returnView ?? "home", requestedCount,
        mode,
        questions: selectedRecords.map((record) => record.question),
        poolIds: selectedRecords.map((record) => record.question.id),
        languageMode: mode === "test" ? "off" : settings.languageMode,
        title,
        startedAt: new Date().toISOString(),
      });
    }
    if (!nextSession) return;
    // Wait behind every earlier save/clear before exposing the replacement.
    nextSession.returnView = options.returnView ?? "home";
    await sessionPersistence.save(toStoredSession(nextSession));
    setSessionReturnView(nextSession.returnView);
    setSession(nextSession);
    setView("session");
  };

  const performAdaptiveSessionStart = (records: QuestionRecord[], title: string, requestedCount: number) => {
    const selectedRecords = shuffle(records);
    const firstRecord = selectRecordForDifficulty(selectedRecords, "medium");
    if (!firstRecord) return;
    const targetCount = Math.max(1, Math.min(requestedCount, selectedRecords.length));
    return buildSessionState({
      id: createSessionId(),
      mode: "adaptive",
      requestedCount,
      questions: [firstRecord.question],
      poolIds: selectedRecords.map((record) => record.question.id),
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
  };

  const persistCompletion = async (snapshot: StoredSessionSnapshot, record: CompletedSet) => {
    // Ensure a memory-only active write can be retried without changing its identity.
    if (pendingCompletion?.record.sessionId === record.sessionId) await sessionPersistence.save(snapshot);
    // Retry captured operations using their original identities before retrying archive.
    for (const [id, attempt] of Object.entries(snapshot.attempts ?? {})) {
      const saved = await sessionPersistence.run(() => commitSubmission(snapshot, id, attempt));
      snapshot = saved.value.session;
    }
    const outcome = await sessionPersistence.run(() => completeSession(snapshot, record));
    setPendingCompletion(outcome.durability === "memory" ? { snapshot, record } : null);
    if (snapshot.launchIntent === "ordinary" && snapshot.mode === "study" && Object.keys(snapshot.results).length > 0) setLastSet(record);
    return outcome;
  };
  const finishSession = async (endReason: CompletedSet["endReason"] = "ended") => {
    if (finishingRef.current) return;
    finishingRef.current = true; setWorking(true);
    try {
      await submitPromiseRef.current;
      const current = sessionRef.current;
      if (!current || current.completed) return;
      const snapshot = toStoredSession(current);
      const record = pendingCompletion?.snapshot.id === current.id ? pendingCompletion.record : makeCompletedSet(snapshot, endReason);
      const outcome = await persistCompletion(snapshot, record);
      setCompletion(record);
      setSession({ ...current, completed: outcome.durability === "durable" });
      setView("summary");
    } finally { finishingRef.current = false; setWorking(false); }
  };
  const retryCompletion = async () => {
    if (!pendingCompletion || finishingRef.current) return;
    finishingRef.current=true; setWorking(true);
    try {
      const outcome = await persistCompletion(pendingCompletion.snapshot, pendingCompletion.record);
      if (outcome.durability === "durable" && sessionRef.current?.id === pendingCompletion.snapshot.id) setSession({...sessionRef.current, completed:true});
    }
    finally { finishingRef.current=false; setWorking(false); }
  };

  const updateAnswer = (questionId: string, answer: AnswerState) => {
    if (submitPromiseRef.current || finishingRef.current) return;
    setSession((current) => {
      if (!current) return current;
      return { ...current, answers: { ...current.answers, [questionId]: answer } };
    });
  };

  const submitCurrent = () => {
    if (submitPromiseRef.current || finishingRef.current) return;
    const current = sessionRef.current;
    if (!current || current.completed || current.recovery?.length) return;
    const question = current.questions[current.index];
    if (Object.prototype.hasOwnProperty.call(current.results, question.id)) return;
    const snapshot = toStoredSession(current);
    const answer = current.answers[question.id] ?? getInitialAnswer(question);
    snapshot.fingerprints = {...snapshot.fingerprints, [question.id]:questionFingerprint(question)};
    const attempt = captureAttempt(snapshot, question, answer);
    if (current.adaptive) snapshot.adaptive = updateAdaptiveAfterAnswer(current.adaptive, question, attempt.result);
    setWorking(true);
    // Install synchronously before any await; clicks and answer edits share this lock.
    const promise = sessionPersistence.run(async () => {
      const saved = await commitSubmission(snapshot, question.id, attempt);
      setProgress(previous => ({ ...previous, [question.id]: saved.value.progress }));
      setAnswerEvents(await loadAnswerEvents());
      if (sessionRef.current?.id === current.id) setSession(hydrateSession(saved.value.session, recordsById));
    });
    submitPromiseRef.current = promise;
    void promise.finally(() => { submitPromiseRef.current=null; if (!finishingRef.current) setWorking(false); });
  };

  const skipCurrent = () => {
    if (submitPromiseRef.current || finishingRef.current) return;
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
          void finishSession("finished");
          return current;
        }
        const nextRecord = selectNextAdaptiveRecord(current, recordsById);
        if (!nextRecord) {
          void finishSession("finished");
          return current;
        }
        return {
          ...current,
          questions: [...current.questions, nextRecord.question],
          fingerprints: {...current.fingerprints, [nextRecord.question.id]:questionFingerprint(nextRecord.question)},
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
        void finishSession("finished");
        return current;
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

  const openBuilder = (overrides: Partial<BuilderFilters> = {}) => {
    setBuilderFilters({ ...blankBuilderFilters, ...overrides });
    setView("builder");
  };

  const practiceOne = (record: QuestionRecord) => {
    requestSessionStart([record], "study", record.question.stem.en, {
      order: "sequential",
      returnView: inspectionReturn,
      launchIntent: "remediation",
    });
  };

  const existingIds = useMemo(() => new Set(allRecords.map((record) => record.question.id)), [allRecords]);
  const activeSession = session && !session.completed ? session : null;
  const sessionReturnLabel = returnLabel(sessionReturnView);
  const isWidePage = view === "session" || view === "previewLab";

  return (
    <div className={`app-shell ${view === "session" ? "session-active" : ""} ${isWidePage ? "wide-main" : ""}`}>
      <header className="app-header" inert={sessionStartStatus === "starting" || working}>
        <button className="brand" type="button" onClick={() => setView("home")}>
          <img className="brand-mark" src={APP_ICON_SRC} alt="" aria-hidden="true" />
          <span>NCLEX Bilingual Prep</span>
        </button>
        <nav className="app-primary-nav" aria-label="Main navigation">
          <button className={view === "home" ? "active" : ""} type="button" onClick={() => setView("home")}>
            <Home aria-hidden="true" />
            <span>Home</span>
          </button>
          <button className={view === "builder" ? "active" : ""} type="button" onClick={() => openBuilder(builderFilters)}>
            <SlidersHorizontal aria-hidden="true" />
            <span>Customize</span>
          </button>
          <button className={view === "dashboard" ? "active" : ""} type="button" onClick={() => setView("dashboard")}>
            <BarChart3 aria-hidden="true" />
            <span>Progress</span>
          </button>
          <button className={view === "library" ? "active" : ""} type="button" onClick={() => setView("library")}>
            <Library aria-hidden="true" />
            <span>Library</span>
          </button>
          <button className={view === "import" ? "active" : ""} type="button" onClick={() => setView("import")}>
            <Import aria-hidden="true" />
            <span>Import</span>
          </button>
          <button className={view === "settings" || view === "previewLab" ? "active" : ""} type="button" onClick={() => setView("settings")}>
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

      {(sessionStartStatus === "waiting-hydration" || sessionStartStatus === "starting") && (
        <p className="session-start-status" role="status">Preparing your set / 正在准备练习…</p>
      )}
      {sessionStartError && (
        <p className="session-start-status" role="alert">Could not start the new set. Try again. / 无法开始新练习，请重试。</p>
      )}

      {working && <p className="session-start-status" role="status">Saving your answers… / 正在保存作答…</p>}
      {persistenceStatus.durability === "memory" && <p className="warning-band" role="status">
        {persistenceStatus.reason === "blocked" ? "Storage upgrade is blocked. Close other open copies of this app and reload. " : ""}
        Changes are available for this visit only until they can be saved on this device.
      </p>}
      {launchNotice && <p className="session-start-status" role="status">{launchNotice}</p>}
      <main inert={sessionStartStatus === "starting" || working} aria-busy={sessionStartStatus === "waiting-hydration" || sessionStartStatus === "starting"}>
        {!uploadedLoaded && (
          <p className="session-start-status study-data-status" role="status">
            {showStudyDataDelayNotice
              ? "Study data is taking longer to load. If this continues, close other open copies of the app and refresh. / 学习数据加载时间较长。如果一直没有完成，请关闭其他已打开的本应用页面并刷新。"
              : "Loading study data / 正在加载学习数据…"}
          </p>
        )}
        {updateAvailable && <AppUpdateBanner />}

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
            flagged={flaggedRecords.length}
            activeSession={activeSession}
            onResume={() => setView(pendingCompletion ? "summary" : "session")}
            completionPending={Boolean(pendingCompletion)}
            onStudy={() => requestSessionStart(allRecords, "study", "Study all questions")}
            onTest={(count) =>
              requestSessionStart(allRecords, "study", `Practice · ${count} questions`, { count, weighting: "nclex" })
            }
            onMistakes={() => setView("needsReview")}
            onSaved={() => setView("saved")}
            reviewCases={missedRecords.filter(r=>r.question.itemType === "case_study").length}
            lastSet={lastSet}
            onLastSet={() => setView("lastSet")}
            revisitMissed={settings.revisitMissed}
            onRevisitChange={revisitMissed => updateSettings({...settings,revisitMissed})}
            onCustom={() => openBuilder()}
            onDashboard={() => setView("dashboard")}
            onImport={() => setView("import")}
            onLibrary={() => setView("library")}
            sessionStartDisabled={!uploadedLoaded}
          />
        )}

        {view === "builder" && (
          <SessionBuilderView
            records={builderRecords}
            filters={builderFilters}
            setFilters={setBuilderFilters}
            onStart={() => {
              const label = builderFilters.mode === "adaptive" ? "Adaptive exam practice" : "Custom session";
              requestSessionStart(
                builderRecords,
                builderFilters.mode,
                label,
                { count: builderFilters.mode === "adaptive" ? 75 : DEFAULT_SESSION_COUNT, returnView: "builder",
                  launchIntent: builderFilters.status === "all" && builderFilters.mode === "study" ? "ordinary" : "remediation",
                  population: builderFilters.status === "needsReview" || builderFilters.status === "saved" ? builderFilters.status : undefined },
              );
            }}
            sessionStartDisabled={!uploadedLoaded}
          />
        )}

        {view === "dashboard" && (
          <DashboardView
            records={allRecords}
            progress={progress}
            flags={flags}
            answerEvents={answerEvents}
            onOpenTopic={(topic) => {
              setFilters({ ...blankFilters, topic });
              setView("library");
            }}

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
            onStudy={() => requestSessionStart(filteredRecords, "study", "Filtered study set", {launchIntent:"remediation",returnView:"library"})}
            onTest={() => requestSessionStart(filteredRecords, "test", "Filtered test set", {launchIntent:"remediation",returnView:"library"})}
            onToggleFlag={toggleFlag}
            onPracticeOne={record=>{setInspectionReturn("library");requestSessionStart([record],"study",record.question.stem.en,{order:"sequential",launchIntent:"remediation",returnView:"library"});}}
            onInspect={record=>{setInspection(record);setInspectionReturn("library");setView("inspect");}}
            sessionStartDisabled={!uploadedLoaded}
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

        {view === "settings" && (
          <SettingsView
            settings={settings}
            updateSettings={updateSettings}
            devEnabled={devStartup.enabled}
            onOpenPreviewLab={() => setView("previewLab")}
            currentBuild={currentBuild}
          />
        )}

        {view === "previewLab" && (
          <PreviewLab
            records={bundled.records}
            settings={settings}
            onBack={() => setView("settings")}
          />
        )}

        {view === "review" && devStartup.enabled && (
          <DeveloperReviewConsole
            records={allRecords}
            initialIds={devStartup.requestedIds}
            initialLanguageMode={settings.languageMode}
          />
        )}

        {(view === "needsReview" || view === "saved") && <MemoryList
          kind={view} records={view === "needsReview" ? missedRecords : flaggedRecords}
          onHome={()=>setView("home")} onRemove={toggleFlag}
          onInspect={record=>{setInspection(record);setInspectionReturn(view);setView("inspect");}}
          onPractice={()=>requestSessionStart(allRecords,"study",view === "saved" ? "Saved practice" : "Needs review practice",{population:view,count:DEFAULT_SESSION_COUNT,launchIntent:"remediation",returnView:view})}
        />}
        {view === "inspect" && inspection && <section className="stack">
          <div className="action-row"><button onClick={()=>setView(inspectionReturn)}>Back to {returnLabel(inspectionReturn)}</button>
          <button className="primary-action" onClick={()=>practiceOne(inspection)}>Practice {inspection.question.itemType === "case_study" ? "this case" : "this question"}</button></div>
          <p>Current question preview · No previous answer is shown.</p>
          <QuestionCard key={inspection.question.id} question={inspection.question} answer={getCorrectAnswer(inspection.question)} submitted result reviewMode
            languageMode={settings.languageMode} flagged={flags[inspection.question.id]?.flagged??false} voiceEnabled={settings.voiceEnabled}
            onAnswer={()=>{}} onSubmit={()=>{}} onToggleFlag={()=>toggleFlag(inspection.question.id)} caseStudyLayout="stacked" standaloneVisualLayout="stacked" />
        </section>}
        {view === "session" && session?.recovery?.length ? <section className="stack" role="alert">
          <h2>This set needs recovery</h2><p>Your saved work is kept. These entries cannot safely use the current bank:</p>
          <ul>{session.recovery.map(message=><li key={message}>{message}</li>)}</ul>
          <button onClick={()=>setView("home")}>Home</button><button onClick={()=>void finishSession()}>End this set</button>
        </section> : view === "session" && session && (
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
            onFinish={() => void finishSession()}
            onLanguageModeChange={(languageMode) => setSession((current) => (current ? { ...current, languageMode } : current))}
            onToggleFlag={toggleFlag}

            onExit={() => setView(sessionReturnView)}
            exitLabel={sessionReturnLabel}
          />
        )}

        {(view === "summary" && completion || view === "lastSet" && lastSet) && <SummaryView
          key={(view === "lastSet" ? lastSet : completion)!.sessionId + view}
          record={(view === "lastSet" ? lastSet : completion)!} recordsById={recordsById} flags={flags} progress={progress}
          onToggleFlag={toggleFlag} voiceEnabled={settings.voiceEnabled} defaultLanguageMode={settings.languageMode}
          onHome={()=>setView(view === "lastSet" ? "home" : sessionReturnView)} homeLabel={view === "lastSet" ? "Home" : `Back to ${sessionReturnLabel}`}
          onPractice={ids=>requestSessionStart(ids.flatMap(id=>recordsById.has(id)?[recordsById.get(id)!]:[]),"study","Try again",{count:ids.length,order:"sequential",launchIntent:"remediation",returnView:view === "lastSet" || lastSet?.sessionId === completion?.sessionId ? "lastSet" : sessionReturnView})}
          memoryOnly={pendingCompletion?.record.sessionId === (view === "lastSet" ? lastSet : completion)?.sessionId}
          onRetrySave={()=>void retryCompletion()}
        />}

      </main>

      <dialog
        className="session-replacement-dialog"
        ref={replacementDialogRef}
        aria-labelledby="session-replacement-title"
        aria-describedby="session-replacement-description"
        onCancel={(event) => {
          event.preventDefault();
          keepCurrentSet();
        }}
      >
        <h2 id="session-replacement-title">Start a new set? / 开始新的练习吗？</h2>
        <div id="session-replacement-description">
          <p>You have unfinished work in the current set. Recorded answer history will stay, but this set, including unsubmitted drafts and remaining questions, will no longer be resumable.</p>
          <p lang="zh-Hans">当前练习还有未完成内容。已记录的答题历史会保留，但当前练习（包括未提交的草稿和剩余题目）将无法再继续。</p>
        </div>
        <div className="action-row">
          <button className="primary-action" type="button" ref={keepCurrentSetRef} onClick={keepCurrentSet}>
            Keep current set / 保留当前练习
          </button>
          <button type="button" onClick={confirmSessionStart}>
            Start new set / 开始新练习
          </button>
        </div>
      </dialog>
    </div>
  );
}

function AppUpdateBanner() {
  return (
    <section className="app-update-banner" role="status" aria-live="polite" aria-atomic="true">
      <div>
        <h2>
          <span>New version available</span>
          <span lang="zh">有新版本</span>
        </h2>
        <p>
          <span>Refresh to load new questions and app improvements.</span>
          <span lang="zh">刷新后可获取新题目和应用改进。</span>
        </p>
      </div>
      <button type="button" onClick={() => window.location.reload()}>
        <RotateCcw aria-hidden="true" />
        <span>
          Refresh now <span lang="zh">/ 立即刷新</span>
        </span>
      </button>
    </section>
  );
}

function HomeView({
  total,
  missed,
  answered,
  flagged,
  reviewCases,
  activeSession,
  onResume,
  completionPending,
  onStudy,
  onTest,
  onMistakes,
  onSaved,
  onCustom,
  onDashboard,
  onImport,
  onLibrary,
  sessionStartDisabled,
  lastSet,
  onLastSet,
  revisitMissed,
  onRevisitChange,
}: {
  total: number;
  missed: number;
  answered: number;
  flagged: number;
  reviewCases: number;
  activeSession: SessionState | null;
  onResume: () => void;
  completionPending: boolean;
  onStudy: () => void;
  onTest: (count: number) => void;
  onMistakes: () => void;
  onSaved: () => void;
  onCustom: () => void;
  onDashboard: () => void;
  onImport: () => void;
  onLibrary: () => void;
  sessionStartDisabled: boolean;
  lastSet: CompletedSet | null;
  onLastSet: () => void;
  revisitMissed: boolean;
  onRevisitChange: (enabled: boolean) => void;
}) {
  const [count, setCount] = useState(DEFAULT_SESSION_COUNT);
  const [showHistoryNotice, setShowHistoryNotice] = useState(() => {
    try {
      return localStorage.getItem("completed-memory-notice") !== "dismissed";
    } catch {
      return true;
    }
  });
  return (
    <section className="home-grid">
      <div className="hero-panel">
        <div className="hero-brand-row">
          <img className="hero-brand-mark" src={APP_ICON_SRC} alt="" />
          <p className="eyebrow">Offline bilingual NCLEX-RN practice</p>
        </div>
        <h1>Train in English. Check reasoning in Chinese.</h1>
        <div className="metric-row">
          <Metric label="Questions" value={total} />
          <Metric label="Answered" value={answered} />
        </div>
        {activeSession && (
          <button className="primary-action resume-action" onClick={onResume}>
            <Play aria-hidden="true" />
            {completionPending ? "Finish saving set" : "Continue set / 继续练习"}
          </button>
        )}
        <div className="test-launcher">
          <div className="test-launcher-head">
            <strong>Your next practice set</strong>
            <div className="segmented count-toggle" role="group" aria-label="Number of questions">
              {[10, 25, 50].map((n) => (
                <button
                  key={n}
                  aria-pressed={count === n}
                  className={count === n ? "active" : ""}
                  onClick={() => setCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={revisitMissed}
              onChange={(e) => onRevisitChange(e.target.checked)}
            />
            <span>Revisit missed questions / 加入需复习的题目</span>
          </label>
          <p className="muted-copy">Include questions you have not yet answered fully correctly.</p>
          <button
            className="primary-action test-start"
            disabled={sessionStartDisabled || !total}
            onClick={() => onTest(count)}
          >
            <Play aria-hidden="true" />
            Start practice · {count} questions
          </button>
        </div>
        <div className="action-row secondary-actions">
          <button onClick={onStudy} disabled={sessionStartDisabled || !total}>
            Study all questions
          </button>
          <button onClick={onCustom}>Customize</button>
        </div>
        <div className="study-memory-links">
          <button onClick={onMistakes}>
            Needs review / 需复习 · {missed - reviewCases} questions
            {reviewCases > 0 ? ` and ${reviewCases} case studies` : ""}
          </button>
          <button onClick={onSaved}>Saved / 已收藏 · {flagged}</button>
        </div>
        {lastSet && (
          <button className="last-set-entry" onClick={onLastSet}>
            <span>Last set / 上次练习</span>
            <strong>{new Date(lastSet.completedAt).toLocaleString()}</strong>
            <span>
              {lastSet.deliveredCount} questions · {lastSet.title}
            </span>
            <ChevronRight aria-hidden="true" />
          </button>
        )}
        {showHistoryNotice && (
          <div className="history-notice">
            <p>
              Detailed set results are available for sets completed after this update. Your previous progress
              and Saved questions are kept.
            </p>
            <button
              onClick={() => {
                setShowHistoryNotice(false);
                try {
                  localStorage.setItem("completed-memory-notice", "dismissed");
                } catch {
                  /* Visit-only notice dismissal. */
                }
              }}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
      <div className="utility-grid">
        <button className="utility-card" onClick={onDashboard}>
          <BarChart3 aria-hidden="true" />
          Progress
        </button>
        <button className="utility-card" onClick={onLibrary}>
          <Library aria-hidden="true" />
          Browse library
        </button>
        <button className="utility-card" onClick={onImport}>
          <FileJson aria-hidden="true" />
          Import a bank
        </button>
      </div>
    </section>
  );
}

function MemoryList({
  kind,
  records,
  onHome,
  onRemove,
  onInspect,
  onPractice,
}: {
  kind: "needsReview" | "saved";
  records: QuestionRecord[];
  onHome: () => void;
  onRemove: (id: string) => Promise<void>;
  onInspect: (record: QuestionRecord) => void;
  onPractice: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const rowRefs = useRef(new Map<string, HTMLButtonElement>());
  const cases = records.filter((r) => r.question.itemType === "case_study").length;
  const remove = async (id: string) => {
    const index = records.findIndex((r) => r.question.id === id);
    const next = records[index + 1]?.question.id ?? records[index - 1]?.question.id;
    await onRemove(id);
    requestAnimationFrame(() => {
      if (next) rowRefs.current.get(next)?.focus();
      else heading.current?.focus();
    });
  };
  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Study</p>
          <h2 ref={heading} tabIndex={-1}>
            {kind === "saved" ? "Saved / 已收藏" : "Needs review / 需复习"}
          </h2>
          <p>
            {records.length - cases} questions and {cases} case studies
          </p>
        </div>
        <button onClick={onHome}>Home</button>
      </div>
      <p>
        {kind === "saved"
          ? "Questions you keep for yourself. Answers never remove them from Saved."
          : "One full-marks attempt removes a question from Needs review. Case studies require one full-marks whole-case attempt."}
      </p>
      <button className="primary-action" onClick={onPractice} disabled={!records.length}>
        Practice these · up to {Math.min(DEFAULT_SESSION_COUNT, records.length)}
      </button>
      {!records.length && <p>No questions here.</p>}
      <div className="question-list">
        {records.map(({ question: q, ...rest }) => (
          <article className="question-row memory-row" key={q.id}>
            <button
              className="question-inspect"
              ref={(el) => {
                if (el) rowRefs.current.set(q.id, el);
                else rowRefs.current.delete(q.id);
              }}
              onClick={() => onInspect({ question: q, ...rest })}
            >
              <span className="type-pill">
                {q.itemType === "case_study" ? "Whole case study" : formatItemType(q.itemType)}
              </span>
              <span>{q.stem.en}</span>
            </button>
            {kind === "saved" && <button onClick={() => void remove(q.id)}>Remove from Saved</button>}
          </article>
        ))}
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
  sessionStartDisabled,
}: {
  records: QuestionRecord[];
  filters: BuilderFilters;
  setFilters: (filters: BuilderFilters) => void;
  onStart: () => void;
  sessionStartDisabled: boolean;
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
        <button
          className="primary-action"
          type="button"
          onClick={onStart}
          disabled={sessionStartDisabled || records.length === 0}
        >
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
            values={["all", "unseen", "needsReview", "saved"]}
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
  onInspect,
  sessionStartDisabled,
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
  onInspect: (record: QuestionRecord) => void;
  sessionStartDisabled: boolean;
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
          <button type="button" onClick={onStudy} disabled={sessionStartDisabled || records.length === 0}>
            <BookOpen aria-hidden="true" />
            <span>Study</span>
          </button>
          <button type="button" onClick={onTest} disabled={sessionStartDisabled || records.length === 0}>
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
              className={`question-row interactive-row ${sessionStartDisabled ? "interactive-row--disabled" : ""}`}
              key={record.question.id}
              role="button"
              aria-disabled={sessionStartDisabled}
              tabIndex={sessionStartDisabled ? -1 : 0}
              onClick={() => {
                if (!sessionStartDisabled) onInspect(record);
              }}
              onKeyDown={(event) => {
                if (sessionStartDisabled) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onInspect(record);
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
                <button onClick={e=>{e.stopPropagation();onPracticeOne(record);}} onKeyDown={e=>e.stopPropagation()}>Practice</button>
                <button
                  className={`icon-action ${flagged ? "flagged" : ""}`}
                  type="button"
                  aria-label={flagged ? "Remove from Saved" : "Save question"}
                  title={flagged ? "Remove from Saved" : "Save question"}
                  aria-pressed={flagged??false}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFlag(record.question.id);
                  }}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <Flag aria-hidden="true" />
                </button>
                {flagged && <span className="type-pill">Saved</span>}
                {itemProgress?.needsReview && <span className="missed-pill">Missed</span>}
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
  onOpenTopic,

}: {
  records: QuestionRecord[];
  progress: Record<string, QuestionProgress>;
  flags: Record<string, QuestionFlag>;
  answerEvents: AnswerEvent[];
  onOpenTopic: (topic: string) => void;

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
  const recentEvents = answerEvents.filter((event) => recordsById.has(event.questionId)).slice(-20);

  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Progress</p>
          <h2>Attempts and coverage</h2>
        </div>

      </div>

      <div className="dashboard-metrics">
        <Metric label="Available" value={records.length} />
        <Metric label="Seen" value={answeredRecords.length} />
        <Metric label="Unseen" value={unseenCount} />
        <Metric label="Saved" value={flaggedCount} />
        <Metric label="Attempts" value={totalAttempts} />
        <Metric label="Correct" value={totalCorrect} />
      </div>

      <section className="dashboard-panel">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow">Topic results</p>
            <h3>Topics below 70% across at least 3 attempts</h3>
          </div>
        </div>
        {weakTopics.length === 0 ? (
          <p className="muted-copy">No topics meet this reporting threshold.</p>
        ) : (
          <div className="weak-topic-list">
            {weakTopics.map((topic) => (
              <button
                type="button"
                key={topic.label}
                onClick={() => onOpenTopic(topic.label)}
              >
                <span>{topic.label}</span>
                <strong>{Math.round(topic.accuracy * 100)}%</strong>
                <span>Open this topic / 打开此主题</span>
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
            {item === "all" ? "All" : item === "unseen" ? "Unanswered" : item === "needsReview" ? "Needs review" : item === "saved" ? "Saved" : item}
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
          <span>Export questions / 导出题目</span>
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

const textSizeOptions: Array<{ value: TextSizeMode; label: string }> = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "large", label: "Large" },
];

function SettingsView({
  settings,
  updateSettings,
  devEnabled,
  onOpenPreviewLab,
  currentBuild,
}: {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
  devEnabled: boolean;
  onOpenPreviewLab: () => void;
  currentBuild: AppBuildInfo | null;
}) {
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
          <span>Theme</span>
          <select
            value={settings.themeMode}
            onChange={(event) => updateSettings({ ...settings, themeMode: event.target.value as ThemeMode })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label>
          <span>Text size</span>
          <div className="segmented text-size-toggle" role="group" aria-label="Text size">
            {textSizeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={settings.textSizeMode === option.value ? "active" : ""}
                aria-pressed={settings.textSizeMode === option.value}
                onClick={() => updateSettings({ ...settings, textSizeMode: option.value })}
              >
                {option.label}
              </button>
            ))}
          </div>
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
      {devEnabled && (
        <section className="preview-lab-launcher">
          <div>
            <h3>Preview Lab</h3>
            <p>Inspect layout behavior using bundled questions. Does not save answers or progress.</p>
          </div>
          <button className="secondary-action" type="button" onClick={onOpenPreviewLab}>
            <Wrench aria-hidden="true" />
            <span>Open Preview Lab</span>
          </button>
        </section>
      )}
      <p className="app-build-diagnostic">
        <span>App build / 应用版本:</span> {formatAppBuildDiagnostic(currentBuild)}
      </p>
    </section>
  );
}

type PreviewMode = "live" | "review" | "mobile";
type PreviewBucket = {
  id: string;
  label: string;
  group: string;
  matches: (question: Question) => boolean;
};

const previewSplitKinds: QuestionVisual["kind"][] = Array.from(STANDALONE_SPLIT_VISUAL_KINDS);

const previewFullWidthKinds: QuestionVisual["kind"][] = [
  "rhythm_strip",
  "capnography",
  "fetal_monitoring",
  "mar",
];

const previewBuckets: PreviewBucket[] = [
  {
    id: "case_study",
    label: "Case studies",
    group: "Case studies",
    matches: (question) => question.itemType === "case_study",
  },
  ...previewSplitKinds.map((kind) => ({
    id: `split-${kind}`,
    label: kind,
    group: "Standalone split visual candidates",
    matches: (question: Question) => question.itemType !== "case_study" && question.visual?.kind === kind,
  })),
  ...previewFullWidthKinds.map((kind) => ({
    id: `full-${kind}`,
    label: kind,
    group: "Standalone visual exclusions / full-width candidates",
    matches: (question: Question) => question.itemType !== "case_study" && question.visual?.kind === kind,
  })),
  {
    id: "ordered_response",
    label: "Ordered response",
    group: "Other item types",
    matches: (question) => question.itemType === "ordered_response",
  },
  {
    id: "bowtie",
    label: "Bowtie",
    group: "Other item types",
    matches: (question) => question.itemType === "bowtie",
  },
  {
    id: "highlight",
    label: "Highlight",
    group: "Other item types",
    matches: (question) => question.itemType === "highlight",
  },
];

const previewModes: Array<{ value: PreviewMode; label: string }> = [
  { value: "live", label: "Live answer" },
  { value: "review", label: "Summary/review" },
  { value: "mobile", label: "Mobile stacked" },
];

function previewQuestionLabel(record: QuestionRecord) {
  const question = record.question;
  return `${question.id} - ${previewQuestionTitle(record)} (${record.sourceLabel})`;
}

function previewQuestionTitle(record: QuestionRecord) {
  const question = record.question;
  const title = question.itemType === "case_study" ? question.caseStudy.title.en : question.stem.en;
  return title.length > 84 ? `${title.slice(0, 81)}...` : title;
}

function PreviewLab({
  records,
  settings,
  onBack,
}: {
  records: QuestionRecord[];
  settings: Settings;
  onBack: () => void;
}) {
  const newestSelectionKey = "__newest__";
  const [bucketId, setBucketId] = useState(previewBuckets[0].id);
  const [selectedIdsByBucket, setSelectedIdsByBucket] = useState<Record<string, string>>({});
  const [browseMode, setBrowseMode] = useState<"buckets" | "newest">("buckets");
  const [mode, setMode] = useState<PreviewMode>("live");
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(() => new Set());
  const [casePartIds, setCasePartIds] = useState<Record<string, string>>({});
  const [showAllStages, setShowAllStages] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const bucket = previewBuckets.find((candidate) => candidate.id === bucketId) ?? previewBuckets[0];
  const groupedBuckets = useMemo(() => {
    const groups = new Map<string, PreviewBucket[]>();
    previewBuckets.forEach((candidate) => {
      const items = groups.get(candidate.group) ?? [];
      items.push(candidate);
      groups.set(candidate.group, items);
    });
    return Array.from(groups.entries());
  }, []);
  const bucketMatches = useMemo(
    () => records.filter((record) => bucket.matches(record.question)),
    [bucket, records],
  );
  const recordsById = useMemo(() => new Map(records.map((record) => [record.question.id, record])), [records]);
  const newestDatedRecords = useMemo(
    () => {
      const seen = new Set<string>();
      const ordered: Array<{ record: QuestionRecord; entry: BankProvenanceEntry }> = [];
      for (const entry of bankProvenance.entries) {
        const record = recordsById.get(entry.id);
        if (!record || seen.has(entry.id)) continue;
        seen.add(entry.id);
        ordered.push({ record, entry });
      }
      return ordered;
    },
    [recordsById],
  );
  const newestUndatedRecords = useMemo(
    () => {
      const seen = new Set(newestDatedRecords.map(({ record }) => record.question.id));
      const ordered: QuestionRecord[] = [];
      for (const id of bankProvenance.undated) {
        const record = recordsById.get(id);
        if (!record || seen.has(id)) continue;
        seen.add(id);
        ordered.push(record);
      }
      for (const record of records) {
        if (seen.has(record.question.id)) continue;
        seen.add(record.question.id);
        ordered.push(record);
      }
      return ordered;
    },
    [newestDatedRecords, records, recordsById],
  );
  const visibleRecords = browseMode === "newest"
    ? [...newestDatedRecords.map(({ record }) => record), ...newestUndatedRecords]
    : bucketMatches;
  const selectedKey = browseMode === "newest" ? newestSelectionKey : bucket.id;
  const selectedId = selectedIdsByBucket[selectedKey] ?? visibleRecords[0]?.question.id ?? "";
  const selectedRecord = visibleRecords.find((record) => record.question.id === selectedId) ?? visibleRecords[0];
  const selectedQuestion = selectedRecord?.question;
  const selectedSubmitted = Boolean(selectedQuestion && (mode === "review" || submittedIds.has(selectedQuestion.id)));
  const selectedAnswer = selectedQuestion
    ? mode === "review"
      ? getCorrectAnswer(selectedQuestion)
      : answers[selectedQuestion.id] ?? getInitialAnswer(selectedQuestion)
    : {};
  const result = selectedQuestion && selectedSubmitted ? gradeQuestion(selectedQuestion, selectedAnswer) : undefined;
  const isMobilePreview = mode === "mobile";
  const caseStudyLayout: CaseStudyLayoutMode = mode === "live" ? "split" : "stacked";
  const standaloneVisualLayout: CaseStudyLayoutMode = mode === "live" ? "split" : "stacked";
  const currentCasePart =
    selectedQuestion?.itemType === "case_study"
      ? selectedQuestion.caseStudy.questions.find(
          (caseQuestion) => caseQuestion.id === (casePartIds[selectedQuestion.id] ?? selectedQuestion.caseStudy.questions[0]?.id),
        ) ?? selectedQuestion.caseStudy.questions[0]
      : undefined;
  const productionVisibleStages =
    selectedQuestion?.itemType === "case_study"
      ? getVisibleCaseStages(selectedQuestion, currentCasePart)
      : [];
  const displayedVisibleStageCount =
    showAllStages && selectedQuestion?.itemType === "case_study"
      ? selectedQuestion.caseStudy.stages?.length ?? 0
      : productionVisibleStages.length;

  const selectQuestion = (questionId: string) => {
    setSelectedIdsByBucket((current) => ({ ...current, [selectedKey]: questionId }));
    setShowAllStages(false);
  };
  const updateAnswer = (answer: AnswerState) => {
    if (!selectedQuestion || mode === "review") return;
    setAnswers((current) => ({ ...current, [selectedQuestion.id]: answer }));
  };
  const submitLocal = () => {
    if (!selectedQuestion || mode === "review") return;
    setSubmittedIds((current) => {
      const next = new Set(current);
      next.add(selectedQuestion.id);
      return next;
    });
  };
  const resetLocal = () => {
    if (!selectedQuestion) return;
    setAnswers((current) => {
      const { [selectedQuestion.id]: _removed, ...rest } = current;
      return rest;
    });
    setSubmittedIds((current) => {
      const next = new Set(current);
      next.delete(selectedQuestion.id);
      return next;
    });
  };

  return (
    <section className="preview-lab-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Developer preview</p>
          <h3>Preview Lab</h3>
          <p>Inspect layout behavior using bundled questions. Does not save answers or progress.</p>
        </div>
        <button type="button" onClick={onBack}>
          <ChevronLeft aria-hidden="true" />
          <span>Settings</span>
        </button>
      </div>
      <div className="preview-lab-body">
        <div className="preview-note">Preview only - answers are not saved.</div>
        <div className="segmented preview-browse-toggle" role="group" aria-label="Preview browse mode">
          <button
            className={browseMode === "buckets" ? "active" : ""}
            type="button"
            aria-pressed={browseMode === "buckets"}
            onClick={() => setBrowseMode("buckets")}
          >
            Buckets
          </button>
          <button
            className={browseMode === "newest" ? "active" : ""}
            type="button"
            aria-pressed={browseMode === "newest"}
            onClick={() => setBrowseMode("newest")}
          >
            Newest
          </button>
        </div>
        <div className="preview-controls">
          {browseMode === "buckets" && (
            <label>
              <span>Preview bucket</span>
              <select value={bucket.id} onChange={(event) => setBucketId(event.target.value)}>
                {groupedBuckets.map(([group, items]) => (
                  <optgroup label={group} key={group}>
                    {items.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          )}
          <label>
            <span>Question</span>
            <select
              value={selectedRecord?.question.id ?? ""}
              onChange={(event) => selectQuestion(event.target.value)}
              disabled={visibleRecords.length === 0}
            >
              {browseMode === "newest" ? (
                <>
                  {newestDatedRecords.map(({ record, entry }) => (
                    <option value={record.question.id} key={record.question.id}>
                      {newestQuestionLabel(record, entry)}
                    </option>
                  ))}
                  {newestUndatedRecords.length > 0 && (
                    <optgroup label="Undated / unresolved history">
                      {newestUndatedRecords.map((record) => (
                        <option value={record.question.id} key={record.question.id}>
                          {previewQuestionLabel(record)}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </>
              ) : (
                bucketMatches.map((record) => (
                  <option value={record.question.id} key={record.question.id}>
                    {previewQuestionLabel(record)}
                  </option>
                ))
              )}
            </select>
          </label>
          <label>
            <span>Preview mode</span>
            <div className="segmented preview-mode-toggle" role="group" aria-label="Preview mode">
              {previewModes.map((option) => (
                <button
                  className={mode === option.value ? "active" : ""}
                  type="button"
                  aria-pressed={mode === option.value}
                  key={option.value}
                  onClick={() => setMode(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </label>
          <label className="toggle-row preview-calculator-toggle">
            <input
              type="checkbox"
              checked={showCalculator}
              onChange={(event) => setShowCalculator(event.target.checked)}
            />
            <span>Show calculator</span>
          </label>
        </div>

        {selectedQuestion?.itemType === "case_study" && currentCasePart && (
          <div className="preview-case-controls">
            <label>
              <span>Current part</span>
              <select
                value={currentCasePart.id}
                onChange={(event) =>
                  setCasePartIds((current) => ({ ...current, [selectedQuestion.id]: event.target.value }))
                }
              >
                {selectedQuestion.caseStudy.questions.map((caseQuestion, index) => (
                  <option value={caseQuestion.id} key={caseQuestion.id}>
                    Part {index + 1} - {caseQuestion.id}
                  </option>
                ))}
              </select>
            </label>
            <div className="preview-stage-readout">
              <span>stageId: {currentCasePart.stageId ?? "none"}</span>
              <span>answerableAfterStageId: {formatCaseVisibilityBoundary(currentCasePart.answerableAfterStageId)}</span>
              <span>visible stages: {displayedVisibleStageCount}</span>
            </div>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={showAllStages}
                onChange={(event) => setShowAllStages(event.target.checked)}
              />
              <span>Show all stages</span>
            </label>
          </div>
        )}

        {selectedQuestion ? (
          <>
            <div className="preview-layout-readout">
              <span>{selectedRecord?.sourceLabel ?? "Bundled"}</span>
              <span>{formatItemType(selectedQuestion.itemType)}</span>
              {selectedQuestion.visual && <span>{selectedQuestion.visual.kind}</span>}
              <span>
                {mode === "review"
                  ? "Current review behavior"
                  : isMobilePreview
                    ? "Narrow stacked inspection"
                    : "Live split gates"}
              </span>
            </div>
            <div className={isMobilePreview ? "preview-canvas mobile-preview-canvas" : "preview-canvas"}>
              <QuestionCard
                question={selectedQuestion}
                answer={selectedAnswer}
                submitted={selectedSubmitted}
                result={result}
                languageMode={settings.languageMode}
                flagged={false}
                voiceEnabled={settings.voiceEnabled}
                onAnswer={updateAnswer}
                onSubmit={submitLocal}
                onToggleFlag={() => undefined}
                reviewMode={mode === "review"}
                caseStudyLayout={isMobilePreview ? "stacked" : caseStudyLayout}
                standaloneVisualLayout={isMobilePreview ? "stacked" : standaloneVisualLayout}
                controlledCasePartId={currentCasePart?.id}
                onControlledCasePartChange={
                  selectedQuestion.itemType === "case_study"
                    ? (partId) => setCasePartIds((current) => ({ ...current, [selectedQuestion.id]: partId }))
                    : undefined
                }
                showAllCaseStages={showAllStages}
                showQuestionActions={false}
              />
            </div>
            {mode !== "review" && (
              <div className="action-row compact">
                <button type="button" onClick={resetLocal}>
                  <RotateCcw aria-hidden="true" />
                  <span>Reset local answer</span>
                </button>
              </div>
            )}
            {showCalculator && <ExamCalculator key={`preview:${selectedQuestion.id}`} />}
          </>
        ) : (
          <div className="session-empty-state">
            <p>No bundled question found for this preview bucket.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function newestQuestionLabel(record: QuestionRecord, entry: BankProvenanceEntry) {
  return `${entry.firstSeenDate.slice(0, 10)} · ${formatItemType(record.question.itemType)} · ${record.question.id} — ${previewQuestionTitle(record)}`;
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

const formatTelemetryDate = (value: string | undefined) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatTelemetryElapsed = (elapsedMs: number | undefined) => {
  if (elapsedMs === undefined) return "—";
  const seconds = elapsedMs / 1000;
  return `${seconds < 10 ? seconds.toFixed(1).replace(/\.0$/, "") : Math.round(seconds)}s`;
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
                caseStudyLayout="stacked"
                standaloneVisualLayout="stacked"
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
  const rescuePrompt =
    submitted && result === false && question.itemType !== "case_study"
      ? makeRescuePrompt(question, answer, true)
      : undefined;
  const casePartRescuePrompts =
    submitted && question.itemType === "case_study"
      ? makeCasePartRescuePrompts(question, answer, true)
      : undefined;
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

  if (submitted && !session.attempts[question.id]) return <section className="session-shell stack">
    <h2>Legacy submitted question</h2><p>The original question and submitted answer cannot be verified. Your recorded outcome is kept.</p>
    <p>{result ? "Full marks" : "Not fully correct"}{session.scores[question.id] ? ` · ${session.scores[question.id].earned} of ${session.scores[question.id].possible} points` : ""}</p>
    <div className="action-row"><button onClick={onExit}>{exitLabel}</button><button onClick={onFinish}>End set</button><button onClick={onNext}>{isLast ? "Finish" : "Next"}</button></div>
  </section>;

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

      {!session.fingerprints[question.id] && <p className="warning-band">Legacy set: original question content is unverified. Previous outcomes are preserved.</p>}
      <HistoricalAttemptContext.Provider value={session.attempts[question.id]??null}>
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


        rescuePrompt={rescuePrompt}
        casePartRescuePrompts={casePartRescuePrompts}
      />

      </HistoricalAttemptContext.Provider>

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
      <ExamCalculator key={`${session.id}:${question.id}`} />
    </section>
  );
}

function LanguageTabs({ value, onChange }: { value: LanguageMode; onChange: (mode: LanguageMode) => void }) {
  return (
    <div className="segmented" role="group" aria-label="Chinese display">
      {(["off", "on-tap", "always"] as const).map((mode) => (
        <button className={value === mode ? "active" : ""} aria-pressed={value === mode} type="button" key={mode} onClick={() => onChange(mode)}>
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
  caseStudyLayout = "split",
  standaloneVisualLayout = "split",
  controlledCasePartId,
  onControlledCasePartChange,
  showAllCaseStages = false,
  showQuestionActions = true,
  rescuePrompt,
  casePartRescuePrompts,
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
  caseStudyLayout?: CaseStudyLayoutMode;
  standaloneVisualLayout?: CaseStudyLayoutMode;
  controlledCasePartId?: string;
  onControlledCasePartChange?: (partId: string) => void;
  showAllCaseStages?: boolean;
  showQuestionActions?: boolean;
  rescuePrompt?: GptRescuePrompt;
  casePartRescuePrompts?: Record<string, GptRescuePrompt>;
}) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [activeTerm, setActiveTerm] = useState<ActiveTermPopover | null>(null);
  const [revealAllSignal, setRevealAllSignal] = useState(0);
  const [fullRevealed, setFullRevealed] = useState(false);
  const handleTermSelect = useCallback<TermSelectHandler>((term, anchor) => {
    const card = cardRef.current;
    if (!card || !anchor) {
      setActiveTerm({ term });
      return;
    }

    const cardRect = card.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    const containingPane = anchor.closest(
      ".exam-split-chart-pane, .exam-split-work-pane, .standalone-visual-pane, .standalone-work-pane",
    );
    const boundsRect = containingPane instanceof HTMLElement ? containingPane.getBoundingClientRect() : cardRect;
    const minLeft = boundsRect.left - cardRect.left + 16;
    const maxRight = boundsRect.right - cardRect.left - 16;
    const popoverWidth = Math.min(336, Math.max(220, maxRight - minLeft));
    const left = Math.min(
      Math.max(anchorRect.left - cardRect.left, minLeft),
      Math.max(minLeft, maxRight - popoverWidth),
    );
    const top = Math.max(16, anchorRect.bottom - cardRect.top + 8);
    setActiveTerm({
      term,
      style: {
        top,
        left,
        right: "auto",
        width: popoverWidth,
      },
    });
  }, []);
  const readyToSubmit = getAnswerCompleteness(question, answer);
  const historicalAttempt = useContext(HistoricalAttemptContext);
  const score = submitted ? historicalAttempt?.score ?? scoreQuestion(question, answer) : undefined;
  const showsPartialCredit = !reviewMode && score !== undefined && score.possible > 1;
  const showsStandaloneVisualSplit =
    standaloneVisualLayout !== "stacked" && usesStandaloneVisualSplit(question);
  const usesStandaloneIoTrendLayout =
    showsStandaloneVisualSplit && question.visual?.kind === "io_trend";
  const usesStandaloneVitalsLayout =
    showsStandaloneVisualSplit && question.visual?.kind === "vitals_trend";
  useEffect(() => {
    setRevealAllSignal(0);
    setFullRevealed(false);
  }, [question.id]);
  const questionHasZh = useMemo(() => hasQuestionLevelZh(question), [question]);
  const showTranslateAll =
    submitted &&
    languageMode === "on-tap" &&
    questionHasZh &&
    !fullRevealed;
  const handleTranslateAll = useCallback(() => {
    if (fullRevealed) return;
    setRevealAllSignal((current) => current + 1);
    setFullRevealed(true);
  }, [fullRevealed]);

  const answerBody = (
    <>
      <div className="stem-row">
        <BilingualText
          pair={question.stem}
          mode={languageMode}
          className="stem"
          glossary={question.glossary}
          onTerm={handleTermSelect}
        />
        <SpeakButton text={question.stem.en} enabled={voiceEnabled} label="Read stem" />
        <ReadAllButton question={question} enabled={voiceEnabled} />
      </div>

      {activeTerm && (
        <div className="term-popover" style={activeTerm.style}>
          <button type="button" onClick={() => setActiveTerm(null)} aria-label="Close term">
            x
          </button>
          <strong>
            {activeTerm.term.termEn} · {activeTerm.term.termZh}
          </strong>
          <p>{activeTerm.term.defZh}</p>
        </div>
      )}

      <QuestionAnswerControl
        question={question}
        answer={answer}
        submitted={submitted}
        languageMode={languageMode}
        voiceEnabled={voiceEnabled}
        onTerm={handleTermSelect}
        onAnswer={onAnswer}
        onSubmit={onSubmit}
        readyToSubmit={readyToSubmit}
        showTopLevelSubmit={question.itemType === "case_study" && !submitted && !reviewMode}
        focusedPartId={focusedPartId}
        caseStudyLayout={caseStudyLayout}
        controlledCasePartId={controlledCasePartId}
        onControlledCasePartChange={onControlledCasePartChange}
        showAllCaseStages={showAllCaseStages}
        casePartRescuePrompts={casePartRescuePrompts}
      />

      {!submitted && !reviewMode && question.itemType !== "case_study" && (
        <button className="primary-action submit-button" type="button" disabled={!readyToSubmit} onClick={onSubmit}>
          <CheckCircle2 aria-hidden="true" />
          <span>Submit answer</span>
        </button>
      )}

      {submitted && (
        <div className={`answer-banner ${reviewMode || result ? "correct" : "incorrect"}`}>
          {reviewMode || result ? <CheckCircle2 aria-hidden="true" /> : <XCircle aria-hidden="true" />}
          <div>
            <strong>{reviewMode ? "Correct answer shown" : result ? (historicalAttempt && !progress ? "Full marks this attempt" : "Full marks this attempt · Removed from Needs review") : (historicalAttempt && !progress ? "Not fully correct" : "Not fully correct · Needs review")}</strong>
            {showsPartialCredit && score && (
              <span>
                {score.earned} of {score.possible} points
                {!result && score.earned > 0 ? " · Needs review." : ""}
              </span>
            )}
          </div>
        </div>
      )}

      {submitted && (
        <RationalePanel
          question={question}
          voiceEnabled={voiceEnabled}
          languageMode={languageMode}
        />
      )}

      {(showTranslateAll || (submitted && rescuePrompt)) && (
        <div className="post-rationale-actions">
          {showTranslateAll && <TranslateAllButton onClick={handleTranslateAll} />}
          {submitted && rescuePrompt && <GptRescueButton prompt={rescuePrompt} />}
        </div>
      )}
    </>
  );
  const revealedAnswerBody = <RevealAllContext.Provider value={revealAllSignal}>{answerBody}</RevealAllContext.Provider>;

  return (
    <article ref={cardRef} className={`question-card ${question.itemType === "case_study" && caseStudyLayout === "split" ? "split-case-card" : ""} ${showsStandaloneVisualSplit ? "standalone-visual-card" : ""}`}>
      <div className="question-meta">
        <span className="type-pill">{formatItemType(question.itemType)}</span>
        <span>{question.category}</span>
        <span>{question.topic}</span>
        <span>{question.difficulty}</span>
        {flagged && <span className="type-pill">Saved</span>}
        {progress?.needsReview && <span className="missed-pill">Review</span>}
        {showQuestionActions && (
          <button
            className={`icon-action flag-action ${flagged ? "flagged" : ""}`}
            type="button"
            aria-label={flagged ? "Remove from Saved" : "Save question"}
            title={flagged ? "Remove from Saved" : "Save question"}
            aria-pressed={flagged}
            onClick={onToggleFlag}
          >
            <Flag aria-hidden="true" />
          </button>
        )}
      </div>

      {showsStandaloneVisualSplit ? (
        <div
          className={`exam-split-layout standalone-visual-layout ${usesStandaloneIoTrendLayout ? "standalone-io-trend-layout" : ""} ${usesStandaloneVitalsLayout ? "standalone-vitals-layout" : ""}`}
        >
          <aside className="standalone-visual-pane" aria-label="Clinical visual">
            <VisualStimulus visual={question.visual} languageMode={languageMode} />
          </aside>
          <div className="standalone-work-pane">{revealedAnswerBody}</div>
        </div>
      ) : (
        <>
          <VisualStimulus visual={question.visual} languageMode={languageMode} />
          {revealedAnswerBody}
        </>
      )}
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
  onSubmit,
  readyToSubmit = false,
  showTopLevelSubmit = false,
  focusedPartId,
  caseStudyLayout = "split",
  controlledCasePartId,
  onControlledCasePartChange,
  showAllCaseStages = false,
  casePartRescuePrompts,
}: {
  question: Question;
  answer: AnswerState;
  submitted: boolean;
  languageMode: LanguageMode;
  voiceEnabled: boolean;
  onTerm: TermSelectHandler;
  onAnswer: (answer: AnswerState) => void;
  onSubmit?: () => void;
  readyToSubmit?: boolean;
  showTopLevelSubmit?: boolean;
  focusedPartId?: string;
  caseStudyLayout?: CaseStudyLayoutMode;
  controlledCasePartId?: string;
  onControlledCasePartChange?: (partId: string) => void;
  showAllCaseStages?: boolean;
  casePartRescuePrompts?: Record<string, GptRescuePrompt>;
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
        onSubmit={onSubmit}
        readyToSubmit={readyToSubmit}
        showTopLevelSubmit={showTopLevelSubmit}
        focusedPartId={focusedPartId}
        layoutMode={caseStudyLayout}
        controlledActivePartId={controlledCasePartId}
        onControlledActivePartChange={onControlledCasePartChange}
        showAllStages={showAllCaseStages}
        casePartRescuePrompts={casePartRescuePrompts}
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
  onTerm: TermSelectHandler;
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
                      <BilingualText
                        pair={token}
                        mode={languageMode}
                        glossary={question.glossary}
                        onTerm={onTerm}
                        revealOnEnglishClick={false}
                      />
                    ) : (
                      <span className="bowtie-empty">Choose a token</span>
                    )}
                  </button>
                );
              })}
            </div>
            {!submitted && (
              <div className="bowtie-token-pool" aria-label={`${label} token choices`}>
                {zone.tokens.map((token) => {
                  const selected = current.includes(token.id);
                  return (
                    <button
                      className={`bowtie-token ${selected ? "selected" : ""}`}
                      type="button"
                      key={token.id}
                      disabled={selected || current.length >= targetCount}
                      aria-pressed={selected}
                      aria-label={`${token.en}${selected ? ", placed" : ""}`}
                      onClick={() => placeToken(token.id)}
                    >
                      <BilingualText
                        pair={token}
                        mode={languageMode}
                        glossary={question.glossary}
                        onTerm={onTerm}
                        revealOnEnglishClick={false}
                      />
                    </button>
                  );
                })}
              </div>
            )}
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
  const revealAllSignal = useContext(RevealAllContext);
  const lastRevealAllSignalRef = useRef(revealAllSignal);
  const selectedIds = answer.segments ?? [];
  const correctIds = new Set(question.highlight.correct);
  const hasZh = question.highlight.segments.some((segment) => (segment.zh ?? "").trim().length > 0);
  const showZh = hasZh && (languageMode === "always" || (languageMode === "on-tap" && revealed));
  useEffect(() => {
    if (revealAllSignal === lastRevealAllSignalRef.current) return;
    lastRevealAllSignalRef.current = revealAllSignal;
    if (languageMode === "on-tap" && !revealed && hasZh) setRevealed(true);
  }, [hasZh, languageMode, revealAllSignal, revealed]);
  const handleReveal = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (revealed || languageMode !== "on-tap" || !hasZh) return;
    setRevealed(true);
  };

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
      {languageMode === "on-tap" && !revealed && hasZh && (
        <button className="inline-reveal" type="button" onClick={handleReveal}>
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
  onTerm: TermSelectHandler;
  onAnswer: (answer: AnswerState) => void;
}) {
  const selectedIds = answer.optionIds ?? (question.itemType === "ordered_response" ? question.options.map((option) => option.id) : []);
  const optionsById = new Map(question.options.map((option) => [option.id, option]));
  const optionIndexById = new Map(question.options.map((option, index) => [option.id, index] as const));

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
              <BilingualText
                pair={option}
                mode={languageMode}
                glossary={question.glossary}
                onTerm={onTerm}
                revealOnEnglishClick={false}
              />
              {submitted && <span className="response-status">{correctIndex === index ? "Correct position" : `Correct position: ${correctIndex + 1}`}</span>}
              <SpeakButton
                text={option.en}
                enabled={voiceEnabled}
                label={`Read option ${optionMarker(optionIndexById.get(option.id) ?? index)}`}
              />
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
      {question.options.map((option, optionIndex) => {
        const selected = selectedIds.includes(option.id);
        const correct = question.correct.includes(option.id);
        const statusClass = submitted ? (correct ? "correct" : selected ? "incorrect" : "") : selected ? "selected" : "";
        return (
          <div
            className={`option-row ${statusClass}`}
            key={option.id}
            role="button"
            tabIndex={submitted ? -1 : 0}
            aria-disabled={submitted}
            onClick={() => toggleOption(option.id)}
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget) return;
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              toggleOption(option.id);
            }}
            aria-pressed={selected}
          >
            <span className="option-control" aria-hidden="true">
              {question.itemType === "multiple_choice" ? (selected ? "●" : "○") : selected ? "☑" : "☐"}
            </span>
            <span className="option-id">{optionMarker(optionIndex)}</span>
            <BilingualText
              pair={option}
              mode={languageMode}
              glossary={question.glossary}
              onTerm={onTerm}
              revealOnEnglishClick={false}
            />
            {submitted && (correct || selected) && <span className="response-status">{selected ? "Selected · " : ""}{correct ? "Correct answer" : "Not correct"}</span>}
            <span className="option-audio-control" onClick={(event) => event.stopPropagation()}>
              <SpeakButton text={option.en} enabled={voiceEnabled} label={`Read option ${optionMarker(optionIndex)}`} />
            </span>
          </div>
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
  const historicalAttempt = useContext(HistoricalAttemptContext);
  return (
    <div className="blank-list">
      {question.blanks.map((blank) => {
        const value = blanks[blank.id] ?? "";
        const isCorrect = !historicalAttempt && gradeQuestion({ ...question, blanks: [blank] }, { blanks: { [blank.id]: value } });
        const statusClass = submitted && !historicalAttempt ? (isCorrect ? "correct" : "incorrect") : "";
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
  onTerm: TermSelectHandler;
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
                    <button
                      type="button"
                      onClick={() => toggleCell(row.id, column.id)}
                      aria-pressed={selected}
                      aria-label={`${row.en} — ${column.en}${submitted ? correct ? " — Correct answer" : selected ? " — Not correct" : "" : ""}`}
                      aria-disabled={submitted || undefined}
                    >
                      {question.matrix.selectionMode === "single_per_row" ? (selected ? "●" : "○") : selected ? "☑" : "☐"}
                      {submitted && (correct || selected) && <small>{correct ? "Correct" : "Not correct"}</small>}
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
  const revealAllSignal = useContext(RevealAllContext);
  const lastRevealAllSignalRef = useRef(revealAllSignal);
  const dropdowns = answer.dropdowns ?? {};
  const hasZh = (question.clozeStem.zh ?? "").trim().length > 0;
  const showZh = hasZh && (languageMode === "always" || (languageMode === "on-tap" && revealed));
  useEffect(() => {
    if (revealAllSignal === lastRevealAllSignalRef.current) return;
    lastRevealAllSignalRef.current = revealAllSignal;
    if (languageMode === "on-tap" && !revealed && hasZh) setRevealed(true);
  }, [hasZh, languageMode, revealAllSignal, revealed]);
  const handleReveal = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (revealed || languageMode !== "on-tap" || !hasZh) return;
    setRevealed(true);
  };

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
      {languageMode === "on-tap" && !revealed && hasZh && (
        <button className="inline-reveal" type="button" onClick={handleReveal}>
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
  onSubmit,
  readyToSubmit = false,
  showTopLevelSubmit = false,
  focusedPartId,
  layoutMode = "split",
  controlledActivePartId,
  onControlledActivePartChange,
  showAllStages = false,
  casePartRescuePrompts,
}: {
  question: Extract<Question, { itemType: "case_study" }>;
  answer: AnswerState;
  submitted: boolean;
  languageMode: LanguageMode;
  voiceEnabled: boolean;
  onTerm: TermSelectHandler;
  onAnswer: (answer: AnswerState) => void;
  onSubmit?: () => void;
  readyToSubmit?: boolean;
  showTopLevelSubmit?: boolean;
  focusedPartId?: string;
  layoutMode?: CaseStudyLayoutMode;
  controlledActivePartId?: string;
  onControlledActivePartChange?: (partId: string) => void;
  showAllStages?: boolean;
  casePartRescuePrompts?: Record<string, GptRescuePrompt>;
}) {
  const historicalAttempt = useContext(HistoricalAttemptContext);
  const caseAnswers = answer.caseStudy ?? {};
  const caseQuestions = question.caseStudy.questions;
  const workPaneRef = useRef<HTMLDivElement | null>(null);
  const getDefaultActivePartId = () => {
    if (focusedPartId && caseQuestions.some((caseQuestion) => caseQuestion.id === focusedPartId)) {
      return focusedPartId;
    }
    if (submitted) {
      const firstMissed = caseQuestions.find((caseQuestion) => {
        const caseAnswer = caseAnswers[caseQuestion.id] ?? getInitialAnswer(caseQuestion);
        return historicalAttempt ? historicalAttempt.parts?.[caseQuestion.id]?.result === false : !gradeQuestion(caseQuestion, caseAnswer);
      });
      if (firstMissed) return firstMissed.id;
    }
    return caseQuestions[0]?.id ?? "";
  };
  const [activePartId, setActivePartId] = useState(getDefaultActivePartId);
  const controlledPartIsValid = controlledActivePartId !== undefined &&
    caseQuestions.some((caseQuestion) => caseQuestion.id === controlledActivePartId);
  const effectiveActivePartId = controlledPartIsValid
    ? controlledActivePartId
    : activePartId;
  const previousActivePartId = useRef(effectiveActivePartId);
  const selectActivePart = (partId: string) => {
    setActivePartId(partId);
    onControlledActivePartChange?.(partId);
  };
  useEffect(() => {
    if (focusedPartId && caseQuestions.some((caseQuestion) => caseQuestion.id === focusedPartId)) {
      setActivePartId(focusedPartId);
      onControlledActivePartChange?.(focusedPartId);
      return;
    }

    setActivePartId((current) => {
      if (caseQuestions.some((caseQuestion) => caseQuestion.id === current)) {
        return current;
      }
      return caseQuestions[0]?.id ?? "";
    });
  }, [focusedPartId, caseQuestions, onControlledActivePartChange]);
  useEffect(() => {
    if (previousActivePartId.current === effectiveActivePartId) return;
    previousActivePartId.current = effectiveActivePartId;
    const workPane = workPaneRef.current;
    if (!workPane) return;
    workPane.scrollIntoView({ block: "start", behavior: "auto" });
  }, [effectiveActivePartId]);

  const activeIndex = Math.max(
    0,
    caseQuestions.findIndex((caseQuestion) => caseQuestion.id === effectiveActivePartId),
  );
  const activeQuestion = caseQuestions[activeIndex] ?? caseQuestions[0];
  const visibleStages = showAllStages
    ? question.caseStudy.stages ?? []
    : getVisibleCaseStages(question, activeQuestion);
  const updateCaseAnswer = (questionId: string, nextAnswer: AnswerState) => {
    onAnswer({ ...answer, caseStudy: { ...caseAnswers, [questionId]: nextAnswer } });
  };

  if (layoutMode === "stacked") {
    return (
      <CaseStudyStackedLayout
        question={question}
        caseAnswers={caseAnswers}
        submitted={submitted}
        languageMode={languageMode}
        voiceEnabled={voiceEnabled}
        focusedPartId={focusedPartId}
        stagesOverride={controlledPartIsValid || showAllStages ? visibleStages : undefined}
        onTerm={onTerm}
        onCaseAnswer={updateCaseAnswer}
        casePartRescuePrompts={casePartRescuePrompts}
      />
    );
  }

  return (
    <div className="case-study-panel exam-split-layout">
      <CaseChartPane
        question={question}
        stages={visibleStages}
        languageMode={languageMode}
        onTerm={onTerm}
      />

      <div className="exam-split-work-pane" ref={workPaneRef}>
        {caseQuestions.map((caseQuestion, index) => (
          <CaseActivePart
            key={caseQuestion.id}
            caseQuestion={caseQuestion}
            index={index}
            total={caseQuestions.length}
            answer={caseAnswers[caseQuestion.id] ?? getInitialAnswer(caseQuestion)}
            submitted={submitted}
            languageMode={languageMode}
            voiceEnabled={voiceEnabled}
            focused={focusedPartId === caseQuestion.id}
            hidden={caseQuestion.id !== activeQuestion?.id}
            onTerm={onTerm}
            onAnswer={(nextAnswer) => updateCaseAnswer(caseQuestion.id, nextAnswer)}
            rescuePrompt={casePartRescuePrompts?.[caseQuestion.id]}
          />
        ))}
        <div className="case-work-toolbar case-work-footer">
          <CasePartNavigator
            question={question}
            caseAnswers={caseAnswers}
            activePartId={activeQuestion?.id ?? ""}
            submitted={submitted}
            onSelect={selectActivePart}
          />
          {showTopLevelSubmit && onSubmit && (
            <button
              className="primary-action submit-button case-submit-button"
              type="button"
              disabled={!readyToSubmit}
              title={readyToSubmit ? "Submit all parts" : `Complete all ${caseQuestions.length} parts before submitting`}
              onClick={onSubmit}
            >
              <CheckCircle2 aria-hidden="true" />
              <span>Submit all parts</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CaseStudyStackedLayout({
  question,
  caseAnswers,
  submitted,
  languageMode,
  voiceEnabled,
  focusedPartId,
  stagesOverride,
  onTerm,
  onCaseAnswer,
  casePartRescuePrompts,
}: {
  question: Extract<Question, { itemType: "case_study" }>;
  caseAnswers: Record<string, AnswerState>;
  submitted: boolean;
  languageMode: LanguageMode;
  voiceEnabled: boolean;
  focusedPartId?: string;
  stagesOverride?: Extract<Question, { itemType: "case_study" }>["caseStudy"]["stages"];
  onTerm: TermSelectHandler;
  onCaseAnswer: (questionId: string, answer: AnswerState) => void;
  casePartRescuePrompts?: Record<string, GptRescuePrompt>;
}) {
  return (
    <div className="case-study-panel">
      <CaseChartPane
        question={question}
        stages={stagesOverride ?? question.caseStudy.stages ?? []}
        languageMode={languageMode}
        onTerm={onTerm}
      />
      <div className="case-question-list">
        {question.caseStudy.questions.map((caseQuestion, index) => (
          <CaseActivePart
            key={caseQuestion.id}
            caseQuestion={caseQuestion}
            index={index}
            total={question.caseStudy.questions.length}
            answer={caseAnswers[caseQuestion.id] ?? getInitialAnswer(caseQuestion)}
            submitted={submitted}
            languageMode={languageMode}
            voiceEnabled={voiceEnabled}
            focused={focusedPartId === caseQuestion.id}
            onTerm={onTerm}
            onAnswer={(nextAnswer) => onCaseAnswer(caseQuestion.id, nextAnswer)}
            rescuePrompt={casePartRescuePrompts?.[caseQuestion.id]}
          />
        ))}
      </div>
    </div>
  );
}

function CaseChartPane({
  question,
  stages,
  languageMode,
  onTerm,
}: {
  question: Extract<Question, { itemType: "case_study" }>;
  stages: Extract<Question, { itemType: "case_study" }>["caseStudy"]["stages"];
  languageMode: LanguageMode;
  onTerm: TermSelectHandler;
}) {
  return (
    <aside className="exam-split-chart-pane" aria-label="Client chart">
      <div className="case-study-header">
        <BilingualText
          pair={question.caseStudy.title}
          mode={languageMode}
          glossary={question.glossary}
          onTerm={onTerm}
        />
        {question.caseStudy.summary && (
          <BilingualText
            pair={question.caseStudy.summary}
            mode={languageMode}
            glossary={question.glossary}
            onTerm={onTerm}
          />
        )}
      </div>

      {question.caseStudy.exhibits.length > 0 && (
        <section className="case-chart-section">
          <h3>Client record</h3>
          <div className="case-exhibits">
            {question.caseStudy.exhibits.map((exhibit) => (
              <CaseExhibit
                key={exhibit.id}
                exhibit={exhibit}
                languageMode={languageMode}
                glossary={question.glossary}
                onTerm={onTerm}
              />
            ))}
          </div>
        </section>
      )}

      {stages && stages.length > 0 && (
        <section className="case-chart-section">
          <h3>Updates</h3>
          {stages.map((stage) => (
            <section className="case-stage" key={stage.id}>
              <div className="case-stage-heading">
                <BilingualText pair={stage.title} mode={languageMode} className="case-stage-title" />
                {stage.timeOffset && <span>{stage.timeOffset}</span>}
              </div>
              {stage.trigger && (
                <BilingualText
                  pair={stage.trigger}
                  mode={languageMode}
                  className="case-stage-note"
                  glossary={question.glossary}
                  onTerm={onTerm}
                />
              )}
              {stage.narrative && (
                <BilingualText
                  pair={stage.narrative}
                  mode={languageMode}
                  className="case-stage-note"
                  glossary={question.glossary}
                  onTerm={onTerm}
                />
              )}
              {stage.exhibits.length > 0 && (
                <div className="case-exhibits">
                  {stage.exhibits.map((exhibit) => (
                    <CaseExhibit
                      key={exhibit.id}
                      exhibit={exhibit}
                      languageMode={languageMode}
                      glossary={question.glossary}
                      onTerm={onTerm}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </section>
      )}
    </aside>
  );
}

function CasePartNavigator({
  question,
  caseAnswers,
  activePartId,
  submitted,
  onSelect,
}: {
  question: Extract<Question, { itemType: "case_study" }>;
  caseAnswers: Record<string, AnswerState>;
  activePartId: string;
  submitted: boolean;
  onSelect: (partId: string) => void;
}) {
  const historicalAttempt = useContext(HistoricalAttemptContext);
  const activeIndex = Math.max(
    0,
    question.caseStudy.questions.findIndex((caseQuestion) => caseQuestion.id === activePartId),
  );
  const previousPart = question.caseStudy.questions[activeIndex - 1];
  const nextPart = question.caseStudy.questions[activeIndex + 1];
  const completeCount = question.caseStudy.questions.filter((caseQuestion) =>
    getAnswerCompleteness(caseQuestion, caseAnswers[caseQuestion.id] ?? getInitialAnswer(caseQuestion)),
  ).length;
  return (
    <nav className="case-part-nav" aria-label="Case study parts">
      <div className="case-part-nav-controls">
        <button type="button" onClick={() => previousPart && onSelect(previousPart.id)} disabled={!previousPart}>
          <ChevronLeft aria-hidden="true" />
          <span>Previous</span>
        </button>
        <span>
          Part {activeIndex + 1} of {question.caseStudy.questions.length}
        </span>
        <button type="button" onClick={() => nextPart && onSelect(nextPart.id)} disabled={!nextPart}>
          <span>Next</span>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <div className="case-part-nav-summary" aria-live="polite">
        {completeCount} of {question.caseStudy.questions.length} parts complete
      </div>
      <div className="case-part-chip-list">
        {question.caseStudy.questions.map((caseQuestion, index) => {
          const caseAnswer = caseAnswers[caseQuestion.id] ?? getInitialAnswer(caseQuestion);
          const complete = getAnswerCompleteness(caseQuestion, caseAnswer);
          const correct = submitted ? historicalAttempt ? historicalAttempt.parts?.[caseQuestion.id]?.result : gradeQuestion(caseQuestion, caseAnswer) : undefined;
          const statusClass = submitted ? (correct ? "correct" : "missed") : complete ? "complete" : "";
          return (
            <button
              className={`case-part-chip ${statusClass} ${activePartId === caseQuestion.id ? "active" : ""}`}
              type="button"
              key={caseQuestion.id}
              aria-current={activePartId === caseQuestion.id ? "step" : undefined}
              onClick={() => onSelect(caseQuestion.id)}
            >
              <span>Part {index + 1}</span>
              <small>{submitted ? (correct ? "Correct" : "Review") : complete ? "Complete" : "Open"}</small>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function CaseActivePart({
  caseQuestion,
  index,
  total,
  answer,
  submitted,
  languageMode,
  voiceEnabled,
  focused,
  hidden = false,
  onTerm,
  onAnswer,
  rescuePrompt,
}: {
  caseQuestion: Extract<Question, { itemType: "case_study" }>["caseStudy"]["questions"][number];
  index: number;
  total: number;
  answer: AnswerState;
  submitted: boolean;
  languageMode: LanguageMode;
  voiceEnabled: boolean;
  focused: boolean;
  hidden?: boolean;
  onTerm: TermSelectHandler;
  onAnswer: (answer: AnswerState) => void;
  rescuePrompt?: GptRescuePrompt;
}) {
  const historicalAttempt = useContext(HistoricalAttemptContext);
  const caseResult = submitted ? historicalAttempt ? historicalAttempt.parts?.[caseQuestion.id]?.result : gradeQuestion(caseQuestion, answer) : undefined;
  const caseScore = submitted ? historicalAttempt ? historicalAttempt.parts?.[caseQuestion.id]?.score : scoreQuestion(caseQuestion, answer) : undefined;
  const complete = getAnswerCompleteness(caseQuestion, answer);
  const statusClass = submitted ? (caseResult ? "correct" : "incorrect") : complete ? "complete" : "";
  const content = (
    <section
      className={`case-question case-active-part ${statusClass} ${focused ? "focused" : ""}`}
      data-case-part-id={caseQuestion.id}
      hidden={hidden}
    >
      <div className="case-question-heading">
        <span className="type-pill">Part {index + 1} of {total}</span>
        <span className="type-pill">{formatItemType(caseQuestion.itemType)}</span>
        {submitted ? (
          <span className={caseResult ? "type-pill" : "missed-pill"}>
            {caseResult
              ? "Correct"
              : caseScore && caseScore.possible > 1
                ? `${caseScore.earned} of ${caseScore.possible} points · Review`
                : "Review"}
          </span>
        ) : (
          <span className={complete ? "type-pill" : "missed-pill"}>{complete ? "Complete" : "Incomplete"}</span>
        )}
      </div>
      <VisualStimulus
        visual={caseQuestion.visual}
        languageMode={languageMode}
      />
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
        answer={answer}
        submitted={submitted}
        languageMode={languageMode}
        voiceEnabled={voiceEnabled}
        onTerm={onTerm}
        onAnswer={onAnswer}
      />
      {submitted && (
        <RationalePanel
          question={caseQuestion}
          title="Part rationale"
          voiceEnabled={voiceEnabled}
          languageMode={languageMode}
        />
      )}
      {submitted && rescuePrompt && <GptRescueButton prompt={rescuePrompt} />}
    </section>
  );
  return content;
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
  onTerm: TermSelectHandler;
}) {
  return (
    <section className="case-exhibit">
      <BilingualText
        pair={exhibit.title}
        mode={languageMode}
        className="case-exhibit-title"
        glossary={glossary}
        onTerm={onTerm}
      />
      <VisualStimulus
        visual={exhibit.visual}
        languageMode={languageMode}
      />
      <StructuredMeasurementsStimulus measurements={exhibit.structuredMeasurements} languageMode={languageMode} />
      <BilingualText
        pair={exhibit.content}
        mode={languageMode}
        className="case-exhibit-content"
        glossary={glossary}
        onTerm={onTerm}
      />
    </section>
  );
}

function BilingualText({
  pair,
  mode,
  className = "",
  glossary = [],
  onTerm,
  revealOnEnglishClick = true,
}: {
  pair: { en: string; zh?: string };
  mode: LanguageMode;
  className?: string;
  glossary?: GlossaryTerm[];
  onTerm?: TermSelectHandler;
  revealOnEnglishClick?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const revealAllSignal = useContext(RevealAllContext);
  const lastRevealAllSignalRef = useRef(revealAllSignal);
  const hasZh = (pair.zh ?? "").trim().length > 0;
  const showZh = hasZh && (mode === "always" || (mode === "on-tap" && revealed));
  useEffect(() => {
    if (revealAllSignal === lastRevealAllSignalRef.current) return;
    lastRevealAllSignalRef.current = revealAllSignal;
    if (mode === "on-tap" && !revealed && hasZh) setRevealed(true);
  }, [hasZh, mode, revealAllSignal, revealed]);
  const handleReveal = (event?: MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
    if (revealed || mode !== "on-tap" || !hasZh) return;
    setRevealed(true);
  };

  return (
    <span className={`bilingual-text ${className}`}>
      <span className="english-line" onClick={revealOnEnglishClick ? handleReveal : undefined}>
        <GlossaryText text={pair.en} glossary={glossary} onTerm={onTerm} />
      </span>
      {mode === "on-tap" && !revealed && hasZh && (
        <button className="inline-reveal" type="button" onClick={handleReveal}>
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
  onTerm?: TermSelectHandler;
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
          <button className="term-button" aria-label={`Glossary help: ${term.termEn}`} title="Glossary help / 词汇帮助" type="button" key={`${part}-${index}`} onClick={(event) => {
            event.stopPropagation();
            onTerm(term, event.currentTarget);
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

const hasZhText = (value?: string) => (value ?? "").trim().length > 0;
const hasZhPair = (pair?: { zh?: string }) => hasZhText(pair?.zh);
const hasZhPairs = (pairs: Array<{ zh?: string }>) => pairs.some(hasZhPair);
const hasRationaleZh = (question: Question) =>
  hasZhPair(question.rationale.correct) || (question.rationale.byChoice ?? []).some(hasZhPair);
const hasGlossaryZh = (question: Question) =>
  question.glossary.some((term) => hasZhText(term.termZh) || hasZhText(term.defZh));
const hasExplanationZh = (question: Question) =>
  hasRationaleZh(question) || hasZhPair(question.testTakingStrategy) || hasGlossaryZh(question);

const hasQuestionLevelZh = (question: Question): boolean => {
  if (question.itemType === "case_study") {
    if (hasZhPair(question.stem) || hasZhPair(question.caseStudy.title)) return true;
    if (question.caseStudy.exhibits.some((exhibit) => hasZhPair(exhibit.title) || hasZhPair(exhibit.content))) {
      return true;
    }
    if (question.caseStudy.stages?.some((stage) =>
      hasZhPair(stage.title) || stage.exhibits.some((exhibit) => hasZhPair(exhibit.title) || hasZhPair(exhibit.content))
    )) {
      return true;
    }
    return hasExplanationZh(question) || question.caseStudy.questions.some(hasQuestionLevelZh);
  }
  if (hasZhPair(question.stem)) return true;
  if ("options" in question && hasZhPairs(question.options)) return true;
  if (question.itemType === "fill_in_blank" && hasZhPairs(question.blanks.map((blank) => blank.prompt))) return true;
  if (question.itemType === "matrix" && hasZhPairs([...question.matrix.rows, ...question.matrix.columns])) return true;
  if (question.itemType === "dropdown_cloze") {
    if (hasZhPair(question.clozeStem) || question.dropdowns.some((dropdown) => hasZhPairs(dropdown.options))) {
      return true;
    }
  }
  if (question.itemType === "highlight" && hasZhPairs(question.highlight.segments)) return true;
  if (question.itemType === "bowtie") {
    if ([question.bowtie.condition, question.bowtie.actions, question.bowtie.parameters].some(
      (zone) => hasZhPair(zone.prompt) || hasZhPairs(zone.tokens),
    )) {
      return true;
    }
  }
  return hasExplanationZh(question);
};

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

function TranslateAllButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="language-miss-action translate-all-action">
      <button className="secondary-action" type="button" onClick={onClick}>
        <BookOpen aria-hidden="true" />
        <span>Show full Chinese</span>
        <span lang="zh-Hans">显示完整中文</span>
      </button>
    </div>
  );
}

function GptRescueButton({ prompt }: { prompt: GptRescuePrompt }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");
  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(prompt.text);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2400);
    } catch {
      setCopyState("manual");
    }
  };

  return (
    <div className={prompt.prominent ? "gpt-rescue-action prominent" : "gpt-rescue-action"}>
      <button
        className={prompt.prominent ? "primary-action gpt-rescue-button" : "secondary-action gpt-rescue-button"}
        type="button"
        onClick={handleCopy}
      >
        {copyState === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        <span>{copyState === "copied" ? "已复制，粘贴到 GPT。/ Copied. Paste into GPT." : prompt.label}</span>
      </button>
      {copyState === "manual" && (
        <div className="review-prompt-fallback">
          <p className="muted-copy">Clipboard access isn't available here — select the text below and copy manually.</p>
          <textarea readOnly value={prompt.text} onFocus={(event) => event.currentTarget.select()} />
        </div>
      )}
    </div>
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
  const choiceMarkerByRefId = buildChoiceMarkerMap(question);
  return (
    <section className="rationale-panel">
      <div className="rationale-heading">
        <h3>{title}</h3>
        <SpeakButton text={question.rationale.correct.en} enabled={voiceEnabled} label="Read rationale" />
      </div>
      <div className="dual-copy">
        <BilingualText pair={question.rationale.correct} mode={languageMode} />
      </div>
      {question.rationale.visuals && question.rationale.visuals.length > 0 && (
        <div className="rationale-visuals">
          {question.rationale.visuals.map((visual, index) => (
            <VisualStimulus
              key={index}
              visual={visual}
              languageMode={languageMode}
            />
          ))}
        </div>
      )}
      {choiceRationales.length > 0 && (
        <>
          <h4>Per choice</h4>
          <div className="choice-rationales">
            {choiceRationales.map((choice) => {
              const marker = choiceMarkerByRefId.get(choice.refId);
              const rowClassName = marker ? "choice-rationale-row" : "choice-rationale-row no-marker";
              return (
                <div className={rowClassName} key={choice.refId}>
                  {marker && <strong>{marker}</strong>}
                  <BilingualText pair={choice} mode={languageMode} />
                </div>
              );
            })}
          </div>
        </>
      )}
      <div className="rationale-heading">
        <h4>Strategy</h4>
        <SpeakButton text={question.testTakingStrategy.en} enabled={voiceEnabled} label="Read strategy" />
      </div>
      <div className="dual-copy">
        <BilingualText pair={question.testTakingStrategy} mode={languageMode} />
      </div>
      <div className="glossary-strip">
        {question.glossary.map((term) => (
          <span key={term.termEn}>
            <BilingualText
              pair={{ en: term.termEn, zh: term.termZh }}
              mode={languageMode}
              revealOnEnglishClick={false}
            />
          </span>
        ))}
      </div>
    </section>
  );
}

function SummaryView({
  record,
  recordsById,
  flags,
  progress,
  onToggleFlag,
  voiceEnabled,
  defaultLanguageMode,
  onHome,
  homeLabel,
  onPractice,
  memoryOnly,
  onRetrySave,
}: {
  record: CompletedSet;
  recordsById: Map<string, QuestionRecord>;
  flags: Record<string, QuestionFlag>;
  progress: Record<string, QuestionProgress>;
  onToggleFlag: (id: string) => Promise<void>;
  voiceEnabled: boolean;
  defaultLanguageMode: LanguageMode;
  onHome: () => void;
  homeLabel: string;
  onPractice: (ids: string[]) => void;
  memoryOnly: boolean;
  onRetrySave: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rowRefs = useRef(new Map<string,HTMLButtonElement>());
  const [expanded, setExpanded] = useState(new Set<string>());
  const hasMiss = record.entries.some((e) => (e.attempt ?? e.legacyOutcome)?.result === false);
  const [scope, setScope] = useState<"missed" | "all" | "saved">(hasMiss ? "missed" : "all");
  const [languageMode, setLanguageMode] = useState(defaultLanguageMode);
  const submitted = record.entries.filter((e) => e.attempt || e.legacyOutcome);
  const full = submitted.filter((e) => (e.attempt ?? e.legacyOutcome)?.result).length;
  const totals = submitted.reduce(
    (sum, e) => ({
      earned: sum.earned + ((e.attempt?.score ?? e.legacyOutcome?.score)?.earned ?? 0),
      possible: sum.possible + ((e.attempt?.score ?? e.legacyOutcome?.score)?.possible ?? 0),
    }),
    { earned: 0, possible: 0 },
  );
  const entries = record.entries.filter(
    (e) =>
      scope === "all" ||
      (scope === "saved" && flags[e.questionId]?.flagged) ||
      (scope === "missed" && (e.attempt ?? e.legacyOutcome)?.result === false),
  );
  const liveIds = entries.filter((e) => recordsById.has(e.questionId)).map((e) => e.questionId);
  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleSaved = async (id:string) => {
    const removing = scope === "saved" && flags[id]?.flagged;
    const index = entries.findIndex(e=>e.questionId === id);
    const next = entries[index+1]?.questionId ?? entries[index-1]?.questionId;
    await onToggleFlag(id);
    if(removing) requestAnimationFrame(()=>{if(next) rowRefs.current.get(next)?.focus(); else headingRef.current?.focus();});
  };
  return (
    <section className="stack completed-set">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{new Date(record.completedAt).toLocaleString()}</p>
          <h2 ref={headingRef} tabIndex={-1}>Your answers / 本次作答</h2>
          <p>{record.title}</p>
        </div>
        <button onClick={onHome}>{homeLabel}</button>
      </div>
      <p className="summary-counts">
        Submitted {submitted.length} · Full marks {full} · Not fully correct {submitted.length - full} ·
        Unsubmitted {record.entries.length - submitted.length}
      </p>
      <p>
        {totals.earned} of {totals.possible} points · {record.deliveredCount} of {record.requestedCount}{" "}
        requested questions
      </p>
      {memoryOnly && (
        <div className="warning-band" role="status">
          <p>This set is available for this visit only. It could not be saved on this device.</p>
          <button onClick={onRetrySave}>Retry save</button>
        </div>
      )}
      <div className="section-heading">
        <div className="segmented" role="group" aria-label="Your answers scope">
          {(
            [
              ["missed", "Not fully correct"],
              ["all", "All questions"],
              ["saved", "Saved"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              aria-pressed={scope === id}
              className={scope === id ? "active" : ""}
              onClick={() => setScope(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <LanguageTabs value={languageMode} onChange={setLanguageMode} />
      </div>
      <div className="action-row">
        <button className="primary-action" disabled={!liveIds.length} onClick={() => onPractice(liveIds)}>
          Practice these · {liveIds.length}
        </button>
      </div>
      {liveIds.length < entries.length && <p>No longer available questions are excluded from practice.</p>}
      {!entries.length && <p>No questions in this scope.</p>}
      {entries.map((entry) => {
        const q = recordsById.get(entry.questionId)?.question;
        const compatibility = entryCompatibility(entry, q);
        const attempt = entry.attempt;
        const outcome = attempt ?? entry.legacyOutcome;
        const score = outcome?.score;
        const status = outcome
          ? outcome.result
            ? "Full marks"
            : "Not fully correct"
          : entry.status === "skipped"
            ? "Skipped · Not submitted"
            : "Not submitted";
        const paired = compatibility === "match" && q;
        return (
          <article key={entry.questionId} className="summary-review-item">
            <button
              className="question-row summary-review-toggle"
              ref={el=>{if(el)rowRefs.current.set(entry.questionId,el);else rowRefs.current.delete(entry.questionId);}}
              aria-expanded={expanded.has(entry.questionId)}
              onClick={() => toggle(entry.questionId)}
            >
              <span>
                <strong>
                  {paired ? <SummaryStemText pair={q.stem} mode={languageMode} /> : entry.questionId}
                </strong>
                <span className="summary-entry-status">
                  {status}
                  {score ? ` · ${score.earned} of ${score.possible} points` : ""}
                </span>
              </span>
              <ChevronDown aria-hidden="true" />
            </button>
            {compatibility !== "match" && (
              <p className="warning-band">
                {compatibility === "deleted"
                  ? "No longer in the current question bank"
                  : compatibility === "legacy-unverified"
                    ? "This attempt predates detailed set memory. Its original question and answer cannot be verified."
                    : "This question has changed since this set"}
              </p>
            )}
            <div className="action-row summary-entry-actions">
              {q && (
                <button onClick={() => onPractice([entry.questionId])}>
                  {q.itemType === "case_study" ? "Practice this case" : "Try again"}
                </button>
              )}
              {q && (
                <button
                  aria-pressed={flags[entry.questionId]?.flagged ?? false}
                  onClick={() => void toggleSaved(entry.questionId)}
                >
                  {flags[entry.questionId]?.flagged ? "Remove from Saved" : "Save question"}
                </button>
              )}
              {progress[entry.questionId]?.needsReview && (
                <span className="missed-pill">Needs review now</span>
              )}
            </div>
            {expanded.has(entry.questionId) && paired && (
              <div className="summary-review-body">
                {attempt ? (
                  <HistoricalAttemptContext.Provider value={attempt}>
                    <QuestionCard
                      question={q}
                      answer={attempt.answer}
                      submitted
                      result={attempt.result}
                      languageMode={languageMode}
                      flagged={flags[q.id]?.flagged ?? false}
                      voiceEnabled={voiceEnabled}
                      onAnswer={() => {}}
                      onSubmit={() => {}}
                      onToggleFlag={() => onToggleFlag(q.id)}
                      showQuestionActions={false}
                      caseStudyLayout="stacked"
                      standaloneVisualLayout="stacked"
                      rescuePrompt={
                        q.itemType !== "case_study" ? makeRescuePrompt(q, attempt.answer, false) : undefined
                      }
                      casePartRescuePrompts={
                        q.itemType === "case_study"
                          ? Object.fromEntries(
                              q.caseStudy.questions.map((part) => [
                                part.id,
                                makeRescuePrompt(
                                  part,
                                  attempt.answer.caseStudy?.[part.id] ?? getInitialAnswer(part),
                                  false,
                                  q,
                                ),
                              ]),
                            )
                          : undefined
                      }
                    />
                  </HistoricalAttemptContext.Provider>
                ) : (
                  <>
                    <p>
                      Not submitted.{" "}
                      {entry.draft ? "Your draft is retained below." : "No answer was submitted."}
                    </p>
                    {entry.draft && <DraftAnswer question={q} answer={entry.draft} mode={languageMode} />}
                    <BilingualText pair={q.stem} mode={languageMode} />
                  </>
                )}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

function DraftAnswer({
  question: q,
  answer,
  mode,
}: {
  question: Question;
  answer: AnswerState;
  mode: LanguageMode;
}) {
  if (q.itemType === "case_study")
    return (
      <div>
        {q.caseStudy.questions.map((part, i) => (
          <section key={part.id}>
            <h4>Part {i + 1}</h4>
            <DraftAnswer question={part} answer={answer.caseStudy?.[part.id] ?? {}} mode={mode} />
          </section>
        ))}
      </div>
    );
  let selections: Array<{ label?: { en: string; zh: string }; value: string }> = [];
  if (q.itemType === "multiple_choice" || q.itemType === "select_all" || q.itemType === "ordered_response")
    selections = (answer.optionIds ?? []).map((id) => ({
      label: q.options.find((o) => o.id === id),
      value: "",
    }));
  else if (q.itemType === "fill_in_blank")
    selections = q.blanks.map((b) => ({
      label: b.prompt,
      value: answer.blanks?.[b.id] ?? "No draft answer",
    }));
  else if (q.itemType === "matrix")
    selections = q.matrix.rows.map((row) => ({
      label: row,
      value:
        (answer.matrix?.[row.id] ?? [])
          .map((id) => q.matrix.columns.find((c) => c.id === id)?.en ?? "")
          .join(", ") || "No draft answer",
    }));
  else if (q.itemType === "dropdown_cloze")
    selections = q.dropdowns.map((d) => ({
      label: d.options.find((o) => o.id === answer.dropdowns?.[d.id]),
      value: answer.dropdowns?.[d.id] ? "" : "No draft answer",
    }));
  else if (q.itemType === "highlight")
    selections = (answer.segments ?? []).map((id) => ({
      label: q.highlight.segments.find((s) => s.id === id),
      value: "",
    }));
  else if (q.itemType === "bowtie")
    selections = (["condition", "actions", "parameters"] as const).flatMap((zone) =>
      (answer.bowtie?.[zone] ?? []).map((id) => ({
        label: q.bowtie[zone].tokens.find((t) => t.id === id),
        value: "",
      })),
    );
  return selections.length ? (
    <ol>
      {selections.map((s, i) => (
        <li key={i}>
          {s.label && <BilingualText pair={s.label} mode={mode} />} {s.value}
        </li>
      ))}
    </ol>
  ) : (
    <p>No draft answer.</p>
  );
}

function SummaryStemText({ pair, mode }: { pair: { en: string; zh: string }; mode: LanguageMode }) {
  return (
    <span className="bilingual-text">
      <span className="english-line">{pair.en}</span>
      {mode === "always" && <span className="chinese-line">{pair.zh}</span>}
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
    if (filters.status === "needsReview") return itemProgress?.needsReview ?? false;
    if (filters.status === "saved") return flags[record.question.id]?.flagged ?? false;
    return true;
  });

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

const createSessionId = () => `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const toStoredSession = (session: SessionState): StoredSessionSnapshot => session.retainedSnapshot ?? ({
  launchIntent: session.launchIntent, returnView: session.returnView, requestedCount: session.requestedCount,
  fingerprints: session.fingerprints, attempts: session.attempts,
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
  const recovery = snapshot.questionIds.flatMap(id => {
    const question = recordsById.get(id)?.question;
    if (!question) return [`${id}: No longer in the current question bank.`];
    if (snapshot.fingerprints?.[id] && snapshot.fingerprints[id] !== questionFingerprint(question)) return [`${id}: This question has changed since this set.`];
    const answer = snapshot.answers[id] as AnswerState | undefined;
    return answer && !answerFitsQuestion(question, answer) ? [`${id}: Saved answer IDs do not match the current question.`] : [];
  });
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
    launchIntent: snapshot.launchIntent ?? "remediation", returnView: snapshot.returnView ?? "home",
    requestedCount: snapshot.requestedCount ?? snapshot.questionIds.length,
    fingerprints: snapshot.fingerprints ?? {}, attempts: snapshot.attempts ?? {},
    recovery, retainedSnapshot: recovery.length ? snapshot : undefined,
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
