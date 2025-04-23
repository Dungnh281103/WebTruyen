import React from 'react';
import './Pagination.scss';

function Pagination({ itemsPerPage, totalItems, currentPage, paginate }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Logic for displaying page numbers
  const maxPagesToShow = 5;
  let startPage, endPage;
  
  if (pageNumbers.length <= maxPagesToShow) {
    // Show all pages
    startPage = 1;
    endPage = pageNumbers.length;
  } else {
    // Calculate start and end pages
    if (currentPage <= Math.floor(maxPagesToShow / 2) + 1) {
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (currentPage + Math.floor(maxPagesToShow / 2) >= pageNumbers.length) {
      startPage = pageNumbers.length - maxPagesToShow + 1;
      endPage = pageNumbers.length;
    } else {
      startPage = currentPage - Math.floor(maxPagesToShow / 2);
      endPage = currentPage + Math.floor(maxPagesToShow / 2);
    }
  }

  return (
    <nav className="pagination-container">
      <ul className="pagination">
        {currentPage > 1 && (
          <li className="page-item">
            <button onClick={() => paginate(currentPage - 1)} className="page-link">
              &laquo; Prev
            </button>
          </li>
        )}
        
        {startPage > 1 && (
          <>
            <li className="page-item">
              <button onClick={() => paginate(1)} className="page-link">
                1
              </button>
            </li>
            {startPage > 2 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}
        
        {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
          const pageNum = startPage + i;
          return (
            <li
              key={pageNum}
              className={`page-item${currentPage === pageNum ? ' active' : ''}`}
            >
              <button onClick={() => paginate(pageNum)} className="page-link">
                {pageNum}
              </button>
            </li>
          );
        })}
        
        {endPage < pageNumbers.length && (
          <>
            {endPage < pageNumbers.length - 1 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li className="page-item">
              <button onClick={() => paginate(pageNumbers.length)} className="page-link">
                {pageNumbers.length}
              </button>
            </li>
          </>
        )}
        
        {currentPage < pageNumbers.length && (
          <li className="page-item">
            <button onClick={() => paginate(currentPage + 1)} className="page-link">
              Next &raquo;
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Pagination;