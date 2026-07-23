import { copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { replaceText, setValue, runPatch, type PatchOp } from "../patch-raw";

export const BANK_PATH = "banks/gemini-canonical.json";
export const PATCH_REASON = "apply owner-signed WU-3 bounded Chinese terminology and orthography repairs";

const q226 = {
  id: "gemini_jun05_a_mc_lithium_toxicity_36",
  before: "一名患者开具了碳酸锂用于治疗双相情感障碍。护士应将哪项临床表现识别为地高辛锂中毒的早期体征？",
  after: "一名患者开具了碳酸锂用于治疗双相情感障碍。护士应将哪项临床表现识别为锂中毒的早期体征？",
};
const q656 = {
  id: "gemini_d9_02",
  before: "护士正在护理一名疑似梗阻性休克的患者。下列哪些情况或临床表现与该诊断一致？（择所有适用项。）",
  after: "护士正在护理一名疑似梗阻性休克的患者。下列哪些情况或临床表现与该诊断一致？（选择所有适用项。）",
};
const q702 = {
  id: "trad_batchB_14",
  beforeStem: "在护理艰难克罗替尼 (C. diff) 患者时，哪种手部卫生方法是强制性的？",
  afterStem: "在护理艰难梭菌 (C. diff) 患者时，哪种手部卫生方法是强制性的？",
  beforeTerm: "艰难克罗替尼",
  afterTerm: "艰难梭菌",
};
const q799 = {
  id: "gen_rrp_batch2_02",
  before: "护士正准备为患者更换中心静脉导管（CVC）敷料。护士应采取哪些行动来降低感染风险？（择所有适用项）",
  after: "护士正准备为患者更换中心静脉导管（CVC）敷料。护士应采取哪些行动来降低感染风险？（选择所有适用项）",
};

const note = "INTENTIONAL_SINGLE_LOCALE_REPAIR: owner-ratified Chinese-only correction; English sibling is verified clean and unchanged.";
const ops: PatchOp[] = [
  setValue({ id: q226.id, path: ["stem", "zh"], before: q226.before, after: q226.after, note: `Queue 226. ${note}` }),
  setValue({ id: q656.id, path: ["stem", "zh"], before: q656.before, after: q656.after, note: `Queue 656. ${note}` }),
  replaceText({ id: q702.id, path: ["stem", "zh"], before: q702.beforeTerm, after: q702.afterTerm, note: `Queue 702 stem recurrence. ${note}` }),
  replaceText({ id: q702.id, path: ["glossary", 1, "termZh"], before: q702.beforeTerm, after: q702.afterTerm, note: "Queue 702 owner-authorized same-record glossary recurrence." }),
  setValue({ id: q799.id, path: ["stem", "zh"], before: q799.before, after: q799.after, note: `Queue 799. ${note}` }),
];

type Bank = { questions: Array<Record<string, unknown>> };
const ids = [q226.id, q656.id, q702.id, q799.id];

function questionMap(path: string): Map<string, Record<string, unknown>> {
  const bank = JSON.parse(readFileSync(path, "utf8")) as Bank;
  const map = new Map<string, Record<string, unknown>>();
  for (const id of ids) {
    const matches = bank.questions.filter((question) => question.id === id);
    if (matches.length !== 1) throw new Error(`${id} matched ${matches.length} top-level questions`);
    map.set(id, matches[0]);
  }
  return map;
}

function values(path: string): unknown[] {
  const map = questionMap(path);
  const q702Question = map.get(q702.id)!;
  return [
    (map.get(q226.id)!.stem as Record<string, unknown>).zh,
    (map.get(q656.id)!.stem as Record<string, unknown>).zh,
    (q702Question.stem as Record<string, unknown>).zh,
    ((q702Question.glossary as Array<Record<string, unknown>>)[1]).termZh,
    (map.get(q799.id)!.stem as Record<string, unknown>).zh,
  ];
}

const beforeValues = [q226.before, q656.before, q702.beforeStem, q702.beforeTerm, q799.before];
const afterValues = [q226.after, q656.after, q702.afterStem, q702.afterTerm, q799.after];

function states(path: string): Array<"before" | "after" | "stale"> {
  return values(path).map((current, index) =>
    current === beforeValues[index] ? "before" : current === afterValues[index] ? "after" : "stale",
  );
}

function assertOccurrencePreconditions(path: string): void {
  const current = values(path);
  const count = (value: unknown, term: string): number =>
    typeof value === "string" ? value.split(term).length - 1 : 0;
  if (current[2] === q702.beforeStem && count(current[2], q702.beforeTerm) !== 1) {
    throw new Error("BLOCKED_PATCH_PRECONDITION: queue 702 stem.zh narrow term occurrence count is not 1");
  }
  if (current[3] === q702.beforeTerm && count(current[3], q702.beforeTerm) !== 1) {
    throw new Error("BLOCKED_PATCH_PRECONDITION: queue 702 glossary[1].termZh occurrence count is not 1");
  }
}

function invariantSnapshot(path: string): string {
  const map = questionMap(path);
  const records = ids.map((id) => structuredClone(map.get(id)!));
  const byId = new Map(records.map((record) => [record.id as string, record]));
  delete (byId.get(q226.id)!.stem as Record<string, unknown>).zh;
  delete (byId.get(q656.id)!.stem as Record<string, unknown>).zh;
  delete (byId.get(q702.id)!.stem as Record<string, unknown>).zh;
  delete ((byId.get(q702.id)!.glossary as Array<Record<string, unknown>>)[1]).termZh;
  delete (byId.get(q799.id)!.stem as Record<string, unknown>).zh;
  return JSON.stringify(records);
}

function internal(): void {
  const path = resolve(process.argv[process.argv.indexOf("--in") + 1]);
  assertOccurrencePreconditions(path);
  const current = states(path);
  if (current.every((value) => value === "after")) {
    console.log("gemini WU-3: idempotent; zero writes");
    return;
  }
  if (current.some((value) => value === "stale")) throw new Error(`BLOCKED_PATCH_PRECONDITION: WU-3 states=${current.join(",")}`);
  runPatch(ops.filter((_, index) => current[index] === "before"));
}

function main(): void {
  if (process.argv.includes("--internal")) return internal();
  const write = process.argv.includes("--write");
  const target = resolve(BANK_PATH);
  assertOccurrencePreconditions(target);
  const current = states(target);
  if (current.every((value) => value === "after")) {
    console.log("Mode: IDEMPOTENCY CHECK\nAffected bank: banks/gemini-canonical.json\nWU-3 pending paths: 0; zero writes");
    return;
  }
  if (current.some((value) => value === "stale")) throw new Error(`BLOCKED_PATCH_PRECONDITION: WU-3 states=${current.join(",")}`);
  const beforeInvariant = invariantSnapshot(target);
  const tempRoot = write ? null : mkdtempSync(join(tmpdir(), "terminal-wu3-gemini-"));
  const out = write ? target : join(tempRoot!, basename(target));
  if (!write) copyFileSync(target, out);
  try {
    const child = spawnSync(
      "npx",
      ["tsx", fileURLToPath(import.meta.url), "--internal", "--in", out, "--out", out, "--allow-canonical", "--reason", write ? PATCH_REASON : "dry-run simulation only"],
      { encoding: "utf8" },
    );
    process.stdout.write(child.stdout);
    process.stderr.write(child.stderr);
    if (child.status !== 0) process.exit(child.status ?? 1);
    if (!states(out).every((value) => value === "after")) throw new Error("WU-3 postcondition state failed");
    if (invariantSnapshot(out) !== beforeInvariant) throw new Error("WU-3 non-target fields changed");
    console.log("Untouched sibling/non-target proof: PASS (all English fields, keys, options, and other fields byte-equivalent as JSON values)");
  } finally {
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  }
  console.log(`Mode: ${write ? "APPLY" : "DRY RUN"}`);
  console.log("Disposition: INTENTIONAL_SINGLE_LOCALE_REPAIR");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
