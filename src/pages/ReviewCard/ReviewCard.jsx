import React from 'react';
import { Link } from 'react-router-dom';
import './ReviewCard.scss'; // Import file SCSS

// Hàm render sao đơn giản
const renderStars = (rating) => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += (i < rating) ? '★' : '☆';
    }
    return <span className="review-stars">{stars}</span>;
}

function ReviewCard({ review }) {
    return (
        <div className="review-card">
            <div className="review-header">
                <img src={review.userAvatar || '/images/default-avatar.png'} alt={review.username} className="review-avatar" />
                <strong className="review-username">{review.username}</strong>
                <span className="review-time">{review.timeAgo}</span>
            </div>
            <div className="review-details">
                {renderStars(review.rating)} cho
                <Link to={review.storyUrl} className="review-story-link">
                    {review.storyThumb && <img src={review.storyThumb} alt="" className="review-story-thumb" />}
                    {review.storyTitle}
                </Link>
            </div>
            <p className="review-snippet">"{review.snippet}"</p>
        </div>
    );
}

export default ReviewCard;