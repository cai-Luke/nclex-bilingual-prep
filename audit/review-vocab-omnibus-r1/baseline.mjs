import { chromium } from '/tmp/shrimp-omnibus-tools/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const q=JSON.parse(readFileSync('banks/burn-canonical.json')).questions.find(q=>q.itemType==='multiple_choice');
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
await page.addInitScript(()=>{
  const get=IDBObjectStore.prototype.get;
  IDBObjectStore.prototype.get=function(...args){
    const req=get.apply(this,args);
    if(this.name==='progress'){
      const add=req.addEventListener.bind(req);
      req.addEventListener=(type,listener,options)=>add(type,type==='success'?e=>setTimeout(()=>listener.call(req,e),300):listener,options);
    }
    return req;
  };
});
await page.goto('http://127.0.0.1:4181');
await page.getByRole('button',{name:'Start practice · 50 questions',exact:true}).waitFor();
await page.evaluate(async(q)=>{
  localStorage.setItem('nclex-settings',JSON.stringify({languageMode:'on-tap'}));
  const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('nclex-bilingual-prep');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  const tx=db.transaction(['activeSession','progress','answerEvents'],'readwrite');
  tx.objectStore('progress').clear();tx.objectStore('answerEvents').clear();
  tx.objectStore('activeSession').put({id:'baseline-race',mode:'study',questionIds:[q.id],poolIds:[q.id],index:0,answers:{},results:{},scores:{},skippedQuestionIds:[],phase:'questions',languageMode:'on-tap',title:'Baseline race',startedAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
  await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=reject;});db.close();
},q);
await page.reload();await page.getByRole('button',{name:'Resume session',exact:true}).click();
await page.locator('.option-row').first().click();
await page.getByRole('button',{name:'Submit answer',exact:true}).evaluate(el=>{el.click();el.click();});
await page.locator('.answer-banner').waitFor();
await page.waitForTimeout(600);
const observed=await page.evaluate(async()=>{
 const db=await new Promise(resolve=>{const r=indexedDB.open('nclex-bilingual-prep');r.onsuccess=()=>resolve(r.result);});
 const rows=await Promise.all(['answerEvents','progress'].map(name=>new Promise(resolve=>{const r=db.transaction(name).objectStore(name).getAll();r.onsuccess=()=>resolve(r.result);})));db.close();return {events:rows[0],progress:rows[1]};
});
assert.equal(observed.events.length,2,'baseline duplicate answerEvents reproduced');
await page.getByRole('button',{name:'Finish',exact:true}).click();
await page.getByRole('button',{name:'All answered',exact:true}).click();
const collapsedChinese=await page.locator('.summary-review-toggle .chinese-line').count();
assert.equal(collapsedChinese,1);
await page.screenshot({path:'audit/review-vocab-omnibus-r1/baseline-summary.png'});
writeFileSync('audit/review-vocab-omnibus-r1/baseline.json',JSON.stringify({source:'bb29bff',delayedProgressReadMs:300,...observed,collapsedChinese},null,2));
console.log(JSON.stringify({eventCount:observed.events.length,seen:observed.progress[0].seen,collapsedChinese}));
await browser.close();
