import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { normalizeStoredQuestionRecord } from "./categoryMigration";
import { migrateProgress } from "./progressMigration";
import { submissionIdentity } from "./completedMemory";
import type {
  AnswerEvent,
  CompletedSet,
  QuestionFlag,
  QuestionProgress,
  QuestionRecord,
  Settings,
  StoredSessionSnapshot,
  SubmittedAttempt,
} from "./types";

const DB_NAME = "nclex-bilingual-prep";
export const DB_VERSION = 6;
export const defaultSettings: Settings = {
  languageMode: "on-tap",
  revisitMissed: true,
  voiceEnabled: false,
  themeMode: "light",
  textSizeMode: "default",
};
export type PersistenceStatus = {
  durability: "durable" | "memory";
  reason?: "blocked" | "unavailable" | "failed";
};
export type StoredResult<T> = PersistenceStatus & { value: T };
let status: PersistenceStatus = { durability: "durable" };
const listeners = new Set<(status: PersistenceStatus) => void>();
export const subscribePersistence = (listener: (status: PersistenceStatus) => void) => {
  listeners.add(listener);
  listener(status);
  return () => {
    listeners.delete(listener);
  };
};
const publish = (next: PersistenceStatus) => {
  status = next;
  listeners.forEach((l) => l(next));
  return next;
};
const failures = new Map<string, PersistenceStatus["reason"]>();
const refreshStatus = () =>
  publish(
    failures.size
      ? { durability: "memory", reason: Array.from(failures.values())[failures.size - 1] }
      : { durability: "durable" },
  );
const durable = (source: string): PersistenceStatus => {
  failures.delete(source);
  refreshStatus();
  return { durability: "durable" };
};
const hasIndexedDb = () => {
  try {
    return typeof indexedDB !== "undefined";
  } catch {
    return false;
  }
};
const failure = (error: unknown, source: string): PersistenceStatus => {
  const reason =
    error instanceof Error && error.message === "blocked"
      ? "blocked"
      : !hasIndexedDb()
        ? "unavailable"
        : "failed";
  failures.set(source, reason);
  refreshStatus();
  return { durability: "memory", reason };
};
interface PrepDb extends DBSchema {
  uploadedQuestions: { key: string; value: QuestionRecord & { id: string } };
  progress: { key: string; value: QuestionProgress };
  activeSession: { key: string; value: StoredSessionSnapshot };
  flags: { key: string; value: QuestionFlag };
  answerEvents: { key: string; value: AnswerEvent };
  completedSets: { key: string; value: CompletedSet };
}
let dbPromise: Promise<IDBPDatabase<PrepDb>> | undefined;
const getDb = (): Promise<IDBPDatabase<PrepDb>> => {
  if (!hasIndexedDb()) return Promise.reject(new Error("unavailable"));
  if (dbPromise) return dbPromise;
  let rejectBlocked: (error: Error) => void;
  let blocked = false;
  const blocking = new Promise<never>((_, reject) => {
    rejectBlocked = reject;
  });
  const opening = openDB<PrepDb>(DB_NAME, DB_VERSION, {
    async upgrade(db, oldVersion, _newVersion, tx) {
      if (!db.objectStoreNames.contains("uploadedQuestions"))
        db.createObjectStore("uploadedQuestions", { keyPath: "id" });
      if (!db.objectStoreNames.contains("progress"))
        db.createObjectStore("progress", { keyPath: "questionId" });
      if (!db.objectStoreNames.contains("activeSession"))
        db.createObjectStore("activeSession", { keyPath: "id" });
      if (!db.objectStoreNames.contains("flags")) db.createObjectStore("flags", { keyPath: "questionId" });
      if (!db.objectStoreNames.contains("answerEvents"))
        db.createObjectStore("answerEvents", { keyPath: "id" });
      if (!db.objectStoreNames.contains("completedSets"))
        db.createObjectStore("completedSets", { keyPath: "id" });
      // v6 deliberately neither touches nor deletes the four retired stores.
      void tx.done.catch(() => {});
      if (oldVersion < 6) {
        try {
          const events = await tx.objectStore("answerEvents").getAll();
          let cursor = await tx.objectStore("progress").openCursor();
          while (cursor) {
            await cursor.update(migrateProgress(cursor.value, events));
            cursor = await cursor.continue();
          }
        } catch {
          // The opening request reports failure; never leave a partially migrated v6 database.
          try { tx.abort(); } catch { /* The request may already have aborted the transaction. */ }
        }
      }
    },
    blocked() {
      blocked = true;
      rejectBlocked(new Error("blocked"));
    },
    blocking() {
      void opening.then((db) => db.close());
      dbPromise = undefined;
    },
    terminated() {
      dbPromise = undefined;
      publish({ durability: "memory", reason: "failed" });
    },
  });
  void opening.then(
    (db) => {
      if (blocked) db.close();
    },
    () => {},
  );
  dbPromise = Promise.race([opening, blocking]).catch((error) => {
    dbPromise = undefined;
    throw error;
  });
  return dbPromise;
};
let memoryUploaded: QuestionRecord[] = [];
let memoryProgress: Record<string, QuestionProgress> = {};
let memoryActive: StoredSessionSnapshot | null = null;
let observedActiveId: string | null | undefined;
let memoryFlags: Record<string, QuestionFlag> = {};
let memoryEvents: AnswerEvent[] = [];
let memoryCompleted: CompletedSet | null = null;
const memoryCommits = new Map<string, { progress: QuestionProgress; attempt: SubmittedAttempt }>();
// Memory-only changes stay authoritative for this visit until their exact operation is retried.
let memorySessionOnly = false;
let memoryCompletionPending = false;
const memoryProgressIds = new Set<string>();

