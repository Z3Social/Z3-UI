import { Map as ImmutableMap, List as ImmutableList, OrderedSet as ImmutableOrderedSet, fromJS } from 'immutable';
import { createSelector } from 'reselect';
import { getSettings } from 'soapbox/actions/settings';
import { getDomain } from 'soapbox/utils/accounts';
import { validId } from 'soapbox/utils/auth';
import ConfigDB from 'soapbox/utils/config_db';
import { shouldFilter } from 'soapbox/utils/timelines';
const normalizeId = id => typeof id === 'string' ? id : '';
const getAccountBase = (state, id) => state.accounts.get(id);
const getAccountCounters = (state, id) => state.accounts_counters.get(id);
const getAccountRelationship = (state, id) => state.relationships.get(id);
const getAccountMoved = (state, id) => state.accounts.get(state.accounts.get(id)?.moved || '');
const getAccountMeta = (state, id) => state.accounts_meta.get(id);
const getAccountAdminData = (state, id) => state.admin.users.get(id);
const getAccountPatron = (state, id) => {
  const url = state.accounts.get(id)?.url;
  return url ? state.patron.accounts.get(url) : null;
};
export const makeGetAccount = () => {
  return createSelector([getAccountBase, getAccountCounters, getAccountRelationship, getAccountMoved, getAccountMeta, getAccountAdminData, getAccountPatron], (base, counters, relationship, moved, meta, admin, patron) => {
    if (!base) return null;
    return base.withMutations(map => {
      if (counters) map.merge(counters);
      if (meta) {
        map.merge(meta);
        map.set('pleroma', meta.pleroma.merge(base.get('pleroma', ImmutableMap()))); // Lol, thanks Pleroma
      }
      if (relationship) map.set('relationship', relationship);
      map.set('moved', moved || null);
      map.set('patron', patron || null);
      map.setIn(['pleroma', 'admin'], admin);
    });
  });
};
const findAccountsByUsername = (state, username) => {
  const accounts = state.accounts;
  return accounts.filter(account => {
    return username.toLowerCase() === account.acct.toLowerCase();
  });
};
export const findAccountByUsername = (state, username) => {
  const accounts = findAccountsByUsername(state, username);
  if (accounts.size > 1) {
    const me = state.me;
    const meURL = state.accounts.get(me)?.url || '';
    return accounts.find(account => {
      try {
        // If more than one account has the same username, try matching its host
        const {
          host
        } = new URL(account.url);
        const {
          host: meHost
        } = new URL(meURL);
        return host === meHost;
      } catch {
        return false;
      }
    });
  } else {
    return accounts.first();
  }
};
const toServerSideType = columnType => {
  switch (columnType) {
    case 'home':
    case 'notifications':
    case 'public':
    case 'thread':
      return columnType;
    default:
      if (columnType.includes('list:')) {
        return 'home';
      } else {
        return 'public'; // community, account, hashtag
      }
  }
};
export const getFilters = (state, query) => {
  return state.filters.filter(filter => {
    return query?.contextType && filter.context.includes(toServerSideType(query.contextType)) && (filter.expires_at === null || Date.parse(filter.expires_at) > new Date().getTime());
  });
};
const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

