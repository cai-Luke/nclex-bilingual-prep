/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_matrix_pancreatitis_16 (banks/gemini-canonical.json questions[15]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) 6b199859b9887ab132477fe42c1c6fdf299e42dc18c77889a16af23645ad863c. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_matrix_pancreatitis_16";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Normalization of pancreatic enzymes (r1) and reduction of abdominal pain (r3) indicate therapeutic improvement. Spasm of the wrist/fingers during blood pressure measurement (Trousseau sign, r2) indicates hypocalcemia, a common complication of pancreatitis caused by soap formation in necrotic tissue. A rigid, board-like abdomen and fever (r4) indicate peritonitis, which is a life-threatening complication.",
    after: "Normalization of pancreatic enzymes and reduction of abdominal pain indicate therapeutic improvement. Spasm of the wrist/fingers during blood pressure measurement (Trousseau sign, r2) indicates hypocalcemia, a common complication of pancreatitis caused by soap formation in necrotic tissue. A rigid, board-like abdomen and fever indicate peritonitis, which is a life-threatening complication.",
    note: "R2 B-2R P4 reference rewrite: 3 edit(s) covering 3 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "胰腺酶恢复正常（r1）和腹痛减轻（r3）表示治疗改善。测量血压时手腕/手指痉挛（特鲁索征，r2）表示低钙血症，这是胰腺炎中坏死组织中皂化反应引起的常见并发症。板状腹和发热（r4）表明发生了腹膜炎，这是一种危及生命的并发症。",
    after: "胰腺酶恢复正常和腹痛减轻表示治疗改善。测量血压时手腕/手指痉挛（特鲁索征，r2）表示低钙血症，这是胰腺炎中坏死组织中皂化反应引起的常见并发症。板状腹和发热表明发生了腹膜炎，这是一种危及生命的并发症。",
    note: "R2 B-2R P4 reference rewrite: 3 edit(s) covering 3 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
