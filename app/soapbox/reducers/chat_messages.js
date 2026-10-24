import { Map as ImmutableMap, fromJS } from 'immutable';
import { CHATS_FETCH_SUCCESS, CHATS_EXPAND_SUCCESS, CHAT_MESSAGES_FETCH_SUCCESS, CHAT_MESSAGE_SEND_REQUEST, CHAT_MESSAGE_SEND_SUCCESS, CHAT_MESSAGE_DELETE_REQUEST, CHAT_MESSAGE_DELETE_SUCCESS } from 'soapbox/actions/chats';
import { STREAMING_CHAT_UPDATE } from 'soapbox/actions/streaming';
import { normalizeChatMessage } from 'soapbox/normalizers';
const importMessage = (state, message) => {
  return state.set(message.id, normalizeChatMessage(message));
};
const importMessages = (state, messages) => state.withMutations(mutable => messages.forEach(message => importMessage(mutable, message)));
const importLastMessages = (state, chats) => state.withMutations(mutable => chats.forEach(chat => {
  if (chat.last_message) importMessage(mutable, chat.last_message);
}));
const initialState = ImmutableMap();
export default function chatMessages(state = initialState, action) {
  switch (action.type) {
    case CHAT_MESSAGE_SEND_REQUEST:
      return importMessage(state, fromJS({
        id: action.uuid,
        // Make fake message to get overriden later
        chat_id: action.chatId,
        account_id: action.me,
        content: action.params.content,
        created_at: new Date().toISOString(),
        pending: true
      }));
    case CHATS_FETCH_SUCCESS:
    case CHATS_EXPAND_SUCCESS:
      return importLastMessages(state, action.chats);
    case CHAT_MESSAGES_FETCH_SUCCESS:
      return importMessages(state, action.chatMessages);
    case CHAT_MESSAGE_SEND_SUCCESS:
      return importMessage(state, fromJS(action.chatMessage)).delete(action.uuid);
    case STREAMING_CHAT_UPDATE:
      return importLastMessages(state, [action.chat]);
    case CHAT_MESSAGE_DELETE_REQUEST:
      return state.update(action.messageId, chatMessage => chatMessage.set('pending', true).set('deleting', true));
    case CHAT_MESSAGE_DELETE_SUCCESS:
      return state.delete(action.messageId);
    default:
      return state;
  }
}