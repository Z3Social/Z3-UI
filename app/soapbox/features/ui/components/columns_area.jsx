import React from 'react';
import { Layout } from '../../../components/ui';
const ColumnsArea = props => {
  const {
    children
  } = props;
  const layout = props.layout || {
    LEFT: null,
    RIGHT: null
  };
  return <Layout>
      <Layout.Sidebar>
        {layout.LEFT}
      </Layout.Sidebar>

      <Layout.Main>
        {children}
      </Layout.Main>

      <Layout.Aside>
        {layout.RIGHT}
      </Layout.Aside>
    </Layout>;
};
export default ColumnsArea;