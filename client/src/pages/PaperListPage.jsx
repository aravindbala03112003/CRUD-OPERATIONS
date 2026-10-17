import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import SearchBar from '../components/SearchBar';
import SortControls from '../components/SortControls';
import PaperTable from '../components/PaperTable';
import Pagination from '../components/Pagination';
import DeleteModal from '../components/DeleteModal';
import Toast from '../components/Toast';

export default function PaperListPage() {
  const [papers, setPapers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('publicationDate');
  const [order, setOrder] = useState('desc');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Delete modal state
  const [paperToDelete, setPaperToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch papers from API
  const loadPapers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getPapers({
        page: pagination.page,
        limit: pagination.limit,
        search,
        sortBy,
        order,
      });

      if (response && response.success) {
        setPapers(response.data || []);
        if (response.pagination) {
          setPagination((prev) => ({
            ...prev,
            ...response.pagination,
          }));
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load research papers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, sortBy, order]);

  useEffect(() => {
    loadPapers();
  }, [loadPapers]);

  // Handle Search Change (resets to page 1)
  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle Sort Change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle Order Toggle
  const handleOrderToggle = () => {
    setOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle Page Change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Page Size Change (resets to page 1)
  const handlePageSizeChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Delete Handlers
  const handleOpenDelete = (paper) => {
    setPaperToDelete(paper);
  };

  const handleCloseDelete = () => {
    if (!isDeleting) {
      setPaperToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!paperToDelete) return;

    setIsDeleting(true);
    try {
      await api.deletePaper(paperToDelete._id);
      setSuccessMessage(`Paper "${paperToDelete.title}" was successfully deleted.`);
      setPaperToDelete(null);
      // Refresh current page
      loadPapers();
    } catch (err) {
      setError(err.message || 'Failed to delete research paper.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="listing-card">
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}

      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* Main Glassmorphic Table Panel */}
      <section className="glass-panel" aria-label="Research papers listing">
        {/* Top Search & Filter Bar */}
        <div className="search-sort-bar">
          <SearchBar
            value={search}
            onChange={handleSearchChange}
          />
          <SortControls
            sortBy={sortBy}
            order={order}
            onSortChange={handleSortChange}
            onOrderToggle={handleOrderToggle}
          />
        </div>

        {/* Loading Spinner / Table Area */}
        <div style={{ marginTop: '16px' }}>
          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Loading research papers...
              </p>
            </div>
          ) : (
            <PaperTable
              papers={papers}
              onDelete={handleOpenDelete}
            />
          )}
        </div>
      </section>

      {/* Pagination Panel (Separate Glass Pill matching Screenshot 1 & 2) */}
      {!loading && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.limit}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(paperToDelete)}
        paper={paperToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDelete}
      />
    </div>
  );
}
