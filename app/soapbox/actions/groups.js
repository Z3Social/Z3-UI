import { isLoggedIn } from 'soapbox/utils/auth';
import api, { getLinks } from '../api';
import { fetchRelationships } from './accounts';
import { importFetchedAccounts } from './importer';
const GROUP_FETCH_REQUEST = 'GROUP_FETCH_REQUEST';
const GROUP_FETCH_SUCCESS = 'GROUP_FETCH_SUCCESS';
const GROUP_FETCH_FAIL = 'GROUP_FETCH_FAIL';
const GROUP_RELATIONSHIPS_FETCH_REQUEST = 'GROUP_RELATIONSHIPS_FETCH_REQUEST';
const GROUP_RELATIONSHIPS_FETCH_SUCCESS = 'GROUP_RELATIONSHIPS_FETCH_SUCCESS';
const GROUP_RELATIONSHIPS_FETCH_FAIL = 'GROUP_RELATIONSHIPS_FETCH_FAIL';
const GROUPS_FETCH_REQUEST = 'GROUPS_FETCH_REQUEST';
const GROUPS_FETCH_SUCCESS = 'GROUPS_FETCH_SUCCESS';
const GROUPS_FETCH_FAIL = 'GROUPS_FETCH_FAIL';
const GROUP_JOIN_REQUEST = 'GROUP_JOIN_REQUEST';
const GROUP_JOIN_SUCCESS = 'GROUP_JOIN_SUCCESS';
const GROUP_JOIN_FAIL = 'GROUP_JOIN_FAIL';
const GROUP_LEAVE_REQUEST = 'GROUP_LEAVE_REQUEST';
const GROUP_LEAVE_SUCCESS = 'GROUP_LEAVE_SUCCESS';
const GROUP_LEAVE_FAIL = 'GROUP_LEAVE_FAIL';
const GROUP_MEMBERS_FETCH_REQUEST = 'GROUP_MEMBERS_FETCH_REQUEST';
const GROUP_MEMBERS_FETCH_SUCCESS = 'GROUP_MEMBERS_FETCH_SUCCESS';
const GROUP_MEMBERS_FETCH_FAIL = 'GROUP_MEMBERS_FETCH_FAIL';
const GROUP_MEMBERS_EXPAND_REQUEST = 'GROUP_MEMBERS_EXPAND_REQUEST';
const GROUP_MEMBERS_EXPAND_SUCCESS = 'GROUP_MEMBERS_EXPAND_SUCCESS';
const GROUP_MEMBERS_EXPAND_FAIL = 'GROUP_MEMBERS_EXPAND_FAIL';
const GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST = 'GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST';
const GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS';
const GROUP_REMOVED_ACCOUNTS_FETCH_FAIL = 'GROUP_REMOVED_ACCOUNTS_FETCH_FAIL';
const GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST = 'GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST';
const GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS';
const GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL = 'GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL';
const GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST = 'GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST';
const GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS';
const GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL = 'GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL';
const GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST = 'GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST';
const GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS';
const GROUP_REMOVED_ACCOUNTS_CREATE_FAIL = 'GROUP_REMOVED_ACCOUNTS_CREATE_FAIL';
const GROUP_REMOVE_STATUS_REQUEST = 'GROUP_REMOVE_STATUS_REQUEST';
const GROUP_REMOVE_STATUS_SUCCESS = 'GROUP_REMOVE_STATUS_SUCCESS';
const GROUP_REMOVE_STATUS_FAIL = 'GROUP_REMOVE_STATUS_FAIL';

const fetchGroup = id => (dispatch, getState) => {
  dispatch(fetchGroupRelationships([id]));
  if (getState().groups.get(id)) {
    return;
  }
  dispatch(fetchGroupRequest(id));
  api(getState).get(`/api/v1/groups/${id}`).then(({
    data
  }) => dispatch(fetchGroupSuccess(data))).catch(err => dispatch(fetchGroupFail(id, err)));
};

const fetchGroupRequest = id => ({
  type: GROUP_FETCH_REQUEST,
  id
});
const fetchGroupSuccess = group => ({
  type: GROUP_FETCH_SUCCESS,
  group
});
const fetchGroupFail = (id, error) => ({
  type: GROUP_FETCH_FAIL,
  id,
  error
});

