import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AddUser.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

const BASE_URL = "https://localhost:7187";
const API_USER = `${BASE_URL}/api/User`;
const API_ROLE = `${BASE_URL}/api/Role`;
const API_USER_ROLE = `${BASE_URL}/api/UserRole`;

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [user, setUser] = useState({
    userId: "",
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

  // Fetch Roles List and Single User Details
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch Roles Dropdown
        const rolesRes = await fetch(API_ROLE);
        const rolesData = rolesRes.ok ? await rolesRes.json() : [];
        setRolesList(Array.isArray(rolesData) ? rolesData : rolesData.$values || []);

        // Fetch User Details
        const userRes = await fetch(`${API_USER}/${id}`);
        if (!userRes.ok) throw new Error("Failed to load user details.");
        const userData = await userRes.json();

        // Fetch Existing Role Mapping for this User
        let existingRoleId = userData.roleId || userData.RoleId || "";
        if (!existingRoleId) {
          try {
            const userRoleRes = await fetch(`${API_USER_ROLE}/user/${id}`);
            if (userRoleRes.ok) {
              const urData = await userRoleRes.json();
              existingRoleId = urData.roleId || urData.RoleId || "";
            }
          } catch {
            // Fallback to local storage mapping
            const localSavedMap = JSON.parse(localStorage.getItem("spm_user_role_map") || "{}");
            existingRoleId = localSavedMap[id] || "";
          }
        }

        setUser({
          userId: userData.userId || userData.UserId || id,
          fullName: userData.fullName || userData.FullName || "",
          email: userData.email || userData.Email || "",
          password: "",
          mobileNumber: userData.mobileNumber || userData.MobileNumber || "",
          roleId: existingRoleId ? String(existingRoleId) : "",
          isActive: userData.isActive !== undefined ? userData.isActive : (userData.IsActive ?? true),
        });

        const rawPath = userData.profilePicturePath || userData.ProfilePicturePath;
        if (rawPath) {
          let cleanPath = rawPath.replace(/\\/g, "/").replace(/^Uploads\//i, "").replace(/^\/Uploads\//i, "");
          if (!cleanPath.startsWith("/")) cleanPath = `/${cleanPath}`;
          setPreviewImage(`${BASE_URL}${cleanPath}?v=${Math.random()}`);
        }
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "select-one" && name === "isActive" ? value === "true" : value,
    }));
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

    if (!user.fullName || !user.email || !user.mobileNumber || !user.roleId) {
      alert("Please fill all required fields including Role.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Prepare FormData for User Update
      const formData = new FormData();
      formData.append("userId", user.userId);
      formData.append("fullName", user.fullName);
      formData.append("email", user.email);
      formData.append("mobileNumber", user.mobileNumber);
      formData.append("isActive", user.isActive);
      
      // 👈 Key Fix: Append roleId in FormData
      formData.append("roleId", parseInt(user.roleId));

      if (user.password) {
        formData.append("password", user.password);
      }

      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      // Update SPM_User Data via PUT
      const userResponse = await fetch(`${API_USER}/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        throw new Error(errorText || "Failed to update user.");
      }

      // 2. Separate Role Mapping Call (If backend requires mapping table sync)
      try {
        await fetch(API_USER_ROLE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: parseInt(id),
            roleId: parseInt(user.roleId),
          }),
        });
      } catch (urErr) {
        console.warn("UserRole API execution warning:", urErr);
      }

      // 3. Update LocalStorage Backup Map
      const localSavedMap = JSON.parse(localStorage.getItem("spm_user_role_map") || "{}");
      localSavedMap[id] = parseInt(user.roleId);
      localStorage.setItem("spm_user_role_map", JSON.stringify(localSavedMap));

      alert("User and Role Updated Successfully!");
      navigate("/admin/users");
    } catch (err) {
      console.error("Update Error:", err);
      setErrorMsg(err.message || "An error occurred while updating user.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar open={open} />
        <div className="main-content">
          <Navbar />
          <p style={{ padding: "20px" }}>Loading User Data...</p>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar open={open} />

      <div className="main-content">
        <Navbar />

        <div className="add-user-page">
          <div className="page-header">
            <h2>Edit User</h2>
            <p className="breadcrumb">
              <Link to="/AdminDashboard">Home</Link>
              <span> /</span>
              <Link to="/admin/users"> Users</Link>
              <span> /</span>
              <span className="active-page">Edit</span>
            </p>
          </div>

          <div className="add-user-card">
            <h3>Update Details</h3>

            {errorMsg && <div className="error-alert">{errorMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
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
                    value={user.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password (Leave blank to keep existing)</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={user.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="text"
                    name="mobileNumber"
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
                    value={String(user.roleId)}
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
                  <label>Profile Picture (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
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
                <button type="submit" className="save-btn" disabled={submitting}>
                  {submitting ? "Updating..." : "Update User"}
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

export default EditUser;