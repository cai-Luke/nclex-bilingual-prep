/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_c9_05 (banks/gemini-canonical.json questions[367]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) c10d15da28b2a2f11f65a901ad906657b84efc2641c7efb6e53c26e6bea3b932. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_c9_05";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Irrigation with copious water, removal of items that can trap chemicals, and safe disposal of clothing (E) are standard decontamination practices.",
    after: "Irrigation with copious water, removal of items that can trap chemicals, and safe disposal of clothing are standard decontamination practices.",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "用大量水冲洗、移除可能积聚化学物质的物品 以及安全处理衣物 (E) 是标准的洗消做法。",
    after: "用大量水冲洗、移除可能积聚化学物质的物品 以及安全处理衣物是标准的洗消做法。",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
