import assert from "node:assert/strict";
import { build } from "esbuild";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
const repo = resolve(import.meta.dirname, "../..");
const root = await mkdtemp(join(tmpdir(), "shrimp-baseline-ui-"));
try {
  // Bundle the actual private components in place, with an appended test entry.
  // The Vite bank glob is inert in this isolated fixture: no canonical data is used.
  const source = await readFile(join(repo, "src/App.tsx"), "utf8");
  assert(source.includes("formatCaseVisibilityBoundary(currentCasePart.answerableAfterStageId)"));
  const testEntry = `
import { renderToStaticMarkup } from 'react-dom/server';
import assert from 'node:assert/strict';
import { typedBaselineCase } from '../scripts/tests/typed-baseline-fixture';
import { defaultSettings } from './storage';
const fixture = typedBaselineCase();
const props = { question: fixture, answer: getInitialAnswer(fixture), submitted: false, languageMode: 'en', voiceEnabled: false, onTerm: () => {}, onAnswer: () => {}, controlledActivePartId: fixture.caseStudy.questions[0].id };
for (const layoutMode of ['split', 'stacked']) {
  const html = renderToStaticMarkup(<CaseStudyControl {...props} layoutMode={layoutMode} />);
  for (const token of ['BASELINE TITLE', 'BASELINE SUMMARY', 'GLOBAL CONTEXT']) assert(html.includes(token), token);
  assert(!html.includes('STAGED CONTENT'), layoutMode);
  assert(!html.includes('>Updates<'), layoutMode);
  const all = renderToStaticMarkup(<CaseStudyControl {...props} layoutMode={layoutMode} showAllStages={true} />);
  for (const id of ['s1','s2','s3']) assert(all.includes('STAGED CONTENT '+id));
}
const overview = renderToStaticMarkup(<CaseStudyControl {...props} controlledActivePartId={undefined} layoutMode='stacked' />);
for (const id of ['s1','s2','s3']) assert(overview.includes('STAGED CONTENT '+id));
const diagnostics = renderToStaticMarkup(<span>{formatCaseVisibilityBoundary(fixture.caseStudy.questions[0].answerableAfterStageId)}</span>);
assert(diagnostics.includes('baseline'));
const preview = renderToStaticMarkup(<PreviewLab records={[{ question: fixture, sourceKind: 'uploaded', sourceLabel: 'synthetic' }]} settings={defaultSettings} onBack={() => {}} />);
assert(preview.includes('answerableAfterStageId:'));
assert(preview.includes('baseline'));
assert(preview.includes('visible stages: 0'));
assert(!preview.includes('STAGED CONTENT'));
console.log('Actual CaseStudyControl React render passed: split/controlled stacked baseline, show-all override, unscoped overview, safe diagnostics');
`;
  const outfile = join(root, "ui-fixture.cjs");
  await build({ stdin: { contents: source + testEntry, loader: "tsx", resolveDir: join(repo, "src"), sourcefile: "App.tsx" },
    outfile, bundle: true, platform: "node", format: "cjs", packages: "external", jsx: "automatic", logLevel: "silent",
    define: { "import.meta.glob": "__typedBaselineGlob", "import.meta.env": "{}" }, banner: { js: "const __typedBaselineGlob = () => ({});" },
  });
  const result = spawnSync(process.execPath, [outfile], { encoding: "utf8", env: { ...process.env, NODE_PATH: join(repo, "node_modules") } });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  console.log(result.stdout.trim());
} finally { await rm(root, { recursive: true, force: true }); }
