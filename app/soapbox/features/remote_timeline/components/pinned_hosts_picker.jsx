'use strict';

import React from 'react';
import { Button, HStack } from 'soapbox/components/ui';
import { useSettings } from 'soapbox/hooks';
const PinnedHostsPicker = ({
  host: activeHost
}) => {
  const settings = useSettings();
  const pinnedHosts = settings.getIn(['remote_timeline', 'pinnedHosts']);
  if (!pinnedHosts || pinnedHosts.isEmpty()) return null;
  return <HStack className='mb-4' space={2}>
      {pinnedHosts.map(host => <Button key={host} to={`/timeline/${host}`} size='sm' theme={host === activeHost ? 'accent' : 'secondary'}>
          {host}
        </Button>)}
    </HStack>;
};
export default PinnedHostsPicker;