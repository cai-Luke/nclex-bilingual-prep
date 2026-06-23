#!/usr/bin/env tsx
import { constants as fsConstants } from "node:fs";
import { lstat, mkdtemp, open, readdir, readFile, realpath, rename, rm, rmdir } from "node:fs/promises";
import { basename, dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const execFileAsync = promisify(execFile);

const REPO = "/Users/holemini/Desktop/Project Shrimp";
const RAW_DIR = resolve(REPO, "banks/banks-raw");
const MAX_BYTES = 2 * 1024 * 1024;
const VALIDATOR_ARGV = [resolve(REPO, "node_modules/.bin/tsx"), "scripts/validate-bank.ts"] as const;
const VALIDATOR_TIMEOUT_MS = 30_000;
const OUTPUT_LIMIT = 12_000;

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

type ShapeSummary =
  | { type: "array"; length: number; elementTypes: Record<string, number> }
  | { type: "object"; keyCount: number; keys: string[] }
  | { type: "null" | "boolean" | "number" | "string" };

class ToolError extends Error {}

function fail(message: string): never {
  throw new ToolError(message);
}

function validateFilename(filename: string): string {
  if (filename.length === 0) fail("filename must not be empty");
  if (filename !== basename(filename)) fail("filename must be a basename only, with no path separators");
  if (filename.includes("/") || filename.includes("\\")) fail("filename must not contain path separators");
  if (isAbsolute(filename)) fail("filename must not be absolute");
  if (filename.split(/[\\/]/).includes("..") || filename.includes("..")) fail("filename must not contain '..'");
  if (filename.startsWith(".")) fail("filename must not be hidden");
  if (!filename.endsWith(".json")) fail("filename must end with .json");
  return filename;
}

function assertUtf8RoundTrip(text: string): Buffer {
  const bytes = Buffer.from(text, "utf8");
  if (bytes.length > MAX_BYTES) fail(`json_text exceeds ${MAX_BYTES} bytes`);
  if (bytes.toString("utf8") !== text) fail("json_text must be valid UTF-8");
  return bytes;
}

function parseJson(text: string): JsonValue {
  try {
    return JSON.parse(text) as JsonValue;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(`json_text is not strict parseable JSON: ${message}`);
  }
}

async function confinedTarget(filename: string): Promise<{ rawDirReal: string; target: string }> {
  const rawDirReal = await realpath(RAW_DIR);
  const target = resolve(rawDirReal, filename);
  const rel = relative(rawDirReal, target);
  if (rel === "" || rel.startsWith("..") || isAbsolute(rel)) {
    fail("resolved target escapes RAW_DIR");
  }

  try {
    const stat = await lstat(target);
    if (stat.isSymbolicLink()) fail("target must not be a symlink");
    if (!stat.isFile()) fail("target exists but is not a regular file");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  return { rawDirReal, target };
}

function repoRelative(path: string): string {
  return relative(REPO, path).split("\\").join("/");
}

function jsonType(value: JsonValue): ShapeSummary["type"] | "array" | "object" {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as ShapeSummary["type"] | "object";
}

function summarizeShape(value: JsonValue): ShapeSummary {
  if (Array.isArray(value)) {
    const elementTypes: Record<string, number> = {};
    for (const element of value) {
      const type = jsonType(element);
      elementTypes[type] = (elementTypes[type] ?? 0) + 1;
    }
    return { type: "array", length: value.length, elementTypes };
  }
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return { type: "object", keyCount: keys.length, keys };
  }
  if (value === null) return { type: "null" };
  if (typeof value === "boolean") return { type: "boolean" };
  if (typeof value === "number") return { type: "number" };
  return { type: "string" };
}

function truncate(text: string): string {
  if (text.length <= OUTPUT_LIMIT) return text;
  return `${text.slice(0, OUTPUT_LIMIT)}\n...[truncated ${text.length - OUTPUT_LIMIT} chars]`;
}

async function runGit(args: string[]): Promise<{ ok: boolean; stdout: string; stderr: string; error?: string }> {
  try {
    const { stdout, stderr } = await execFileAsync("git", ["-C", REPO, ...args], {
      timeout: 10_000,
      maxBuffer: 1024 * 1024,
    });
    return { ok: true, stdout: truncate(stdout), stderr: truncate(stderr) };
  } catch (error) {
    const err = error as NodeJS.ErrnoException & { stdout?: string; stderr?: string };
    return {
      ok: false,
      stdout: truncate(err.stdout ?? ""),
      stderr: truncate(err.stderr ?? ""),
      error: err.message,
    };
  }
}

async function gitSummary(target?: string) {
  return {
    statusPorcelain: await runGit(["status", "--porcelain", "--", "banks/banks-raw/"]),
    diffStat: target ? await runGit(["diff", "--stat", "--", target]) : undefined,
  };
}

async function fsyncDir(path: string): Promise<void> {
  let handle;
  try {
    handle = await open(path, fsConstants.O_RDONLY);
    await handle.sync();
  } finally {
    await handle?.close();
  }
}

async function atomicWrite(target: string, bytes: Buffer, overwrite: boolean): Promise<void> {
  let reservedTarget = false;
  let tmpDir: string | undefined;
  let tmpPath: string | undefined;

  if (!overwrite) {
    let reservation;
    try {
      reservation = await open(target, fsConstants.O_CREAT | fsConstants.O_EXCL | fsConstants.O_WRONLY, 0o644);
      reservedTarget = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST") fail("target already exists and overwrite is false");
      throw error;
    } finally {
      await reservation?.close();
    }
  }

  try {
    tmpDir = await mkdtemp(resolve(dirname(target), ".tmp-"));
    tmpPath = resolve(tmpDir, "payload.json");

    const tmpHandle = await open(tmpPath, fsConstants.O_CREAT | fsConstants.O_EXCL | fsConstants.O_WRONLY, 0o644);
    try {
      await tmpHandle.writeFile(bytes);
      await tmpHandle.sync();
    } finally {
      await tmpHandle.close();
    }

    await rename(tmpPath, target);
    await fsyncDir(dirname(target));
  } catch (error) {
    if (reservedTarget) await rm(target, { force: true });
    throw error;
  } finally {
    if (tmpPath) await rm(tmpPath, { force: true });
    if (tmpDir) await rmdir(tmpDir).catch(() => undefined);
  }
}

function asToolResult(data: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    structuredContent: data,
  };
}

