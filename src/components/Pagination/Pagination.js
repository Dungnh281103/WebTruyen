// src/components/Pagination/Pagination.js
import React from 'react';
import './Pagination.scss';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // --- Logic hiển thị số trang (có thể làm phức tạp hơn) ---
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Số lượng trang hiển thị tối đa (vd: 1 ... 5 6 7 ... 10)
    const halfMax = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
        pages.push(1); // Luôn hiển thị trang 1
        let start = Math.max(2, currentPage - halfMax);
        let end = Math.min(totalPages - 1, currentPage + halfMax);

        if (currentPage - halfMax <= 2) {
             end = maxPagesToShow - 1;
        }
        if (currentPage + halfMax >= totalPages -1) {
             start = totalPages - maxPagesToShow + 2;
        }


        if (start > 2) {
            pages.push('...'); // Dấu ... đầu
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 1) {
            pages.push('...'); // Dấu ... cuối
        }

        pages.push(totalPages); // Luôn hiển thị trang cuối
    }


    return pages;
  };
  // --- Hết Logic số trang ---

  return (
    <nav className="pagination-nav" aria-label="Pagination">
      <button
        className="page-button prev"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Trang trước"
      >
        &laquo; Trước
      </button>

      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
        ) : (
          <button
            key={page}
            className={`page-button number ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      ))}

      <button
        className="page-button next"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Trang sau"
      >
        Sau &raquo;
      </button>
    </nav>
  );
}

export default Pagination;