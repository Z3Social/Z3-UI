import React, { useState } from 'react';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import { closeReports } from 'soapbox/actions/admin';
import { deactivateUserModal, deleteUserModal } from 'soapbox/actions/moderation';
import snackbar from 'soapbox/actions/snackbar';
import Avatar from 'soapbox/components/avatar';
import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';
import { Button, HStack } from 'soapbox/components/ui';
import DropdownMenu from 'soapbox/containers/dropdown_menu_container';
import Accordion from 'soapbox/features/ui/components/accordion';
import { useAppDispatch } from 'soapbox/hooks';
import ReportStatus from './report_status';
const messages = defineMessages({
  reportClosed: {
    id: 'admin.reports.report_closed_message',
    defaultMessage: 'Report on @{name} was closed'
  },
  deactivateUser: {
    id: 'admin.users.actions.deactivate_user',
    defaultMessage: 'Deactivate @{name}'
  },
  deleteUser: {
    id: 'admin.users.actions.delete_user',
    defaultMessage: 'Delete @{name}'
  }
});
const Report = ({
  report
}) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const account = report.account;
  const targetAccount = report.target_account;
  const makeMenu = () => {
    return [{
      text: intl.formatMessage(messages.deactivateUser, {
        name: targetAccount.username
      }),
      action: handleDeactivateUser,
      icon: require('@tabler/icons/user-off.svg')
    }, {
      text: intl.formatMessage(messages.deleteUser, {
        name: targetAccount.username
      }),
      action: handleDeleteUser,
      icon: require('@tabler/icons/user-minus.svg')
    }];
  };
  const handleCloseReport = () => {
    dispatch(closeReports([report.id])).then(() => {
      const message = intl.formatMessage(messages.reportClosed, {
        name: targetAccount.username
      });
      dispatch(snackbar.success(message));
    }).catch(() => {});
  };
  const handleDeactivateUser = () => {
    const accountId = targetAccount.id;
    dispatch(deactivateUserModal(intl, accountId, () => handleCloseReport()));
  };
  const handleDeleteUser = () => {
    const accountId = targetAccount.id;
    dispatch(deleteUserModal(intl, accountId, () => handleCloseReport()));
  };
  const handleAccordionToggle = setting => {
    setAccordionExpanded(setting);
  };
  const menu = makeMenu();
  const statuses = report.statuses;
  const statusCount = statuses.count();
  const acct = targetAccount.acct;
  const reporterAcct = account.acct;
  return <div className='admin-report' key={report.id}>
      <div className='admin-report__avatar'>
        <HoverRefWrapper accountId={targetAccount.id} inline>
          <Link to={`/@${acct}`} title={acct}>
            <Avatar account={targetAccount} size={32} />
          </Link>
        </HoverRefWrapper>
      </div>
      <div className='admin-report__content'>
        <h4 className='admin-report__title'>
          <FormattedMessage id='admin.reports.report_title' defaultMessage='Report on {acct}' values={{
          acct: <HoverRefWrapper accountId={account.id} inline>
                <Link to={`/@${acct}`} title={acct}>@{acct}</Link>
              </HoverRefWrapper>
        }} />
        </h4>
        <div className='admin-report__statuses'>
          {statusCount > 0 && <Accordion headline={`Reported posts (${statusCount})`} expanded={accordionExpanded} onToggle={handleAccordionToggle}>
              {statuses.map(status => <ReportStatus report={report} status={status} key={status.id} />)}
            </Accordion>}
        </div>
        <div className='admin-report__quote'>
          {(report.comment || '').length > 0 && <blockquote className='md' dangerouslySetInnerHTML={{
          __html: report.comment
        }} />}
          <span className='byline'>
            &mdash;
            <HoverRefWrapper accountId={account.id} inline>
              <Link to={`/@${reporterAcct}`} title={reporterAcct}>@{reporterAcct}</Link>
            </HoverRefWrapper>
          </span>
        </div>
      </div>
      <HStack space={2} alignItems='start'>
        <Button onClick={handleCloseReport}>
          <FormattedMessage id='admin.reports.actions.close' defaultMessage='Close' />
        </Button>

        <DropdownMenu items={menu} src={require('@tabler/icons/dots-vertical.svg')} />
      </HStack>
    </div>;
};
export default Report;