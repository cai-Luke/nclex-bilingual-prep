import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderBurnMapSvg } from '../../src/visuals/kinds/burn_map/index.ts';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '/Users/holemini/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const out = process.env.BURN_MAP_EVIDENCE || 'audit/burn-map-integration-2026-09-13';
mkdirSync(out, {recursive: true});
const base = process.env.BURN_MAP_URL || 'http://127.0.0.1:4196/';
const qid = 'gpt_visual_smoke_2026_06_12_fib_burn_parkland_rate_01';
const bank = JSON.parse(readFileSync('banks/gpt-canonical.json', 'utf8'));
const question = bank.questions.find(q => q.id === qid);
assert(question?.visual?.kind === 'burn_map');
const expected = renderBurnMapSvg(question.visual);
const browser = await chromium.launch({channel:'chrome',headless:true});
const checks = [];
const errors = [];
async function inspect(label, url, viewport) {
  const context = await browser.newContext({viewport,deviceScaleFactor:1,colorScheme:'light'});
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror',error=>errors.push({label,error:error.message}));
  try {
    await page.goto(url + (url.includes('?')?'&':'?') + 'dev=1');
    await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Settings',exact:true}).click();
    await page.getByRole('button',{name:'Open Preview Lab',exact:true}).click();
    await page.locator('.preview-controls select').nth(0).selectOption('split-burn_map');
    await page.locator('.preview-controls select').nth(1).selectOption(qid);
    const svg = page.locator('svg[data-kind="burn_map"]');
    await svg.waitFor();
    async function verify(mode) {
      assert.equal(await svg.count(),1);
      const proof = await svg.evaluate((actual, source) => {
        const approved = new DOMParser().parseFromString(source,'image/svg+xml').documentElement;
        const paths = element => [...element.querySelectorAll('[data-region]')].map(n => ({key:n.getAttribute('data-region'),d:n.getAttribute('d'),fill:n.getAttribute('fill')}));
        const b=actual.getBoundingClientRect();
        return {viewBox:actual.getAttribute('viewBox'),paths:paths(actual),expectedPaths:paths(approved),width:b.width,height:b.height,overflow:document.documentElement.scrollWidth>window.innerWidth+1};
      },expected);
      assert.equal(proof.viewBox,'0 0 800 600');
      assert.equal(proof.paths.length,13);
      assert.deepEqual(proof.paths,proof.expectedPaths);
      assert(Math.abs(proof.height/proof.width-.75)<.001);
      if(viewport.width>=1000)assert.equal(proof.overflow,false);
      checks.push({label,mode,width:proof.width,height:proof.height,pathsMatchApproved:true,documentOverflow:proof.overflow});
    }
    await verify('ordinary');
    await page.locator('.preview-canvas').screenshot({path:`${out}/${label}.png`});
    const trigger=page.getByRole('button',{name:'Enlarge visual / 放大图像',exact:true});
    await trigger.click();
    await page.locator('dialog.visual-focus-dialog[open]').waitFor();
    await verify('expanded');
    await page.locator('dialog.visual-focus-dialog').screenshot({path:`${out}/${label}-expanded.png`});
    // Existing focus mode deliberately scrolls at readable minimum sizes.
    const scrollProof = await page.locator('dialog.visual-focus-dialog').evaluate(dialog => {
      const body = dialog.querySelector('.visual-focus-body');
      const chart = dialog.querySelector('.rhythm-strip-svg');
      body.scrollTop = body.scrollHeight;
      chart.scrollLeft = chart.scrollWidth;
      return {
        verticalEndReached: Math.abs(body.scrollTop + body.clientHeight - body.scrollHeight) <= 1,
        horizontalEndReached: Math.abs(chart.scrollLeft + chart.clientWidth - chart.scrollWidth) <= 1,
      };
    });
    assert.equal(scrollProof.verticalEndReached,true);
    assert.equal(scrollProof.horizontalEndReached,true);
    checks.push({label,mode:'expanded-scroll',...scrollProof});
    await page.locator('dialog.visual-focus-dialog').screenshot({path:`${out}/${label}-expanded-scrolled.png`});
    await page.keyboard.press('Escape');
    await page.locator('dialog.visual-focus-dialog').waitFor({state:'detached'});
    await verify('restored');
    await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Enlarge visual / 放大图像');
    console.log('PASS',label);
  } catch(error) {
    await page.screenshot({path:`${out}/${label}-failure.png`,fullPage:true});
    throw error;
  } finally {await context.close();}
}
try {
  await inspect('desktop',base,{width:1440,height:1050});
  await inspect('mobile',base,{width:390,height:844});
  if(process.env.BURN_MAP_SKIP_FILE!=='1')await inspect('file',pathToFileURL(resolve('dist/index.html')).href,{width:1280,height:950});
  assert.deepEqual(errors,[]);
  writeFileSync(`${out}/browser-results.json`,JSON.stringify({checks,errors},null,2)+'\n');
} finally {await browser.close();}
