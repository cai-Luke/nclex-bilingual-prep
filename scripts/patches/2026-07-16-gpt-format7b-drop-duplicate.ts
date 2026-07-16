/** Drops the confirmed-duplicate item from the 2026-07-16 GPT scored-format Batch 7B raw bank. */
import { removeQuestion, runPatch } from "../patch-raw";

runPatch([
  removeQuestion({
    id: "gpt_format7b_dry_chemical_skin_decontamination",
    reason:
      "Materially duplicates two already-bundled ordered-response items testing the same PPE → remove clothing → brush powder → irrigate → reassess dry-chemical decontamination sequence: gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15 (banks/gpt-canonical.json) and gemini_b4_06 (banks/gemini-canonical.json). Confirmed on independent review; full payload preserved in Archive/retired-bank-items-2026-07-16/.",
  }),
]);
