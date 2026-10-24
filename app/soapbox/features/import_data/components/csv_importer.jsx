import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, FileInput, Form, FormActions, FormGroup, Text } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';
const CSVImporter = ({
  messages,
  action
}) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const handleSubmit = event => {
    const params = new FormData();
    params.append('list', file);
    setIsLoading(true);
    dispatch(action(params)).then(() => {
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
    event.preventDefault();
  };
  const handleFileChange = e => {
    const file = e.target.files?.item(0);
    setFile(file);
  };
  return <Form onSubmit={handleSubmit}>
      <Text size='xl' weight='bold' tag='label'>{intl.formatMessage(messages.input_label)}</Text>
      <FormGroup hintText={<Text theme='muted'>{intl.formatMessage(messages.input_hint)}</Text>}>
        <FileInput accept='.csv,text/csv' onChange={handleFileChange} required />
      </FormGroup>
      <FormActions>
        <Button type='submit' theme='primary' disabled={isLoading}>
          {intl.formatMessage(messages.submit)}
        </Button>
      </FormActions>
    </Form>;
};
export default CSVImporter;