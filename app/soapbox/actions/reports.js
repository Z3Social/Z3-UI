import api from '../api';
import { openModal } from './modals';
const REPORT_INIT = 'REPORT_INIT';
const REPORT_CANCEL = 'REPORT_CANCEL';
const REPORT_SUBMIT_REQUEST = 'REPORT_SUBMIT_REQUEST';
const REPORT_SUBMIT_SUCCESS = 'REPORT_SUBMIT_SUCCESS';
const REPORT_SUBMIT_FAIL = 'REPORT_SUBMIT_FAIL';
const REPORT_STATUS_TOGGLE = 'REPORT_STATUS_TOGGLE';
const REPORT_COMMENT_CHANGE = 'REPORT_COMMENT_CHANGE';
const REPORT_FORWARD_CHANGE = 'REPORT_FORWARD_CHANGE';
const REPORT_BLOCK_CHANGE = 'REPORT_BLOCK_CHANGE';
const REPORT_RULE_CHANGE = 'REPORT_RULE_CHANGE';
const initReport = (account, status) => dispatch => {
  dispatch({
    type: REPORT_INIT,
    account,
    status
  });
  return dispatch(openModal('REPORT'));
};
const initReportById = accountId => (dispatch, getState) => {
  dispatch({
    type: REPORT_INIT,
    account: getState().accounts.get(accountId)
  });
  dispatch(openModal('REPORT'));
};
const cancelReport = () => ({
  type: REPORT_CANCEL
});
const toggleStatusReport = (statusId, checked) => ({
  type: REPORT_STATUS_TOGGLE,
  statusId,
  checked
});
const submitReport = () => (dispatch, getState) => {
  dispatch(submitReportRequest());
  const {
    reports
  } = getState();
  return api(getState).post('/api/v1/reports', {
    account_id: reports.getIn(['new', 'account_id']),
    status_ids: reports.getIn(['new', 'status_ids']),
    rule_ids: reports.getIn(['new', 'rule_ids']),
    comment: reports.getIn(['new', 'comment']),
    forward: reports.getIn(['new', 'forward'])
  });
};
const submitReportRequest = () => ({
  type: REPORT_SUBMIT_REQUEST
});
const submitReportSuccess = () => ({
  type: REPORT_SUBMIT_SUCCESS
});
const submitReportFail = error => ({
  type: REPORT_SUBMIT_FAIL,
  error
});
const changeReportComment = comment => ({
  type: REPORT_COMMENT_CHANGE,
  comment
});
const changeReportForward = forward => ({
  type: REPORT_FORWARD_CHANGE,
  forward
});
const changeReportBlock = block => ({
  type: REPORT_BLOCK_CHANGE,
  block
});
const changeReportRule = ruleId => ({
  type: REPORT_RULE_CHANGE,
  rule_id: ruleId
});
export { REPORT_INIT, REPORT_CANCEL, REPORT_SUBMIT_REQUEST, REPORT_SUBMIT_SUCCESS, REPORT_SUBMIT_FAIL, REPORT_STATUS_TOGGLE, REPORT_COMMENT_CHANGE, REPORT_FORWARD_CHANGE, REPORT_BLOCK_CHANGE, REPORT_RULE_CHANGE, initReport, initReportById, cancelReport, toggleStatusReport, submitReport, submitReportRequest, submitReportSuccess, submitReportFail, changeReportComment, changeReportForward, changeReportBlock, changeReportRule };