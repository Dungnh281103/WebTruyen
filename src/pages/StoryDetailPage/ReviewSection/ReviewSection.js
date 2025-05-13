// src/components/ReviewSection.jsx
import React from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";

export default function ReviewSection({
  reviews,
  rating,
  onRatingChange,
  comment,
  onCommentChange,
  isRatingOnly,
  onToggleRatingOnly,
  onSubmitReview,
  formatDate,
}) {
  return (
    <div className="reviews-container">
      <div className="comment-form">
        <h2>Chấm điểm nội dung truyện: {rating} điểm</h2>
        <div className="rating-slider">
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={rating}
            onChange={(e) => onRatingChange(parseFloat(e.target.value))}
          />
          <div className="rating-display">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={rating >= star ? "star-filled" : "star-empty"}
              />
            ))}
          </div>
        </div>

        <label className="rating-only-checkbox">
          <input
            type="checkbox"
            checked={isRatingOnly}
            onChange={onToggleRatingOnly}
          />
          Tôi chỉ muốn chấm điểm (không viết đánh giá)
        </label>

        {!isRatingOnly && (
          <>
            <textarea
              placeholder="Nội dung bài đánh giá (ít nhất 100 từ)..."
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
            />
          </>
        )}

        <button
          className="submit-review-btn"
          onClick={onSubmitReview}
          disabled={!isRatingOnly && comment.length < 50}
        >
          GỬI ĐÁNH GIÁ
        </button>
      </div>

      {reviews.length > 0 ? (
        <div className="review-list">
          {reviews.map((r) => (
            <div key={r.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  {r.user_avatar ? (
                    <img src={r.user_avatar} className="user-avatar" />
                  ) : (
                    <FaUserCircle className="default-avatar" />
                  )}
                  <div className="user-details">
                    <span className="username">{r.username}</span>
                    <span className="review-date">
                      {formatDate(r.created_at)}
                    </span>
                  </div>
                </div>
                <div className="review-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={
                        r.rating >= star ? "star-filled" : "star-empty"
                      }
                    />
                  ))}
                  <span className="rating-value">{r.rating}/5</span>
                </div>
              </div>
              {r.content && !r.is_rating_only && (
                <div className="review-content">
                  <p>{r.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Chưa có đánh giá nào cho truyện này.</p>
          <p>Hãy là người đầu tiên đánh giá!</p>
        </div>
      )}
    </div>
  );
}
