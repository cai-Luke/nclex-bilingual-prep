import { copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { setValue, runPatch, type PatchOp } from "../patch-raw";

export const BANK_PATH = "banks/gemini-canonical.json";
export const PATCH_REASON = "remove duplicated raw dropdown response surfaces from ordinary stems for terminal-sentence WU-2";

interface Entry {
  queue: number;
  id: string;
  beforeEn: string;
  afterEn: string;
  beforeZh: string;
  afterZh: string;
}

const entries: Entry[] = [
  {
    queue: 888,
    id: "gap_50_mc_01",
    beforeEn: "A nurse is preparing a client for a scheduled elective cardiac catheterization. The client states, 'I am still not sure what they are going to do during this procedure, and I am nervous about it.' The nurse should recognize that {{1}} because {{2}}.",
    afterEn: "A nurse is preparing a client for a scheduled elective cardiac catheterization. The client states, 'I am still not sure what they are going to do during this procedure, and I am nervous about it.'",
    beforeZh: "护士正在为一名安排进行择期心脏导管插入术的患者做准备。患者陈述道：“我仍然不确定他们在手术过程中要做什么，我很紧张。”护士应认识到 {{1}}，因为 {{2}}。",
    afterZh: "护士正在为一名安排进行择期心脏导管插入术的患者做准备。患者陈述道：“我仍然不确定他们在手术过程中要做什么，我很紧张。”",
  },
  {
    queue: 890,
    id: "gap_50_mc_03",
    beforeEn: "An elderly client admitted with a severe urinary tract infection refuses to take prescribed oral antibiotics. The client states, 'I just want to go home and let nature take its course.' The nurse should first {{1}} and then {{2}}.",
    afterEn: "An elderly client admitted with a severe urinary tract infection refuses to take prescribed oral antibiotics. The client states, 'I just want to go home and let nature take its course.'",
    beforeZh: "一名因严重尿路感染入院的老年患者拒绝服用开具的口服抗生素。患者陈述道：“我只想回家，顺其自然。”护士应首先 {{1}}，然后 {{2}}。",
    afterZh: "一名因严重尿路感染入院的老年患者拒绝服用开具的口服抗生素。患者陈述道：“我只想回家，顺其自然。”",
  },
  {
    queue: 892,
    id: "gap_50_mc_05",
    beforeEn: "A client who is mentally competent decides to leave the hospital against medical advice (AMA). The nurse should ensure that {{1}} because {{2}}.",
    afterEn: "A client who is mentally competent decides to leave the hospital against medical advice (AMA).",
    beforeZh: "一名精神上有行为能力的患者决定违背医嘱（AMA）离开医院。护士应确保 {{1}}，因为 {{2}}。",
    afterZh: "一名精神上有行为能力的患者决定违背医嘱（AMA）离开医院。",
  },
  {
    queue: 902,
    id: "gap_50_bcc_02",
    beforeEn: "A client who is recovering from a right-sided stroke with left-sided weakness is being instructed on how to use a single-ended cane. The nurse should instruct the client to hold the cane on the {{1}} side and advance the cane together with the {{2}} leg.",
    afterEn: "A client who is recovering from a right-sided stroke with left-sided weakness is being instructed on how to use a single-ended cane.",
    beforeZh: "一名因右侧中风导致左侧肢体无力的患者正在接受如何使用单脚手杖的指导。护士应指导患者将手杖握在 {{1}} 侧，并将手杖与 {{2}} 腿一起向前迈出。",
    afterZh: "一名因右侧中风导致左侧肢体无力的患者正在接受如何使用单脚手杖的指导。",
  },
  {
    queue: 904,
    id: "gap_50_bcc_04",
    beforeEn: "A nurse is providing foot care education to a client newly diagnosed with type 2 diabetes mellitus. The nurse should instruct the client to wash feet daily and {{1}} because {{2}}.",
    afterEn: "A nurse is providing foot care education to a client newly diagnosed with type 2 diabetes mellitus.",
    beforeZh: "护士正在向一名新诊断为 2 型糖尿病的患者提供足部护理教育。护士应指导患者每天洗脚并 {{1}}，因为 {{2}}。",
    afterZh: "护士正在向一名新诊断为 2 型糖尿病的患者提供足部护理教育。",
  },
  {
    queue: 905,
    id: "gap_50_bcc_05",
    beforeEn: "A nurse is implementing a bladder training program for a client with urge incontinence. The client should be instructed to void on a set schedule every 2 hours and to {{1}} if they feel an urge to urinate before the scheduled time, in order to {{2}}.",
    afterEn: "A nurse is implementing a bladder training program for a client with urge incontinence.",
    beforeZh: "护士正在为一名急迫性尿失禁患者实施膀胱训练计划。应指导患者每 2 小时按设定的时间表排尿一次，如果在预定时间之前感到尿急，则应 {{1}}，以便 {{2}}。",
    afterZh: "护士正在为一名急迫性尿失禁患者实施膀胱训练计划。",
  },
  {
    queue: 920,
    id: "gap_50_sic_07",
    beforeEn: "A nurse is caring for a client who is admitted with severe preeclampsia and is at risk for seizures (eclampsia). The nurse should ensure that {{1}} and {{2}} during a seizure event.",
    afterEn: "A nurse is caring for a client who is admitted with severe preeclampsia and is at risk for seizures (eclampsia).",
    beforeZh: "护士正在护理一名因重度子痫前期入院且有抽搐风险（子痫）的患者。护士应确保 {{1}} 并在抽搐发作期间 {{2}}。",
    afterZh: "护士正在护理一名因重度子痫前期入院且有抽搐风险（子痫）的患者。",
  },
  {
    queue: 921,
    id: "gap_50_sic_08",
    beforeEn: "A nurse is caring for a client who is receiving internal radiation therapy (brachytherapy) for cervical cancer. The nurse should limit visits to {{1}} and ensure that visitor distance is maintained at {{2}}.",
    afterEn: "A nurse is caring for a client who is receiving internal radiation therapy (brachytherapy) for cervical cancer.",
    beforeZh: "护士正在护理一名因宫颈癌接受内放射治疗（近距离放射治疗）的患者。护士应将探视限制在 {{1}}，并确保探视距离保持在 {{2}}。",
    afterZh: "护士正在护理一名因宫颈癌接受内放射治疗（近距离放射治疗）的患者。",
  },
  {
    queue: 931,
    id: "gap_50_ppt_06",
    beforeEn: "A physician orders 2 mg of IV morphine sulfate. The medication is available in a prefilled syringe containing 4 mg/mL. The nurse should administer 0.5 mL and waste the remaining 0.5 mL. The nurse must perform the wasting of the narcotic {{1}} and ensure that {{2}}.",
    afterEn: "A physician orders 2 mg of IV morphine sulfate. The medication is available in a prefilled syringe containing 4 mg/mL. The nurse should administer 0.5 mL and waste the remaining 0.5 mL.",
    beforeZh: "医生开医嘱静脉注射 2 毫克硫酸吗啡。该药物在含有 4 毫克/毫升的预充式注射器中提供。护士应注射 0.5 毫升，并废弃剩余的 0.5 毫升。护士必须 {{1}} 废弃该麻醉药，并确保 {{2}}。",
    afterZh: "医生开医嘱静脉注射 2 毫克硫酸吗啡。该药物在含有 4 毫克/毫升的预充式注射器中提供。护士应注射 0.5 毫升，并废弃剩余的 0.5 毫升。",
  },
  {
    queue: 932,
    id: "gap_50_ppt_07",
    beforeEn: "A client is receiving a continuous intravenous heparin infusion for a deep vein thrombosis. The nurse should monitor the client's {{1}} to assess therapeutic effectiveness and adjust the infusion rate, while keeping {{2}} available as the antidote.",
    afterEn: "A client is receiving a continuous intravenous heparin infusion for a deep vein thrombosis.",
    beforeZh: "一名深静脉血栓患者正在接受持续静脉注射肝素输注。护士应监测患者的 {{1}} 以评估治疗效果并调整输注速度，同时保持 {{2}} 作为解毒剂备用。",
    afterZh: "一名深静脉血栓患者正在接受持续静脉注射肝素输注。",
  },
  {
    queue: 933,
    id: "gap_50_ppt_08",
    beforeEn: "A client is prescribed a drug with a half-life of 6 hours. The client takes a single dose of 400 mg. After 24 hours, the nurse should expect that {{1}} of the drug remains in the client's body, which corresponds to {{2}}.",
    afterEn: "A client is prescribed a drug with a half-life of 6 hours. The client takes a single dose of 400 mg.",
    beforeZh: "患者被开具了半衰期为 6 小时的药物。患者服用单次剂量 400 毫克。24 小时后，护士应预期患者体内残留该药物的 {{1}}，这对应于 {{2}}。",
    afterZh: "患者被开具了半衰期为 6 小时的药物。患者服用单次剂量 400 毫克。",
  },
];

const ops: PatchOp[] = entries.flatMap((entry) => [
  setValue({ id: entry.id, path: ["stem", "en"], before: entry.beforeEn, after: entry.afterEn, note: `Queue ${entry.queue} OP-B: remove the duplicated ordinary-stem response surface.` }),
  setValue({ id: entry.id, path: ["stem", "zh"], before: entry.beforeZh, after: entry.afterZh, note: `Queue ${entry.queue} OP-B: paired Chinese removal.` }),
]);

type Bank = { questions: Array<Record<string, unknown>> };

function loadBank(path: string): Bank {
  return JSON.parse(readFileSync(path, "utf8")) as Bank;
}

function questionMap(path: string): Map<string, Record<string, unknown>> {
  const bank = loadBank(path);
  const map = new Map<string, Record<string, unknown>>();
  for (const entry of entries) {
    const matches = bank.questions.filter((question) => question.id === entry.id);
    if (matches.length !== 1) throw new Error(`${entry.id} matched ${matches.length} top-level questions`);
    map.set(entry.id, matches[0]);
  }
  return map;
}

function states(path: string): Array<"before" | "after" | "stale"> {
  const map = questionMap(path);
  return entries.flatMap((entry) => {
    const stem = map.get(entry.id)!.stem as Record<string, unknown>;
    return [
      stem.en === entry.beforeEn ? "before" : stem.en === entry.afterEn ? "after" : "stale",
      stem.zh === entry.beforeZh ? "before" : stem.zh === entry.afterZh ? "after" : "stale",
    ];
  });
}

function nonTargetSnapshot(path: string): string {
  const map = questionMap(path);
  return JSON.stringify(entries.map((entry) => {
    const question = structuredClone(map.get(entry.id)!);
    delete (question.stem as Record<string, unknown>).en;
    delete (question.stem as Record<string, unknown>).zh;
    return question;
  }));
}

function assertPostconditions(path: string): void {
  const map = questionMap(path);
  for (const entry of entries) {
    const question = map.get(entry.id)!;
    const stem = question.stem as Record<string, string>;
    for (const locale of ["en", "zh"] as const) {
      if (!stem[locale]) throw new Error(`queue ${entry.queue} stem.${locale} is empty`);
      if (/\{\{[^}]+\}\}/.test(stem[locale])) throw new Error(`queue ${entry.queue} stem.${locale} retains a placeholder`);
      if (stem[locale] !== stem[locale].trim()) throw new Error(`queue ${entry.queue} stem.${locale} has boundary whitespace`);
      if (/  /.test(stem[locale])) throw new Error(`queue ${entry.queue} stem.${locale} has doubled spaces`);
    }
    if (!question.clozeStem || !question.dropdowns) throw new Error(`queue ${entry.queue} lost dropdown response fields`);
  }
}

