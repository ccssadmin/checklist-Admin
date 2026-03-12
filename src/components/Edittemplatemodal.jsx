import React from "react";
import { X } from "lucide-react";
import "../style/Edittemplatemodal.css";

export default function EditTemplateModal({ template, onClose, onEdit }) {
  return (
    <div className="template-modal-overlay">
      <div className="template-modal template-modal-small">
        <div className="template-modal-header">
          <h3>Edit Template</h3>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <div className="template-modal-body">
          <div className="template-detail-row">
            <span className="template-label">Template</span>
            <span className="template-value">{template.template_name}</span>
          </div>

          <div className="template-detail-row">
            <span className="template-label">Department</span>
            <span className="template-value">
              {template.department?.department_name || "—"}
            </span>
          </div>

          <div className="template-detail-row">
            <span className="template-label">Version</span>
            <span className="template-value">v{template.version}</span>
          </div>

          <div className="template-detail-row">
            <span className="template-label">Status</span>
            <span
              className={`template-status template-status-${template.status.toLowerCase()}`}
            >
              {template.status}
            </span>
          </div>
        </div>

        <div className="template-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={onEdit}>
            Continue Editing
          </button>
        </div>
      </div>
    </div>
  );
}
