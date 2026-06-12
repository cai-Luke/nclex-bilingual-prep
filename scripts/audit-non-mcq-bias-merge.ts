import { readFile, writeFile } from "node:fs/promises";
import {
  formatFinalBiasReport,
  mergeLayerBResults,
  parseLayerBResults,
  type LayerAArtifact,
} from "./audit/non-mcq-bias-layer-b";

function parseArgs(args: string[]): { layerA: string; layerB: string; allowPartial: boolean } {
  let layerA = "";
  let layerB = "";
  let allowPartial = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--layer-a") layerA = args[++i] ?? "";
    else if (args[i] === "--layer-b") layerB = args[++i] ?? "";
    else if (args[i] === "--allow-partial") allowPartial = true;
    else throw new Error(`Unknown option: ${args[i]}`);
  }
  if (!layerA || !layerB) throw new Error("--layer-a and --layer-b are required.");
  return { layerA, layerB, allowPartial };
}

try {
  const args = parseArgs(process.argv.slice(2));
  const artifact = JSON.parse(await readFile(args.layerA, "utf8")) as LayerAArtifact;
  if (!Array.isArray(artifact.layer_b_queue) || !Array.isArray(artifact.records)) {
    throw new Error("Layer A report is missing records or layer_b_queue.");
  }
  const finalReport = mergeLayerBResults(
    artifact,
    parseLayerBResults(await readFile(args.layerB, "utf8")),
    args.allowPartial,
  );
  await writeFile("audit/non-mcq-bias-final-report.json", `${JSON.stringify(finalReport, null, 2)}\n`, "utf8");
  await writeFile("audit/non-mcq-bias-final-report.md", formatFinalBiasReport(finalReport), "utf8");
  console.log(`Merged ${finalReport.layer_b.received_rows}/${finalReport.layer_b.expected_rows} Layer B result(s).`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
