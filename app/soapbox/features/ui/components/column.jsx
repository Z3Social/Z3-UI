import React from 'react';
import Pullable from 'soapbox/components/pullable';
import { Column } from 'soapbox/components/ui';
import ColumnHeader from './column_header';
const UIColumn = ({
  heading,
  icon,
  children,
  active,
  ...rest
}) => {
  const columnHeaderId = heading && heading.replace(/ /g, '-');
  return <Column aria-labelledby={columnHeaderId} {...rest}>
      {heading && <ColumnHeader icon={icon} active={active} type={heading} columnHeaderId={columnHeaderId} />}
      <Pullable>
        {children}
      </Pullable>
    </Column>;
};
export default UIColumn;