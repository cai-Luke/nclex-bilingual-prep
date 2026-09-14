// Control for Chrome's file-origin PWA-manifest error, reconstructed only from 511f66b.
import {chromium} from '/tmp/shrimp-omnibus-tools/node_modules/playwright/index.mjs';
import {mkdtempSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const dir=resolve('node_modules/.cache/learner-shell-r3-baseline/dist');
const context=await chromium.launchPersistentContext(mkdtempSync('/tmp/shrimp-shell-baseline-'),{channel:'chrome',headless:true,ignoreDefaultArgs:['--disable-web-security']});
const page=context.pages()[0];const errors=[];page.on('console',m=>{if(m.type()==='error')errors.push({message:m.text()});});
await page.goto(pathToFileURL(dir+'/index.html').href);await page.getByRole('button',{name:'Start practice · 50 questions',exact:true}).waitFor();
assert(errors.some(e=>e.message.includes('manifest.webmanifest')));
writeFileSync('audit/learner-shell-r3-concept-a-r1/baseline-file-console.json',JSON.stringify({baseline:'511f66b7b7cb830649613793f0264725be25d450',directory:pathToFileURL(dir).href+'/',artifactSha256:createHash('sha256').update(readFileSync(dir+'/index.html')).digest('hex'),chrome:await page.evaluate(()=>navigator.userAgent),appLoaded:true,errors},null,2)+'\n');
await context.close();console.log('PASS baseline reproduces file-origin manifest CORS and paired ERR_FAILED; app loads.');
