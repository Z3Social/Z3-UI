import { Map as ImmutableMap } from 'immutable';
import { mockStore, rootState } from 'soapbox/jest/test-helpers';
import { InstanceRecord } from 'soapbox/normalizers';
import { uploadCompose, submitCompose } from '../compose';
import { STATUS_CREATE_REQUEST } from '../statuses';
describe('uploadCompose()', () => {
  describe('with images', () => {
    let files, store;
    beforeEach(() => {
      const instance = InstanceRecord({
        configuration: ImmutableMap({
          statuses: ImmutableMap({
            max_media_attachments: 4
          }),
          media_attachments: ImmutableMap({
            image_size_limit: 10
          })
        })
      });
      const state = rootState.set('me', '1234').set('instance', instance);
      store = mockStore(state);
      files = [{
        uri: 'image.png',
        name: 'Image',
        size: 15,
        type: 'image/png'
      }];
    });
    it('creates an alert if exceeds max size', async () => {
      const mockIntl = {
        formatMessage: jest.fn().mockReturnValue('Image exceeds the current file size limit (10 Bytes)')
      };
      const expectedActions = [{
        type: 'COMPOSE_UPLOAD_REQUEST',
        skipLoading: true
      }, {
        type: 'ALERT_SHOW',
        message: 'Image exceeds the current file size limit (10 Bytes)',
        actionLabel: undefined,
        actionLink: undefined,
        severity: 'error'
      }, {
        type: 'COMPOSE_UPLOAD_FAIL',
        error: true,
        skipLoading: true
      }];
      await store.dispatch(uploadCompose(files, mockIntl));
      const actions = store.getActions();
      expect(actions).toEqual(expectedActions);
    });
  });
  describe('with videos', () => {
    let files, store;
    beforeEach(() => {
      const instance = InstanceRecord({
        configuration: ImmutableMap({
          statuses: ImmutableMap({
            max_media_attachments: 4
          }),
          media_attachments: ImmutableMap({
            video_size_limit: 10
          })
        })
      });
      const state = rootState.set('me', '1234').set('instance', instance);
      store = mockStore(state);
      files = [{
        uri: 'video.mp4',
        name: 'Video',
        size: 15,
        type: 'video/mp4'
      }];
    });
    it('creates an alert if exceeds max size', async () => {
      const mockIntl = {
        formatMessage: jest.fn().mockReturnValue('Video exceeds the current file size limit (10 Bytes)')
      };
      const expectedActions = [{
        type: 'COMPOSE_UPLOAD_REQUEST',
        skipLoading: true
      }, {
        type: 'ALERT_SHOW',
        message: 'Video exceeds the current file size limit (10 Bytes)',
        actionLabel: undefined,
        actionLink: undefined,
        severity: 'error'
      }, {
        type: 'COMPOSE_UPLOAD_FAIL',
        error: true,
        skipLoading: true
      }];
      await store.dispatch(uploadCompose(files, mockIntl));
      const actions = store.getActions();
      expect(actions).toEqual(expectedActions);
    });
  });
});
describe('submitCompose()', () => {
  it('inserts mentions from text', async () => {
    const state = rootState.set('me', '123').setIn(['compose', 'text'], '@alex hello @mkljczk@pl.fediverse.pl @gg@汉语/漢語.com alex@alexgleason.me');
    const store = mockStore(state);
    await store.dispatch(submitCompose());
    const actions = store.getActions();
    const statusCreateRequest = actions.find(action => action.type === STATUS_CREATE_REQUEST);
    const to = statusCreateRequest.params.to;
    const expected = ['alex', 'mkljczk@pl.fediverse.pl', 'gg@汉语/漢語.com'];
    expect(to.toJS()).toEqual(expected);
  });
});