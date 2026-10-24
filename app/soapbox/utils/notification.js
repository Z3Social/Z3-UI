/** Notification types known to Soapbox. */
const NOTIFICATION_TYPES = ['follow', 'follow_request', 'mention', 'reblog', 'favourite', 'poll', 'status', 'move', 'pleroma:chat_mention', 'pleroma:emoji_reaction', 'user_approved', 'update'];
/** Ensure the Notification is a valid, known type. */
const validType = type => NOTIFICATION_TYPES.includes(type);
export { NOTIFICATION_TYPES, validType };