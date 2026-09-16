#!/usr/bin/env node
// Producing-team scope evidence only; this does not supply independent acceptance.
// Continuation proof: preserves every original blocked artifact.
// Run: node audit/mobile-dropdown-cloze-overflow-r1/post-disposition/verify-continuation-scope.mjs
// Optional --out PATH is restricted to this task's evidence directory.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = '642b0f9c8707024037709b26b764c7b21e66ddce';
const blockedTip = '4e22688c5d35b31aac1a29ead8b888bddfe9c0bf';
const testedProduction = '3cb99e6478bd8a6ff9a90f571afb98860973db4c';
const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const taskEvidenceRelative = 'audit/mobile-dropdown-cloze-overflow-r1/';
const evidenceRelative = `${taskEvidenceRelative}post-disposition/`;
const evidenceRoot = resolve(repo, evidenceRelative);
const argv = process.argv.slice(2);
assert(argv.length === 0 || (argv.length === 2 && argv[0] === '--out'), 'Usage: verify-continuation-scope.mjs [--out post-disposition-output.json]');
const output = resolve(repo, argv[1] ?? `${evidenceRelative}protected-paths.json`);
assert(output.startsWith(`${evidenceRoot}/`), 'Output must remain in the task-owned evidence directory');
const require = createRequire(resolve(repo, 'package.json'));
const ts = require('typescript');
const postcss = require('postcss');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const nulList = value => value.split('\0').filter(Boolean);
const allowed = path => path === 'src/App.tsx' || path === 'src/styles.css' || path === 'scripts/tests/mobile-dropdown-cloze-layout.mjs' || path.startsWith(taskEvidenceRelative);
const snapshotHead = git('rev-parse', 'HEAD').trim();
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); return Boolean(condition); };

const inventory = ref => nulList(git('ls-tree', '-r', '-z', ref)).map(row => {
  const tab = row.indexOf('\t');
  const [mode, type, object] = row.slice(0, tab).split(' ');
  return { path: row.slice(tab + 1), mode, type, object };
});
const baseInventory = inventory(base);
const headInventory = inventory(snapshotHead);
const protectedInventory = rows => rows.filter(row => !allowed(row.path));
const baseProtected = protectedInventory(baseInventory);
const headProtected = protectedInventory(headInventory);
const trackedChanges = nulList(git('diff', '--name-only', '-z', base, '--'));
const forbiddenTrackedChanges = trackedChanges.filter(path => !allowed(path));
const untracked = nulList(git('ls-files', '--others', '--exclude-standard', '-z'));
const forbiddenUntracked = untracked.filter(path => !allowed(path));
const protectedInventoryEqual = check(JSON.stringify(baseProtected) === JSON.stringify(headProtected), 'Protected tracked HEAD object inventory differs from the admitted base');
check(forbiddenTrackedChanges.length === 0, `Tracked paths outside allowlist changed: ${forbiddenTrackedChanges.join(', ')}`);
check(forbiddenUntracked.length === 0, `Untracked paths outside allowlist exist: ${forbiddenUntracked.join(', ')}`);

// Compare original evidence through Git object metadata only. The new continuation
// directory is omitted when reconstructing the original evidence-root tree hash.
// No original blocked evidence contents are read, regenerated, or overwritten.
const blockedInventory = inventory(blockedTip);
const evidencePath = taskEvidenceRelative.slice(0, -1);
const originalEvidence = rows => rows.filter(row => row.path.startsWith(taskEvidenceRelative) && !row.path.startsWith(evidenceRelative));
const blockedFiles = originalEvidence(blockedInventory);
const headOriginalFiles = originalEvidence(headInventory);
const blockedEvidenceChanges = nulList(git('diff', '--name-only', '-z', blockedTip, '--', evidencePath))
  .filter(path => !path.startsWith(evidenceRelative));
