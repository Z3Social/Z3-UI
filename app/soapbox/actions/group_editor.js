import { isLoggedIn } from 'soapbox/utils/auth';
import api from '../api';
const GROUP_CREATE_REQUEST = 'GROUP_CREATE_REQUEST';
const GROUP_CREATE_SUCCESS = 'GROUP_CREATE_SUCCESS';
const GROUP_CREATE_FAIL = 'GROUP_CREATE_FAIL';
const GROUP_UPDATE_REQUEST = 'GROUP_UPDATE_REQUEST';
const GROUP_UPDATE_SUCCESS = 'GROUP_UPDATE_SUCCESS';
const GROUP_UPDATE_FAIL = 'GROUP_UPDATE_FAIL';
const GROUP_EDITOR_VALUE_CHANGE = 'GROUP_EDITOR_VALUE_CHANGE';
const GROUP_EDITOR_RESET = 'GROUP_EDITOR_RESET';
const GROUP_EDITOR_SETUP = 'GROUP_EDITOR_SETUP';
const submit = routerHistory => (dispatch, getState) => {
  const groupId = getState().group_editor.get('groupId');
  const title = getState().group_editor.get('title');
  const description = getState().group_editor.get('description');
  const coverImage = getState().group_editor.get('coverImage');
  const visibility = getState().group_editor.get('visibility');
  if (groupId === null) {
    dispatch(create(title, description, coverImage, visibility, routerHistory));
  } else {
    dispatch(update(groupId, title, description, coverImage, visibility, routerHistory));
  }
};
const create = (title, description, coverImage, visibility, routerHistory) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  dispatch(createRequest());
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('visibility', visibility);
  if (coverImage !== null) {
    formData.append('cover_image', coverImage);
  }
  api(getState).post('/api/v1/groups', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(({
    data
  }) => {
    dispatch(createSuccess(data));
    routerHistory.push(`/groups/${data.id}`);
  }).catch(err => dispatch(createFail(err)));
};
const createRequest = id => ({
  type: GROUP_CREATE_REQUEST,
  id
});
const createSuccess = group => ({
  type: GROUP_CREATE_SUCCESS,
  group
});
const createFail = error => ({
  type: GROUP_CREATE_FAIL,
  error
});
const update = (groupId, title, description, coverImage, visibility, routerHistory) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;
  dispatch(updateRequest(groupId));
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('visibility', visibility);
  if (coverImage !== null) {
    formData.append('cover_image', coverImage);
  }
  api(getState).put(`/api/v1/groups/${groupId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(({
    data
  }) => {
    dispatch(updateSuccess(data));
    routerHistory.push(`/groups/${data.id}`);
  }).catch(err => dispatch(updateFail(err)));
};
const updateRequest = id => ({
  type: GROUP_UPDATE_REQUEST,
  id
});
const updateSuccess = group => ({
  type: GROUP_UPDATE_SUCCESS,
  group
});
const updateFail = error => ({
  type: GROUP_UPDATE_FAIL,
  error
});
const changeValue = (field, value) => ({
  type: GROUP_EDITOR_VALUE_CHANGE,
  field,
  value
});
const reset = () => ({
  type: GROUP_EDITOR_RESET
});
const setUp = group => ({
  type: GROUP_EDITOR_SETUP,
  group
});
export { GROUP_CREATE_REQUEST, GROUP_CREATE_SUCCESS, GROUP_CREATE_FAIL, GROUP_UPDATE_REQUEST, GROUP_UPDATE_SUCCESS, GROUP_UPDATE_FAIL, GROUP_EDITOR_VALUE_CHANGE, GROUP_EDITOR_RESET, GROUP_EDITOR_SETUP, submit, create, createRequest, createSuccess, createFail, update, updateRequest, updateSuccess, updateFail, changeValue, reset, setUp };