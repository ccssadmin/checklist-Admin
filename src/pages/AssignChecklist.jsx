import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UserCog } from "lucide-react";
import "../style/AssignChecklist.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchChecklistTemplates } from "../redux/Action/templateActions";
import {
  fetchShifts,
  fetchDepartments,
  fetchRoles,
  fetchRecurrence,
  fetchPriorities,
} from "../redux/Action/masterAction";
import { fetchUsers } from "../redux/Action/userAction";
import { createAssignment } from "../redux/Action/checklistAction";
import { toast } from "react-toastify";

export default function AssignChecklist() {
  const [formData, setFormData] = useState({
    checklistTemplate: "",
    dueDate: "",
    shift: "",
    priority: "Medium",
    recurrence: "None",
    notifyUser: true,
  });

  // Assignment mode: 'department', 'role', or 'user'
  const [assignmentMode, setAssignmentMode] = useState("department");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const { createLoading } = useSelector((state) => state.assignments);
  const dispatch = useDispatch();
  const location = useLocation();
  const { templates, loading } = useSelector((state) => state.template);
  const {
    shifts = [],
    departments = [],
    roles = [], // ✅ ADD THIS
    recurrenceList = [],
    priorities = [],
    loading: masterLoading,
  } = useSelector((state) => state.master || {});

  useEffect(() => {
    dispatch(fetchChecklistTemplates());
    dispatch(fetchShifts());
    dispatch(fetchDepartments());
    dispatch(fetchRoles());
    dispatch(fetchUsers());
    dispatch(fetchRecurrence());
    dispatch(fetchPriorities());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.templateId && templates.length > 0) {
      const exists = templates.find(
        (tpl) => tpl.template_id === location.state.templateId,
      );

      if (exists) {
        setFormData((prev) => ({
          ...prev,
          checklistTemplate: location.state.templateId,
        }));
      }
    }
  }, [location.state, templates]);
  // Sample data
  // ✅ Assigned By dropdown values

  // Get users based on current assignment mode

  // Handle mode change

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.checklistTemplate) {
      alert("Please select a checklist template");
      return;
    }

    if (!formData.dueDate) {
      alert("Please select a due date");
      return;
    }

    if (
      (assignmentMode === "user" && selectedUserIds.length === 0) ||
      (assignmentMode === "role" && !selectedRole) ||
      (assignmentMode === "department" && !selectedDepartment)
    ) {
      alert("Please select valid assignment option");
      return;
    }

    try {
      // 🔹 Common payload fields (same for all modes)
      const basePayload = {
        assignmentId: null,
        templateId: formData.checklistTemplate,
        shiftCode:
          shifts.find((s) => s.shiftId === formData.shift)?.shiftCode || null,
        frequency: formData.recurrence,
        recurrence: formData.recurrence,
        priority: formData.priority,
        dueDate: new Date(formData.dueDate).toISOString(),
        effectiveFrom: new Date().toISOString(),
      };

      // ✅ USER MODE → send multiple API calls
      if (assignmentMode === "user") {
        for (let userId of selectedUserIds) {
          const payload = {
            ...basePayload,
            userId: userId,
            roleId: null,
            departmentId: null,
          };

          await dispatch(createAssignment(payload)).unwrap();
        }
      }

      // ✅ ROLE MODE → send single call
      else if (assignmentMode === "role") {
        const payload = {
          ...basePayload,
          roleId: roles.find((r) => r.roleName === selectedRole)?.roleId,
          userId: null,
          departmentId: null,
        };

        await dispatch(createAssignment(payload)).unwrap();
      }

      // ✅ DEPARTMENT MODE → send single call
      else if (assignmentMode === "department") {
        const payload = {
          ...basePayload,
          departmentId: selectedDepartment,
          roleId: selectedRole,
          userId: null,
        };

        await dispatch(createAssignment(payload)).unwrap();
      }
      // eslint-disable-next-line no-undef
      toast.success(`Checklist successfully assigned !`, {
        icon: "✅",
      });

      handleReset();
    } catch (error) {
      console.log("Assignment Error:", error);
      toast.error("Failed to create assignment ❌");
    }
  };

  const handleReset = () => {
    setFormData({
      checklistTemplate: "",
      dueDate: "",
      shift: "",
      priority: "Medium",
      recurrence: "None",
      notifyUser: true,
    });
    setSelectedDepartment("");
    setSelectedRole("");
    setSelectedUserIds([]);
    setAssignmentMode("department");
  };

  return (
    <div className="assign-checklist-page">
      {/* SUCCESS MESSAGE */}

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Assign Checklist</h1>
        </div>
      </div>

      <div className="assign-content">
        {/* MAIN FORM */}
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            {/* CHECKLIST SELECTION */}
            <div className="form-card">
              <div className="form-grid">
                <div className="form-field-AC full-width">
                  <label>Checklist Template *</label>
                  <select
                    value={formData.checklistTemplate}
                    onChange={(e) =>
                      handleInputChange("checklistTemplate", e.target.value)
                    }
                    required
                  >
                    <option value="">
                      {loading ? "Loading..." : "Select a checklist template"}
                    </option>

                    {[...templates]
                      .sort(
                        (a, b) =>
                          new Date(b.created_at) - new Date(a.created_at),
                      )
                      .map((template) => (
                        <option
                          key={template.template_id}
                          value={template.template_id}
                        >
                          {`${template.template_name} — v${template.version || 1} | ${
                            template.source_type || "N/A"
                          } | ${
                            template.created_at
                              ? new Date(
                                  template.created_at,
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : ""
                          }`}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-field-AC">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      handleInputChange("dueDate", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-field-AC">
                  <label>Shift</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => handleInputChange("shift", e.target.value)}
                  >
                    <option value="">
                      {masterLoading ? "Loading shifts..." : "Select shift"}
                    </option>

                    {shifts?.map((shift) => (
                      <option key={shift.shiftId} value={shift.shiftId}>
                        {shift.shiftName} ({shift.startTime.slice(0, 5)} -{" "}
                        {shift.endTime.slice(0, 5)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field-AC">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      handleInputChange("priority", e.target.value)
                    }
                  >
                    <option value="">Select priority</option>

                    {priorities?.map((item) => (
                      <option key={item.priorityId} value={item.priorityName}>
                        {item.priorityName}
                      </option>
                    ))}
                  </select>
                </div>
                {/* ✅ ASSIGNED BY – z-index > 500 */}

                <div className="form-field-AC">
                  <label>Recurrence</label>
                  <select
                    value={formData.recurrence}
                    onChange={(e) =>
                      handleInputChange("recurrence", e.target.value)
                    }
                  >
                    <option value="">Select recurrence</option>

                    {recurrenceList?.map((item) => (
                      <option
                        key={item.recurrenceId}
                        value={item.recurrenceCode}
                      >
                        {item.recurrenceName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ASSIGNMENT MODE SELECTION */}
            <div className="form-card">
              <h2 className="card-title">Assignment Method</h2>

              {/* MODE TABS */}
              <div className="assignment-mode-tabs">
                {/* <button
                  type="button"
                  className={`mode-tab ${assignmentMode === "role" ? "active" : ""}`}
                  onClick={() => handleModeChange("role")}
                >
                  <UserCog size={18} />
                  <span>By Role</span>
                </button> */}
                {/* <button
                  type="button"
                  className={`mode-tab ${assignmentMode === "user" ? "active" : ""}`}
                  onClick={() => handleModeChange("user")}
                >
                  <User size={18} />
                  <span>By Individual User</span>
                </button> */}
              </div>

              {/* DEPARTMENT MODE */}
              <div className="assignment-content">
                {/* Department */}
                <div className="form-field-AC full-width">
                  <label>Select Department *</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setSelectedRole("");
                    }}
                    required
                  >
                    <option value="">Choose a department</option>
                    {departments.map((dept) => (
                      <option key={dept.departmentId} value={dept.departmentId}>
                        {dept.deptName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role */}
                <div className="form-field-AC full-width">
                  <label>Select Role *</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    required
                    disabled={!selectedDepartment}
                  >
                    <option value="">Choose a role</option>

                    {roles
                      .filter(
                        (role) => role.departmentId === selectedDepartment,
                      )
                      .map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </option>
                      ))}
                  </select>
                </div>

                {selectedRole && (
                  <div className="info-badge">
                    <UserCog size={16} />
                    <span>
                      This will assign the checklist to selected role inside
                      department
                    </span>
                  </div>
                )}
              </div>

              {/* ROLE MODE */}

              {/* USER MODE */}

              {/* NOTIFICATION OPTION */}
              <div className="checkbox-field">
                <input
                  type="checkbox"
                  id="notifyUser"
                  checked={formData.notifyUser}
                  onChange={(e) =>
                    handleInputChange("notifyUser", e.target.checked)
                  }
                />
                <label htmlFor="notifyUser">
                  Send email notification to assigned users
                </label>
              </div>
            </div>

            {/* FORM ACTIONS */}
            <div className="form-footer">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleReset}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={createLoading || !selectedDepartment || !selectedRole}
              >
                {createLoading ? "Assigning..." : `Assign Checklist `}
              </button>
            </div>
          </form>
        </div>

        {/* SELECTED USERS SIDEBAR */}
      </div>
    </div>
  );
}
