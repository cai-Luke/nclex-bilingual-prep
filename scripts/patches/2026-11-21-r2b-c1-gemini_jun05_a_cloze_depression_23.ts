/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_jun05_a_cloze_depression_23 (banks/gemini-canonical.json questions[22]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) 45f65fc2e2ff99a765a9c97e0a23f3c7cb2747432f9b7d372b31d5d086464dc6. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_cloze_depression_23";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "When a client expresses suicidal ideation, the nurse must ask directly about suicide and whether they have a specific plan (o2 for dropdown 1) to determine the level of risk. Because the client is expressing active hopelessness and suicidal intent, the immediate safety intervention is to place them under one-on-one continuous line-of-sight observation (o1 for dropdown 2) to prevent self-harm.",
    after: "When a client expresses suicidal ideation, the nurse must ask directly about suicide and whether they have a specific plan to determine the level of risk. Because the client is expressing active hopelessness and suicidal intent, the immediate safety intervention is to place them under one-on-one continuous line-of-sight observation to prevent self-harm.",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "当患者表达自杀念头时，护士必须直接询问其自杀意向及是否有具体计划（下拉菜单1的o2），以确定风险级别。因为患者表达了主动的绝望感和自杀意图，直接的安全干预措施是将他们置于一对一持续视线监护之下（下拉菜单2的o1），以防止自残行为。",
    after: "当患者表达自杀念头时，护士必须直接询问其自杀意向及是否有具体计划，以确定风险级别。因为患者表达了主动的绝望感和自杀意图，直接的安全干预措施是将他们置于一对一持续视线监护之下，以防止自残行为。",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 4 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
