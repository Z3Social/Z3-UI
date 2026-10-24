/**
 * Poll normalizer:
 * Converts API polls into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/poll/}
 */
import escapeTextContentForBrowser from 'escape-html';
import { Map as ImmutableMap, List as ImmutableList, Record as ImmutableRecord, fromJS } from 'immutable';
import emojify from 'soapbox/features/emoji/emoji';
import { normalizeEmoji } from 'soapbox/normalizers/emoji';
import { makeEmojiMap } from 'soapbox/utils/normalizers';
// https://docs.joinmastodon.org/entities/poll/
export const PollRecord = ImmutableRecord({
  emojis: ImmutableList(),
  expired: false,
  expires_at: new Date(),
  id: '',
  multiple: false,
  options: ImmutableList(),
  voters_count: 0,
  votes_count: 0,
  own_votes: null,
  voted: false,
  pleroma: ImmutableMap()
});

// Sub-entity of Poll
export const PollOptionRecord = ImmutableRecord({
  title: '',
  votes_count: 0,
  // Internal fields
  title_emojified: ''
});

// Normalize emojis
const normalizeEmojis = entity => {
  return entity.update('emojis', ImmutableList(), emojis => {
    return emojis.map(normalizeEmoji);
  });
};
const normalizePollOption = (option, emojis = ImmutableList()) => {
  const emojiMap = makeEmojiMap(emojis);
  if (typeof option === 'string') {
    const titleEmojified = emojify(escapeTextContentForBrowser(option), emojiMap);
    return PollOptionRecord({
      title: option,
      title_emojified: titleEmojified
    });
  }
  const titleEmojified = emojify(escapeTextContentForBrowser(option.get('title')), emojiMap);
  return PollOptionRecord(option.set('title_emojified', titleEmojified));
};

// Normalize poll options
const normalizePollOptions = poll => {
  const emojis = poll.get('emojis');
  return poll.update('options', options => {
    return options.map(option => normalizePollOption(option, emojis));
  });
};

// Normalize own_votes to `null` if empty (like Mastodon)
const normalizePollOwnVotes = poll => {
  return poll.update('own_votes', ownVotes => {
    return ownVotes?.size > 0 ? ownVotes : null;
  });
};

// Whether the user voted in the poll
const normalizePollVoted = poll => {
  return poll.update('voted', voted => {
    return typeof voted === 'boolean' ? voted : poll.get('own_votes')?.size > 0;
  });
};
export const normalizePoll = poll => {
  return PollRecord(ImmutableMap(fromJS(poll)).withMutations(poll => {
    normalizeEmojis(poll);
    normalizePollOptions(poll);
    normalizePollOwnVotes(poll);
    normalizePollVoted(poll);
  }));
};