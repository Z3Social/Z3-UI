import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, Form, FormActions, Text } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';
const CSVExporter = ({
  messages,
  action
}) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = event => {
    setIsLoading(true);
    dispatch(action()).then(() => {
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  };
  return <Form>
      <Text size='xl' weight='bold'>{intl.formatMessage(messages.input_label)}</Text>
      <Text theme='muted'>{intl.formatMessage(messages.input_hint)}</Text>

      <FormActions>
        <Button theme='primary' onClick={handleClick} disabled={isLoading}>
          {intl.formatMessage(messages.submit)}
        </Button>
      </FormActions>
    </Form>;
};
export default CSVExporter;