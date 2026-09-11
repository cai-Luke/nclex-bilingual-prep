/** Exact R4 bank-envelope mutation. No question mutation and no generic metadata API. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, renameSync, unlinkSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { schemaVersionAtLeast, validateBankObject } from '../../../src/schema';
import { typedBaselineBank } from '../../../scripts/tests/typed-baseline-fixture';
const root=resolve(import.meta.dirname,'..'); const repo=resolve(root,'../..');
const sha=(text:string|Buffer)=>createHash('sha256').update(text).digest('hex');
const hash=(path:string)=>sha(readFileSync(path));
const read=(name:string)=>JSON.parse(readFileSync(resolve(root,name),'utf8'));
type Approval={bankPath:string;openingSha256:string;before:any;after:any;bumpAuthorized:boolean;acceptedBaseline:number};
function prepare(text:string,a:Approval){
 assert(a.bumpAuthorized&&a.acceptedBaseline>0,'NO_BASELINE_BUMP_AUTHORITY');
 assert.equal(a.after,'2.1','EXACT_TARGET_ONLY');
 assert(!schemaVersionAtLeast(a.before,'2.1'),'OPENING_MUST_BE_BELOW_FLOOR');
 assert.equal(sha(text),a.openingSha256,'OPENING_HASH_PRECONDITION');
 const before=JSON.parse(text); assert.equal(before.meta.schemaVersion,a.before,'OPENING_VALUE_PRECONDITION');
 assert(validateBankObject(before,{requireMeta:true,rejectUnknownKeys:true}).ok,'OPENING_SCHEMA');
 const after=structuredClone(before); after.meta.schemaVersion=a.after;
 const validation=validateBankObject(after,{requireMeta:true,rejectUnknownKeys:true}); assert(validation.ok,'AFTER_SCHEMA');
 const restored=structuredClone(after); restored.meta.schemaVersion=a.before; assert.deepEqual(restored,before,'EXACT_ONE_FIELD_PROOF');
 const serialized=JSON.stringify(after,null,2)+'\n'; assert.deepEqual(JSON.parse(serialized),after,'SERIALIZER_ROUND_TRIP');
 return {serialized,before,after};
}
function atomic(path:string,text:string,a:Approval){
 const prepared=prepare(text,a); const temp=path+'.r4-schema-floor.tmp';
 assert(!existsSync(temp),'TEMP_MUST_NOT_EXIST');
 try {
  writeFileSync(temp,prepared.serialized,{flag:'wx'});
  const disk=JSON.parse(readFileSync(temp,'utf8'));
  assert(validateBankObject(disk,{requireMeta:true,rejectUnknownKeys:true}).ok,'DISK_SCHEMA');
  const restored=structuredClone(disk);restored.meta.schemaVersion=a.before;assert.deepEqual(restored,prepared.before,'DISK_EXACT_ONE_FIELD_PROOF');
  assert.equal(hash(path),a.openingSha256,'PRE_RENAME_HASH_PRECONDITION');
  renameSync(temp,path);
 } catch(error){if(existsSync(temp))unlinkSync(temp);throw error;}
 assert.equal(hash(path),sha(prepared.serialized));
 return {bankPath:a.bankPath,before:a.before,after:a.after,beforeSha256:a.openingSha256,afterSha256:hash(path),parsedObjectDeepEqualAfterVersionRestore:true,metaCountUnchanged:prepared.before.meta.count===prepared.after.meta.count,validatedBeforeAfterAndDisk:true,atomicTempRename:true};
}
function selfTest(){
 const tests:string[]=[];
 const bank=typedBaselineBank('2.0');for(const q of (bank.questions[0] as any).caseStudy.questions)delete q.answerableAfterStageId;
 const text=JSON.stringify(bank);const approval:Approval={bankPath:'synthetic.json',openingSha256:sha(text),before:'2.0',after:'2.1',bumpAuthorized:true,acceptedBaseline:1};
 const test=(n:string,fn:()=>void)=>{fn();tests.push(n)};
 test('one-field proof preserves complete object and meta.count',()=>{const p=prepare(text,approval);p.after.meta.schemaVersion='2.0';assert.deepEqual(p.after,bank)});
 for(const [name,edit] of [
  ['no baseline',(a:Approval)=>a.acceptedBaseline=0],['no authorization',(a:Approval)=>a.bumpAuthorized=false],
  ['wrong target',(a:Approval)=>a.after='2.0'],['wrong opening value',(a:Approval)=>a.before='1.8'],
  ['wrong hash',(a:Approval)=>a.openingSha256='0'.repeat(64)],['already floor',(a:Approval)=>a.before='2.1']
 ] as const)test('reject '+name,()=>{const a={...approval};edit(a);assert.throws(()=>prepare(text,a))});
 test('reject schema-invalid source even with matching hash',()=>{const invalid={...bank,unexpected:true};const s=JSON.stringify(invalid);assert.throws(()=>prepare(s,{...approval,openingSha256:sha(s)}))});
 const dir=mkdtempSync(join(tmpdir(),'r4-schema-floor-self-test-'));
 try{
  const path=join(dir,'bank.json');writeFileSync(path,text);
  test('atomic valid write, disk proof, no leftover temp',()=>{const receipt=atomic(path,text,approval);assert(receipt.parsedObjectDeepEqualAfterVersionRestore);assert(!existsSync(path+'.r4-schema-floor.tmp'))});
  test('repeated bump refused and bytes unchanged',()=>{const before=readFileSync(path);assert.throws(()=>atomic(path,readFileSync(path,'utf8'),approval));assert.deepEqual(readFileSync(path),before)});
  writeFileSync(path,text);writeFileSync(path+'.r4-schema-floor.tmp','occupied');
  test('existing temp fails closed without overwriting it or bank',()=>{assert.throws(()=>atomic(path,text,approval));assert.equal(readFileSync(path,'utf8'),text);assert.equal(readFileSync(path+'.r4-schema-floor.tmp','utf8'),'occupied')});
  unlinkSync(path+'.r4-schema-floor.tmp');writeFileSync(path,text+' ');
  test('concurrent bank drift detected before rename',()=>{assert.throws(()=>atomic(path,text,approval));assert.equal(readFileSync(path,'utf8'),text+' ');assert(!existsSync(path+'.r4-schema-floor.tmp'))});
 }finally{rmSync(dir,{recursive:true,force:true})}
 return {status:'PASS',mode:'SELF_TEST_SYNTHETIC_TEMP_ONLY',count:tests.length,tests,toolSha256:hash(import.meta.filename)};
}
function main(args:string[]){
 if(args.length===1&&args[0]==='--self-test')return selfTest();
 assert(args.length===2&&args[0]==='--bank','Use only --self-test OR --bank <one exact planned bank>');
 const bankPath=args[1];
 const planFreeze=read('stage3-plan-freeze.json');for(const [n,h] of Object.entries(planFreeze.artifacts))assert.equal(hash(resolve(root,n)),h);
 const comparisonFreeze=read('comparison-freeze.json');for(const [n,h] of Object.entries(comparisonFreeze.artifacts))assert.equal(hash(resolve(root,n)),h);
 const comparison=read('comparison.json');for(const [p,h] of Object.entries(comparison.inputPins))assert.equal(hash(resolve(repo,p)),h);
 const self=read('evidence/schema-floor-self-test.json');assert.equal(self.status,'PASS');assert.equal(self.toolSha256,hash(import.meta.filename),'SELF_TEST_MUST_BIND_THIS_TOOL');
 const approvals=read('schema-floor-plan.json').banks.filter((a:Approval)=>a.bankPath===bankPath);assert.equal(approvals.length,1,'EXACT_APPROVED_BANK_ONLY');
 const a:Approval=approvals[0];const path=resolve(repo,bankPath);
 return {status:'PASS',appliedAt:new Date().toISOString(),...atomic(path,readFileSync(path,'utf8'),a),toolSha256:hash(import.meta.filename),planSha256:hash(resolve(root,'schema-floor-plan.json')),selfTestSha256:hash(resolve(root,'evidence/schema-floor-self-test.json'))};
}
try{console.log(JSON.stringify(main(process.argv.slice(2)),null,2))}catch(e){console.error(e);process.exitCode=1}
