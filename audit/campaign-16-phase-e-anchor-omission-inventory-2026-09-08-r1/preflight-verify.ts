/**
 * Campaign 16 Phase E — mandatory pre-repair preflight, and post-repair closure check.
 *
 * Revision R3 (2026-09-08), second owner-review correction pass. R2 fixed the major PRE/POST and structural issues; R3 additionally:
 *   - requires an explicit exceptions.jsonl artifact in the commission root even when empty;
 *   - counts a row as structurally proven repaired only after all direct row assertions pass;
 *   - keeps R2's all-13-bank pinning, distinct PRE/POST hash semantics, explicit commission root,
 *     and positive structural resolution of every frozen identity.
 *
 * Read-only against banks and against production validation code. It imports
 * `findStageReferenceFindings` and `validateBankObject` and changes neither;
 * it adds no gate to any aggregate command and is never invoked by `npm run audit`.
 *
 *   npx tsx audit/campaign-16-phase-e-anchor-omission-inventory-2026-09-08-r1/preflight-verify.ts
 *   npx tsx audit/campaign-16-phase-e-anchor-omission-inventory-2026-09-08-r1/preflight-verify.ts \
 *     --post-repair --commission-root audit/campaign-16-anchor-omission-repair-2026-09-15-r1
 *   ... --self-test
 *
 * HASH SEMANTICS
 *   PREFLIGHT   all 13 bundled banks must equal their frozen pre-repair SHA-256.
 *   POST-REPAIR the 9 unaffected banks must still equal their frozen SHA-256.
 *               The 4 affected banks are EXPECTED to differ; their post-repair
 *               digests are reported for the commission evidence and are governed
 *               by the work order's §E.9 structural unintended-change proof, which
 *               this script does not attempt to replace.
 *
 * Exit code 0 = pass, 1 = fail. No bank is written in either mode.
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import { findStageReferenceFindings } from "../../scripts/audit/audit-stage-refs";
import type { BankEnvelope, CaseStudyQuestion, CaseSubQuestion } from "../../src/types";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..", "..");
const BANK_DIR = join(REPO, "banks");
const AUDIT_DIR = join(REPO, "audit");
const INVENTORY = join(HERE, "frozen-inventory.jsonl");

const INVENTORY_SHA256 =
  "9f66750caaeead9d374742588856e2630a7fce09415bb7c2c662669a2af93e8e";

/**
 * Frozen pre-repair fingerprints for ALL 13 bundled banks, inherited from the
 * Phase E Stage-0 freeze (`population-summary.json`, `bankDriftAgainstPhaseA`
 * live values) and re-verified by the R3 opening preservation pass on 2026-09-05.
 * They were NOT recomputed by the seat that authored this file; recomputing them
 * is exactly what the preflight exists to do.
 */
const FROZEN_BANK_SHA256: Record<string, string> = {
  "banks/burn-canonical.json":
    "5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f",
  "banks/capnography-canonical.json":
    "36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c",
  "banks/claude-canonical.json":
    "25f53ded1ac21da4ca9d211040c3f6110ebee38d72ba41d0fc64fe358ba73b71",
  "banks/device-canonical.json":
    "83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5",
  "banks/gemini-canonical.json":
    "3dc416a4652f5f5712219dde7de87b92f0697fac953750b8abb8fc0dbb976bb6",
  "banks/gpt-canonical.json":
    "d7d228afc282bd15bc730be4ca5b3d2c7c14c017bbc14f3d12a7cbccbfef0f20",
  "banks/hard-cases-canonical.json":
    "5d47b79a1e63fe5f852eab7b4ab9b8db6ca7e9ec924037d5e81de8a8bb3ee3d1",
  "banks/io-canonical.json":
    "2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645",
  "banks/lab-canonical.json":
    "1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05",
  "banks/mar-canonical.json":
    "f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e",
  "banks/medlabel-canonical.json":
    "cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993",
  "banks/visual-canonical.json":
    "e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4",
  "banks/vitals-canonical.json":
    "5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d",
};

/** The only banks this repair is permitted to change. */
const AFFECTED_BANKS = new Set([
  "banks/claude-canonical.json",
  "banks/gemini-canonical.json",
  "banks/gpt-canonical.json",
  "banks/hard-cases-canonical.json",
]);

