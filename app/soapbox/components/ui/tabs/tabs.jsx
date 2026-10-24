import { useRect } from '@reach/rect';
import { Tabs as ReachTabs, TabList as ReachTabList, Tab as ReachTab, useTabsContext } from '@reach/tabs';
import classNames from 'classnames';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Counter from '../counter/counter';
import './tabs.css';
const HORIZONTAL_PADDING = 8;
const AnimatedContext = React.createContext(null);
/** Tabs with a sliding active state. */
const AnimatedTabs = ({
  children,
  ...rest
}) => {
  const [activeRect, setActiveRect] = React.useState(null);
  const ref = React.useRef();
  const rect = useRect(ref);

  const top = (activeRect && activeRect.bottom) - (rect && rect.top);
  const width = activeRect && activeRect.width - HORIZONTAL_PADDING * 2;
  const left = (activeRect && activeRect.left) - (rect && rect.left) + HORIZONTAL_PADDING;
  return (
    <AnimatedContext.Provider value={setActiveRect}>
      <ReachTabs {...rest}
      ref={ref}>
        <div className='w-full h-[3px] bg-primary-200 dark:bg-slate-700 absolute' style={{
          top
        }} />
        <div className={classNames('absolute h-[3px] bg-primary-600 transition-all duration-200', {
          'hidden': top <= 0
        })} style={{
          left,
          top,
          width
        }} />
        {children}
      </ReachTabs>
    </AnimatedContext.Provider>
  );
};
/** A single animated tab. */
const AnimatedTab = ({
  index,
  ...props
}) => {
  // get the currently selected index from useTabsContext
  const {
    selectedIndex
  } = useTabsContext();
  const isSelected = selectedIndex === index;

  // measure the size of our element, only listen to rect if active
  const ref = React.useRef();
  const rect = useRect(ref, {
    observe: isSelected
  });

  // get the style changing function from context
  const setActiveRect = React.useContext(AnimatedContext);

  // callup to set styles whenever we're active
  React.useLayoutEffect(() => {
    if (isSelected) {
      setActiveRect(rect);
    }
  }, [isSelected, rect, setActiveRect]);
  return (
    <ReachTab ref={ref} {...props} />
  );
};

/** Structure to represent a tab. */

/** Animated tabs component. */
const Tabs = ({
  items,
  activeItem
}) => {
  const defaultIndex = items.findIndex(({
    name
  }) => name === activeItem);
  const history = useHistory();
  const onChange = selectedIndex => {
    const item = items[selectedIndex];
    if (typeof item.action === 'function') {
      item.action();
    } else if (item.to) {
      history.push(item.to);
    }
  };
  const renderItem = (item, idx) => {
    const {
      name,
      text,
      title,
      count
    } = item;
    return <AnimatedTab key={name} as='button' role='button'
    title={title} index={idx}>
        <div className='relative'>
          {count ? <span className='absolute -top-2 left-full ml-1'>
              <Counter count={count} />
            </span> : null}

          {text}
        </div>
      </AnimatedTab>;
  };
  return <AnimatedTabs onChange={onChange} defaultIndex={defaultIndex}>
      <ReachTabList>
        {items.map((item, i) => renderItem(item, i))}
      </ReachTabList>
    </AnimatedTabs>;
};
export default Tabs;