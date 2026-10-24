import React from 'react';
import QuotedStatus from 'soapbox/components/quoted-status';
import { useAppSelector } from 'soapbox/hooks';
import { makeGetStatus } from 'soapbox/selectors';
const getStatus = makeGetStatus();
const QuotedStatusContainer = ({
  statusId
}) => {
  const status = useAppSelector(state => getStatus(state, {
    id: statusId
  }));
  if (!status) {
    return null;
  }
  return <QuotedStatus status={status} />;
};
export default QuotedStatusContainer;