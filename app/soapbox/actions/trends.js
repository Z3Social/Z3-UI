import api from '../api';
const TRENDS_FETCH_REQUEST = 'TRENDS_FETCH_REQUEST';
const TRENDS_FETCH_SUCCESS = 'TRENDS_FETCH_SUCCESS';
const TRENDS_FETCH_FAIL = 'TRENDS_FETCH_FAIL';
const fetchTrends = () => (dispatch, getState) => {
  dispatch(fetchTrendsRequest());
  api(getState).get('/api/v1/trends').then(response => {
    dispatch(fetchTrendsSuccess(response.data));
  }).catch(error => dispatch(fetchTrendsFail(error)));
};
const fetchTrendsRequest = () => ({
  type: TRENDS_FETCH_REQUEST,
  skipLoading: true
});
const fetchTrendsSuccess = tags => ({
  type: TRENDS_FETCH_SUCCESS,
  tags,
  skipLoading: true
});
const fetchTrendsFail = error => ({
  type: TRENDS_FETCH_FAIL,
  error,
  skipLoading: true,
  skipAlert: true
});
export { TRENDS_FETCH_REQUEST, TRENDS_FETCH_SUCCESS, TRENDS_FETCH_FAIL, fetchTrends, fetchTrendsRequest, fetchTrendsSuccess, fetchTrendsFail };