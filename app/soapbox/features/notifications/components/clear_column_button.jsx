import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'soapbox/components/ui';
const ClearColumnButton = ({
  onClick
}) => <Button theme={"ghost"} onClick={onClick}>
    <FormattedMessage id='notifications.clear' defaultMessage='Clear notifications' />
  </Button>;
export default ClearColumnButton;