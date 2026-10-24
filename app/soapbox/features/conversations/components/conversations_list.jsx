import debounce from 'lodash/debounce';
import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { expandConversations } from 'soapbox/actions/conversations';
import ScrollableList from 'soapbox/components/scrollable_list';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import Conversation from '../components/conversation';
const ConversationsList = () => {
  const dispatch = useAppDispatch();
  const ref = useRef(null);
  const conversations = useAppSelector(state => state.conversations.items);
  const isLoading = useAppSelector(state => state.conversations.isLoading);
  const getCurrentIndex = id => conversations.findIndex(x => x.id === id);
  const handleMoveUp = id => {
    const elementIndex = getCurrentIndex(id) - 1;
    selectChild(elementIndex);
  };
  const handleMoveDown = id => {
    const elementIndex = getCurrentIndex(id) + 1;
    selectChild(elementIndex);
  };
  const selectChild = index => {
    ref.current?.scrollIntoView({
      index,
      behavior: 'smooth',
      done: () => {
        const element = document.querySelector(`#direct-list [data-index="${index}"] .focusable`);
        if (element) {
          element.focus();
        }
      }
    });
  };
  const handleLoadOlder = debounce(() => {
    const maxId = conversations.getIn([-1, 'id']);
    if (maxId) dispatch(expandConversations({
      maxId
    }));
  }, 300, {
    leading: true
  });
  return <ScrollableList onLoadMore={handleLoadOlder} id='direct-list' scrollKey='direct' ref={ref} isLoading={isLoading} showLoading={isLoading && conversations.size === 0} emptyMessage={<FormattedMessage id='empty_column.direct' defaultMessage="You don't have any direct messages yet. When you send or receive one, it will show up here." />}>
      {conversations.map(item => <Conversation key={item.id} conversationId={item.id} onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} />)}
    </ScrollableList>;
};
export default ConversationsList;