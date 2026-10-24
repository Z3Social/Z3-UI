import { Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';
import { STATUS_IMPORT, STATUSES_IMPORT } from 'soapbox/actions/importer';
import { SCHEDULED_STATUSES_FETCH_SUCCESS, SCHEDULED_STATUS_CANCEL_REQUEST, SCHEDULED_STATUS_CANCEL_SUCCESS } from 'soapbox/actions/scheduled_statuses';
import { STATUS_CREATE_SUCCESS } from 'soapbox/actions/statuses';
const ScheduledStatusRecord = ImmutableRecord({
  id: '',
  scheduled_at: new Date(),
  media_attachments: null,
  text: '',
  in_reply_to_id: null,
  media_ids: null,
  sensitive: false,
  spoiler_text: '',
  visibility: 'public',
  poll: null
});
const initialState = ImmutableMap();
const importStatus = (state, {
  params,
  ...status
}) => {
  if (!status.scheduled_at) return state;
  return state.set(status.id, ScheduledStatusRecord(ImmutableMap(fromJS({
    ...status,
    ...params
  }))));
};
const importStatuses = (state, statuses) => state.withMutations(mutable => statuses.forEach(status => importStatus(mutable, status)));
const deleteStatus = (state, id) => state.delete(id);
export default function scheduled_statuses(state = initialState, action) {
  switch (action.type) {
    case STATUS_IMPORT:
    case STATUS_CREATE_SUCCESS:
      return importStatus(state, action.status);
    case STATUSES_IMPORT:
    case SCHEDULED_STATUSES_FETCH_SUCCESS:
      return importStatuses(state, action.statuses);
    case SCHEDULED_STATUS_CANCEL_REQUEST:
    case SCHEDULED_STATUS_CANCEL_SUCCESS:
      return deleteStatus(state, action.id);
    default:
      return state;
  }
}