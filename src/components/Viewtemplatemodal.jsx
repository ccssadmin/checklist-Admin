import React from "react";
import { X } from "lucide-react";
import "../style/Viewtemplatemodal.css";

export default function ViewTemplateModal({ template, onClose }) {
  const renderCanvasView = (template) => {
    if (!Array.isArray(template.sections) || template.sections.length === 0) {
      return <div className="template-empty">No sections added</div>;
    }

    return (
      <div className="canvas-view">
        {template.sections.map((section, sIndex) => (
          <div key={section.section_id} className="canvas-section">
            <h5 className="canvas-section-title">
              {sIndex + 1}. {section.section_name}
            </h5>

            <ul className="canvas-question-list">
              {section.items.map((item, i) => {
                const field = item.fields?.[0];

                return (
                  <li key={item.item_id || i} className="canvas-question">
                    <span className="question-index">{i + 1}</span>

                    <span className="question-label">{item.label}</span>

                    <span className="question-type">
                      {field?.field_type || ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderExcelView = (template) => {
    if (!Array.isArray(template.sections) || template.sections.length === 0) {
      return <div className="template-empty">No sections added</div>;
    }

    const rows = template.sections.flatMap((section) => section.items || []);

    if (rows.length === 0) {
      return <div className="template-empty">No rows found</div>;
    }

    const columns = rows[0]?.fields || [];

    return (
      <div className="excel-view">
        <div className="excel-table-container">
          <table className="excel-view-table">
            <thead>
              <tr>
                <th className="excel-col-sno">S.No</th>

                {columns.map((field) => (
                  <th key={field.field_id} className="excel-col-dynamic">
                    {field.field_name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.item_id || rowIndex}>
                  <td className="excel-sno">{rowIndex + 1}</td>

                  {row.fields?.map((field) => {
                    if (field.field_type === "PHOTO") {
                      return (
                        <td key={field.field_id} className="excel-cell center">
                          {row.image_url ? (
                            <img
                              src={row.image_url}
                              alt="preview"
                              className="excel-photo-preview"
                            />
                          ) : (
                            "📷"
                          )}
                        </td>
                      );
                    }
                    if (field.field_type === "CHECKBOX") {
                      return (
                        <td key={field.field_id} className="excel-cell center">
                          ☐
                        </td>
                      );
                    }

                    if (field.field_type === "BARCODE") {
                      return (
                        <td key={field.field_id} className="excel-cell center">
                          🏷
                        </td>
                      );
                    }

                    return (
                      <td key={field.field_id} className="excel-cell">
                        <input
                          type="text"
                          className="excel-input"
                          value={field.field_value || ""}
                          placeholder={field.field_type}
                          readOnly
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const getTemplateViewType = (template) => {
    return template.source_type === "EXCEL" ? "EXCEL" : "CANVAS";
  };
  const viewType = getTemplateViewType(template);

  return (
    <div className="template-modal-overlay">
      <div className="template-modal template-modal-large">
        <div className="template-modal-header">
          <div>
            <h3>{template.template_name}</h3>
            <p className="template-muted">
              {template.department?.department_name || "No Department"} •
              Version {template.version}
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <div className="template-modal-body">
          <div className="template-meta-grid">
            <div>
              <label className="meta-label">Status</label>
              <span
                className={`template-status template-status-${(template.status || "draft").toLowerCase()}`}
              >
                {template.status || "Draft"}
              </span>
            </div>
            <div>
              <label className="meta-label">Frequency</label>
              <span className="meta-value">{template.frequency}</span>
            </div>
            <div>
              <label className="meta-label">Checklist Type</label>
              <span className="meta-value">{template.checklist_type}</span>
            </div>
          </div>

          <h4 className="preview-title">
            {viewType === "EXCEL"
              ? "Excel Checklist Preview"
              : "Canvas Checklist Preview"}
          </h4>

          {viewType === "CANVAS"
            ? renderCanvasView(template)
            : renderExcelView(template)}
        </div>

        <div className="template-modal-footer">
          <button onClick={onClose} className="footer-close-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
