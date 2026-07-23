import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve, sep } from "node:path";

const ROOT = resolve(import.meta.dirname);
const POPULATION_PATH = resolve(ROOT, "population.jsonl");
const CALIBRATION_PATH = resolve(ROOT, "calibration/calibration-input.json");
const CALIBRATION_SELECTION_PATH = resolve(ROOT, "calibration/selection-manifest.json");
const CALIBRATION_SHARD_DIR = resolve(ROOT, "calibration/shards");
const CALIBRATION_ATTESTATION_PATH = resolve(
  ROOT,
  "calibration/hidden-key-freeze-attestation.json",
);
const PACKET_DIR = resolve(ROOT, "packets");
const GEMINI_CALIBRATION_DIR = resolve(ROOT, "gemini/calibration-shards");
const GEMINI_AGGREGATE_OUTPUT = resolve(ROOT, "gemini/calibration-output.jsonl");
const GEMINI_AGGREGATE_RUN = resolve(ROOT, "gemini/calibration-run.md");

const VERDICTS = new Set([
  "LEAK",
  "NO_LEAK_COMPLETE_RECORD",
  "NO_LEAK_NONANSWERING_DATA",
  "REVIEW",
]);
const BILINGUAL_RELATIONS = new Set([
  "PARALLEL",
  "EN_ONLY_LEAK",
  "ZH_ONLY_LEAK",
  "MATERIAL_DIVERGENCE",
  "UNRESOLVED",
]);
const PART_SURFACES = new Set(["PART_STEM", "PART_RESPONSE", "PART_KEY", "PART_RATIONALE"]);

type PopulationRow = {
  queueIndex: number;
  packetId: string;
  bankPath: string;
  parentCaseId: string;
  partId: string;
  declaredStageIds: string[];
};

type EvidenceEntry = {
  evidenceId: string;
  parentCaseId: string;
  surface: string;
  stageId?: string;
};

type ExpectedTarget = Pick<
  PopulationRow,
  "queueIndex" | "packetId" | "bankPath" | "parentCaseId" | "partId"
>;

type Packet = {
  packetId: string;
  cases: Array<{ bankPath: string; parentCaseId: string; targets: Array<{ partId: string }> }>;
  evidenceCatalog: EvidenceEntry[];
};

type CandidateRow = {
  queueIndex: number;
  packetId: string;
  bankPath: string;
  parentCaseId: string;
  partId: string;
  verdict: string;
  testedDecision: string;
  requiredStageIds: string[];
  unsafeStageIds: string[];
  partEvidenceIds: string[];
  stageEvidenceIds: string[];
  bilingualRelation: string;
  reason: string;
};

type ValidationContext = {
  expected: ExpectedTarget[];
  populationByQueue: Map<number, PopulationRow>;
  evidenceByPacket: Map<string, Map<string, EvidenceEntry>>;
};

type CalibrationAggregate = {
  calibrationVersion: string;
  bankSnapshotSha256: string;
  targetCount: number;
  parentCaseCount: number;
  shardCount: number;
  assignedTargets: ExpectedTarget[];
  shards: Array<{
    calibrationShardId: string;
    path: string;
    targetCount: number;
    parentCaseCount: number;
    utf8Bytes: number;
    sha256: string;
    oversizedSingleCase: boolean;
    queueIndices: number[];
  }>;
};

