import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import DetailedStoryItem from '../HomePage/components/DetailedStoryItem/DetailedStoryItem';
import Pagination from '../../components/Pagination/Pagination';
import { FaSearch, FaSortAmountDown, FaTimes } from 'react-icons/fa';
import { fetchStories } from '../../apis/storyServices';
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

  // Filter options - moved to objects for easier mapping
  const filterOptions = {
    status: ['Đang ra', 'Hoàn thành', 'Tạm ngưng'],
    type: ['Chuyển ngữ', 'Sáng tác'],
    chapterRange: ['<300', '300-600', '600-1000', '>1000'],
    genres: [
      'Tiên Hiệp', 'Huyền Huyễn', 'Khoa Huyễn', 'Võng Du', 
      'Đô Thị', 'Đồng Nhân', 'Dã Sử', 'Cạnh Kỹ', 
      'Huyền Nghi', 'Kiếm Hiệp', 'Kỳ Ảo', 'Light Novel'
    ],
    characterTraits: [
      'Điềm Đạm', 'Nhiệt Huyết', 'Vô Sỉ', 'Thiết Huyết',
      'Nhẹ Nhàng', 'Cơ Trí', 'Lãnh Khốc', 'Kiêu Ngạo',
      'Ngu Ngốc', 'Giảo Hoạt'
    ],
    worldSetting: [
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
    ],
    style: [
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
    ]
  };

  const sortOptions = [
    { value: 'newest_chapter', label: 'Mới lên chương' },
    { value: 'newest_story', label: 'Mới đăng' },
    { value: 'most_views', label: 'Lượt đọc' },
    { value: 'most_favorites', label: 'Yêu thích' },
    { value: 'rating', label: 'Đánh giá' }
  ];

  // Memoize filter functions to prevent unnecessary re-renders
  const applyFilters = useCallback(() => {
    if (!stories.length) return;
    
    let result = [...stories];

    // Apply all filters in a single pass for better performance
    result = result.filter(story => {
      // Skip story if it doesn't match single select filters
      if (filters.status && story.status !== filters.status) return false;
      if (filters.type && story.type !== filters.type) return false;
      if (filters.worldSetting && story.worldSetting !== filters.worldSetting) return false;
      if (filters.style && story.style !== filters.style) return false;
      
      // Check chapter range
      if (filters.chapterRange) {
        const chapterCount = story.chapterCount || 0;
        switch (filters.chapterRange) {
          case '<300': if (chapterCount >= 300) return false; break;
          case '300-600': if (chapterCount < 300 || chapterCount > 600) return false; break;
          case '600-1000': if (chapterCount <= 600 || chapterCount > 1000) return false; break;
          case '>1000': if (chapterCount <= 1000) return false; break;
        }
      }
      
      // Check multi-select filters
      if (filters.genres.length > 0) {
        if (!story.genres || !Array.isArray(story.genres)) return false;
        if (!filters.genres.every(genre => story.genres.includes(genre))) return false;
      }
      
      if (filters.characterTraits.length > 0) {
        if (!story.characterTraits || !Array.isArray(story.characterTraits)) return false;
        if (!filters.characterTraits.every(trait => story.characterTraits.includes(trait))) return false;
      }
      
      // Check search keyword
      if (filters.searchKeyword) {
        const keyword = filters.searchKeyword.toLowerCase();
        return (
          (story.title?.toLowerCase().includes(keyword)) || 
          (story.author?.toLowerCase().includes(keyword)) ||
          (story.description?.toLowerCase().includes(keyword))
        );
      }
      
      return true;
    });

    // Apply sorting
    if (filters.sortBy) {
      result = sortStories(result, filters.sortBy);
    }

    setFilteredStories(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, stories]);

  // Fetch stories on component mount
  useEffect(() => {
    const getAllStories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allStories = await fetchStories();
        if (Array.isArray(allStories)) {
          setStories(allStories);
          setFilteredStories(allStories);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('Không thể tải danh sách truyện. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    getAllStories();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Sorting function
  const sortStories = (storiesToSort, sortBy) => {
    return [...storiesToSort].sort((a, b) => {
      switch (sortBy) {
        case 'newest_chapter':
          return new Date(b.lastChapterDate || 0) - new Date(a.lastChapterDate || 0);
        case 'newest_story':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'most_views':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'most_favorites':
          return (b.favoriteCount || 0) - (a.favoriteCount || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  };

  // Handler functions
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
    handleFilterChange('searchKeyword', searchInput);
  };
  
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
    setSearchInput('');
  };

  // Pagination
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = filteredStories.slice(indexOfFirstStory, indexOfLastStory);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Helper component for rendering filter buttons
  const FilterButtons = ({ type, options, isMultiSelect = false }) => {
    const currentValues = isMultiSelect ? filters[type] : [filters[type]];
    
    return (
      <div className="option-buttons wrap-buttons">
        {options.map(option => (
          <button 
            key={option}
            className={currentValues.includes(option) ? 'active' : ''}
            onClick={() => isMultiSelect 
              ? handleToggleFilter(type, option)
              : handleFilterChange(type, filters[type] === option ? '' : option)
            }
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  // Helper component for rendering active filters
  const ActiveFilter = ({ label, value, onRemove }) => (
    <span className="filter-tag">
      {value}
      <button className="remove-filter" onClick={onRemove}>×</button>
    </span>
  );

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
              <FilterButtons 
                type="status" 
                options={filterOptions.status} 
              />
            </div>
            
            <div className="filter-group">
              <label>Loại:</label>
              <FilterButtons 
                type="type" 
                options={filterOptions.type} 
              />
            </div>

            <div className="filter-group">
              <label>Số chương:</label>
              <FilterButtons 
                type="chapterRange" 
                options={filterOptions.chapterRange} 
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Thể loại:</label>
              <FilterButtons 
                type="genres" 
                options={filterOptions.genres} 
                isMultiSelect={true} 
              />
            </div>

            <div className="filter-group">
              <label>Tính cách nhân vật chính:</label>
              <FilterButtons 
                type="characterTraits" 
                options={filterOptions.characterTraits} 
                isMultiSelect={true} 
              />
            </div>

            <div className="filter-group">
              <label>Lưu phái:</label>
              <FilterButtons 
                type="style" 
                options={filterOptions.style} 
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group world-setting-group">
              <label>Bối cảnh thế giới:</label>
              <FilterButtons 
                type="worldSetting" 
                options={filterOptions.worldSetting} 
              />
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
            
            {/* Active filters display */}
            {filters.genres.length > 0 && (
              <div className="active-filters">
                <span>Thể loại: </span>
                {filters.genres.map(genre => (
                  <ActiveFilter 
                    key={genre} 
                    value={genre} 
                    onRemove={() => handleToggleFilter('genres', genre)} 
                  />
                ))}
              </div>
            )}
            
            {filters.status && (
              <div className="active-filters">
                <span>Tình trạng: </span>
                <ActiveFilter 
                  value={filters.status} 
                  onRemove={() => handleFilterChange('status', '')} 
                />
              </div>
            )}
            
            {filters.type && (
              <div className="active-filters">
                <span>Loại: </span>
                <ActiveFilter 
                  value={filters.type} 
                  onRemove={() => handleFilterChange('type', '')} 
                />
              </div>
            )}
            
            {filters.chapterRange && (
              <div className="active-filters">
                <span>Số chương: </span>
                <ActiveFilter 
                  value={filters.chapterRange} 
                  onRemove={() => handleFilterChange('chapterRange', '')} 
                />
              </div>
            )}
            
            {filters.characterTraits.length > 0 && (
              <div className="active-filters">
                <span>Tính cách nhân vật: </span>
                {filters.characterTraits.map(trait => (
                  <ActiveFilter 
                    key={trait} 
                    value={trait} 
                    onRemove={() => handleToggleFilter('characterTraits', trait)} 
                  />
                ))}
              </div>
            )}
            
            {filters.worldSetting && (
              <div className="active-filters">
                <span>Bối cảnh: </span>
                <ActiveFilter 
                  value={filters.worldSetting} 
                  onRemove={() => handleFilterChange('worldSetting', '')} 
                />
              </div>
            )}
            
            {filters.style && (
              <div className="active-filters">
                <span>Lưu phái: </span>
                <ActiveFilter 
                  value={filters.style} 
                  onRemove={() => handleFilterChange('style', '')} 
                />
              </div>
            )}
            
            {filters.searchKeyword && (
              <div className="active-filters">
                <span>Từ khóa: </span>
                <ActiveFilter 
                  value={filters.searchKeyword} 
                  onRemove={() => {
                    handleFilterChange('searchKeyword', '');
                    setSearchInput('');
                  }} 
                />
              </div>
            )}
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