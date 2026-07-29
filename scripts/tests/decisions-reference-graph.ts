import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import {
  checkDecisionsFormat,
  parseDecisionsDocument,
  parseLegacyDecisionDefinitions,
} from "../../lib/decisions-format";

type GraphRecord = {
  from: string;
  fromLine: number;
  rawText: string;
  kind: string;
  target: string | null;
  resolves: boolean;
  targetState: string;
  class: string | null;
};

type GraphManifest = {
  formatMode: "legacy" | "target";
  counts: {
    derivedIdentifier: number;
    invalidAnchorCitation: number;
    byKind: Record<string, number>;
    [key: string]: unknown;
  };
  references: GraphRecord[];
};

const repositoryRoot = resolve(".");
const tsxCli = resolve("node_modules/tsx/dist/cli.mjs");
const graphScript = resolve("scripts/decisions-reference-graph.ts");

function runGraph(root: string, out: string) {
  return spawnSync(process.execPath, [
    tsxCli,
    graphScript,
    "--root",
    root,
    "--out",
    out,
  ], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });
}

async function initCorpus(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "shrimp-decisions-graph-"));
  for (const [path, text] of Object.entries(files)) {
    const absolute = join(root, path);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, text);
  }
  for (const args of [
    ["init", "-q"],
    ["config", "user.email", "fixture@example.invalid"],
    ["config", "user.name", "Fixture"],
    ["add", "--", "."],
    ["commit", "-qm", "fixture"],
  ]) {
    const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, `${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  }
  return root;
}

const legacyDecisions = `# Legacy decisions

## 4. Governing principles

**1. First principle. Status: ACTIVE.**
Body.

## 5. CONDITIONAL lane

**2. CONDITIONAL — Conditional principle.**
Body.

## 6. LAPSED CONDITIONAL lane

**3. CONDITIONAL — Lapsed principle.**
Body.
`;

const archiveText = `### P2 — Archived rule

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-29
- **Original Kind:** P
- **Original Status:** ACTIVE
- **Retired ID:** P2
- **Origin:** \`DECISIONS.md\` §4 at \`MIGRATION_BASELINE\`

Historical body.
`;

const targetDecisions = `# Target decisions

## 3. Entry index

| ID | kind | status | force | summary |
|---|---|---|---|---|
| P1 | P | ACTIVE | BINDING | Nurse's P2 first rule |
| — | I | ACTIVE | BINDING | Runtime audio carries no client-embedded secret |
| — | T | REVISIT | ADVISORY | Decide the future update lane |

**Declared total:** 3 entry blocks.

## 4. Governing principles

### P1 — Nurse's P2 first rule

This is the first governed statement.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-29

## 5. Concrete rulings

## 6. Standing invariants

### Runtime audio carries no client-embedded secret

Runtime audio must remain offline.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-29

## 7. Open threads

### Decide the future update lane

The update mechanism remains undecided.

- **Kind:** T
- **Status:** REVISIT
- **Force:** ADVISORY
- **Date:** 2026-07-29

## 8. Archive index

- **P2 Archived rule** — retired 2026-07-29.
  \`Archive/DECISIONS-ARCHIVE-2026-07-29.md#p2-archived-rule\`

| ID | disposition | date | pointer |
|---|---|---|---|
| P2 | RETIRED | 2026-07-29 | \`Archive/DECISIONS-ARCHIVE-2026-07-29.md#p2-archived-rule\` |
| P3 | NEVER ASSIGNED | — | — |
`;

const targetReferences = `# References

Legacy principle 1 and canonical P1.
Retired P2 and never-assigned P3 and absent R1.
I: \`Runtime audio carries no client-embedded secret\`.
T: \`Unknown thread title\`.
I: \`Invariant governing P1 compatibility\`.
(I: \`\`Unknown title with \` inner tick\`\`),
I: \`runtime audio carries no client-embedded secret\`.
I: \`Runtime  audio carries no client-embedded secret\`.
xI: \`Bad prefix boundary\`.
i: \`Wrong case\`.
I:  \`Wrong spacing\`.
I: \`Bad suffix\`x
\`Runtime audio carries no client-embedded secret\`.
"Runtime audio carries no client-embedded secret".
Runtime audio carries no client-embedded secret.
Derived P1.1 and P1a must each be one record.
[Ratified anchor target](../DECISIONS.md#p1-nurse-s-p2-first-rule)
[GitHub anchor target](../DECISIONS.md#p1-nurses-p2-first-rule)
SOMETHING-P3-SURVEY.md
\`SOMETHING-P3-SURVEY.md\` §20
§20 of SOMETHING-P3-SURVEY.md
`;

const fixtureRows: string[] = [];
const pass = (name: string): void => {
  fixtureRows.push(`${name}: PASS`);
};

// 1. The legacy adapter owns both legacy status forms and liveness.
{
  const definitions = parseLegacyDecisionDefinitions(legacyDecisions);
  assert.deepEqual([...definitions.entries()], [
    [1, "LIVE"],
    [2, "LIVE"],
    [3, "LAPSED"],
  ]);
  pass("legacy-adapter");
}

// 2–4. Target parsing is independent, and the target checker cannot consume legacy output.
{
  const target = parseDecisionsDocument(targetDecisions);
  assert.deepEqual(target.issues, []);
  assert.deepEqual(
    target.entries.map((entry) => entry.id ?? `${entry.kind}:${entry.title}`),
    [
      "P1",
      "I:Runtime audio carries no client-embedded secret",
      "T:Decide the future update lane",
    ],
  );
  const legacyConformance = checkDecisionsFormat({ decisionsText: legacyDecisions });
  assert.equal(legacyConformance.ok, false);
  assert.ok(legacyConformance.issues.some((issue) => issue.code === "MISSING_DECLARED_TOTAL"));
  pass("target-parser-and-legacy-isolation");
}

const targetRoot = await initCorpus({
  "DECISIONS.md": targetDecisions,
  "Archive/DECISIONS-ARCHIVE-2026-07-29.md": archiveText,
  "docs/references.md": targetReferences,
  "docs/SOMETHING-P3-SURVEY.md": "# Survey\n\n## 20. Target\n",
});
const legacyRoot = await initCorpus({
  "DECISIONS.md": legacyDecisions,
  "docs/references.md": "principle 1 and P1. I: `Inactive in legacy`.\n",
});
const malformedTargetRoot = await initCorpus({
  "DECISIONS.md": `# Target intent

## 3. Entry index

| ID | kind | status | force | summary |
|---|---|---|---|---|

**Declared total:** 0 entry blocks.
`,
});
const unrecognizedRoot = await initCorpus({
  "DECISIONS.md": "# Not either governed format\n",
});
const collisionRoot = await initCorpus({
  "DECISIONS.md": targetDecisions.replace(
    "## 7. Open threads",
    `### Runtime audio carries no client-embedded secret

This duplicate title must fail closed.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-29

## 7. Open threads`,
  ).replace(
    "**Declared total:** 3 entry blocks.",
    "**Declared total:** 4 entry blocks.",
  ).replace(
    "| — | T | REVISIT | ADVISORY | Decide the future update lane |",
    `| — | I | ACTIVE | BINDING | Runtime audio carries no client-embedded secret |
| — | T | REVISIT | ADVISORY | Decide the future update lane |`,
  ),
  "Archive/DECISIONS-ARCHIVE-2026-07-29.md": archiveText,
});

const relativeOutput = `scratch/decisions-reference-graph-test-${process.pid}/graph.json`;
const relativeAbsolute = resolve(repositoryRoot, relativeOutput);

try {
  const targetRun = runGraph(targetRoot, relativeOutput);
  assert.equal(targetRun.status, 0, `${targetRun.stdout}\n${targetRun.stderr}`);
  const targetManifest = JSON.parse(await readFile(relativeAbsolute, "utf8")) as GraphManifest;
  assert.equal(targetManifest.formatMode, "target");

  const refs = targetManifest.references.filter((record) => record.from === "docs/references.md");
  const principle = refs.find((record) => record.rawText === "principle 1");
  const canonical = refs.find((record) => record.rawText === "P1");
  assert.ok(principle && canonical);
  assert.deepEqual(
    {
      target: principle.target,
      resolves: principle.resolves,
      targetState: principle.targetState,
      class: principle.class,
    },
    {
      target: canonical.target,
      resolves: canonical.resolves,
      targetState: canonical.targetState,
      class: canonical.class,
    },
  );

  assert.equal(refs.find((record) => record.rawText === "P2")?.targetState, "RETIRED");
  assert.equal(refs.find((record) => record.rawText === "P3")?.targetState, "MISSING");
  assert.equal(
    refs.find((record) => record.rawText.startsWith("I:"))?.target,
    "DECISIONS.md#I:Runtime audio carries no client-embedded secret",
  );
  assert.equal(refs.find((record) => record.rawText.startsWith("T:"))?.targetState, "MISSING");
  const namedRefs = refs.filter((record) => record.kind === "named-entry");
  assert.deepEqual(
    namedRefs.map((record) => record.rawText),
    [
      "I: `Runtime audio carries no client-embedded secret`",
      "T: `Unknown thread title`",
      "I: `Invariant governing P1 compatibility`",
      "I: ``Unknown title with ` inner tick``",
      "I: `runtime audio carries no client-embedded secret`",
      "I: `Runtime  audio carries no client-embedded secret`",
    ],
    "I/T grammar must pin fences, boundaries, case, spacing, and byte-exact lookup",
  );
  assert.deepEqual(
    namedRefs.map((record) => record.targetState),
    ["LIVE", "MISSING", "MISSING", "MISSING", "MISSING", "MISSING"],
  );
  assert.equal(
    refs.some((record) => record.rawText === "Runtime audio carries no client-embedded secret"),
    false,
    "bare title prose must not extract",
  );

  const derived = refs.filter((record) => record.kind === "derived-identifier");
  assert.deepEqual(derived.map((record) => record.rawText), ["P1.1", "P1a"]);
  assert.ok(derived.every((record) =>
    record.target === null &&
    record.class === null &&
    record.resolves === false &&
    record.targetState === "NOT_APPLICABLE"
  ));
  assert.equal(
    refs.filter((record) => record.rawText === "P1").length,
    1,
    "derived prefixes and declaration surfaces must not emit P1 citations",
  );

  const invalid = refs.filter((record) => record.kind === "invalid-anchor-citation");
  assert.deepEqual(
    invalid.map((record) => record.target),
    [
      "DECISIONS.md#p1-nurse-s-p2-first-rule",
      "DECISIONS.md#p1-nurses-p2-first-rule",
    ],
    "ratified and GitHub heading-anchor algorithms must diverge while both remain invalid citations",
  );
  assert.ok(invalid.every((record) =>
    record.class === null &&
    record.resolves === false &&
    record.targetState === "NOT_APPLICABLE"
  ));

  const plainPath = refs.find((record) => record.rawText === "SOMETHING-P3-SURVEY.md");
  assert.equal(plainPath?.kind, "path");
  const pathSection = refs.find((record) => record.rawText === "`SOMETHING-P3-SURVEY.md` §20");
  assert.equal(pathSection?.kind, "path-section");
  const reversed = refs.find((record) => record.rawText === "§20 of SOMETHING-P3-SURVEY.md");
  assert.equal(reversed?.kind, "ambiguous");
  const compoundLines = new Set(
    [plainPath, pathSection, reversed].map((record) => record?.fromLine),
  );
  assert.equal(
    refs.some((record) => record.rawText === "P3" && compoundLines.has(record.fromLine)),
    false,
    "compound path references must not emit embedded P3 identifiers",
  );
  const embeddedNamed = namedRefs.find((record) =>
    record.rawText === "I: `Invariant governing P1 compatibility`"
  );
  assert.ok(embeddedNamed);
  assert.equal(
    refs.some((record) => record.rawText === "P1" && record.fromLine === embeddedNamed.fromLine),
    false,
    "a complete I/T citation must consume embedded canonical IDs",
  );

  const decisionsP2 = targetManifest.references.filter((record) =>
    record.from === "DECISIONS.md" && record.rawText === "P2"
  );
  assert.equal(decisionsP2.length, 1);
  assert.equal(decisionsP2[0].targetState, "RETIRED");
  assert.equal(targetManifest.counts.derivedIdentifier, targetManifest.counts.byKind["derived-identifier"]);
  assert.equal(
    targetManifest.counts.invalidAnchorCitation,
    targetManifest.counts.byKind["invalid-anchor-citation"],
  );
  pass("target-resolution-and-record-contract");

  const legacyOutput = resolve(repositoryRoot, dirname(relativeOutput), "legacy.json");
  const legacyRun = runGraph(legacyRoot, legacyOutput);
  assert.equal(legacyRun.status, 0, `${legacyRun.stdout}\n${legacyRun.stderr}`);
  const legacyManifest = JSON.parse(await readFile(legacyOutput, "utf8")) as GraphManifest;
  assert.equal(legacyManifest.formatMode, "legacy");
  assert.equal(
    legacyManifest.references.some((record) => record.rawText.startsWith("I:")),
    false,
    "I/T extraction must be inactive in legacy mode",
  );
  pass("legacy-mode");

  const malformedOutput = resolve(repositoryRoot, dirname(relativeOutput), "malformed.json");
  const malformedRun = runGraph(malformedTargetRoot, malformedOutput);
  assert.notEqual(malformedRun.status, 0);
  const malformedOutputText = `${malformedRun.stdout}\n${malformedRun.stderr}`;
  assert.match(malformedOutputText, /EMPTY_TARGET_DEFINITION_INDEX/);
  console.log("Negative control output");
  console.log(malformedOutputText.trim());
  pass("empty-index-negative-control");

  const unrecognizedOutput = resolve(repositoryRoot, dirname(relativeOutput), "unrecognized.json");
  const unrecognizedRun = runGraph(unrecognizedRoot, unrecognizedOutput);
  assert.notEqual(unrecognizedRun.status, 0);
  assert.match(`${unrecognizedRun.stdout}\n${unrecognizedRun.stderr}`, /UNRECOGNIZED_DECISIONS_DOCUMENT/);
  pass("empty-legacy-index");

  const collisionOutput = resolve(repositoryRoot, dirname(relativeOutput), "collision.json");
  const collisionRun = runGraph(collisionRoot, collisionOutput);
  assert.notEqual(collisionRun.status, 0);
  assert.match(`${collisionRun.stdout}\n${collisionRun.stderr}`, /TITLE_COLLISION/);
  pass("name-collision-fails-closed");

  const frozenOutput = resolve(
    repositoryRoot,
    "audit/decisions-cleanup-2026-07-24/reference-graph.json",
  );
  const frozenRun = runGraph(legacyRoot, frozenOutput);
  assert.notEqual(frozenRun.status, 0);
  assert.match(`${frozenRun.stdout}\n${frozenRun.stderr}`, /FROZEN_PHASE_1_OUTPUT/);

  const insideRootOutput = join(legacyRoot, "inside.json");
  const insideRun = runGraph(legacyRoot, insideRootOutput);
  assert.notEqual(insideRun.status, 0);
  assert.match(`${insideRun.stdout}\n${insideRun.stderr}`, /OUTPUT_INSIDE_MEASUREMENT_ROOT/);
  assert.equal(relativeAbsolute.startsWith(repositoryRoot), true);
  pass("output-path-guards");

  console.log("Fixture matrix");
  for (const row of fixtureRows) console.log(row);
  console.log("decisions-reference-graph tests passed");
} finally {
  await rm(targetRoot, { recursive: true, force: true });
  await rm(legacyRoot, { recursive: true, force: true });
  await rm(malformedTargetRoot, { recursive: true, force: true });
  await rm(unrecognizedRoot, { recursive: true, force: true });
  await rm(collisionRoot, { recursive: true, force: true });
  await rm(resolve(repositoryRoot, dirname(relativeOutput)), { recursive: true, force: true });
}
