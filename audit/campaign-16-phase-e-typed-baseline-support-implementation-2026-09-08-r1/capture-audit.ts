import {runAuditStageRefs,findStageReferenceFindings} from '../../scripts/audit/audit-stage-refs';
import fs from 'node:fs';
const banks=fs.readdirSync('banks').filter(f=>f.endsWith('.json')).sort().map(file=>({file,bank:JSON.parse(fs.readFileSync('banks/'+file,'utf8'))}));
const findings=findStageReferenceFindings(banks);
fs.writeFileSync(new URL(`./${process.argv[2] ?? 'opening'}-stage-reference-audit.json`,import.meta.url),JSON.stringify({result:await runAuditStageRefs(),findings},null,2)+'\n');
console.log('Captured findings:',findings.length);
