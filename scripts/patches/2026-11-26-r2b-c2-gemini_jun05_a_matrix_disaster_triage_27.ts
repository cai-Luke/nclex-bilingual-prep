/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_matrix_disaster_triage_27 (banks/gemini-canonical.json questions[26]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) 2e29d1d6655fc9dc8ea5985a3c0e2b2d5e133c238c6e9f9b762fb21706c83f36. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_matrix_disaster_triage_27";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Under the START system: Walking wounded are tagged Green (r1). Apneic victims who do not breathe after airway positioning are tagged Black (r2). Victims with injuries that need care but have normal perfusion/mental status (RR < 30, radial pulse present, follows commands) are tagged Yellow (r3). Victims who are unconscious, have RR > 30, or delayed capillary refill (>2s) are tagged Red (r4).",
    after: "Under the START system: Walking wounded are tagged Green. Apneic victims who do not breathe after airway positioning are tagged Black. Victims with injuries that need care but have normal perfusion/mental status (RR < 30, radial pulse present, follows commands) are tagged Yellow. Victims who are unconscious, have RR > 30, or delayed capillary refill (>2s) are tagged Red.",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "在 START 系统中：可行走的轻伤员贴绿标（r1）。在开放气道后仍无呼吸的伤员贴黑标（r2）。有严重创伤但循环和意识状态正常（呼吸<30，桡动脉搏动存在，能服从指令）的伤员贴黄标（r3）。意识丧失、呼吸>30或毛细血管再充盈延迟（>2秒）的伤员贴红标（r4）。",
    after: "在 START 系统中：可行走的轻伤员贴绿标。在开放气道后仍无呼吸的伤员贴黑标。有严重创伤但循环和意识状态正常（呼吸<30，桡动脉搏动存在，能服从指令）的伤员贴黄标。意识丧失、呼吸>30或毛细血管再充盈延迟（>2秒）的伤员贴红标。",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
