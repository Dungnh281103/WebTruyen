import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Link, Routes, Route } from 'react-router-dom';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import DetailedStoryItem from "./components/DetailedStoryItem/DetailedStoryItem"; // Import component mới cho Đề cử

import RecentlyReadList from "../RecentlyReadList";
import NewlyUpdatedList from "../NewlyUpdatedList";
import RecentReviewsList from "./components/RecentReviewsList/RecentReviewsList";
// import StoryGrid from '../components/StoryGrid/StoryGrid';
import StoryCard from "../../components/StoryCard"; // Vẫn dùng cho Hot, Hoàn thành
import CompletedStory from "./components/CompletedStory/CompletedStory";
import HotStory from "./components/HotStory/HotStory";
import "./HomePage.scss"; // Import file CSS chung
import { isLoggedIn, fetchUserData } from "../../utils/dataService";
import { fetchRecommendedStories } from "../../apis/storyServices";
import { fetchHotStories } from "../../apis/storyServices"; // Import hàm lấy truyện hot
import { fetchLatestChapters } from "../../apis/storyServices"; // Import hàm lấy truyện mới cập nhật
import { fetchCompletedStories } from "../../apis/storyServices";
// import StoryDetailPage from '../components/StoryDetailPage/StoryDetailPage';

const fetchHomePageData = async () => {
  try {
    const recommendedStories = await fetchRecommendedStories();
    const latestChapters = await fetchLatestChapters(10); // Lấy 10 chương mới nhất
    const hotStories = await fetchHotStories(5); // Lấy 5 truyện hot nhất
    const completedStories = await fetchCompletedStories(); // Lấy truyện đã hoàn thành
    const response = await fetch("/data/stories.json");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();

    const loggedIn = isLoggedIn();
    let userData = null;

    if (loggedIn) {
      userData = await fetchUserData();
    }

    return {
      recentlyRead: getSavedRecentlyRead(), // Get from localStorage
      newlyUpdated: getNewlyUpdated(data.storys), // Process from stories.json
      latestChapters: latestChapters, // Newest chapters
      hotStories: hotStories, // Sort by views
      recommendedStories: recommendedStories,
      completedStories: completedStories, // Completed stories
      // recentReviews: data.reviews || [], // If reviews are in the JSON
      isUserLoggedIn: !!userData,
      userData: userData, // Function to check login status
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return empty data on error
    return {
      recentlyRead: [],
      newlyUpdated: [],
      hotStories: [],
      recommendedStories: [],
      completedStories: [],
      latestChapters: [],
      // recentReviews: [],
      isUserLoggedIn: false,
    };
  }
};

// Helper functions
const getNewlyUpdated = (stories) => {
  return stories
    .sort(
      (a, b) =>
        new Date(b.last_chapter_update) - new Date(a.last_chapter_update)
    )
    .slice(0, 10);
};

const getHotStories = (stories) => {
  return stories
    .sort((a, b) => (b.total_views || 0) - (a.total_views || 0))
    .slice(0, 5);
};

const getSavedRecentlyRead = () => {
  try {
    const saved = localStorage.getItem("readingHistory");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const checkUserLoggedIn = () => {
  return localStorage.getItem("userToken") !== null;
};

// Tách riêng phần nội dung để dùng hook bên trong Router context
function HomePageContent() {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchHomePageData(); // Gọi API thật ở đây
        setHomeData(data);
      } catch (err) {
        setError("Không thể tải dữ liệu trang chủ. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <div className="loading-indicator">Đang tải trang chủ...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!homeData) {
    return <div className="loading-indicator">Không có dữ liệu.</div>;
  }

  const {
    recentlyRead,
    newlyUpdated,
    hotStories,
    recommendedStories,
    completedStories,
    latestChapters,
    // recentReviews,
    isUserLoggedIn,
  } = homeData;

  return (
    <div className="home-page">
      <Header />

      {/* --- Banner --- */}
      <div className="banner-placeholder">
        <img
          src="https://static.cdnno.com/storage/topbox/f0e089d0cfb572cec383725c5572f854.webp"
          alt="Banner"
        />
      </div>

      {/* --- Truyện Vừa Đọc --- */}
      {isUserLoggedIn && recentlyRead && recentlyRead.length > 0 && (
        <section className="section section--recently-read">
          <SectionTitle title=" Truyện Vừa Đọc" viewAllLink="/lich-su-doc" />
          <RecentlyReadList items={recentlyRead} />
        </section>
      )}

      {/* --- Truyện Đề Cử (LAYOUT MỚI) --- */}
      {recommendedStories && recommendedStories.length > 0 && (
        <section className="section section--recommended-stories">
          <SectionTitle title=" Truyện Đề Cử" viewAllLink="/de-cu" />
          <div className="recommended-stories-grid">
            {recommendedStories.slice(0, 6).map((story) => (
              <DetailedStoryItem key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}

      <div className="banner-placeholder">
        <img
          src="https://static.cdnno.com/storage/topbox/d1aba67b1aabe385d2857ce5080ad93f.webp"
          alt="Banner"
        />
      </div>

      {/* --- Truyện Hot --- */}
      {hotStories && hotStories.length > 0 && (
        <section className="section section--hot-stories">
          <SectionTitle title=" Truyện Hot" viewAllLink="/xep-hang/hot" />
          <div className="hot-stories-grid">
            {hotStories.map((story) => (
              <div
                key={story.id}
                onClick={() => navigate(`/story/${story.id}`)}
              >
                <StoryCard key={story.id} story={story} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* <HotStory /> */}

      {latestChapters && latestChapters.length > 0 && (
        <section className="section section--newly-updated-api">
          <SectionTitle title=" Chương Mới Nhất" viewAllLink="/truyen-moi" />
          <NewlyUpdatedList items={latestChapters} />
        </section>
      )}

      {/* --- Truyện Mới Cập Nhật --- */}
      {/* {newlyUpdated && newlyUpdated.length > 0 && (
        <section className="section section--newly-updated">
          <SectionTitle
            title=" Truyện Mới Cập Nhật"
            viewAllLink="/truyen-moi"
          />
          <NewlyUpdatedList items={newlyUpdated} />
        </section>
      )} */}

      <div className="banner-placeholder">
        <img
          src="https://static.cdnno.com/storage/topbox/d246998f2320b39a1044b3c2853f116c.webp"
          alt="Banner"
        />
      </div>

      {/* --- Truyện Đã Hoàn Thành --- */}
      {completedStories && completedStories.length > 0 && (
        <section className="section section--completed-stories">
          <CompletedStory stories={completedStories} />
        </section>
      )}

      {/* --- Đánh Giá Mới --- */}
      {/* <section className="section section--recent-reviews">
        <SectionTitle title=" Đánh Giá Mới" viewAllLink="/danh-gia" />
        <RecentReviewsList maxReviews={5} />
      </section> */}

      <Footer />
    </div>
  );
}

function HomePage() {
  return <HomePageContent />;
}

export default HomePage;
