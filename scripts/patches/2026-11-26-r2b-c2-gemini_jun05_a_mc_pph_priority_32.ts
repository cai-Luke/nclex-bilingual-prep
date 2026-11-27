/**
 * R2 B-2 tranche C2 (B-2R, Claude route): gemini_jun05_a_mc_pph_priority_32 (banks/gemini-canonical.json questions[31]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 e7d10bdb2e9ee592b3529a743b2a008a702dd94878dda4856aa7676f309ec4f1. Key, options and every other field unchanged.
 * Base item hash (json2) d1456cbfe7d6ce22d06d08f1bc7a34ed726ad0df02a1cbab0a6081fb73d46521. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_jun05_a_mc_pph_priority_32";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "子宫底已经被按摩至变硬，但仍向右上方移位，这是膀胱充盈的典型表现。充盈的膀胱会阻止子宫保持在中线并有效收缩，从而增加产后出血。护士下一步应协助患者排空膀胱（B），使子宫回到中线并维持张力。",
    after: "子宫底已经被按摩至变硬，但仍向右上方移位，这是膀胱充盈的典型表现。充盈的膀胱会阻止子宫保持在中线并有效收缩，从而增加产后出血。护士下一步应协助患者排空膀胱，使子宫回到中线并维持张力。",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
