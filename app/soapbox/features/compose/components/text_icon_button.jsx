import React from 'react';
const TextIconButton = ({
  label,
  title,
  active,
  ariaControls,
  unavailable,
  onClick
}) => {
  const handleClick = e => {
    e.preventDefault();
    onClick();
  };
  if (unavailable) {
    return null;
  }
  return <button title={title} aria-label={title} className={`text-icon-button ${active ? 'active' : ''}`} aria-expanded={active} onClick={handleClick} aria-controls={ariaControls}>
      {label}
    </button>;
};
export default TextIconButton;