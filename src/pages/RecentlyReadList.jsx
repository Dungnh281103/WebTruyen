import React, { useState } from 'react';
import RecentlyReadItem from './RecentlyReadItem';
// import './RecentlyReadList.scss';

function RecentlyReadList({ items }) {
  const [readingHistory, setReadingHistory] = useState(items || []);
  
  // Process items to ensure they have the correct structure
  const processedItems = readingHistory.map(item => ({
    id: item.storyId,
    title: item.storyTitle,
    storyUrl: `/story/${item.storyId}`,
    chapterUrl: `/story/${item.storyId}/chapter/${item.lastChapterId}`,
    readChapter: item.lastChapterNumber || 1,
    totalChapters: item.totalChapters || '?',
    lastChapterId: item.lastChapterId,
    lastChapterNumber: item.lastChapterNumber || 1,
    timeAgo: formatTimeAgo(item.timestamp),
    coverUrl: item.coverUrl || '/images/placeholder.png'
  }));
  
  // Helper function to format timestamps
  function formatTimeAgo(timestamp) {
    if (!timestamp) return 'Không rõ';
    
    const now = new Date();
    const readTime = new Date(timestamp);
    const diffMs = now - readTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} ngày trước`;
    if (diffHours > 0) return `${diffHours} giờ trước`;
    if (diffMins > 0) return `${diffMins} phút trước`;
    return 'Vừa đọc';
  }
  
  // Handle removing an item
  const handleRemoveItem = (itemId) => {
    try {
      // Update localStorage
      const currentHistory = JSON.parse(localStorage.getItem('readingHistory')) || [];
      const updatedHistory = currentHistory.filter(item => item.storyId !== itemId);
      localStorage.setItem('readingHistory', JSON.stringify(updatedHistory));
      
      // Update state to re-render
      setReadingHistory(updatedHistory);
    } catch (error) {
      console.error('Failed to remove from reading history:', error);
    }
  };
  
  if (processedItems.length === 0) {
    return (
      <div className="recently-read-list empty-list">
        <p>Bạn chưa có truyện nào trong lịch sử đọc</p>
      </div>
    );
  }

  return (
    <div className="recently-read-list">
      {processedItems.map(item => (
        <RecentlyReadItem 
          key={`${item.id}-${item.lastChapterId}`}
          item={item}
          onRemove={handleRemoveItem}
        />
      ))}
    </div>
  );
}

export default RecentlyReadList;