import "../style/versionHistoryModal.css";

export default function VersionHistoryModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="version-backdrop" onClick={onClose}>
      <div className="version-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Version History</h3>
        <ul>
          <li>v1.0 – Jan 10, 2026</li>
          <li>v1.1 – Jan 18, 2026</li>
          <li>v1.2 – Jan 25, 2026</li>
        </ul>

        <div className="version-footer">
          <button className="import-btn-v" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
