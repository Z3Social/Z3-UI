import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useAppSelector } from 'soapbox/hooks';
import { getFeatures } from 'soapbox/utils/features';
const messages = defineMessages({
  following: {
    id: 'morefollows.following_label',
    defaultMessage: '…and {count} more {count, plural, one {follow} other {follows}} on remote sites.'
  },
  followers: {
    id: 'morefollows.followers_label',
    defaultMessage: '…and {count} more {count, plural, one {follower} other {followers}} on remote sites.'
  }
});
const MoreFollows = ({
  visible = true,
  count,
  type
}) => {
  const intl = useIntl();
  const features = useAppSelector(state => getFeatures(state.instance));
  const getMessage = () => {
    return intl.formatMessage(messages[type], {
      count
    });
  };

  // If the instance isn't federating, there are no remote followers
  if (!features.federating) {
    return null;
  }
  return <div className='morefollows-indicator'>
      <div>
        <div className='morefollows-indicator__label' style={{
        visibility: visible ? 'visible' : 'hidden'
      }}>
          {getMessage()}
        </div>
      </div>
    </div>;
};
export default MoreFollows;