const originalEvidenceUntracked = untracked.filter(path => path.startsWith(taskEvidenceRelative) && !path.startsWith(evidenceRelative));
const originalEvidenceInventoryEqual = check(JSON.stringify(blockedFiles) === JSON.stringify(headOriginalFiles), 'Original blocked evidence file object inventory changed');
check(blockedEvidenceChanges.length === 0, `Original blocked evidence working-tree contents changed: ${blockedEvidenceChanges.join(', ')}`);
check(originalEvidenceUntracked.length === 0, `New evidence exists outside post-disposition: ${originalEvidenceUntracked.join(', ')}`);
const blockedEvidenceTree = git('rev-parse', `${blockedTip}:${evidencePath}`).trim();
const headEvidenceTree = git('rev-parse', `${snapshotHead}:${evidencePath}`).trim();
const gitHashAlgorithm = git('rev-parse', '--show-object-format').trim();
const originalRootEntries = nulList(git('ls-tree', '-z', `${snapshotHead}:${evidencePath}`))
  .map(row => {
    const tab = row.indexOf('\t');
    const [mode, type, object] = row.slice(0, tab).split(' ');
    return { mode, type, object, name: row.slice(tab + 1) };
  })
  .filter(row => row.name !== 'post-disposition');
const projectedTreeBytes = Buffer.concat(originalRootEntries.map(row => Buffer.concat([
  Buffer.from(`${row.mode.replace(/^0+/, '')} ${row.name}\0`), Buffer.from(row.object, 'hex'),
])));
const projectedTree = createHash(gitHashAlgorithm)
  .update(Buffer.from(`tree ${projectedTreeBytes.length}\0`)).update(projectedTreeBytes).digest('hex');
const originalEvidenceTreeEqual = check(projectedTree === blockedEvidenceTree, 'Git tree of original evidence entries differs from blocked tip');
const originalEvidenceFileProof = blockedFiles.map(before => {
  const after = headOriginalFiles.find(row => row.path === before.path);
  const trackedUnchanged = !blockedEvidenceChanges.includes(before.path);
  const equal = Boolean(after && before.object === after.object && before.mode === after.mode && trackedUnchanged);
  check(equal, `Original blocked artifact changed: ${before.path}`);
  return { path: before.path, mode: before.mode, blockedObject: before.object,
    headObject: after?.object ?? null, workingTreeObject: equal ? before.object : null, equal };
});
const originalBlockedEvidenceProof = {
  blockedTip, evidencePath, fileCount: blockedFiles.length, blockedEvidenceTree,
  candidateWholeEvidenceTree: headEvidenceTree,
  candidateEvidenceTreeExcludingPostDisposition: projectedTree,
  originalTreeEqual: originalEvidenceTreeEqual, originalFileInventoryEqual: originalEvidenceInventoryEqual,
  workingTreeOriginalEvidenceObject: originalEvidenceTreeEqual && blockedEvidenceChanges.length === 0 && originalEvidenceUntracked.length === 0 ? blockedEvidenceTree : null,
  blockedEvidenceChanges, originalEvidenceUntracked, files: originalEvidenceFileProof,
  equal: originalEvidenceTreeEqual && originalEvidenceInventoryEqual && blockedEvidenceChanges.length === 0 && originalEvidenceUntracked.length === 0,
  method: 'Original file modes/blob IDs and original evidence Git tree are compared to the blocked tip. The new post-disposition directory is excluded from the projected tree; git diff verifies original tracked working-tree contents. No original evidence body is read.',
};

// Runtime remains at the previously tested production commit. Ignore only this
// commission's evidence and browser runner; compare every other tracked object.
const productionInventory = rows => rows.filter(row => !row.path.startsWith(taskEvidenceRelative) && row.path !== 'scripts/tests/mobile-dropdown-cloze-layout.mjs');
const testedProductionInventory = productionInventory(inventory(testedProduction));
const candidateProductionInventory = productionInventory(headInventory);
const productionInventoryEqual = check(JSON.stringify(testedProductionInventory) === JSON.stringify(candidateProductionInventory), 'Tracked production inventory changed since the previously tested commit');
const productionChanges = nulList(git('diff', '--name-only', '-z', testedProduction, '--'))
  .filter(path => !path.startsWith(taskEvidenceRelative) && path !== 'scripts/tests/mobile-dropdown-cloze-layout.mjs');
