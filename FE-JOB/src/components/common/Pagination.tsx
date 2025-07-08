import React from 'react';
import styles from './pagination.module.scss';

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

const getPages = (current: number, totalPages: number) => {
  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }
  if (current <= 3) {
    pages.push(1, 2, 3, 4, '...', totalPages);
  } else if (current >= totalPages - 2) {
    pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', totalPages);
  }
  return pages;
};

const Pagination: React.FC<PaginationProps> = ({ current, total, pageSize, onChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  const pages = getPages(current, totalPages);

  return (
    <div className={styles.paginationWrapper}>
      <button
        className={styles.pageBtn}
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        &#60;
      </button>
      {pages.map((p, idx) =>
        typeof p === 'number' ? (
          <button
            key={p}
            className={
              styles.pageBtn + ' ' + (current === p ? styles.active : '')
            }
            onClick={() => onChange(p)}
            disabled={current === p}
          >
            {p}
          </button>
        ) : (
          <span key={idx} className={styles.ellipsis}>...</span>
        )
      )}
      <button
        className={styles.pageBtn}
        disabled={current === totalPages}
        onClick={() => onChange(current + 1)}
      >
        &#62;
      </button>
    </div>
  );
};

export default Pagination; 