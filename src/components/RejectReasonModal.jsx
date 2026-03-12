import "../style/RejectReasonModal.css";
import React from "react";

export default function RejectReasonModal({ open, onClose, onSubmit }) {
  const [reason, setReason] = React.useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason);
    setReason("");
  };

  return (
    <div className="reject-backdrop" onClick={onClose}>
      <div className="reject-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reject-header">
          <h3>Reject Rescheduling Request</h3>
        </div>

        <p className="reject-subtitle">Please provide a reason for rejection</p>

        <textarea
          className="reject-textarea"
          placeholder="Enter rejection reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="reject-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={handleSubmit}>
            Reject Request
          </button>
        </div>
      </div>
    </div>
  );
}
