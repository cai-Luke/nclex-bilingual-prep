import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { VisualError } from "../src/visuals/registry";
import { getVisual, listVisualKinds } from "../src/visuals/registry";
import {
  loadPromotedVisualRecords,
  type PromotedVisualRecord,
} from "./promoted-visual-parity";
import {
  buildPromotedVisualParitySurvey,
  extractRecognizedProof,
  OUTPUT_PATH as SURVEY_PATH,
  serializePromotedVisualParitySurvey,
} from "./promoted-visual-parity-survey";

export const SNAPSHOT_DIR = "scripts/tests/__snapshots__/visual-parity-promoted";
export const LEGACY_SNAPSHOT_PATH = "scripts/tests/__snapshots__/visual-parity.json";
export const ARCHITECT_SPEC_PATH = "PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md";
const EXPECTED_BOOTSTRAP_RECORDS = 199;
const EXACT_ARITHMETIC = new Set(["io_record", "medication_label", "burn_map"]);
const HYBRID_PROOF_KINDS = new Set(["device_screen", "io_trend"]);
const TRACING_KINDS = new Set(["rhythm_strip", "capnography", "fetal_monitoring"]);
const U0_IDS = ["rhy_sinus_brady_001", "rhy_vtach_001", "rhy_afib_001"] as const;

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export type SnapshotRecord = {
  parityId: string;
  kind: string;
  location: string;
  bank: string;
  parentQuestionId: string;
  ownerId: string;
  svgHash: string;
  declaredKeyed?: JsonValue;
};

export type ParityStateRecord = SnapshotRecord & {
  recognizedProofSurfaces: string[];
  selfCheckErrors: VisualError[];
  svg: string;
};

export type DeltaCause = "renderer" | "content";

export type DeltaRecord = {
  parityId: string;
  kind: string;
  location: string;
  bank: string;
  before?: string;
  after?: string;
  cause: DeltaCause;
  priorProofSurface?: string[];
  removalReason?: string;
};

const byteSort = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const sha256 = (value: string): string =>
  createHash("sha256").update(value).digest("hex");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const canonicalize = (value: unknown): JsonValue => {
  if (value === null || typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) return value.map(canonicalize);
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.keys(value)
        .filter((key) => value[key] !== undefined)
        .sort(byteSort)
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  throw new Error(`visual parity cannot serialize proof value ${String(value)}`);
};

export const stableJson = (value: unknown): string => `${JSON.stringify(canonicalize(value), null, 2)}\n`;

const execGit = (args: string[], cwd: string = process.cwd()): string =>
  execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }).trim();

const questionMeta = (record: PromotedVisualRecord): Record<string, unknown> => {
  const question = record.carrierQuestion as unknown as Record<string, unknown>;
  return isRecord(question.meta) ? question.meta : {};
};

const declaredKeyedFor = (
  record: PromotedVisualRecord,
  recognizedDerivedKeys: string[],
): JsonValue | undefined => {
  if (recognizedDerivedKeys.length === 0) return undefined;
  const meta = questionMeta(record);
  const keyed = isRecord(meta.derived_values_keyed) ? meta.derived_values_keyed : {};
  return canonicalize(Object.fromEntries(
    recognizedDerivedKeys.map((key) => [key, keyed[key]]),
  ));
};

export const assertRecognizedProofSurface = (
  parityId: string,
  kind: string,
  recognizedProofSurfaces: string[],
  recognizedDerivedKeys: string[],
): void => {
  if (EXACT_ARITHMETIC.has(kind) && recognizedDerivedKeys.length === 0) {
    throw new Error(`promoted visual parity: ${parityId} (${kind}) has no recognized keyed arithmetic`);
  }
  if (kind === "device_screen" &&
    !recognizedProofSurfaces.includes("derived_values_keyed") &&
    !recognizedProofSurfaces.includes("keyed_settings")) {
    throw new Error(`promoted visual parity: ${parityId} (device_screen) has no recognized proof surface`);
  }
  if (kind === "io_trend" && recognizedProofSurfaces.length === 0) {
    throw new Error(`promoted visual parity: ${parityId} (io_trend) has no recognized proof surface`);
  }
  if (kind === "mar" &&
    !recognizedProofSurfaces.includes("keyed_relationship") &&
    !recognizedProofSurfaces.includes("keyed_cells")) {
    throw new Error(`promoted visual parity: ${parityId} (mar) has no recognized proof surface`);
  }
};