type CalibrationShardRun = {
  calibrationShardId: string;
  modelSelector: string;
  backendModelId?: string;
  harness: string;
  date: string;
  branch?: string;
  head?: string;
  inputRowCount: number;
  outputRowCount: number;
  identityOrderReconciliation: "PASS";
  noHelperScriptOrClassifierWrittenOrExecuted: true;
  noExistingFileModified: true;
  status:
    | "CALIBRATION_SHARD_DELIVERY_COMPLETE"
    | "CALIBRATION_SHARD_PARTIAL_CONTEXT_LIMIT"
    | "CALIBRATION_SHARD_BLOCKED_INPUT_RECONCILIATION"
    | "CALIBRATION_SHARD_BLOCKED_OUTPUT_CONTAMINATION";
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const sha256 = (value: string | Buffer): string =>
  createHash("sha256").update(value).digest("hex");

function isAuthorizedPath(path: string): boolean {
  const absolute = resolve(path);
  return absolute === ROOT || absolute.startsWith(`${ROOT}${sep}`);
}

async function parseJsonl<T>(path: string): Promise<T[]> {
  assert(isAuthorizedPath(path), `Output path is outside the authorized directory: ${path}`);
  const text = await readFile(path, "utf8");
  return text.split(/\r?\n/u).filter((line) => line.trim() !== "").map((line, index) => {
    try {
      return JSON.parse(line) as T;
    } catch (error) {
      throw new Error(`Invalid JSONL at line ${index + 1}: ${String(error)}`);
    }
  });
}

async function population(): Promise<PopulationRow[]> {
  return parseJsonl<PopulationRow>(POPULATION_PATH);
}

async function calibrationAggregate(): Promise<CalibrationAggregate> {
  return JSON.parse(await readFile(CALIBRATION_PATH, "utf8")) as CalibrationAggregate;
}

async function loadPacket(packetId: string): Promise<Packet> {
  assert(/^packet-\d{3}$/u.test(packetId), `Invalid packet ID: ${packetId}`);
  return JSON.parse(await readFile(resolve(PACKET_DIR, `${packetId}.json`), "utf8")) as Packet;
}

async function contextFor(
  mode: "calibration" | "calibration-shard" | "packet",
  id?: string,
): Promise<ValidationContext> {
  const allPopulation = await population();
  const populationByQueue = new Map(allPopulation.map((row) => [row.queueIndex, row]));
  let expected: ExpectedTarget[];
  let packetIds: string[];
  if (mode === "calibration") {
    const calibration = await calibrationAggregate();
    expected = calibration.assignedTargets;
    packetIds = [...new Set(expected.map(({ packetId: id }) => id))];
  } else if (mode === "calibration-shard") {
    assert(id !== undefined, "--shard requires a calibration shard ID");
    assert(/^calibration-shard-\d{3}$/u.test(id), `Invalid calibration shard ID: ${id}`);
    const aggregate = await calibrationAggregate();
    const meta = aggregate.shards.find(({ calibrationShardId }) => calibrationShardId === id);
    assert(meta, `Calibration aggregate does not assign shard ${id}`);
    const shardPath = resolve(CALIBRATION_SHARD_DIR, `${id}.json`);
    const shardText = await readFile(shardPath, "utf8");
    assert(
      Buffer.byteLength(shardText, "utf8") === meta.utf8Bytes && sha256(shardText) === meta.sha256,
      `Calibration shard hash/size mismatch: ${id}`,
    );
    const shard = JSON.parse(shardText) as { assignedTargets: ExpectedTarget[] };
    expected = shard.assignedTargets;
    packetIds = [...new Set(expected.map(({ packetId: packet }) => packet))];
  } else {
    assert(id !== undefined, "--packet requires a packet ID");
    expected = allPopulation
      .filter(({ packetId }) => packetId === id)
      .map(({ queueIndex, packetId, bankPath, parentCaseId, partId }) => ({
        queueIndex,
        packetId,
        bankPath,
        parentCaseId,
        partId,
      }));
    packetIds = [id];
  }
  const evidenceByPacket = new Map<string, Map<string, EvidenceEntry>>();
  for (const id of packetIds) {
    const packet = await loadPacket(id);
    evidenceByPacket.set(id, new Map(packet.evidenceCatalog.map((entry) => [entry.evidenceId, entry])));
  }
  return { expected, populationByQueue, evidenceByPacket };
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "string");

function validateRows(rows: unknown[], context: ValidationContext): string[] {
  const errors: string[] = [];
  const { expected, populationByQueue, evidenceByPacket } = context;
  const expectedQueue = expected.map(({ queueIndex }) => queueIndex);
  const actualQueue = rows.map((row) =>
    typeof row === "object" && row !== null ? (row as { queueIndex?: unknown }).queueIndex : undefined);

  if (rows.length !== expected.length) {
    errors.push(`target count mismatch: expected ${expected.length}, received ${rows.length}`);
  }
  if (JSON.stringify(actualQueue) !== JSON.stringify(expectedQueue)) {
    errors.push(`missing, duplicate, extra, or out-of-order queue indices`);
  }
  const reasonCounts = new Map<string, Map<string, number>>();

  rows.forEach((raw, index) => {
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
      errors.push(`row ${index + 1}: must be a JSON object`);
      return;
    }
    const row = raw as Partial<CandidateRow>;
    const expectedRow = expected[index];
    if (!expectedRow) {
      errors.push(`row ${index + 1}: extra target`);
      return;
    }
    for (const field of ["queueIndex", "packetId", "bankPath", "parentCaseId", "partId"] as const) {
      if (row[field] !== expectedRow[field]) {
        errors.push(`row ${index + 1}: identity mismatch for ${field}`);
      }
    }
    if (typeof row.verdict !== "string" || !VERDICTS.has(row.verdict)) {
      errors.push(`row ${index + 1}: unknown verdict`);
    }
    if (typeof row.bilingualRelation !== "string" || !BILINGUAL_RELATIONS.has(row.bilingualRelation)) {
      errors.push(`row ${index + 1}: unknown bilingualRelation`);
    }
    if (typeof row.testedDecision !== "string" || row.testedDecision.trim() === "") {
      errors.push(`row ${index + 1}: empty testedDecision`);
    } else if (row.testedDecision.trim().split(/\s+/u).length > 30) {
      errors.push(`row ${index + 1}: testedDecision exceeds 30 words`);
    }
    if (typeof row.reason !== "string" || row.reason.trim() === "") {
      errors.push(`row ${index + 1}: empty reason`);
    } else if (row.verdict === "REVIEW" && row.reason.trim().length < 10) {
      errors.push(`row ${index + 1}: REVIEW ambiguity explanation is empty or inadequate`);
    }

    const arrays: Array<[keyof CandidateRow, unknown, number, number | undefined]> = [
      ["requiredStageIds", row.requiredStageIds, 0, undefined],
      ["unsafeStageIds", row.unsafeStageIds, 0, undefined],
      ["partEvidenceIds", row.partEvidenceIds, 1, 4],
      ["stageEvidenceIds", row.stageEvidenceIds, 1, 6],
    ];
    for (const [field, value, minimum, maximum] of arrays) {
      if (!isStringArray(value)) {
        errors.push(`row ${index + 1}: ${field} must be a string array`);
      } else {
        if (value.length < minimum || (maximum !== undefined && value.length > maximum)) {
          errors.push(`row ${index + 1}: ${field} length is outside the contract`);
        }
        if (new Set(value).size !== value.length) {
          errors.push(`row ${index + 1}: ${field} contains duplicates`);
        }
      }
    }

    const populationRow = populationByQueue.get(expectedRow.queueIndex);
    const declaredStages = new Set(populationRow?.declaredStageIds ?? []);
    for (const stageId of [...(row.requiredStageIds ?? []), ...(row.unsafeStageIds ?? [])]) {
      if (!declaredStages.has(stageId)) {
        errors.push(`row ${index + 1}: undeclared required/unsafe stage ${stageId}`);
      }
    }
    if (row.verdict === "LEAK" && (row.unsafeStageIds?.length ?? 0) === 0) {
      errors.push(`row ${index + 1}: LEAK has no unsafe stage`);
    }
    if (row.verdict !== "LEAK" && (row.unsafeStageIds?.length ?? 0) > 0) {
      errors.push(`row ${index + 1}: non-LEAK verdict has unsafe stages`);
    }

    const packetEvidence = evidenceByPacket.get(expectedRow.packetId) ?? new Map();
    const checkEvidence = (ids: string[] | undefined, kind: "part" | "stage") => {
      for (const evidenceId of ids ?? []) {
        const entry = packetEvidence.get(evidenceId);
        if (!entry) {
          errors.push(`row ${index + 1}: unknown or foreign evidence ID ${evidenceId}`);
          continue;
        }
        if (entry.parentCaseId !== expectedRow.parentCaseId) {
          errors.push(`row ${index + 1}: cross-case evidence ID ${evidenceId}`);
        }
        if (kind === "part" && !PART_SURFACES.has(entry.surface)) {
          errors.push(`row ${index + 1}: partEvidenceIds contains ${entry.surface}`);
        }
        if (kind === "stage" && entry.surface !== "STAGE") {
          errors.push(`row ${index + 1}: stageEvidenceIds contains ${entry.surface}`);
        }
        if (
          kind === "part" &&
          entry.ownerPartId !== undefined &&
          entry.ownerPartId !== expectedRow.partId
        ) {
          errors.push(`row ${index + 1}: evidence belongs to another part`);
        }
      }
    };
    checkEvidence(row.partEvidenceIds, "part");
    checkEvidence(row.stageEvidenceIds, "stage");
    if (row.verdict === "LEAK") {
      const stageSupport = (row.stageEvidenceIds ?? []).some((id) =>
        packetEvidence.get(id)?.surface === "STAGE");
      const partSupport = (row.partEvidenceIds ?? []).some((id) =>
        PART_SURFACES.has(packetEvidence.get(id)?.surface ?? ""));
      if (!stageSupport || !partSupport) {
        errors.push(`row ${index + 1}: LEAK lacks stage and part/key/rationale support`);
      }
    }

    if (typeof row.reason === "string" && row.reason.trim() !== "") {
      const byPacket = reasonCounts.get(expectedRow.packetId) ?? new Map<string, number>();
      byPacket.set(row.reason, (byPacket.get(row.reason) ?? 0) + 1);
      reasonCounts.set(expectedRow.packetId, byPacket);
    }
  });
  for (const [packetId, counts] of reasonCounts) {
    for (const [reason, count] of counts) {
      if (count > 2) errors.push(`${packetId}: repeated boilerplate reason on ${count} rows: ${reason}`);
    }
  }
  return errors;
}

