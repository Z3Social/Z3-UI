import React from 'react';
import Counter from '../counter/counter';
import SvgIcon from './svg-icon';
/** Renders and SVG icon with optional counter. */
const Icon = ({
  src,
  alt,
  count,
  size,
  ...filteredProps
}) => <div className='relative' data-testid='icon'>
    {count ? <span className='absolute -top-2 -right-3'>
        <Counter count={count} />
      </span> : null}

    <SvgIcon src={src} size={size} alt={alt} {...filteredProps} />
  </div>;
export default Icon;