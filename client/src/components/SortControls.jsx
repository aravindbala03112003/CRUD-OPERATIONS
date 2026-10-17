import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function SortControls({ sortBy, order, onSortChange, onOrderToggle }) {
  return (
    <>
      <select
        id="sort-by-select"
        className="filter-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort by field"
      >
        <option value="publicationDate">Publication Date</option>
        <option value="paperId">Paper ID</option>
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="price">Price</option>
      </select>

      <button
        type="button"
        id="sort-order-btn"
        className="sort-order-btn"
        onClick={onOrderToggle}
        aria-label={`Sort order: ${order === 'desc' ? 'Descending' : 'Ascending'}`}
      >
        <span>{order === 'desc' ? 'Desc' : 'Asc'}</span>
        {order === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
      </button>
    </>
  );
}
