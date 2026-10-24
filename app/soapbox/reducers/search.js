import { OrderedSet as ImmutableOrderedSet, Record as ImmutableRecord, fromJS } from 'immutable';
import { normalizeTag } from 'soapbox/normalizers';
import { COMPOSE_MENTION, COMPOSE_REPLY, COMPOSE_DIRECT, COMPOSE_QUOTE } from '../actions/compose';
import { SEARCH_CHANGE, SEARCH_CLEAR, SEARCH_FETCH_REQUEST, SEARCH_FETCH_SUCCESS, SEARCH_SHOW, SEARCH_FILTER_SET, SEARCH_EXPAND_REQUEST, SEARCH_EXPAND_SUCCESS, SEARCH_ACCOUNT_SET } from '../actions/search';
const ResultsRecord = ImmutableRecord({
  accounts: ImmutableOrderedSet(),
  statuses: ImmutableOrderedSet(),
  hashtags: ImmutableOrderedSet(),
  // it's a list of maps
  accountsHasMore: false,
  statusesHasMore: false,
  hashtagsHasMore: false,
  accountsLoaded: false,
  statusesLoaded: false,
  hashtagsLoaded: false
});
const ReducerRecord = ImmutableRecord({
  value: '',
  submitted: false,
  submittedValue: '',
  hidden: false,
  results: ResultsRecord(),
  filter: 'statuses',
  accountId: null
});
const toIds = items => {
  return ImmutableOrderedSet(items.map(item => item.id));
};
const importResults = (state, results, searchTerm, searchType) => {
  return state.withMutations(state => {
    if (state.value === searchTerm && state.filter === searchType) {
      state.set('results', ResultsRecord({
        accounts: toIds(results.accounts),
        statuses: toIds(results.statuses),
        hashtags: ImmutableOrderedSet(results.hashtags.map(normalizeTag)),
        // it's a list of records
        accountsHasMore: results.accounts.length >= 20,
        statusesHasMore: results.statuses.length >= 20,
        hashtagsHasMore: results.hashtags.length >= 20,
        accountsLoaded: true,
        statusesLoaded: true,
        hashtagsLoaded: true
      }));
      state.set('submitted', true);
    }
  });
};
const paginateResults = (state, searchType, results, searchTerm) => {
  return state.withMutations(state => {
    if (state.value === searchTerm) {
      state.setIn(['results', `${searchType}HasMore`], results[searchType].length >= 20);
      state.setIn(['results', `${searchType}Loaded`], true);
      state.updateIn(['results', searchType], items => {
        const data = results[searchType];
        // Hashtags are a list of maps. Others are IDs.
        if (searchType === 'hashtags') {
          return items.concat(fromJS(data));
        } else {
          return items.concat(toIds(data));
        }
      });
    }
  });
};
const handleSubmitted = (state, value) => {
  return state.withMutations(state => {
    state.set('results', ResultsRecord());
    state.set('submitted', true);
    state.set('submittedValue', value);
  });
};
export default function search(state = ReducerRecord(), action) {
  switch (action.type) {
    case SEARCH_CHANGE:
      return state.set('value', action.value);
    case SEARCH_CLEAR:
      return ReducerRecord({
        filter: state.filter
      });
    case SEARCH_SHOW:
      return state.set('hidden', false);
    case COMPOSE_REPLY:
    case COMPOSE_MENTION:
    case COMPOSE_DIRECT:
    case COMPOSE_QUOTE:
      return state.set('hidden', true);
    case SEARCH_FETCH_REQUEST:
      return handleSubmitted(state, action.value);
    case SEARCH_FETCH_SUCCESS:
      return importResults(state, action.results, action.searchTerm, action.searchType);
    case SEARCH_FILTER_SET:
      return state.set('filter', action.value);
    case SEARCH_EXPAND_REQUEST:
      return state.setIn(['results', `${action.searchType}Loaded`], false);
    case SEARCH_EXPAND_SUCCESS:
      return paginateResults(state, action.searchType, action.results, action.searchTerm);
    case SEARCH_ACCOUNT_SET:
      if (!action.accountId) return state.set('accountId', null);
      return ReducerRecord({
        accountId: action.accountId,
        filter: 'statuses'
      });
    default:
      return state;
  }
}