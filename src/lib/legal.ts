export interface LegalEnvironment {
  LEGAL_POLICY_APPROVED?: string;
  LEGAL_OPERATOR_NAME?: string;
  LEGAL_OPERATOR_DOCUMENT?: string;
  LEGAL_OPERATOR_ADDRESS?: string;
}

/** Values are supplied privately at build time, never committed or imported into React islands. */
export function resolveLegalPolicy(env: LegalEnvironment) {
  if (env.LEGAL_POLICY_APPROVED && !['true', 'false'].includes(env.LEGAL_POLICY_APPROVED))
    throw new Error('LEGAL_POLICY_APPROVED must be true or false.');
  if (env.LEGAL_POLICY_APPROVED !== 'true') return { approved: false as const, operator: null };
  const name = env.LEGAL_OPERATOR_NAME?.trim();
  const document = env.LEGAL_OPERATOR_DOCUMENT?.trim();
  const address = env.LEGAL_OPERATOR_ADDRESS?.trim();
  if (!name || !document || !address)
    throw new Error(
      'Approved Privacy requires the authentic operator name, document and address in private build variables.',
    );
  if (!/^\d{8}$/.test(document))
    throw new Error('The supplied Peruvian DNI must contain eight digits.');
  return { approved: true as const, operator: { name, document, address } };
}
