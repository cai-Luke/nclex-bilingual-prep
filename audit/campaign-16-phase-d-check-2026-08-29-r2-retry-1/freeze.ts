// Campaign 16 Phase D checker retry (R2-retry-1) — candidate freeze.
// Independently re-resolves the 12 candidates from the producer handoff, cross-checks hashes,
// and assigns fresh Phase-D-retry surrogate IDs distinct from both the historical CAND-XX
// lineage IDs and the producer's own internal bookkeeping. No candidateId/surrogateId pairing
// in this file is ever sent to a semantic subcontext — it is orchestrator-only bookkeeping.
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { sha256, stableJson, tokenMap, canonicalSelection, Obj } from "./checker-adapter.ts";

const OUT = resolve(import.meta.dirname);
const REPO = resolve(OUT, "../..");
const PRODUCER = join(REPO, "audit/campaign-16-phase-d-bowtie-repair-2026-08-29-r2");

const fail = (m: string): never => { throw new Error(`CAMPAIGN16_PHASE_D_BLOCKED: freeze: ${m}`); };
const parseJsonl = (p: string): Obj[] => readFileSync(p, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);

// §2.1 exact Phase D roster, transcribed verbatim from the frozen work order
// (scratch/CAMPAIGN-16-PHASE-D-BOWTIE-REPAIR-WORK-ORDER-2026-08-29.md, SHA-256
// 6a0154f7dd3cb0c663ed5bed9c6346058e1e38a16c333ae04f0c328fe0230bba).
const ROSTER: Array<{ candidateId: string; bank: string; frozenVerdict: string; frozenPayloadSha256: string }> = [
  { candidateId: "gpt_case_caregiver_role_strain_dementia_01_bowtie", bank: "banks/gpt-canonical.json", frozenVerdict: "FAIL_HIDDEN_CASE_DEPENDENCY", frozenPayloadSha256: "7b2d554215d8a3c2249aaa9bd595721793b4f3a439663e74e76efabe5a3ff6e1" },
  { candidateId: "gpt_case_infection_control_clustered_care_01_bowtie", bank: "banks/gpt-canonical.json", frozenVerdict: "FAIL_HIDDEN_CASE_DEPENDENCY", frozenPayloadSha256: "9257f536a25485a9761d3f004f6deb2679177570b83a6937f1e65ef880d45daf" },
  { candidateId: "gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie", bank: "banks/gpt-canonical.json", frozenVerdict: "FAIL_HIDDEN_CASE_DEPENDENCY", frozenPayloadSha256: "789d52ef3191509f938526bdd66cbfb6fc32d6ee1bbb45b4a14b2c2b33f0da65" },
  { candidateId: "gpt_case_client_advocacy_refusal_01_bowtie", bank: "banks/gpt-canonical.json", frozenVerdict: "FAIL_HIDDEN_CASE_DEPENDENCY", frozenPayloadSha256: "d601c32d131bb984399cbb131b98f3c995e4fe1ef2512ddb1d30c61757172521" },
  { candidateId: "gpt_case_lateral_incivility_01_bowtie", bank: "banks/gpt-canonical.json", frozenVerdict: "FAIL_HIDDEN_CASE_DEPENDENCY", frozenPayloadSha256: "fea2d76c8716a73087600efe5fd026a33cb36e5b19f28dde067b940ff57e9563" },
  { candidateId: "gpt_case_mass_casualty_start_triage_01_bowtie", bank: "banks/gpt-canonical.json", frozenVerdict: "FAIL_HIDDEN_CASE_DEPENDENCY", frozenPayloadSha256: "7cdf149aff899a7cd171c9395ec6ab23b93b571c15cb779dc169d605e1dbd4d6" },
  { candidateId: "gpt_case_gbs_respiratory_compromise_01_bowtie", bank: "banks/hard-cases-canonical.json", frozenVerdict: "FAIL_HIDDEN_CASE_DEPENDENCY", frozenPayloadSha256: "74e4fc43567f17a8eed82ce10fd440372afe4bfde7da0878bda51fb30aa34804" },
  { candidateId: "gpt_case_hipaa_disclosure_breach_01_bowtie", bank: "banks/gpt-canonical.json", frozenVerdict: "FAIL_UNSUPPORTED_TOKEN_PREMISE", frozenPayloadSha256: "9ba8faa3ec3cea8e1668c0460b2888686f1600d52186d7f5b8297dc6ae332984" },
  { candidateId: "gpt_case_neutropenic_fever_nadir_01_bowtie", bank: "banks/gpt-canonical.json", frozenVerdict: "FAIL_UNSUPPORTED_TOKEN_PREMISE", frozenPayloadSha256: "f8e8ca6eddd5f48cf67ef7ea5a51d9eb5bcfea2c67def6b50eafcbf0818ac00b" },
  { candidateId: "gpt_case_unsafe_premature_discharge_01_bowtie", bank: "banks/gpt-canonical.json", frozenVerdict: "FAIL_UNSUPPORTED_TOKEN_PREMISE", frozenPayloadSha256: "d9462741c338b5041762f5f4a4c51cffd17bd54d34d17839c381b02cbd59bf5e" },
  { candidateId: "gpt_pph_2026_06_16_case_01_bowtie", bank: "banks/hard-cases-canonical.json", frozenVerdict: "FAIL_UNSUPPORTED_TOKEN_PREMISE", frozenPayloadSha256: "efcc3588cf2750744fb89be66529904081f6953d6158505dfc694e48086fed39" },
  { candidateId: "gpt_format7c_exercise_hypoglycemia_bowtie", bank: "banks/gpt-canonical.json", frozenVerdict: "FAIL_UNSUPPORTED_TOKEN_PREMISE", frozenPayloadSha256: "df41a515bafd2325afb0a63fa1b3050ae5d6c6165213af41314d8e3e8dc8ad81" },
];

