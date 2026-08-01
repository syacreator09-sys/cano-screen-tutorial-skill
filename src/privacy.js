const SENSITIVE = /(password|passwd|token|secret|api[-_ ]?key|credit.?card|cvv|correo|email|phone|telefono|saldo|address|direccion|ssn|rfc|curp)/i;

export function assertNoInlineSecrets(plan) {
  const violations = [];
  for (const action of plan.actions) {
    if (['fill', 'type', 'select'].includes(action.type) && SENSITIVE.test(`${action.id} ${action.selector ?? ''}`) && !action.redact) violations.push(action.id);
    if (typeof action.value === 'string' && /-----BEGIN .*PRIVATE KEY-----|\bghp_[A-Za-z0-9]{20,}\b|\bsk-[A-Za-z0-9_-]{20,}\b/.test(action.value)) violations.push(`${action.id}:inline-secret`);
  }
  if (violations.length) throw new Error(`sensitive actions must set redact=true and must not contain secrets: ${violations.join(', ')}`);
  return true;
}

export function assertAllowedUrl(url, allowedDomains = []) {
  if (!allowedDomains.length || url.startsWith('file://')) return true;
  const hostname = new URL(url).hostname.toLowerCase();
  const allowed = allowedDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
  if (!allowed) throw new Error(`domain is not authorized by local config: ${hostname}`);
  return true;
}
