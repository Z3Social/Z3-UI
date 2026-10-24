import React from 'react';

/** Get crypto icon URL by ticker symbol, or fall back to generic icon */
const getIcon = ticker => {
  try {
    return require(`cryptocurrency-icons/svg/color/${ticker.toLowerCase()}.svg`);
  } catch {
    return require('cryptocurrency-icons/svg/color/generic.svg');
  }
};
const CryptoIcon = ({
  ticker,
  title,
  className
}) => {
  return <div className={className}>
      <img src={getIcon(ticker)} alt={title || ticker} />
    </div>;
};
export default CryptoIcon;