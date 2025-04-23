import React from 'react';
import { Link } from 'react-router-dom';
import './StoryCard.scss';

function StoryCard({ story }) {
  // Make sure it has this link structure
  const storyUrl = story.id ? `/story/${story.id}` : '#';
  
  // Format view count with thousands separator
  const formattedViews = story.total_views ? 
    story.total_views.toLocaleString() : 
    (story.views ? story.views.toLocaleString() : '0');
  
  // Get status with proper formatting
  const status = story.status === 'completed' ? 'Hoàn thành' : 
                (story.status === 'ongoing' ? 'Đang ra' : story.status);

  return (
    <div className="story-card">
      <Link to={storyUrl} className="story-link">
        <div className="image-container">
          <img 
            src={story.cover_url || story.imageUrl || '/images/placeholder.png'} 
            alt={story.title} 
            className="story-image"
          />
          <div className="story-views">
            <i className="fas fa-eye"></i> {formattedViews}
          </div>
          {status && <div className={`story-status ${story.status}`}>{status}</div>}
        </div>
        <div className="story-info">
          <h3 className="story-title">{story.title}</h3>
          {story.author && <p className="story-author">{story.author}</p>}
          {story.latestChapter && <p className="latest-chapter">{story.latestChapter}</p>}
        </div>
      </Link>
    </div>
  );
}

export default StoryCard;