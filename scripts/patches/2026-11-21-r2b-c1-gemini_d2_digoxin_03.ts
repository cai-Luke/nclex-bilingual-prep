/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_d2_digoxin_03 (banks/gemini-canonical.json questions[400]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) ed01990c56c9774f7c85c2b5633989e74dd329f6044534d33909e0ea6a1eeb49. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_d2_digoxin_03";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Signs of digoxin toxicity include visual disturbances, elevated serum levels above 2.0 ng/mL, central nervous system changes like confusion, and gastrointestinal symptoms (E). Bradycardia (low heart rate), not tachycardia, is the expected cardiac finding in digoxin toxicity.",
    after: "Signs of digoxin toxicity include visual disturbances, elevated serum levels above 2.0 ng/mL, central nervous system changes like confusion, and gastrointestinal symptoms. Bradycardia (low heart rate), not tachycardia, is the expected cardiac finding in digoxin toxicity.",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "地高辛中毒的体征包括视觉障碍、血清水平高于 2.0 ng/mL、中枢神经系统变化如意识模糊 以及胃肠道症状 (E)。地高辛中毒预期的心脏表现是心动过缓（心率低），而非心动过速。",
    after: "地高辛中毒的体征包括视觉障碍、血清水平高于 2.0 ng/mL、中枢神经系统变化如意识模糊 以及胃肠道症状。地高辛中毒预期的心脏表现是心动过缓（心率低），而非心动过速。",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