const EXPECTED_ROWS = 451;
const EXPECTED_PARENTS = 93;
const COMMISSION_ROOT_PATTERN = /^campaign-16-anchor-omission-repair-\d{4}-\d{2}-\d{2}-r\d+$/;

type InventoryRow = {
  rowKey: string;
  stage0QueueIndex: number;
  bankPath: string;
  parentCaseId: string;
  partId: string;
  declaredStageIds: string[];
};

type ExceptionEntry = { rowKey: string; [key: string]: unknown };

const identity = (bankPath: string, parentCaseId: string, partId: string): string =>
  `${bankPath}\u0000${parentCaseId}\u0000${partId}`;
const show = (id: string): string => id.split("\u0000").join(" / ");

const failures: string[] = [];
const notes: string[] = [];
const fail = (message: string): void => void failures.push(message);
const note = (message: string): void => void notes.push(message);

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

function readInventory(): InventoryRow[] {
  if (!existsSync(INVENTORY)) {
    fail("frozen-inventory.jsonl is absent. Run build-inventory.ts before the preflight.");
    return [];
  }
  const raw = readFileSync(INVENTORY, "utf8");
  const digest = createHash("sha256").update(raw, "utf8").digest("hex");
  if (digest !== INVENTORY_SHA256) {
    fail(
      `frozen-inventory.jsonl SHA-256 is ${digest}; pinned value is ${INVENTORY_SHA256}. ` +
        "The frozen inventory has drifted or was regenerated from a different source.",
    );
  }
  return raw
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as InventoryRow);
}

// ---------------------------------------------------------------------------
// Commission root and exception queue — fail closed on anything malformed
// ---------------------------------------------------------------------------

function resolveExceptionFile(rawRoot: string | undefined): string | null {
  if (rawRoot === undefined || rawRoot.trim() === "") {
    fail(
      "--post-repair requires --commission-root <path>. The exception queue lives in the " +
        "repair commission root and is never read from the inventory directory.",
    );
    return null;
  }
  const rootAbs = resolve(REPO, rawRoot.trim());
  const rel = relative(AUDIT_DIR, rootAbs);
  if (rel === "" || rel.startsWith("..") || rel.includes(sep)) {
    fail(`--commission-root must be a direct child of audit/. Got: ${rawRoot}`);
    return null;
  }
  if (!COMMISSION_ROOT_PATTERN.test(rel)) {
    fail(
      `--commission-root basename "${rel}" does not match the required pattern ` +
        "campaign-16-anchor-omission-repair-YYYY-MM-DD-r<N>.",
    );
    return null;
  }
  if (rootAbs === resolve(HERE)) {
    fail("--commission-root must not be the frozen inventory directory.");
    return null;
  }
  if (!existsSync(rootAbs) || !statSync(rootAbs).isDirectory()) {
    fail(`--commission-root does not exist or is not a directory: ${rootAbs}`);
    return null;
  }
  if (existsSync(join(HERE, "exceptions.jsonl"))) {
    fail(
      "An exceptions.jsonl exists inside the frozen inventory directory. Exception state " +
        "must live only in the commission root; remove the duplicate.",
    );
  }
  return join(rootAbs, "exceptions.jsonl");
}

function readExceptions(path: string | null, validRowKeys: Set<string>): Set<string> {
  const keys = new Set<string>();
  if (path === null) return keys;
  if (!existsSync(path)) {
    fail(
      `Required exceptions.jsonl is absent at ${relative(REPO, path)}. ` +
        "The work order requires an explicit exception-queue artifact even when it is empty.",
    );
    return keys;
  }
  const lines = readFileSync(path, "utf8").split("\n").filter((l) => l.trim().length > 0);
  lines.forEach((line, index) => {
    let entry: ExceptionEntry;
    try {
      entry = JSON.parse(line) as ExceptionEntry;
    } catch {
      fail(`exceptions.jsonl line ${index + 1} is not valid JSON.`);
      return;
    }
    if (typeof entry.rowKey !== "string" || entry.rowKey.length === 0) {
      fail(`exceptions.jsonl line ${index + 1} has no usable string rowKey.`);
      return;
    }
    if (!validRowKeys.has(entry.rowKey)) {
      fail(`exceptions.jsonl line ${index + 1} names rowKey ${entry.rowKey}, which is not in the frozen inventory.`);
      return;
    }
    if (keys.has(entry.rowKey)) {
      fail(`exceptions.jsonl names rowKey ${entry.rowKey} more than once.`);
      return;
    }
    keys.add(entry.rowKey);
  });
  return keys;
}

