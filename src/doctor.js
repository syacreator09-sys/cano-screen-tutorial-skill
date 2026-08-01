import { access, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { loadScreenConfig } from './config.js';

const require = createRequire(import.meta.url);

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

export async function runScreenDoctor({ configFile = 'config/screen.local.json' } = {}) {
  const { config, file, exists: configExists } = await loadScreenConfig(configFile);
  await mkdir(config.runtimeDir, { recursive: true });
  let playwrightVersion = null;
  let chromiumExecutable = null;
  let chromiumInstalled = false;
  try {
    playwrightVersion = require('playwright/package.json').version;
    const { chromium } = await import('playwright');
    chromiumExecutable = chromium.executablePath();
    chromiumInstalled = await exists(chromiumExecutable);
  } catch {}
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  return {
    ok: nodeMajor >= 20 && Boolean(playwrightVersion) && chromiumInstalled,
    node: process.version,
    nodeSupported: nodeMajor >= 20,
    platform: process.platform,
    arch: process.arch,
    configFile: file,
    configExists,
    runtimeDir: path.resolve(config.runtimeDir),
    playwrightVersion,
    chromiumInstalled,
    chromiumExecutable: chromiumExecutable || null,
    nextSteps: [
      ...(!configExists ? ['Run: cano-screen init'] : []),
      ...(!playwrightVersion ? ['Run: npm install'] : []),
      ...(playwrightVersion && !chromiumInstalled ? ['Run: npx playwright install chromium'] : [])
    ]
  };
}
