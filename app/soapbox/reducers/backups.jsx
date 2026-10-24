import { Map as ImmutableMap, Record as ImmutableRecord } from 'immutable';
import { BACKUPS_FETCH_SUCCESS, BACKUPS_CREATE_SUCCESS } from '../actions/backups';
const BackupRecord = ImmutableRecord({
  id: null,
  content_type: '',
  url: '',
  file_size: null,
  processed: false,
  inserted_at: ''
});
const initialState = ImmutableMap();
const importBackup = (state, backup) => {
  return state.set(backup.inserted_at, BackupRecord(backup));
};
const importBackups = (state, backups) => {
  return state.withMutations(mutable => {
    backups.forEach(backup => importBackup(mutable, backup));
  });
};
export default function backups(state = initialState, action) {
  switch (action.type) {
    case BACKUPS_FETCH_SUCCESS:
    case BACKUPS_CREATE_SUCCESS:
      return importBackups(state, action.backups);
    default:
      return state;
  }
}