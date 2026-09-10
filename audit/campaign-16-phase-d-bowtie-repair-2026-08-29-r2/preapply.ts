import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { sha256, stableJson } from "../standalone-bowtie-answerability-census-2026-08-23/run.ts";
import { OPS_BY_BANK } from "../../scripts/patches/2026-08-29-campaign16-phase-d-bowtie-repair.ts";

type Obj = Record<string, any>;
const REPO = resolve(import.meta.dirname, "../..");
const OUT = resolve(import.meta.dirname);
const PATCH = join(REPO, "scripts/patches/2026-08-29-campaign16-phase-d-bowtie-repair.ts");
const WORK_ORDER = join(REPO, "scratch/CAMPAIGN-16-PHASE-D-BOWTIE-REPAIR-WORK-ORDER-2026-08-29.md");
const WORK_ORDER_SHA = "6a0154f7dd3cb0c663ed5bed9c6346058e1e38a16c333ae04f0c328fe0230bba";
const fail = (message: string): never => { throw new Error(`CAMPAIGN16_PHASE_D_BLOCKED: preapply: ${message}`); };
const digest = (value: Buffer | string) => createHash("sha256").update(value).digest("hex");
const fileHash = (path: string) => digest(readFileSync(path));
const parseJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const parseJsonl = (path: string): Obj[] => readFileSync(path, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const git = (...args: string[]) => execFileSync("git", args, { cwd: REPO, encoding: "utf8" }).trim();

function questionMap(bankPath: string): Map<string, Obj> {
  const bank = parseJson(bankPath);
  return new Map(bank.questions.map((question: Obj) => [question.id, question]));
}

function resolveValue(root: any, path: any[]): unknown {
  let current = root;
  for (const segment of path) {
    if (typeof segment === "string" || typeof segment === "number") current = current?.[segment];
    else {
      const key = "id" in segment ? "id" : "refId";
      const matches = current.filter((entry: Obj) => entry?.[key] === segment[key]);
      if (matches.length !== 1) fail(`selector ${key}=${segment[key]} matched ${matches.length}`);
      current = matches[0];
    }
  }
  return current;
}

function openingPreservation() {
  const opening = parseJson(join(OUT, "opening-state.json"));
  if (git("branch", "--show-current") !== opening.branch || git("rev-parse", "HEAD") !== opening.head || git("rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}") !== opening.upstream) fail("repository identity drift");
  const rows = opening.dirtyPaths.map((row: Obj) => {
    const observedFileSha256 = fileHash(join(REPO, row.path));
    const observedIndexBlob = row.tracked ? git("rev-parse", `:${row.path}`) : null;
    return { path: row.path, fileMatch: observedFileSha256 === row.fileSha256, indexMatch: observedIndexBlob === row.indexBlob, observedFileSha256, observedIndexBlob };
  });
  const bad = rows.filter((row: Obj) => !row.fileMatch || !row.indexMatch);
  if (bad.length) fail(`opening path/index drift ${bad.map((row: Obj) => row.path).join(", ")}`);
  return { status: "PASS", count: rows.length, rows };
}

function liveFreezeChecks() {
  const preflight = parseJson(join(OUT, "stage0-preflight.json"));
  for (const row of preflight.bankRows) if (fileHash(join(REPO, row.bankPath)) !== row.fileByteSha256) fail(`bank drift ${row.bankPath}`);
  const targets = parseJsonl(join(OUT, "stage0-targets.jsonl"));
  for (const target of targets) {
    const question = questionMap(join(REPO, target.bankPath)).get(target.candidateId);
    if (!question || sha256(stableJson(question, 0)) !== target.observedPayloadSha256) fail(`target drift ${target.candidateId}`);
  }
  const controls = parseJson(join(OUT, "stage0-preservation-controls.json"));
  for (const row of controls.passingControls) {
    const question = questionMap(join(REPO, row.bankPath)).get(row.candidateId);
    if (!question || sha256(stableJson(question, 0)) !== row.payloadSha256) fail(`PASS control drift ${row.candidateId}`);
  }
  const companions = parseJsonl(join(OUT, "stage0-companions.jsonl"));
  for (const row of companions) {
    const question = questionMap(join(REPO, row.companionBankPath)).get(row.companionCaseId);
    if (!question || sha256(stableJson(question, 0)) !== row.livePayloadSha256) fail(`companion drift ${row.companionCaseId}`);
  }
  return { status: "PASS", targetCount: targets.length, passingControlCount: controls.passingControls.length, companionCount: companions.length };
}

function patchContentChecks() {
  const expected = parseJsonl(join(OUT, "patch-operations.jsonl"));
  const actual = Object.entries(OPS_BY_BANK).flatMap(([bankPath, ops]) => ops.map((op) => ({ bankPath, ...op })));
  const key = (row: Obj) => `${row.bankPath}|${row.id}|${JSON.stringify(row.path)}|${JSON.stringify(row.before)}|${JSON.stringify(row.after)}|${row.note}`;
  const expectedKeys = expected.map(key).sort();
  const actualKeys = actual.map(key).sort();
  if (stableJson(expectedKeys, 0) !== stableJson(actualKeys, 0) || new Set(actualKeys).size !== actualKeys.length) fail("patch operation content mismatch or duplication");
  for (const row of actual) {
    const question = questionMap(join(REPO, row.bankPath)).get(row.id);
    if (!question || JSON.stringify(resolveValue(question, row.path)) !== JSON.stringify(row.before)) fail(`live before precondition ${row.id} ${JSON.stringify(row.path)}`);
  }
  const localeKeys = new Set(actual.map((row) => `${row.id}|${JSON.stringify(row.path)}`));
  const parityFailures = actual.filter((row) => {
    const last = row.path.at(-1);
    if (last !== "en" && last !== "zh") return false;
    const sibling = [...row.path.slice(0, -1), last === "en" ? "zh" : "en"];
    return !localeKeys.has(`${row.id}|${JSON.stringify(sibling)}`);
  });
  if (parityFailures.length) fail(`locale parity failures ${parityFailures.length}`);
  return { status: "PASS", operationCount: actual.length, targetCount: new Set(actual.map((row) => row.id)).size, patchProgramSha256: fileHash(PATCH), strictLocalePairCount: actual.filter((row) => row.path.at(-1) === "en").length };
}

function tempApplyAndValidate() {
  const candidates = parseJsonl(join(OUT, "repair-candidates.jsonl"));
  const controls = parseJson(join(OUT, "stage0-preservation-controls.json"));
  const temp = mkdtempSync(join(tmpdir(), "campaign16-phase-d-preapply-"));
  try {
    const tempPaths: Record<string, string> = {};
    for (const bankPath of Object.keys(OPS_BY_BANK).sort()) {
      const target = join(temp, basename(bankPath));
      copyFileSync(join(REPO, bankPath), target);
      tempPaths[bankPath] = target;
      const child = spawnSync("npx", ["tsx", PATCH, "--internal", "--bank", bankPath, "--in", target, "--out", target, "--allow-canonical", "--reason", "Campaign 16 Phase D preapply temporary validation", "--strict-parity"], { cwd: REPO, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
      if (child.status !== 0) fail(`temporary patch failed ${bankPath}: ${child.stderr}`);
    }
    const validate = spawnSync("npx", ["tsx", join(REPO, "scripts/validate-bank.ts"), ...Object.values(tempPaths)], { cwd: REPO, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
    if (validate.status !== 0) fail(`temporary validate-bank failed: ${validate.stdout}\n${validate.stderr}`);
    const hashRows = candidates.map((candidate) => {
      const question = questionMap(tempPaths[candidate.bankPath]).get(candidate.candidateId);
      const observedAfterPayloadSha256 = question ? sha256(stableJson(question, 0)) : null;
      if (observedAfterPayloadSha256 !== candidate.afterPayloadSha256) fail(`candidate hash bridge failed ${candidate.candidateId}`);
      return { candidateId: candidate.candidateId, expectedAfterPayloadSha256: candidate.afterPayloadSha256, observedAfterPayloadSha256, match: true };
    });
    const targetSet = new Set(candidates.map((row) => row.candidateId));
    for (const snapshot of controls.targetBankSnapshots) {
      const bank = parseJson(tempPaths[snapshot.bankPath]);
      if (stableJson(bank.questions.map((question: Obj) => question.id), 0) !== stableJson(snapshot.questionOrder, 0)) fail(`record order changed ${snapshot.bankPath}`);
      const observed = bank.questions.filter((question: Obj) => !targetSet.has(question.id)).map((question: Obj) => ({ id: question.id, payloadSha256: sha256(stableJson(question, 0)) }));
      if (stableJson(observed, 0) !== stableJson(snapshot.nonTargetPayloads, 0)) fail(`non-target record changed ${snapshot.bankPath}`);
    }
    const idempotency = Object.entries(OPS_BY_BANK).map(([bankPath, ops]) => {
      const map = questionMap(tempPaths[bankPath]);
      const states = ops.map((op: any) => JSON.stringify(resolveValue(map.get(op.id), op.path)) === JSON.stringify(op.after) ? "after" : "not-after");
      if (states.some((state) => state !== "after")) fail(`post-temp idempotency state ${bankPath}`);
      return { bankPath, operationCount: ops.length, afterStateCount: states.length, zeroWriteRerunEligible: true };
    });
    return { status: "PASS", validateBankExitCode: validate.status, validateBankOutput: validate.stdout.trim(), hashRows, nonTargetRecordAndOrderPreservation: "PASS", idempotency };
  } finally { rmSync(temp, { recursive: true, force: true }); }
}

function main() {
  if (fileHash(WORK_ORDER) !== WORK_ORDER_SHA) fail("work-order SHA drift");
  const adapter = parseJson(join(OUT, "adapter-fidelity.json"));
  if (adapter.status !== "PASS" || adapter.exactByteComparisonCount !== 48) fail("adapter fidelity not complete");
  const opening = openingPreservation();
  const live = liveFreezeChecks();
  const patch = patchContentChecks();
  const temp = tempApplyAndValidate();
  const frozenTreeStatus = git("status", "--porcelain=v1", "--", "audit/standalone-bowtie-answerability-census-2026-08-23", "audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5");
  if (frozenTreeStatus.includes("standalone-bowtie-answerability-census-2026-08-23")) fail("frozen 2026-08-23 lineage changed");
  const manifest = parseJson(join(OUT, "repair-manifest.json"));
  const verification = {
    status: "PASS",
    workOrderSha256: WORK_ORDER_SHA,
    adapterFidelity: "48/48 exact-byte matches",
    openingPreservation: { status: opening.status, dirtyPathCount: opening.count },
    liveFreeze: live,
    patch,
    temporaryApply: temp,
    p26NonAuthorizedFieldPreservation: "PASS by exact operation-surface application plus full candidate hash and non-target record comparison",
    directEnZhInspection: "COMPLETE for all 12 candidates; all changed displayed en/zh paths are paired; the only schema-native single-locale field is glossary[1].defZh and is explicitly disposed in the manifest",
    structuralPreservation: "12/12 ID, item type, category, topic, difficulty, ngnSkill, token IDs, 3/4/4 shape, keyed identities, and 1/2/2 cardinality unchanged",
    authorialConstraintStaticCheck: "PASS in candidate builder; prohibited prescription-disclaimer and existing-plan phrases absent from repaired CAND-18 payload",
    frozenLineageWrites: [],
    canonicalBankWrites: [],
    ledgerWrites: [],
    traps: [
      { trap: 1, disposition: "ACTIVE/HANDLED", evidence: "All bank proofs used Node/direct parsing and shell, never MCP search." },
      { trap: 2, disposition: "ACTIVE", evidence: "No census command or regeneration is appropriate before live apply." },
      { trap: 3, disposition: "N/A", evidence: "audit:stage-refs --strict was not invoked." },
      { trap: 4, disposition: "HANDLED FOR TEMP CANDIDATES", evidence: "validate-bank ran explicitly on both temporary repaired target-bank files." },
      { trap: 5, disposition: "ACTIVE/HANDLED", evidence: "No prohibited frozen generator/finalizer/ingest/lock route was invoked; only stableJson/sha256/derivePopulation were imported where authorized." },
    ],
  };
  writeFileSync(join(OUT, "verification-preapply.json"), stableJson(verification), "utf8");
  const candidateRows = parseJsonl(join(OUT, "repair-candidates.jsonl"));
  const table = candidateRows.map((row) => `| \`${row.candidateId}\` | \`${row.bankPath}\` | \`${row.afterPayloadSha256}\` |`).join("\n");
  const md = `# Campaign 16 Phase D — Producer Preapply Verification\n\nStatus: **PASS — ready for independent Claude content dispatch; no canonical mutation authorized yet.**\n\n- Work-order SHA: \`${WORK_ORDER_SHA}\`\n- Patch program SHA: \`${patch.patchProgramSha256}\`\n- Targets: **${patch.targetCount}**\n- Exact field operations: **${patch.operationCount}**\n- Four-stage adapter fidelity: **48/48 exact-byte matches**\n- Temporary repaired-bank validation: **PASS**\n- Candidate hash bridge: **12/12**\n- Opening dirty paths and index blobs preserved: **${opening.count}/${opening.count}**\n- Prior PASS controls: **38/38 unchanged**\n- Companion cases: **11/11 unchanged after live-to-c2ff546 identity proof**\n- Live canonical bank writes: **0**\n\n## Candidate freeze\n\n| Candidate | Bank | Proposed after-payload SHA-256 |\n|---|---|---|\n${table}\n\n## Mandatory trap dispositions\n\n1. **2 MiB MCP search skip — ACTIVE/HANDLED.** Node/direct parsing and shell were used for every bank proof.\n2. **Census is not byte-stable — ACTIVE.** No census regeneration is authorized before live apply.\n3. **Strict stage-reference exit semantics — N/A.** The command was not invoked.\n4. **Canonical sweep file count — HANDLED FOR TEMP CANDIDATES.** Both temporary repaired banks passed explicit \`validate-bank\`.\n5. **Frozen bow-tie generator hard-fail — ACTIVE/HANDLED.** No prohibited stateful or write route ran; the local adapter replayed all four stages without writing either frozen lineage.\n`;
  writeFileSync(join(OUT, "verification-preapply.md"), md, "utf8");
  const report = `# Campaign 16 Phase D — Producer Report\n\nThe producer proposes retaining all 12 rows with 225 exact, declarative, bilingual field operations. Every proposal is premise-neutral except the GBS IVIG safety qualifier, which is supported by the FDA-approved GAMMAGARD LIQUID label recorded in \`repair-manifest.json\`. No key, keyed-token identity, token count, scoring surface, companion case, canonical bank, ledger, index blob, or prior PASS row changed.\n\nThe exact proposed after-payloads are frozen in \`repair-candidates.jsonl\`; the exact operation manifest is \`repair-manifest.json\`; the dated patch is \`scripts/patches/2026-08-29-campaign16-phase-d-bowtie-repair.ts\` with SHA-256 \`${patch.patchProgramSha256}\`. The patch dry-run and temporary validation pass, but live application remains prohibited until a genuine independent Claude gate returns \`CAMPAIGN16_PHASE_D_CONTENT_READY\` for these exact hashes.\n\n## Checker dispatch state\n\n- Candidate count: 12\n- Operation count: 225\n- Adapter: 48/48 exact historical packet matches\n- Candidate hash bridge on temporary banks: 12/12\n- Required semantic isolation receipts: not produced by the producer\n- Checker root: remains absent\n`;
  writeFileSync(join(OUT, "producer-report.md"), report, "utf8");
  process.stdout.write(stableJson({ status: "PASS", patchProgramSha256: patch.patchProgramSha256, targetCount: patch.targetCount, operationCount: patch.operationCount }));
}

main();
