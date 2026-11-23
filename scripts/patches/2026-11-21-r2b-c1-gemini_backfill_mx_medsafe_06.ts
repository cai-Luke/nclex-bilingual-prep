/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_backfill_mx_medsafe_06 (banks/gemini-canonical.json questions[790]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) 2ec180f6f6f12dace1f98aab5cf2f968320901c8e63db00312d1cca204af2656. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_backfill_mx_medsafe_06";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Safe and unsafe medication practices are guided by standard medication safety rules (the 'Rights' of medication administration). 1) Crushing extended-release tablets (r1) is unsafe because it destroys the time-release mechanism, causing the entire dose to absorb rapidly, risking toxicity or mucosal irritation. 2) Using two unique identifiers (name/DOB) (r2) is a standard safe practice to prevent patient identification errors. 3) Administering incompatible IV medications without flushing before and after (r3) is unsafe because chemical precipitation can form in the tubing, risking line occlusion or venous emboli. 4) Drawing up Regular (clear) insulin before NPH (cloudy) (r4) is a safe practice ('clear before cloudy') that prevents contaminating the Regular insulin vial with NPH. 5) Leaving medications unattended at the bedside (r5) is unsafe because the nurse cannot verify administration, and it poses an accidental ingestion safety risk to visitors or other clients.",
    after: "Safe and unsafe medication practices are guided by standard medication safety rules (the 'Rights' of medication administration). 1) Crushing extended-release tablets is unsafe because it destroys the time-release mechanism, causing the entire dose to absorb rapidly, risking toxicity or mucosal irritation. 2) Using two unique identifiers (name/DOB) is a standard safe practice to prevent patient identification errors. 3) Administering incompatible IV medications without flushing before and after is unsafe because chemical precipitation can form in the tubing, risking line occlusion or venous emboli. 4) Drawing up Regular (clear) insulin before NPH (cloudy) is a safe practice ('clear before cloudy') that prevents contaminating the Regular insulin vial with NPH. 5) Leaving medications unattended at the bedside is unsafe because the nurse cannot verify administration, and it poses an accidental ingestion safety risk to visitors or other clients.",
    note: "R2 B-2R P4 reference rewrite: 5 edit(s) covering 5 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "安全和不安全的给药操作由标准的用药安全规则（给药的“正确原则”）指导。1) 粉碎缓释片 (r1) 是不安全的，因为它破坏了定时释放机制，导致整个剂量迅速吸收，存在毒性或黏膜刺激风险。2) 使用两个唯一的标识符（姓名/出生日期）(r2) 是防止患者身份识别错误的标准安全操作。3) 在给药前后不冲洗的情况下给予不相容的静脉药物 (r3) 是不安全的，因为管路中会形成化学沉淀，从而存在管线堵塞或静脉栓塞的风险。4) 在 NPH（浑浊）胰岛素之前吸入普通（清亮）胰岛素 (r4) 是一种安全的操作（“先清后浊”），可防止普通胰岛素瓶受到 NPH 的污染。5) 将药物无人看管地留在床边 (r5) 是不安全的，因为护士无法核实给药情况，且这会对访客或其他患者构成意外误服的安全风险。",
    after: "安全和不安全的给药操作由标准的用药安全规则（给药的“正确原则”）指导。1) 粉碎缓释片是不安全的，因为它破坏了定时释放机制，导致整个剂量迅速吸收，存在毒性或黏膜刺激风险。2) 使用两个唯一的标识符（姓名/出生日期）是防止患者身份识别错误的标准安全操作。3) 在给药前后不冲洗的情况下给予不相容的静脉药物是不安全的，因为管路中会形成化学沉淀，从而存在管线堵塞或静脉栓塞的风险。4) 在 NPH（浑浊）胰岛素之前吸入普通（清亮）胰岛素是一种安全的操作（“先清后浊”），可防止普通胰岛素瓶受到 NPH 的污染。5) 将药物无人看管地留在床边是不安全的，因为护士无法核实给药情况，且这会对访客或其他患者构成意外误服的安全风险。",
    note: "R2 B-2R P4 reference rewrite: 5 edit(s) covering 5 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
