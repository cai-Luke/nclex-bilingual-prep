// Extends the parent scratch/ux-0b/browser.mjs proof, now tracked and fixture-independent.
// Run after npm run build and starting the production preview server:
// PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node --import tsx scripts/tests/session-start-browser.mjs
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import { validateQuestion } from '../../src/schema.ts';
const questions=readdirSync('banks').filter(x=>x.endsWith('.json')).flatMap(x=>JSON.parse(readFileSync(`banks/${x}`,'utf8')).questions);
const byId=new Map(questions.map(q=>[q.id,q]));
const f={mc:byId.get('burn_mc_resuscitation_threshold_02'),caseQuestion:byId.get('opus2_case_code_status_01')};
assert.ok(f.mc && f.caseQuestion, 'parent browser fixtures must still exist');
const out=process.env.UX0B_EVIDENCE_DIR || 'audit/ux-0b-r1-2026-09-11';
const baseUrl=process.env.UX0B_BASE_URL || 'http://127.0.0.1:4174/';
const negativeControl=process.env.UX0B_NEGATIVE_CONTROL === '1';
mkdirSync(out,{recursive:true});
const probeEvidence=[];

// Read-only probes are inserted into the served production bundle, never src/ or dist/.
// AST selectors require unique matches and fail closed if the compiled structure drifts.
// The negative control removes only !uploadedLoaded at the actual request boundary.
function instrumentBundle(code) {
  const source=ts.createSourceFile('production.js',code,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
  const candidates={weighted:[],request:[],construct:[]};
  function visit(node) {
    if(ts.isArrowFunction(node)) {
      const body=node.body.getText(source);
      if(node.parameters.length===5 && body.includes('.floorThreshold') && body.includes('.floorKindPriority')) candidates.weighted.push(node);
      if(node.parameters.length===4 && body.includes('.activeElement') && body.includes('.request(')) candidates.request.push(node);
      if(node.parameters.length===1 && ts.isObjectBindingPattern(node.parameters[0].name)) {
        const names=node.parameters[0].name.elements.map(el=>(el.propertyName ?? el.name).getText(source));
        if(['poolIds','questions','startedAt','adaptive'].every(name=>names.includes(name))) candidates.construct.push(node);
      }
    }
    ts.forEachChild(node,visit);
  }
  visit(source);
  for(const [name,nodes] of Object.entries(candidates)) assert.equal(nodes.length,1,`one compiled ${name} probe target`);
  const edits=[];
  const insert=(position,text)=>edits.push({start:position,end:position,text});
  const weighted=candidates.weighted[0];
  assert.ok(ts.isBlock(weighted.body));
  const [pool,count,progress,,params]=weighted.parameters.map(p=>p.name.getText(source));
  insert(weighted.body.getStart(source)+1,`window.__weightedInputs.push({progress:structuredClone(${progress}),poolIds:${pool}.map(r=>r.question.id),count:${count},now:${params}.now?.toISOString()});`);
  const request=candidates.request[0];
  insert(request.getStart(source),'(window.__requestSessionStart=');
  insert(request.end,')');
  const construct=candidates.construct[0];
  assert.ok(!ts.isBlock(construct.body));
  insert(construct.body.getStart(source),'(window.__constructions++,');
  insert(construct.body.end,')');
  if(negativeControl) {
    const gates=[];
    function findGate(node) {
      if(ts.isPrefixUnaryExpression(node) && node.operator===ts.SyntaxKind.ExclamationToken && ts.isIdentifier(node.operand)) gates.push(node);
      ts.forEachChild(node,findGate);
    }
    findGate(request.body);
    assert.equal(gates.length,1,'negative control identifies the sole readiness negation');
    edits.push({start:gates[0].getStart(source),end:gates[0].end,text:'false'});
  }
  let instrumented=code;
  for(const edit of edits.sort((a,b)=>b.start-a.start)) instrumented=instrumented.slice(0,edit.start)+edit.text+instrumented.slice(edit.end);
  probeEvidence.push({productionSha256:createHash('sha256').update(code).digest('hex'),servedSha256:createHash('sha256').update(instrumented).digest('hex'),negativeControl,targets:Object.fromEntries(Object.entries(candidates).map(([k,v])=>[k,v.length]))});
  return instrumented;
}
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
await context.addInitScript(()=>{
  window.__randomCalls=0; window.__sessionWrites=[];
  window.__weightedInputs=[]; window.__constructions=0; window.__learnerReleases=[]; window.__readStores=[];
  window.__releaseLearnerHydration=()=>{
    localStorage.removeItem('ux0br1-held-store');
    window.__learnerReleases.splice(0).forEach(release=>release());
  };
  const random=Math.random; Math.random=()=>{window.__randomCalls++;return random();};
  const put=IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put=function(value,...args){
    if(this.name==='activeSession') window.__sessionWrites.push(value.id);
    const req=put.call(this,value,...args);
    if(this.name==='activeSession' && window.__holdNextActiveSave){
      window.__holdNextActiveSave=false;
      const add=req.addEventListener.bind(req);
      req.addEventListener=(type,listener,options)=>{
        if(type==='success') add(type,event=>{window.__releaseSave=()=>listener.call(req,event);},options);
        else add(type,listener,options);
      };
    }
    return req;
  };
  const getAll=IDBObjectStore.prototype.getAll;
  IDBObjectStore.prototype.getAll=function(...args){
    const req=getAll.apply(this,args);
    window.__readStores.push(this.name);
    const held=localStorage.getItem('ux0br1-held-store');
    const learnerStores=['uploadedQuestions','progress','flags','languageMisses','answerEvents','caseAnswerPartEvents','translationRevealEvents','flashcardProgress'];
    if(learnerStores.includes(this.name) && (held==='all' || held===this.name)){
      const add=req.addEventListener.bind(req);
      req.addEventListener=(type,listener,options)=>{
        if(type==='success') add(type,event=>window.__learnerReleases.push(()=>listener.call(req,event)),options);
        else add(type,listener,options);
      };
    }
    if(this.name==='activeSession'&&localStorage.getItem('ux0b-holdHydration')==='1'){
      localStorage.removeItem('ux0b-holdHydration');
      const add=req.addEventListener.bind(req);
      req.addEventListener=(type,listener,options)=>{
        if(type==='success') add(type,event=>{window.__releaseHydration=()=>listener.call(req,event);},options);
        else add(type,listener,options);
      };
    }
    return req;
  };
});
const page=await context.newPage(); page.setDefaultTimeout(10000);
const errors=[]; page.on('pageerror',e=>errors.push(e.message));
const checks=[]; const pass=(name,detail={})=>{checks.push({name,...detail});console.log('PASS',name);};
const nav=name=>page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name,exact:true});
const button=name=>page.getByRole('button',{name,exact:true});
const dialog=()=>page.getByRole('dialog',{name:'Start a new set? / 开始新的练习吗？'});
const keep=()=>dialog().getByRole('button',{name:'Keep current set / 保留当前练习',exact:true});
const confirm=()=>dialog().getByRole('button',{name:'Start new set / 开始新练习',exact:true});
const shot=name=>page.screenshot({path:`${out}/${name}.png`,fullPage:false});
const stripTime=s=>{const {updatedAt,...rest}=s;return rest;};
async function readSnapshot(){return page.evaluate(async()=>{
  const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('nclex-bilingual-prep');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  const rows=await new Promise((resolve,reject)=>{const r=db.transaction('activeSession').objectStore('activeSession').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});db.close();return rows[0]??null;
});}
async function seed(stores,settings){await page.evaluate(async({stores,settings})=>{
  if(settings)localStorage.setItem('nclex-settings',JSON.stringify(settings));
  const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('nclex-bilingual-prep');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  await new Promise((resolve,reject)=>{const tx=db.transaction(Object.keys(stores),'readwrite');for(const [name,rows]of Object.entries(stores)){const store=tx.objectStore(name);store.clear();rows.forEach(row=>store.put(row));}tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();
},{stores,settings});await page.reload();await nav('Home').waitFor();}
function snapshot(q=f.mc,overrides={}){return {id:`ux0b-${q.id}`,mode:'study',questionIds:[q.id],poolIds:[q.id],index:0,answers:{},results:{},scores:{},skippedQuestionIds:[],phase:'questions',languageMode:'always',title:'UX-0B browser smoke',startedAt:'2026-09-11T06:00:00Z',updatedAt:'2026-09-11T06:00:00Z',...overrides};}
async function seedSession(s){await seed({activeSession:[s]});await button('Resume session').waitFor();}
async function sessionVisible(){await page.locator('.session-shell').waitFor();assert.equal(await dialog().count(),0);return readSnapshot();}
async function assertCancel(launch,{escape=false,mobile=false}={}){
  const before=await readSnapshot();const draws=await page.evaluate(()=>window.__randomCalls);
  await launch.click();await dialog().waitFor();
  assert.equal(await keep().evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.evaluate(()=>window.__randomCalls),draws,'request cannot consume a draw');
  if(mobile){await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await shot('mobile-replacement-dialog');}
  if(escape)await page.keyboard.press('Escape');else await keep().click();
  await dialog().waitFor({state:'hidden'});
  assert.equal(await launch.evaluate(el=>el===document.activeElement),true,'cancel restores initiating focus');
  assert.deepEqual(stripTime(await readSnapshot()),stripTime(before));
  assert.equal(await page.evaluate(()=>window.__randomCalls),draws,'cancel cannot consume a draw');
  if(mobile)await page.setViewportSize({width:1440,height:1000});
}
async function confirmLaunch(launch){await launch.click();await dialog().waitFor();await confirm().click();return sessionVisible();}
async function libraryTopic(topic=f.mc.topic){await nav('Library').click();await page.getByRole('combobox',{name:/^Topic/}).selectOption(topic);}
const row=q=>page.locator('.question-list > article.interactive-row').filter({has:page.getByRole('heading',{name:q.stem.en,exact:true})});
try{
  await page.goto(baseUrl);await nav('Home').waitFor();
  if(!negativeControl){
  await seed({activeSession:[],progress:[]},{languageMode:'always',defaultMode:'test',voiceEnabled:false,themeMode:'light',textSizeMode:'default'});
  await button('Study all questions').click();let s=await sessionVisible();
  assert.equal(s.questionIds.length,questions.length);assert.equal(s.mode,'study');assert.equal(s.languageMode,'always');
  const untouchedId=s.id;await nav('Home').click();await page.getByRole('group',{name:'Number of questions'}).getByRole('button',{name:'10',exact:true}).click();
  await button('Start practice · 10 questions').click();s=await sessionVisible();
  assert.notEqual(s.id,untouchedId);assert.equal(s.questionIds.length,10);assert.ok(s.questionIds.every(id=>byId.get(id).itemType!=='case_study'));
  pass('No-session Study all and untouched-session weighted launch need no dialog',{allCount:questions.length,weightedCount:10});

  await libraryTopic();await row(f.mc).click();s=await sessionVisible();assert.deepEqual(s.questionIds,[f.mc.id]);
  await page.locator('.option-row:visible').first().click();await nav('Home').click();
  await assertCancel(button('Start practice · 50 questions'),{escape:true,mobile:true});
  await button('Resume session').click();await page.locator('.session-shell').waitFor();
  assert.equal(await page.locator('.session-topbar').getByRole('button',{name:'Library',exact:true}).count(),1);
  await nav('Home').click();await assertCancel(button('Start practice · 50 questions'));
  pass('Standalone draft, Escape, safe focus, re-request and Library return context survive Home cancellation');

  await libraryTopic();await assertCancel(row(f.mc));await page.getByRole('heading',{name:/matching questions/}).waitFor();
  for(const mode of ['Test','Adaptive']){
    await nav('Builder').click();await page.getByRole('group',{name:'Session mode'}).getByRole('button',{name:mode,exact:true}).click();
    await button('All categories').click();await button(f.mc.category).click();await page.getByRole('combobox',{name:/^Status pool/}).selectOption('unseen');
    await assertCancel(button(mode==='Adaptive'?'Start adaptive exam':'Start session'));
    assert.equal(await page.getByRole('group',{name:'Session mode'}).getByRole('button',{name:mode,exact:true}).getAttribute('class'),'active');
    assert.equal(await page.getByRole('combobox',{name:/^Status pool/}).inputValue(),'unseen');
    assert.equal(await button(f.mc.category).getAttribute('aria-pressed'),'true');
  }
  pass('Library one-question and Builder Test/Adaptive cancellation preserve destination and selections');
  await libraryTopic();s=await confirmLaunch(row(f.mc));assert.deepEqual(s.questionIds,[f.mc.id]);
  assert.equal(await page.locator('.session-topbar').getByRole('button',{name:'Library',exact:true}).count(),1);
  const replacementId=s.id;await page.reload();await button('Resume session').click();
  s=await sessionVisible();assert.equal(s.id,replacementId);assert.deepEqual(s.questionIds,[f.mc.id]);
  pass('Confirmed Library single question is persisted before visible launch and survives immediate reload',{durableIndexedDB:true});

  const part=f.caseQuestion.caseStudy.questions[1];
  await seedSession(snapshot(f.caseQuestion));await button('Resume session').click();
  await page.getByRole('navigation',{name:'Case study parts'}).getByRole('button',{name:/^Part 2 /}).click();
  await page.locator('.option-row:visible').first().click();await nav('Home').click();
  s=await readSnapshot();assert.ok(s.answers[f.caseQuestion.id].caseStudy[part.id]);
  await assertCancel(button('Study all questions'));
  await button('Study all questions').click();await shot('desktop-replacement-dialog');await keep().click();
  pass('Unsubmitted case-part draft triggers confirmation and survives cancellation');

  await seedSession(snapshot());await button('Resume session').click();await button('Skip for now').click();
  await button('Review skipped questions').click();await nav('Home').click();
  assert.equal((await readSnapshot()).phase,'skipped-review');
  await assertCancel(button('Study all questions'));pass('Skipped-review work is protected without a submitted answer');

  const answer={optionIds:[f.mc.correct[0]]};
  await seedSession(snapshot(f.mc,{mode:'adaptive',answers:{[f.mc.id]:answer},results:{[f.mc.id]:true},scores:{[f.mc.id]:{earned:1,possible:1}},adaptive:{targetCount:10,currentDifficulty:'medium',rollingResults:[true],difficultyHistory:[{questionId:f.mc.id,difficulty:f.mc.difficulty,correct:true}]}}));
  await assertCancel(button('Study all questions'));
  for(const mode of ['Study','Test','Adaptive']){
    await nav('Builder').click();await page.getByRole('group',{name:'Session mode'}).getByRole('button',{name:mode,exact:true}).click();
    await button('All categories').click();await button(f.mc.category).click();const count=Number((await page.getByRole('heading',{name:/questions in pool/}).textContent()).split(' ')[0]);
    const launch=button(mode==='Adaptive'?'Start adaptive exam':'Start session');
    // Seeded adaptive work is protected for the first launch; leave each next set a draft.
    s=await confirmLaunch(launch);
    assert.equal(s.mode,mode.toLowerCase());assert.equal(s.languageMode,mode==='Study'?'always':'off');
    assert.ok(s.poolIds.every(id=>byId.get(id).category===f.mc.category));
    if(mode==='Adaptive'){assert.equal(s.adaptive.targetCount,Math.min(75,count));assert.equal(s.questionIds.length,1);assert.equal(byId.get(s.questionIds[0]).difficulty,'medium');}
    else assert.equal(s.questionIds.length,Math.min(50,count));
    // Any draft entry qualifies; a language control alone would not.
    await seedSession(snapshot(f.mc,{answers:{[f.mc.id]:answer}}));
  }
  pass('Answered adaptive work is protected; Builder Study/Test/Adaptive preserve population, counts, language and first-item semantics');

  for(const mode of ['Study','Test']){
    await libraryTopic();const count=questions.filter(q=>q.topic===f.mc.topic).length;
    s=await confirmLaunch(page.locator('main .section-heading').getByRole('button',{name:mode,exact:true}));
    assert.equal(s.questionIds.length,count);assert.ok(s.questionIds.every(id=>byId.get(id).topic===f.mc.topic));
    assert.equal(s.mode,mode.toLowerCase());await seedSession(snapshot(f.mc,{answers:{[f.mc.id]:answer}}));
  }
  const progress=[{questionId:f.mc.id,seen:1,correct:0,incorrect:1,correctStreak:0,missed:true,srsDueAt:'2020-01-01T00:00:00Z',lastSeenAt:'2020-01-01T00:00:00Z'}];
  for(const label of ['Review mistakes','Review answered','Spaced review']){
    await seed({progress,activeSession:[snapshot(f.mc,{answers:{[f.mc.id]:answer}})]});await button('Resume session').waitFor();
    s=await confirmLaunch(button(label));assert.deepEqual(s.questionIds,[f.mc.id]);
  }
  pass('Library filtered Study/Test and Home mistakes, answered and due launch through the same guard with unchanged pools');

  await seedSession(snapshot());
  await button('Resume session').click();
  await page.locator('.option-row:visible').nth(f.mc.options.findIndex(option=>!f.mc.correct.includes(option.id))).click();
  await button('Submit answer').click();await button('Finish').click();
  await button('Practice related').click();s=await sessionVisible();assert.equal(s.title,'Practice related');pass('Actually completed Summary related practice starts without an unfinished-work warning');

  await seedSession(snapshot());await libraryTopic();await row(f.mc).click();await sessionVisible();
  assert.equal(await page.locator('.session-topbar').getByRole('button',{name:'Library',exact:true}).count(),1);
  await page.locator('.option-row:visible').first().click();await nav('Home').click();
  const before=await readSnapshot();await page.evaluate(()=>{window.__sessionWrites=[];window.__randomCalls=0;});
  await button('Start practice · 50 questions').evaluate(el=>{el.click();el.click();});
  await dialog().waitFor();assert.equal(await page.locator('.session-replacement-dialog[open]').count(),1);
  assert.equal(await page.evaluate(()=>window.__randomCalls),0);
  await confirm().evaluate(el=>{el.click();el.click();});s=await sessionVisible();
  assert.equal(s.questionIds.length,50);assert.notEqual(s.id,before.id);
  assert.equal(await page.locator('.session-topbar').getByRole('button',{name:'Home',exact:true}).count(),1);
  assert.equal(await page.evaluate(old=>new Set(window.__sessionWrites.filter(id=>id!==old)).size,before.id),1);
  pass('Rapid double request and confirmation produce one dialog and one Home-origin weighted session');

  await seedSession(snapshot(f.mc,{answers:{[f.mc.id]:answer}}));
  await page.evaluate(()=>localStorage.setItem('ux0b-holdHydration','1'));await page.reload();
  await page.waitForFunction(()=>typeof window.__releaseHydration==='function');
  const beforeDraws=await page.evaluate(()=>window.__randomCalls);
  await button('Start practice · 50 questions').evaluate(el=>{el.click();el.click();});
  await page.getByRole('status').filter({hasText:'Preparing your set'}).waitFor();
  assert.equal(await dialog().count(),0);assert.equal(await page.locator('.session-shell').count(),0);
  assert.equal(await page.evaluate(()=>window.__randomCalls),beforeDraws);
  await page.evaluate(()=>window.__releaseHydration());await dialog().waitFor();
  assert.equal(await page.evaluate(()=>window.__randomCalls),beforeDraws);
  await keep().click();assert.equal((await readSnapshot()).id,`ux0b-${f.mc.id}`);
  pass('Actual delayed IndexedDB hydration holds one intent without sampling, then discovers protected work');
  }

  // R1: exercise the real compiled App, including requests that bypass UI props.
  const instrumentedBundles=new Map();
  await context.route('**/assets/*.js',async route=>{
    const response=await route.fetch();
    const url=route.request().url();
    if(!instrumentedBundles.has(url)) instrumentedBundles.set(url,instrumentBundle(await response.text()));
    await route.fulfill({response,body:instrumentedBundles.get(url)});
  });
  const now='2026-09-11T12:00:00.000Z';
  const seen={questionId:f.mc.id,seen:3,correct:2,incorrect:1,correctStreak:0,missed:true,lastSeenAt:'2026-09-01T00:00:00.000Z',srsDueAt:'2026-09-02T00:00:00.000Z'};
  const uploaded={question:{...structuredClone(f.mc),id:'ux0br1-uploaded-question'},sourceKind:'uploaded',sourceLabel:'UX-0B R1 isolated browser fixture',importedAt:now,id:'ux0br1-uploaded-question'};
  const validUploaded=validateQuestion(uploaded.question);
  assert.equal(validUploaded.ok,true,JSON.stringify(validUploaded.ok ? [] : validUploaded.reasons));
  const fixtureRecord={question:f.mc,sourceKind:'bundled',sourceLabel:'browser fixture'};
  const old=snapshot(f.mc,{answers:{[f.mc.id]:{optionIds:[f.mc.correct[0]]}}});
  const stores={
    activeSession:[old],progress:[seen],uploadedQuestions:[uploaded],
    flags:[{questionId:f.mc.id,flagged:true,updatedAt:now}],
    languageMisses:[],answerEvents:[],caseAnswerPartEvents:[],translationRevealEvents:[],flashcardProgress:[],
  };
  const flushUI=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const ready=()=>page.locator('.study-data-status').waitFor({state:'hidden'});
  const freezeDraws=()=>page.evaluate(now=>{
    const NativeDate=Date;
    window.Date=class extends NativeDate {
      constructor(...args){super(...(args.length ? args : [now]));}
      static now(){return now;}
    };
    let state=0x31415926;
    Math.random=()=>{window.__randomCalls++;state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};
    window.__randomCalls=0;
  },Date.parse(now));
  const holdLearner=async(nextStores=stores,heldStore='all')=>{
    await page.evaluate(store=>localStorage.setItem('ux0br1-held-store',store),heldStore);
    await seed(nextStores);
    await page.waitForFunction(count=>window.__learnerReleases.length===count,heldStore==='all'?8:1);
    assert.equal(await page.locator('.study-data-status').getAttribute('role'),'status');
  };
  const assertNoStart=async()=>{
    await flushUI();
    assert.equal(await page.getByRole('status').filter({hasText:'Preparing your set'}).count(),0,'pre-hydration request must not enter the guard');
    assert.equal(await dialog().count(),0);
    assert.equal(await page.locator('.session-shell').count(),0);
    assert.deepEqual(await page.evaluate(()=>({draws:window.__randomCalls,constructions:window.__constructions,weighted:window.__weightedInputs.length,writes:window.__sessionWrites})),{draws:0,constructions:0,weighted:0,writes:[]});
  };
  await holdLearner();
  assert.equal(await page.evaluate(()=>window.__readStores.includes('activeSession')),false,'active-session read cannot precede learner readiness');
  await freezeDraws();
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>scrollTo(0,0));
  await shot('mobile-startup-loading');
  const layout=await page.evaluate(()=>{
    const status=document.querySelector('.study-data-status');
    const main=document.querySelector('main').getBoundingClientRect();
    const header=document.querySelector('.app-header').getBoundingClientRect();
    const content=document.querySelector('.home-grid').getBoundingClientRect();
    return {statusInsideMain:status.parentElement.tagName==='MAIN',mainHeaderGap:main.top-header.bottom,contentStatusGap:content.top-status.getBoundingClientRect().bottom,overflow:document.documentElement.scrollWidth-innerWidth};
  });
  assert.equal(layout.statusInsideMain,true);
  assert.ok(Math.abs(layout.mainHeaderGap)<2,JSON.stringify(layout));
  assert.ok(layout.contentStatusGap>=0 && layout.contentStatusGap<=32,JSON.stringify(layout));
  assert.ok(layout.overflow<=0,JSON.stringify(layout));
  for(const label of ['Start practice · 50 questions','Study all questions','Review mistakes','Review answered','Spaced review']){
    assert.equal(await button(label).isDisabled(),true,label);
    await button(label).evaluate(el=>el.click());
  }
  // Explicitly bypass disabled controls: this is the App's actual request function,
  // exposed by the probe, not a copy of the readiness condition in the test.
  await page.evaluate(record=>window.__requestSessionStart([record],'study','Direct pre-hydration probe'),fixtureRecord);
  await assertNoStart();
  assert.deepEqual(await readSnapshot(),old,'startup requests cannot overwrite saved work');
  assert.equal(await button('Custom session').isEnabled(),true);
  await button('Custom session').click();
  for(const mode of ['Study','Test','Adaptive']){
    await page.getByRole('group',{name:'Session mode'}).getByRole('button',{name:mode,exact:true}).click();
    const launch=button(mode==='Adaptive'?'Start adaptive exam':'Start session');
    assert.equal(await launch.isDisabled(),true);
    await launch.evaluate(el=>el.click());
    await assertNoStart();
  }
  await page.getByRole('group',{name:'Session mode'}).getByRole('button',{name:'Study',exact:true}).click();
  await page.getByRole('combobox',{name:/^Status pool/}).selectOption('flagged');
  await libraryTopic();
  for(const label of ['Study','Test']){
    const launch=page.locator('main .section-heading').getByRole('button',{name:label,exact:true});
    assert.equal(await launch.isDisabled(),true);
    await launch.evaluate(el=>el.click());
  }
  assert.equal(await row(f.mc).getAttribute('aria-disabled'),'true');
  assert.equal(await row(f.mc).getAttribute('tabindex'),'-1');
  await row(f.mc).dispatchEvent('click');
  for(const key of ['Enter',' ']) await row(f.mc).dispatchEvent('keydown',{key});
  await assertNoStart();
  await nav('Settings').click();
  assert.equal(await nav('Settings').getAttribute('class'),'active');
  await nav('Home').click();
  await page.getByRole('status').filter({hasText:'Study data is taking longer to load.'}).waitFor({timeout:7000});
  await page.evaluate(()=>scrollTo(0,0));
  await shot('mobile-startup-delayed');
  assert.equal(await button('Start practice · 50 questions').isDisabled(),true);
  await assertNoStart();
  assert.deepEqual(await readSnapshot(),old,'five-second message must not change readiness or storage');
  await page.setViewportSize({width:1440,height:1000});
  await shot('desktop-startup-delayed');
  pass('Held initial learner-data hydration rejects Home, Builder, Library pointer/keyboard and direct App requests with zero draw, construction or writes',{heldStores:8,mobileLayout:layout,customNavigation:true,delayedMessageOnly:true});

  await page.evaluate(()=>window.__releaseLearnerHydration());
  await ready();
  await button('Resume session').waitFor();
  for(const label of ['Start practice · 50 questions','Study all questions','Review mistakes','Review answered','Spaced review']) assert.equal(await button(label).isEnabled(),true,label);
  await nav('Builder').click();
  assert.equal(await page.getByRole('combobox',{name:/^Status pool/}).inputValue(),'flagged');
  assert.equal(await button('Start session').isEnabled(),true);
  let r1Session=await confirmLaunch(button('Start session'));
  assert.deepEqual(r1Session.questionIds,[f.mc.id],'Builder uses hydrated flags and current filter');
  await libraryTopic();
  // The uploaded fixture copies this stem, so constrain the bundled row by its source text.
  assert.equal(await page.locator('.interactive-row[aria-disabled="false"]').count(),questions.filter(q=>q.topic===f.mc.topic).length+1);
  for(const label of ['Study','Test']) assert.equal(await page.locator('main .section-heading').getByRole('button',{name:label,exact:true}).isEnabled(),true);
  assert.equal(await page.getByRole('combobox',{name:/^Topic/}).inputValue(),f.mc.topic);
  await page.getByRole('combobox',{name:/^Source/}).selectOption(uploaded.sourceLabel);
  assert.equal(await page.locator('.interactive-row').getAttribute('tabindex'),'0');
  await page.locator('.interactive-row').press('Enter');
  r1Session=await sessionVisible();
  assert.deepEqual(r1Session.questionIds,[uploaded.id],'Library uses current source/topic filters and exact selected uploaded item');
  pass('Readiness releases all launch controls without reload; Builder flagged pool and Library current filters use hydrated inputs');

  const studyRuns=[];
  for(const delayed of [true,false]){
    const next={...stores,activeSession:[]};
    if(delayed) await holdLearner(next,'uploadedQuestions');
    else {await seed(next);await ready();}
    await freezeDraws();
    if(delayed){
      await button('Study all questions').evaluate(el=>el.click());
      await assertNoStart();
      await page.evaluate(()=>window.__releaseLearnerHydration());
      await ready();
    }
    await button('Study all questions').click();
    const result=await sessionVisible();
    assert.equal(await page.evaluate(()=>window.__constructions),1);
    assert.equal(result.questionIds.length,questions.length+1);
    assert.equal(new Set(result.questionIds).size,questions.length+1);
    assert.ok(result.questionIds.includes(uploaded.id));
    assert.equal(result.questionIds.at(-1),f.mc.id,'the seeded seen question follows every unseen question');
    const tiers=result.questionIds.map(id=>id===f.mc.id?'seen':'unseen');
    studyRuns.push({delayed,tiers,seenIndex:result.questionIds.indexOf(f.mc.id),uploadedIndex:result.questionIds.indexOf(uploaded.id),population:result.questionIds.length});
  }
  assert.deepEqual(studyRuns[0].tiers,studyRuns[1].tiers,'held and ordinary post-hydration launches preserve identical unseen/seen treatment');
  pass('Study all after held uploaded-record hydration includes the upload and matches ordinary post-hydration unseen/seen treatment',{runs:studyRuns.map(({tiers,...run})=>run),seenId:f.mc.id,uploadedId:uploaded.id});

  const categoryProgress=[...questions,uploaded.question].filter(q=>q.category===f.mc.category).map(q=>({questionId:q.id,seen:3,correct:3,incorrect:0,correctStreak:3,missed:false,lastSeenAt:now,srsDueAt:q.id===f.mc.id?'2026-09-01T00:00:00.000Z':'2099-01-01T00:00:00.000Z'}));
  const expectedProgress=Object.fromEntries(categoryProgress.map(p=>[p.questionId,p]));
  const weightedRuns=[];
  for(const delayed of [true,false]){
    const next={...stores,activeSession:[],progress:categoryProgress};
    if(delayed) await holdLearner(next,'progress');
    else {await seed(next);await ready();}
    await freezeDraws();
    await page.getByRole('group',{name:'Number of questions'}).getByRole('button',{name:'10',exact:true}).click();
    if(delayed){
      await button('Start practice · 10 questions').evaluate(el=>el.click());
      await assertNoStart();
      await page.evaluate(()=>window.__releaseLearnerHydration());
      await ready();
    }
    assert.equal(await page.evaluate(()=>Date.now()),Date.parse(now),'clock is fixed before activation');
    await button('Start practice · 10 questions').click();
    const result=await sessionVisible();
    const inputs=await page.evaluate(()=>window.__weightedInputs);
    assert.equal(inputs.length,1);
    assert.deepEqual(inputs[0].progress,expectedProgress,'actual weighted sampler receives the full hydrated progress map');
    assert.equal(inputs[0].now,now);
    assert.equal(inputs[0].poolIds.length,questions.length+1);
    assert.ok(inputs[0].poolIds.includes(uploaded.id));
    assert.equal(inputs[0].count,10);
    assert.ok(result.questionIds.includes(f.mc.id),'sole due item wins its category tier over other seen, not-due items');
    assert.equal(result.mode,'study');
    assert.equal(await page.evaluate(()=>window.__constructions),1);
    weightedRuns.push({delayed,progressKeys:Object.keys(inputs[0].progress).length,poolSize:inputs[0].poolIds.length,dueId:f.mc.id,dueSelected:true,mode:result.mode,count:result.questionIds.length});
    if(delayed) writeFileSync(`${out}/weighted-sampler-input.json`,JSON.stringify({input:inputs[0],selectedIds:result.questionIds},null,2)+'\n');
  }
  pass('Weighted sampler receives hydrated progress and gives the seeded due item its existing priority under controlled Math.random and Date',{runs:weightedRuns,oracle:'actual sampler input plus due-item behavior, not cross-context ID/order equality'});

  for(const saved of [null,snapshot(),old]){
    await page.evaluate(()=>localStorage.setItem('ux0b-holdHydration','1'));
    await seed({...stores,activeSession:saved?[saved]:[]});
    await page.waitForFunction(()=>typeof window.__releaseHydration==='function');
    await ready();
    await freezeDraws();
    const launch=button('Start practice · 50 questions');
    assert.equal(await launch.isEnabled(),true);
    await launch.focus();
    await launch.evaluate(el=>{el.click();el.click();});
    await page.getByRole('status').filter({hasText:'Preparing your set'}).waitFor();
    assert.equal(await page.evaluate(()=>window.__constructions),0);
    assert.equal(await page.evaluate(()=>window.__randomCalls),0);
    assert.equal(await dialog().count(),0);
    await page.evaluate(()=>window.__releaseHydration());
    if(saved===old){
      await dialog().waitFor();
      assert.equal(await keep().evaluate(el=>el===document.activeElement),true);
      assert.equal(await page.evaluate(()=>window.__constructions),0);
      const beforeCancel=await readSnapshot();
      // The existing hydration autosave materializes optional undefined fields.
      // Compare semantic fixture identity, then exact hydrated state across cancel.
      assert.deepEqual(JSON.parse(JSON.stringify(stripTime(beforeCancel))),stripTime(saved));
      await page.keyboard.press('Escape');
      await dialog().waitFor({state:'hidden'});
      assert.equal(await launch.evaluate(el=>el===document.activeElement),true);
      assert.deepEqual(stripTime(await readSnapshot()),stripTime(beforeCancel));
      assert.equal(await page.evaluate(()=>window.__randomCalls),0);
    }else{
      const result=await sessionVisible();
      assert.equal(await page.evaluate(()=>window.__constructions),1);
      assert.equal(await page.evaluate(()=>window.__weightedInputs.length),1);
      assert.equal(result.questionIds.length,50);
      assert.equal(await page.evaluate(()=>new Set(window.__sessionWrites).size),1);
    }
  }
  pass('After learner readiness, held active-session hydration accepts one intent: protected Escape restores focus; empty and untouched snapshots launch exactly once');

  await seed({...stores,activeSession:[snapshot()]});
  await ready();await button('Resume session').click();await page.locator('.session-shell').waitFor();
  await page.evaluate(()=>{window.__holdNextActiveSave=true;window.__sessionWrites=[];});
  await page.locator('.option-row:visible').first().click();
  await page.waitForFunction(()=>typeof window.__releaseSave==='function');
  await nav('Home').click();
  await button('Start practice · 50 questions').click();await dialog().waitFor();await confirm().click();
  await page.waitForFunction(()=>window.__constructions===1);
  await flushUI();
  assert.equal(await page.locator('.session-shell').count(),0,'replacement stays invisible while the older save completion is held');
  assert.deepEqual(await page.evaluate(()=>window.__sessionWrites),[snapshot().id],'new save cannot overtake the held older save');
  assert.equal((await readSnapshot()).id,snapshot().id);
  await page.evaluate(()=>window.__releaseSave());
  const replaced=await sessionVisible();
  assert.notEqual(replaced.id,snapshot().id);
  const writeOrder=await page.evaluate(()=>window.__sessionWrites);
  assert.equal(writeOrder[0],snapshot().id);
  assert.ok(writeOrder.slice(1).every(id=>id===replaced.id));
  await page.reload();await ready();await button('Resume session').click();
  assert.equal((await sessionVisible()).id,replaced.id);
  pass('Held earlier active-session save completes before replacement; no old autosave is enqueued during starting; final identity survives immediate reload',{writeOrder,durableIndexedDB:true,delay:'native IDB put success delivery held, keeping the older save promise pending'});

  for(const forceFallback of [false,true]){
  const fileContext=await browser.newContext({viewport:{width:1440,height:1000}});
  if(forceFallback) await fileContext.addInitScript(()=>Object.defineProperty(window,'indexedDB',{configurable:true,value:undefined}));
  const filePage=await fileContext.newPage();const fileErrors=[];filePage.on('pageerror',e=>fileErrors.push(e.message));
  await filePage.goto(`file://${process.cwd()}/dist/index.html`);
  const fileNav=name=>filePage.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name,exact:true});
  await fileNav('Library').click();await filePage.getByRole('combobox',{name:/^Topic/}).selectOption(f.mc.topic);
  await filePage.locator('.question-list > article.interactive-row').filter({has:filePage.getByRole('heading',{name:f.mc.stem.en,exact:true})}).click();
  await filePage.locator('.option-row:visible').first().click();await fileNav('Home').click();
  await filePage.getByRole('button',{name:'Study all questions',exact:true}).click();
  await filePage.getByRole('dialog').waitFor();await filePage.screenshot({path:`${out}/file-${forceFallback?'fallback':'native'}-dialog.png`});
  await filePage.getByRole('button',{name:'Start new set / 开始新练习',exact:true}).click();
  await filePage.locator('.session-shell').waitFor();await fileNav('Home').click();
  await filePage.getByRole('button',{name:'Resume session',exact:true}).click();await filePage.locator('.session-shell').waitFor();
  assert.deepEqual(fileErrors,[]);await fileContext.close();
  pass(`Production file:// launches, confirms replacement and resumes within runtime (${forceFallback?'forced memory fallback':'ordinary browser storage'})`,{forcedMemoryFallback:forceFallback,reloadDurabilityClaimed:false});
  }
  assert.deepEqual(errors,[]);
  writeFileSync(`${out}/browser-results.json`,JSON.stringify({browser:await browser.version(),productionUrl:baseUrl,viewports:[{width:1440,height:1000},{width:390,height:844}],probeEvidence,checks,errors},null,2)+'\n');
}catch(error){await shot('failure');console.error('PAGE',await page.locator('body').innerText().then(t=>t.slice(0,1000)));throw error;}
finally{await browser.close();}
