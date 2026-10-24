import classNames from 'classnames';
import React from 'react';
/** Textarea with custom styles. */
const Textarea = React.forwardRef(({
  isCodeEditor = false,
  hasError = false,
  ...props
}, ref) => {
  return <textarea {...props} ref={ref} className={classNames({
    'dark:bg-slate-800 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md': true,
    'font-mono': isCodeEditor,
    'text-red-600 border-red-600': hasError
  })} />;
});
export default Textarea;