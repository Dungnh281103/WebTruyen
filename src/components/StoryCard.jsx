import React from "react";
import { Link } from "react-router-dom";
import "./StoryCard.scss";
import { API_URL } from "../constants/apis";
import defaultImg from "../assets/img/default.png";

function StoryCard({ story }) {
  // Make sure it has this link structure
  const storyUrl = story.id ? `/story/${story.id}` : "#";

  // Format view count with thousands separator
  const formattedViews = story.total_views
    ? story.total_views.toLocaleString()
    : story.totalViews
    ? story.totalViews.toLocaleString()
    : story.views
    ? story.views.toLocaleString()
    : "0";

  // Get status with proper formatting
  let statusText = "";
  let statusClass = "";

  if (story.status) {
    const st = story.status.toLowerCase();
    if (st.includes("completed") || st.includes("hoàn thành")) {
      statusText = "Hoàn thành";
      statusClass = "completed";
    } else if (st.includes("đang ra") || st.includes("ongoing")) {
      statusText = "Đang ra";
      statusClass = "ongoing";
    }
  }

  return (
    <div className="story-card">
      <Link to={storyUrl} className="story-link">
        <div className="image-container">
          <img
            src={
              API_URL + "/" + story.coverUrl || story?.imageUrl || defaultImg
            }
            alt={story.title}
            className="story-image"
          />
          <div className="story-views">
            <i className="fas fa-eye"></i> {formattedViews}
          </div>
          {statusText && (
            <div className={`story-status ${statusClass}`}>{statusText}</div>
          )}
        </div>
        <div className="story-info">
          <h3 className="story-title">{story.title}</h3>
          {story.author && <p className="story-author">{story.author}</p>}
          {story.latestChapter && (
            <p className="latest-chapter">{story.latestChapter}</p>
          )}
        </div>
      </Link>
    </div>
  );
}

export default StoryCard;
