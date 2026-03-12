import React, { useEffect, useState, useMemo } from "react";
import "../style/AllEmployees.css";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/Action/userAction";

export default function AllEmployees() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    role: "",
    site: "",
    shift: "",
  });

  // ===============================
  // Fetch Users on Mount
  // ===============================
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // ===============================
  // Filtering Logic
  // ===============================
  const filteredEmployees = useMemo(() => {
    return users?.filter((emp) => {
      return (
        emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        emp.departmentName
          ?.toLowerCase()
          .includes(filters.department.toLowerCase()) &&
        emp.roleName?.toLowerCase().includes(filters.role.toLowerCase()) &&
        (filters.site === "" || true) && // no site in API yet
        emp.shiftName?.toLowerCase().includes(filters.shift.toLowerCase())
      );
    });
  }, [users, searchTerm, filters]);

  return (
    <div className="employees-page">
      {/* HEADER */}
      <div className="employees-header">
        <h1 className="employees-title">All Employees</h1>
      </div>

      {/* FILTERS */}
      <div className="employees-filters">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search employee..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-grid">
          <div className="filter-field">
            <label>Department</label>
            <input
              type="text"
              placeholder="Department"
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label>Role</label>
            <input
              type="text"
              placeholder="Role"
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label>Site</label>
            <input
              type="text"
              placeholder="Site"
              value={filters.site}
              onChange={(e) => handleFilterChange("site", e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label>Shift</label>
            <input
              type="text"
              placeholder="Shift"
              value={filters.shift}
              onChange={(e) => handleFilterChange("shift", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="employees-table-container">
        {loading ? (
          <p>Loading employees...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <table className="employees-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Role</th>
                <th>Organization</th>
                <th>Shift</th>
                <th>Code</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees?.map((emp) => (
                <tr key={emp.userId}>
                  <td className="employee-name">{emp.fullName}</td>
                  <td>{emp.departmentName}</td>
                  <td>{emp.roleName}</td>
                  <td>{emp.organizationName}</td>
                  <td>{emp.shiftName || "N/A"}</td>
                  <td className="employee-code">{emp.employeeCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
