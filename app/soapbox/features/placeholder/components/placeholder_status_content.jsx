import React from 'react';
import { randomIntFromInterval, generateText } from '../utils';
/** Fake status content while data is loading. */
const PlaceholderStatusContent = ({
  minLength,
  maxLength
}) => {
  const length = randomIntFromInterval(maxLength, minLength);
  return <div className='flex flex-col text-slate-200 dark:text-slate-700'>
      <p className='break-words'>{generateText(length)}</p>
    </div>;
};
export default PlaceholderStatusContent;