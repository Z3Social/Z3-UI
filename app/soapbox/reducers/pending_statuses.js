import { Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';
import { STATUS_CREATE_REQUEST, STATUS_CREATE_SUCCESS } from 'soapbox/actions/statuses';
const PendingStatusRecord = ImmutableRecord({
  content_type: '',
  in_reply_to_id: null,
  media_ids: null,
  quote_id: null,
  poll: null,
  sensitive: false,
  spoiler_text: '',
  status: '',
  to: null,
  visibility: 'public'
});
const initialState = ImmutableMap();
const importStatus = (state, params, idempotencyKey) => {
  return state.set(idempotencyKey, PendingStatusRecord(params));
};
const deleteStatus = (state, idempotencyKey) => state.delete(idempotencyKey);
export default function pending_statuses(state = initialState, action) {
  switch (action.type) {
    case STATUS_CREATE_REQUEST:
      return importStatus(state, ImmutableMap(fromJS(action.params)), action.idempotencyKey);
    case STATUS_CREATE_SUCCESS:
      return deleteStatus(state, action.idempotencyKey);
    default:
      return state;
  }
}