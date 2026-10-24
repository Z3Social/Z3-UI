import React, { useState } from 'react';
import { openModal } from 'soapbox/actions/modals';
import AttachmentThumbs from 'soapbox/components/attachment-thumbs';
import PlaceholderCard from 'soapbox/features/placeholder/components/placeholder_card';
import Card from 'soapbox/features/status/components/card';
import Bundle from 'soapbox/features/ui/components/bundle';
import { MediaGallery, Video, Audio } from 'soapbox/features/ui/util/async-components';
import { useAppDispatch } from 'soapbox/hooks';
/** Render media attachments for a status. */
const StatusMedia = ({
  status,
  muted = false,
  onClick,
  showMedia = true,
  onToggleVisibility = () => {}
}) => {
  const dispatch = useAppDispatch();
  const [mediaWrapperWidth, setMediaWrapperWidth] = useState(undefined);
  const size = status.media_attachments.size;
  const firstAttachment = status.media_attachments.first();
  let media = null;
  const setRef = c => {
    if (c) {
      setMediaWrapperWidth(c.offsetWidth);
    }
  };
  const renderLoadingMediaGallery = () => {
    return <div className='media_gallery' style={{
      height: '285px'
    }} />;
  };
  const renderLoadingVideoPlayer = () => {
    return <div className='media-spoiler-video' style={{
      height: '285px'
    }} />;
  };
  const renderLoadingAudioPlayer = () => {
    return <div className='media-spoiler-audio' style={{
      height: '285px'
    }} />;
  };
  const openMedia = (media, index) => {
    dispatch(openModal('MEDIA', {
      media,
      index
    }));
  };
  const openVideo = (media, time) => {
    dispatch(openModal('VIDEO', {
      media,
      time
    }));
  };
  if (size > 0 && firstAttachment) {
    if (muted) {
      media = <AttachmentThumbs media={status.media_attachments} onClick={onClick} sensitive={status.sensitive} />;
    } else if (size === 1 && firstAttachment.type === 'video') {
      const video = firstAttachment;
      if (video.external_video_id && status.card) {
        const getHeight = () => {
          const width = Number(video.meta.getIn(['original', 'width']));
          const height = Number(video.meta.getIn(['original', 'height']));
          return Number(mediaWrapperWidth) / (width / height);
        };
        const height = getHeight();
        media = <div className='status-card horizontal compact interactive status-card--video'>
            <div ref={setRef} className='status-card__image status-card-video' style={height ? {
            height
          } : undefined} dangerouslySetInnerHTML={{
            __html: status.card.html
          }} />
          </div>;
      } else {
        media = <Bundle fetchComponent={Video} loading={renderLoadingVideoPlayer}>
            {Component => <Component preview={video.preview_url} blurhash={video.blurhash} src={video.url} alt={video.description} aspectRatio={video.meta.getIn(['original', 'aspect'])} height={285} inline sensitive={status.sensitive} onOpenVideo={openVideo} visible={showMedia} onToggleVisibility={onToggleVisibility} />}
          </Bundle>;
      }
    } else if (size === 1 && firstAttachment.type === 'audio') {
      const attachment = firstAttachment;
      media = <Bundle fetchComponent={Audio} loading={renderLoadingAudioPlayer}>
          {Component => <Component src={attachment.url} alt={attachment.description} poster={attachment.preview_url !== attachment.url ? attachment.preview_url : status.getIn(['account', 'avatar_static'])} backgroundColor={attachment.meta.getIn(['colors', 'background'])} foregroundColor={attachment.meta.getIn(['colors', 'foreground'])} accentColor={attachment.meta.getIn(['colors', 'accent'])} duration={attachment.meta.getIn(['original', 'duration'], 0)} height={263} />}
        </Bundle>;
    } else {
      media = <Bundle fetchComponent={MediaGallery} loading={renderLoadingMediaGallery}>
          {Component => <Component media={status.media_attachments} sensitive={status.sensitive} height={285} onOpenMedia={openMedia} visible={showMedia} onToggleVisibility={onToggleVisibility} />}
        </Bundle>;
    }
  } else if (status.spoiler_text.length === 0 && !status.quote && status.card) {
    media = <Card onOpenMedia={openMedia} card={status.card} compact />;
  } else if (status.expectsCard) {
    media = <PlaceholderCard />;
  }
  return media;
};
export default StatusMedia;