import { getSoapboxConfig } from 'soapbox/actions/soapbox';
/** Provides ads from Soapbox Config. */
const SoapboxConfigAdProvider = {
  getAds: async getState => {
    const state = getState();
    const soapboxConfig = getSoapboxConfig(state);
    return soapboxConfig.ads.toArray();
  }
};
export default SoapboxConfigAdProvider;