function firstEvidence(
  context: ValidationContext,
  target: ExpectedTarget,
  surfaces: Set<string>,
): string {
  const catalog = context.evidenceByPacket.get(target.packetId);
  const found = [...(catalog?.values() ?? [])].find((entry) =>
    entry.parentCaseId === target.parentCaseId &&
    surfaces.has(entry.surface) &&
    (entry.ownerPartId === undefined || entry.ownerPartId === target.partId));
  assert(found, `No evidence for ${target.queueIndex}`);
  return found.evidenceId;
}

function validFixture(context: ValidationContext): CandidateRow[] {
  return context.expected.map((target, index) => ({
    ...target,
    verdict: "REVIEW",
    testedDecision: `Determine the item-specific clinical response for target ${target.queueIndex}.`,
    requiredStageIds: [],
    unsafeStageIds: [],
    partEvidenceIds: [firstEvidence(context, target, PART_SURFACES)],
    stageEvidenceIds: [firstEvidence(context, target, new Set(["STAGE"]))],
    bilingualRelation: "UNRESOLVED",
    reason: `The intended stage boundary for target ${target.queueIndex} cannot be recovered safely from the packet evidence.`,
  }));
}

async function selfTest(): Promise<void> {
  const allPopulation = await population();
  const byPacket = new Map<string, PopulationRow[]>();
  allPopulation.forEach((row) =>
    byPacket.set(row.packetId, [...(byPacket.get(row.packetId) ?? []), row]));
  let context: ValidationContext | undefined;
  for (const [packetId, rows] of byPacket) {
    if (rows.length < 3) continue;
    const candidate = await contextFor("packet", packetId);
    const parentCases = new Set(
      [...candidate.evidenceByPacket.get(packetId)!.values()].map(({ parentCaseId }) => parentCaseId),
    );
    if (parentCases.size > 1) {
      context = candidate;
      break;
    }
  }
  assert(context, "Synthetic validator tests need one multi-case packet with at least three targets");
  const baseline = validFixture(context);
  assert(validateRows(baseline, context).length === 0, "Self-test baseline is invalid");
  const clone = (): CandidateRow[] => structuredClone(baseline);
  const cases: Array<[string, (rows: CandidateRow[]) => void, RegExp]> = [
    ["missing target", (rows) => { rows.pop(); }, /target count|queue indices/u],
    ["duplicate target", (rows) => { rows[1] = structuredClone(rows[0]); }, /queue indices|identity mismatch/u],
    ["extra target", (rows) => { rows.push(structuredClone(rows.at(-1)!)); }, /target count|extra target/u],
    ["wrong identity", (rows) => { rows[0].partId = "wrong"; }, /identity mismatch/u],
    ["unknown verdict", (rows) => { rows[0].verdict = "MAYBE"; }, /unknown verdict/u],
    ["foreign evidence ID", (rows) => { rows[0].partEvidenceIds = ["not.in.packet"]; }, /unknown or foreign evidence/u],
    ["cross-case evidence ID", (rows) => {
      const target = context!.expected[0];
      const catalog = context!.evidenceByPacket.get(target.packetId)!;
      const foreign = [...catalog.values()].find(({ parentCaseId }) => parentCaseId !== target.parentCaseId);
      assert(foreign, "Synthetic cross-case test needs two cases in a packet");
      rows[0].partEvidenceIds = [foreign.evidenceId];
    }, /cross-case evidence|partEvidenceIds contains/u],
    ["undeclared unsafe stage", (rows) => {
      rows[0].verdict = "LEAK";
      rows[0].unsafeStageIds = ["not-a-stage"];
    }, /undeclared required\/unsafe stage/u],
    ["LEAK without supporting evidence", (rows) => {
      const populationRow = context!.populationByQueue.get(rows[0].queueIndex)!;
      rows[0].verdict = "LEAK";
      rows[0].unsafeStageIds = [populationRow.declaredStageIds[0]];
      rows[0].stageEvidenceIds = rows[0].partEvidenceIds;
    }, /stageEvidenceIds contains|LEAK lacks/u],
    ["no-leak with unsafe stages", (rows) => {
      const populationRow = context!.populationByQueue.get(rows[0].queueIndex)!;
      rows[0].verdict = "NO_LEAK_NONANSWERING_DATA";
      rows[0].unsafeStageIds = [populationRow.declaredStageIds[0]];
    }, /non-LEAK verdict has unsafe stages/u],
    ["REVIEW with unsafe stages", (rows) => {
      const populationRow = context!.populationByQueue.get(rows[0].queueIndex)!;
      rows[0].verdict = "REVIEW";
      rows[0].unsafeStageIds = [populationRow.declaredStageIds[0]];
    }, /non-LEAK verdict has unsafe stages/u],
    ["repeated boilerplate reason", (rows) => {
      const grouped = new Map<string, number[]>();
      rows.forEach((row, index) =>
        grouped.set(row.packetId, [...(grouped.get(row.packetId) ?? []), index]));
      const indices = [...grouped.values()].find((group) => group.length >= 3);
      assert(indices, "Synthetic boilerplate test needs three rows in one packet");
      indices.slice(0, 3).forEach((index) => {
        rows[index].reason = "The same ambiguity explanation is repeated without item-specific analysis.";
      });
    }, /repeated boilerplate/u],
  ];
  for (const [name, mutate, expectedError] of cases) {
    const rows = clone();
    mutate(rows);
    const errors = validateRows(rows, context);
    assert(errors.some((error) => expectedError.test(error)), `${name} was not rejected: ${errors.join("; ")}`);
  }
  console.log(`validator synthetic failures passed (${cases.length}/${cases.length})`);
}