// ---------------------------------------------------------------------------
// Banks
// ---------------------------------------------------------------------------

type LoadedBank = { bank: BankEnvelope; file: string; sha256: string };

async function loadLiveBanks(postRepair: boolean): Promise<LoadedBank[]> {
  const filenames = (await readdir(BANK_DIR)).filter((f) => f.endsWith(".json")).sort();
  const pinned = Object.keys(FROZEN_BANK_SHA256).sort();
  const seen = filenames.map((f) => `banks/${f}`).sort();
  if (JSON.stringify(seen) !== JSON.stringify(pinned)) {
    fail(
      `Bundled bank set differs from the 13 pinned banks.\n  live:   ${seen.join(", ")}\n  pinned: ${pinned.join(", ")}`,
    );
  }

  const banks: LoadedBank[] = [];
  for (const filename of filenames) {
    const bankPath = `banks/${filename}`;
    const text = readFileSync(join(BANK_DIR, filename), "utf8");
    const digest = createHash("sha256").update(text, "utf8").digest("hex");
    const frozen = FROZEN_BANK_SHA256[bankPath];
    const affected = AFFECTED_BANKS.has(bankPath);

    if (frozen === undefined) {
      fail(`${bankPath} is not pinned; refusing to proceed with an unrecognised bundled bank.`);
    } else if (!postRepair) {
      if (digest !== frozen) {
        fail(`${bankPath}: live SHA-256 ${digest} does not equal the frozen pre-repair fingerprint ${frozen}.`);
      }
      note(`${bankPath} sha256=${digest} (matches frozen)`);
    } else if (!affected) {
      if (digest !== frozen) {
        fail(
          `${bankPath}: unaffected bank changed. live SHA-256 ${digest} does not equal the frozen ${frozen}. ` +
            "The repair is only authorized to touch the four affected banks.",
        );
      }
      note(`${bankPath} sha256=${digest} (unaffected, matches frozen)`);
    } else {
      note(
        `${bankPath} post-repair sha256=${digest} (affected bank; pre-repair was ${frozen}; ` +
          "expected to differ — record this in the commission evidence)",
      );
      if (digest === frozen) {
        note(`${bankPath} is byte-identical to pre-repair; no row in this bank was mutated.`);
      }
    }

    const parsed = validateBankObject(parseBankText(text), { rejectUnknownKeys: true });
    if (!parsed.ok) {
      fail(`${bankPath}: schema validation failed — ${parsed.reasons.join("; ")}`);
      continue;
    }
    banks.push({ bank: parsed.value, file: bankPath, sha256: digest });
  }
  return banks;
}

type LiveAffected = {
  id: string;
  bankPath: string;
  parentCaseId: string;
  partId: string;
  bothAbsent: boolean;
};

function liveAffected(banks: LoadedBank[]): LiveAffected[] {
  return findStageReferenceFindings(banks.map(({ bank, file }) => ({ bank, file })))
    .flatMap((finding) =>
      finding.kind === "revealsAllStages"
        ? [
            {
              id: identity(finding.file, finding.parentId, finding.partId),
              bankPath: finding.file,
              parentCaseId: finding.parentId,
              partId: finding.partId,
              bothAbsent:
                finding.anchorState.answerableAfterStageId.status === "absent" &&
                finding.anchorState.stageId.status === "absent",
            },
          ]
        : [],
    );
}

// ---------------------------------------------------------------------------
// Structural resolution — the load-bearing POST-REPAIR proof
// ---------------------------------------------------------------------------

type Resolved =
  | { ok: true; part: CaseSubQuestion; declaredStageIds: string[] }
  | { ok: false; reason: string };

