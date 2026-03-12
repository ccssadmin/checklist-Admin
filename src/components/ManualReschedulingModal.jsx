import "../style/manualReschedulingModal.css";
import { useState } from "react";

export default function ManualReschedulingModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    checklist: "",
    from: "",
    to: "",
    reason: "",
    priority: "Medium",
    department: "Operations",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.checklist || !form.from || !form.to) return;

    onSubmit(form);
    onClose();

    setForm({
      checklist: "",
      from: "",
      to: "",
      reason: "",
      priority: "Medium",
      department: "Operations",
    });
  };

  return (
    <div className="manual-backdrop" onClick={onClose}>
      <div className="manual-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="manual-title">Manual Reschedule</h3>

        {/* CHECKLIST */}
        <label className="manual-label">Checklist Name</label>
        <select
          className="manual-input"
          name="checklist"
          value={form.checklist}
          onChange={handleChange}
        >
          <option value="">Select Checklist</option>
          <option>Daily Safety Check</option>
          <option>Production Audit</option>
          <option>Quality Check</option>
          <option>Maintenance Checklist</option>
        </select>

        {/* PRIORITY */}
        <label className="manual-label">Priority</label>
        <select
          className="manual-input"
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        {/* DEPARTMENT */}
        <label className="manual-label">Department</label>
        <select
          className="manual-input"
          name="department"
          value={form.department}
          onChange={handleChange}
        >
          <option>Operations</option>
          <option>Safety</option>
          <option>Production</option>
          <option>Maintenance</option>
        </select>

        {/* DATE RANGE */}
        <div className="manual-date-row">
          <div>
            <label className="manual-label">From</label>
            <input
              type="date"
              name="from"
              className="manual-input"
              value={form.from}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="manual-label">To</label>
            <input
              type="date"
              name="to"
              className="manual-input"
              value={form.to}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* REASON */}
        <label className="manual-label">Reason</label>
        <textarea
          rows="3"
          name="reason"
          className="manual-textarea"
          value={form.reason}
          onChange={handleChange}
        />

        {/* ACTIONS */}
        <div className="manual-actions">
          <button className="manual-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="manual-btn primary" onClick={handleSubmit}>
            Submit
          </button>
          
        </div>
      </div>
    </div>
  );
}
