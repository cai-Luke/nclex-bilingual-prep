#!/usr/bin/env node
/**
 * Producer evidence only: R3 protected-path and bounded source comparison.
 * Usage: node audit/mobile-calculator-action-clearance-r1/verify-scope.mjs \
 *   --output audit/mobile-calculator-action-clearance-r1/protected-scope.json \
 *   [--candidate <tested-production-commit>] [--typescript-module <module>]
 * No source, index, Git object, or owner-checkout writes are performed.
 */
import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, lstatSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';

const BASE = 'adcbff3baedf61461ba73b14b7d029f8324c8bfc';
const TASK_DIR = 'audit/mobile-calculator-action-clearance-r1/';
const allowedProduction = new Set([
  'src/styles.css', 'src/ExamCalculatorPanel.tsx', 'src/App.tsx',
  'src/calculatorLayout.ts', 'src/useCalculatorLayout.ts',
]);
const allowedRunner = /^scripts\/tests\/mobile-calculator-clearance(?:-helpers)?\.mjs$/;
const allowedDesktopHelper = "scripts/tests/mobile-calculator-desktop.mjs";
const authorized = (path) => allowedProduction.has(path) || allowedRunner.test(path) || path === allowedDesktopHelper || path.startsWith(TASK_DIR);
const args = Object.fromEntries(Array.from({ length: (process.argv.length - 2) / 2 }, (_, i) => [process.argv[2 + i * 2], process.argv[3 + i * 2]]));
if (!args['--output'] || process.argv.length % 2 !== 0 || Object.keys(args).some(k => !['--output', '--candidate', '--typescript-module'].includes(k))) {
  console.error('Usage: node verify-scope.mjs --output <task-audit-path.json> [--candidate <commit>] [--typescript-module <module>]');
  process.exit(2);
}
const git = (argv, options = {}) => {
  const result = spawnSync('git', argv, { maxBuffer: 128 * 1024 * 1024, ...options });
  if (result.status !== 0) throw new Error(`git ${argv.join(' ')} failed: ${result.stderr?.toString()}`);
  return result.stdout;
};
const repo = git(['rev-parse', '--show-toplevel']).toString().trim();
process.chdir(repo);
const outputPath = resolve(args['--output']);
if (!outputPath.startsWith(resolve(TASK_DIR) + '/')) throw new Error('Proof output must remain in the task audit directory.');
const candidate = git(['rev-parse', '--verify', `${args['--candidate'] ?? 'HEAD'}^{commit}`]).toString().trim();
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const tree = (rev) => new Map(git(['ls-tree', '-r', '-z', '--full-tree', rev]).toString().split('\0').filter(Boolean).map(line => {
  const [metadata, path] = line.split('\t');
  const [mode, type, object] = metadata.split(' ');
  return [path, { mode, type, object }];
}));
const baseTree = tree(BASE);
const candidateTree = tree(candidate);
const head = git(['rev-parse', 'HEAD']).toString().trim();
const worktree = git(['status', '--porcelain=v1', '-z', '--untracked-files=all']).toString().split('\0').filter(Boolean);
const protectedPaths = [...baseTree.keys()].filter(path => !authorized(path)).sort();
const existingProtected = protectedPaths.filter(path => { try { return lstatSync(path).isFile(); } catch { return false; } });
if (existingProtected.some(path => /[\r\n]/.test(path))) throw new Error('Unexpected newline in protected path.');
const workingObjects = new Map(git(['hash-object', '--no-filters', '--stdin-paths'], { input: existingProtected.map(path => JSON.stringify(path)).join('\n') + '\n' }).toString().trim().split('\n').map((object, i) => [existingProtected[i], object]));

