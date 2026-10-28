import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, defineMessages } from 'react-intl';

import { HStack, Text, Widget } from 'soapbox/components/ui';
import Icon from 'soapbox/components/icon';

const messages = defineMessages({
  group_archived: { id: 'group.detail.archived_group', defaultMessage: 'Archived group' },
  group_admin: { id: 'groups.detail.role_admin', defaultMessage: 'You\'re an admin' },
});

export default @injectIntl
class GroupPanel extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
  }

  render() {
    const { group, relationships, intl } = this.props;

    return (
      <Widget title={group.get('title')}>
        {relationships.get('admin') && (
          <HStack alignItems='center' space={1}>
            <Icon id='check' className='w-4 h-4 text-primary-600' />
            <Text size='sm' theme='muted'>{intl.formatMessage(messages.group_admin)}</Text>
          </HStack>
        )}

        {group.get('archived') && (
          <HStack alignItems='center' space={1}>
            <Icon id='lock' className='w-4 h-4' title={intl.formatMessage(messages.group_archived)} />
            <Text size='sm' theme='muted'>{intl.formatMessage(messages.group_archived)}</Text>
          </HStack>
        )}

        {group.get('description') && (
          <Text size='sm' theme='muted'>{group.get('description')}</Text>
        )}
      </Widget>
    );
  }

}
