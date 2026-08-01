const ACTIONS = new Set(['goto','click','fill','press','waitFor','screenshot']);
export function validateRequest(input) {
  const errors = [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) errors.push('request must be an object');
  if (input?.version !== '1.0') errors.push('version must be 1.0');
  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(input?.projectId ?? '')) errors.push('projectId must be kebab-case, 3-64 chars');
  if (typeof input?.url !== 'string' || !/^(https?:\/\/|file:\/\/)/.test(input.url)) errors.push('url must be http(s):// or file://');
  if (typeof input?.objective !== 'string' || input.objective.trim().length < 5) errors.push('objective must contain at least 5 characters');
  if (!Array.isArray(input?.actions) || input.actions.length === 0) errors.push('actions must contain at least one action');
  const seen = new Set();
  for (const [index, action] of (input?.actions ?? []).entries()) {
    if (!action?.id || seen.has(action.id)) errors.push(`actions[${index}].id must be unique`); else seen.add(action.id);
    if (!ACTIONS.has(action?.type)) errors.push(`actions[${index}].type is unsupported`);
    if (['click','fill','press','waitFor'].includes(action?.type) && !action.selector) errors.push(`actions[${index}].selector is required for ${action?.type}`);
    if (action?.type === 'fill' && typeof action.value !== 'string') errors.push(`actions[${index}].value is required for fill`);
  }
  return { ok: errors.length === 0, errors };
}
