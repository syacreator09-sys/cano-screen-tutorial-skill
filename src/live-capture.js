import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
export async function runLiveCapture(plan, outDir) {
  let chromium;
  try { ({ chromium } = await import('playwright')); } catch { throw new Error('playwright is not installed. Run npm install and npx playwright install chromium'); }
  await mkdir(outDir,{recursive:true});
  const browser = await chromium.launch({headless:true});
  const context = await browser.newContext({viewport:plan.viewport, recordVideo:{dir:path.join(outDir,'video'),size:plan.viewport}, storageState:plan.storageStatePath ?? undefined});
  await context.tracing.start({screenshots:true,snapshots:true,sources:true});
  const page = await context.newPage();
  const logged=[];
  try {
    for (const action of plan.actions) {
      const started=Date.now();
      if (action.type==='goto') await page.goto(action.url ?? plan.url,{waitUntil:'domcontentloaded',timeout:action.timeoutMs});
      if (action.type==='click') await page.locator(action.selector).click({timeout:action.timeoutMs});
      if (action.type==='fill') await page.locator(action.selector).fill(action.value,{timeout:action.timeoutMs});
      if (action.type==='press') await page.locator(action.selector).press(action.value ?? 'Enter',{timeout:action.timeoutMs});
      if (action.type==='waitFor') await page.locator(action.selector).waitFor({state:'visible',timeout:action.timeoutMs});
      if (action.type==='screenshot') await page.screenshot({path:path.join(outDir,`${action.id}.png`),fullPage:false});
      logged.push({...action,startMs:started,endMs:Date.now(),status:'ok',value:action.redact?'[REDACTED]':action.value});
    }
    await context.tracing.stop({path:path.join(outDir,'trace.zip')});
    await writeFile(path.join(outDir,'actions.json'),JSON.stringify({projectId:plan.projectId,actions:logged},null,2));
    const manifest={version:'1.0',projectId:plan.projectId,mode:'live',status:'CAPTURED',actionsFile:'actions.json',trace:'trace.zip'};
    await writeFile(path.join(outDir,'capture-manifest.json'),JSON.stringify(manifest,null,2));
    return manifest;
  } finally { await context.close(); await browser.close(); }
}
