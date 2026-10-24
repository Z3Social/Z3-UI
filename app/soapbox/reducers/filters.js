import { List as ImmutableList } from 'immutable';
import { normalizeFilter } from 'soapbox/normalizers';
import { FILTERS_FETCH_SUCCESS } from '../actions/filters';
const importFilters = (_state, filters) => {
  return ImmutableList(filters.map(filter => normalizeFilter(filter)));
};
export default function filters(state = ImmutableList(), action) {
  switch (action.type) {
    case FILTERS_FETCH_SUCCESS:
      return importFilters(state, action.filters);
    default:
      return state;
  }
}