const productionUntracked = untracked.filter(path => !path.startsWith(taskEvidenceRelative) && path !== 'scripts/tests/mobile-dropdown-cloze-layout.mjs');
check(productionChanges.length === 0, `Production working-tree changes since tested commit: ${productionChanges.join(', ')}`);
check(productionUntracked.length === 0, `Untracked paths outside continuation evidence/runner: ${productionUntracked.join(', ')}`);
const testedSrcTree = git('rev-parse', `${testedProduction}:src`).trim();
const headSrcTree = git('rev-parse', `${snapshotHead}:src`).trim();
const srcEqual = check(testedSrcTree === headSrcTree && !productionChanges.some(path => path.startsWith('src/')), 'Production src tree differs from tested commit');
const productionEqualityProof = {
  testedProduction, comparedTrackedFiles: testedProductionInventory.length,
  testedObjectInventorySha256: sha256(JSON.stringify(testedProductionInventory)),
  candidateObjectInventorySha256: sha256(JSON.stringify(candidateProductionInventory)),
  objectInventoryEqual: productionInventoryEqual, productionChanges, productionUntracked,
  src: { testedTree: testedSrcTree, candidateHeadTree: headSrcTree, candidateWorkingTreeObject: srcEqual ? testedSrcTree : null, equal: srcEqual },
  equal: productionInventoryEqual && productionChanges.length === 0 && productionUntracked.length === 0,
};

