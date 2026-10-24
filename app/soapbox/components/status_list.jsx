import classNames from 'classnames';
import debounce from 'lodash/debounce';
import React, { useRef, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import LoadGap from 'soapbox/components/load_gap';
import ScrollableList from 'soapbox/components/scrollable_list';
import StatusContainer from 'soapbox/containers/status_container';
import Ad from 'soapbox/features/ads/components/ad';
import FeedSuggestions from 'soapbox/features/feed-suggestions/feed-suggestions';
import PlaceholderStatus from 'soapbox/features/placeholder/components/placeholder_status';
import PendingStatus from 'soapbox/features/ui/components/pending_status';
import { useSoapboxConfig } from 'soapbox/hooks';
import useAds from 'soapbox/queries/ads';
/** Feed of statuses, built atop ScrollableList. */
const StatusList = ({
  statusIds,
  lastStatusId,
  featuredStatusIds,
  divideType = 'border',
  onLoadMore,
  timelineId,
  isLoading,
  isPartial,
  showAds = false,
  ...other
}) => {
  const {
    data: ads
  } = useAds();
  const soapboxConfig = useSoapboxConfig();
  const adsInterval = Number(soapboxConfig.extensions.getIn(['ads', 'interval'], 40)) || 0;
  const node = useRef(null);
  const getFeaturedStatusCount = () => {
    return featuredStatusIds?.size || 0;
  };
  const getCurrentStatusIndex = (id, featured) => {
    if (featured) {
      return featuredStatusIds?.keySeq().findIndex(key => key === id) || 0;
    } else {
      return statusIds.keySeq().findIndex(key => key === id) + getFeaturedStatusCount();
    }
  };
  const handleMoveUp = (id, featured = false) => {
    const elementIndex = getCurrentStatusIndex(id, featured) - 1;
    selectChild(elementIndex);
  };
  const handleMoveDown = (id, featured = false) => {
    const elementIndex = getCurrentStatusIndex(id, featured) + 1;
    selectChild(elementIndex);
  };
  const handleLoadOlder = useCallback(debounce(() => {
    const maxId = lastStatusId || statusIds.last();
    if (onLoadMore && maxId) {
      onLoadMore(maxId.replace('末suggestions-', ''));
    }
  }, 300, {
    leading: true
  }), [onLoadMore, lastStatusId, statusIds.last()]);
  const selectChild = index => {
    node.current?.scrollIntoView({
      index,
      behavior: 'smooth',
      done: () => {
        const element = document.querySelector(`#status-list [data-index="${index}"] .focusable`);
        element?.focus();
      }
    });
  };
  const renderLoadGap = index => {
    const ids = statusIds.toList();
    const nextId = ids.get(index + 1);
    const prevId = ids.get(index - 1);
    if (index < 1 || !nextId || !prevId || !onLoadMore) return null;
    return <LoadGap key={'gap:' + nextId} disabled={isLoading} maxId={prevId} onClick={onLoadMore} />;
  };
  const renderStatus = statusId => {
    return <StatusContainer key={statusId} id={statusId} onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} contextType={timelineId} />;
  };
  const renderAd = ad => {
    return <Ad card={ad.card} impression={ad.impression} />;
  };
  const renderPendingStatus = statusId => {
    const idempotencyKey = statusId.replace(/^末pending-/, '');
    return <PendingStatus key={statusId} idempotencyKey={idempotencyKey} />;
  };
  const renderFeaturedStatuses = () => {
    if (!featuredStatusIds) return [];
    return featuredStatusIds.toArray().map(statusId => <StatusContainer key={`f-${statusId}`} id={statusId} featured onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} contextType={timelineId} />);
  };
  const renderFeedSuggestions = () => {
    return <FeedSuggestions key='suggestions' />;
  };
  const renderStatuses = () => {
    if (isLoading || statusIds.size > 0) {
      return statusIds.toList().reduce((acc, statusId, index) => {
        const adIndex = ads ? Math.floor((index + 1) / adsInterval) % ads.length : 0;
        const ad = ads ? ads[adIndex] : undefined;
        const showAd = (index + 1) % adsInterval === 0;
        if (statusId === null) {
          acc.push(renderLoadGap(index));
        } else if (statusId.startsWith('末suggestions-')) {
          acc.push(renderFeedSuggestions());
        } else if (statusId.startsWith('末pending-')) {
          acc.push(renderPendingStatus(statusId));
        } else {
          acc.push(renderStatus(statusId));
        }
        if (showAds && ad && showAd) {
          acc.push(renderAd(ad));
        }
        return acc;
      }, []);
    } else {
      return [];
    }
  };
  const renderScrollableContent = () => {
    const featuredStatuses = renderFeaturedStatuses();
    const statuses = renderStatuses();
    if (featuredStatuses && statuses) {
      return featuredStatuses.concat(statuses);
    } else {
      return statuses;
    }
  };
  if (isPartial) {
    return <div className='regeneration-indicator'>
        <div>
          <div className='regeneration-indicator__label'>
            <FormattedMessage id='regeneration_indicator.label' tagName='strong' defaultMessage='Loading&hellip;' />
            <FormattedMessage id='regeneration_indicator.sublabel' defaultMessage='Your home feed is being prepared!' />
          </div>
        </div>
      </div>;
  }
  return <ScrollableList id='status-list' key='scrollable-list' isLoading={isLoading} showLoading={isLoading && statusIds.size === 0} onLoadMore={handleLoadOlder} placeholderComponent={PlaceholderStatus} placeholderCount={20} ref={node} className={classNames('divide-y divide-solid divide-gray-200 dark:divide-slate-700', {
    'divide-none': divideType !== 'border'
  })} itemClassName={classNames({
    'pb-3': divideType !== 'border'
  })} {...other}>
      {renderScrollableContent()}
    </ScrollableList>;
};
export default StatusList;