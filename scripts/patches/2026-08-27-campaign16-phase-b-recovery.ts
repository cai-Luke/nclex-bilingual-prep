/**
 * Campaign 16 Phase B, Stage 1: bounded repairs for the 13 quarantined FIX
 * payloads. The input must be the programmatically materialized archive
 * questions in their original IDs. Each row's semantic edits precede its
 * final `_r2` ID mint.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { replaceText, runPatch, setValue } from "../patch-raw";

const materializeFlag = "--materialize-from-archive";

function archiveHash(question: unknown): string {
  return createHash("sha256").update(JSON.stringify(question, null, 2)).digest("hex");
}

function materializeArchiveInput(): void {
  if (!process.argv.includes(materializeFlag)) return;

  const inIndex = process.argv.indexOf("--in");
  if (inIndex < 0 || !process.argv[inIndex + 1]) {
    throw new Error(`${materializeFlag} requires --in <raw candidate path>`);
  }

  const repoRoot = resolve(process.cwd());
  const inputPath = resolve(repoRoot, process.argv[inIndex + 1]);
  const expectedInputPath = resolve(
    repoRoot,
    "banks/banks-raw/gpt-campaign16-phase-b-recovery-2026-08-27.json",
  );
  if (inputPath !== expectedInputPath) {
    throw new Error(`${materializeFlag} is scoped to ${expectedInputPath}; received ${inputPath}`);
  }
  if (existsSync(inputPath)) {
    throw new Error(`refusing to overwrite existing materialized input: ${inputPath}`);
  }

  const archiveDir = resolve(
    repoRoot,
    "Archive/gpt-july16-construct-dispositions-2026-07-21",
  );
  const archive = JSON.parse(
    readFileSync(resolve(archiveDir, "quarantined-fix-items.json"), "utf8"),
  ) as {
    count: number;
    items: Array<{ id: string; payloadSha256: string; question: Record<string, unknown> }>;
  };
  const archiveManifest = JSON.parse(
    readFileSync(resolve(archiveDir, "manifest.json"), "utf8"),
  ) as {
    quarantinedFixCount: number;
    quarantinedPayloads: Array<{ id: string; payloadSha256: string }>;
  };
  const manifestHashes = new Map(
    archiveManifest.quarantinedPayloads.map((row) => [row.id, row.payloadSha256]),
  );

  if (
    archive.count !== 13 ||
    archive.items.length !== 13 ||
    archiveManifest.quarantinedFixCount !== 13 ||
    archiveManifest.quarantinedPayloads.length !== 13
  ) {
    throw new Error("archive/manifest count reconciliation failed before materialization");
  }
  if (new Set(archive.items.map((row) => row.id)).size !== 13) {
    throw new Error("archive IDs are not unique before materialization");
  }

  for (const row of archive.items) {
    if (row.question.id !== row.id) {
      throw new Error(`archive wrapper/question ID mismatch for ${row.id}`);
    }
    const computed = archiveHash(row.question);
    if (computed !== row.payloadSha256 || computed !== manifestHashes.get(row.id)) {
      throw new Error(`archive-convention payload hash mismatch for ${row.id}`);
    }
  }

  const canonical = JSON.parse(
    readFileSync(resolve(repoRoot, "banks/gpt-canonical.json"), "utf8"),
  ) as { meta: Record<string, unknown> };
  const meta = JSON.parse(JSON.stringify(canonical.meta)) as Record<string, unknown>;
  meta.count = archive.items.length;
  const envelope = {
    meta,
    questions: archive.items.map((row) => JSON.parse(JSON.stringify(row.question))),
  };

  mkdirSync(dirname(inputPath), { recursive: true });
  writeFileSync(inputPath, `${JSON.stringify(envelope, null, 2)}\n`, "utf8");
  process.stdout.write(
    `Materialized ${archive.items.length} archive-verified questions at ${inputPath}\n`,
  );
}

materializeArchiveInput();

export const ops = [
  setValue({
    id: "gpt_balance2_2026_07_15_dc_client_advocacy_02",
    path: ["dropdowns", { id: "right" }, "options", { id: "p3" }, "en"],
    before: "public access to the clinical encounter",
    after: "informed consent for the examination",
    note: "Replace an absurd rights distractor with a plausible but scenario-inapposite patient-rights concept.",
  }),
  setValue({
    id: "gpt_balance2_2026_07_15_dc_client_advocacy_02",
    path: ["dropdowns", { id: "right" }, "options", { id: "p3" }, "zh"],
    before: "公众接触临床过程",
    after: "对检查作出知情同意",
    note: "Chinese parity for the p3 rights distractor.",
  }),
  setValue({
    id: "gpt_balance2_2026_07_15_dc_client_advocacy_02",
    path: ["dropdowns", { id: "right" }, "options", { id: "p2" }, "en"],
    before: "staff convenience during scheduling",
    after: "refusal of the examination itself",
    note: "Replace an absurd rights distractor with a plausible but scenario-inapposite patient-rights concept.",
  }),
  setValue({
    id: "gpt_balance2_2026_07_15_dc_client_advocacy_02",
    path: ["dropdowns", { id: "right" }, "options", { id: "p2" }, "zh"],
    before: "工作人员排班便利",
    after: "拒绝检查本身",
    note: "Chinese parity for the p2 rights distractor.",
  }),
  setValue({
    id: "gpt_balance2_2026_07_15_dc_client_advocacy_02",
    path: ["rationale", "byChoice", { refId: "right" }, "en"],
    before: "The governing rights are personal privacy and participation in care, not staff convenience or public reporting.",
    after: "The governing rights in this scenario are personal privacy and participation in care. The client is not refusing the examination itself, and the issue is not whether the examination was explained for informed consent.",
    note: "Align the rationale with the repaired rights distractors without changing the key.",
  }),
  setValue({
    id: "gpt_balance2_2026_07_15_dc_client_advocacy_02",
    path: ["rationale", "byChoice", { refId: "right" }, "zh"],
    before: "适用的权利是个人隐私和参与护理，而不是工作人员便利或公开报告。",
    after: "本情境中适用的权利是个人隐私和参与护理。患者并未拒绝检查本身，问题也不在于是否已就检查进行知情同意说明。",
    note: "Chinese parity for the repaired rights rationale.",
  }),
  setValue({
    id: "gpt_balance2_2026_07_15_dc_client_advocacy_02",
    path: ["id"],
    before: "gpt_balance2_2026_07_15_dc_client_advocacy_02",
    after: "gpt_balance2_2026_07_15_dc_client_advocacy_02_r2",
    note: "Mint revision lineage after every semantic edit for this row.",
  }),

  setValue({
    id: "gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08",
    path: ["dropdowns", { id: "d1" }, "options", { id: "o3" }, "en"],
    before: "the client’s preferred injection site only",
    after: "the last injection site, needle length, and administration technique",
    note: "Replace a crude incomplete option with a plausible but nonessential documentation cluster.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08",
    path: ["dropdowns", { id: "d1" }, "options", { id: "o3" }, "zh"],
    before: "仅患者偏好的注射部位",
    after: "末次注射部位、针头长度及给药技术",
    note: "Chinese parity for the d1/o3 distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08",
    path: ["dropdowns", { id: "d1" }, "options", { id: "o2" }, "en"],
    before: "only the medication class",
    after: "the medication class, indication, and prescribing service",
    note: "Replace a crude incomplete option with plausible but insufficient handoff information.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08",
    path: ["dropdowns", { id: "d1" }, "options", { id: "o2" }, "zh"],
    before: "仅药物类别",
    after: "药物类别、适应证及开立处方的科室",
    note: "Chinese parity for the d1/o2 distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08",
    path: ["dropdowns", { id: "d2" }, "options", { id: "o2" }, "en"],
    before: "the date of the next routine physical examination",
    after: "the date of the last injection",
    note: "Replace an unrelated visit date with a clinically relevant but redundant medication date.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08",
    path: ["dropdowns", { id: "d2" }, "options", { id: "o2" }, "zh"],
    before: "下次常规体检日期",
    after: "末次注射日期",
    note: "Chinese parity for the d2/o2 distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08",
    path: ["dropdowns", { id: "d2" }, "options", { id: "o3" }, "en"],
    before: "the pharmacy’s monthly inventory date",
    after: "the date of the next medication-review visit",
    note: "Replace an absurd administrative date with a plausible but non-dose-continuity date.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08",
    path: ["dropdowns", { id: "d2" }, "options", { id: "o3" }, "zh"],
    before: "药房每月盘点日期",
    after: "下次药物复诊日期",
    note: "Chinese parity for the d2/o3 distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08",
    path: ["id"],
    before: "gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08",
    after: "gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08_r2",
    note: "Mint revision lineage after every semantic edit for this row.",
  }),

  setValue({
    id: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    path: ["dropdowns", { id: "d1" }, "options", { id: "o3" }, "en"],
    before: "bleeding time",
    after: "orthostatic vital signs",
    note: "Use a medication-relevant monitoring concept as a plausible distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    path: ["dropdowns", { id: "d1" }, "options", { id: "o3" }, "zh"],
    before: "出血时间",
    after: "体位性生命体征",
    note: "Chinese parity for the d1/o3 distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    path: ["dropdowns", { id: "d1" }, "options", { id: "o2" }, "en"],
    before: "serum amylase",
    after: "white blood cell count",
    note: "Use a medication-relevant monitoring concept as a plausible distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    path: ["dropdowns", { id: "d1" }, "options", { id: "o2" }, "zh"],
    before: "血清淀粉酶",
    after: "白细胞计数",
    note: "Chinese parity for the d1/o2 distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    path: ["dropdowns", { id: "d2" }, "options", { id: "o2" }, "en"],
    before: "serum copper",
    after: "serum prolactin level",
    note: "Use a medication-relevant monitoring concept as a plausible distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    path: ["dropdowns", { id: "d2" }, "options", { id: "o2" }, "zh"],
    before: "血清铜",
    after: "血清催乳素水平",
    note: "Chinese parity for the d2/o2 distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    path: ["dropdowns", { id: "d2" }, "options", { id: "o3" }, "en"],
    before: "arterial blood gases",
    after: "liver transaminase panel",
    note: "Use a medication-relevant laboratory concept as a plausible distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    path: ["dropdowns", { id: "d2" }, "options", { id: "o3" }, "zh"],
    before: "动脉血气",
    after: "肝转氨酶检查",
    note: "Chinese parity for the d2/o3 distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    path: ["dropdowns", { id: "d3" }, "options", { id: "o2" }, "en"],
    before: "pupil size",
    after: "waist circumference",
    note: "Use a metabolic-monitoring concept as a plausible distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    path: ["dropdowns", { id: "d3" }, "options", { id: "o2" }, "zh"],
    before: "瞳孔大小",
    after: "腰围",
    note: "Chinese parity for the d3/o2 distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    path: ["dropdowns", { id: "d3" }, "options", { id: "o3" }, "en"],
    before: "hearing acuity",
    after: "standing blood pressure",
    note: "Use a medication-relevant monitoring concept as a plausible distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    path: ["dropdowns", { id: "d3" }, "options", { id: "o3" }, "zh"],
    before: "听力",
    after: "站立位血压",
    note: "Chinese parity for the d3/o3 distractor.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    path: ["id"],
    before: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11",
    after: "gpt_balance3_2026_07_16_dc_psychotropic_medications_11_r2",
    note: "Mint revision lineage after every semantic edit for this row.",
  }),

  replaceText({
    id: "gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13",
    path: ["stem", "en"],
    before: "The plan requires pre-numbered paper records, two patient identifiers, read-back of critical verbal results, contemporaneous paper medication documentation, and reconciliation before data are entered after recovery. Highlight the actions consistent with the activated plan.",
    after: "Highlight the actions that support safe care during downtime and recovery.",
    note: "Remove the answer-bearing downtime-plan recital while retaining the scenario and task.",
  }),
  replaceText({
    id: "gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13",
    path: ["stem", "zh"],
    before: "计划要求使用预编号纸质记录、核对两项患者身份、对危急口头结果进行复诵确认、实时记录纸质用药信息，并在系统恢复后录入前先完成核对。请标出符合该计划的措施。",
    after: "请标出在停机期间及恢复过程中支持安全护理的措施。",
    note: "Chinese parity for removal of the answer-bearing plan recital.",
  }),
  setValue({
    id: "gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13",
    path: ["id"],
    before: "gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13",
    after: "gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13_r2",
    note: "Mint revision lineage after every semantic edit for this row.",
  }),

  setValue({
    id: "gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18",
    path: ["stem", "en"],
    before: "During an active-shooter event, the hospital's emergency plan directs staff in unaffected locked units to secure in place, silence devices, stay away from doors and windows, and wait for an authenticated all-clear. After the all-clear, clinical teams begin triage in the designated safe area. Complete the response.",
    after: "During an active-shooter event, a nurse is in an unaffected locked hospital unit. An unverified voice in the corridor asks staff to open the door. Later, the hospital sends an authenticated all-clear. Complete the response.",
    note: "Replace the verbatim before/after answer recital with scenario cues only.",
  }),
  setValue({
    id: "gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18",
    path: ["stem", "zh"],
    before: "医院发生活跃枪手事件时，应急计划要求未受影响且已上锁的病区就地防护、将设备静音、远离门窗，并等待经验证的解除警报。解除警报后，临床团队在指定安全区域开始分诊。完成应对措施。",
    after: "医院发生活跃枪手事件时，一名护士位于未受影响且已上锁的病区。走廊里一个未经核实的声音要求工作人员开门。随后，医院发出经验证的解除警报。完成应对措施。",
    note: "Chinese parity for replacement of the answer-bearing recital with scenario cues.",
  }),
  setValue({
    id: "gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18",
    path: ["id"],
    before: "gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18",
    after: "gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18_r2",
    note: "Mint revision lineage after every semantic edit for this row.",
  }),

  setValue({
    id: "gpt_balance5_2026_07_16_mx_client_advocacy_02",
    path: ["stem", "en"],
    before: "A stable medical-surgical inpatient uses a trained service dog that alerts to impending seizures. Classify each proposed staff action. Under the ADA, when the dog's task is not obvious, staff may ask only whether the dog is required because of a disability and what work or task it has been trained to perform. Staff may not demand certification or a task demonstration. The handler is responsible for the animal's care. Exclusion is permitted only for a specific allowed reason, such as a dog being out of control and the handler not taking effective action.",
    after: "A stable medical-surgical inpatient uses a trained service dog that alerts to impending seizures. Classify each proposed staff action as supporting or not supporting client advocacy.",
    note: "Remove the complete ADA rule recital that duplicated the matrix rows.",
  }),
  setValue({
    id: "gpt_balance5_2026_07_16_mx_client_advocacy_02",
    path: ["stem", "zh"],
    before: "一名病情稳定的内外科住院患者使用一只经过训练、可预警即将发生癫痫发作的服务犬。请对每项拟议的工作人员行动进行分类。根据 ADA，当服务犬的任务并不明显时，工作人员只能询问该犬是否因残障而需要，以及它受过训练可执行什么工作或任务。工作人员不得要求出示认证或让犬现场演示任务。服务犬的照护由其引导者负责。只有在特定允许理由下，例如服务犬失控且引导者未采取有效纠正措施时，才可将其排除。",
    after: "一名病情稳定的内外科住院患者使用一只经过训练、可预警即将发生癫痫发作的服务犬。请将每项拟议的工作人员行动分类为支持或不支持患者权益维护。",
    note: "Chinese parity for removal of the complete ADA rule recital.",
  }),
  setValue({
    id: "gpt_balance5_2026_07_16_mx_client_advocacy_02",
    path: ["id"],
    before: "gpt_balance5_2026_07_16_mx_client_advocacy_02",
    after: "gpt_balance5_2026_07_16_mx_client_advocacy_02_r2",
    note: "Mint revision lineage after every semantic edit for this row.",
  }),

  setValue({
    id: "gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13",
    path: ["stem", "en"],
    before: "After a mass-casualty incident, several unidentified clients arrive while families and media crowd the entrance. The activated hospital plan requires temporary unique identifiers, a continuously updated patient-tracking list, a designated family-reunification channel, and media release only through the public-information function. Highlight the actions consistent with this plan.",
    after: "After a mass-casualty incident, several unidentified clients arrive while families and media crowd the entrance. The hospital activates its mass-casualty plan. Highlight the actions that support safe identity management and coordinated family and public communication.",
    note: "Remove the four-answer plan recital while retaining the emergency-management domains.",
  }),
  setValue({
    id: "gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13",
    path: ["stem", "zh"],
    before: "大规模伤亡事件后，多名身份不明的患者到达医院，家属和媒体挤在入口处。已启动的医院计划要求使用临时唯一标识、持续更新患者追踪清单、设立指定的家属团聚渠道，并且只能通过公共信息职能发布媒体信息。请标出符合该计划的行动。",
    after: "大规模伤亡事件后，多名身份不明的患者到达医院，家属和媒体挤在入口处。医院启动大规模伤亡事件计划。请标出支持安全身份管理以及协调家属和公共信息沟通的行动。",
    note: "Chinese parity for removal of the four-answer plan recital.",
  }),
  setValue({
    id: "gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13",
    path: ["id"],
    before: "gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13",
    after: "gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13_r2",
    note: "Mint revision lineage after every semantic edit for this row.",
  }),

  setValue({
    id: "gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15",
    path: ["stem", "en"],
    before: "A blood-containing specimen tube breaks on the floor. The cleanup plan requires suitable PPE, mechanical collection of glass, sharps disposal, cleaning before disinfection, use of the disinfectant for its stated contact time, and hand hygiene. Classify each action.",
    after: "A blood-containing specimen tube breaks on the floor. Classify each proposed cleanup action as appropriate or unsafe.",
    note: "Remove the complete answer-bearing cleanup sequence from the stem.",
  }),
  setValue({
    id: "gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15",
    path: ["stem", "zh"],
    before: "一支含血液的标本管在地面破裂。清理计划要求使用合适的 PPE、用机械方法收集玻璃、放入锐器容器、先清洁后消毒、按消毒剂规定的接触时间使用，并进行手卫生。请对每项行动进行分类。",
    after: "一支含血液的标本管在地面破裂。请将每项拟议的清理行动分类为适当或不安全。",
    note: "Chinese parity for removal of the complete cleanup sequence.",
  }),
  setValue({
    id: "gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15",
    path: ["id"],
    before: "gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15",
    after: "gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15_r2",
    note: "Mint revision lineage after every semantic edit for this row.",
  }),

  setValue({
    id: "gpt_balance6a_2026_07_16_bt_perioperative_care_13",
    path: ["stem", "en"],
    before: "Minutes after a peripheral nerve block, a client reports metallic taste and tinnitus, becomes agitated, has a seizure, and then develops hypotension with a wide-complex dysrhythmia. The facility LAST protocol directs staff to stop local-anesthetic administration, activate the LAST rescue pathway, support the airway, treat the seizure, and administer 20% lipid emulsion according to the protocol. Complete the bowtie.",
    after: "Minutes after a peripheral nerve block, a client reports metallic taste and tinnitus, becomes agitated, has a seizure, and then develops hypotension with a wide-complex dysrhythmia. Complete the bowtie.",
    note: "Remove the named protocol and both keyed actions from the stem.",
  }),
  setValue({
    id: "gpt_balance6a_2026_07_16_bt_perioperative_care_13",
    path: ["stem", "zh"],
    before: "周围神经阻滞后数分钟，患者报告金属味和耳鸣，随后躁动、癫痫发作，并出现低血压和宽QRS心律失常。机构的LAST流程要求停止局麻药给药、启动LAST救援流程、支持气道、处理癫痫，并按流程给予20%脂肪乳。完成蝴蝶结题。",
    after: "周围神经阻滞后数分钟，患者报告金属味和耳鸣，随后躁动、癫痫发作，并出现低血压和宽QRS心律失常。完成蝴蝶结题。",
    note: "Chinese parity for removal of the named protocol and keyed actions.",
  }),
  setValue({
    id: "gpt_balance6a_2026_07_16_bt_perioperative_care_13",
    path: ["id"],
    before: "gpt_balance6a_2026_07_16_bt_perioperative_care_13",
    after: "gpt_balance6a_2026_07_16_bt_perioperative_care_13_r2",
    note: "Mint revision lineage after every semantic edit for this row.",
  }),

  setValue({
    id: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05",
    path: ["dropdowns", { id: "q05_d02" }, "options", { id: "q05_d02_o03" }, "en"],
    before: "facility directory management",
    after: "payment review by the client's health plan",
    note: "Replace a noncompeting administrative distractor with a plausible HIPAA TPO purpose.",
  }),
  setValue({
    id: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05",
    path: ["dropdowns", { id: "q05_d02" }, "options", { id: "q05_d02_o03" }, "zh"],
    before: "机构名录管理",
    after: "患者健康计划的付款审核",
    note: "Chinese parity for the q05_d02_o03 distractor.",
  }),
  setValue({
    id: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05",
    path: ["dropdowns", { id: "q05_d02" }, "options", { id: "q05_d02_o02" }, "en"],
    before: "appointment scheduling",
    after: "the hospital's quality-assessment health care operations",
    note: "Replace a noncompeting administrative distractor with a plausible HIPAA TPO purpose.",
  }),
  setValue({
    id: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05",
    path: ["dropdowns", { id: "q05_d02" }, "options", { id: "q05_d02_o02" }, "zh"],
    before: "预约安排",
    after: "医院的质量评估医疗运营",
    note: "Chinese parity for the q05_d02_o02 distractor.",
  }),
  setValue({
    id: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05",
    path: ["id"],
    before: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05",
    after: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05_r2",
    note: "Mint revision lineage after every semantic edit for this row.",
  }),

  setValue({
    id: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07",
    path: ["dropdowns", { id: "q07_d02" }, "options", { id: "q07_d02_o02" }, "en"],
    before: "requires limiting every disclosure to one page",
    after: "applies unless the client signs a separate authorization",
    note: "Replace the fictional one-page rule with a plausible but incorrect HIPAA condition.",
  }),
  setValue({
    id: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07",
    path: ["dropdowns", { id: "q07_d02" }, "options", { id: "q07_d02_o02" }, "zh"],
    before: "要求每次披露限制为一页",
    after: "除非患者另行签署授权，否则适用",
    note: "Chinese parity for the q07_d02_o02 distractor.",
  }),
  setValue({
    id: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07",
    path: ["rationale", "byChoice", { refId: "q07_d02" }, "en"],
    before: "The correct completion is does not apply. The treatment exception concerns provider-to-provider disclosures and requests, not an arbitrary page limit or the specialist's organizational location.",
    after: "The correct completion is does not apply. The treatment exception concerns provider-to-provider disclosures and requests; it is not conditioned on the specialist's organizational location or on a separate client authorization.",
    note: "Align the rationale with the repaired minimum-necessary distractor.",
  }),
  setValue({
    id: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07",
    path: ["rationale", "byChoice", { refId: "q07_d02" }, "zh"],
    before: "正确填空是“不适用”。治疗例外适用于医护提供者之间的披露和请求，与任意页数限制或专科医生是否属于同一机构无关。",
    after: "正确填空是“不适用”。治疗例外适用于医护提供者之间的披露和请求；其适用不取决于专科医生是否属于同一机构，也不以患者另行授权为条件。",
    note: "Chinese parity for the repaired minimum-necessary rationale.",
  }),
  setValue({
    id: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07",
    path: ["id"],
    before: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07",
    after: "gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07_r2",
    note: "Mint revision lineage after every semantic edit for this row.",
  }),

  setValue({
    id: "gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14",
    path: ["stem", "en"],
    before: "During a home peritoneal-dialysis exchange, the transfer set disconnects proximal to an open clamp and the open system is exposed. The client reconnects it and calls immediately; there is no abdominal pain and the effluent is currently clear. The PD program defines this event as wet contamination and directs the client to stop further use and close the system, contact the PD team for transfer-set management and prescribed prophylaxis, and complete the program's symptom and follow-up checks. Complete the bow-tie.",
    after: "During a home peritoneal-dialysis exchange, the transfer set disconnects proximal to an open clamp and the open system is exposed. The client reconnects it and calls immediately; there is no abdominal pain and the effluent is currently clear. Complete the bow-tie.",
    note: "Remove the keyed condition, both keyed actions, and follow-up recital from the stem.",
  }),
  setValue({
    id: "gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14",
    path: ["stem", "zh"],
    before: "在居家腹膜透析换液过程中，转接管在开放夹的近端脱开，开放系统暴露。患者重新连接后立即来电；目前没有腹痛，流出液清澈。腹膜透析项目将此事件定义为湿性污染，并指示患者停止继续使用并关闭系统，联系腹膜透析团队处理转接管和实施规定的预防措施，同时完成项目规定的症状监测和随访。请完成蝴蝶结题。",
    after: "在居家腹膜透析换液过程中，转接管在开放夹的近端脱开，开放系统暴露。患者重新连接后立即来电；目前没有腹痛，流出液清澈。请完成蝴蝶结题。",
    note: "Chinese parity for removal of the answer-bearing PD program recital.",
  }),
  setValue({
    id: "gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14",
    path: ["id"],
    before: "gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14",
    after: "gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14_r2",
    note: "Mint revision lineage after every semantic edit for this row.",
  }),

  setValue({
    id: "gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17",
    path: ["stem", "en"],
    before: "A nurse wearing artificial fingernail extensions is assigned direct care in the ICU. The facility policy states that artificial extensions are not worn for direct contact with high-risk ICU or operating-room patients and that natural nail tips are kept no longer than 1/4 inch (0.64 cm). Highlight the finding and corrective actions supported by the policy and CDC guidance.",
    after: "A nurse wearing artificial fingernail extensions is assigned direct care in the ICU. Highlight the finding and corrective actions supported by facility policy and CDC guidance.",
    note: "Remove the exact restriction and length limit that duplicated keyed highlight segments.",
  }),
  setValue({
    id: "gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17",
    path: ["stem", "zh"],
    before: "一名戴有人工指甲延长物的护士被安排在ICU直接照护患者。机构政策规定：与高风险ICU或手术室患者直接接触时不得佩戴人工指甲延长物，自然指甲尖端不得超过1/4英寸（0.64厘米）。请标出符合该政策和CDC指南的发现及纠正行动。",
    after: "一名戴有人工指甲延长物的护士被安排在ICU直接照护患者。请标出符合机构政策和CDC指南的发现及纠正行动。",
    note: "Chinese parity for removal of the exact restriction and length limit.",
  }),
  setValue({
    id: "gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17",
    path: ["id"],
    before: "gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17",
    after: "gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17_r2",
    note: "Mint revision lineage after every semantic edit for this row.",
  }),
] as const;

if (process.argv.includes("--print-ops-json")) {
  process.stdout.write(`${JSON.stringify(ops, null, 2)}\n`);
} else {
  runPatch([...ops]);
}
