import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { dedupeSelectedFilePaths } from "../lib/selected-file-paths";
import {
  prepareRawPromotionPreview,
  type PreparedPromotionPreview,
  type PromotionPreviewFailure,
} from "../lib/raw-promotion-preview";
import { CANONICAL_DIR } from "../lib/pipeline-paths";
import { isEnoent } from "../lib/fs-errors";
import { parseBankText } from "../src/bankImport";
import { schemaVersionAtLeast, validateBankObject } from "../src/schema";
import type { AuditResult } from "./audit/types";
import { runValidateBank } from "./audit/validate-bank";
import { runAuditReferences } from "./audit/audit-references";
import { runAuditPositions } from "./audit/audit-positions";
import { runAuditIds } from "./audit/audit-ids";
import { runAuditProducerVocabulary } from "./audit/audit-producer-vocabulary";
import { runAuditAuthorialConstraintLeakage } from "./audit/audit-authorial-constraint-leakage";
import { analyzeTopicLicenses, type TopicLicenseFinding } from "./audit/audit-topic-license";
import {
  findStageReferenceFindings,
  type StageReferenceFinding,
} from "./audit/audit-stage-refs";
import { runAuditNonMcqBiasOnBanks } from "./audit/audit-non-mcq-bias";
import { gateVerdict, isMechanicalBiasEnforced } from "./audit/audit-verdict";

export type RawGateCandidateResult = {
  displayPath: string;
  results: AuditResult[];
};

export type RawGateResult = {
  candidates: RawGateCandidateResult[];
  candidateSetResults: AuditResult[];
  prepared: PreparedPromotionPreview[];
  preparationFailures: PromotionPreviewFailure[];
  exitCode: 0 | 1;
  verdict: string;
};

export type RunRawGateOptions = {
  files: string[];
  comparisonFiles?: string[];
};

const strictValidation = (value: unknown) =>
  validateBankObject(value, { rejectUnknownKeys: true, requireMeta: true });

const failure = (name: string, detail: string, failures: string[] = []): AuditResult => ({
  name,
  status: "FAIL",
  failures,
  detail,
});

const pass = (name: string, detail: string): AuditResult => ({
  name,
  status: "PASS",
  failures: [],
  detail,
});

const relabelResult = (
  result: AuditResult,
  labels: Array<{ projection: string; display: string }>,
): AuditResult => {
  let detail = result.detail;
  let failures = [...result.failures];
  for (const { projection, display } of labels) {
    detail = detail.split(projection).join(display);
    detail = detail.split(basename(projection)).join(display);
    failures = failures.map((entry) =>
      entry === projection || entry === basename(projection) ? display : entry);
  }
  return { ...result, detail, failures };
};

const renderStageFinding = (finding: StageReferenceFinding): string => {
  const valid = finding.validStageIds.length > 0 ? finding.validStageIds.join(", ") : "(none)";
  if (finding.kind === "unresolved") {
    return `${finding.file}: ${finding.parentId}/${finding.partId} ${finding.field}=${JSON.stringify(finding.value)} unresolved; valid: ${valid}`;
  }
  if (finding.kind === "missingRequiredAnchor") {
    return `${finding.file}: ${finding.parentId}/${finding.partId} missing answerableAfterStageId; legacy stageId=${JSON.stringify(finding.resolvedStageId)}; valid: ${valid}`;
  }
  return `${finding.file}: ${finding.parentId}/${finding.partId} neither anchor resolves; renderer reveals all stages; valid: ${valid}`;
};

const rawStageResult = (prepared: PreparedPromotionPreview): AuditResult => {
  const findings = findStageReferenceFindings(
    [{ bank: prepared.bank, file: prepared.displayPath }],
    { strict: true },
  );
  return findings.length === 0
    ? pass("audit:stage-refs:raw-policy", "All staged case parts carry resolving primary stage anchors.")
    : failure(
        "audit:stage-refs:raw-policy",
        `${findings.length} raw stage-reference finding(s); every finding kind is blocking:\n${findings.map(renderStageFinding).join("\n")}`,
        [...new Set(findings.map((finding) => finding.parentId))],
      );
};

const renderTopicFinding = (finding: TopicLicenseFinding): string =>
  `${finding.file}: ${finding.path} id=${finding.id} issue=${finding.issue} category=${JSON.stringify(finding.category)} topic=${JSON.stringify(finding.topic)} licensedCategories=${JSON.stringify(finding.licensedCategories)}`;

