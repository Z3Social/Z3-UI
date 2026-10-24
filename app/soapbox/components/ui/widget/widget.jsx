import React from 'react';
import { Text, IconButton } from 'soapbox/components/ui';
import HStack from 'soapbox/components/ui/hstack/hstack';
import Stack from 'soapbox/components/ui/stack/stack';
/** Title of a widget. */
const WidgetTitle = ({
  title
}) => <Text size='xl' weight='bold' tag='h1'>{title}</Text>;

/** Body of a widget. */
const WidgetBody = ({
  children
}) => <Stack space={3}>{children}</Stack>;
/** Sidebar widget. */
const Widget = ({
  title,
  children,
  onActionClick,
  actionIcon = require('@tabler/icons/arrow-right.svg'),
  actionTitle,
  action
}) => {
  return <Stack space={2}>
      <HStack alignItems='center'>
        <WidgetTitle title={title} />
        {action || onActionClick && <IconButton className='w-6 h-6 ml-2 text-black dark:text-white' src={actionIcon} onClick={onActionClick} title={actionTitle} />}
      </HStack>
      <WidgetBody>{children}</WidgetBody>
    </Stack>;
};
export default Widget;