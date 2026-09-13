import fs from 'node:fs';
import { validateBankObject } from '../../../src/schema';
const root='audit/campaign-17-ab-followthrough-2026-09-13-r1';
const parents=fs.readdirSync(root+'/after').map(f=>JSON.parse(fs.readFileSync(root+'/after/'+f,'utf8')));
const result=validateBankObject({meta:{schemaVersion:'2.1'},questions:parents},{requireMeta:true,rejectUnknownKeys:true});
console.log(JSON.stringify(result.ok?{ok:true,parents:parents.length}:result,null,2));process.exit(result.ok?0:1);
