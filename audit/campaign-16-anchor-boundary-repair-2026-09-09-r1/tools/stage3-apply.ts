/** Sequential R4 schema-bump -> one P15 patch per bank, with a checked byte hash chain. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, basename } from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
const root=resolve(import.meta.dirname,'..');const repo=resolve(root,'../..');
const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
const read=(n:string)=>JSON.parse(readFileSync(resolve(root,n),'utf8'));
const write=(n:string,v:unknown)=>writeFileSync(resolve(root,n),JSON.stringify(v,null,2)+'\n');
assert.equal(process.argv.length,2,'No command-line variants');
assert(!existsSync(resolve(root,'schema-floor-receipts.json')),'Cannot repeat completed/partial stage3');
assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),read('opening-state.json').head);
assert.equal(execFileSync('git',['branch','--show-current'],{cwd:repo,encoding:'utf8'}).trim(),'main');
const resume=read('evidence/post-freeze-resume-preservation.json');
for(const [p,h] of Object.entries({...read('evidence/opening-tracked-files.json'),...resume.existingCommissionFiles,...resume.unrelatedUntrackedFiles}))assert.equal(hash(resolve(repo,p)),h,p);
for(const [p,h] of Object.entries(resume.pins))assert.equal(hash(resolve(repo,p)),h,p);
assert.equal(hash(resolve(repo,execFileSync('git',['rev-parse','--git-path','index'],{encoding:'utf8'}).trim())),resume.indexSha256);
for(const f of ['comparison-freeze.json','stage3-plan-freeze.json'])for(const [p,h] of Object.entries(read(f).artifacts))assert.equal(hash(resolve(root,p)),h,p);
const floor=read('schema-floor-plan.json'); const patchPlan=read('patch-plan.json');
const self=read('evidence/schema-floor-self-test.json');assert.equal(self.status,'PASS');assert.equal(self.toolSha256,hash(resolve(root,'tools/bump-schema-floor.ts')));
assert.equal(read('evidence/post-freeze-verifier-self-test.json').ok,true);
const accepted=readFileSync(resolve(root,'accepted-boundaries.jsonl'),'utf8').trim().split('\n').map(x=>JSON.parse(x));
const bumpReceipts:any[]=[];const patchReceipts:any[]=[];
for(const b of floor.banks){
 const p=patchPlan.patches.find((p:any)=>p.bankPath===b.bankPath);const file=resolve(repo,b.bankPath);
 assert.equal(hash(file),b.openingSha256);
 const before=JSON.parse(readFileSync(file,'utf8')); const expected=structuredClone(before);
 if(b.bumpAuthorized)expected.meta.schemaVersion=b.after;
 const afterBumpHash=digest(JSON.stringify(expected,null,2)+'\n');
 for(const r of accepted.filter(r=>r.bankPath===b.bankPath)){
  const parents=expected.questions.filter((q:any)=>q.id===r.parentCaseId);assert.equal(parents.length,1);
  const parts=parents[0].caseStudy.questions.filter((q:any)=>q.id===r.partId);assert.equal(parts.length,1);
  assert(!Object.hasOwn(parts[0],'answerableAfterStageId'));assert(!Object.hasOwn(parts[0],'stageId'));
  parts[0].answerableAfterStageId=r.acceptedBoundary;
 }
 const expectedFinalSha256=digest(JSON.stringify(expected,null,2)+'\n');
 if(b.bumpAuthorized){
  const out=spawnSync('npx',['tsx',resolve(root,'tools/bump-schema-floor.ts'),'--bank',b.bankPath],{cwd:repo,encoding:'utf8',maxBuffer:30*1024*1024});
  writeFileSync(resolve(root,'evidence/'+basename(b.bankPath,'.json')+'-schema-floor.log'),out.stdout+out.stderr,{flag:'wx'});
  assert.equal(out.status,0,'SCHEMA_FLOOR_TOOL_FAILED');
  const receipt=JSON.parse(out.stdout);assert.equal(receipt.afterSha256,afterBumpHash);bumpReceipts.push(receipt);
  write('schema-floor-receipts.json',{status:'IN_PROGRESS',receipts:bumpReceipts});
 }
 assert.equal(hash(file),afterBumpHash);assert.equal(hash(resolve(root,p.patchPath)),p.patchSha256);
 const args=['tsx',resolve(root,p.patchPath),'--in',b.bankPath,'--out',b.bankPath,'--allow-canonical','--reason','Campaign 16 R4 E.1 frozen producer/checker exact agreement; see commission comparison and BANK-REVIEW-LEDGER.md','--strict-parity'];
 const out=spawnSync('npx',args,{cwd:repo,encoding:'utf8',maxBuffer:30*1024*1024});
 const log='evidence/'+basename(b.bankPath,'.json')+'-p15.log';writeFileSync(resolve(root,log),out.stdout+out.stderr,{flag:'wx'});
 assert.equal(out.status,0,'P15_PATCH_FAILED');assert.equal(hash(file),expectedFinalSha256,'P15_FINAL_HASH_NOT_PREDICTED');
 patchReceipts.push({bankPath:b.bankPath,command:['npx',...args],exitCode:out.status,patchSha256:p.patchSha256,operationCount:p.operationCount,beforeSha256:afterBumpHash,expectedFinalSha256,finalSha256:hash(file),log,logSha256:hash(resolve(root,log)),hashChainPassed:true,appliedAt:new Date().toISOString()});
 write('patch-application-receipts.json',{status:'IN_PROGRESS',receipts:patchReceipts});
 console.log(`${b.bankPath}: exact schema bump and ${p.operationCount} P15 operations passed`);
}
write('schema-floor-receipts.json',{status:'PASS',receipts:bumpReceipts});write('patch-application-receipts.json',{status:'PASS',receipts:patchReceipts});
