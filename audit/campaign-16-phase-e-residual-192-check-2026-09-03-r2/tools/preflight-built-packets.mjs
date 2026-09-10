import fs from "node:fs";
import { out, json, sha, shaBytes, pretty, write } from "./lib.mjs";
import { validateTokenArtifact, reconstructRows } from "./validator-lib.mjs";

const index = json("audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/packet-index.json"), map = json("audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/sealed/row-map.json"), identity = json("audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/sealed/identity-sanitization.json");
const results = [];
for (const item of index.packets) {
  const packet = JSON.parse(fs.readFileSync(out(item.path), "utf8")), caseByRow = new Map();
  for (const c of packet.cases) for (const t of c.targets) caseByRow.set(t.rowToken, c);
  const rows = packet.targetOrder.map((rowToken, ri) => {
    const c = caseByRow.get(rowToken), t = c.targets.find((x) => x.rowToken === rowToken), declared = t.declaredStageTokens;
    const stageEvaluations = {};
    for (const [si, st] of declared.entries()) { const ids = c.evidenceCatalog.filter((e) => e.stageToken === st).map((e) => e.evidenceId); if (!ids.length) throw new Error(`no stage evidence ${item.packetId}/${rowToken}/${st}`); stageEvaluations[st] = { contribution: "NONANSWERING", evidenceIds: [], basis: `Fixture ${ri + 1} stage ${si + 1} carries no synthetic unsafe contribution.` }; }
    const partEvidenceIds = c.evidenceCatalog.filter((e) => e.rowToken === rowToken).map((e) => e.evidenceId).slice(0, 1); if (!partEvidenceIds.length) throw new Error(`no part evidence ${item.packetId}/${rowToken}`);
    const stageEvidenceIds = declared.flatMap((st) => c.evidenceCatalog.filter((e) => e.stageToken === st).map((e) => e.evidenceId).slice(0, 1)).slice(0, 8);
    return { rowToken, verdict: "NO_LEAK_NONANSWERING_DATA", testedDecision: `Evaluate synthetic target ${ri + 1} from its presented evidence.`, stageEvaluations, partEvidenceIds, stageEvidenceIds, locus: { stageToken: null, evidenceIds: [], verbatimSpan: null }, bilingualRelation: "PARALLEL", reason: `Synthetic preflight row ${ri + 1} verifies token ownership and lossless reconstruction without supplying a semantic disposition.` };
  });
  const raw = rows.map(JSON.stringify).join("\n") + "\n", phaseT = validateTokenArtifact(raw, packet, map, identity);
  if (phaseT.phaseT !== "PASS") throw new Error(`preflight Phase T failed ${item.packetId}: ${JSON.stringify(phaseT.errors)}`);
  const phaseR = reconstructRows(rows, packet, map, { rowMapSha256: sha("audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/sealed/row-map.json"), packetSha256: sha(`audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/${item.path}`), outputSha256: shaBytes(raw) }, 0);
  if (phaseR.phaseR !== "PASS") throw new Error(`preflight Phase R failed ${item.packetId}`);
  write(`fixtures/${item.packetId}-valid-synthetic.jsonl`, raw);
  results.push({ packetId: item.packetId, rows: rows.length, phaseT: phaseT.phaseT, gates: phaseT.gates, phaseR: phaseR.phaseR, assertions: phaseR.assertions, labelsSuppliedByHarvester: 0 });
}
const report = { preflightVersion: "2.0", result: "PASS", note: "Synthetic rows test mechanics only and are not semantic judgments or admissible outputs.", results };
write("deterministic-preflight.json", pretty(report)); console.log(JSON.stringify(report, null, 2));
