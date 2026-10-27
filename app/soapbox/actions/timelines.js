import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';
import { getSettings } from 'soapbox/actions/settings';
import { normalizeStatus } from 'soapbox/normalizers';
import { shouldFilter } from 'soapbox/utils/timelines';
import api, { getLinks } from '../api';
import { importFetchedStatus, importFetchedStatuses } from './importer';
const TIMELINE_UPDATE = 'TIMELINE_UPDATE';
const TIMELINE_DELETE = 'TIMELINE_DELETE';
const TIMELINE_CLEAR = 'TIMELINE_CLEAR';
const TIMELINE_UPDATE_QUEUE = 'TIMELINE_UPDATE_QUEUE';
const TIMELINE_DEQUEUE = 'TIMELINE_DEQUEUE';
const TIMELINE_SCROLL_TOP = 'TIMELINE_SCROLL_TOP';
const TIMELINE_EXPAND_REQUEST = 'TIMELINE_EXPAND_REQUEST';
const TIMELINE_EXPAND_SUCCESS = 'TIMELINE_EXPAND_SUCCESS';
const TIMELINE_EXPAND_FAIL = 'TIMELINE_EXPAND_FAIL';
const TIMELINE_CONNECT = 'TIMELINE_CONNECT';
const TIMELINE_DISCONNECT = 'TIMELINE_DISCONNECT';
const TIMELINE_REPLACE = 'TIMELINE_REPLACE';
const TIMELINE_INSERT = 'TIMELINE_INSERT';
const TIMELINE_CLEAR_FEED_ACCOUNT_ID = 'TIMELINE_CLEAR_FEED_ACCOUNT_ID';
const MAX_QUEUED_ITEMS = 40;
const processTimelineUpdate = (timeline, status, accept) => (dispatch, getState) => {
  const me = getState().me;
  const ownStatus = status.account?.id === me;
  const hasPendingStatuses = !getState().pending_statuses.isEmpty();
  const columnSettings = getSettings(getState()).get(timeline, ImmutableMap());
  const shouldSkipQueue = shouldFilter(normalizeStatus(status), columnSettings);
  if (ownStatus && hasPendingStatuses) {
    // WebSockets push statuses without the Idempotency-Key,
    // so if we have pending statuses, don't import it from here.
    // We implement optimistic non-blocking statuses.
    return;
  }
  dispatch(importFetchedStatus(status));
  if (shouldSkipQueue) {
    dispatch(updateTimeline(timeline, status.id, accept));
  } else {
    dispatch(updateTimelineQueue(timeline, status.id, accept));
  }
};
const updateTimeline = (timeline, statusId, accept) => dispatch => {
  // if (typeof accept === 'function' && !accept(status)) {
  //   return;
  // }

  dispatch({
    type: TIMELINE_UPDATE,
    timeline,
    statusId
  });
};
const updateTimelineQueue = (timeline, statusId, accept) => dispatch => {
  // if (typeof accept === 'function' && !accept(status)) {
  //   return;
  // }

  dispatch({
    type: TIMELINE_UPDATE_QUEUE,
    timeline,
    statusId
  });
};
const dequeueTimeline = (timelineId, expandFunc, optionalExpandArgs) => (dispatch, getState) => {
  const state = getState();
  const queuedCount = state.timelines.get(timelineId)?.totalQueuedItemsCount || 0;
  if (queuedCount <= 0) return;
  if (queuedCount <= MAX_QUEUED_ITEMS) {
    dispatch({
      type: TIMELINE_DEQUEUE,
      timeline: timelineId
    });
    return;
  }
  if (typeof expandFunc === 'function') {
    dispatch(clearTimeline(timelineId));
    expandFunc();
  } else {
    if (timelineId === 'home') {
      dispatch(clearTimeline(timelineId));
      dispatch(expandHomeTimeline(optionalExpandArgs));
    } else if (timelineId === 'community') {
      dispatch(clearTimeline(timelineId));
      dispatch(expandCommunityTimeline(optionalExpandArgs));
    }
  }
};
const deleteFromTimelines = id => (dispatch, getState) => {
  const accountId = getState().statuses.get(id)?.account;
  const references = getState().statuses.filter(status => status.get('reblog') === id).map(status => [status.get('id'), status.get('account')]);
  const reblogOf = getState().statuses.getIn([id, 'reblog'], null);
  dispatch({
    type: TIMELINE_DELETE,
    id,
    accountId,
    references,
    reblogOf
  });
};
const clearTimeline = timeline => dispatch => dispatch({
  type: TIMELINE_CLEAR,
  timeline
});
const noOp = () => {};
const noOpAsync = () => () => new Promise(f => f(undefined));
const parseTags = (tags = {}, mode) => {
  return (tags[mode] || []).map(tag => {
    return tag.value;
  });
};
const replaceHomeTimeline = (accountId, {
  maxId
} = {}, done) => (dispatch, _getState) => {
  dispatch({
    type: TIMELINE_REPLACE,
    accountId
  });
  dispatch(expandHomeTimeline({
    accountId,
    maxId
  }, () => {
    dispatch(insertSuggestionsIntoTimeline());
    if (done) {
      done();
    }
  }));
};
const expandTimeline = (timelineId, path, params = {}, done = noOp) => (dispatch, getState) => {
  const timeline = getState().timelines.get(timelineId) || {};
  const isLoadingMore = !!params.max_id;
  if (timeline.isLoading) {
    done();
    return dispatch(noOpAsync());
  }
  if (!params.max_id && !params.pinned && (timeline.items || ImmutableOrderedSet()).size > 0) {
    params.since_id = timeline.getIn(['items', 0]);
  }
  const isLoadingRecent = !!params.since_id;
  dispatch(expandTimelineRequest(timelineId, isLoadingMore));
  return api(getState).get(path, {
    params
  }).then(response => {
    const next = getLinks(response).refs.find(link => link.rel === 'next');
    dispatch(importFetchedStatuses(response.data));
    dispatch(expandTimelineSuccess(timelineId, response.data, next ? next.uri : null, response.status === 206, isLoadingRecent, isLoadingMore));
    done();
  }).catch(error => {
    dispatch(expandTimelineFail(timelineId, error, isLoadingMore));
    done();
  });
};
const expandHomeTimeline = ({
  accountId,
  maxId
} = {}, done = noOp) => {
  const endpoint = accountId ? `/api/v1/accounts/${accountId}/statuses` : '/api/v1/timelines/home';
  const params = {
    max_id: maxId,
    };
  if (accountId) {
    params.exclude_replies = true;
    params.with_muted = true;
  }
  return expandTimeline('home', endpoint, params, done);
};
const expandPublicTimeline = ({
  maxId,
  onlyMedia
} = {}, done = noOp) => expandTimeline(`public${onlyMedia ? ':media' : ''}`, '/api/v1/timelines/public', {
  max_id: maxId,
  only_media: !!onlyMedia
}, done);
const expandBubbleTimeline = ({
  maxId,
  onlyMedia
} = {}, done = noOp) => expandTimeline(`bubble${onlyMedia ? ':media' : ''}`, '/api/v1/timelines/bubble', {
  max_id: maxId,
  only_media: !!onlyMedia
}, done);
const expandRemoteTimeline = (instance, {
  maxId,
  onlyMedia
} = {}, done = noOp) => expandTimeline(`remote${onlyMedia ? ':media' : ''}:${instance}`, '/api/v1/timelines/public', {
  local: false,
  instance: instance,
  max_id: maxId,
  only_media: !!onlyMedia
}, done);
const expandCommunityTimeline = ({
  maxId,
  onlyMedia
} = {}, done = noOp) => expandTimeline(`community${onlyMedia ? ':media' : ''}`, '/api/v1/timelines/public', {
  local: true,
  max_id: maxId,
  only_media: !!onlyMedia
}, done);
const expandAccountTimeline = (accountId, {
  maxId,
  withReplies
} = {}) => expandTimeline(`account:${accountId}${withReplies ? ':with_replies' : ''}`, `/api/v1/accounts/${accountId}/statuses`, {
  exclude_replies: !withReplies,
  max_id: maxId,
  with_muted: true
});
const expandAccountFeaturedTimeline = accountId => expandTimeline(`account:${accountId}:pinned`, `/api/v1/accounts/${accountId}/statuses`, {
  pinned: true,
  with_muted: true
});
const expandAccountMediaTimeline = (accountId, {
  maxId
} = {}) => expandTimeline(`account:${accountId}:media`, `/api/v1/accounts/${accountId}/statuses`, {
  max_id: maxId,
  only_media: true,
  limit: 40,
  with_muted: true
});
const expandListTimeline = (id, {
  maxId
} = {}, done = noOp) => expandTimeline(`list:${id}`, `/api/v1/timelines/list/${id}`, {
  max_id: maxId
}, done);
const expandGroupTimeline = (id, {
  maxId
} = {}, done = noOp) => expandTimeline(`group:${id}`, `/api/v1/timelines/group/${id}`, {
  max_id: maxId
}, done);
const expandHashtagTimeline = (hashtag, {
  maxId,
  tags
} = {}, done = noOp) => {
  return expandTimeline(`hashtag:${hashtag}`, `/api/v1/timelines/tag/${hashtag}`, {
    max_id: maxId,
    any: parseTags(tags, 'any'),
    all: parseTags(tags, 'all'),
    none: parseTags(tags, 'none')
  }, done);
};
const expandTimelineRequest = (timeline, isLoadingMore) => ({
  type: TIMELINE_EXPAND_REQUEST,
  timeline,
  skipLoading: !isLoadingMore
});
const expandTimelineSuccess = (timeline, statuses, next, partial, isLoadingRecent, isLoadingMore) => ({
  type: TIMELINE_EXPAND_SUCCESS,
  timeline,
  statuses,
  next,
  partial,
  isLoadingRecent,
  skipLoading: !isLoadingMore
});
const expandTimelineFail = (timeline, error, isLoadingMore) => ({
  type: TIMELINE_EXPAND_FAIL,
  timeline,
  error,
  skipLoading: !isLoadingMore
});
const connectTimeline = timeline => ({
  type: TIMELINE_CONNECT,
  timeline
});
const disconnectTimeline = timeline => ({
  type: TIMELINE_DISCONNECT,
  timeline
});
const scrollTopTimeline = (timeline, top) => ({
  type: TIMELINE_SCROLL_TOP,
  timeline,
  top
});
const insertSuggestionsIntoTimeline = () => (dispatch, getState) => {
  dispatch({
    type: TIMELINE_INSERT,
    timeline: 'home'
  });
};
const clearFeedAccountId = () => (dispatch, _getState) => {
  dispatch({
    type: TIMELINE_CLEAR_FEED_ACCOUNT_ID
  });
};
export { TIMELINE_UPDATE, TIMELINE_DELETE, TIMELINE_CLEAR, TIMELINE_UPDATE_QUEUE, TIMELINE_DEQUEUE, TIMELINE_SCROLL_TOP, TIMELINE_EXPAND_REQUEST, TIMELINE_EXPAND_SUCCESS, TIMELINE_EXPAND_FAIL, TIMELINE_CONNECT, TIMELINE_DISCONNECT, TIMELINE_REPLACE, TIMELINE_CLEAR_FEED_ACCOUNT_ID, TIMELINE_INSERT, MAX_QUEUED_ITEMS, processTimelineUpdate, updateTimeline, updateTimelineQueue, dequeueTimeline, deleteFromTimelines, clearTimeline, expandTimeline, replaceHomeTimeline, expandHomeTimeline, expandPublicTimeline, expandRemoteTimeline, expandCommunityTimeline, expandAccountTimeline, expandAccountFeaturedTimeline, expandAccountMediaTimeline, expandListTimeline, expandGroupTimeline, expandHashtagTimeline, expandTimelineRequest, expandTimelineSuccess, expandTimelineFail, connectTimeline, disconnectTimeline, scrollTopTimeline, insertSuggestionsIntoTimeline, clearFeedAccountId, expandBubbleTimeline };