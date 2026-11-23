/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_backfill_bt_legal_11 (banks/gemini-canonical.json questions[795]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) 6fa10540a5064990c2ab7c3178d6c42606d87e2c10fd56ee0f2e40ddd9ce6ccc. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_backfill_bt_legal_11";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "An alert, oriented, and competent adult has the legal right to refuse any medical treatment, including life-saving therapies (blood transfusions), under the ethical principle of Autonomy (c1). Implied consent (c2) does not apply because the client is competent and has explicitly expressed refusal. The family cannot provide substituted consent (c3) because the client currently possesses decisional capacity. The priority nursing actions are to respect the competent client's choice and withhold the transfusion (a1), and document the refusal process, including the risk education (e.g., potential death) and provider notification (a2). Giving blood against the client's competent refusal constitutes battery (a3) and is illegal. Family members have no legal authority to override a competent client's decision (a4). Key parameters to monitor are the client's ongoing decisional capacity and freedom from family coercion (p1), and physiological signs of hypoxia/bleeding (p2) to manage the patient's condition supportively. Family satisfaction (p3) and financial liability (p4) do not override the client's legal rights.",
    after: "An alert, oriented, and competent adult has the legal right to refuse any medical treatment, including life-saving therapies (blood transfusions), under the ethical principle of Autonomy. Implied consent does not apply because the client is competent and has explicitly expressed refusal. The family cannot provide substituted consent because the client currently possesses decisional capacity. The priority nursing actions are to respect the competent client's choice and withhold the transfusion, and document the refusal process, including the risk education (e.g., potential death) and provider notification. Giving blood against the client's competent refusal constitutes battery and is illegal. Family members have no legal authority to override a competent client's decision. Key parameters to monitor are the client's ongoing decisional capacity and freedom from family coercion, and physiological signs of hypoxia/bleeding to manage the patient's condition supportively. Family satisfaction and financial liability do not override the client's legal rights.",
    note: "R2 B-2R P4 reference rewrite: 11 edit(s) covering 11 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "根据自主权 (c1) 的伦理原则，意识清醒、定向力正常且具有行为能力的成年人有权拒绝任何医疗处理，包括挽救生命的疗法（输血）。默示同意 (c2) 不适用，因为患者具有行为能力且已明确表示拒绝。家属不能提供替代同意书 (c3)，因为患者目前具备决策能力。优先的护理措施是尊重具有行为能力的患者的选择并扣留输血 (a1)，记录拒绝过程，包括风险教育（例如潜在的死亡）和医生通知 (a2)。违背患者意愿给予输血构成殴打蓄意伤害 (a3) 且属于违法行为。家属无权推翻具有行为能力的患者的决定 (a4)。要监测的关键参数包括患者持续的决策能力和免受家庭胁迫 (p1)，以及缺氧/出血的生理征象 (p2) 以支持性地管理患者的病情。家属满意度 (p3) 和财务责任 (p4) 不能逾越患者的法律权利。",
    after: "根据自主权的伦理原则，意识清醒、定向力正常且具有行为能力的成年人有权拒绝任何医疗处理，包括挽救生命的疗法（输血）。默示同意不适用，因为患者具有行为能力且已明确表示拒绝。家属不能提供替代同意书，因为患者目前具备决策能力。优先的护理措施是尊重具有行为能力的患者的选择并扣留输血，记录拒绝过程，包括风险教育（例如潜在的死亡）和医生通知。违背患者意愿给予输血构成殴打蓄意伤害且属于违法行为。家属无权推翻具有行为能力的患者的决定。要监测的关键参数包括患者持续的决策能力和免受家庭胁迫，以及缺氧/出血的生理征象以支持性地管理患者的病情。家属满意度和财务责任不能逾越患者的法律权利。",
    note: "R2 B-2R P4 reference rewrite: 11 edit(s) covering 11 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
