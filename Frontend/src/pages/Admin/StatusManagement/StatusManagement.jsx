import React, { useState, useEffect } from "react";
import "./StatusManagement.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

// MUI Icons
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const API_URL = "https://localhost:7187/api/Status";

const StatusManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Component States
  const [statuses, setStatuses] = useState([]);
  const [statusName, setStatusName] = useState("");
  const [statusCssClass, setStatusCssClass] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch status list on component load
  useEffect(() => {
    fetchStatuses();
  }, []);

  // 1. GET: Fetch all statuses from API
  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch status records.");
      }
      const data = await response.json();
      setStatuses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET Request Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. POST / PUT: Create or Update Status record
  const handleSave = async () => {
    if (!statusName.trim() || !statusCssClass.trim()) {
      alert("Please fill all fields.");
      return;
    }

    const payload = {
      statusID: editId ? editId : 0,
      statusName: statusName.trim(),
      statusCssClass: statusCssClass.trim(),
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
        throw new Error(
          isEdit ? "Failed to update status." : "Failed to create status."
        );
      }

      alert(
        isEdit
          ? "Status updated successfully!"
          : "Status added successfully!"
      );

      handleCancelEdit();
      fetchStatuses();
    } catch (error) {
      console.error("Save Request Error:", error);
      alert(error.message);
    }
  };

  // Populate form fields for editing
  const handleEditClick = (item) => {
    const id = item.statusID ?? item.StatusID;
    const name = item.statusName ?? item.StatusName;
    const css = item.statusCssClass ?? item.StatusCssClass;

    setEditId(id);
    setStatusName(name);
    setStatusCssClass(css);
  };

  // Reset form inputs and exit edit mode
  const handleCancelEdit = () => {
    setEditId(null);
    setStatusName("");
    setStatusCssClass("");
  };

  // 3. DELETE: Remove Status by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this status?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete status.");
      }

      alert("Status deleted successfully!");

      if (editId === id) {
        handleCancelEdit();
      }

      fetchStatuses();
    } catch (error) {
      console.error("DELETE Request Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Section */}
      <Sidebar open={sidebarOpen} />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="page-content">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb">
            <span
              className="home-link"
              onClick={() => (window.location.href = "/AdminDashboard")}
            >
              Home
            </span>
            <span> / Status Management</span>
          </div>

          <div className="status-card">
            <div className="page-header">
              <h2>Status Management</h2>
            </div>

            {/* Input Form */}
            <div className="form-group">
              <input
                type="text"
                placeholder="Status Name (e.g. Pending)"
                value={statusName}
                onChange={(e) => setStatusName(e.target.value)}
              />

              <input
                type="text"
                placeholder="CSS Class (e.g. badge-warning)"
                value={statusCssClass}
                onChange={(e) => setStatusCssClass(e.target.value)}
              />

              <button onClick={handleSave} className="add-btn">
                {editId !== null ? "Update Status" : "Add Status"}
              </button>

              {editId !== null && (
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>

            {/* Status List Table */}
            {loading ? (
              <p style={{ padding: "10px" }}>Loading records...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Status ID</th>
                    <th>Status Name</th>
                    <th>CSS Class</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {statuses.map((item) => {
                    const id = item.statusID ?? item.StatusID;
                    const name = item.statusName ?? item.StatusName;
                    const css = item.statusCssClass ?? item.StatusCssClass;

                    return (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>{name}</td>
                        <td>{css}</td>

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

                  {statuses.length === 0 && (
                    <tr>
                      <td colSpan="4" className="no-data">
                        No Status Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <Footer />
      </div>
    </div>
  );
};

export default StatusManagement;