/**
 * Icon: abstract icon class that can render icons from multiple sets.
 * @module soapbox/components/icon
 * @see soapbox/components/fork_awesome_icon
 * @see soapbox/components/svg_icon
 */

import React from 'react';
import ForkAwesomeIcon from './fork_awesome_icon';
import SvgIcon from './svg_icon';
const Icon = props => {
  if (props.src) {
    const {
      src,
      ...rest
    } = props;
    return <SvgIcon src={src} {...rest} />;
  } else {
    const {
      id,
      fixedWidth,
      ...rest
    } = props;
    return <ForkAwesomeIcon id={id} fixedWidth={fixedWidth} {...rest} />;
  }
};
export default Icon;