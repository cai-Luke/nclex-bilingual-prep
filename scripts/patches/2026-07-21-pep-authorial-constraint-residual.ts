import { copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { setValue, runPatch, type JsonPath, type PatchOp } from "../patch-raw";

const bankPath = "banks/gpt-canonical.json";
const id = "gpt_format10c_occupational_sharps_hiv_pep_sequence";
const reason = "repair post-survey PEP authorial-constraint residual and preserve clinically concurrent urgent actions";

export const PEP_RESIDUAL_OPS: PatchOp[] = [
  setValue({
    id, path: ["stem", "en"],
    before: "A nurse sustains a deep puncture from a hollow-bore needle just used in a client's vein. The source client's HIV status is not yet known, and the nurse is not taking PrEP. During urgent occupational-health evaluation, the clinician determines that HIV PEP is indicated while source testing is pending. Place the supplied actions in order. Source-patient testing and exposed-worker testing are separate processes; do not delay indicated PEP for a source result.",
    after: "A nurse sustains a deep puncture from a hollow-bore needle just used in a client's vein. The source client's HIV status is unknown, and the nurse is not taking PrEP. During urgent occupational-health evaluation, the clinician determines that HIV PEP is indicated. Place the exposed nurse's postexposure-care actions in order.",
    note: "Remove producer-style supplied-actions phrasing and the adjudication-note sentence; scope the ordered response to the exposed nurse's care.",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名护士被刚用于患者静脉的空心针深度刺伤。来源患者的 HIV 状态尚不明确，护士未使用 PrEP。在紧急职业健康评估中，临床人员判定在等待来源检测期间需要 HIV PEP。请按顺序排列所给措施。来源患者检测和暴露工作人员检测是两个独立过程；不得因等待来源结果而延迟已指征的 PEP。",
    after: "一名护士被刚用于患者静脉的空心针深度刺伤。来源患者的 HIV 状态未知，护士未使用 PrEP。在紧急职业健康评估中，临床人员判定需要 HIV PEP。请按顺序排列暴露护士的暴露后照护措施。",
    note: "Chinese parity for the exposed-worker-only response demand.",
  }),
  setValue({
    id, path: ["options", { id: "B" }, "en"],
    before: "Report the exposure immediately and begin occupational-health evaluation, with exposed-worker baseline testing and source-patient testing initiated as separate processes.",
    after: "Report the exposure immediately and begin occupational-health evaluation.",
    note: "Remove source-patient testing from the exposed-worker ordered sequence.",
  }),
  setValue({
    id, path: ["options", { id: "B" }, "zh"],
    before: "立即报告暴露并开始职业健康评估，分别启动暴露工作人员基线检测和来源患者检测。",
    after: "立即报告暴露并开始职业健康评估。",
    note: "Chinese parity for option B.",
  }),
  setValue({
    id, path: ["options", { id: "C" }, "en"],
    before: "Start the recommended PEP regimen as soon as possible without waiting for the pending source-patient result.",
    after: "During the initial evaluation, obtain the exposed worker's baseline tests and start the recommended PEP regimen as soon as possible.",
    note: "Combine the two urgent exposed-worker processes instead of assigning them an arbitrary serial order.",
  }),
  setValue({
    id, path: ["options", { id: "C" }, "zh"],
    before: "尽快开始推荐的 PEP 方案，不等待尚未出的来源患者结果。",
    after: "在初始评估期间采集暴露工作人员的基线检测，并尽快开始推荐的 PEP 方案。",
    note: "Chinese parity for option C.",
  }),
  setValue({
    id, path: ["rationale", "correct", "en"],
    before: "First wash the puncture with soap and water. Report the exposure immediately and enter occupational-health evaluation, where the exposed worker's baseline testing and source-patient testing are initiated separately. Once PEP is judged indicated, start it as soon as possible and do not wait for the source result. Re-evaluate within 72 hours for tolerability, adherence, counseling, and new source information; PEP and follow-up can stop if the source is confirmed HIV negative. Complete the scheduled exposed-worker testing, including final Ag/Ab plus NAT at 12 weeks; interim 4- to 6-week testing is added when the 2025 guideline's conditions apply.",
    after: "First wash the puncture with soap and water. Report the exposure immediately and enter occupational-health evaluation. During the initial evaluation, obtain the exposed worker's baseline tests and start indicated PEP as soon as possible. Source-patient testing proceeds concurrently and must not delay PEP; PEP and HIV follow-up can stop if the source is confirmed HIV negative. Re-evaluate within 72 hours for tolerability, adherence, counseling, and new source information. Complete the scheduled exposed-worker testing, including final Ag/Ab plus NAT at 12 weeks; interim 4- to 6-week testing is added when the 2025 guideline's conditions apply.",
    note: "Teach source testing as a concurrent rationale fact, not an ordered action or stem adjudication note.",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "首先用肥皂和水清洗刺伤。立即报告暴露并进入职业健康评估，在此分别启动暴露工作人员的基线检测和来源患者检测。一旦判定有 PEP 指征，应尽快开始，不能等待来源结果。72 小时内复评耐受性、依从性、咨询需求及新的来源信息；若来源确认 HIV 阴性，可停止 PEP 和后续 HIV 检测。完成计划的暴露工作人员检测，包括第 12 周最终抗原/抗体加 NAT；若符合 2025 指南条件，则增加第 4–6 周中期检测。",
    after: "首先用肥皂和水清洗刺伤。立即报告暴露并进入职业健康评估。在初始评估期间采集暴露工作人员的基线检测，并尽快开始已指征的 PEP。来源患者检测应同步进行，不得延迟 PEP；若来源确认 HIV 阴性，可停止 PEP 和后续 HIV 检测。72 小时内复评耐受性、依从性、咨询需求及新的来源信息。完成计划的暴露工作人员检测，包括第 12 周最终抗原/抗体加 NAT；若符合 2025 指南条件，则增加第 4–6 周中期检测。",
    note: "Chinese parity for the concurrent source-testing rationale.",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "B" }, "en"],
    before: "Prompt reporting and evaluation establish the exposure details and begin separate worker and source testing.",
    after: "Prompt reporting follows first aid and starts the occupational-health evaluation before initial testing and indicated PEP are carried out.",
    note: "Make B's serial role reporting/evaluation only.",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "B" }, "zh"],
    before: "及时报告和评估可明确暴露细节，并分别开始工作人员和来源检测。",
    after: "及时报告应在急救后进行，并启动职业健康评估，随后实施初始检测和已指征的 PEP。",
    note: "Chinese parity for B's serial role.",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "C" }, "en"],
    before: "When PEP is indicated, the 2025 PHS guideline says to start as soon as possible and not delay for source-status information.",
    after: "The exposed worker's baseline tests and indicated PEP are both urgent initial-evaluation care; source-patient testing is concurrent and must not delay PEP.",
    note: "Explain the combined urgent step and concurrent source process.",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "C" }, "zh"],
    before: "有 PEP 指征时，2025 PHS 指南要求尽快开始，不能因来源状态信息而延迟。",
    after: "暴露工作人员的基线检测和已指征的 PEP 都属于紧急初始评估照护；来源患者检测应同步进行，不得延迟 PEP。",
    note: "Chinese parity for the combined urgent step.",
  }),
  setValue({
    id, path: ["testTakingStrategy", "en"],
    before: "Keep immediate first aid separate from occupational evaluation, and keep source testing separate from the decision not to delay PEP.",
    after: "Order the exposed nurse's care by time horizon: immediate first aid, reporting and evaluation, urgent baseline testing plus PEP initiation, 72-hour reassessment, then scheduled follow-up.",
    note: "Replace construction commentary with the exposed-worker time-horizon strategy.",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "把立即急救与职业健康评估分开，并把来源检测与“不得延迟 PEP”的决定分开。",
    after: "按时间阶段排列暴露护士的照护：立即急救、报告和评估、紧急基线检测并开始 PEP、72 小时复评，最后是计划随访。",
    note: "Chinese parity for the time-horizon strategy.",
  }),
];

