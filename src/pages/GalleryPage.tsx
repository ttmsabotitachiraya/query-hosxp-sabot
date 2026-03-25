import { useState } from 'react';
import { useSqlCodes } from '../hooks/useSqlCodes';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CodeCard from '../components/CodeCard';
import ViewCodeModal from '../components/ViewCodeModal';
import type { CodeModalData } from '../types';

export default function GalleryPage() {
  const { codes, loading, error } = useSqlCodes();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModal, setViewModal] = useState<CodeModalData & { isOpen: boolean }>({
    isOpen: false,
    title: '',
    description: '',
    code: '',
  });

  // Client-side search filter — mirrors filterCodes() in app.js
  const filteredCodes = codes.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.title.toLowerCase().includes(term) ||
      (c.description ?? '').toLowerCase().includes(term) ||
      c.code.toLowerCase().includes(term)
    );
  });

  const openViewModal = (title: string, description: string, code: string) => {
    setViewModal({ isOpen: true, title, description, code });
  };

  const closeViewModal = () => {
    setViewModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <Header
        title="Code Gallery"
        navLink={{ to: '/admin', label: 'Admin Panel' }}
      />
      <main>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {/* Loading state */}
        {loading && (
          <p className="loading-message">Loading SQL codes...</p>
        )}

        {/* Error state */}
        {!loading && error && (
          <p className="error-message">Failed to load SQL codes.</p>
        )}

        {/* Code list */}
        {!loading && !error && (
          <>
            <div id="code-list">
              {filteredCodes.map((code) => (
                <CodeCard
                  key={code.id}
                  code={code}
                  onViewFull={openViewModal}
                />
              ))}
            </div>

            {/* No search results — mirrors noResultsMessage */}
            {filteredCodes.length === 0 && searchTerm !== '' && (
              <p id="no-results-message" className="no-codes-message">
                No codes found matching your search.
              </p>
            )}

            {/* Empty state (no codes at all) */}
            {codes.length === 0 && searchTerm === '' && (
              <p className="no-codes-message">No SQL codes available yet.</p>
            )}
          </>
        )}
      </main>

      {/* View Full Code Modal */}
      <ViewCodeModal
        isOpen={viewModal.isOpen}
        title={viewModal.title}
        description={viewModal.description}
        code={viewModal.code}
        onClose={closeViewModal}
      />
    </>
  );
}
