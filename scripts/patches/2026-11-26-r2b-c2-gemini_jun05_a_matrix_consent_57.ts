/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_matrix_consent_57 (banks/gemini-canonical.json questions[55]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) 3ede6339fa728c638a648c18f6302b9d2ecfb0f22da05a904867bcdc6da24ba4. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_matrix_consent_57";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "The primary provider (surgeon) is solely responsible for explaining the surgical procedure (r4), including risks, benefits, alternatives, and complications (r1). The nurse's role is administrative and advocacy-based: witnessing the signature (r2), assessing competency and voluntariness (r3), and verifying that the consent form is on the chart before surgery (r5). If the client has questions about the procedure, the nurse must contact the provider to explain.",
    after: "The primary provider (surgeon) is solely responsible for explaining the surgical procedure, including risks, benefits, alternatives, and complications. The nurse's role is administrative and advocacy-based: witnessing the signature, assessing competency and voluntariness, and verifying that the consent form is on the chart before surgery. If the client has questions about the procedure, the nurse must contact the provider to explain.",
    note: "R2 B-2R P4 reference rewrite: 5 edit(s) covering 5 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "主要提供者（外科医生）独自负责解释手术步骤（r4），包括风险、益处、替代方案和并发症（r1）。护士的角色是行政和患者权益维护：见证签字（r2），评估患者的能力和自愿性（r3），以及核实术前同意书是否归档（r5）。如果患者对手术步骤有疑问，护士必须联系医生来解答。",
    after: "主要提供者（外科医生）独自负责解释手术步骤，包括风险、益处、替代方案和并发症。护士的角色是行政和患者权益维护：见证签字，评估患者的能力和自愿性，以及核实术前同意书是否归档。如果患者对手术步骤有疑问，护士必须联系医生来解答。",
    note: "R2 B-2R P4 reference rewrite: 5 edit(s) covering 5 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