async function writeRawBankJson(input: { filename: string; json_text: string; overwrite?: boolean }) {
  const filename = validateFilename(input.filename);
  const bytes = assertUtf8RoundTrip(input.json_text);
  const parsed = parseJson(input.json_text);
  const { target } = await confinedTarget(filename);

  await atomicWrite(target, bytes, input.overwrite ?? false);

  const data = {
    path: repoRelative(target),
    bytes: bytes.length,
    shape: summarizeShape(parsed),
    git: await gitSummary(target),
  };
  return asToolResult(data);
}

async function listRawBankFiles() {
  const rawDirReal = await realpath(RAW_DIR);
  const entries = await readdir(rawDirReal, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(".json") && !name.startsWith(".") && !name.startsWith(".tmp-"))
    .sort();
  return asToolResult({ path: repoRelative(rawDirReal), files });
}

async function readRawBankFile(input: { filename: string }) {
  const filename = validateFilename(input.filename);
  const { target } = await confinedTarget(filename);
  const stat = await lstat(target);
  if (!stat.isFile()) fail("target is not a regular file");
  if (stat.size > MAX_BYTES) fail(`file exceeds ${MAX_BYTES} bytes`);
  const json_text = await readFile(target, "utf8");
  assertUtf8RoundTrip(json_text);
  parseJson(json_text);
  return asToolResult({ path: repoRelative(target), bytes: Buffer.byteLength(json_text, "utf8"), json_text });
}

async function validateRawBankFile(input: { filename: string }) {
  const filename = validateFilename(input.filename);
  const { target } = await confinedTarget(filename);
  const stat = await lstat(target);
  if (!stat.isFile()) fail("target is not a regular file");
  if (stat.size > MAX_BYTES) fail(`file exceeds ${MAX_BYTES} bytes`);

  try {
    const { stdout, stderr } = await execFileAsync(VALIDATOR_ARGV[0], [...VALIDATOR_ARGV.slice(1), target], {
      cwd: REPO,
      timeout: VALIDATOR_TIMEOUT_MS,
      maxBuffer: 1024 * 1024,
    });
    return asToolResult({
      path: repoRelative(target),
      pass: true,
      command: [...VALIDATOR_ARGV, repoRelative(target)],
      stdout: truncate(stdout),
      stderr: truncate(stderr),
    });
  } catch (error) {
    const err = error as NodeJS.ErrnoException & { stdout?: string; stderr?: string; code?: number | string };
    return asToolResult({
      path: repoRelative(target),
      pass: false,
      command: [...VALIDATOR_ARGV, repoRelative(target)],
      exitCode: err.code,
      stdout: truncate(err.stdout ?? ""),
      stderr: truncate(err.stderr ?? ""),
      error: err.message,
    });
  }
}

export function createServer(): McpServer {
  const server = new McpServer(
    {
      name: "project-shrimp-raw-bank-writer",
      version: "0.1.0",
    },
    {
      instructions:
        "Use this server only to stage completed NCLEX bank JSON in banks/banks-raw/. Do not promote, review, commit, push, or treat raw files as study material.",
    },
  );

  server.registerTool(
    "write_raw_bank_json",
    {
      title: "Write raw bank JSON",
      description:
        "Use this when you have a completed valid JSON bank draft to quarantine in Project Shrimp's banks/banks-raw/ directory. The filename must be a non-hidden .json basename.",
      inputSchema: {
        filename: z.string().describe("A .json basename only, for example gpt-2026-06-23-neuro.json."),
        json_text: z.string().describe("The complete strict JSON text to write."),
        overwrite: z.boolean().optional().default(false).describe("When false, the write refuses to replace an existing file."),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
      },
    },
    async (input) => writeRawBankJson(input),
  );

  server.registerTool(
    "list_raw_bank_files",
    {
      title: "List raw bank files",
      description: "List non-hidden .json files directly inside banks/banks-raw/. Does not recurse.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async () => listRawBankFiles(),
  );

  server.registerTool(
    "read_raw_bank_file",
    {
      title: "Read raw bank file",
      description: "Read a single non-hidden .json file from banks/banks-raw/ after basename validation.",
      inputSchema: {
        filename: z.string().describe("A .json basename only."),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async (input) => readRawBankFile(input),
  );

  server.registerTool(
    "validate_raw_bank_file",
    {
      title: "Validate raw bank file",
      description:
        "Run the fixed Project Shrimp validator against one raw-bank .json file. This is the only subprocess path and accepts no caller-supplied command arguments.",
      inputSchema: {
        filename: z.string().describe("A .json basename only."),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
      },
    },
    async (input) => validateRawBankFile(input),
  );

  return server;
}

async function main() {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack ?? error.message : String(error));
    process.exit(1);
  });
}
