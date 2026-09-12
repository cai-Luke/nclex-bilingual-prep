import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { findStageReferenceFindings } from '../../../scripts/audit/audit-stage-refs';
import { validateBankObject } from '../../../src/schema';
import { resolveCaseVisibilityBoundary } from '../../../src/caseVisibilityBoundary';
import { getVisibleCaseStages } from '../../../src/examLayout';
import assert from 'node:assert/strict';

const root = 'audit/campaign-17-residual-successor-2026-09-12-r1';
const banks = readdirSync('banks').filter(f => f.endsWith('.json')).sort().map(f => {
  const file = `banks/${f}`;
  const bank = JSON.parse(readFileSync(file, 'utf8'));
  const validated = validateBankObject(bank);
  assert.equal(validated.ok, true, `${file}: ${JSON.stringify(validated)}`);
  return { file, bank };
});
const findings = findStageReferenceFindings(banks);
assert.ok(findings.every(f => f.kind === 'revealsAllStages'), 'Unexpected non-leak default finding');
for (const f of findings) {
  const parent = banks.find(b => b.file === f.file)!.bank.questions.find((q:any) => q.id === f.parentId);
  const part = parent.caseStudy.questions.find((q:any) => q.id === f.partId);
  assert.equal(resolveCaseVisibilityBoundary(part, f.validStageIds).kind, 'fail-open');
  assert.deepEqual(getVisibleCaseStages(parent, part), parent.caseStudy.stages);
}
mkdirSync(`${root}/phase-a`, { recursive: true });
writeFileSync(`${root}/phase-a/live-findings.json`, JSON.stringify(findings, null, 2) + '\n');
console.log(JSON.stringify({banks:banks.length, revealsAllStages:findings.length, parents:new Set(findings.map(f=>f.parentId)).size, liveResolverAndRendererConfirmed:true}));
