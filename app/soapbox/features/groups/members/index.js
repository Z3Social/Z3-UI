import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Spinner } from 'soapbox/components/ui';

import {
  fetchGroupMembers,
  expandGroupMembers,
} from '../../../actions/groups';
import ScrollableList from '../../../components/scrollable_list';
import AccountContainer from '../../../containers/account_container';

const mapStateToProps = (state, { params: { id } }) => {
  const list = state.getIn(['user_lists', 'groups', id]);
  return {
    group: state.getIn(['groups', id]),
    accountIds: list ? list.get('items') : null,
    hasMore: !!list && !!list.get('next'),
  };
};

export default @connect(mapStateToProps)
class GroupMembers extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
    hasMore: PropTypes.bool,
  };

  componentDidMount() {
    const { params: { id } } = this.props;

    this.props.dispatch(fetchGroupMembers(id));
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.props.dispatch(fetchGroupMembers(this.props.params.id));
    }
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandGroupMembers(this.props.params.id));
  }, 300, { leading: true });

  render() {
    const { accountIds, hasMore, group } = this.props;

    if (!group || !accountIds) {
      return <Spinner />;
    }

    return (
      <ScrollableList
        scrollKey='members'
        hasMore={hasMore}
        onLoadMore={this.handleLoadMore}
        emptyMessage={<FormattedMessage id='group.members.empty' defaultMessage='This group does not has any members.' />}
      >
        {accountIds.map(id => <AccountContainer key={id} id={id} withNote={false} />)}
      </ScrollableList>
    );
  }

}
