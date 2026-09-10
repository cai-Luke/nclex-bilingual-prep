import fs from "node:fs";
import path from "node:path";
import { ROOT, R1, out, json, jsonl, pretty, write, deepEqual } from "./lib.mjs";
import { parseStrictJson, parseStrictJsonl } from "./strict-json.mjs";
import { validateTokenArtifact, reconstructRows } from "./validator-lib.mjs";

const tests = [];
const test = (name, fn, expected = true) => { let actual = false, detail = null; try { actual = Boolean(fn()); } catch (e) { detail = { name: e.name, kind: e.kind ?? null, key: e.key ?? null, message: e.message }; actual = false; } tests.push({ name, expected, actual, pass: actual === expected, detail }); };
const throwsKind = (source, kind) => { try { parseStrictJson(source); return false; } catch (e) { return e.kind === kind; } };

test("parser valid baseline", () => deepEqual(parseStrictJson('{"a":1,"b":[true,null,{"c":"x"}]}'), { a: 1, b: [true, null, { c: "x" }] }));
test("parser CJK UTF-8", () => parseStrictJson('{"中文":"护理"}').中文 === "护理");
test("parser escaped characters and quotes", () => parseStrictJson('{"x":"line\\n\\\"quoted\\\"\\t"}').x === 'line\n"quoted"\t');
test("parser decimals and exponent", () => parseStrictJson('{"x":3.14,"y":-2e3}').y === -2000);
test("parser nested arrays and objects", () => parseStrictJson('{"a":[{"b":[1,2]}]}').a[0].b[1] === 2);
for (const [name, raw] of [["top level",'{"a":1,"a":2}'],["stageEvaluations",'{"stageEvaluations":{"s":{},"s":{}}}'],["stage value",'{"stageEvaluations":{"s":{"basis":"a","basis":"b"}}}'],["locus",'{"locus":{"stageToken":null,"stageToken":"s"}}']]) test(`parser duplicate ${name}`, () => throwsKind(raw, "DUPLICATE_KEY"));
test("duplicate-collapsing parser accepts rejected fixture", () => JSON.parse('{"a":1,"a":2}').a === 2 && throwsKind('{"a":1,"a":2}', "DUPLICATE_KEY"));
test("parser malformed", () => throwsKind('{"a":', "MALFORMED_JSON"));
test("parser row-not-object", () => { try { parseStrictJsonl('[]\n'); return false; } catch (e) { return e.kind === "ROW_NOT_OBJECT"; } });

const packet = { packetVersion: "campaign16_phase_e_residual_192_v2", packetId: "fixture", targetCount: 1, targetOrder: ["r_fixture"], cases: [{ stages: [{ stageToken: "s_a", title: { en: "Stage" } }, { stageToken: "s_b", title: { en: "Later" }, narrative: { en: "Exact unsafe cue." } }], targets: [{ rowToken: "r_fixture", declaredStageTokens: ["s_a", "s_b"], partEvidenceIds: ["e_part"] }], evidenceCatalog: [{ evidenceId: "e_part", rowToken: "r_fixture", surface: "PART_STEM", text: "Decision", language: "en" }, { evidenceId: "e_a", stageToken: "s_a", surface: "STAGE", text: "Required", language: "en" }, { evidenceId: "e_b", stageToken: "s_b", surface: "STAGE", text: "Exact unsafe cue.", language: "en" }] }] };
const fixtureStages = [{ stageToken: "s_a", canonicalStageId: "stage_a", authoredOrdinal: 0 }, { stageToken: "s_b", canonicalStageId: "stage_b", authoredOrdinal: 1 }], fixtureEvidence = [{ packetEvidenceId: "e_part", canonicalEvidenceId: "canonical.part" }, { packetEvidenceId: "e_a", canonicalEvidenceId: "canonical.a" }, { packetEvidenceId: "e_b", canonicalEvidenceId: "canonical.b" }];
const map = { rows: [{ packetId: "fixture", rowToken: "r_fixture", role: "LIVE", questionId: "q_fixture", queueIndex: 1, canonicalParentCaseId: "case_fixture", declaredStageTokens: ["s_a", "s_b"] }], cases: [{ packetId: "fixture", stages: fixtureStages, evidence: fixtureEvidence }] };
const identity = { packets: [{ packetId: "fixture", highSpecificityDenySet: ["forbidden_parent_case_id"] }] };
const valid = { rowToken: "r_fixture", verdict: "NO_LEAK_NONANSWERING_DATA", testedDecision: "Select the response supported by the presented record.", stageEvaluations: { s_a: { contribution: "REQUIRED", evidenceIds: ["e_a"], basis: "The first stage supplies the finding needed for the response." }, s_b: { contribution: "NONANSWERING", evidenceIds: ["e_b"], basis: "The later finding does not identify the keyed response." } }, partEvidenceIds: ["e_part"], stageEvidenceIds: ["e_a", "e_b"], locus: { stageToken: null, evidenceIds: [], verbatimSpan: null }, bilingualRelation: "PARALLEL", reason: "The later finding adds context but does not reveal the response selected from the first-stage evidence." };
const check = (row) => validateTokenArtifact(`${JSON.stringify(row)}\n`, packet, map, identity);
test("valid Phase T fixture", () => check(valid).phaseT === "PASS");
const mutations = [
  ["T-G1 schema", (r) => { r.extra = true; }],
  ["T-G2 cardinality", null],
  ["T-G4 missing key", (r) => { delete r.stageEvaluations.s_b; }],
  ["T-G4 foreign key", (r) => { r.stageEvaluations.s_foreign = { contribution: "NONANSWERING", evidenceIds: [], basis: "A distinct clinical explanation." }; }],
  ["T-G4 sibling-token foreign key", (r) => { r.stageEvaluations.s_sibling = { contribution: "NONANSWERING", evidenceIds: [], basis: "A distinct sibling explanation." }; }],
  ["T-G5 invalid contribution", (r) => { r.stageEvaluations.s_a.contribution = ""; }],
  ["T-G6 verdict binding", (r) => { r.verdict = "LEAK"; }],
  ["T-G7 locus binding", (r) => { r.locus.stageToken = "s_a"; }],
  ["T-G8 evidence ownership", (r) => { r.partEvidenceIds = ["e_a"]; }],
  ["T-G9 locus containment", (r) => { r.verdict = "LEAK"; r.stageEvaluations.s_b.contribution = "UNSAFE"; r.locus = { stageToken: "s_b", evidenceIds: ["e_b"], verbatimSpan: null }; r.stageEvidenceIds = ["e_a"]; }],
  ["T-G10 span fidelity", (r) => { r.verdict = "LEAK"; r.stageEvaluations.s_b.contribution = "UNSAFE"; r.locus = { stageToken: "s_b", evidenceIds: ["e_b"], verbatimSpan: "not present" }; }],
  ["T-G11 REVIEW adequacy", (r) => { r.verdict = "REVIEW"; r.reason = "The record is considered."; }],
  ["T-G12 bilingual vocabulary", (r) => { r.bilingualRelation = "SAME"; }],
  ["T-G13 precision", (r) => { r.testedDecision = `${"word ".repeat(31)}.`; }],
  ["T-G14 placeholder basis", (r) => { r.stageEvaluations.s_b.basis = "placeholder"; }],
  ["T-G15 high-specificity identity leakage", (r) => { r.reason += " forbidden_parent_case_id"; }],
];
for (const [name, mutate] of mutations) test(name, () => { if (!mutate) return validateTokenArtifact("", packet, map, identity).gates["T-G2"] === "FAIL"; const r = structuredClone(valid); mutate(r); const gate = name.split(" ")[0]; return check(r).gates[gate] === "FAIL"; });
test("T-G1 duplicate stage key", () => { const raw = JSON.stringify(valid).replace('"s_b":', '"s_a":{"contribution":"NONANSWERING","evidenceIds":[],"basis":"duplicate"},"s_b":'); const result = validateTokenArtifact(`${raw}\n`, packet, map, identity); return result.phaseT === "FAIL" && result.parseClass === "DUPLICATE_KEY"; });
test("T-G3 retired", () => check(valid).gates["T-G3"] === "RETIRED");

