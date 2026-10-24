import React from 'react';
import PullToRefresh from './pull-to-refresh';
/**
 * Pullable:
 * Basic "pull to refresh" without the refresh.
 * Just visual feedback.
 */
const Pullable = ({
  children
}) => <PullToRefresh
refreshingContent={null}>
    {children}
  </PullToRefresh>;
export default Pullable;