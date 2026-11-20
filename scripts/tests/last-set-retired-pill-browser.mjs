// Browser regression for G-1. Uses only fresh disposable profiles and the published
// G3 fixture, plus one unchanged current question to prove the neighboring pill case.
// Run after npm run build with PLAYWRIGHT_MODULE set to Playwright's index.mjs.
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { extname, resolve, sep, join } from 'node:path';
import { tmpdir } from 'node:os';
import { isDeepStrictEqual } from 'node:util';
import { build } from 'esbuild';

const repo = process.cwd();
const evidence = process.env.G1_EVIDENCE_ROOT ?? '/Users/holemini/Desktop/Project Shrimp/scratch/dogfood-r2-2026-11-20/G-1';
const oldDist = process.env.G1_BASE_DIST ?? '/Users/holemini/Desktop/Project Shrimp/scratch/publication-int01-int03-2026-11-20/smoke/dist-H';
const newDist = process.env.G1_CURRENT_DIST ?? join(repo, 'dist');
const playwrightModule = process.env.PLAYWRIGHT_MODULE;
if (!playwrightModule) throw new Error('PLAYWRIGHT_MODULE is required');
const { chromium } = await import(playwrightModule);
const fixtureDir = '/Users/holemini/Desktop/Project Shrimp/scratch/publication-int01-int03-2026-11-20';
const fixture = JSON.parse(readFileSync(join(fixtureDir, 'tools/pub01-fixture-spec.json'), 'utf8'));
const unchangedId = 'gemini_sic_ngn_2026_06_21_q1';
const bank = JSON.parse(readFileSync(join(repo, 'banks/gemini-canonical.json'), 'utf8')).questions;
const unchangedQuestion = bank.find(q => q.id === unchangedId);
if (!unchangedQuestion) throw new Error(`missing unchanged fixture question ${unchangedId}`);
mkdirSync(join(evidence, 'screens'), { recursive: true });

