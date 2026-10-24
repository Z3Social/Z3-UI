const SET_BROWSER_SUPPORT = 'PUSH_NOTIFICATIONS_SET_BROWSER_SUPPORT';
const SET_SUBSCRIPTION = 'PUSH_NOTIFICATIONS_SET_SUBSCRIPTION';
const CLEAR_SUBSCRIPTION = 'PUSH_NOTIFICATIONS_CLEAR_SUBSCRIPTION';
const SET_ALERTS = 'PUSH_NOTIFICATIONS_SET_ALERTS';
const setBrowserSupport = value => ({
  type: SET_BROWSER_SUPPORT,
  value
});
const setSubscription = subscription => ({
  type: SET_SUBSCRIPTION,
  subscription
});
const clearSubscription = () => ({
  type: CLEAR_SUBSCRIPTION
});
const setAlerts = (path, value) => dispatch => dispatch({
  type: SET_ALERTS,
  path,
  value
});
export { SET_BROWSER_SUPPORT, SET_SUBSCRIPTION, CLEAR_SUBSCRIPTION, SET_ALERTS, setBrowserSupport, setSubscription, clearSubscription, setAlerts };