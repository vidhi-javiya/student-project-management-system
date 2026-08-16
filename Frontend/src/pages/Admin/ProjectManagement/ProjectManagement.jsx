import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProjectManagement.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const ProjectManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // States
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [status, setStatus] = useState("");

  const API_URL = "https://localhost:7187/api/Project";

  // Fetch Projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch projects data from API.");
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Format Date Helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Filter Projects based on IsDeleted, Title/Description & Status
  const filteredProjects = projects.filter((project) => {
    if (project.isDeleted || project.IsDeleted) return false;

    const projectTitle = project.projectTitle || project.ProjectTitle || "";
    const description = project.description || project.Description || "";
    const statusName = project.statusName || project.StatusName || "";

    const matchTitle =
      projectTitle.toLowerCase().includes(filterSearch.toLowerCase()) ||
      description.toLowerCase().includes(filterSearch.toLowerCase());

    const matchStatus = status === "" || statusName === status;

    return matchTitle && matchStatus;
  });

  // Soft Delete API Integration
  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(`${API_URL}/${projectId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setProjects((prevProjects) =>
            prevProjects.filter((p) => (p.projectId || p.ProjectId) !== projectId)
          );
        } else {
          alert("Failed to delete the project. Please try again.");
        }
      } catch (err) {
        console.error("Error deleting project:", err);
        alert("An error occurred while deleting the project.");
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} />

      <div className="main-content">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="project-page">
          {/* Breadcrumb */}
          <div>
            <h2 className="tasks-title">Manage Project</h2>
            <div className="breadcrumb">
              <Link to="/AdminDashboard">Home</Link> <span> / Projects</span>
            </div>
          </div>

          {/* Card Container */}
          <div className="project-card">
            <div className="project-header">
              <Link to="/admin/projects/add" className="add-btn">
                <AddOutlinedIcon />
                Add Project
              </Link>
            </div>

            {/* Filter Box */}
            <div className="filter-box">
              <div className="form-group">
                <label>Search</label>
                <input
                  type="text"
                  placeholder="Search by Title, Description..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setFilterSearch(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Not Started">Not Started</option>
                </select>
              </div>
            </div>

            {/* SPM_Project Table */}
            <div className="table-container">
              {loading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  Loading Projects...
                </div>
              ) : error ? (
                <div style={{ textAlign: "center", color: "red", padding: "20px" }}>
                  {error}
                </div>
              ) : (
                <table className="project-table">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Project Title & Description</th>
                      <th>Status</th>
                      <th>Assigned To (Faculty & Student)</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Tasks Progress</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project, index) => {
                        const pId = project.projectId || project.ProjectId;
                        const pTitle = project.projectTitle || project.ProjectTitle;
                        const pDesc = project.description || project.Description;
                        const pStatus = project.statusName || project.StatusName || "N/A";
                        const fName = project.facultyName || project.FacultyName || "N/A";
                        const sName = project.studentName || project.StudentName || "N/A";
                        const sDate = formatDate(project.startDate || project.StartDate);
                        const eDate = formatDate(project.endDate || project.EndDate);
                        
                        // Tasks ની ગણતરી અને Safe Conversions
                        const cTasks = Number(project.completedTasks ?? project.CompletedTasks ?? 0);
                        const tTasks = Number(project.totalTasks ?? project.TotalTasks ?? 0);

                        // ટકાવારીની ગણતરી (જો Total Tasks > 0 હોય તો જ ચાલશે)
                        const computedProgress = tTasks > 0
                          ? Math.min(100, Math.round((cTasks / tTasks) * 100))
                          : 0;

                        return (
                          <tr key={pId}>
                            <td>{index + 1}</td>

                            {/* Project Title & Description */}
                            <td>
                              <div className="project-title-box">
                                <span className="p-title">{pTitle}</span>
                                <span className="p-desc">{pDesc}</span>
                              </div>
                            </td>

                            {/* Project Status */}
                            <td>
                              <span
                                className={`status ${pStatus
                                  .toLowerCase()
                                  .replace(/\s/g, "-")}`}
                              >
                                {pStatus}
                              </span>
                            </td>

                            {/* Faculty & Student Information */}
                            <td>
                              <div className="assigned-cell">
                                <div className="person-info faculty">
                                  <SchoolOutlinedIcon className="icon faculty-icon" />
                                  <span>
                                    <strong>Faculty:</strong> {fName}
                                  </span>
                                </div>
                                <div className="person-info student">
                                  <PersonOutlinedIcon className="icon student-icon" />
                                  <span>
                                    <strong>Student:</strong> {sName}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Start & End Date */}
                            <td>{sDate}</td>
                            <td>{eDate}</td>

                            {/* Tasks Progress */}
                            <td>
                              <div className="progress-cell">
                                <span className="task-count">
                                  {cTasks} / {tTasks} Tasks
                                </span>
                                <div className="progress-bar-container">
                                  <div
                                    className="progress-bar-fill"
                                    style={{
                                      width: `${computedProgress}%`,
                                      backgroundColor: "#4caf50", // પ્રોગ્રેસ બારનો ગ્રીન કલર ફોર્સપૂર્વક સેટ કર્યો છે
                                      height: "100%"
                                    }}
                                  ></div>
                                </div>
                                <span className="progress-text">
                                  {computedProgress}%
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td>
                              <div className="action-buttons">
                                <Link
                                  to={`/admin/projects/edit/${pId}`}
                                  className="edit-btn"
                                  title="Edit Project"
                                >
                                  <EditOutlinedIcon fontSize="small" />
                                </Link>

                                <button
                                  className="delete-btn"
                                  onClick={() => handleDelete(pId)}
                                  title="Delete Project"
                                >
                                  <DeleteOutlineOutlinedIcon fontSize="small" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="no-data">
                          No Projects Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ProjectManagement;