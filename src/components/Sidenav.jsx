import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Grid,
  Calendar2Check,
  Bell,
  ShieldCheck,
  BarChart,
  PersonPlus,
  ChevronDown,
  ChevronRight,
  ListCheck,
  PlusCircle,
  ClipboardCheck,
  People,
  PersonCircle,
  CalendarX,
  Gear,
} from "react-bootstrap-icons";
import "../style/SideBar.css";
import { useSelector } from "react-redux";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [employeesOpen, setEmployeesOpen] = useState(false);
  useSelector((state) => state.auth);
  const location = useLocation();

  // 🔥 Handle resize correctly
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 767;
      setIsMobile(mobile);

      // ✅ When entering desktop → RESET mobile state
      if (!mobile) {
        setIsOpen(false); // reset mobile state
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  // 🔒 Lock body scroll ONLY on mobile
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isOpen ? "hidden" : "auto";
    }
  }, [isMobile, isOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 🎯 Keep dropdowns open based on current route
  useEffect(() => {
    const currentPath = location.pathname;

    // Check if current path is under checklists
    if (currentPath.startsWith("/checklists")) {
      setChecklistOpen(true);
    }

    // Check if current path is under employees
    if (currentPath.startsWith("/employees")) {
      setEmployeesOpen(true);
    }
  }, [location.pathname]);

  return (
    <>
      {/* SIDEBAR */}
      <aside className={`sidebar ${isMobile && isOpen ? "open" : ""}`}>
        <ul className="sidebar-menu">
          <SidebarItem to="/home" icon={<Grid />} label="Dashboard" />

          {/* CHECKLIST DROPDOWN */}
          <SidebarDropdown
            icon={<Calendar2Check />}
            label="Checklist"
            isOpen={checklistOpen}
            onToggle={() => setChecklistOpen(!checklistOpen)}
          >
            <SidebarSubItem
              to="/checklists/create"
              icon={<PlusCircle />}
              label="Create Templates"
            />
            <SidebarSubItem
              to="/checklists/all-Templates"
              icon={<ListCheck />}
              label="All Templates"
            />
            <SidebarSubItem
              to="/checklists/assign-checklists"
              icon={<ListCheck />}
              label="Assign Checklists"
            />
            <SidebarSubItem
              to="/checklists/all-checklists"
              icon={<ListCheck />}
              label="All Checklists"
            />

            <SidebarSubItem
              to="/checklists/approval-queue"
              icon={<ClipboardCheck />}
              label="Approval Queue"
            />
            <SidebarSubItem
              to="/checklists/rescheduling"
              icon={<CalendarX />}
              label="Rescheduling Requests"
            />
          </SidebarDropdown>

          {/* EMPLOYEES DROPDOWN (Only for System Admin) */}

          <SidebarDropdown
            icon={<People />}
            label="Employees"
            isOpen={employeesOpen}
            onToggle={() => setEmployeesOpen(!employeesOpen)}
          >
            <SidebarSubItem
              to="/employees/create"
              icon={<PersonPlus />}
              label="Create Employee"
            />
            <SidebarSubItem
              to="/employees/all-employees"
              icon={<PersonCircle />}
              label="All Employees"
            />
          </SidebarDropdown>

          <SidebarItem
            to="/notifications"
            icon={<Bell />}
            label="Notifications"
          />
          <SidebarItem
            to="/compliance"
            icon={<ShieldCheck />}
            label="Compliance & Audit"
          />

          <SidebarItem
            to="/reports"
            icon={<BarChart />}
            label="Reports & Analytics"
          />
          <SidebarItem to="/settings" icon={<Gear />} label="Settings" />
        </ul>
      </aside>
    </>
  );
};

const SidebarItem = ({ to, icon, label, subLabel }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
    >
      <span className="icon">{icon}</span>
      <div className="text">
        <span className="label">{label}</span>
        {subLabel && <span className="sub-label">{subLabel}</span>}
      </div>
    </NavLink>
  </li>
);

const SidebarDropdown = ({ icon, label, isOpen, onToggle, children }) => {
  return (
    <li className="sidebar-dropdown">
      <div
        className={`sidebar-link dropdown-trigger ${isOpen ? "active" : ""}`}
        onClick={onToggle}
      >
        <span className="icon">{icon}</span>
        <div className="text">
          <span className="label">{label}</span>
        </div>
        <span className="dropdown-arrow">
          {isOpen ? <ChevronDown /> : <ChevronRight />}
        </span>
      </div>
      <ul className={`sidebar-submenu ${isOpen ? "open" : ""}`}>{children}</ul>
    </li>
  );
};

const SidebarSubItem = ({ to, icon, label }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-sublink ${isActive ? "active" : ""}`
      }
    >
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
    </NavLink>
  </li>
);

export default Sidebar;
