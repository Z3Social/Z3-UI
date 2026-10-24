import classNames from 'classnames';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Stack, HStack, Icon, Text } from 'soapbox/components/ui';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { CryptoAddress } from 'soapbox/features/ui/util/async-components';
const getTicker = value => (value.match(/\$([a-zA-Z]*)/i) || [])[1];
const isTicker = value => Boolean(getTicker(value));
const messages = defineMessages({
  linkVerifiedOn: {
    id: 'account.link_verified_on',
    defaultMessage: 'Ownership of this link was checked on {date}'
  },
  account_locked: {
    id: 'account.locked_info',
    defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.'
  },
  deactivated: {
    id: 'account.deactivated',
    defaultMessage: 'Deactivated'
  },
  bot: {
    id: 'account.badges.bot',
    defaultMessage: 'Bot'
  }
});
const dateFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour12: false,
  hour: '2-digit',
  minute: '2-digit'
};
/** Renders a single profile field. */
const ProfileField = ({
  field
}) => {
  const intl = useIntl();
  if (isTicker(field.name)) {
    return <BundleContainer fetchComponent={CryptoAddress}>
        {Component => <Component ticker={getTicker(field.name).toLowerCase()} address={field.value_plain} />}
      </BundleContainer>;
  }
  return <dl>
      <dt title={field.name}>
        <Text weight='bold' tag='span' dangerouslySetInnerHTML={{
        __html: field.name_emojified
      }} />
      </dt>

      <dd className={classNames({
      'text-success-500': field.verified_at
    })} title={field.value_plain}>
        <HStack space={2} alignItems='center'>
          {field.verified_at && <span className='flex-none' title={intl.formatMessage(messages.linkVerifiedOn, {
          date: intl.formatDate(field.verified_at, dateFormatOptions)
        })}>
              <Icon src={require('@tabler/icons/check.svg')} />
            </span>}

          <Text className='break-words overflow-hidden' tag='span' dangerouslySetInnerHTML={{
          __html: field.value_emojified
        }} />
        </HStack>
      </dd>
    </dl>;
};
/** Custom profile fields for sidebar. */
const ProfileFieldsPanel = ({
  account
}) => {
  return <Stack space={4}>
      {account.fields.map((field, i) => <ProfileField field={field} key={i} />)}
    </Stack>;
};
export default ProfileFieldsPanel;