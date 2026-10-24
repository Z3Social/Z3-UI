import api from '../api';
const getSubscribersCsv = () => (dispatch, getState) => api(getState).get('/api/v1/pleroma/admin/email_list/subscribers.csv');
const getUnsubscribersCsv = () => (dispatch, getState) => api(getState).get('/api/v1/pleroma/admin/email_list/unsubscribers.csv');
const getCombinedCsv = () => (dispatch, getState) => api(getState).get('/api/v1/pleroma/admin/email_list/combined.csv');
export { getSubscribersCsv, getUnsubscribersCsv, getCombinedCsv };