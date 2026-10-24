import { OrderedSet as ImmutableOrderedSet, Record as ImmutableRecord } from 'immutable';
import { ACCOUNT_BLOCK_SUCCESS, ACCOUNT_MUTE_SUCCESS } from 'soapbox/actions/accounts';
import { DOMAIN_BLOCK_SUCCESS } from 'soapbox/actions/domain_blocks';
import { SUGGESTIONS_FETCH_REQUEST, SUGGESTIONS_FETCH_SUCCESS, SUGGESTIONS_FETCH_FAIL, SUGGESTIONS_DISMISS, SUGGESTIONS_V2_FETCH_REQUEST, SUGGESTIONS_V2_FETCH_SUCCESS, SUGGESTIONS_V2_FETCH_FAIL, SUGGESTIONS_TRUTH_FETCH_SUCCESS } from 'soapbox/actions/suggestions';
const SuggestionRecord = ImmutableRecord({
  source: '',
  account: ''
});
const ReducerRecord = ImmutableRecord({
  items: ImmutableOrderedSet(),
  next: null,
  isLoading: false
});
// Convert a v1 account into a v2 suggestion
const accountToSuggestion = account => {
  return {
    source: 'past_interactions',
    account: account.id
  };
};
const importAccounts = (state, accounts) => {
  return state.withMutations(state => {
    state.set('items', ImmutableOrderedSet(accounts.map(accountToSuggestion).map(suggestion => SuggestionRecord(suggestion))));
    state.set('isLoading', false);
  });
};
const importSuggestions = (state, suggestions, next) => {
  return state.withMutations(state => {
    state.update('items', items => items.concat(suggestions.map(x => ({
      ...x,
      account: x.account.id
    })).map(suggestion => SuggestionRecord(suggestion))));
    state.set('isLoading', false);
    state.set('next', next);
  });
};
const importTruthSuggestions = (state, suggestions, next) => {
  return state.withMutations(state => {
    state.update('items', items => items.concat(suggestions.map(x => ({
      ...x,
      account: x.account_id
    })).map(suggestion => SuggestionRecord(suggestion))));
    state.set('isLoading', false);
    state.set('next', next);
  });
};
const dismissAccount = (state, accountId) => {
  return state.update('items', items => items.filterNot(item => item.account === accountId));
};
const dismissAccounts = (state, accountIds) => {
  return state.update('items', items => items.filterNot(item => accountIds.includes(item.account)));
};
export default function suggestionsReducer(state = ReducerRecord(), action) {
  switch (action.type) {
    case SUGGESTIONS_FETCH_REQUEST:
    case SUGGESTIONS_V2_FETCH_REQUEST:
      return state.set('isLoading', true);
    case SUGGESTIONS_FETCH_SUCCESS:
      return importAccounts(state, action.accounts);
    case SUGGESTIONS_V2_FETCH_SUCCESS:
      return importSuggestions(state, action.suggestions, action.next);
    case SUGGESTIONS_TRUTH_FETCH_SUCCESS:
      return importTruthSuggestions(state, action.suggestions, action.next);
    case SUGGESTIONS_FETCH_FAIL:
    case SUGGESTIONS_V2_FETCH_FAIL:
      return state.set('isLoading', false);
    case SUGGESTIONS_DISMISS:
      return dismissAccount(state, action.id);
    case ACCOUNT_BLOCK_SUCCESS:
    case ACCOUNT_MUTE_SUCCESS:
      return dismissAccount(state, action.relationship.id);
    case DOMAIN_BLOCK_SUCCESS:
      return dismissAccounts(state, action.accounts);
    default:
      return state;
  }
}