export const regexFromFilters = filters => {
  if (filters.size === 0) return null;
  return new RegExp(filters.map(filter => {
    let expr = escapeRegExp(filter.get('phrase'));
    if (filter.get('whole_word')) {
      if (/^[\w]/.test(expr)) {
        expr = `\\b${expr}`;
      }
      if (/[\w]$/.test(expr)) {
        expr = `${expr}\\b`;
      }
    }
    return expr;
  }).join('|'), 'i');
};
export const makeGetStatus = () => {
  return createSelector([(state, {
    id
  }) => state.statuses.get(id), (state, {
    id
  }) => state.statuses.get(state.statuses.get(id)?.reblog || ''), (state, {
    id
  }) => state.accounts.get(state.statuses.get(id)?.account || ''), (state, {
    id
  }) => state.accounts.get(state.statuses.get(state.statuses.get(id)?.reblog || '')?.account || ''), (_state, {
    username
  }) => username, getFilters, state => state.me], (statusBase, statusReblog, accountBase, accountReblog, username, filters, me) => {
    if (!statusBase || !accountBase) return null;
    const accountUsername = accountBase.acct;
    //Must be owner of status if username exists
    if (accountUsername !== username && username !== undefined) {
      return null;
    }
    if (statusReblog && accountReblog) {
      statusReblog = statusReblog.set('account', accountReblog);
    } else {
      statusReblog = undefined;
    }
    const regex = (accountReblog || accountBase).id !== me && regexFromFilters(filters);
    const filtered = regex && regex.test(statusReblog?.search_index || statusBase.search_index);
    return statusBase.withMutations(map => {
      map.set('reblog', statusReblog || null);
      map.set('account', accountBase || null);
      map.set('filtered', Boolean(filtered));
    });
  });
};
export const makeGetNotification = () => {
  return createSelector([(_state, notification) => notification, (state, notification) => state.accounts.get(normalizeId(notification.account)), (state, notification) => state.accounts.get(normalizeId(notification.target)), (state, notification) => state.statuses.get(normalizeId(notification.status))], (notification, account, target, status) => {
    return notification.merge({
      account: account || null,
      target: target || null,
      status: status || null
    });
  });
};
export const getAccountGallery = createSelector([(state, id) => state.timelines.get(`account:${id}:media`)?.items || ImmutableOrderedSet(), state => state.statuses, state => state.accounts], (statusIds, statuses, accounts) => {
  return statusIds.reduce((medias, statusId) => {
    const status = statuses.get(statusId);
    if (!status) return medias;
    if (status.reblog) return medias;
    if (typeof status.account !== 'string') return medias;
    const account = accounts.get(status.account);
    return medias.concat(status.media_attachments.map(media => media.merge({
      status,
      account
    })));
  }, ImmutableList());
});
export const makeGetChat = () => {
  return createSelector([(state, {
    id
  }) => state.chats.items.get(id), (state, {
    id
  }) => state.accounts.get(state.chats.items.getIn([id, 'account'])), (state, {
    last_message
  }) => state.chat_messages.get(last_message)], (chat, account, lastMessage) => {
    if (!chat || !account) return null;
    return chat.withMutations(map => {
      map.set('account', account);
      map.set('last_message', lastMessage);
    });
  });
};
export const makeGetReport = () => {
  const getStatus = makeGetStatus();
  return createSelector([(state, id) => state.admin.reports.get(id), (state, id) => state.accounts.get(state.admin.reports.get(id)?.account || ''), (state, id) => state.accounts.get(state.admin.reports.get(id)?.target_account || ''),
  // (state: RootState, id: string) => state.accounts.get(state.admin.reports.get(id)?.action_taken_by_account || ''),
  // (state: RootState, id: string) => state.accounts.get(state.admin.reports.get(id)?.assigned_account || ''),
  (state, id) => ImmutableList(fromJS(state.admin.reports.get(id)?.statuses)).map(statusId => state.statuses.get(normalizeId(statusId))).filter(s => s).map(s => getStatus(state, s.toJS()))], (report, account, targetAccount, statuses) => {
    if (!report) return null;
    return report.withMutations(report => {
      report.set('account', account);
      report.set('target_account', targetAccount);
      report.set('statuses', statuses);
    });
  });
};
const getAuthUserIds = createSelector([state => state.auth.get('users', ImmutableMap())], authUsers => {
  return authUsers.reduce((ids, authUser) => {
    try {
      const id = authUser.get('id');
      return validId(id) ? ids.add(id) : ids;
    } catch {
      return ids;
    }
  }, ImmutableOrderedSet());
});
export const makeGetOtherAccounts = () => {
  return createSelector([state => state.accounts, getAuthUserIds, state => state.me], (accounts, authUserIds, me) => {
    return authUserIds.reduce((list, id) => {
      if (id === me) return list;
      const account = accounts.get(id);
      return account ? list.push(account) : list;
    }, ImmutableList());
  });
};
const getSimplePolicy = createSelector([state => state.admin.configs, state => state.instance.pleroma.getIn(['metadata', 'federation', 'mrf_simple'], ImmutableMap())], (configs, instancePolicy) => {
  return instancePolicy.merge(ConfigDB.toSimplePolicy(configs));
});
const getRemoteInstanceFavicon = (state, host) => (state.accounts.find(account => getDomain(account) === host, null) || ImmutableMap()).getIn(['pleroma', 'favicon']);
const getRemoteInstanceFederation = (state, host) => getSimplePolicy(state).map(hosts => hosts.includes(host));
export const makeGetHosts = () => {
  return createSelector([getSimplePolicy], simplePolicy => {
    return simplePolicy.deleteAll(['accept', 'reject_deletes', 'report_removal']).reduce((acc, hosts) => acc.union(hosts), ImmutableOrderedSet()).sort();
  });
};
export const makeGetRemoteInstance = () => {
  return createSelector([(_state, host) => host, getRemoteInstanceFavicon, getRemoteInstanceFederation], (host, favicon, federation) => {
    return ImmutableMap({
      host,
      favicon,
      federation
    });
  });
};
export const makeGetStatusIds = () => createSelector([(state, {
  type,
  prefix
}) => getSettings(state).get(prefix || type, ImmutableMap()), (state, {
  type
}) => state.timelines.get(type)?.items || ImmutableOrderedSet(), state => state.statuses], (columnSettings, statusIds, statuses) => {
  return statusIds.filter(id => {
    const status = statuses.get(id);
    if (!status) return true;
    return !shouldFilter(status, columnSettings);
  });
});