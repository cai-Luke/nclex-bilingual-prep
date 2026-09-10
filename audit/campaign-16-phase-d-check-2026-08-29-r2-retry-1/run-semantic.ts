// Campaign 16 Phase D checker retry (R2-retry-1) — external zero-tool semantic orchestration.
//
// For each of the 12 candidates, this spawns a genuinely fresh, isolated `claude -p` process
// with `--tools "" --disallowedTools "*" --strict-mcp-config`, running in a unique neutral
// non-repository working directory. The orchestrator (this script, and the Claude Code session
// that launches it) has full repo/tool access; the spawned semantic subcontexts do not — every
// turn's `system/init` receipt is captured and mechanically checked for `tools: []` and
// `mcp_servers: []` before that turn's output is ever trusted. A candidate whose receipt shows
// any tool is immediately marked BLOCKED and no further turns are sent for it.
//
// Lock order per candidate, all within ONE resumed session (fresh for turn 1, `--resume` after):
//   Stage 1 (blind free-generation) -> Stage 2 (blind token selection) ->
//   standalone unblinding -> paired provenance (11 rows) / unpaired finalization (1 row).
// Each turn's packet is built ONLY from the locked bytes of the prior turn plus deterministic
// projection of the repaired payload — never from repair-manifest.json, the old verdict
// narrative, the patch diff, or any canonical-bank path/ID.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import {
  sha256,
  stableJson,
  tokenMap,
  canonicalSelection,
  stage1Packet,
  stage2Packet,
  standaloneProjection,
  standalonePacket,
  pairedProvenancePacket,
  unpairedFinalizationPacket,
  verifyBlindLeakage,
  VERDICTS,
  Obj,
} from "./checker-adapter.ts";

const OUT = resolve(import.meta.dirname);
const REPO = resolve(OUT, "../..");
const PRODUCER = join(REPO, "audit/campaign-16-phase-d-bowtie-repair-2026-08-29-r2");
const NEUTRAL_ROOT = "/tmp/phase-d-r2-retry1-semantic";
const MODEL = process.env.PHASE_D_MODEL ?? "opus";
const EFFORT = process.env.PHASE_D_EFFORT ?? "high";
const MAX_BUDGET_PER_CALL = process.env.PHASE_D_MAX_BUDGET_PER_CALL ?? "4";
const GLOBAL_COST_CEILING_USD = Number(process.env.PHASE_D_COST_CEILING ?? "80");
const CONCURRENCY = Number(process.env.PHASE_D_CONCURRENCY ?? "5");

let cumulativeCostUsd = 0;
const log = (msg: string) => { const line = `[${new Date().toISOString()}] ${msg}`; console.log(line); appendLine(join(OUT, "run.log"), line); };
function appendLine(path: string, line: string) { try { writeFileSync(path, line + "\n", { flag: "a" }); } catch {} }

function parseJsonl(p: string): Obj[] { return readFileSync(p, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse); }
function readJson(p: string): Obj { return JSON.parse(readFileSync(p, "utf8")); }
function writeJson(p: string, v: unknown) { mkdirSync(resolve(p, ".."), { recursive: true }); writeFileSync(p, stableJson(v), "utf8"); }

type TurnResult = { sessionId: string; initEvent: Obj; resultEvent: Obj | null; resultText: string; costUsd: number; isError: boolean; toolsClean: boolean; rawLogPath: string };

