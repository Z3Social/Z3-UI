import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { useAppSelector } from 'soapbox/hooks';
/** Get the Soapbox config from the store */
export const useSoapboxConfig = () => {
  return useAppSelector(state => getSoapboxConfig(state));
};