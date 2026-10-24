import api from 'soapbox/api';
import { importFetchedAccounts } from './importer';
const HISTORY_FETCH_REQUEST = 'HISTORY_FETCH_REQUEST';
const HISTORY_FETCH_SUCCESS = 'HISTORY_FETCH_SUCCESS';
const HISTORY_FETCH_FAIL = 'HISTORY_FETCH_FAIL';
const fetchHistory = statusId => (dispatch, getState) => {
  const loading = getState().history.getIn([statusId, 'loading']);
  if (loading) {
    return;
  }
  dispatch(fetchHistoryRequest(statusId));
  api(getState).get(`/api/v1/statuses/${statusId}/history`).then(({
    data
  }) => {
    dispatch(importFetchedAccounts(data.map(x => x.account)));
    dispatch(fetchHistorySuccess(statusId, data));
  }).catch(error => dispatch(fetchHistoryFail(error)));
};
const fetchHistoryRequest = statusId => ({
  type: HISTORY_FETCH_REQUEST,
  statusId
});
const fetchHistorySuccess = (statusId, history) => ({
  type: HISTORY_FETCH_SUCCESS,
  statusId,
  history
});
const fetchHistoryFail = error => ({
  type: HISTORY_FETCH_FAIL,
  error
});
export { HISTORY_FETCH_REQUEST, HISTORY_FETCH_SUCCESS, HISTORY_FETCH_FAIL, fetchHistory, fetchHistoryRequest, fetchHistorySuccess, fetchHistoryFail };