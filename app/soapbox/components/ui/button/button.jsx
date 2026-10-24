import * as React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../icon/icon';
import { useButtonStyles } from './useButtonStyles';
/** Customizable button element with various themes. */
const Button = React.forwardRef((props, ref) => {
  const {
    block = false,
    children,
    disabled = false,
    icon,
    onClick,
    size = 'md',
    text,
    theme = 'accent',
    to,
    type = 'button'
  } = props;
  const themeClass = useButtonStyles({
    theme,
    block,
    disabled,
    size
  });
  const renderIcon = () => {
    if (!icon) {
      return null;
    }
    return <Icon src={icon} className='mr-2 w-4 h-4' />;
  };
  const handleClick = React.useCallback(event => {
    if (onClick && !disabled) {
      onClick(event);
    }
  }, [onClick, disabled]);
  const renderButton = () => <button className={themeClass} disabled={disabled} onClick={handleClick} ref={ref} type={type} data-testid='button'>
      {renderIcon()}
      {text || children}
    </button>;
  if (to) {
    return <Link to={to} tabIndex={-1} className='inline-flex'>
        {renderButton()}
      </Link>;
  }
  return renderButton();
});
export default Button;