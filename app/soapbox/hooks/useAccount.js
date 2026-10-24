import { useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';
const getAccount = makeGetAccount();
export const useAccount = id => useAppSelector(state => getAccount(state, id));