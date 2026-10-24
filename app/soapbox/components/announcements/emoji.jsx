import React from 'react';
import unicodeMapping from 'soapbox/features/emoji/emoji_unicode_mapping_light';
import { useSettings } from 'soapbox/hooks';
import { joinPublicPath } from 'soapbox/utils/static';
const Emoji = ({
  emoji,
  emojiMap,
  hovered
}) => {
  const autoPlayGif = useSettings().get('autoPlayGif');

  if (unicodeMapping[emoji]) {
    const {
      filename,
      shortCode
    } = unicodeMapping[emoji];
    const title = shortCode ? `:${shortCode}:` : '';
    return <img draggable='false' className='emojione block m-0' alt={emoji} title={title} src={joinPublicPath(`packs/emoji/${filename}.svg`)} />;
  } else if (emojiMap.get(emoji)) {
    const filename = autoPlayGif || hovered ? emojiMap.getIn([emoji, 'url']) : emojiMap.getIn([emoji, 'static_url']);
    const shortCode = `:${emoji}:`;
    return <img draggable='false' className='emojione block m-0' alt={shortCode} title={shortCode} src={filename} />;
  } else {
    return null;
  }
};
export default Emoji;