import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import "./ManageTasks.css";

// MUI Icons
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const ManageTasks = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]); // Dynamic Status list from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const TASKS_API_URL = "https://localhost:7187/api/Task";
  const STATUS_API_URL = "https://localhost:7187/api/Status";

  // Dropdown Toggle State
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch Statuses from API (GET)
  const fetchStatuses = async () => {
    try {
      const response = await fetch(STATUS_API_URL);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch statuses`);
      }
      const data = await response.json();
      setStatuses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Status Error:", err);
    }
  };

  // Fetch Tasks from API (GET)
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(TASKS_API_URL);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch tasks`);
      }

      const data = await response.json();
      const activeTasks = (Array.isArray(data) ? data : []).filter(
        (task) => !task.isDeleted && !task.IsDeleted
      );
      setTasks(activeTasks);
      setError(null);
    } catch (err) {
      console.error("Fetch Tasks Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
    fetchTasks();
  }, []);

  // Delete Task via API (DELETE)
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(`${TASKS_API_URL}/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to delete task`);
      }

      setTasks((prevTasks) =>
        prevTasks.filter((t) => (t.taskId ?? t.TaskId) !== taskId)
      );
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete task. Please try again.");
    }
  };

  // Handle Dynamic Status Change (UI + Backend PUT)
  const handleStatusChange = async (taskId, selectedStatusObj) => {
    const selectedStatusId =
      selectedStatusObj.statusID ??
      selectedStatusObj.StatusID ??
      selectedStatusObj.statusId ??
      selectedStatusObj.StatusId;

    const selectedStatusName =
      selectedStatusObj.statusName ??
      selectedStatusObj.StatusName ??
      selectedStatusObj.name ??
      "";

    const targetTask = tasks.find(
      (t) => (t.taskId ?? t.TaskId) === taskId
    );
    if (!targetTask) return;

    let updatedProgress =
      targetTask.progressPercentage ?? targetTask.ProgressPercentage ?? 0;
    if (selectedStatusName.toLowerCase() === "pending") updatedProgress = 0;
    if (selectedStatusName.toLowerCase() === "completed") updatedProgress = 100;

    // Optimistic UI Update
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        const currentId = task.taskId ?? task.TaskId;
        if (currentId === taskId) {
          return {
            ...task,
            taskStatus: selectedStatusId,
            TaskStatus: selectedStatusId,
            statusName: selectedStatusName,
            StatusName: selectedStatusName,
            progressPercentage: updatedProgress,
            ProgressPercentage: updatedProgress,
          };
        }
        return task;
      })
    );
    setActiveDropdown(null);

    // Update backend via API
    try {
      const payload = {
        TaskId: Number(taskId),
        ProjectId: Number(targetTask.projectId ?? targetTask.ProjectId ?? 0),
        TaskTitle: (targetTask.taskTitle ?? targetTask.TaskTitle ?? "").toString(),
        TaskDescription: targetTask.taskDescription ?? targetTask.TaskDescription ?? null,
        TaskStatus: Number(selectedStatusId),
        PriorityID: Number(targetTask.priorityID ?? targetTask.PriorityID ?? targetTask.priorityId ?? 0),
        AssignedScore: Number(targetTask.assignedScore ?? targetTask.AssignedScore ?? 0),
        EarnedScore: targetTask.earnedScore ?? targetTask.EarnedScore ?? null,
        ProgressPercentage: Number(updatedProgress),
        StartDate: targetTask.startDate ?? targetTask.StartDate ?? null,
        DueDate: targetTask.dueDate ?? targetTask.DueDate ?? null,
        FacultyRemarks: targetTask.facultyRemarks ?? targetTask.FacultyRemarks ?? null,
        StudentRemarks: targetTask.studentRemarks ?? targetTask.StudentRemarks ?? null,
      };

      const response = await fetch(`${TASKS_API_URL}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update status on server");
      }
    } catch (err) {
      console.error("Status Update Error:", err);
      fetchTasks(); // Revert back on error
      alert("Could not update status on server. Reverting changes.");
    }
  };

  // Filter Tasks Array
  const filteredTasks = tasks.filter((task) => {
    const title = task.taskTitle ?? task.TaskTitle ?? "";
    const project = task.projectTitle ?? task.ProjectTitle ?? "";
    const priority = task.priorityName ?? task.PriorityName ?? "";
    const status = task.statusName ?? task.StatusName ?? "";

    const titleMatch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const projectMatch = project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || projectMatch;

    const matchesPriority =
      priorityFilter === "All" ||
      priority.toLowerCase() === priorityFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "All" ||
      status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} />

      <div className="main-content">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="manage-tasks-container">
          {/* Header */}
          <div className="tasks-header">
            <div>
              <h2 className="tasks-title">Manage Tasks</h2>
              <div className="breadcrumb">
                <Link to="/AdminDashboard">Home</Link> / <span>Tasks</span>
              </div>
            </div>
            <button
              type="button"
              className="add-task-btn"
              onClick={() => navigate("/admin/tasks/add")}
            >
              <AddOutlinedIcon fontSize="small" /> Add Task
            </button>
          </div>

          {/* Filters Card */}
          <div className="filters-card">
            <div className="filter-group search-input-group">
              <label>Search</label>
              <div className="input-with-icon">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="Title, project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Dynamic Status Filter loaded from API */}
            <div className="filter-group">
              <label>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                {statuses.map((s) => {
                  const stId = s.statusID ?? s.StatusID ?? s.statusId ?? s.StatusId;
                  const stName = s.statusName ?? s.StatusName ?? s.name ?? "";
                  return (
                    <option key={stId} value={stName}>
                      {stName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="filter-actions">
              <button
                className="reset-btn"
                onClick={() => {
                  setSearchTerm("");
                  setPriorityFilter("All");
                  setStatusFilter("All");
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Tasks Table Card */}
          <div className="table-card">
            <div className="table-responsive">
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Task Title</th>
                    <th>Project</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Score</th>
                    <th>Progress</th>
                    <th>Start Date</th>
                    <th>End Date (Due)</th>
                    <th>Faculty Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="11" className="no-data">
                        Loading tasks...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="11"
                        className="no-data"
                        style={{ color: "red" }}
                      >
                        {error}
                      </td>
                    </tr>
                  ) : filteredTasks.length > 0 ? (
                    filteredTasks.map((task, index) => {
                      const taskId = task.taskId ?? task.TaskId;
                      const taskTitle = task.taskTitle ?? task.TaskTitle ?? "";
                      const taskDesc = task.taskDescription ?? task.TaskDescription ?? "";
                      const projTitle = task.projectTitle ?? task.ProjectTitle ?? "";
                      const projId = task.projectId ?? task.ProjectId;
                      const priority = task.priorityName ?? task.PriorityName ?? "Low";
                      const status = task.statusName ?? task.StatusName ?? "Pending";
                      const assignedScore = task.assignedScore ?? task.AssignedScore ?? 0;
                      const earnedScore = task.earnedScore ?? task.EarnedScore;
                      const progress = task.progressPercentage ?? task.ProgressPercentage ?? 0;
                      const startDate = task.startDate ?? task.StartDate;
                      const dueDate = task.dueDate ?? task.DueDate;
                      const remarks = task.facultyRemarks ?? task.FacultyRemarks;

                      // Date Formatting Helper
                      const formattedStartDate = startDate
                        ? new Date(startDate).toISOString().split("T")[0]
                        : "-";
                      const formattedDueDate = dueDate
                        ? new Date(dueDate).toISOString().split("T")[0]
                        : "-";

                      return (
                        <tr key={taskId}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="task-title-cell">
                              <strong>{taskTitle}</strong>
                              <span className="task-desc-sub">
                                {taskDesc}
                              </span>
                            </div>
                          </td>
                          <td>{projTitle || `Project #${projId}`}</td>
                          <td>
                            <span
                              className={`priority-badge ${priority
                                .toLowerCase()}`}
                            >
                              {priority}
                            </span>
                          </td>
                          <td>
                            {/* Dynamic Status Dropdown */}
                            <div className="status-dropdown-wrapper">
                              <button
                                type="button"
                                className={`status-btn ${status
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                onClick={() =>
                                  setActiveDropdown(
                                    activeDropdown === taskId ? null : taskId
                                  )
                                }
                              >
                                <span>{status}</span>
                                <ArrowDropDownIcon fontSize="small" />
                              </button>

                              {activeDropdown === taskId && (
                                <div className="status-dropdown-menu">
                                  <div className="dropdown-label">Change Status</div>
                                  {statuses.map((st) => {
                                    const stId =
                                      st.statusID ??
                                      st.StatusID ??
                                      st.statusId ??
                                      st.StatusId;
                                    const stName =
                                      st.statusName ??
                                      st.StatusName ??
                                      st.name ??
                                      "";

                                    return (
                                      <div
                                        key={stId}
                                        className={`dropdown-item ${stName
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")}`}
                                        onClick={() =>
                                          handleStatusChange(taskId, st)
                                        }
                                      >
                                        <span className="dot"></span> {stName}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="score-text">
                              <strong>{assignedScore}</strong> / {earnedScore ?? "-"}
                            </span>
                          </td>
                          <td>
                            <div className="progress-container">
                              <div className="progress-bar-bg">
                                <div
                                  className="progress-bar-fill"
                                  style={{
                                    width: `${progress}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="progress-text">
                                {progress}%
                              </span>
                            </div>
                          </td>

                          {/* Start Date & End Date (Due Date) */}
                          <td>{formattedStartDate}</td>
                          <td>{formattedDueDate}</td>

                          {/* Faculty Remarks */}
                          <td>
                            <span className="faculty-remarks">
                              {remarks || "-"}
                            </span>
                          </td>

                          <td>
                            <div className="action-buttons">
                              <Link
                                to={`/admin/tasks/edit/${taskId}`}
                                className="icon-btn edit-btn"
                                title="Edit Task"
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </Link>

                              <button
                                type="button"
                                className="icon-btn delete-btn"
                                title="Delete Task"
                                onClick={() => handleDeleteTask(taskId)}
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
                      <td colSpan="11" className="no-data">
                        No Tasks Found!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ManageTasks;