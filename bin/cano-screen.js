#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { buildCapturePlan } from '../src/plan.js';
import { assertNoInlineSecrets } from '../src/privacy.js';
import { runMockCapture } from '../src/mock-capture.js';
import { runLiveCapture } from '../src/live-capture.js';
import { createAuthorizedSession } from '../src/auth-session.js';
import { loadScreenConfig } from '../src/config.js';
import { runScreenSetup } from '../src/setup.js';
import { runScreenDoctor } from '../src/doctor.js';

const VERSION = '0.2.0';
const HELP = `CANO Screen Tutorial ${VERSION}

Usage:
  cano-screen init [--seed config.json] [--config config/screen.local.json]
  cano-screen doctor [--config file]
  cano-screen auth <login-url> <session-name> [--config file]
  cano-screen validate <request.json> [--config file]
  cano-screen plan <request.json> [--config file]
  cano-screen capture <request.json> [--mock|--live] [--config file]
  cano-screen --help | --version

Live mode opens only operator-authorized domains. Never place passwords or tokens in request files.`;

async function readJson(file) { return JSON.parse(await readFile(file, 'utf8')); }
function valueAfter(args, name, fallback = null) { const index = args.indexOf(name); return index >= 0 ? (args[index + 1] ?? fallback) : fallback; }

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  if (!cmd || ['help', '--help', '-h'].includes(cmd)) { console.log(HELP); return; }
  if (['version', '--version', '-v'].includes(cmd)) { console.log(VERSION); return; }
  const configFile = valueAfter(args, '--config', 'config/screen.local.json');

  if (cmd === 'init') {
    const result = await runScreenSetup({ seedFile: valueAfter(args, '--seed'), outputFile: configFile });
    console.log(JSON.stringify({ status: 'CONFIGURED', ...result }, null, 2));
    return;
  }
  if (cmd === 'doctor') {
    console.log(JSON.stringify(await runScreenDoctor({ configFile }), null, 2));
    return;
  }

  const { config } = await loadScreenConfig(configFile);
  if (cmd === 'auth') {
    const url = args[1];
    const name = args[2] ?? 'default';
    if (!url) throw new Error('usage: cano-screen auth <login-url> <session-name>');
    const result = await createAuthorizedSession({ url, name, runtimeDir: config.runtimeDir });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const file = args[1];
  if (!file) throw new Error('request file is required. Run cano-screen --help');
  const request = await readJson(file);
  const plan = buildCapturePlan(request, config);
  assertNoInlineSecrets(plan);
  if (cmd === 'validate') { console.log(JSON.stringify({ ok: true, projectId: plan.projectId, version: plan.version }, null, 2)); return; }
  if (cmd === 'plan') { console.log(JSON.stringify(plan, null, 2)); return; }
  if (cmd === 'capture') {
    const out = path.resolve(config.runtimeDir, 'jobs', plan.projectId, 'screen');
    const result = args.includes('--live') ? await runLiveCapture(plan, out) : await runMockCapture(plan, out);
    console.log(JSON.stringify({ ...result, outDir: out }, null, 2));
    return;
  }
  throw new Error(`unknown command: ${cmd}`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
