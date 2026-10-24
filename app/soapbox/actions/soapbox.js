import { createSelector } from 'reselect';
import { getHost } from 'soapbox/actions/instance';
import { normalizeSoapboxConfig } from 'soapbox/normalizers';
import KVStore from 'soapbox/storage/kv_store';
import { removeVS16s } from 'soapbox/utils/emoji';
import { getFeatures } from 'soapbox/utils/features';
import api, { staticClient } from '../api';
const SOAPBOX_CONFIG_REQUEST_SUCCESS = 'SOAPBOX_CONFIG_REQUEST_SUCCESS';
const SOAPBOX_CONFIG_REQUEST_FAIL = 'SOAPBOX_CONFIG_REQUEST_FAIL';
const SOAPBOX_CONFIG_REMEMBER_REQUEST = 'SOAPBOX_CONFIG_REMEMBER_REQUEST';
const SOAPBOX_CONFIG_REMEMBER_SUCCESS = 'SOAPBOX_CONFIG_REMEMBER_SUCCESS';
const SOAPBOX_CONFIG_REMEMBER_FAIL = 'SOAPBOX_CONFIG_REMEMBER_FAIL';
const getSoapboxConfig = createSelector([state => state.soapbox, state => getFeatures(state.instance)], (soapbox, features) => {
  // Do some additional normalization with the state
  return normalizeSoapboxConfig(soapbox).withMutations(soapboxConfig => {
    // If displayFqn isn't set, infer it from federation
    if (soapbox.get('displayFqn') === undefined) {
      soapboxConfig.set('displayFqn', features.federating);
    }

    // If RGI reacts aren't supported, strip VS16s
    // // https://git.pleroma.social/pleroma/pleroma/-/issues/2355
    if (!features.emojiReactsRGI) {
      soapboxConfig.set('allowedEmoji', soapboxConfig.allowedEmoji.map(removeVS16s));
    }
  });
});
const rememberSoapboxConfig = host => dispatch => {
  dispatch({
    type: SOAPBOX_CONFIG_REMEMBER_REQUEST,
    host
  });
  return KVStore.getItemOrError(`soapbox_config:${host}`).then(soapboxConfig => {
    dispatch({
      type: SOAPBOX_CONFIG_REMEMBER_SUCCESS,
      host,
      soapboxConfig
    });
    return soapboxConfig;
  }).catch(error => {
    dispatch({
      type: SOAPBOX_CONFIG_REMEMBER_FAIL,
      host,
      error,
      skipAlert: true
    });
  });
};
const fetchFrontendConfigurations = () => (dispatch, getState) => api(getState).get('/api/pleroma/frontend_configurations').then(({
  data
}) => data);

/** Conditionally fetches Soapbox config depending on backend features */
const fetchSoapboxConfig = host => (dispatch, getState) => {
  const features = getFeatures(getState().instance);
  if (features.frontendConfigurations) {
    return dispatch(fetchFrontendConfigurations()).then(data => {
      if (data.soapbox_fe) {
        dispatch(importSoapboxConfig(data.soapbox_fe, host));
        return data.soapbox_fe;
      } else {
        return dispatch(fetchSoapboxJson(host));
      }
    });
  } else {
    return dispatch(fetchSoapboxJson(host));
  }
};

/** Tries to remember the config from browser storage before fetching it */
const loadSoapboxConfig = () => (dispatch, getState) => {
  const host = getHost(getState());
  return dispatch(rememberSoapboxConfig(host)).then(() => dispatch(fetchSoapboxConfig(host)));
};
const fetchSoapboxJson = host => dispatch => staticClient.get('/instance/soapbox.json').then(({
  data
}) => {
  if (!isObject(data)) throw 'soapbox.json failed';
  dispatch(importSoapboxConfig(data, host));
  return data;
}).catch(error => {
  dispatch(soapboxConfigFail(error, host));
});
const importSoapboxConfig = (soapboxConfig, host) => {
  if (!soapboxConfig.brandColor) {
    soapboxConfig.brandColor = '#F24173';
  }
  return {
    type: SOAPBOX_CONFIG_REQUEST_SUCCESS,
    soapboxConfig,
    host
  };
};
const soapboxConfigFail = (error, host) => ({
  type: SOAPBOX_CONFIG_REQUEST_FAIL,
  error,
  skipAlert: true,
  host
});

// https://stackoverflow.com/a/46663081
const isObject = o => o instanceof Object && o.constructor === Object;
export { SOAPBOX_CONFIG_REQUEST_SUCCESS, SOAPBOX_CONFIG_REQUEST_FAIL, SOAPBOX_CONFIG_REMEMBER_REQUEST, SOAPBOX_CONFIG_REMEMBER_SUCCESS, SOAPBOX_CONFIG_REMEMBER_FAIL, getSoapboxConfig, rememberSoapboxConfig, fetchFrontendConfigurations, fetchSoapboxConfig, loadSoapboxConfig, fetchSoapboxJson, importSoapboxConfig, soapboxConfigFail };