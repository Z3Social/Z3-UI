import classNames from 'classnames';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import AutosuggestAccountInput from 'soapbox/components/autosuggest_account_input';
import Icon from 'soapbox/components/icon';
const messages = defineMessages({
  placeholder: {
    id: 'account_search.placeholder',
    defaultMessage: 'Search for an account'
  }
});
/** Input to search for accounts. */
const AccountSearch = ({
  onSelected,
  ...rest
}) => {
  const intl = useIntl();
  const [value, setValue] = useState('');
  const isEmpty = () => {
    return !(value.length > 0);
  };
  const clearState = () => {
    setValue('');
  };
  const handleChange = ({
    target
  }) => {
    setValue(target.value);
  };
  const handleSelected = accountId => {
    clearState();
    onSelected(accountId);
  };
  const handleClear = e => {
    e.preventDefault();
    if (!isEmpty()) {
      setValue('');
    }
  };
  const handleKeyDown = e => {
    if (e.key === 'Escape') {
      document.querySelector('.ui')?.parentElement?.focus();
    }
  };
  return <div className='search search--account'>
      <label>
        <span style={{
        display: 'none'
      }}>{intl.formatMessage(messages.placeholder)}</span>
        <AutosuggestAccountInput className='rounded-full' placeholder={intl.formatMessage(messages.placeholder)} value={value} onChange={handleChange} onSelected={handleSelected} onKeyDown={handleKeyDown} {...rest} />
      </label>
      <div role='button' tabIndex={0} className='search__icon' onClick={handleClear}>
        <Icon src={require('@tabler/icons/search.svg')} className={classNames('svg-icon--search', {
        active: isEmpty()
      })} />
        <Icon src={require('@tabler/icons/backspace.svg')} className={classNames('svg-icon--backspace', {
        active: !isEmpty()
      })} aria-label={intl.formatMessage(messages.placeholder)} />
      </div>
    </div>;
};
export default AccountSearch;