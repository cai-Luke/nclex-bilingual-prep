/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_matrix_hip_precautions_50 (banks/gemini-canonical.json questions[48]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) 1a610f49c9abcbdfe066128ae2b8e399483d6df3f10798f861a62a435039af52. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_matrix_hip_precautions_50";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "To prevent dislocation after a posterior-approach total hip arthroplasty, the client must avoid hip flexion >90 degrees, adduction (crossing midline), and internal rotation. Placing an abduction wedge (r1) and using a raised toilet seat (r5) prevent adduction and flexion. Elevating the head of bed to 45-60 degrees (r4) is safe because it is <90 degrees. Bending forward to tie shoes (r2) and crossing legs (r3) violate these precautions and are contraindicated.",
    after: "To prevent dislocation after a posterior-approach total hip arthroplasty, the client must avoid hip flexion >90 degrees, adduction (crossing midline), and internal rotation. Placing an abduction wedge and using a raised toilet seat prevent adduction and flexion. Elevating the head of bed to 45-60 degrees is safe because it is <90 degrees. Bending forward to tie shoes and crossing legs violate these precautions and are contraindicated.",
    note: "R2 B-2R P4 reference rewrite: 5 edit(s) covering 5 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "为了预防全髋关节置换术（后侧入路）术后的关节脱位，患者必须避免髋关节屈曲超过90度、内收（交叉过中线）和内旋。放置外展楔（r1）和使用加高座便器（r5）可防止内收和过度屈曲。将床头抬高45-60度（r4）是安全的，因为小于90度。向前倾身系鞋带（r2）和交叉双腿（r3）违反了这些预防措施，属于禁忌证。",
    after: "为了预防全髋关节置换术（后侧入路）术后的关节脱位，患者必须避免髋关节屈曲超过90度、内收（交叉过中线）和内旋。放置外展楔和使用加高座便器可防止内收和过度屈曲。将床头抬高45-60度是安全的，因为小于90度。向前倾身系鞋带和交叉双腿违反了这些预防措施，属于禁忌证。",
    note: "R2 B-2R P4 reference rewrite: 5 edit(s) covering 5 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
