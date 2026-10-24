import { List as ImmutableList } from 'immutable';
export const validId = id => typeof id === 'string' && id !== 'null' && id !== 'undefined';
export const isURL = url => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
export const parseBaseURL = url => {
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
};
export const getLoggedInAccount = state => {
  const me = state.me;
  return state.accounts.get(me);
};
export const isLoggedIn = getState => {
  return validId(getState().me);
};
export const getAppToken = state => state.auth.getIn(['app', 'access_token']);
export const getUserToken = (state, accountId) => {
  const accountUrl = state.accounts.getIn([accountId, 'url']);
  return state.auth.getIn(['users', accountUrl, 'access_token']);
};
export const getAccessToken = state => {
  const me = state.me;
  return getUserToken(state, me);
};
export const getAuthUserId = state => {
  const me = state.auth.get('me');
  return ImmutableList([state.auth.getIn(['users', me, 'id']), me]).find(validId);
};
export const getAuthUserUrl = state => {
  const me = state.auth.get('me');
  return ImmutableList([state.auth.getIn(['users', me, 'url']), me]).find(isURL);
};

/** Get the VAPID public key. */
export const getVapidKey = state => {
  return state.auth.getIn(['app', 'vapid_key']) || state.instance.getIn(['pleroma', 'vapid_public_key']);
};