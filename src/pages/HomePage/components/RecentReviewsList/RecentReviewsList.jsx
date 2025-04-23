import React, { useState, useEffect } from 'react';
import ReviewCard from '../../../ReviewCard/ReviewCard';
// Import icon phù hợp cho đánh giá
import './RecentReviewsList.scss';

function RecentReviewsList({ maxReviews = 4 }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/data/stories.json');
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu đánh giá');
        }
        
        const data = await response.json();
        
        // Extract ratings from the JSON data
        let allReviews = data.ratings || [];
        
        // Sort by most recent first
        allReviews = allReviews.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        // Limit to maxReviews
        allReviews = allReviews.slice(0, maxReviews);
        
        // Get story information for each review
        const reviewsWithStoryInfo = allReviews.map(review => {
          const story = data.storys.find(s => s.id === review.story_id);
          return {
            ...review,
            storyTitle: story ? story.title : 'Unknown Story',
            storyUrl: `/story/${review.story_id}`,
            coverUrl: story ? story.cover_url : null,
            // Adjust field name to match ReviewCard component
            user_id: review.user_name || review.user_id,
            review: review.review,
            score: review.score
          };
        });
        
        setReviews(reviewsWithStoryInfo);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Không thể tải đánh giá. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [maxReviews]);

  if (isLoading) {
    return (
      <div className="recent-reviews-loading text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải đánh giá...</span>
        </div>  
        <p className="mt-2">Đang tải đánh giá...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="alert alert-info">
        Chưa có đánh giá nào.
      </div>
    );
  }

  return (
    <div className="recent-reviews-container">
      
      
      <div className="recent-reviews-list">
        {reviews.map(review => (
          <div className="review-item" key={review.id}>
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentReviewsList;