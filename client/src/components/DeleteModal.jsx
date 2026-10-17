import React, { useEffect, useRef } from 'react';

export default function DeleteModal({
  isOpen,
  paper,
  isDeleting,
  onConfirm,
  onCancel,
}) {
  const modalRef = useRef(null);
  const deleteBtnRef = useRef(null);

  // Focus management & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeleting) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (deleteBtnRef.current) {
      deleteBtnRef.current.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen || !paper) return null;

  return (
    <div
      className="modal-overlay"
      id="delete-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onCancel();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="delete-modal-card" ref={modalRef}>
        <h2 className="modal-header-title" id="modal-title">
          Confirm Delete
        </h2>
        <p className="modal-body-text">
          This action cannot be undone.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            id="confirm-delete-btn"
            ref={deleteBtnRef}
            className="modal-delete-btn"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>

          <button
            type="button"
            id="cancel-delete-btn"
            className="modal-cancel-btn"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