function resolveRow(banks: LoadedBank[], row: InventoryRow): Resolved {
  const bank = banks.find((b) => b.file === row.bankPath);
  if (bank === undefined) return { ok: false, reason: `bank ${row.bankPath} did not load` };

  const parents = bank.bank.questions.filter((q) => q.id === row.parentCaseId);
  if (parents.length !== 1) {
    return { ok: false, reason: `parent case resolved ${parents.length} times (expected exactly 1)` };
  }
  const parent = parents[0];
  if (parent.itemType !== "case_study") {
    return { ok: false, reason: `parent ${row.parentCaseId} is no longer a case_study` };
  }
  const caseParent = parent as CaseStudyQuestion;

  const parts = caseParent.caseStudy.questions.filter((p) => p.id === row.partId);
  if (parts.length !== 1) {
    return { ok: false, reason: `part resolved ${parts.length} times (expected exactly 1)` };
  }

  const declaredStageIds = (caseParent.caseStudy.stages ?? []).map((stage) => stage.id);
  return { ok: true, part: parts[0], declaredStageIds };
}

// ---------------------------------------------------------------------------
// Modes
// ---------------------------------------------------------------------------

function runPreflight(inventory: InventoryRow[], banks: LoadedBank[]): void {
  const frozenIds = new Set(inventory.map((r) => identity(r.bankPath, r.parentCaseId, r.partId)));
  const live = liveAffected(banks);
  const liveIds = new Set(live.map((r) => r.id));

  const added = [...liveIds].filter((id) => !frozenIds.has(id));
  const removed = [...frozenIds].filter((id) => !liveIds.has(id));
  if (added.length > 0) {
    fail(`Live re-derivation found ${added.length} affected row(s) absent from the frozen inventory.`);
    for (const id of added.slice(0, 20)) fail(`  + ${show(id)}`);
  }
  if (removed.length > 0) {
    fail(`Live re-derivation is missing ${removed.length} frozen inventory row(s).`);
    for (const id of removed.slice(0, 20)) fail(`  - ${show(id)}`);
  }

  const impure = live.filter((r) => !r.bothAbsent);
  if (impure.length > 0) {
    fail(
      `${impure.length} live affected row(s) are not pure omission cases; the frozen ` +
        "affectedCondition BOTH_ANCHORS_ABSENT no longer describes the population.",
    );
  }

  // Structural sanity on the frozen set even pre-repair: identities must resolve,
  // and the declared stage list must still equal the frozen one.
  for (const row of inventory) {
    const resolved = resolveRow(banks, row);
    if (!resolved.ok) {
      fail(`row ${row.rowKey} (${row.partId}): ${resolved.reason}`);
      continue;
    }
    if (JSON.stringify(resolved.declaredStageIds) !== JSON.stringify(row.declaredStageIds)) {
      fail(
        `row ${row.rowKey} (${row.partId}): declared stage IDs drifted.\n` +
          `    frozen: ${JSON.stringify(row.declaredStageIds)}\n` +
          `    live:   ${JSON.stringify(resolved.declaredStageIds)}`,
      );
    }
  }

  note(`live revealsAllStages rows: ${live.length}`);
  note(`frozen inventory rows resolved structurally: ${inventory.length}`);
}

