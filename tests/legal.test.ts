import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLegalPolicy } from '../src/lib/legal.ts';

const fixture = {
  LEGAL_OPERATOR_NAME: 'Synthetic test operator',
  LEGAL_OPERATOR_DOCUMENT: '00000000',
  LEGAL_OPERATOR_ADDRESS: 'Synthetic address for unit tests only',
};
test('supplying personal data alone does not authorize its publication', () => {
  assert.deepEqual(resolveLegalPolicy(fixture), { approved: false, operator: null });
  assert.deepEqual(resolveLegalPolicy({ ...fixture, LEGAL_POLICY_APPROVED: 'false' }), {
    approved: false,
    operator: null,
  });
});
test('approved Privacy requires a complete identity and validates its flag without exposing values', () => {
  assert.throws(() => resolveLegalPolicy({ LEGAL_POLICY_APPROVED: 'true' }));
  assert.throws(() => resolveLegalPolicy({ ...fixture, LEGAL_POLICY_APPROVED: 'yes' }));
  assert.throws(() =>
    resolveLegalPolicy({
      ...fixture,
      LEGAL_POLICY_APPROVED: 'true',
      LEGAL_OPERATOR_DOCUMENT: 'invalid',
    }),
  );
  assert.equal(resolveLegalPolicy({ ...fixture, LEGAL_POLICY_APPROVED: 'true' }).approved, true);
});
