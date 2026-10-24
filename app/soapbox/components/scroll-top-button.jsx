import classNames from 'classnames';
import throttle from 'lodash/throttle';
import React, { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import Icon from 'soapbox/components/icon';
import { Text } from 'soapbox/components/ui';
import { useSettings } from 'soapbox/hooks';
/** Floating new post counter above timelines, clicked to scroll to top. */
const ScrollTopButton = ({
  onClick,
  count,
  message,
  threshold = 400,
  autoloadThreshold = 50
}) => {
  const intl = useIntl();
  const settings = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const autoload = settings.get('autoloadTimelines') === true;
  const visible = count > 0 && scrolled;
  const classes = classNames('left-1/2 -translate-x-1/2 fixed top-20 z-50', {
    'hidden': !visible
  });
  const getScrollTop = () => {
    return (document.scrollingElement || document.documentElement).scrollTop;
  };
  const maybeUnload = () => {
    if (autoload && getScrollTop() <= autoloadThreshold) {
      onClick();
    }
  };
  const handleScroll = useCallback(throttle(() => {
    maybeUnload();
    if (getScrollTop() > threshold) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, 150, {
    trailing: true
  }), [autoload, threshold, autoloadThreshold, onClick]);
  const scrollUp = () => {
    window.scrollTo({
      top: 0
    });
  };
  const handleClick = () => {
    setTimeout(scrollUp, 10);
    onClick();
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onClick]);
  useEffect(() => {
    maybeUnload();
  }, [count]);
  return <div className={classes}>
      <a className='flex items-center bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-100 transition-transform text-white rounded-full px-4 py-2 space-x-1.5 cursor-pointer whitespace-nowrap' onClick={handleClick}>
        <Icon src={require('@tabler/icons/arrow-bar-to-up.svg')} />

        {count > 0 && <Text theme='inherit' size='sm'>
            {intl.formatMessage(message, {
          count
        })}
          </Text>}
      </a>
    </div>;
};
export default ScrollTopButton;