function runPostRepair(
  inventory: InventoryRow[],
  banks: LoadedBank[],
  exceptions: Set<string>,
): void {
  const frozenIds = new Set(inventory.map((r) => identity(r.bankPath, r.parentCaseId, r.partId)));
  const live = liveAffected(banks);
  const liveIds = new Set(live.map((r) => r.id));

  let repaired = 0;
  let exceptioned = 0;

  for (const row of inventory) {
    const id = identity(row.bankPath, row.parentCaseId, row.partId);
    const label = `row ${row.rowKey} (${row.bankPath} / ${row.parentCaseId} / ${row.partId})`;
    const isException = exceptions.has(row.rowKey);

    const resolved = resolveRow(banks, row);
    if (!resolved.ok) {
      fail(`${label}: ${resolved.reason}. A frozen identity must still resolve exactly once.`);
      continue;
    }
    const { part, declaredStageIds } = resolved;

    // Declared stage list must be untouched in both cases.
    if (JSON.stringify(declaredStageIds) !== JSON.stringify(row.declaredStageIds)) {
      fail(
        `${label}: declared stage IDs or their order changed.\n` +
          `    frozen: ${JSON.stringify(row.declaredStageIds)}\n` +
          `    live:   ${JSON.stringify(declaredStageIds)}`,
      );
      continue;
    }

    if (isException) {
      exceptioned += 1;
      if (part.answerableAfterStageId !== undefined) {
        fail(`${label}: exceptioned row must retain the frozen absent answerableAfterStageId state, but the field is present.`);
      }
      if (part.stageId !== undefined) {
        fail(`${label}: exceptioned row must retain the frozen absent stageId state, but the field is present.`);
      }
      if (!liveIds.has(id)) {
        fail(
          `${label}: exceptioned row is no longer reported as revealsAllStages. An unrepaired row ` +
            "must still fail open; its disappearance indicates an unauthorized structural mutation.",
        );
      }
      continue;
    }

    const rowFailuresBefore = failures.length;
    const anchor = part.answerableAfterStageId;
    if (anchor === undefined) {
      fail(`${label}: answerableAfterStageId is absent and the row carries no exception entry.`);
      continue;
    }
    if (typeof anchor !== "string" || anchor.length === 0) {
      fail(`${label}: answerableAfterStageId is not a non-empty string.`);
      continue;
    }
    if (!declaredStageIds.includes(anchor)) {
      fail(
        `${label}: answerableAfterStageId ${JSON.stringify(anchor)} does not byte-exactly match any ` +
          `declared stage id ${JSON.stringify(declaredStageIds)}.`,
      );
      continue;
    }
    if (part.stageId !== undefined) {
      fail(`${label}: stageId must remain absent; found ${JSON.stringify(part.stageId)}.`);
    }
    if (liveIds.has(id)) {
      fail(`${label}: still reported as revealsAllStages despite a resolving anchor.`);
    }
    if (failures.length === rowFailuresBefore) repaired += 1;
  }

  const introduced = [...liveIds].filter((id) => !frozenIds.has(id));
  if (introduced.length > 0) {
    fail(`Repair introduced ${introduced.length} new non-closing row(s) outside the frozen set.`);
    for (const id of introduced.slice(0, 20)) fail(`  + ${show(id)}`);
  }

  note(`rows structurally proven repaired: ${repaired}`);
  note(`rows exceptioned (unrepaired, still failing open): ${exceptioned}`);
  note(`repaired + exceptioned = ${repaired + exceptioned} (expected ${EXPECTED_ROWS})`);
  note(`live revealsAllStages rows remaining: ${live.length}`);

  if (repaired + exceptioned !== EXPECTED_ROWS) {
    fail(`repaired + exceptioned is ${repaired + exceptioned}; expected ${EXPECTED_ROWS}.`);
  }
  if (exceptions.size > 0) {
    fail(
      `${exceptions.size} row(s) remain exceptioned. Zero exceptions are required for the full ` +
        "CAMPAIGN16_ANCHOR_REPAIR_READY terminal and for any claim that the 451-row fail-open " +
        "mechanism has been removed. Return the exceptioned rows for owner/content disposition " +
        "under CAMPAIGN16_ANCHOR_REPAIR_PARTIAL_EXCEPTIONS_OUTSTANDING.",
    );
  }
}

// ---------------------------------------------------------------------------
// Self-test — exercises the pure argument/queue logic without touching banks
// ---------------------------------------------------------------------------

