import api from '../api';
import { openModal, closeModal } from './modals';
const ACCOUNT_NOTE_SUBMIT_REQUEST = 'ACCOUNT_NOTE_SUBMIT_REQUEST';
const ACCOUNT_NOTE_SUBMIT_SUCCESS = 'ACCOUNT_NOTE_SUBMIT_SUCCESS';
const ACCOUNT_NOTE_SUBMIT_FAIL = 'ACCOUNT_NOTE_SUBMIT_FAIL';
const ACCOUNT_NOTE_INIT_MODAL = 'ACCOUNT_NOTE_INIT_MODAL';
const ACCOUNT_NOTE_CHANGE_COMMENT = 'ACCOUNT_NOTE_CHANGE_COMMENT';
const submitAccountNote = () => (dispatch, getState) => {
  dispatch(submitAccountNoteRequest());
  const id = getState().account_notes.edit.account;
  return api(getState).post(`/api/v1/accounts/${id}/note`, {
    comment: getState().account_notes.edit.comment
  }).then(response => {
    dispatch(closeModal());
    dispatch(submitAccountNoteSuccess(response.data));
  }).catch(error => dispatch(submitAccountNoteFail(error)));
};
function submitAccountNoteRequest() {
  return {
    type: ACCOUNT_NOTE_SUBMIT_REQUEST
  };
}
function submitAccountNoteSuccess(relationship) {
  return {
    type: ACCOUNT_NOTE_SUBMIT_SUCCESS,
    relationship
  };
}
function submitAccountNoteFail(error) {
  return {
    type: ACCOUNT_NOTE_SUBMIT_FAIL,
    error
  };
}
const initAccountNoteModal = account => (dispatch, getState) => {
  const comment = getState().relationships.get(account.id).note;
  dispatch({
    type: ACCOUNT_NOTE_INIT_MODAL,
    account,
    comment
  });
  dispatch(openModal('ACCOUNT_NOTE'));
};
function changeAccountNoteComment(comment) {
  return {
    type: ACCOUNT_NOTE_CHANGE_COMMENT,
    comment
  };
}
export { submitAccountNote, initAccountNoteModal, changeAccountNoteComment, ACCOUNT_NOTE_SUBMIT_REQUEST, ACCOUNT_NOTE_SUBMIT_SUCCESS, ACCOUNT_NOTE_SUBMIT_FAIL, ACCOUNT_NOTE_INIT_MODAL, ACCOUNT_NOTE_CHANGE_COMMENT };