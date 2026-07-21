import { copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { setValue, runPatch, type PatchOp } from "../patch-raw";

export const BANK_PATH = "banks/gpt-canonical.json";
export const PATCH_REASON = "remove learner-facing authorial constraint leakage while preserving nursing-scope logic in choices and rationales";
const id = "gpt_format7c_exercise_hypoglycemia_bowtie";
const beforeEn = "A client with type 1 diabetes began a new 45-minute cycling routine after work. On three cycling days, the client developed sweating, tremor, and difficulty concentrating during the ride or within one hour afterward; continuous glucose monitor readings were 58–64 mg/dL. On noncycling days, fasting and premeal glucose readings remain 95–140 mg/dL. The client has no fever, vomiting, ketones, or recent illness and has continued the preexisting meal and insulin plan without an exercise-day adjustment.\n\nComplete the bowtie by selecting the most likely condition, the 2 priority actions, and the 2 parameters to monitor. Do not independently prescribe an insulin dose.";
const afterEn = "A client with type 1 diabetes began a new 45-minute cycling routine after work. On three cycling days, the client developed sweating, tremor, and difficulty concentrating during the ride or within one hour afterward; continuous glucose monitor readings were 58–64 mg/dL. On noncycling days, fasting and premeal glucose readings remain 95–140 mg/dL. The client has no fever, vomiting, ketones, or recent illness and has continued the preexisting meal and insulin plan without an exercise-day adjustment.\n\nComplete the bowtie by selecting the most likely condition, the 2 priority actions, and the 2 parameters to monitor.";
const beforeZh = "一名 1 型糖尿病患者开始在下班后进行新的 45 分钟骑车锻炼。在 3 个骑车日中，患者在骑行中或结束后 1 小时内出现出汗、手抖和注意力难以集中，连续血糖监测值为 58–64 mg/dL。非骑车日的空腹及餐前血糖仍为 95–140 mg/dL。患者无发热、呕吐、酮体或近期疾病，并且一直沿用原有饮食和胰岛素方案，没有针对锻炼日进行调整。\n\n完成蝴蝶结题：选择最可能的状况、2 项优先措施和 2 项需要监测的指标。不要自行开立胰岛素剂量。";
const afterZh = "一名 1 型糖尿病患者开始在下班后进行新的 45 分钟骑车锻炼。在 3 个骑车日中，患者在骑行中或结束后 1 小时内出现出汗、手抖和注意力难以集中，连续血糖监测值为 58–64 mg/dL。非骑车日的空腹及餐前血糖仍为 95–140 mg/dL。患者无发热、呕吐、酮体或近期疾病，并且一直沿用原有饮食和胰岛素方案，没有针对锻炼日进行调整。\n\n完成蝴蝶结题：选择最可能的状况、2 项优先措施和 2 项需要监测的指标。";
const beforeStrategyEn = "Resolve the condition by matching timing and glucose pattern. Choose actions that align the existing plan with exercise without independently changing a prescription.";
const afterStrategyEn = "Resolve the condition by matching timing and glucose pattern. Choose actions that use the existing hypoglycemia plan for immediate safety and involve the diabetes team in planning for future exercise.";
const beforeStrategyZh = "根据症状发生时间和血糖模式判断状况。选择能让现有方案与锻炼协调、但不由患者或护士自行更改处方的措施。";
const afterStrategyZh = "根据症状发生时间和血糖模式判断状况。选择能立即执行现有低血糖安全方案，并由糖尿病团队共同制定后续锻炼计划的措施。";

const ops: PatchOp[] = [
  setValue({ id, path: ["stem", "en"], before: beforeEn, after: afterEn, note: "CONFIRMED_AUTHORIAL_CONSTRAINT_LEAK: delete the redundant English producer-facing scope disclaimer." }),
  setValue({ id, path: ["stem", "zh"], before: beforeZh, after: afterZh, note: "CONFIRMED_AUTHORIAL_CONSTRAINT_LEAK: delete the paired Chinese producer-facing scope disclaimer." }),
  setValue({ id, path: ["testTakingStrategy", "en"], before: beforeStrategyEn, after: afterStrategyEn, note: "CONFIRMED_AUTHORIAL_CONSTRAINT_LEAK: embody immediate safety and future collaboration instead of exposing the prescription-change constraint." }),
  setValue({ id, path: ["testTakingStrategy", "zh"], before: beforeStrategyZh, after: afterStrategyZh, note: "CONFIRMED_AUTHORIAL_CONSTRAINT_LEAK: Chinese parity for the naturalized strategy." }),
];

function opStates(path: string): Array<"before" | "after" | "stale"> {
  const bank = JSON.parse(readFileSync(path, "utf8")) as { questions: Array<Record<string, unknown>> };
  const matches = bank.questions.filter((question) => question.id === id);
  if (matches.length !== 1) throw new Error(`${id} matched ${matches.length} top-level questions`);
  const stem = matches[0].stem as Record<string, unknown>;
  const strategy = matches[0].testTakingStrategy as Record<string, unknown>;
  return [[stem.en, beforeEn, afterEn], [stem.zh, beforeZh, afterZh], [strategy.en, beforeStrategyEn, afterStrategyEn], [strategy.zh, beforeStrategyZh, afterStrategyZh]].map(([current, before, after]) => current === before ? "before" : current === after ? "after" : "stale");
}

function internal(): void {
  const path = resolve(process.argv[process.argv.indexOf("--in") + 1]);
  const states = opStates(path);
  if (states.every((state) => state === "after")) {
    console.log("gpt-canonical.json: idempotent; zero writes");
    return;
  }
  if (states.some((state) => state === "stale")) throw new Error(`BLOCKED_PATCH_PRECONDITION: EN/ZH states=${states.join(",")}`);
  runPatch(ops.filter((_, index) => states[index] === "before"));
}

function main(): void {
  if (process.argv.includes("--internal")) return internal();
  const write = process.argv.includes("--write");
  const target = resolve(BANK_PATH);
  const states = opStates(target);
  if (states.every((state) => state === "after")) {
    console.log("Mode: IDEMPOTENCY CHECK");
    console.log("Affected bank: banks/gpt-canonical.json");
    console.log(`Item: ${id}`);
    console.log("Pending paths: 0; zero writes");
    return;
  }
  if (states.some((state) => state === "stale")) throw new Error(`BLOCKED_PATCH_PRECONDITION: EN/ZH states=${states.join(",")}`);
  const tempRoot = write ? null : mkdtempSync(join(tmpdir(), "authorial-constraint-dry-run-"));
  const out = write ? target : join(tempRoot!, basename(target));
  if (!write) copyFileSync(target, out);
  try {
    const child = spawnSync("npx", ["tsx", fileURLToPath(import.meta.url), "--internal", "--in", out, "--out", out, "--allow-canonical", "--reason", write ? PATCH_REASON : "dry-run simulation only", "--strict-parity"], { encoding: "utf8" });
    process.stdout.write(child.stdout);
    process.stderr.write(child.stderr);
    if (child.status !== 0) process.exit(child.status ?? 1);
  } finally {
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  }
  console.log(`Mode: ${write ? "APPLY" : "DRY RUN"}`);
  console.log("Affected bank: banks/gpt-canonical.json");
  console.log(`Item: ${id}`);
  console.log("Paths: stem.en, stem.zh, testTakingStrategy.en, testTakingStrategy.zh");
  console.log("Languages: en, zh");
  console.log("Disposition: CONFIRMED_AUTHORIAL_CONSTRAINT_LEAK");
  console.log("Blocked rewrites: 0");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
