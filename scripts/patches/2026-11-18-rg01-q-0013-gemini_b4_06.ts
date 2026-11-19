/**
 * Q-0013 / gemini_b4_06 — same-ID repair candidate (ordered_response, banks/gemini-canonical.json).
 * Producer: Claude Code / Claude Opus 5.5. CANDIDATE ONLY — not independently reviewed.
 * Disposition: ASTRA-ADJUDICATION-2026-11-17.md, item Q-0013 (CONFIRM FALSE_MANDATORY_SEQUENCE;
 * disrobe before contaminant removal; solids before water; do not universally irrigate an
 * unidentified, possibly water-reactive agent).
 *
 * Stem now places the powder on clothing and the skin beneath and states that poison control
 * has identified it as safe to irrigate. Key changes D,B,A,C -> D,A,B,C (declared key change).
 * Options unchanged. Rationale/strategy drop "absolute first step" (P4) and the brush-before-
 * disrobe claim, and keep the agent-specific caution about water.
 */
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gemini_b4_06";

export const ops: PatchOp[] = [
  setValue({
    id, path: ["stem", "en"],
    before: "A client has been exposed to a dry chemical powder on their arms and legs. In what order should the nurse perform decontamination? (Arrange the steps in the correct sequence.)",
    after: "A client arrives at the emergency department after a dry chemical powder spilled onto the client's clothing and the skin of both arms and legs. Poison control identifies the powder as one that can be safely irrigated with water. Place the following selected decontamination steps in the correct order.",
    note: "Powder on clothing and skin; agent identified as irrigable (no universal water claim).",
  }),
  setValue({
    id, path: ["stem", "zh"],
    before: "一名患者的胳膊和腿接触了干化学粉末。护士应按什么顺序进行去污？（按正确顺序排列步骤。）",
    after: "一名患者在干化学粉末洒落到其衣服以及双臂和双腿皮肤上后来到急诊科。中毒控制中心确认该粉末可以安全地用水冲洗。请将下列选定的去污步骤按正确顺序排列。",
  }),
  setValue({
    id, path: ["correct"],
    before: ["D", "B", "A", "C"],
    after: ["D", "A", "B", "C"],
    note: "Disrobe before skin decontamination (CHEMM; StatPearls per adjudication). Declared key change.",
  }),
  setValue({
    id, path: ["rationale", "correct", "en"],
    before: "First, the nurse must protect themselves (PPE). For dry chemicals, brush the powder off first because water may activate or spread certain dry chemicals. Then remove clothing and finally flush with water.",
    after: "The nurse puts on PPE before touching the client or the contaminated clothing, to prevent secondary exposure. Removing the contaminated clothing comes before any other decontamination, because clothing holds much of the contamination and the skin under it cannot be cleaned while it stays on; CHEMM guidance states that no form of decontamination should be undertaken before disrobing. Dry powder is then brushed off the skin before water is used, so the dry material is removed rather than dissolved and spread, and the remaining residue is flushed away with large amounts of water. Water is used here because poison control has identified the powder as safe to irrigate. Some chemicals react with water, so the identity of the agent and the instructions from poison control or the safety data sheet determine whether and how water is used.",
  }),
  setValue({
    id, path: ["rationale", "correct", "zh"],
    before: "首先，护士必须保护自己（PPE）。对于干化学品，应先刷掉粉末，因为水可能会激活或扩散某些干化学品。然后脱掉衣服，最后用水冲洗。",
    after: "护士在接触患者或受污染的衣物之前先穿戴PPE，以防止二次暴露。脱去受污染的衣物应在任何其他去污措施之前进行，因为衣物上附着了大量污染物，而且衣物未脱下时其下方的皮肤无法清洁；CHEMM指南指出，在脱去衣物之前不应进行任何形式的去污。随后先把皮肤上的干粉刷掉再用水，这样干燥物质会被清除而不是被溶解和扩散，最后用大量的水冲洗掉残留物。本题之所以用水，是因为中毒控制中心已确认该粉末可以安全冲洗。有些化学物质会与水发生反应，因此应根据化学物质的种类以及中毒控制中心或安全数据表的指示来决定是否用水以及如何用水。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "D" }, "en"],
    before: "Protecting the nurse with PPE is the absolute first step to prevent secondary exposure.",
    after: "PPE protects the nurse from secondary exposure and is put on before the nurse handles the client or the contaminated clothing.",
    note: "Removes ordinal 'first step' (P4).",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "D" }, "zh"],
    before: "穿戴 PPE 保护护士是防止二次暴露的绝对第一步。",
    after: "PPE可保护护士免受二次暴露，应在护士接触患者或受污染的衣物之前穿戴。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "B" }, "en"],
    before: "Brushing off dry powder prevents activation or spreading that water might cause.",
    after: "Once the clothing is off, brushing the dry powder from the skin removes it before water is applied, so it is not dissolved or spread across the skin.",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "B" }, "zh"],
    before: "刷掉干粉可防止水可能引起的激活或扩散。",
    after: "脱去衣物后，把皮肤上的干粉刷掉可在用水之前将其清除，避免粉末被水溶解或在皮肤上扩散。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "A" }, "en"],
    before: "Removing contaminated clothing eliminates further contact with the chemical.",
    after: "Removing contaminated clothing removes most of the contamination and exposes the skin underneath for decontamination, so it is done before the skin is brushed or irrigated.",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "A" }, "zh"],
    before: "脱掉受污染的衣服可消除与化学物质的进一步接触。",
    after: "脱去受污染的衣物可清除大部分污染物，并暴露其下方的皮肤以便去污，因此应在刷除或冲洗皮肤之前进行。",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "C" }, "en"],
    before: "Final flushing with water removes any remaining residue from the skin.",
    after: "Flushing with large amounts of water removes the residue left after the dry powder is brushed off; it is appropriate here because poison control has confirmed that the powder can be irrigated.",
  }),
  setValue({
    id, path: ["rationale", "byChoice", { refId: "C" }, "zh"],
    before: "最后用水冲洗可清除皮肤上残留的任何物质。",
    after: "用大量的水冲洗可去除刷掉干粉后残留的物质；本题中之所以适用，是因为中毒控制中心已确认该粉末可以冲洗。",
  }),
  setValue({
    id, path: ["testTakingStrategy", "en"],
    before: "Remember: Self-protection (PPE) is always first. For dry chemicals, brushing comes before flushing.",
    after: "Protect yourself with PPE before contact with the client. Remove contaminated clothing before decontaminating the skin, and for a dry powder that can be irrigated, remove the dry material before using water. Check the identity of the agent before assuming water is safe.",
  }),
  setValue({
    id, path: ["testTakingStrategy", "zh"],
    before: "记住：自我保护（PPE）始终第一。对于干化学品，刷掉先于冲洗。",
    after: "接触患者之前先用PPE保护自己。先脱去受污染的衣物再对皮肤去污；对于可以冲洗的干粉，先清除干燥物质再用水。不要想当然地认为用水一定安全，应先确认化学物质的种类。",
  }),
];

runPatch(ops);
