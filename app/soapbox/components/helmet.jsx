import * as React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';
import { useAppSelector, useSettings } from 'soapbox/hooks';
import FaviconService from 'soapbox/utils/favicon_service';
FaviconService.initFaviconService();
const getNotifTotals = state => {
  const notifications = state.notifications.unread || 0;
  const chats = state.chats.items.reduce((acc, curr) => acc + Math.min(curr.get('unread', 0), 1), 0);
  const reports = state.admin.openReports.count();
  const approvals = state.admin.awaitingApproval.count();
  return notifications + chats + reports + approvals;
};
const Helmet = ({
  children
}) => {
  const title = useAppSelector(state => state.instance.title);
  const unreadCount = useAppSelector(state => getNotifTotals(state));
  const demetricator = useSettings().get('demetricator');
  const hasUnreadNotifications = React.useMemo(() => !(unreadCount < 1 || demetricator), [unreadCount, demetricator]);
  const addCounter = string => {
    return hasUnreadNotifications ? `(${unreadCount}) ${string}` : string;
  };
  const updateFaviconBadge = () => {
    if (hasUnreadNotifications) {
      FaviconService.drawFaviconBadge();
    } else {
      FaviconService.clearFaviconBadge();
    }
  };
  React.useEffect(() => {
    updateFaviconBadge();
  }, [unreadCount, demetricator]);
  return <ReactHelmet titleTemplate={addCounter(`%s | ${title}`)} defaultTitle={addCounter(title)} defer={false}>
      {children}
    </ReactHelmet>;
};
export default Helmet;