function runClaudeTurn(opts: { prompt: string; cwd: string; resumeSessionId?: string; logPath: string }): Promise<TurnResult> {
  return new Promise((resolvePromise, reject) => {
    const args: string[] = ["-p"];
    if (opts.resumeSessionId) args.push("--resume", opts.resumeSessionId);
    args.push(
      opts.prompt,
      "--tools", "",
      "--disallowedTools", "*",
      "--strict-mcp-config",
      "--model", MODEL,
      "--effort", EFFORT,
      "--output-format", "stream-json",
      "--verbose",
      "--max-budget-usd", MAX_BUDGET_PER_CALL,
    );
    const child = spawn("claude", args, { cwd: opts.cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });
    child.on("close", (code) => {
      mkdirSync(resolve(opts.logPath, ".."), { recursive: true });
      writeFileSync(opts.logPath, stdout, "utf8");
      if (stderr) writeFileSync(opts.logPath + ".stderr", stderr, "utf8");
      const lines = stdout.trim().split("\n").filter(Boolean);
      let initEvent: Obj | null = null;
      let resultEvent: Obj | null = null;
      for (const line of lines) {
        try {
          const ev = JSON.parse(line);
          if (ev.type === "system" && ev.subtype === "init") initEvent = ev;
          if (ev.type === "result") resultEvent = ev;
        } catch {}
      }
      if (!initEvent) return reject(new Error(`no system/init event captured (exit ${code}); stderr: ${stderr.slice(0, 2000)}`));
      const toolsClean = Array.isArray(initEvent.tools) && initEvent.tools.length === 0 && Array.isArray(initEvent.mcp_servers) && initEvent.mcp_servers.length === 0;
      const costUsd = resultEvent?.total_cost_usd ?? 0;
      resolvePromise({
        sessionId: initEvent.session_id,
        initEvent,
        resultEvent,
        resultText: resultEvent?.result ?? "",
        costUsd,
        isError: !!resultEvent?.is_error || code !== 0,
        toolsClean,
        rawLogPath: opts.logPath,
      });
    });
    child.on("error", reject);
  });
}

function extractJson(text: string): Obj | null {
  const trimmed = text.trim();
  try { return JSON.parse(trimmed); } catch {}
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) { try { return JSON.parse(fenced[1].trim()); } catch {} }
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) { try { return JSON.parse(trimmed.slice(first, last + 1)); } catch {} }
  return null;
}

// --- Structural validators (mechanical, orchestrator-side; not a --json-schema tool grant) ---
const isStr = (v: unknown) => typeof v === "string" && v.length > 0;
const isArr = (v: unknown, n?: number) => Array.isArray(v) && (n === undefined || v.length === n);
const STAGE1_TARGETS = new Set(["condition", "priorityAction1", "priorityAction2", "evaluationParameter1", "evaluationParameter2"]);
const PREMISE_STATUS = new Set(["SUPPORTED_EXPLICIT", "SUPPORTED_GENERAL_KNOWLEDGE", "MISSING_CLIENT_FACT", "CONTRADICTED", "NO_CLIENT_PREMISE"]);
const RANKABILITY = new Set(["NONE", "LOW", "MATERIAL"]);
const SUPPORT_CLASS = new Set(["DIRECT", "GENERAL_KNOWLEDGE_LINK", "MISSING_CLIENT_FACT", "CONTRADICTED", "NOT_APPLICABLE"]);

