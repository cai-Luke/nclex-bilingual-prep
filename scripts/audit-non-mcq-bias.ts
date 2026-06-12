import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { parseBankText } from "../src/bankImport";
import { validateBankObject } from "../src/schema";
import {
  auditNonMcqBias,
  formatNonMcqBiasReport,
  type BiasBankInput,
} from "./audit/non-mcq-bias-lib";
import {
  buildLayerBQueue,
  formatLayerBPrompt,
  type LayerAArtifact,
} from "./audit/non-mcq-bias-layer-b";

function parseArgs(args: string[]): { json: boolean; paths: string[] } {
  const paths: string[] = [];
  let json = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--json") {
      json = true;
    } else if (arg === "--bank") {
      const path = args[++i];
      if (!path) throw new Error("--bank requires a path");
      paths.push(path);
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      paths.push(arg);
    }
  }
  return { json, paths };
}

async function defaultBankPaths(): Promise<string[]> {
  return (await readdir("banks"))
    .filter((filename) => filename.endsWith(".json"))
    .sort()
    .map((filename) => join("banks", filename));
}

async function loadBanks(paths: string[]): Promise<BiasBankInput[]> {
  const banks: BiasBankInput[] = [];
  for (const path of [...paths].sort()) {
    const text = await readFile(path, "utf8");
    const result = validateBankObject(parseBankText(text));
    if (!result.ok) {
      throw new Error(`${path} failed bank validation:\n${result.reasons.map((reason) => `  ${reason}`).join("\n")}`);
    }
    banks.push({
      id: basename(path, ".json"),
      questions: result.value.questions,
    });
  }
  return banks;
}

try {
  const args = parseArgs(process.argv.slice(2));
  const paths = (args.paths.length > 0 ? args.paths : await defaultBankPaths()).map((path) => resolve(path));
  const banks = await loadBanks(paths);
  const report = auditNonMcqBias(banks);
  const queue = buildLayerBQueue(banks, report);
  const artifact: LayerAArtifact = { ...report, layer_b_queue: queue };
  await mkdir("audit", { recursive: true });
  await writeFile("audit/non-mcq-bias-report.json", `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
  await writeFile("audit/non-mcq-bias-report.md", `${formatNonMcqBiasReport(report)}\n`, "utf8");
  await writeFile(
    "audit/non-mcq-bias-layer-b-queue.jsonl",
    queue.length > 0 ? `${queue.map((row) => JSON.stringify(row)).join("\n")}\n` : "",
    "utf8",
  );
  await writeFile("audit/non-mcq-bias-layer-b-prompt.md", formatLayerBPrompt(queue.length), "utf8");
  console.log(args.json ? JSON.stringify(artifact, null, 2) : formatNonMcqBiasReport(report));
  if (report.records.some((record) => record.verdict === "FAIL")) process.exitCode = 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
