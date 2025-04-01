import React from 'react';
import NewlyUpdatedItem from './NewlyUpdatedItem/NewlyUpdatedItem';

function NewlyUpdatedList({ items }) {
  const limitedItems = items.slice(0, 10);
  return (
    <div className="newly-updated-list">
      {limitedItems.map((item) => (
        <NewlyUpdatedItem key={item.id} item={item} />
      ))}
    </div>
  );
}
export default NewlyUpdatedList;