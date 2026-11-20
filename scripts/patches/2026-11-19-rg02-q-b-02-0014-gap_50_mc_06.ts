/**
 * RG-02 Track A candidate — Q-B-02-0014 / gap_50_mc_06 (gemini-canonical questions[702]).
 * PRODUCER ARGUMENT (header and `note` fields): sealed from the RG-02 checker until Stage C.
 *
 * Confirmed defects: competency-first made universal; arbitrary order of the two initial checks.
 * Repair: option A becomes the match of the UAP's documented competency to the client's identified needs.
 * NCSBN/ANA 2019 p. 7 point 1 has the RN "determine the needs of the patient and whether those needs are
 * matched by the knowledge, skills and abilities of the delegatee", so the match depends on the assessed
 * needs (option B). Key A,B,C,D -> B,A,C,D. The rationale says neither check is universally first (no
 * reverse mandate). The stem states that the facility's job description includes bladder scanning (Right
 * task), so no blanket UAP authority is asserted.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";
const ID = "gap_50_mc_06";
export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["stem", "en"],
    before: "A registered nurse (RN) is planning to delegate the measurement of post-void residual urine volume using a portable bladder scanner to an experienced unlicensed assistive personnel (UAP). Sequence the nurse's actions to ensure safe delegation, from first to last.",
    after: "A registered nurse (RN) is planning to delegate the measurement of post-void residual urine volume using a portable bladder scanner to an experienced unlicensed assistive personnel (UAP) whose job description at this facility includes bladder scanning. Sequence the nurse's actions to ensure safe delegation, from first to last.",
    note: "Right task is stated (facility job description); no blanket authority." }),
  setValue({ id: ID, path: ["stem", "zh"],
    before: "注册护士 (RN) 计划将使用便携式膀胱扫描仪测量排尿后残余尿量的任务委托给一名有经验的非持牌辅助人员 (UAP)。将护士的行为按先后顺序排列，以确保安全委托。",
    after: "注册护士 (RN) 计划将使用便携式膀胱扫描仪测量排尿后残余尿量的任务委托给一名有经验的非持牌辅助人员 (UAP)，该机构为此 UAP 制定的岗位职责中包括膀胱扫描。将护士的行为按先后顺序排列，以确保安全委托。" }),
  setValue({ id: ID, path: ["options", { id: "A" }, "en"],
    before: "Verify the UAP's competency in operating the bladder scanner.",
    after: "Confirm that the UAP's documented competency with the bladder scanner matches the client's identified needs.",
    note: "Same action identity (competency verification), specified as the NCSBN match to the client's needs." }),
  setValue({ id: ID, path: ["options", { id: "A" }, "zh"],
    before: "核实 UAP 操作膀胱扫描仪的能力。",
    after: "确认 UAP 经记录的膀胱扫描仪操作能力与患者已明确的需求相匹配。" }),
  setValue({ id: ID, path: ["correct"], before: ["A", "B", "C", "D"], after: ["B", "A", "C", "D"], note: "Declared key change; non-text op." }),
  setValue({ id: ID, path: ["rationale", "correct", "en"],
    before: "Safe delegation begins with verifying the competency of the delegatee. Next, the RN must assess the client's condition to ensure it is safe to delegate. Then, clear instructions/parameters must be given. Finally, the RN must supervise, evaluate, and verify the outcomes.",
    after: "Under the national delegation guidelines, a decision to delegate rests on the client's needs and stability and on the delegatee's documented training and competence: the RN determines the client's needs and whether the delegatee's knowledge and skills match them. Here, the RN assesses this client's stability and suitability for the scan, then confirms that the UAP's documented competency with the scanner matches those identified needs. Neither check is first in every situation; the RN may already know a delegatee's competence, but matching it to this client requires knowing the client's needs. The RN then gives clear instructions on when to scan and what to report, and afterward supervises and verifies the reported result. The task is delegated here because the facility's job description for this UAP includes it." }),
  setValue({ id: ID, path: ["rationale", "correct", "zh"],
    before: "安全的委托始于核实被委托人的能力。接下来，RN 必须评估患者的状况以确保委托是安全的。然后，必须给予明确的指示/参数。最后，RN 必须监督、评估并核实结果。",
    after: "根据全国护理委托指南，是否委托取决于患者的需求和病情稳定性，以及被委托人经记录的培训和能力：RN 需要确定患者的需求，以及被委托人的知识和技能是否与之相匹配。本题中，RN 先评估该患者的病情稳定性以及是否适合进行扫描，再确认 UAP 经记录的扫描仪操作能力与已明确的需求相匹配。这两项核查并非在任何情况下都有固定的先后：RN 可能早已了解被委托人的能力，但要判断其是否与该患者相匹配，必须先了解患者的需求。随后，RN 明确告知何时扫描以及需要报告哪些内容，之后进行监督并核实报告的结果。本题之所以可以委托，是因为该机构为此 UAP 制定的岗位职责中包括这项任务。" }),
  setValue({ id: ID, path: ["rationale", "byChoice", { refId: "A" }, "en"],
    before: "Verifying delegatee competency is the first step of safe delegation.",
    after: "Matching the UAP's documented competency to the client's identified needs is how the RN decides that this delegation is safe." }),
  setValue({ id: ID, path: ["rationale", "byChoice", { refId: "A" }, "zh"],
    before: "核实被委托人能力是安全委托的第一步。",
    after: "将 UAP 经记录的能力与患者已明确的需求相匹配，是 RN 判断此次委托是否安全的依据。" }),
];
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
