import { Record as ImmutableRecord } from 'immutable';
import { ACCOUNT_NOTE_INIT_MODAL, ACCOUNT_NOTE_CHANGE_COMMENT, ACCOUNT_NOTE_SUBMIT_REQUEST, ACCOUNT_NOTE_SUBMIT_FAIL, ACCOUNT_NOTE_SUBMIT_SUCCESS } from '../actions/account-notes';
export const EditRecord = ImmutableRecord({
  isSubmitting: false,
  account: null,
  comment: ''
});
export const ReducerRecord = ImmutableRecord({
  edit: EditRecord()
});
export default function account_notes(state = ReducerRecord(), action) {
  switch (action.type) {
    case ACCOUNT_NOTE_INIT_MODAL:
      return state.withMutations(state => {
        state.setIn(['edit', 'isSubmitting'], false);
        state.setIn(['edit', 'account'], action.account.get('id'));
        state.setIn(['edit', 'comment'], action.comment);
      });
    case ACCOUNT_NOTE_CHANGE_COMMENT:
      return state.setIn(['edit', 'comment'], action.comment);
    case ACCOUNT_NOTE_SUBMIT_REQUEST:
      return state.setIn(['edit', 'isSubmitting'], true);
    case ACCOUNT_NOTE_SUBMIT_FAIL:
    case ACCOUNT_NOTE_SUBMIT_SUCCESS:
      return state.setIn(['edit', 'isSubmitting'], false);
    default:
      return state;
  }
}