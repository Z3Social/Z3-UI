import { getSoapboxConfig } from 'soapbox/actions/soapbox';
/** Map of available provider modules. */
const PROVIDERS = {
  soapbox: async () => (await import(/* webpackChunkName: "features/ads/soapbox" */'./soapbox-config')).default,
  rumble: async () => (await import(/* webpackChunkName: "features/ads/rumble" */'./rumble')).default
};

/** Ad server implementation. */

/** Entity representing an advertisement. */

/** Gets the current provider based on config. */
const getProvider = async getState => {
  const state = getState();
  const soapboxConfig = getSoapboxConfig(state);
  const isEnabled = soapboxConfig.extensions.getIn(['ads', 'enabled'], false) === true;
  const providerName = soapboxConfig.extensions.getIn(['ads', 'provider'], 'soapbox');
  if (isEnabled && PROVIDERS[providerName]) {
    return PROVIDERS[providerName]();
  }
};
export { getProvider };