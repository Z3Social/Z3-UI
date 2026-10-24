import { Map as ImmutableMap } from 'immutable';
import { LIST_FETCH_SUCCESS, LIST_FETCH_FAIL, LISTS_FETCH_SUCCESS, LIST_CREATE_SUCCESS, LIST_UPDATE_SUCCESS, LIST_DELETE_SUCCESS } from 'soapbox/actions/lists';
import { normalizeList } from 'soapbox/normalizers';
const initialState = ImmutableMap();
const importList = (state, list) => state.set(list.id, normalizeList(list));
const importLists = (state, lists) => {
  lists.forEach(list => {
    state = importList(state, list);
  });
  return state;
};
export default function lists(state = initialState, action) {
  switch (action.type) {
    case LIST_FETCH_SUCCESS:
    case LIST_CREATE_SUCCESS:
    case LIST_UPDATE_SUCCESS:
      return importList(state, action.list);
    case LISTS_FETCH_SUCCESS:
      return importLists(state, action.lists);
    case LIST_DELETE_SUCCESS:
    case LIST_FETCH_FAIL:
      return state.set(action.id, false);
    default:
      return state;
  }
}