import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddRole.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

const AddRole = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault(); // Page reload થતું અટકાવશે
    setErrorMessage("");

    // 1. Client-side Validation (જો અંક / Digits હશે તો અહીં જ અટકી જશે)
    const letterOnlyRegex = /^[a-zA-Z]+$/;
    if (!letterOnlyRegex.test(roleName)) {
      setErrorMessage("Role Name must contain only letters (no digits or special characters).");
      return; // અહીંથી જ અટકી જશે, Home કે Roles page પર નહીં જાય
    }

    setLoading(true);

    try {
      // 2. Backend API Call
      const response = await fetch("https://localhost:7183/api/Role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roleName: roleName,
          description: description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend Validation Error આવે તો મેસેજ બતાવશે
        if (data.errors && data.errors.length > 0) {
          setErrorMessage(data.errors.join(", "));
        } else if (data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Validation failed.");
        }
      } else {
        // સફળ થાય તો જ બીજા પેજ પર જશે
        alert("Role Saved Successfully!");
        navigate("/admin/roles");
      }
    } catch (error) {
      console.error("API Error:", error);
      setErrorMessage("Unable to connect to server. Check API URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={open} />

      <div className="main-content">
        <Navbar />

        <div className="add-role-page">
          <div className="page-header">
            <h2>Add Role</h2>
            <p className="breadcrumb">
              <Link to="/AdminDashboard">Home</Link>
              <span> / </span>
              <Link to="/admin/roles">Roles</Link>
              <span> / </span>
              <span className="active-page">Add</span>
            </p>
          </div>

          <div className="form-card">
            <h3>Role Details</h3>

            {/* Error Message Display */}
            {errorMessage && (
              <div
                style={{
                  backgroundColor: "#ffebe9",
                  color: "#d93025",
                  padding: "12px",
                  borderRadius: "6px",
                  marginBottom: "15px",
                  border: "1px solid #ffcdd2",
                  fontWeight: "500",
                }}
              >
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Role Name</label>
                <input
                  type="text"
                  placeholder="Enter role name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="5"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="button-group">
                <button type="submit" className="save-btn" disabled={loading}>
                  <SaveOutlinedIcon />
                  {loading ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  className="back-btn"
                  onClick={() => navigate("/admin/roles")}
                >
                  <ArrowBackOutlinedIcon />
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AddRole;