const fetchGroupRelationships = groupIds => (dispatch, getState) => {
  const loadedRelationships = getState().group_relationships;
  const newGroupIds = groupIds.filter(id => loadedRelationships.get(id, null) === null);
  if (newGroupIds.length === 0) {
    return;
  }
  dispatch(fetchGroupRelationshipsRequest(newGroupIds));
  api(getState).get(`/api/v1/groups/${newGroupIds[0]}/relationships?${newGroupIds.map(id => `id[]=${id}`).join('&')}`).then(response => {
    dispatch(fetchGroupRelationshipsSuccess(response.data));
  }).catch(error => {
    dispatch(fetchGroupRelationshipsFail(error));
  });
};

const fetchGroupRelationshipsRequest = ids => ({
  type: GROUP_RELATIONSHIPS_FETCH_REQUEST,
  ids,
  skipLoading: true
});
const fetchGroupRelationshipsSuccess = relationships => ({
  type: GROUP_RELATIONSHIPS_FETCH_SUCCESS,
  relationships,
  skipLoading: true
});
const fetchGroupRelationshipsFail = error => ({
  type: GROUP_RELATIONSHIPS_FETCH_FAIL,
  error,
  skipLoading: true
});

const fetchGroups = (tab = 'all') => (dispatch, getState) => {
  dispatch(fetchGroupsRequest());
  api(getState).get('/api/v1/groups?tab=' + tab).then(({
    data
  }) => {
    dispatch(fetchGroupsSuccess(data, tab));
    dispatch(fetchGroupRelationships(data.map(item => item.id)));
  }).catch(err => dispatch(fetchGroupsFail(err)));
};

const fetchGroupsRequest = () => ({
  type: GROUPS_FETCH_REQUEST
});
const fetchGroupsSuccess = (groups, tab) => ({
  type: GROUPS_FETCH_SUCCESS,
  groups,
  tab
});
const fetchGroupsFail = error => ({
  type: GROUPS_FETCH_FAIL,
  error
});

