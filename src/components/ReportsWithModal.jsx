import React from "react";
import {
  ArrowDownShort,
  ArrowUpShort,
  Download,
  GraphUp,
  GraphDown,
} from "react-bootstrap-icons";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../style/Reports.css";

const ReportsAnalytics = () => {
  // KPI Data
  const kpiData = [
    {
      title: "Completion Rate",
      value: "94.2%",
      change: "+2.1% from last month",
      isPositive: true,
      icon: <GraphUp />,
    },
    {
      title: "Avg Execution Time",
      value: "28 min",
      change: "-3 min from last month",
      isPositive: true,
      icon: <GraphDown />,
    },
    {
      title: "Failed Checklists",
      value: "15",
      change: "-5 from last month",
      isPositive: true,
      icon: <GraphDown />,
    },
    {
      title: "Reschedule Frequency",
      value: "12",
      change: "+3 from last month",
      isPositive: false,
      icon: <GraphUp />,
    },
  ];

  // Completion vs Failure Data
  const completionFailureData = [
    { month: "Jan", completed: 420, failed: 8 },
    { month: "Feb", completed: 445, failed: 7 },
    { month: "Mar", completed: 460, failed: 6 },
    { month: "Apr", completed: 480, failed: 5 },
    { month: "May", completed: 495, failed: 5 },
    { month: "Jun", completed: 510, failed: 4 },
  ];

  // Average Execution Time by Department
  const executionTimeData = [
    { department: "Production", time: 32 },
    { department: "Quality", time: 26 },
    { department: "Maintenance", time: 45 },
    { department: "Safety", time: 18 },
    { department: "Logistics", time: 22 },
  ];

  // Checklist Distribution by Department
  const departmentDistribution = [
    { name: "Production", value: 35, color: "#3b82f6" },
    { name: "Quality", value: 20, color: "#10b981" },
    { name: "Maintenance", value: 25, color: "#f59e0b" },
    { name: "Safety", value: 12, color: "#ef4444" },
    { name: "Logistics", value: 8, color: "#8b5cf6" },
  ];

  // Most Frequently Missed Checklists
  const missedChecklists = [
    {
      name: "Safety Equipment Inspection",
      department: "Safety",
      frequency: "Daily",
      times: "3 times",
      date: "Jan 24, 2025",
    },
    {
      name: "Quality Control - Line B",
      department: "Quality",
      frequency: "Shift-based",
      times: "2 times",
      date: "Jan 23, 2025",
    },
    {
      name: "Preventive Maintenance",
      department: "Maintenance",
      frequency: "Weekly",
      times: "1 times",
      date: "Jan 20, 2025",
    },
  ];

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <div>
          <h1 className="reports-title">Reports & Analytics</h1>
          <p className="reports-subtitle">
            Complete operational reports and performance analytics - All data
            displayed
          </p>
        </div>
        <button className="export-all-btn">
          <Download className="btn-icon" />
          Export All Reports
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpiData.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">{kpi.title}</span>
              <div
                className={`kpi-icon ${kpi.isPositive ? "positive" : "negative"}`}
              >
                {kpi.icon}
              </div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div
              className={`kpi-change ${kpi.isPositive ? "positive" : "negative"}`}
            >
              {kpi.isPositive ? (
                <ArrowUpShort className="change-icon" />
              ) : (
                <ArrowDownShort className="change-icon" />
              )}
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="charts-row">
        {/* Completion vs Failure Rates */}
        <div className="chart-card">
          <h3 className="chart-title">Completion vs Failure Rates</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={completionFailureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
                name="Completed"
              />
              <Line
                type="monotone"
                dataKey="failed"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4, fill: "#ef4444" }}
                name="Failed"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot completed"></span>
              <span>Completed</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot failed"></span>
              <span>Failed</span>
            </div>
          </div>
        </div>

        {/* Average Execution Time by Department */}
        <div className="chart-card">
          <h3 className="chart-title">Average Execution Time by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={executionTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="department"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="time"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-row">
        {/* Checklist Distribution by Department */}
        <div className="chart-card">
          <h3 className="chart-title">Checklist Distribution by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={departmentDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {departmentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Most Frequently Missed Checklists */}
        <div className="chart-card">
          <h3 className="chart-title">Most Frequently Missed Checklists</h3>
          <div className="missed-list">
            {missedChecklists.map((item, index) => (
              <div key={index} className="missed-item">
                <div className="missed-info">
                  <div className="missed-name">{item.name}</div>
                  <div className="missed-meta">
                    {item.department} • {item.frequency}
                  </div>
                </div>
                <div className="missed-stats">
                  <div className="missed-times">{item.times}</div>
                  <div className="missed-date">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
