import { getSettings } from 'soapbox/actions/settings';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { normalizeCard } from 'soapbox/normalizers';

/** Rumble ad API entity. */

/** Response from Rumble ad server. */

/** Provides ads from Soapbox Config. */
const RumbleAdProvider = {
  getAds: async getState => {
    const state = getState();
    const settings = getSettings(state);
    const soapboxConfig = getSoapboxConfig(state);
    const endpoint = soapboxConfig.extensions.getIn(['ads', 'endpoint']);
    if (endpoint) {
      const response = await fetch(endpoint, {
        headers: {
          'Accept-Language': settings.get('locale', '*')
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.ads.map(item => ({
          impression: item.impression,
          card: normalizeCard({
            type: item.type === 1 ? 'link' : 'rich',
            image: item.asset,
            url: item.click
          })
        }));
      }
    }
    return [];
  }
};
export default RumbleAdProvider;