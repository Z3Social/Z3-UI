/**
 * Accounts Meta: private user data only the owner should see.
 * @module soapbox/reducers/accounts_meta
 */

import { Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';
import { VERIFY_CREDENTIALS_SUCCESS, AUTH_ACCOUNT_REMEMBER_SUCCESS } from 'soapbox/actions/auth';
import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from 'soapbox/actions/me';
const MetaRecord = ImmutableRecord({
  pleroma: ImmutableMap(),
  source: ImmutableMap()
});
const importAccount = (state, account) => {
  const accountId = account.get('id');
  return state.set(accountId, MetaRecord({
    pleroma: account.get('pleroma', ImmutableMap()).delete('settings_store'),
    source: account.get('source', ImmutableMap())
  }));
};
export default function accounts_meta(state = ImmutableMap(), action) {
  switch (action.type) {
    case ME_FETCH_SUCCESS:
    case ME_PATCH_SUCCESS:
      return importAccount(state, ImmutableMap(fromJS(action.me)));
    case VERIFY_CREDENTIALS_SUCCESS:
    case AUTH_ACCOUNT_REMEMBER_SUCCESS:
      return importAccount(state, ImmutableMap(fromJS(action.account)));
    default:
      return state;
  }
}