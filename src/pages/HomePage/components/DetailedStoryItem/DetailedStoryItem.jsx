  import React from 'react';
  import { Link } from 'react-router-dom';
  import { FaUserEdit, FaBookOpen, FaEye } from 'react-icons/fa'; 
  import './DetailedStoryItem.scss';
  import defaultImg from '../../../../assets/img/default.png'
import { API_URL } from '../../../../constants/apis';

  function DetailedStoryItem({ story }) {
    // Make sure the URL is properly structured
    const storyUrl = `/story/${story.id}`;
    const readUrl = `/story/${story.id}/chapter/${story.id}-chapter-1`; // Assuming first chapter ID format
    
    // Extract first paragraph of description if it's an array
    const synopsis = Array.isArray(story.description) 
      ? story.description[0] 
      : (story.description || story.synopsis || 'Chưa có giới thiệu cho truyện này...');
    
    // Get first category as primary genre
    const primaryGenre = story.categories && story.categories.length > 0 
      ? story.categories[0] 
      : (story.genre || 'Khác');
   console.log(story.coverUrl );
    return (
      <div className="detailed-story-item">
        <Link to={storyUrl} className="detailed-story-item__image-link">
          <img
            src={API_URL+'/'+story.coverUrl || story?.imageUrl || defaultImg}
            alt={story.title}
            className="detailed-story-item__image"
            loading="lazy"
          />
        </Link>
        <div className="detailed-story-item__content">
          <h2 className="detailed-story-item__title">
            <Link to={storyUrl}>{story.title}</Link>
          </h2>
          
          <p className="detailed-story-item__synopsis">
            {synopsis.length > 150 ? `${synopsis.substring(0, 150)}...` : synopsis}
          </p>
          
          <div className="detailed-story-item__meta">
            <span className="detailed-story-item__author">
              <FaUserEdit className="icon" />
              {story.author || 'Chưa rõ'}
            </span>
            
            <span className="detailed-story-item__genre genre-badge">
              {primaryGenre}
            </span>
            
              {/* {story.total_views && (
                <span className="detailed-story-item__views">
                  <FaEye className="icon" />
                  {story.total_views.toLocaleString()}
                </span>
              )} */}
          </div>
          
          
        </div>
      </div>
    );
  }

  export default DetailedStoryItem;