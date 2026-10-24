import { OrderedSet as ImmutableOrderedSet, Record as ImmutableRecord } from 'immutable';
import { DOMAIN_BLOCKS_FETCH_SUCCESS, DOMAIN_BLOCKS_EXPAND_SUCCESS, DOMAIN_UNBLOCK_SUCCESS } from '../actions/domain_blocks';
const BlocksRecord = ImmutableRecord({
  items: ImmutableOrderedSet(),
  next: null
});
const ReducerRecord = ImmutableRecord({
  blocks: BlocksRecord()
});
export default function domainLists(state = ReducerRecord(), action) {
  switch (action.type) {
    case DOMAIN_BLOCKS_FETCH_SUCCESS:
      return state.setIn(['blocks', 'items'], ImmutableOrderedSet(action.domains)).setIn(['blocks', 'next'], action.next);
    case DOMAIN_BLOCKS_EXPAND_SUCCESS:
      return state.updateIn(['blocks', 'items'], set => set.union(action.domains)).setIn(['blocks', 'next'], action.next);
    case DOMAIN_UNBLOCK_SUCCESS:
      return state.updateIn(['blocks', 'items'], set => set.delete(action.domain));
    default:
      return state;
  }
}