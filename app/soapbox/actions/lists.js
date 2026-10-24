import { isLoggedIn } from 'soapbox/utils/auth';
import api from '../api';
import { showAlertForError } from './alerts';
import { importFetchedAccounts } from './importer';
const LIST_FETCH_REQUEST = 'LIST_FETCH_REQUEST';
const LIST_FETCH_SUCCESS = 'LIST_FETCH_SUCCESS';
const LIST_FETCH_FAIL = 'LIST_FETCH_FAIL';
const LISTS_FETCH_REQUEST = 'LISTS_FETCH_REQUEST';
const LISTS_FETCH_SUCCESS = 'LISTS_FETCH_SUCCESS';
const LISTS_FETCH_FAIL = 'LISTS_FETCH_FAIL';
const LIST_EDITOR_TITLE_CHANGE = 'LIST_EDITOR_TITLE_CHANGE';
const LIST_EDITOR_RESET = 'LIST_EDITOR_RESET';
const LIST_EDITOR_SETUP = 'LIST_EDITOR_SETUP';
const LIST_CREATE_REQUEST = 'LIST_CREATE_REQUEST';
const LIST_CREATE_SUCCESS = 'LIST_CREATE_SUCCESS';
const LIST_CREATE_FAIL = 'LIST_CREATE_FAIL';
const LIST_UPDATE_REQUEST = 'LIST_UPDATE_REQUEST';
const LIST_UPDATE_SUCCESS = 'LIST_UPDATE_SUCCESS';
const LIST_UPDATE_FAIL = 'LIST_UPDATE_FAIL';
const LIST_DELETE_REQUEST = 'LIST_DELETE_REQUEST';
const LIST_DELETE_SUCCESS = 'LIST_DELETE_SUCCESS';
const LIST_DELETE_FAIL = 'LIST_DELETE_FAIL';
const LIST_ACCOUNTS_FETCH_REQUEST = 'LIST_ACCOUNTS_FETCH_REQUEST';
const LIST_ACCOUNTS_FETCH_SUCCESS = 'LIST_ACCOUNTS_FETCH_SUCCESS';
const LIST_ACCOUNTS_FETCH_FAIL = 'LIST_ACCOUNTS_FETCH_FAIL';
const LIST_EDITOR_SUGGESTIONS_CHANGE = 'LIST_EDITOR_SUGGESTIONS_CHANGE';
const LIST_EDITOR_SUGGESTIONS_READY = 'LIST_EDITOR_SUGGESTIONS_READY';
const LIST_EDITOR_SUGGESTIONS_CLEAR = 'LIST_EDITOR_SUGGESTIONS_CLEAR';
const LIST_EDITOR_ADD_REQUEST = 'LIST_EDITOR_ADD_REQUEST';
const LIST_EDITOR_ADD_SUCCESS = 'LIST_EDITOR_ADD_SUCCESS';
const LIST_EDITOR_ADD_FAIL = 'LIST_EDITOR_ADD_FAIL';
const LIST_EDITOR_REMOVE_REQUEST = 'LIST_EDITOR_REMOVE_REQUEST';
const LIST_EDITOR_REMOVE_SUCCESS = 'LIST_EDITOR_REMOVE_SUCCESS';
const LIST_EDITOR_REMOVE_FAIL = 'LIST_EDITOR_REMOVE_FAIL';
const LIST_ADDER_RESET = 'LIST_ADDER_RESET';
const LIST_ADDER_SETUP = 'LIST_ADDER_SETUP';
const LIST_ADDER_LISTS_FETCH_REQUEST = 'LIST_ADDER_LISTS_FETCH_REQUEST';
const LIST_ADDER_LISTS_FETCH_SUCCESS = 'LIST_ADDER_LISTS_FETCH_SUCCESS';
const LIST_ADDER_LISTS_FETCH_FAIL = 'LIST_ADDER_LISTS_FETCH_FAIL';
const fetchList = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  if (getState().lists.get(String(id))) {
    return;
  }
  dispatch(fetchListRequest(id));
  api(getState).get(`/api/v1/lists/${id}`).then(({
    data
  }) => dispatch(fetchListSuccess(data))).catch(err => dispatch(fetchListFail(id, err)));
};
const fetchListRequest = id => ({
  type: LIST_FETCH_REQUEST,
  id
});
const fetchListSuccess = list => ({
  type: LIST_FETCH_SUCCESS,
  list
});
const fetchListFail = (id, error) => ({
  type: LIST_FETCH_FAIL,
  id,
  error
});
const fetchLists = () => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  dispatch(fetchListsRequest());
  api(getState).get('/api/v1/lists').then(({
    data
  }) => dispatch(fetchListsSuccess(data))).catch(err => dispatch(fetchListsFail(err)));
};
const fetchListsRequest = () => ({
  type: LISTS_FETCH_REQUEST
});
const fetchListsSuccess = lists => ({
  type: LISTS_FETCH_SUCCESS,
  lists
});
const fetchListsFail = error => ({
  type: LISTS_FETCH_FAIL,
  error
});
const submitListEditor = shouldReset => (dispatch, getState) => {
  const listId = getState().listEditor.listId;
  const title = getState().listEditor.title;
  if (listId === null) {
    dispatch(createList(title, shouldReset));
  } else {
    dispatch(updateList(listId, title, shouldReset));
  }
};
const setupListEditor = listId => (dispatch, getState) => {
  dispatch({
    type: LIST_EDITOR_SETUP,
    list: getState().lists.get(String(listId))
  });
  dispatch(fetchListAccounts(listId));
};
const changeListEditorTitle = value => ({
  type: LIST_EDITOR_TITLE_CHANGE,
  value
});
const createList = (title, shouldReset) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  dispatch(createListRequest());
  api(getState).post('/api/v1/lists', {
    title
  }).then(({
    data
  }) => {
    dispatch(createListSuccess(data));
    if (shouldReset) {
      dispatch(resetListEditor());
    }
  }).catch(err => dispatch(createListFail(err)));
};
const createListRequest = () => ({
  type: LIST_CREATE_REQUEST
});
const createListSuccess = list => ({
  type: LIST_CREATE_SUCCESS,
  list
});
const createListFail = error => ({
  type: LIST_CREATE_FAIL,
  error
});
const updateList = (id, title, shouldReset) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  dispatch(updateListRequest(id));
  api(getState).put(`/api/v1/lists/${id}`, {
    title
  }).then(({
    data
  }) => {
    dispatch(updateListSuccess(data));
    if (shouldReset) {
      dispatch(resetListEditor());
    }
  }).catch(err => dispatch(updateListFail(id, err)));
};
const updateListRequest = id => ({
  type: LIST_UPDATE_REQUEST,
  id
});
const updateListSuccess = list => ({
  type: LIST_UPDATE_SUCCESS,
  list
});
const updateListFail = (id, error) => ({
  type: LIST_UPDATE_FAIL,
  id,
  error
});
const resetListEditor = () => ({
  type: LIST_EDITOR_RESET
});
const deleteList = id => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  dispatch(deleteListRequest(id));
  api(getState).delete(`/api/v1/lists/${id}`).then(() => dispatch(deleteListSuccess(id))).catch(err => dispatch(deleteListFail(id, err)));
};
const deleteListRequest = id => ({
  type: LIST_DELETE_REQUEST,
  id
});
const deleteListSuccess = id => ({
  type: LIST_DELETE_SUCCESS,
  id
});
const deleteListFail = (id, error) => ({
  type: LIST_DELETE_FAIL,
  id,
  error
});
const fetchListAccounts = listId => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  dispatch(fetchListAccountsRequest(listId));
  api(getState).get(`/api/v1/lists/${listId}/accounts`, {
    params: {
      limit: 0
    }
  }).then(({
    data
  }) => {
    dispatch(importFetchedAccounts(data));
    dispatch(fetchListAccountsSuccess(listId, data, null));
  }).catch(err => dispatch(fetchListAccountsFail(listId, err)));
};
const fetchListAccountsRequest = id => ({
  type: LIST_ACCOUNTS_FETCH_REQUEST,
  id
});
const fetchListAccountsSuccess = (id, accounts, next) => ({
  type: LIST_ACCOUNTS_FETCH_SUCCESS,
  id,
  accounts,
  next
});
const fetchListAccountsFail = (id, error) => ({
  type: LIST_ACCOUNTS_FETCH_FAIL,
  id,
  error
});
const fetchListSuggestions = q => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  const params = {
    q,
    resolve: false,
    limit: 4,
    following: true
  };
  api(getState).get('/api/v1/accounts/search', {
    params
  }).then(({
    data
  }) => {
    dispatch(importFetchedAccounts(data));
    dispatch(fetchListSuggestionsReady(q, data));
  }).catch(error => dispatch(showAlertForError(error)));
};
const fetchListSuggestionsReady = (query, accounts) => ({
  type: LIST_EDITOR_SUGGESTIONS_READY,
  query,
  accounts
});
const clearListSuggestions = () => ({
  type: LIST_EDITOR_SUGGESTIONS_CLEAR
});
const changeListSuggestions = value => ({
  type: LIST_EDITOR_SUGGESTIONS_CHANGE,
  value
});
const addToListEditor = accountId => (dispatch, getState) => {
  dispatch(addToList(getState().listEditor.listId, accountId));
};
const addToList = (listId, accountId) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  dispatch(addToListRequest(listId, accountId));
  api(getState).post(`/api/v1/lists/${listId}/accounts`, {
    account_ids: [accountId]
  }).then(() => dispatch(addToListSuccess(listId, accountId))).catch(err => dispatch(addToListFail(listId, accountId, err)));
};
const addToListRequest = (listId, accountId) => ({
  type: LIST_EDITOR_ADD_REQUEST,
  listId,
  accountId
});
const addToListSuccess = (listId, accountId) => ({
  type: LIST_EDITOR_ADD_SUCCESS,
  listId,
  accountId
});
const addToListFail = (listId, accountId, error) => ({
  type: LIST_EDITOR_ADD_FAIL,
  listId,
  accountId,
  error
});
const removeFromListEditor = accountId => (dispatch, getState) => {
  dispatch(removeFromList(getState().listEditor.listId, accountId));
};
const removeFromList = (listId, accountId) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  dispatch(removeFromListRequest(listId, accountId));
  api(getState).delete(`/api/v1/lists/${listId}/accounts`, {
    params: {
      account_ids: [accountId]
    }
  }).then(() => dispatch(removeFromListSuccess(listId, accountId))).catch(err => dispatch(removeFromListFail(listId, accountId, err)));
};
const removeFromListRequest = (listId, accountId) => ({
  type: LIST_EDITOR_REMOVE_REQUEST,
  listId,
  accountId
});
const removeFromListSuccess = (listId, accountId) => ({
  type: LIST_EDITOR_REMOVE_SUCCESS,
  listId,
  accountId
});
const removeFromListFail = (listId, accountId, error) => ({
  type: LIST_EDITOR_REMOVE_FAIL,
  listId,
  accountId,
  error
});
const resetListAdder = () => ({
  type: LIST_ADDER_RESET
});
const setupListAdder = accountId => (dispatch, getState) => {
  dispatch({
    type: LIST_ADDER_SETUP,
    account: getState().accounts.get(accountId)
  });
  dispatch(fetchLists());
  dispatch(fetchAccountLists(accountId));
};
const fetchAccountLists = accountId => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  dispatch(fetchAccountListsRequest(accountId));
  api(getState).get(`/api/v1/accounts/${accountId}/lists`).then(({
    data
  }) => dispatch(fetchAccountListsSuccess(accountId, data))).catch(err => dispatch(fetchAccountListsFail(accountId, err)));
};
const fetchAccountListsRequest = id => ({
  type: LIST_ADDER_LISTS_FETCH_REQUEST,
  id
});
const fetchAccountListsSuccess = (id, lists) => ({
  type: LIST_ADDER_LISTS_FETCH_SUCCESS,
  id,
  lists
});
const fetchAccountListsFail = (id, err) => ({
  type: LIST_ADDER_LISTS_FETCH_FAIL,
  id,
  err
});
const addToListAdder = listId => (dispatch, getState) => {
  dispatch(addToList(listId, getState().listAdder.accountId));
};
const removeFromListAdder = listId => (dispatch, getState) => {
  dispatch(removeFromList(listId, getState().listAdder.accountId));
};
export { LIST_FETCH_REQUEST, LIST_FETCH_SUCCESS, LIST_FETCH_FAIL, LISTS_FETCH_REQUEST, LISTS_FETCH_SUCCESS, LISTS_FETCH_FAIL, LIST_EDITOR_TITLE_CHANGE, LIST_EDITOR_RESET, LIST_EDITOR_SETUP, LIST_CREATE_REQUEST, LIST_CREATE_SUCCESS, LIST_CREATE_FAIL, LIST_UPDATE_REQUEST, LIST_UPDATE_SUCCESS, LIST_UPDATE_FAIL, LIST_DELETE_REQUEST, LIST_DELETE_SUCCESS, LIST_DELETE_FAIL, LIST_ACCOUNTS_FETCH_REQUEST, LIST_ACCOUNTS_FETCH_SUCCESS, LIST_ACCOUNTS_FETCH_FAIL, LIST_EDITOR_SUGGESTIONS_CHANGE, LIST_EDITOR_SUGGESTIONS_READY, LIST_EDITOR_SUGGESTIONS_CLEAR, LIST_EDITOR_ADD_REQUEST, LIST_EDITOR_ADD_SUCCESS, LIST_EDITOR_ADD_FAIL, LIST_EDITOR_REMOVE_REQUEST, LIST_EDITOR_REMOVE_SUCCESS, LIST_EDITOR_REMOVE_FAIL, LIST_ADDER_RESET, LIST_ADDER_SETUP, LIST_ADDER_LISTS_FETCH_REQUEST, LIST_ADDER_LISTS_FETCH_SUCCESS, LIST_ADDER_LISTS_FETCH_FAIL, fetchList, fetchListRequest, fetchListSuccess, fetchListFail, fetchLists, fetchListsRequest, fetchListsSuccess, fetchListsFail, submitListEditor, setupListEditor, changeListEditorTitle, createList, createListRequest, createListSuccess, createListFail, updateList, updateListRequest, updateListSuccess, updateListFail, resetListEditor, deleteList, deleteListRequest, deleteListSuccess, deleteListFail, fetchListAccounts, fetchListAccountsRequest, fetchListAccountsSuccess, fetchListAccountsFail, fetchListSuggestions, fetchListSuggestionsReady, clearListSuggestions, changeListSuggestions, addToListEditor, addToList, addToListRequest, addToListSuccess, addToListFail, removeFromListEditor, removeFromList, removeFromListRequest, removeFromListSuccess, removeFromListFail, resetListAdder, setupListAdder, fetchAccountLists, fetchAccountListsRequest, fetchAccountListsSuccess, fetchAccountListsFail, addToListAdder, removeFromListAdder };