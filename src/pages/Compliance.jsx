import React, { useState } from "react";
import {
  FunnelFill,
  FileEarmarkSpreadsheet,
  FilePdf,
} from "react-bootstrap-icons";
import "../style/Compliance.css";
import { exportExcel, exportPDF } from "../utils/exportUtils";

const ComplianceAudit = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Filters
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Sample audit data
  const auditData = [
    {
      id: 1,
      timestamp: "Jan 26, 2026 10:53:50",
      user: "John Manager",
      action: "Created Checklist",
      actionType: "created",
      details: "Safety Equipment Inspection - v1.0",
      department: "Safety",
    },
    {
      id: 2,
      timestamp: "Jan 26, 2026 09:53:50",
      user: "Sarah Johnson",
      action: "Updated Schedule",
      actionType: "updated",
      details: "Rescheduled Quality Control - Line A to Jan 28, 2025",
      department: "Quality",
    },
    {
      id: 3,
      timestamp: "Jan 26, 2026 08:53:50",
      user: "Mike Davis",
      action: "Completed Checklist",
      actionType: "completed",
      details: "Maintenance Checklist - All items passed",
      department: "Maintenance",
    },
    {
      id: 4,
      timestamp: "Jan 28, 2026 06:53:50",
      user: "Tom Wilson",
      action: "Failed Checklist",
      actionType: "failed",
      details: "Production Line Audit - Temperature threshold exceeded",
      department: "Production",
    },
    {
      id: 5,
      timestamp: "Jan 28, 2026 04:53:50",
      user: "Emma Brown",
      action: "Created Work Order",
      actionType: "created",
      details: "Hydraulic Pressure Below Minimum - WO#1234",
      department: "Maintenance",
    },
    {
      id: 6,
      timestamp: "Jan 28, 2026 02:53:50",
      user: "John Manager",
      action: "Modified Template",
      actionType: "modified",
      details: "Updated Safety Inspection template - Added 2 questions",
      department: "Safety",
    },
    {
      id: 7,
      timestamp: "Jan 29, 2026 09:15:22",
      user: "Sarah Johnson",
      action: "Created Checklist",
      actionType: "created",
      details: "Fire Safety Audit - Warehouse Block B",
      department: "Safety",
    },
    {
      id: 8,
      timestamp: "Jan 29, 2026 11:40:10",
      user: "Mike Davis",
      action: "Updated Schedule",
      actionType: "updated",
      details: "Maintenance Schedule updated for Line C",
      department: "Maintenance",
    },
    {
      id: 9,
      timestamp: "Jan 30, 2026 08:05:44",
      user: "Emma Brown",
      action: "Completed Checklist",
      actionType: "completed",
      details: "Electrical Safety Checklist – No issues found",
      department: "Safety",
    },
    {
      id: 10,
      timestamp: "Jan 30, 2026 14:22:19",
      user: "Tom Wilson",
      action: "Failed Checklist",
      actionType: "failed",
      details: "Quality Audit – Defect rate exceeded limit",
      department: "Quality",
    },
    {
      id: 11,
      timestamp: "Jan 31, 2026 10:12:01",
      user: "John Manager",
      action: "Modified Template",
      actionType: "modified",
      details: "Updated Quality Inspection template – Added tolerance check",
      department: "Quality",
    },
    {
      id: 12,
      timestamp: "Jan 31, 2026 16:55:33",
      user: "Alex Carter",
      action: "Created Work Order",
      actionType: "created",
      details: "Cooling System Leak detected – WO#1456",
      department: "Maintenance",
    },
    {
      id: 13,
      timestamp: "Feb 01, 2026 09:30:48",
      user: "Rachel Green",
      action: "Completed Checklist",
      actionType: "completed",
      details: "Production Line Startup Checklist – Approved",
      department: "Production",
    },
    {
      id: 14,
      timestamp: "Feb 01, 2026 13:18:05",
      user: "David Miller",
      action: "Updated Schedule",
      actionType: "updated",
      details: "Rescheduled Safety Drill to Feb 5, 2026",
      department: "Safety",
    },
    {
      id: 15,
      timestamp: "Feb 02, 2026 11:09:27",
      user: "Sophia Lee",
      action: "Failed Checklist",
      actionType: "failed",
      details: "Machine Guarding Audit – Missing safety cover",
      department: "Production",
    },
    {
      id: 16,
      timestamp: "Feb 02, 2026 15:41:58",
      user: "John Manager",
      action: "Created Checklist",
      actionType: "created",
      details: "Emergency Exit Inspection – Admin Block",
      department: "Safety",
    },
  ];

  const filteredData = auditData.filter((record) => {
    const matchDepartment =
      !departmentFilter ||
      record.department.toLowerCase().includes(departmentFilter.toLowerCase());

    const matchAction =
      !actionFilter ||
      record.action.toLowerCase().includes(actionFilter.toLowerCase());

    // 🔑 Single-date match (ignore time)
    const matchDate = selectedDate
      ? new Date(record.timestamp).toISOString().slice(0, 10) === selectedDate
      : true;

    return matchDepartment && matchAction && matchDate;
  });

  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;

  const paginatedData = filteredData.slice(startIndex, endIndex);

  const getActionBadgeClass = (actionType) => {
    const classes = {
      created: "badge-created",
      updated: "badge-updated",
      completed: "badge-completed",
      failed: "badge-failed",
      modified: "badge-modified",
    };
    return classes[actionType] || "badge-default";
  };

  const getActionText = (action) => {
    return action;
  };

  const exportData = filteredData.map((item) => ({
    Timestamp: item.timestamp,
    User: item.user,
    Action: item.action,
    Details: item.details,
    Department: item.department,
  }));

  const getPaginationPages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="compliance-container">
      {/* Header */}
      <div className="compliance-header">
        <div>
          <h1 className="compliance-title">Compliance & Audit</h1>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <FunnelFill className="filter-icon" />
          <span className="filter-title">Filters</span>
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Department</label>
            <input
              type="text"
              className="filter-input"
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Action Type</label>
            <input
              type="text"
              className="filter-input"
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="date-input-wrapper">
            <div className="filter-group">
              <label className="filter-label">Date</label>
              <input
                type="date"
                className="filter-input"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="filter-actions">
            <button
              className="export-btn"
              onClick={() => exportExcel(exportData, "compliance_audit.xls")}
            >
              <FileEarmarkSpreadsheet className="btn-icon" />
              Excel
            </button>

            <button
              className="export-btn"
              onClick={() => exportPDF(exportData, "compliance_audit.pdf")}
            >
              <FilePdf className="btn-icon" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Audit Trail Table */}
      <div className="audit-trail-section">
        <div className="audit-header">
          <div className="audit-info-icon">ℹ</div>
          <h2 className="audit-title">Audit Trail (6 records)</h2>
        </div>

        <div className="table-wrapper">
          <table className="audit-table">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>USER</th>
                <th>ACTION</th>
                <th>DETAILS</th>
                <th>DEPARTMENT</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((record) => (
                <tr key={record.id}>
                  <td className="timestamp-cell">{record.timestamp}</td>
                  <td className="user-cell">{record.user}</td>
                  <td>
                    <span
                      className={`action-badge ${getActionBadgeClass(record.actionType)}`}
                    >
                      {getActionText(record.action)}
                    </span>
                  </td>
                  <td className="details-cell">{record.details}</td>
                  <td className="department-cell">{record.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-wrapper">
          <div className="pagination-info">
            Showing {paginatedData.length} of {totalRecords} records
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>

            {getPaginationPages().map((page, index) =>
              page === "..." ? (
                <span key={index} className="pagination-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={index}
                  className={`pagination-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ),
            )}

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceAudit;
