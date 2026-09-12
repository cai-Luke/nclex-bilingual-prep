import type { SessionState } from "./sessionState";

type SessionWork = Pick<SessionState, "completed" | "results" | "answers" | "skippedQuestionIds">;

export const hasProtectedSession = (session: SessionWork | null): boolean => Boolean(
  session && !session.completed && (
    Object.keys(session.results).length > 0 ||
    Object.keys(session.answers).length > 0 ||
    session.skippedQuestionIds.length > 0
  ),
);

export type SessionStartStatus = "idle" | "waiting-hydration" | "confirming" | "starting";

/** Holds the caller's construction callback without running any part of its draw. */
export const createSessionStartGuard = ({
  onStatusChange,
  onError,
}: {
  onStatusChange: (status: SessionStartStatus) => void;
  onError: (error: unknown) => void;
}) => {
  let hydrated = false;
  let status: SessionStartStatus = "idle";
  let pending: (() => Promise<void>) | null = null;

  const updateStatus = (next: SessionStartStatus) => {
    status = next;
    onStatusChange(next);
  };
  const execute = async () => {
    if (!pending || status === "starting") return;
    const intent = pending;
    updateStatus("starting");
    try {
      await intent();
    } catch (error) {
      onError(error);
    } finally {
      pending = null;
      updateStatus("idle");
    }
  };
  const decide = (session: SessionWork | null) => {
    if (hasProtectedSession(session)) updateStatus("confirming");
    else void execute();
  };

  return {
    get status() { return status; },
    request(intent: () => Promise<void>, session: SessionWork | null): boolean {
      if (pending) return false;
      pending = intent;
      if (hydrated) decide(session);
      else updateStatus("waiting-hydration");
      return true;
    },
    resolveHydration(session: SessionWork | null) {
      hydrated = true;
      if (status === "waiting-hydration") decide(session);
    },
    cancel(): boolean {
      if (!pending || status === "starting") return false;
      pending = null;
      updateStatus("idle");
      return true;
    },
    async confirm() {
      if (status === "confirming") await execute();
    },
  };
};

/** One invocation-ordered lane for every active-session write and clear. */
export const createOrderedSessionPersistence = <Snapshot,>({
  save,
}: {
  save: (snapshot: Snapshot) => Promise<unknown>;
}) => {
  let tail = Promise.resolve();
  const enqueue = <T,>(operation: () => Promise<T>) => {
    const result = tail.then(operation);
    // A rejected operation must not permanently block later requests.
    tail = result.then(() => {}, () => {});
    return result;
  };
  return {
    run: enqueue,
    save: (snapshot: Snapshot) => enqueue(() => save(snapshot)),
  };
};
