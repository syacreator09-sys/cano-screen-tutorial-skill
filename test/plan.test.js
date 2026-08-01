import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCapturePlan } from '../src/plan.js';
import { assertAllowedUrl, assertNoInlineSecrets } from '../src/privacy.js';
import { validateRequest } from '../src/validate.js';

const base = {
  version: '1.1',
  projectId: 'demo-project',
  url: 'https://example.com',
  objective: 'Create a useful tutorial',
  actions: [{ id: 'go', type: 'goto', url: 'https://example.com' }]
};

test('builds deterministic defaults from local config', () => {
  const plan = buildCapturePlan(base, { viewport: { width: 1920, height: 1080 }, actionDefaults: { timeoutMs: 5000, typingDelayMs: 20 } });
  assert.equal(plan.version, '1.1');
  assert.equal(plan.viewport.width, 1920);
  assert.equal(plan.actions[0].timeoutMs, 5000);
  assert.equal(plan.actions[0].order, 1);
});

test('accepts type select and pause actions', () => {
  const request = { ...base, actions: [
    { id: 'type-prompt', type: 'type', selector: '#prompt', value: 'hello', delayMs: 10 },
    { id: 'select-style', type: 'select', selector: '#style', value: 'photo' },
    { id: 'wait-result', type: 'pause', durationMs: 1000 }
  ] };
  assert.equal(validateRequest(request).ok, true);
});

test('blocks unredacted sensitive inputs', () => {
  const plan = buildCapturePlan({ ...base, actions: [{ id: 'password', type: 'type', selector: 'input[type=password]', value: 'x' }] });
  assert.throws(() => assertNoInlineSecrets(plan), /redact=true/);
});

test('enforces configured domain allowlist', () => {
  assert.equal(assertAllowedUrl('https://app.example.com/create', ['example.com']), true);
  assert.throws(() => assertAllowedUrl('https://other.test', ['example.com']), /not authorized/);
});
