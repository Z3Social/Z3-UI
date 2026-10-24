import React from 'react';
import { randomIntFromInterval, generateText } from '../utils';
/** Fake display name to show when data is loading. */
const PlaceholderDisplayName = ({
  minLength,
  maxLength
}) => {
  const length = randomIntFromInterval(maxLength, minLength);
  const acctLength = randomIntFromInterval(maxLength, minLength);
  return <div className='flex flex-col text-slate-200 dark:text-slate-700'>
      <p>{generateText(length)}</p>
      <p>{generateText(acctLength)}</p>
    </div>;
};
export default PlaceholderDisplayName;