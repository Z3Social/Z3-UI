import React from 'react';
import Emoji from '../emoji/emoji';
/** A single emoji reaction. Support custom emojis. */
const EmojiReact = props => {
  const {
    emoji,
    alt,
    ...rest
  } = props;
  if (emoji.get("url")) {
    return <img draggable='false' alt={alt || emoji.get("name")} src={emoji.get("url")} {...rest} />;
  }
  return <Emoji emoji={emoji.get("name")} alt={alt} {...rest} />;
};
export default EmojiReact;