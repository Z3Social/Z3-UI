import { Set as ImmutableSet } from 'immutable';
import ConfigDB from 'soapbox/utils/config_db';
import { fetchConfig, updateConfig } from './admin';
const simplePolicyMerge = (simplePolicy, host, restrictions) => {
  return simplePolicy.map((hosts, key) => {
    const isRestricted = restrictions.get(key);
    if (isRestricted) {
      return ImmutableSet(hosts).add(host);
    } else {
      return ImmutableSet(hosts).delete(host);
    }
  });
};
const updateMrf = (host, restrictions) => (dispatch, getState) => dispatch(fetchConfig()).then(() => {
  const configs = getState().admin.get('configs');
  const simplePolicy = ConfigDB.toSimplePolicy(configs);
  const merged = simplePolicyMerge(simplePolicy, host, restrictions);
  const config = ConfigDB.fromSimplePolicy(merged);
  return dispatch(updateConfig(config.toJS()));
});
export { updateMrf };