export const buildParityState = (
  promotedRecords: PromotedVisualRecord[],
): ParityStateRecord[] => promotedRecords.map((record) => {
  const mod = getVisual(record.ref.visual.kind);
  if (mod === undefined) throw new Error(`promoted visual parity: no renderer for ${record.ref.visual.kind}`);
  if (mod.selfCheck === undefined) throw new Error(`promoted visual parity: no selfCheck for ${record.ref.visual.kind}`);
  const first = mod.renderSvg(record.ref.visual as never);
  const second = mod.renderSvg(record.ref.visual as never);
  if (first !== second) throw new Error(`promoted visual parity: nondeterministic render for ${record.parityId}`);
  const selfCheckErrors = mod.selfCheck(record.ref.visual as never, record.carrierQuestion) as VisualError[];
  if (selfCheckErrors.length > 0) {
    throw new Error(`promoted visual parity: selfCheck failed for ${record.parityId}: ${JSON.stringify(selfCheckErrors)}`);
  }
  const proof = extractRecognizedProof(record);
  assertRecognizedProofSurface(
    record.parityId,
    record.ref.visual.kind,
    proof.recognizedProofSurfaces,
    proof.recognizedDerivedKeys,
  );
  const declaredKeyed = declaredKeyedFor(record, proof.recognizedDerivedKeys);
  return {
    parityId: record.parityId,
    kind: record.ref.visual.kind,
    location: record.ref.location,
    bank: record.bank,
    parentQuestionId: record.ref.parentQuestionId,
    ownerId: record.ref.ownerId,
    svgHash: sha256(first),
    ...(declaredKeyed === undefined ? {} : { declaredKeyed }),
    recognizedProofSurfaces: [...proof.recognizedProofSurfaces],
    selfCheckErrors,
    svg: first,
  };
}).sort((left, right) => byteSort(left.parityId, right.parityId));

export const buildLiveParityState = async (bankDir: string = "banks"): Promise<ParityStateRecord[]> =>
  buildParityState(await loadPromotedVisualRecords(bankDir));

export const snapshotRecord = (record: ParityStateRecord): SnapshotRecord => ({
  parityId: record.parityId,
  kind: record.kind,
  location: record.location,
  bank: record.bank,
  parentQuestionId: record.parentQuestionId,
  ownerId: record.ownerId,
  svgHash: record.svgHash,
  ...(record.declaredKeyed === undefined ? {} : { declaredKeyed: canonicalize(record.declaredKeyed) }),
});

export const serializeSnapshotFiles = (
  state: ParityStateRecord[],
  registeredKinds: string[] = listVisualKinds().sort(byteSort),
): Map<string, string> => {
  const representedKinds = [...new Set(state.map((record) => record.kind))].sort(byteSort);
  if (stableJson(representedKinds) !== stableJson(registeredKinds)) {
    throw new Error(`promoted visual parity: snapshot kinds do not equal registered kinds: ${representedKinds.join(", ")}`);
  }
  return new Map(registeredKinds.map((kind) => {
    const records = state
      .filter((record) => record.kind === kind)
      .map(snapshotRecord)
      .sort((left, right) => byteSort(left.parityId, right.parityId));
    return [`${kind}.json`, stableJson({ kind, records })];
  }));
};

const pathExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

export const hasActiveBaseline = async (snapshotDir: string = SNAPSHOT_DIR): Promise<boolean> => {
  if (!await pathExists(snapshotDir)) return false;
  return (await readdir(snapshotDir)).some((file) => file.endsWith(".json"));
};

const findInitialReceipt = async (auditDir: string = "audit"): Promise<string | null> => {
  if (!await pathExists(auditDir)) return null;
  const directories = (await readdir(auditDir)).filter((name) => name.startsWith("visual-parity-rebaseline-"));
  for (const directory of directories.sort(byteSort)) {
    const path = join(auditDir, directory, "receipt.json");
    if (!await pathExists(path)) continue;
    const receipt = JSON.parse(await readFile(path, "utf8")) as { initialBaseline?: { bootstrap?: boolean } };
    if (receipt.initialBaseline?.bootstrap === true) return path;
  }
  return null;
};

