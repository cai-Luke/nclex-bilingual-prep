import fs from "node:fs";
import { ROOT, out, json, sha, shaBytes, pretty, write } from "./lib.mjs";
import { validateTokenArtifact, reconstructRows } from "./validator-lib.mjs";

const args = process.argv.slice(2), p = args.indexOf("--packet"), a = args.indexOf("--attempt");
if (p < 0 || a < 0) throw new Error("usage: validate-output.mjs --packet <id> --attempt <n>");
const packetId = args[p + 1], attempt = Number(args[a + 1]);
const packet = JSON.parse(fs.readFileSync(out(`packets/${packetId}.json`), "utf8")), raw = fs.readFileSync(out(`outputs/${packetId}-attempt-${attempt}.jsonl`), "utf8");
const rowMap = json("audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/sealed/row-map.json"), identity = json("audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/sealed/identity-sanitization.json");
const phaseT = validateTokenArtifact(raw, packet, rowMap, identity);
let phaseR = null;
if (phaseT.phaseT === "PASS") phaseR = reconstructRows(phaseT.rows, packet, rowMap, { rowMapSha256: sha("audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/sealed/row-map.json"), packetSha256: sha(`audit/campaign-16-phase-e-residual-192-check-2026-09-03-r2/packets/${packetId}.json`), outputSha256: shaBytes(raw) }, attempt);
const receipt = { validationVersion: "2.0", packetId, attempt, phaseT: { result: phaseT.phaseT, parseClass: phaseT.parseClass, duplicateKeyRows: phaseT.duplicateKeyRows, gates: phaseT.gates, errors: phaseT.errors, observations: phaseT.observations ?? null }, phaseR: phaseR ? { result: phaseR.phaseR, assertions: phaseR.assertions } : { result: "NOT_RUN", assertions: {} } };
write(`validation/${packetId}-attempt-${attempt}.json`, pretty(receipt));
if (phaseR) { write(`reconstructed/${packetId}-attempt-${attempt}.jsonl`, phaseR.reconstructed.map(JSON.stringify).join("\n") + "\n"); write(`reconstruction/${packetId}-attempt-${attempt}.json`, pretty({ reconstructionVersion: "2.0", packetId, attempt, rowMapSha256: phaseR.reconstructed[0]?.reconstruction.rowMapSha256, packetSha256: phaseR.reconstructed[0]?.reconstruction.packetSha256, rawOutputSha256: phaseR.reconstructed[0]?.reconstruction.outputSha256, labelsSuppliedByHarvester: 0, assertions: phaseR.assertions, result: phaseR.phaseR })); }
console.log(JSON.stringify(receipt, null, 2));
if (phaseT.phaseT !== "PASS" || phaseR?.phaseR !== "PASS") process.exitCode = 1;
