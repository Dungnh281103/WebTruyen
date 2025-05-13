// src/components/DiscussionSection.jsx
import React from "react";
import { FaUserCircle } from "react-icons/fa";

export default function DiscussionSection({
  comments,
  newComment,
  onNewCommentChange,
  onSubmitComment,
  formatDate,
  chapters,
  selectedChapterId,
  onChapterChange,
}) {
  return (
    <div className="comments-container">
      <div className="comment-input">
        {/* Dropdown for chapter selection */}
        <div className="chapter-select-container">
          <select
            className="chapter-selector"
            value={selectedChapterId || ""}
            onChange={(e) =>
              onChapterChange(e.target.value ? e.target.value : null)
            }
          >
            <option value="">Tất cả chương</option>
            {chapters &&
              chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  Chương {chapter.number}: {chapter.title}
                </option>
              ))}
          </select>
        </div>

        <textarea
          value={newComment}
          onChange={(e) => onNewCommentChange(e.target.value)}
          placeholder={
            selectedChapterId
              ? `Bình luận về chương ${
                  chapters?.find((c) => c.id === selectedChapterId)?.number ||
                  ""
                }...`
              : "Viết bình luận cho truyện..."
          }
        />
        <button
          className="comment-submit-btn"
          onClick={onSubmitComment}
          disabled={!newComment.trim()}
        >
          Gửi
        </button>
      </div>

      {comments.length > 0 ? (
        <div className="comment-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-header">
                <div className="commenter-info">
                  {c.user_avatar ? (
                    <img
                      src={c.user_avatar}
                      className="user-avatar"
                      alt={c.username}
                    />
                  ) : (
                    <FaUserCircle className="default-avatar" />
                  )}
                  <div className="user-details">
                    <span className="username">{c.username}</span>
                    <span className="comment-date">
                      {formatDate(c.created_at)}
                    </span>
                    {c.chapter_id && c.chapter_title && (
                      <span className="chapter-badge">
                        Chương:{" "}
                        {chapters?.find((ch) => ch.id === c.chapter_id)
                          ?.number || ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="comment-text">{c.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>
            {selectedChapterId
              ? `Chưa có bình luận nào cho chương ${
                  chapters?.find((c) => c.id === selectedChapterId)?.number ||
                  ""
                }.`
              : "Chưa có bình luận nào cho truyện này."}
          </p>
          <p>Hãy là người đầu tiên bình luận!</p>
        </div>
      )}
    </div>
  );
}
