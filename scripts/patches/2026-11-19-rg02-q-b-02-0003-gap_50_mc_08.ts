/**
 * RG-02 Track A candidate — Q-B-02-0003 / gap_50_mc_08 (gemini-canonical questions[704]).
 * PRODUCER ARGUMENT (header and `note` fields): sealed from the RG-02 checker until Stage C.
 *
 * Confirmed defect: forced education-before-verification; verification-last mandate.
 * Repair: option C becomes the review that includes the confirmed home services and equipment. The
 * adjudication notes that "The final review can incorporate the confirmed arrangements", so verification (D)
 * precedes this review. Option B now names the agencies that meet the assessed needs (A<B). Key A,B,C,D ->
 * A,B,D,C. The rationale says teaching is ongoing throughout the stay (AHRQ IDEAL), so no
 * education-after or verification-last mandate remains. Arrangements are still settled before the client
 * leaves. No teaching script.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";
const ID = "gap_50_mc_08";
export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["options", { id: "B" }, "en"],
    before: "Collaborate with the case manager and interdisciplinary team to identify home care agencies.",
    after: "Collaborate with the case manager and interdisciplinary team to identify home care agencies that can meet the assessed needs.",
    note: "Same action; content now presupposes the assessment (A)." }),
  setValue({ id: ID, path: ["options", { id: "B" }, "zh"],
    before: "与个案经理和跨学科团队合作，确定家庭护理机构。",
    after: "与个案经理和跨学科团队合作，确定能够满足已评估需求的家庭护理机构。" }),
  setValue({ id: ID, path: ["options", { id: "C" }, "en"],
    before: "Review discharge medications and self-care instructions with the client and family.",
    after: "Review the discharge medications, self-care instructions, and the confirmed home services and equipment with the client and family.",
    note: "Same action (discharge review), now including the confirmed arrangements." }),
  setValue({ id: ID, path: ["options", { id: "C" }, "zh"],
    before: "与患者及家属一起复习出院药物和自我护理说明。",
    after: "与患者及家属一起复习出院药物、自我护理说明以及已确认的家庭服务和设备安排。" }),
  setValue({ id: ID, path: ["correct"], before: ["A", "B", "C", "D"], after: ["A", "B", "D", "C"], note: "Declared key change; non-text op." }),
  setValue({ id: ID, path: ["rationale", "correct", "en"],
    before: "Discharge planning begins immediately upon admission, starting with an assessment of client needs. Next, referrals and collaborative planning are completed. Education of the client/family follows. Finally, setup of all services and equipment must be verified before actual discharge.",
    after: "Discharge planning begins at admission with an assessment of the client's home environment and functional limitations, because the agencies identified with the case manager and team must be able to meet those needs. Once agencies are identified, the nurse verifies that home health services and durable medical equipment are scheduled and confirmed; these arrangements must be settled before the client leaves. Teaching the client and family is ongoing throughout the stay, not a single step at the end. The review in this sequence includes the confirmed services and equipment, so it takes place after they are confirmed." }),
  setValue({ id: ID, path: ["rationale", "correct", "zh"],
    before: "出院计划在入院时立即开始，从评估患者需求开始。接下来，完成转诊和协作计划。随后是对患者/家属的教育。最后，在实际出院前必须核实所有服务和设备的配置。",
    after: "出院计划从入院时开始，首先评估患者的家庭环境和功能局限，因为与个案经理和团队共同确定的机构必须能够满足这些需求。确定机构后，护士核实家庭医疗服务和耐用医疗设备均已安排并确认；这些安排必须在患者离开前落实。对患者及家属的教育贯穿整个住院期间，而不是最后的单独一步。本题中的复习包括已确认的服务和设备安排，因此在这些安排确认之后进行。" }),
  setValue({ id: ID, path: ["rationale", "byChoice", { refId: "C" }, "en"],
    before: "Education and medication review occur close to discharge but before final verification.",
    after: "This review covers medications, self-care, and the confirmed home services and equipment, so the client and family know what has been arranged." }),
  setValue({ id: ID, path: ["rationale", "byChoice", { refId: "C" }, "zh"],
    before: "教育和药物复习在接近出院时进行，但在最终核实之前。",
    after: "这次复习涵盖药物、自我护理以及已确认的家庭服务和设备安排，使患者及家属了解已作出的安排。" }),
  setValue({ id: ID, path: ["testTakingStrategy", "en"],
    before: "Apply the nursing process: assessment (A) always comes first. Verification (D) represents a final quality/safety check and should be last.",
    after: "Look for what each action needs first: agencies are chosen to meet assessed needs, services can be confirmed only after agencies are identified, and a review that includes the confirmed arrangements must wait for them. Teaching itself continues throughout the stay." }),
  setValue({ id: ID, path: ["testTakingStrategy", "zh"],
    before: "应用护理程序：评估 (A) 总是排在第一位。核实 (D) 代表最后的质量/安全检查，应该排在最后。",
    after: "找出每项行动的前提：机构的选择要满足已评估的需求；只有确定机构后才能确认服务；包括已确认安排的复习必须等这些安排落实后才能进行。教育本身贯穿整个住院期间。" }),
];
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