// Parse real TypeScript/TSX AST function declarations; no brace-counting or regex parser.
const allowedFunctions = new Set(['DropdownClozeControl', 'ClozeLine']);
const appBase = git('show', `${base}:src/App.tsx`);
const appCurrent = readFileSync(resolve(repo, 'src/App.tsx'), 'utf8');
const parseApp = (text, label) => {
  const source = ts.createSourceFile('src/App.tsx', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  assert(source.parseDiagnostics.length === 0, `${label} App.tsx must parse without syntax diagnostics`);
  const functions = source.statements.filter(ts.isFunctionDeclaration).filter(node => node.name);
  for (const name of allowedFunctions) assert.equal(functions.filter(node => node.name.text === name).length, 1, `${label} has exactly one ${name}`);
  const permitted = functions.filter(node => allowedFunctions.has(node.name.text));
  let outside = text;
  for (const node of [...permitted].sort((a, b) => b.getStart(source) - a.getStart(source))) {
    outside = outside.slice(0, node.getStart(source)) + `/* permitted function: ${node.name.text} */` + outside.slice(node.end);
  }
  return { outside, functions: functions.map(node => ({
    name: node.name.text,
    line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
    endLine: source.getLineAndCharacterOfPosition(node.end).line + 1,
    sha256: sha256(text.slice(node.getStart(source), node.end)),
  })) };
};
const parsedBase = parseApp(appBase, 'admitted-base');
const parsedCurrent = parseApp(appCurrent, 'working-tree');
const appOutsideEqual = check(parsedBase.outside === parsedCurrent.outside, 'App.tsx contains a byte change outside the two permitted AST function nodes');
const functionProof = parsedBase.functions.map(before => {
  const after = parsedCurrent.functions.find(node => node.name === before.name);
  const equal = Boolean(after && before.sha256 === after.sha256);
  if (!allowedFunctions.has(before.name)) check(equal, `Protected App.tsx function changed: ${before.name}`);
  return { name: before.name, allowedToChange: allowedFunctions.has(before.name), equal, base: before, workingTree: after ?? null };
});

// PostCSS preserves exact source formatting; remove only the authorized cloze rule nodes.
// Equality of the remaining serialized text proves every other CSS node is unchanged.
const clozeSelector = /^\.cloze-(?:panel|line|choice|select|readout|token)(?::empty)?$/;
const cssBase = git('show', `${base}:src/styles.css`);
const cssCurrent = readFileSync(resolve(repo, 'src/styles.css'), 'utf8');
const parseCss = text => {
  const ast = postcss.parse(text, { from: 'src/styles.css' });
  assert.equal(ast.toString(), text, 'PostCSS must preserve the exact original CSS bytes');
  const removedRules = [];
  ast.walkRules(rule => {
    if (!clozeSelector.test(rule.selector)) return;
    assert.equal(rule.parent.type, 'root', 'This proof admits only top-level cloze selector edits');
    removedRules.push({ selector: rule.selector, css: rule.toString(), sha256: sha256(rule.toString()) });
    rule.remove();
  });
  return { outside: ast.toString(), rules: removedRules };
};
const parsedCssBase = parseCss(cssBase);
const parsedCssCurrent = parseCss(cssCurrent);
const cssOutsideEqual = check(parsedCssBase.outside === parsedCssCurrent.outside, 'CSS contains a byte change outside the permitted top-level cloze rules');
const cssSelectors = [...new Set([...parsedCssBase.rules, ...parsedCssCurrent.rules].map(rule => rule.selector))];
const cssRuleProof = cssSelectors.map(selector => {
  const before = parsedCssBase.rules.filter(rule => rule.selector === selector);
  const after = parsedCssCurrent.rules.filter(rule => rule.selector === selector);
  return { selector, changed: JSON.stringify(before) !== JSON.stringify(after), base: before, workingTree: after };
});

const categories = {
  banks: ['banks'],
  clinicalVisuals: ['src/visuals'],
  schemaTypesGrading: ['src/schema.ts', 'src/types.ts', 'src/grading.ts'],
  storageMigration: ['src/storage.ts', 'src/progressMigration.ts', 'src/categoryMigration.ts'],
  samplerSessionStateNavigationStartGuard: ['src/sessionSampler.ts', 'src/sessionState.ts', 'src/sessionNavigation.ts', 'src/sessionStartGuard.ts'],
  completedMemory: ['src/completedMemory.ts'],
  bankLoadingImport: ['src/banks.ts', 'src/bankImport.ts'],
  calculatorSourcePanel: ['src/examCalculator.ts', 'src/ExamCalculatorPanel.tsx'],
  packageFiles: ['package.json', 'package-lock.json'],
  censusArtifacts: ['census.json', 'BANK-CENSUS.md'],
  existingAcceptedEvidence: ['audit/learner-shell-r3-concept-a-r1', 'audit/learner-shell-r3-concept-a-r1/independent-review', 'audit/learner-shell-r3-concept-a-r1/integration'],
  history: ['PROJECT-HISTORY.md'],
};
const categoryProof = Object.fromEntries(Object.entries(categories).map(([category, paths]) => [category, paths.map(path => {
  const baseObject = git('rev-parse', `${base}:${path}`).trim();
  const headObject = git('rev-parse', `${snapshotHead}:${path}`).trim();
  const type = git('cat-file', '-t', baseObject).trim();
  const changesFromHead = nulList(git('diff', '--name-only', '-z', snapshotHead, '--', path));
  const untrackedWithin = untracked.filter(value => value === path || value.startsWith(`${path}/`));
  const workingTreeEqualsHead = changesFromHead.length === 0 && untrackedWithin.length === 0;
  const equal = check(baseObject === headObject && workingTreeEqualsHead, `Protected category changed: ${category}: ${path}`);
  return { path, type, admittedBaseObject: baseObject, candidateHeadObject: headObject,
    candidateWorkingTreeObject: workingTreeEqualsHead ? headObject : null,
    workingTreeEqualsHead, equal, changesFromHead, untrackedWithin,
    proof: 'Git object/tree identity at HEAD plus an empty tracked working-tree diff and no untracked descendants; no historical evidence file contents are read by this script.' };
})]));

const finalHead = git('rev-parse', 'HEAD').trim();
check(finalHead === snapshotHead, 'HEAD changed while the proof was running; rerun against a stable snapshot');
const finalApp = readFileSync(resolve(repo, 'src/App.tsx'), 'utf8');
const finalCss = readFileSync(resolve(repo, 'src/styles.css'), 'utf8');
check(finalApp === appCurrent && finalCss === cssCurrent, 'Production source changed while the proof was running; rerun');
const report = {
  purpose: 'Producing-team scope evidence, not independent acceptance',
  admittedBase: base, headAtRun: snapshotHead, branch: git('branch', '--show-current').trim(), worktree: repo,
  authority: {
    originalWorkOrderSha256: '968a575b9f2f5b2b734cc5281a992f92a09dd52c409ea7d104fd5043004d6a6e',
    ownerDispositionSha256: '5ba74604d9052e3a5f578627f9ac709c597d421af1f3ff788a934f1b5face11b',
    note: 'Read-only authority hashes verified by the producing evidence seat before script creation; this script does not access the owner checkout.',
  },
  generatedAt: new Date().toISOString(), status: errors.length ? 'FAIL' : 'PASS', errors,
  tools: { typescript: ts.version, postcss: require('postcss/package.json').version },
  invocation: `node ${evidenceRelative}verify-continuation-scope.mjs`,
  allTrackedOutsideAllowlist: {
    baseFileCount: baseProtected.length, headFileCount: headProtected.length,
    baseObjectInventorySha256: sha256(JSON.stringify(baseProtected)),
    headObjectInventorySha256: sha256(JSON.stringify(headProtected)),
    objectInventoryEqual: protectedInventoryEqual, forbiddenTrackedChanges, forbiddenUntracked,
    equal: protectedInventoryEqual && forbiddenTrackedChanges.length === 0 && forbiddenUntracked.length === 0,
  },
  trackedChanges,
  app: {
    admittedBlob: git('rev-parse', `${base}:src/App.tsx`).trim(),
    workingTreeBlob: git('hash-object', 'src/App.tsx').trim(),
    allowedFunctionNames: [...allowedFunctions], outsideFunctionsByteEqual: appOutsideEqual,
    outsideBaseSha256: sha256(parsedBase.outside), outsideWorkingTreeSha256: sha256(parsedCurrent.outside),
    changedFunctionNames: functionProof.filter(row => !row.equal).map(row => row.name), functions: functionProof,
  },
  css: {
    admittedBlob: git('rev-parse', `${base}:src/styles.css`).trim(),
    workingTreeBlob: git('hash-object', 'src/styles.css').trim(),
    outsideClozeRulesByteEqual: cssOutsideEqual,
    outsideBaseSha256: sha256(parsedCssBase.outside), outsideWorkingTreeSha256: sha256(parsedCssCurrent.outside),
    sharedAncestorRulesChanged: !cssOutsideEqual,
    changedSelectors: cssRuleProof.filter(row => row.changed).map(row => row.selector), rules: cssRuleProof,
  },
  protectedCategories: categoryProof,
  originalBlockedEvidence: originalBlockedEvidenceProof,
  productionEqualityToPreviouslyTestedCommit: productionEqualityProof,
};
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(resolve(evidenceRoot, 'production.diff'), git('diff', '--no-ext-diff', '--no-color', '--unified=0', base, '--', 'src/App.tsx', 'src/styles.css'));
console.log(JSON.stringify({ status: report.status, output: relative(repo, output), protectedFileCount: baseProtected.length,
  originalBlockedEvidenceFiles: blockedFiles.length, originalBlockedEvidenceEqual: originalBlockedEvidenceProof.equal,
  productionEqualTo: testedProduction, productionEquality: productionEqualityProof.equal,
  appChangedFunctions: report.app.changedFunctionNames, cssChangedSelectors: report.css.changedSelectors, errors }, null, 2));
if (errors.length) process.exitCode = 1;
