import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { scanBundledAuthorialConstraints } from "../lib/authorial-constraint-leakage";

function arg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

export function serializeSurvey(rows: unknown[]): string {
  return rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : "");
}

export async function runSurvey(outPath = "audit/authorial-constraint-leakage-2026-07-21/baseline.jsonl") {
  const scan = await scanBundledAuthorialConstraints();
  const absolute = resolve(outPath);
  await mkdir(dirname(absolute), { recursive: true });
  await writeFile(absolute, serializeSurvey(scan.candidates));
  const blocking = scan.candidates.filter((row) => row.blockingEligible);
  console.log(`Banks: ${scan.banksScanned}`);
  console.log(`Top-level questions: ${scan.topLevelQuestionsScanned}`);
  console.log(`Scored leaves: ${scan.scoredLeavesScanned}`);
  console.log(`Candidates: ${scan.candidates.length}`);
  console.log(`Blocking hits: ${blocking.length}`);
  console.log(`Output: ${outPath}`);
  return scan;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await runSurvey(arg("--out"));
