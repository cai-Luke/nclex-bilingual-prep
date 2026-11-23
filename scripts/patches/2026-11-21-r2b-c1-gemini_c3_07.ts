/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_c3_07 (banks/gemini-canonical.json questions[310]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) a301bde5b1d1e8f00a39e266400ed0b4354f2ee308dfc15d0b7e084d33b49f2d. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_c3_07";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "LPNs are best assigned to clients with stable, predictable conditions. Post-op day 2, stable pressure injuries, and stable diabetes (F) are within their scope. Oxygen titration, initial IV infusions, and complex teaching (E) require the clinical judgment of an RN.",
    after: "LPNs are best assigned to clients with stable, predictable conditions. Post-op day 2, stable pressure injuries, and stable diabetes are within their scope. Oxygen titration, initial IV infusions, and complex teaching require the clinical judgment of an RN.",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 2 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "LPN 最适合分配给病情稳定且可预测的患者。术后第 2 天、稳定的压力性损伤 和稳定的糖尿病 (F) 属于他们的职责范围。氧流量调整、初始静脉滴注 和复杂的教学 (E) 需要 RN 的临床判断。",
    after: "LPN 最适合分配给病情稳定且可预测的患者。术后第 2 天、稳定的压力性损伤 和稳定的糖尿病属于他们的职责范围。氧流量调整、初始静脉滴注 和复杂的教学需要 RN 的临床判断。",
    note: "R2 B-2R P4 reference rewrite: 2 edit(s) covering 2 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
