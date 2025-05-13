// src/components/CommentSection.jsx
import React, { useState, useEffect } from "react";
import ReviewSection from "../ReviewSection/ReviewSection";
import DiscussionSection from "../DiscussionSection/DiscussionSection";
import { fetchRatings } from "../../../apis/storyServices";
import { postRating } from "../../../apis/storyServices";
import { fetchComments } from "../../../apis/storyServices";
import { postComment } from "../../../apis/storyServices";
import { fetchAllChapter } from "../../../apis/chapterServices";
import "./CommentSection.scss";

export default function CommentSection({ storyId }) {
  // State for chapters
  const [chapters, setChapters] = useState([]);
  // Tab hiện tại: 'review' hoặc 'comment'
  const [activeTab, setActiveTab] = useState("review");

  // State cho ReviewSection
  const [reviews, setReviews] = useState([]);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isRatingOnly, setIsRatingOnly] = useState(false);

  // State cho DiscussionSection
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState(null);

  // Loading & error
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Format ngày giờ
  const formatDate = (isoString) =>
    new Date(isoString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Format time ago function (copy from your StoryDetail component or simple implementation)
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ngày trước`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} tháng trước`;

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} năm trước`;
  };

  // Tải dữ liệu khi mount hoặc storyId thay đổi
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        // 1. Fetch ratings từ API
        const apiReviews = await fetchRatings(storyId);
        const mappedReviews = apiReviews.map((r) => ({
          id: r.id,
          username: r.userName,
          user_avatar: null,
          rating: r.score,
          content: r.review,
          created_at: r.createdAt,
          is_rating_only: false,
        }));
        setReviews(mappedReviews);

        // 2. Fetch chapters từ API
        try {
          const chaptersData = await fetchAllChapter(storyId);

          // Map và sắp xếp chapters
          if (chaptersData && Array.isArray(chaptersData)) {
            const sortedChapters = chaptersData
              .sort((a, b) => a.chapterNumber - b.chapterNumber)
              .map((chapter) => ({
                id: chapter.id,
                number: chapter.chapterNumber,
                title: chapter.title.replace(/^Chương \d+:\s*/, ""), // Xóa tiền tố "Chương X: " nếu có
                createdAt: chapter.createdAt,
                views: chapter.views,
                timeAgo: formatTimeAgo
                  ? formatTimeAgo(new Date(chapter.createdAt))
                  : new Date(chapter.createdAt).toLocaleDateString(),
              }));
            setChapters(sortedChapters);
          } else {
            console.error("Invalid chapters data returned:", chaptersData);
            setChapters([]);
          }
        } catch (chapterError) {
          console.error("Error fetching chapters:", chapterError);
          setChapters([]);
        }

        // 3. Fetch comments từ API cho tất cả hoặc chapter cụ thể
        await loadComments();
      } catch (err) {
        console.error(err);
        setErrorMsg("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [storyId]);

  // Tải comments dựa trên chapter đã chọn
  const loadComments = async () => {
    try {
      const apiComments = await fetchComments(storyId, selectedChapterId);
      const mappedComments = apiComments.map((c) => ({
        id: c.id,
        username: c.userName,
        user_avatar: null,
        content: c.content,
        created_at: c.createdAt,
        chapter_id: c.chapterId,
        chapter_title: c.chapterTitle, // Nếu API trả về title của chapter
      }));
      setComments(mappedComments);
    } catch (err) {
      console.error("Error loading comments:", err);
      setErrorMsg("Không thể tải bình luận. Vui lòng thử lại.");
    }
  };

  // Tải lại comments khi chapter được chọn thay đổi
  useEffect(() => {
    if (activeTab === "comment") {
      loadComments();
    }
  }, [selectedChapterId, activeTab]);

  // Thao tác gửi đánh giá mới
  const handleSubmitReview = async () => {
    if (!isRatingOnly && reviewText.trim().length < 100) {
      alert('Bài đánh giá cần ít nhất 50 từ hoặc tick "chỉ chấm điểm".');
      return;
    }
    try {
      // 1) Gọi API lưu rating
      const saved = await postRating(
        storyId,
        ratingValue,
        isRatingOnly ? "" : reviewText
      );

      // 2) Map response và thêm vào state để hiển thị ngay
      const newRev = {
        id: saved.id,
        username: saved.userName,
        user_avatar: null,
        rating: saved.score,
        content: saved.review,
        created_at: saved.createdAt,
        is_rating_only: false,
      };
      setReviews([newRev, ...reviews]);

      // 3) Reset form
      setRatingValue(0);
      setReviewText("");
      setIsRatingOnly(false);
    } catch (err) {
      console.error(err);
      alert("Gửi đánh giá thất bại. Vui lòng thử lại.");
    }
  };

  // Thao tác gửi bình luận mới
  const handleSubmitComment = async () => {
    const text = newCommentText.trim();
    if (!text) return;

    try {
      // 1) Gọi API POST comment với chapterId nếu có
      const saved = await postComment(
        storyId,
        text,
        selectedChapterId, // Truyền chapterId được chọn
        null // parentCommentId nếu là reply
      );

      // 2) Map response thành object phù hợp DiscussionSection
      const newCmt = {
        id: saved.id,
        username: saved.userName,
        user_avatar: null,
        content: saved.content,
        created_at: saved.createdAt,
        chapter_id: saved.chapterId,
        chapter_title: saved.chapterTitle,
      };

      // 3) Đẩy comment mới lên đầu danh sách
      setComments([newCmt, ...comments]);
      setNewCommentText("");
    } catch (err) {
      console.error(err);
      alert("Gửi bình luận thất bại. Vui lòng thử lại.");
    }
  };

  // Xử lý thay đổi chapter đã chọn
  const handleChapterChange = (chapterId) => {
    setSelectedChapterId(chapterId);
  };

  if (isLoading) {
    return <div className="loading-message">Đang tải...</div>;
  }
  if (errorMsg) {
    return <div className="error-message">{errorMsg}</div>;
  }

  return (
    <div className="comment-section">
      <div className="comment-tabs">
        <button
          className={activeTab === "review" ? "active" : ""}
          onClick={() => setActiveTab("review")}
        >
          Đánh giá ({reviews.length})
        </button>
        <button
          className={activeTab === "comment" ? "active" : ""}
          onClick={() => setActiveTab("comment")}
        >
          Thảo luận ({comments.length})
        </button>
      </div>

      {activeTab === "review" ? (
        <ReviewSection
          reviews={reviews}
          rating={ratingValue}
          onRatingChange={setRatingValue}
          comment={reviewText}
          onCommentChange={setReviewText}
          isRatingOnly={isRatingOnly}
          onToggleRatingOnly={() => setIsRatingOnly((v) => !v)}
          onSubmitReview={handleSubmitReview}
          formatDate={formatDate}
        />
      ) : (
        <DiscussionSection
          comments={comments}
          newComment={newCommentText}
          onNewCommentChange={setNewCommentText}
          onSubmitComment={handleSubmitComment}
          formatDate={formatDate}
          chapters={chapters}
          selectedChapterId={selectedChapterId}
          onChapterChange={handleChapterChange}
        />
      )}
    </div>
  );
}
