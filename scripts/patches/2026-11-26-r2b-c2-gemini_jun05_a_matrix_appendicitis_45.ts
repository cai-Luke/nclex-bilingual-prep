/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_matrix_appendicitis_45 (banks/gemini-canonical.json questions[43]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) e3d110ba6b39aae7f14eff03db385fd0645e03c9b9630d453e8184de0a594e64. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_matrix_appendicitis_45";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Palpating the LLQ causing RLQ pain is Rovsing sign (r1). McBurney point tenderness is located two-thirds from the umbilicus to the right anterior superior iliac spine (r2). Flexion and internal rotation of the hip causing pain is Obturator sign (r3), indicating pelvic appendix irritation. Passive extension of the hip causing pain is Psoas sign (r4), indicating retrocecal appendix irritation.",
    after: "Palpating the LLQ causing RLQ pain is Rovsing sign. McBurney point tenderness is located two-thirds from the umbilicus to the right anterior superior iliac spine. Flexion and internal rotation of the hip causing pain is Obturator sign, indicating pelvic appendix irritation. Passive extension of the hip causing pain is Psoas sign, indicating retrocecal appendix irritation.",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "按压左下腹引起右下腹痛为罗夫辛征（r1）。麦氏点压痛位于脐与髂前上棘连线中外1/3交界处（r2）。屈曲并内旋髋关节引起疼痛为闭孔内肌征（r3），提示盆腔位阑尾炎。被动伸展髋关节引起疼痛为腰大肌征（r4），提示盲肠后位阑尾炎。",
    after: "按压左下腹引起右下腹痛为罗夫辛征。麦氏点压痛位于脐与髂前上棘连线中外1/3交界处。屈曲并内旋髋关节引起疼痛为闭孔内肌征，提示盆腔位阑尾炎。被动伸展髋关节引起疼痛为腰大肌征，提示盲肠后位阑尾炎。",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
