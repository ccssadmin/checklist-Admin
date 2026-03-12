import React from "react";
import "../style/ViewCheckListsModal.css";
import { X, Calendar, User, Building, Clock, CheckCircle } from "lucide-react";
import { exportPDF } from "../utils/exportUtils";

export default function ViewChecklistModal({ open, onClose, checklist }) {
  if (!open || !checklist) return null;

  const handleDownloadPDF = () => {
    if (!checklist) return;

    const pdfData = checklist.questions.map((q, index) => ({
      "Question No": index + 1,
      Question: q.question,
      Type: q.type,
      Answer: q.answer,
      Status: checklist.status,
      Department: checklist.department,
      Asset: checklist.asset || "N/A",
    }));

    exportPDF(pdfData, `${checklist.name}.pdf`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-VCM " onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{checklist.name}</h2>
            <div className="modal-subtitle">Checklist Details</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="modal-body">
          {/* CHECKLIST INFO CARDS */}
          <div className="info-cards">
            <div className="info-card">
              <div className="info-card-icon">
                <User size={18} />
              </div>
              <div className="info-card-content">
                <div className="info-card-label">Assigned To</div>
                <div className="info-card-value">{checklist.assignedTo}</div>
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-icon">
                <Building size={18} />
              </div>
              <div className="info-card-content">
                <div className="info-card-label">Department</div>
                <div className="info-card-value">{checklist.department}</div>
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-icon">
                <Clock size={18} />
              </div>
              <div className="info-card-content">
                <div className="info-card-label">Shift</div>
                <div className="info-card-value">{checklist.shift}</div>
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-icon">
                <Calendar size={18} />
              </div>
              <div className="info-card-content">
                <div className="info-card-label">Due Date</div>
                <div className="info-card-value">{checklist.dueDate}</div>
              </div>
            </div>
          </div>

          {/* STATUS SECTION */}
          <div className="status-section">
            <div className="status-label">Status</div>
            <span
              className={`status-badge-large status-${checklist.status.toLowerCase().replace(/\s/g, "-")}`}
            >
              {checklist.status}
            </span>
          </div>

          {/* ASSET SECTION (if exists) */}
          {checklist.asset && (
            <div className="asset-section">
              <div className="asset-label">Asset</div>
              <div className="asset-value">{checklist.asset}</div>
            </div>
          )}

          {/* DIVIDER */}
          <div className="modal-divider"></div>

          {/* QUESTIONS SECTION */}
          <div className="questions-section">
            <h3 className="section-title">
              <CheckCircle size={18} />
              Checklist Questions
            </h3>

            <div className="questions-list">
              {checklist.questions.map((q, index) => (
                <div key={q.id} className="question-item">
                  <div className="question-header">
                    <span className="question-number">Q{index + 1}</span>
                    <span className="question-type">{q.type}</span>
                  </div>
                  <div className="question-text">{q.question}</div>
                  <div className="question-answer">
                    <span className="answer-label">Answer:</span>
                    <span className="answer-value">{q.answer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="modal-footer-VCM">
          <button className="modal-btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="modal-btn-primary" onClick={handleDownloadPDF}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
