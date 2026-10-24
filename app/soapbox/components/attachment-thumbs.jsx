import React from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from 'soapbox/actions/modals';
import Bundle from 'soapbox/features/ui/components/bundle';
import { MediaGallery } from 'soapbox/features/ui/util/async-components';
const AttachmentThumbs = props => {
  const {
    media,
    onClick,
    sensitive
  } = props;
  const dispatch = useDispatch();
  const renderLoading = () => <div className='media-gallery--compact' />;
  const onOpenMedia = (media, index) => dispatch(openModal('MEDIA', {
    media,
    index
  }));
  return <div className='attachment-thumbs'>
      <Bundle fetchComponent={MediaGallery} loading={renderLoading}>
        {Component => <Component media={media} onOpenMedia={onOpenMedia} height={50} compact sensitive={sensitive} />}
      </Bundle>

      {onClick && <div className='attachment-thumbs__clickable-region' onClick={onClick} />}
    </div>;
};
export default AttachmentThumbs;