export const loadSnapshotRecords = async (
  snapshotDir: string = SNAPSHOT_DIR,
): Promise<{ kinds: string[]; records: SnapshotRecord[] }> => {
  if (!await pathExists(snapshotDir)) return { kinds: [], records: [] };
  const files = (await readdir(snapshotDir)).filter((file) => file.endsWith(".json")).sort(byteSort);
  const records: SnapshotRecord[] = [];
  const seen = new Set<string>();
  for (const file of files) {
    const parsed = JSON.parse(await readFile(join(snapshotDir, file), "utf8")) as {
      kind?: string;
      records?: SnapshotRecord[];
    };
    const expectedKind = basename(file, ".json");
    if (parsed.kind !== expectedKind || !Array.isArray(parsed.records)) {
      throw new Error(`promoted visual parity: malformed snapshot ${file}`);
    }
    for (const record of parsed.records) {
      if (!isRecord(record) || record.kind !== parsed.kind || typeof record.parityId !== "string") {
        throw new Error(`promoted visual parity: malformed record in ${file}`);
      }
      if (seen.has(record.parityId)) throw new Error(`promoted visual parity: duplicate snapshot ${record.parityId}`);
      seen.add(record.parityId);
      records.push(record);
    }
  }
  return { kinds: files.map((file) => basename(file, ".json")), records: records.sort((a, b) => byteSort(a.parityId, b.parityId)) };
};

const snapshotComparable = (record: SnapshotRecord): string => stableJson(record);

export const verifySnapshotParity = (
  liveState: ParityStateRecord[],
  snapshotKinds: string[],
  snapshots: SnapshotRecord[],
  registeredKinds: string[] = listVisualKinds().sort(byteSort),
): void => {
  const actualKinds = [...snapshotKinds].sort(byteSort);
  if (stableJson(actualKinds) !== stableJson(registeredKinds)) {
    throw new Error(`promoted visual parity: expected snapshot files for ${registeredKinds.join(", ")}; got ${actualKinds.join(", ")}`);
  }
  const liveById = new Map(liveState.map((record) => [record.parityId, snapshotRecord(record)]));
  const snapshotById = new Map(snapshots.map((record) => [record.parityId, record]));
  for (const id of [...snapshotById.keys()].sort(byteSort)) {
    if (!liveById.has(id)) throw new Error(`promoted visual parity: stale snapshot record ${id}`);
  }
  for (const id of [...liveById.keys()].sort(byteSort)) {
    const expected = snapshotById.get(id);
    if (expected === undefined) {
      throw new Error(`promoted visual parity: missing snapshot record ${id}; run npm run parity:rebaseline`);
    }
    const actual = liveById.get(id)!;
    if (actual.svgHash !== expected.svgHash) {
      throw new Error(`promoted visual parity: SVG hash drift for ${id}: expected ${expected.svgHash}, got ${actual.svgHash}`);
    }
    if (snapshotComparable(actual) !== snapshotComparable(expected)) {
      throw new Error(`promoted visual parity: snapshot metadata/proof drift for ${id}; run npm run parity:rebaseline`);
    }
  }
};

export const verifyCommittedPromotedBaseline = async (): Promise<number> => {
  const live = await buildLiveParityState();
  const snapshots = await loadSnapshotRecords();
  verifySnapshotParity(live, snapshots.kinds, snapshots.records);
  return live.length;
};

export const resolveBeforeRef = (requested?: string): string => {
  const ref = requested ?? execGit(["merge-base", "HEAD", "origin/main"]);
  return execGit(["rev-parse", "--verify", `${ref}^{commit}`]);
};

export const withTemporaryWorktree = async <T>(
  sha: string,
  callback: (worktree: string) => Promise<T>,
): Promise<T> => {
  const root = await mkdtemp(join(tmpdir(), "promoted-parity-before-"));
  const worktree = join(root, "worktree");
  let registered = false;
  try {
    execGit(["worktree", "add", "--detach", worktree, sha]);
    registered = true;
    await symlink(resolve("node_modules"), join(root, "node_modules"), "dir");
    return await callback(worktree);
  } finally {
    if (registered) {
      try {
        execGit(["worktree", "remove", "--force", worktree]);
      } finally {
        execGit(["worktree", "prune"]);
      }
    }
    await rm(root, { recursive: true, force: true });
  }
};

export const renderStateAtRef = async (sha: string): Promise<ParityStateRecord[]> =>
  withTemporaryWorktree(sha, async (worktree) => {
    const tsx = join(dirname(worktree), "node_modules", ".bin", "tsx");
    const output = execFileSync(tsx, ["scripts/visual-parity-baseline.ts", "--print-state"], {
      cwd: worktree,
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
      env: { ...process.env, TMPDIR: tmpdir() },
    });
    return JSON.parse(output) as ParityStateRecord[];
  });

