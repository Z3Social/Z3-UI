import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Column, Layout } from 'soapbox/components/ui';
import LinkFooter from 'soapbox/features/ui/components/link_footer';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { WhoToFollowPanel } from 'soapbox/features/ui/util/async-components';

import { fetchGroup } from '../actions/groups';
import GroupSidebarPanel from '../features/groups/sidebar_panel';
import GroupPanel from '../features/groups/timeline/components/panel';
import HeaderContainer from '../features/groups/timeline/containers/header_container';

const mapStateToProps = (state, { params: { id } }) => ({
  group: state.getIn(['groups', id]),
  relationships: state.getIn(['group_relationships', id]),
});

export default @connect(mapStateToProps)
@injectIntl
class GroupPage extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { params: { id }, dispatch } = this.props;

    dispatch(fetchGroup(id));
  }

  render() {
    const { children, group, relationships } = this.props;

    return (
      <>
        <Layout.Main>
          <Column label={group ? group.get('title') : ''} withHeader={false}>
            <div className='space-y-4'>
              {group && relationships && <HeaderContainer groupId={group.get('id')} />}
              {children}
            </div>
          </Column>
        </Layout.Main>

        <Layout.Aside>
          {group && relationships && (
            <GroupPanel group={group} relationships={relationships} />
          )}
          <GroupSidebarPanel />
          <BundleContainer fetchComponent={WhoToFollowPanel}>
            {Component => <Component limit={5} key='wtf-panel' />}
          </BundleContainer>
          <LinkFooter key='link-footer' />
        </Layout.Aside>
      </>
    );
  }

}
