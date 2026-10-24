import classNames from 'classnames';
import React from 'react';
import StickyBox from 'react-sticky-box';
/** Layout container, to hold Sidebar, Main, and Aside. */
const Layout = ({
  children
}) => <div className='sm:pt-4 relative'>
    <div className='max-w-3xl mx-auto sm:px-6 md:max-w-7xl md:px-8 md:grid md:grid-cols-12 md:gap-8'>
      {children}
    </div>
  </div>;

/** Left sidebar container in the UI. */
const Sidebar = ({
  children
}) => <div className='hidden lg:block lg:col-span-3'>
    <StickyBox offsetTop={80} className='pb-4'>
      {children}
    </StickyBox>
  </div>;

/** Center column container in the UI. */
const Main = ({
  children,
  className
}) => <main className={classNames({
  'md:col-span-12 lg:col-span-6 xl:col-span-6 pb-36': true
}, className)}>
    {children}
  </main>;

/** Right sidebar container in the UI. */
const Aside = ({
  children
}) => <aside className='hidden lg:block lg:col-span-3'>
    <StickyBox offsetTop={80} className='space-y-6 pb-12'>
      {children}
    </StickyBox>
  </aside>;
Layout.Sidebar = Sidebar;
Layout.Main = Main;
Layout.Aside = Aside;
export default Layout;