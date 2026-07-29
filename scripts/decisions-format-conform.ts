import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  checkDecisionsFormat,
  type ConformanceResult,
  type FormatIssue,
} from "../lib/decisions-format";

export interface DecisionsFormatCliOptions {
  root: string;
  decisions: string;
  archive?: string;
}

export interface DecisionsFormatCliResult {
  exitCode: 0 | 1;
  output: string;
  result: ConformanceResult;
}

function displayPath(root: string, path: string): string {
  const candidate = relative(root, path);
  return candidate.startsWith("..") || isAbsolute(candidate) ? path : candidate;
}

function trackedPaths(root: string): Set<string> {
  const child = spawnSync("git", ["-C", root, "ls-files", "-z"], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (child.status !== 0) {
    throw new Error(`git ls-files failed beneath ${root}: ${child.stderr.trim()}`);
  }
  return new Set(
    child.stdout
      .split("\0")
      .filter((path) => path.length > 0 && existsSync(resolve(root, path))),
  );
}

function renderIssue(finding: FormatIssue): string {
  const location = finding.source
    ? `${finding.source}${finding.line === undefined ? "" : `:${finding.line}`}`
    : "<candidate>";
  const assertion = finding.assertion === undefined ? "" : ` assertion=${finding.assertion}`;
  const block = finding.blockKey === undefined ? "" : ` block=${finding.blockKey}`;
  return `[FAIL] ${finding.code} ${location}${assertion}${block} — ${finding.message}`;
}

export function renderDecisionsFormatResult(result: ConformanceResult): string {
  if (result.ok) {
    const archiveCount = result.archive?.wrappers.length ?? 0;
    return [
      "[PASS] DECISIONS format conforms",
      `live blocks: ${result.decisions.entries.length}`,
      `index rows: ${result.decisions.index.rows.length}`,
      `archive wrappers: ${archiveCount}`,
      `archive index lines: ${result.decisions.archiveIndex.length}`,
      `retired-register rows: ${result.decisions.retiredIdentifiers.length}`,
    ].join("\n");
  }
  return result.issues.map(renderIssue).join("\n");
}

export async function runDecisionsFormatConformance(
  options: DecisionsFormatCliOptions,
): Promise<DecisionsFormatCliResult> {
  const root = resolve(options.root);
  const decisionsPath = resolve(options.decisions);
  const archivePath = options.archive === undefined ? undefined : resolve(options.archive);
  const decisionsText = await readFile(decisionsPath, "utf8");
  const archiveText = archivePath === undefined ? undefined : await readFile(archivePath, "utf8");
  const result = checkDecisionsFormat({
    decisionsText,
    decisionsSource: displayPath(root, decisionsPath),
    archiveText,
    archiveSource: archivePath === undefined ? undefined : displayPath(root, archivePath),
    trackedPaths: trackedPaths(root),
  });
  return {
    exitCode: result.ok ? 0 : 1,
    output: renderDecisionsFormatResult(result),
    result,
  };
}

function parseArguments(argv: string[]): DecisionsFormatCliOptions {
  let root: string | undefined;
  let decisions: string | undefined;
  let archive: string | undefined;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument !== "--root" && argument !== "--decisions" && argument !== "--archive") {
      throw new Error(`Unknown argument: ${argument}`);
    }
    const value = argv[index + 1];
    if (value === undefined || value.startsWith("--") || value.trim() === "") {
      throw new Error(`${argument} requires a non-empty path argument`);
    }
    if (argument === "--root") root = value;
    if (argument === "--decisions") decisions = value;
    if (argument === "--archive") archive = value;
    index += 1;
  }
  if (root === undefined) throw new Error("--root is required");
  if (decisions === undefined) throw new Error("--decisions is required");
  return { root, decisions, archive };
}

async function main(): Promise<void> {
  try {
    const options = parseArguments(process.argv.slice(2));
    const result = await runDecisionsFormatConformance(options);
    const stream = result.exitCode === 0 ? process.stdout : process.stderr;
    stream.write(`${result.output}\n`);
    process.exitCode = result.exitCode;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) await main();
