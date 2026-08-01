import test from 'node:test'; import assert from 'node:assert/strict';
import { buildCapturePlan } from '../src/plan.js'; import { assertNoInlineSecrets } from '../src/privacy.js';
const base={version:'1.0',projectId:'demo-project',url:'https://example.com',objective:'Create a useful tutorial',actions:[{id:'go',type:'goto',url:'https://example.com'}]};
test('builds deterministic defaults',()=>{const p=buildCapturePlan(base);assert.equal(p.viewport.width,1440);assert.equal(p.actions[0].order,1);});
test('blocks unredacted sensitive fills',()=>{const p=buildCapturePlan({...base,actions:[{id:'password',type:'fill',selector:'input[type=password]',value:'x'}]});assert.throws(()=>assertNoInlineSecrets(p),/redact=true/);});
