import { setValue, runPatch } from "../patch-raw";

/**
 * Second follow-up to 2026-07-21-producer-vocabulary-naturalization.ts.
 * A broader post-fix grep for residual 封闭/来源-style Chinese phrasing (run after
 * 2026-07-21c) found one more parity miss: io_matrix_prerenal_aki_recheck_04's
 * testTakingStrategy, one of the three named strategy items in the original work
 * order. Its English was naturalized in the first pass; the paired Chinese kept
 * "封闭条件阈值" (closed-condition thresholds).
 */
runPatch([
  setValue({
    id: "io_matrix_prerenal_aki_recheck_04",
    path: ["testTakingStrategy", "zh"],
    before: "使用题干给出的封闭条件阈值，再与视觉资料比较。不要因为已经补液就假设目标已达到。",
    after: "使用题干给出的阈值，再与视觉资料比较。不要因为已经补液就假设目标已达到。",
    note: "Chinese parity: named strategy item; paired English already reads 'Use the thresholds stated in the stem'.",
  }),
]);
