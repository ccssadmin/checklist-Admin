import "../style/importChecklistModal.css";

export default function ImportChecklistModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="import-backdrop" onClick={onClose}>
      <div className="import-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="import-header">
          <div>
            <h3>Import Checklist</h3>
            <p>Upload a checklist JSON file</p>
          </div>

          <button className="import-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* File Input */}
        <label className="import-label">Checklist File</label>
        <input type="file" accept=".json" className="import-file" />

        {/* Actions */}
        <div className="import-footer">
          <button className="import-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="import-btn primary">Import</button>
        </div>
      </div>
    </div>
  );
}
