import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const REPO = resolve(import.meta.dirname, "../..");
const ROOT = import.meta.dirname;
const MODE = process.argv[2] ?? "pre";
const PRE = MODE === "pre";
const POST = MODE === "post" || MODE === "closeout";
const CLOSEOUT = MODE === "closeout";
if (!PRE && !POST) throw new Error(`unsupported mode ${MODE}`);

const WORK_ORDER = "scratch/CAMPAIGN-16-PHASE-D-BOWTIE-REPAIR-WORK-ORDER-2026-08-29.md";
const WORK_ORDER_SHA = "6a0154f7dd3cb0c663ed5bed9c6346058e1e38a16c333ae04f0c328fe0230bba";
const PATCH = "scripts/patches/2026-08-29-campaign16-phase-d-bowtie-repair.ts";
const PATCH_SHA = "cd265d54b18ec88421f5507c06faf5a2625b47c54bc38a036a29ff24e6acd12d";
const CHECKER = "audit/campaign-16-phase-d-check-2026-08-29-r2-retry-1";
const FAILED_CHECKER = "audit/campaign-16-phase-d-check-2026-08-29-r2";
const PRODUCER = "audit/campaign-16-phase-d-bowtie-repair-2026-08-29-r2";
const TARGET_BANKS = ["banks/gpt-canonical.json", "banks/hard-cases-canonical.json"];

const fail = (message) => { throw new Error(`CAMPAIGN16_PHASE_D_BLOCKED: stage3-${MODE}: ${message}`); };
const sha = (value) => createHash("sha256").update(value).digest("hex");
const fileSha = (path) => sha(readFileSync(join(REPO, path)));
const parseJson = (path) => JSON.parse(readFileSync(join(REPO, path), "utf8"));
const parseJsonl = (path) => readFileSync(join(REPO, path), "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const git = (...args) => execFileSync("git", args, { cwd: REPO, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();
const sortKeys = (value) => Array.isArray(value) ? value.map(sortKeys) : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortKeys(value[key])])) : value;
const stableJson = (value) => JSON.stringify(sortKeys(value)) + "\n";
const payloadSha = (value) => sha(stableJson(value));

function questionMap(bankPath) {
  const bank = parseJson(bankPath);
  if (!Array.isArray(bank.questions)) fail(`malformed bank ${bankPath}`);
  const map = new Map();
  for (const question of bank.questions) {
    if (map.has(question.id)) fail(`duplicate top-level id ${question.id} in ${bankPath}`);
    map.set(question.id, question);
  }
  return { bank, map };
}

function resolveValue(root, path) {
  let current = root;
  for (const segment of path) {
    if (typeof segment === "string" || typeof segment === "number") current = current?.[segment];
    else {
      if (!Array.isArray(current)) fail(`selector requires array at ${JSON.stringify(path)}`);
      const key = "id" in segment ? "id" : "refId";
      const value = segment[key];
      const matches = current.filter((entry) => entry?.[key] === value);
      if (matches.length !== 1) fail(`selector ${key}=${value} matched ${matches.length}`);
      current = matches[0];
    }
  }
  return current;
}

function setValue(root, path, value) {
  let current = root;
  for (let i = 0; i < path.length - 1; i++) {
    const segment = path[i];
    if (typeof segment === "string" || typeof segment === "number") current = current[segment];
    else {
      const key = "id" in segment ? "id" : "refId";
      const matches = current.filter((entry) => entry?.[key] === segment[key]);
      if (matches.length !== 1) fail(`set selector ${key}=${segment[key]} matched ${matches.length}`);
      current = matches[0];
    }
  }
  current[path.at(-1)] = value;
}

