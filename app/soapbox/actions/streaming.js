import { getSettings } from 'soapbox/actions/settings';
import messages from 'soapbox/locales/messages';
import { connectStream } from '../stream';
import { deleteAnnouncement, fetchAnnouncements, updateAnnouncements, updateReaction as updateAnnouncementsReaction } from './announcements';
import { updateConversations } from './conversations';
import { fetchFilters } from './filters';
import { MARKER_FETCH_SUCCESS } from './markers';
import { updateNotificationsQueue, expandNotifications } from './notifications';
import { updateStatus } from './statuses';
import {
// deleteFromTimelines,
expandHomeTimeline, connectTimeline, disconnectTimeline, processTimelineUpdate } from './timelines';
const STREAMING_CHAT_UPDATE = 'STREAMING_CHAT_UPDATE';
const STREAMING_FOLLOW_RELATIONSHIPS_UPDATE = 'STREAMING_FOLLOW_RELATIONSHIPS_UPDATE';
const validLocale = locale => Object.keys(messages).includes(locale);
const getLocale = state => {
  const locale = getSettings(state).get('locale');
  return validLocale(locale) ? locale : 'en';
};
const updateFollowRelationships = relationships => (dispatch, getState) => {
  const me = getState().me;
  return dispatch({
    type: STREAMING_FOLLOW_RELATIONSHIPS_UPDATE,
    me,
    ...relationships
  });
};
const connectTimelineStream = (timelineId, path, pollingRefresh = null, accept = null) => connectStream(path, pollingRefresh, (dispatch, getState) => {
  const locale = getLocale(getState());
  return {
    onConnect() {
      dispatch(connectTimeline(timelineId));
    },
    onDisconnect() {
      dispatch(disconnectTimeline(timelineId));
    },
    onReceive(data) {
      switch (data.event) {
        case 'update':
          dispatch(processTimelineUpdate(timelineId, JSON.parse(data.payload), accept));
          break;
        case 'status.update':
          dispatch(updateStatus(JSON.parse(data.payload)));
          break;
        // FIXME: We think delete & redraft is causing jumpy timelines.
        // Fix that in ScrollableList then re-enable this!
        //
        // case 'delete':
        //   dispatch(deleteFromTimelines(data.payload));
        //   break;
        case 'notification':
          messages[locale]().then(messages => {
            dispatch(updateNotificationsQueue(JSON.parse(data.payload), messages, locale, window.location.pathname));
          }).catch(error => {
            console.error(error);
          });
          break;
        case 'conversation':
          dispatch(updateConversations(JSON.parse(data.payload)));
          break;
        case 'filters_changed':
          dispatch(fetchFilters());
          break;
        case 'pleroma:chat_update':
          dispatch((dispatch, getState) => {
            const chat = JSON.parse(data.payload);
            const me = getState().me;
            const messageOwned = !(chat.last_message && chat.last_message.account_id !== me);
            dispatch({
              type: STREAMING_CHAT_UPDATE,
              chat,
              me,
              // Only play sounds for recipient messages
              meta: !messageOwned && getSettings(getState()).getIn(['chats', 'sound']) && {
                sound: 'chat'
              }
            });
          });
          break;
        case 'pleroma:follow_relationships_update':
          dispatch(updateFollowRelationships(JSON.parse(data.payload)));
          break;
        case 'announcement':
          dispatch(updateAnnouncements(JSON.parse(data.payload)));
          break;
        case 'announcement.reaction':
          dispatch(updateAnnouncementsReaction(JSON.parse(data.payload)));
          break;
        case 'announcement.delete':
          dispatch(deleteAnnouncement(data.payload));
          break;
        case 'marker':
          dispatch({
            type: MARKER_FETCH_SUCCESS,
            marker: JSON.parse(data.payload)
          });
          break;
      }
    }
  };
});
const refreshHomeTimelineAndNotification = (dispatch, done) => dispatch(expandHomeTimeline({}, () => dispatch(expandNotifications({}, () => dispatch(fetchAnnouncements(done))))));
const connectUserStream = () => connectTimelineStream('home', 'user', refreshHomeTimelineAndNotification);
const connectCommunityStream = ({
  onlyMedia
} = {}) => connectTimelineStream(`community${onlyMedia ? ':media' : ''}`, `public:local${onlyMedia ? ':media' : ''}`);

// Bubble stream doesnt exists for now
// const connectBubbleStream = ({ onlyMedia }: Record<string, any> = {}) =>
//   connectTimelineStream(`bubble${onlyMedia ? ':media' : ''}`, `bubble${onlyMedia ? ':media' : ''}`);

const connectPublicStream = ({
  onlyMedia
} = {}) => connectTimelineStream(`public${onlyMedia ? ':media' : ''}`, `public${onlyMedia ? ':media' : ''}`);
const connectRemoteStream = (instance, {
  onlyMedia
} = {}) => connectTimelineStream(`remote${onlyMedia ? ':media' : ''}:${instance}`, `public:remote${onlyMedia ? ':media' : ''}&instance=${instance}`);
const connectHashtagStream = (id, tag, accept) => connectTimelineStream(`hashtag:${id}`, `hashtag&tag=${tag}`, null, accept);
const connectDirectStream = () => connectTimelineStream('direct', 'direct');
const connectListStream = id => connectTimelineStream(`list:${id}`, `list&list=${id}`);
const connectGroupStream = id => connectTimelineStream(`group:${id}`, `group&group=${id}`);
export { STREAMING_CHAT_UPDATE, STREAMING_FOLLOW_RELATIONSHIPS_UPDATE, connectTimelineStream, connectUserStream, connectCommunityStream, connectPublicStream, connectRemoteStream, connectHashtagStream, connectDirectStream, connectListStream, connectGroupStream
// connectBubbleStream,
};