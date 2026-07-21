import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateBankObject } from "../../src/schema";
import { scanQuestionForAuthorialConstraints } from "../../lib/authorial-constraint-leakage";
import { PEP_RESIDUAL_OPS } from "../patches/2026-07-21-pep-authorial-constraint-residual";

const raw = JSON.parse(readFileSync("banks/gpt-canonical.json", "utf8"));
const validated = validateBankObject(raw, { rejectUnknownKeys: true, requireMeta: true });
assert.equal(validated.ok, true, validated.ok ? "" : validated.reasons.join("; "));
if (!validated.ok) process.exit(1);

const question = validated.value.questions.find((entry) => entry.id === "gpt_format10c_occupational_sharps_hiv_pep_sequence");
assert.ok(question);
assert.equal(question.itemType, "ordered_response");
if (question.itemType !== "ordered_response") process.exit(1);

assert.deepEqual(question.correct, ["A", "B", "C", "D", "E"]);
const option = (id: string) => question.options.find((entry) => entry.id === id)!;
assert.equal(option("B").en, "Report the exposure immediately and begin occupational-health evaluation.");
assert.ok(option("C").en.includes("exposed worker's baseline tests"));
assert.ok(option("C").en.includes("start the recommended PEP regimen as soon as possible"));
assert.ok(!question.options.some((entry) => /source-patient testing initiated|分别启动.*来源患者检测/u.test(`${entry.en}\n${entry.zh}`)));
assert.ok(question.stem.en.endsWith("Place the exposed nurse's postexposure-care actions in order."));
assert.ok(!/supplied actions|separate processes; do not delay/iu.test(question.stem.en));
assert.ok(!/所给措施|两个独立过程/u.test(question.stem.zh));
assert.ok(question.rationale.correct.en.includes("Source-patient testing proceeds concurrently and must not delay PEP"));
assert.ok(question.rationale.correct.zh.includes("来源患者检测应同步进行，不得延迟 PEP"));
assert.ok(question.testTakingStrategy.en.includes("urgent baseline testing plus PEP initiation"));
assert.equal(scanQuestionForAuthorialConstraints(question, "banks/gpt-canonical.json").length, 0);
assert.equal(PEP_RESIDUAL_OPS.length, 14);

console.log("authorial-constraint-pep-residual: all focused assertions passed");
