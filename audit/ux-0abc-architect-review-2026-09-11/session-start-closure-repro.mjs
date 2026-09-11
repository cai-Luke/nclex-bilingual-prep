import assert from 'node:assert/strict';

// Runtime implementation transcribed from src/sessionStartGuard.ts at 4a0e589.
// TypeScript-only annotations are removed. No guard behavior is changed.
const hasProtectedSession = (session) => Boolean(
  session && !session.completed && (
    Object.keys(session.results).length > 0 ||
    Object.keys(session.answers).length > 0 ||
    session.skippedQuestionIds.length > 0
  ),
);
const createSessionStartGuard = ({ onStatusChange, onError }) => {
  let hydrated = false;
  let status = 'idle';
  let pending = null;
  const updateStatus = (next) => { status = next; onStatusChange(next); };
  const execute = async () => {
    if (!pending || status === 'starting') return;
    const intent = pending;
    updateStatus('starting');
    try { await intent(); }
    catch (error) { onError(error); }
    finally { pending = null; updateStatus('idle'); }
  };
  const decide = (session) => {
    if (hasProtectedSession(session)) updateStatus('confirming');
    else void execute();
  };
  return {
    get status() { return status; },
    request(intent, session) {
      if (pending) return false;
      pending = intent;
      if (hydrated) decide(session);
      else updateStatus('waiting-hydration');
      return true;
    },
    resolveHydration(session) {
      hydrated = true;
      if (status === 'waiting-hydration') decide(session);
    },
    cancel() {
      if (!pending || status === 'starting') return false;
      pending = null;
      updateStatus('idle');
      return true;
    },
    async confirm() { if (status === 'confirming') await execute(); },
  };
};

const flush = () => new Promise(resolve => setImmediate(resolve));
const records = [{question: {id: 'seen-question'}}, {question: {id: 'unseen-question'}}];
const hydratedProgress = {'seen-question': {seen: 1}};
const protectedSession = {answers: {q0: {optionIds: ['b']}}, results: {}, skippedQuestionIds: []};

async function scenario(savedSession) {
  let draws = 0;
  const outputs = [];
  const errors = [];
  const guard = createSessionStartGuard({onStatusChange() {}, onError(error) {errors.push(error);}});
  // Same shuffle as App.tsx, using a fixed random value for reproducible ordering.
  const shuffle = items => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      draws += 1;
      const swapIndex = Math.floor(0.99 * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  };
  // Models separate React render scopes. Each owns its own progress binding.
  // This reproduces App.tsx's request callback and non-weighted unseen-first branch.
  // The App, React DOM, real storage and real banks are NOT run by this repro.
  function render(progress) {
    const performSessionStart = async requestedRecords => {
      const unseen = shuffle(requestedRecords.filter(r => (progress[r.question.id]?.seen ?? 0) === 0));
      const seen = shuffle(requestedRecords.filter(r => (progress[r.question.id]?.seen ?? 0) > 0));
      outputs.push([...unseen, ...seen].map(r => r.question.id));
    };
    return {
      requestSessionStart(requested) {
        const requestedRecords = [...requested];
        return guard.request(() => performSessionStart(requestedRecords), savedSession);
      },
    };
  }
  const initialRender = render({});
  initialRender.requestSessionStart(records);
  assert.equal(guard.status, 'waiting-hydration');
  assert.equal(draws, 0);
  const hydratedRender = render(hydratedProgress);
  guard.resolveHydration(savedSession);
  if (savedSession) {
    assert.equal(guard.status, 'confirming');
    assert.equal(draws, 0);
    await guard.confirm();
  }
  await flush();
  assert.deepEqual(outputs[0], ['seen-question', 'unseen-question']);
  // Same requested pool and inputs, but launched from the hydrated render.
  hydratedRender.requestSessionStart(records);
  if (savedSession) await guard.confirm();
  await flush();
  assert.deepEqual(outputs[1], ['unseen-question', 'seen-question']);
  assert.equal(errors.length, 0);
  return {
    savedSession: savedSession ? 'protected draft' : 'none',
    queuedBeforeHydration: outputs[0],
    requestedAfterHydration: outputs[1],
    finding: 'Deferred request runs the old render closure and ignores hydrated progress.',
  };
}
const findings = [await scenario(null), await scenario(protectedSession)];
console.log(JSON.stringify({
  method: 'Isolated deterministic source-level reproduction, not an end-to-end browser run',
  reviewedCommit: '4a0e589',
  findings,
}, null, 2));
