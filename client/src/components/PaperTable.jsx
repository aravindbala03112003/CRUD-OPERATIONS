import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export function formatPrice(price) {
  if (price === undefined || price === null || isNaN(price)) return '₹0.00';
  return `₹${Number(price).toFixed(2)}`;
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '-';
  // Screenshot displays M/D/YYYY format e.g. 8/22/2025
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`;
}

export default function PaperTable({ papers, onView, onEdit, onDelete }) {
  if (!papers || papers.length === 0) {
    return (
      <div className="empty-container">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          No research papers found. Try adjusting your search query or create a new paper.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="papers-table" id="papers-table">
        <thead>
          <tr>
            <th style={{ width: '12%' }}>Paper ID</th>
            <th style={{ width: '32%' }}>Title</th>
            <th style={{ width: '18%' }}>Author</th>
            <th style={{ width: '12%' }}>Date</th>
            <th style={{ width: '12%' }}>Price</th>
            <th style={{ width: '14%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {papers.map((paper) => (
            <tr key={paper._id || paper.paperId} id={`paper-row-${paper.paperId}`}>
              <td className="paper-id-cell">{paper.paperId}</td>
              <td className="paper-title-cell">{paper.title}</td>
              <td>{paper.author}</td>
              <td>{formatDate(paper.publicationDate)}</td>
              <td className="paper-price-cell">{formatPrice(paper.price)}</td>
              <td>
                <div className="action-buttons-group">
                  <Link
                    to={`/papers/${paper._id}`}
                    id={`view-btn-${paper.paperId}`}
                    className="action-btn action-btn-view"
                    title={`View ${paper.title}`}
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </Link>

                  <Link
                    to={`/papers/${paper._id}/edit`}
                    id={`edit-btn-${paper.paperId}`}
                    className="action-btn action-btn-edit"
                    title={`Edit ${paper.title}`}
                  >
                    <Pencil size={13} />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    id={`delete-btn-${paper.paperId}`}
                    className="action-btn action-btn-delete"
                    onClick={() => onDelete(paper)}
                    title={`Delete ${paper.title}`}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
