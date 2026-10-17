import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatDate, formatPrice } from '../components/PaperTable';
import DeleteModal from '../components/DeleteModal';
import Toast from '../components/Toast';

export default function ViewPaperPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadPaper() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getPaperById(id);
        if (response && response.success) {
          setPaper(response.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load research paper details.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadPaper();
    }
  }, [id]);

  const handleDeleteConfirm = async () => {
    if (!paper) return;
    setIsDeleting(true);
    try {
      await api.deletePaper(paper._id);
      setIsDeleteModalOpen(false);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete research paper.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="view-panel">
        <div className="glass-panel loading-container">
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)' }}>Loading paper details...</p>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="view-panel">
        <div className="glass-panel error-container">
          <p style={{ color: 'var(--btn-red)', fontWeight: 600 }}>
            {error || 'Paper not found.'}
          </p>
          <Link to="/" className="view-pill-btn view-pill-btn-back">
            Back to list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="view-panel">
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}

      <div className="glass-panel">
        {/* Main Title Heading */}
        <h2 className="view-paper-title" id="view-paper-title">
          {paper.title}
        </h2>

        {/* 2-Column Metadata Grid */}
        <div className="view-details-grid" style={{ marginTop: '20px' }}>
          <div className="view-detail-item">
            <span className="view-detail-label">Paper ID:</span>
            <span className="view-detail-value" id="view-paper-id">{paper.paperId}</span>
          </div>

          <div className="view-detail-item">
            <span className="view-detail-label">Author:</span>
            <span className="view-detail-value" id="view-paper-author">{paper.author}</span>
          </div>

          <div className="view-detail-item">
            <span className="view-detail-label">Publication Date:</span>
            <span className="view-detail-value" id="view-paper-date">
              {formatDate(paper.publicationDate)}
            </span>
          </div>

          <div className="view-detail-item">
            <span className="view-detail-label">Price:</span>
            <span className="view-detail-value" id="view-paper-price">
              {formatPrice(paper.price)}
            </span>
          </div>
        </div>

        {/* Action Buttons Row matching Screenshot 4 */}
        <div className="view-actions-row">
          <Link
            to={`/papers/${paper._id}/edit`}
            id="view-action-edit"
            className="view-pill-btn view-pill-btn-edit"
          >
            Edit
          </Link>

          <button
            type="button"
            id="view-action-delete"
            className="view-pill-btn view-pill-btn-delete"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </button>

          <Link
            to="/"
            id="view-action-back"
            className="view-pill-btn view-pill-btn-back"
          >
            Back to list
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        paper={paper}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
