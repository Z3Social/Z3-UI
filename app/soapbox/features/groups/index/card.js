import React from 'react';
import { Map as ImmutableMap } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Text } from 'soapbox/components/ui';

import { shortNumberFormat } from '../../../utils/numbers';

const messages = defineMessages({
  members: { id: 'groups.card.members', defaultMessage: 'Members' },
  view: { id: 'groups.card.view', defaultMessage: 'View' },
  join: { id: 'groups.card.join', defaultMessage: 'Join' },
  role_member: { id: 'groups.card.roles.member', defaultMessage: 'You\'re a member' },
  role_admin: { id: 'groups.card.roles.admin', defaultMessage: 'You\'re an admin' },
});

const mapStateToProps = (state, { id }) => ({
  group: state.getIn(['groups', id]),
  relationships: state.getIn(['group_relationships', id]),
});

export default @connect(mapStateToProps)
@injectIntl
class GroupCard extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
  }

  getRole() {
    const { intl } = this.props;
    const relationships = this.props.relationships || ImmutableMap();

    if (relationships.get('admin')) return intl.formatMessage(messages.role_admin);
    if (relationships.get('member')) return intl.formatMessage(messages.role_member);
    return null;
  }

  render() {
    const { intl, group } = this.props;

    // Groups can arrive before their relationship data; skip incomplete cards safely.
    if (!group) return null;

    const coverImageUrl = group.get('cover_image_url');
    const role = this.getRole();

    return (
      <Link
        to={`/groups/${group.get('id')}`}
        className='block rounded-xl bg-white dark:bg-slate-800 shadow-lg dark:shadow-inset overflow-hidden hover:bg-gray-50 dark:hover:bg-slate-700/60'
      >
        <div className='h-28 w-full bg-gray-200 dark:bg-gray-900/50 overflow-hidden'>
          {coverImageUrl && <img alt='' src={coverImageUrl} className='w-full h-full object-cover' />}
        </div>

        <div className='p-4 space-y-1'>
          <Text tag='h2' weight='bold' size='lg' truncate>{group.get('title')}</Text>
          <Text size='sm' theme='muted'>
            <strong className='text-gray-900 dark:text-gray-100'>{shortNumberFormat(group.get('member_count'))}</strong>
            {' '}{intl.formatMessage(messages.members)}
            {role && <span> · {role}</span>}
          </Text>
          {group.get('description') && (
            <Text size='sm' theme='muted' className='line-clamp-2'>{group.get('description')}</Text>
          )}
        </div>
      </Link>
    );
  }

}
