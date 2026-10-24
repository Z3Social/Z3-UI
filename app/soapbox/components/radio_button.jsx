import classNames from 'classnames';
import React from 'react';
const RadioButton = ({
  name,
  value,
  checked,
  onChange,
  label
}) => <label className='radio-button'>
    <input name={name} type='radio' value={value} checked={checked} onChange={onChange} />

    <span className={classNames('radio-button__input', {
    checked
  })} />

    <span>{label}</span>
  </label>;
export default RadioButton;