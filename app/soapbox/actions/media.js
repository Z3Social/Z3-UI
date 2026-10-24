import { getFeatures } from 'soapbox/utils/features';
import api from '../api';
const noOp = e => {};
const fetchMedia = mediaId => (dispatch, getState) => {
  return api(getState).get(`/api/v1/media/${mediaId}`);
};
const updateMedia = (mediaId, params) => (dispatch, getState) => {
  return api(getState).put(`/api/v1/media/${mediaId}`, params);
};
const uploadMediaV1 = (data, onUploadProgress = noOp) => (dispatch, getState) => api(getState).post('/api/v1/media', data, {
  onUploadProgress: onUploadProgress
});
const uploadMediaV2 = (data, onUploadProgress = noOp) => (dispatch, getState) => api(getState).post('/api/v2/media', data, {
  onUploadProgress: onUploadProgress
});
const uploadMedia = (data, onUploadProgress = noOp) => (dispatch, getState) => {
  const state = getState();
  const instance = state.instance;
  const features = getFeatures(instance);
  if (features.mediaV2) {
    return dispatch(uploadMediaV2(data, onUploadProgress));
  } else {
    return dispatch(uploadMediaV1(data, onUploadProgress));
  }
};
export { fetchMedia, updateMedia, uploadMediaV1, uploadMediaV2, uploadMedia };