import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { fetchBirthdayReminders } from 'soapbox/actions/accounts';
import { Widget } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
const timeToMidnight = () => {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  return midnight.getTime() - now.getTime();
};
const BirthdayPanel = ({
  limit
}) => {
  const dispatch = useAppDispatch();
  const birthdays = useAppSelector(state => state.user_lists.birthday_reminders.get(state.me)?.items || ImmutableOrderedSet());
  const birthdaysToRender = birthdays.slice(0, limit);
  const timeout = useRef();
  const handleFetchBirthdayReminders = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    dispatch(fetchBirthdayReminders(month, day))?.then(() => {
      timeout.current = setTimeout(() => handleFetchBirthdayReminders(), timeToMidnight());
    });
  };
  React.useEffect(() => {
    handleFetchBirthdayReminders();
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);
  if (birthdaysToRender.isEmpty()) {
    return null;
  }
  return <Widget title={<FormattedMessage id='birthday_panel.title' defaultMessage='Birthdays' />}>
      {birthdaysToRender.map(accountId => <AccountContainer key={accountId}
    id={accountId} />)}
    </Widget>;
};
export default BirthdayPanel;