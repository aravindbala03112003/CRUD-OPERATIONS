import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="view-panel">
      <div className="glass-panel error-container">
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>404</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          The page or research paper you are looking for does not exist.
        </p>
        <Link to="/" className="view-pill-btn view-pill-btn-back" style={{ marginTop: '12px' }}>
          Back to list
        </Link>
      </div>
    </div>
  );
}
