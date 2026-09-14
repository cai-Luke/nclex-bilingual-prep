import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { REGION_GEOMETRY } from '../../src/visuals/kinds/burn_map/regions.ts';

const beforeRef = 'e26e6a39a50f6593c4b27950663b6db520d68cd7';
const proposal = process.env.BURN_MAP_APPROVED || resolve('../Project Shrimp/scratch/burn-map-astra-arm-refinement-2026-09-12');
const out = 'audit/burn-map-integration-2026-09-13';
const expectedHashes = {
  'index.ts': '5be16ca91ce731ba4eb183c723abc86b0a0c4e02d19e48e209d1df1512c496f5',
  'regions.ts': '0d9783a3fc078670acef4f53173128f6b8402d6fb539c5cf7ddfe60e95c74d48',
};
const sourceHashes = {};
const before = {};
const after = {};
for (const [name, expectedHash] of Object.entries(expectedHashes)) {
  const path = `src/visuals/kinds/burn_map/${name}`;
  const actual = readFileSync(path);
  const approved = readFileSync(`${proposal}/candidate/${path}`);
  assert.deepEqual(actual, approved);
  const hash = createHash('sha256').update(actual).digest('hex');
  assert.equal(hash, expectedHash);
  sourceHashes[path] = hash;
  before[name] = execFileSync('git',['show',`${beforeRef}:${path}`],{encoding:'utf8'});
  after[name] = actual.toString('utf8');
}
const core = s => s.slice(s.indexOf('const POPULATIONS'),s.indexOf('const regionAttributes'));
assert(core(before['index.ts']).length > 1000);
assert.equal(core(before['index.ts']),core(after['index.ts']));
const contract = s => s.slice(0,s.indexOf('export const BURN_REGION_KEYS'));
assert.equal(contract(before['regions.ts']),contract(after['regions.ts']));
const suffix = s => s.slice(s.indexOf('export const burnMapModule'));
assert(suffix(before['index.ts']).length > 100);
assert.equal(suffix(before['index.ts']),suffix(after['index.ts']));

// Prior geometry evidence is reusable only after matching every emitted path.
const priorGeometry = JSON.parse(readFileSync(`${proposal}/evidence/geometry.json`,'utf8'));
assert.deepEqual(REGION_GEOMETRY,priorGeometry);
copyFileSync(`${proposal}/evidence/geometry-receipt.json`,`${out}/geometry-receipt.json`);
writeFileSync(`${out}/geometry.json`,JSON.stringify(REGION_GEOMETRY,null,2)+'\n');
const parity = JSON.parse(readFileSync('audit/visual-parity-rebaseline-2026-09-14T01-07-10-202Z/receipt.json','utf8'));
assert.deepEqual(parity.totals,{added:0,changed:10,removed:0,unchangedTotal:189});
assert.equal(parity.arithmeticEvidence.length,10);
for (const row of parity.arithmeticEvidence) {
  assert.equal(row.kind,'burn_map');
  assert.deepEqual(row.declaredKeyed.before,row.declaredKeyed.after);
  assert.deepEqual(row.selfCheckErrors,{before:[],after:[]});
}
writeFileSync(`${out}/source-results.json`,JSON.stringify({
  beforeRef, approvedProposal:'scratch/burn-map-astra-arm-refinement-2026-09-12',
  sourceHashes, byteIdenticalToApproved:true, unchangedSemanticCore:true,
  unchangedRegionContractAndTables:true, unchangedModuleRegistration:true,
  reusedGeometryEvidence:{allEmittedPathsIdentical:true,regions:13,receipt:'geometry-receipt.json'},
  numericParity:{records:10,allDeclaredValuesIdentical:true,allSelfChecksPassedBeforeAndAfter:true},
},null,2)+'\n');
console.log('PASS approved source identity, unchanged semantics, geometry evidence reuse, and numeric parity');
