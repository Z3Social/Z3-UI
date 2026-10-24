import React from 'react';
import { removeVS16s, toCodePoints } from 'soapbox/utils/emoji';
import { joinPublicPath } from 'soapbox/utils/static';
/** A single emoji image. */
const Emoji = props => {
  const {
    emoji,
    alt,
    ...rest
  } = props;
  const codepoints = toCodePoints(removeVS16s(emoji));
  const filename = codepoints.join('-');
  if (!filename) return null;
  return <img draggable='false' alt={alt || emoji} src={joinPublicPath(`packs/emoji/${filename}.svg`)} {...rest} />;
};
export default Emoji;