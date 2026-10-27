import { Map as ImmutableMap, fromJS } from 'immutable';

import { GROUP_UPDATE_SUCCESS } from '../actions/group_editor';
import {
  GROUP_FETCH_SUCCESS,
  GROUP_FETCH_FAIL,
  GROUPS_FETCH_SUCCESS,
} from '../actions/groups';

const initialState = ImmutableMap();

const normalizeGroup = (state, group) => {
  if (!group || !group.id) return state;
  const immGroup = fromJS(group);
  state = state.set(group.id, immGroup);
  if (group.slug) {
    state = state.set(group.slug, immGroup);
  }
  return state;
};

const normalizeGroups = (state, groups) => {
  (groups || []).forEach(group => {
    state = normalizeGroup(state, group);
  });

  return state;
};

export default function groups(state = initialState, action) {
  switch (action.type) {
    case GROUP_FETCH_SUCCESS:
    case GROUP_UPDATE_SUCCESS:
      return normalizeGroup(state, action.group);
    case GROUPS_FETCH_SUCCESS:
      return normalizeGroups(state, action.groups);
    case GROUP_FETCH_FAIL:
      return state.set(action.id, false);
    default:
      return state;
  }
}
