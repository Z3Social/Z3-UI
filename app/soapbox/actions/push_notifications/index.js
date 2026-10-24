import { register, saveSettings } from './registerer';
import { SET_BROWSER_SUPPORT, SET_SUBSCRIPTION, CLEAR_SUBSCRIPTION, SET_ALERTS, setAlerts } from './setter';
export { SET_BROWSER_SUPPORT, SET_SUBSCRIPTION, CLEAR_SUBSCRIPTION, SET_ALERTS, register, changeAlerts };
const changeAlerts = (path, value) => dispatch => {
  dispatch(setAlerts(path, value));
  dispatch(saveSettings());
};