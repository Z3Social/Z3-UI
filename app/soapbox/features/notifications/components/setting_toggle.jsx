import React from 'react';
import { Toggle } from 'soapbox/components/ui';
/** Stateful toggle to change user settings. */
const SettingToggle = ({
  id,
  settings,
  settingPath,
  onChange
}) => {
  const handleChange = ({
    target
  }) => {
    onChange(settingPath, target.checked);
  };
  return <Toggle id={id} checked={!!settings.getIn(settingPath)} onChange={handleChange} />;
};
export default SettingToggle;