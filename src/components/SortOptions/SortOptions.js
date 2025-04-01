// src/components/SortOptions/SortOptions.js
import React from 'react';
import './SortOptions.scss';

const sortOptionsList = [
  { value: 'latest_update', label: 'Mới cập nhật' },
  { value: 'most_viewed', label: 'Xem nhiều nhất' },
  { value: 'top_rated', label: 'Đánh giá cao' }, // Giả sử có sort này
  { value: 'newest', label: 'Mới nhất' }, // Mới đăng
];

function SortOptions({ currentSort, onSortChange }) {
  const handleChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <div className="sort-options">
      <label htmlFor="sort-select">Sắp xếp theo:</label>
      <select id="sort-select" value={currentSort} onChange={handleChange}>
        {sortOptionsList.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortOptions;