import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { SqlCode } from '../../types';

interface EditCodeModalProps {
  isOpen: boolean;
  code: SqlCode | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditCodeModal({
  isOpen,
  code,
  onClose,
  onUpdated,
}: EditCodeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [codeText, setCodeText] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // Prefill form whenever a new code is passed in — mirrors openEditModal()
  useEffect(() => {
    if (code) {
      setTitle(code.title);
      setDescription(code.description ?? '');
      setCodeText(code.code);
      setSaveMessage('');
    }
  }, [code]);

  const handleClose = () => {
    setSaveMessage('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) return;

    if (!title || !codeText) {
      setMessageType('error');
      setSaveMessage('ID, Title and Code are required.');
      return;
    }

    setMessageType('info');
    setSaveMessage('Saving changes...');

    const { error } = await supabase
      .from('queryhosxpsabot_sql_codes')
      .update({
        title,
        description,
        code: codeText,
        updated_at: new Date().toISOString(),
      })
      .eq('id', code.id);

    if (error) {
      setMessageType('error');
      setSaveMessage('Update failed: ' + error.message);
    } else {
      setMessageType('success');
      setSaveMessage('Updated successfully!');
      onUpdated();
      setTimeout(() => handleClose(), 900);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const messageColor =
    messageType === 'success'
      ? 'var(--success-color)'
      : messageType === 'error'
        ? 'var(--danger-color)'
        : 'var(--text-color-secondary)';

  return (
    <div
      id="edit-code-modal"
      className={isOpen ? 'modal' : 'modal hidden'}
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        <span className="close-button edit-close-button" onClick={handleClose}>
          &times;
        </span>
        <h2>Edit Code</h2>
        <form id="edit-code-form" onSubmit={handleSubmit}>
          {/* Hidden id field — mirrors <input type="hidden" id="edit-code-id" /> */}
          <input type="hidden" value={code?.id ?? ''} readOnly />

          <label htmlFor="edit-code-title">Title:</label>
          <input
            type="text"
            id="edit-code-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          <label htmlFor="edit-code-description">Description:</label>
          <textarea
            id="edit-code-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="edit-sql-code-area">Code:</label>
          <textarea
            id="edit-sql-code-area"
            rows={10}
            value={codeText}
            onChange={(e) => setCodeText(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <button
              type="button"
              id="cancel-edit-button"
              className="btn"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>

          <p id="edit-save-message" style={{ color: messageColor }}>
            {saveMessage}
          </p>
        </form>
      </div>
    </div>
  );
}
