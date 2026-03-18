/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../style/Settings.css";

export default function Settings() {
  /* =========================
     EMPLOYEE PERMISSION STATE
  ========================= */
  const [selectionType, setSelectionType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissionUser, setSelectedPermissionUser] = useState("");
  const [permissions, setPermissions] = useState({});
  const { selectedUser } = useSelector((state) => state.user);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    employeeCode: "",
    department: "",
    role: "",
    shift: "",
  });

  useEffect(() => {
    if (selectedUser) {
      setProfile({
        fullName: selectedUser.fullName || "",
        email: selectedUser.email || "",
        phone: selectedUser.mobileNo || "",
        employeeCode: selectedUser.employeeCode || "",
        department: selectedUser.departmentName || "",
        role: selectedUser.roleName || "",
        shift: selectedUser.shiftName || "",
      });
    }
  }, [selectedUser]);

  const departments = [
    "Manufacturing",
    "Safety",
    "Quality Control",
    "Maintenance",
    "Administration",
  ];

  const roles = [
    "Operator",
    "Supervisor",
    "Manager",
    "Administrator",
    "Inspector",
  ];

  const users = [
    { id: 1, name: "John Operator" },
    { id: 2, name: "Sarah Supervisor" },
    { id: 3, name: "Mike Manager" },
    { id: 4, name: "Lisa Admin" },
  ];

  const permissionItems = [
    {
      id: 1,
      name: "User Management",
      description: "Add / Update / Delete users",
    },
    { id: 2, name: "Approval Checklist", description: "Approve checklists" },
    { id: 3, name: "Create Template", description: "Create templates" },
    { id: 4, name: "Template Management", description: "Edit templates" },
    { id: 5, name: "Rescheduling", description: "Reschedule tasks" },
  ];

  useEffect(() => {
    setPermissions({});
    setSelectedDepartment("");
    setSelectedRole("");
    setSelectedPermissionUser("");
  }, [selectionType]);

  useEffect(() => {
    if (isValidSelection()) loadPermissions();
  }, [selectedDepartment, selectedRole, selectedPermissionUser]);

  const isValidSelection = () => {
    if (selectionType === "department") return selectedDepartment;
    if (selectionType === "role") return selectedRole;
    if (selectionType === "user") return selectedPermissionUser;
    return false;
  };

  const loadPermissions = () => {
    const temp = {};
    permissionItems.forEach((p) => (temp[p.id] = false));
    setPermissions(temp);
  };

  const togglePermission = (id) => {
    setPermissions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const savePermissions = () => {
    console.log({
      selectionType,
      selectedDepartment,
      selectedRole,
      selectedPermissionUser,
      permissions,
    });
    alert("Permissions saved successfully");
  };

  return (
    <div className="settings-page">
      {/* ================= HEADER ================= */}
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      {/* ================= PROFILE ================= */}
      <div className="settings-card">
        <h2>My Profile</h2>

        <div className="form-grid">
          <div className="form-field">
            <label>Full Name</label>
            <input
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
            />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input value={profile.email} disabled />
          </div>
          <div className="form-field">
            <label>Phone</label>
            <input
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>
        </div>

        <button className="primary-btn">Update Profile</button>
      </div>

      {/* ================= WORK INFO ================= */}
      <div className="settings-card">
        <h2>Work Information</h2>

        <div className="form-grid">
          <div className="form-field">
            <label>Employee ID</label>
            <input value={profile.employeeCode} disabled />
          </div>
          <div className="form-field">
            <label>Department</label>
            <input value={profile.department} disabled />
          </div>

          <div className="form-field">
            <label>Role</label>
            <input value={profile.role} disabled />
          </div>

          <div className="form-field">
            <label>Shift</label>
            <input value={profile.shift} disabled />
          </div>
        </div>
      </div>

      {/* ================= EMPLOYEE PERMISSION ================= */}
      <div className="settings-card">
        <h2>Employee Permissions</h2>

        <div className="permission-selector">
          <div className="selector-field">
            <label>Permission Type</label>
            <select
              value={selectionType}
              onChange={(e) => setSelectionType(e.target.value)}
            >
              <option value="">Select</option>
              <option value="department">Department</option>
              <option value="role">Role</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="selector-field">
            <label>Department</label>
            <select
              disabled={selectionType !== "department"}
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">Select</option>
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="selector-field">
            <label>Role</label>
            <select
              disabled={selectionType !== "role"}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select</option>
              {roles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          {selectionType === "user" && (
            <div className="selector-field">
              <label>User</label>
              <select
                value={selectedPermissionUser}
                onChange={(e) => setSelectedPermissionUser(e.target.value)}
              >
                <option value="">Select</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {!isValidSelection() ? (
          <div className="no-selection">Select department / role / user</div>
        ) : (
          <>
            <table className="permission-table">
              <thead>
                <tr>
                  <th>Permission</th>
                  <th>Description</th>
                  <th>Access</th>
                </tr>
              </thead>
              <tbody>
                {permissionItems.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td className="permission-description">{p.description}</td>
                    <td className="permission-toggle">
                      <button
                        className={`toggle-switch ${permissions[p.id] ? "active" : ""}`}
                        onClick={() => togglePermission(p.id)}
                      />
                      <span
                        className={`status-text ${permissions[p.id] ? "status-yes" : "status-no"}`}
                      >
                        {permissions[p.id] ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <center>
              <button className="primary-btn" onClick={savePermissions}>
                Save Permissions
              </button>
            </center>
          </>
        )}
      </div>
    </div>
  );
}
