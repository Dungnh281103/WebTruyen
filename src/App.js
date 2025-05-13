import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import StoryListPage from "./pages/StoryListPage/StoryListPage";
import StoryDetailPage from "./pages/StoryDetailPage/StoryDetailPage";
import ChapterReaderPage from "./pages/ChapterReaderPage/ChapterReaderPage";
import RecommendedStoriesPage from "./pages/RecommendedStoriesPage/RecommendedStoriesPage";
import FilterStoriesPage from "./pages/FilterStoriesPage/FilterStoriesPage";
import NewlyUpdatedStoriesPage from "./pages/NewlyUpdatedStoriesPage/NewlyUpdatedStoriesPage";
import TagStoriesPage from "./pages/TagStoriesPage/TagStoriesPage";
import MyBookshelfPage from "./pages/MyBookshelfPage/MyBookshelfPage";
import AccountSettingsPage from "./pages/AccountSettingsPage/AccountSettingsPage";
import AdminScreen from "./Admin/admin";
import Layout from "./layouts";
import AdminLayout from "./layouts/AdminLayout";
import StoryAdmin from "./Admin/storyAdmin";
import DangTruyenPage from "./pages/AddStory/DangTruyenPage";

function App() {
  return (
    <Router>
      {/* Có thể đặt Header/Footer chung ở đây nếu muốn chúng hiển thị trên mọi trang */}
      {/* <Header /> */}

      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        {/* Định nghĩa các Route khác ở đây */}
        {/* Ví dụ:
        <Route path="/truyen/:storySlug" element={<StoryDetailPage />} />
        <Route path="/truyen/:storySlug/:chapterSlug" element={<ChapterPage />} />
        <Route path="/lich-su-doc" element={<ReadingHistoryPage />} />
        */}
        {/* Route mặc định nếu không khớp */}
        <Route
          path="/story/:storyId"
          element={
            <Layout>
              <StoryDetailPage />
            </Layout>
          }
        />
        <Route
          path="/story/:storyId/chapter/:chapterId"
          element={<ChapterReaderPage />}
        />
        <Route
          path="/danh-sach-truyen"
          element={
            <Layout>
              <StoryListPage />
            </Layout>
          }
        />
        <Route
          path="/de-cu"
          element={
            <Layout>
              <RecommendedStoriesPage />
            </Layout>
          }
        />
        <Route
          path="/filter"
          element={
            <Layout>
              <FilterStoriesPage />
            </Layout>
          }
        />
        <Route
          path="/truyen-moi"
          element={
            <Layout>
              <NewlyUpdatedStoriesPage />
            </Layout>
          }
        />
        <Route
          path="/tag/:tagName"
          element={
            <Layout>
              <TagStoriesPage />
            </Layout>
          }
        />
        <Route
          path="/tu-truyen"
          element={
            <Layout>
              <MyBookshelfPage />
            </Layout>
          }
        />
        <Route
          path="/tai-khoan"
          element={
            <Layout>
              <AccountSettingsPage />
            </Layout>
          }
        />
        <Route path="/dang-truyen" element={<DangTruyenPage />} />

        {/*  admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminScreen />} />
          <Route path="story" element={<StoryAdmin />} />
          {/* <Route path="users" element={UsersPage} /> */}
          <Route path="stats" element={<div>Thống kê</div>} />
          <Route path="settings" element={<div>Cài đặt hệ thống</div>} />
        </Route>

        <Route
          path="*"
          element={<div>Trang không tồn tại (404 Not Found)</div>}
        />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