// Stream raw baseline Git blobs through SHA-256. Byte proof does not depend on
// line-ending filters, mtime, the index, or Git's cached working-tree status.
async function blobSha256(objects) {
  const unique = [...new Set(objects)];
  const hashes = new Map();
  const child = spawn('git', ['cat-file', '--batch'], { stdio: ['pipe', 'pipe', 'pipe'] });
  let stderr = '';
  child.stderr.on('data', bytes => { stderr += bytes.toString(); });
  const finished = new Promise((res, rej) => { child.on('error', rej); child.on('exit', code => code === 0 ? res() : rej(new Error(`git cat-file: ${stderr}`))); });
  child.stdin.end(unique.join('\n') + '\n');
  let header = '', remaining = 0, current, hash, needsDelimiter = false;
  for await (const chunk of child.stdout) {
    let offset = 0;
    while (offset < chunk.length) {
      if (remaining > 0) {
        const end = Math.min(chunk.length, offset + remaining);
        hash.update(chunk.subarray(offset, end));
        remaining -= end - offset;
        offset = end;
        if (remaining === 0) { hashes.set(current, hash.digest('hex')); needsDelimiter = true; }
      } else if (needsDelimiter) {
        if (chunk[offset++] !== 10) throw new Error('Invalid Git blob delimiter.');
        needsDelimiter = false;
      } else {
        const newline = chunk.indexOf(10, offset);
        if (newline < 0) { header += chunk.subarray(offset).toString(); break; }
        header += chunk.subarray(offset, newline).toString();
        const match = /^([a-f0-9]+) blob (\d+)$/.exec(header);
        if (!match) throw new Error(`Invalid Git blob header: ${header}`);
        [, current] = match;
        remaining = Number(match[2]);
        hash = createHash('sha256');
        header = '';
        offset = newline + 1;
        if (remaining === 0) { hashes.set(current, hash.digest('hex')); needsDelimiter = true; }
      }
    }
  }
  await finished;
  if (hashes.size !== unique.length || remaining || header || needsDelimiter) throw new Error('Incomplete Git blob hash proof.');
  return hashes;
}
const baseHashes = await blobSha256(protectedPaths.map(path => baseTree.get(path).object));
const rows = protectedPaths.map(path => {
  const base = baseTree.get(path);
  const tested = candidateTree.get(path);
  let workingSha256 = null;
  try { workingSha256 = sha256(readFileSync(path)); } catch { /* captured as failure below */ }
  const baseSha256 = baseHashes.get(base.object);
  const workingObject = workingObjects.get(path) ?? null;
  const candidateObject = tested?.object ?? null;
  const pass = base.type === 'blob' && base.object === candidateObject && base.mode === tested?.mode && base.object === workingObject && baseSha256 === workingSha256;
  return { path, baseObject: base.object, candidateObject, workingObject, baseSha256, workingSha256, mode: base.mode, candidateMode: tested?.mode ?? null, pass };
});
const addedTracked = [...candidateTree.keys()].filter(path => !baseTree.has(path));
const untracked = git(['ls-files', '--others', '--exclude-standard', '-z']).toString().split('\0').filter(Boolean);
const changedTracked = git(['diff', '--name-only', BASE, '--']).toString().trim().split('\n').filter(Boolean);
const unauthorized = [...new Set([...addedTracked, ...untracked, ...changedTracked].filter(path => !authorized(path)))];