const rendererChangedForKind = (kind: string, changedFiles: Set<string>): boolean => {
  const shared = [...changedFiles].some((path) =>
    path === "src/visuals/registry.ts" ||
    path === "src/visuals/kinds/index.ts" ||
    path.startsWith("src/visuals/primitives/")
  );
  if (shared) return true;
  if (kind === "rhythm_strip") return changedFiles.has("src/visuals/kinds/rhythmStrip.ts");
  return [...changedFiles].some((path) => path.startsWith(`src/visuals/kinds/${kind}/`));
};

const bankPath = (bank: string): string => `banks/${bank}`;

const deriveCause = (
  deltaClass: "changed" | "added" | "removed",
  before: ParityStateRecord | undefined,
  after: ParityStateRecord | undefined,
  changedFiles: Set<string>,
): DeltaCause => {
  const record = after ?? before;
  if (record === undefined) throw new Error("promoted visual parity: delta has no record");
  const ownBank = deltaClass === "removed" ? before!.bank : after!.bank;
  const contentChanged = changedFiles.has(bankPath(ownBank));
  const rendererChanged = rendererChangedForKind(record.kind, changedFiles);
  if ((deltaClass === "added" || deltaClass === "removed") && !contentChanged) {
    throw new Error(`promoted visual parity: identity drift for ${record.parityId}; ${bankPath(ownBank)} did not change`);
  }
  if (contentChanged && rendererChanged) {
    throw new Error(`promoted visual parity: ambiguous renderer/content cause for ${record.parityId}; split the change or obtain architect adjudication`);
  }
  if (contentChanged) return "content";
  if (rendererChanged) return "renderer";
  throw new Error(`promoted visual parity: cannot derive cause for ${record.parityId} from the Git diff`);
};

const priorProofSurface = (record: ParityStateRecord): string[] =>
  record.recognizedProofSurfaces.length > 0
    ? [...record.recognizedProofSurfaces]
    : ["universal_self_check"];

export const assertRemovedDeltaEvidence = (
  record: Pick<DeltaRecord, "parityId" | "priorProofSurface" | "removalReason">,
): void => {
  if (!Array.isArray(record.priorProofSurface) || record.priorProofSurface.length === 0 ||
    typeof record.removalReason !== "string" || record.removalReason.trim().length === 0) {
    throw new Error(`promoted visual parity: removed record ${record.parityId} lacks prior proof or removal reason`);
  }
};

const keyedEqual = (before: JsonValue | undefined, after: JsonValue | undefined): boolean =>
  stableJson(before ?? null) === stableJson(after ?? null);

