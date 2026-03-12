import React, { useState, useEffect } from "react";
import "../style/CreateEmployee.css";
import { createUser } from "../redux/Action/userAction";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  fetchRoles,
  fetchShifts,
  fetchStatuses,
} from "../redux/Action/masterAction";
import { toast } from "react-toastify";
import { clearUserMessages } from "../redux/slices/userSlice";

const CreateOperator = () => {
  const dispatch = useDispatch();

  const { departments, roles, shifts, statuses } = useSelector(
    (state) => state.master,
  );

  const { createLoading, error, successMessage } = useSelector(
    (state) => state.user,
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserMessages()); // clear after showing
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);

      setForm({
        fullName: "",
        employeeCode: "",
        email: "",
        mobileNo: "",
        departmentId: "",
        roleId: "",
        shiftId: "",
        statusId: "",
        password: "",
        confirmPassword: "",
      });

      dispatch(clearUserMessages()); // clear after showing
    }
  }, [successMessage, dispatch]);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    employeeCode: "",
    email: "",
    mobileNo: "",
    departmentId: "",
    roleId: "",
    shiftId: "",
    statusId: "",
    password: "",
    confirmPassword: "",
  });

  /* ===============================
     FETCH MASTER DATA
  =============================== */
  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchRoles());
    dispatch(fetchShifts());
    dispatch(fetchStatuses());
  }, [dispatch]);

  /* ===============================
     HANDLE CHANGE
  =============================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const payload = {
      fullName: form.fullName,
      employeeCode: form.employeeCode,
      email: form.email,
      mobileNo: form.mobileNo,
      departmentId: form.departmentId,
      roleId: form.roleId,
      shiftId: form.shiftId,
      statusId: Number(form.statusId),
      password: form.password,
    };

    dispatch(createUser(payload));
  };

  return (
    <div className="operator-container">
      <h1 className="operator-title">Create Employee</h1>

      <form className="operator-form" onSubmit={handleSubmit}>
        {/* ================= BASIC INFO ================= */}
        <div className="operator-section">
          <h3>Basic Information</h3>

          <div className="form-grid">
            <div className="field">
              <label>Full Name *</label>
              <input
                name="fullName"
                value={form.fullName} // ✅ FIX
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Employee Code *</label>
              <input
                name="employeeCode"
                value={form.employeeCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Phone</label>
              <input
                name="mobileNo"
                value={form.mobileNo} // ✅ FIX
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD */}
            <div className="field password-field">
              <label>Password *</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <span
                  className="toggle-password"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            <div className="field password-field">
              <label>Confirm Password *</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <span
                  className="toggle-password"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

              {form.confirmPassword &&
                form.password !== form.confirmPassword && (
                  <span className="error-text">Passwords do not match</span>
                )}
            </div>
          </div>
        </div>

        {/* ================= WORK INFO ================= */}
        <div className="operator-section">
          <h3>Work Assignment</h3>

          <div className="form-grid">
            {/* DEPARTMENT */}
            <div className="field">
              <label>Department *</label>
              <select
                name="departmentId"
                value={form.departmentId}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>

                {departments?.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.deptName}
                  </option>
                ))}
              </select>
            </div>

            {/* ROLE */}
            <div className="field">
              <label>Role *</label>
              <select
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>

                {roles?.map((role) => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>

            {/* SHIFT */}
            <div className="field">
              <label>Shift</label>
              <select
                name="shiftId"
                value={form.shiftId}
                onChange={handleChange}
              >
                <option value="">Select</option>

                {shifts?.map((shift) => (
                  <option key={shift.shiftId} value={shift.shiftId}>
                    {shift.shiftName}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div className="field">
              <label>Status</label>
              <select
                name="statusId"
                value={form.statusId}
                onChange={handleChange}
              >
                <option value="">Select Status</option>

                {statuses.map((status) => (
                  <option key={status.statusId} value={status.statusId}>
                    {status.statusName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="form-actions">
          <button type="button" className="btn-secondary">
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary"
            disabled={
              !form.password ||
              !form.confirmPassword ||
              form.password !== form.confirmPassword ||
              createLoading
            }
          >
            {createLoading ? "Creating..." : "Create Operator"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOperator;
