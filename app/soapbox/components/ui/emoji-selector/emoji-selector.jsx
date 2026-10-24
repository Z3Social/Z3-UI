import classNames from 'classnames';
import React from 'react';
import { Emoji, HStack } from 'soapbox/components/ui';
/** Clickable emoji button that scales when hovered. */
const EmojiButton = ({
  emoji,
  className,
  onClick,
  tabIndex
}) => {
  return <button className={classNames(className)} onClick={onClick} tabIndex={tabIndex}>
      <Emoji className='w-8 h-8 duration-100 hover:scale-125' emoji={emoji} />
    </button>;
};
/** Panel with a row of emoji buttons. */
const EmojiSelector = ({
  emojis,
  onReact,
  visible = false,
  focused = false
}) => {
  const handleReact = emoji => {
    return e => {
      onReact(emoji);
      e.preventDefault();
      e.stopPropagation();
    };
  };
  return <HStack space={2} className={classNames('bg-white dark:bg-slate-900 p-3 rounded-full shadow-md z-[999] w-max')}>
      {Array.from(emojis).map((emoji, i) => <EmojiButton key={i} emoji={emoji} onClick={handleReact(emoji)} tabIndex={visible || focused ? 0 : -1} />)}
    </HStack>;
};
export default EmojiSelector;