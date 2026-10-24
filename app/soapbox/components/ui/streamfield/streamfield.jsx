import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import Button from '../button/button';
import HStack from '../hstack/hstack';
import IconButton from '../icon-button/icon-button';
import Stack from '../stack/stack';
import Text from '../text/text';
const messages = defineMessages({
  add: {
    id: 'streamfield.add',
    defaultMessage: 'Add'
  },
  remove: {
    id: 'streamfield.remove',
    defaultMessage: 'Remove'
  }
});

/** Type of the inner Streamfield input component. */

/** List of inputs that can be added or removed. */
const Streamfield = ({
  values,
  label,
  hint,
  onAddItem,
  onRemoveItem,
  onChange,
  component: Component,
  maxItems = Infinity
}) => {
  const intl = useIntl();
  const handleChange = i => {
    return value => {
      const newData = [...values];
      newData[i] = value;
      onChange(newData);
    };
  };
  return <Stack space={4}>
      <Stack>
        {label && <Text size='sm' weight='medium'>{label}</Text>}
        {hint && <Text size='xs' theme='muted'>{hint}</Text>}
      </Stack>

      {values.length > 0 && <Stack>
          {values.map((value, i) => <HStack key={i} space={2} alignItems='center'>
              <Component onChange={handleChange(i)} value={value} />
              {onRemoveItem && <IconButton iconClassName='w-4 h-4' className='bg-transparent text-gray-400 hover:text-gray-600' src={require('@tabler/icons/x.svg')} onClick={() => onRemoveItem(i)} title={intl.formatMessage(messages.remove)} />}
            </HStack>)}
        </Stack>}

      {onAddItem && <Button icon={require('@tabler/icons/plus.svg')} onClick={onAddItem} disabled={values.length >= maxItems} theme='ghost' block>
          {intl.formatMessage(messages.add)}
        </Button>}
    </Stack>;
};
export default Streamfield;