// src/components/FilterPanel/FilterPanel.js
import React from 'react';
import './FilterPanel.scss';


const genreOptions = ["Tất cả", "Tiên Hiệp", "Huyền Huyễn", "Đô Thị", "Ngôn Tình", "Khoa Huyễn", "Lịch Sử"];
const statusOptions = ["Tất cả", "Đang ra", "Hoàn thành"];
const chapterOptions = ["Tất cả", "Dưới 100", "100-500", "500-1000", "Trên 1000"];

function FilterPanel({ currentFilters, onFilterChange }) {

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    onFilterChange({ [name]: value === 'Tất cả' ? '' : value }); // Nếu chọn "Tất cả" thì gửi giá trị rỗng
  };


  return (
    <div className="filter-panel">
      <h3><i className="filter-icon"></i> Bộ Lọc</h3> {/* Thêm icon nếu muốn */}

      <div className="filter-group">
        <label htmlFor="genre-filter">Thể loại:</label>
        <select
          id="genre-filter"
          name="genre"
          value={currentFilters.genre || ''}
          onChange={handleSelectChange}
        >
          {genreOptions.map(genre => (
            <option key={genre} value={genre === 'Tất cả' ? '' : genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status-filter">Tình trạng:</label>
        <select
          id="status-filter"
          name="status"
          value={currentFilters.status || ''}
          onChange={handleSelectChange}
        >
          {statusOptions.map(status => (
             <option key={status} value={status === 'Tất cả' ? '' : status}>
               {status}
             </option>
          ))}
        </select>
      </div>

       {/* Ví dụ filter số chương */}
       <div className="filter-group">
        <label htmlFor="chapter-filter">Số chương:</label>
        <select
          id="chapter-filter"
          name="chapters" // Tên này cần khớp với key bạn muốn gửi đi
          // value={currentFilters.chapters || ''} // Lấy giá trị từ state
          onChange={handleSelectChange} // Cần xử lý value này
        >
          {chapterOptions.map(option => (
             <option key={option} value={option === 'Tất cả' ? '' : option}>
               {option}
             </option>
          ))}
        </select>
      </div>


      {/* Thêm các nhóm filter khác: Lượt xem, Đánh giá... */}

      {/* <button onClick={() => onFilterChange({ genre: '', status: '' })}>Reset Filter</button> */}
    </div>
  );
}

export default FilterPanel;