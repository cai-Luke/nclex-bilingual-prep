import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const repo = process.cwd();
const source = await readFile('src/App.tsx','utf8');
const entry = `
import { createRoot } from 'react-dom/client';
import { typedBaselineCase } from '../scripts/tests/typed-baseline-fixture';
import { defaultSettings } from './storage';
createRoot(document.getElementById('root')).render(<PreviewLab records={[{question:typedBaselineCase(),sourceKind:'uploaded',sourceLabel:'Synthetic commission fixture'}]} settings={defaultSettings} onBack={()=>{}}/>);
`;
await build({stdin:{contents:source+entry,loader:'tsx',resolveDir:resolve(repo,'src'),sourcefile:'App.tsx'},outfile:resolve(import.meta.dirname,'typed-ui.js'),bundle:true,format:'iife',platform:'browser',jsx:'automatic',define:{'import.meta.glob':'__typedBaselineGlob','import.meta.env':'{}'},banner:{js:'const __typedBaselineGlob=()=>({});'},logLevel:'silent'});
await writeFile(new URL('./typed-ui.html',import.meta.url),'<html><head><meta charset="UTF-8"><title>Campaign 16 synthetic UI fixture</title><link rel="stylesheet" href="../../src/styles.css"></head><body><div id="root"></div><script src="./typed-ui.js"></script></body></html>');
