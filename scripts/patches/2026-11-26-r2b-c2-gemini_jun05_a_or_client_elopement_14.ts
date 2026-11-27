/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_or_client_elopement_14 (banks/gemini-canonical.json questions[13]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) 7df35c082d97673f5a878faecdfdf2bce174f1b5d530e2edd3d72c5947a9670d. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_or_client_elopement_14";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "发现患者失踪时，护士的直接行动是立即对本病区进行实地搜寻（A）。如果未找到患者，必须立即通知保安部门和护理主管（B），以启动全院搜寻并锁门。安全部门介入后，联系医疗服务提供者和患者家属（C）。最后，在处理完紧急情况后，护士填写事故报告表以记录该事件（D）。",
    after: "发现患者失踪时，护士的直接行动是立即对本病区进行实地搜寻。如果未找到患者，必须立即通知保安部门和护理主管，以启动全院搜寻并锁门。安全部门介入后，联系医疗服务提供者和患者家属。最后，在处理完紧急情况后，护士填写事故报告表以记录该事件。",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