const rawTopicResult = (prepared: PreparedPromotionPreview): AuditResult => {
  const analysis = analyzeTopicLicenses([{ bank: prepared.bank, file: prepared.displayPath }]);
  const limitation =
    "SHARED-topic clinical boundaries remain semantic-review work; this mechanical gate does not prove the clinical category choice among legitimately licensed categories.";
  return analysis.findings.length === 0
    ? pass(
        "audit:topic-license:raw-policy",
        `No exact topic-vocabulary or category-license findings. ${limitation}`,
      )
    : failure(
        "audit:topic-license:raw-policy",
        `${analysis.findings.length} mechanically proven topic-license finding(s):\n${analysis.findings.map(renderTopicFinding).join("\n")}\n${limitation}`,
        [...new Set(analysis.findings.map((finding) => finding.id))],
      );
};

async function canonicalPaths(files: string[] | undefined): Promise<string[]> {
  if (files !== undefined) {
    return dedupeSelectedFilePaths(files).map(({ resolvedPath }) => resolvedPath);
  }
  return (await readdir(CANONICAL_DIR))
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => resolve(CANONICAL_DIR, file));
}

async function promotionEligibility(
  prepared: PreparedPromotionPreview,
  comparisons: string[],
): Promise<AuditResult> {
  const matching = comparisons.find((path) => basename(path) === prepared.canonicalFilename);
  if (!matching) {
    return pass(
      "promotion:eligibility",
      `${prepared.displayPath} routes to ${prepared.canonicalFilename}; routed canonical is absent from the resolved comparison population and may be created by consolidation.`,
    );
  }
  try {
    const canonical = strictValidation(parseBankText(await readFile(matching, "utf8")));
    if (!canonical.ok) {
      return failure(
        "promotion:eligibility",
        `${prepared.displayPath}: routed canonical ${prepared.canonicalFilename} failed strict validation — ${canonical.reasons.join("; ")}`,
        [prepared.displayPath],
      );
    }
    const candidateVersion = prepared.bank.meta!.schemaVersion;
    const canonicalVersion = canonical.value.meta!.schemaVersion;
    if (
      candidateVersion !== canonicalVersion &&
      schemaVersionAtLeast(candidateVersion, canonicalVersion)
    ) {
      return failure(
        "promotion:eligibility",
        `${prepared.displayPath}: schemaVersion ${candidateVersion} is higher than routed canonical ${prepared.canonicalFilename} ${canonicalVersion}.`,
        [prepared.displayPath],
      );
    }
    return pass(
      "promotion:eligibility",
      `${prepared.displayPath} routes to ${prepared.canonicalFilename}; schemaVersion ${candidateVersion} is merge-compatible with ${canonicalVersion}.`,
    );
  } catch (error) {
    if (isEnoent(error)) {
      return pass(
        "promotion:eligibility",
        `${prepared.displayPath} routes to ${prepared.canonicalFilename}; routed canonical is absent and may be created by consolidation.`,
      );
    }
    return failure(
      "promotion:eligibility",
      `${prepared.displayPath}: could not inspect routed canonical ${prepared.canonicalFilename} — ${error instanceof Error ? error.message : String(error)}`,
      [prepared.displayPath],
    );
  }
}

