import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';
import { statusToMentionsAccountIdsArray } from 'soapbox/reducers/compose';
import { makeGetStatus } from 'soapbox/selectors';
import Account from '../../reply_mentions/account';
const ReplyMentionsModal = ({
  onClose
}) => {
  const status = useAppSelector(state => makeGetStatus()(state, {
    id: state.compose.in_reply_to
  }));
  const account = useAppSelector(state => state.accounts.get(state.me));
  const mentions = statusToMentionsAccountIdsArray(status, account);
  const author = (status?.account).id;
  const onClickClose = () => {
    onClose('REPLY_MENTIONS');
  };
  return <Modal title={<FormattedMessage id='navigation_bar.in_reply_to' defaultMessage='In reply to' />} onClose={onClickClose} closeIcon={require('@tabler/icons/arrow-left.svg')} closePosition='left'>
      <div className='reply-mentions-modal__accounts'>
        {mentions.map(accountId => <Account key={accountId} accountId={accountId} author={author === accountId} />)}
      </div>
    </Modal>;
};
export default ReplyMentionsModal;