import React from 'react';
import Account from 'soapbox/components/account';
import { useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';
const AutosuggestAccount = ({
  id
}) => {
  const getAccount = makeGetAccount();
  const account = useAppSelector(state => getAccount(state, id));
  if (!account) return null;
  return <Account account={account} hideActions showProfileHoverCard={false} />;
};
export default AutosuggestAccount;