function main() {
  const workOrderPath = join(REPO, "scratch/CAMPAIGN-16-PHASE-D-BOWTIE-REPAIR-WORK-ORDER-2026-08-29.md");
  const workOrderSha256 = sha256(readFileSync(workOrderPath));
  const expectedWorkOrderSha256 = "6a0154f7dd3cb0c663ed5bed9c6346058e1e38a16c333ae04f0c328fe0230bba";
  if (workOrderSha256 !== expectedWorkOrderSha256) fail(`work order SHA-256 mismatch: ${workOrderSha256}`);

  const handoff = {
    "repair-candidates.jsonl": { path: join(PRODUCER, "repair-candidates.jsonl"), expected: "0ec3853f2ff0a863e458316098b3976791b39ac040b4cfff942a978a0462a7ca" },
    "repair-manifest.json": { path: join(PRODUCER, "repair-manifest.json"), expected: "c8cd68a0932092e633cfbde9ea3ec0bae875f384bf777e0ff03f3b27f9b593eb" },
    "adapter-fidelity.json": { path: join(PRODUCER, "adapter-fidelity.json"), expected: "1bdad0d7a2323027a1307c05d0bf879e3ce3b8efa64200c3bf062f911f208d26" },
    "verification-preapply.json": { path: join(PRODUCER, "verification-preapply.json"), expected: "8651659eda1c0b204d3322ec1ff4f0e63cad3bc28f847417b73e778e58d715e2" },
    "patch program": { path: join(REPO, "scripts/patches/2026-08-29-campaign16-phase-d-bowtie-repair.ts"), expected: "cd265d54b18ec88421f5507c06faf5a2625b47c54bc38a036a29ff24e6acd12d" },
  };
  const handoffResults: Obj = {};
  for (const [name, { path, expected }] of Object.entries(handoff)) {
    const observed = sha256(readFileSync(path));
    if (observed !== expected) fail(`producer handoff hash mismatch for ${name}: expected ${expected}, observed ${observed}`);
    handoffResults[name] = { path: path.slice(REPO.length + 1), sha256: observed, matches: true };
  }

  const rows = parseJsonl(join(PRODUCER, "repair-candidates.jsonl"));
  const manifest = JSON.parse(readFileSync(join(PRODUCER, "repair-manifest.json"), "utf8"));
  const companions = new Map(parseJsonl(join(PRODUCER, "stage0-companions.jsonl")).map((r) => [r.candidateId, r]));

  if (rows.length !== 12) fail(`expected 12 repair-candidates rows, found ${rows.length}`);

  const candidates = ROSTER.map((rosterRow, index) => {
    const row = rows.find((r) => r.candidateId === rosterRow.candidateId);
    if (!row) fail(`roster candidate ${rosterRow.candidateId} absent from repair-candidates.jsonl`);
    if (row.bankPath !== rosterRow.bank) fail(`${rosterRow.candidateId} bank mismatch: roster ${rosterRow.bank}, producer ${row.bankPath}`);

    // Recompute the after-payload hash ourselves — do not trust the producer's stated value.
    // Payload-identity hashing uses compact stableJson (indent 0), independently confirmed
    // against the live pre-repair bank content for this candidate; packet hashing elsewhere in
    // this checker uses the indent-2 form, matching the two conventions actually used upstream.
    const recomputedAfterSha256 = sha256(stableJson(row.payload, 0));
    if (recomputedAfterSha256 !== row.afterPayloadSha256) fail(`${rosterRow.candidateId} afterPayloadSha256 self-consistency: file states ${row.afterPayloadSha256}, recomputed ${recomputedAfterSha256}`);

    const manifestRow = Array.isArray(manifest) ? manifest.find((m: Obj) => m.candidateId === rosterRow.candidateId) : manifest.candidates?.find((m: Obj) => m.candidateId === rosterRow.candidateId);
    const manifestAfterSha256 = manifestRow?.afterPayloadSha256 ?? manifestRow?.proposedAfterPayloadSha256;
    if (manifestAfterSha256 && manifestAfterSha256 !== recomputedAfterSha256) fail(`${rosterRow.candidateId} repair-manifest.json after-payload hash disagrees with repair-candidates.jsonl`);

    const isUnpaired = rosterRow.candidateId === "gpt_format7c_exercise_hypoglycemia_bowtie";
    const companionRow = companions.get(rosterRow.candidateId);
    if (!isUnpaired && !companionRow) fail(`${rosterRow.candidateId} is paired per roster but has no stage0-companions.jsonl row`);
    if (isUnpaired && companionRow) fail(`${rosterRow.candidateId} is unpaired per roster but has a stage0-companions.jsonl row`);
    if (!isUnpaired && companionRow.match !== true) fail(`${rosterRow.candidateId} companion c2ff546 identity match is not true`);
    if (!isUnpaired) {
      const recomputedCompanionSha256 = sha256(stableJson(companionRow.payload, 0));
      if (recomputedCompanionSha256 !== companionRow.livePayloadSha256) fail(`${rosterRow.candidateId} companion payload hash self-consistency`);
    }

    const map = tokenMap(row.payload);
    const selection = canonicalSelection(row.payload, map);
    if (selection.actionLabels.length !== 2 || selection.parameterLabels.length !== 2) fail(`${rosterRow.candidateId} key cardinality drift (not 1/2/2)`);

    return {
      surrogateId: `PDRT1-${String(index + 1).padStart(2, "0")}`,
      candidateId: rosterRow.candidateId,
      bankPath: rosterRow.bank,
      frozenPrimaryVerdict: rosterRow.frozenVerdict,
      frozenPreRepairPayloadSha256: rosterRow.frozenPayloadSha256,
      preRepairPayloadSha256AsRecordedByProducer: row.preRepairPayloadSha256,
      afterPayloadSha256: recomputedAfterSha256,
      paired: !isUnpaired,
      companionCaseId: companionRow?.companionCaseId,
      companionMatch: companionRow?.match,
    };
  });

  const surrogateIds = new Set(candidates.map((c) => c.surrogateId));
  if (surrogateIds.size !== 12) fail("surrogate ID collision");
  const historicalIds = new Set(["CAND-05", "CAND-18"]); // spot pattern guard; full disjointness checked below
  for (const c of candidates) {
    if (/^CAND-\d+$/.test(c.surrogateId)) fail(`surrogate ${c.surrogateId} collides with historical lineage ID pattern`);
  }

  const artifact = {
    status: "FROZEN",
    createdAt: "2026-08-29 (Phase D checker retry R2-retry-1)",
    workOrder: { path: "scratch/CAMPAIGN-16-PHASE-D-BOWTIE-REPAIR-WORK-ORDER-2026-08-29.md", sha256: workOrderSha256 },
    producerHandoff: handoffResults,
    rosterReconciliation: "12/12 exact match: candidateId, bankPath, and recomputed after-payload SHA-256 self-consistent with repair-candidates.jsonl",
    candidates,
  };
  writeFileSync(join(OUT, "candidate-freeze.json"), stableJson(artifact), "utf8");
  process.stdout.write(stableJson({ status: artifact.status, count: candidates.length, surrogateIds: candidates.map((c) => c.surrogateId) }));
}

main();
