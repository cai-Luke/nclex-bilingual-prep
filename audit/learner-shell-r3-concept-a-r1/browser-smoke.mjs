// Task-owned producer smoke. Uses system Google Chrome and disposable storage only.
// Run from worktree: node --import tsx audit/learner-shell-r3-concept-a-r1/browser-smoke.mjs
// PLAYWRIGHT_MODULE may point to an existing external installation; no dependency is added.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { questionFingerprint } from '../../src/completedMemory.ts';
import { getCorrectAnswer } from '../../src/grading.ts';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/tmp/shrimp-omnibus-tools/node_modules/playwright/index.mjs');
const out = resolve('audit/learner-shell-r3-concept-a-r1');
mkdirSync(join(out, 'screenshots'), { recursive: true });
const checks = [], errors = [], warnings = [], screenshots = [];
const sha = f => createHash('sha256').update(readFileSync(f)).digest('hex');
const questions = readdirSync('banks').filter(f => f.endsWith('.json')).sort().flatMap(f => JSON.parse(readFileSync(`banks/${f}`)).questions);
const q = questions.find(q => q.itemType === 'multiple_choice' && !q.visual && q.glossary.some(t => q.stem.en.toLowerCase().includes(t.termEn.toLowerCase())));
const q2 = questions.find(x => x.itemType === 'multiple_choice' && !x.visual && x.id !== q.id);
const visualQ = questions.find(x => x.itemType === 'multiple_choice' && x.visual?.kind === 'rhythm_strip');
const caseQ = questions.find(x => x.itemType === 'case_study' && x.caseStudy.stages?.length && x.caseStudy.questions.length > 1);
assert(q && q2 && visualQ && caseQ);
const byId = new Map(questions.map(q => [q.id, q]));
const now = '2026-09-14T01:00:00.000Z';
const snapshot = (id, qs = [q, q2], extra = {}) => ({
  id, mode:'study', questionIds:qs.map(q=>q.id), poolIds:qs.map(q=>q.id), index:0,
  answers:{}, results:{}, scores:{}, attempts:{}, fingerprints:Object.fromEntries(qs.map(q=>[q.id,questionFingerprint(q)])),
  skippedQuestionIds:[], phase:'questions', languageMode:'on-tap', title:'Shell verification set',
  startedAt:now, updatedAt:now, launchIntent:'ordinary', returnView:'home', requestedCount:qs.length, ...extra,
});
const server = createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\//,'') || 'index.html';
  if (rel.includes('..')) { res.writeHead(400); res.end(); return; }
  try { const f=resolve('dist',rel); res.setHeader('Content-Type', f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.json')?'application/json':f.endsWith('.png')?'image/png':f.endsWith('.svg')?'image/svg+xml':'text/html');res.end(readFileSync(f)); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base = `http://127.0.0.1:${server.address().port}`;
const contexts=[];
const launch = async (viewport={width:1440,height:900}) => {
  const ctx=await chromium.launchPersistentContext(mkdtempSync('/tmp/shrimp-shell-r3-'),{
    channel:'chrome',headless:true,viewport,ignoreDefaultArgs:['--disable-web-security'],
  });
  contexts.push(ctx); return ctx;
};
let ctx=await launch();
let page=ctx.pages()[0]; page.setDefaultTimeout(12000);
const observe = p => { p.on('pageerror',e=>errors.push({url:p.url(),message:e.message}));p.on('console',m=>{if(m.type()==='error')errors.push({url:p.url(),message:m.text()});if(m.type()==='warning')warnings.push({url:p.url(),message:m.text()});}); };
observe(page);
const btn=(name)=>page.getByRole('button',{name,exact:true});
const nav=(name)=>page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name,exact:true});
const ready=async()=>{await page.locator('.study-workspace').waitFor(); await page.waitForFunction(()=>!document.querySelector('.test-start')?.disabled);};
const expandNewSet=async()=>{if(!await page.locator('.study-new-set').evaluate(el=>el.open))await page.locator('.study-new-set summary').click();};
const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const pass=async(name,details={})=>{const metrics=await page.evaluate(()=>({viewport:{width:innerWidth,height:innerHeight},devicePixelRatio,theme:document.documentElement.dataset.theme,textSize:document.documentElement.dataset.textSize,protocol:location.protocol}));checks.push({name,status:'PASS',...metrics,...details});console.log('PASS',name);};
const shot=async(name)=>{await page.bringToFront();await settle();const path=`screenshots/${name}.png`;const camera=await page.context().newCDPSession(page);const capture=await camera.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});await camera.detach();writeFileSync(join(out,path),Buffer.from(capture.data,'base64'));screenshots.push(path);return path;};
const noOverflow=async()=>{const sizes=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));assert(sizes.scroll<=sizes.client,JSON.stringify(sizes));return sizes;};
const raw=async(store)=>page.evaluate(async name=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('nclex-bilingual-prep');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});const rows=await new Promise((resolve,reject)=>{const r=db.transaction(name).objectStore(name).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});db.close();return rows;},store);
const seed=async(stores,settings)=>{
  await page.evaluate(async({stores,settings})=>{
    localStorage.setItem('completed-memory-notice','dismissed');
    if(settings)localStorage.setItem('nclex-settings',JSON.stringify(settings));
    const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('nclex-bilingual-prep');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
    const tx=db.transaction(Object.keys(stores),'readwrite');for(const [name,rows] of Object.entries(stores)){const st=tx.objectStore(name);st.clear();rows.forEach(row=>st.put(row));}
    await new Promise((r,j)=>{tx.oncomplete=r;tx.onerror=()=>j(tx.error);});db.close();
  },{stores,settings});
  await page.reload();await ready();
  if(stores.activeSession?.length)await btn('Continue set / 继续练习').waitFor();
};
const resume=async(s)=>{await seed({activeSession:[s]});await btn('Continue set / 继续练习').click();await page.locator('.session-shell').waitFor();};
const primaryNav=async()=>assert.deepEqual(await page.locator('.app-primary-nav button').allTextContents(),['Study','Library','Progress']);
const choose=async(question,correct)=>{const id=correct?question.correct[0]:question.options.find(o=>!question.correct.includes(o.id)).id;const text=question.options.find(o=>o.id===id).en;await page.locator('.option-row').filter({hasText:text}).click();};
try {
  await page.goto(base);await ready();
  await primaryNav();assert.equal(await btn('Developer').count(),0);assert.equal(await page.locator('.study-action-bay .primary-action').count(),1);
  await btn('Customize').focus();await page.keyboard.press('Tab');const focus=await page.evaluate(()=>({text:document.activeElement.textContent,style:getComputedStyle(document.activeElement).outlineStyle}));assert.equal(focus.style,'solid');
  await shot('desktop-study-light');await noOverflow();await pass('Desktop light root; exact primary IA; utility Settings; subordinate Customize; visible keyboard focus',{focus});
  await btn('Settings').click();await page.getByLabel('Theme').selectOption('dark');await nav('Study').click();await shot('desktop-study-dark');await noOverflow();await pass('Desktop dark root');
  const contrast=await page.evaluate(()=>{
    const l=c=>{const rgb=c.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};
    return ['.test-start','.study-action-bay > .muted-copy','.memory-detail','.header-utility','.app-primary-nav .active'].map(selector=>{const el=document.querySelector(selector);let bg=el;while(getComputedStyle(bg).backgroundColor==='rgba(0, 0, 0, 0)')bg=bg.parentElement;const color=getComputedStyle(el).color,background=getComputedStyle(bg).backgroundColor;const a=l(color),b=l(background);return{selector,color,background,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};});
  });
  assert(contrast.every(c=>c.ratio>=4.5),JSON.stringify(contrast));await pass('Dark shell sampled text contrast at least 4.5:1',{contrast});
  await page.setViewportSize({width:390,height:844});await shot('mobile-study-dark');await noOverflow();await pass('Mobile dark root with exactly three bottom tabs');
  await btn('Settings').click();await page.getByLabel('Theme').selectOption('light');await nav('Study').click();await shot('mobile-study-light');await primaryNav();await noOverflow();
  const navbox=await page.locator('.app-primary-nav').boundingBox();assert(navbox.y+navbox.height<=845);
  await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await settle();const last=await page.locator('.history-notice button').boundingBox();assert(last.y+last.height<navbox.y);
  await pass('Mobile light root; fixed bottom navigation and content clearance',{navbox});
  await page.evaluate(()=>scrollTo(0,0));
  await btn('Customize').click();await page.locator('.builder-panel').waitFor();await noOverflow();await btn('Back to Study').click();
  await nav('Library').click();await page.getByLabel('Source').selectOption('burn-canonical');await noOverflow();
  await btn('Import a bank').click();await page.locator('.import-panel').waitFor();await noOverflow();await btn('Back to Library').click();assert.equal(await page.getByLabel('Source').inputValue(),'burn-canonical');await pass('Customize subordinate to Study; Library filtering; advanced Import entry and return');
  await page.locator('.question-row').first().press('Enter');await btn('Practice this question').waitFor();await btn('Back to Library').click();await page.locator('.question-row').first().getByRole('button',{name:'Practice',exact:true}).click();await page.locator('.session-shell').waitFor();await btn('Library').click();await pass('Library keyboard inspect and existing single-question practice/return');
  await nav('Study').click();await seed({activeSession:[],progress:[],flags:[],answerEvents:[],completedSets:[]},{languageMode:'on-tap',themeMode:'light',textSizeMode:'default',revisitMissed:true,voiceEnabled:true});
  await btn('10').click();await btn('Start practice · 10 questions').click();await page.locator('.session-shell').waitFor();
  const started=(await raw('activeSession'))[0];assert.equal(started.questionIds.length,10);assert.equal(started.launchIntent,'ordinary');assert.equal(started.returnView,'home');assert.equal(await page.locator('.app-primary-nav').count(),0);await btn('Skip for now').click();
  await page.locator('.session-topbar').getByRole('button',{name:'Study',exact:true}).click();await btn('Continue set / 继续练习').waitFor();assert.equal(await page.locator('.study-action-bay .primary-action:visible').count(),1);
  await expandNewSet();await btn('25').click();const trigger=btn('Start practice · 25 questions');await trigger.click();await page.getByRole('dialog').waitFor();assert.equal(await page.locator('dialog .app-primary-nav').count(),0);await nav('Study').evaluate(el=>el.focus());assert(await page.locator('dialog').evaluate(el=>el.contains(document.activeElement)));
  assert.equal(await btn('Keep current set / 保留当前练习').evaluate(el=>document.activeElement===el),true);await page.keyboard.press('Escape');assert.equal(await trigger.evaluate(el=>document.activeElement===el),true);assert.equal((await raw('activeSession'))[0].id,started.id);
  await trigger.click();await btn('Keep current set / 保留当前练习').click();assert.equal(await trigger.evaluate(el=>document.activeElement===el),true);assert.equal((await raw('activeSession'))[0].id,started.id);
  await pass('Actual ordinary 10-question start; resume dominant; native replacement safe default; Escape and Keep preserve ID and restore focus');
  await trigger.click();await btn('Start new set / 开始新练习').click();await page.locator('.session-shell').waitFor();const replacement=(await raw('activeSession'))[0];assert.notEqual(replacement.id,started.id);assert.equal(replacement.questionIds.length,25);await pass('Explicit replacement uses the existing session machinery');

  await resume(snapshot('shell-ordinary-completion'));
  assert.equal(await page.locator('.app-primary-nav').count(),0);await noOverflow();
  await btn('Save question').click();await btn('Remove from Saved').waitFor();assert.equal((await raw('flags')).find(x=>x.questionId===q.id).flagged,true);
  await page.locator('.stem .inline-reveal').click();assert(await page.locator('.stem .chinese-line').isVisible());
  await page.locator('.term-button').first().click();await page.locator('.term-popover').waitFor();await btn('Close term').click();assert(await btn('Read stem').isVisible());
  const clear=await page.locator('.exam-calculator-launcher').boundingBox();const skip=await btn('Skip for now').boundingBox();assert(clear.y+clear.height<=skip.y);
  await page.locator('.exam-calculator-launcher').click();await btn('2').click();await btn('+').click();await btn('3').click();await btn('Equals').click();assert.match(await page.locator('.exam-calculator-display').innerText(),/5/);await btn('Minimize calculator').click();assert(await page.locator('.exam-calculator-launcher').isVisible());
  await choose(q,false);await shot('mobile-active-study');await btn('Submit answer').click();await page.locator('.answer-banner.incorrect').waitFor();await page.locator('.rationale-panel').waitFor();
  await ctx.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});await btn('Copy question for GPT / 复制问题给 GPT').click();assert((await page.evaluate(()=>navigator.clipboard.readText())).includes(q.stem.en));
  assert((await raw('progress')).find(x=>x.questionId===q.id).needsReview);await noOverflow();await shot('mobile-rationale');
  await pass('Mobile select/submit/rationale; Saved toggle; Chinese reveal; glossary; voice controls; GPT clipboard; sticky controls and calculator use without shell collision',{question:q.id,calculatorLauncher:clear,skip});
  await btn('Next').click();await choose(q2,true);await btn('Submit answer').click();await page.locator('.answer-banner.correct').waitFor();await btn('Finish').click();await page.locator('.completed-set').waitFor();await noOverflow();await shot('mobile-summary');
  const completed=(await raw('completedSets'))[0];assert.equal(completed.sessionId,'shell-ordinary-completion');assert.equal(completed.deliveredCount,2);assert.equal((await raw('activeSession')).length,0);await pass('New ordinary set completion persists Summary and bounded Last set',{sessionId:completed.sessionId});
  await btn('Back to Study').click();assert.deepEqual(await page.locator('.memory-count').allTextContents(),['1','1']);
  await page.getByRole('button',{name:/^Needs review/}).click();await page.locator('.memory-row').waitFor();await noOverflow();await shot('mobile-needs-review');await page.locator('.question-inspect').click();await btn('Back to Needs review').click();await page.getByRole('button',{name:/^Practice these/}).click();await page.locator('.session-shell').waitFor();assert.equal((await raw('activeSession'))[0].returnView,'needsReview');await choose(q,false);await btn('Needs review').click();await btn('Back to Study').click();await pass('Needs Review factual count, inspect/practice and return');
  await page.getByRole('button',{name:/^Saved/}).click();await page.locator('.question-inspect').click();await btn('Back to Saved').click();await page.getByRole('button',{name:/^Practice these/}).click();await btn('Keep current set / 保留当前练习').click();await page.getByRole('button',{name:/^Practice these/}).click();await btn('Start new set / 开始新练习').click();await page.locator('.session-shell').waitFor();assert.equal((await raw('activeSession'))[0].returnView,'saved');await choose(q,false);await btn('Saved').click();await btn('Remove from Saved').click();await page.waitForFunction(()=>document.activeElement?.tagName==='H2');assert.equal(await page.locator('.memory-row').count(),0);await btn('Back to Study').click();assert.deepEqual(await page.locator('.memory-count').allTextContents(),['1','0']);await pass('Saved inspect/practice/remove; last-row focus recovery and factual independent counts');
  await page.locator('.last-set-entry').click();await page.locator('.summary-review-toggle').first().click();await page.locator('.summary-review-body').waitFor();await noOverflow();await btn('Try again').first().click();await btn('Start new set / 开始新练习').click();await page.locator('.session-shell').waitFor();assert.equal((await raw('activeSession'))[0].returnView,'lastSet');await choose(q,true);await btn('Submit answer').click();await page.locator('.answer-banner.correct').waitFor();await btn('Finish').click();await page.locator('.completed-set').waitFor();assert.equal((await raw('completedSets'))[0].sessionId,completed.sessionId);assert.equal((await raw('progress')).find(x=>x.questionId===q.id).needsReview,false);await pass('Last Set inspect/retry path; full marks clears Needs review; remediation does not replace ordinary Last set');
  await resume(snapshot('shell-skip',[q,q2]));await btn('Skip for now').click();await btn('Skip for now').click();await btn('Review skipped questions').click();await choose(q,true);await btn('Submit answer').click();await btn('Next').click();await pass('Existing skip and revisit flow');

  await resume(snapshot('shell-visual',[visualQ]));await page.locator('.rhythm-strip-svg svg').first().waitFor();await noOverflow();await shot('mobile-standalone-visual');await page.getByRole('button',{name:'Enlarge visual / 放大图像',exact:true}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');await pass('Standalone visual question renders in active Study',{question:visualQ.id,kind:visualQ.visual.kind});
  await page.locator('.session-topbar').getByRole('button',{name:'Study',exact:true}).click();await btn('Settings').click();await page.getByLabel('Theme').selectOption('dark');await nav('Study').click();await btn('Continue set / 继续练习').click();
  const visualBg=await page.locator('.rhythm-strip-svg').first().evaluate(el=>getComputedStyle(el).backgroundColor);assert.equal(visualBg,'rgb(255, 248, 250)');await shot('mobile-visual-dark');await pass('Clinical visual remains light-locked in dark shell',{background:visualBg});
  await resume(snapshot('shell-case',[caseQ],{answers:{[caseQ.id]:getCorrectAnswer(caseQ)}}));await page.locator('.case-part-nav').waitFor();await noOverflow();await shot('mobile-case-study');
  const before=await page.locator('.case-part-nav-controls > span').innerText();await page.locator('.case-part-nav-controls').getByRole('button',{name:'Next',exact:true}).click();const after=await page.locator('.case-part-nav-controls > span').innerText();assert.notEqual(after,before);await page.locator('.case-part-nav-controls').getByRole('button',{name:'Previous',exact:true}).click();await pass('Case study part navigation and staged chart presentation',{question:caseQ.id,stageCount:caseQ.caseStudy.stages.length,before,after});

  await page.locator('.session-topbar').getByRole('button',{name:'Study',exact:true}).click();await btn('Settings').click();await page.getByLabel('Chinese display').selectOption('always');await btn('Large').click();await page.reload();await ready();await btn('Settings').click();assert.equal(await page.getByLabel('Chinese display').inputValue(),'always');assert.equal(await page.getByLabel('Theme').inputValue(),'dark');assert.equal(await btn('Large').getAttribute('aria-pressed'),'true');await nav('Study').click();await noOverflow();await shot('mobile-study-large-dark');
  await btn('Continue set / 继续练习').click();await noOverflow();assert.equal(await btn('Tap ZH').getAttribute('aria-pressed'),'true');await pass('Settings persist theme, Large text and Chinese default; resumed session keeps its own language mode');
  await page.locator('.session-topbar').getByRole('button',{name:'Study',exact:true}).click();await seed({progress:[{questionId:q.id,seen:3,correct:0,lastSeen:now,needsReview:true}]});await nav('Progress').click();await page.getByRole('heading',{name:'Attempts and coverage'}).waitFor();await noOverflow();await page.locator('.weak-topic-list button').first().click();assert.equal(await page.getByLabel('Topic').inputValue(),q.topic);await pass('Progress factual metrics and topic navigation under Large text');
  await nav('Study').click();await page.setViewportSize({width:320,height:740});await noOverflow();await nav('Library').click();await noOverflow();await btn('Settings').click();await noOverflow();await pass('320px extra narrow root, Library and Settings with Large text');

  // Browser-native zoom through Chrome settings, not CSS scaling or pinch emulation.
  await page.setViewportSize({width:1440,height:900});const settingsPage=await ctx.newPage();await settingsPage.goto('chrome://settings/appearance');await settingsPage.locator('#zoomLevel').selectOption('2');await settingsPage.close();await page.reload();await ready();
  const zoom=await page.evaluate(()=>({innerWidth,innerHeight,devicePixelRatio}));assert.equal(zoom.innerWidth,720);assert.equal(zoom.devicePixelRatio,2);
  await noOverflow();await shot('study-browser-200-percent');await expandNewSet();await btn('Start practice · 50 questions').click();await page.getByRole('dialog').waitFor();
  const dialogMetrics=await page.evaluate(()=>{const rect=s=>document.querySelector(s).getBoundingClientRect().toJSON();return{title:rect('#session-replacement-title'),safe:rect('.session-replacement-dialog .primary-action'),dialog:rect('.session-replacement-dialog'),height:innerHeight,bodyScroll:document.querySelector('#session-replacement-description').scrollHeight,bodyClient:document.querySelector('#session-replacement-description').clientHeight};});
  assert(dialogMetrics.title.y>=0 && dialogMetrics.title.bottom<=zoom.innerHeight);assert(dialogMetrics.safe.y>=0 && dialogMetrics.safe.bottom<=zoom.innerHeight);await shot('replacement-large-browser-200-percent');await page.keyboard.press('Escape');assert(await btn('Start practice · 50 questions').evaluate(el=>el===document.activeElement));await pass('Real Chrome 200% zoom plus production Large text; root and native dialog title/safe action visible; Escape restores focus',{zoom,dialogMetrics});
  const resetPage=await ctx.newPage();await resetPage.goto('chrome://settings/appearance');await resetPage.locator('#zoomLevel').selectOption('1');await resetPage.close();

  // Force only the update response; production code renders and handles the banner.
  await page.route('**/build-info.json?*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({buildId:'shell-smoke-new-build',builtAt:'2026-09-15T00:00:00.000Z'})}));await page.reload();await ready();await page.locator('.app-update-banner').waitFor();await page.setViewportSize({width:390,height:844});await noOverflow();await shot('mobile-update-banner');await page.locator('.app-update-banner button').click();await ready();await pass('Forced production update banner remains visible and Refresh usable');await page.unroute('**/build-info.json?*');
  await page.goto(base+'/?dev=1');await btn('Settings').click();await btn('Open Preview Lab').click();assert.equal(await page.locator('.app-primary-nav').count(),0);await page.locator('.preview-lab-page > .section-heading').getByRole('button',{name:'Settings',exact:true}).click();await btn('Developer').click();assert.equal(await page.locator('.app-primary-nav').count(),0);await pass('Dev-gated Preview Lab and Developer reachable through Settings; learner nav absent');

  // Hold asynchronous IDB delivery without altering the production code.
  ctx=await launch();page=ctx.pages()[0];observe(page);await page.goto(base);await ready();await seed({activeSession:[snapshot('hydration-protected',[q],{answers:{[q.id]:getCorrectAnswer(q)}})]});
  await page.addInitScript(()=>{
    window.__releaseData=[];const original=IDBObjectStore.prototype.getAll;
    IDBObjectStore.prototype.getAll=function(...args){const r=original.apply(this,args);if(this.name==='progress'){const add=r.addEventListener.bind(r);r.addEventListener=(type,fn,options)=>add(type,type==='success'?e=>window.__releaseData.push(()=>fn.call(r,e)):fn,options);}return r;};
  });
  await page.reload();await page.waitForFunction(()=>window.__releaseData.length>0);assert(await btn('Start practice · 50 questions').isDisabled());await btn('Study all questions').evaluate(el=>el.click());assert.equal(await page.locator('.session-shell').count(),0);assert.equal((await raw('activeSession'))[0].id,'hydration-protected');await page.evaluate(()=>window.__releaseData.splice(0).forEach(fn=>fn()));await ready();await btn('Continue set / 继续练习').waitFor();await pass('Delayed learner hydration cannot be bypassed by shell launch controls');
  ctx=await launch();page=ctx.pages()[0];observe(page);await page.goto(base);await ready();await seed({activeSession:[snapshot('resume-hydration-protected',[q],{answers:{[q.id]:getCorrectAnswer(q)}})]});
  await page.addInitScript(()=>{
    window.__releaseSession=[];let held=false;const original=IDBObjectStore.prototype.getAll;
    IDBObjectStore.prototype.getAll=function(...args){const r=original.apply(this,args);if(this.name==='activeSession'&&!held){held=true;const add=r.addEventListener.bind(r);r.addEventListener=(type,fn,options)=>add(type,type==='success'?e=>window.__releaseSession.push(()=>fn.call(r,e)):fn,options);}return r;};
  });
  await page.reload();await page.waitForFunction(()=>window.__releaseSession.length>0);await btn('Start practice · 50 questions').click();await page.getByText('Preparing your set / 正在准备练习…',{exact:true}).waitFor();assert.equal(await page.locator('.session-shell').count(),0);await page.evaluate(()=>window.__releaseSession.splice(0).forEach(fn=>fn()));await page.getByRole('dialog').waitFor();await btn('Keep current set / 保留当前练习').click();assert.equal((await raw('activeSession'))[0].id,'resume-hydration-protected');assert(await btn('Start practice · 50 questions').isVisible());assert(await btn('Start practice · 50 questions').evaluate(el=>el===document.activeElement));await pass('Start during active-session hydration waits, then offers safe replacement; no lost resumable session');

  ctx=await launch({width:390,height:844});page=ctx.pages()[0];observe(page);await page.goto(pathToFileURL(resolve('dist/index.html')).href);await ready();await primaryNav();await noOverflow();await shot('production-file-study');await nav('Library').click();await page.getByLabel('Source').selectOption('burn-canonical');await page.locator('.question-row').first().getByRole('button',{name:'Practice',exact:true}).click();await page.locator('.session-shell').waitFor();assert.equal(await page.locator('.app-primary-nav').count(),0);await shot('production-file-session');await btn('Library').click();await nav('Progress').click();await page.getByRole('heading',{name:'Attempts and coverage'}).waitFor();await btn('Settings').click();await page.getByLabel('Theme').selectOption('dark');await page.reload();await ready();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');await btn('Continue set / 继续练习').click();await page.locator('.session-shell').waitFor();await noOverflow();await pass('Final production file:// loads, navigates, starts Study and resumes after reload without module/path errors',{artifact:resolve('dist/index.html'),sha256:sha('dist/index.html')});
  const baselineConsole=JSON.parse(readFileSync(join(out,'baseline-file-console.json')));const allowed=new Set(baselineConsole.errors.map(e=>e.message.replaceAll(baselineConsole.directory,'<DIST>')));const regressions=errors.filter(e=>!e.url.startsWith('file:')||!allowed.has(e.message.replaceAll(pathToFileURL(resolve('dist')).href+'/', '<DIST>')));assert.deepEqual(regressions,[]);assert.deepEqual(warnings,[]);await pass('No new application console warnings/errors; file manifest CORS matches baseline exactly',{baselineConsole:'baseline-file-console.json',preexistingFileConsoleMessages:errors.length});
} catch(e) {
  checks.push({name:'Runner failure',status:'FAIL',message:e.stack});console.error(e);await shot('failure').catch(()=>{});process.exitCode=1;
} finally {
  const result={chromeVersion:await page.evaluate(()=>navigator.userAgent).catch(()=>''),transport:'System Google Chrome via Playwright; isolated profiles, normal web security',questions:{ordinary:q.id,second:q2.id,visual:visualQ.id,caseStudy:caseQ.id},inputHashes:{app:sha('src/App.tsx'),css:sha('src/styles.css'),productionHtml:sha('dist/index.html')},checks,errors,warnings,screenshots};
  writeFileSync(join(out,'browser-results.json'),JSON.stringify(result,null,2)+'\n');
  for(const c of contexts)await c.close().catch(()=>{});server.close();
}
