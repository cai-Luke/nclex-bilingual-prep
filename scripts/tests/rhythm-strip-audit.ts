import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import {
  buildRhythmLayerA,
  DEFAULT_BANK,
} from "../audit/rhythm-strip-layer-a";
import { buildProposal } from "../audit/rhythm-strip-proposal";

const raw = parseBankText(await readFile(DEFAULT_BANK, "utf8"));
const validated = validateBankObject(raw);
if (!validated.ok) throw new Error(validated.reasons.join("\n"));

const first = buildRhythmLayerA(validated.value.questions);
const second = buildRhythmLayerA(validated.value.questions);
assert.deepEqual(second, first, "Layer A output must be deterministic");
assert.equal(first.rows.length, 44);
assert.equal(
  first.rows.filter((row) => row.flags.includes("necessity_leak")).length,
  22,
);
assert.equal(
  first.rows.filter((row) => row.flags.includes("redundancy_group")).length,
  27,
);
assert.equal(
  first.rows.filter((row) => row.flags.includes("positional_language")).length,
  7,
);
assert.deepEqual(
  first.cures.map((row) => row.id),
  [
    "ekg_b2_mc_03",
    "ekg_b3_mc_04",
    "ekg_b3_mc_07",
    "ekg_b4_mc_03",
    "ekg_b4_mc_05",
    "ekg_b4_sata_07",
    "ekg_b4_mc_08",
  ],
);

const proposal = buildProposal(validated.value.questions);
assert.equal(proposal.length, 44);
assert.equal(proposal.filter((row) => row.verdict === "CUT").length, 25);
assert.equal(proposal.filter((row) => row.verdict === "CURE").length, 4);
assert.equal(proposal.filter((row) => row.verdict === "KEEP").length, 15);
assert.equal(proposal.filter((row) => row.verdict !== "CUT").length, 19);
assert(
  proposal
    .filter((row) => row.verdict === "CURE")
    .every((row) => row.cure !== undefined && Object.keys(row.cure).length === 3),
  "every cure must contain exactly one field-level edit",
);

console.log("rhythm-strip audit tests passed");
