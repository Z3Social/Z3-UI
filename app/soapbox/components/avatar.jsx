import classNames from 'classnames';
import React from 'react';
import StillImage from 'soapbox/components/still_image';
/**
 * Legacy avatar component.
 * @see soapbox/components/ui/avatar/avatar.tsx
 * @deprecated
 */
const Avatar = ({
  account,
  size,
  className
}) => {
  if (!account) return null;

  // : TODO : remove inline and change all avatars to be sized using css
  const style = !size ? {} : {
    width: `${size}px`,
    height: `${size}px`
  };
  return <StillImage className={classNames('rounded-full overflow-hidden', className)} style={style} src={account.avatar} alt='' />;
};
export default Avatar;