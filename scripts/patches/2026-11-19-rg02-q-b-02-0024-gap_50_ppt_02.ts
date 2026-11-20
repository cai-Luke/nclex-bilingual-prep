/**
 * RG-02 Track A candidate — Q-B-02-0024 / gap_50_ppt_02 (banks/gemini-canonical.json questions[736]).
 * PRODUCER ARGUMENT (header and `note` fields): sealed from the RG-02 checker until Stage C.
 *
 * Confirmed defect: arbitrary ID-versus-final-comparison pairwise ranking.
 * Repair: option D now carries the final bedside comparison together with giving the medication.
 * Identity must be confirmed before administration (Open RN §15.2), so C<D is a real dependency.
 * The stem places retrieval and preparation in the medication room before the bedside (B<C).
 * The explanations no longer claim that identification must precede the comparison. Key unchanged.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gap_50_ppt_02";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["stem", "en"],
    before: "A nurse is preparing to administer an oral medication to a client. Sequence the steps of medication safety checks from first to last to prevent medication errors.",
    after: "A nurse retrieves and prepares a client's oral medication in the medication room, then takes it to the client's bedside to administer it. Place the nurse's actions in order.",
    note: "Stem fact: medication-room actions precede the bedside.",
  }),
  setValue({
    id: ID, path: ["stem", "zh"],
    before: "护士正准备为患者口服给药。按先后顺序排列药物安全检查步骤，以防止用药错误。",
    after: "护士在药物准备室取出并准备一名患者的口服药物，然后将药物带到患者床边给药。请按顺序排列护士的行动。",
  }),
  setValue({
    id: ID, path: ["options", { id: "D" }, "en"],
    before: "Compare the medication label with the MAR at the client's bedside before administration.",
    after: "Compare the medication label with the MAR at the client's bedside and administer the medication.",
    note: "Same action identity (third label-to-MAR check at the bedside). Administration is now part of the option, so it presupposes confirmed identity.",
  }),
  setValue({
    id: ID, path: ["options", { id: "D" }, "zh"],
    before: "给药前在患者床边将药物标签与 MAR 进行比对。",
    after: "在患者床边将药物标签与 MAR 进行比对并给药。",
  }),
  setValue({
    id: ID, path: ["rationale", "correct", "en"],
    before: "Medication administration safety requires three checks: 1. Upon retrieval from storage, 2. During preparation of the dose, 3. At the bedside. Bedside identity verification occurs immediately prior to this final check and ingestion.",
    after: "The label is compared with the MAR three times as the medication moves from storage to the client: when the drug is retrieved, while the dose is prepared in the medication room, and at the bedside immediately before the medication is given. At the bedside, the client's identity is confirmed with two identifiers, never a room number, and both identification and the final label-to-MAR comparison must be complete before administration. The medication is never given until identity is confirmed, so identification comes before the step in which the final comparison is made and the medication is given; the two bedside checks themselves can be done in either order.",
  }),
  setValue({
    id: ID, path: ["rationale", "correct", "zh"],
    before: "药物给药安全需要进行三次核对：1. 从储藏处取药时，2. 在准备药量时，3. 在床边。在床边核对身份发生在最后一次比对和服药前。",
    after: "药物从储存处到患者手中的过程中，需将药物标签与 MAR 比对三次：取药时、在药物准备室准备药量时，以及在床边给药前。在床边，用两种身份识别信息确认患者身份，绝不能使用房间号；身份确认和最后一次标签与 MAR 比对都必须在给药前完成。确认身份之前绝不能给药，因此身份确认要在进行最后比对并给药的那一步之前完成；这两项床边核对本身的先后可以互换。",
  }),
  setValue({
    id: ID, path: ["rationale", "byChoice", { refId: "C" }, "en"],
    before: "Patient verification at the bedside must occur before the final check and opening/giving the drug.",
    after: "Two identifiers confirm that this is the right client; identity must be confirmed before the medication is given.",
  }),
  setValue({
    id: ID, path: ["rationale", "byChoice", { refId: "C" }, "zh"],
    before: "床边的患者身份核对必须在最后一次核对和拆封/给药之前进行。",
    after: "使用两种身份识别信息确认是正确的患者；必须在给药前确认患者身份。",
  }),
  setValue({
    id: ID, path: ["testTakingStrategy", "en"],
    before: "Recognize the chronological sequence of drug handling: retrieval, preparation, bedside entry, identification, and final comparison.",
    after: "Follow the medication from storage to the client: the first two label checks happen in the medication room, and nothing is given at the bedside until the client's identity is confirmed.",
  }),
  setValue({
    id: ID, path: ["testTakingStrategy", "zh"],
    before: "认识处理药物的时间顺序：取药、准备、进入床边、核对身份和最后比对。",
    after: "沿着药物从储存处到患者的路径思考：前两次标签核对在药物准备室完成；在床边，确认患者身份之前不得给药。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
