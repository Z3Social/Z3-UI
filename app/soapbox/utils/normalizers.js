/** Use new value only if old value is undefined */
export const mergeDefined = (oldVal, newVal) => oldVal === undefined ? newVal : oldVal;
export const makeEmojiMap = emojis => emojis.reduce((obj, emoji) => {
  obj[`:${emoji.shortcode}:`] = emoji;
  return obj;
}, {});

/** Normalize entity ID */
export const normalizeId = id => {
  return typeof id === 'string' ? id : null;
};