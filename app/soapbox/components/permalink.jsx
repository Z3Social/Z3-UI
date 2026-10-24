import * as React from 'react';
import { useHistory } from 'react-router-dom';
const Permalink = props => {
  const history = useHistory();
  const {
    className,
    href,
    title,
    to,
    children,
    ...filteredProps
  } = props;
  const handleClick = event => {
    if (event.button === 0 && !(event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      history.push(to);
    }
  };
  return <a target='_blank' href={href} onClick={handleClick} title={title} className={`permalink${className ? ' ' + className : ''}`} {...filteredProps}>
      {children}
    </a>;
};
export default Permalink;