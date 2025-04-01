// NewlyUpdatedItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NewlyUpdatedItem.scss';

function NewlyUpdatedItem({ item }) {
  return (
    <div className="newly-updated-item">
      <div className="genre-section">
        <span className="genre-badge">{item.genre}</span>
      </div>
      
      <div className="title-section">
        <Link to={item.storyUrl} className="story-title">
          {item.title}
        </Link>
      </div>
      
      <div className="author-section">
        <span className="author">{item.author}</span>
      </div>
      
      <div className="chapter-section">
        <span className="chapter-link">
          {item.latestChapter}
        </span>
      </div>
      
      <div className="time-section">
        <span className="time-ago">{item.timeAgo}</span>
      </div>
    </div>
  );
}

export default NewlyUpdatedItem;