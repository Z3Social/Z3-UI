import { defineMessages } from 'react-intl';
import { isLoggedIn } from 'soapbox/utils/auth';
import { getFeatures } from 'soapbox/utils/features';
import api from '../api';
import { showAlertForError } from './alerts';
import { importFetchedAccounts } from './importer';
import { patchMeSuccess } from './me';
import snackbar from './snackbar';
const ALIASES_FETCH_REQUEST = 'ALIASES_FETCH_REQUEST';
const ALIASES_FETCH_SUCCESS = 'ALIASES_FETCH_SUCCESS';
const ALIASES_FETCH_FAIL = 'ALIASES_FETCH_FAIL';
const ALIASES_SUGGESTIONS_CHANGE = 'ALIASES_SUGGESTIONS_CHANGE';
const ALIASES_SUGGESTIONS_READY = 'ALIASES_SUGGESTIONS_READY';
const ALIASES_SUGGESTIONS_CLEAR = 'ALIASES_SUGGESTIONS_CLEAR';
const ALIASES_ADD_REQUEST = 'ALIASES_ADD_REQUEST';
const ALIASES_ADD_SUCCESS = 'ALIASES_ADD_SUCCESS';
const ALIASES_ADD_FAIL = 'ALIASES_ADD_FAIL';
const ALIASES_REMOVE_REQUEST = 'ALIASES_REMOVE_REQUEST';
const ALIASES_REMOVE_SUCCESS = 'ALIASES_REMOVE_SUCCESS';
const ALIASES_REMOVE_FAIL = 'ALIASES_REMOVE_FAIL';
const messages = defineMessages({
  createSuccess: {
    id: 'aliases.success.add',
    defaultMessage: 'Account alias created successfully'
  },
  removeSuccess: {
    id: 'aliases.success.remove',
    defaultMessage: 'Account alias removed successfully'
  }
});
const fetchAliases = (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  const state = getState();
  const instance = state.instance;
  const features = getFeatures(instance);
  if (!features.accountMoving) return;
  dispatch(fetchAliasesRequest());
  api(getState).get('/api/pleroma/aliases').then(response => {
    dispatch(fetchAliasesSuccess(response.data.aliases));
  }).catch(err => dispatch(fetchAliasesFail(err)));
};
const fetchAliasesRequest = () => ({
  type: ALIASES_FETCH_REQUEST
});
const fetchAliasesSuccess = aliases => ({
  type: ALIASES_FETCH_SUCCESS,
  value: aliases
});
const fetchAliasesFail = error => ({
  type: ALIASES_FETCH_FAIL,
  error
});
const fetchAliasesSuggestions = q => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  const params = {
    q,
    resolve: true,
    limit: 4
  };
  api(getState).get('/api/v1/accounts/search', {
    params
  }).then(({
    data
  }) => {
    dispatch(importFetchedAccounts(data));
    dispatch(fetchAliasesSuggestionsReady(q, data));
  }).catch(error => dispatch(showAlertForError(error)));
};
const fetchAliasesSuggestionsReady = (query, accounts) => ({
  type: ALIASES_SUGGESTIONS_READY,
  query,
  accounts
});
const clearAliasesSuggestions = () => ({
  type: ALIASES_SUGGESTIONS_CLEAR
});
const changeAliasesSuggestions = value => ({
  type: ALIASES_SUGGESTIONS_CHANGE,
  value
});
const addToAliases = account => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  const state = getState();
  const instance = state.instance;
  const features = getFeatures(instance);
  if (!features.accountMoving) {
    const me = state.me;
    const alsoKnownAs = state.accounts_meta.get(me).pleroma.get('also_known_as');
    dispatch(addToAliasesRequest());
    api(getState).patch('/api/v1/accounts/update_credentials', {
      also_known_as: [...alsoKnownAs, account.pleroma.get('ap_id')]
    }).then(response => {
      dispatch(snackbar.success(messages.createSuccess));
      dispatch(addToAliasesSuccess);
      dispatch(patchMeSuccess(response.data));
    }).catch(err => dispatch(addToAliasesFail(err)));
    return;
  }
  dispatch(addToAliasesRequest());
  api(getState).put('/api/pleroma/aliases', {
    alias: account.acct
  }).then(() => {
    dispatch(snackbar.success(messages.createSuccess));
    dispatch(addToAliasesSuccess);
    dispatch(fetchAliases);
  }).catch(err => dispatch(fetchAliasesFail(err)));
};
const addToAliasesRequest = () => ({
  type: ALIASES_ADD_REQUEST
});
const addToAliasesSuccess = () => ({
  type: ALIASES_ADD_SUCCESS
});
const addToAliasesFail = error => ({
  type: ALIASES_ADD_FAIL,
  error
});
const removeFromAliases = account => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  const state = getState();
  const instance = state.instance;
  const features = getFeatures(instance);
  if (!features.accountMoving) {
    const me = state.me;
    const alsoKnownAs = state.accounts_meta.get(me).pleroma.get('also_known_as');
    dispatch(removeFromAliasesRequest());
    api(getState).patch('/api/v1/accounts/update_credentials', {
      also_known_as: alsoKnownAs.filter(id => id !== account)
    }).then(response => {
      dispatch(snackbar.success(messages.removeSuccess));
      dispatch(removeFromAliasesSuccess);
      dispatch(patchMeSuccess(response.data));
    }).catch(err => dispatch(removeFromAliasesFail(err)));
    return;
  }
  dispatch(addToAliasesRequest());
  api(getState).delete('/api/pleroma/aliases', {
    data: {
      alias: account
    }
  }).then(response => {
    dispatch(snackbar.success(messages.removeSuccess));
    dispatch(removeFromAliasesSuccess);
    dispatch(fetchAliases);
  }).catch(err => dispatch(fetchAliasesFail(err)));
};
const removeFromAliasesRequest = () => ({
  type: ALIASES_REMOVE_REQUEST
});
const removeFromAliasesSuccess = () => ({
  type: ALIASES_REMOVE_SUCCESS
});
const removeFromAliasesFail = error => ({
  type: ALIASES_REMOVE_FAIL,
  error
});
export { ALIASES_FETCH_REQUEST, ALIASES_FETCH_SUCCESS, ALIASES_FETCH_FAIL, ALIASES_SUGGESTIONS_CHANGE, ALIASES_SUGGESTIONS_READY, ALIASES_SUGGESTIONS_CLEAR, ALIASES_ADD_REQUEST, ALIASES_ADD_SUCCESS, ALIASES_ADD_FAIL, ALIASES_REMOVE_REQUEST, ALIASES_REMOVE_SUCCESS, ALIASES_REMOVE_FAIL, fetchAliases, fetchAliasesRequest, fetchAliasesSuccess, fetchAliasesFail, fetchAliasesSuggestions, fetchAliasesSuggestionsReady, clearAliasesSuggestions, changeAliasesSuggestions, addToAliases, addToAliasesRequest, addToAliasesSuccess, addToAliasesFail, removeFromAliases, removeFromAliasesRequest, removeFromAliasesSuccess, removeFromAliasesFail };