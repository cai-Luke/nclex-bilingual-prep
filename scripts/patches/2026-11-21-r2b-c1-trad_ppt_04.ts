/**
 * R2 B-2 tranche C1 (B-2R, Claude route): trad_ppt_04 (banks/gemini-canonical.json questions[476]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) edf1f1073dbe9042cd26bc03a7c5b32b6a213440578132989cc108da017e419a. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "trad_ppt_04";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Warfarin users must maintain consistent intake of Vitamin K (found in leafy greens like spinach) rather than increasing it, as Vitamin K is the antidote. Aspirin increases bleeding risk and should be avoided. Options B, D, and E are correct safety measures for warfarin therapy.",
    after: "Warfarin users must maintain consistent intake of Vitamin K (found in leafy greens like spinach) rather than increasing it, as Vitamin K is the antidote. Aspirin increases bleeding risk and should be avoided. Using a soft-bristled toothbrush, having frequent blood tests to check the INR, and notifying the doctor of black or tarry stools are correct safety measures for warfarin therapy.",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 3 occurrence(s); kinds RESTATE_CONTENT_CORRECTION." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
