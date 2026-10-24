import classNames from 'classnames';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import IconWithCounter from 'soapbox/components/icon_with_counter';
import { Icon, Text } from 'soapbox/components/ui';
const ThumbNavigationLink = ({
  count,
  src,
  text,
  to,
  exact,
  paths
}) => {
  const {
    pathname
  } = useLocation();
  const isActive = () => {
    if (paths) {
      return paths.some(path => pathname.startsWith(path));
    } else {
      return exact ? pathname === to : pathname.startsWith(to);
    }
  };
  const active = isActive();
  return <NavLink to={to} exact={exact} className='thumb-navigation__link'>
      {count !== undefined ? <IconWithCounter src={src} className={classNames({
      'h-5 w-5': true,
      'text-gray-600 dark:text-gray-300': !active,
      'text-primary-600': active
    })} count={count} /> : <Icon src={src} className={classNames({
      'h-5 w-5': true,
      'text-gray-600 dark:text-gray-300': !active,
      'text-primary-600': active
    })} />}

      <Text tag='span' size='xs'>
        {text}
      </Text>
    </NavLink>;
};
export default ThumbNavigationLink;