export const buildOrdinaryDeltas = (
  beforeState: ParityStateRecord[],
  afterState: ParityStateRecord[],
  scope: string[],
  changedFilesInput: Iterable<string>,
): {
  changed: DeltaRecord[];
  added: DeltaRecord[];
  removed: DeltaRecord[];
  unchangedTotal: number;
  arithmeticEvidence: unknown[];
} => {
  const changedFiles = new Set(changedFilesInput);
  const scopeSet = new Set(scope);
  const beforeById = new Map(beforeState.map((record) => [record.parityId, record]));
  const afterById = new Map(afterState.map((record) => [record.parityId, record]));
  const changed: DeltaRecord[] = [];
  const added: DeltaRecord[] = [];
  const removed: DeltaRecord[] = [];
  const arithmeticEvidence: unknown[] = [];
  let unchangedTotal = 0;

  for (const parityId of [...new Set([...beforeById.keys(), ...afterById.keys()])].sort(byteSort)) {
    const before = beforeById.get(parityId);
    const after = afterById.get(parityId);
    const deltaClass = before === undefined ? "added" : after === undefined ? "removed" :
      snapshotComparable(snapshotRecord(before)) === snapshotComparable(snapshotRecord(after)) ? null : "changed";
    if (deltaClass === null) {
      unchangedTotal += 1;
      continue;
    }
    const record = after ?? before!;
    if (!scopeSet.has(record.kind)) {
      throw new Error(`promoted visual parity: out-of-scope ${deltaClass} record ${parityId} (${record.kind})`);
    }
    const cause = deriveCause(deltaClass, before, after, changedFiles);
    if (deltaClass === "changed") {
      if ((EXACT_ARITHMETIC.has(record.kind) || HYBRID_PROOF_KINDS.has(record.kind)) &&
        !keyedEqual(before!.declaredKeyed, after!.declaredKeyed)) {
        throw new Error(`promoted visual parity: declaredKeyed changed for ${parityId}`);
      }
      changed.push({ parityId, kind: record.kind, location: record.location, bank: record.bank, before: before!.svgHash, after: after!.svgHash, cause });
      if (EXACT_ARITHMETIC.has(record.kind) || HYBRID_PROOF_KINDS.has(record.kind)) {
        arithmeticEvidence.push({
          parityId,
          kind: record.kind,
          delta: "changed",
          declaredKeyed: { before: before!.declaredKeyed ?? null, after: after!.declaredKeyed ?? null },
          selfCheckErrors: { before: before!.selfCheckErrors, after: after!.selfCheckErrors },
        });
      }
    } else if (deltaClass === "added") {
      added.push({ parityId, kind: record.kind, location: record.location, bank: record.bank, after: after!.svgHash, cause });
      if (EXACT_ARITHMETIC.has(record.kind) || HYBRID_PROOF_KINDS.has(record.kind)) {
        arithmeticEvidence.push({
          parityId,
          kind: record.kind,
          delta: "added",
          declaredKeyed: { after: after!.declaredKeyed ?? null },
          selfCheckErrors: { after: after!.selfCheckErrors },
        });
      }
    } else {
      const proof = priorProofSurface(before!);
      const removalReason = `record removed from ${bankPath(before!.bank)}`;
      const removedRecord: DeltaRecord = {
        parityId,
        kind: record.kind,
        location: record.location,
        bank: record.bank,
        before: before!.svgHash,
        cause,
        priorProofSurface: proof,
        removalReason,
      };
      assertRemovedDeltaEvidence(removedRecord);
      removed.push(removedRecord);
      if (EXACT_ARITHMETIC.has(record.kind) || HYBRID_PROOF_KINDS.has(record.kind)) {
        arithmeticEvidence.push({
          parityId,
          kind: record.kind,
          delta: "removed",
          priorProofSurface: proof,
          removalReason,
          selfCheckErrors: { before: before!.selfCheckErrors },
        });
      }
    }
  }
  return { changed, added, removed, unchangedTotal, arithmeticEvidence };
};

const changedFilesFrom = (beforeSha: string): Set<string> => {
  const tracked = execGit(["diff", "--name-only", "--diff-filter=ACDMRTUXB", beforeSha, "--"])
    .split("\n").filter(Boolean);
  const untracked = execGit(["ls-files", "--others", "--exclude-standard"])
    .split("\n").filter(Boolean);
  return new Set([...tracked, ...untracked]);
};

