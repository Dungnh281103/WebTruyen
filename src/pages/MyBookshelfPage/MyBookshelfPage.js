import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Pagination from "../../components/Pagination/Pagination";
import { useAuth } from "../../apis/authContext";
import { API_URL } from "../../constants/apis.js";
import { fetchSavedStory } from "../../apis/savedService";
import "./MyBookshelfPage.scss";

function MyBookshelfPage() {
  const { isAuthenticated, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("saved");
  const [readingHistory, setReadingHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [savedStories, setSavedStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination for bookmarks and saved stories
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch saved stories
      const savedStoriesData = await fetchSavedStory();
      setSavedStories(savedStoriesData);

      // Initialize with empty data for now
      setReadingHistory([]);
      setBookmarks([]);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromHistory = async (storyId) => {
    try {
      // Placeholder for now
      setReadingHistory((prevHistory) =>
        prevHistory.filter((item) => item.storyId !== storyId)
      );
      alert("Chức năng xóa lịch sử đọc truyện đang được phát triển.");
    } catch (err) {
      console.error("Error removing from history:", err);
      alert("Không thể xóa truyện khỏi lịch sử. Vui lòng thử lại sau.");
    }
  };

  const handleRemoveBookmark = async (storyId) => {
    try {
      // Placeholder for now
      setBookmarks((prevBookmarks) =>
        prevBookmarks.filter((item) => item.storyId !== storyId)
      );
      alert("Chức năng xóa đánh dấu đang được phát triển.");
    } catch (err) {
      console.error("Error removing bookmark:", err);
      alert("Không thể xóa đánh dấu. Vui lòng thử lại sau.");
    }
  };

  const handleRemoveSavedStory = async (storyId) => {
    try {
      // Placeholder implementation
      const response = await fetch(`${API_URL}api/SavedStory/${storyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove saved story");
      }

      setSavedStories((prevSavedStories) =>
        prevSavedStories.filter((item) => item.storyId !== storyId)
      );
    } catch (err) {
      console.error("Error removing saved story:", err);
      alert("Không thể xóa truyện đã lưu. Vui lòng thử lại sau.");
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "vừa xong";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  };

  // Get current items for pagination based on active tab
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    if (activeTab === "bookmarks") {
      return bookmarks.slice(indexOfFirstItem, indexOfLastItem);
    } else if (activeTab === "saved") {
      return savedStories.slice(indexOfFirstItem, indexOfLastItem);
    }

    return [];
  };

  // Get total items count based on active tab
  const getTotalItems = () => {
    if (activeTab === "bookmarks") {
      return bookmarks.length;
    } else if (activeTab === "saved") {
      return savedStories.length;
    }
    return 0;
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset pagination when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="not-authenticated-message">
          <h2>Bạn cần đăng nhập để xem tủ truyện cá nhân</h2>
          <p>Vui lòng đăng nhập hoặc đăng ký để sử dụng tính năng này.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div>
      <Header />
      <div className="bookshelf-page">
        <div className="container">
          <h1 className="page-title">Tủ truyện của tôi</h1>

          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === "saved" ? "active" : ""}`}
              onClick={() => setActiveTab("saved")}
            >
              Đánh dấu
            </button>
            <button
              className={`tab-btn ${activeTab === "reading" ? "active" : ""}`}
              onClick={() => setActiveTab("reading")}
            >
              Đang đọc
            </button>
            {/* <button
              className={`tab-btn ${activeTab === "bookmarks" ? "active" : ""}`}
              onClick={() => setActiveTab("bookmarks")}
            >
              Đánh dấu
            </button> */}
          </div>

          {isLoading ? (
            <div className="loading-spinner">Đang tải...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="tab-content">
              {activeTab === "reading" && (
                <div className="reading-history-section">
                  {readingHistory.length > 0 ? (
                    <div className="reading-list">
                      {readingHistory.map((item) => (
                        <div className="reading-item" key={item.storyId}>
                          <Link
                            to={`/story/${item.storyId}`}
                            className="story-info"
                          >
                            <h3 className="story-title">{item.title}</h3>
                            <div className="reading-progress">
                              <span className="progress-text">
                                Đã đọc: {item.chaptersRead}/{item.totalChapters}
                              </span>
                              <span className="read-time">
                                {formatTimeAgo(item.lastReadTime)}
                              </span>
                            </div>
                          </Link>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleRemoveFromHistory(item.storyId)
                            }
                            title="Xóa khỏi lịch sử"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-message">
                      <p>Bạn chưa đọc truyện nào.</p>
                      <p className="note">Tính năng đang được phát triển.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "bookmarks" && (
                <div className="bookmarks-section">
                  {bookmarks.length > 0 ? (
                    <>
                      <div className="bookmarks-list">
                        {getCurrentItems().map((item) => (
                          <div className="bookmark-item" key={item.storyId}>
                            <Link
                              to={`/story/${item.storyId}`}
                              className="story-info"
                            >
                              <h3 className="story-title">{item.title}</h3>
                              <div className="bookmark-meta">
                                <span className="newest-chapter">
                                  Mới: Chương {item.newestChapter}
                                </span>
                                <span className="bookmark-time">
                                  {new Date(item.bookmarkTime).toLocaleString(
                                    "vi-VN"
                                  )}
                                </span>
                              </div>
                            </Link>
                            <button
                              className="delete-btn"
                              onClick={() => handleRemoveBookmark(item.storyId)}
                              title="Xóa đánh dấu"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>

                      <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={getTotalItems()}
                        currentPage={currentPage}
                        paginate={paginate}
                      />
                    </>
                  ) : (
                    <div className="empty-message">
                      <p>Bạn chưa đánh dấu truyện nào.</p>
                      <p className="note">Tính năng đang được phát triển.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "saved" && (
                <div className="saved-stories-section">
                  {savedStories.length > 0 ? (
                    <>
                      <div className="saved-stories-list">
                        {getCurrentItems().map((item) => (
                          <div className="saved-story-item" key={item.id}>
                            <Link
                              to={`/story/${item.storyId}`}
                              className="story-info"
                            >
                              <h3 className="story-title">{item.title}</h3>
                              <div className="saved-story-meta">
                                <span className="author">
                                  Tác giả: {item.author}
                                </span>
                                <span className="saved-time">
                                  {formatTimeAgo(item.savedAt)}
                                </span>
                              </div>
                            </Link>
                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleRemoveSavedStory(item.storyId)
                              }
                              title="Xóa khỏi danh sách đã lưu"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>

                      <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={getTotalItems()}
                        currentPage={currentPage}
                        paginate={paginate}
                      />
                    </>
                  ) : (
                    <div className="empty-message">
                      <p>Bạn chưa lưu truyện nào.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyBookshelfPage;
