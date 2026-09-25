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
  const [statuses, setStatuses] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const BASE_URL = "https://localhost:7187";
  const TASKS_API_URL = `${BASE_URL}/api/Task`;
  const STATUS_API_URL = `${BASE_URL}/api/Status`;
  const USER_API_URL = `${BASE_URL}/api/User`;

  // Dropdown Toggle State
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch Statuses
  const fetchStatuses = async () => {
    try {
      const response = await fetch(STATUS_API_URL);
      if (response.ok) {
        const data = await response.json();
        setStatuses(Array.isArray(data) ? data : data.$values || []);
      }
    } catch (err) {
      console.error("Fetch Status Error:", err);
    }
  };

  // Fetch Users and Create ID-to-Name Map
  const fetchUsers = async () => {
    try {
      const response = await fetch(USER_API_URL);
      if (response.ok) {
        const data = await response.json();
        const rawUsers = Array.isArray(data) ? data : data.$values || [];

        const map = {};
        rawUsers.forEach((u) => {
          const rawId = u.userID ?? u.UserID ?? u.userId ?? u.UserId ?? u.id ?? u.Id;
          
          if (rawId !== undefined && rawId !== null) {
            const uId = String(rawId).trim();
            const firstName = u.firstName ?? u.FirstName ?? "";
            const lastName = u.lastName ?? u.LastName ?? "";
            const fullName = `${firstName} ${lastName}`.trim();
            
            const displayName =
              fullName || u.userName || u.UserName || u.name || u.Name || `Student #${uId}`;

            map[uId] = displayName;
          }
        });
        setUsersMap(map);
      }
    } catch (err) {
      console.error("Fetch Users Error:", err);
    }
  };

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch(TASKS_API_URL);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch tasks`);
      }

      const data = await response.json();
      const rawTasks = Array.isArray(data) ? data : data.$values || [];
      const activeTasks = rawTasks.filter((task) => !task.isDeleted && !task.IsDeleted);

      setTasks(activeTasks);
      setError(null);
    } catch (err) {
      console.error("Fetch Tasks Error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await fetchStatuses();
      await fetchUsers();
      await fetchTasks();
      setLoading(false);
    };

    loadInitialData();
  }, []);

  // Delete Task
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

      setTasks((prevTasks) => prevTasks.filter((t) => (t.taskId ?? t.TaskId) !== taskId));
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete task. Please try again.");
    }
  };

  // Handle Dynamic Status Change
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

    const targetTask = tasks.find((t) => (t.taskId ?? t.TaskId) === taskId);
    if (!targetTask) return;

    let updatedProgress = targetTask.progressPercentage ?? targetTask.ProgressPercentage ?? 0;
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
        AssignedTo: targetTask.assignedTo ?? targetTask.AssignedTo ? Number(targetTask.assignedTo ?? targetTask.AssignedTo) : null,
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
      fetchTasks();
      alert("Could not update status on server. Reverting changes.");
    }
  };

  // 💥 મુખ્ય સુધારો: તમારા Backend Response ની exact "assignedStudentName" Key વાંચવી
  const getAssignedStudentName = (task) => {
    // 1. Check exact API response key (assignedStudentName)
    const directName =
      task.assignedStudentName ??
      task.AssignedStudentName ??
      task.assignedToName ??
      task.AssignedToName ??
      task.assignedUser ??
      task.AssignedUser ??
      task.studentName ??
      task.StudentName;

    if (directName && typeof directName === "string" && directName.trim() !== "") {
      return directName;
    }

    // 2. Check Object structure if present
    if (typeof task.assignedTo === "object" && task.assignedTo !== null) {
      const obj = task.assignedTo;
      const fName = obj.firstName ?? obj.FirstName ?? "";
      const lName = obj.lastName ?? obj.LastName ?? "";
      const fullName = `${fName} ${lName}`.trim();
      if (fullName) return fullName;
    }

    // 3. Map Lookup Fallback (using assignedTo ID: 13)
    const rawAssignedId = task.assignedTo ?? task.AssignedTo ?? task.userId ?? task.UserId;
    if (rawAssignedId !== undefined && rawAssignedId !== null) {
      const assignedId = String(rawAssignedId).trim();
      if (usersMap[assignedId]) {
        return usersMap[assignedId];
      }
    }

    return "Unassigned";
  };

  // Filter Tasks Array
  const filteredTasks = tasks.filter((task) => {
    const title = task.taskTitle ?? task.TaskTitle ?? "";
    const project = task.projectTitle ?? task.ProjectTitle ?? "";
    const priority = task.priorityName ?? task.PriorityName ?? "";
    const status = task.statusName ?? task.StatusName ?? "";
    const assignedUser = getAssignedStudentName(task);

    const titleMatch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const projectMatch = project.toLowerCase().includes(searchTerm.toLowerCase());
    const userMatch = assignedUser.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || projectMatch || userMatch;

    const matchesPriority =
      priorityFilter === "All" || priority.toLowerCase() === priorityFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "All" || status.toLowerCase() === statusFilter.toLowerCase();

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
                  placeholder="Title, project, student..."
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

            {/* Dynamic Status Filter */}
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
                    <th>Assigned To</th>
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
                      <td colSpan="12" className="no-data">
                        Loading tasks...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="12"
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
                      
                      // 💥 "bansi" નામ મેળવશે
                      const assignedToName = getAssignedStudentName(task);

                      const priority = task.priorityName ?? task.PriorityName ?? "Low";
                      const status = task.statusName ?? task.StatusName ?? "Pending";
                      const assignedScore = task.assignedScore ?? task.AssignedScore ?? 0;
                      const earnedScore = task.earnedScore ?? task.EarnedScore;
                      const progress = task.progressPercentage ?? task.ProgressPercentage ?? 0;
                      const startDate = task.startDate ?? task.StartDate;
                      const dueDate = task.dueDate ?? task.DueDate;
                      const remarks = task.facultyRemarks ?? task.FacultyRemarks;

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
                          
                          {/* ASSIGNED TO STUDENT NAME */}
                          <td>
                            <span className="assigned-user-badge">
                              {assignedToName}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`priority-badge ${priority.toLowerCase()}`}
                            >
                              {priority}
                            </span>
                          </td>
                          <td>
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

                          <td>{formattedStartDate}</td>
                          <td>{formattedDueDate}</td>

                          <td>
                            <span className="faculty-remarks">
                              {remarks || "-"}
                            </span>
                          </td>

                          <td>
                            <div className="action-buttons">
                              <Link
                                to={`/admin/tasks/add?id=${taskId}`}
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
                      <td colSpan="12" className="no-data">
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