function validateStage1(r: Obj): string[] {
  const errs: string[] = [];
  if (!isStr(r.condition)) errs.push("condition missing");
  if (!isArr(r.evaluationParameters, 2)) errs.push("evaluationParameters must be array of 2");
  if (!isArr(r.priorityActions, 2)) errs.push("priorityActions must be array of 2");
  if (!isStr(r.reasoning)) errs.push("reasoning missing");
  if (!isArr(r.missingInformation)) errs.push("missingInformation must be array");
  if (!["high", "medium", "low"].includes(r.stage1Confidence)) errs.push("stage1Confidence invalid");
  if (!isArr(r.stemEvidence) || r.stemEvidence.length < 1) errs.push("stemEvidence missing");
  else for (const e of r.stemEvidence) if (!isStr(e.stemFact) || !STAGE1_TARGETS.has(e.target)) errs.push(`stemEvidence entry invalid: ${JSON.stringify(e).slice(0, 120)}`);
  return errs;
}
function validateStage2(r: Obj): string[] {
  const errs: string[] = [];
  if (!isStr(r.conditionLabel)) errs.push("conditionLabel missing");
  if (!isArr(r.actionLabels, 2)) errs.push("actionLabels must be array of 2");
  if (!isArr(r.parameterLabels, 2)) errs.push("parameterLabels must be array of 2");
  if (!isStr(r.reasoning)) errs.push("reasoning missing");
  if (!["ANSWERABLE", "UNDERDETERMINED"].includes(r.poolAnswerability)) errs.push("poolAnswerability invalid");
  if (!["high", "medium", "low"].includes(r.stage2Confidence)) errs.push("stage2Confidence invalid");
  if (!isArr(r.tokenPremiseTable, 11)) errs.push("tokenPremiseTable must be exactly 11 rows");
  else {
    const labels = new Set(r.tokenPremiseTable.map((e: Obj) => e.opaqueTokenLabel));
    const expected = ["C1", "C2", "C3", "A1", "A2", "A3", "A4", "P1", "P2", "P3", "P4"];
    if (expected.some((l) => !labels.has(l))) errs.push("tokenPremiseTable does not cover all 11 labels exactly once");
    for (const e of r.tokenPremiseTable) {
      if (!PREMISE_STATUS.has(e.premiseStatus)) errs.push(`tokenPremiseTable ${e.opaqueTokenLabel} premiseStatus invalid: ${e.premiseStatus}`);
      if (!RANKABILITY.has(e.rankabilityImpact)) errs.push(`tokenPremiseTable ${e.opaqueTokenLabel} rankabilityImpact invalid: ${e.rankabilityImpact}`);
    }
  }
  return errs;
}
function validateStandalone(r: Obj): string[] {
  const errs: string[] = [];
  if (typeof r.blindExactMatch !== "boolean") errs.push("blindExactMatch missing");
  if (typeof r.canonicalSetUniquelyDefensible !== "boolean") errs.push("canonicalSetUniquelyDefensible missing");
  if (typeof r.anyCanonicalTargetDependsOnAbsentFact !== "boolean") errs.push("anyCanonicalTargetDependsOnAbsentFact missing");
  if (typeof r.unstatedClientFactMateriallyChangesRankability !== "boolean") errs.push("unstatedClientFactMateriallyChangesRankability missing");
  if (!isStr(r.canonicalSetExplanation)) errs.push("canonicalSetExplanation missing");
  if (!isArr(r.canonicalTargetSupport, 5)) errs.push("canonicalTargetSupport must be exactly 5 rows");
  else for (const e of r.canonicalTargetSupport) if (!SUPPORT_CLASS.has(e.supportClassification)) errs.push(`canonicalTargetSupport ${e.opaqueTokenLabel} supportClassification invalid: ${e.supportClassification}`);
  if (!isArr(r.distractorPremiseFindings, 6)) errs.push("distractorPremiseFindings must be exactly 6 rows");
  else for (const e of r.distractorPremiseFindings) if (!PREMISE_STATUS.has(e.premiseStatus)) errs.push(`distractorPremiseFindings ${e.opaqueTokenLabel} premiseStatus invalid: ${e.premiseStatus}`);
  if (!["FULL", "PARTIAL", "NONE"].includes(r.stage1Alignment)) errs.push("stage1Alignment invalid");
  return errs;
}
function validateFinal(r: Obj, paired: boolean): string[] {
  const errs: string[] = [];
  if (!VERDICTS.has(r.primaryVerdict)) errs.push(`primaryVerdict not in closed vocabulary: ${r.primaryVerdict}`);
  if (paired && r.primaryVerdict === "FAIL_HIDDEN_CASE_DEPENDENCY" === false && !("canonicalTargetSiblingOverlap" in r)) errs.push("paired final review missing canonicalTargetSiblingOverlap");
  if (!paired && r.primaryVerdict === "FAIL_HIDDEN_CASE_DEPENDENCY") errs.push("unpaired candidate returned FAIL_HIDDEN_CASE_DEPENDENCY, which is unreachable with no sibling");
  if (!isStr(r.defectSummary) && r.primaryVerdict !== "PASS_STANDALONE") errs.push("defectSummary missing for a failing verdict");
  if (!isStr(r.reasoning)) errs.push("reasoning missing");
  if (!Array.isArray(r.missingFactProvenance)) errs.push("missingFactProvenance must be an array");
  if (!Array.isArray(r.secondaryFlags)) errs.push("secondaryFlags must be an array");
  return errs;
}

