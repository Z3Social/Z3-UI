import { Map as ImmutableMap, List as ImmutableList, Set as ImmutableSet, fromJS } from 'immutable';
import trimStart from 'lodash/trimStart';
const find = (configs, group, key) => {
  return configs.find(config => config.isSuperset(ImmutableMap({
    group,
    key
  })));
};
const toSimplePolicy = configs => {
  const config = find(configs, ':pleroma', ':mrf_simple');
  const reducer = (acc, curr) => {
    const key = curr.getIn(['tuple', 0]);
    const hosts = curr.getIn(['tuple', 1]);
    if (typeof hosts !== 'object' || hosts === null) return acc;
    return acc.set(trimStart(key, ':'), ImmutableSet(hosts));
  };
  if (config?.get) {
    const value = config.get('value', ImmutableList());
    return value.reduce(reducer, ImmutableMap());
  } else {
    return ImmutableMap();
  }
};
const fromSimplePolicy = simplePolicy => {
  const mapper = (hosts, key) => fromJS({
    tuple: [`:${key}`, hosts.toJS()]
  });
  const value = simplePolicy.map(mapper).toList();
  return ImmutableList([ImmutableMap({
    group: ':pleroma',
    key: ':mrf_simple',
    value
  })]);
};
export const ConfigDB = {
  find,
  toSimplePolicy,
  fromSimplePolicy
};
export default ConfigDB;