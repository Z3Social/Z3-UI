import { useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';
// FIXME: There is no reason this selector shouldn't be global accross the whole app
// FIXME: getAccount() has the wrong type??
const getAccount = makeGetAccount();

/** Get the logged-in account from the store, if any */
export const useOwnAccount = () => {
  return useAppSelector(state => getAccount(state, state.me));
};