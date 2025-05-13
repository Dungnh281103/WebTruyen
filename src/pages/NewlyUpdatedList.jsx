import React from "react";
import { useNavigate } from "react-router-dom";
import "./NewlyUpdatedList.scss";
import NewlyUpdatedItem from "./NewlyUpdatedItem/NewlyUpdatedItem";

function NewlyUpdatedList({ items }) {
  const navigate = useNavigate();

  // Process items to ensure they have correct structure
  const processedItems = items.map((item) => ({
    id: item.storyId || item.id,
    title: item.storyTitle || item.title,
    author: item.authorName || item.author,
    genre: item.categoryName || item.categories?.[0] || item.genre || "Khác",
    storyUrl: `/story/${item.storyId || item.id}`,
    latestChapter:
      item.chapterTitle || item.latest_chapter.title || "Chương mới nhất",
    timeAgo: formatTimeAgo(item.createdAt || new Date()),
  }));

  // Helper function to format timestamps as "time ago"
  function formatTimeAgo(timestamp) {
    if (!timestamp) return "Vừa cập nhật";

    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffMs = now - updateTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} ngày trước`;
    if (diffHours > 0) return `${diffHours} giờ trước`;
    if (diffMins > 0) return `${diffMins} phút trước`;
    return "Vừa cập nhật";
  }

  return (
    <div className="newly-updated-list">
      {processedItems.map((item) => (
        <div
          key={item.id}
          onClick={() => navigate(item.storyUrl)}
          className="newly-updated-wrapper"
        >
          <NewlyUpdatedItem item={item} />
        </div>
      ))}
    </div>
  );
}

export default NewlyUpdatedList;
