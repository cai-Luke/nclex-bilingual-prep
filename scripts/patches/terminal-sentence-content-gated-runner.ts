import { copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { runPatch, type PatchOp } from "../patch-raw";

type Selector = { id: string };
export type ContentPath = Array<string | number | Selector>;

export interface ContentChange {
  queue: number;
  id: string;
  path: ContentPath;
  before: unknown;
  after: unknown;
  op: PatchOp;
}

export interface ContentPatchConfig {
  bankPath: string;
  reason: string;
  changes: ContentChange[];
  strictParity?: boolean;
  assertPostconditions?: (bank: any) => void;
}

function deepEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  return JSON.stringify(left) === JSON.stringify(right);
}

function childAt(container: any, segment: string | number | Selector): any {
  if (typeof segment === "object") {
    if (!Array.isArray(container)) throw new Error(`selector ${segment.id} requires an array`);
    const matches = container.filter((entry) => entry?.id === segment.id);
    if (matches.length !== 1) throw new Error(`selector ${segment.id} matched ${matches.length} entries`);
    return matches[0];
  }
  return container?.[segment];
}

function resolveField(question: any, path: ContentPath): { parent: any; final: string | number } {
  if (!path.length) throw new Error("content-gated path cannot be empty");
  let current = question;
  for (const segment of path.slice(0, -1)) current = childAt(current, segment);
  const final = path[path.length - 1];
  if (typeof final === "object") throw new Error("final selector segments are not supported");
  return { parent: current, final };
}

function load(path: string): any {
  return JSON.parse(readFileSync(path, "utf8"));
}

function question(bank: any, id: string): any {
  const matches = bank.questions.filter((entry: any) => entry.id === id);
  if (matches.length !== 1) throw new Error(`${id} matched ${matches.length} top-level questions`);
  return matches[0];
}

function states(path: string, config: ContentPatchConfig): Array<"before" | "after" | "stale"> {
  const bank = load(path);
  return config.changes.map((change) => {
    const field = resolveField(question(bank, change.id), change.path);
    const current = field.parent?.[field.final];
    return deepEqual(current, change.before)
      ? "before"
      : deepEqual(current, change.after)
        ? "after"
        : "stale";
  });
}

function invariantSnapshot(path: string, config: ContentPatchConfig): string {
  const bank = load(path);
  for (const change of config.changes) {
    const field = resolveField(question(bank, change.id), change.path);
    delete field.parent[field.final];
  }
  return JSON.stringify(bank);
}

function internal(config: ContentPatchConfig): void {
  const path = resolve(process.argv[process.argv.indexOf("--in") + 1]);
  const current = states(path, config);
  if (current.every((value) => value === "after")) {
    console.log("content-gated patch: idempotent; zero writes");
    return;
  }
  if (current.some((value) => value === "stale")) {
    throw new Error(`BLOCKED_PATCH_PRECONDITION: states=${current.join(",")}`);
  }
  runPatch(config.changes.filter((_, index) => current[index] === "before").map((change) => change.op));
}

export function runContentGatedPatch(config: ContentPatchConfig): void {
  if (process.argv.includes("--internal")) return internal(config);
  const write = process.argv.includes("--write");
  const target = resolve(config.bankPath);
  const current = states(target, config);
  if (current.every((value) => value === "after")) {
    console.log(`Mode: IDEMPOTENCY CHECK\nAffected bank: ${config.bankPath}\nPending paths: 0; zero writes`);
    return;
  }
  if (current.some((value) => value === "stale")) {
    throw new Error(`BLOCKED_PATCH_PRECONDITION: states=${current.join(",")}`);
  }

  const beforeInvariant = invariantSnapshot(target, config);
  const tempRoot = write ? null : mkdtempSync(join(tmpdir(), "terminal-content-gated-"));
  const out = write ? target : join(tempRoot!, basename(target));
  if (!write) copyFileSync(target, out);
  try {
    const child = spawnSync(
      "npx",
      [
        "tsx",
        resolve(process.argv[1]),
        "--internal",
        "--in",
        out,
        "--out",
        out,
        "--allow-canonical",
        "--reason",
        write ? config.reason : "content-gated checker-packet dry-run simulation only",
        ...(config.strictParity === false ? [] : ["--strict-parity"]),
      ],
      { encoding: "utf8" },
    );
    process.stdout.write(child.stdout);
    process.stderr.write(child.stderr);
    if (child.status !== 0) process.exit(child.status ?? 1);
    if (!states(out, config).every((value) => value === "after")) {
      throw new Error("content-gated postcondition state failed");
    }
    config.assertPostconditions?.(load(out));
    if (invariantSnapshot(out, config) !== beforeInvariant) {
      throw new Error("content-gated non-target bank payload changed");
    }
    console.log("All declared non-target fields: byte-identical as JSON values");
  } finally {
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  }
  console.log(`Mode: ${write ? "APPLY" : "DRY RUN"}`);
  console.log(`Rows: ${[...new Set(config.changes.map((change) => change.queue))].join(", ")}`);
}
