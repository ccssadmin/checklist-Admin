import React, { useEffect, useState, useRef } from "react";
import "../style/ApprovalQueue.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExecutionQuestionAnswers,
  fetchExecutionDetailsById,
  approveExecution,
  rejectExecution,
} from "../redux/Action/executionAction";
import { toast } from "react-toastify";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

/* ============================================================
   DETAIL PANEL (renders inline inside card — replaces modal)
   ============================================================ */
function DetailPanel({ checklist, onDecision, onClose }) {
  const [comment, setComment] = useState("");
  const commentRef = useRef(null);

  const isCommentFilled = comment.trim().length > 0;

  const focusComment = () => {
    commentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    commentRef.current?.focus();
  };

  const handleApprove = () => {
    if (!isCommentFilled) {
      focusComment();
      return;
    }
    onDecision(checklist.executionId, "approved", comment);
  };

  const handleReject = () => {
    if (!isCommentFilled) {
      focusComment();
      return;
    }
    onDecision(checklist.executionId, "rejected", comment);
  };

  const isExcel =
    checklist.sourceType &&
    checklist.sourceType.toUpperCase().trim() === "EXCEL";

  const groupedExcelRows = isExcel
    ? [...(checklist.questions || [])].sort(
        (a, b) => (a.sequenceNo || 0) - (b.sequenceNo || 0),
      )
    : [];

  return (
    <div className="approval-detail-panel">
      {/* INFO GRID */}
      <div className="checklist-info-grid">
        <div className="info-item">
          <div className="info-label">Checklist</div>
          <div className="info-value">{checklist.name}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Submitted By</div>
          <div className="info-value">{checklist.submittedBy}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Department</div>
          <div className="info-value">{checklist.department}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Submitted At</div>
          <div className="info-value">{checklist.submittedAt}</div>
        </div>
      </div>

      <div className="review-divider" />

      {/* ANSWERS */}
      <div className="answers-review-section">
        <h3 className="answers-title">Answers Review</h3>
        <div className="answers-list">
          {isExcel ? (
            <div className="excel-table-wrapper">
              {groupedExcelRows.length > 0 && (
                <table className="excel-table">
                  <thead>
                    <tr>
                      <th>S.No</th>

                      {[...(groupedExcelRows?.[0]?.fields || [])]
                        .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
                        .map((field) => (
                          <th key={field.fieldId}>{field.fieldName}</th>
                        ))}
                    </tr>
                  </thead>

                  <tbody>
                    {groupedExcelRows.map((row) => (
                      <tr key={row.itemId}>
                        <td>{row.sequenceNo}</td>

                        {[...(row.fields || [])]
                          .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
                          .map((field) => {
                            const answer = (row.answers || []).find(
                              (a) => a.fieldId === field.fieldId,
                            );

                            return (
                              <td key={field.fieldId}>
                                {field.fieldType === "PHOTO" ? (
                                  answer?.photoUrl ? (
                                    <img
                                      src={answer.photoUrl}
                                      alt="User Upload"
                                      style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                      }}
                                    />
                                  ) : row.imageUrl ? (
                                    <img
                                      src={row.imageUrl}
                                      alt="Checklist"
                                      style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                      }}
                                    />
                                  ) : (
                                    "-"
                                  )
                                ) : (
                                  answer?.answerValue || field.fieldValue || "-"
                                )}
                              </td>
                            );
                          })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            (() => {
              let questionNumber = 0;

              const sortedQuestions = [...(checklist.questions || [])].sort(
                (a, b) => (a.sequenceNo || 0) - (b.sequenceNo || 0),
              );

              return sortedQuestions.map((q, index) => {
                const fieldType = q.fields?.[0]?.fieldType;

                /* LABEL */
                if (fieldType === "LABEL") {
                  return (
                    <div key={q.itemId || index} className="label-heading">
                      {q.itemName}
                    </div>
                  );
                }

                questionNumber++;

                return (
                  <div key={q.itemId || index} className="answer-item">
                    <div className="answer-header">
                      <div className="answer-number">{questionNumber}</div>

                      <div className="answer-question-content">
                        <div className="answer-question-text">
                          {q.itemName}

                          {q.isMandatory && (
                            <span className="required-badge">Required</span>
                          )}
                        </div>

                        <div className="answer-type">Type: {fieldType}</div>
                      </div>
                    </div>

                    <div className="answer-value-box">
                      <span className="answer-value-label">Answer:</span>

                      <span className="answer-value">
                        {fieldType === "PHOTO" ? (
                          q.answers?.[0]?.answerValue ? (
                            <img
                              src={q.answers[0].answerValue}
                              alt="Uploaded"
                              style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                marginTop: "6px",
                              }}
                            />
                          ) : (
                            <span className="no-answer">No photo uploaded</span>
                          )
                        ) : (
                          q.answers?.[0]?.answerValue || (
                            <span className="no-answer">
                              No answer provided
                            </span>
                          )
                        )}
                      </span>
                    </div>
                  </div>
                );
              });
            })()
          )}
        </div>
      </div>

      {/* COMMENT — only for pending */}
      {checklist.status === "PENDING_APPROVAL" && (
        <>
          <div className="comment-section">
            <label className="comment-label">
              Approval / Rejection Comment{" "}
              <span className="required-star">*</span>
            </label>
            <textarea
              ref={commentRef}
              className="comment-textarea"
              placeholder="Enter your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
            />
            <div className="comment-helper">
              Comment is mandatory to proceed
            </div>
          </div>

          <div className="warning-box">
            <AlertCircle size={18} />
            <span>
              Once approved or rejected, this action cannot be undone.
            </span>
          </div>
        </>
      )}

      {/* PANEL FOOTER */}
      <div className="panel-footer">
        {checklist.status === "PENDING_APPROVAL" ? (
          <>
            <button
              className="reject-btn"
              disabled={!isCommentFilled}
              onClick={!isCommentFilled ? focusComment : handleReject}
            >
              <XCircle size={18} /> Reject
            </button>
            <button
              className="approve-btn"
              disabled={!isCommentFilled}
              onClick={!isCommentFilled ? focusComment : handleApprove}
            >
              <CheckCircle size={18} /> Approve
            </button>
          </>
        ) : (
          <button className="close-panel-btn" onClick={onClose}>
            <X size={16} /> Close
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function ApprovalQueue() {
  const dispatch = useDispatch();
  const { loading, executionData } = useSelector((state) => state.execution);

  const [activeTab, setActiveTab] = useState("PENDING");
  const [expandedId, setExpandedId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailMap, setDetailMap] = useState({});

  useEffect(() => {
    dispatch(fetchExecutionQuestionAnswers());
  }, [dispatch]);

  const filteredApprovals =
    executionData?.filter((item) => {
      if (activeTab === "PENDING")
        return (
          item.approvalStatus === "PENDING_APPROVAL" &&
          item.executionStatus === "SUBMITTED"
        );
      if (activeTab === "APPROVED") return item.approvalStatus === "APPROVED";
      if (activeTab === "REJECTED") return item.approvalStatus === "REJECTED";
      return false;
    }) || [];

  const stats = {
    pendingReview: executionData?.filter(
      (i) =>
        i.approvalStatus === "PENDING_APPROVAL" &&
        i.executionStatus === "SUBMITTED",
    ).length,
    approvedToday: executionData?.filter((i) => i.approvalStatus === "APPROVED")
      .length,
    rejected: executionData?.filter((i) => i.approvalStatus === "REJECTED")
      .length,
  };

  const handleToggle = async (approval) => {
    const id = approval.executionId;

    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    if (detailMap[id]) {
      setExpandedId(id);
      return;
    }

    setExpandedId(id);
    setDetailLoading(true);

    const resultAction = await dispatch(fetchExecutionDetailsById(id));

    if (fetchExecutionDetailsById.fulfilled.match(resultAction)) {
      const data = resultAction.payload.data?.[0];
      if (data) {
        const mapped = {
          executionId: data.executionId,
          status: data.approvalStatus,
          sourceType: data.sourceType || "",
          name: data.templateName,
          submittedBy: data.executedBy,
          submittedAt: new Date(data.executedAt).toLocaleString(),
          department: data.checklistType,
          questions: data.questions || [],
        };

        console.log("Mapped Detail:", mapped);

        setDetailMap((prev) => ({ ...prev, [id]: mapped }));
      }
    }

    setDetailLoading(false);
  };

  const handleDecision = async (executionId, decision, remark) => {
    let result;
    if (decision === "approved") {
      result = await dispatch(approveExecution({ executionId, remark }));
    } else {
      result = await dispatch(rejectExecution({ executionId, remark }));
    }

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Execution updated successfully ✅");
      setExpandedId(null);
      setDetailMap((prev) => {
        const next = { ...prev };
        delete next[executionId];
        return next;
      });
      dispatch(fetchExecutionQuestionAnswers());
    } else {
      toast.error("Failed to update execution ❌");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpandedId(null);
  };

  return (
    <div className="approval-queue-page">
      <div className="aq-header">
        <h1 className="aq-title">Approval Queue</h1>
      </div>

      <div className="status-tabs">
        <button
          className={`status-tab ${activeTab === "PENDING" ? "active" : ""}`}
          onClick={() => handleTabChange("PENDING")}
        >
          Pending
          <span className="tab-count pending">{stats.pendingReview}</span>
        </button>
        <button
          className={`status-tab ${activeTab === "APPROVED" ? "active" : ""}`}
          onClick={() => handleTabChange("APPROVED")}
        >
          Approved
          <span className="tab-count approved">{stats.approvedToday}</span>
        </button>
        <button
          className={`status-tab ${activeTab === "REJECTED" ? "active" : ""}`}
          onClick={() => handleTabChange("REJECTED")}
        >
          Rejected
          <span className="tab-count rejected">{stats.rejected}</span>
        </button>
      </div>

      <div className="pending-approvals-section">
        <h2 className="section-title">
          {activeTab === "PENDING" && "Pending Approvals"}
          {activeTab === "APPROVED" && "Approved Checklists"}
          {activeTab === "REJECTED" && "Rejected Checklists"}
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="approvals-list">
            {filteredApprovals.map((approval) => {
              const isOpen = expandedId === approval.executionId;
              const detail = detailMap[approval.executionId];

              return (
                <div
                  key={approval.executionId}
                  className={`approval-card ${isOpen ? "expanded" : ""}`}
                >
                  {/* CARD TOP ROW */}
                  <div className="approval-card-row">
                    <div className="approval-content">
                      <h3 className="approval-name">{approval.templateName}</h3>
                      <div className="approval-meta">
                        <span className="meta-item">
                          Executed By: <strong>{approval.executedBy}</strong>
                        </span>
                        <span className="meta-divider">•</span>
                        <span className="meta-item">
                          {new Date(approval.executedAt).toLocaleString()}
                        </span>
                        <span className="meta-divider">•</span>
                        <span className="meta-item">
                          {approval.checklistType}
                        </span>
                      </div>
                    </div>

                    <button
                      className={`review-btn ${isOpen ? "active" : ""}`}
                      onClick={() => handleToggle(approval)}
                    >
                      {activeTab === "PENDING" ? "Review" : "View"}
                      {isOpen ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>
                  </div>

                  {/* INLINE EXPANDABLE DETAIL */}
                  {isOpen &&
                    (detailLoading && !detail ? (
                      <div className="panel-loading">Loading details…</div>
                    ) : detail ? (
                      <DetailPanel
                        checklist={detail}
                        onDecision={handleDecision}
                        onClose={() => setExpandedId(null)}
                      />
                    ) : null)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
