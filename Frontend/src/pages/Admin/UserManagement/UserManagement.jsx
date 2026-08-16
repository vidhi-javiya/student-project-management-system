import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserManagement.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const BASE_URL = "https://localhost:7187";
const API_USER = `${BASE_URL}/api/User`;
const API_ROLE = `${BASE_URL}/api/Role`;
const API_USER_ROLE = `${BASE_URL}/api/UserRole`;

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [mappedRoles, setMappedRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open] = useState(true);
  const navigate = useNavigate();

  const getProfileImageUrl = (path) => {
    if (!path) return "https://i.pravatar.cc/150?img=12";
    if (path.startsWith("http://") || path.startsWith("https://")) return `${path}?v=${Math.random()}`;

    let cleanPath = path.replace(/\\/g, "/").replace(/^Uploads\//i, "").replace(/^\/Uploads\//i, "");
    if (!cleanPath.startsWith("/")) cleanPath = `/${cleanPath}`;

    return `${BASE_URL}${cleanPath}?v=${Math.random()}`;
  };

  useEffect(() => {
    const fetchDataAndMapRoles = async () => {
      try {
        setLoading(true);
        setError("");

        const [usersRes, rolesRes, userRolesRes] = await Promise.all([
          fetch(API_USER),
          fetch(API_ROLE),
          fetch(API_USER_ROLE).catch(() => null),
        ]);

        if (!usersRes.ok) throw new Error("Failed to fetch user list.");

        const usersData = await usersRes.json();
        const rolesData = rolesRes.ok ? await rolesRes.json() : [];
        const userRolesData = userRolesRes && userRolesRes.ok ? await userRolesRes.json() : [];

        const rawUsers = Array.isArray(usersData) ? usersData : usersData.$values || [];
        const rawRoles = Array.isArray(rolesData) ? rolesData : rolesData.$values || [];
        const rawUserRoles = Array.isArray(userRolesData) ? userRolesData : userRolesData.$values || [];

        const roleDict = {};
        rawRoles.forEach((r) => {
          const rId = r.roleId || r.RoleId;
          const rName = r.roleName || r.RoleName;
          if (rId && rName) {
            roleDict[rId] = rName;
          }
        });

        const userRoleMap = {};
        rawUserRoles.forEach((ur) => {
          const uId = ur.userId || ur.UserId;
          const rId = ur.roleId || ur.RoleId;
          if (uId && rId && roleDict[rId]) {
            userRoleMap[uId] = roleDict[rId];
          }
        });

        const localSavedMap = JSON.parse(localStorage.getItem("spm_user_role_map") || "{}");
        Object.keys(localSavedMap).forEach((uId) => {
          const rId = localSavedMap[uId];
          if (roleDict[rId]) {
            userRoleMap[uId] = roleDict[rId];
          }
        });

        setUsers(rawUsers);
        setMappedRoles(userRoleMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndMapRoles();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const response = await fetch(`${API_USER}/${id}`, { method: "DELETE" });
        if (response.ok) {
          alert(`${name} deleted successfully.`);
          setUsers(users.filter((user) => (user.userId || user.UserId) !== id));

          const localSavedMap = JSON.parse(localStorage.getItem("spm_user_role_map") || "{}");
          delete localSavedMap[id];
          localStorage.setItem("spm_user_role_map", JSON.stringify(localSavedMap));
        } else {
          alert("Failed to delete user.");
        }
      } catch (err) {
        alert("Server Error: " + err.message);
      }
    }
  };

  // Function to get Dynamic Role CSS Class Name
  const getRoleBadgeClass = (roleName) => {
    const role = roleName.toLowerCase().trim();
    if (role.includes("admin")) return "role-btn admin";
    if (role.includes("manager")) return "role-btn manager";
    return "role-btn user";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={open} />

      <div className="main-content">
        <Navbar />

        <div className="user-page">
          <div className="page-header">
            <h2>Manage Users</h2>
            <p className="breadcrumb">
              <Link to="/AdminDashboard">Home</Link>
              <span> / </span>
              <span className="active-page">Users</span>
            </p>
          </div>

          <div className="user-card">
            <div className="top-bar">
              <div className="search-box">
                <SearchOutlinedIcon />
                <input
                  type="text"
                  placeholder="Search User..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="user-actions">
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => navigate("/admin/users/add")}
                >
                  <AddOutlinedIcon />
                  Add User
                </button>
              </div>
            </div>

            {loading && <p className="loading-text">Loading users...</p>}
            {error && <p className="error-text" style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Profile</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users
                    .filter((item) => {
                      const id = item.userId || item.UserId;
                      const name = item.fullName || item.FullName || "";
                      const email = item.email || item.Email || "";
                      const roleName = mappedRoles[id] || "User";

                      return (
                        name.toLowerCase().includes(search.toLowerCase()) ||
                        email.toLowerCase().includes(search.toLowerCase()) ||
                        roleName.toLowerCase().includes(search.toLowerCase())
                      );
                    })
                    .map((item) => {
                      const id = item.userId || item.UserId;
                      const name = item.fullName || item.FullName || "N/A";
                      const email = item.email || item.Email || "N/A";
                      const mobile = item.mobileNumber || item.MobileNumber || "N/A";
                      const roleName = mappedRoles[id] || "User";
                      const rawProfilePath = item.profilePicturePath || item.ProfilePicturePath;
                      const isActive = item.isActive !== undefined ? item.isActive : item.IsActive;

                      return (
                        <tr key={id}>
                          <td>{id}</td>
                          <td>
                            <img
                              src={getProfileImageUrl(rawProfilePath)}
                              alt="Profile"
                              className="user-image"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://i.pravatar.cc/150?img=12";
                              }}
                            />
                          </td>
                          <td><strong>{name}</strong></td>
                          <td>{email}</td>
                          <td>{mobile}</td>
                          <td>
                            <span className={getRoleBadgeClass(roleName)}>
                              {roleName}
                            </span>
                          </td>
                          <td>
                            <span className={isActive ? "status active" : "status inactive"}>
                              {isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() => navigate(`/admin/users/edit/${id}`)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </button>
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => handleDelete(id, name)}
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default UserManagement;