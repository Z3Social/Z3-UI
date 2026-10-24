import { List as ImmutableList, Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';
export const ChatMessageRecord = ImmutableRecord({
  account_id: '',
  attachment: null,
  card: null,
  chat_id: '',
  content: '',
  created_at: new Date(),
  emojis: ImmutableList(),
  id: '',
  unread: false,
  deleting: false,
  pending: false
});
export const normalizeChatMessage = chatMessage => {
  return ChatMessageRecord(ImmutableMap(fromJS(chatMessage)));
};