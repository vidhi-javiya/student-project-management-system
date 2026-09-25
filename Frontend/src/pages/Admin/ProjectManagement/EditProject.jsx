import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AddProject.css"; // AddProject.css નો જ ઉપયોગ કરે છે

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BASE_URL = "https://localhost:7187";
const API_USER = `${BASE_URL}/api/User`;
const API_ROLE = `${BASE_URL}/api/Role`;
const API_USER_ROLE = `${BASE_URL}/api/UserRole`;
const API_PROJECT = `${BASE_URL}/api/Project`;
const API_STATUS = `${BASE_URL}/api/Status`;

const EditProject = () => {
  const { id } = useParams(); // URL માંથી Project ID મેળવે છે
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [facultyList, setFacultyList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [loadingProject, setLoadingProject] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State Matching Exact SPM_Project Database Columns
  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    startDate: "",
    endDate: "",
    projectStatus: "",
    facultyId: "",
    studentId: "",
    totalTasks: 0,
    completedTasks: 0,
  });

  // 1. Fetch Statuses
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setLoadingStatuses(true);
        const res = await fetch(API_STATUS);
        if (!res.ok) throw new Error("Failed to fetch status list");

        const data = await res.json();
        const rawStatuses = Array.isArray(data) ? data : data.$values || [];

        setStatusList(rawStatuses);
      } catch (err) {
        console.error("Error fetching statuses:", err);
      } finally {
        setLoadingStatuses(false);
      }
    };

    fetchStatuses();
  }, []);

  // 2. Fetch Users & Precise Role Filtering (Fixed Logic)
  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        setLoadingUsers(true);

        const [usersRes, rolesRes, userRolesRes] = await Promise.all([
          fetch(API_USER),
          fetch(API_ROLE).catch(() => null),
          fetch(API_USER_ROLE).catch(() => null),
        ]);

        if (!usersRes.ok) throw new Error("Failed to fetch users");

        const usersData = await usersRes.json();
        const rolesData = rolesRes && rolesRes.ok ? await rolesRes.json() : [];
        const userRolesData = userRolesRes && userRolesRes.ok ? await userRolesRes.json() : [];

        const rawUsers = Array.isArray(usersData) ? usersData : usersData.$values || [];
        const rawRoles = Array.isArray(rolesData) ? rolesData : rolesData.$values || [];
        const rawUserRoles = Array.isArray(userRolesData) ? userRolesData : userRolesData.$values || [];

        // Step A: Role ID -> Role Name Dictionary
        const roleDict = {};
        rawRoles.forEach((r) => {
          const rId = String(r.roleId || r.RoleId || "");
          const rName = (r.roleName || r.RoleName || "").toLowerCase();
          if (rId) {
            roleDict[rId] = rName;
          }
        });

        // Step B: User ID -> Role Name Mapping
        const userRoleMap = {};
        rawUserRoles.forEach((ur) => {
          const uId = String(ur.userId || ur.UserId || "");
          const rId = String(ur.roleId || ur.RoleId || "");
          if (uId && rId && roleDict[rId]) {
            userRoleMap[uId] = roleDict[rId];
          }
        });

        // LocalStorage Fallback Safety
        const localSavedMap = JSON.parse(localStorage.getItem("spm_user_role_map") || "{}");

        const faculties = [];
        const students = [];

        rawUsers.forEach((u) => {
          const uId = u.userId || u.UserId || u.id;
          const uName = u.fullName || u.FullName || u.userName || u.UserName || `User ${uId}`;
          const formattedUser = { id: parseInt(uId), name: uName };

          // Direct Role ID attached with User Object or Junction Mapping
          const directRoleId = String(u.roleId || u.RoleId || localSavedMap[uId] || "");
          let roleName = (roleDict[directRoleId] || userRoleMap[String(uId)] || "").toLowerCase();

          const isFaculty =
            roleName.includes("faculty") ||
            roleName.includes("teacher") ||
            roleName.includes("guide") ||
            roleName.includes("professor");

          const isStudent = roleName.includes("student");

          if (isFaculty) {
            faculties.push(formattedUser);
          } else if (isStudent) {
            students.push(formattedUser);
          }
        });

        setFacultyList(faculties);
        setStudentList(students);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsersAndRoles();
  }, []);

  // 3. Fetch Existing Project Details by ID
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;

      try {
        setLoadingProject(true);
        const res = await fetch(`${API_PROJECT}/${id}`);
        if (!res.ok) throw new Error("પ્રોજેક્ટ ડેટા મેળવવામાં નિષ્ફળતા મળી.");

        const data = await res.json();

        // ISO Date (2026-08-10T00:00:00) -> HTML Date input (YYYY-MM-DD)
        const formatDate = (dateStr) => {
          if (!dateStr) return "";
          return dateStr.split("T")[0];
        };

        setFormData({
          projectTitle: data.projectTitle || data.ProjectTitle || "",
          description: data.description || data.Description || "",
          startDate: formatDate(data.startDate || data.StartDate),
          endDate: formatDate(data.endDate || data.EndDate),
          projectStatus: data.projectStatus || data.ProjectStatus || data.statusID || data.StatusID || "",
          facultyId: data.facultyId || data.FacultyId || "",
          studentId: data.studentId || data.StudentId || "",
          totalTasks: data.totalTasks ?? data.TotalTasks ?? 0,
          completedTasks: data.completedTasks ?? data.CompletedTasks ?? 0,
        });
      } catch (err) {
        console.error("Error fetching project:", err);
        alert(err.message || "Project Details Load ના થઈ શક્યા.");
        navigate("/admin/projects");
      } finally {
        setLoadingProject(false);
      }
    };

    fetchProjectDetails();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const total = parseInt(formData.totalTasks) || 0;
    const completed = parseInt(formData.completedTasks) || 0;

    if (completed > total) {
      alert("Completed Tasks ની સંખ્યા Total Tasks કરતાં વધારે ન હોઈ શકે.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        projectId: parseInt(id),
        projectTitle: formData.projectTitle.trim(),
        description: formData.description ? formData.description.trim() : null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        projectStatus: parseInt(formData.projectStatus),
        facultyId: parseInt(formData.facultyId),
        studentId: parseInt(formData.studentId),
        totalTasks: total,
        completedTasks: completed,
      };

      const res = await fetch(`${API_PROJECT}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Project Updated Successfully!");
        navigate("/admin/projects");
      } else {
        const errText = await res.text();

        if (errText.includes("already exists") || res.status === 400 || res.status === 409) {
          alert("આ શીર્ષક (Project Title) વાળો પ્રોજેક્ટ પહેલાથી જ અસ્તિત્વમાં છે. કૃપા કરીને બીજું નામ લખો.");
        } else {
          alert("Failed to update project: " + errText);
        }
      }
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Server Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Real-time Progress Calculated for UI Preview
  const previewProgress =
    formData.totalTasks > 0
      ? Math.round((formData.completedTasks / formData.totalTasks) * 100)
      : 0;

  if (loadingProject) {
    return (
      <div className="dashboard-layout">
        <Sidebar open={sidebarOpen} />
        <div className="main-content">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="add-project-page" style={{ padding: "40px", textAlign: "center" }}>
            <h3>Loading Project Details (ID: #{id})...</h3>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} />

      <div className="main-content">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="add-project-page">
          <h2 className="page-heading">Edit Project</h2>
          <div className="breadcrumb">
            <Link to="/AdminDashboard">Home</Link> /{" "}
            <Link to="/admin/projects">Projects</Link> / <span>Edit #{id}</span>
          </div>

          <div className="form-card">
            <h3 className="section-title">Update Project Details</h3>

            <form onSubmit={handleSubmit} className="project-form">
              {/* Project Title */}
              <div className="form-row single-col">
                <label>Project Title *</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="projectTitle"
                    placeholder="Enter project title"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-row single-col">
                <label>Description</label>
                <div className="input-wrapper">
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {/* Start Date & End Date */}
              <div className="form-row two-col">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Status & Supervising Faculty */}
              <div className="form-row two-col">
                <div className="form-group">
                  <label>Project Status *</label>
                  <select
                    name="projectStatus"
                    value={formData.projectStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      {loadingStatuses ? "Loading Statuses..." : "-- Select Status --"}
                    </option>
                    {statusList.map((st) => {
                      const stId = st.statusID ?? st.StatusID;
                      const stName = st.statusName ?? st.StatusName;
                      return (
                        <option key={stId} value={stId}>
                          {stName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label>Supervising Faculty *</label>
                  <select
                    name="facultyId"
                    value={formData.facultyId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      {loadingUsers ? "Loading Faculty..." : "-- Select Faculty --"}
                    </option>
                    {facultyList.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assigned Student */}
              <div className="form-row single-col">
                <div className="form-group">
                  <label>Assigned Student *</label>
                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      {loadingUsers ? "Loading Students..." : "-- Select Student --"}
                    </option>
                    {studentList.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Total Tasks & Completed Tasks */}
              <div className="form-row two-col">
                <div className="form-group">
                  <label>Total Tasks</label>
                  <input
                    type="number"
                    name="totalTasks"
                    min="0"
                    placeholder="e.g. 10"
                    value={formData.totalTasks}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Completed Tasks</label>
                  <input
                    type="number"
                    name="completedTasks"
                    min="0"
                    placeholder="e.g. 3"
                    value={formData.completedTasks}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Progress Bar Preview */}
              <div className="form-row single-col" style={{ marginTop: "5px" }}>
                <label>Progress Preview ({previewProgress}%)</label>
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#e0e0e0",
                    height: "10px",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${previewProgress > 100 ? 100 : previewProgress}%`,
                      backgroundColor: previewProgress === 100 ? "#4caf50" : "#2196f3",
                      height: "100%",
                      transition: "width 0.3s ease",
                    }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="form-actions" style={{ marginTop: "20px" }}>
                <button type="submit" className="save-btn" disabled={submitting}>
                  <CheckIcon fontSize="small" /> {submitting ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => navigate("/admin/projects")}
                >
                  <ArrowBackIcon fontSize="small" /> Back
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

export default EditProject;