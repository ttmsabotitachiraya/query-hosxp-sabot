import { useMemo, useState, useEffect } from "react";
import Prism from "../lib/prism";

const copyIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const checkIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

interface ViewCodeModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  code: string;
  onClose: () => void;
}

export default function ViewCodeModal({
  isOpen,
  title,
  description,
  code,
  onClose,
}: ViewCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const highlightedCode = useMemo(
    () => (code ? Prism.highlight(code, Prism.languages["sql"], "sql") : ""),
    [code],
  );

  // Close on Escape key — mirrors original keydown listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset copied state when modal closes
  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={isOpen ? "modal" : "modal hidden"}
      onClick={handleBackdropClick}
    >
      <div className="modal-content large">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2 id="modal-code-title">{title}</h2>
        <p id="modal-code-description">{description}</p>
        <div className="modal-code-container">
          <button
            id="modal-copy-button"
            className={copied ? "copied" : ""}
            onClick={handleCopy}
            dangerouslySetInnerHTML={{
              __html: copied ? checkIconSVG : copyIconSVG,
            }}
          />
          <pre id="modal-code-content-pre">
            <code
              className="language-sql"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
}
