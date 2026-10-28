import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Widget } from 'soapbox/components/ui';

import Item from './item';

const messages = defineMessages({
  title: { id: 'groups.sidebar-panel.title', defaultMessage: 'Groups You\'re In' },
  show_all: { id: 'groups.sidebar-panel.show_all', defaultMessage: 'Show all' },
});

const mapStateToProps = state => ({
  groupIds: state.getIn(['group_lists', 'member']),
});

export default @connect(mapStateToProps)
@injectIntl
class GroupSidebarPanel extends ImmutablePureComponent {

  static propTypes = {
    groupIds: ImmutablePropTypes.list,
  }

  render() {
    const { intl, groupIds } = this.props;
    const count = groupIds.count();

    // Only when there are groups to show
    if (count === 0) return null;

    return (
      <Widget title={intl.formatMessage(messages.title)}>
        <div className='space-y-1'>
          {groupIds.slice(0, 10).map(groupId => <Item key={groupId} id={groupId} />)}
          {count > 10 && <Link className='block text-center text-sm text-primary-600 dark:text-accent-300 hover:underline' to='/groups/browse/member'>{intl.formatMessage(messages.show_all)}</Link>}
        </div>
      </Widget>
    );
  }

}
