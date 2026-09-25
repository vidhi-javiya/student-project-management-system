import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddUser.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

const BASE_URL = "https://localhost:7187";
const API_USER = `${BASE_URL}/api/User`;
const API_ROLE = `${BASE_URL}/api/Role`;
const API_USER_ROLE = `${BASE_URL}/api/UserRole`;

const AddUser = () => {
  const navigate = useNavigate();
  const [open] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
    roleId: "",
    isActive: true,
  });

  const [rolesList, setRolesList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // 1. Fetch Roles List for Dropdown
  useEffect(() => {
    fetch(API_ROLE)
      .then((res) => res.json())
      .then((data) => {
        setRolesList(Array.isArray(data) ? data : data.$values || []);
      })
      .catch((err) => console.error("Error fetching roles:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setUser({
      ...user,
      [name]: type === "select-one" && name === "isActive" ? value === "true" : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (
      !user.fullName ||
      !user.email ||
      !user.password ||
      !user.mobileNumber ||
      !user.roleId ||
      !selectedFile
    ) {
      alert("Please fill all required fields and select a profile picture.");
      return;
    }

    setLoading(true);

    try {
      // Step A: Build FormData (including roleId)
      const formData = new FormData();
      formData.append("fullName", user.fullName);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("mobileNumber", user.mobileNumber);
      formData.append("isActive", user.isActive);
      formData.append("roleId", parseInt(user.roleId)); // 👈 મુખ્ય ફેરફાર: roleId પણ અહીં મોકલવો જરૂરી છે
      formData.append("profilePicture", selectedFile);

      const response = await fetch(API_USER, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server Error: ${response.status}`);
      }

      // Read Response to get New UserId
      const responseData = await response.json();
      const createdUserId = responseData.userId || responseData.UserId || responseData.id;

      // Step B: Direct Insert to SPM_UserRole Table (જો DB માં Mapping Table વાપરતા હોવ તો)
      if (createdUserId && user.roleId) {
        try {
          await fetch(API_USER_ROLE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: parseInt(createdUserId),
              roleId: parseInt(user.roleId),
            }),
          });
        } catch (urErr) {
          console.warn("UserRole API Post warning:", urErr);
        }

        // Step C: Save Mapping in LocalStorage as Backup
        const savedRoleMap = JSON.parse(localStorage.getItem("spm_user_role_map") || "{}");
        savedRoleMap[createdUserId] = parseInt(user.roleId);
        localStorage.setItem("spm_user_role_map", JSON.stringify(savedRoleMap));
      }

      alert("User Added & Role Assigned Successfully!");
      navigate("/admin/users");
    } catch (err) {
      console.error("API Error:", err);
      setErrorMsg(err.message || "An error occurred while saving user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={open} />

      <div className="main-content">
        <Navbar />

        <div className="add-user-page">
          <div className="page-header">
            <h2>Add User</h2>
            <p className="breadcrumb">
              <Link to="/AdminDashboard">Home</Link>
              <span> /</span>
              <Link to="/admin/users"> Users</Link>
              <span> /</span>
              <span className="active-page">Add</span>
            </p>
          </div>

          <div className="add-user-card">
            <h3>User Details</h3>

            {errorMsg && <div className="error-alert">{errorMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    value={user.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={user.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={user.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="text"
                    name="mobileNumber"
                    placeholder="Enter mobile number"
                    maxLength="15"
                    value={user.mobileNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    name="roleId"
                    value={user.roleId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Role --</option>
                    {rolesList.map((r, index) => (
                      <option key={r.roleId || r.RoleId || index} value={String(r.roleId || r.RoleId)}>
                        {r.roleName || r.RoleName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="isActive"
                    value={user.isActive}
                    onChange={handleChange}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Profile Picture *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                  {previewImage && (
                    <div style={{ marginTop: "10px" }}>
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid #007bff",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="button-group">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save User"}
                </button>

                <Link to="/admin/users" className="back-btn">
                  ← Back
                </Link>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AddUser;