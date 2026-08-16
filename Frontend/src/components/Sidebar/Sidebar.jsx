import React, { useState } from "react";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

// MUI Icons
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SchoolIcon from "@mui/icons-material/School";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Sidebar = ({ open }) => {
  const navigate = useNavigate();

  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Logout Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Open Modal on Logout Click
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Confirm Logout Action
  const confirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  // Cancel Logout Action
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className={`sidebar ${open ? "show" : "hide"}`}>
        {/* Logo */}
        <div className="logo">
          <SchoolIcon className="logo-icon" />
          <div>
            <h2>SPMS</h2>
            <span>Admin</span>
          </div>
        </div>

        {/* Dashboard */}
        <ul className="menu">
          <li>
            <NavLink
              to="/AdminDashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <GridViewOutlinedIcon />
              <span>Dashboard</span>
            </NavLink>
          </li>
        </ul>

        {/* Admin Modules */}
        <p className="menu-title">ADMIN MODULES</p>

        <ul className="menu">
          <li>
            <NavLink
              to="/admin/roles"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <ShieldOutlinedIcon />
              <span>Manage Roles</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <GroupOutlinedIcon />
              <span>Manage Users</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/students"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <SchoolOutlinedIcon />
              <span>Manage Students</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/faculty"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <BadgeOutlinedIcon />
              <span>Manage Faculty</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/permissions"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <VpnKeyOutlinedIcon />
              <span>Role & Permissions</span>
            </NavLink>
          </li>
        </ul>

        {/* Project Management */}
        <p className="menu-title">PROJECT MANAGEMENT</p>

        <ul className="menu">
          <li>
            <NavLink
              to="/admin/projects"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FolderOpenOutlinedIcon />
              <span>Manage Projects</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/tasks"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <AssignmentOutlinedIcon />
              <span>Manage Tasks</span>
            </NavLink>
          </li>

          {/* SETTINGS DROPDOWN */}
          <li className="settings-dropdown">
            <div
              className="settings-btn"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <SettingsOutlinedIcon />
                <span>Settings</span>
              </div>

              {settingsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>

            {settingsOpen && (
              <ul className="settings-menu">
                <li>
                  <NavLink
                    to="/admin/priorities"
                    className={({ isActive }) =>
                      isActive ? "active" : ""
                    }
                  >
                    <FlagOutlinedIcon fontSize="small" />
                    <span>Manage Priority</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/status-management"
                    className={({ isActive }) =>
                      isActive ? "active" : ""
                    }
                  >
                    <InfoOutlinedIcon fontSize="small" />
                    <span>Manage Status</span>
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Logout */}
        <div className="logout-section">
          <div className="logout-item" onClick={handleLogoutClick}>
            <LogoutOutlinedIcon />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <div className="modal-icon">
              <LogoutOutlinedIcon />
            </div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out of your account?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmLogout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;