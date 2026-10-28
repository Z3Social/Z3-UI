import classNames from 'classnames';
import React from 'react';
const spaces = {
  0: 'space-y-0',
  '0.5': 'space-y-0.5',
  1: 'space-y-1',
  '1.5': 'space-y-1.5',
  2: 'space-y-2',
  3: 'space-y-3',
  4: 'space-y-4',
  5: 'space-y-5',
  10: 'space-y-10'
};
const justifyContentOptions = {
  center: 'justify-center'
};
const alignItemsOptions = {
  center: 'items-center'
};
/** Vertical stack of child elements. */
const Stack = React.forwardRef((props, ref) => {
  const {
    space,
    alignItems,
    justifyContent,
    className,
    grow,
    ...filteredProps
  } = props;
  return <div ref={ref} {...filteredProps} className={classNames('flex flex-col', {
    [spaces[space]]: typeof space !== 'undefined',
    [alignItemsOptions[alignItems]]: typeof alignItems !== 'undefined',
    [justifyContentOptions[justifyContent]]: typeof justifyContent !== 'undefined',
    'flex-grow': grow
  }, className)} />;
});
export default Stack;