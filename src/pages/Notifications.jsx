import React, { useState } from "react";
import {
  Bell,
  FileText,
  Person,
  Calendar3,
  CheckCircleFill,
  XCircleFill,
  ExclamationCircleFill,
} from "react-bootstrap-icons";
import "../style/Notifications.css";

const Notifications = () => {
  const [filterType, setFilterType] = useState("all");
  // all | new | unread

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "reschedule-request",
      isNew: true,
      priority: "High",
      title: "Safety Equipment Inspection",
      checklistId: "ICL-1045",
      requestedBy: "John Smith (Operator)",
      originalDate: "Jan 23, 2025 10:00 AM",
      requestedDate: "Jan 27, 2025 2:00 PM",
      reason: "Equipment maintenance scheduled during original time slot",
      timestamp: "2 hours ago",
      icon: <ExclamationCircleFill />,
      iconColor: "warning",
    },
    {
      id: 2,
      type: "reschedule-request",
      isNew: true,
      priority: "Medium",
      title: "Production Line Audit",
      checklistId: "ICL-1078",
      requestedBy: "Sarah Johnson (User)",
      originalDate: "Jan 24, 2025 9:00 AM",
      requestedDate: "Jan 26, 2025 11:00 AM",
      reason: "Shift change - New operator assigned to evening shift",
      timestamp: "5 hours ago",
      icon: <ExclamationCircleFill />,
      iconColor: "warning",
    },
    {
      id: 3,
      type: "admin-reschedule",
      isNew: false,
      priority: "High",
      title: "Quality Control - Line B",
      checklistId: "ICL-1092",
      rescheduledBy: "Admin",
      originalDate: "Jan 23, 2025 1:00 PM",
      newDate: "Jan 25, 2025 4:00 PM",
      reason: "Failed checklist - Quality threshold not met",
      timestamp: "1 day ago",
      icon: <Calendar3 />,
      iconColor: "info",
    },
    {
      id: 4,
      type: "reschedule-approved",
      isNew: false,
      title: "Preventive Maintenance",
      checklistId: "ICL-1065",
      approvedBy: "Admin",
      requestedBy: "Emma Brown",
      originalDate: "Jan 22, 2025 8:00 AM",
      newDate: "Jan 26, 2025 10:00 AM",
      timestamp: "1 day ago",
      icon: <CheckCircleFill />,
      iconColor: "success",
    },
    {
      id: 5,
      type: "reschedule-rejected",
      isNew: false,
      title: "Hygiene Inspection",
      checklistId: "ICL-1058",
      rejectedBy: "Admin",
      requestedBy: "Mike Davis",
      reason: "Parts already delivered - proceed with original schedule",
      timestamp: "2 days ago",
      icon: <XCircleFill />,
      iconColor: "danger",
    },
    {
      id: 6,
      type: "checklist-failed",
      isNew: true,
      priority: "Critical",
      title: "Equipment Temperature Check",
      checklistId: "ICL-1035",
      failureReason: "Temperature exceeded critical threshold",
      timestamp: "2 hours ago",
      icon: <XCircleFill />,
      iconColor: "danger",
    },
  ]);

  const newNotifications = notifications.filter((n) => n.isNew).length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filterType === "new") return notification.isNew;
    if (filterType === "unread") return !notification.isRead;
    return true;
  });

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, isNew: false } : n)),
    );
  };

  return (
    <div className="notifications-container">
      {/* Header */}
      <div className="notifications-header">
        <div>
          <h1 className="notifications-title">Notifications</h1>
        </div>

        <div className="notifications-stats">
          <div
            className={`stat-badge new ${filterType === "new" ? "active" : ""}`}
            onClick={() =>
              setFilterType((prev) => (prev === "new" ? "all" : "new"))
            }
          >
            <Bell className="stat-icon-bell" />
            {newNotifications} New Notifications
          </div>

          <div
            className={`stat-count ${filterType === "unread" ? "active" : ""}`}
            onClick={() =>
              setFilterType((prev) => (prev === "unread" ? "all" : "unread"))
            }
          >
            {unreadCount} Unread
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-card ${notification.type} ${notification.isNew ? "new" : ""}`}
          >
            {/* Icon Section */}
            <div className={`notification-icon ${notification.iconColor}`}>
              {notification.icon}
            </div>

            {/* Content Section */}
            <div className="notification-content">
              {/* Header */}
              <div className="notification-header">
                <div className="notification-title-row">
                  {notification.isNew && <span className="badge-new">NEW</span>}
                  {notification.type === "reschedule-request" && (
                    <span className="badge-type">Reschedule Request</span>
                  )}
                  {notification.type === "admin-reschedule" && (
                    <span className="badge-type admin">Admin Reschedule</span>
                  )}
                  {notification.type === "reschedule-approved" && (
                    <span className="badge-type approved">
                      Reschedule Approved
                    </span>
                  )}
                  {notification.type === "reschedule-rejected" && (
                    <span className="badge-type rejected">
                      Reschedule Rejected
                    </span>
                  )}
                  {notification.type === "checklist-failed" && (
                    <span className="badge-type failed">Checklist Failed</span>
                  )}
                  {notification.priority && (
                    <span
                      className={`badge-priority ${notification.priority.toLowerCase()}`}
                    >
                      {notification.priority}
                    </span>
                  )}
                </div>

                <div className="notification-time-wrapper">
                  <span className="notification-time">
                    {notification.timestamp}
                  </span>

                  {!notification.isRead && (
                    <button
                      className="mark-read-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="notification-info">
                <FileText className="info-icon" />
                <h3 className="notification-checklist-title">
                  {notification.title}
                  <span className="checklist-id">
                    {notification.checklistId}
                  </span>
                </h3>
              </div>

              {/* Request Info */}
              {notification.requestedBy && (
                <div className="notification-info">
                  <Person className="info-icon" />
                  <p className="info-text">
                    Requested by {notification.requestedBy}
                  </p>
                </div>
              )}

              {notification.rescheduledBy && (
                <div className="notification-info">
                  <Person className="info-icon" />
                  <p className="info-text">
                    Rescheduled by {notification.rescheduledBy}
                  </p>
                </div>
              )}

              {notification.approvedBy && (
                <div className="notification-approval-info">
                  <CheckCircleFill className="approval-icon" />
                  <p>
                    Request by {notification.requestedBy} approved by{" "}
                    {notification.approvedBy}
                  </p>
                </div>
              )}

              {notification.rejectedBy && (
                <div className="notification-rejection-info">
                  <XCircleFill className="rejection-icon" />
                  <p>
                    Request by {notification.requestedBy} rejected by{" "}
                    {notification.rejectedBy}
                  </p>
                </div>
              )}

              {notification.type === "checklist-failed" && (
                <div className="notification-failure-info">
                  <XCircleFill className="failure-icon" />
                  <p>Checklist execution failed</p>
                </div>
              )}

              {/* Schedule Info */}
              {notification.originalDate && notification.requestedDate && (
                <div className="schedule-grid">
                  <div className="schedule-item">
                    <span className="schedule-label">Original</span>
                    <div className="schedule-value">
                      <Calendar3 className="schedule-icon" />
                      {notification.originalDate}
                    </div>
                  </div>

                  <div className="schedule-item requested">
                    <span className="schedule-label">Requested</span>
                    <div className="schedule-value">
                      <Calendar3 className="schedule-icon" />
                      {notification.requestedDate}
                    </div>
                  </div>
                </div>
              )}

              {notification.originalDate && notification.newDate && (
                <div className="schedule-grid">
                  <div className="schedule-item">
                    <span className="schedule-label">Original</span>
                    <div className="schedule-value">
                      <Calendar3 className="schedule-icon" />
                      {notification.originalDate}
                    </div>
                  </div>

                  <div className="schedule-item new-date">
                    <span className="schedule-label">New Date</span>
                    <div className="schedule-value">
                      <Calendar3 className="schedule-icon" />
                      {notification.newDate}
                    </div>
                  </div>
                </div>
              )}

              {/* Reason */}
              {notification.reason && (
                <div className="notification-reason">
                  <span className="reason-label">
                    {notification.type === "checklist-failed"
                      ? "Failure Reason:"
                      : "Reason:"}
                  </span>
                  <p className="reason-text">{notification.reason}</p>
                </div>
              )}

              {notification.failureReason && (
                <div className="notification-reason failure">
                  <span className="reason-label">Failure Reason:</span>
                  <p className="reason-text">{notification.failureReason}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
