/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_or_dka_management_25 (banks/gemini-canonical.json questions[24]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) c4525e9098bbc98acb4fcaa95d59c8ff57d550bde0a526a67b95e457a96b2475. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_or_dka_management_25";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "在 DKA 中，首要任务是液体复苏（A），以恢复灌注和血管内容量。随后必须评估血钾并按医嘱补钾（D），再开始或继续胰岛素治疗，因为胰岛素会促使钾离子进入细胞内，可能引发危及生命的低钾血症。确认血钾安全后，开始按医嘱持续静脉输注普通胰岛素（B），以停止酮体生成并纠正酸中毒。最后，当血糖降至约 250 mg/dL 时，在静脉液体中加入葡萄糖（C），使胰岛素能够安全持续使用，直到酮症酸中毒纠正。",
    after: "在 DKA 中，首要任务是液体复苏，以恢复灌注和血管内容量。随后必须评估血钾并按医嘱补钾，再开始或继续胰岛素治疗，因为胰岛素会促使钾离子进入细胞内，可能引发危及生命的低钾血症。确认血钾安全后，开始按医嘱持续静脉输注普通胰岛素，以停止酮体生成并纠正酸中毒。最后，当血糖降至约 250 mg/dL 时，在静脉液体中加入葡萄糖，使胰岛素能够安全持续使用，直到酮症酸中毒纠正。",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