function internal(): void {
  const path = resolve(process.argv[process.argv.indexOf("--in") + 1]);
  const current = states(path);
  if (current.every((value) => value === "after")) {
    console.log("gemini WU-2: idempotent; zero writes");
    return;
  }
  if (current.some((value) => value === "stale")) throw new Error(`BLOCKED_PATCH_PRECONDITION: WU-2 states=${current.join(",")}`);
  runPatch(ops.filter((_, index) => current[index] === "before"));
}

function main(): void {
  if (process.argv.includes("--internal")) return internal();
  const write = process.argv.includes("--write");
  const target = resolve(BANK_PATH);
  const current = states(target);
  if (current.every((value) => value === "after")) {
    console.log("Mode: IDEMPOTENCY CHECK\nAffected bank: banks/gemini-canonical.json\nWU-2 pending paths: 0; zero writes");
    return;
  }
  if (current.some((value) => value === "stale")) throw new Error(`BLOCKED_PATCH_PRECONDITION: WU-2 states=${current.join(",")}`);

  const beforeInvariant = nonTargetSnapshot(target);
  const tempRoot = write ? null : mkdtempSync(join(tmpdir(), "terminal-wu2-gemini-"));
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
    if (!states(out).every((value) => value === "after")) throw new Error("WU-2 postcondition state failed");
    assertPostconditions(out);
    if (nonTargetSnapshot(out) !== beforeInvariant) throw new Error("WU-2 non-target fields changed (including clozeStem or dropdowns)");
    console.log("clozeStem/dropdowns and all non-target fields: byte-identical as JSON values");
  } finally {
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  }
  console.log(`Mode: ${write ? "APPLY" : "DRY RUN"}`);
  console.log(`Rows: ${entries.map((entry) => entry.queue).join(", ")}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
