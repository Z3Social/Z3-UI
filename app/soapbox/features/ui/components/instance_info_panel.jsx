'use strict';

import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { pinHost, unpinHost } from 'soapbox/actions/remote_timeline';
import { Widget } from 'soapbox/components/ui';
import { useAppSelector, useAppDispatch, useSettings } from 'soapbox/hooks';
import { makeGetRemoteInstance } from 'soapbox/selectors';
const getRemoteInstance = makeGetRemoteInstance();
const messages = defineMessages({
  pinHost: {
    id: 'remote_instance.pin_host',
    defaultMessage: 'Pin {host}'
  },
  unpinHost: {
    id: 'remote_instance.unpin_host',
    defaultMessage: 'Unpin {host}'
  }
});
/** Widget that displays information about a remote instance to users. */
const InstanceInfoPanel = ({
  host
}) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const settings = useSettings();
  const remoteInstance = useAppSelector(state => getRemoteInstance(state, host));
  const pinned = settings.getIn(['remote_timeline', 'pinnedHosts']).includes(host);
  const handlePinHost = () => {
    if (!pinned) {
      dispatch(pinHost(host));
    } else {
      dispatch(unpinHost(host));
    }
  };
  if (!remoteInstance) return null;
  return <Widget title={remoteInstance.get('host')} onActionClick={handlePinHost} actionIcon={pinned ? require('@tabler/icons/pinned-off.svg') : require('@tabler/icons/pin.svg')} actionTitle={intl.formatMessage(pinned ? messages.unpinHost : messages.pinHost, {
    host
  })} />;
};
export default InstanceInfoPanel;