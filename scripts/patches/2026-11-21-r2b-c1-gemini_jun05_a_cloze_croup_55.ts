/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_jun05_a_cloze_croup_55 (banks/gemini-canonical.json questions[53]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) 6d9d3c8ce690257c59432f6d729d83fae6a48c5e65e726a78e304682ce3e148c. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_cloze_croup_55";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Laryngotracheobronchitis (croup) is characterized by viral inflammation of the larynx, trachea, and bronchi, presenting with a barking cough and inspiratory stridor (o1 for dropdown 1). Corticosteroids like dexamethasone (o2 for dropdown 2) are the cornerstone of therapy to reduce subglottic swelling and inflammation. Acute epiglottitis lacks a barking cough and requires urgent intubation prep. RSV bronchiolitis causes expiratory wheezing rather than upper airway stridor.",
    after: "Laryngotracheobronchitis (croup) is characterized by viral inflammation of the larynx, trachea, and bronchi, presenting with a barking cough and inspiratory stridor. Corticosteroids like dexamethasone are the cornerstone of therapy to reduce subglottic swelling and inflammation. Acute epiglottitis lacks a barking cough and requires urgent intubation prep. RSV bronchiolitis causes expiratory wheezing rather than upper airway stridor.",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "喉气管支气管炎（哮吼）是以喉、气管和支气管的病毒性炎症为特征，表现为犬吠样咳嗽和吸气性喉鸣（下拉菜单1的o1）。像地塞米松这样的糖皮质激素（下拉菜单2的o2）是治疗的基石，可减轻声门下水肿和炎症。急性会厌炎没有犬吠样咳嗽，且需要紧急气道保护准备。RSV引起的毛细支气管炎导致呼气性哮鸣音，而不是上呼吸道喉鸣。",
    after: "喉气管支气管炎（哮吼）是以喉、气管和支气管的病毒性炎症为特征，表现为犬吠样咳嗽和吸气性喉鸣。像地塞米松这样的糖皮质激素是治疗的基石，可减轻声门下水肿和炎症。急性会厌炎没有犬吠样咳嗽，且需要紧急气道保护准备。RSV引起的毛细支气管炎导致呼气性哮鸣音，而不是上呼吸道喉鸣。",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