function patchOps() {
  const source = `import { OPS_BY_BANK } from './scripts/patches/2026-08-29-campaign16-phase-d-bowtie-repair.ts'; process.stdout.write(JSON.stringify(OPS_BY_BANK));`;
  const child = spawnSync("npx", ["tsx", "-e", source], { cwd: REPO, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  if (child.status !== 0) fail(`unable to load frozen patch operations: ${child.stderr}`);
  return JSON.parse(child.stdout);
}

function statusRows() {
  const raw = execFileSync("git", ["status", "--porcelain=v1", "-z", "--untracked-files=all"], { cwd: REPO, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const parts = raw.split("\0").filter(Boolean);
  const rows = [];
  for (let i = 0; i < parts.length; i++) {
    const entry = parts[i];
    const status = entry.slice(0, 2);
    const path = entry.slice(3);
    rows.push({ status, path });
    if (status[0] === "R" || status[0] === "C") i++;
  }
  return rows;
}

function treeDigest(path) {
  const full = join(REPO, path);
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir).sort()) {
      const item = join(dir, name);
      if (statSync(item).isDirectory()) walk(item);
      else files.push(item);
    }
  };
  walk(full);
  const rows = files.map((file) => ({ path: file.slice(REPO.length + 1), sha256: sha(readFileSync(file)) }));
  return { fileCount: rows.length, aggregateSha256: sha(rows.map((row) => `${row.sha256}  ${row.path}\n`).join("")) };
}

function structural(question) {
  return {
    identity: { id: question.id, category: question.category, topic: question.topic, difficulty: question.difficulty, itemType: question.itemType, ngnSkill: question.ngnSkill ?? null },
    tokenIds: {
      condition: question.bowtie.condition.tokens.map((token) => token.id),
      actions: question.bowtie.actions.tokens.map((token) => token.id),
      parameters: question.bowtie.parameters.tokens.map((token) => token.id),
    },
    keyed: {
      condition: question.bowtie.condition.correct,
      actions: question.bowtie.actions.correct,
      parameters: question.bowtie.parameters.correct,
    },
    responseShape: [question.bowtie.condition.tokens.length, question.bowtie.actions.tokens.length, question.bowtie.parameters.tokens.length],
    scoringCardinality: [1, question.bowtie.actions.correct.length, question.bowtie.parameters.correct.length],
  };
}

function main() {
  if (fileSha(WORK_ORDER) !== WORK_ORDER_SHA) fail("frozen work-order SHA mismatch");
  if (fileSha(PATCH) !== PATCH_SHA) fail("frozen patch SHA mismatch");

  const opening = parseJson(`${PRODUCER}/opening-state.json`);
  if (git("branch", "--show-current") !== opening.branch || git("rev-parse", "HEAD") !== opening.head || git("rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}") !== opening.upstream) fail("repository identity changed since Stage 0");

  const allowedOpeningChanges = new Set(POST ? [...TARGET_BANKS, ...(CLOSEOUT ? ["BANK-REVIEW-LEDGER.md"] : [])] : []);
  const openingRows = opening.dirtyPaths.map((row) => {
    const currentFileSha = fileSha(row.path);
    const fileMatch = currentFileSha === row.fileSha256;
    const currentIndexBlob = row.tracked ? git("rev-parse", `:${row.path}`) : null;
    const indexMatch = currentIndexBlob === row.indexBlob;
    if (!indexMatch) fail(`opening index blob changed: ${row.path}; observed ${currentIndexBlob}, expected ${row.indexBlob}`);
    if (!fileMatch && !allowedOpeningChanges.has(row.path)) fail(`Stage 0 live-worktree byte drift: ${row.path}; observed ${currentFileSha}, expected ${row.fileSha256}`);
    return { path: row.path, fileMatch, authorizedChange: !fileMatch && allowedOpeningChanges.has(row.path), indexMatch };
  });

  const openingPaths = new Set(opening.dirtyPaths.map((row) => row.path));
  const authorizedAddition = (path) => path === PATCH || path.startsWith(`${PRODUCER}/`) || path.startsWith(`${FAILED_CHECKER}/`) || path.startsWith(`${CHECKER}/`) || (POST && path === "banks/hard-cases-canonical.json");
  const unexpectedStatus = statusRows().filter((row) => !openingPaths.has(row.path) && !authorizedAddition(row.path));
  if (unexpectedStatus.length) fail(`unexpected post-Stage-0 paths: ${unexpectedStatus.map((row) => `${row.status} ${row.path}`).join(", ")}`);

  const review = parseJson(`${CHECKER}/review.json`);
  if (review.terminal !== "CAMPAIGN16_PHASE_D_CONTENT_READY") fail(`checker terminal ${review.terminal}`);
  if (review.rows.length !== 12 || review.rows.some((row) => row.checkerPrimaryVerdict !== "PASS_STANDALONE" || !row.keyConstructPreserved)) fail("checker 12/12 PASS_STANDALONE/key-preservation gate failed");

  const candidates = parseJsonl(`${PRODUCER}/repair-candidates.jsonl`);
  const candidateMap = new Map(candidates.map((row) => [row.candidateId, row]));
  if (candidateMap.size !== 12) fail(`candidate package count ${candidateMap.size}`);
  for (const row of review.rows) {
    const candidate = candidateMap.get(row.candidateId);
    if (!candidate || candidate.afterPayloadSha256 !== row.reviewedAfterPayloadSha256 || payloadSha(candidate.payload) !== row.reviewedAfterPayloadSha256) fail(`checker after-hash bridge mismatch: ${row.candidateId}`);
  }

  const manifest = parseJson(`${PRODUCER}/repair-manifest.json`);
  const opsByBank = patchOps();
  const actualOps = Object.entries(opsByBank).flatMap(([bankPath, ops]) => ops.map((op) => ({ bankPath, ...op })));
  const frozenOps = parseJsonl(`${PRODUCER}/patch-operations.jsonl`);
  if (manifest.targetCount !== 12 || manifest.operationCount !== 225 || actualOps.length !== 225 || new Set(actualOps.map((op) => op.id)).size !== 12) fail("12-target/225-operation reconciliation failed");
  const byBank = Object.fromEntries(Object.entries(opsByBank).map(([bankPath, ops]) => [bankPath, ops.length]));
  if (byBank["banks/gpt-canonical.json"] !== 201 || byBank["banks/hard-cases-canonical.json"] !== 24) fail(`operation bank split mismatch ${JSON.stringify(byBank)}`);
  const opKey = (row) => JSON.stringify([row.bankPath, row.kind, row.id, row.path, row.before, row.after, row.note]);
  if (JSON.stringify(actualOps.map(opKey).sort()) !== JSON.stringify(frozenOps.map(opKey).sort())) fail("frozen patch operations differ from producer operation freeze");

  const stage0Targets = parseJsonl(`${PRODUCER}/stage0-targets.jsonl`);
  const stage0TargetMap = new Map(stage0Targets.map((row) => [row.candidateId, row]));
  const bankCache = new Map(TARGET_BANKS.map((path) => [path, questionMap(path)]));
  const opStates = [];
  for (const op of actualOps) {
    const question = bankCache.get(op.bankPath).map.get(op.id);
    if (!question) fail(`patch target absent: ${op.id}`);
    const current = resolveValue(question, op.path);
    const state = JSON.stringify(current) === JSON.stringify(op.before) ? "before" : JSON.stringify(current) === JSON.stringify(op.after) ? "after" : "stale";
    if (state === "stale" || (PRE && state !== "before") || (POST && state !== "after")) fail(`patch field state ${state}: ${op.id} ${JSON.stringify(op.path)}`);
    opStates.push(state);
  }

  const targetRows = [];
  for (const baseline of stage0Targets) {
    const live = bankCache.get(baseline.bankPath).map.get(baseline.candidateId);
    if (!live) fail(`target absent ${baseline.candidateId}`);
    const observed = payloadSha(live);
    const expected = PRE ? baseline.observedPayloadSha256 : candidateMap.get(baseline.candidateId).afterPayloadSha256;
    if (observed !== expected) fail(`target payload hash mismatch ${baseline.candidateId}: observed ${observed}, expected ${expected}`);
    const baselineStructure = structural(baseline.payload);
    const liveStructure = structural(live);
    if (JSON.stringify(baselineStructure) !== JSON.stringify(liveStructure) || JSON.stringify(liveStructure.responseShape) !== "[3,4,4]" || JSON.stringify(liveStructure.scoringCardinality) !== "[1,2,2]") fail(`target structural/key/scoring movement ${baseline.candidateId}`);
    if (POST) {
      const expectedPayload = structuredClone(baseline.payload);
      for (const op of actualOps.filter((row) => row.id === baseline.candidateId)) setValue(expectedPayload, op.path, op.after);
      if (stableJson(expectedPayload) !== stableJson(live)) fail(`P26 non-authorized-field preservation failed ${baseline.candidateId}`);
    }
    targetRows.push({ candidateId: baseline.candidateId, bankPath: baseline.bankPath, beforePayloadSha256: baseline.observedPayloadSha256, observedPayloadSha256: observed, expectedPayloadSha256: expected, match: true });
  }

  const controls = parseJson(`${PRODUCER}/stage0-preservation-controls.json`);
  for (const row of controls.passingControls) {
    const question = questionMap(row.bankPath).map.get(row.candidateId);
    if (!question || payloadSha(question) !== row.payloadSha256) fail(`prior-PASS control changed ${row.candidateId}`);
  }
  const companions = parseJsonl(`${PRODUCER}/stage0-companions.jsonl`);
  for (const row of companions) {
    const question = questionMap(row.companionBankPath).map.get(row.companionCaseId);
    if (!question || payloadSha(question) !== row.livePayloadSha256) fail(`companion changed ${row.companionCaseId}`);
  }
  const targetIds = new Set(stage0Targets.map((row) => row.candidateId));
  for (const snapshot of controls.targetBankSnapshots) {
    const bank = questionMap(snapshot.bankPath).bank;
    if (JSON.stringify(bank.questions.map((question) => question.id)) !== JSON.stringify(snapshot.questionOrder)) fail(`record order changed ${snapshot.bankPath}`);
    const current = bank.questions.filter((question) => !targetIds.has(question.id)).map((question) => ({ id: question.id, payloadSha256: payloadSha(question) }));
    if (JSON.stringify(current) !== JSON.stringify(snapshot.nonTargetPayloads)) fail(`non-target record payload changed ${snapshot.bankPath}`);
    const bytes = readFileSync(join(REPO, snapshot.bankPath), "utf8");
    if (bytes !== JSON.stringify(JSON.parse(bytes), null, 2) + "\n") fail(`JSON serialization/smart-quote corruption ${snapshot.bankPath}`);
  }

  const preflight = parseJson(`${PRODUCER}/stage0-preflight.json`);
  if (PRE) for (const row of preflight.bankRows) if (fileSha(row.bankPath) !== row.fileByteSha256) fail(`pre-apply bundled bank byte drift ${row.bankPath}`);
  else for (const row of preflight.bankRows.filter((row) => !TARGET_BANKS.includes(row.bankPath))) if (fileSha(row.bankPath) !== row.fileByteSha256) fail(`non-target bundled bank byte drift ${row.bankPath}`);

  const result = {
    status: "PASS",
    mode: MODE,
    workOrderSha256: fileSha(WORK_ORDER),
    patchSha256: fileSha(PATCH),
    checkerTerminal: review.terminal,
    checkerRows: "12/12 retained PASS_STANDALONE",
    targetCount: targetRows.length,
    operationCount: actualOps.length,
    operationsByBank: byBank,
    patchFieldState: PRE ? `${opStates.length}/225 before; stale 0` : `${opStates.length}/225 after; stale 0`,
    targets: targetRows,
    p26: POST ? "12/12 PASS" : "pre-apply baseline intact",
    priorPassControls: `${controls.passingControls.length}/38 unchanged`,
    companions: `${companions.length}/11 unchanged`,
    nonTargetPayloadAndOrder: "PASS",
    structuralKeyTokenResponseScoringPreservation: "12/12 PASS",
    openingDirtyPaths: `${openingRows.length}/${opening.dirtyPathCount} accounted`,
    openingIndexBlobs: `${openingRows.length}/${opening.dirtyPathCount} unchanged where tracked`,
    unexpectedGitPaths: 0,
    targetBankFileSha256: Object.fromEntries(TARGET_BANKS.map((path) => [path, fileSha(path)])),
    ledgerSha256: fileSha("BANK-REVIEW-LEDGER.md"),
    protectedPaths: {
      projectHistorySha256: fileSha("PROJECT-HISTORY.md"),
      decisionsSha256: fileSha("DECISIONS.md"),
      censusJsonSha256: fileSha("census.json"),
      bankCensusSha256: fileSha("BANK-CENSUS.md"),
      frozenPatchSha256: fileSha(PATCH),
      failedCheckerTree: treeDigest(FAILED_CHECKER),
      operativeCheckerTree: treeDigest(CHECKER),
    },
  };
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

main();
