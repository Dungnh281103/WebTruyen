import React, { useState, useEffect } from 'react';
// import { Link, Routes, Route } from 'react-router-dom';
// Giả định các component này nằm trong thư mục components một cấp trên HomePage
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SectionTitle from '../../components/SectionTitle';
import DetailedStoryItem from './components/DetailedStoryItem/DetailedStoryItem'; // Import component mới cho Đề cử

// Giả định các component này nằm cùng cấp hoặc trong thư mục con của HomePage
import RecentlyReadList from '../RecentlyReadList';
import NewlyUpdatedList from '../NewlyUpdatedList';
import RecentReviewsList from '../RecentReviewsList';
// import StoryGrid from '../components/StoryGrid/StoryGrid'; // Tạm thời không dùng StoryGrid cho Đề Cử nữa
import StoryCard from '../../components/StoryCard'; // Vẫn dùng cho Hot, Hoàn thành
import CompletedStory from './components/CompletedStory/CompletedStory';
import HotStory from './components/HotStory/HotStory';
import './HomePage.css'; // Import file CSS chung
// import StoryDetailPage from '../components/StoryDetailPage/StoryDetailPage';

// Giả lập API calls - Thay thế bằng API thật
const fetchHomePageData = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Trả về dummy data - **Cập nhật recommendedStories**
  return {
    recentlyRead: [
      { id: 1, timeAgo: '9 giờ trước', title: 'Quang Âm Chi Ngoại', readChapter: 1529, totalChapters: 1586, storyUrl: '/truyen/quang-am-chi-ngoai', chapterUrl: '/truyen/quang-am-chi-ngoai/chuong-1529' },
      { id: 2, timeAgo: 'Hôm qua', title: 'Đấu Phá Thương Khung', readChapter: 350, totalChapters: 1600, storyUrl: '/truyen/dau-pha-thuong-khung', chapterUrl: '/truyen/dau-pha-thuong-khung/chuong-350' },
      { id: 3, timeAgo: '3 ngày trước', title: 'Ta Có Một Thế Giới Tu Tiên', readChapter: 200, totalChapters: 500, storyUrl: '/truyen/than-mo', chapterUrl: '/truyen/than-mo/chuong-200' },
      { id: 4, timeAgo: '3 ngày trước', title: 'Pháp Sư Chi Thượng', readChapter: 200, totalChapters: 500, storyUrl: '/truyen/than-mo', chapterUrl: '/truyen/than-mo/chuong-200' },
      { id: 5, timeAgo: '3 ngày trước', title: 'Cẩu Thả Thành Thánh Nhân, Tiên Quan Triệu Ta Chăm Ngựa  ', readChapter: 200, totalChapters: 500, storyUrl: '/truyen/than-mo', chapterUrl: '/truyen/than-mo/chuong-200' },

    ],
    newlyUpdated: [
       { id: 101, genre: 'H.Huyễn', title: 'Ta Có Thể Vô Hạn Thôn Phệ', latestChapter: 'Chương 1213', author: 'Bút Lạc Kinh Phong Vũ', timeAgo: '9 phút trước', storyUrl: '/truyen/ta-co-the-vo-han-thon-phe', chapterUrl: '/truyen/ta-co-the-vo-han-thon-phe/chuong-1213' },
       { id: 102, genre: 'Tiên hiệp', title: 'Đại Đạo Triều Thiên', latestChapter: 'Chương 567', author: 'Miêu Nị', timeAgo: '15 phút trước', storyUrl: '/truyen/dai-dao-trieu-thien', chapterUrl: '/truyen/dai-dao-trieu-thien/chuong-567' },
       { id: 103, genre: 'Đô thị', title: 'Trọng Sinh Chi Đô Thị Tu Tiên', latestChapter: 'Chương 890', author: 'Thập Lý Kiếm Thần', timeAgo: '30 phút trước', storyUrl: '/truyen/trong-sinh-chi-do-thi-tu-tien', chapterUrl: '/truyen/trong-sinh-chi-do-thi-tu-tien/chuong-890' },
       { id: 104, genre: 'Tiên hiệp', title: 'Phản Phái: Bắt Đầu Đoạt Lại Nữ Chính', latestChapter: 'Chương 567', author: 'Tiên Nhị Thập Tam', timeAgo: '15 phút trước', storyUrl: '/truyen/dai-dao-trieu-thien', chapterUrl: '/truyen/dai-dao-trieu-thien/chuong-567' },
       { id: 105, genre: 'Tiên hiệp', title: 'Hàn Môn Kiêu Sĩ', latestChapter: 'Chương 567', author: 'Yên Hỏa Thanh Phong', timeAgo: '15 phút trước', storyUrl: '/truyen/dai-dao-trieu-thien', chapterUrl: '/truyen/dai-dao-trieu-thien/chuong-567' },
       { id: 106, genre: 'Tiên hiệp', title: 'Ta Thật Có Thể Trông Thấy Tỉ Lệ Hồi Báo', latestChapter: 'Chương 567', author: 'Bắc Xuyên', timeAgo: '15 phút trước', storyUrl: '/truyen/dai-dao-trieu-thien', chapterUrl: '/truyen/dai-dao-trieu-thien/chuong-567' },
       { id: 107, genre: 'Tiên hiệp', title: 'Hồng Hoang Chi Bắt Đầu Tay Xé Phong Thần Bảng', latestChapter: 'Chương 567', author: 'Bán Cá Tân Nhân', timeAgo: '15 phút trước', storyUrl: '/truyen/dai-dao-trieu-thien', chapterUrl: '/truyen/dai-dao-trieu-thien/chuong-567' },
       { id: 108, genre: 'Tiên hiệp', title: 'Tiên Thảo Cung Ứng Thương', latestChapter: 'Chương 567', author: 'Đạt ẩn Vu Thế', timeAgo: '15 phút trước', storyUrl: '/truyen/dai-dao-trieu-thien', chapterUrl: '/truyen/dai-dao-trieu-thien/chuong-567' },
       { id: 109, genre: 'Tiên hiệp', title: 'Kinh Doanh Nhà Trọ Tư Nhân, Bắt Đầu Tiếp Đãi Võ Tòng', latestChapter: 'Chương 567', author: 'Tịch Mịch Ngã Độc Tẩu', timeAgo: '15 phút trước', storyUrl: '/truyen/dai-dao-trieu-thien', chapterUrl: '/truyen/dai-dao-trieu-thien/chuong-567' },
       { id: 110, genre: 'Tiên hiệp', title: 'Huyền Môn Không Chính Tông', latestChapter: 'Chương 567', author: 'Sàm Chủy Tiểu Miêu Mễ', timeAgo: '15 phút trước', storyUrl: '/truyen/dai-dao-trieu-thien', chapterUrl: '/truyen/dai-dao-trieu-thien/chuong-567' },
       { id: 111, genre: 'Tiên hiệp', title: 'Bắt Đầu Kim Quang Chú, Ta Bị Giáo Hoa Trực Tiếp Cho Hấp Thụ Ánh Sáng', latestChapter: 'Chương 567', author: 'Ỷ Tiểu Lâu Thính Phong Vũ', timeAgo: '15 phút trước', storyUrl: '/truyen/dai-dao-trieu-thien', chapterUrl: '/truyen/dai-dao-trieu-thien/chuong-567' },

       // Add more...
    ],
    hotStories: [ // Vẫn dùng StoryCard đơn giản
      { id: 201, title: 'Truyện Hot 1', imageUrl: 'https://static.cdnno.com/poster/quang-am-chi-ngoai/300.jpg?1718153607', views: 150000, url: '/truyen/hot-1' },
      { id: 202, title: 'Truyện Hot 2', imageUrl: 'https://static.cdnno.com/poster/linh-vu-thien-ha/300.jpg?1588869010', views: 120000, url: '/truyen/hot-2' },
      { id: 203, title: 'Truyện Hot 3', imageUrl: 'https://static.cdnno.com/poster/vu-luyen-dien-phong/300.jpg?1667118108', views: 110000, url: '/truyen/hot-3' },
      { id: 204, title: 'Truyện Hot 4', imageUrl: 'https://static.cdnno.com/poster/dau-pha-thuong-khung/300.jpg?1680932071', views: 105000, url: '/truyen/hot-4' },
      { id: 205, title: 'Truyện Hot 5', imageUrl: 'https://static.cdnno.com/poster/bach-luyen-thanh-than/300.jpg?1614166834', views: 100000, url: '/truyen/hot-5' },
      
    ],
    recommendedStories: [ // ** Cập nhật data cho DetailedStoryItem **
       { id: 301, title: 'Trở Lại 2009 Ta Làm Lại Cuộc Đời', imageUrl: 'https://static.cdnno.com/poster/tro-lai-2009-ta-lam-lai-cuoc-doi/300.jpg', url: '/truyen/de-cu-1', synopsis: 'Thanh Xuân là gì ? Tuổi Trẻ là gì ? Ai trong cuộc đời này cũng trải qua cái độ tuổi thanh xuân, thời gian nhiệt huyế...', author: 'Gấu Mập', genre: 'Đô Thị' },
       { id: 302, title: 'Các Người Tu Tiên, Ta Làm Ruộng', imageUrl: 'https://static.cdnno.com/poster/cac-nguoi-tu-tien-ta-lam-ruong/300.jpg', url: '/truyen/de-cu-2', synopsis: 'Lục Huyền tỉnh lại sau giấc ngủ, trở thành tân tu phương thị bên trong một tên phổ thông Linh Thực Sư , trông coi...', author: 'Triều Văn Đạo', genre: 'Tiên Hiệp' },
       { id: 303, title: 'Trở Về 1996 Bắt Đầu Từ Chợ Lớn Bán Thịt Heo', imageUrl: 'https://static.cdnno.com/poster/tro-ve-1996-bat-dau-tu-cho-lon-giang-ho-ban-thit-heo-1/300.jpg?1735178869', url: '/truyen/de-cu-3', synopsis: 'Năm 1996 Giang hồ Chợ Lớn nổi tiếng với sự khốc liệt của những vụ việc gây chấn động đất nước , gắn liền v...', author: 'Ngoa Tiên', genre: 'Đô Thị' },
       { id: 304, title: 'Chat Group: Người Tại Đấu La, Tai Họa Chư Thiên', imageUrl: 'https://static.cdnno.com/poster/chat-group-nguoi-tai-dau-la-tai-hoa-chu-thien/300.jpg', url: '/truyen/de-cu-4', synopsis: 'Người mặc Đầu La , tự mang trừu tượng hệ thống , Võ Hồn trừu tượng , hồn kỹ cũng trừu tượng , còn khóa lại cái...', author: 'Tu Linh Hoan', genre: 'Đồng Nhân' },
       { id: 305, title: 'Va Phải Sáng Thế Thần: Đời Ta Từ Đây Xui Có Thường', imageUrl: 'https://static.cdnno.com/poster/dai-nao-tu-1960/300.jpg?1740656169', url: '/truyen/de-cu-5', synopsis: 'Main có lý do đặc biệt để yêu thích nghị định 168 , tất cả được bắt đầu sau khi main gặp được Sáng Thế thần đan...', author: 'Mạc Gia', genre: 'Đô Thị' },
       { id: 306, title: 'Hướng Về Tương Lai Nữ Ma Đầu Huy Kiếm', imageUrl: 'https://static.cdnno.com/poster/huong-ve-tuong-lai-nu-ma-dau-huy-kiem/300.jpg', url: '/truyen/de-cu-6', synopsis: 'Thi đại học sắp đến , Đoàn Hoài Ca phát hiện ngoài ý muốn chính mình giống như có một cái đến từ tương lai hệ...', author: 'Tuyết Mãn Trường An', genre: 'Huyền Huyễn' },
    ],
    completedStories: [ // Vẫn dùng StoryCard đơn giản
      { id: 401, title: 'Hoàn Thành 1', imageUrl: 'https://static.cdnno.com/poster/de-ba/300.jpg?1588869317', url: '/truyen/hoan-thanh-1', status: 'Hoàn thành' },
      { id: 402, title: 'Hoàn Thành 2', imageUrl: 'https://static.cdnno.com/poster/pham-nhan-tu-tien/300.jpg?1680769996', url: '/truyen/hoan-thanh-2', status: 'Hoàn thành' },
      { id: 403, title: 'Hoàn Thành 3', imageUrl: 'https://static.cdnno.com/poster/ma-thien-ky/300.jpg?1588868973', url: '/truyen/hoan-thanh-3', status: 'Hoàn thành' },
      { id: 404, title: 'Hoàn Thành 4', imageUrl: 'https://static.cdnno.com/poster/ngao-the-cuu-trong-thien/300.jpg?1588869124', url: '/truyen/hoan-thanh-4', status: 'Hoàn thành' },
      { id: 405, title: 'Hoàn Thành 5', imageUrl: 'https://static.cdnno.com/poster/yeu-than-ky/300.jpg?1588868885', url: '/truyen/hoan-thanh-5', status: 'Hoàn thành' },
    ],
    recentReviews: [
      { id: 501, userAvatar: 'https://static.cdnno.com/user/default/100.jpg', username: 'User1', timeAgo: '1 giờ trước', rating: 4, storyThumb: 'https://static.cdnno.com/poster/quang-am-chi-ngoai/100.jpg?1718153607', storyTitle: 'Tên Truyện 1', storyUrl: '/truyen/ten-truyen-1', snippet: 'Đây là một đoạn trích ngắn của nội dung đánh giá...' },
      { id: 502, userAvatar: 'https://static.cdnno.com/user/default/100.jpg', username: 'User2', timeAgo: '3 giờ trước', rating: 5, storyThumb: 'https://static.cdnno.com/poster/dau-pha-thuong-khung/100.jpg?1680932071', storyTitle: 'Tên Truyện Rất Dài 2', storyUrl: '/truyen/ten-truyen-2', snippet: 'Truyện rất hay, tình tiết lôi cuốn, đề cử đọc...' },
      { id: 503, userAvatar: 'https://static.cdnno.com/user/default/100.jpg', username: 'User3', timeAgo: '5 giờ trước', rating: 3, storyThumb: 'https://static.cdnno.com/poster/than-mo/100.jpg?1671437667', storyTitle: 'Tên Truyện 3', storyUrl: '/truyen/ten-truyen-3', snippet: 'Cốt truyện tạm ổn, nhưng hơi dài dòng...' },
    ],
    isUserLoggedIn: true, // Giả sử user đã đăng nhập
  };
};

