import React from 'react';
import { Layout } from '../components/ui';
const EmptyPage = ({
  children
}) => {
  return <>
      <Layout.Main>
        {children}
      </Layout.Main>

      <Layout.Aside />
    </>;
};
export default EmptyPage;