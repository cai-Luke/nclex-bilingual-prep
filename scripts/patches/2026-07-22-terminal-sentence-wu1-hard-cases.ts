import { copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { setValue, runPatch, type PatchOp } from "../patch-raw";

export const BANK_PATH = "banks/hard-cases-canonical.json";
export const PATCH_REASON = "remove queue 2413 exam-process clause while retaining the clinical SIRS gloss";
const parentId = "cs_sepsis_shock_01";
const leafId = "cs_sepsis_shock_01_part_1";
const selector = { id: leafId } as const;
const beforeEn = "Based on the initial triage assessment at 1400, for each finding, click to specify if it is consistent with classic SIRS criteria (a foundational infection-response framework still tested on the NCLEX-RN), organ dysfunction, or neither.";
const afterEn = "Based on the initial triage assessment at 1400, for each finding, click to specify if it is consistent with classic SIRS criteria (a foundational infection-response framework), organ dysfunction, or neither.";
const beforeZh = "根据1400时的初步分诊评估，对于每项发现，请点击指明其是否符合经典SIRS标准（一个在NCLEX-RN中仍会考核的基础性感染反应框架）、器官功能障碍或两者皆非。";
const afterZh = "根据1400时的初步分诊评估，对于每项发现，请点击指明其是否符合经典SIRS标准（一个基础性感染反应框架）、器官功能障碍或两者皆非。";

const ops: PatchOp[] = [
  setValue({ id: parentId, path: ["caseStudy", "questions", selector, "stem", "en"], before: beforeEn, after: afterEn, note: "Queue 2413 D1/B2: remove only the English exam-process clause." }),
  setValue({ id: parentId, path: ["caseStudy", "questions", selector, "stem", "zh"], before: beforeZh, after: afterZh, note: "Queue 2413 D1/B2: remove only the Chinese exam-process clause derived from live disk." }),
];

type Bank = { questions: Array<Record<string, unknown>> };

function load(path: string): { parent: Record<string, unknown>; leaf: Record<string, unknown> } {
  const bank = JSON.parse(readFileSync(path, "utf8")) as Bank;
  const parents = bank.questions.filter((question) => question.id === parentId);
  if (parents.length !== 1) throw new Error(`${parentId} matched ${parents.length} top-level questions`);
  const caseStudy = parents[0].caseStudy as Record<string, unknown>;
  const questions = caseStudy.questions as Array<Record<string, unknown>>;
  const leaves = questions.filter((question) => question.id === leafId);
  if (leaves.length !== 1) throw new Error(`${leafId} matched ${leaves.length} embedded questions`);
  return { parent: parents[0], leaf: leaves[0] };
}

function states(path: string): Array<"before" | "after" | "stale"> {
  const stem = load(path).leaf.stem as Record<string, unknown>;
  return [[stem.en, beforeEn, afterEn], [stem.zh, beforeZh, afterZh]].map(([current, before, after]) =>
    current === before ? "before" : current === after ? "after" : "stale",
  );
}

function invariantSnapshot(path: string): string {
  const parent = structuredClone(load(path).parent);
  const questions = ((parent.caseStudy as Record<string, unknown>).questions as Array<Record<string, unknown>>);
  const leaf = questions.find((question) => question.id === leafId)!;
  delete (leaf.stem as Record<string, unknown>).en;
  delete (leaf.stem as Record<string, unknown>).zh;
  return JSON.stringify(parent);
}

function internal(): void {
  const path = resolve(process.argv[process.argv.indexOf("--in") + 1]);
  const current = states(path);
  if (current.every((value) => value === "after")) {
    console.log("hard-cases queue 2413: idempotent; zero writes");
    return;
  }
  if (current.some((value) => value === "stale")) throw new Error(`BLOCKED_PATCH_PRECONDITION: queue 2413 states=${current.join(",")}`);
  runPatch(ops.filter((_, index) => current[index] === "before"));
}

function main(): void {
  if (process.argv.includes("--internal")) return internal();
  const write = process.argv.includes("--write");
  const target = resolve(BANK_PATH);
  const current = states(target);
  if (current.every((value) => value === "after")) {
    console.log("Mode: IDEMPOTENCY CHECK\nAffected bank: banks/hard-cases-canonical.json\nPending paths: 0; zero writes");
    return;
  }
  if (current.some((value) => value === "stale")) throw new Error(`BLOCKED_PATCH_PRECONDITION: queue 2413 states=${current.join(",")}`);
  const beforeInvariant = invariantSnapshot(target);
  const tempRoot = write ? null : mkdtempSync(join(tmpdir(), "terminal-wu1-hard-cases-"));
  const out = write ? target : join(tempRoot!, basename(target));
  if (!write) copyFileSync(target, out);
  try {
    const child = spawnSync(
      "npx",
      ["tsx", fileURLToPath(import.meta.url), "--internal", "--in", out, "--out", out, "--allow-canonical", "--reason", write ? PATCH_REASON : "dry-run simulation only", "--strict-parity"],
      { encoding: "utf8" },
    );
    process.stdout.write(child.stdout);
    process.stderr.write(child.stderr);
    if (child.status !== 0) process.exit(child.status ?? 1);
    if (!states(out).every((value) => value === "after")) throw new Error("queue 2413 postcondition failed");
    if (invariantSnapshot(out) !== beforeInvariant) throw new Error("queue 2413 non-target fields changed");
    console.log("Non-target case payload proof: PASS");
  } finally {
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  }
  console.log(`Mode: ${write ? "APPLY" : "DRY RUN"}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
