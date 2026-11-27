/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_matrix_asthma_exacerbation_07 (banks/gemini-canonical.json questions[6]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) 484fd7576fb33718b5c61db2b8d1c6b00e7262abfb20bcb895315103bd8244a4. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_matrix_asthma_exacerbation_07";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "An increase in oxygen saturation (r1) and normalization of respiratory rate/effort (r3) indicate improvement. Diminished breath sounds with minimal air movement ('silent chest', r2) is a sign of impending respiratory failure and severe bronchoconstriction, indicating deterioration. Inability to speak in full sentences and tripoding (r4) are signs of severe respiratory distress and lack of improvement.",
    after: "An increase in oxygen saturation and normalization of respiratory rate/effort indicate improvement. Diminished breath sounds with minimal air movement ('silent chest', r2) is a sign of impending respiratory failure and severe bronchoconstriction, indicating deterioration. Inability to speak in full sentences and tripoding are signs of severe respiratory distress and lack of improvement.",
    note: "R2 B-2R P4 reference rewrite: 3 edit(s) covering 3 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "血氧饱和度上升（r1）和呼吸频率/努力程度恢复正常（r3）表明病情有所改善。呼吸音减低且气体流动极少（“静音胸”，r2）是即将发生呼吸衰竭和严重支气管痉挛的迹象，表明病情恶化。无法说出完整句子和呈三脚架体位（r4）是严重呼吸困难且未见好转的迹象。",
    after: "血氧饱和度上升和呼吸频率/努力程度恢复正常表明病情有所改善。呼吸音减低且气体流动极少（“静音胸”，r2）是即将发生呼吸衰竭和严重支气管痉挛的迹象，表明病情恶化。无法说出完整句子和呈三脚架体位是严重呼吸困难且未见好转的迹象。",
    note: "R2 B-2R P4 reference rewrite: 3 edit(s) covering 3 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
