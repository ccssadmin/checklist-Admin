import React, { useState, useEffect } from "react";
import { Person, Envelope, Building, ShieldLock } from "react-bootstrap-icons";
import "../style/MyProfileModal.css";

const MyProfileModal = ({ open, onClose, userData }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  });

  useEffect(() => {
    if (userData) {
      setProfile({
        name: userData.fullName || "",
        email: userData.email || "",
        role: userData.roleName || "",
        department: userData.departmentName || "",
      });
    }
  }, [userData]);

  if (!open) return null;

  return (
    <div className="profile-backdrop" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="profile-modal-header">
          <h3>My Profile</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Avatar */}
        <div className="profile-avatar">👤</div>

        {/* Fields */}
        <div className="profile-fields">
          <div className="profile-field">
            <Person className="field-icon" />
            <div>
              <label>Name</label>
              <input value={profile.name} disabled />
            </div>
          </div>

          <div className="profile-field">
            <Envelope className="field-icon" />
            <div>
              <label>Email</label>
              <input value={profile.email} disabled />
            </div>
          </div>

          <div className="profile-field">
            <ShieldLock className="field-icon" />
            <div>
              <label>Role</label>
              <input value={profile.role} disabled />
            </div>
          </div>

          <div className="profile-field">
            <Building className="field-icon" />
            <div>
              <label>Department</label>
              <input value={profile.department} disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileModal;
