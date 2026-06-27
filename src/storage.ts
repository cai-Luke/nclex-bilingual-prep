import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type {
  AnswerEvent,
  FlashcardProgress,
  QuestionFlag,
  QuestionProgress,
  QuestionRecord,
  Settings,
  StoredSessionSnapshot,
} from "./types";
export { isDueForReview } from "./reviewSchedule";

const DB_NAME = "nclex-bilingual-prep";
const DB_VERSION = 2;

export const defaultSettings: Settings = {
  languageMode: "always",
  defaultMode: "study",
  voiceEnabled: false,
  themeMode: "light",
};

type UploadedRecord = QuestionRecord & {
  id: string;
};

interface PrepDb extends DBSchema {
  uploadedQuestions: {
    key: string;
    value: UploadedRecord;
  };
  progress: {
    key: string;
    value: QuestionProgress;
  };
  activeSession: {
    key: string;
    value: StoredSessionSnapshot;
  };
  flags: {
    key: string;
    value: QuestionFlag;
  };
  answerEvents: {
    key: string;
    value: AnswerEvent;
  };
  flashcardProgress: {
    key: string;
    value: FlashcardProgress;
  };
}

let dbPromise: Promise<IDBPDatabase<PrepDb>> | undefined;
let memoryUploadedRecords: QuestionRecord[] = [];
const memoryProgress: Record<string, QuestionProgress> = {};
let memoryActiveSession: StoredSessionSnapshot | null = null;
const memoryFlags: Record<string, QuestionFlag> = {};
const memoryFlashcardProgress: Record<string, FlashcardProgress> = {};
const memoryAnswerEvents: AnswerEvent[] = [];

const getDb = () => {
  if (typeof indexedDB === "undefined") {
    throw new Error("IndexedDB is unavailable in this browser context.");
  }
  dbPromise ??= openDB<PrepDb>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("uploadedQuestions")) db.createObjectStore("uploadedQuestions", { keyPath: "id" });
      if (!db.objectStoreNames.contains("progress")) db.createObjectStore("progress", { keyPath: "questionId" });
      if (!db.objectStoreNames.contains("activeSession")) db.createObjectStore("activeSession", { keyPath: "id" });
      if (!db.objectStoreNames.contains("flags")) db.createObjectStore("flags", { keyPath: "questionId" });
      if (!db.objectStoreNames.contains("answerEvents")) db.createObjectStore("answerEvents", { keyPath: "id" });
      if (!db.objectStoreNames.contains("flashcardProgress")) db.createObjectStore("flashcardProgress", { keyPath: "termId" });
    },
  });
  return dbPromise;
};

export const loadUploadedRecords = async (): Promise<QuestionRecord[]> => {
  try {
    const db = await getDb();
    return (await db.getAll("uploadedQuestions")).map(({ id: _id, ...record }) => record);
  } catch {
    return memoryUploadedRecords;
  }
};

export const saveUploadedRecords = async (records: QuestionRecord[]) => {
  memoryUploadedRecords = [...memoryUploadedRecords, ...records];
  try {
    const db = await getDb();
    const tx = db.transaction("uploadedQuestions", "readwrite");
    await Promise.all(records.map((record) => tx.store.put({ ...record, id: record.question.id })));
    await tx.done;
  } catch {
    // Some browsers block IndexedDB for file:// pages. The app remains usable for the current session.
  }
};

export const loadProgress = async (): Promise<Record<string, QuestionProgress>> => {
  try {
    const db = await getDb();
    const records = await db.getAll("progress");
    return Object.fromEntries(records.map((record) => [record.questionId, record]));
  } catch {
    return memoryProgress;
  }
};

export const saveProgress = async (progress: QuestionProgress) => {
  memoryProgress[progress.questionId] = progress;
  try {
    const db = await getDb();
    await db.put("progress", progress);
  } catch {
    // In-memory fallback already captured the update.
  }
};

