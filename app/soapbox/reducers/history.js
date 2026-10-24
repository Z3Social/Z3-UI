import { List as ImmutableList, Map as ImmutableMap, Record as ImmutableRecord } from 'immutable';
import { HISTORY_FETCH_REQUEST, HISTORY_FETCH_SUCCESS, HISTORY_FETCH_FAIL } from 'soapbox/actions/history';
import { normalizeStatusEdit } from 'soapbox/normalizers';
const HistoryRecord = ImmutableRecord({
  loading: false,
  items: ImmutableList()
});
const initialState = ImmutableMap();
export default function history(state = initialState, action) {
  switch (action.type) {
    case HISTORY_FETCH_REQUEST:
      return state.update(action.statusId, HistoryRecord(), history => history.withMutations(map => {
        map.set('loading', true);
        map.set('items', ImmutableList());
      }));
    case HISTORY_FETCH_SUCCESS:
      return state.update(action.statusId, HistoryRecord(), history => history.withMutations(map => {
        map.set('loading', false);
        map.set('items', ImmutableList(action.history.map((x, i) => ({
          ...x,
          account: x.account.id,
          original: i === 0
        })).reverse().map(normalizeStatusEdit)));
      }));
    case HISTORY_FETCH_FAIL:
      return state.update(action.statusId, HistoryRecord(), history => history.set('loading', false));
    default:
      return state;
  }
}