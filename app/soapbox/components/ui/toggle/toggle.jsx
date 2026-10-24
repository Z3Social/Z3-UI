import React from 'react';
import ReactToggle from 'react-toggle';

/** A glorified checkbox. Wrapper around react-toggle. */
const Toggle = ({
  icons = false,
  ...rest
}) => {
  return <ReactToggle icons={icons} {...rest} />;
};
export default Toggle;