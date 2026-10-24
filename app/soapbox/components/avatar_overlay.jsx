import React from 'react';
import StillImage from 'soapbox/components/still_image';
const AvatarOverlay = ({
  account,
  friend
}) => <div className='account__avatar-overlay'>
    <StillImage src={account.avatar} className='account__avatar-overlay-base' />
    <StillImage src={friend.avatar} className='account__avatar-overlay-overlay' />
  </div>;
export default AvatarOverlay;