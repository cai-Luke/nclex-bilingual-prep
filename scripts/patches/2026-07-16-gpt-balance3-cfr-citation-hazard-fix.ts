/**
 * Removes the inline "(b)(2)(i)" CFR subsection citation from the byChoice
 * rationale for gpt_balance3_2026_07_16_fib_confidentiality_hipaa_04. The
 * full citation already lives in meta.source; repeating it here tripped the
 * audit:references positional-language hazard scan, whose \([A-Da-d]\)
 * pattern (correctly) cannot distinguish an option-letter reference from a
 * legal-citation subsection letter.
 */
import { replaceText, runPatch } from "../patch-raw";

const id = "gpt_balance3_2026_07_16_fib_confidentiality_hipaa_04";

runPatch([
  replaceText({
    id,
    path: ["rationale", "byChoice", 0, "en"],
    before: "Thirty calendar days is the federal deadline stated in 45 CFR § 164.524(b)(2)(i).",
    after: "Thirty calendar days is the standard federal deadline for a HIPAA access request when no extension is needed.",
    note: "Drop the inline CFR subsection citation (already in meta.source) to clear the audit:references false-positive on \"(b)\".",
  }),
  replaceText({
    id,
    path: ["rationale", "byChoice", 0, "zh"],
    before: "45 CFR § 164.524(b)(2)(i) 规定的联邦期限为 30 个日历日。",
    after: "在无需延期的情况下，30 个日历日是 HIPAA 查阅请求的标准联邦期限。",
    note: "Mirrors the EN fix; keeps meta.source as the sole location for the exact CFR pin cite.",
  }),
]);
