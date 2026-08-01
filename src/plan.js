import { validateRequest } from './validate.js';
import { normalizeScreenConfig } from './config.js';

export function buildCapturePlan(request, rawConfig = {}) {
  const check = validateRequest(request);
  if (!check.ok) throw new Error(check.errors.join('; '));
  const config = normalizeScreenConfig(rawConfig);
  const viewport = request.viewport ?? config.viewport;
  return {
    version: '1.1',
    projectId: request.projectId,
    url: request.url,
    objective: request.objective,
    viewport,
    headless: request.headless ?? config.headless,
    recordVideo: request.recordVideo ?? config.recordVideo,
    trace: request.trace ?? config.trace,
    allowedDomains: request.allowedDomains ?? config.allowedDomains,
    redactions: [...new Set([...config.redactions, ...(request.redactions ?? [])])],
    storageStatePath: request.storageStatePath ?? null,
    actions: request.actions.map((action, index) => ({
      timeoutMs: config.actionDefaults.timeoutMs,
      delayMs: config.actionDefaults.typingDelayMs,
      redact: false,
      ...action,
      order: index + 1
    }))
  };
}
