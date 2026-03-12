import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { List, ChevronLeft } from "react-bootstrap-icons";
import "../style/Header.css";
import MyProfileModal from "../components/MyProfileModal.jsx";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { fetchUserById } from "../redux/Action/userAction";

const Header = ({ isOpen, setIsOpen }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user: authUser } = useSelector((state) => state.auth);
  const { selectedUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    if (authUser?.userId) {
      dispatch(fetchUserById(authUser.userId));
    }
  }, [authUser, dispatch]);

  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  /* ✅ HANDLE RESIZE PROPERLY */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // 🔑 When switching to desktop → disable mobile toggle
      if (!mobile) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutConfirm = () => {
    dispatch(logout()); // 🔐 clear Redux + storage
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  };

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <header className="app-header">
      {/* LEFT */}
      <div className="header-left">
        {/* 🔥 MOBILE ONLY MENU BUTTON */}
        {isMobile && (
          <button
            className="menu-btn"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <ChevronLeft /> : <List />}
          </button>
        )}

        <div className="brand">
          <div className="brand-logo">CIIP</div>
          <div className="brand-text">
            <h4>CIIP</h4>
            <span>Crest Industrial Intelligence Platform</span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="header-right">
        <div className="user-wrapper" ref={dropdownRef}>
          <div
            className="user-info"
            onClick={() => setShowProfileMenu((p) => !p)}
          >
            <div className="user-text">
              <span className="user-name-header">
                {selectedUser?.fullName || "Loading..."}
              </span>
              <span className="user-role">{selectedUser?.roleName || ""}</span>
            </div>
            <div className="user-avatar">👤</div>
          </div>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <button
                className="dropdown-myprofile profile"
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowProfileModal(true);
                }}
              >
                My Profile
              </button>

              <button
                className="dropdown-logout logout"
                onClick={() => setShowLogoutModal(true)}
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <MyProfileModal
          open={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userData={selectedUser}
        />
      </div>
      {showLogoutModal && (
        <div className="logout-backdrop">
          <div className="logout-modal">
            <h3 className="logout-title">Log out</h3>
            <p className="logout-text">Are you sure you want to log out?</p>

            <div className="logout-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button className="btn-logout" onClick={handleLogoutConfirm}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
