import classNames from 'classnames';
import * as React from 'react';
import StillImage from 'soapbox/components/still_image';
const AVATAR_SIZE = 42;
/** Round profile avatar for accounts. */
const Avatar = props => {
  const {
    src,
    size = AVATAR_SIZE,
    className
  } = props;
  const style = React.useMemo(() => ({
    width: size,
    height: size
  }), [size]);
  return <StillImage className={classNames('rounded-full overflow-hidden', className)} style={style} src={src} alt='Avatar' />;
};
export { Avatar as default, AVATAR_SIZE };