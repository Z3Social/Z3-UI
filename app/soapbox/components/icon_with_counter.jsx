import React from 'react';
import Icon from 'soapbox/components/icon';
import { Counter } from 'soapbox/components/ui';
const IconWithCounter = ({
  icon,
  count,
  ...rest
}) => {
  return <div className='relative'>
      <Icon id={icon} {...rest} />

      {count > 0 && <i className='absolute -top-2 -right-2'>
          <Counter count={count} />
        </i>}
    </div>;
};
export default IconWithCounter;