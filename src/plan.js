import { validateRequest } from './validate.js';
export function buildCapturePlan(request) {
  const check = validateRequest(request);
  if (!check.ok) throw new Error(check.errors.join('; '));
  const viewport = request.viewport ?? { width: 1440, height: 900 };
  return {
    version: '1.0', projectId: request.projectId, url: request.url, objective: request.objective,
    viewport, redactions: request.redactions ?? [], storageStatePath: request.storageStatePath ?? null,
    actions: request.actions.map((action, index) => ({ timeoutMs: 30000, redact: false, ...action, order: index + 1 }))
  };
}
