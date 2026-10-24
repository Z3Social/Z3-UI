import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import ComposeFormButton from './compose_form_button';
const messages = defineMessages({
  add_poll: {
    id: 'poll_button.add_poll',
    defaultMessage: 'Add a poll'
  },
  remove_poll: {
    id: 'poll_button.remove_poll',
    defaultMessage: 'Remove poll'
  }
});
const PollButton = ({
  active,
  unavailable,
  disabled,
  onClick
}) => {
  const intl = useIntl();
  if (unavailable) {
    return null;
  }
  return <ComposeFormButton icon={require('@tabler/icons/chart-bar.svg')} title={intl.formatMessage(active ? messages.remove_poll : messages.add_poll)} active={active} disabled={disabled} onClick={onClick} />;
};
export default PollButton;