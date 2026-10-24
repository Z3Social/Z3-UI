/**
 * Admin account normalizer:
 * Converts API admin-level account information into our internal format.
 */
import { Map as ImmutableMap, List as ImmutableList, Record as ImmutableRecord, fromJS } from 'immutable';
export const AdminAccountRecord = ImmutableRecord({
  account: null,
  approved: false,
  confirmed: false,
  created_at: new Date(),
  disabled: false,
  domain: '',
  email: '',
  id: '',
  invite_request: null,
  ip: null,
  ips: ImmutableList(),
  locale: null,
  role: null,
  sensitized: false,
  silenced: false,
  suspended: false,
  username: ''
});
const normalizePleromaAccount = account => {
  if (!account.get('account')) {
    return account.withMutations(account => {
      account.set('approved', account.get('is_approved'));
      account.set('confirmed', account.get('is_confirmed'));
      account.set('disabled', !account.get('is_active'));
      account.set('invite_request', account.get('registration_reason'));
      account.set('role', account.getIn(['roles', 'admin']) ? 'admin' : account.getIn(['roles', 'moderator']) ? 'moderator' : null);
    });
  }
  return account;
};
export const normalizeAdminAccount = account => {
  return AdminAccountRecord(ImmutableMap(fromJS(account)).withMutations(account => {
    normalizePleromaAccount(account);
  }));
};