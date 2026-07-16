import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { collectQuestionPopulation } from "../../lib/question-population";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";

const expectedIvIds = new Set([
  "claude_a_fib_iv_drip_rate_25",
  "dev_infusion_duration_vtbi_01",
  "gap_50_ppt_10",
  "gemini_p6_iv_01",
  "gemini_p6_iv_02",
  "gemini_p6_iv_03",
  "gemini_jun05_b_fib_pediatric_04",
  "gpt_2026_07_03_2114_t1_06_dka_fluid_fib",
  "sepsis_pneumonia_fluid_calc",
]);
const located = new Map<string, { category: string; topic: string }>();
for (const filename of (await readdir("banks")).filter((file) => file.endsWith(".json"))) {
  const result = validateBankObject(parseBankText(await readFile(join("banks", filename), "utf8")));
  assert.equal(result.ok, true, `${filename} must validate`);
  if (!result.ok) continue;
  for (const record of collectQuestionPopulation(result.value)) {
    if (expectedIvIds.has(record.question.id) || record.question.id === "gemini_jun05_b_fib_fluid_03") {
      assert.equal(located.has(record.question.id), false, `${record.question.id} must be unique`);
      located.set(record.question.id, {
        category: record.question.category,
        topic: record.question.topic,
      });
    }
  }
}

assert.equal(located.size, 10, "the nine-item manifest plus separate residual must all resolve");
for (const id of expectedIvIds) {
  assert.deepEqual(located.get(id), {
    category: "Pharmacological and Parenteral Therapies",
    topic: "IV Fluid Calculations",
  }, id);
}
assert.deepEqual(located.get("gemini_jun05_b_fib_fluid_03"), {
  category: "Basic Care and Comfort",
  topic: "Nutritional & Fluid Support",
});

console.log("IV-fluid taxonomy manifest tests passed");
