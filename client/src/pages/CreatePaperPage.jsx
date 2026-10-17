import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';

export default function CreatePaperPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    paperId: '',
    title: '',
    author: '',
    publicationDate: '',
    price: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!formData.paperId.trim()) {
      newErrors.paperId = 'Paper ID is required (e.g. P-105)';
    } else if (!/^P-\d+$/i.test(formData.paperId.trim())) {
      newErrors.paperId = 'Paper ID must start with "P-" followed by numbers (e.g. P-105)';
    }

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
    // Clear field-specific error as user types
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
      const response = await api.createPaper({
        paperId: formData.paperId.trim().toUpperCase(),
        title: formData.title.trim(),
        author: formData.author.trim(),
        publicationDate: formData.publicationDate,
        price: parseFloat(formData.price),
      });

      if (response && response.success) {
        setSuccessMessage('Research paper created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1200);
      }
    } catch (err) {
      setApiError(err.message || 'Failed to create research paper. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h2 className="form-heading">Create Paper</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="paper-form-grid">
            {/* Row 1 Col 1: Paper ID */}
            <div className="form-field">
              <label htmlFor="paperId" className="form-label">
                Paper ID
              </label>
              <input
                type="text"
                id="paperId"
                name="paperId"
                className="form-input"
                placeholder="P-105"
                value={formData.paperId}
                onChange={handleChange}
                disabled={isSubmitting}
                autoFocus
              />
              {errors.paperId && <span className="field-error">{errors.paperId}</span>}
            </div>

            {/* Row 1 Col 2: Title */}
            <div className="form-field">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                placeholder="Food Recommendation System"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            {/* Row 2 Col 1: Author */}
            <div className="form-field">
              <label htmlFor="author" className="form-label">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                className="form-input"
                placeholder="Aravind"
                value={formData.author}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.author && <span className="field-error">{errors.author}</span>}
            </div>

            {/* Row 2 Col 2: Publication Date */}
            <div className="form-field">
              <label htmlFor="publicationDate" className="form-label">
                Publication Date
              </label>
              <input
                type="date"
                id="publicationDate"
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
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="price"
                name="price"
                className="form-input"
                placeholder="20000.00"
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
                id="create-paper-submit-btn"
                className="form-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
