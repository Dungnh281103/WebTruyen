// src/pages/HomePage/components/DetailedStoryItem.jsx
// (Hoặc đặt ở thư mục components chung nếu dùng ở nhiều nơi)

import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserEdit } from 'react-icons/fa'; // Icon ví dụ cho tác giả
import './DetailedStoryItem.scss'; // CSS riêng cho component này

function DetailedStoryItem({ story }) {
  // Giả sử 'story' object có các thuộc tính:
  // id, title, synopsis, author, genre, imageUrl, url

  return (
    <div className="detailed-story-item">
      <Link to={story.url || '#'} className="detailed-story-item__image-link">
        <img
          src={story.imageUrl || '/images/placeholder.png'}
          alt={story.title}
          className="detailed-story-item__image"
          loading="lazy"
        />
      </Link>
      <div className="detailed-story-item__content">
        <h3 className="detailed-story-item__title">
          <Link to={story.url || '#'}>{story.title}</Link>
        </h3>
        <p className="detailed-story-item__synopsis">
          {story.synopsis || 'Chưa có giới thiệu cho truyện này...'}
        </p>
        <div className="detailed-story-item__meta">
          <span className="detailed-story-item__author">
            <FaUserEdit style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            {story.author || 'Chưa rõ'}
          </span>
          <span className="detailed-story-item__genre genre-badge">
            {story.genre || 'Khác'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DetailedStoryItem;