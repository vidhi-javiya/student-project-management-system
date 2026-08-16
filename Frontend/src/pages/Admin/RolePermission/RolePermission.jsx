import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./RolePermission.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const BASE_URL = "https://localhost:7187/api";

const RolePermission = () => {
  const [open] = useState(true);

  // Component States
  const [usersList, setUsersList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userRole, setUserRole] = useState({
    userId: "",
    roleId: "",
  });

  // Track item being edited (null = Insert Mode)
  const [editingId, setEditingId] = useState(null);

  // 1. Fetch Users, Roles, and Assigned Permissions
  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Users API
      const resUsers = await fetch(`${BASE_URL}/User`);
      const usersData = await resUsers.json();

      // 2. Fetch Roles API
      const resRoles = await fetch(`${BASE_URL}/Role`);
      const rolesData = await resRoles.json();

      // 3. Fetch UserRole (Assigned Permissions) API - Returns IDs only
      const resUserRoles = await fetch(`${BASE_URL}/UserRole`);
      const userRolesData = await resUserRoles.json();

      setUsersList(Array.isArray(usersData) ? usersData : []);
      setRolesList(Array.isArray(rolesData) ? rolesData : []);
      setPermissions(Array.isArray(userRolesData) ? userRolesData : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    setUserRole({
      ...userRole,
      [e.target.name]: e.target.value,
    });
  };

  // Helper Functions: Lookup Name by ID
  const getUserNameById = (uId) => {
    const foundUser = usersList.find(
      (u) => (u.userId ?? u.UserId) === uId
    );
    return foundUser
      ? (foundUser.fullName ?? foundUser.FullName ?? foundUser.userName ?? foundUser.UserName)
      : `User #${uId}`;
  };

  const getRoleNameById = (rId) => {
    const foundRole = rolesList.find(
      (r) => (r.roleId ?? r.RoleId) === rId
    );
    return foundRole
      ? (foundRole.roleName ?? foundRole.RoleName)
      : `Role #${rId}`;
  };

  // 2. Populate form fields when clicking Edit Button
  const handleEdit = (item) => {
    const permId = item.rolePermissionId ?? item.RolePermissionId;
    const uId = item.userId ?? item.UserId;
    const rId = item.roleId ?? item.RoleId;

    setEditingId(permId);
    setUserRole({
      userId: uId.toString(),
      roleId: rId.toString(),
    });
  };

  // Cancel Edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setUserRole({ userId: "", roleId: "" });
  };

  // 3. Post New Assignment or Put (Update) Existing Assignment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userRole.userId || !userRole.roleId) {
      alert("Please select both User and Role.");
      return;
    }

    try {
      const isEdit = editingId !== null;
      const url = isEdit
        ? `${BASE_URL}/UserRole/${editingId}`
        : `${BASE_URL}/UserRole`;
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        rolePermissionId: isEdit ? editingId : 0,
        userId: parseInt(userRole.userId),
        roleId: parseInt(userRole.roleId),
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(isEdit ? "Failed to update role." : "Failed to assign role.");
      }

      alert(isEdit ? "Role Updated Successfully!" : "Role Assigned Successfully!");

      handleCancelEdit();
      fetchInitialData(); // Refresh grid data
    } catch (err) {
      alert(err.message);
    }
  };

  // 4. Delete Permission Assignment
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this permission?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(`${BASE_URL}/UserRole/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error deleting permission.");
        }

        alert("Permission Deleted Successfully");
        
        // If deleting the record currently being edited, reset the form
        if (editingId === id) {
          handleCancelEdit();
        }
        
        fetchInitialData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={open} />

      <div className="main-content">
        <Navbar />

        <div className="permission-page">
          {/* Header & Breadcrumbs */}
          <div className="page-header">
            <h2>Role & Permission Management</h2>
            <p className="breadcrumb">
              <Link to="/AdminDashboard">Home</Link>
              <span> / </span>
              <span className="active-page">Role Permission</span>
            </p>
          </div>

          {/* Form Card */}
          <div className="permission-card">
            <h3>{editingId ? "Edit Role Permission" : "Assign Role Permission"}</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Select User *</label>
                  <select
                    name="userId"
                    value={userRole.userId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select User --</option>
                    {usersList.map((u) => {
                      const id = u.userId ?? u.UserId;
                      const name = u.fullName ?? u.FullName ?? u.userName ?? u.UserName;
                      return (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Role *</label>
                  <select
                    name="roleId"
                    value={userRole.roleId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Role --</option>
                    {rolesList.map((r) => {
                      const id = r.roleId ?? r.RoleId;
                      const name = r.roleName ?? r.RoleName;
                      return (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="button-group-inline">
                  <button type="submit" className="save-btn">
                    <AddOutlinedIcon fontSize="small" />
                    {editingId ? "Update Role" : "Assign Role"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                      style={{ marginLeft: "8px" }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Assigned Roles Table */}
          <div className="permission-card">
            <h3>Assigned Roles</h3>

            {loading ? (
              <p style={{ padding: "10px" }}>Loading records...</p>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User Name</th>
                      <th>Role Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {permissions.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>
                          No data found.
                        </td>
                      </tr>
                    ) : (
                      permissions.map((item) => {
                        const permId = item.rolePermissionId ?? item.RolePermissionId;
                        const uId = item.userId ?? item.UserId;
                        const rId = item.roleId ?? item.RoleId;

                        // Lookup names using helper functions
                        const userName = getUserNameById(uId);
                        const roleName = getRoleNameById(rId);

                        return (
                          <tr key={permId}>
                            <td>{permId}</td>
                            <td className="user-name">{userName}</td>
                            <td>
                              <span
                                className={`role-badge role-${String(roleName).toLowerCase()}`}
                              >
                                {roleName}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  className="edit-btn"
                                  title="Edit Permission"
                                  onClick={() => handleEdit(item)}
                                >
                                  <EditOutlinedIcon fontSize="small" />
                                </button>
                                <button
                                  className="delete-btn"
                                  title="Delete Permission"
                                  onClick={() => handleDelete(permId)}
                                >
                                  <DeleteOutlineOutlinedIcon fontSize="small" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default RolePermission;