async function checkCalibrationDispatchReadiness(): Promise<void> {
  const aggregateText = await readFile(CALIBRATION_PATH, "utf8");
  const selectionText = await readFile(CALIBRATION_SELECTION_PATH, "utf8");
  const aggregate = JSON.parse(aggregateText) as CalibrationAggregate;
  let attestation: unknown;
  try {
    attestation = JSON.parse(await readFile(CALIBRATION_ATTESTATION_PATH, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error("CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN");
    }
    throw error;
  }
  assert(
    typeof attestation === "object" && attestation !== null && !Array.isArray(attestation),
    "CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN invalid attestation object",
  );
  const record = attestation as Record<string, unknown>;
  const allowedKeys = new Set([
    "attestationVersion",
    "status",
    "bankSnapshotSha256",
    "selectionManifestSha256",
    "calibrationInputSha256",
    "targetCount",
    "keyRowCount",
    "keySha256",
    "frozenAt",
    "owners",
  ]);
  assert(
    Object.keys(record).every((key) => allowedKeys.has(key)),
    "CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN unauthorized attestation field",
  );
  assert(record.attestationVersion === "1.0", "CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN version");
  assert(
    record.status === "HIDDEN_CALIBRATION_KEY_FROZEN",
    "CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN status",
  );
  assert(
    record.bankSnapshotSha256 === aggregate.bankSnapshotSha256,
    "CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN bank snapshot mismatch",
  );
  assert(
    record.selectionManifestSha256 === sha256(selectionText),
    "CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN selection hash mismatch",
  );
  assert(
    record.calibrationInputSha256 === sha256(aggregateText),
    "CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN aggregate hash mismatch",
  );
  assert(
    record.targetCount === aggregate.targetCount && record.keyRowCount === aggregate.targetCount,
    "CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN row-count mismatch",
  );
  assert(
    typeof record.keySha256 === "string" && /^[a-f0-9]{64}$/u.test(record.keySha256),
    "CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN invalid key hash",
  );
  assert(
    typeof record.frozenAt === "string" && Number.isFinite(Date.parse(record.frozenAt)),
    "CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN invalid frozenAt",
  );
  assert(
    Array.isArray(record.owners) &&
      record.owners.length >= 2 &&
      record.owners.every((owner) => typeof owner === "string" && owner.trim() !== "") &&
      new Set(record.owners).size === record.owners.length,
    "CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN owners",
  );
  for (const meta of aggregate.shards) {
    const shardText = await readFile(resolve(ROOT, `calibration/${meta.path}`), "utf8");
    assert(
      Buffer.byteLength(shardText, "utf8") === meta.utf8Bytes && sha256(shardText) === meta.sha256,
      `CALIBRATION_BLOCKED_INPUT_RECONCILIATION ${meta.calibrationShardId}`,
    );
  }
  console.log(
    `CALIBRATION_DISPATCH_READY ${aggregate.targetCount}/${aggregate.targetCount} targets across ${aggregate.shardCount} shards`,
  );
}

function validateShardRunRecord(
  value: unknown,
  calibrationShardId: string,
  expectedCount: number,
): CalibrationShardRun {
  assert(
    typeof value === "object" && value !== null && !Array.isArray(value),
    `${calibrationShardId}: invalid run record`,
  );
  const run = value as Partial<CalibrationShardRun>;
  const allowedKeys = new Set([
    "calibrationShardId",
    "modelSelector",
    "backendModelId",
    "harness",
    "date",
    "branch",
    "head",
    "inputRowCount",
    "outputRowCount",
    "identityOrderReconciliation",
    "noHelperScriptOrClassifierWrittenOrExecuted",
    "noExistingFileModified",
    "status",
  ]);
  assert(
    Object.keys(run).every((key) => allowedKeys.has(key)),
    `${calibrationShardId}: run record contains an unauthorized field`,
  );
  assert(run.calibrationShardId === calibrationShardId, `${calibrationShardId}: run identity mismatch`);
  assert(
    typeof run.modelSelector === "string" && run.modelSelector.trim() !== "",
    `${calibrationShardId}: missing modelSelector`,
  );
  assert(
    run.backendModelId === undefined ||
      (typeof run.backendModelId === "string" && run.backendModelId.trim() !== ""),
    `${calibrationShardId}: invalid backendModelId`,
  );
  assert(
    typeof run.harness === "string" && run.harness.trim() !== "",
    `${calibrationShardId}: missing harness`,
  );
  assert(
    typeof run.date === "string" && Number.isFinite(Date.parse(run.date)),
    `${calibrationShardId}: invalid date`,
  );
  assert(
    run.inputRowCount === expectedCount && run.outputRowCount === expectedCount,
    `${calibrationShardId}: run count mismatch`,
  );
  assert(
    run.identityOrderReconciliation === "PASS",
    `${calibrationShardId}: run identity/order did not pass`,
  );
  assert(
    run.noHelperScriptOrClassifierWrittenOrExecuted === true,
    `${calibrationShardId}: helper/classifier confirmation missing`,
  );
  assert(
    run.noExistingFileModified === true,
    `${calibrationShardId}: existing-file confirmation missing`,
  );
  assert(
    run.status === "CALIBRATION_SHARD_DELIVERY_COMPLETE",
    `${calibrationShardId}: shard delivery is not complete`,
  );
  return run as CalibrationShardRun;
}

const markdownValue = (value: string | undefined): string =>
  (value ?? "").replaceAll("|", "\\|").replace(/\s+/gu, " ").trim();

async function reconcileCalibrationOutputs(): Promise<void> {
  const aggregate = await calibrationAggregate();
  const expectedNames = new Set(
    aggregate.shards.flatMap(({ calibrationShardId }) => [
      `${calibrationShardId}.jsonl`,
      `${calibrationShardId}-run.json`,
    ]),
  );
  let actualNames: string[];
  try {
    actualNames = (await readdir(GEMINI_CALIBRATION_DIR)).sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error("CALIBRATION_PARTIAL_CONTEXT_LIMIT no calibration-shard outputs");
    }
    throw error;
  }
  assert(
    actualNames.length === expectedNames.size &&
      actualNames.every((name) => expectedNames.has(name)),
    "CALIBRATION_BLOCKED_OUTPUT_CONTAMINATION unexpected or missing shard output files",
  );

  const aggregateLines: string[] = [];
  const runRecords: CalibrationShardRun[] = [];
  for (const meta of aggregate.shards) {
    const outputPath = resolve(GEMINI_CALIBRATION_DIR, `${meta.calibrationShardId}.jsonl`);
    const outputText = await readFile(outputPath, "utf8");
    const lines = outputText.split(/\r?\n/u).filter((line) => line.trim() !== "");
    const rows = lines.map((line, index) => {
      try {
        return JSON.parse(line) as unknown;
      } catch (error) {
        throw new Error(
          `${meta.calibrationShardId}: invalid JSONL at line ${index + 1}: ${String(error)}`,
        );
      }
    });
    const shardContext = await contextFor("calibration-shard", meta.calibrationShardId);
    const errors = validateRows(rows, shardContext);
    assert(
      errors.length === 0,
      `${meta.calibrationShardId}: ${errors.join("; ")}`,
    );
    aggregateLines.push(...lines);
    const runPath = resolve(GEMINI_CALIBRATION_DIR, `${meta.calibrationShardId}-run.json`);
    const run = validateShardRunRecord(
      JSON.parse(await readFile(runPath, "utf8")),
      meta.calibrationShardId,
      meta.targetCount,
    );
    runRecords.push(run);
  }

  const aggregateRows = aggregateLines.map((line) => JSON.parse(line) as unknown);
  const aggregateContext = await contextFor("calibration");
  const aggregateErrors = validateRows(aggregateRows, aggregateContext);
  assert(
    aggregateErrors.length === 0,
    `CALIBRATION_BLOCKED_INPUT_RECONCILIATION ${aggregateErrors.join("; ")}`,
  );
  await mkdir(resolve(ROOT, "gemini"), { recursive: true });
  await writeFile(GEMINI_AGGREGATE_OUTPUT, `${aggregateLines.join("\n")}\n`);

  const branches = [...new Set(runRecords.map(({ branch }) => branch).filter(Boolean))];
  const heads = [...new Set(runRecords.map(({ head }) => head).filter(Boolean))];
  const runLines = [
    "# Calibration Aggregate Run Record",
    "",
    "- Compiler: deterministic Codex reconciliation; no semantic correction",
    `- Input rows: ${aggregate.targetCount}`,
    `- Output rows: ${aggregateRows.length}`,
    "- Identity/order reconciliation: PASS",
    `- Branch: ${branches.length === 1 ? branches[0] : branches.length === 0 ? "(not supplied)" : "MIXED"}`,
    `- HEAD: ${heads.length === 1 ? heads[0] : heads.length === 0 ? "(not supplied)" : "MIXED"}`,
    "- Status: `CALIBRATION_DELIVERY_COMPLETE`",
    "",
    "| Shard | Model selector | Backend/model ID | Harness | Date | Input | Output | Status |",
    "|---|---|---|---|---|---:|---:|---|",
    ...runRecords.map((run) =>
      `| ${markdownValue(run.calibrationShardId)} | ${markdownValue(run.modelSelector)} | ` +
      `${markdownValue(run.backendModelId) || "(not visible)"} | ${markdownValue(run.harness)} | ` +
      `${markdownValue(run.date)} | ${run.inputRowCount} | ${run.outputRowCount} | ${run.status} |`),
    "",
  ];
  await writeFile(GEMINI_AGGREGATE_RUN, runLines.join("\n"));
  console.log(
    `CALIBRATION_DELIVERY_COMPLETE ${aggregateRows.length}/${aggregate.targetCount} rows across ${aggregate.shardCount} shards`,
  );
}

