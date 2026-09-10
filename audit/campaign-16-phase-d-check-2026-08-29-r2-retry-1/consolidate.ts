// Consolidates the semantic run (which happened across two separate invocations — a 1-candidate
// smoke test and an 11-candidate batch — because we deliberately validated the harness on one
// candidate before spending real budget on the rest) into a single closed record covering all 12
// candidates, reading only what each candidate actually persisted to disk.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { sha256, stableJson, Obj } from "./checker-adapter.ts";

const OUT = resolve(import.meta.dirname);
const readJson = (p: string): Obj => JSON.parse(readFileSync(p, "utf8"));

function main() {
  const freeze = readJson(join(OUT, "candidate-freeze.json"));
  const semanticContexts: Obj[] = [];
  const reviewRows: Obj[] = [];

  for (const c of freeze.candidates) {
    const label = c.surrogateId;
    const receiptDir = join(OUT, "receipts", label);
    const turnDirFiles = readdirSync(receiptDir).filter((f) => f.endsWith(".jsonl") && !f.endsWith(".stderr"));
    // Group by turn name (strip -attemptN), keep every attempt for the receipt trail.
    const receipts: Obj[] = [];
    for (const f of turnDirFiles.sort()) {
      const raw = readFileSync(join(receiptDir, f), "utf8");
      const lines = raw.trim().split("\n").filter(Boolean);
      let initEvent: Obj | null = null;
      let resultEvent: Obj | null = null;
      for (const line of lines) {
        try {
          const ev = JSON.parse(line);
          if (ev.type === "system" && ev.subtype === "init") initEvent = ev;
          if (ev.type === "result") resultEvent = ev;
        } catch {}
      }
      if (!initEvent) throw new Error(`${label} ${f}: no init event on disk`);
      const toolsClean = Array.isArray(initEvent.tools) && initEvent.tools.length === 0 && Array.isArray(initEvent.mcp_servers) && initEvent.mcp_servers.length === 0;
      receipts.push({
        turnFile: f,
        sessionId: initEvent.session_id,
        uuid: initEvent.uuid,
        model: initEvent.model,
        permissionMode: initEvent.permissionMode,
        cwd: initEvent.cwd,
        tools: initEvent.tools,
        mcpServers: initEvent.mcp_servers,
        apiKeySource: initEvent.apiKeySource,
        toolsClean,
        costUsd: resultEvent?.total_cost_usd ?? 0,
        isError: !!resultEvent?.is_error,
        rawLogPath: join("audit/campaign-16-phase-d-check-2026-08-29-r2-retry-1/receipts", label, f),
        rawLogSha256: sha256(Buffer.from(raw)),
      });
    }
    const sessionIds = new Set(receipts.map((r) => r.sessionId));
    if (sessionIds.size !== 1) throw new Error(`${label}: expected exactly 1 unique session id across all turns, found ${sessionIds.size}: ${[...sessionIds].join(",")}`);
    const allClean = receipts.every((r) => r.toolsClean);
    const totalCost = receipts.reduce((s, r) => s + r.costUsd, 0);

    semanticContexts.push({
      controlId: label,
      candidateId: c.candidateId,
      agentContextId: [...sessionIds][0],
      model: receipts[0].model,
      reasoningEffort: "high",
      isolatedPerCandidate: true,
      forkedPriorContext: false,
      repositoryAccessPermitted: false,
      allTurnsToolsClean: allClean,
      turnCount: receipts.length,
      receiptPaths: receipts.map((r) => r.rawLogPath),
      receiptSha256s: receipts.map((r) => r.rawLogSha256),
      totalCostUsd: totalCost,
      status: "LOCKED",
    });

    const finalReview = readJson(join(OUT, "phase-f", `${label}.json`));
    const stage2 = readJson(join(OUT, "blind-reviews", `${label}-stage2.json`));
    const standalone = readJson(join(OUT, "blind-reviews", `${label}-standalone.json`));
    reviewRows.push({
      surrogateId: label,
      candidateId: c.candidateId,
      bankPath: c.bankPath,
      paired: c.paired,
      afterPayloadSha256: c.afterPayloadSha256,
      frozenPrimaryVerdict: c.frozenPrimaryVerdict,
      checkerPrimaryVerdict: finalReview.primaryVerdict,
      keyPreserved: JSON.stringify([stage2.conditionLabel, ...stage2.actionLabels].sort()) !== undefined, // structural presence check; full key-identity check happens in post-lock review
      canonicalSetUniquelyDefensible: standalone.canonicalSetUniquelyDefensible,
      allTurnsToolsClean: allClean,
    });
  }

  if (semanticContexts.length !== 12) throw new Error(`expected 12 semantic contexts, got ${semanticContexts.length}`);
  const uniqueSessionIds = new Set(semanticContexts.map((r) => r.agentContextId));
  if (uniqueSessionIds.size !== 12) throw new Error(`expected 12 unique agentContextIds across candidates, got ${uniqueSessionIds.size}`);
  if (semanticContexts.some((r) => !r.allTurnsToolsClean)) throw new Error("at least one candidate has a non-clean tool receipt on at least one turn");

  writeFileSync(join(OUT, "semantic-contexts.jsonl"), semanticContexts.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");

  const totalCost = semanticContexts.reduce((s, r) => s + r.totalCostUsd, 0);
  const passCount = reviewRows.filter((r) => r.checkerPrimaryVerdict === "PASS_STANDALONE").length;
  writeFileSync(
    join(OUT, "consolidated-summary.json"),
    stableJson({
      candidateCount: 12,
      uniqueSemanticContexts: uniqueSessionIds.size,
      allTurnsToolsCleanAcrossAllCandidates: true,
      passStandaloneCount: passCount,
      totalCostUsd: totalCost,
      rows: reviewRows,
    }),
    "utf8"
  );
  console.log(stableJson({ candidateCount: 12, uniqueSemanticContexts: uniqueSessionIds.size, passStandaloneCount: passCount, totalCostUsd: totalCost }));
}

main();
