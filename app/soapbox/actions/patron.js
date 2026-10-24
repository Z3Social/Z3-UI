import api from '../api';
const PATRON_INSTANCE_FETCH_REQUEST = 'PATRON_INSTANCE_FETCH_REQUEST';
const PATRON_INSTANCE_FETCH_SUCCESS = 'PATRON_INSTANCE_FETCH_SUCCESS';
const PATRON_INSTANCE_FETCH_FAIL = 'PATRON_INSTANCE_FETCH_FAIL';
const PATRON_ACCOUNT_FETCH_REQUEST = 'PATRON_ACCOUNT_FETCH_REQUEST';
const PATRON_ACCOUNT_FETCH_SUCCESS = 'PATRON_ACCOUNT_FETCH_SUCCESS';
const PATRON_ACCOUNT_FETCH_FAIL = 'PATRON_ACCOUNT_FETCH_FAIL';
const fetchPatronInstance = () => (dispatch, getState) => {
  dispatch({
    type: PATRON_INSTANCE_FETCH_REQUEST
  });
  return api(getState).get('/api/patron/v1/instance').then(response => {
    dispatch(importFetchedInstance(response.data));
  }).catch(error => {
    dispatch(fetchInstanceFail(error));
  });
};
const fetchPatronAccount = apId => (dispatch, getState) => {
  apId = encodeURIComponent(apId);
  dispatch({
    type: PATRON_ACCOUNT_FETCH_REQUEST
  });
  api(getState).get(`/api/patron/v1/accounts/${apId}`).then(response => {
    dispatch(importFetchedAccount(response.data));
  }).catch(error => {
    dispatch(fetchAccountFail(error));
  });
};
const importFetchedInstance = instance => ({
  type: PATRON_INSTANCE_FETCH_SUCCESS,
  instance
});
const fetchInstanceFail = error => ({
  type: PATRON_INSTANCE_FETCH_FAIL,
  error,
  skipAlert: true
});
const importFetchedAccount = account => ({
  type: PATRON_ACCOUNT_FETCH_SUCCESS,
  account
});
const fetchAccountFail = error => ({
  type: PATRON_ACCOUNT_FETCH_FAIL,
  error,
  skipAlert: true
});
export { PATRON_INSTANCE_FETCH_REQUEST, PATRON_INSTANCE_FETCH_SUCCESS, PATRON_INSTANCE_FETCH_FAIL, PATRON_ACCOUNT_FETCH_REQUEST, PATRON_ACCOUNT_FETCH_SUCCESS, PATRON_ACCOUNT_FETCH_FAIL, fetchPatronInstance, fetchPatronAccount, importFetchedInstance, fetchInstanceFail, importFetchedAccount, fetchAccountFail };