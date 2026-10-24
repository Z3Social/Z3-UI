import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { createSelector } from 'reselect';
import { fetchLists } from 'soapbox/actions/lists';
import Icon from 'soapbox/components/icon';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
const getOrderedLists = createSelector([state => state.lists], lists => {
  if (!lists) {
    return lists;
  }
  return lists.toList().filter(item => !!item).sort((a, b) => a.title.localeCompare(b.title)).take(4);
});
const ListPanel = () => {
  const dispatch = useAppDispatch();
  const lists = useAppSelector(state => getOrderedLists(state));
  useEffect(() => {
    dispatch(fetchLists());
  }, []);
  if (!lists || lists.isEmpty()) {
    return null;
  }
  return <div>
      <hr />

      {lists.map(list => <NavLink key={list.id} className='column-link column-link--transparent' strict to={`/list/${list.id}`}><Icon className='column-link__icon' id='list-ul' fixedWidth />{list.title}</NavLink>)}
    </div>;
};
export default ListPanel;