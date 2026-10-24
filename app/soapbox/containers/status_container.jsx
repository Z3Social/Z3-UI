import React from 'react';
import Status from 'soapbox/components/status';
import { useAppSelector } from 'soapbox/hooks';
import { makeGetStatus } from 'soapbox/selectors';
const getStatus = makeGetStatus();

/**
 * Legacy Status wrapper accepting a status ID instead of the full entity.
 * @deprecated Use the Status component directly.
 */
const StatusContainer = props => {
  const {
    id,
    ...rest
  } = props;
  const status = useAppSelector(state => getStatus(state, {
    id
  }));
  if (status) {
    return <Status status={status} {...rest} />;
  } else {
    return null;
  }
};
export default StatusContainer;