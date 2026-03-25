import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface AddCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddCodeModal({
  isOpen,
  onClose,
  onAdded,
}: AddCodeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCode('');
    setSaveMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage('');

    if (!title || !code) {
      setMessageType('error');
      setSaveMessage('Title and Code are required.');
      return;
    }

    const { error } = await supabase
      .from('queryhosxpsabot_sql_codes')
      .insert([{ title, description, code }]);

    if (error) {
      setMessageType('error');
      setSaveMessage('Error saving code: ' + error.message);
    } else {
      setMessageType('success');
      setSaveMessage('Code saved successfully!');
      resetForm();
      onAdded();
      setTimeout(() => {
        onClose();
        setSaveMessage('');
      }, 1500);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const messageColor =
    messageType === 'success'
      ? 'var(--success-color)'
      : 'var(--danger-color)';

  return (
    <div
      className={isOpen ? 'modal' : 'modal hidden'}
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        <span className="close-button" onClick={handleClose}>
          &times;
        </span>
        <h2>Add New Code</h2>
        <form id="add-code-form" onSubmit={handleSubmit}>
          <label htmlFor="code-title">Title:</label>
          <input
            type="text"
            id="code-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="code-description">Description:</label>
          <textarea
            id="code-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="sql-code-area">Code:</label>
          <textarea
            id="sql-code-area"
            rows={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-success">
            Save Code
          </button>
          <p id="save-message" style={{ color: messageColor }}>
            {saveMessage}
          </p>
        </form>
      </div>
    </div>
  );
}
