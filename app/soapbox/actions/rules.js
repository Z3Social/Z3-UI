import api from '../api';
const RULES_FETCH_REQUEST = 'RULES_FETCH_REQUEST';
const RULES_FETCH_SUCCESS = 'RULES_FETCH_SUCCESS';
const fetchRules = () => (dispatch, getState) => {
  dispatch({
    type: RULES_FETCH_REQUEST
  });
  return api(getState).get('/api/v1/instance/rules').then(response => dispatch({
    type: RULES_FETCH_SUCCESS,
    payload: response.data
  }));
};
export { fetchRules, RULES_FETCH_REQUEST, RULES_FETCH_SUCCESS };