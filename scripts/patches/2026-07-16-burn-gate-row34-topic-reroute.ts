/**
 * Applies the independent Burn Management gate-seat override for row 34.
 * The Gemini producer/checker seat correctly retained Physiological Adaptation
 * but kept the cross-shock matrix under Burn Management. The gate seat routed
 * it to Cardiovascular Disorders because only one of three keyed rows is burn-specific.
 */
import { runPatch, setValue } from "../patch-raw";

runPatch([
  setValue({
    id: "gemini_d9_10",
    path: ["topic"],
    before: "Burn Management",
    after: "Cardiovascular Disorders",
    note: "Independent gate-seat row 34 topic route-out.",
  }),
]);
