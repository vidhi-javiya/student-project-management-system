import React, { useState, useEffect } from "react";
import "./PriorityManagement.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

// MUI Icons
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const API_URL = "https://localhost:7187/api/Priority";

const PriorityManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // States
  const [priorities, setPriorities] = useState([]);
  const [priorityName, setPriorityName] = useState("");
  const [cssClass, setCssClass] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all priorities on component mount
  useEffect(() => {
    fetchPriorities();
  }, []);

  // 1. GET: Fetch Priorities from Backend
  const fetchPriorities = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch priority list.");
      }
      const data = await response.json();
      setPriorities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. POST / PUT: Handle Create or Update Priority
  const handleSave = async () => {
    if (!priorityName.trim() || !cssClass.trim()) {
      alert("Please fill all fields.");
      return;
    }

    const payload = {
      priorityID: editId ? editId : 0,
      priorityName: priorityName.trim(),
      priortyCssClass: cssClass.trim(),
    };

    try {
      const isEdit = editId !== null;
      const url = isEdit ? `${API_URL}/${editId}` : API_URL;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(isEdit ? "Failed to update priority." : "Failed to add priority.");
      }

      alert(isEdit ? "Priority updated successfully!" : "Priority added successfully!");
      handleCancelEdit();
      fetchPriorities();
    } catch (error) {
      console.error("Save Error:", error);
      alert(error.message);
    }
  };

  // Populate form fields for editing
  const handleEditClick = (item) => {
    const id = item.priorityID ?? item.PriorityID;
    const name = item.priorityName ?? item.PriorityName;
    const css = item.priortyCssClass ?? item.PriortyCssClass ?? item.priorityCssClass;

    setEditId(id);
    setPriorityName(name);
    setCssClass(css);
  };

  // Cancel edit mode and clear form
  const handleCancelEdit = () => {
    setEditId(null);
    setPriorityName("");
    setCssClass("");
  };

  // 3. DELETE: Remove Priority Record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Priority?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete priority record.");
      }

      alert("Priority deleted successfully!");

      if (editId === id) {
        handleCancelEdit();
      }

      fetchPriorities();
    } catch (error) {
      console.error("DELETE Error:", error);
      alert(error.message);
    }
  };

  // Dynamic inline badge styles for visual preview
  const getBadgeStyle = (className) => {
    switch (className) {
      case "badge-danger":
        return { backgroundColor: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5" };
      case "badge-warning":
        return { backgroundColor: "#fef3c7", color: "#d97706", border: "1px solid #fde68a" };
      case "badge-success":
        return { backgroundColor: "#d1fae5", color: "#059669", border: "1px solid #6ee7b7" };
      default:
        return { backgroundColor: "#e5e7eb", color: "#374151", border: "1px solid #d1d5db" };
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} />

      {/* Main Content */}
      <div className="main-content">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="page-content">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span
              className="home-link"
              onClick={() => (window.location.href = "/AdminDashboard")}
            >
              Home
            </span>
            <span> / Priority Management</span>
          </div>

          <div className="priority-card">
            <div className="page-header">
              <h2>Priority Management</h2>
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Priority Name (e.g., High)"
                value={priorityName}
                onChange={(e) => setPriorityName(e.target.value)}
              />

              <input
                type="text"
                placeholder="CSS Class (e.g., badge-danger)"
                value={cssClass}
                onChange={(e) => setCssClass(e.target.value)}
              />

              <button onClick={handleSave} className="add-btn">
                {editId !== null ? "Update Priority" : "Add Priority"}
              </button>

              {editId !== null && (
                <button onClick={handleCancelEdit} className="cancel-btn">
                  Cancel
                </button>
              )}
            </div>

            {loading ? (
              <p style={{ padding: "10px" }}>Loading records...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Priority</th>
                    <th>CSS Class</th>
                    <th>Preview</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {priorities.map((item) => {
                    const id = item.priorityID ?? item.PriorityID;
                    const name = item.priorityName ?? item.PriorityName;
                    const css =
                      item.priortyCssClass ??
                      item.PriortyCssClass ??
                      item.priorityCssClass;

                    return (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>{name}</td>
                        <td>{css}</td>

                        {/* Preview Column */}
                        <td>
                          <div
                            style={{
                              display: "inline-block",
                              padding: "6px 14px",
                              borderRadius: "20px",
                              fontWeight: "600",
                              fontSize: "13px",
                              ...getBadgeStyle(css),
                            }}
                          >
                            {name}
                          </div>
                        </td>

                        {/* Action Column */}
                        <td>
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="edit-btn"
                              title="Edit"
                              onClick={() => handleEditClick(item)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </button>

                            <button
                              type="button"
                              className="delete-btn"
                              title="Delete"
                              onClick={() => handleDelete(id)}
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {priorities.length === 0 && (
                    <tr>
                      <td colSpan="5" className="no-data">
                        No Priority Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default PriorityManagement;