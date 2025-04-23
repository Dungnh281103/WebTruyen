import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import DetailedStoryItem from '../HomePage/components/DetailedStoryItem/DetailedStoryItem';
import Pagination from '../../components/Pagination/Pagination';
import { FaSearch, FaSortAmountDown } from 'react-icons/fa';
import './FilterStoriesPage.scss';

function FilterStoriesPage() {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [storiesPerPage] = useState(20);
  const [searchInput, setSearchInput] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    chapterRange: '',
    genres: [],
    characterTraits: [],
    worldSetting: '',
    style: '',
    searchKeyword: '',
    sortBy: 'newest_chapter' // Default sort
  });

  // Options for filters
  const statusOptions = ['Đang ra', 'Hoàn thành', 'Tạm ngưng'];
  const typeOptions = ['Chuyển ngữ', 'Sáng tác'];
  const chapterRangeOptions = ['<300', '300-600', '600-1000', '>1000'];
  
  // Updated genre options
  const genreOptions = [
    'Tiên Hiệp', 'Huyền Huyễn', 'Khoa Huyễn', 'Võng Du', 
    'Đô Thị', 'Đồng Nhân', 'Dã Sử', 'Cạnh Kỹ', 
    'Huyền Nghi', 'Kiếm Hiệp', 'Kỳ Ảo', 'Light Novel'
  ];
  
  // Updated character trait options
  const characterTraitOptions = [
    'Điềm Đạm', 'Nhiệt Huyết', 'Vô Sỉ', 'Thiết Huyết',
    'Nhẹ Nhàng', 'Cơ Trí', 'Lãnh Khốc', 'Kiêu Ngạo',
    'Ngu Ngốc', 'Giảo Hoạt'
  ];
  
  // Updated world setting options
  const worldSettingOptions = [
    'Đông Phương Huyền Huyễn', 'Dị Thế Đại Lục', 'Vương Triều Tranh Bá',
    'Cao Võ Thế Giới', 'Tây Phương Kỳ Huyễn', 'Hiện Đại Ma Pháp',
    'Hắc Ám Huyễn Tưởng', 'Lịch Sử Thần Thoại', 'Võ Hiệp Huyễn Tưởng',
    'Cổ Võ Tương Lai', 'Tu Chân Văn Minh', 'Huyễn Tưởng Tu Tiên',
    'Hiện Đại Tu Chân', 'Thần Thoại Tu Chân', 'Cổ Điển Tiên Hiệp',
    'Viễn Cổ Hồng Hoang', 'Đô Thị Sinh Hoạt', 'Đô Thị Dị Năng',
    'Thanh Xuân Vườn Trường', 'Ngu Nhạc Minh Tinh', 'Thương Chiến Chức Tràng',
    'Giá Không Lịch Sử', 'Lịch Sử Quân Sự', 'Dân Gian Truyền Thuyết',
    'Lịch Sử Quan Trường', 'Hư Nghĩ Võng Du', 'Du Hí Dị Giới',
    'Điện Tử Cạnh Kỹ', 'Thể Dục Cạnh Kỹ', 'Cổ Võ Cơ Giáp',
    'Thế Giới Tương Lai', 'Tinh Tế Văn Minh', 'Tiến Hóa Biến Dị',
    'Mạt Thế Nguy Cơ', 'Thời Không Xuyên Toa', 'Quỷ Bí Huyền Nghi',
    'Kỳ Diệu Thế Giới', 'Trinh Tham Thôi Lý', 'Thám Hiểm Sinh Tồn',
    'Cung Vi Trạch Đấu', 'Kinh Thương Chủng Điền', 'Tiên Lữ Kỳ Duyên',
    'Hào Môn Thế Gia', 'Dị Tộc Luyến Tình', 'Ma Pháp Huyễn Tình',
    'Tinh Tế Luyến Ca', 'Linh Khí Khôi Phục', 'Chư Thiên Vạn Giới',
    'Nguyên Sinh Huyễn Tưởng', 'Yêu Đương Thường Ngày', 'Diễn Sinh Đồng Nhân',
    'Cáo Tiếu Thổ Tào'
  ];
  
  // Updated style options
  const styleOptions = [
    'Hệ Thống', 'Lão Gia', 'Bàn Thờ', 'Tùy Thân',
    'Phàm Nhân', 'Vô Địch', 'Xuyên Qua', 'Nữ Cường',
    'Khế Ước', 'Trọng Sinh', 'Hồng Lâu', 'Học Viện',
    'Biến Thân', 'Cổ Ngu', 'Chuyển Thế', 'Xuyên Sách',
    'Đàn Xuyên', 'Phế Tài', 'Dưỡng Thành', 'Cơm Mềm',
    'Vô Hạn', 'Mary Sue', 'Cá Mặn', 'Xây Dựng Thế Lực',
    'Xuyên Nhanh', 'Nữ Phụ', 'Vả Mặt', 'Sảng Văn',
    'Xuyên Không', 'Ngọt Sủng', 'Ngự Thú', 'Điền Viên',
    'Toàn Dân', 'Mỹ Thực', 'Phản Phái', 'Sau Màn',
    'Thiên Tài'
  ];

  const sortOptions = [
    { value: 'newest_chapter', label: 'Mới lên chương' },
    { value: 'newest_story', label: 'Mới đăng' },
    { value: 'most_views', label: 'Lượt đọc' },
    { value: 'most_favorites', label: 'Yêu thích' },
    { value: 'rating', label: 'Đánh giá' }
  ];

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/data/stories.json');
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu truyện');
        }

        const data = await response.json();
        setStories(data.storys || []);
        setFilteredStories(data.storys || []);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('Không thể tải danh sách truyện. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let result = [...stories];
    console.log("Initial stories count:", result.length);

    // Filter by status
    if (filters.status) {
      const beforeCount = result.length;
      result = result.filter(story => story.status === filters.status);
      console.log(`Status filter (${filters.status}): ${beforeCount} → ${result.length} stories`);
    }

    // Filter by type
    if (filters.type) {
      const beforeCount = result.length;
      result = result.filter(story => story.type === filters.type);
      console.log(`Type filter (${filters.type}): ${beforeCount} → ${result.length} stories`);
    }

    // Filter by genres (more detail on this one)
    if (filters.genres.length > 0) {
      const beforeCount = result.length;
      result = result.filter(story => {
        if (!story.genres || !Array.isArray(story.genres)) {
          console.warn(`Story ${story.id} has invalid genres property:`, story.genres);
          return false;
        }
        const matches = filters.genres.every(genre => story.genres.includes(genre));
        return matches;
      });
      console.log(`Genre filters (${filters.genres.join(', ')}): ${beforeCount} → ${result.length} stories`);
    }

    // Continue with other filters...

    setFilteredStories(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleToggleFilter = (type, value) => {
    setFilters(prev => {
      const currentValues = [...prev[type]];
      const index = currentValues.indexOf(value);
      
      if (index === -1) {
        currentValues.push(value);
      } else {
        currentValues.splice(index, 1);
      }
      
      return { ...prev, [type]: currentValues };
    });
  };

  const handleSearch = () => {
    // Apply the search keyword from the input to filters
    handleFilterChange('searchKeyword', searchInput);
  };
  
  // Handle Enter key press in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  const resetFilters = () => {
    setFilters({
      status: '',
      type: '',
      chapterRange: '',
      genres: [],
      characterTraits: [],
      worldSetting: '',
      style: '',
      searchKeyword: '',
      sortBy: 'newest_chapter'
    });
  };

  // Get current stories for pagination
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = filteredStories.slice(indexOfFirstStory, indexOfLastStory);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="loading-indicator">Đang tải danh sách truyện...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error-message">{error}</div>
        <Footer />
      </>
    );
  }

  return (
    <div className="filter-stories-page">
      <Header />
      <div className="container">
        

        <div className="filter-section">
          <div className="filter-row">
          
            <div className="filter-group">
              <label>Tình trạng:</label>
              <div className="option-buttons">
                {statusOptions.map(option => (
                  <button 
                    key={option}
                    className={filters.status === option ? 'active' : ''}
                    onClick={() => handleFilterChange('status', filters.status === option ? '' : option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="filter-group">
              <label>Loại:</label>
              <div className="option-buttons">
                {typeOptions.map(option => (
                  <button 
                    key={option}
                    className={filters.type === option ? 'active' : ''}
                    onClick={() => handleFilterChange('type', filters.type === option ? '' : option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Số chương:</label>
              <div className="option-buttons">
                {chapterRangeOptions.map(option => (
                  <button 
                    key={option}
                    className={filters.chapterRange === option ? 'active' : ''}
                    onClick={() => handleFilterChange('chapterRange', filters.chapterRange === option ? '' : option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Thể loại:</label>
              <div className="option-buttons wrap-buttons">
                {genreOptions.map(option => (
                  <button 
                    key={option}
                    className={filters.genres.includes(option) ? 'active' : ''}
                    onClick={() => handleToggleFilter('genres', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Tính cách nhân vật chính:</label>
              <div className="option-buttons wrap-buttons">
                {characterTraitOptions.map(option => (
                  <button 
                    key={option}
                    className={filters.characterTraits.includes(option) ? 'active' : ''}
                    onClick={() => handleToggleFilter('characterTraits', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Lưu phái:</label>
              <div className="option-buttons wrap-buttons">
                {styleOptions.map(option => (
                  <button 
                    key={option}
                    className={filters.style === option ? 'active' : ''}
                    onClick={() => handleFilterChange('style', filters.style === option ? '' : option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group world-setting-group">
              <label>Bối cảnh thế giới:</label>
              <div className="option-buttons wrap-buttons">
                {worldSettingOptions.map(option => (
                  <button 
                    key={option}
                    className={filters.worldSetting === option ? 'active' : ''}
                    onClick={() => handleFilterChange('worldSetting', filters.worldSetting === option ? '' : option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm theo từ khóa..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
              <button className="search-button" onClick={handleSearch}>
                <FaSearch />
              </button>
            </div>
            
            <div className="sort-box">
              <label>Sắp xếp:</label>
              <select 
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FaSortAmountDown className="sort-icon" />
            </div>

            <button className="reset-button" onClick={resetFilters}>
              Đặt lại
            </button>
          </div>
        </div>

        <div className="filter-results">
          <div className="results-header">
            <h2>Kết quả tìm kiếm ({filteredStories.length} truyện)</h2>
            {filters.genres.length > 0 && (
              <div className="active-filters">
                <span>Thể loại: </span>
                {filters.genres.map(genre => (
                  <span key={genre} className="filter-tag">
                    {genre}
                    <button 
                      className="remove-filter" 
                      onClick={() => handleToggleFilter('genres', genre)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {filters.status && (
              <div className="active-filters">
                <span>Tình trạng: </span>
                <span className="filter-tag">
                  {filters.status}
                  <button 
                    className="remove-filter"
                    onClick={() => handleFilterChange('status', '')}
                  >
                    ×
                  </button>
                </span>
              </div>
            )}
            {/* Add similar sections for other active filters */}
          </div>
          
          {filteredStories.length > 0 ? (
            <>
              <div className="stories-grid">
                {currentStories.map(story => (
                  <DetailedStoryItem key={story.id} story={story} />
                ))}
              </div>
              
              <Pagination 
                itemsPerPage={storiesPerPage} 
                totalItems={filteredStories.length} 
                currentPage={currentPage}
                paginate={paginate} 
              />
            </>
          ) : (
            <div className="no-stories">
              <p>Không tìm thấy truyện phù hợp với bộ lọc.</p>
              <button className="reset-button" onClick={resetFilters}>
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FilterStoriesPage;