const validateBootstrapAuthorization = async (
  state: ParityStateRecord[],
  scope: string[],
): Promise<{
  initialBaseline: Record<string, unknown>;
  u0Migration: Record<string, unknown>;
}> => {
  const committedSpec = execGit(["show", `HEAD:${ARCHITECT_SPEC_PATH}`]);
  if (!committedSpec.includes("Status: `SURVEY-ADJUDICATION: PASS`")) {
    throw new Error("promoted visual parity: committed architect survey adjudication is not PASS");
  }
  const committedSurveyText = `${execGit(["show", `HEAD:${SURVEY_PATH}`])}\n`;
  const freshSurvey = await buildPromotedVisualParitySurvey();
  const freshSurveyText = serializePromotedVisualParitySurvey(freshSurvey);
  if (freshSurveyText !== committedSurveyText) {
    throw new Error("promoted visual parity: live population does not exactly match the committed passed survey");
  }
  if (freshSurvey.population.records !== EXPECTED_BOOTSTRAP_RECORDS ||
    freshSurvey.blockers.length !== 0 || !freshSurvey.automatedNullPassed ||
    freshSurvey.findings.unclassifiedKinds.length !== 0 ||
    freshSurvey.architectQuestions.length !== 0) {
    throw new Error("promoted visual parity: passed survey bootstrap null does not hold");
  }
  const kinds = listVisualKinds().sort(byteSort);
  if (kinds.length !== 12 || stableJson(scope) !== stableJson(kinds)) {
    throw new Error(`promoted visual parity: bootstrap scope must be all 12 registered kinds: ${kinds.join(",")}`);
  }
  const files = serializeSnapshotFiles(state, kinds);
  if (files.size !== 12) throw new Error("promoted visual parity: bootstrap did not produce 12 snapshot files");

  const legacy = JSON.parse(await readFile(LEGACY_SNAPSHOT_PATH, "utf8")) as {
    svgHashes?: Array<{ id: string; svgHash: string }>;
  };
  if (!Array.isArray(legacy.svgHashes)) throw new Error("promoted visual parity: legacy U0 svgHashes missing before bootstrap");
  const legacyById = new Map(legacy.svgHashes.map((record) => [record.id, record.svgHash]));
  const liveById = new Map(state.map((record) => [record.parityId, record]));
  const migrated = U0_IDS.map((parityId) => {
    const live = liveById.get(parityId);
    const oldHash = legacyById.get(parityId) ?? null;
    const newHash = live?.svgHash ?? null;
    const actualKind = live?.kind ?? null;
    const actualLocation = live?.location ?? null;
    const kindEqual = actualKind === "rhythm_strip";
    const locationEqual = actualLocation === "question";
    const hashEqual = oldHash !== null && oldHash === newHash;
    return {
      parityId,
      oldHash,
      newHash,
      expectedKind: "rhythm_strip",
      actualKind,
      kindEqual,
      expectedLocation: "question",
      actualLocation,
      locationEqual,
      hashEqual,
      equal: kindEqual && locationEqual && hashEqual,
    };
  });
  if (legacy.svgHashes.length !== U0_IDS.length || migrated.some((record) => !record.equal)) {
    throw new Error("promoted visual parity: U0 migration is not structurally eligible and byte-equal");
  }
  return {
    initialBaseline: {
      bootstrap: true,
      priorActiveBaseline: false,
      surveyAdjudication: "SURVEY-ADJUDICATION: PASS",
      surveyManifest: SURVEY_PATH,
      scannedBankFiles: freshSurvey.population.scannedBankFiles,
      parityIdentities: freshSurvey.population.records,
      byKind: freshSurvey.counts.byKind,
      byLocation: freshSurvey.counts.byLocation,
      byKindAndLocation: freshSurvey.counts.byKindAndLocation,
      proofSurfaceNulls: {
        exactArithmeticRecordsWithoutKeyed: freshSurvey.findings.exactArithmeticRecordsWithoutKeyed.length,
        deviceScreenRecordsWithoutProof: freshSurvey.findings.deviceScreenRecordsWithoutProof.length,
        ioTrendRecordsWithoutProof: freshSurvey.findings.ioTrendRecordsWithoutProof.length,
        marRecordsWithoutProof: freshSurvey.findings.marRecordsWithoutProof.length,
      },
      nondeterministicRenders: freshSurvey.findings.nondeterministicRenders.length,
      selfCheckFailures: freshSurvey.findings.selfCheckFailures.length,
      snapshotKinds: kinds,
    },
    u0Migration: {
      source: LEGACY_SNAPSHOT_PATH,
      target: `${SNAPSHOT_DIR}/rhythm_strip.json`,
      migrated,
      allStructurallyEligible: migrated.every((record) => record.kindEqual && record.locationEqual),
      allEqual: migrated.every((record) => record.equal),
      note: "Promoted rhythm snapshot generated and verified while legacy svgHashes remained present; legacy-owner removal follows in a separate commit.",
    },
  };
};

const writeSnapshotMap = async (directory: string, files: Map<string, string>): Promise<void> => {
  await mkdir(directory, { recursive: true });
  for (const [file, text] of files) await writeFile(join(directory, file), text, "utf8");
};

const installSnapshotsTransactionally = async <T>(
  files: Map<string, string>,
  finalize: (staging: string) => Promise<T>,
): Promise<T> => {
  const staging = `${SNAPSHOT_DIR}.staging-${process.pid}`;
  const backup = `${SNAPSHOT_DIR}.backup-${process.pid}`;
  let priorMoved = false;
  let newInstalled = false;
  try {
    await rm(staging, { recursive: true, force: true });
    await rm(backup, { recursive: true, force: true });
    await writeSnapshotMap(staging, files);
    if (await pathExists(SNAPSHOT_DIR)) {
      await rename(SNAPSHOT_DIR, backup);
      priorMoved = true;
    }
    await rename(staging, SNAPSHOT_DIR);
    newInstalled = true;
    const result = await finalize(SNAPSHOT_DIR);
    await rm(backup, { recursive: true, force: true });
    return result;
  } catch (error) {
    if (newInstalled) await rm(SNAPSHOT_DIR, { recursive: true, force: true });
    if (priorMoved) await rename(backup, SNAPSHOT_DIR);
    throw error;
  } finally {
    await rm(staging, { recursive: true, force: true });
    await rm(backup, { recursive: true, force: true });
  }
};

