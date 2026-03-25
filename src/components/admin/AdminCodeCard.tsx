import { useMemo, useState, useRef, useEffect } from "react";
import Prism from "../../lib/prism";
import type { SqlCode } from "../../types";
import { hasMeaningfulUpdate } from "../../utils/helpers";

interface AdminCodeCardProps {
  code: SqlCode;
  onEdit: (code: SqlCode) => void;
  onDelete: (id: string) => void;
  onViewFull: (title: string, description: string, code: string) => void;
}

export default function AdminCodeCard({
  code,
  onEdit,
  onDelete,
  onViewFull,
}: AdminCodeCardProps) {
  const [copied, setCopied] = useState(false);
  const [showViewFull, setShowViewFull] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const highlightedCode = useMemo(
    () => Prism.highlight(code.code, Prism.languages["sql"], "sql"),
    [code.code],
  );

  // Mirror original admin.js: only show "View Full Code" if pre scrollHeight > 200
  useEffect(() => {
    if (preRef.current) {
      setShowViewFull(preRef.current.scrollHeight > 200);
    }
  }, [highlightedCode]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(code.code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(console.error);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this SQL code?")) {
      onDelete(code.id);
    }
  };

  const handleViewFull = () => {
    onViewFull(code.title, code.description ?? "", code.code);
  };

  return (
    <div className="code-card admin-card">
      <div className="card-header">
        <h3 data-text={code.title}>{code.title}</h3>
        <div className="admin-actions">
          <button
            className="btn btn-secondary edit-button"
            onClick={() => onEdit(code)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger delete-button"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="card-content">
        <p>{code.description || "No description provided."}</p>
        <div className="code-block-wrapper">
          <button className="copy-button" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
          <pre ref={preRef}>
            <code
              className="language-sql"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
        {showViewFull && (
          <button className="view-full-code-button" onClick={handleViewFull}>
            View Full Code
          </button>
        )}
        <small>Added on: {new Date(code.created_at).toLocaleString()}</small>
        {hasMeaningfulUpdate(code.created_at, code.updated_at) && (
          <small className="last-modified">
            Last modified:{" "}
            {new Date(code.updated_at as string).toLocaleString()}
          </small>
        )}
      </div>
    </div>
  );
}
