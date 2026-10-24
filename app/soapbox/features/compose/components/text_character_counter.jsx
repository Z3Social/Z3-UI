import classNames from 'classnames';
import React from 'react';
import { length } from 'stringz';
const TextCharacterCounter = ({
  text,
  max
}) => {
  const checkRemainingText = diff => {
    return <span className={classNames('text-sm font-semibold', {
      'text-gray-400': diff >= 0,
      'text-danger-600': diff < 0
    })}>
        {diff}
      </span>;
  };
  const diff = max - length(text);
  return checkRemainingText(diff);
};
export default TextCharacterCounter;