const receiptPath = (generatedAt: string, bootstrap: boolean): string => {
  const date = generatedAt.slice(0, 10);
  if (bootstrap) return `audit/visual-parity-rebaseline-${date}-initial/receipt.json`;
  return `audit/visual-parity-rebaseline-${generatedAt.replace(/[:.]/g, "-")}/receipt.json`;
};

export const stripReceiptVolatile = <T extends { generatedAt?: unknown; inputGitSha?: unknown }>(receipt: T) => {
  const { generatedAt: _generatedAt, inputGitSha: _inputGitSha, ...stable } = receipt;
  return stable;
};

export const selectRebaselineMode = (
  activeBaseline: boolean,
  initialReceipt: string | null,
): "bootstrap" | "ordinary" => {
  if (!activeBaseline && initialReceipt !== null) {
    throw new Error(`promoted visual parity: active baseline is missing after bootstrap ${initialReceipt}; bootstrap cannot run again`);
  }
  return activeBaseline ? "ordinary" : "bootstrap";
};

type CliOptions = { reason: string; scope: string[]; beforeRef?: string };

const parseArgs = (args: string[]): CliOptions => {
  let reason: string | undefined;
  let scope: string | undefined;
  let beforeRef: string | undefined;
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === "--reason") reason = args[++index];
    else if (value === "--scope") scope = args[++index];
    else if (value === "--before-ref") beforeRef = args[++index];
    else throw new Error(`unknown parity rebaseline argument ${value}`);
  }
  if (reason === undefined || reason.trim().length === 0) throw new Error("--reason is required");
  if (scope === undefined || scope.trim().length === 0) throw new Error("--scope is required");
  const registered = new Set(listVisualKinds());
  const parsedScope = [...new Set(scope.split(",").map((kind) => kind.trim()).filter(Boolean))].sort(byteSort);
  const invalid = parsedScope.filter((kind) => !registered.has(kind));
  if (invalid.length > 0) throw new Error(`unknown parity scope kind(s): ${invalid.join(", ")}`);
  return { reason: reason.trim(), scope: parsedScope, beforeRef };
};

const writeTracingArtifacts = async (
  receiptDirectory: string,
  deltas: { changed: DeltaRecord[]; added: DeltaRecord[]; removed: DeltaRecord[] },
  beforeState: ParityStateRecord[],
  afterState: ParityStateRecord[],
): Promise<Record<string, unknown> | undefined> => {
  const candidates = [...deltas.changed, ...deltas.added, ...deltas.removed]
    .filter((record) => TRACING_KINDS.has(record.kind))
    .sort((left, right) => byteSort(left.parityId, right.parityId));
  if (candidates.length === 0) return undefined;
  const sampled = candidates.slice(0, 12);
  const renderedDir = join(receiptDirectory, "rendered");
  await mkdir(renderedDir, { recursive: true });
  const beforeById = new Map(beforeState.map((record) => [record.parityId, record]));
  const afterById = new Map(afterState.map((record) => [record.parityId, record]));
  const pngs: string[] = [];
  for (const delta of sampled) {
    const sides = [
      ...(delta.before === undefined ? [] : [{ side: "before", record: beforeById.get(delta.parityId) }]),
      ...(delta.after === undefined ? [] : [{ side: "after", record: afterById.get(delta.parityId) }]),
    ];
    for (const { side, record } of sides) {
      if (record === undefined) throw new Error(`promoted visual parity: missing ${side} tracing render for ${delta.parityId}`);
      const safeId = delta.parityId.replace(/[^A-Za-z0-9_.-]/g, "_");
      const svgPath = join(renderedDir, `${safeId}-${side}.svg`);
      const pngPath = join(renderedDir, `${safeId}-${side}.png`);
      await writeFile(svgPath, record.svg, "utf8");
      execFileSync("rsvg-convert", ["-o", pngPath, svgPath]);
      pngs.push(pngPath);
    }
  }
  const contactSheet = join(renderedDir, "contact-sheet.png");
  execFileSync("magick", [...pngs, "-append", contactSheet]);
  return {
    totalTracingDeltas: candidates.length,
    sampledParityIds: sampled.map((record) => record.parityId),
    sampleRule: candidates.length > 12 ? "first 12 by byte-sorted parityId" : "all tracing deltas",
    contactSheet,
    certificationRequired: true,
  };
};

