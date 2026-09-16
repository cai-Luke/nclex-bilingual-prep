import fs from 'node:fs';
import crypto from 'node:crypto';
import ts from '/Users/holemini/Desktop/Project Shrimp Learner Shell R3 Review/node_modules/typescript/lib/typescript.js';

const sha = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

function parse(file) {
  const src = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const top = new Map();       // top-level function declarations
  const appInner = new Map();  // const/function declared directly inside App()

  for (const st of sf.statements) {
    if (ts.isFunctionDeclaration(st) && st.name) {
      top.set(st.name.text, src.slice(st.getStart(sf), st.getEnd()));
    }
  }
  // Find App() and walk its immediate body statements
  const app = sf.statements.find(s => ts.isFunctionDeclaration(s) && s.name && s.name.text === 'App');
  if (app && app.body) {
    for (const st of app.body.statements) {
      if (ts.isVariableStatement(st)) {
        for (const d of st.declarationList.declarations) {
          const nm = d.name.getText(sf);
          appInner.set(nm, src.slice(d.getStart(sf), d.getEnd()));
        }
      } else if (ts.isFunctionDeclaration(st) && st.name) {
        appInner.set(st.name.text, src.slice(st.getStart(sf), st.getEnd()));
      } else if (ts.isExpressionStatement(st) && ts.isCallExpression(st.expression)) {
        const callee = st.expression.expression.getText(sf);
        if (callee === 'useEffect' || callee === 'useLayoutEffect') {
          const key = 'effect@' + sha(src.slice(st.getStart(sf), st.getEnd()));
          appInner.set(key, src.slice(st.getStart(sf), st.getEnd()));
        }
      }
    }
    // also record the pre-return region of App
    const ret = app.body.statements.find(s => ts.isReturnStatement(s));
    if (ret) {
      appInner.set('__PRE_RETURN_REGION__', src.slice(app.body.getStart(sf), ret.getStart(sf)));
      appInner.set('__RETURN_STATEMENT__', src.slice(ret.getStart(sf), ret.getEnd()));
    }
  }
  return { top, appInner };
}

function compare(label, a, b) {
  const names = [...new Set([...a.keys(), ...b.keys()])];
  const rows = names.map(nm => {
    const x = a.get(nm), y = b.get(nm);
    let status;
    if (x === undefined) status = 'ADDED';
    else if (y === undefined) status = 'REMOVED';
    else if (x === y) status = 'IDENTICAL';
    else status = 'CHANGED';
    return { name: nm, status, baseLen: x?.length ?? 0, implLen: y?.length ?? 0,
             baseSha: x === undefined ? '-' : sha(x), implSha: y === undefined ? '-' : sha(y) };
  });
  const counts = rows.reduce((m, r) => (m[r.status] = (m[r.status] || 0) + 1, m), {});
  console.log(`\n##### ${label}`);
  console.log('COUNTS ' + JSON.stringify(counts) + `   (base=${a.size} impl=${b.size})`);
  for (const r of rows.filter(r => r.status !== 'IDENTICAL'))
    console.log(`  ${r.status.padEnd(10)} ${r.name.slice(0,60).padEnd(62)} base=${r.baseSha}(${r.baseLen}) impl=${r.implSha}(${r.implLen})`);
  console.log('  IDENTICAL: ' + rows.filter(r => r.status === 'IDENTICAL').map(r => r.name).join(', '));
  return rows;
}

const B = parse(process.argv[2]);
const I = parse(process.argv[3]);
const t = compare('TOP-LEVEL FUNCTION DECLARATIONS', B.top, I.top);
const inner = compare('INSIDE App(): const decls / inner fns / effects / regions', B.appInner, I.appInner);
fs.writeFileSync(process.env.OUT, JSON.stringify({ top: t, appInner: inner }, null, 2));
