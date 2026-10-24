import { Map as ImmutableMap, Record as ImmutableRecord } from 'immutable';
import { CHATS_FETCH_SUCCESS, CHATS_FETCH_REQUEST, CHATS_EXPAND_SUCCESS, CHATS_EXPAND_REQUEST, CHAT_FETCH_SUCCESS, CHAT_READ_SUCCESS, CHAT_READ_REQUEST } from 'soapbox/actions/chats';
import { STREAMING_CHAT_UPDATE } from 'soapbox/actions/streaming';
import { normalizeChat } from 'soapbox/normalizers';
import { normalizeId } from 'soapbox/utils/normalizers';
const ReducerRecord = ImmutableRecord({
  next: null,
  isLoading: false,
  items: ImmutableMap({})
});
const minifyChat = chat => {
  return chat.mergeWith((o, n) => n || o, {
    account: normalizeId(chat.getIn(['account', 'id'])),
    last_message: normalizeId(chat.getIn(['last_message', 'id']))
  });
};
const fixChat = chat => {
  return normalizeChat(chat).withMutations(chat => {
    minifyChat(chat);
  });
};
const importChat = (state, chat) => state.setIn(['items', chat.id], fixChat(chat));
const importChats = (state, chats, next) => state.withMutations(mutable => {
  if (next !== undefined) mutable.set('next', next);
  chats.forEach(chat => importChat(mutable, chat));
  mutable.set('isLoading', false);
});
export default function chats(state = ReducerRecord(), action) {
  switch (action.type) {
    case CHATS_FETCH_REQUEST:
    case CHATS_EXPAND_REQUEST:
      return state.set('isLoading', true);
    case CHATS_FETCH_SUCCESS:
    case CHATS_EXPAND_SUCCESS:
      return importChats(state, action.chats, action.next);
    case STREAMING_CHAT_UPDATE:
      return importChats(state, [action.chat]);
    case CHAT_FETCH_SUCCESS:
      return importChats(state, [action.chat]);
    case CHAT_READ_REQUEST:
      return state.setIn([action.chatId, 'unread'], 0);
    case CHAT_READ_SUCCESS:
      return importChats(state, [action.chat]);
    default:
      return state;
  }
}