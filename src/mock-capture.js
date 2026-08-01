import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
export async function runMockCapture(plan, outDir) {
  await mkdir(outDir, { recursive: true });
  const actions = plan.actions.map((a, i) => ({...a, startMs:i*900, endMs:(i+1)*900, status:'mocked'}));
  const manifest = {version:'1.0', projectId:plan.projectId, mode:'mock', viewport:plan.viewport, durationMs:actions.length*900, assets:{video:null, trace:null, screenshots:[]}, actionsFile:'actions.json', status:'CAPTURED'};
  await writeFile(path.join(outDir,'actions.json'), JSON.stringify({projectId:plan.projectId, actions},null,2));
  await writeFile(path.join(outDir,'capture-manifest.json'), JSON.stringify(manifest,null,2));
  return manifest;
}