export const loadUploadedRecords = async (): Promise<QuestionRecord[]> => {
  try {
    const db = await getDb();
    memoryUploaded = (await db.getAll("uploadedQuestions")).map(({ id: _id, ...r }) =>
      normalizeStoredQuestionRecord(r),
    );
    durable("uploaded-read");
  } catch (e) {
    failure(e, "uploaded-read");
  }
  return memoryUploaded;
};
export const saveUploadedRecords = async (records: QuestionRecord[]): Promise<PersistenceStatus> => {
  memoryUploaded = [...memoryUploaded, ...records];
  try {
    const db = await getDb();
    const tx = db.transaction("uploadedQuestions", "readwrite");
    void tx.done.catch(() => {});
    await Promise.all(records.map((r) => tx.store.put({ ...r, id: r.question.id })));
    await tx.done;
    return durable("uploaded-write");
  } catch (e) {
    return failure(e, "uploaded-write");
  }
};
export const loadProgress = async () => {
  try {
    const db = await getDb();
    for (const row of await db.getAll("progress"))
      if (!memoryProgressIds.has(row.questionId)) memoryProgress[row.questionId] = row;
    durable("progress-read");
  } catch (e) {
    failure(e, "progress-read");
  }
  return { ...memoryProgress };
};
export const loadFlags = async () => {
  try {
    const db = await getDb();
    memoryFlags = {
      ...Object.fromEntries((await db.getAll("flags")).map((r) => [r.questionId, r])),
      ...memoryFlags,
    };
    durable("flags-read");
  } catch (e) {
    failure(e, "flags-read");
  }
  return { ...memoryFlags };
};
export const saveQuestionFlag = async (flag: QuestionFlag): Promise<PersistenceStatus> => {
  memoryFlags[flag.questionId] = flag;
  try {
    const db = await getDb();
    if (!flag.flagged && !flag.note?.trim()) await db.delete("flags", flag.questionId);
    else await db.put("flags", flag);
    return durable("flag:" + flag.questionId);
  } catch (e) {
    return failure(e, "flag:" + flag.questionId);
  }
};
export const loadAnswerEvents = async () => {
  try {
    const db = await getDb();
    memoryEvents = [
      ...new Map([...(await db.getAll("answerEvents")), ...memoryEvents].map((e) => [e.id, e])).values(),
    ];
    durable("events-read");
  } catch (e) {
    failure(e, "events-read");
  }
  return [...memoryEvents].sort((a, b) => a.answeredAt.localeCompare(b.answeredAt));
};
export const loadActiveSession = async (): Promise<StoredSessionSnapshot | null> => {
  if (memorySessionOnly) return memoryActive;
  try {
    const db = await getDb();
    memoryActive =
      (await db.getAll("activeSession")).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ?? null;
    observedActiveId = memoryActive?.id ?? null;
    durable("active-read");
  } catch (e) {
    failure(e, "active-read");
  }
  return memoryActive;
};
const mergeCommitted = (
  next: StoredSessionSnapshot,
  existing?: StoredSessionSnapshot | null,
): StoredSessionSnapshot => {
  if (existing?.id !== next.id) return next;
  const attempts = { ...next.attempts, ...existing.attempts };
  const results = { ...next.results, ...existing.results };
  return {
    ...next,
    attempts,
    results,
    scores: { ...next.scores, ...existing.scores },
    answers: {
      ...next.answers,
      ...Object.fromEntries(Object.entries(attempts).map(([id, a]) => [id, a.answer])),
    },
    skippedQuestionIds: next.skippedQuestionIds?.filter(
      (id) => !Object.prototype.hasOwnProperty.call(results, id),
    ),
  };
};
export const saveActiveSession = async (snapshot: StoredSessionSnapshot): Promise<PersistenceStatus> => {
  memoryActive = mergeCommitted(snapshot, memoryActive);
  try {
    const db = await getDb();
    const tx = db.transaction("activeSession", "readwrite");
    void tx.done.catch(() => {});
    const rows = await tx.store.getAll();
    const current = rows[0];
    if (current && current.id !== snapshot.id && current.id !== observedActiveId) {
      tx.abort();
      await tx.done.catch(() => {});
      throw new Error("Unobserved active set; reload to recover it");
    }
    const existing = rows.find((s) => s.id === snapshot.id);
    const next = mergeCommitted(memoryActive, existing);
    await tx.store.clear();
    await tx.store.put(next);
    await tx.done;
    memoryActive = next;
    observedActiveId = next.id;
    memorySessionOnly = false;
    return durable("active-write");
  } catch (e) {
    memorySessionOnly = true;
    return failure(e, "active-write");
  }
};
const nextProgress = (
  id: string,
  existing: QuestionProgress | undefined,
  attempt: SubmittedAttempt,
): QuestionProgress => ({
  questionId: id,
  seen: (existing?.seen ?? 0) + 1,
  correct: (existing?.correct ?? 0) + (attempt.result ? 1 : 0),
  incorrect: (existing?.incorrect ?? 0) + (attempt.result ? 0 : 1),
  needsReview: !attempt.result,
  lastSeenAt: attempt.submittedAt,
});
const applyAttempt = (
  snapshot: StoredSessionSnapshot,
  id: string,
  attempt: SubmittedAttempt,
): StoredSessionSnapshot => ({
  ...snapshot,
  answers: { ...snapshot.answers, [id]: attempt.answer },
  results: { ...snapshot.results, [id]: attempt.result },
  scores: { ...snapshot.scores, [id]: attempt.score },
  attempts: { ...snapshot.attempts, [id]: attempt },
  skippedQuestionIds: snapshot.skippedQuestionIds?.filter((qid) => qid !== id),
  updatedAt: attempt.submittedAt,
});
export const commitSubmission = async (
  snapshot: StoredSessionSnapshot,
  id: string,
  captured: SubmittedAttempt,
): Promise<
  StoredResult<{ progress: QuestionProgress; session: StoredSessionSnapshot; attempt: SubmittedAttempt }>
