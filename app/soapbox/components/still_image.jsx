import classNames from 'classnames';
import React, { useRef } from 'react';
import { useSettings } from 'soapbox/hooks';
/** Renders images on a canvas, only playing GIFs if autoPlayGif is enabled. */
const StillImage = ({
  alt,
  className,
  src,
  style
}) => {
  const settings = useSettings();
  const autoPlayGif = settings.get('autoPlayGif');
  const canvas = useRef(null);
  const img = useRef(null);
  const hoverToPlay = src && !autoPlayGif && (src.endsWith('.gif') || src.startsWith('blob:'));
  const handleImageLoad = () => {
    if (hoverToPlay && canvas.current && img.current) {
      canvas.current.width = img.current.naturalWidth;
      canvas.current.height = img.current.naturalHeight;
      canvas.current.getContext('2d')?.drawImage(img.current, 0, 0);
    }
  };
  return <div data-testid='still-image-container' className={classNames(className, 'still-image', {
    'still-image--play-on-hover': hoverToPlay
  })} style={style}>
      <img src={src} alt={alt} ref={img} onLoad={handleImageLoad} />
      {hoverToPlay && <canvas ref={canvas} />}
    </div>;
};
export default StillImage;