const FORMAT_RETRY_SUFFIX = "\n\nYour prior reply was not valid — either it was not parseable JSON, or it did not include every required field in the exact shape requested. Reissue your ENTIRE response now as a single JSON object only: no markdown code fences, no prose before or after, no explanation outside the JSON. Every field named in the instructions above must be present with the exact required type/cardinality.";

async function lockedTurn(opts: {
  label: string;
  cwd: string;
  resumeSessionId?: string;
  prompt: string;
  validate: (r: Obj) => string[];
  logDir: string;
  turnName: string;
}): Promise<{ review: Obj; reviewSha256: string; sessionId: string; receipts: Obj[] }> {
  const receipts: Obj[] = [];
  let sessionId = opts.resumeSessionId;
  let prompt = opts.prompt;
  let lastErrors: string[] = [];
  for (let attempt = 1; attempt <= 2; attempt++) {
    if (cumulativeCostUsd > GLOBAL_COST_CEILING_USD) throw new Error(`global cost ceiling $${GLOBAL_COST_CEILING_USD} exceeded (at $${cumulativeCostUsd.toFixed(2)}) — aborting`);
    const logPath = join(opts.logDir, `${opts.turnName}-attempt${attempt}.jsonl`);
    const turn = await runClaudeTurn({ prompt, cwd: opts.cwd, resumeSessionId: sessionId, logPath });
    cumulativeCostUsd += turn.costUsd;
    sessionId = turn.sessionId;
    receipts.push({
      attempt,
      sessionId: turn.sessionId,
      uuid: turn.initEvent.uuid,
      model: turn.initEvent.model,
      permissionMode: turn.initEvent.permissionMode,
      cwd: turn.initEvent.cwd,
      tools: turn.initEvent.tools,
      mcpServers: turn.initEvent.mcp_servers,
      apiKeySource: turn.initEvent.apiKeySource,
      toolsClean: turn.toolsClean,
      costUsd: turn.costUsd,
      isError: turn.isError,
      rawLogPath: turn.rawLogPath.slice(REPO.length + 1),
      rawLogSha256: sha256(readFileSync(turn.rawLogPath)),
    });
    if (!turn.toolsClean) {
      throw new Error(`ZERO_TOOL_VIOLATION on ${opts.label} ${opts.turnName}: tools=${JSON.stringify(turn.initEvent.tools)} mcp_servers=${JSON.stringify(turn.initEvent.mcp_servers)}`);
    }
    if (turn.isError) { lastErrors = [`turn error: ${JSON.stringify(turn.resultEvent).slice(0, 300)}`]; prompt = FORMAT_RETRY_SUFFIX; continue; }
    const parsed = extractJson(turn.resultText);
    if (!parsed) { lastErrors = ["response was not valid/extractable JSON"]; prompt = FORMAT_RETRY_SUFFIX; continue; }
    const errs = opts.validate(parsed);
    if (errs.length) { lastErrors = errs; prompt = FORMAT_RETRY_SUFFIX; continue; }
    const reviewSha256 = sha256(stableJson(parsed));
    log(`${opts.label} ${opts.turnName}: LOCKED sha256=${reviewSha256.slice(0, 12)}… (attempt ${attempt}, cost so far $${cumulativeCostUsd.toFixed(2)})`);
    return { review: parsed, reviewSha256, sessionId: sessionId!, receipts };
  }
  throw new Error(`${opts.label} ${opts.turnName}: failed validation after retries: ${lastErrors.join("; ")}`);
}

function writeLock(surrogate: string, kind: string, sha256Value: string, priorSha256: string | null, paired: boolean, artifactPath: string) {
  const key = paired ? "lockedAfter" : "priorSealSha256";
  writeJson(join(OUT, "locks", `${surrogate}-${kind}.json`), { artifact: artifactPath, [key]: priorSha256, sha256: sha256Value });
}

