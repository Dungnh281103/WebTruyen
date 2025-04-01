import React from 'react';
import './ReviewSection.scss';

function ReviewSection() {
  // Giả định dữ liệu đánh giá từ API
  const reviews = [
    { id: 1, user: 'User1', rating: 4, comment: 'Truyện hay, cốt truyện hấp dẫn!' },
    { id: 2, user: 'User2', rating: 5, comment: 'Tuyệt vời, đáng đọc!' },
    // Thêm các đánh giá khác
  ];

  return (
    <div className="review-section">
      <h2>Đánh Giá</h2>
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <span className="user">{review.user}</span>
            <span className="rating">Rating: {review.rating}</span>
          </div>
          <p className="comment">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default ReviewSection;