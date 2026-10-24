import * as React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { fetchSuggestions, dismissSuggestion } from 'soapbox/actions/suggestions';
import { Widget } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useAppSelector } from 'soapbox/hooks';
const messages = defineMessages({
  dismissSuggestion: {
    id: 'suggestions.dismiss',
    defaultMessage: 'Dismiss suggestion'
  }
});
const WhoToFollowPanel = ({
  limit
}) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const suggestions = useAppSelector(state => state.suggestions.items);
  const suggestionsToRender = suggestions.slice(0, limit);
  const handleDismiss = account => {
    dispatch(dismissSuggestion(account.id));
  };
  React.useEffect(() => {
    dispatch(fetchSuggestions());
  }, []);
  if (suggestionsToRender.isEmpty()) {
    return null;
  }

  // FIXME: This page actually doesn't look good right now
  // const handleAction = () => {
  //   history.push('/suggestions');
  // };

  return <Widget title={<FormattedMessage id='who_to_follow.title' defaultMessage='People To Follow' />}
  // onAction={handleAction}
  >
      {suggestionsToRender.map(suggestion => <AccountContainer key={suggestion.account}
    id={suggestion.account} actionIcon={require('@tabler/icons/x.svg')} actionTitle={intl.formatMessage(messages.dismissSuggestion)} onActionClick={handleDismiss} />)}
    </Widget>;
};
export default WhoToFollowPanel;