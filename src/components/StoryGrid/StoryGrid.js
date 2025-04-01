// src/components/StoryGrid/StoryGrid.js
import React from 'react';
import StoryCard from '../StoryCard'; // Import component StoryCard đã có
import './StoryGrid.scss';

function StoryGrid({ stories }) {
  if (!stories || stories.length === 0) {
    return null; // Hoặc hiển thị thông báo nếu cần
  }

  return (
    <div className="story-grid-container">
      {stories.map(story => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}

export default StoryGrid;