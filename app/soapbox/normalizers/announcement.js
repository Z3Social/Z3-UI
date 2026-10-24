/**
 * Announcement normalizer:
 * Converts API announcements into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/announcement/}
 */
import { Map as ImmutableMap, List as ImmutableList, Record as ImmutableRecord, fromJS } from 'immutable';
import emojify from 'soapbox/features/emoji/emoji';
import { normalizeEmoji } from 'soapbox/normalizers/emoji';
import { makeEmojiMap } from 'soapbox/utils/normalizers';
import { normalizeAnnouncementReaction } from './announcement_reaction';
import { normalizeMention } from './mention';
// https://docs.joinmastodon.org/entities/announcement/
export const AnnouncementRecord = ImmutableRecord({
  id: '',
  content: '',
  starts_at: null,
  ends_at: null,
  all_day: false,
  read: false,
  published_at: Date,
  reactions: ImmutableList(),
  statuses: ImmutableMap(),
  mentions: ImmutableList(),
  tags: ImmutableList(),
  emojis: ImmutableList(),
  updated_at: Date,
  // Internal fields
  contentHtml: ''
});
const normalizeMentions = announcement => {
  return announcement.update('mentions', ImmutableList(), mentions => {
    return mentions.map(normalizeMention);
  });
};

// Normalize reactions
const normalizeReactions = announcement => {
  return announcement.update('reactions', ImmutableList(), reactions => {
    return reactions.map(reaction => normalizeAnnouncementReaction(reaction, announcement.get('id')));
  });
};

// Normalize emojis
const normalizeEmojis = announcement => {
  return announcement.update('emojis', ImmutableList(), emojis => {
    return emojis.map(normalizeEmoji);
  });
};
const normalizeContent = announcement => {
  const emojiMap = makeEmojiMap(announcement.get('emojis'));
  const contentHtml = emojify(announcement.get('content'), emojiMap);
  return announcement.set('contentHtml', contentHtml);
};
const normalizeStatuses = announcement => {
  const statuses = announcement.get('statuses', ImmutableList()).reduce((acc, curr) => acc.set(curr.get('url'), `/@${curr.getIn(['account', 'acct'])}/${curr.get('id')}`), ImmutableMap());
  return announcement.set('statuses', statuses);
};
export const normalizeAnnouncement = announcement => {
  return AnnouncementRecord(ImmutableMap(fromJS(announcement)).withMutations(announcement => {
    normalizeMentions(announcement);
    normalizeReactions(announcement);
    normalizeEmojis(announcement);
    normalizeContent(announcement);
    normalizeStatuses(announcement);
  }));
};