/**
 * RG-02 Track B — TB-Q0020 retirement half: retire gemini_p8_04 from banks/gemini-canonical.json.
 * PRODUCER ARGUMENT (header and `reason` text): sealed from the RG-02 checker until Stage C.
 *
 * Order §4.1 (A3) precondition guard. removeQuestion selects by ID only, so before runPatch this
 * file reads the --in bank, requires EXACTLY ONE top-level record with the ID, and requires
 * sha256(JSON.stringify(q, null, 2)) to equal the frozen original-payload hash. Otherwise it exits
 * non-zero without writing. Integration (not authorized here) re-runs this guard against the live
 * bank, with --allow-canonical --reason, in the same step as promoting the replacement (unit TB-Q0020).
 */
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { runPatch, removeQuestion, type PatchOp } from "../patch-raw";

export const RETIRE_ID = "gemini_p8_04";
export const EXPECTED_PAYLOAD_SHA256 = "655a6bc7182d84935edca95b36243d0932e3eb48c84054a28a18f234cb221e29";

export const ops: PatchOp[] = [
  removeQuestion({
    id: RETIRE_ID,
    reason: "RG-02 TB-Q0020: retire-and-replace (owner D-1). Confirmed sequencing/option-bundling defect (pilot adjudication Q-0020); replaced by a new claude_* select_all item in the same integration unit.",
  }),
];

export function precondition(inPath: string): { ok: boolean; matches: number; sha256: string | null; reason: string } {
  let bank: any;
  try { bank = JSON.parse(readFileSync(inPath, "utf8")); } catch (e) { return { ok: false, matches: 0, sha256: null, reason: `cannot read/parse --in: ${e}` }; }
  const questions: any[] = Array.isArray(bank) ? bank : bank?.questions;
  if (!Array.isArray(questions)) return { ok: false, matches: 0, sha256: null, reason: "no top-level questions array" };
  const hits = questions.filter((q) => q && typeof q === "object" && q.id === RETIRE_ID);
  if (hits.length !== 1) return { ok: false, matches: hits.length, sha256: null, reason: hits.length === 0 ? "target record missing" : `target record duplicated (${hits.length})` };
  const sha = createHash("sha256").update(JSON.stringify(hits[0], null, 2)).digest("hex");
  if (sha !== EXPECTED_PAYLOAD_SHA256) return { ok: false, matches: 1, sha256: sha, reason: "original-payload hash mismatch" };
  return { ok: true, matches: 1, sha256: sha, reason: "exact original payload present exactly once" };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const i = process.argv.indexOf("--in");
  const inPath = i >= 0 ? process.argv[i + 1] : undefined;
  if (!inPath) { console.error("PRECONDITION GUARD: --in is required"); process.exit(2); }
  const pc = precondition(inPath);
  console.log(`PRECONDITION GUARD ${pc.ok ? "PASS" : "REFUSE"}: ${pc.reason} (matches=${pc.matches}, sha256=${pc.sha256 ?? "n/a"})`);
  if (!pc.ok) process.exit(3);
  runPatch(ops);
}
