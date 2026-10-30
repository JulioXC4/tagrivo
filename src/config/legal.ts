import { resolveLegalPolicy } from '../lib/legal';

// Server frontmatter only. These non-PUBLIC variables render solely in the approved Privacy page.
export const legalPolicy = resolveLegalPolicy({
  LEGAL_POLICY_APPROVED: import.meta.env.LEGAL_POLICY_APPROVED,
  LEGAL_OPERATOR_NAME: import.meta.env.LEGAL_OPERATOR_NAME,
  LEGAL_OPERATOR_DOCUMENT: import.meta.env.LEGAL_OPERATOR_DOCUMENT,
  LEGAL_OPERATOR_ADDRESS: import.meta.env.LEGAL_OPERATOR_ADDRESS,
});
