/**
 * API: HTTP client and utilities.
 * @see {@link https://github.com/axios/axios}
 * @module soapbox/api
 */
'use strict';

import axios from 'axios';
import LinkHeader from 'http-link-header';
import { createSelector } from 'reselect';
import * as BuildConfig from 'soapbox/build_config';
import { getAccessToken, getAppToken, isURL, parseBaseURL } from 'soapbox/utils/auth';
/**
 Parse Link headers, mostly for pagination.
 @see {@link https://www.npmjs.com/package/http-link-header}
 @param {object} response - Axios response object
 @returns {object} Link object
 */
export const getLinks = response => {
  return new LinkHeader(response.headers?.link);
};
export const getNextLink = response => {
  return getLinks(response).refs.find(link => link.rel === 'next')?.uri;
};
const getToken = (state, authType) => {
  return authType === 'app' ? getAppToken(state) : getAccessToken(state);
};
const maybeParseJSON = data => {
  try {
    return JSON.parse(data);
  } catch (Exception) {
    return data;
  }
};
const getAuthBaseURL = createSelector([(state, me) => state.accounts.getIn([me, 'url']), (state, _me) => state.auth.get('me')], (accountUrl, authUserUrl) => {
  const baseURL = parseBaseURL(accountUrl) || parseBaseURL(authUserUrl);
  return baseURL !== window.location.origin ? baseURL : '';
});

/**
 * Base client for HTTP requests.
 * @param {string} accessToken
 * @param {string} baseURL
 * @returns {object} Axios instance
 */
export const baseClient = (accessToken, baseURL = '') => {
  return axios.create({
    // When BACKEND_URL is set, always use it.
    baseURL: isURL(BuildConfig.BACKEND_URL) ? BuildConfig.BACKEND_URL : baseURL,
    headers: Object.assign(accessToken ? {
      'Authorization': `Bearer ${accessToken}`
    } : {}),
    transformResponse: [maybeParseJSON]
  });
};

/**
 * Dumb client for grabbing static files.
 * It uses FE_SUBDIRECTORY and parses JSON if possible.
 * No authorization is needed.
 */
export const staticClient = axios.create({
  baseURL: BuildConfig.FE_SUBDIRECTORY,
  transformResponse: [maybeParseJSON]
});

/**
 * Stateful API client.
 * Uses credentials from the Redux store if available.
 * @param {function} getState - Must return the Redux state
 * @param {string} authType - Either 'user' or 'app'
 * @returns {object} Axios instance
 */
export default (getState, authType = 'user') => {
  const state = getState();
  const accessToken = getToken(state, authType);
  const me = state.me;
  const baseURL = me ? getAuthBaseURL(state, me) : '';
  return baseClient(accessToken, baseURL);
};

// The Jest mock exports these, so they're needed for TypeScript.
export const __stub = _func => 0;
export const __clear = () => [];