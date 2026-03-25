import { useMemo, useState } from "react";
import Prism from "../lib/prism";
import type { SqlCode } from "../types";
import { hasMeaningfulUpdate } from "../utils/helpers";

interface CodeCardProps {
  code: SqlCode;
  onViewFull: (title: string, description: string, code: string) => void;
}

export default function CodeCard({ code, onViewFull }: CodeCardProps) {
  const [copied, setCopied] = useState(false);

  const highlightedCode = useMemo(
    () => Prism.highlight(code.code, Prism.languages["sql"], "sql"),
    [code.code],
  );

  const handleCopy = () => {
    navigator.clipboard
      .writeText(code.code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(console.error);
  };

  return (
    <div className="code-card">
      <div className="card-header">
        <h2 data-text={code.title}>{code.title}</h2>
      </div>
      <div className="card-content">
        <p>{code.description || "No description provided."}</p>
        <div className="code-block-wrapper">
          <button className="copy-button" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
          <pre>
            <code
              className="language-sql"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
        <button
          className="view-full-code-button"
          onClick={() =>
            onViewFull(code.title, code.description ?? "", code.code)
          }
        >
          View Full Code
        </button>
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
