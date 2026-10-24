import { Map as ImmutableMap, List as ImmutableList, Set as ImmutableSet, Record as ImmutableRecord, OrderedSet as ImmutableOrderedSet, fromJS, is } from 'immutable';
import { ADMIN_CONFIG_FETCH_SUCCESS, ADMIN_CONFIG_UPDATE_SUCCESS, ADMIN_REPORTS_FETCH_SUCCESS, ADMIN_REPORTS_PATCH_REQUEST, ADMIN_REPORTS_PATCH_SUCCESS, ADMIN_USERS_FETCH_SUCCESS, ADMIN_USERS_DELETE_REQUEST, ADMIN_USERS_DELETE_SUCCESS, ADMIN_USERS_APPROVE_REQUEST, ADMIN_USERS_APPROVE_SUCCESS } from 'soapbox/actions/admin';
import { normalizeAdminReport, normalizeAdminAccount } from 'soapbox/normalizers';
import { normalizeId } from 'soapbox/utils/normalizers';
const ReducerRecord = ImmutableRecord({
  reports: ImmutableMap(),
  openReports: ImmutableOrderedSet(),
  users: ImmutableMap(),
  latestUsers: ImmutableOrderedSet(),
  awaitingApproval: ImmutableOrderedSet(),
  configs: ImmutableList(),
  needsReboot: false
});

// Umm... based?
// https://itnext.io/typescript-extract-unpack-a-type-from-a-generic-baca7af14e51

// Lol https://javascript.plainenglish.io/typescript-essentials-conditionally-filter-types-488705bfbf56

const FILTER_UNAPPROVED = ['local', 'need_approval'];
const FILTER_LATEST = ['local', 'active'];
const filtersMatch = (f1, f2) => is(ImmutableSet(f1), ImmutableSet(f2));
const toIds = items => items.map(item => item.id);
const mergeSet = (state, key, users) => {
  const newIds = toIds(users);
  return state.update(key, ids => ids.union(newIds));
};
const replaceSet = (state, key, users) => {
  const newIds = toIds(users);
  return state.set(key, ImmutableOrderedSet(newIds));
};
const maybeImportUnapproved = (state, users, filters) => {
  if (filtersMatch(FILTER_UNAPPROVED, filters)) {
    return mergeSet(state, 'awaitingApproval', users);
  } else {
    return state;
  }
};
const maybeImportLatest = (state, users, filters, page) => {
  if (page === 1 && filtersMatch(FILTER_LATEST, filters)) {
    return replaceSet(state, 'latestUsers', users);
  } else {
    return state;
  }
};
const minifyUser = user => {
  return user.mergeWith((o, n) => n || o, {
    account: normalizeId(user.getIn(['account', 'id']))
  });
};
const fixUser = user => {
  return normalizeAdminAccount(user).withMutations(user => {
    minifyUser(user);
  });
};
function importUsers(state, users, filters, page) {
  return state.withMutations(state => {
    maybeImportUnapproved(state, users, filters);
    maybeImportLatest(state, users, filters, page);
    users.forEach(user => {
      const normalizedUser = fixUser(user);
      state.setIn(['users', user.id], normalizedUser);
    });
  });
}
function deleteUsers(state, accountIds) {
  return state.withMutations(state => {
    accountIds.forEach(id => {
      state.update('awaitingApproval', orderedSet => orderedSet.delete(id));
      state.deleteIn(['users', id]);
    });
  });
}
function approveUsers(state, users) {
  return state.withMutations(state => {
    users.forEach(user => {
      const normalizedUser = fixUser(user);
      state.update('awaitingApproval', orderedSet => orderedSet.delete(user.id));
      state.setIn(['users', user.id], normalizedUser);
    });
  });
}
const minifyReport = report => {
  return report.mergeWith((o, n) => n || o, {
    account: normalizeId(report.getIn(['account', 'id'])),
    target_account: normalizeId(report.getIn(['target_account', 'id'])),
    action_taken_by_account: normalizeId(report.getIn(['action_taken_by_account', 'id'])),
    assigned_account: normalizeId(report.getIn(['assigned_account', 'id'])),
    statuses: report.get('statuses').map(status => normalizeId(status.get('id')))
  });
};
const fixReport = report => {
  return normalizeAdminReport(report).withMutations(report => {
    minifyReport(report);
  });
};
function importReports(state, reports) {
  return state.withMutations(state => {
    reports.forEach(report => {
      const normalizedReport = fixReport(report);
      if (!normalizedReport.action_taken) {
        state.update('openReports', orderedSet => orderedSet.add(report.id));
      }
      state.setIn(['reports', report.id], normalizedReport);
    });
  });
}
function handleReportDiffs(state, reports) {
  // Note: the reports here aren't full report objects
  // hence the need for a new function.
  return state.withMutations(state => {
    reports.forEach(report => {
      switch (report.state) {
        case 'open':
          state.update('openReports', orderedSet => orderedSet.add(report.id));
          break;
        default:
          state.update('openReports', orderedSet => orderedSet.delete(report.id));
      }
    });
  });
}
const normalizeConfig = config => ImmutableMap(fromJS(config));
const normalizeConfigs = configs => {
  return ImmutableList(fromJS(configs)).map(normalizeConfig);
};
const importConfigs = (state, configs) => {
  return state.set('configs', normalizeConfigs(configs));
};
export default function admin(state = ReducerRecord(), action) {
  switch (action.type) {
    case ADMIN_CONFIG_FETCH_SUCCESS:
    case ADMIN_CONFIG_UPDATE_SUCCESS:
      return importConfigs(state, action.configs);
    case ADMIN_REPORTS_FETCH_SUCCESS:
      return importReports(state, action.reports);
    case ADMIN_REPORTS_PATCH_REQUEST:
    case ADMIN_REPORTS_PATCH_SUCCESS:
      return handleReportDiffs(state, action.reports);
    case ADMIN_USERS_FETCH_SUCCESS:
      return importUsers(state, action.users, action.filters, action.page);
    case ADMIN_USERS_DELETE_REQUEST:
    case ADMIN_USERS_DELETE_SUCCESS:
      return deleteUsers(state, action.accountIds);
    case ADMIN_USERS_APPROVE_REQUEST:
      return state.update('awaitingApproval', set => set.subtract(action.accountIds));
    case ADMIN_USERS_APPROVE_SUCCESS:
      return approveUsers(state, action.users);
    default:
      return state;
  }
}