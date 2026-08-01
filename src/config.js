import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const DEFAULT_SCREEN_CONFIG = Object.freeze({
  version: '1.0',
  runtimeDir: '.runtime',
  headless: true,
  recordVideo: true,
  trace: true,
  viewport: { width: 1440, height: 900 },
  allowedDomains: [],
  redactions: [
    'input[type=password]',
    'input[autocomplete="current-password"]',
    'input[autocomplete="one-time-code"]',
    '[data-private]',
    '[data-sensitive]'
  ],
  actionDefaults: { timeoutMs: 30000, typingDelayMs: 35 }
});

function asBoolean(value, fallback) {
  return typeof value === 'boolean' ? value : fallback;
}

export function normalizeScreenConfig(input = {}) {
  const viewport = input.viewport ?? DEFAULT_SCREEN_CONFIG.viewport;
  const actionDefaults = input.actionDefaults ?? DEFAULT_SCREEN_CONFIG.actionDefaults;
  return {
    version: '1.0',
    runtimeDir: typeof input.runtimeDir === 'string' && input.runtimeDir.trim() ? input.runtimeDir : DEFAULT_SCREEN_CONFIG.runtimeDir,
    headless: asBoolean(input.headless, DEFAULT_SCREEN_CONFIG.headless),
    recordVideo: asBoolean(input.recordVideo, DEFAULT_SCREEN_CONFIG.recordVideo),
    trace: asBoolean(input.trace, DEFAULT_SCREEN_CONFIG.trace),
    viewport: {
      width: Number(viewport.width) || DEFAULT_SCREEN_CONFIG.viewport.width,
      height: Number(viewport.height) || DEFAULT_SCREEN_CONFIG.viewport.height
    },
    allowedDomains: Array.isArray(input.allowedDomains) ? [...new Set(input.allowedDomains.map(String).map((v) => v.trim().toLowerCase()).filter(Boolean))] : [],
    redactions: Array.isArray(input.redactions) ? [...new Set([...DEFAULT_SCREEN_CONFIG.redactions, ...input.redactions.map(String).map((v) => v.trim()).filter(Boolean)])] : [...DEFAULT_SCREEN_CONFIG.redactions],
    actionDefaults: {
      timeoutMs: Number(actionDefaults.timeoutMs) || DEFAULT_SCREEN_CONFIG.actionDefaults.timeoutMs,
      typingDelayMs: Number(actionDefaults.typingDelayMs) || DEFAULT_SCREEN_CONFIG.actionDefaults.typingDelayMs
    }
  };
}

export function validateScreenConfig(config) {
  const errors = [];
  if (!config || typeof config !== 'object' || Array.isArray(config)) errors.push('config must be an object');
  if (!(Number(config?.viewport?.width) >= 320 && Number(config?.viewport?.width) <= 3840)) errors.push('viewport.width must be 320-3840');
  if (!(Number(config?.viewport?.height) >= 480 && Number(config?.viewport?.height) <= 2160)) errors.push('viewport.height must be 480-2160');
  if (!(Number(config?.actionDefaults?.timeoutMs) >= 100 && Number(config?.actionDefaults?.timeoutMs) <= 120000)) errors.push('actionDefaults.timeoutMs must be 100-120000');
  if (!(Number(config?.actionDefaults?.typingDelayMs) >= 0 && Number(config?.actionDefaults?.typingDelayMs) <= 1000)) errors.push('actionDefaults.typingDelayMs must be 0-1000');
  for (const domain of config?.allowedDomains ?? []) if (!/^[a-z0-9.-]+$/i.test(domain)) errors.push(`invalid allowed domain: ${domain}`);
  return { ok: errors.length === 0, errors };
}

export async function loadScreenConfig(file = 'config/screen.local.json') {
  try {
    const raw = JSON.parse(await readFile(file, 'utf8'));
    const config = normalizeScreenConfig(raw);
    const result = validateScreenConfig(config);
    if (!result.ok) throw new Error(result.errors.join('; '));
    return { config, file: path.resolve(file), exists: true };
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
    return { config: normalizeScreenConfig(), file: path.resolve(file), exists: false };
  }
}

export async function saveScreenConfig(config, file = 'config/screen.local.json') {
  const normalized = normalizeScreenConfig(config);
  const result = validateScreenConfig(normalized);
  if (!result.ok) throw new Error(result.errors.join('; '));
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(normalized, null, 2)}\n`, { mode: 0o600 });
  return { file: path.resolve(file), config: normalized };
}