function selfTest(): void {
  const checks: Array<{ name: string; pass: boolean }> = [];
  const record = (name: string, pass: boolean) => checks.push({ name, pass });

  const before = failures.length;
  record("rejects a missing commission root", resolveExceptionFile(undefined) === null);
  record("rejects an empty commission root", resolveExceptionFile("   ") === null);
  record("rejects a root outside audit/", resolveExceptionFile("scratch/whatever") === null);
  record("rejects a nested root", resolveExceptionFile("audit/a/b") === null);
  record(
    "rejects a badly named root",
    resolveExceptionFile("audit/campaign-16-phase-e-anchor-omission-inventory-2026-09-08-r1") === null,
  );
  record(
    "rejects a well-named but absent root",
    resolveExceptionFile("audit/campaign-16-anchor-omission-repair-2099-01-01-r1") === null,
  );
  failures.length = before; // self-test failures are expected; do not pollute the real run

  record("pins exactly 13 banks", Object.keys(FROZEN_BANK_SHA256).length === 13);
  record("marks exactly 4 banks affected", AFFECTED_BANKS.size === 4);
  record(
    "every affected bank is pinned",
    [...AFFECTED_BANKS].every((b) => FROZEN_BANK_SHA256[b] !== undefined),
  );
  record(
    "commission-root pattern accepts the canonical shape",
    COMMISSION_ROOT_PATTERN.test("campaign-16-anchor-omission-repair-2026-09-15-r1"),
  );
  record(
    "commission-root pattern rejects a missing revision",
    !COMMISSION_ROOT_PATTERN.test("campaign-16-anchor-omission-repair-2026-09-15"),
  );

  const inv = readInventory();
  record("inventory digest matches the pin", failures.length === 0 && inv.length === EXPECTED_ROWS);
  record(
    "inventory spans the expected parents",
    new Set(inv.map((r) => `${r.bankPath}\u0000${r.parentCaseId}`)).size === EXPECTED_PARENTS,
  );
  record("inventory rowKeys are unique", new Set(inv.map((r) => r.rowKey)).size === inv.length);

  const keys = new Set(inv.map((r) => r.rowKey));
  const beforeDup = failures.length;
  readExceptions(null, keys);
  record("null exception path yields an empty queue", failures.length === beforeDup);

  console.log("=== preflight-verify self-test ===");
  let bad = 0;
  for (const check of checks) {
    console.log(`  [${check.pass ? "PASS" : "FAIL"}] ${check.name}`);
    if (!check.pass) bad += 1;
  }
  console.log(bad === 0 ? `\n[PASS] ${checks.length}/${checks.length} self-tests passed.` : `\n[FAIL] ${bad} self-test(s) failed.`);
  if (bad > 0) process.exit(1);
}

// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  if (process.argv.includes("--self-test")) {
    selfTest();
    return;
  }

  const postRepair = process.argv.includes("--post-repair");
  const mode = postRepair ? "POST-REPAIR" : "PREFLIGHT";
  const rootIndex = process.argv.indexOf("--commission-root");
  const rawRoot = rootIndex === -1 ? undefined : process.argv[rootIndex + 1];

  if (!postRepair && rawRoot !== undefined) {
    fail("--commission-root is only meaningful with --post-repair.");
  }

  const inventory = readInventory();
  if (inventory.length !== EXPECTED_ROWS) {
    fail(`Frozen inventory holds ${inventory.length} row(s); expected ${EXPECTED_ROWS}.`);
  }
  const parents = new Set(inventory.map((r) => `${r.bankPath}\u0000${r.parentCaseId}`));
  if (parents.size !== EXPECTED_PARENTS) {
    fail(`Frozen inventory spans ${parents.size} parent case(s); expected ${EXPECTED_PARENTS}.`);
  }
  const rowKeys = new Set(inventory.map((r) => r.rowKey));
  if (rowKeys.size !== inventory.length) fail("Frozen inventory contains duplicate rowKeys.");
  const ids = new Set(inventory.map((r) => identity(r.bankPath, r.parentCaseId, r.partId)));
  if (ids.size !== inventory.length) fail("Frozen inventory contains duplicate identity tuples.");

  const exceptionFile = postRepair ? resolveExceptionFile(rawRoot) : null;
  const exceptions = postRepair ? readExceptions(exceptionFile, rowKeys) : new Set<string>();

  const banks = await loadLiveBanks(postRepair);

  if (failures.length === 0 || banks.length === Object.keys(FROZEN_BANK_SHA256).length) {
    if (postRepair) runPostRepair(inventory, banks, exceptions);
    else runPreflight(inventory, banks);
  }

  console.log(`=== Phase E anchor-omission ${mode} ===`);
  for (const line of notes) console.log(`  ${line}`);
  if (failures.length === 0) {
    console.log(`\n[PASS] ${mode} satisfied.`);
    return;
  }
  console.log("");
  for (const line of failures) console.error(`[FAIL] ${line}`);
  console.error(
    `\n${mode} FAILED with ${failures.length} finding(s). ` +
      (postRepair ? "Do not claim closure." : "Repair must not proceed."),
  );
  process.exit(1);
}

await main();
