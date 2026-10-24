import classNames from 'classnames';
import React from 'react';
const themes = {
  default: 'text-gray-900 dark:text-gray-100',
  danger: 'text-danger-600',
  primary: 'text-primary-600 dark:text-primary-400',
  muted: 'text-gray-500 dark:text-gray-300',
  subtle: 'text-gray-400 dark:text-gray-500',
  success: 'text-success-600',
  inherit: 'text-inherit',
  white: 'text-white'
};
const weights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
};
const sizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl'
};
const alignments = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
};
const trackingSizes = {
  normal: 'tracking-normal',
  wide: 'tracking-wide'
};
const transformProperties = {
  normal: 'normal-case',
  uppercase: 'uppercase'
};
const families = {
  sans: 'font-sans',
  mono: 'font-mono'
};
/** UI-friendly text container with dark mode support. */
const Text = React.forwardRef((props, ref) => {
  const {
    align,
    className,
    direction,
    family = 'sans',
    size = 'md',
    tag = 'p',
    theme = 'default',
    tracking = 'normal',
    transform = 'normal',
    truncate = false,
    weight = 'normal',
    ...filteredProps
  } = props;
  const Comp = tag;
  const alignmentClass = typeof align === 'string' ? alignments[align] : '';
  return <Comp {...filteredProps} ref={ref} style={{
    textDecoration: tag === 'abbr' ? 'underline dotted' : undefined,
    direction
  }} className={classNames({
    'cursor-default': tag === 'abbr',
    truncate: truncate,
    [sizes[size]]: true,
    [themes[theme]]: true,
    [weights[weight]]: true,
    [trackingSizes[tracking]]: true,
    [families[family]]: true,
    [alignmentClass]: typeof align !== 'undefined',
    [transformProperties[transform]]: typeof transform !== 'undefined'
  }, className)} />;
});
export default Text;