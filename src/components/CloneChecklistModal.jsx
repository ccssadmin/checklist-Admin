import "../style/cloneChecklistModal.css";
import { useState } from "react";

export default function CloneChecklistModal({ open, onClose }) {
  const [selectedChecklist, setSelectedChecklist] = useState("");
  const [newName, setNewName] = useState("");

  if (!open) return null;

  return (
    <div className="clone-backdrop" onClick={onClose}>
      <div className="clone-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Clone Checklist</h3>
        <div className="clone-group">
          <label>Existing Checklist</label>
          <select onChange={(e) => setSelectedChecklist(e.target.value)}>
            <option value="">Select checklist</option>
            <option>Daily Safety Inspection</option>
            <option>Production Line Audit</option>
          </select>
        </div>

        <div className="clone-group">
          <label>New Checklist Name</label>
          <input onChange={(e) => setNewName(e.target.value)} />
        </div>

        <div className="clone-footer">
          <button className="import-btn-c" onClick={onClose}>
            Cancel
          </button>
          <button className="primary" disabled={!selectedChecklist || !newName}>
            Clone
          </button>
        </div>
      </div>
    </div>
  );
}
