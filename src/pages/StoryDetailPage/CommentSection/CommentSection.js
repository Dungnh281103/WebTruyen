import React, { useState, useEffect } from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import './CommentSection.scss';

function CommentSection({ storyId }) {
    const [activeTab, setActiveTab] = useState('review');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRatingOnly, setIsRatingOnly] = useState(false);

    // Fetch comments and reviews from JSON data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch from stories.json
                const response = await fetch('/data/stories.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch comments data');
                }

                const data = await response.json();
                
                // Find story comments and reviews
                const storyData = data.storys?.find(s => s.id === storyId);
                
                if (storyData) {
                    // Get comments for this story
                    const storyComments = data.comments?.filter(c => c.story_id === storyId) || [];
                    setComments(storyComments);
                    
                    // Get reviews for this story
                    const storyReviews = data.reviews?.filter(r => r.story_id === storyId) || [];
                    setReviews(storyReviews);
                }
                
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching comments:', error);
                setError('Không thể tải bình luận và đánh giá. Vui lòng thử lại.');
                setIsLoading(false);
            }
        };

        fetchData();
    }, [storyId]);

    const handleRatingChange = (event) => {
        setRating(parseFloat(event.target.value));
    };

    const handleSubmitReview = () => {
        if (isRatingOnly || comment.trim().length >= 100) {
            const newReview = { 
                id: Date.now().toString(), 
                story_id: storyId,
                user_id: 'current_user',
                user_avatar: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).avatar_url : null,
                username: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).username : 'Khách',
                rating: rating,
                content: isRatingOnly ? '' : comment,
                created_at: new Date().toISOString(),
                is_rating_only: isRatingOnly
            };
            
            setReviews([newReview, ...reviews]);
            setComment('');
            setRating(0);
            
            // In a real app, you would send this to an API
            console.log('New review:', newReview);
        } else {
            alert('Bài đánh giá cần có ít nhất 100 từ hoặc chỉ chấm điểm.');
        }
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            const newCommentObj = {
                id: Date.now().toString(),
                story_id: storyId,
                user_id: 'current_user',
                user_avatar: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).avatar_url : null,
                username: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).username : 'Khách',
                content: newComment,
                created_at: new Date().toISOString(),
                likes: 0,
                replies: []
            };
            
            setComments([newCommentObj, ...comments]);
            setNewComment('');
            
            // In a real app, you would send this to an API
            console.log('New comment:', newCommentObj);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="comment-section loading">
                <div className="comment-tabs">
                    <button className={activeTab === 'review' ? 'active' : ''}>Đánh giá</button>
                    <button className={activeTab === 'comment' ? 'active' : ''}>Thảo luận</button>
                </div>
                <div className="loading-message">Đang tải bình luận...</div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="comment-section error">
                <div className="comment-tabs">
                    <button className={activeTab === 'review' ? 'active' : ''}>Đánh giá</button>
                    <button className={activeTab === 'comment' ? 'active' : ''}>Thảo luận</button>
                </div>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="comment-section">
            <div className="comment-tabs">
                <button
                    className={activeTab === 'review' ? 'active' : ''}
                    onClick={() => setActiveTab('review')}
                >
                    Đánh giá ({reviews.length})
                </button>
                <button
                    className={activeTab === 'comment' ? 'active' : ''}
                    onClick={() => setActiveTab('comment')}
                >
                    Thảo luận ({comments.length})
                </button>
            </div>

            {activeTab === 'review' && (
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
                                onChange={handleRatingChange}
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
                                onChange={() => setIsRatingOnly(!isRatingOnly)}
                            />
                            Tôi chỉ muốn chấm điểm (không viết đánh giá)
                        </label>
                        
                        {!isRatingOnly && (
                            <>
                                <input type="text" placeholder="Nhân vật chính như nào? (nhiệt huyết, vì sĩ, thông minh?...)" />
                                <input type="text" placeholder="Cốt truyện như nào? (logic, sảng văn, bố cục nhiều lớp, quay xe liên tục?...)" />
                                <input type="text" placeholder="Bố cục thế giới như nào? (lớn hay nhỏ, một thế giới, nhiều thế giới, nhiều tầng?...)" />
                                <textarea
                                    placeholder="Nội dung bài đánh giá (ít nhất 100 từ)..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </>
                        )}
                        
                        <button 
                            className="submit-review-btn"
                            onClick={handleSubmitReview}
                            disabled={!isRatingOnly && comment.length < 100}
                        >
                            GỬI ĐÁNH GIÁ
                        </button>
                        
                        <div className="comment-notice">
                            <p>- Từ phiên bản mới, các bài đánh giá có nội dung sẽ được duyệt đọc trước khi được hiển thị.</p>
                            <p>- Nếu bạn chỉ muốn chấm điểm cho truyện, hãy tích vào "Tôi chỉ muốn chấm điểm".</p>
                            <p>- Vui lòng đọc kỹ Điều khoản dịch vụ và Hướng dẫn sử dụng trước khi viết đánh giá.</p>
                        </div>
                    </div>

                    {reviews.length > 0 ? (
                        <div className="review-list">
                            {reviews.map((review) => (
                                <div key={review.id} className="review-item">
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            {review.user_avatar ? (
                                                <img 
                                                    src={review.user_avatar} 
                                                    alt={review.username || 'Người dùng'} 
                                                    className="user-avatar" 
                                                />
                                            ) : (
                                                <FaUserCircle className="default-avatar" />
                                            )}
                                            <div className="user-details">
                                                <span className="username">{review.username || 'Người dùng ẩn danh'}</span>
                                                <span className="review-date">{formatDate(review.created_at)}</span>
                                            </div>
                                        </div>
                                        <div className="review-rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar 
                                                    key={star} 
                                                    className={review.rating >= star ? "star-filled" : "star-empty"} 
                                                />
                                            ))}
                                            <span className="rating-value">{review.rating}/5</span>
                                        </div>
                                    </div>
                                    
                                    {review.content && !review.is_rating_only && (
                                        <div className="review-content">
                                            <p>{review.content}</p>
                                        </div>
                                    )}
                                    
                                    <div className="review-footer">
                                        <button className="like-button">Hữu ích</button>
                                    </div>
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
            )}

            {activeTab === 'comment' && (
                <div className="comments-container">
                    <div className="comment-input">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Viết bình luận..."
                        />
                        <button 
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="comment-submit-btn"
                        >
                            Gửi
                        </button>
                    </div>

                    {comments.length > 0 ? (
                        <div className="comment-list">
                            {comments.map((commentItem) => (
                                <div key={commentItem.id} className="comment-item">
                                    <div className="comment-header">
                                        <div className="commenter-info">
                                            {commentItem.user_avatar ? (
                                                <img 
                                                    src={commentItem.user_avatar} 
                                                    alt={commentItem.username || 'Người dùng'} 
                                                    className="user-avatar" 
                                                />
                                            ) : (
                                                <FaUserCircle className="default-avatar" />
                                            )}
                                            <div className="user-details">
                                                <span className="username">{commentItem.username || 'Người dùng ẩn danh'}</span>
                                                <span className="comment-date">{formatDate(commentItem.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="comment-text">{commentItem.content}</p>
                                    <div className="comment-actions">
                                        <button className="like-button">
                                            Thích ({commentItem.likes || 0})
                                        </button>
                                        <button className="reply-button">
                                            Trả lời
                                        </button>
                                    </div>
                                    
                                    {commentItem.replies && commentItem.replies.length > 0 && (
                                        <div className="comment-replies">
                                            {commentItem.replies.map(reply => (
                                                <div key={reply.id} className="reply-item">
                                                    <div className="reply-header">
                                                        <div className="replier-info">
                                                            {reply.user_avatar ? (
                                                                <img 
                                                                    src={reply.user_avatar} 
                                                                    alt={reply.username || 'Người dùng'} 
                                                                    className="user-avatar small" 
                                                                />
                                                            ) : (
                                                                <FaUserCircle className="default-avatar small" />
                                                            )}
                                                            <div className="user-details">
                                                                <span className="username">{reply.username || 'Người dùng ẩn danh'}</span>
                                                                <span className="reply-date">{formatDate(reply.created_at)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="reply-text">{reply.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>Chưa có bình luận nào cho truyện này.</p>
                            <p>Hãy là người đầu tiên bình luận!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CommentSection;