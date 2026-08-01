#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { buildCapturePlan } from '../src/plan.js';
import { assertNoInlineSecrets } from '../src/privacy.js';
import { runMockCapture } from '../src/mock-capture.js';
import { runLiveCapture } from '../src/live-capture.js';
async function readJson(file){return JSON.parse(await readFile(file,'utf8'));}
async function main(){
 const [cmd,file,...flags]=process.argv.slice(2);
 if(cmd==='doctor') { let has=false; try{await import('playwright');has=true}catch{}; console.log(JSON.stringify({node:process.version,platform:process.platform,playwright:has,runtime:path.resolve('.runtime')},null,2)); return; }
 if(!file) throw new Error('usage: cano-screen <validate|plan|capture> request.json [--mock|--live]');
 const request=await readJson(file); const plan=buildCapturePlan(request); assertNoInlineSecrets(plan);
 if(cmd==='validate'){console.log(JSON.stringify({ok:true,projectId:plan.projectId},null,2));return;}
 if(cmd==='plan'){console.log(JSON.stringify(plan,null,2));return;}
 if(cmd==='capture'){const out=path.resolve('.runtime','jobs',plan.projectId,'screen'); const result=flags.includes('--live')?await runLiveCapture(plan,out):await runMockCapture(plan,out); console.log(JSON.stringify({...result,outDir:out},null,2));return;}
 throw new Error(`unknown command: ${cmd}`);
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
