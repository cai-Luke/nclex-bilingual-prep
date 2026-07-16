/**
 * Archives and removes the architect-rejected row-23 burn-map smoke item.
 *
 * The archive captures the exact canonical question object before the
 * declarative canonical-bank removal runs. It remains outside `banks/`, so it
 * cannot be bundled as learner-facing study material.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import { removeQuestion, runPatch } from "../patch-raw";

const ID = "gpt_visual_smoke_2026_06_12_matrix_burn_regions_03";
const SOURCE_RELATIVE = "banks/gpt-canonical.json";
const ARCHIVE_RELATIVE =
  "Archive/retired-bank-items-2026-07-16/gpt_visual_smoke_2026_06_12_matrix_burn_regions_03.json";
const REASON =
  "Architect-retired renderer-smoke item: it scores visible shading recognition rather than TBSA, assessment interpretation, or nursing judgment.";

const root = process.cwd();
const sourcePath = path.join(root, SOURCE_RELATIVE);
const archivePath = path.join(root, ARCHIVE_RELATIVE);
const bank = JSON.parse(fs.readFileSync(sourcePath, "utf8")) as {
  questions?: Array<Record<string, unknown>>;
};
const matches = (bank.questions ?? []).filter((question) => question.id === ID);

if (matches.length !== 1) {
  throw new Error(`Expected exactly one ${ID} in ${SOURCE_RELATIVE}; found ${matches.length}.`);
}
if (fs.existsSync(archivePath)) {
  throw new Error(`Refusing to overwrite existing archive: ${ARCHIVE_RELATIVE}`);
}

const question = matches[0];
const payloadJson = JSON.stringify(question);
const archive = {
  retiredAt: "2026-07-16",
  sourceBank: SOURCE_RELATIVE,
  reason: REASON,
  payloadSha256: crypto.createHash("sha256").update(payloadJson).digest("hex"),
  question,
};

fs.mkdirSync(path.dirname(archivePath), { recursive: true });
fs.writeFileSync(archivePath, `${JSON.stringify(archive, null, 2)}\n`, "utf8");

const roundTrip = JSON.parse(fs.readFileSync(archivePath, "utf8")) as {
  question?: unknown;
};
if (JSON.stringify(roundTrip.question) !== payloadJson) {
  fs.unlinkSync(archivePath);
  throw new Error("Archive round-trip changed the canonical question payload.");
}

console.log(`Archived exact payload: ${ARCHIVE_RELATIVE}`);
console.log(`Payload SHA-256: ${archive.payloadSha256}`);

runPatch([
  removeQuestion({
    id: ID,
    reason: REASON,
  }),
]);
