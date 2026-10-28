import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { HStack, Text } from 'soapbox/components/ui';

import { shortNumberFormat } from '../../../utils/numbers';

const messages = defineMessages({
  new_statuses: { id: 'groups.sidebar-panel.item.view', defaultMessage: 'new posts' },
  no_recent_activity: { id: 'groups.sidebar-panel.item.no_recent_activity', defaultMessage: 'No recent activity' },
});

const mapStateToProps = (state, { id }) => ({
  group: state.getIn(['groups', id]),
  relationships: state.getIn(['group_relationships', id]),
});

export default @connect(mapStateToProps)
@injectIntl
class Item extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
  }

  render() {
    const { intl, group, relationships } = this.props;

    // Wait for relationships
    if (!group || !relationships) return null;

    const unreadCount = relationships.get('unread_count') || 0;

    return (
      <Link
        to={`/groups/${group.get('id')}`}
        className='flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-700/60'
      >
        <Text tag='span' weight='medium' size='sm' truncate>{group.get('title')}</Text>
        {unreadCount > 0
          ? <HStack space={1} alignItems='center' className='shrink-0 text-primary-600 dark:text-accent-300'>
            <Text tag='span' size='sm' weight='semibold'>{shortNumberFormat(unreadCount)}</Text>
            <Text tag='span' size='sm' theme='muted'>{intl.formatMessage(messages.new_statuses)}</Text>
          </HStack>
          : <Text tag='span' size='sm' theme='muted' className='shrink-0'>{intl.formatMessage(messages.no_recent_activity)}</Text>}
      </Link>
    );
  }

}
