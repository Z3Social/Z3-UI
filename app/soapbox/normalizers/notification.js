/**
 * Notification normalizer:
 * Converts API notifications into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/notification/}
 */
import { Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';
// https://docs.joinmastodon.org/entities/notification/
export const NotificationRecord = ImmutableRecord({
  account: null,
  chat_message: null,
  // pleroma:chat_mention
  created_at: new Date(),
  emoji: null,
  // pleroma:emoji_reaction
  emoji_url: null,
  // pleroma:emoji_reaction used to custom emojis
  id: '',
  status: null,
  target: null,
  // move
  type: '',
  total_count: null // grouped notifications
});
export const normalizeNotification = notification => {
  return NotificationRecord(ImmutableMap(fromJS(notification)));
};