function parseArgs(argv: string[]): {
  mode?: "calibration" | "calibration-shard" | "packet";
  packetId?: string;
  shardId?: string;
  input?: string;
  selfTest: boolean;
  checkDispatchReadiness: boolean;
  reconcileCalibration: boolean;
} {
  const parsed: {
    mode?: "calibration" | "calibration-shard" | "packet";
    packetId?: string;
    shardId?: string;
    input?: string;
    selfTest: boolean;
    checkDispatchReadiness: boolean;
    reconcileCalibration: boolean;
  } = {
    selfTest: false,
    checkDispatchReadiness: false,
    reconcileCalibration: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--self-test") parsed.selfTest = true;
    else if (arg === "--check-dispatch-readiness") parsed.checkDispatchReadiness = true;
    else if (arg === "--reconcile-calibration") parsed.reconcileCalibration = true;
    else if (arg === "--mode") {
      const value = argv[++index];
      assert(
        value === "calibration" || value === "calibration-shard" || value === "packet",
        "--mode must be calibration, calibration-shard, or packet",
      );
      parsed.mode = value;
    } else if (arg === "--packet") parsed.packetId = argv[++index];
    else if (arg === "--shard") parsed.shardId = argv[++index];
    else if (arg === "--input") parsed.input = argv[++index];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return parsed;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.selfTest) {
    await selfTest();
    return;
  }
  if (args.checkDispatchReadiness) {
    await checkCalibrationDispatchReadiness();
    return;
  }
  if (args.reconcileCalibration) {
    await reconcileCalibrationOutputs();
    return;
  }
  assert(args.mode, "--mode is required");
  assert(args.input, "--input is required");
  const input = resolve(args.input);
  assert(isAuthorizedPath(input), `Output path is outside the authorized directory: ${args.input}`);
  const rows = await parseJsonl<unknown>(input);
  const context = await contextFor(
    args.mode,
    args.mode === "calibration-shard" ? args.shardId : args.packetId,
  );
  const errors = validateRows(rows, context);
  if (errors.length > 0) {
    errors.forEach((error) => console.error(error));
    process.exitCode = 1;
    return;
  }
  console.log(`Gemini output valid: ${rows.length}/${context.expected.length} rows`);
}

await main();
