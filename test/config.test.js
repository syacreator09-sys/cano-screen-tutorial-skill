import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeScreenConfig, validateScreenConfig } from '../src/config.js';

test('normalizes screen defaults without secrets', () => {
  const config = normalizeScreenConfig({ allowedDomains: ['EXAMPLE.COM', 'example.com'], redactions: ['#email'] });
  assert.deepEqual(config.allowedDomains, ['example.com']);
  assert.ok(config.redactions.includes('#email'));
  assert.equal(config.headless, true);
});

test('rejects invalid viewport and timeout', () => {
  const config = normalizeScreenConfig({ viewport: { width: 10, height: 20 }, actionDefaults: { timeoutMs: 999999, typingDelayMs: 35 } });
  const result = validateScreenConfig(config);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes('viewport.width')));
});
