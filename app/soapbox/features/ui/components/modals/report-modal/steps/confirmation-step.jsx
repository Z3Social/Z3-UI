import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { Stack, Text } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';
const messages = defineMessages({
  title: {
    id: 'report.confirmation.title',
    defaultMessage: 'Thanks for submitting your report.'
  },
  content: {
    id: 'report.confirmation.content',
    defaultMessage: 'If we find that this account is violating the {link} we will take further action on the matter.'
  }
});
const termsOfServiceText = <FormattedMessage id='shared.tos' defaultMessage='Terms of Service' />;
const renderTermsOfServiceLink = href => <a href={href} target='_blank' className='hover:underline text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-500'>
    {termsOfServiceText}
  </a>;
const ConfirmationStep = ({
  account
}) => {
  const intl = useIntl();
  const links = useAppSelector(state => getSoapboxConfig(state).get('links'));
  return <Stack space={1}>
      <Text weight='semibold' tag='h1' size='xl'>
        {intl.formatMessage(messages.title)}
      </Text>

      <Text>
        {intl.formatMessage(messages.content, {
        link: links.get('termsOfService') ? renderTermsOfServiceLink(links.get('termsOfService')) : termsOfServiceText
      })}
      </Text>
    </Stack>;
};
export default ConfirmationStep;