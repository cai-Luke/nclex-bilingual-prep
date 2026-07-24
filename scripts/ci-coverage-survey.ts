import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const OUTPUT_PATH = "audit/ci-coverage-survey-2026-07-23.manifest.json";
const WORKFLOW_PATHS = [
  ".github/workflows/promotion-gate.yml",
  ".github/workflows/pages.yml",
] as const;

type ScriptRecord = {
  name: string;
  body: string;
  childScripts: string[];
  entrypoints: string[];
  rawCommands: string[];
};

type WorkflowRunLine = {
  line: string;
  npmScripts: string[];
};

type WorkflowStep = {
  name: string | null;
  lineNumber: number;
  runLines: WorkflowRunLine[];
};

type WorkflowJob = {
  id: string;
  lineNumber: number;
  steps: WorkflowStep[];
};

type WorkflowRecord = {
  path: string;
  jobs: WorkflowJob[];
  directlyInvokedScripts: string[];
};

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function sortedUnique(values: Iterable<string>): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function npmScriptsIn(command: string): string[] {
  const names: string[] = [];
  const pattern = /\bnpm\s+run\s+([^\s;&|]+)/g;
  for (const match of command.matchAll(pattern)) names.push(match[1]);
  return sortedUnique(names);
}

function commandSegments(body: string): string[] {
  return body
    .split(/\s*(?:&&|\|\||;|\r?\n)\s*/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function extractScript(name: string, body: string): ScriptRecord {
  const childScripts = npmScriptsIn(body);
  const entrypoints: string[] = [];
  const rawCommands: string[] = [];

  for (const segment of commandSegments(body)) {
    if (/^npm\s+run\s+/.test(segment)) continue;
    const tsx = segment.match(/^(?:npx\s+)?tsx\s+([^\s]+)/);
    if (tsx) {
      const path = tsx[1].replace(/^['"]|['"]$/g, "");
      if (/^scripts\/.+\.ts$/.test(path)) entrypoints.push(path);
      continue;
    }
    rawCommands.push(segment);
  }

  return {
    name,
    body,
    childScripts,
    entrypoints: sortedUnique(entrypoints),
    rawCommands,
  };
}

function unquoteYamlScalar(value: string): string {
  const trimmed = value.trim();
  if (
    trimmed.length >= 2
    && ((trimmed.startsWith('"') && trimmed.endsWith('"'))
      || (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseWorkflow(path: string, text: string): WorkflowRecord {
  const lines = text.split(/\r?\n/);
  const jobs: WorkflowJob[] = [];
  let inJobs = false;
  let currentJob: WorkflowJob | null = null;
  let inSteps = false;
  let currentStep: WorkflowStep | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    const trimmed = raw.trim();
    const indent = raw.length - raw.trimStart().length;

    if (indent === 0 && trimmed === "jobs:") {
      inJobs = true;
      continue;
    }
    if (!inJobs) continue;
    if (indent === 0 && trimmed && trimmed !== "jobs:") break;

    const jobMatch = indent === 2 ? trimmed.match(/^([A-Za-z0-9_-]+):$/) : null;
    if (jobMatch) {
      currentJob = { id: jobMatch[1], lineNumber: index + 1, steps: [] };
      jobs.push(currentJob);
      inSteps = false;
      currentStep = null;
      continue;
    }
    if (!currentJob) continue;
    if (indent === 4 && trimmed === "steps:") {
      inSteps = true;
      currentStep = null;
      continue;
    }
    if (!inSteps) continue;

    if (indent === 6 && trimmed.startsWith("- ")) {
      currentStep = { name: null, lineNumber: index + 1, runLines: [] };
      currentJob.steps.push(currentStep);
      const nameMatch = trimmed.match(/^-\s+name:\s*(.+)$/);
      if (nameMatch) currentStep.name = unquoteYamlScalar(nameMatch[1]);
      const runMatch = trimmed.match(/^-\s+run:\s*(.+)$/);
      if (runMatch && !/^[>|][+-]?$/.test(runMatch[1].trim())) {
        const line = unquoteYamlScalar(runMatch[1]);
        currentStep.runLines.push({ line, npmScripts: npmScriptsIn(line) });
      }
      continue;
    }
    if (!currentStep) continue;

    const nameMatch = indent === 8 ? trimmed.match(/^name:\s*(.+)$/) : null;
    if (nameMatch) {
      currentStep.name = unquoteYamlScalar(nameMatch[1]);
      continue;
    }

    const runMatch = indent === 8 ? trimmed.match(/^run:\s*(.*)$/) : null;
    if (!runMatch) continue;
    const scalar = runMatch[1].trim();
    if (scalar && !/^[>|][+-]?$/.test(scalar)) {
      const line = unquoteYamlScalar(scalar);
      currentStep.runLines.push({ line, npmScripts: npmScriptsIn(line) });
      continue;
    }
    if (!/^[>|][+-]?$/.test(scalar)) continue;

    for (let runIndex = index + 1; runIndex < lines.length; runIndex += 1) {
      const runRaw = lines[runIndex];
      const runTrimmed = runRaw.trim();
      const runIndent = runRaw.length - runRaw.trimStart().length;
      if (runTrimmed && runIndent <= 8) break;
      if (runTrimmed) {
        currentStep.runLines.push({
          line: runTrimmed,
          npmScripts: npmScriptsIn(runTrimmed),
        });
      }
      index = runIndex;
    }
  }

  return {
    path,
    jobs,
    directlyInvokedScripts: sortedUnique(
      jobs.flatMap((job) =>
        job.steps.flatMap((step) => step.runLines.flatMap((runLine) => runLine.npmScripts))),
    ),
  };
}

function closure(
  initial: Iterable<string>,
  scriptsByName: ReadonlyMap<string, ScriptRecord>,
): string[] {
  const reached = new Set<string>();
  const pending = [...initial];
  while (pending.length > 0) {
    const name = pending.pop()!;
    if (reached.has(name) || !scriptsByName.has(name)) continue;
    reached.add(name);
    pending.push(...scriptsByName.get(name)!.childScripts);
  }
  return sortedUnique(reached);
}

function git(root: string, ...args: string[]): string {
  return execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
}

function generatorGitSha(generatorPath: string): string {
  const generatorRoot = git(dirname(generatorPath), "rev-parse", "--show-toplevel");
  const generatorRelativePath = relative(generatorRoot, generatorPath).split(sep).join("/");
  const status = git(generatorRoot, "status", "--porcelain=v1", "--", generatorRelativePath);
  return status === "" ? git(generatorRoot, "rev-parse", "HEAD") : "uncommitted-implementation-tree";
}

function parseRootArg(args: string[]): string {
  if (args.length === 0) return ".";
  if (args.length === 2 && args[0] === "--root" && args[1]) return args[1];
  throw new Error("Usage: tsx scripts/ci-coverage-survey.ts [--root <path>]");
}

async function main(): Promise<void> {
  const root = resolve(parseRootArg(process.argv.slice(2)));
  const generatorPath = fileURLToPath(import.meta.url);
  const inputPaths = ["package.json", ...WORKFLOW_PATHS];
  const inputTexts = new Map<string, string>();

  for (const path of inputPaths) {
    const absolutePath = resolve(root, path);
    const relativePath = relative(root, absolutePath);
    if (
      relativePath === ".."
      || relativePath.startsWith(`..${sep}`)
      || isAbsolute(relativePath)
    ) {
      throw new Error(`Input escaped --root: ${path}`);
    }
    inputTexts.set(path, await readFile(absolutePath, "utf8"));
  }

  const packageJson = JSON.parse(inputTexts.get("package.json")!) as {
    scripts?: Record<string, unknown>;
  };
  if (!packageJson.scripts || typeof packageJson.scripts !== "object") {
    throw new Error("package.json does not contain a scripts object");
  }

  const scripts = Object.entries(packageJson.scripts).map(([name, value]) => {
    if (typeof value !== "string") throw new Error(`package.json script ${name} is not a string`);
    return extractScript(name, value);
  });
  const scriptsByName = new Map(scripts.map((script) => [script.name, script]));
  const workflows = WORKFLOW_PATHS.map((path) => parseWorkflow(path, inputTexts.get(path)!));
  const pullRequestWorkflow = workflows.find((workflow) =>
    workflow.path.endsWith("/promotion-gate.yml"))!;
  const mainPushWorkflow = workflows.find((workflow) => workflow.path.endsWith("/pages.yml"))!;

  const reachableFromPullRequest = closure(
    pullRequestWorkflow.directlyInvokedScripts,
    scriptsByName,
  );
  const reachableFromMainPush = closure(mainPushWorkflow.directlyInvokedScripts, scriptsByName);
  const pullRequestSet = new Set(reachableFromPullRequest);
  const mainPushSet = new Set(reachableFromMainPush);
  const allScriptNames = scripts.map((script) => script.name);

  const manifest = {
    generatedAt: new Date().toISOString(),
    inputGitSha: git(root, "rev-parse", "HEAD"),
    measurementRootKind: "throwaway_git_worktree",
    generatorGitSha: generatorGitSha(generatorPath),
    generatorSha256: sha256(await readFile(generatorPath, "utf8")),
    inputs: inputPaths.map((path) => ({ path, sha256: sha256(inputTexts.get(path)!) })),
    npmScripts: scripts,
    workflows,
    reachability: {
      reachableFromPullRequest,
      reachableFromMainPush,
      reachableFromMainPushOnly: reachableFromMainPush.filter((name) => !pullRequestSet.has(name)),
      unreachableFromAnyWorkflow: sortedUnique(
        allScriptNames.filter((name) => !pullRequestSet.has(name) && !mainPushSet.has(name)),
      ),
    },
  };

  await writeFile(resolve(OUTPUT_PATH), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Wrote ${OUTPUT_PATH}`);
}

await main();
