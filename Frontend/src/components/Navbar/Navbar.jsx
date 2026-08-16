import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ toggleSidebar }) => {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar">

      {/* Left Section */}
      <div className="navbar-left">

        <button
          className="menu-btn"
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </button>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search here..."
          />
        </div>

      </div>

      {/* Right Section */}
      <div className="navbar-right">

        

        {/* Notification */}
        <div className="icon-box notification">
          <NotificationsNoneIcon />
        </div>

        
        {/* Profile */}
        <div
          className="profile"
          onClick={() => setShowProfile(!showProfile)}
        >

          <div className="profile-icon">
            <PersonIcon />
          </div>

          <div className="profile-info">
            <h4>Admin</h4>
            <p>Administrator</p>
          </div>

          {showProfile && (
            <div
              className="profile-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="profile-header">

                <div className="profile-image">
                  <PersonIcon />
                </div>

                <h3>Admin</h3>
                <p>Administrator</p>

              </div>

              <div className="profile-details">

                <div>
                  <label>Email</label>
                  <p>admin@spms.com</p>
                </div>

                <div>
                  <label>Mobile</label>
                  <p>9876543210</p>
                </div>

                <div>
                  <label>Role</label>
                  <p>System Administrator</p>
                </div>

              </div>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Navbar;