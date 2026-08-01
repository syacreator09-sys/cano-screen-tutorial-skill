const ACTIONS = new Set(['goto','click','fill','type','select','press','waitFor','pause','screenshot']);

export function validateRequest(input) {
  const errors = [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) errors.push('request must be an object');
  if (!['1.0', '1.1'].includes(input?.version)) errors.push('version must be 1.0 or 1.1');
  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(input?.projectId ?? '')) errors.push('projectId must be kebab-case, 3-64 chars');
  if (typeof input?.url !== 'string' || !/^(https?:\/\/|file:\/\/)/.test(input.url)) errors.push('url must be http(s):// or file://');
  if (typeof input?.objective !== 'string' || input.objective.trim().length < 5) errors.push('objective must contain at least 5 characters');
  if (!Array.isArray(input?.actions) || input.actions.length === 0) errors.push('actions must contain at least one action');
  const seen = new Set();
  for (const [index, action] of (input?.actions ?? []).entries()) {
    if (!action?.id || seen.has(action.id)) errors.push(`actions[${index}].id must be unique`); else seen.add(action.id);
    if (!ACTIONS.has(action?.type)) errors.push(`actions[${index}].type is unsupported`);
    if (['click','fill','type','select','press','waitFor'].includes(action?.type) && !action.selector) errors.push(`actions[${index}].selector is required for ${action?.type}`);
    if (['fill','type','select'].includes(action?.type) && typeof action.value !== 'string' && !Array.isArray(action.value)) errors.push(`actions[${index}].value is required for ${action?.type}`);
    if (action?.type === 'pause' && !(Number(action.durationMs) >= 0 && Number(action.durationMs) <= 120000)) errors.push(`actions[${index}].durationMs must be 0-120000 for pause`);
    if (action?.delayMs !== undefined && !(Number(action.delayMs) >= 0 && Number(action.delayMs) <= 1000)) errors.push(`actions[${index}].delayMs must be 0-1000`);
  }
  return { ok: errors.length === 0, errors };
}
