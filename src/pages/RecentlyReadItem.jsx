import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RecentlyReadItem.scss';

function RecentlyReadItem({ item, onRemove }) {
  const navigate = useNavigate();
  
  // Handle removing item from reading history
  const handleRemove = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking remove button
    
    if (onRemove) {
      onRemove(item.id);
    } else {
      // Fallback if onRemove prop is not provided
      try {
        const readingHistory = JSON.parse(localStorage.getItem('readingHistory')) || [];
        const updatedHistory = readingHistory.filter(historyItem => 
          historyItem.storyId !== item.id
        );
        localStorage.setItem('readingHistory', JSON.stringify(updatedHistory));
        // Force re-render by alerting (in a real app, you'd use state management)
        alert(`Đã xóa "${item.title}" khỏi lịch sử.`);
      } catch (error) {
        console.error('Failed to remove from reading history', error);
      }
    }
  };
  
  // Handle clicking on the item to navigate to the last read chapter
  const handleItemClick = () => {
    navigate(item.chapterUrl);
  };

  return (
    <div className="recently-read-item" onClick={handleItemClick}>
      <div className="recently-read-content">
        <div className="time-section">
          <span className="time-ago">{item.timeAgo}</span>
        </div>
        
        <div className="title-section">
          <Link 
            to={item.storyUrl} 
            className="item-title"
            onClick={(e) => e.stopPropagation()} // Prevent triggering parent click
          >
            {item.title}
          </Link>
        </div>
        
        <div className="status-section">
          <span className="read-status">
            Đã đọc: {item.readChapter}/{item.totalChapters || '?'}
          </span>
          
          <button 
            onClick={handleRemove} 
            className="remove-button"
            title="Xóa khỏi lịch sử"
            aria-label="Xóa khỏi lịch sử"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="continue-reading">
        <Link 
          to={item.chapterUrl} 
          className="continue-link"
          onClick={(e) => e.stopPropagation()}
        >
          Tiếp tục đọc chương {item.lastChapterNumber}
        </Link>
      </div>
    </div>
  );
}

export default RecentlyReadItem;