import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search by title, author, or paperId' }) {
  const [searchTerm, setSearchTerm] = useState(value || '');

  // Keep local state in sync if parent resets value
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  // Debounce keystrokes by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== value) {
        onChange(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onChange, value]);

  return (
    <div className="search-input-wrapper">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        id="search-input"
        className="search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
}
