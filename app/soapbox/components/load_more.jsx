import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'soapbox/components/ui';
const LoadMore = ({
  onClick,
  disabled,
  visible = true
}) => {
  if (!visible) {
    return null;
  }
  return <Button theme='primary' block disabled={disabled || !visible} onClick={onClick}>
      <FormattedMessage id='status.load_more' defaultMessage='Load more' />
    </Button>;
};
export default LoadMore;