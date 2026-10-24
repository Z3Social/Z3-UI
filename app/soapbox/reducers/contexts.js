import { Map as ImmutableMap, Record as ImmutableRecord, OrderedSet as ImmutableOrderedSet } from 'immutable';
import { STATUS_IMPORT, STATUSES_IMPORT } from 'soapbox/actions/importer';
import { ACCOUNT_BLOCK_SUCCESS, ACCOUNT_MUTE_SUCCESS } from '../actions/accounts';
import { CONTEXT_FETCH_SUCCESS, STATUS_CREATE_REQUEST, STATUS_CREATE_SUCCESS } from '../actions/statuses';
import { TIMELINE_DELETE } from '../actions/timelines';
export const ReducerRecord = ImmutableRecord({
  inReplyTos: ImmutableMap(),
  replies: ImmutableMap()
});

/** Minimal status fields needed to process context. */

/** Import a single status into the reducer, setting replies and replyTos. */
const importStatus = (state, status, idempotencyKey) => {
  const {
    id,
    in_reply_to_id: inReplyToId
  } = status;
  if (!inReplyToId) return state;
  return state.withMutations(state => {
    const replies = state.replies.get(inReplyToId) || ImmutableOrderedSet();
    const newReplies = replies.add(id).sort();
    state.setIn(['replies', inReplyToId], newReplies);
    state.setIn(['inReplyTos', id], inReplyToId);
    if (idempotencyKey) {
      deletePendingStatus(state, status, idempotencyKey);
    }
  });
};

/** Import multiple statuses into the state. */
const importStatuses = (state, statuses) => {
  return state.withMutations(state => {
    statuses.forEach(status => importStatus(state, status));
  });
};

/** Insert a fake status ID connecting descendant to ancestor. */
const insertTombstone = (state, ancestorId, descendantId) => {
  const tombstoneId = `${descendantId}-tombstone`;
  return state.withMutations(state => {
    importStatus(state, {
      id: tombstoneId,
      in_reply_to_id: ancestorId
    });
    importStatus(state, {
      id: descendantId,
      in_reply_to_id: tombstoneId
    });
  });
};

/** Find the highest level status from this statusId. */
const getRootNode = (state, statusId, initialId = statusId) => {
  const parent = state.inReplyTos.get(statusId);
  if (!parent) {
    return statusId;
  } else if (parent === initialId) {
    // Prevent cycles
    return parent;
  } else {
    return getRootNode(state, parent, initialId);
  }
};

/** Route fromId to toId by inserting tombstones. */
const connectNodes = (state, fromId, toId) => {
  const fromRoot = getRootNode(state, fromId);
  const toRoot = getRootNode(state, toId);
  if (fromRoot !== toRoot) {
    return insertTombstone(state, toId, fromId);
  } else {
    return state;
  }
};

/** Import a branch of ancestors or descendants, in relation to statusId. */
const importBranch = (state, statuses, statusId) => {
  return state.withMutations(state => {
    statuses.forEach((status, i) => {
      const prevId = statusId && i === 0 ? statusId : (statuses[i - 1] || {}).id;
      if (status.in_reply_to_id) {
        importStatus(state, status);

        // On Mastodon, in_reply_to_id can refer to an unavailable status,
        // so traverse the tree up and insert a connecting tombstone if needed.
        if (statusId) {
          connectNodes(state, status.id, statusId);
        }
      } else if (prevId) {
        // On Pleroma, in_reply_to_id will be null if the parent is unavailable,
        // so insert the tombstone now.
        insertTombstone(state, prevId, status.id);
      }
    });
  });
};

/** Import a status's ancestors and descendants. */
const normalizeContext = (state, id, ancestors, descendants) => state.withMutations(state => {
  importBranch(state, ancestors);
  importBranch(state, descendants, id);
  if (ancestors.length > 0 && !state.getIn(['inReplyTos', id])) {
    insertTombstone(state, ancestors[ancestors.length - 1].id, id);
  }
});

/** Remove a status from the reducer. */
const deleteStatus = (state, id) => {
  return state.withMutations(state => {
    // Delete from its parent's tree
    const parentId = state.inReplyTos.get(id);
    if (parentId) {
      const parentReplies = state.replies.get(parentId) || ImmutableOrderedSet();
      const newParentReplies = parentReplies.delete(id);
      state.setIn(['replies', parentId], newParentReplies);
    }

    // Dereference children
    const replies = state.replies.get(id) || ImmutableOrderedSet();
    replies.forEach(reply => state.deleteIn(['inReplyTos', reply]));
    state.deleteIn(['inReplyTos', id]);
    state.deleteIn(['replies', id]);
  });
};

/** Delete multiple statuses from the reducer. */
const deleteStatuses = (state, ids) => {
  return state.withMutations(state => {
    ids.forEach(id => deleteStatus(state, id));
  });
};

/** Delete statuses upon blocking or muting a user. */
const filterContexts = (state, relationship, statuses) => {
  const ownedStatusIds = statuses.filter(status => status.account === relationship.id).map(status => status.id).toList().toArray();
  return deleteStatuses(state, ownedStatusIds);
};

/** Add a fake status ID for a pending status. */
const importPendingStatus = (state, params, idempotencyKey) => {
  const id = `末pending-${idempotencyKey}`;
  const {
    in_reply_to_id
  } = params;
  return importStatus(state, {
    id,
    in_reply_to_id
  });
};

/** Delete a pending status from the reducer. */
const deletePendingStatus = (state, params, idempotencyKey) => {
  const id = `末pending-${idempotencyKey}`;
  const {
    in_reply_to_id: inReplyToId
  } = params;
  return state.withMutations(state => {
    state.deleteIn(['inReplyTos', id]);
    if (inReplyToId) {
      const replies = state.replies.get(inReplyToId) || ImmutableOrderedSet();
      const newReplies = replies.delete(id).sort();
      state.setIn(['replies', inReplyToId], newReplies);
    }
  });
};

/** Contexts reducer. Used for building a nested tree structure for threads. */
export default function replies(state = ReducerRecord(), action) {
  switch (action.type) {
    case ACCOUNT_BLOCK_SUCCESS:
    case ACCOUNT_MUTE_SUCCESS:
      return filterContexts(state, action.relationship, action.statuses);
    case CONTEXT_FETCH_SUCCESS:
      return normalizeContext(state, action.id, action.ancestors, action.descendants);
    case TIMELINE_DELETE:
      return deleteStatuses(state, [action.id]);
    case STATUS_CREATE_REQUEST:
      return importPendingStatus(state, action.params, action.idempotencyKey);
    case STATUS_CREATE_SUCCESS:
      return deletePendingStatus(state, action.status, action.idempotencyKey);
    case STATUS_IMPORT:
      return importStatus(state, action.status, action.idempotencyKey);
    case STATUSES_IMPORT:
      return importStatuses(state, action.statuses);
    default:
      return state;
  }
}