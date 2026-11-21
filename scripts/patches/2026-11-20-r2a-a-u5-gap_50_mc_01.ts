/**
 * R2 A-1, Claude route, unit A-U5: gap_50_mc_01 (gemini-canonical questions[696]).
 * Finding: F-10 (completed sentence repeats "to explain the procedure" / 解释手术过程 before blank 1).
 * MECHANICAL, deletion only (owner: "A-U5 mechanical"; R2 conformance section 2.1(2)). No new words.
 * Declared surface: clozeStem.{en,zh}. Key and dropdown options unchanged.
 * Candidate only. Integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gap_50_mc_01";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["clozeStem", "en"],
    before: "the nurse must contact the provider to explain the procedure {{1}} because obtaining informed consent is the provider's responsibility {{2}}.",
    after: "the nurse must contact the provider {{1}} because obtaining informed consent is the provider's responsibility {{2}}.",
    note: "Deletes the single occurrence of \" to explain the procedure\"; the keyed blank-1 option supplies the phrase." }),
  setValue({ id: ID, path: ["clozeStem", "zh"],
    before: "护士必须联系医疗服务提供者来解释手术过程 {{1}}，因为获取知情同意是提供者的职责 {{2}}。",
    after: "护士必须联系医疗服务提供者 {{1}}，因为获取知情同意是提供者的职责 {{2}}。",
    note: "Deletes the single occurrence of 来解释手术过程; the keyed blank-1 option supplies 解释手术过程." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
