/**
 * Admin report normalizer:
 * Converts API admin-level report information into our internal format.
 */
import { Map as ImmutableMap, List as ImmutableList, Record as ImmutableRecord, fromJS } from 'immutable';
export const AdminReportRecord = ImmutableRecord({
  account: null,
  action_taken: false,
  action_taken_by_account: null,
  assigned_account: null,
  category: '',
  comment: '',
  created_at: new Date(),
  id: '',
  rules: ImmutableList(),
  statuses: ImmutableList(),
  target_account: null,
  updated_at: new Date()
});
const normalizePleromaReport = report => {
  if (report.get('actor')) {
    return report.withMutations(report => {
      report.set('target_account', report.get('account'));
      report.set('account', report.get('actor'));
      report.set('action_taken', report.get('state') !== 'open');
      report.set('comment', report.get('content'));
      report.set('updated_at', report.get('created_at'));
    });
  }
  return report;
};
export const normalizeAdminReport = report => {
  return AdminReportRecord(ImmutableMap(fromJS(report)).withMutations(report => {
    normalizePleromaReport(report);
  }));
};