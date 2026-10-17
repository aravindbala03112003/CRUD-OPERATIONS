import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, type = 'error', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`alert-box ${type === 'success' ? 'alert-box-success' : 'alert-box-error'}`}
      role="alert"
    >
      {type === 'success' ? (
        <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
      ) : (
        <AlertCircle size={18} style={{ flexShrink: 0 }} />
      )}
      <span style={{ flex: 1 }}>{message}</span>
      <button
        type="button"
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
          display: 'flex',
          padding: 2,
        }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
