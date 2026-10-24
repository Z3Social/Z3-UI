/**
 * Status edit normalizer
 */
import escapeTextContentForBrowser from 'escape-html';
import { Map as ImmutableMap, List as ImmutableList, Record as ImmutableRecord, fromJS } from 'immutable';
import emojify from 'soapbox/features/emoji/emoji';
import { normalizeAttachment } from 'soapbox/normalizers/attachment';
import { normalizeEmoji } from 'soapbox/normalizers/emoji';
import { normalizePoll } from 'soapbox/normalizers/poll';
import { stripCompatibilityFeatures } from 'soapbox/utils/html';
import { makeEmojiMap } from 'soapbox/utils/normalizers';
export const StatusEditRecord = ImmutableRecord({
  account: null,
  content: '',
  created_at: new Date(),
  emojis: ImmutableList(),
  favourited: false,
  media_attachments: ImmutableList(),
  poll: null,
  sensitive: false,
  spoiler_text: '',
  // Internal fields
  contentHtml: '',
  spoilerHtml: ''
});
const normalizeAttachments = statusEdit => {
  return statusEdit.update('media_attachments', ImmutableList(), attachments => {
    return attachments.map(normalizeAttachment);
  });
};

// Normalize emojis
const normalizeEmojis = entity => {
  return entity.update('emojis', ImmutableList(), emojis => {
    return emojis.map(normalizeEmoji);
  });
};

// Normalize the poll in the status, if applicable
const normalizeStatusPoll = statusEdit => {
  if (statusEdit.hasIn(['poll', 'options'])) {
    return statusEdit.update('poll', ImmutableMap(), normalizePoll);
  } else {
    return statusEdit.set('poll', null);
  }
};
const normalizeContent = statusEdit => {
  const emojiMap = makeEmojiMap(statusEdit.get('emojis'));
  const contentHtml = stripCompatibilityFeatures(emojify(statusEdit.get('content'), emojiMap));
  const spoilerHtml = emojify(escapeTextContentForBrowser(statusEdit.get('spoiler_text')), emojiMap);
  return statusEdit.set('contentHtml', contentHtml).set('spoilerHtml', spoilerHtml);
};
export const normalizeStatusEdit = statusEdit => {
  return StatusEditRecord(ImmutableMap(fromJS(statusEdit)).withMutations(statusEdit => {
    normalizeAttachments(statusEdit);
    normalizeEmojis(statusEdit);
    normalizeStatusPoll(statusEdit);
    normalizeContent(statusEdit);
  }));
};