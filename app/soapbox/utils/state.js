/**
 * State: general Redux state utility functions.
 * @module soapbox/utils/state
 */

import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import * as BuildConfig from 'soapbox/build_config';
import { isPrerendered } from 'soapbox/precheck';
import { isURL } from 'soapbox/utils/auth';
/** Whether to display the fqn instead of the acct. */
export const displayFqn = state => {
  return getSoapboxConfig(state).displayFqn;
};

/** Whether the instance exposes instance blocks through the API. */
export const federationRestrictionsDisclosed = state => {
  return state.instance.pleroma.hasIn(['metadata', 'federation', 'mrf_policies']);
};

/**
 * Determine whether Soapbox FE is running in standalone mode.
 * Standalone mode runs separately from any backend and can login anywhere.
 */
export const isStandalone = state => {
  const instanceFetchFailed = state.meta.instance_fetch_failed;
  return isURL(BuildConfig.BACKEND_URL) ? false : !isPrerendered && instanceFetchFailed;
};
const getHost = url => {
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
};

/** Get the baseURL of the instance. */
export const getBaseURL = state => {
  const account = state.accounts.get(state.me);
  return isURL(BuildConfig.BACKEND_URL) ? BuildConfig.BACKEND_URL : getHost(account?.url);
};