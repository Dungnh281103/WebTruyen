import React, { useState } from 'react';
import './CommentSection.scss';

function CommentSection() {
    const [activeTab, setActiveTab] = useState('review'); // 'review' hoặc 'comment'
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([
        // Dữ liệu ban đầu (nếu có)
    ]);
    const [newComment, setNewComment] = useState('');

    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    const handleSubmitReview = () => {
        // Xử lý gửi đánh giá
        if (comment.trim()) {
            const newReview = { id: Date.now(), user: 'Bạn', rating, text: comment }; // Tạo object đánh giá mới
            setComments(prevComments => [...prevComments, newReview]); // Thêm đánh giá mới vào state
            setComment(''); // Xóa nội dung đánh giá sau khi gửi
            setActiveTab('comment'); // Chuyển sang tab "Thảo luận" (tùy chọn)
        }
        console.log({ rating, comment });
        // Ở đây bạn có thể thêm logic để gửi đánh giá đến API backend
        // Sau khi gửi, có thể cập nhật state để hiển thị thông báo thành công hoặc lỗi
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([...comments, { id: Date.now(), user: 'Bạn', text: newComment }]);
            setNewComment('');
        }
    };

    return (
        <div className="comment-section">
            <div className="comment-tabs">
                <button
                    className={activeTab === 'review' ? 'active' : ''}
                    onClick={() => setActiveTab('review')}
                >
                    Đánh giá
                </button>
                <button
                    className={activeTab === 'comment' ? 'active' : ''}
                    onClick={() => setActiveTab('comment')}
                >
                    Thảo luận
                </button>
            </div>

            {activeTab === 'review' && (
                <div className="comment-form">
                    <h2>Chấm điểm nội dung truyện: {rating} điểm</h2>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={rating}
                        onChange={handleRatingChange}
                    />
                    <label>
                        <input type="checkbox" />
                        Tôi chỉ muốn chấm điểm (không viết đánh giá)
                    </label>
                    <input type="text" placeholder="Nhân vật chính như nào? (nhiệt huyết, vì sĩ, thông minh?...)" />
                    <input type="text" placeholder="Cốt truyện như nào? (logic, sảng văn, bố cục nhiều lớp, quay xe liên tục?...)" />
                    <input type="text" placeholder="Bố cục thế giới như nào? (lớn hay nhỏ, một thế giới, nhiều thế giới, nhiều tầng?...)" />
                    <textarea
                        placeholder="Nội dung bài đánh giá (ít nhất 100 từ)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button onClick={handleSubmitReview}>GỬI ĐÁNH GIÁ</button>
                    <div className="comment-notice">
                        <p>- Từ phiên bản mới, các bài đánh giá có nội dung sẽ được các BTV duyệt đọc trước khi được hiển thị.</p>
                        <p>- Nếu bạn chỉ muốn chấm điểm cho truyện, không muốn viết đánh giá, hãy tích vào "Tôi chỉ muốn chấm điểm".</p>
                        <p>- Vui lòng đọc kỹ Điều khoản dịch vụ và Hướng dẫn sử dụng trước khi viết đánh giá.</p>
                        <p>- Các đánh giá trước ở phiên bản cũ có nội dung quá ngắn và không có tương tác mặc định sẽ không được hiển thị, bạn có thể xem nó bằng cách tích vào "Hiện tất cả đánh giá".</p>
                    </div>
                </div>
            )}

            {activeTab === 'comment' && (
                <div className="comment-list">
                    <h2>Thảo luận</h2>
                    <div className="comment-input">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Viết bình luận..."
                        />
                        <button onClick={handleAddComment}>Gửi</button>
                    </div>
                    {comments.map((commentItem) => (
                        <div key={commentItem.id} className="comment-item">
                            <div className="comment-header">
                                <span className="user">{commentItem.user}</span>
                            </div>
                            <p className="comment-text">{commentItem.text || commentItem.comment}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="comment-controls">
                <button>Liên quan</button>
                <span>{comments.length} thảo luận</span>
                <button>Gửi</button>
            </div>
        </div>
    );
}

export default CommentSection;