const require = createRequire(resolve('package.json'));
const ts = require(args['--typescript-module'] ?? process.env.TYPESCRIPT_MODULE ?? 'typescript');
const parse = (path, text) => ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const printer = ts.createPrinter({ removeComments: true, newLine: ts.NewLineKind.LineFeed });
const printed = (node, source) => printer.printNode(ts.EmitHint.Unspecified, node, source);
const baseSource = (path) => parse(path, git(['show', `${BASE}:${path}`]).toString());
const liveSource = (path) => parse(path, readFileSync(path, 'utf8'));
const locate = (source, name) => source.statements.find(n => ts.isFunctionDeclaration(n) && n.name?.text === name);
const presentationAttr = (attr) => ts.isJsxAttribute(attr) && ['className', 'style', 'ref'].includes(attr.name.getText());
// Ignore only layout attributes and unadorned structural wrappers. All event
// callbacks, keys, control/visibility attributes, expressions and return gates
// remain in the projection; literal and identifier text is retained exactly.
function behavior(node, source) {
  if (!node) return null;
  if (ts.isJsxText(node)) { const s = node.text.replace(/\s+/g, ' ').trim(); return s ? ['text', s] : []; }
  if (ts.isJsxElement(node)) {
    const opening = node.openingElement;
    const attrs = opening.attributes.properties.filter(a => !presentationAttr(a));
    const children = node.children.flatMap(n => {
      const result = behavior(n, source);
      return result?.[0] === 'layout-children' ? result.slice(1) : [result];
    }).filter(n => n && n.length);
    if (['div', 'section', 'article', 'span', 'aside', 'header', 'footer'].includes(opening.tagName.getText(source)) && attrs.length === 0) return ['layout-children', ...children];
    return ['jsx', opening.tagName.getText(source), attrs.map(a => behavior(a, source)), ...children];
  }
  if (ts.isJsxSelfClosingElement(node)) return ['jsx-self', node.tagName.getText(source), node.attributes.properties.filter(a => !presentationAttr(a)).map(a => behavior(a, source))];
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isRegularExpressionLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) return [ts.SyntaxKind[node.kind], node.getText(source)];
  const children = [];
  ts.forEachChild(node, child => { children.push(behavior(child, source)); });
  return children.length ? [ts.SyntaxKind[node.kind], ...children] : [ts.SyntaxKind[node.kind], node.getText(source)];
}
const projection = (node, source) => JSON.stringify(behavior(node, source));
const comparison = (name, before, after) => ({ name, baseSha256: sha256(before), candidateSha256: sha256(after), pass: before === after });
const declarationName = (statement, source) => {
  if (ts.isFunctionDeclaration(statement)) return `function:${statement.name?.text}`;
  if (ts.isVariableStatement(statement)) return `variables:${statement.declarationList.declarations.map(d => d.name.getText(source)).join(',')}`;
  if (ts.isImportDeclaration(statement)) return `import:${statement.moduleSpecifier.getText(source)}:${statement.importClause?.getText(source) ?? ''}`;
  if (statement.name) return `${ts.SyntaxKind[statement.kind]}:${statement.name.getText(source)}`;
  return `${ts.SyntaxKind[statement.kind]}:${sha256(printed(statement, source))}`;
};
const appBase = baseSource('src/App.tsx');
const appLive = liveSource('src/App.tsx');
const appFunctions = ['SessionView', 'QuestionCard', 'CaseStudyControl'];
const appMap = new Map(appLive.statements.map(s => [declarationName(s, appLive), s]));
const appProof = appBase.statements.map(statement => {
  const name = declarationName(statement, appBase);
  const live = appMap.get(name);
  const project = ts.isFunctionDeclaration(statement) && appFunctions.includes(statement.name?.text);
  return comparison(name, project ? projection(statement, appBase) : printed(statement, appBase), live ? (project ? projection(live, appLive) : printed(live, appLive)) : '<MISSING>');
});
const appAdditions = appLive.statements.filter(s => !appBase.statements.some(b => declarationName(b, appBase) === declarationName(s, appLive))).map(s => ({ name: declarationName(s, appLive), source: printed(s, appLive) }));
const panelBase = baseSource('src/ExamCalculatorPanel.tsx');
const panelLive = liveSource('src/ExamCalculatorPanel.tsx');
const calculatorBase = locate(panelBase, 'ExamCalculator');
const calculatorLive = locate(panelLive, 'ExamCalculator');
const statementKey = (statement, source) => declarationName(statement, source);
const liveStatements = new Map(calculatorLive.body.statements.map(s => [statementKey(s, panelLive), s]));
const panelLogic = calculatorBase.body.statements.filter(s => !ts.isReturnStatement(s)).map(statement => {
  const name = statementKey(statement, panelBase);
  const live = liveStatements.get(name);
  // Existing panelStyle is positioning only; record its complete source diff.
  const positionOnly = name === 'variables:panelStyle';
  return { ...comparison(name, printed(statement, panelBase), live ? printed(live, panelLive) : '<MISSING>'), positionOnly };
});
const panelReturn = comparison('ExamCalculator.return.behavior', projection(calculatorBase.body.statements.find(ts.isReturnStatement), panelBase), projection(calculatorLive.body.statements.find(ts.isReturnStatement), panelLive));
const addedPanelStatements = calculatorLive.body.statements.filter(s => !ts.isReturnStatement(s) && !calculatorBase.body.statements.some(b => statementKey(b, panelBase) === statementKey(s, panelLive))).map(s => ({ name: statementKey(s, panelLive), source: printed(s, panelLive) }));
const panelModule = panelBase.statements.filter(s => s !== calculatorBase && !ts.isImportDeclaration(s)).map(statement => {
  const name = declarationName(statement, panelBase);
  const live = panelLive.statements.find(s => declarationName(s, panelLive) === name);
  return comparison(name, printed(statement, panelBase), live ? printed(live, panelLive) : '<MISSING>');
});
const panelImports = panelBase.statements.filter(ts.isImportDeclaration).map(statement => {
  const name = declarationName(statement, panelBase);
  const live = panelLive.statements.find(s => declarationName(s, panelLive) === name);
  return comparison(name, printed(statement, panelBase), live ? printed(live, panelLive) : '<MISSING>');
});
const panelImportAdditions = panelLive.statements.filter(ts.isImportDeclaration).filter(s => !panelBase.statements.some(b => declarationName(b, panelBase) === declarationName(s, panelLive))).map(s => printed(s, panelLive));
const panelImportsValid = panelImports.every(x => x.pass) && panelImportAdditions.every(s => s === 'import { useCalculatorLayout } from "./useCalculatorLayout";');
const acceptedPanelAddition = (entry) => /^const rootRef = useRef<HTMLDivElement>\(null\);$/.test(entry.source.trim()) || /^useCalculatorLayout\(rootRef, open, isMobile\);$/.test(entry.source.trim()) || /^useCalculatorLayout\(\{\s*rootRef,\s*panelRef,\s*launcherRef,\s*open,\s*isMobile\s*,?\s*\}\);$/.test(entry.source.trim());
const panelAdditionsValid = addedPanelStatements.every(acceptedPanelAddition);
const expectedKey = 'key={`${session.id}:${question.id}`}';
const mountKeyProof = { expected: expectedKey, baseOccurrences: appBase.text.split(expectedKey).length - 1, candidateOccurrences: appLive.text.split(expectedKey).length - 1 };
mountKeyProof.pass = mountKeyProof.baseOccurrences === 1 && mountKeyProof.candidateOccurrences === 1;

