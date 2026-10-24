import { Record as ImmutableRecord } from 'immutable';
import { STATUS_HOVER_CARD_OPEN, STATUS_HOVER_CARD_CLOSE, STATUS_HOVER_CARD_UPDATE } from 'soapbox/actions/status-hover-card';
export const ReducerRecord = ImmutableRecord({
  ref: null,
  statusId: '',
  hovered: false
});
export default function statusHoverCard(state = ReducerRecord(), action) {
  switch (action.type) {
    case STATUS_HOVER_CARD_OPEN:
      return state.withMutations(state => {
        state.set('ref', action.ref);
        state.set('statusId', action.statusId);
      });
    case STATUS_HOVER_CARD_UPDATE:
      return state.set('hovered', true);
    case STATUS_HOVER_CARD_CLOSE:
      if (state.hovered === true && !action.force) return state;else return ReducerRecord();
    default:
      return state;
  }
}