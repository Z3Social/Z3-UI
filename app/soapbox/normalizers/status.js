/**
 * Status normalizer:
 * Converts API statuses into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/status/}
 */
import { Map as ImmutableMap, List as ImmutableList, Record as ImmutableRecord, fromJS } from 'immutable';
import { normalizeAttachment } from 'soapbox/normalizers/attachment';
import { normalizeCard } from 'soapbox/normalizers/card';
import { normalizeEmoji } from 'soapbox/normalizers/emoji';
import { normalizeMention } from 'soapbox/normalizers/mention';
import { normalizePoll } from 'soapbox/normalizers/poll';
// https://docs.joinmastodon.org/entities/status/
export const StatusRecord = ImmutableRecord({
  account: null,
  application: null,
  bookmarked: false,
  card: null,
  content: '',
  created_at: new Date(),
  edited_at: null,
  emojis: ImmutableList(),
  favourited: false,
  favourites_count: 0,
  group: null,
  in_reply_to_account_id: null,
  in_reply_to_id: null,
  id: '',
  language: null,
  media_attachments: ImmutableList(),
  mentions: ImmutableList(),
  muted: false,
  pinned: false,
  pleroma: ImmutableMap(),
  poll: null,
  quote: null,
  reblog: null,
  reblogged: false,
  reblogs_count: 0,
  replies_count: 0,
  sensitive: false,
  spoiler_text: '',
  tags: ImmutableList(),
  uri: '',
  url: '',
  visibility: 'public',
  // Internal fields
  contentHtml: '',
  expectsCard: false,
  filtered: false,
  hidden: false,
  search_index: '',
  spoilerHtml: '',
  translations: ImmutableMap()
});
const normalizeAttachments = status => {
  return status.update('media_attachments', ImmutableList(), attachments => {
    return attachments.map(normalizeAttachment);
  });
};
const normalizeMentions = status => {
  return status.update('mentions', ImmutableList(), mentions => {
    return mentions.map(normalizeMention);
  });
};

// Normalize emojis
const normalizeEmojis = entity => {
  return entity.update('emojis', ImmutableList(), emojis => {
    return emojis.map(normalizeEmoji);
  });
};

// Normalize the poll in the status, if applicable
const normalizeStatusPoll = status => {
  if (status.hasIn(['poll', 'options'])) {
    return status.update('poll', ImmutableMap(), normalizePoll);
  } else {
    return status.set('poll', null);
  }
};

// Normalize card
const normalizeStatusCard = status => {
  if (status.get('card')) {
    return status.update('card', ImmutableMap(), normalizeCard);
  } else {
    return status.set('card', null);
  }
};

// Fix order of mentions
const fixMentionsOrder = status => {
  const mentions = status.get('mentions', ImmutableList());
  const inReplyToAccountId = status.get('in_reply_to_account_id');

  // Sort the replied-to mention to the top
  const sorted = mentions.sort((a, _b) => {
    if (a.get('id') === inReplyToAccountId) {
      return -1;
    } else {
      return 0;
    }
  });
  return status.set('mentions', sorted);
};

// Add self to mentions if it's a reply to self
const addSelfMention = status => {
  const accountId = status.getIn(['account', 'id']);
  const isSelfReply = accountId === status.get('in_reply_to_account_id');
  const hasSelfMention = accountId === status.getIn(['mentions', 0, 'id']);
  if (isSelfReply && !hasSelfMention && accountId) {
    const mention = normalizeMention(status.get('account'));
    return status.update('mentions', ImmutableList(), mentions => ImmutableList([mention]).concat(mentions));
  } else {
    return status;
  }
};

// Move the quote to the top-level
const fixQuote = status => {
  return status.withMutations(status => {
    status.update('quote', quote => quote || status.getIn(['pleroma', 'quote']) || null);
    status.deleteIn(['pleroma', 'quote']);
  });
};

// Workaround for not yet implemented filtering from Mastodon 3.6
const fixFiltered = status => {
  status.delete('filtered');
};
export const normalizeStatus = status => {
  return StatusRecord(ImmutableMap(fromJS(status)).withMutations(status => {
    normalizeAttachments(status);
    normalizeMentions(status);
    normalizeEmojis(status);
    normalizeStatusPoll(status);
    normalizeStatusCard(status);
    fixMentionsOrder(status);
    addSelfMention(status);
    fixQuote(status);
    fixFiltered(status);
  }));
};