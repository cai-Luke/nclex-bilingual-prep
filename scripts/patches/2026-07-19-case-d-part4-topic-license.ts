/**
 * Post-consolidation fix: gpt_casepilot_2026_07_19_d_part_4_order_safety was
 * consolidated into gpt-canonical.json with topic "Respiratory & Infectious
 * Disorders" and category "Pharmacological and Parenteral Therapies." That
 * topic is strictly licensed only under "Physiological Adaptation"
 * (src/topics.ts), so audit:topic-license flagged a license_mismatch.
 *
 * The part itself tests clarifying/withholding unsafe medication orders
 * (IV aminophylline, sedation, routine antibiotics) — a Medication Safety &
 * Admin construct, not asthma pathophysiology. "Medication Safety & Admin"
 * is licensed for "Pharmacological and Parenteral Therapies" (the category
 * this part already correctly declares), so retopic rather than recategorize.
 */
import { setValue, runPatch } from "../patch-raw";

runPatch([
  setValue({
    id: "gpt_casepilot_2026_07_19_d_case",
    path: [
      "caseStudy",
      "questions",
      { id: "gpt_casepilot_2026_07_19_d_part_4_order_safety" },
      "topic",
    ],
    before: "Respiratory & Infectious Disorders",
    after: "Medication Safety & Admin",
    note: "Retopic to the licensed, content-accurate topic for a medication-order-safety construct; category (Pharmacological and Parenteral Therapies) unchanged.",
  }),
]);
