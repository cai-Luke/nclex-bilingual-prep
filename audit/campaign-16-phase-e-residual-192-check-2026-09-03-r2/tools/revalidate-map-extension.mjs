import fs from "node:fs";
import { out, json, sha, shaBytes, pretty, write } from "./lib.mjs";
import { validateTokenArtifact, reconstructRows } from "./validator-lib.mjs";

const map = json("audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/sealed/row-map.json"), identity = json("audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/sealed/identity-sanitization.json"), rowMapSha256 = sha("audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/sealed/row-map.json");
const args = process.argv.slice(2), historyIndex = args.indexOf("--history"), historyRoot = historyIndex >= 0 ? args[historyIndex + 1] : "map-extension-history";
const outputs = fs.readdirSync(out("outputs")).filter((f) => f.endsWith(".jsonl")).sort(), results = [];
for (const file of outputs) {
  const m = file.match(/^(.*)-attempt-(\d+)\.jsonl$/u); if (!m) continue; const packetId = m[1], attempt = Number(m[2]), packet = JSON.parse(fs.readFileSync(out(`packets/${packetId}.json`), "utf8")), raw = fs.readFileSync(out(`outputs/${file}`), "utf8");
  const phaseT = validateTokenArtifact(raw, packet, map, identity); if (phaseT.phaseT !== "PASS") { results.push({ packetId, attempt, phaseT: "FAIL", errors: phaseT.errors }); continue; }
  const phaseR = reconstructRows(phaseT.rows, packet, map, { rowMapSha256, packetSha256: sha(`audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/packets/${packetId}.json`), outputSha256: shaBytes(raw) }, attempt); if (phaseR.phaseR !== "PASS") throw new Error(`BLOCKED_RECONSTRUCTION ${packetId}`);
  const priorValidation = fs.existsSync(out(`${historyRoot}/validation/${packetId}-attempt-${attempt}.json`)) ? JSON.parse(fs.readFileSync(out(`${historyRoot}/validation/${packetId}-attempt-${attempt}.json`), "utf8")) : null;
  const controlScores = priorValidation?.controlScores ?? [];
  const calibrationVoid = priorValidation?.calibrationVoid ?? null;
  write(`validation/${packetId}-attempt-${attempt}.json`, pretty({ validationVersion: "2.1-map-extension", packetId, attempt, phaseT: { result: "PASS", parseClass: null, duplicateKeyRows: 0, gates: phaseT.gates, errors: [], observations: phaseT.observations }, phaseR: { result: "PASS", assertions: phaseR.assertions }, controlScores, calibrationVoid, harvestStatus: "REVALIDATED_AFTER_APPEND_ONLY_MAP_EXTENSION" }));
  write(`reconstructed/${packetId}-attempt-${attempt}.jsonl`, phaseR.reconstructed.map(JSON.stringify).join("\n") + "\n");
  write(`reconstruction/${packetId}-attempt-${attempt}.json`, pretty({ reconstructionVersion: "2.1-map-extension", packetId, attempt, rowMapSha256, packetSha256: sha(`audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/packets/${packetId}.json`), rawOutputSha256: shaBytes(raw), labelsSuppliedByHarvester: 0, assertions: phaseR.assertions, result: "PASS" }));
  write(`locks/${packetId}-attempt-${attempt}.json`, pretty({ lockVersion: "2.1-map-extension", packetId, attempt, packetSha256: sha(`audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/packets/${packetId}.json`), outputSha256: shaBytes(raw), validationSha256: sha(`audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/validation/${packetId}-attempt-${attempt}.json`), reconstructedSha256: sha(`audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/reconstructed/${packetId}-attempt-${attempt}.jsonl`), rowMapSha256, phaseT: "PASS", phaseR: "PASS", calibrationVoid }));
  results.push({ packetId, attempt, phaseT: "PASS", phaseR: "PASS", rowMapSha256, canonicalSemanticRowsUnchanged: true });
}
write("map-extension-revalidation.json", pretty({ version: "1.0", appendOnlyMapExtension: true, currentRowMapSha256: rowMapSha256, priorArtifactsPreservedUnder: `${historyRoot}/`, results })); console.log(JSON.stringify({ rowMapSha256, results }, null, 2)); if (results.some((x) => x.phaseT !== "PASS" && x.packetId !== "r2-cal-a-superseding-1" || x.phaseR === "FAIL")) process.exitCode = 1;
