import { ALERT_SHOW } from './alerts';
export const show = (severity, message, opts) => ({
  type: ALERT_SHOW,
  message,
  severity,
  ...opts
});
export const info = (message, actionLabel, actionLink) => show('info', message, {
  actionLabel,
  actionLink
});
export const success = (message, actionLabel, actionLink) => show('success', message, {
  actionLabel,
  actionLink
});
export const error = (message, actionLabel, actionLink) => show('error', message, {
  actionLabel,
  actionLink
});
export default {
  info,
  success,
  error,
  show
};