> => {
  const identity = submissionIdentity(snapshot.id, id);
  if (captured.submissionId !== identity) throw new Error("Submission identity mismatch");
  const pending = memoryCommits.get(identity);
  const attempt = pending?.attempt ?? captured;
  const event: AnswerEvent = {
    id: identity,
    questionId: id,
    sessionId: snapshot.id,
    sessionMode: snapshot.mode,
    languageModeAtAnswer: attempt.languageMode,
    wasCorrect: attempt.result,
    answeredAt: attempt.submittedAt,
  };
  try {
    const db = await getDb();
    const tx = db.transaction(["progress", "answerEvents", "activeSession"], "readwrite");
    void tx.done.catch(() => {});
    const existing = await tx.objectStore("progress").get(id);
    const priorEvent = await tx.objectStore("answerEvents").get(identity);
    const active = await tx.objectStore("activeSession").get(snapshot.id);
    // A late submission must not resurrect a replaced or completed set.
    if (!active && !priorEvent) {
      tx.abort();
      await tx.done.catch(() => {});
      throw new Error("Active set no longer exists");
    }
    const committedAttempt = active?.attempts?.[id] ?? pending?.attempt ?? attempt;
    const progress = priorEvent ? existing! : nextProgress(id, existing, attempt);
    const session = applyAttempt(mergeCommitted(snapshot, active), id, committedAttempt);
    if (!priorEvent) {
      // Preserve inert legacy columns unchanged until the separately authorized v7 cleanup.
      await tx.objectStore("progress").put({ ...existing, ...progress });
      await tx.objectStore("answerEvents").add(event);
    }
    if (active) await tx.objectStore("activeSession").put(session);
    await tx.done;
    memoryProgress[id] = progress;
    memoryProgressIds.delete(id);
    if (active) memoryActive = session;
    memorySessionOnly = false;
    memoryCommits.set(identity, { progress, attempt: committedAttempt });
    if (!memoryEvents.some((e) => e.id === identity)) memoryEvents.push(event);
    return { ...durable("submission:" + identity), value: { progress, session, attempt: committedAttempt } };
  } catch (e) {
    const memoryPrior = memoryCommits.get(identity);
    const memoryAttempt = memoryPrior?.attempt ?? attempt;
    const progress = memoryPrior?.progress ?? nextProgress(id, memoryProgress[id], memoryAttempt);
    const session = applyAttempt(mergeCommitted(snapshot, memoryActive), id, memoryAttempt);
    memoryProgress[id] = progress;
    memoryProgressIds.add(id);
    memoryActive = session;
    memorySessionOnly = true;
    memoryCommits.set(identity, { progress, attempt: memoryAttempt });
    if (!memoryEvents.some((e) => e.id === identity)) memoryEvents.push(event);
    return { ...failure(e, "submission:" + identity), value: { progress, session, attempt: memoryAttempt } };
  }
};
export const loadCompletedSet = async (): Promise<CompletedSet | null> => {
  if (memoryCompletionPending) return memoryCompleted;
  try {
    const db = await getDb();
    memoryCompleted = (await db.get("completedSets", "last")) ?? null;
    durable("completed-read");
  } catch (e) {
    failure(e, "completed-read");
  }
  return memoryCompleted;
};
export const completeSession = async (
  snapshot: StoredSessionSnapshot,
  completed: CompletedSet,
): Promise<PersistenceStatus> => {
  const archive =
    snapshot.launchIntent === "ordinary" &&
    snapshot.mode === "study" &&
    Object.keys(snapshot.results).length > 0;
  try {
    const db = await getDb();
    const tx = db.transaction(["completedSets", "activeSession", "answerEvents"], "readwrite");
    void tx.done.catch(() => {});
    // Refuse to archive memory-only outcomes until the exact submits have been retried.
    for (const attempt of Object.values(snapshot.attempts ?? {}))
      if (!(await tx.objectStore("answerEvents").get(attempt.submissionId))) {
        tx.abort();
        await tx.done.catch(() => {});
        throw new Error("Submission not durable");
      }
    // Reading in the same transaction is intentional: failed reads never mean empty.
    const previous = await tx.objectStore("completedSets").get("last");
    const active = await tx.objectStore("activeSession").get(snapshot.id);
    if (
      archive &&
      (!previous ||
        previous.sessionId === completed.sessionId ||
        previous.completedAt <= completed.completedAt)
    )
      await tx.objectStore("completedSets").put(completed);
    if (active) await tx.objectStore("activeSession").delete(snapshot.id);
    await tx.done;
    if (archive) memoryCompleted = completed;
    memoryCompletionPending = false;
    if (memoryActive?.id === snapshot.id) memoryActive = null;
    memorySessionOnly = false;
    return durable("completion");
  } catch (e) {
    if (archive) {
      memoryCompleted = completed;
      memoryCompletionPending = true;
    }
    // Keep the only resumable record, both durable and memory, until completion commits.
    return failure(e, "completion");
  }
};
export const loadSettings = (): Settings => {
  try {
    const raw = JSON.parse(globalThis.localStorage?.getItem("nclex-settings") || "{}");
    return {
      ...defaultSettings,
      languageMode: raw.languageMode ?? defaultSettings.languageMode,
      revisitMissed: raw.revisitMissed !== false,
      voiceEnabled: raw.voiceEnabled ?? false,
      themeMode: raw.themeMode ?? "light",
      textSizeMode: raw.textSizeMode ?? "default",
    };
  } catch {
    return { ...defaultSettings };
  }
};
export const saveSettings = (settings: Settings): PersistenceStatus => {
  try {
    globalThis.localStorage.setItem("nclex-settings", JSON.stringify(settings));
    return durable("settings");
  } catch (e) {
    return failure(e, "settings");
  }
};
