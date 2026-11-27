/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_or_chest_tube_disconnection_13 (banks/gemini-canonical.json questions[12]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) 3388b502730f0d90ed648705a0ff88437a39f2202cce522acbe8879469987b86. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_or_chest_tube_disconnection_13";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "当胸腔引流管与系统断开时，首要任务是立即将引流管的远端浸入 2 厘米深的无菌水中（A）。这起到临时水封的作用，可防止空气涌回胸膜腔，引发张力性气胸。接下来，护士应立即评估患者的呼吸状况（B）。评估后，应通知医生（C），最后，准备并连接新的无菌引流系统（D）。",
    after: "当胸腔引流管与系统断开时，首要任务是立即将引流管的远端浸入 2 厘米深的无菌水中。这起到临时水封的作用，可防止空气涌回胸膜腔，引发张力性气胸。接下来，护士应立即评估患者的呼吸状况。评估后，应通知医生，最后，准备并连接新的无菌引流系统。",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
