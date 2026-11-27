/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_or_epiglottitis_33 (banks/gemini-canonical.json questions[32]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) 91d6c69066167a5a54be756831b45451dd2aca3fda858be89db6f8bdb0320aa5. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_or_epiglottitis_33";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "对于疑似会厌炎，首要安全任务是在床旁准备紧急气道设备（B），因为完全性气道梗阻可能迅速发生。随后应让患儿保持安静并采取舒适体位（A），以减少哭闹和烦躁，避免加重气道梗阻。在患儿可耐受且不被激惹的情况下，温和给予湿化氧气（C）。气道处理已经启动后，按医嘱给予静脉抗生素（D），以治疗潜在的细菌感染。护士不应使用压舌板检查咽喉或采集咽拭子，因为刺激可能诱发完全性气道梗阻。",
    after: "对于疑似会厌炎，首要安全任务是在床旁准备紧急气道设备，因为完全性气道梗阻可能迅速发生。随后应让患儿保持安静并采取舒适体位，以减少哭闹和烦躁，避免加重气道梗阻。在患儿可耐受且不被激惹的情况下，温和给予湿化氧气。气道处理已经启动后，按医嘱给予静脉抗生素，以治疗潜在的细菌感染。护士不应使用压舌板检查咽喉或采集咽拭子，因为刺激可能诱发完全性气道梗阻。",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
