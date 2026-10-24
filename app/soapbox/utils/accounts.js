import { OrderedSet as ImmutableOrderedSet } from 'immutable';
const getDomainFromURL = account => {
  try {
    const url = account.url;
    return new URL(url).host;
  } catch {
    return '';
  }
};
export const getDomain = account => {
  const domain = account.acct.split('@')[1];
  return domain ? domain : getDomainFromURL(account);
};
export const getBaseURL = account => {
  try {
    return new URL(account.url).origin;
  } catch {
    return '';
  }
};
export const getAcct = (account, displayFqn) => displayFqn === true ? account.fqn : account.acct;
export const getFollowDifference = (state, accountId, type) => {
  const items = state.getIn(['user_lists', type, accountId, 'items'], ImmutableOrderedSet());
  const counter = Number(state.getIn(['accounts_counters', accountId, `${type}_count`], 0));
  return Math.max(counter - items.size, 0);
};
export const isLocal = account => {
  const domain = account.acct.split('@')[1];
  return domain === undefined ? true : false;
};
export const isRemote = account => !isLocal(account);