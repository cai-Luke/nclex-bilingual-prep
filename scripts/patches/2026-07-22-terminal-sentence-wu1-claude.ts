import { copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { setValue, runPatch, type PatchOp } from "../patch-raw";

export const BANK_PATH = "banks/claude-canonical.json";
export const PATCH_REASON = "repair queue 57 breastfeeding-latch stem typo";
const id = "claude_a_mc_breastfeeding_latch_47";
const beforeEn = "A postpartum nurse is observing a new mother breastfeed for the first time. Which finding indicates D correct latch?";
const afterEn = "A postpartum nurse is observing a new mother breastfeed for the first time. Which finding indicates a correct latch?";

const ops: PatchOp[] = [
  setValue({
    id,
    path: ["stem", "en"],
    before: beforeEn,
    after: afterEn,
    note: "INTENTIONAL_SINGLE_LOCALE_REPAIR: queue 57 removes the stray answer-letter token; stem.zh is verified clean and unchanged.",
  }),
];

type Bank = { questions: Array<Record<string, unknown>> };

function loadQuestion(path: string): Record<string, unknown> {
  const bank = JSON.parse(readFileSync(path, "utf8")) as Bank;
  const matches = bank.questions.filter((question) => question.id === id);
  if (matches.length !== 1) throw new Error(`${id} matched ${matches.length} top-level questions`);
  return matches[0];
}

function state(path: string): "before" | "after" | "stale" {
  const question = loadQuestion(path);
  const current = (question.stem as Record<string, unknown>).en;
  return current === beforeEn ? "before" : current === afterEn ? "after" : "stale";
}

function invariantSnapshot(path: string): string {
  const question = structuredClone(loadQuestion(path));
  delete (question.stem as Record<string, unknown>).en;
  return JSON.stringify(question);
}

function assertKey(path: string): void {
  const correct = loadQuestion(path).correct;
  if (JSON.stringify(correct) === JSON.stringify(["D"])) {
    throw new Error("BLOCKED_PATCH_PRECONDITION: queue 57 correct key is [\"D\"]");
  }
}

function internal(): void {
  const path = resolve(process.argv[process.argv.indexOf("--in") + 1]);
  assertKey(path);
  const current = state(path);
  if (current === "after") {
    console.log("claude-canonical.json queue 57: idempotent; zero writes");
    return;
  }
  if (current === "stale") throw new Error("BLOCKED_PATCH_PRECONDITION: queue 57 stem.en is stale");
  runPatch(ops);
}

function main(): void {
  if (process.argv.includes("--internal")) return internal();
  const write = process.argv.includes("--write");
  const target = resolve(BANK_PATH);
  assertKey(target);
  const current = state(target);
  if (current === "after") {
    console.log("Mode: IDEMPOTENCY CHECK\nAffected bank: banks/claude-canonical.json\nPending paths: 0; zero writes");
    return;
  }
  if (current === "stale") throw new Error("BLOCKED_PATCH_PRECONDITION: queue 57 stem.en is stale");

  const beforeInvariant = invariantSnapshot(target);
  const tempRoot = write ? null : mkdtempSync(join(tmpdir(), "terminal-wu1-claude-"));
  const out = write ? target : join(tempRoot!, basename(target));
  if (!write) copyFileSync(target, out);
  try {
    const child = spawnSync(
      "npx",
      [
        "tsx",
        fileURLToPath(import.meta.url),
        "--internal",
        "--in",
        out,
        "--out",
        out,
        "--allow-canonical",
        "--reason",
        write ? PATCH_REASON : "dry-run simulation only",
      ],
      { encoding: "utf8" },
    );
    process.stdout.write(child.stdout);
    process.stderr.write(child.stderr);
    if (child.status !== 0) process.exit(child.status ?? 1);
    if (state(out) !== "after") throw new Error("queue 57 postcondition failed");
    if (invariantSnapshot(out) !== beforeInvariant) throw new Error("queue 57 non-target fields changed");
    console.log("Untouched sibling/non-target proof: PASS (stem.zh, key, options, rationale, and all other fields byte-equivalent as JSON values)");
  } finally {
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  }
  console.log(`Mode: ${write ? "APPLY" : "DRY RUN"}`);
  console.log("Disposition: INTENTIONAL_SINGLE_LOCALE_REPAIR");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
