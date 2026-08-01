const SENSITIVE = /(password|passwd|token|secret|api[-_ ]?key|credit.?card|cvv|correo|email|phone|telefono|saldo)/i;
export function assertNoInlineSecrets(plan) {
  const violations = [];
  for (const action of plan.actions) {
    if (action.type === 'fill' && SENSITIVE.test(`${action.id} ${action.selector ?? ''}`) && !action.redact) violations.push(action.id);
  }
  if (violations.length) throw new Error(`sensitive fill actions must set redact=true: ${violations.join(', ')}`);
  return true;
}
