import { getSettings, changeSetting } from 'soapbox/actions/settings';
const getPinnedHosts = state => {
  const settings = getSettings(state);
  return settings.getIn(['remote_timeline', 'pinnedHosts']);
};
const pinHost = host => (dispatch, getState) => {
  const state = getState();
  const pinnedHosts = getPinnedHosts(state);
  return dispatch(changeSetting(['remote_timeline', 'pinnedHosts'], pinnedHosts.add(host)));
};
const unpinHost = host => (dispatch, getState) => {
  const state = getState();
  const pinnedHosts = getPinnedHosts(state);
  return dispatch(changeSetting(['remote_timeline', 'pinnedHosts'], pinnedHosts.remove(host)));
};
export { pinHost, unpinHost };