const mutateFunction = (source, name, from, to) => {
  const fn = locate(source, name);
  const before = source.text.slice(fn.pos, fn.end);
  if (!before.includes(from)) throw new Error(`Missing self-test mutation needle for ${name}`);
  return source.text.slice(0, fn.pos) + before.replace(from, to) + source.text.slice(fn.end);
};
const mutations = [
  ['App Submit handler change rejected', 'SessionView', mutateFunction(appBase, 'SessionView', 'onSubmit={onSubmit}', 'onSubmit={onSkip}')],
  ['App mount lifetime change rejected', 'SessionView', appBase.text.replace('key={`${session.id}:${question.id}`}', 'key={`${session.id}:${question.id}:part`}')],
  ['App readiness change rejected', 'CaseStudyControl', mutateFunction(appBase, 'CaseStudyControl', 'disabled={!readyToSubmit}', 'disabled={false}')],
].map(([name, func, text]) => {
  const modified = parse('src/App.tsx', text);
  return { name, pass: projection(locate(appBase, func), appBase) !== projection(locate(modified, func), modified) };
});
const layoutMutation = parse('src/App.tsx', appBase.text.replace('<section className="session-shell">', '<section className="session-shell calculator-test">'));
mutations.push({ name: 'Presentation-only class change accepted', pass: projection(locate(appBase, 'SessionView'), appBase) === projection(locate(layoutMutation, 'SessionView'), layoutMutation) });
for (const [name, from, to] of [
  ['Panel focus change rejected', 'panelRef.current?.focus()', 'launcherRef.current?.focus()'],
  ['Panel minimize change rejected', 'setOpen(false)', 'setOpen(true)'],
  ['Panel key action change rejected', 'dispatch(key.action)', 'dispatch({ type: "clear" })'],
]) {
  const modified = parse('src/ExamCalculatorPanel.tsx', panelBase.text.replace(from, to));
  mutations.push({ name, pass: projection(calculatorBase, panelBase) !== projection(locate(modified, 'ExamCalculator'), modified) });
}
const productionSnapshot = [...allowedProduction].filter(path => { try { return lstatSync(path).isFile(); } catch { return false; } }).map(path => {
  const workingObject = git(['hash-object', '--no-filters', '--', path]).toString().trim();
  const candidateObject = candidateTree.get(path)?.object ?? null;
  return { path, baseObject: baseTree.get(path)?.object ?? null, candidateObject, workingObject, workingSha256: sha256(readFileSync(path)), committedMatch: workingObject === candidateObject };
});
const productionBoundToCandidate = !args['--candidate'] || productionSnapshot.every(row => row.committedMatch);
const allAstPass = appProof.every(x => x.pass) && appAdditions.length === 0 && panelLogic.every(x => x.pass || x.positionOnly) && panelReturn.pass && panelModule.every(x => x.pass) && panelAdditionsValid && panelImportsValid && mountKeyProof.pass && mutations.every(x => x.pass);
const groups = {
  arithmetic: rows.filter(r => r.path === 'src/examCalculator.ts'),
  banks: rows.filter(r => r.path.startsWith('banks/')),
  visuals: rows.filter(r => r.path.startsWith('src/visuals/')),
  dataSessionEngines: rows.filter(r => r.path.startsWith('src/') && !r.path.startsWith('src/visuals/')),
  packagesCensus: rows.filter(r => /(^package(?:-lock)?\.json$|(^|\/)census\.json$|^BANK-CENSUS\.md$)/.test(r.path)),
  priorEvidence: rows.filter(r => r.path.startsWith('audit/') || r.path === 'PROJECT-HISTORY.md'),
};
const proof = {
  kind: 'producer-protected-scope-evidence', generatedAt: new Date().toISOString(), executionBase: BASE, candidate, head, worktree: repo,
  method: 'Every protected baseline Git blob is streamed from git cat-file to SHA-256; working bytes are independently SHA-256 hashed and git hash-object --no-filters hashed. Candidate-tree Git blob/mode must also match the baseline. No owner-side unrelated files are read.',
  authorizedPaths: [...allowedProduction, allowedRunner.source, allowedDesktopHelper, `${TASK_DIR}**`],
  productionSnapshot, productionBoundToCandidate, candidateBindingRequired: Boolean(args['--candidate']),
  protectedCount: rows.length, groupSummary: Object.fromEntries(Object.entries(groups).map(([name, items]) => [name, { count: items.length, pass: items.every(x => x.pass) }])),
  unexpectedPaths: unauthorized, statusSnapshot: worktree, additions: { tracked: addedTracked, untracked },
  ast: { method: 'TypeScript AST projection drops className/style/ref and unadorned structural JSX wrappers only. Original nonpresentation declarations, literal identities, expressions, callbacks, key, visibility/readiness gates and JSX attributes remain compared. New panel statements are admitted only by the exact layout-ref/hook forms listed in this script.', app: appProof, appAdditions, mountKeyProof, panelLogic, panelModule, panelReturn, panelImports, panelImportAdditions, panelImportsValid, addedPanelStatements, panelAdditionsValid, selfChecks: mutations, pass: allAstPass },
  positioningOnlyDiff: git(['diff', BASE, '--', 'src/ExamCalculatorPanel.tsx', 'src/App.tsx']).toString(),
  paths: rows,
};
proof.pass = rows.every(r => r.pass) && unauthorized.length === 0 && allAstPass && productionBoundToCandidate;
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(proof, null, 2) + '\n');
console.log(JSON.stringify({ pass: proof.pass, executionBase: BASE, candidate, protectedCount: rows.length, productionBoundToCandidate, unexpectedPaths: unauthorized, astPass: allAstPass, failedPaths: rows.filter(r => !r.pass).map(r => r.path), failedAst: [...appProof, ...panelLogic.filter(x => !x.positionOnly), panelReturn, ...panelModule].filter(x => !x.pass).map(x => x.name), appAdditions, addedPanelStatements, panelAdditionsValid, selfChecks: mutations, output: outputPath }, null, 2));
process.exitCode = proof.pass ? 0 : 1;
