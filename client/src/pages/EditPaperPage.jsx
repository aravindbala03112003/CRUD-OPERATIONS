import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';

export default function EditPaperPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    paperId: '',
    title: '',
    author: '',
    publicationDate: '',
    price: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    async function loadPaper() {
      setLoading(true);
      setApiError(null);
      try {
        const response = await api.getPaperById(id);
        if (response && response.success && response.data) {
          const p = response.data;
          // Format date as YYYY-MM-DD for <input type="date">
          const dateStr = p.publicationDate
            ? new Date(p.publicationDate).toISOString().split('T')[0]
            : '';

          setFormData({
            paperId: p.paperId || '',
            title: p.title || '',
            author: p.author || '',
            publicationDate: dateStr,
            price: p.price !== undefined ? p.price.toString() : '',
          });
        }
      } catch (err) {
        setApiError(err.message || 'Failed to load paper details.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadPaper();
    }
  }, [id]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author name is required';
    } else if (formData.author.trim().length < 2) {
      newErrors.author = 'Author name must be at least 2 characters';
    }

    if (!formData.publicationDate) {
      newErrors.publicationDate = 'Publication Date is required';
    }

    if (formData.price === '' || formData.price === undefined) {
      newErrors.price = 'Price is required';
    } else {
      const num = parseFloat(formData.price);
      if (isNaN(num) || num < 0) {
        newErrors.price = 'Price must be a valid non-negative number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await api.updatePaper(id, {
        title: formData.title.trim(),
        author: formData.author.trim(),
        publicationDate: formData.publicationDate,
        price: parseFloat(formData.price),
      });

      if (response && response.success) {
        setSuccessMessage('Changes saved successfully! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1200);
      }
    } catch (err) {
      setApiError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="form-panel">
        <div className="glass-panel loading-container">
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)' }}>Loading paper details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-panel">
      {apiError && (
        <Toast
          message={apiError}
          type="error"
          onClose={() => setApiError(null)}
        />
      )}

      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => setSuccessMessage(null)}
        />
      )}

      <div className="glass-panel">
        <h2 className="form-heading">Edit Paper</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="paper-form-grid">
            {/* Row 1 Col 1: Paper ID (Read-only stable business identifier) */}
            <div className="form-field">
              <label htmlFor="edit-paperId" className="form-label">
                Paper ID
              </label>
              <input
                type="text"
                id="edit-paperId"
                name="paperId"
                className="form-input readonly"
                value={formData.paperId}
                readOnly
                disabled
                title="Paper ID cannot be modified"
              />
            </div>

            {/* Row 1 Col 2: Title */}
            <div className="form-field">
              <label htmlFor="edit-title" className="form-label">
                Title
              </label>
              <input
                type="text"
                id="edit-title"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            {/* Row 2 Col 1: Author */}
            <div className="form-field">
              <label htmlFor="edit-author" className="form-label">
                Author
              </label>
              <input
                type="text"
                id="edit-author"
                name="author"
                className="form-input"
                value={formData.author}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.author && <span className="field-error">{errors.author}</span>}
            </div>

            {/* Row 2 Col 2: Publication Date */}
            <div className="form-field">
              <label htmlFor="edit-publicationDate" className="form-label">
                Publication Date
              </label>
              <input
                type="date"
                id="edit-publicationDate"
                name="publicationDate"
                className="form-input"
                value={formData.publicationDate}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.publicationDate && (
                <span className="field-error">{errors.publicationDate}</span>
              )}
            </div>

            {/* Row 3 Col 1: Price */}
            <div className="form-field">
              <label htmlFor="edit-price" className="form-label">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="edit-price"
                name="price"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>

            {/* Row 3 Col 2: Submit Button */}
            <div className="form-field form-actions-field">
              <button
                type="submit"
                id="save-changes-btn"
                className="form-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
