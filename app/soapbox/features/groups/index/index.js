import React from 'react';
import PropTypes from 'prop-types';
import { List as ImmutableList } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Button, Column, Tabs } from 'soapbox/components/ui';

import { fetchGroups } from '../../../actions/groups';
import GroupCreate from '../create';

import GroupCard from './card';

const messages = defineMessages({
  heading: { id: 'column.groups', defaultMessage: 'Groups' },
  create: { id: 'groups.create', defaultMessage: 'Create group' },
  tab_featured: { id: 'groups.tab_featured', defaultMessage: 'Featured' },
  tab_member: { id: 'groups.tab_member', defaultMessage: 'Member' },
  tab_admin: { id: 'groups.tab_admin', defaultMessage: 'Manage' },
});

const mapStateToProps = (state, { activeTab = 'featured', params }) => {
  const tab = params && params.tab ? params.tab : activeTab;
  return {
    activeTab: tab,
    groupIds: state.getIn(['group_lists', tab]),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class Groups extends ImmutablePureComponent {

  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    showCreateForm: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    groupIds: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(fetchGroups(this.props.activeTab));
  }

  componentDidUpdate(oldProps) {
    if (this.props.activeTab && this.props.activeTab !== oldProps.activeTab) {
      this.props.dispatch(fetchGroups(this.props.activeTab));
    }
  }

  renderHeader() {
    const { intl, activeTab } = this.props;

    const tabItems = [
      { text: intl.formatMessage(messages.tab_featured), to: '/groups', name: 'featured' },
      { text: intl.formatMessage(messages.tab_member), to: '/groups/browse/member', name: 'member' },
      { text: intl.formatMessage(messages.tab_admin), to: '/groups/browse/admin', name: 'admin' },
    ];

    return (
      <div className='space-y-4'>
        <div className='flex justify-end'>
          <Link to='/groups/create'>
            <Button theme='accent' text={intl.formatMessage(messages.create)} />
          </Link>
        </div>

        <Tabs items={tabItems} activeItem={activeTab} />
      </div>
    );
  }

  render() {
    const { groupIds, showCreateForm, intl } = this.props;

    return (
      <Column label={intl.formatMessage(messages.heading)} withHeader={false}>
        {showCreateForm
          ? <GroupCreate />
          : (
            <div className='space-y-4'>
              {this.renderHeader()}
              <div className='space-y-3'>
                {(groupIds || ImmutableList()).map(id => <GroupCard key={id} id={id} />)}
              </div>
            </div>
          )}
      </Column>
    );
  }

}
