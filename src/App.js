import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import StoryListPage from './pages/StoryListPage/StoryListPage';
import StoryDetailPage from './pages/StoryDetailPage/StoryDetailPage';
import ChapterReaderPage from './pages/ChapterReaderPage/ChapterReaderPage';
import RecommendedStoriesPage from './pages/RecommendedStoriesPage/RecommendedStoriesPage';
import FilterStoriesPage from './pages/FilterStoriesPage/FilterStoriesPage';
import NewlyUpdatedStoriesPage from './pages/NewlyUpdatedStoriesPage/NewlyUpdatedStoriesPage';

function App() {
  return (
    
    <Router>
      {/* Có thể đặt Header/Footer chung ở đây nếu muốn chúng hiển thị trên mọi trang */}
      {/* <Header /> */}
      
      <Routes>
        <Route path="/" element={<HomePage/>} />
        {/* Định nghĩa các Route khác ở đây */}
        {/* Ví dụ:
        <Route path="/truyen/:storySlug" element={<StoryDetailPage />} />
        <Route path="/truyen/:storySlug/:chapterSlug" element={<ChapterPage />} />
        <Route path="/lich-su-doc" element={<ReadingHistoryPage />} />
        */}
         {/* Route mặc định nếu không khớp */}
         <Route path="/story/:storyId" element={<StoryDetailPage />} />
         <Route path="/story/:storyId/chapter/:chapterId" element={<ChapterReaderPage />} />
         <Route path="/danh-sach-truyen" element={<StoryListPage />} />
         <Route path="/de-cu" element={<RecommendedStoriesPage />} />
         <Route path="/filter" element={<FilterStoriesPage />} />
         <Route path="/truyen-moi" element={<NewlyUpdatedStoriesPage />} />
        <Route path="*" element={<div>Trang không tồn tại (404 Not Found)</div>} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
