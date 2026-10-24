import { Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';
export const ChatRecord = ImmutableRecord({
  account: null,
  id: '',
  unread: 0,
  last_message: '' || null,
  updated_at: new Date()
});
export const normalizeChat = chat => {
  return ChatRecord(ImmutableMap(fromJS(chat)));
};