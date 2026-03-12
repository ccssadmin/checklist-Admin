import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "../style/Home.css";

import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { fetchMyAssignments } from "../redux/Action/checklistAction";
import { fetchExecutionQuestionAnswers } from "../redux/Action/executionAction";
import {
  fetchDepartments,
  fetchPriorities,
} from "../redux/Action/masterAction";
import {
  CheckCircleFill,
  CalendarEventFill,
  XCircleFill,
  ArrowRepeat,
} from "react-bootstrap-icons";

const Home = () => {
  const dispatch = useDispatch();

  const { assignments } = useSelector((state) => state.assignments);
  const { executionData } = useSelector((state) => state.execution);
  const { departments } = useSelector((state) => state.master);

  useEffect(() => {
    dispatch(fetchMyAssignments());
    dispatch(fetchExecutionQuestionAnswers());
    dispatch(fetchDepartments());
    dispatch(fetchPriorities());
  }, [dispatch]);

  const activeChecklists = assignments?.length || 0;

  const scheduledToday = assignments?.filter((item) => {
    if (!item.dueDate) return false;

    const today = new Date().toISOString().split("T")[0];
    return item.dueDate.split("T")[0] === today;
  }).length;

  const failedChecklists = executionData?.filter(
    (item) => item.approvalStatus === "REJECTED",
  ).length;

  const pendingReschedules = assignments?.filter(
    (item) => item.rescheduleStatus === "PENDING",
  ).length;

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentAssignments =
    assignments?.slice(indexOfFirstRow, indexOfLastRow) || [];

  const totalPages = Math.ceil((assignments?.length || 0) / rowsPerPage);
  const icons = {
    check: <CheckCircleFill />,
    calendar: <CalendarEventFill />,
    close: <XCircleFill />,
    refresh: <ArrowRepeat />,
  };

  const executionTrendData = [
    { month: "Jan", completed: 420, failed: 6 },
    { month: "Feb", completed: 450, failed: 5 },
    { month: "Mar", completed: 440, failed: 7 },
    { month: "Apr", completed: 470, failed: 4 },
    { month: "May", completed: 490, failed: 6 },
    { month: "Jun", completed: 510, failed: 3 },
  ];

  const missedChecklistData = [
    { week: "Week 1", missed: 5 },
    { week: "Week 2", missed: 3 },
    { week: "Week 3", missed: 7 },
    { week: "Week 4", missed: 4 },
  ];

  const StatCard = ({ icon, color, value, label, change }) => {
    const isPositive = change.startsWith("+");

    return (
      <div className="stat-card">
        <div className={`stat-icon ${color}`}>{icons[icon]}</div>

        <div className="stat-content">
          <div
            className={`stat-change ${isPositive ? "positive" : "negative"}`}
          >
            {change}
          </div>
          <h3>{value}</h3>
          <span>{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      {/* Title */}
      <h2 className="fw-bold">Dashboard</h2>

      {/* Statistic Cards */}
      <div className="stats-grid">
        <StatCard
          icon="check"
          color="green"
          value={activeChecklists}
          label="Active Checklists"
          change="+12%"
        />

        <StatCard
          icon="calendar"
          color="blue"
          value={scheduledToday}
          label="Scheduled Today"
          change="+3"
        />

        <StatCard
          icon="close"
          color="red"
          value={failedChecklists}
          label="Failed Checklists"
          change="-2"
        />

        <StatCard
          icon="refresh"
          color="orange"
          value={pendingReschedules}
          label="Pending Reschedules"
          change="0"
        />
      </div>

      {/* All Checklists Section */}
      <div className="checklist-card">
        <div className="checklist-header">
          <h5>All Checklists</h5>
        </div>

        {/* Filters */}
        <div className="checklist-filters">
          <div className="filter-group">
            <label>Category</label>
            <input type="text" placeholder="" />
          </div>

          <div className="filter-group">
            <label>Frequency</label>
            <input type="text" placeholder="" />
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <input type="text" placeholder="" />
          </div>
        </div>

        <div className="checklist-count">
          Showing {currentAssignments.length} of {assignments?.length || 0}{" "}
          checklists
        </div>

        {/* Table */}
        <div className="checklist-table-wrapper">
          <table className="checklist-table">
            <thead>
              <tr>
                <th>CHECKLIST NAME</th>
                <th>DEPARTMENT</th>
                <th>STATUS</th>
                <th>PRIORITY</th>
                <th>ASSIGNED TO</th>
                <th>DUE DATE</th>
              </tr>
            </thead>

            <tbody>
              {currentAssignments?.map((item) => (
                <tr key={item.assignmentId}>
                  <td>{item.assignmentName}</td>

                  <td>
                    {departments.find(
                      (d) => d.departmentId === item.assignedToDepartmentId,
                    )?.deptName || "-"}
                  </td>

                  <td>
                    <span
                      className={`status ${(item.executionStatus || "")
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {item.executionStatus}
                    </span>
                  </td>

                  <td>
                    <span className="priority">{item.priorityName || "-"}</span>
                  </td>

                  <td>{item.assignedToRoleName || "-"}</td>

                  <td>
                    {item.originalDueDate
                      ? new Date(item.originalDueDate).toLocaleDateString(
                          "en-GB",
                        )
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}

          <div className="pagination-container">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Execution Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h6>Execution Trend</h6>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={executionTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />

              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4, fill: "#10b981" }}
              />

              <Line
                type="monotone"
                dataKey="failed"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4, fill: "#ef4444" }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="chart-legend">
            <div className="legend completed">Completed</div>
            <div className="legend failed">Failed</div>
          </div>
        </div>

        {/* Missed Checklist Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h6>Missed Checklist Trend</h6>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={missedChecklistData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />

              <Bar
                dataKey="missed"
                fill="#f59e0b"
                radius={[8, 8, 0, 0]}
                barSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department-wise Summary */}
      <div className="department-card">
        <h5>Department-wise Summary</h5>

        <table className="department-table">
          <thead>
            <tr>
              <th>DEPARTMENT</th>
              <th>TOTAL CHECKLISTS</th>
              <th>COMPLETED</th>
              <th>FAILED</th>
              <th>PENDING</th>
              <th>COMPLETION RATE</th>
            </tr>
          </thead>

          <tbody>
            {departments?.map((dept) => {
              const deptAssignments =
                assignments?.filter(
                  (a) => a.departmentName === dept.departmentName,
                ) || [];

              const total = deptAssignments.length;

              const completed = deptAssignments.filter(
                (a) => a.status === "COMPLETED",
              ).length;

              const failed = deptAssignments.filter(
                (a) => a.status === "FAILED",
              ).length;

              const pending = deptAssignments.filter(
                (a) => a.status === "PENDING",
              ).length;

              const completionRate =
                total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <tr key={dept.departmentId}>
                  <td className="dept-name">{dept.departmentName}</td>

                  <td>{total}</td>

                  <td className="text-green">{completed}</td>

                  <td className="text-red">{failed}</td>

                  <td className="text-yellow">{pending}</td>

                  <td>
                    <div className="progress-wrapper">
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>

                      <span className="progress-percent">
                        {completionRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