const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.webmanifest':'application/manifest+json', '.png':'image/png', '.ico':'image/x-icon', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
const server = createServer((req, res) => {
  try {
    const u = new URL(req.url, 'http://127.0.0.1');
    const lane = u.pathname.startsWith('/before/') ? 'before' : u.pathname.startsWith('/after/') ? 'after' : null;
    if (!lane) { res.writeHead(404).end(); return; }
    let tail = decodeURIComponent(u.pathname.slice(lane.length + 2));
    if (!tail || tail.endsWith('/')) tail += 'index.html';
    const base = resolve(lane === 'before' ? oldDist : newDist);
    const file = resolve(base, tail);
    if (file !== base && !file.startsWith(base + sep)) { res.writeHead(403).end(); return; }
    const body = readFileSync(file);
    res.writeHead(200, { 'content-type': mime[extname(file)] ?? 'application/octet-stream', 'cache-control':'no-store' }).end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise((resolveListen, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolveListen); });
const origin = `http://127.0.0.1:${server.address().port}`;
const bundle = async (entry, name) => (await build({ entryPoints:[entry], bundle:true, write:false, format:'iife', globalName:name, platform:'browser', logLevel:'silent' })).outputFiles[0].text;
const storageCode = await bundle(join(repo, 'src/storage.ts'), 'g1Storage');
const memoryCode = await bundle(join(repo, 'src/completedMemory.ts'), 'g1Memory');
const norm = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const failures = [];
const report = { oldDist, newDist, unchangedId, cases:[], fileErrors:[], status:'RUNNING' };
const check = (name, pass, details={}) => { const row={name,status:pass?'PASS':'FAIL',...details}; report.cases.push(row); if(!pass) failures.push(name); console.log(`${pass?'PASS':'FAIL'} ${name}${pass?'':' '+JSON.stringify(details)}`); };
const watch = page => {
  const errors=[];
  page.on('pageerror', e => errors.push({kind:'pageerror',text:e.message}));
  page.on('console', m => { if(m.type()==='error') errors.push({kind:'console',text:m.text(),url:m.location()?.url??null}); });
  return errors;
};
const btn = (page, name) => page.getByRole('button', {name, exact:true});
const ready = async page => {
  await page.waitForFunction(() => [...document.querySelectorAll('button')].some(b => /^Start practice · \d+ questions$/.test(b.textContent.trim()) && !b.disabled), null, {timeout:30000});
};
const idb = page => page.evaluate(async () => {
  const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('nclex-bilingual-prep');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  const stores={};
  for(const name of db.objectStoreNames) stores[name]=await new Promise((resolve,reject)=>{const tx=db.transaction(name,'readonly');const r=tx.objectStore(name).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  db.close();return {version:db.version,stores};
});
const seed = async (page) => {
  await page.addScriptTag({content:storageCode}); await page.addScriptTag({content:memoryCode});
  const result=await page.evaluate(async ({fixture,q})=>{
    const S=window.g1Storage,C=window.g1Memory;
    const snap=structuredClone(fixture.snapshot0);
    snap.questionIds.push(q.id);snap.poolIds.push(q.id);snap.fingerprints[q.id]=C.questionFingerprint(q);
    const log=[];
    log.push((await S.saveActiveSession(snap)).durability);
    let live=snap;
    for(const attempt of fixture.attempts){const qid=JSON.parse(attempt.submissionId)[1];const r=await S.commitSubmission(live,qid,attempt);log.push(r.durability);live=r.value.session;}
    const answer={optionIds:[]};
    const extra=C.captureAttempt(live,q,answer);
    if(extra.result) throw new Error('extra unchanged-question answer unexpectedly earned full marks');
    extra.submittedAt=fixture.completedAt;
    const r=await S.commitSubmission(live,q.id,extra);log.push(r.durability);live=r.value.session;
    const completed={...C.makeCompletedSet(live,fixture.endReason),completedAt:fixture.completedAt};
    log.push((await S.completeSession(live,completed)).durability);
    return {log,extraResult:extra.result};
  }, {fixture,q:unchangedQuestion});
  if(result.log.some(x=>x!=='durable')) throw new Error(`fixture writes not durable: ${JSON.stringify(result)}`);
  return result;
};
const matchingArticle = async (page, text) => page.locator('article.summary-review-item').filter({hasText:text}).first();
const inspectSet = async (page, errors, capture=false) => {
  await ready(page);
  const pre = await idb(page);
  const homeNeeds = norm(await page.locator('.study-memory-links button').filter({hasText:'Needs review'}).locator('.memory-count').textContent());
  await page.locator('.study-memory-links button').filter({hasText:'Needs review'}).click();
  await page.getByRole('heading',{name:/Needs review/}).waitFor();
  const listRows = await page.locator('.question-list article').count();
  await btn(page,'Study').first().click(); await ready(page);
  const dashboardButton=page.locator('.last-set-entry');
  await dashboardButton.click(); await page.locator('.completed-set').waitFor();
  await btn(page,'All questions').click();
  const retired=await page.locator('article.summary-review-item').filter({hasText:'gemini_p8_04'}).first();
  const keyChanged=await page.locator('article.summary-review-item').filter({hasText:'This question has changed since this set'}).first();
  const unchanged=await page.locator('article.summary-review-item').filter({hasText:unchangedQuestion.stem.en}).first();
  const retiredText=norm(await retired.textContent());
  const retiredPillCount=await retired.locator('.missed-pill').count();
  const expectedRetiredPill=report.activeLabel==='before' ? 1 : 0;
  const retiredPass=retiredText.includes('No longer in the current question bank') && retiredPillCount===expectedRetiredPill && !(await retired.getByRole('button',{name:/Try again|Practice this case|Save question|Remove from Saved/}).count());
  const changedText=norm(await keyChanged.textContent());
  const changedPass=changedText.includes('This question has changed since this set') && !!(await keyChanged.locator('.missed-pill').count()) && !!(await keyChanged.getByRole('button',{name:'Try again',exact:true}).count());
  const unchangedText=norm(await unchanged.textContent());
  const unchangedPass=!!(await unchanged.locator('.missed-pill').count()) && !unchangedText.includes('This question has changed since this set');
  if(capture){
    await retired.screenshot({path:join(evidence,'screens/retired-entry-no-pill.png')});
    await keyChanged.screenshot({path:join(evidence,'screens/key-changed-entry-pill.png')});
    await unchanged.screenshot({path:join(evidence,'screens/current-unchanged-entry-pill.png')});
  }
  await btn(page,'Study').first().click(); await ready(page);
  await btn(page,'Progress').first().click();
  const metrics=norm(await page.locator('.dashboard-metrics').innerText());
  const post=await idb(page);
  const progress=(post.stores.progress??[]).find(x=>x.questionId==='gemini_p8_04');
  const key=keyChanged;
  check(`${report.activeLabel}: retired entry has deleted notice and expected pill/actions`,retiredPass,{expectedRetiredPill,text:retiredText});
  check(`${report.activeLabel}: changed current entry retains notice/pill/Try again`,changedPass,{text:changedText});
  check(`${report.activeLabel}: unchanged current needsReview entry retains pill`,unchangedPass,{text:unchangedText.slice(0,300)});
  return {homeNeeds,listRows,metrics,pre,post,retiredProgress:progress,errors};
};

const contexts=[];
try {
  for (const lane of ['before','after']) {
    report.activeLabel=lane;
    const profile=mkdtempSync(join(tmpdir(),`g1-${lane}-`));
    const context=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1280,height:900}});contexts.push(context);
    const page=await context.newPage();const errors=watch(page);
    await page.goto(`${origin}/${lane}/`);await ready(page);
    const seeded=await seed(page);
    await page.reload();
    const view=await inspectSet(page,errors,lane==='after');
    check(`${lane}: seven fixture writes durable`,seeded.log.every(x=>x==='durable'),{seeded});
    check(`${lane}: needs-review list and home count agree`,Number(view.homeNeeds)===view.listRows,{homeNeeds:view.homeNeeds,listRows:view.listRows});
    check(`${lane}: retired progress stays needsReview in IndexedDB`,view.retiredProgress?.needsReview===true,{retiredProgress:view.retiredProgress});
    check(`${lane}: HTTP browser has no console or page errors`,errors.length===0,{errors});
    report[lane]={homeNeeds:view.homeNeeds,listRows:view.listRows,metrics:view.metrics,db:view.post,retiredProgress:view.retiredProgress};
    await context.close();
  }
  const before=report.before, after=report.after;
  check('before/after: Needs review count unchanged',before.homeNeeds===after.homeNeeds,{before:before.homeNeeds,after:after.homeNeeds});
  check('before/after: Needs review rows unchanged',before.listRows===after.listRows,{before:before.listRows,after:after.listRows});
  check('before/after: dashboard counts unchanged',before.metrics===after.metrics,{before:before.metrics,after:after.metrics});
  check('before/after: full IndexedDB state unchanged',isDeepStrictEqual(before.db,after.db),{stores:Object.keys(before.db.stores)});
  check('before/after: retired needsReview value unchanged',before.retiredProgress?.needsReview===after.retiredProgress?.needsReview,{before:before.retiredProgress,after:after.retiredProgress});

  // file:// smoke with the same disposable fixture; only the known manifest pair is admitted.
  report.activeLabel='file';
  const profile=mkdtempSync(join(tmpdir(),'g1-file-'));
  const context=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1280,height:900},args:['--allow-file-access-from-files']});contexts.push(context);
  const page=await context.newPage();const errors=watch(page);
  await page.goto(`file://${join(newDist,'index.html')}`);await ready(page);const seeded=await seed(page);await page.reload();await ready(page);
  const fileDb=await idb(page);
  report.fileErrors=errors;report.fileFixture=seeded;report.fileProgress=(fileDb.stores.progress??[]).find(x=>x.questionId==='gemini_p8_04');
  const manifestUrl=`file://${join(newDist,'manifest.webmanifest')}`;
  const allowed=errors.length===0 || (errors.length===2 && errors.every(e=>e.kind==='console' && ((e.text.startsWith(`Access to manifest at '${manifestUrl}'`) && e.text.includes("from origin 'null'") && e.text.includes('blocked by CORS policy')) || (e.text==='Failed to load resource: net::ERR_FAILED' && e.url===manifestUrl))) && errors.filter(e=>e.text.startsWith('Access to manifest at')).length===1 && errors.filter(e=>e.text==='Failed to load resource: net::ERR_FAILED').length===1);
  check('file:// app loads seeded fixture with only admitted manifest error pair',seeded.log.every(x=>x==='durable') && report.fileProgress?.needsReview===true && allowed,{errors,progress:report.fileProgress,seeded});
  await page.goto(`file://${join(newDist,'index.html')}`);await ready(page);await page.locator('.study-memory-links button').filter({hasText:'Needs review'}).click();
  await page.getByRole('heading',{name:/Needs review/}).waitFor();
  check('file:// Needs review list renders fixture records',await page.locator('.question-list article').count()===5,{count:await page.locator('.question-list article').count()});
  await context.close();
} catch (error) {
  failures.push(`uncaught: ${error.message}`); report.error={message:error.message,stack:error.stack}; console.error(error);
} finally {
  await Promise.all(contexts.map(c=>c.close().catch(()=>{})));
  await new Promise(resolveClose=>server.close(resolveClose));
  report.status=failures.length?'FAIL':'PASS';report.failures=failures;
  writeFileSync(join(evidence,'browser-results.json'),JSON.stringify(report,null,2)+'\n');
}
if(failures.length) process.exitCode=1;
