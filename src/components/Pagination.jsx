import React from 'react';

export default function Pagination({ page, hasMore, handlePageChange }) {
  return (
    <div className="pagination-container">
      <button disabled={page === 1} onClick={() => handlePageChange(page - 1)} className="pagination-btn">
        Назад
      </button>
      <span className="page-number">Страница {page}</span>
      <button disabled={!hasMore} onClick={() => handlePageChange(page + 1)} className="pagination-btn">
        Вперед
      </button>
    </div>
  );
}