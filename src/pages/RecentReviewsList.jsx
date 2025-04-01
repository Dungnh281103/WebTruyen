// RecentReviewsList.jsx
import React from 'react';
import ReviewCard from './ReviewCard/ReviewCard';

function RecentReviewsList({ reviews }) {
   return (
     <div className="recent-reviews-list">
       {reviews.map(review => (
         <ReviewCard key={review.id} review={review} />
       ))}
     </div>
   );
}
export default RecentReviewsList;