export async function runRawGate(options: RunRawGateOptions): Promise<RawGateResult> {
  if (!options || !Array.isArray(options.files) || options.files.length === 0) {
    return {
      candidates: [],
      candidateSetResults: [],
      prepared: [],
      preparationFailures: [{
        displayPath: "(selection)",
        reasons: ["Raw gate requires a non-empty files selection."],
      }],
      exitCode: 1,
      verdict: "RAW GATE FAILED — candidate selection is empty.",
    };
  }

  const selected = dedupeSelectedFilePaths(options.files);
  const preparations = await Promise.all(selected.map(prepareRawPromotionPreview));
  const prepared = preparations.flatMap((result) => result.ok ? [result.prepared] : []);
  const preparationFailures = preparations.flatMap((result) => result.ok ? [] : [result.failure]);
  if (preparationFailures.length > 0) {
    return {
      candidates: selected.map(({ displayPath }) => {
        const candidateFailure = preparationFailures.find((entry) => entry.displayPath === displayPath);
        return {
          displayPath,
          results: candidateFailure
            ? [failure("raw:preparation", candidateFailure.reasons.join("\n"), [displayPath])]
            : [pass("raw:preparation", "Prepared successfully; downstream audits skipped because another candidate failed preparation.")],
        };
      }),
      candidateSetResults: [],
      prepared: [],
      preparationFailures,
      exitCode: 1,
      verdict: "RAW GATE FAILED — preparation failed; downstream audits were not run.",
    };
  }

  const comparisons = await canonicalPaths(options.comparisonFiles);
  const projectionRoot = await mkdtemp(join(tmpdir(), "shrimp-raw-gate-"));
  try {
    const projectionDir = join(projectionRoot, "prepared");
    await mkdir(projectionDir);
    const projections = await Promise.all(prepared.map(async (entry, index) => {
      const projection = join(projectionDir, `${String(index).padStart(4, "0")}-${entry.sourceFilename}`);
      await writeFile(projection, entry.serialized, "utf8");
      return { projection, display: entry.displayPath, prepared: entry };
    }));

    const candidates: RawGateCandidateResult[] = [];
    for (const entry of projections) {
      const labels = [{ projection: entry.projection, display: entry.display }];
      candidates.push({
        displayPath: entry.display,
        results: [
          await promotionEligibility(entry.prepared, comparisons),
          relabelResult(await runValidateBank({ files: [entry.projection] }), labels),
          relabelResult(await runAuditReferences({ files: [entry.projection] }), labels),
          relabelResult(await runAuditProducerVocabulary({ files: [entry.projection] }), labels),
          relabelResult(await runAuditAuthorialConstraintLeakage({ files: [entry.projection] }), labels),
          rawStageResult(entry.prepared),
          rawTopicResult(entry.prepared),
        ],
      });
    }

    const labels = projections.map(({ projection, display }) => ({ projection, display }));
    const candidatePaths = projections.map(({ projection }) => projection);
    const positions = relabelResult(await runAuditPositions({
      files: candidatePaths,
      includeEmbeddedScoredLeaves: true,
    }), labels);
    const ids = relabelResult(await runAuditIds({
      candidates: candidatePaths,
      comparison: comparisons,
    }), labels);
    const bias = runAuditNonMcqBiasOnBanks(prepared.map((entry) => ({
      id: entry.displayPath,
      questions: entry.bank.questions,
    })));
    const mechanical = bias.find((result) => result.name === "audit:non-mcq-bias:mechanical");
    const candidateSetResults = [ids, positions, ...bias];
    const localResults = candidates.flatMap((candidate) => candidate.results);
    const verdict = gateVerdict(
      [...localResults, ...candidateSetResults],
      [
        ...localResults,
        ids,
        positions,
        ...(isMechanicalBiasEnforced() && mechanical ? [mechanical] : []),
      ],
    );
    return {
      candidates,
      candidateSetResults,
      prepared,
      preparationFailures: [],
      exitCode: verdict.exitCode,
      verdict: verdict.message.replace(/^GATE/, "RAW GATE"),
    };
  } finally {
    await rm(projectionRoot, { recursive: true, force: true });
  }
}

export function renderRawGate(result: RawGateResult): string {
  const lines: string[] = ["=== Raw Candidate Gate ==="];
  for (const candidate of result.candidates) {
    lines.push("", `── Candidate: ${candidate.displayPath} ──`);
    for (const audit of candidate.results) {
      lines.push(`[${audit.status}] ${audit.name}`, audit.detail);
      if (audit.failures.length > 0) lines.push(`Failing IDs: ${audit.failures.join(", ")}`);
    }
  }
  lines.push("", "── Candidate set ──");
  if (result.candidateSetResults.length === 0) {
    lines.push("[SKIPPED] Candidate-set checks did not run.");
  } else {
    for (const audit of result.candidateSetResults) {
      lines.push(`[${audit.status}] ${audit.name}`, audit.detail);
      if (audit.failures.length > 0) lines.push(`Failing IDs: ${audit.failures.join(", ")}`);
    }
  }
  lines.push("", "══════════════════════", result.verdict);
  return lines.join("\n");
}

function parseCliArgs(argv: string[]): string[] {
  const files: string[] = [];
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== "--file") throw new Error(`Unknown argument: ${argv[index]}`);
    const value = argv[index + 1];
    if (value === undefined) throw new Error("--file requires a path argument");
    if (value.trim() === "") throw new Error("--file requires a non-empty path argument");
    files.push(value);
    index += 1;
  }
  if (files.length === 0) throw new Error("At least one --file is required");
  return files;
}

async function runCli(): Promise<void> {
  try {
    const result = await runRawGate({ files: parseCliArgs(process.argv.slice(2)) });
    console.log(renderRawGate(result));
    process.exitCode = result.exitCode;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await runCli();
}
