import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { SqlCode } from '../../types';
import AdminCodeCard from './AdminCodeCard';
import AddCodeModal from './AddCodeModal';
import EditCodeModal from './EditCodeModal';
import SearchBar from '../SearchBar';
import ViewCodeModal from '../ViewCodeModal';

interface AdminDashboardProps {
  isAuthenticated: boolean;
}

export default function AdminDashboard({ isAuthenticated }: AdminDashboardProps) {
  const [codes, setCodes] = useState<SqlCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<SqlCode | null>(null);
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    code: '',
  });

  // Mirrors loadAdminSqlCodes() — resets search after every load
  const loadCodes = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('queryhosxpsabot_sql_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load admin SQL codes:', error.message);
    } else {
      setCodes(data ?? []);
    }

    setSearchTerm(''); // mirrors: searchInput.value = ""; filterCodes();
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    loadCodes();
  }, [loadCodes]);

  // Mirrors handleDeleteCode()
  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('queryhosxpsabot_sql_codes')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to delete code: ' + error.message);
    } else {
      alert('Code deleted successfully!');
      await loadCodes();
    }
  };

  // Client-side search filter — mirrors filterCodes() in admin.js
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
    <div id="admin-dashboard">
      {/* Dashboard Header — mirrors .dashboard-header HTML */}
      <div className="dashboard-header">
        <div className="header-actions">
          <h2>Manage Codes</h2>
          <button
            id="add-code-button"
            className="btn btn-primary"
            onClick={() => setAddModalOpen(true)}
          >
            Add New Code
          </button>
        </div>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Loading state */}
      {loading && (
        <p className="loading-message">Loading codes for admin...</p>
      )}

      {/* Code list */}
      {!loading && (
        <>
          <div id="code-management-list">
            {filteredCodes.map((code) => (
              <AdminCodeCard
                key={code.id}
                code={code}
                onEdit={setEditingCode}
                onDelete={handleDelete}
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

      {/* Add Code Modal */}
      <AddCodeModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdded={loadCodes}
      />

      {/* Edit Code Modal */}
      <EditCodeModal
        isOpen={editingCode !== null}
        code={editingCode}
        onClose={() => setEditingCode(null)}
        onUpdated={loadCodes}
      />

      {/* View Full Code Modal */}
      <ViewCodeModal
        isOpen={viewModal.isOpen}
        title={viewModal.title}
        description={viewModal.description}
        code={viewModal.code}
        onClose={closeViewModal}
      />
    </div>
  );
}
