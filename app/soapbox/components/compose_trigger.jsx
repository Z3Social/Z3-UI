import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { openModal } from 'soapbox/actions/modals';
import Avatar from 'soapbox/components/avatar';
import { useOwnAccount } from 'soapbox/hooks';

const messages = defineMessages({
  placeholder: {
    id: 'compose_form.placeholder',
    defaultMessage: "What's on your mind?",
  },
});

/**
 * Clean Facebook/Twitter-style compose trigger box.
 * Clicking it opens the full Compose modal smoothly without in-page layout shifting or glitching.
 */
const ComposeTrigger = ({ group = null, placeholder = null }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const account = useOwnAccount();

  if (!account) return null;

  const handleOpenCompose = () => {
    dispatch(openModal('COMPOSE', { group }));
  };

  const displayText = placeholder || intl.formatMessage(messages.placeholder);
  const acct = account.get ? account.get('acct') : account.acct;

  return (
    <div className='flex items-center space-x-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-inset mb-4 border border-solid border-gray-100 dark:border-slate-700/50'>
      <Link to={`/@${acct}`} className='flex-shrink-0 block rounded-full focus:outline-none'>
        <Avatar account={account} size={42} />
      </Link>

      <button
        type='button'
        onClick={handleOpenCompose}
        className='flex-1 text-left px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-700/60 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary-500'
      >
        {displayText}
      </button>
    </div>
  );
};

ComposeTrigger.propTypes = {
  group: ImmutablePropTypes.map,
  placeholder: PropTypes.string,
};

export default ComposeTrigger;
