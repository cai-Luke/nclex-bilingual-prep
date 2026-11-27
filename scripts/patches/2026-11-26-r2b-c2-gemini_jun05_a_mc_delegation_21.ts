/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_mc_delegation_21 (banks/gemini-canonical.json questions[20]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) ee55b1fd36802af15a780ae469013453b82f30d15edac3fcf1fa71930042aa6f. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_mc_delegation_21";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "RN 可以将不需要临床判断、评估、指导或给药的标准化、常规任务委派给 UAP。倾倒和测量引流量（B）是一项机械的、可测量的任务，符合这些标准。评估（A）、患者教育（C）和管理医疗设备设置（D）需要专业的护理知识和判断，不能委派。",
    after: "RN 可以将不需要临床判断、评估、指导或给药的标准化、常规任务委派给 UAP。倾倒和测量引流量是一项机械的、可测量的任务，符合这些标准。评估、患者教育和管理医疗设备设置需要专业的护理知识和判断，不能委派。",
    note: "R2 B-2R P4 reference rewrite: 4 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
