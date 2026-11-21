/**
 * R2 A-1, Claude route, unit A-U7: trad_batchD_14 (gemini-canonical questions[557]).
 * Finding: F-05b (gown keyed, face shield excluded, with parallel exposure-conditional rationales).
 * Disposition: REPAIR. Under the standing reading that "ensure available" is a stocking question (F-05a DISMISS,
 * not reopened), gown, gloves and face protection are all standard-precautions PPE selected by anticipated exposure
 * (CDC 2007 Isolation Guideline IV.B.2.a, IV.B.3.a, IV.B.4.a; Appendix A Table 4), so face shield is keyed with them.
 * Declared surface: correct; rationale.correct.{en,zh}; rationale.byChoice[A,B,D].{en,zh}; testTakingStrategy.{en,zh}.
 * Return 1 (checker HOLD on `correct`: the bare "Surgical mask" distractor is defensible as patient source-control
 * stocking): adds options[id=E].{en,zh} and rationale.byChoice[refId=E].{en,zh}. Option E is qualified as a substitute
 * for the nurse's respirator (CDC 2007 V.D.4.a), and its rationale states that the surgical mask under airborne
 * precautions is the client's, worn outside the AIIR (V.D.2.d.ii-iii, V.D.5.b). Stem, option ids and glossary unchanged.
 * Candidate only. Integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "trad_batchD_14";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["correct"], before: ["A", "B", "C"], after: ["A", "B", "C", "D"],
    note: "Declared key change: face shield joins gown and gloves as standard-precautions PPE to have available." }),
  setValue({ id: ID, path: ["rationale", "correct", "en"],
    before: "Airborne precautions require a private room with negative pressure and an N95 respirator. Standard precautions (gloves, gown) are still used if contact with body fluids is expected. A surgical mask is insufficient for airborne pathogens like tuberculosis or measles.",
    after: "Airborne precautions require a private room with negative pressure and an N95 respirator. Standard precautions still apply in addition, so gloves, a gown, and face protection such as a face shield should be available and are worn according to the exposure anticipated during care. A surgical mask is insufficient for airborne pathogens like tuberculosis or measles.",
    note: "Sentence 2 only; sentences 1 and 3 verbatim." }),
  setValue({ id: ID, path: ["rationale", "correct", "zh"],
    before: "空气传播预防措施需要带有负压的私人房间和 N95 呼吸面罩。如果预计会接触体液，仍需使用标准预防措施（手套、隔离衣）。外科口罩不足以防御结核病或麻疹等空气传播病原体。",
    after: "空气传播预防措施需要带有负压的私人房间和 N95 呼吸面罩。标准预防措施同时仍然适用，因此应备好手套、隔离衣以及面屏等面部防护用品，并根据护理过程中预计的暴露情况使用。外科口罩不足以防御结核病或麻疹等空气传播病原体。" }),
  setValue({ id: ID, path: ["rationale", "byChoice", { refId: "A" }, "en"],
    before: "Gowns are used if there is a risk of splashing or spraying of body fluids.",
    after: "A gown is worn when contact of clothing or skin with blood, body fluids, secretions, or excretions is anticipated; as part of standard precautions, it should be available." }),
  setValue({ id: ID, path: ["rationale", "byChoice", { refId: "A" }, "zh"],
    before: "如果存在体液溅洒或喷射的风险，则使用隔离衣。",
    after: "当预计衣物或皮肤会接触血液、体液、分泌物或排泄物时需穿隔离衣；作为标准预防措施的一部分，应备好隔离衣。" }),
  setValue({ id: ID, path: ["rationale", "byChoice", { refId: "B" }, "en"],
    before: "Gloves are part of standard precautions for all client contact.",
    after: "Gloves are worn when contact with blood, body fluids, mucous membranes, nonintact skin, or potentially contaminated intact skin is anticipated; as part of standard precautions, they should be available." }),
  setValue({ id: ID, path: ["rationale", "byChoice", { refId: "B" }, "zh"],
    before: "手套是所有患者接触的标准预防措施的一部分。",
    after: "当预计会接触血液、体液、黏膜、破损皮肤或可能受污染的完整皮肤时需戴手套；作为标准预防措施的一部分，应备好手套。" }),
  setValue({ id: ID, path: ["rationale", "byChoice", { refId: "D" }, "en"],
    before: "Face shields are for droplets/splashes, not specifically for airborne isolation.",
    after: "Face protection such as a face shield is used when splashes or sprays of blood, body fluids, secretions, or excretions are likely, for example during suctioning; as part of standard precautions, it should be available." }),
  setValue({ id: ID, path: ["rationale", "byChoice", { refId: "D" }, "zh"],
    before: "面屏用于防御飞沫/溅洒，并非专门用于空气隔离。",
    after: "当可能出现血液、体液、分泌物或排泄物的溅洒或喷射时（例如吸痰时），需使用面屏等面部防护用品；作为标准预防措施的一部分，应备好面屏。" }),
  setValue({ id: ID, path: ["testTakingStrategy", "en"],
    before: "Distinguish between airborne, droplet, and contact precautions. Remember 'Airborne = N95'.",
    after: "Standard precautions apply to every client, and transmission-based precautions are added to them, not substituted for them. Remember 'Airborne = N95': a surgical mask does not replace the respirator." }),
  setValue({ id: ID, path: ["testTakingStrategy", "zh"],
    before: "区分空气传播、飞沫和接触预防措施。记住“空气传播 = N95”。",
    after: "标准预防措施适用于每一位患者，基于传播途径的预防措施是在其基础上增加的，而不是取而代之。记住“空气传播 = N95”：外科口罩不能替代呼吸面罩。" }),
  setValue({ id: ID, path: ["options", { id: "E" }, "en"],
    before: "Surgical mask.",
    after: "Surgical mask worn by the nurse instead of an N95 respirator.",
    note: "Return 1: qualified as a substitute for the nurse's respirator, so the patient source-control reading no longer applies." }),
  setValue({ id: ID, path: ["options", { id: "E" }, "zh"],
    before: "外科口罩。",
    after: "护士佩戴以代替 N95 呼吸面罩的外科口罩。" }),
  setValue({ id: ID, path: ["rationale", "byChoice", { refId: "E" }, "en"],
    before: "Surgical masks are for droplet precautions, not airborne.",
    after: "A surgical mask cannot replace the fit-tested N95 or higher-level respirator that the nurse wears for respiratory protection when entering the room. Under airborne precautions, the surgical mask is for the client, who wears one, if possible, when outside the airborne infection isolation room, such as during necessary transport." }),
  setValue({ id: ID, path: ["rationale", "byChoice", { refId: "E" }, "zh"],
    before: "外科口罩用于飞沫预防，而非空气传播预防。",
    after: "外科口罩不能替代护士进入病房时为呼吸防护而佩戴的、经过适合性测试的 N95 或更高级别呼吸面罩。在空气传播预防措施中，外科口罩是供患者使用的：患者在空气传播感染隔离病房以外时（例如必要的转运期间），如条件允许应佩戴外科口罩。" }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
