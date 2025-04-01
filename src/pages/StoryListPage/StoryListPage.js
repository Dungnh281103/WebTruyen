// src/pages/StoryListPage/StoryListPage.js
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import SortOptions from '../../components/SortOptions/SortOptions';
import StoryGrid from '../../components/StoryGrid/StoryGrid';
import Pagination from '../../components/Pagination/Pagination';
// import LoadingSpinner from '../../components/LoadingSpinner'; // Component hiển thị loading
// import ErrorMessage from '../../components/ErrorMessage'; // Component hiển thị lỗi

import './StoryListPage.scss';

// --- Giả lập API call ---
const fetchStoriesFromApi = async ({ filters, sort, page, limit }) => {
  console.log("Fetching stories with:", { filters, sort, page, limit });
  // *** Thay thế bằng API call thực tế của bạn ***
  // Ví dụ: const response = await fetch(`/api/stories?page=${page}&limit=${limit}&sort=${sort}&genre=${filters.genre || ''}&status=${filters.status || ''}...`);
  // const data = await response.json();
  // return { stories: data.stories, totalPages: data.totalPages };

  // --- Dữ liệu giả lập ---
  await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập độ trễ mạng
  const allStories = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Truyện ${i + 1} (${filters.genre || 'Tất cả'})`,
    coverUrl: `https://via.placeholder.com/160x220?text=Truyen+${i + 1}`,
    slug: `truyen-${i + 1}`,
    latestChapter: Math.floor(Math.random() * 1000) + 50,
    updateTime: `${Math.floor(Math.random() * 24)} giờ trước`,
    status: Math.random() > 0.7 ? 'Hoàn thành' : 'Đang ra',
    genre: ['Tiên Hiệp', 'Huyền Huyễn', 'Đô Thị', 'Ngôn Tình'][i % 4],
    views: Math.floor(Math.random() * 100000),
  }));

  // Lọc cơ bản (ví dụ)
  let filtered = allStories;
  if (filters.genre) {
      filtered = filtered.filter(s => s.genre === filters.genre);
  }
   if (filters.status) {
      filtered = filtered.filter(s => s.status === filters.status);
  }
  // Sắp xếp cơ bản (ví dụ)
   if (sort === 'latest_update') {
      // Giả sử updateTime có thể sort, hoặc dùng id giảm dần
      filtered.sort((a, b) => b.id - a.id);
   } else if (sort === 'most_viewed') {
       filtered.sort((a, b) => b.views - a.views);
   }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const storiesForPage = filtered.slice(startIndex, endIndex);

  return { stories: storiesForPage, totalPages: totalPages };
  // ---------------------
};
// --- Hết Giả lập API ---


function StoryListPage() {
  const [stories, setStories] = useState([]);
  const [filters, setFilters] = useState({ genre: '', status: '' /* Thêm các filter khác */ });
  const [sortOption, setSortOption] = useState('latest_update'); // Giá trị sort mặc định
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const storiesPerPage = 24; // Số truyện mỗi trang

  // Sử dụng useCallback để tránh tạo lại hàm fetch mỗi lần render
  const fetchStories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStoriesFromApi({
        filters,
        sort: sortOption,
        page: currentPage,
        limit: storiesPerPage,
      });
      setStories(data.stories);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch stories:", err);
      setError("Không thể tải danh sách truyện. Vui lòng thử lại.");
      setStories([]); // Xóa truyện cũ khi có lỗi
      setTotalPages(1); // Reset phân trang
    } finally {
      setLoading(false);
    }
  }, [filters, sortOption, currentPage]); // Dependencies của hàm fetch

  // useEffect để gọi fetchStories khi state thay đổi
  useEffect(() => {
    fetchStories();
  }, [fetchStories]); // Chỉ phụ thuộc vào hàm fetchStories đã được useCallback

  // Handler cho việc thay đổi filter
  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
  };

  // Handler cho việc thay đổi sort
  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
    setCurrentPage(1); // Reset về trang 1 khi sort thay đổi
  };

  // Handler cho việc thay đổi trang
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="story-list-page">
      {/* Có thể đặt FilterPanel ở đây nếu là top bar hoặc trong layout 2 cột */}
      {/* <FilterPanel currentFilters={filters} onFilterChange={handleFilterChange} /> */}

      <div className="main-content">
         {/* Layout 2 cột: FilterPanel ở đây nếu là sidebar */}
         <aside className="filter-sidebar">
             <FilterPanel currentFilters={filters} onFilterChange={handleFilterChange} />
         </aside>

         <section className="story-display-area">
             <div className="controls-bar">
                {/* Có thể thêm số lượng kết quả tìm thấy */}
                <SortOptions currentSort={sortOption} onSortChange={handleSortChange} />
             </div>

            {loading && <div className="loading-indicator">Đang tải...</div> /* <LoadingSpinner /> */}
            {error && <div className="error-message">{error}</div> /* <ErrorMessage message={error} /> */}

            {!loading && !error && (
              <>
                {stories.length > 0 ? (
                   <StoryGrid stories={stories} />
                ) : (
                   <p className="no-stories-found">Không tìm thấy truyện nào phù hợp.</p>
                )}
                 {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                 )}
              </>
            )}
         </section>
      </div>
    </div>
  );
}

export default StoryListPage;