const runBootstrap = async (options: CliOptions, beforeRef: string): Promise<string> => {
  const priorReceipt = await findInitialReceipt();
  if (priorReceipt !== null) {
    throw new Error(`promoted visual parity: bootstrap was already consumed by ${priorReceipt}`);
  }
  const state = await buildLiveParityState();
  const { initialBaseline, u0Migration } = await validateBootstrapAuthorization(state, options.scope);
  const files = serializeSnapshotFiles(state);
  const second = serializeSnapshotFiles(state);
  if (stableJson(Object.fromEntries(files)) !== stableJson(Object.fromEntries(second))) {
    throw new Error("promoted visual parity: snapshot regeneration is not byte-idempotent");
  }
  const generatedAt = new Date().toISOString();
  const path = receiptPath(generatedAt, true);
  if (await pathExists(path)) throw new Error(`promoted visual parity: refusing to overwrite ${path}`);
  const receipt = {
    reason: options.reason,
    scope: options.scope,
    generatedAt,
    inputGitSha: execGit(["rev-parse", "HEAD"]),
    beforeRef,
    initialBaseline,
    changed: [],
    added: [],
    removed: [],
    totals: { changed: 0, added: 0, removed: 0, unchangedTotal: 0, bootstrapped: state.length },
    u0Migration,
  };
  try {
    return await installSnapshotsTransactionally(files, async (installed) => {
      const staged = await loadSnapshotRecords(installed);
      verifySnapshotParity(state, staged.kinds, staged.records);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, stableJson(receipt), "utf8");
      return path;
    });
  } catch (error) {
    await rm(dirname(path), { recursive: true, force: true });
    throw error;
  }
};

const runOrdinaryRebaseline = async (options: CliOptions, beforeRef: string): Promise<string> => {
  const baseline = await loadSnapshotRecords();
  const beforeState = await renderStateAtRef(beforeRef);
  verifySnapshotParity(beforeState, baseline.kinds, baseline.records);
  const afterState = await buildLiveParityState();
  const deltas = buildOrdinaryDeltas(beforeState, afterState, options.scope, changedFilesFrom(beforeRef));
  const generatedAt = new Date().toISOString();
  const path = receiptPath(generatedAt, false);
  const receiptDirectory = dirname(path);
  try {
    const visualReview = await writeTracingArtifacts(receiptDirectory, deltas, beforeState, afterState);
    const receipt = {
      reason: options.reason,
      scope: options.scope,
      generatedAt,
      inputGitSha: execGit(["rev-parse", "HEAD"]),
      beforeRef,
      changed: deltas.changed,
      added: deltas.added,
      removed: deltas.removed,
      totals: {
        changed: deltas.changed.length,
        added: deltas.added.length,
        removed: deltas.removed.length,
        unchangedTotal: deltas.unchangedTotal,
      },
      arithmeticEvidence: deltas.arithmeticEvidence,
      ...(visualReview === undefined ? {} : { visualReview }),
    };
    const files = serializeSnapshotFiles(afterState);
    return await installSnapshotsTransactionally(files, async () => {
      await mkdir(receiptDirectory, { recursive: true });
      await writeFile(path, stableJson(receipt), "utf8");
      return path;
    });
  } catch (error) {
    await rm(receiptDirectory, { recursive: true, force: true });
    throw error;
  }
};

export const runRebaseline = async (options: CliOptions): Promise<string> => {
  const active = await hasActiveBaseline();
  const priorReceipt = await findInitialReceipt();
  const mode = selectRebaselineMode(active, priorReceipt);
  const beforeRef = resolveBeforeRef(options.beforeRef);
  return mode === "ordinary" ? runOrdinaryRebaseline(options, beforeRef) : runBootstrap(options, beforeRef);
};

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  if (process.argv[2] === "--print-state") {
    process.stdout.write(JSON.stringify(await buildLiveParityState()));
  } else {
    const path = await runRebaseline(parseArgs(process.argv.slice(2)));
    console.log(`promoted visual parity rebaseline wrote ${path}`);
  }
}
