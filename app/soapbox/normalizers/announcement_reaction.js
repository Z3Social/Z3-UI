/**
 * Announcement reaction normalizer:
 * Converts API announcement emoji reactions into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/announcementreaction/}
 */
import { Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';

// https://docs.joinmastodon.org/entities/announcement/
export const AnnouncementReactionRecord = ImmutableRecord({
  name: '',
  count: 0,
  me: false,
  url: null,
  static_url: null,
  announcement_id: ''
});
export const normalizeAnnouncementReaction = (announcementReaction, announcementId) => {
  return AnnouncementReactionRecord(ImmutableMap(fromJS(announcementReaction)).withMutations(reaction => {
    reaction.set('announcement_id', announcementId);
  }));
};