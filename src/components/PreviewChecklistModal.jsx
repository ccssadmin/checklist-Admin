import "../style/previewChecklistModal.css";
import { useState, useRef } from "react";

export default function PreviewChecklistModal({
  open,
  onClose,
  viewMode,
  questions,
  excelColumns = [],
  excelRows = [],
  checklistType,
  dailyCheckDays = 0,
}) {
  const [activeImage, setActiveImage] = useState(null); // preview url
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  if (!open) return null;

  return (
    <div className="preview-backdrop" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="preview-header">
          <h3>Checklist Preview</h3>
          <button className="preview-btn" onClick={onClose}>
            Close
          </button>
        </div>

        {/* ================= CANVAS PREVIEW ================= */}
        {viewMode === "canvas" && (
          <>
            {questions.length === 0 ? (
              <p className="preview-muted">
                No questions added to this checklist.
              </p>
            ) : (
              questions.map((q, i) => (
                <div key={q.id} className="preview-question">
                  <div className="preview-q-header">
                    <b>
                      {i + 1}. {q.label}
                    </b>
                    <span className="preview-type">{q.type}</span>
                  </div>

                  {q.type === "Yes/No" && (
                    <>
                      <label>
                        <input type="radio" disabled /> Yes
                      </label>
                      <label>
                        <input type="radio" disabled /> No
                      </label>
                    </>
                  )}

                  {q.type === "Numeric" && <input type="number" disabled />}

                  {q.type === "Text" && <input type="text" disabled />}

                  {q.type === "Photo" && (
                    <div className="preview-muted">📷 Photo upload</div>
                  )}

                  {q.type === "Barcode" && (
                    <div className="preview-muted">🏷 Barcode scan</div>
                  )}
                </div>
              ))
            )}
          </>
        )}

        {/* ================= EXCEL PREVIEW ================= */}
        {viewMode === "excel" && (
          <>
            {excelRows.length === 0 ? (
              <p className="preview-muted">
                No Excel checklist data available.
              </p>
            ) : (
              <div className="preview-excel-wrapper">
                <table className="preview-excel-table">
                  <thead>
                    <tr>
                      {excelColumns.map((col) => (
                        <th key={col.id}>{col.name}</th>
                      ))}

                      {checklistType === "daily" &&
                        dailyCheckDays > 0 &&
                        Array.from({ length: dailyCheckDays }).map((_, i) => (
                          <th key={`day-${i}`}>Day {i + 1}</th>
                        ))}
                    </tr>
                  </thead>

                  <tbody>
                    {excelRows.map((row) => (
                      <tr key={row.id}>
                        {excelColumns.map((col) => {
                          const cellValue = row.data[col.id];

                          return (
                            <td key={col.id}>
                              {/* S.No */}
                              {col.id === 1 && row.sno}

                              {/* PHOTO */}
                              {col.type === "photo" && cellValue?.preview && (
                                <img
                                  src={cellValue.preview}
                                  alt="preview"
                                  className="preview-photo clickable"
                                  onClick={() => {
                                    setActiveImage(cellValue.preview);
                                    setPosition({ x: 0, y: 0 });
                                  }}
                                />
                              )}

                              {/* YES / NO */}
                              {col.type === "yesno" && (
                                <span>
                                  {row.data[col.id] === true
                                    ? "Yes"
                                    : row.data[col.id] === false
                                      ? "No"
                                      : "—"}
                                </span>
                              )}

                              {/* BARCODE */}
                              {col.type === "barcode" && (
                                <span className="preview-barcode">
                                  🏷 {cellValue || "—"}
                                </span>
                              )}

                              {/* TEXT / NUMBER */}
                              {col.type !== "photo" &&
                                col.type !== "checkbox" &&
                                col.type !== "barcode" &&
                                col.id !== 1 &&
                                typeof cellValue !== "object" &&
                                (cellValue || "—")}
                            </td>
                          );
                        })}

                        {checklistType === "daily" &&
                          dailyCheckDays > 0 &&
                          Array.from({ length: dailyCheckDays }).map((_, i) => (
                            <td key={`daycell-${i}`}>
                              <input type="checkbox" disabled />
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      {/* ================= IMAGE VIEWER ================= */}
      {activeImage && (
        <div
          className="image-viewer-backdrop"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="image-viewer"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => {
              setIsDragging(true);
              dragStart.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y,
              };
            }}
            onMouseMove={(e) => {
              if (!isDragging) return;
              setPosition({
                x: e.clientX - dragStart.current.x,
                y: e.clientY - dragStart.current.y,
              });
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <img
              src={activeImage}
              alt="Large preview"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
              draggable={false}
            />

            <button
              className="image-viewer-close"
              onClick={() => setActiveImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
