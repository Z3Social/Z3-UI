import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';

import { Button, HStack } from 'soapbox/components/ui';

import DropdownMenuContainer from '../../../../containers/dropdown_menu_container';

const messages = defineMessages({
  join: { id: 'groups.join', defaultMessage: 'Join group' },
  leave: { id: 'groups.leave', defaultMessage: 'Leave group' },
  removed_accounts: { id: 'groups.removed_accounts', defaultMessage: 'Removed Accounts' },
  edit: { id: 'groups.edit', defaultMessage: 'Edit' },
});

export default @injectIntl
class Header extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
    toggleMembership: PropTypes.func.isRequired,
  };

  toggle = () => {
    const { group, relationships, toggleMembership } = this.props;
    toggleMembership(group, relationships);
  }

  getActionButton() {
    const { group, relationships, intl } = this.props;

    if (!relationships) {
      return null;
    } else if (!relationships.get('member')) {
      return <Button theme='accent' text={intl.formatMessage(messages.join)} onClick={this.toggle} />;
    } else {
      return <Button theme='accent' text={intl.formatMessage(messages.leave, { name: group.get('title') })} onClick={this.toggle} />;
    }
  }

  getAdminMenu() {
    const { group, intl } = this.props;

    const menu = [
      {
        text: intl.formatMessage(messages.edit),
        to: `/groups/${group.get('id')}/edit`,
        icon: require('@tabler/icons/edit.svg'),
      },
      {
        text: intl.formatMessage(messages.removed_accounts),
        to: `/groups/${group.get('id')}/removed_accounts`,
        icon: require('@tabler/icons/trash.svg'),
        destructive: true,
      },
    ];

    return <DropdownMenuContainer items={menu} src={require('@tabler/icons/dots-vertical.svg')} direction='right' />;
  }

  render() {
    const { group, relationships } = this.props;

    if (!group || !relationships) {
      return null;
    }

    return (
      <div className='-mt-4 -mx-4 sm:rounded-t-xl overflow-hidden'>
        <div className='relative h-32 w-full lg:h-48 bg-gray-200 dark:bg-gray-900/50'>
          {group.get('cover_image_url') && (
            <img
              src={group.get('cover_image_url')}
              alt=''
              className='absolute inset-0 w-full h-full object-cover'
            />
          )}
        </div>

        <HStack alignItems='center' justifyContent='between' space={2} className='px-4 py-3 border-b border-solid border-gray-200 dark:border-slate-700'>
          <HStack space={1} alignItems='center'>
            <NavLink
              exact
              className='px-4 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/60'
              activeClassName='bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-600'
              to={`/groups/${group.get('id')}`}
            >
              Posts
            </NavLink>
            <NavLink
              exact
              className='px-4 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/60'
              activeClassName='bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-600'
              to={`/groups/${group.get('id')}/members`}
            >
              Members
            </NavLink>
          </HStack>

          <HStack space={2} alignItems='center'>
            {this.getActionButton()}
            {relationships.get('admin') && this.getAdminMenu()}
          </HStack>
        </HStack>
      </div>
    );
  }

}
