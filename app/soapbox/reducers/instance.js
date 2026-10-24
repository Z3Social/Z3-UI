import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';
import { ADMIN_CONFIG_UPDATE_REQUEST, ADMIN_CONFIG_UPDATE_SUCCESS } from 'soapbox/actions/admin';
import { PLEROMA_PRELOAD_IMPORT } from 'soapbox/actions/preload';
import { normalizeInstance } from 'soapbox/normalizers/instance';
import KVStore from 'soapbox/storage/kv_store';
import { ConfigDB } from 'soapbox/utils/config_db';
import { rememberInstance, fetchInstance, fetchNodeinfo } from '../actions/instance';
const initialState = normalizeInstance(ImmutableMap());
const nodeinfoToInstance = nodeinfo => {
  const data = nodeinfo.get("data");
  // Match Pleroma's develop branch
  return normalizeInstance(ImmutableMap({
    pleroma: ImmutableMap({
      metadata: ImmutableMap({
        account_activation_required: data.getIn(['metadata', 'accountActivationRequired']),
        features: data.getIn(['metadata', 'features']),
        staff_accounts: data.getIn(['metadata', 'staffAccounts']),
        federation: data.getIn(['metadata', 'federation']),
        fields_limits: ImmutableMap({
          max_fields: data.getIn(['metadata', 'fieldsLimits', 'maxFields'])
        })
      })
    })
  }));
};
const importInstance = (_state, instance) => {
  return normalizeInstance(instance);
};
const importNodeinfo = (state, nodeinfo) => {
  return nodeinfoToInstance(nodeinfo).mergeDeep(state);
};
const preloadImport = (state, action, path) => {
  const instance = action.data[path];
  return instance ? importInstance(state, ImmutableMap(fromJS(instance))) : state;
};
const getConfigValue = (instanceConfig, key) => {
  const v = instanceConfig.find(value => value.getIn(['tuple', 0]) === key);
  return v ? v.getIn(['tuple', 1]) : undefined;
};
const importConfigs = (state, configs) => {
  // FIXME: This is pretty hacked together. Need to make a cleaner map.
  const config = ConfigDB.find(configs, ':pleroma', ':instance');
  const simplePolicy = ConfigDB.toSimplePolicy(configs);
  if (!config && !simplePolicy) return state;
  return state.withMutations(state => {
    if (config) {
      const value = config.get('value', ImmutableList());
      const registrationsOpen = getConfigValue(value, ':registrations_open');
      const approvalRequired = getConfigValue(value, ':account_approval_required');
      state.update('registrations', c => typeof registrationsOpen === 'boolean' ? registrationsOpen : c);
      state.update('approval_required', c => typeof approvalRequired === 'boolean' ? approvalRequired : c);
    }
    if (simplePolicy) {
      state.setIn(['pleroma', 'metadata', 'federation', 'mrf_simple'], simplePolicy);
    }
  });
};
const handleAuthFetch = state => {
  // Authenticated fetch is enabled, so make the instance appear censored
  return state.mergeWith((o, n) => o || n, {
    title: '██████',
    description: '████████████'
  });
};
const getHost = instance => {
  try {
    return new URL(instance.uri).host;
  } catch {
    try {
      return new URL(`https://${instance.uri}`).host;
    } catch {
      return null;
    }
  }
};
const persistInstance = instance => {
  const host = getHost(instance);
  if (host) {
    KVStore.setItem(`instance:${host}`, instance).catch(console.error);
  }
};
const handleInstanceFetchFail = (state, error) => {
  if (error.response?.status === 401) {
    return handleAuthFetch(state);
  } else {
    return state;
  }
};
export default function instance(state = initialState, action) {
  switch (action.type) {
    case PLEROMA_PRELOAD_IMPORT:
      return preloadImport(state, action, '/api/v1/instance');
    case rememberInstance.fulfilled.type:
      return importInstance(state, ImmutableMap(fromJS(action.payload)));
    case fetchInstance.fulfilled.type:
      persistInstance(action.payload);
      return importInstance(state, ImmutableMap(fromJS(action.payload)));
    case fetchInstance.rejected.type:
      return handleInstanceFetchFail(state, action.error);
    case fetchNodeinfo.fulfilled.type:
      return importNodeinfo(state, ImmutableMap(fromJS(action.payload)));
    case ADMIN_CONFIG_UPDATE_REQUEST:
    case ADMIN_CONFIG_UPDATE_SUCCESS:
      return importConfigs(state, ImmutableList(fromJS(action.configs)));
    default:
      return state;
  }
}