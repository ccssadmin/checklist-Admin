import React, { useState, useEffect } from "react";
import "../style/AllCheckLists.css";
import { Download, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyAssignments } from "../redux/Action/checklistAction";
import {
  fetchDepartments,
  fetchRoles,
  fetchShifts,
} from "../redux/Action/masterAction";
export default function AllChecklists() {
  const dispatch = useDispatch();

  const { assignments } = useSelector((state) => state.assignments);
  const {
    departments = [],
    roles = [],
    shifts = [],
  } = useSelector((state) => state.master || {});
  const [selectedView, setSelectedView] = useState("Day");
  const [searchTerm, setSearchTerm] = useState("");
  // Filter states
  const [filters, setFilters] = useState({
    department: "",
    role: "",
    date: "",
    shift: "",
    status: "",
  });

  useEffect(() => {
    dispatch(fetchMyAssignments());
    dispatch(fetchDepartments());
    dispatch(fetchRoles());
    dispatch(fetchShifts());
  }, [dispatch]);

  useEffect(() => {
    console.log("📦 ASSIGNMENTS DATA:", assignments);
  }, [assignments]);

  const handleClearFilters = () => {
    setFilters({
      department: "",
      role: "",
      date: "",
      shift: "",
      status: "",
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredAssignments = assignments
    ?.slice()
    ?.sort((a, b) => new Date(b.originalDueDate) - new Date(a.originalDueDate))
    ?.filter((item) => {
      const matchesFilters =
        (filters.department === "" ||
          item.assignedToDepartmentName === filters.department) &&
        (filters.role === "" || item.assignedToRoleName === filters.role) &&
        (filters.shift === "" || item.shiftName === filters.shift) &&
        (filters.status === "" || item.executionStatus === filters.status) &&
        (filters.date === "" ||
          (item.originalDueDate &&
            new Date(item.originalDueDate).toISOString().slice(0, 10) ===
              filters.date));

      const matchesSearch =
        searchTerm === "" ||
        item.assignmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignedToDepartmentName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.assignedToRoleName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.shiftName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.executionStatus?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilters && matchesSearch;
    });

  return (
    <div className="all-checklists-page">
      {/* HEADER */}{" "}
      <div className="page-header">
        {" "}
        <div>
          {" "}
          <h1 className="page-title">All Checklists</h1>{" "}
        </div>{" "}
        <button className="export-btn">
          {" "}
          <Download size={16} />
          Export Data{" "}
        </button>{" "}
      </div>
      {/* FILTERS CONTAINER */}
      <div className="filters-container">
        {/* SEARCH BAR */}
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search checklists..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FILTERS */}
        <div className="filter-content">
          <div className="filter-grid">
            {/* Department */}
            <div className="filter-field">
              <label>Department</label>
              <select
                value={filters.department}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.deptName}>
                    {dept.deptName}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div className="filter-field">
              <label>Role</label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role.roleId} value={role.roleName}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="filter-field">
              <label>Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>

            {/* Shift */}
            <div className="filter-field">
              <label>Shift</label>
              <select
                value={filters.shift}
                onChange={(e) => handleFilterChange("shift", e.target.value)}
              >
                <option value="">All Shifts</option>
                {shifts.map((shift) => (
                  <option key={shift.shiftId} value={shift.shiftName}>
                    {shift.shiftName}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="filter-field">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="COMPLETED">Completed</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* RESULTS HEADER */}
      <div className="results-header">
        <div className="results-info">
          <span className="results-count">
            Showing {filteredAssignments?.length || 0} checklists{" "}
          </span>

          <div className="view-options">
            <span className="view-label">View by:</span>
            <div className="view-tabs">
              {["Day", "Week", "Month", "Shift"].map((view) => (
                <button
                  key={view}
                  className={`view-tab ${
                    selectedView === view ? "active" : ""
                  }`}
                  onClick={() => setSelectedView(view)}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="clear-filters-btn" onClick={handleClearFilters}>
          <span>🔄</span>
          Clear Filters
        </button>
      </div>
      {/* TABLE */}
      <div className="table-container">
        <table className="checklists-table">
          <thead>
            <tr>
              <th>Checklist</th>
              <th>Assigned To Department</th>
              <th>Assigned To Role</th>
              <th>Shift</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssignments.map((checklist) => (
              <tr key={checklist.assignmentId}>
                <td>
                  <div className="checklist-name">
                    {checklist.assignmentName}
                  </div>
                </td>

                <td>
                  {departments.find(
                    (d) => d.departmentId === checklist.assignedToDepartmentId,
                  )?.deptName || "-"}
                </td>
                <td>
                  {roles.find((r) => r.roleId === checklist.assignedToRoleId)
                    ?.roleName || "-"}
                </td>
                <td>{checklist.shiftName}</td>

                <td>
                  {checklist.originalDueDate
                    ? new Date(checklist.originalDueDate).toLocaleDateString(
                        "en-GB",
                      )
                    : "-"}
                </td>

                <td>
                  <span
                    className={`status-badge status-${(
                      checklist.executionStatus || ""
                    )
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    {checklist.executionStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