export const recordAnswer = async (questionId: string, wasCorrect: boolean) => {
  let existing: QuestionProgress | undefined = memoryProgress[questionId];
  try {
    const db = await getDb();
    existing = await db.get("progress", questionId);
  } catch {
    // Use the in-memory record when persistent storage is unavailable.
  }
  const now = new Date();
  const nextSchedule = scheduleReview(existing, wasCorrect, now);
  const next: QuestionProgress = {
    questionId,
    seen: (existing?.seen ?? 0) + 1,
    correct: (existing?.correct ?? 0) + (wasCorrect ? 1 : 0),
    incorrect: (existing?.incorrect ?? 0) + (wasCorrect ? 0 : 1),
    correctStreak: wasCorrect ? (existing?.correctStreak ?? 0) + 1 : 0,
    missed: wasCorrect ? !((existing?.correctStreak ?? 0) + 1 >= 2) && Boolean(existing?.missed) : true,
    lastSeenAt: now.toISOString(),
    ...nextSchedule,
  };
  await saveProgress(next);
  const event: AnswerEvent = {
    id: `${questionId}-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    questionId,
    wasCorrect,
    answeredAt: now.toISOString(),
  };
  memoryAnswerEvents.push(event);
  try {
    const db = await getDb();
    await db.put("answerEvents", event);
  } catch {
    // The in-memory event list still supports the current session dashboard.
  }
  return next;
};

type SchedulableProgress = {
  correctStreak?: number;
  srsEase?: number;
  srsIntervalDays?: number;
  srsLapses?: number;
};

const scheduleReview = (existing: SchedulableProgress | undefined, wasCorrect: boolean, now: Date) => {
  const currentEase = existing?.srsEase ?? 2.3;
  const currentInterval = existing?.srsIntervalDays ?? 0;
  const nextEase = wasCorrect ? Math.min(2.8, currentEase + 0.08) : Math.max(1.3, currentEase - 0.25);
  const nextStreak = wasCorrect ? (existing?.correctStreak ?? 0) + 1 : 0;
  const intervalDays = wasCorrect
    ? nextStreak === 1
      ? 1
      : nextStreak === 2
        ? 3
        : Math.max(4, Math.round(Math.max(currentInterval, 3) * nextEase))
    : 0;
  const delayMs = wasCorrect ? intervalDays * 24 * 60 * 60 * 1000 : 20 * 60 * 1000;

  return {
    srsDueAt: new Date(now.getTime() + delayMs).toISOString(),
    srsIntervalDays: intervalDays,
    srsEase: nextEase,
    srsLapses: (existing?.srsLapses ?? 0) + (wasCorrect ? 0 : 1),
  };
};

export const loadActiveSession = async (): Promise<StoredSessionSnapshot | null> => {
  try {
    const db = await getDb();
    const sessions = await db.getAll("activeSession");
    return sessions.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0] ?? null;
  } catch {
    return memoryActiveSession;
  }
};

export const saveActiveSession = async (session: StoredSessionSnapshot) => {
  memoryActiveSession = session;
  try {
    const db = await getDb();
    const tx = db.transaction("activeSession", "readwrite");
    await tx.store.clear();
    await tx.store.put(session);
    await tx.done;
  } catch {
    // In-memory fallback already captured the latest active session.
  }
};

export const clearActiveSession = async () => {
  memoryActiveSession = null;
  try {
    const db = await getDb();
    await db.clear("activeSession");
  } catch {
    // No persistent session to clear.
  }
};

export const loadFlags = async (): Promise<Record<string, QuestionFlag>> => {
  try {
    const db = await getDb();
    const records = await db.getAll("flags");
    return Object.fromEntries(records.map((record) => [record.questionId, record]));
  } catch {
    return memoryFlags;
  }
};

export const saveQuestionFlag = async (flag: QuestionFlag) => {
  if (!flag.flagged && !flag.note?.trim()) {
    delete memoryFlags[flag.questionId];
  } else {
    memoryFlags[flag.questionId] = flag;
  }
  try {
    const db = await getDb();
    if (!flag.flagged && !flag.note?.trim()) {
      await db.delete("flags", flag.questionId);
    } else {
      await db.put("flags", flag);
    }
  } catch {
    // In-memory fallback already captured the flag state.
  }
};

export const loadAnswerEvents = async (): Promise<AnswerEvent[]> => {
  try {
    const db = await getDb();
    const records = await db.getAll("answerEvents");
    return records.sort((left, right) => left.answeredAt.localeCompare(right.answeredAt));
  } catch {
    return memoryAnswerEvents;
  }
};

export const loadFlashcardProgress = async (): Promise<Record<string, FlashcardProgress>> => {
  try {
    const db = await getDb();
    const records = await db.getAll("flashcardProgress");
    return Object.fromEntries(records.map((record) => [record.termId, record]));
  } catch {
    return memoryFlashcardProgress;
  }
};

export const recordFlashcardReview = async (termId: string, remembered: boolean) => {
  let existing: FlashcardProgress | undefined = memoryFlashcardProgress[termId];
  try {
    const db = await getDb();
    existing = await db.get("flashcardProgress", termId);
  } catch {
    // Use the in-memory record when persistent storage is unavailable.
  }
  const now = new Date();
  const nextSchedule = scheduleReview(existing, remembered, now);
  const next: FlashcardProgress = {
    termId,
    seen: (existing?.seen ?? 0) + 1,
    correct: (existing?.correct ?? 0) + (remembered ? 1 : 0),
    incorrect: (existing?.incorrect ?? 0) + (remembered ? 0 : 1),
    correctStreak: remembered ? (existing?.correctStreak ?? 0) + 1 : 0,
    lastSeenAt: now.toISOString(),
    ...nextSchedule,
  };
  memoryFlashcardProgress[termId] = next;
  try {
    const db = await getDb();
    await db.put("flashcardProgress", next);
  } catch {
    // In-memory fallback already captured the update.
  }
  return next;
};

export const loadSettings = (): Settings => {
  try {
    const storage = getLocalStorage();
    return { ...defaultSettings, ...JSON.parse(storage?.getItem("nclex-settings") || "{}") };
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: Settings) => {
  try {
    getLocalStorage()?.setItem("nclex-settings", JSON.stringify(settings));
  } catch {
    // Settings persistence is optional; keep the UI responsive if browser storage is blocked.
  }
};

const getLocalStorage = () => {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
};
