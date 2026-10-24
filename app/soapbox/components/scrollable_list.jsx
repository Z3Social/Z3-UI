import debounce from 'lodash/debounce';
import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';
import { useSettings } from 'soapbox/hooks';
import LoadMore from './load_more';
import { Card, Spinner, Text } from './ui';

/** Custom Viruoso component context. */

/** Scroll position saved in sessionStorage. */

/** Custom Virtuoso Item component representing a single scrollable item. */
// NOTE: It's crucial to space lists with **padding** instead of margin!
// Pass an `itemClassName` like `pb-3`, NOT a `space-y-3` className
// https://virtuoso.dev/troubleshooting#list-does-not-scroll-to-the-bottom--items-jump-around
const Item = ({
  context,
  ...rest
}) => <div className={context?.itemClassName} {...rest} />;

/** Custom Virtuoso List component for the outer container. */
// Ensure the className winds up here
const List = React.forwardRef((props, ref) => {
  const {
    context,
    ...rest
  } = props;
  return <div ref={ref} className={context?.listClassName} {...rest} />;
});
/** Legacy ScrollableList with Virtuoso for backwards-compatibility. */
const ScrollableList = React.forwardRef(({
  scrollKey,
  prepend = null,
  alwaysPrepend,
  children,
  isLoading,
  emptyMessage,
  showLoading,
  onRefresh,
  onScroll,
  onScrollToTop,
  onLoadMore,
  className,
  itemClassName,
  id,
  hasMore,
  placeholderComponent: Placeholder,
  placeholderCount = 0,
  initialTopMostItemIndex = 0,
  style = {},
  useWindowScroll = true
}, ref) => {
  const history = useHistory();
  const settings = useSettings();
  const autoloadMore = settings.get('autoloadMore');

  // Preserve scroll position
  const scrollDataKey = `soapbox:scrollData:${scrollKey}`;
  const scrollData = useMemo(() => JSON.parse(sessionStorage.getItem(scrollDataKey)), [scrollDataKey]);
  const topIndex = useRef(scrollData ? scrollData.index : 0);
  const topOffset = useRef(scrollData ? scrollData.offset : 0);

  /** Normalized children. */
  const elements = Array.from(children || []);
  const showPlaceholder = showLoading && Placeholder && placeholderCount > 0;

  // NOTE: We are doing some trickery to load a feed of placeholders
  // Virtuoso's `EmptyPlaceholder` unfortunately doesn't work for our use-case
  const data = showPlaceholder ? Array(placeholderCount).fill('') : elements;

  // Add a placeholder at the bottom for loading
  // (Don't use Virtuoso's `Footer` component because it doesn't preserve its height)
  if (hasMore && (autoloadMore || isLoading) && Placeholder) {
    data.push(<Placeholder />);
  } else if (hasMore && (autoloadMore || isLoading)) {
    data.push(<Spinner />);
  }
  const handleScroll = useCallback(debounce(() => {
    // HACK: Virtuoso has no better way to get this...
    const node = document.querySelector(`[data-virtuoso-scroller] [data-item-index="${topIndex.current}"]`);
    if (node) {
      topOffset.current = node.getBoundingClientRect().top * -1;
    } else {
      topOffset.current = 0;
    }
  }, 150, {
    trailing: true
  }), []);
  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    sessionStorage.removeItem(scrollDataKey);
    return () => {
      if (scrollKey) {
        const data = {
          index: topIndex.current,
          offset: topOffset.current
        };
        sessionStorage.setItem(scrollDataKey, JSON.stringify(data));
      }
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* Render an empty state instead of the scrollable list. */
  const renderEmpty = () => {
    return <div className='mt-2'>
        {alwaysPrepend && prepend}

        <Card variant='rounded' size='lg'>
          {isLoading ? <Spinner /> : <Text>{emptyMessage}</Text>}
        </Card>
      </div>;
  };

  /** Render a single item. */
  const renderItem = (_i, element) => {
    if (showPlaceholder) {
      return <Placeholder />;
    } else {
      return element;
    }
  };
  const handleEndReached = () => {
    if (autoloadMore && hasMore && onLoadMore) {
      onLoadMore();
    }
  };
  const loadMore = () => {
    if (autoloadMore || !hasMore || !onLoadMore) {
      return null;
    } else {
      return <LoadMore visible={!isLoading} onClick={onLoadMore} />;
    }
  };
  const handleRangeChange = range => {
    // HACK: using the first index can be buggy.
    // Track the second item instead, unless the endIndex comes before it (eg one 1 item in view).
    topIndex.current = Math.min(range.startIndex + 1, range.endIndex);
    handleScroll();
  };

  /** Figure out the initial index to scroll to. */
  const initialIndex = useMemo(() => {
    if (showLoading) return 0;
    if (initialTopMostItemIndex) return initialTopMostItemIndex;
    if (scrollData && history.action === 'POP') {
      return {
        align: 'start',
        index: scrollData.index,
        offset: scrollData.offset
      };
    }
    return 0;
  }, [showLoading, initialTopMostItemIndex]);
  return <Virtuoso ref={ref} id={id} useWindowScroll={useWindowScroll} className={className} data={data} startReached={onScrollToTop} endReached={handleEndReached} isScrolling={isScrolling => isScrolling && onScroll && onScroll()} itemContent={renderItem} initialTopMostItemIndex={initialIndex} rangeChanged={handleRangeChange} style={style} context={{
    listClassName: className,
    itemClassName
  }} components={{
    Header: () => <>{prepend}</>,
    ScrollSeekPlaceholder: Placeholder,
    EmptyPlaceholder: () => renderEmpty(),
    List,
    Item,
    Footer: loadMore
  }} />;
});
export default ScrollableList;