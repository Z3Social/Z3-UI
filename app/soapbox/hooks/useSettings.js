import { getSettings } from 'soapbox/actions/settings';
import { useAppSelector } from 'soapbox/hooks';
/** Get the user settings from the store */
export const useSettings = () => {
  return useAppSelector(state => getSettings(state));
};