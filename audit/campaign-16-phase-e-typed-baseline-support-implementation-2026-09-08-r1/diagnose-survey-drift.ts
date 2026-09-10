import { buildSingleRowLabPanelsSurvey, serializeSingleRowLabPanelsSurvey, OUTPUT_PATH } from '../../scripts/single-row-lab-panels-survey';
import { readFile, writeFile } from 'node:fs/promises';
const current=await buildSingleRowLabPanelsSurvey();
const expected=JSON.parse(await readFile(OUTPUT_PATH,'utf8'));
const diffs: Array<{path:string;expected:unknown;actual:unknown}>=[];
function walk(a:any,b:any,path:string){
 if(JSON.stringify(a)===JSON.stringify(b))return;
 if(a!==null&&b!==null&&typeof a==='object'&&typeof b==='object'){
  for(const k of [...new Set([...Object.keys(a),...Object.keys(b)])].sort())walk(a[k],b[k],path+'/'+k);
 }else diffs.push({path,expected:a,actual:b});
}
walk(expected,current,'');
await writeFile(new URL('./survey-current-diagnostic.json',import.meta.url),serializeSingleRowLabPanelsSurvey(current));
await writeFile(new URL('./survey-drift-diagnostic.json',import.meta.url),JSON.stringify({reference:OUTPUT_PATH,differenceCount:diffs.length,differences:diffs},null,2)+'\n');
console.log(JSON.stringify({differenceCount:diffs.length,firstDifferences:diffs.slice(0,10)},null,2));
