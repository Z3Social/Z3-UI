import { List as ImmutableList, Record as ImmutableRecord } from 'immutable';
import { normalizeTag } from 'soapbox/normalizers';
import { TRENDS_FETCH_REQUEST, TRENDS_FETCH_SUCCESS, TRENDS_FETCH_FAIL } from '../actions/trends';
const ReducerRecord = ImmutableRecord({
  items: ImmutableList(),
  isLoading: false
});
export default function trendsReducer(state = ReducerRecord(), action) {
  switch (action.type) {
    case TRENDS_FETCH_REQUEST:
      return state.set('isLoading', true);
    case TRENDS_FETCH_SUCCESS:
      return state.withMutations(map => {
        map.set('items', ImmutableList(action.tags.map(item => normalizeTag(item))));
        map.set('isLoading', false);
      });
    case TRENDS_FETCH_FAIL:
      return state.set('isLoading', false);
    default:
      return state;
  }
}