function resolveValue(question: Record<string, unknown>, path: JsonPath): unknown {
  let current: unknown = question;
  for (const segment of path) {
    if (typeof segment === "string" || typeof segment === "number") current = (current as Record<string | number, unknown>)[segment];
    else {
      const key: "id" | "refId" = "id" in segment ? "id" : "refId";
      const value = "id" in segment ? segment.id : segment.refId;
      const matches = (current as Array<Record<string, unknown>>).filter((entry) => entry[key] === value);
      if (matches.length !== 1) throw new Error(`${key}=${value} matched ${matches.length}`);
      current = matches[0];
    }
  }
  return current;
}

function pendingOps(path: string): PatchOp[] {
  const bank = JSON.parse(readFileSync(path, "utf8")) as { questions: Array<Record<string, unknown>> };
  const matches = bank.questions.filter((question) => question.id === id);
  if (matches.length !== 1) throw new Error(`${id} matched ${matches.length} questions`);
  return PEP_RESIDUAL_OPS.filter((op) => {
    if (op.kind !== "setValue") throw new Error(`Unexpected operation ${op.kind}`);
    const current = resolveValue(matches[0], op.path);
    if (JSON.stringify(current) === JSON.stringify(op.after)) return false;
    if (JSON.stringify(current) !== JSON.stringify(op.before)) throw new Error(`BLOCKED_PATCH_PRECONDITION ${JSON.stringify(op.path)}`);
    return true;
  });
}

function internal(): void {
  const input = resolve(process.argv[process.argv.indexOf("--in") + 1]);
  const pending = pendingOps(input);
  if (pending.length === 0) return void console.log("gpt-canonical.json: idempotent; zero writes");
  runPatch(pending);
}

function main(): void {
  if (process.argv.includes("--internal")) return internal();
  const write = process.argv.includes("--write");
  const target = resolve(bankPath);
  const pending = pendingOps(target);
  if (pending.length === 0) return void console.log("Mode: IDEMPOTENCY CHECK\nPending paths: 0; zero writes");
  const tempRoot = write ? null : mkdtempSync(join(tmpdir(), "pep-authorial-residual-dry-run-"));
  const output = write ? target : join(tempRoot!, basename(target));
  if (!write) copyFileSync(target, output);
  try {
    const child = spawnSync("npx", ["tsx", fileURLToPath(import.meta.url), "--internal", "--in", output, "--out", output, "--allow-canonical", "--reason", write ? reason : "dry-run simulation only", "--strict-parity"], { encoding: "utf8" });
    process.stdout.write(child.stdout);
    process.stderr.write(child.stderr);
    if (child.status !== 0) process.exit(child.status ?? 1);
  } finally {
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  }
  console.log(`Mode: ${write ? "APPLY" : "DRY RUN"}`);
  console.log(`Item: ${id}`);
  console.log(`Declared paths: ${PEP_RESIDUAL_OPS.length}; pending paths: ${pending.length}`);
  console.log("Disposition: BLOCKED_ITEM_REWRITE resolved by exposed-worker-only sequence; independent review pending");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
