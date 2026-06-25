/**
 * Phase A adversarial-audit coherence polish.
 * Two minor, key-preserving text fixes in gemini-canonical.json:
 *   - gemini_c9_01 (RI): summary rationale names option B while describing the
 *     keyed answer A (open pneumothorax). Fix leading letter in EN and ZH.
 *   - gap_50_sic_03 (BD): zh renders Influenza as the non-word 流液 -> 流感.
 * Findings: ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md CONCERN #1, #2.
 */
import { runPatch, replaceText } from "../patch-raw";

runPatch([
  replaceText({
    id: "gemini_c9_01",
    path: ["rationale", "correct", "en"],
    before: "B is assigned a 'Red' tag",
    after: "A is assigned a 'Red' tag",
    note: "RI: transposed option letter; keyed answer is A (open pneumothorax).",
  }),
  replaceText({
    id: "gemini_c9_01",
    path: ["rationale", "correct", "zh"],
    before: "B 被标记",
    after: "A 被标记",
    note: "RI (ZH parity): same transposed letter in zh summary.",
  }),
  replaceText({
    id: "gap_50_sic_03",
    path: ["rationale", "correct", "zh"],
    before: "流液",
    after: "流感",
    note: "BD: zh lexical fix 流液->流感 (influenza); droplet mapping already correct.",
  }),
]);
