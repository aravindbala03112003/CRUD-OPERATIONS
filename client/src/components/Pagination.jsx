import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSelectPageSize = (size) => {
    onPageSizeChange(size);
    setDropdownOpen(false);
  };

  return (
    <div className="pagination-panel" id="pagination-panel">
      <div className="pagination-left">
        <button
          type="button"
          id="pagination-prev-btn"
          className="pagination-btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous Page"
        >
          Prev
        </button>

        <span className="pagination-info" id="pagination-info">
          Page {currentPage} / {Math.max(1, totalPages)} • {totalItems} items
        </span>

        <button
          type="button"
          id="pagination-next-btn"
          className="pagination-btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next Page"
        >
          Next
        </button>
      </div>

      <div className="page-size-selector-wrapper" ref={dropdownRef}>
        <button
          type="button"
          id="page-size-dropdown-btn"
          className="page-size-btn"
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-expanded={dropdownOpen}
          aria-haspopup="listbox"
        >
          <span>{pageSize}/page</span>
          <ChevronDown size={14} />
        </button>

        {dropdownOpen && (
          <div className="page-size-menu" role="listbox" id="page-size-menu">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                id={`page-size-option-${size}`}
                className={`page-size-option ${pageSize === size ? 'active' : ''}`}
                onClick={() => handleSelectPageSize(size)}
                role="option"
                aria-selected={pageSize === size}
              >
                {size}/page
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
