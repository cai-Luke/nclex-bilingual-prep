// Producer evidence only; no independent acceptance. Read-only outside this directory.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const output = dirname(fileURLToPath(import.meta.url));
const repo = resolve(output, '../../..');
const prefix = 'audit/mobile-dropdown-cloze-overflow-r1/checker-harness-repair/';
const runner = 'scripts/tests/mobile-dropdown-cloze-layout.mjs';
const resumed = '55c2c172bab9355745807572e1c84e413a6e4a3e';
const production = '3cb99e6478bd8a6ff9a90f571afb98860973db4c';
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trimEnd();
const digest = (value) => createHash('sha256').update(value).digest('hex');
const inventory = (ref) => git('ls-tree', '-r', '-z', ref).split('\0').filter(Boolean).map((row) => {
  const [metadata, path] = row.split('\t'); return { path, metadata };
});
const allowed = (path) => path === runner || path.startsWith(prefix);
const head = git('rev-parse', 'HEAD');
const before = inventory(resumed).filter((row) => !allowed(row.path));
const current = inventory(head).filter((row) => !allowed(row.path));
assert.deepEqual(current, before, 'Every tracked object outside the harness repair must remain unchanged');
const changes = git('diff', '--name-only', resumed, '--').split('\n').filter(Boolean);
assert(changes.every(allowed), `Out-of-scope working-tree changes: ${changes.filter((path) => !allowed(path))}`);
const untracked = git('ls-files', '--others', '--exclude-standard').split('\n').filter(Boolean);
assert(untracked.every((path) => path.startsWith(prefix)), 'Unexpected untracked paths');
const productionOnly = (rows) => rows.filter(({ path }) => !path.startsWith('audit/') && path !== runner);
const productionObjects = productionOnly(inventory(production));
assert.deepEqual(productionOnly(inventory(head)), productionObjects, 'Production objects must equal 3cb99e6');
const priorEvidence = before.filter(({ path }) => path.startsWith('audit/mobile-dropdown-cloze-overflow-r1/'));
const evidenceObjects = priorEvidence.map(({ path, metadata }) => {
  const expected = metadata.split(' ')[2]; const observed = git('hash-object', path);
  assert.equal(observed, expected, `Historical evidence modified: ${path}`); return { path, blob: observed };
});
const ts = createRequire(resolve(repo, 'package.json'))('typescript');
const oldText = git('show', `${resumed}:${runner}`);
const newText = readFileSync(resolve(repo, runner), 'utf8');
function parse(text) {
  const source = ts.createSourceFile(runner, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  assert.equal(source.parseDiagnostics.length, 0);
  const functions = new Map(source.statements.filter(ts.isFunctionDeclaration).map((node) => [node.name.text, node]));
  const textOf = (name) => text.slice(functions.get(name).getStart(source), functions.get(name).end);
  return { source, functions, textOf };
}
const old = parse(oldText); const updated = parse(newText);
// All scenario, fixture-identity, readout, interaction, and measurement functions stay exact.
const changedFunctions = [...old.functions.keys()].filter((name) => old.textOf(name) !== updated.textOf(name));
assert.deepEqual(changedFunctions, ['matchedNonCloze', 'containment']);
const containment = updated.functions.get('containment');
const records = [];
const visit = (node) => {
  if (ts.isExpressionStatement(node) && ts.isCallExpression(node.expression) && node.expression.expression.getText(updated.source) === 'control.comparisons.push') records.push(node);
  ts.forEachChild(node, visit);
};
visit(containment); assert.equal(records.length, 1);
const record = records[0];
const withoutRecord = newText.slice(containment.getStart(updated.source), record.getFullStart()) + newText.slice(record.end, containment.end);
assert.equal(withoutRecord, old.textOf('containment'), 'The causal oracle may change only by adding evidence, never by weakening assertions');
const expectedBuilds = JSON.parse(readFileSync(resolve(repo, 'audit/mobile-dropdown-cloze-overflow-r1/post-disposition/preserved-build-hashes.json'), 'utf8'));
for (const [root, files] of Object.entries(expectedBuilds)) for (const [path, hash] of Object.entries(files)) {
  assert.equal(digest(readFileSync(resolve(repo, root, path))), hash, `Preserved build changed: ${root}/${path}`);
}
const result = {
  status: 'PASS', headAtRun: head, resumedTip: resumed, productionCommit: production,
  oldRunnerSha256: digest(readFileSync(resolve(repo, 'scripts/tests/mobile-dropdown-cloze-layout.mjs'))),
  currentRunnerSha256: digest(newText),
  outsideRepair: { files: before.length, objectInventorySha256: digest(JSON.stringify(before)), equal: true },
  production: { objectInventorySha256: digest(JSON.stringify(productionObjects)), equal: true },
  earlierEvidence: { files: evidenceObjects.length, objectInventorySha256: digest(JSON.stringify(evidenceObjects)), equal: true, objects: evidenceObjects },
  runnerFunctions: { changed: changedFunctions, containmentUnchangedExceptEvidenceRecord: true, allOtherFunctionsByteIdentical: true },
  preservedBuildBytesUnchanged: true,
  changedPaths: changes,
};
// git show trimEnd above is for AST comparisons; use exact bytes for the historical hash.
result.oldRunnerSha256 = digest(execFileSync('git', ['show', `${resumed}:${runner}`], { cwd: repo }));
writeFileSync(resolve(output, 'scope-proof.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ status: result.status, productionUnchanged: true, earlierEvidenceFiles: evidenceObjects.length, causalOracleUnchanged: true }));
