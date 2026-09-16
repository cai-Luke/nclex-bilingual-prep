// Bounded diagnostic only. Browser-only style probes are restored; no source mutation.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE);
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { questionFingerprint } from '../../src/completedMemory.ts';
const profile = mkdtempSync(join(tmpdir(), 'cloze-ancestor-'));
const ctx = await chromium.launchPersistentContext(profile, { channel: 'chrome', headless: true, viewport: { width: 320, height: 740 }, deviceScaleFactor: 1, ignoreDefaultArgs: ['--disable-web-security'] });
const page = ctx.pages()[0];
const fixtures = [
 JSON.parse(readFileSync('banks/gpt-canonical.json')).questions.find(q => q.id === 'gpt_format15_vasa_previa_management_dropdown'),
 JSON.parse(readFileSync('banks/claude-canonical.json')).questions.find(q => q.id === 'claude_a_mc_ace_inhibitor_11'),
];
const report = { browser: ctx.browser().version(), records: [] };
try {
 for (const url of ['http://127.0.0.1:4182', 'http://127.0.0.1:4181']) for (const q of fixtures) {
  await page.goto(url); await page.locator('.study-workspace').waitFor();
  await page.evaluate(async ({ qid, fingerprint }) => {
   localStorage.setItem('completed-memory-notice', 'dismissed');
   localStorage.setItem('nclex-settings', JSON.stringify({ themeMode: 'light', textSizeMode: 'default', languageMode: 'on-tap', voiceEnabled: false, revisitMissed: true }));
   const db = await new Promise((yes,no) => { const r=indexedDB.open('nclex-bilingual-prep');r.onsuccess=()=>yes(r.result);r.onerror=()=>no(r.error); });
   const tx=db.transaction('activeSession','readwrite');tx.objectStore('activeSession').clear();
   tx.objectStore('activeSession').put({id:'ancestor-diagnostic',mode:'study',questionIds:[qid],poolIds:[qid],index:0,answers:{},results:{},scores:{},attempts:{},fingerprints:{[qid]:fingerprint},skippedQuestionIds:[],phase:'questions',languageMode:'on-tap',title:'Ancestor diagnostic',startedAt:'2026-09-16T12:00:00Z',updatedAt:'2026-09-16T12:00:00Z',launchIntent:'ordinary',returnView:'home',requestedCount:1});
   await new Promise((yes,no)=>{tx.oncomplete=yes;tx.onerror=()=>no(tx.error);});db.close();
  }, { qid:q.id, fingerprint:questionFingerprint(q) });
  await page.reload();await page.getByRole('button',{name:'Continue set / 继续练习',exact:true}).click();
  await page.locator('.question-card').waitFor();
  if (!(await page.locator('.question-card').innerText()).includes(q.stem.en)) throw new Error('identity mismatch');
  const measure = () => page.evaluate(() => {
   const selectors = ['html','main','.session-shell','.session-topbar','.question-card','.cloze-panel','.session-actions','.exam-calculator-root'];
   return selectors.map(selector=>{
    const e=document.querySelector(selector);if(!e)return {selector, absent:true};const r=e.getBoundingClientRect();const s=getComputedStyle(e);
    return {selector,left:r.left,right:r.right,width:r.width,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,marginLeft:s.marginLeft,marginRight:s.marginRight,position:s.position};
   });
  });
  const before = await measure();
  await page.locator('.session-topbar').evaluate(el => {el.style.marginInline='0';});
  const topbarMarginZero = await measure();
  await page.locator('.session-actions').evaluate(el => {el.style.marginInline='0';});
  const bothBarsMarginZero = await measure();
  await page.locator('.session-actions').evaluate(el=>el.style.removeProperty('margin-inline'));
  await page.locator('.session-topbar').evaluate(el=>el.style.removeProperty('margin-inline'));
  const restored = await measure();
  report.records.push({url,fixture:q.id,before,topbarMarginZero,bothBarsMarginZero,restored});
 }
} finally {
 writeFileSync('audit/mobile-dropdown-cloze-overflow-r1/ancestor-diagnostic.json',JSON.stringify(report,null,2)+'\n');
 await ctx.close();rmSync(profile,{recursive:true,force:true});
}
