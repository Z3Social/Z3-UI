import { Map as ImmutableMap } from 'immutable';
export const shouldFilter = (status, columnSettings) => {
  const shows = ImmutableMap({
    reblog: status.reblog !== null,
    reply: status.in_reply_to_id !== null,
    direct: status.visibility === 'direct'
  });
  return shows.some((value, key) => {
    return columnSettings.getIn(['shows', key]) === false && value;
  });
};