import React from 'react';
import InlineSVG from 'react-inlinesvg'; // eslint-disable-line no-restricted-imports

/** Renders an inline SVG with an empty frame loading state */
const SvgIcon = ({
  src,
  alt,
  size,
  className,
  ...filteredProps
}) => {
  const loader = <svg className={className} width={size || 24} height={size || 24} data-src={src} data-testid='svg-icon-loader' />;
  const dimensions = size ? { width: size, height: size } : {};
  return <InlineSVG className={className} src={src} title={alt} {...dimensions} loader={loader} data-testid='svg-icon' {...filteredProps}>
      {/* If the fetch fails, fall back to displaying the loader */}
      {loader}
    </InlineSVG>;
};
export default SvgIcon;
