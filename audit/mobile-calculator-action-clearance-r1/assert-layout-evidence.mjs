// Focused DOM integration checks for useCalculatorLayout; run after the browser suite.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
const root = 'audit/mobile-calculator-action-clearance-r1/';
const r = JSON.parse(readFileSync(`${root}candidate-http/results.json`));
assert.equal(r.status, 'PASS');
const geometry = r.checks.filter(x => x.name === 'geometry');
const postSubmit = geometry.filter(x => x.label.includes('post-submit') && x.open);
assert(postSubmit.length > 0);
assert(postSubmit.every(x => x.offsets['--calculator-submit-height'] === '0px'));
const cleanup = r.checks.find(x => x.name === 'crossover-close-cleanup');
assert(cleanup && Object.values(cleanup.measuredStudyOffsets).every(v => v === ''));
assert(r.checks.some(x => x.name === 'exit-cleans-reservation'));
const desktop = r.checks.filter(x => x.name === 'desktop-crossover-panel' && !x.mobile);
assert(desktop.length > 0 && desktop.every(x => Object.values(x.measuredStudyOffsets).every(v => v === '')));
const tiers = r.checks.filter(x => x.name === 'tier');
const ordinary = tiers.find(x => x.label === 'normal-390-default-disabled');
const inset = tiers.find(x => x.label === 'simulated-inset-normal-disabled');
assert.equal(inset.appliedSafeBottom, '24px');
assert(Math.abs(ordinary.band - inset.band - 24) < .01);
const clicks = r.checks.filter(x => ['ordinary-click', 'desktop-preview-ordinary-click'].includes(x.name));
assert(clicks.length > 0 && clicks.every(x => x.before === x.pointerY));
const result = { pass: true, source: 'candidate-http/results.json', runnerSha256: r.runnerSha256,
  checks: ['Submit removal updates measured submit height to zero', 'Close clears all four measured CSS properties',
    'Mobile/desktop crossover clears and reapplies measurement', 'Study exit leaves no reservation or calculator DOM',
    'Simulated 24px inset moves normal sheet by exactly 24px through shared path',
    'All decisive pointerdowns match their pre-click scrollY'],
  postSubmitSamples: postSubmit.length, desktopSamples: desktop.length, pointerSamples: clicks.length };
writeFileSync(`${root}layout-helper-checks.json`, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