const joinGroup = id => (dispatch, getState) => {
  dispatch(joinGroupRequest(id));
  api(getState).post(`/api/v1/groups/${id}/accounts`).then(response => {
    dispatch(joinGroupSuccess(response.data));
  }).catch(error => {
    dispatch(joinGroupFail(id, error));
  });
};
const joinGroupRequest = id => ({
  type: GROUP_JOIN_REQUEST,
  id
});
const joinGroupSuccess = relationship => ({
  type: GROUP_JOIN_SUCCESS,
  relationship
});
const joinGroupFail = (id, error) => ({
  type: GROUP_JOIN_FAIL,
  id,
  error
});
const leaveGroup = id => (dispatch, getState) => {
  dispatch(leaveGroupRequest(id));
  api(getState).delete(`/api/v1/groups/${id}/accounts`).then(response => {
    dispatch(leaveGroupSuccess(response.data));
  }).catch(error => {
    dispatch(leaveGroupFail(id, error));
  });
};
const leaveGroupRequest = id => ({
  type: GROUP_LEAVE_REQUEST,
  id
});
const leaveGroupSuccess = relationship => ({
  type: GROUP_LEAVE_SUCCESS,
  relationship
});
const leaveGroupFail = (id, error) => ({
  type: GROUP_LEAVE_FAIL,
  id,
  error
});
const fetchGroupMembers = id => (dispatch, getState) => {
  dispatch(fetchGroupMembersRequest());
  api(getState).get(`/api/v1/groups/${id}/accounts`).then(response => {
    const next = getLinks(response).get('next');
    dispatch(importFetchedAccounts(response.data));
    dispatch(fetchRelationships(response.data.map(item => item.id)));
    dispatch(fetchGroupMembersSuccess(id, response.data.map(item => item.id), next));
  }).catch(error => {
    dispatch(fetchGroupMembersFail(id, error));
  });
};
const fetchGroupMembersRequest = () => ({
  type: GROUP_MEMBERS_FETCH_REQUEST
});
const fetchGroupMembersSuccess = (id, accounts, next) => ({
  type: GROUP_MEMBERS_FETCH_SUCCESS,
  id,
  accounts,
  next
});
const fetchGroupMembersFail = (id, error) => ({
  type: GROUP_MEMBERS_FETCH_FAIL,
  id,
  error
});
const expandGroupMembers = (id, url) => (dispatch, getState) => {
  dispatch(expandGroupMembersRequest());
  api(getState).get(url).then(response => {
    const next = getLinks(response).get('next');
    dispatch(importFetchedAccounts(response.data));
    dispatch(fetchRelationships(response.data.map(item => item.id)));
    dispatch(expandGroupMembersSuccess(id, response.data.map(item => item.id), next));
  }).catch(error => {
    dispatch(expandGroupMembersFail(id, error));
  });
};
const expandGroupMembersRequest = () => ({
  type: GROUP_MEMBERS_EXPAND_REQUEST
});
const expandGroupMembersSuccess = (id, accounts, next) => ({
  type: GROUP_MEMBERS_EXPAND_SUCCESS,
  id,
  accounts,
  next
});
const expandGroupMembersFail = (id, error) => ({
  type: GROUP_MEMBERS_EXPAND_FAIL,
  id,
  error
});
const fetchGroupRemovedAccounts = id => (dispatch, getState) => {
  dispatch(fetchGroupRemovedAccountsRequest());
  api(getState).get(`/api/v1/groups/${id}/removed_accounts`).then(response => {
    const next = getLinks(response).get('next');
    dispatch(importFetchedAccounts(response.data));
    dispatch(fetchRelationships(response.data.map(item => item.id)));
    dispatch(fetchGroupRemovedAccountsSuccess(id, response.data.map(item => item.id), next));
  }).catch(error => {
    dispatch(fetchGroupRemovedAccountsFail(id, error));
  });
};
const fetchGroupRemovedAccountsRequest = () => ({
  type: GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST
});
const fetchGroupRemovedAccountsSuccess = (id, accounts, next) => ({
  type: GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS,
  id,
  accounts,
  next
});
const fetchGroupRemovedAccountsFail = (id, error) => ({
  type: GROUP_REMOVED_ACCOUNTS_FETCH_FAIL,
  id,
  error
});
const expandGroupRemovedAccounts = (id, url) => (dispatch, getState) => {
  dispatch(expandGroupRemovedAccountsRequest());
  api(getState).get(url).then(response => {
    const next = getLinks(response).get('next');
    dispatch(importFetchedAccounts(response.data));
    dispatch(fetchRelationships(response.data.map(item => item.id)));
    dispatch(expandGroupRemovedAccountsSuccess(id, response.data.map(item => item.id), next));
  }).catch(error => {
    dispatch(expandGroupRemovedAccountsFail(id, error));
  });
};
const expandGroupRemovedAccountsRequest = () => ({
  type: GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST
});
const expandGroupRemovedAccountsSuccess = (id, accounts, next) => ({
  type: GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS,
  id,
  accounts,
  next
});
const expandGroupRemovedAccountsFail = (id, error) => ({
  type: GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL,
  id,
  error
});
const removeGroupRemovedAccounts = (groupId, id) => (dispatch, getState) => {
  dispatch(removeGroupRemovedAccountsRequest());
  api(getState).delete(`/api/v1/groups/${groupId}/removed_accounts?account_id=${id}`).then(response => {
    dispatch(removeGroupRemovedAccountsSuccess(groupId, id));
  }).catch(error => {
    dispatch(removeGroupRemovedAccountsFail(groupId, id, error));
  });
};
const removeGroupRemovedAccountsRequest = () => ({
  type: GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST
});
const removeGroupRemovedAccountsSuccess = (groupId, id) => ({
  type: GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS,
  groupId,
  id
});
const removeGroupRemovedAccountsFail = (groupId, id, error) => ({
  type: GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL,
  groupId,
  id,
  error
});
const createGroupRemovedAccounts = (groupId, id) => (dispatch, getState) => {
  dispatch(createGroupRemovedAccountsRequest());
  api(getState).post(`/api/v1/groups/${groupId}/removed_accounts?account_id=${id}`).then(response => {
    dispatch(createGroupRemovedAccountsSuccess(groupId, id));
  }).catch(error => {
    dispatch(createGroupRemovedAccountsFail(groupId, id, error));
  });
};
const createGroupRemovedAccountsRequest = () => ({
  type: GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST
});
const createGroupRemovedAccountsSuccess = (groupId, id) => ({
  type: GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS,
  groupId,
  id
});
const createGroupRemovedAccountsFail = (groupId, id, error) => ({
  type: GROUP_REMOVED_ACCOUNTS_CREATE_FAIL,
  groupId,
  id,
  error
});
const removeGroupStatus = (groupId, id) => (dispatch, getState) => {
  dispatch(removeGroupStatusRequest());
  api(getState).delete(`/api/v1/groups/${groupId}/statuses/${id}`).then(response => {
    dispatch(removeGroupStatusSuccess(groupId, id));
  }).catch(error => {
    dispatch(removeGroupStatusFail(groupId, id, error));
  });
};
const removeGroupStatusRequest = () => ({
  type: GROUP_REMOVE_STATUS_REQUEST
});
const removeGroupStatusSuccess = (groupId, id) => ({
  type: GROUP_REMOVE_STATUS_SUCCESS,
  groupId,
  id
});
const removeGroupStatusFail = (groupId, id, error) => ({
  type: GROUP_REMOVE_STATUS_FAIL,
  groupId,
  id,
  error
});
export { GROUP_FETCH_REQUEST, GROUP_FETCH_SUCCESS, GROUP_FETCH_FAIL, GROUP_RELATIONSHIPS_FETCH_REQUEST, GROUP_RELATIONSHIPS_FETCH_SUCCESS, GROUP_RELATIONSHIPS_FETCH_FAIL, GROUPS_FETCH_REQUEST, GROUPS_FETCH_SUCCESS, GROUPS_FETCH_FAIL, GROUP_JOIN_REQUEST, GROUP_JOIN_SUCCESS, GROUP_JOIN_FAIL, GROUP_LEAVE_REQUEST, GROUP_LEAVE_SUCCESS, GROUP_LEAVE_FAIL, GROUP_MEMBERS_FETCH_REQUEST, GROUP_MEMBERS_FETCH_SUCCESS, GROUP_MEMBERS_FETCH_FAIL, GROUP_MEMBERS_EXPAND_REQUEST, GROUP_MEMBERS_EXPAND_SUCCESS, GROUP_MEMBERS_EXPAND_FAIL, GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST, GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS, GROUP_REMOVED_ACCOUNTS_FETCH_FAIL, GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST, GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS, GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL, GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST, GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS, GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL, GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST, GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS, GROUP_REMOVED_ACCOUNTS_CREATE_FAIL, GROUP_REMOVE_STATUS_REQUEST, GROUP_REMOVE_STATUS_SUCCESS, GROUP_REMOVE_STATUS_FAIL, fetchGroup, fetchGroupRequest, fetchGroupSuccess, fetchGroupFail, fetchGroupRelationships, fetchGroupRelationshipsRequest, fetchGroupRelationshipsSuccess, fetchGroupRelationshipsFail, fetchGroups, fetchGroupsRequest, fetchGroupsSuccess, fetchGroupsFail, joinGroup, joinGroupRequest, joinGroupSuccess, joinGroupFail, leaveGroup, leaveGroupRequest, leaveGroupSuccess, leaveGroupFail, fetchGroupMembers, fetchGroupMembersRequest, fetchGroupMembersSuccess, fetchGroupMembersFail, expandGroupMembers, expandGroupMembersRequest, expandGroupMembersSuccess, expandGroupMembersFail, fetchGroupRemovedAccounts, fetchGroupRemovedAccountsRequest, fetchGroupRemovedAccountsSuccess, fetchGroupRemovedAccountsFail, expandGroupRemovedAccounts, expandGroupRemovedAccountsRequest, expandGroupRemovedAccountsSuccess, expandGroupRemovedAccountsFail, removeGroupRemovedAccounts, removeGroupRemovedAccountsRequest, removeGroupRemovedAccountsSuccess, removeGroupRemovedAccountsFail, createGroupRemovedAccounts, createGroupRemovedAccountsRequest, createGroupRemovedAccountsSuccess, createGroupRemovedAccountsFail, removeGroupStatus, removeGroupStatusRequest, removeGroupStatusSuccess, removeGroupStatusFail };
