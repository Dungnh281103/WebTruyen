// RecentlyReadItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import './RecentlyReadItem.scss';

function RecentlyReadItem({ item }) {
  const handleRemove = (e) => {
    e.stopPropagation(); // Ngăn không trigger link của item
    // Gọi API hoặc dispatch action để xóa item khỏi lịch sử
    console.log(`Remove item ${item.id}`);
    alert(`Đã xóa "${item.title}" khỏi lịch sử (chức năng demo).`);
  };

  return (
    <div className="recently-read-item">
      <div>
        <span className="time-ago">{item.timeAgo}</span>
      </div>
      <div>
        <Link to={item.chapterUrl} className="item-title">
          {item.title}
        </Link>
      </div>
      <div className="right-section">
        
          <span className="read-status">
            Đã đọc: {item.readChapter}/{item.totalChapters}
          </span>
        </div>
        <div>
          <button onClick={handleRemove} className="remove-button">
            x
          </button>
        </div>
      
    </div>
  );
}

export default RecentlyReadItem;