import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export async function createAuthorizedSession({ url, name, runtimeDir = '.runtime' }) {
  let chromium;
  try { ({ chromium } = await import('playwright')); }
  catch { throw new Error('playwright is not installed. Run npm install and npx playwright install chromium'); }
  if (!/^https?:\/\//.test(url)) throw new Error('auth URL must use http(s)');
  if (!/^[a-z0-9][a-z0-9-]{1,63}$/.test(name)) throw new Error('session name must be kebab-case');
  const sessionsDir = path.resolve(runtimeDir, 'sessions');
  await mkdir(sessionsDir, { recursive: true });
  const statePath = path.join(sessionsDir, `${name}.json`);
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const rl = readline.createInterface({ input, output });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await rl.question('Completa el inicio de sesión en el navegador y presiona Enter aquí. ');
    await context.storageState({ path: statePath });
    return { status: 'AUTHORIZED', statePath };
  } finally {
    rl.close();
    await context.close();
    await browser.close();
  }
}
