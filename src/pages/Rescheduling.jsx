import React, { useState } from "react";
import {
  Calendar3,
  Clock,
  Person,
  Building,
  ClockHistory,
  CheckCircleFill,
  XCircleFill,
} from "react-bootstrap-icons";
import "../style/Rescheduling.css";
import RejectReasonModal from "../components/RejectReasonModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchRescheduleRequests,
  approveReschedule,
  rejectReschedule,
} from "../redux/Action/rescheduleAction.js";

const Rescheduling = () => {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  // all | new | pending | approved | rejected

  const dispatch = useDispatch();

  const { requests } = useSelector((state) => state.reschedule);

  useEffect(() => {
    dispatch(fetchRescheduleRequests());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveReschedule(id));
  };

  const handleRejectSubmit = (reason) => {
    dispatch(rejectReschedule({ assignmentId: selectedRequestId }));

    setRejectModalOpen(false);
    setSelectedRequestId(null);
  };

  const reschedulingRequests = requests.map((item) => ({
    id: item.assignmentId,
    isNew: item.status === "ACTIVE",
    title: item.templateName,
    requestId: `ID: ${item.assignmentId.substring(0, 6)}`,
    checklistId: "-",
    priority: "Medium Priority",
    priorityType: "medium",
    status:
      item.status === "ACTIVE"
        ? "Pending"
        : item.status === "APPROVED"
          ? "Approved"
          : "Rejected",
    statusType:
      item.status === "ACTIVE"
        ? "pending"
        : item.status === "APPROVED"
          ? "approved"
          : "rejected",
    requestedBy: {
      name: item.requestedBy,
      role: "User",
    },
    department: item.departmentName,
    requestCreated: new Date(item.requestedAt).toLocaleString(),
    originalSchedule: {
      date: item.originalDueDate
        ? new Date(item.originalDueDate).toLocaleDateString()
        : "-",
      time: item.originalDueDate
        ? new Date(item.originalDueDate).toLocaleTimeString()
        : "-",
    },
    requestedSchedule: {
      date: item.requestedDueDate
        ? new Date(item.requestedDueDate).toLocaleDateString()
        : "-",
      time: "-",
    },
    reason: item.reason,
  }));

  const filteredRequests = reschedulingRequests.filter(
    (request) => request.isNew,
  );
  return (
    <div className="rescheduling-container">
      {/* Header */}
      <div className="rescheduling-header">
        <div>
          <h1 className="rescheduling-title">Rescheduling Requests</h1>
        </div>
      </div>

      {/* Request Cards */}
      <div className="requests-list">
        {filteredRequests.length === 0 ? (
          <div className="no-requests">No reschedule requests available</div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="request-card">
              {/* Card Header */}
              <div className="card-header">
                <div className="card-title-section">
                  {request.isNew && <span className="badge-new">NEW</span>}

                  {request.submitted && (
                    <span className="badge-submitted">SUBMITTED</span>
                  )}

                  <h3 className="card-title">{request.title}</h3>
                </div>

                <div className="card-badges">
                  <span className={`badge-priority ${request.priorityType}`}>
                    {request.priority}
                  </span>
                  <span className={`badge-status ${request.statusType}`}>
                    {request.statusType === "pending" && "⏳ "}
                    {request.statusType === "approved" && "✓ "}
                    {request.statusType === "rejected" && "✕ "}
                    {request.status}
                  </span>
                </div>
              </div>

              {/* ID Row */}
              <div className="card-ids">
                {request.requestId} • {request.checklistId}
              </div>

              {/* Card Body */}
              <div className="card-body">
                {/* Left Section - Details */}
                <div className="card-left">
                  <div className="info-item">
                    <Person className="info-icon" />
                    <div>
                      <span className="info-label">Requested By</span>
                      <div className="info-value">
                        {request.requestedBy.name}
                        <span className="role-chip">
                          {request.requestedBy.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="info-item">
                    <Building className="info-icon" />
                    <div>
                      <span className="info-label">Department</span>
                      <div className="info-value">{request.department}</div>
                    </div>
                  </div>

                  <div className="info-item">
                    <ClockHistory className="info-icon" />
                    <div>
                      <span className="info-label">Request Created</span>
                      <div className="info-value">{request.requestCreated}</div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Schedule */}
                <div className="card-right">
                  <div className="schedule-box">
                    <span className="schedule-label">Original Schedule</span>
                    <div className="schedule-info">
                      <Calendar3 className="schedule-icon" />
                      <span>{request.originalSchedule.date}</span>
                      <Clock className="schedule-icon" />
                      <span>{request.originalSchedule.time}</span>
                    </div>
                  </div>

                  <div className="schedule-arrow">↓</div>

                  <div className="schedule-box highlighted">
                    <span className="schedule-label">
                      Requested New Schedule
                    </span>
                    <div className="schedule-info">
                      <Calendar3 className="schedule-icon" />
                      <span>{request.requestedSchedule.date}</span>
                      <Clock className="schedule-icon" />
                      <span>{request.requestedSchedule.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason Section */}
              <div className="reason-section">
                <span className="reason-label">Reason for Rescheduling</span>
                <p className="reason-text">{request.reason}</p>
              </div>

              {/* Approval/Rejection Info */}
              {request.approved && request.statusType === "approved" && (
                <div className="approval-info approved">
                  <CheckCircleFill className="approval-icon" />
                  <span>
                    Approved by {request.approved.by} • {request.approved.when}
                  </span>
                </div>
              )}

              {request.approved && request.statusType === "rejected" && (
                <div className="approval-info rejected">
                  <XCircleFill className="approval-icon" />
                  <div>
                    <div>
                      Rejected by {request.approved.by} •{" "}
                      {request.approved.when}
                    </div>
                    <div className="rejection-reason">
                      Reason: {request.approved.rejectionReason}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {request.statusType === "pending" ? (
                <div className="card-actions">
                  <button
                    className="btn-reject"
                    onClick={() => {
                      setSelectedRequestId(request.id);
                      setRejectModalOpen(true);
                    }}
                  >
                    <XCircleFill /> Reject
                  </button>

                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(request.id)}
                  >
                    <CheckCircleFill /> Approve
                  </button>
                </div>
              ) : (
                <div className="card-actions">
                  <button className="btn-view-details">View Details</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <RejectReasonModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
      />
    </div>
  );
};

export default Rescheduling;
