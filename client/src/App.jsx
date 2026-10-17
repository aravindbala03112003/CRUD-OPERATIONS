import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PaperListPage from './pages/PaperListPage';
import CreatePaperPage from './pages/CreatePaperPage';
import ViewPaperPage from './pages/ViewPaperPage';
import EditPaperPage from './pages/EditPaperPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="app-container">
      {/* Background Molecular Abstract Artwork */}
      <div className="background-artwork" aria-hidden="true" />

      {/* Top Dark Navy Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<PaperListPage />} />
          <Route path="/papers" element={<Navigate to="/" replace />} />
          <Route path="/papers/create" element={<CreatePaperPage />} />
          <Route path="/papers/:id" element={<ViewPaperPage />} />
          <Route path="/papers/:id/edit" element={<EditPaperPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
