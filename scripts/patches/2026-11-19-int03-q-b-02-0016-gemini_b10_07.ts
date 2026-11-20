/**
 * RG-02 Track A candidate — Q-B-02-0016 / gemini_b10_07 (banks/gemini-canonical.json questions[191]).
 * PRODUCER ARGUMENT (header and `note` fields): sealed from the RG-02 checker until Stage C.
 *
 * Confirmed defect (B-02-03 adjudication): universal notify-before-restore dependency.
 * Repair: the stem states that the replacement system is on its way; option C becomes the report
 * of the disconnection, replacement and respiratory findings, which can only follow reconnection.
 * Key A,B,C,D -> A,B,D,C. Option IDs, count, display order, itemType and taxonomy are unchanged.
 * Leaf-level en/zh ops only; `correct` is a declared non-text op. Run with --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_b10_07";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["stem", "en"],
    before: "A client with a chest tube is being repositioned when the chest tube becomes disconnected from the drainage system. List the nurse's actions in the correct order of priority.",
    after: "A client with a chest tube is being repositioned when the chest tube becomes disconnected from the drainage system. A colleague is bringing a new drainage system to the bedside. List the nurse's actions in order.",
    note: "Stem fact: the replacement system is not yet at the bedside, so reconnection cannot be the immediate action.",
  }),
  setValue({
    id: ID, path: ["stem", "zh"],
    before: "一名置有胸腔引流管的患者在搬动体位时，引流管与引流系统断开。请按优先级顺序列出护士的操作步骤。",
    after: "一名置有胸腔引流管的患者在搬动体位时，引流管与引流系统断开。一名同事正在把新的引流系统送到床旁。请按顺序列出护士的操作步骤。",
  }),
  setValue({
    id: ID, path: ["options", { id: "C" }, "en"],
    before: "Notify the healthcare provider.",
    after: "Report the disconnection, the drainage system replacement, and the client's respiratory findings to the healthcare provider.",
    note: "Same action identity (provider notification), now specified as the report of the event and its outcome.",
  }),
  setValue({
    id: ID, path: ["options", { id: "C" }, "zh"],
    before: "通知医疗保健提供者。",
    after: "向医疗保健提供者报告引流管断开、引流系统更换情况以及患者的呼吸评估结果。",
  }),
  setValue({
    id: ID, path: ["correct"],
    before: ["A", "B", "C", "D"],
    after: ["A", "B", "D", "C"],
    note: "Declared key change; non-text op, exempt from the parity check by nature.",
  }),
  setValue({
    id: ID, path: ["rationale", "correct", "en"],
    before: "The absolute priority is to restore the water seal to prevent air from entering the pleural space, which is achieved by submerging the tube in sterile water. Assessment and notification follow, before preparing a new system.",
    after: "Placing the end of the disconnected chest tube in sterile water creates a temporary water seal that stops air from being drawn into the pleural space; a container of sterile water is kept at the bedside for this purpose, so the seal takes only seconds. The nurse then assesses respiratory status and lung sounds while the new system is on its way. If the client shows respiratory distress or a sudden change in vital signs, the nurse calls for immediate help, such as the rapid response team, rather than waiting for the new system. When the new system arrives, the tube ends are cleaned and connected to it so that closed drainage is restored promptly. Notifying the provider is not a prerequisite for restoring the system; this report describes the disconnection, the replacement, and the client's findings, so it is made once the replacement is complete.",
  }),
  setValue({
    id: ID, path: ["rationale", "correct", "zh"],
    before: "绝对优先事项是恢复水封以防止空气进入胸膜腔，这通过将管子浸入无菌水中来实现。随后进行评估和通知，然后准备新的系统。",
    after: "将断开的胸腔引流管末端置于无菌水中可形成临时水封，阻止空气被吸入胸膜腔；床旁备有无菌水正是为此，因此建立水封只需几秒钟。随后，在新系统送达之前，护士评估患者的呼吸状况并听诊肺部。如果患者出现呼吸窘迫或生命体征突然变化，护士应立即呼叫援助（如快速反应团队），而不是等待新系统。新系统送达后，清洁引流管两端并连接到新系统，从而及时恢复密闭引流。通知医疗保健提供者并不是恢复引流系统的前提；这份报告描述引流管断开、系统更换以及患者的评估结果，因此在更换完成后进行。",
  }),
  setValue({
    id: ID, path: ["rationale", "byChoice", { refId: "C" }, "en"],
    before: "The provider must be notified immediately to address the potential for complications.",
    after: "Reporting the disconnection, the replacement, and the respiratory findings lets the provider decide whether further evaluation is needed.",
  }),
  setValue({
    id: ID, path: ["rationale", "byChoice", { refId: "C" }, "zh"],
    before: "必须立即通知提供者以处理潜在的并发症。",
    after: "报告引流管断开、系统更换情况和呼吸评估结果，便于医疗保健提供者判断是否需要进一步评估。",
  }),
  setValue({
    id: ID, path: ["rationale", "byChoice", { refId: "D" }, "en"],
    before: "Reconnecting to a new system is the final step once the client is safe and stable.",
    after: "Cleaning the tube ends and connecting them to the new system restores closed chest drainage as soon as the replacement arrives.",
    note: "Register row: removes the 'final step' mandate over notification.",
  }),
  setValue({
    id: ID, path: ["rationale", "byChoice", { refId: "D" }, "zh"],
    before: "一旦患者安全稳定，重新连接到新系统是最后一步。",
    after: "清洁引流管两端并连接到新系统，可在替换系统送达后尽快恢复密闭胸腔引流。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
