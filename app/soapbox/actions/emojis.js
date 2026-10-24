import { saveSettings } from './settings';
const EMOJI_USE = 'EMOJI_USE';
const useEmoji = emoji => dispatch => {
  dispatch({
    type: EMOJI_USE,
    emoji
  });
  dispatch(saveSettings());
};
export { EMOJI_USE, useEmoji };