import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./RoleManagement.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

// 1. Finding the API Link (PDF Page 1)
const url = "https://localhost:7187/api/Role";

const RoleManagement = () => {
  // 2. Setting Up Your Data Structure (PDF Page 1)
  const [roles, setRolesState] = useState([]); // State for Displaying All Records
  const [role, setRole] = useState({ roleName: "", description: "" }); // State for Single Record
  const [refresh, setRefresh] = useState(true); // State for Refreshing Data
  const [viewMode, setViewMode] = useState("list"); // State for Managing Screens ('list', 'add', 'edit')

  const [search, setSearch] = useState("");

  // 3. Displaying All Records - Fetching Data on Page Load (PDF Page 2)
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        // Safe check for Direct Array or EF Wrapped Array
        if (Array.isArray(res)) {
          setRolesState(res);
        } else if (res && res.$values) {
          setRolesState(res.$values);
        } else {
          setRolesState([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching roles:", err);
        setRolesState([]);
      });
  }, [refresh]);

  // Handle Add New Button
  const handleAddNew = () => {
    setRole({ roleName: "", description: "" });
    setViewMode("add");
  };

  // 5. Editing an Existing Record - Fetch & Pre-fill the state (PDF Page 4)
  const handleEdit = (roleId) => {
    fetch(url + "/" + roleId)
      .then((res) => res.json())
      .then((res) => {
        setRole(res);
        setViewMode("edit");
      })
      .catch((err) => console.error("Error fetching single role:", err));
  };

  // 4 & 5. Save Record (POST for Add / PUT for Edit) (PDF Page 3 & 4)
  const handleSave = (e) => {
    e.preventDefault();

    if (viewMode === "add") {
      fetch(url, {
        method: "POST",
        body: JSON.stringify(role),
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        setRefresh(!refresh); // use for get fresh data after changes
        setViewMode("list"); // Returns to the list screen
      });
    } else if (viewMode === "edit") {
      fetch(url + "/" + role.roleId, {
        method: "PUT",
        body: JSON.stringify(role),
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        setRefresh(!refresh); // use for get fresh data after changes
        setViewMode("list"); // Returns to the list screen
      });
    }
  };

  // 6. Deleting a Record (PDF Page 5)
  const handleDeleteRole = (roleId, roleName) => {
    if (confirm(`Are you sure you want to delete this role: ${roleName}?`)) {
      fetch(url + "/" + roleId, {
        method: "DELETE",
      }).then((res) => {
        setRefresh(!refresh); // use for get fresh data after changes
      });
    }
  };

  // Safe Search Filter Logic
  const filteredRoles = Array.isArray(roles)
    ? roles.filter((r) => {
        const name = r && r.roleName ? String(r.roleName).toLowerCase() : "";
        const desc = r && r.description ? String(r.description).toLowerCase() : "";
        return (
          name.includes(search.toLowerCase()) ||
          desc.includes(search.toLowerCase())
        );
      })
    : [];

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="role-page">
          <div className="page-header">
            <h2>Manage Roles</h2>
            <p className="breadcrumb">
              <Link to="/AdminDashboard">Home</Link> <span>/</span>{" "}
              <span className="active-page">Roles</span>
            </p>
          </div>

          <div className="role-card">
            {/* LIST VIEW (PDF Page 2) */}
            {viewMode === "list" && (
              <>
                <div className="role-top">
                  <div className="search-box">
                    <SearchOutlinedIcon />
                    <input
                      type="text"
                      placeholder="Search Roles..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <button className="add-btn" onClick={handleAddNew}>
                    <AddOutlinedIcon /> Add Role
                  </button>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Role Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoles.length > 0 ? (
                      filteredRoles.map((r, idx) => (
                        <tr key={r.roleId || idx}>
                          <td>{idx + 1}</td>
                          <td>{r.roleName}</td>
                          <td>{r.description || "-"}</td>
                          <td>
                            <button
                              className="edit-btn"
                              onClick={() => handleEdit(r.roleId)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleDeleteRole(r.roleId, r.roleName)
                              }
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          style={{ textAlign: "center", padding: "15px" }}
                        >
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            )}

            {/* ADD / EDIT VIEW (PDF Page 3 & 4) */}
            {(viewMode === "add" || viewMode === "edit") && (
              <div className="role-form-container">
                <h3>{viewMode === "add" ? "Add New Role" : "Edit Role"}</h3>
                <form onSubmit={handleSave}>
                  <div className="form-group">
                    <label>Role Name</label>
                    <input
                      type="text"
                      required
                      value={role ? role.roleName : ""}
                      onChange={(e) =>
                        setRole({ ...role, roleName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      required
                      value={role ? role.description : ""}
                      onChange={(e) =>
                        setRole({ ...role, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      {viewMode === "add" ? "Save Role" : "Update Role"}
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setViewMode("list")}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default RoleManagement;