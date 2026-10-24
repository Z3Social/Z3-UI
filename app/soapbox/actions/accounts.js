import { isLoggedIn } from 'soapbox/utils/auth';
import { getFeatures } from 'soapbox/utils/features';
import api, { getLinks } from '../api';
import { importFetchedAccount, importFetchedAccounts, importErrorWhileFetchingAccountByUsername } from './importer';
const ACCOUNT_CREATE_REQUEST = 'ACCOUNT_CREATE_REQUEST';
const ACCOUNT_CREATE_SUCCESS = 'ACCOUNT_CREATE_SUCCESS';
const ACCOUNT_CREATE_FAIL = 'ACCOUNT_CREATE_FAIL';
const ACCOUNT_FETCH_REQUEST = 'ACCOUNT_FETCH_REQUEST';
const ACCOUNT_FETCH_SUCCESS = 'ACCOUNT_FETCH_SUCCESS';
const ACCOUNT_FETCH_FAIL = 'ACCOUNT_FETCH_FAIL';
const ACCOUNT_FOLLOW_REQUEST = 'ACCOUNT_FOLLOW_REQUEST';
const ACCOUNT_FOLLOW_SUCCESS = 'ACCOUNT_FOLLOW_SUCCESS';
const ACCOUNT_FOLLOW_FAIL = 'ACCOUNT_FOLLOW_FAIL';
const ACCOUNT_UNFOLLOW_REQUEST = 'ACCOUNT_UNFOLLOW_REQUEST';
const ACCOUNT_UNFOLLOW_SUCCESS = 'ACCOUNT_UNFOLLOW_SUCCESS';
const ACCOUNT_UNFOLLOW_FAIL = 'ACCOUNT_UNFOLLOW_FAIL';
const ACCOUNT_BLOCK_REQUEST = 'ACCOUNT_BLOCK_REQUEST';
const ACCOUNT_BLOCK_SUCCESS = 'ACCOUNT_BLOCK_SUCCESS';
const ACCOUNT_BLOCK_FAIL = 'ACCOUNT_BLOCK_FAIL';
const ACCOUNT_UNBLOCK_REQUEST = 'ACCOUNT_UNBLOCK_REQUEST';
const ACCOUNT_UNBLOCK_SUCCESS = 'ACCOUNT_UNBLOCK_SUCCESS';
const ACCOUNT_UNBLOCK_FAIL = 'ACCOUNT_UNBLOCK_FAIL';
const ACCOUNT_MUTE_REQUEST = 'ACCOUNT_MUTE_REQUEST';
const ACCOUNT_MUTE_SUCCESS = 'ACCOUNT_MUTE_SUCCESS';
const ACCOUNT_MUTE_FAIL = 'ACCOUNT_MUTE_FAIL';
const ACCOUNT_UNMUTE_REQUEST = 'ACCOUNT_UNMUTE_REQUEST';
const ACCOUNT_UNMUTE_SUCCESS = 'ACCOUNT_UNMUTE_SUCCESS';
const ACCOUNT_UNMUTE_FAIL = 'ACCOUNT_UNMUTE_FAIL';
const ACCOUNT_SUBSCRIBE_REQUEST = 'ACCOUNT_SUBSCRIBE_REQUEST';
const ACCOUNT_SUBSCRIBE_SUCCESS = 'ACCOUNT_SUBSCRIBE_SUCCESS';
const ACCOUNT_SUBSCRIBE_FAIL = 'ACCOUNT_SUBSCRIBE_FAIL';
const ACCOUNT_UNSUBSCRIBE_REQUEST = 'ACCOUNT_UNSUBSCRIBE_REQUEST';
const ACCOUNT_UNSUBSCRIBE_SUCCESS = 'ACCOUNT_UNSUBSCRIBE_SUCCESS';
const ACCOUNT_UNSUBSCRIBE_FAIL = 'ACCOUNT_UNSUBSCRIBE_FAIL';
const ACCOUNT_PIN_REQUEST = 'ACCOUNT_PIN_REQUEST';
const ACCOUNT_PIN_SUCCESS = 'ACCOUNT_PIN_SUCCESS';
const ACCOUNT_PIN_FAIL = 'ACCOUNT_PIN_FAIL';
const ACCOUNT_UNPIN_REQUEST = 'ACCOUNT_UNPIN_REQUEST';
const ACCOUNT_UNPIN_SUCCESS = 'ACCOUNT_UNPIN_SUCCESS';
const ACCOUNT_UNPIN_FAIL = 'ACCOUNT_UNPIN_FAIL';
const ACCOUNT_REMOVE_FROM_FOLLOWERS_REQUEST = 'ACCOUNT_REMOVE_FROM_FOLLOWERS_REQUEST';
const ACCOUNT_REMOVE_FROM_FOLLOWERS_SUCCESS = 'ACCOUNT_REMOVE_FROM_FOLLOWERS_SUCCESS';
const ACCOUNT_REMOVE_FROM_FOLLOWERS_FAIL = 'ACCOUNT_REMOVE_FROM_FOLLOWERS_FAIL';
const PINNED_ACCOUNTS_FETCH_REQUEST = 'PINNED_ACCOUNTS_FETCH_REQUEST';
const PINNED_ACCOUNTS_FETCH_SUCCESS = 'PINNED_ACCOUNTS_FETCH_SUCCESS';
const PINNED_ACCOUNTS_FETCH_FAIL = 'PINNED_ACCOUNTS_FETCH_FAIL';
const ACCOUNT_SEARCH_REQUEST = 'ACCOUNT_SEARCH_REQUEST';
const ACCOUNT_SEARCH_SUCCESS = 'ACCOUNT_SEARCH_SUCCESS';
const ACCOUNT_SEARCH_FAIL = 'ACCOUNT_SEARCH_FAIL';
const ACCOUNT_LOOKUP_REQUEST = 'ACCOUNT_LOOKUP_REQUEST';
const ACCOUNT_LOOKUP_SUCCESS = 'ACCOUNT_LOOKUP_SUCCESS';
const ACCOUNT_LOOKUP_FAIL = 'ACCOUNT_LOOKUP_FAIL';
const FOLLOWERS_FETCH_REQUEST = 'FOLLOWERS_FETCH_REQUEST';
const FOLLOWERS_FETCH_SUCCESS = 'FOLLOWERS_FETCH_SUCCESS';
const FOLLOWERS_FETCH_FAIL = 'FOLLOWERS_FETCH_FAIL';
const FOLLOWERS_EXPAND_REQUEST = 'FOLLOWERS_EXPAND_REQUEST';
const FOLLOWERS_EXPAND_SUCCESS = 'FOLLOWERS_EXPAND_SUCCESS';
const FOLLOWERS_EXPAND_FAIL = 'FOLLOWERS_EXPAND_FAIL';
const FOLLOWING_FETCH_REQUEST = 'FOLLOWING_FETCH_REQUEST';
const FOLLOWING_FETCH_SUCCESS = 'FOLLOWING_FETCH_SUCCESS';
const FOLLOWING_FETCH_FAIL = 'FOLLOWING_FETCH_FAIL';
const FOLLOWING_EXPAND_REQUEST = 'FOLLOWING_EXPAND_REQUEST';
const FOLLOWING_EXPAND_SUCCESS = 'FOLLOWING_EXPAND_SUCCESS';
const FOLLOWING_EXPAND_FAIL = 'FOLLOWING_EXPAND_FAIL';
const RELATIONSHIPS_FETCH_REQUEST = 'RELATIONSHIPS_FETCH_REQUEST';
const RELATIONSHIPS_FETCH_SUCCESS = 'RELATIONSHIPS_FETCH_SUCCESS';
const RELATIONSHIPS_FETCH_FAIL = 'RELATIONSHIPS_FETCH_FAIL';
const FOLLOW_REQUESTS_FETCH_REQUEST = 'FOLLOW_REQUESTS_FETCH_REQUEST';
const FOLLOW_REQUESTS_FETCH_SUCCESS = 'FOLLOW_REQUESTS_FETCH_SUCCESS';
const FOLLOW_REQUESTS_FETCH_FAIL = 'FOLLOW_REQUESTS_FETCH_FAIL';
const FOLLOW_REQUESTS_EXPAND_REQUEST = 'FOLLOW_REQUESTS_EXPAND_REQUEST';
const FOLLOW_REQUESTS_EXPAND_SUCCESS = 'FOLLOW_REQUESTS_EXPAND_SUCCESS';
const FOLLOW_REQUESTS_EXPAND_FAIL = 'FOLLOW_REQUESTS_EXPAND_FAIL';
const FOLLOW_REQUEST_AUTHORIZE_REQUEST = 'FOLLOW_REQUEST_AUTHORIZE_REQUEST';
const FOLLOW_REQUEST_AUTHORIZE_SUCCESS = 'FOLLOW_REQUEST_AUTHORIZE_SUCCESS';
const FOLLOW_REQUEST_AUTHORIZE_FAIL = 'FOLLOW_REQUEST_AUTHORIZE_FAIL';
const FOLLOW_REQUEST_REJECT_REQUEST = 'FOLLOW_REQUEST_REJECT_REQUEST';
const FOLLOW_REQUEST_REJECT_SUCCESS = 'FOLLOW_REQUEST_REJECT_SUCCESS';
const FOLLOW_REQUEST_REJECT_FAIL = 'FOLLOW_REQUEST_REJECT_FAIL';
const NOTIFICATION_SETTINGS_REQUEST = 'NOTIFICATION_SETTINGS_REQUEST';
const NOTIFICATION_SETTINGS_SUCCESS = 'NOTIFICATION_SETTINGS_SUCCESS';
const NOTIFICATION_SETTINGS_FAIL = 'NOTIFICATION_SETTINGS_FAIL';
const BIRTHDAY_REMINDERS_FETCH_REQUEST = 'BIRTHDAY_REMINDERS_FETCH_REQUEST';
const BIRTHDAY_REMINDERS_FETCH_SUCCESS = 'BIRTHDAY_REMINDERS_FETCH_SUCCESS';
const BIRTHDAY_REMINDERS_FETCH_FAIL = 'BIRTHDAY_REMINDERS_FETCH_FAIL';
const maybeRedirectLogin = (error, history) => {
  // The client is unauthorized - redirect to login.
  if (history && error?.response?.status === 401) {
    history.push('/login');
  }
};
const noOp = () => new Promise(f => f(undefined));
const createAccount = params => (dispatch, getState) => {
  dispatch({
    type: ACCOUNT_CREATE_REQUEST,
    params
  });
  return api(getState, 'app').post('/api/v1/accounts', params).then(({
    data: token
  }) => {
    return dispatch({
      type: ACCOUNT_CREATE_SUCCESS,
      params,
      token
    });
  }).catch(error => {
    dispatch({
      type: ACCOUNT_CREATE_FAIL,
      error,
      params
    });
    throw error;
  });
};
const fetchAccount = id => (dispatch, getState) => {
  dispatch(fetchRelationships([id]));
  const account = getState().accounts.get(id);
  if (account && !account.get('should_refetch')) {
    return null;
  }
  dispatch(fetchAccountRequest(id));
  return api(getState).get(`/api/v1/accounts/${id}`).then(response => {
    dispatch(importFetchedAccount(response.data));
    dispatch(fetchAccountSuccess(response.data));
  }).catch(error => {
    dispatch(fetchAccountFail(id, error));
  });
};
const fetchAccountByUsername = (username, history) => (dispatch, getState) => {
  const {
    instance,
    me
  } = getState();
  const features = getFeatures(instance);
  if (features.accountByUsername && (me || !features.accountLookup)) {
    return api(getState).get(`/api/v1/accounts/${username}`).then(response => {
      dispatch(fetchRelationships([response.data.id]));
      dispatch(importFetchedAccount(response.data));
      dispatch(fetchAccountSuccess(response.data));
    }).catch(error => {
      dispatch(fetchAccountFail(null, error));
      dispatch(importErrorWhileFetchingAccountByUsername(username));
    });
  } else if (features.accountLookup) {
    return dispatch(accountLookup(username)).then(account => {
      dispatch(fetchRelationships([account.id]));
      dispatch(fetchAccountSuccess(account));
    }).catch(error => {
      dispatch(fetchAccountFail(null, error));
      dispatch(importErrorWhileFetchingAccountByUsername(username));
      maybeRedirectLogin(error, history);
    });
  } else {
    return dispatch(accountSearch({
      q: username,
      limit: 5,
      resolve: true
    })).then(accounts => {
      const found = accounts.find(a => a.acct === username);
      if (found) {
        dispatch(fetchRelationships([found.id]));
        dispatch(fetchAccountSuccess(found));
      } else {
        throw accounts;
      }
    }).catch(error => {
      dispatch(fetchAccountFail(null, error));
      dispatch(importErrorWhileFetchingAccountByUsername(username));
    });
  }
};
const fetchAccountRequest = id => ({
  type: ACCOUNT_FETCH_REQUEST,
  id
});
const fetchAccountSuccess = account => ({
  type: ACCOUNT_FETCH_SUCCESS,
  account
});
const fetchAccountFail = (id, error) => ({
  type: ACCOUNT_FETCH_FAIL,
  id,
  error,
  skipAlert: true
});
const followAccount = (id, options) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  const alreadyFollowing = getState().relationships.get(id)?.following || undefined;
  const locked = getState().accounts.get(id)?.locked || false;
  dispatch(followAccountRequest(id, locked));
  return api(getState).post(`/api/v1/accounts/${id}/follow`, options).then(response => dispatch(followAccountSuccess(response.data, alreadyFollowing))).catch(error => {
    dispatch(followAccountFail(error, locked));
    throw error;
  });
};
const unfollowAccount = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  dispatch(unfollowAccountRequest(id));
  return api(getState).post(`/api/v1/accounts/${id}/unfollow`).then(response => dispatch(unfollowAccountSuccess(response.data, getState().statuses))).catch(error => dispatch(unfollowAccountFail(error)));
};
const followAccountRequest = (id, locked) => ({
  type: ACCOUNT_FOLLOW_REQUEST,
  id,
  locked,
  skipLoading: true
});
const followAccountSuccess = (relationship, alreadyFollowing) => ({
  type: ACCOUNT_FOLLOW_SUCCESS,
  relationship,
  alreadyFollowing,
  skipLoading: true
});
const followAccountFail = (error, locked) => ({
  type: ACCOUNT_FOLLOW_FAIL,
  error,
  locked,
  skipLoading: true
});
const unfollowAccountRequest = id => ({
  type: ACCOUNT_UNFOLLOW_REQUEST,
  id,
  skipLoading: true
});
const unfollowAccountSuccess = (relationship, statuses) => ({
  type: ACCOUNT_UNFOLLOW_SUCCESS,
  relationship,
  statuses,
  skipLoading: true
});
const unfollowAccountFail = error => ({
  type: ACCOUNT_UNFOLLOW_FAIL,
  error,
  skipLoading: true
});
const blockAccount = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  dispatch(blockAccountRequest(id));
  return api(getState).post(`/api/v1/accounts/${id}/block`).then(response => {
    // Pass in entire statuses map so we can use it to filter stuff in different parts of the reducers
    return dispatch(blockAccountSuccess(response.data, getState().statuses));
  }).catch(error => dispatch(blockAccountFail(error)));
};
const unblockAccount = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  dispatch(unblockAccountRequest(id));
  return api(getState).post(`/api/v1/accounts/${id}/unblock`).then(response => dispatch(unblockAccountSuccess(response.data))).catch(error => dispatch(unblockAccountFail(error)));
};
const blockAccountRequest = id => ({
  type: ACCOUNT_BLOCK_REQUEST,
  id
});
const blockAccountSuccess = (relationship, statuses) => ({
  type: ACCOUNT_BLOCK_SUCCESS,
  relationship,
  statuses
});
const blockAccountFail = error => ({
  type: ACCOUNT_BLOCK_FAIL,
  error
});
const unblockAccountRequest = id => ({
  type: ACCOUNT_UNBLOCK_REQUEST,
  id
});
const unblockAccountSuccess = relationship => ({
  type: ACCOUNT_UNBLOCK_SUCCESS,
  relationship
});
const unblockAccountFail = error => ({
  type: ACCOUNT_UNBLOCK_FAIL,
  error
});
const muteAccount = (id, notifications) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  dispatch(muteAccountRequest(id));
  return api(getState).post(`/api/v1/accounts/${id}/mute`, {
    notifications
  }).then(response => {
    // Pass in entire statuses map so we can use it to filter stuff in different parts of the reducers
    return dispatch(muteAccountSuccess(response.data, getState().statuses));
  }).catch(error => dispatch(muteAccountFail(error)));
};
const unmuteAccount = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  dispatch(unmuteAccountRequest(id));
  return api(getState).post(`/api/v1/accounts/${id}/unmute`).then(response => dispatch(unmuteAccountSuccess(response.data))).catch(error => dispatch(unmuteAccountFail(error)));
};
const muteAccountRequest = id => ({
  type: ACCOUNT_MUTE_REQUEST,
  id
});
const muteAccountSuccess = (relationship, statuses) => ({
  type: ACCOUNT_MUTE_SUCCESS,
  relationship,
  statuses
});
const muteAccountFail = error => ({
  type: ACCOUNT_MUTE_FAIL,
  error
});
const unmuteAccountRequest = id => ({
  type: ACCOUNT_UNMUTE_REQUEST,
  id
});
const unmuteAccountSuccess = relationship => ({
  type: ACCOUNT_UNMUTE_SUCCESS,
  relationship
});
const unmuteAccountFail = error => ({
  type: ACCOUNT_UNMUTE_FAIL,
  error
});
const subscribeAccount = (id, notifications) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  dispatch(subscribeAccountRequest(id));
  return api(getState).post(`/api/v1/pleroma/accounts/${id}/subscribe`, {
    notifications
  }).then(response => dispatch(subscribeAccountSuccess(response.data))).catch(error => dispatch(subscribeAccountFail(error)));
};
const unsubscribeAccount = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  dispatch(unsubscribeAccountRequest(id));
  return api(getState).post(`/api/v1/pleroma/accounts/${id}/unsubscribe`).then(response => dispatch(unsubscribeAccountSuccess(response.data))).catch(error => dispatch(unsubscribeAccountFail(error)));
};
const subscribeAccountRequest = id => ({
  type: ACCOUNT_SUBSCRIBE_REQUEST,
  id
});
const subscribeAccountSuccess = relationship => ({
  type: ACCOUNT_SUBSCRIBE_SUCCESS,
  relationship
});
const subscribeAccountFail = error => ({
  type: ACCOUNT_SUBSCRIBE_FAIL,
  error
});
const unsubscribeAccountRequest = id => ({
  type: ACCOUNT_UNSUBSCRIBE_REQUEST,
  id
});
const unsubscribeAccountSuccess = relationship => ({
  type: ACCOUNT_UNSUBSCRIBE_SUCCESS,
  relationship
});
const unsubscribeAccountFail = error => ({
  type: ACCOUNT_UNSUBSCRIBE_FAIL,
  error
});
const removeFromFollowers = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  dispatch(removeFromFollowersRequest(id));
  return api(getState).post(`/api/v1/accounts/${id}/remove_from_followers`).then(response => dispatch(removeFromFollowersSuccess(response.data))).catch(error => dispatch(removeFromFollowersFail(id, error)));
};
const removeFromFollowersRequest = id => ({
  type: ACCOUNT_REMOVE_FROM_FOLLOWERS_REQUEST,
  id
});
const removeFromFollowersSuccess = relationship => ({
  type: ACCOUNT_REMOVE_FROM_FOLLOWERS_SUCCESS,
  relationship
});
const removeFromFollowersFail = (id, error) => ({
  type: ACCOUNT_REMOVE_FROM_FOLLOWERS_FAIL,
  id,
  error
});
const fetchFollowers = id => (dispatch, getState) => {
  dispatch(fetchFollowersRequest(id));
  return api(getState).get(`/api/v1/accounts/${id}/followers`).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next');
    dispatch(importFetchedAccounts(response.data));
    dispatch(fetchFollowersSuccess(id, response.data, next ? next.uri : null));
    dispatch(fetchRelationships(response.data.map(item => item.id)));
  }).catch(error => {
    dispatch(fetchFollowersFail(id, error));
  });
};
const fetchFollowersRequest = id => ({
  type: FOLLOWERS_FETCH_REQUEST,
  id
});
const fetchFollowersSuccess = (id, accounts, next) => ({
  type: FOLLOWERS_FETCH_SUCCESS,
  id,
  accounts,
  next
});
const fetchFollowersFail = (id, error) => ({
  type: FOLLOWERS_FETCH_FAIL,
  id,
  error
});
const expandFollowers = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  const url = getState().user_lists.followers.get(id)?.next;
  if (url === null) {
    return null;
  }
  dispatch(expandFollowersRequest(id));
  return api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next');
    dispatch(importFetchedAccounts(response.data));
    dispatch(expandFollowersSuccess(id, response.data, next ? next.uri : null));
    dispatch(fetchRelationships(response.data.map(item => item.id)));
  }).catch(error => {
    dispatch(expandFollowersFail(id, error));
  });
};
const expandFollowersRequest = id => ({
  type: FOLLOWERS_EXPAND_REQUEST,
  id
});
const expandFollowersSuccess = (id, accounts, next) => ({
  type: FOLLOWERS_EXPAND_SUCCESS,
  id,
  accounts,
  next
});
const expandFollowersFail = (id, error) => ({
  type: FOLLOWERS_EXPAND_FAIL,
  id,
  error
});
const fetchFollowing = id => (dispatch, getState) => {
  dispatch(fetchFollowingRequest(id));
  return api(getState).get(`/api/v1/accounts/${id}/following`).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next');
    dispatch(importFetchedAccounts(response.data));
    dispatch(fetchFollowingSuccess(id, response.data, next ? next.uri : null));
    dispatch(fetchRelationships(response.data.map(item => item.id)));
  }).catch(error => {
    dispatch(fetchFollowingFail(id, error));
  });
};
const fetchFollowingRequest = id => ({
  type: FOLLOWING_FETCH_REQUEST,
  id
});
const fetchFollowingSuccess = (id, accounts, next) => ({
  type: FOLLOWING_FETCH_SUCCESS,
  id,
  accounts,
  next
});
const fetchFollowingFail = (id, error) => ({
  type: FOLLOWING_FETCH_FAIL,
  id,
  error
});
const expandFollowing = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  const url = getState().user_lists.following.get(id).next;
  if (url === null) {
    return null;
  }
  dispatch(expandFollowingRequest(id));
  return api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next');
    dispatch(importFetchedAccounts(response.data));
    dispatch(expandFollowingSuccess(id, response.data, next ? next.uri : null));
    dispatch(fetchRelationships(response.data.map(item => item.id)));
  }).catch(error => {
    dispatch(expandFollowingFail(id, error));
  });
};
const expandFollowingRequest = id => ({
  type: FOLLOWING_EXPAND_REQUEST,
  id
});
const expandFollowingSuccess = (id, accounts, next) => ({
  type: FOLLOWING_EXPAND_SUCCESS,
  id,
  accounts,
  next
});
const expandFollowingFail = (id, error) => ({
  type: FOLLOWING_EXPAND_FAIL,
  id,
  error
});
const fetchRelationships = accountIds => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  const loadedRelationships = getState().relationships;
  const newAccountIds = accountIds.filter(id => loadedRelationships.get(id, null) === null);
  if (newAccountIds.length === 0) {
    return null;
  }
  dispatch(fetchRelationshipsRequest(newAccountIds));
  return api(getState).get(`/api/v1/accounts/relationships?${newAccountIds.map(id => `id[]=${id}`).join('&')}`).then(response => dispatch(fetchRelationshipsSuccess(response.data))).catch(error => dispatch(fetchRelationshipsFail(error)));
};
const fetchRelationshipsRequest = ids => ({
  type: RELATIONSHIPS_FETCH_REQUEST,
  ids,
  skipLoading: true
});
const fetchRelationshipsSuccess = relationships => ({
  type: RELATIONSHIPS_FETCH_SUCCESS,
  relationships,
  skipLoading: true
});
const fetchRelationshipsFail = error => ({
  type: RELATIONSHIPS_FETCH_FAIL,
  error,
  skipLoading: true
});
const fetchFollowRequests = () => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  dispatch(fetchFollowRequestsRequest());
  return api(getState).get('/api/v1/follow_requests').then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next');
    dispatch(importFetchedAccounts(response.data));
    dispatch(fetchFollowRequestsSuccess(response.data, next ? next.uri : null));
  }).catch(error => dispatch(fetchFollowRequestsFail(error)));
};
const fetchFollowRequestsRequest = () => ({
  type: FOLLOW_REQUESTS_FETCH_REQUEST
});
const fetchFollowRequestsSuccess = (accounts, next) => ({
  type: FOLLOW_REQUESTS_FETCH_SUCCESS,
  accounts,
  next
});
const fetchFollowRequestsFail = error => ({
  type: FOLLOW_REQUESTS_FETCH_FAIL,
  error
});
const expandFollowRequests = () => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  const url = getState().user_lists.follow_requests.next;
  if (url === null) {
    return null;
  }
  dispatch(expandFollowRequestsRequest());
  return api(getState).get(url).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next');
    dispatch(importFetchedAccounts(response.data));
    dispatch(expandFollowRequestsSuccess(response.data, next ? next.uri : null));
  }).catch(error => dispatch(expandFollowRequestsFail(error)));
};
const expandFollowRequestsRequest = () => ({
  type: FOLLOW_REQUESTS_EXPAND_REQUEST
});
const expandFollowRequestsSuccess = (accounts, next) => ({
  type: FOLLOW_REQUESTS_EXPAND_SUCCESS,
  accounts,
  next
});
const expandFollowRequestsFail = error => ({
  type: FOLLOW_REQUESTS_EXPAND_FAIL,
  error
});
const authorizeFollowRequest = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return null;
  dispatch(authorizeFollowRequestRequest(id));
  return api(getState).post(`/api/v1/follow_requests/${id}/authorize`).then(() => dispatch(authorizeFollowRequestSuccess(id))).catch(error => dispatch(authorizeFollowRequestFail(id, error)));
};
const authorizeFollowRequestRequest = id => ({
  type: FOLLOW_REQUEST_AUTHORIZE_REQUEST,
  id
});
const authorizeFollowRequestSuccess = id => ({
  type: FOLLOW_REQUEST_AUTHORIZE_SUCCESS,
  id
});
const authorizeFollowRequestFail = (id, error) => ({
  type: FOLLOW_REQUEST_AUTHORIZE_FAIL,
  id,
  error
});
const rejectFollowRequest = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  dispatch(rejectFollowRequestRequest(id));
  api(getState).post(`/api/v1/follow_requests/${id}/reject`).then(() => dispatch(rejectFollowRequestSuccess(id))).catch(error => dispatch(rejectFollowRequestFail(id, error)));
};
const rejectFollowRequestRequest = id => ({
  type: FOLLOW_REQUEST_REJECT_REQUEST,
  id
});
const rejectFollowRequestSuccess = id => ({
  type: FOLLOW_REQUEST_REJECT_SUCCESS,
  id
});
const rejectFollowRequestFail = (id, error) => ({
  type: FOLLOW_REQUEST_REJECT_FAIL,
  id,
  error
});
const pinAccount = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return dispatch(noOp);
  dispatch(pinAccountRequest(id));
  return api(getState).post(`/api/v1/accounts/${id}/pin`).then(response => {
    dispatch(pinAccountSuccess(response.data));
  }).catch(error => {
    dispatch(pinAccountFail(error));
  });
};
const unpinAccount = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return dispatch(noOp);
  dispatch(unpinAccountRequest(id));
  return api(getState).post(`/api/v1/accounts/${id}/unpin`).then(response => {
    dispatch(unpinAccountSuccess(response.data));
  }).catch(error => {
    dispatch(unpinAccountFail(error));
  });
};
const updateNotificationSettings = params => (dispatch, getState) => {
  dispatch({
    type: NOTIFICATION_SETTINGS_REQUEST,
    params
  });
  return api(getState).put('/api/v1/pleroma/notification_settings', params).then(({
    data
  }) => {
    dispatch({
      type: NOTIFICATION_SETTINGS_SUCCESS,
      params,
      data
    });
  }).catch(error => {
    dispatch({
      type: NOTIFICATION_SETTINGS_FAIL,
      params,
      error
    });
    throw error;
  });
};
const pinAccountRequest = id => ({
  type: ACCOUNT_PIN_REQUEST,
  id
});
const pinAccountSuccess = relationship => ({
  type: ACCOUNT_PIN_SUCCESS,
  relationship
});
const pinAccountFail = error => ({
  type: ACCOUNT_PIN_FAIL,
  error
});
const unpinAccountRequest = id => ({
  type: ACCOUNT_UNPIN_REQUEST,
  id
});
const unpinAccountSuccess = relationship => ({
  type: ACCOUNT_UNPIN_SUCCESS,
  relationship
});
const unpinAccountFail = error => ({
  type: ACCOUNT_UNPIN_FAIL,
  error
});
const fetchPinnedAccounts = id => (dispatch, getState) => {
  dispatch(fetchPinnedAccountsRequest(id));
  api(getState).get(`/api/v1/endorsements`).then(response => {
    dispatch(importFetchedAccounts(response.data));
    dispatch(fetchPinnedAccountsSuccess(id, response.data, null));
  }).catch(error => {
    dispatch(fetchPinnedAccountsFail(id, error));
  });
};
const fetchPinnedAccountsRequest = id => ({
  type: PINNED_ACCOUNTS_FETCH_REQUEST,
  id
});
const fetchPinnedAccountsSuccess = (id, accounts, next) => ({
  type: PINNED_ACCOUNTS_FETCH_SUCCESS,
  id,
  accounts,
  next
});
const fetchPinnedAccountsFail = (id, error) => ({
  type: PINNED_ACCOUNTS_FETCH_FAIL,
  id,
  error
});
const accountSearch = (params, signal) => (dispatch, getState) => {
  dispatch({
    type: ACCOUNT_SEARCH_REQUEST,
    params
  });
  return api(getState).get('/api/v1/accounts/search', {
    params,
    signal
  }).then(({
    data: accounts
  }) => {
    dispatch(importFetchedAccounts(accounts));
    dispatch({
      type: ACCOUNT_SEARCH_SUCCESS,
      accounts
    });
    return accounts;
  }).catch(error => {
    dispatch({
      type: ACCOUNT_SEARCH_FAIL,
      skipAlert: true
    });
    throw error;
  });
};
const accountLookup = (acct, cancelToken) => (dispatch, getState) => {
  dispatch({
    type: ACCOUNT_LOOKUP_REQUEST,
    acct
  });
  return api(getState).get('/api/v1/accounts/lookup', {
    params: {
      acct
    },
    cancelToken
  }).then(({
    data: account
  }) => {
    if (account && account.id) dispatch(importFetchedAccount(account));
    dispatch({
      type: ACCOUNT_LOOKUP_SUCCESS,
      account
    });
    return account;
  }).catch(error => {
    dispatch({
      type: ACCOUNT_LOOKUP_FAIL
    });
    throw error;
  });
};
const fetchBirthdayReminders = (month, day) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  const me = getState().me;
  dispatch({
    type: BIRTHDAY_REMINDERS_FETCH_REQUEST,
    day,
    month,
    id: me
  });
  return api(getState).get('/api/v1/pleroma/birthdays', {
    params: {
      day,
      month
    }
  }).then(response => {
    dispatch(importFetchedAccounts(response.data));
    dispatch({
      type: BIRTHDAY_REMINDERS_FETCH_SUCCESS,
      accounts: response.data,
      day,
      month,
      id: me
    });
  }).catch(error => {
    dispatch({
      type: BIRTHDAY_REMINDERS_FETCH_FAIL,
      day,
      month,
      id: me
    });
  });
};
export { ACCOUNT_CREATE_REQUEST, ACCOUNT_CREATE_SUCCESS, ACCOUNT_CREATE_FAIL, ACCOUNT_FETCH_REQUEST, ACCOUNT_FETCH_SUCCESS, ACCOUNT_FETCH_FAIL, ACCOUNT_FOLLOW_REQUEST, ACCOUNT_FOLLOW_SUCCESS, ACCOUNT_FOLLOW_FAIL, ACCOUNT_UNFOLLOW_REQUEST, ACCOUNT_UNFOLLOW_SUCCESS, ACCOUNT_UNFOLLOW_FAIL, ACCOUNT_BLOCK_REQUEST, ACCOUNT_BLOCK_SUCCESS, ACCOUNT_BLOCK_FAIL, ACCOUNT_UNBLOCK_REQUEST, ACCOUNT_UNBLOCK_SUCCESS, ACCOUNT_UNBLOCK_FAIL, ACCOUNT_MUTE_REQUEST, ACCOUNT_MUTE_SUCCESS, ACCOUNT_MUTE_FAIL, ACCOUNT_UNMUTE_REQUEST, ACCOUNT_UNMUTE_SUCCESS, ACCOUNT_UNMUTE_FAIL, ACCOUNT_SUBSCRIBE_REQUEST, ACCOUNT_SUBSCRIBE_SUCCESS, ACCOUNT_SUBSCRIBE_FAIL, ACCOUNT_UNSUBSCRIBE_REQUEST, ACCOUNT_UNSUBSCRIBE_SUCCESS, ACCOUNT_UNSUBSCRIBE_FAIL, ACCOUNT_PIN_REQUEST, ACCOUNT_PIN_SUCCESS, ACCOUNT_PIN_FAIL, ACCOUNT_UNPIN_REQUEST, ACCOUNT_UNPIN_SUCCESS, ACCOUNT_UNPIN_FAIL, ACCOUNT_REMOVE_FROM_FOLLOWERS_REQUEST, ACCOUNT_REMOVE_FROM_FOLLOWERS_SUCCESS, ACCOUNT_REMOVE_FROM_FOLLOWERS_FAIL, PINNED_ACCOUNTS_FETCH_REQUEST, PINNED_ACCOUNTS_FETCH_SUCCESS, PINNED_ACCOUNTS_FETCH_FAIL, ACCOUNT_SEARCH_REQUEST, ACCOUNT_SEARCH_SUCCESS, ACCOUNT_SEARCH_FAIL, ACCOUNT_LOOKUP_REQUEST, ACCOUNT_LOOKUP_SUCCESS, ACCOUNT_LOOKUP_FAIL, FOLLOWERS_FETCH_REQUEST, FOLLOWERS_FETCH_SUCCESS, FOLLOWERS_FETCH_FAIL, FOLLOWERS_EXPAND_REQUEST, FOLLOWERS_EXPAND_SUCCESS, FOLLOWERS_EXPAND_FAIL, FOLLOWING_FETCH_REQUEST, FOLLOWING_FETCH_SUCCESS, FOLLOWING_FETCH_FAIL, FOLLOWING_EXPAND_REQUEST, FOLLOWING_EXPAND_SUCCESS, FOLLOWING_EXPAND_FAIL, RELATIONSHIPS_FETCH_REQUEST, RELATIONSHIPS_FETCH_SUCCESS, RELATIONSHIPS_FETCH_FAIL, FOLLOW_REQUESTS_FETCH_REQUEST, FOLLOW_REQUESTS_FETCH_SUCCESS, FOLLOW_REQUESTS_FETCH_FAIL, FOLLOW_REQUESTS_EXPAND_REQUEST, FOLLOW_REQUESTS_EXPAND_SUCCESS, FOLLOW_REQUESTS_EXPAND_FAIL, FOLLOW_REQUEST_AUTHORIZE_REQUEST, FOLLOW_REQUEST_AUTHORIZE_SUCCESS, FOLLOW_REQUEST_AUTHORIZE_FAIL, FOLLOW_REQUEST_REJECT_REQUEST, FOLLOW_REQUEST_REJECT_SUCCESS, FOLLOW_REQUEST_REJECT_FAIL, NOTIFICATION_SETTINGS_REQUEST, NOTIFICATION_SETTINGS_SUCCESS, NOTIFICATION_SETTINGS_FAIL, BIRTHDAY_REMINDERS_FETCH_REQUEST, BIRTHDAY_REMINDERS_FETCH_SUCCESS, BIRTHDAY_REMINDERS_FETCH_FAIL, createAccount, fetchAccount, fetchAccountByUsername, fetchAccountRequest, fetchAccountSuccess, fetchAccountFail, followAccount, unfollowAccount, followAccountRequest, followAccountSuccess, followAccountFail, unfollowAccountRequest, unfollowAccountSuccess, unfollowAccountFail, blockAccount, unblockAccount, blockAccountRequest, blockAccountSuccess, blockAccountFail, unblockAccountRequest, unblockAccountSuccess, unblockAccountFail, muteAccount, unmuteAccount, muteAccountRequest, muteAccountSuccess, muteAccountFail, unmuteAccountRequest, unmuteAccountSuccess, unmuteAccountFail, subscribeAccount, unsubscribeAccount, subscribeAccountRequest, subscribeAccountSuccess, subscribeAccountFail, unsubscribeAccountRequest, unsubscribeAccountSuccess, unsubscribeAccountFail, removeFromFollowers, removeFromFollowersRequest, removeFromFollowersSuccess, removeFromFollowersFail, fetchFollowers, fetchFollowersRequest, fetchFollowersSuccess, fetchFollowersFail, expandFollowers, expandFollowersRequest, expandFollowersSuccess, expandFollowersFail, fetchFollowing, fetchFollowingRequest, fetchFollowingSuccess, fetchFollowingFail, expandFollowing, expandFollowingRequest, expandFollowingSuccess, expandFollowingFail, fetchRelationships, fetchRelationshipsRequest, fetchRelationshipsSuccess, fetchRelationshipsFail, fetchFollowRequests, fetchFollowRequestsRequest, fetchFollowRequestsSuccess, fetchFollowRequestsFail, expandFollowRequests, expandFollowRequestsRequest, expandFollowRequestsSuccess, expandFollowRequestsFail, authorizeFollowRequest, authorizeFollowRequestRequest, authorizeFollowRequestSuccess, authorizeFollowRequestFail, rejectFollowRequest, rejectFollowRequestRequest, rejectFollowRequestSuccess, rejectFollowRequestFail, pinAccount, unpinAccount, updateNotificationSettings, pinAccountRequest, pinAccountSuccess, pinAccountFail, unpinAccountRequest, unpinAccountSuccess, unpinAccountFail, fetchPinnedAccounts, fetchPinnedAccountsRequest, fetchPinnedAccountsSuccess, fetchPinnedAccountsFail, accountSearch, accountLookup, fetchBirthdayReminders };