import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { launchChat } from 'soapbox/actions/chats';
import AccountSearch from 'soapbox/components/account_search';
import { Column } from '../../components/ui';
import ChatList from './components/chat-list';
const messages = defineMessages({
  title: {
    id: 'column.chats',
    defaultMessage: 'Chats'
  },
  searchPlaceholder: {
    id: 'chats.search_placeholder',
    defaultMessage: 'Start a chat with…'
  }
});
const ChatIndex = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const history = useHistory();
  const handleSuggestion = accountId => {
    dispatch(launchChat(accountId, history, true));
  };
  const handleClickChat = chat => {
    history.push(`/chats/${chat.id}`);
  };
  return <Column withHeader={false} label={intl.formatMessage(messages.title)}>
      <div className='my-3'>
        <AccountSearch placeholder={intl.formatMessage(messages.searchPlaceholder)} onSelected={handleSuggestion} />
      </div>

      <ChatList onClickChat={handleClickChat} useWindowScroll />
    </Column>;
};
export default ChatIndex;