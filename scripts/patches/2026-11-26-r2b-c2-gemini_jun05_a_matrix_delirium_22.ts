/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_matrix_delirium_22 (banks/gemini-canonical.json questions[21]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) c5b5d7480539fd10c8dd9219d347c28fd67769b48afdf5bd9515d0fce6d294d3. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_matrix_delirium_22";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Delirium is characterized by an acute, sudden onset (r1), altered level of consciousness (r3), impaired attention, and reversibility once the underlying cause (e.g., infection) is treated (r4). Dementia is a slow, progressive, irreversible decline in cognitive function with a stable level of consciousness (r2).",
    after: "Delirium is characterized by an acute, sudden onset, altered level of consciousness, impaired attention, and reversibility once the underlying cause (e.g., infection) is treated. Dementia is a slow, progressive, irreversible decline in cognitive function with a stable level of consciousness.",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "谵妄的特征是急性、突然发作（r1）、意识水平发生改变（r3）、注意力受损，且在潜在病因（如感染）得到治疗后具有可逆性（r4）。痴呆则是一种缓慢、渐进、不可逆的认知功能下降，且意识水平保持稳定（r2）。",
    after: "谵妄的特征是急性、突然发作、意识水平发生改变、注意力受损，且在潜在病因（如感染）得到治疗后具有可逆性。痴呆则是一种缓慢、渐进、不可逆的认知功能下降，且意识水平保持稳定。",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