async function processCandidate(c: Obj, row: Obj, companion: Obj | undefined): Promise<Obj> {
  const label = c.surrogateId;
  const cwd = join(NEUTRAL_ROOT, c.surrogateId);
  mkdirSync(cwd, { recursive: true });
  const logDir = join(OUT, "receipts", c.surrogateId);
  const map = tokenMap(row.payload);
  const paired = !!c.paired;

  try {
    // Turn 1 — Stage 1
    const packet1 = stage1Packet(row.payload);
    verifyBlindLeakage(packet1, [c.candidateId, c.companionCaseId, c.bankPath], 1);
    writeJson(join(OUT, "blind-packets", `${label}-stage1.json`), packet1);
    const prompt1 = `${packet1.instruction}\n\nStem:\n${packet1.stem}\n\nReturn ONLY a single JSON object with exactly these keys: condition (string), evaluationParameters (array of exactly 2 strings), missingInformation (array of strings), priorityActions (array of exactly 2 strings), reasoning (string), stage1Confidence ("high"|"medium"|"low"), stemEvidence (array of objects, each {stemFact: string, target: one of "condition"|"priorityAction1"|"priorityAction2"|"evaluationParameter1"|"evaluationParameter2"}). No markdown fences, no text outside the JSON object.`;
    const t1 = await lockedTurn({ label, cwd, prompt: prompt1, validate: validateStage1, logDir, turnName: "stage1" });
    writeJson(join(OUT, "blind-reviews", `${label}-stage1.json`), t1.review);
    writeLock(label, "stage1", t1.reviewSha256, null, paired, `audit/campaign-16-phase-d-check-2026-08-29-r2-retry-1/blind-reviews/${label}-stage1.json`);

    // Turn 2 — Stage 2
    const packet2 = stage2Packet(row.payload);
    verifyBlindLeakage(packet2, [c.candidateId, c.companionCaseId, c.bankPath, ...Object.keys(map.condition), ...Object.keys(map.actions), ...Object.keys(map.parameters)], 2);
    writeJson(join(OUT, "blind-packets", `${label}-stage2.json`), packet2);
    const prompt2 = `Stage 1 is now locked (you already answered it above, in this same session). ${packet2.instruction}\n\nStem:\n${packet2.stem}\n\nPrompts:\n${JSON.stringify(packet2.prompts ?? {}, null, 2)}\n\nOpaque token pools:\n${JSON.stringify(packet2.tokens, null, 2)}\n\nReturn ONLY a single JSON object with exactly these keys: conditionLabel (string, one of the C-labels), actionLabels (array of exactly 2 A-labels), parameterLabels (array of exactly 2 P-labels), reasoning (string), poolAnswerability ("ANSWERABLE"|"UNDERDETERMINED"), stage2Confidence ("high"|"medium"|"low"), selectionEvidence (array), ambiguousAlternatives (array), missingInformation (array of strings), tokenPremiseTable (array of EXACTLY 11 objects, one per opaque token label C1,C2,C3,A1,A2,A3,A4,P1,P2,P3,P4, each {opaqueTokenLabel, missingPremise, premiseStatus: one of "SUPPORTED_EXPLICIT"|"SUPPORTED_GENERAL_KNOWLEDGE"|"MISSING_CLIENT_FACT"|"CONTRADICTED"|"NO_CLIENT_PREMISE", rankabilityImpact: one of "NONE"|"LOW"|"MATERIAL", rankabilityJustification, supportingStemText}). No markdown fences, no text outside the JSON object.`;
    const t2 = await lockedTurn({ label, cwd, resumeSessionId: t1.sessionId, prompt: prompt2, validate: validateStage2, logDir, turnName: "stage2" });
    writeJson(join(OUT, "blind-reviews", `${label}-stage2.json`), t2.review);
    writeLock(label, "stage2", t2.reviewSha256, t1.reviewSha256, paired, `audit/campaign-16-phase-d-check-2026-08-29-r2-retry-1/blind-reviews/${label}-stage2.json`);

    // Turn 3 — standalone unblinding
    const standaloneP = standalonePacket(row.payload, map, t1.reviewSha256, t2.reviewSha256, t1.review, t2.review);
    writeJson(join(OUT, "standalone-packets", `${label}.json`), standaloneP);
    const prompt3 = `${standaloneP.instruction}\n\nCanonical selection: ${JSON.stringify(standaloneP.canonicalSelection)}\n\nComplete standalone item (still no sibling case):\n${JSON.stringify(standaloneP.standaloneItem, null, 2)}\n\nReturn ONLY a single JSON object with exactly these keys: blindExactMatch (boolean), canonicalSetUniquelyDefensible (boolean), canonicalSetExplanation (string), canonicalTargetSupport (array of EXACTLY 5 objects, one per keyed C/A/A/P/P label, each {opaqueTokenLabel, supportClassification: one of "DIRECT"|"GENERAL_KNOWLEDGE_LINK"|"MISSING_CLIENT_FACT"|"CONTRADICTED"|"NOT_APPLICABLE", supportingStandaloneEvidence, missingClientFact}), distractorPremiseFindings (array of EXACTLY 6 objects, one per non-keyed label, each {opaqueTokenLabel, premiseStatus: one of "SUPPORTED_EXPLICIT"|"SUPPORTED_GENERAL_KNOWLEDGE"|"MISSING_CLIENT_FACT"|"CONTRADICTED"|"NO_CLIENT_PREMISE", rankabilityImpact: one of "NONE"|"LOW"|"MATERIAL", explanation}), missingClientFacts (array), notes (array of strings), stage1Alignment ("FULL"|"PARTIAL"|"NONE"), stage1AlignmentExplanation (string), anyCanonicalTargetDependsOnAbsentFact (boolean), unstatedClientFactMateriallyChangesRankability (boolean). No markdown fences, no text outside the JSON object.`;
    const t3 = await lockedTurn({ label, cwd, resumeSessionId: t2.sessionId, prompt: prompt3, validate: validateStandalone, logDir, turnName: "standalone" });
    writeJson(join(OUT, "blind-reviews", `${label}-standalone.json`), t3.review);
    writeLock(label, "standalone", t3.reviewSha256, t2.reviewSha256, paired, `audit/campaign-16-phase-d-check-2026-08-29-r2-retry-1/blind-reviews/${label}-standalone.json`);

    // Turn 4 — paired provenance or unpaired finalization
    let finalPacket: Obj;
    if (paired) {
      if (!companion) throw new Error(`${label} marked paired but no companion payload available`);
      finalPacket = pairedProvenancePacket(row.payload, map, t3.reviewSha256, t3.review, companion);
      writeJson(join(OUT, "sibling-packets", `${label}.json`), finalPacket);
    } else {
      finalPacket = unpairedFinalizationPacket(row.payload, map, t3.reviewSha256, t3.review);
      writeJson(join(OUT, "sibling-packets", `${label}.json`), finalPacket);
    }
    const siblingText = paired ? `\n\nSibling case (now revealed for the first time):\n${JSON.stringify(finalPacket.siblingCase, null, 2)}` : "";
    const prompt4 = `${finalPacket.instruction}${siblingText}\n\nReturn ONLY a single JSON object with exactly these keys: primaryVerdict (exactly one of "FAIL_HIDDEN_CASE_DEPENDENCY","FAIL_UNSUPPORTED_TOKEN_PREMISE","FAIL_UNDERDETERMINED","FAIL_CANONICAL_KEY_OR_LOGIC","HOLD_REVIEWER_DISAGREEMENT","PASS_STANDALONE"), reasoning (string), defectSummary (string, empty string if PASS_STANDALONE), missingFactProvenance (array), secondaryFlags (array of strings), advisoryPriority ("P0"|"P1"|"P2"|"P3", only if any collateral issue found, else omit or null), bilingualCollateral (array), clinicalCollateral (array), scopeCollateral (array)${paired ? ', canonicalTargetSiblingOverlap (array covering the 5 keyed labels)' : ""}. No markdown fences, no text outside the JSON object.`;
    const t4 = await lockedTurn({ label, cwd, resumeSessionId: t3.sessionId, prompt: prompt4, validate: (r) => validateFinal(r, paired), logDir, turnName: paired ? "paired-final" : "unpaired-final" });
    writeJson(join(OUT, paired ? "phase-f" : "phase-f", `${label}.json`), t4.review);
    writeLock(label, paired ? "paired-final" : "unpaired-final", t4.reviewSha256, t3.reviewSha256, paired, `audit/campaign-16-phase-d-check-2026-08-29-r2-retry-1/phase-f/${label}.json`);

    const allReceipts = [...t1.receipts, ...t2.receipts, ...t3.receipts, ...t4.receipts];
    return {
      surrogateId: label,
      candidateId: c.candidateId,
      status: "LOCKED",
      finalVerdict: t4.review.primaryVerdict,
      turns: { stage1: t1.reviewSha256, stage2: t2.reviewSha256, standalone: t3.reviewSha256, final: t4.reviewSha256 },
      receipts: allReceipts,
      candidateCostUsd: allReceipts.reduce((s, r) => s + (r.costUsd ?? 0), 0),
    };
  } catch (err: any) {
    log(`${label} BLOCKED: ${err.message}`);
    return { surrogateId: label, candidateId: c.candidateId, status: "BLOCKED", error: String(err.message ?? err) };
  }
}

