import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="header-navbar">
      <div className="header-container">
        <Link to="/" className="header-title-link">
          <h1 className="header-title">Research Papers</h1>
        </Link>

        <nav className="header-actions">
          <Link
            to="/"
            id="nav-view-all"
            className={`nav-btn nav-btn-view-all ${location.pathname === '/' ? 'active' : ''}`}
          >
            View All
          </Link>
          <Link
            to="/papers/create"
            id="nav-create"
            className={`nav-btn nav-btn-create ${location.pathname === '/papers/create' ? 'active' : ''}`}
          >
            Create
          </Link>
        </nav>
      </div>
    </header>
  );
}
