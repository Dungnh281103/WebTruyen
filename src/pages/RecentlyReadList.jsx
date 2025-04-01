import React from 'react';
import RecentlyReadItem from './RecentlyReadItem'; // Assuming it's in the same folder

 function RecentlyReadList({ items }) {
  const limitedItems = items.slice(0, 5);
   return (
     <div className="recently-read-list">
       {limitedItems.map((item) => (
         <RecentlyReadItem key={item.id} item={item} />
       ))}
     </div>
   );
 }
 export default RecentlyReadList;