async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function main() {
  const freeze = readJson(join(OUT, "candidate-freeze.json"));
  const rows = new Map(parseJsonl(join(PRODUCER, "repair-candidates.jsonl")).map((r) => [r.candidateId, r]));
  const companions = new Map(parseJsonl(join(PRODUCER, "stage0-companions.jsonl")).map((r) => [r.candidateId, r.payload]));

  mkdirSync(NEUTRAL_ROOT, { recursive: true });
  const only = process.env.PHASE_D_ONLY ? new Set(process.env.PHASE_D_ONLY.split(",")) : null;
  const candidates = only ? freeze.candidates.filter((c: Obj) => only.has(c.surrogateId)) : freeze.candidates;
  log(`Starting Phase D checker retry semantic run: model=${MODEL} effort=${EFFORT} concurrency=${CONCURRENCY} costCeiling=$${GLOBAL_COST_CEILING_USD} candidates=${candidates.map((c: Obj) => c.surrogateId).join(",")}`);

  const results = await pool(candidates, CONCURRENCY, (c: Obj) =>
    processCandidate(c, rows.get(c.candidateId)!, companions.get(c.candidateId))
  );

  const semanticContexts = results.flatMap((r: Obj) =>
    (r.receipts ?? []).length
      ? [{
          controlId: r.surrogateId,
          agentContextId: r.receipts[0].sessionId,
          model: r.receipts[0].model,
          reasoningEffort: EFFORT,
          isolatedPerCandidate: true,
          forkedPriorContext: false,
          repositoryAccessPermitted: false,
          allTurnsToolsClean: r.receipts.every((x: Obj) => x.toolsClean),
          turnCount: r.receipts.length,
          receiptPaths: r.receipts.map((x: Obj) => x.rawLogPath),
          receiptSha256s: r.receipts.map((x: Obj) => x.rawLogSha256),
          totalCostUsd: r.candidateCostUsd,
          status: r.status,
        }]
      : [{ controlId: r.surrogateId, status: r.status, error: r.error }]
  );
  writeFileSync(join(OUT, "semantic-contexts.jsonl"), semanticContexts.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");

  const summary = {
    generatedAt: "Phase D checker retry R2-retry-1 semantic run",
    model: MODEL,
    effort: EFFORT,
    totalCostUsd: cumulativeCostUsd,
    candidateCount: results.length,
    lockedCount: results.filter((r: Obj) => r.status === "LOCKED").length,
    blockedCount: results.filter((r: Obj) => r.status === "BLOCKED").length,
    passStandaloneCount: results.filter((r: Obj) => r.finalVerdict === "PASS_STANDALONE").length,
    results,
  };
  writeJson(join(OUT, "semantic-run-summary.json"), summary);
  log(`DONE. locked=${summary.lockedCount}/12 blocked=${summary.blockedCount} passStandalone=${summary.passStandaloneCount} totalCost=$${cumulativeCostUsd.toFixed(2)}`);
}

main().catch((e) => { log(`FATAL: ${e.stack ?? e}`); process.exitCode = 1; });
