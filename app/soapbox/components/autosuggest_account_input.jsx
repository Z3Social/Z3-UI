import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import throttle from 'lodash/throttle';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { accountSearch } from 'soapbox/actions/accounts';
import AutosuggestInput from 'soapbox/components/autosuggest_input';
import { useAppDispatch } from 'soapbox/hooks';
const noOp = () => {};
const AutosuggestAccountInput = ({
  onChange,
  onSelected,
  value = '',
  limit = 4,
  ...rest
}) => {
  const dispatch = useAppDispatch();
  const [accountIds, setAccountIds] = useState(ImmutableOrderedSet());
  const controller = useRef(new AbortController());
  const refreshCancelToken = () => {
    controller.current.abort();
    controller.current = new AbortController();
  };
  const clearResults = () => {
    setAccountIds(ImmutableOrderedSet());
  };
  const handleAccountSearch = useCallback(throttle(q => {
    const params = {
      q,
      limit,
      resolve: false
    };
    dispatch(accountSearch(params, controller.current.signal)).then(accounts => {
      const accountIds = accounts.map(account => account.id);
      setAccountIds(ImmutableOrderedSet(accountIds));
    }).catch(noOp);
  }, 900, {
    leading: true,
    trailing: true
  }), [limit]);
  const handleChange = e => {
    refreshCancelToken();
    handleAccountSearch(e.target.value);
    onChange(e);
  };
  const handleSelected = (_tokenStart, _lastToken, suggestion) => {
    if (typeof suggestion === 'string' && suggestion[0] !== '#') {
      onSelected(suggestion);
    }
  };
  useEffect(() => {
    if (value === '') {
      clearResults();
    }
  }, [value]);
  return <AutosuggestInput value={value} onChange={handleChange} suggestions={accountIds.toList()} onSuggestionsFetchRequested={noOp} onSuggestionsClearRequested={noOp} onSuggestionSelected={handleSelected} searchTokens={[]} {...rest} />;
};
export default AutosuggestAccountInput;