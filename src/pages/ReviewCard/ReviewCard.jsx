        import React from 'react';
        import { Link } from 'react-router-dom';
        import './ReviewCard.scss';

        // Hàm render sao đơn giản
        const renderStars = (rating) => {
            let stars = '';
            for (let i = 0; i < 5; i++) {
                stars += (i < rating) ? '★' : '☆';
            }
            return <span className="review-stars">{stars}</span>;
        }

        function ReviewCard({ review }) {
            // Format the date in a user-friendly way
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                return date.toLocaleDateString('vi-VN', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric'
                });
            };
            
            return (
                <div className="review-card">
                    <div className="review-header">
                        <img 
                            src={review.avatar_url || ""} 
                            alt="Avatar" 
                            className="review-avatar" 
                        />
                        <span className="review-username">{review.user_id || 'Người dùng ẩn danh'}</span>
                        <span className="review-time">{formatDate(review.created_at)}</span>
                    </div>
                    
                    <div className="review-details">
                        {renderStars(review.score)}
                        <Link to={review.storyUrl} className="review-story-link">
                            <img 
                                src={review.coverUrl || "https://via.placeholder.com/30x45"} 
                                alt="Cover" 
                                className="review-story-cover" 
                            />
                            <span className="review-story-title">{review.storyTitle}</span>
                        </Link>
                    </div>
                    
                    {review.review && (
                        <div className="review-content">
                            <p>{review.review}</p>
                        </div>
                    )}
                </div>
            );
        }

        export default ReviewCard;