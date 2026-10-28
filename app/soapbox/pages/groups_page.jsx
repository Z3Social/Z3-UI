import React from 'react';
import LinkFooter from 'soapbox/features/ui/components/link_footer';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { WhoToFollowPanel } from 'soapbox/features/ui/util/async-components';
import { Layout } from 'soapbox/components/ui';

import GroupSidebarPanel from '../features/groups/sidebar_panel';

/** Page to browse and create groups. */
const GroupsPage = ({ children }) => (
  <>
    <Layout.Main>
      {children}
    </Layout.Main>

    <Layout.Aside>
      <GroupSidebarPanel />
      <BundleContainer fetchComponent={WhoToFollowPanel}>
        {Component => <Component limit={5} key='wtf-panel' />}
      </BundleContainer>
      <LinkFooter key='link-footer' />
    </Layout.Aside>
  </>
);

export default GroupsPage;
