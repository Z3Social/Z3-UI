import mapValues from 'lodash/mapValues';
import { verifyCredentials } from './auth';
import { importFetchedAccounts } from './importer';
const PLEROMA_PRELOAD_IMPORT = 'PLEROMA_PRELOAD_IMPORT';
const MASTODON_PRELOAD_IMPORT = 'MASTODON_PRELOAD_IMPORT';

// https://git.pleroma.social/pleroma/pleroma-fe/-/merge_requests/1176/diffs
const decodeUTF8Base64 = data => {
  const rawData = atob(data);
  const array = Uint8Array.from(rawData.split('').map(char => char.charCodeAt(0)));
  const text = new TextDecoder().decode(array);
  return text;
};
const decodePleromaData = data => {
  return mapValues(data, base64string => JSON.parse(decodeUTF8Base64(base64string)));
};
const pleromaDecoder = json => decodePleromaData(JSON.parse(json));

// This will throw if it fails.
// Should be called inside a try-catch.
const decodeFromMarkup = (elementId, decoder) => {
  const {
    textContent
  } = document.getElementById(elementId);
  return decoder(textContent);
};
const preloadFromMarkup = (elementId, decoder, action) => dispatch => {
  try {
    const data = decodeFromMarkup(elementId, decoder);
    dispatch(action(data));
  } catch {
    // Do nothing
  }
};
const preload = () => dispatch => {
  dispatch(preloadFromMarkup('initial-results', pleromaDecoder, preloadPleroma));
  dispatch(preloadFromMarkup('initial-state', JSON.parse, preloadMastodon));
};
const preloadPleroma = data => ({
  type: PLEROMA_PRELOAD_IMPORT,
  data
});
const preloadMastodon = data => dispatch => {
  const {
    me,
    access_token
  } = data.meta;
  const {
    url
  } = data.accounts[me];
  dispatch(importFetchedAccounts(Object.values(data.accounts)));
  dispatch(verifyCredentials(access_token, url));
  dispatch({
    type: MASTODON_PRELOAD_IMPORT,
    data
  });
};
export { PLEROMA_PRELOAD_IMPORT, MASTODON_PRELOAD_IMPORT, preload, preloadPleroma, preloadMastodon };