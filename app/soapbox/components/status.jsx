import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { HotKeys } from 'react-hotkeys';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';
import { NavLink, useHistory } from 'react-router-dom';
import { mentionCompose, replyComposeWithConfirmation } from 'soapbox/actions/compose';
import { toggleFavourite, toggleReblog } from 'soapbox/actions/interactions';
import { openModal } from 'soapbox/actions/modals';
import { toggleStatusHidden } from 'soapbox/actions/statuses';
import Icon from 'soapbox/components/icon';
import AccountContainer from 'soapbox/containers/account_container';
import QuotedStatus from 'soapbox/features/status/containers/quoted_status_container';
import { useAppDispatch, useSettings } from 'soapbox/hooks';
import { defaultMediaVisibility, textForScreenReader, getActualStatus } from 'soapbox/utils/status';
import StatusActionBar from './status-action-bar';
import StatusMedia from './status-media';
import StatusReplyMentions from './status-reply-mentions';
import StatusContent from './status_content';
import { HStack, Text } from './ui';

// Defined in components/scrollable_list

const messages = defineMessages({
  reblogged_by: {
    id: 'status.reblogged_by',
    defaultMessage: '{name} reposted'
  }
});
const Status = props => {
  const {
    status,
    focusable = true,
    hoverable = true,
    onClick,
    onMoveUp,
    onMoveDown,
    muted,
    hidden,
    featured,
    unread,
    group,
    hideActionBar,
    withDismiss
  } = props;
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const settings = useSettings();
  const displayMedia = settings.get('displayMedia');
  const didShowCard = useRef(false);
  const node = useRef(null);
  const [showMedia, setShowMedia] = useState(defaultMediaVisibility(status, displayMedia));
  const actualStatus = getActualStatus(status);

  // Track height changes we know about to compensate scrolling.
  useEffect(() => {
    didShowCard.current = Boolean(!muted && !hidden && status?.card);
  }, []);
  useEffect(() => {
    setShowMedia(defaultMediaVisibility(status, displayMedia));
  }, [status.id]);
  const handleToggleMediaVisibility = () => {
    setShowMedia(!showMedia);
  };
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      history.push(`/@${actualStatus.getIn(['account', 'acct'])}/posts/${actualStatus.id}`);
    }
  };
  const handleExpandedToggle = () => {
    dispatch(toggleStatusHidden(actualStatus));
  };
  const handleHotkeyOpenMedia = e => {
    const status = actualStatus;
    const firstAttachment = status.media_attachments.first();
    e?.preventDefault();
    if (firstAttachment) {
      if (firstAttachment.type === 'video') {
        dispatch(openModal('VIDEO', {
          media: firstAttachment,
          time: 0
        }));
      } else {
        dispatch(openModal('MEDIA', {
          media: status.media_attachments,
          index: 0
        }));
      }
    }
  };
  const handleHotkeyReply = e => {
    e?.preventDefault();
    dispatch(replyComposeWithConfirmation(actualStatus, intl));
  };
  const handleHotkeyFavourite = () => {
    toggleFavourite(actualStatus);
  };
  const handleHotkeyBoost = e => {
    const modalReblog = () => dispatch(toggleReblog(actualStatus));
    const boostModal = settings.get('boostModal');
    if (e && e.shiftKey || !boostModal) {
      modalReblog();
    } else {
      dispatch(openModal('BOOST', {
        status: actualStatus,
        onReblog: modalReblog
      }));
    }
  };
  const handleHotkeyMention = e => {
    e?.preventDefault();
    dispatch(mentionCompose(actualStatus.account));
  };
  const handleHotkeyOpen = () => {
    history.push(`/@${actualStatus.getIn(['account', 'acct'])}/posts/${actualStatus.id}`);
  };
  const handleHotkeyOpenProfile = () => {
    history.push(`/@${actualStatus.getIn(['account', 'acct'])}`);
  };
  const handleHotkeyMoveUp = e => {
    if (onMoveUp) {
      onMoveUp(status.id, featured);
    }
  };
  const handleHotkeyMoveDown = e => {
    if (onMoveDown) {
      onMoveDown(status.id, featured);
    }
  };
  const handleHotkeyToggleHidden = () => {
    dispatch(toggleStatusHidden(actualStatus));
  };
  const handleHotkeyToggleSensitive = () => {
    handleToggleMediaVisibility();
  };
  const handleHotkeyReact = () => {
    _expandEmojiSelector();
  };
  const _expandEmojiSelector = () => {
    const firstEmoji = node.current?.querySelector('.emoji-react-selector .emoji-react-selector__emoji');
    firstEmoji?.focus();
  };
  if (!status) return null;
  let rebloggedByText, reblogElement, reblogElementMobile;
  if (hidden) {
    return <div ref={node}>
        {actualStatus.getIn(['account', 'display_name']) || actualStatus.getIn(['account', 'username'])}
        {actualStatus.content}
      </div>;
  }
  if (status.filtered || actualStatus.filtered) {
    const minHandlers = muted ? undefined : {
      moveUp: handleHotkeyMoveUp,
      moveDown: handleHotkeyMoveDown
    };
    return <HotKeys handlers={minHandlers}>
        <div className={classNames('status__wrapper', 'status__wrapper--filtered', {
        focusable
      })} tabIndex={focusable ? 0 : undefined} ref={node}>
          <FormattedMessage id='status.filtered' defaultMessage='Filtered' />
        </div>
      </HotKeys>;
  }
  if (status.reblog && typeof status.reblog === 'object') {
    const displayNameHtml = {
      __html: String(status.getIn(['account', 'display_name_html']))
    };
    reblogElement = <NavLink to={`/@${status.getIn(['account', 'acct'])}`} onClick={event => event.stopPropagation()} className='hidden sm:flex items-center text-gray-700 dark:text-gray-600 text-xs font-medium space-x-1 hover:underline'>
        <Icon src={require('@tabler/icons/repeat.svg')} className='text-green-600' />

        <HStack alignItems='center'>
          <FormattedMessage id='status.reblogged_by' defaultMessage='{name} reposted' values={{
          name: <bdi className='max-w-[100px] truncate pr-1'>
                <strong className='text-gray-800 dark:text-gray-200' dangerouslySetInnerHTML={displayNameHtml} />
              </bdi>
        }} />
        </HStack>
      </NavLink>;
    reblogElementMobile = <div className='pb-5 -mt-2 sm:hidden truncate'>
        <NavLink to={`/@${status.getIn(['account', 'acct'])}`} onClick={event => event.stopPropagation()} className='flex items-center text-gray-700 dark:text-gray-600 text-xs font-medium space-x-1 hover:underline'>
          <Icon src={require('@tabler/icons/repeat.svg')} className='text-green-600' />

          <span>
            <FormattedMessage id='status.reblogged_by' defaultMessage='{name} reposted' values={{
            name: <bdi>
                  <strong className='text-gray-800 dark:text-gray-200' dangerouslySetInnerHTML={displayNameHtml} />
                </bdi>
          }} />
          </span>
        </NavLink>
      </div>;
    rebloggedByText = intl.formatMessage(messages.reblogged_by, {
      name: String(status.getIn(['account', 'acct']))
    });
  }
  let quote;
  if (actualStatus.quote) {
    if (actualStatus.pleroma.get('quote_visible', true) === false) {
      quote = <div className='quoted-status-tombstone'>
          <p><FormattedMessage id='statuses.quote_tombstone' defaultMessage='Post is unavailable.' /></p>
        </div>;
    } else {
      quote = <QuotedStatus statusId={actualStatus.quote} />;
    }
  }
  const handlers = muted ? undefined : {
    reply: handleHotkeyReply,
    favourite: handleHotkeyFavourite,
    boost: handleHotkeyBoost,
    mention: handleHotkeyMention,
    open: handleHotkeyOpen,
    openProfile: handleHotkeyOpenProfile,
    moveUp: handleHotkeyMoveUp,
    moveDown: handleHotkeyMoveDown,
    toggleHidden: handleHotkeyToggleHidden,
    toggleSensitive: handleHotkeyToggleSensitive,
    openMedia: handleHotkeyOpenMedia,
    react: handleHotkeyReact
  };
  const statusUrl = `/@${actualStatus.getIn(['account', 'acct'])}/posts/${actualStatus.id}`;
  return <HotKeys handlers={handlers} data-testid='status'>
      <div className={classNames('status cursor-pointer', {
      focusable
    })} tabIndex={focusable && !muted ? 0 : undefined} data-featured={featured ? 'true' : null} aria-label={textForScreenReader(intl, actualStatus, rebloggedByText)} ref={node} onClick={() => history.push(statusUrl)} role='link'>
        {featured && <div className='pt-4 px-4'>
            <HStack alignItems='center' space={1}>
              <Icon src={require('@tabler/icons/pinned.svg')} className='text-gray-600 dark:text-gray-400' />

              <Text size='sm' theme='muted' weight='medium'>
                <FormattedMessage id='status.pinned' defaultMessage='Pinned post' />
              </Text>
            </HStack>
          </div>}

        <div className={classNames('status__wrapper', `status-${actualStatus.visibility}`, {
        'status-reply': !!status.in_reply_to_id,
        muted,
        read: unread === false
      })} data-id={status.id}>
          {reblogElementMobile}

          <div className='mb-4'>
            <AccountContainer key={String(actualStatus.getIn(['account', 'id']))} id={String(actualStatus.getIn(['account', 'id']))} timestamp={actualStatus.created_at} timestampUrl={statusUrl} action={reblogElement} hideActions={!reblogElement} showEdit={!!actualStatus.edited_at} showProfileHoverCard={hoverable} withLinkToProfile={hoverable} />
          </div>

          <div className='status__content-wrapper'>
            {!group && actualStatus.group && <div className='status__meta'>
                Posted in <NavLink to={`/groups/${actualStatus.getIn(['group', 'id'])}`}>{String(actualStatus.getIn(['group', 'title']))}</NavLink>
              </div>}

            <StatusReplyMentions status={actualStatus} hoverable={hoverable} />

            <StatusContent status={actualStatus} onClick={handleClick} expanded={!actualStatus.hidden} onExpandedToggle={handleExpandedToggle} collapsable />

            <StatusMedia status={actualStatus} muted={muted} onClick={handleClick} showMedia={showMedia} onToggleVisibility={handleToggleMediaVisibility} />

            {quote}

            {!hideActionBar && <div className='pt-4'>
                <StatusActionBar status={actualStatus} withDismiss={withDismiss} />
              </div>}
          </div>
        </div>
      </div>
    </HotKeys>;
};
export default Status;