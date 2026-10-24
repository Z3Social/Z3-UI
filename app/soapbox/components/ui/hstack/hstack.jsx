import classNames from 'classnames';
import React, { forwardRef } from 'react';
const justifyContentOptions = {
  between: 'justify-between',
  center: 'justify-center',
  start: 'justify-start',
  end: 'justify-end',
  around: 'justify-around'
};
const alignItemsOptions = {
  top: 'items-start',
  bottom: 'items-end',
  center: 'items-center',
  start: 'items-start'
};
const spaces = {
  '0.5': 'space-x-0.5',
  1: 'space-x-1',
  1.5: 'space-x-1.5',
  2: 'space-x-2',
  3: 'space-x-3',
  4: 'space-x-4',
  6: 'space-x-6',
  8: 'space-x-8'
};
/** Horizontal row of child elements. */
const HStack = forwardRef((props, ref) => {
  const {
    space,
    alignItems,
    grow,
    justifyContent,
    className,
    ...filteredProps
  } = props;
  return <div {...filteredProps} ref={ref} className={classNames('flex', {
    [alignItemsOptions[alignItems]]: typeof alignItems !== 'undefined',
    [justifyContentOptions[justifyContent]]: typeof justifyContent !== 'undefined',
    [spaces[space]]: typeof space !== 'undefined',
    'flex-grow': grow
  }, className)} />;
});
export default HStack;