// Tách riêng phần nội dung để dùng hook bên trong Router context
function HomePageContent() {
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
        setError('Không thể tải dữ liệu trang chủ. Vui lòng thử lại.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    // Có thể thay bằng Skeleton UI component
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
    recentReviews,
    isUserLoggedIn
  } = homeData;

  // ---- Component StoryGrid tạm thời định nghĩa lại ở đây để dùng StoryCard ---
  // (Trong thực tế nên là component riêng biệt)
  
  
  // -----------------------------------------------------------------------

  return (
    <div className="home-page">
      <Header/>

      {/* --- Banner --- */}
      <div className="banner-placeholder">
        <img src="https://static.cdnno.com/storage/topbox/f0e089d0cfb572cec383725c5572f854.webp" alt="Banner" />
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
        <img src="https://static.cdnno.com/storage/topbox/d1aba67b1aabe385d2857ce5080ad93f.webp" alt="Banner" />
      </div>

      {/* --- Truyện Hot --- */}
      {hotStories && hotStories.length > 0 && (
        <section className="section section--hot-stories">
          <HotStory stories={hotStories} />
        </section>
      )}

      {/* --- Truyện Mới Cập Nhật --- */}
      {newlyUpdated && newlyUpdated.length > 0 && (
        <section className="section section--newly-updated">
          <SectionTitle title=" Truyện Mới Cập Nhật" viewAllLink="/truyen-moi" />
          <NewlyUpdatedList items={newlyUpdated} />
        </section>
      )}

      

      <div className="banner-placeholder">
        <img src="https://static.cdnno.com/storage/topbox/d246998f2320b39a1044b3c2853f116c.webp" alt="Banner" />
      </div>

      {/* --- Truyện Đã Hoàn Thành --- */}
      {completedStories && completedStories.length > 0 && (
        <section className="section section--completed-stories">
          <CompletedStory stories={completedStories} />
        </section>
      )}

       {/* --- Đánh Giá Mới --- */}
      {recentReviews && recentReviews.length > 0 && (
        <section className="section section--recent-reviews">
          <SectionTitle title=" Đánh Giá Mới" viewAllLink="/danh-gia" />
          <RecentReviewsList reviews={recentReviews} />
        </section>
      )}

      <Footer />
    </div>
  );
}

// Component HomePage chính, có thể chứa Router nếu chưa có ở App.js
function HomePage() {
  // Giả sử Router đã được bao ở App.js
  return <HomePageContent />;
}

export default HomePage;


