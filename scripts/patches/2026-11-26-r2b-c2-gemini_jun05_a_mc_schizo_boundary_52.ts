/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_mc_schizo_boundary_52 (banks/gemini-canonical.json questions[50]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) f969b7278f43323e3026e5827d2eec1d51baffbcf3540a10352d7e4282e1afe2. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_mc_schizo_boundary_52";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "当患者存在被害妄想时，护士应确认患者害怕的感受（确认情感），而不要强化或承认妄想本身。冷静地提供安全保证并呈现现实（B）是最具治疗性的方法。防御性陈述（A）、挑战性提问（C）或威胁（D）会加剧患者焦虑并破坏治疗性信任关系。",
    after: "当患者存在被害妄想时，护士应确认患者害怕的感受（确认情感），而不要强化或承认妄想本身。冷静地提供安全保证并呈现现实是最具治疗性的方法。防御性陈述、挑战性提问或威胁会加剧患者焦虑并破坏治疗性信任关系。",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