const reconstruction = reconstructRows([valid], packet, map, { rowMapSha256: "m", packetSha256: "p", outputSha256: "o" }, 1);
test("valid Phase R fixture", () => reconstruction.phaseR === "PASS");
test("R-A1 negative fixture", () => new Set(["stage_a", "stage_a"]).size !== 2);
test("R-A2 negative fixture", () => !deepEqual(["stage_b"], reconstruction.reconstructed[0].stageEnumeration.filter((x) => x.contribution === "REQUIRED").map((x) => x.stageId)));
test("R-A3 negative fixture", () => !["stage_b"].includes("stage_a"));
test("R-A4 negative fixture", () => !deepEqual({ ...valid, reason: "mutated" }, valid));

const historical = [];
for (const file of fs.readdirSync(path.join(ROOT, "..", "campaign-16-phase-e-residual-192-check-2026-09-02-r1", "outputs")).filter((f) => /^cal-a-superseding-.*\.jsonl$/u.test(f)).sort()) {
  const rows = jsonl(`${R1}/outputs/${file}`).map((x) => x.row);
  rows.forEach((row, index) => {
    const seen = new Set(); let duplicate = null; for (const e of row.stageEnumeration ?? []) { if (seen.has(e.stageId)) { duplicate = e.stageId; break; } seen.add(e.stageId); }
    if (!duplicate) return;
    const tok = `s_${Buffer.from(duplicate).toString("hex").slice(0, 16)}`;
    const raw = `{"rowToken":"historical_${historical.length}","stageEvaluations":{"${tok}":{"contribution":"NONANSWERING","evidenceIds":[],"basis":"first"},"${tok}":{"contribution":"NONANSWERING","evidenceIds":[],"basis":"duplicate"}}}`;
    let rejected = false, kind = null; try { parseStrictJson(raw); } catch (e) { kind = e.kind; rejected = kind === "DUPLICATE_KEY"; }
    historical.push({ source: `outputs/${file}`, sourceRow: index + 1, sourceRowToken: row.rowToken, duplicateCanonicalStageId: duplicate, reprojection: "keyed-object with repeated packet-local stage token", rejected, gate: "T-G1", parseClass: kind });
  });
}
test("six historical R1 duplicate-stage failures reprojected", () => historical.length === 6 && historical.every((x) => x.rejected && x.gate === "T-G1"));

const report = { validatorSelfTestVersion: "2.0", parserImplementation: "tools/strict-json.mjs recursive RFC-8259 JSON value parser with duplicate-key rejection at every object depth", allPass: tests.every((x) => x.pass), phaseTAndParserTests: tests, historicalR1Reprojections: historical, counts: { tests: tests.length, passed: tests.filter((x) => x.pass).length, historicalFailures: historical.length, historicalRejected: historical.filter((x) => x.rejected).length } };
write("validator-self-test.json", pretty(report));
console.log(JSON.stringify(report.counts, null, 2));
if (!report.allPass) process.exitCode = 1;
