import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import "./EditTask.css";

// MUI Icons
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditNoteIcon from "@mui/icons-material/EditNote";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // Dynamic Lists for Dropdowns
  const [statuses, setStatuses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [students, setStudents] = useState([]); // <-- 1. Students State

  // API Endpoints
  const TASKS_API_URL = "https://localhost:7187/api/Task";
  const STATUS_API_URL = "https://localhost:7187/api/Status";
  const PROJECT_API_URL = "https://localhost:7187/api/Project";
  const PRIORITY_API_URL = "https://localhost:7187/api/Priority";
  const STUDENTS_API_URL = "https://localhost:7187/api/User"; // <-- 2. Student/User API endpoint મુજબ બદલો

  // Form State
  const [formData, setFormData] = useState({
    taskId: Number(id),
    projectId: "",
    taskTitle: "",
    taskDescription: "",
    taskStatus: "",
    priorityID: "",
    assignedTo: "", // <-- 3. Assigned Student ID Field
    assignedScore: "",
    earnedScore: "",
    progressPercentage: 0,
    startDate: "",
    dueDate: "",
    facultyRemarks: "",
    studentRemarks: ""
  });

  const [errors, setErrors] = useState({});

  // 1. Fetch Projects List
  const fetchProjects = async () => {
    try {
      const response = await fetch(PROJECT_API_URL);
      if (response.ok) {
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Fetch Projects Error:", err);
    }
  };

  // 2. Fetch Statuses List
  const fetchStatuses = async () => {
    try {
      const response = await fetch(STATUS_API_URL);
      if (response.ok) {
        const data = await response.json();
        setStatuses(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Fetch Status Error:", err);
    }
  };

  // 3. Fetch Priorities List
  const fetchPriorities = async () => {
    try {
      const response = await fetch(PRIORITY_API_URL);
      if (response.ok) {
        const data = await response.json();
        setPriorities(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Fetch Priority Error:", err);
    }
  };

  // 4. Fetch Students / Users List
  const fetchStudents = async () => {
    try {
      const response = await fetch(STUDENTS_API_URL);
      if (response.ok) {
        const data = await response.json();
        setStudents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Fetch Students Error:", err);
    }
  };

  // 5. Fetch Single Task Detail & Bind Data
  const fetchTaskById = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${TASKS_API_URL}/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to load details for Task #${id}.`);
      }

      const taskData = await response.json();

      // Format ISO Date string to YYYY-MM-DD
      const formattedStartDate = taskData.startDate || taskData.StartDate
        ? new Date(taskData.startDate || taskData.StartDate).toISOString().split("T")[0]
        : "";
      const formattedDueDate = taskData.dueDate || taskData.DueDate
        ? new Date(taskData.dueDate || taskData.DueDate).toISOString().split("T")[0]
        : "";

      const selectedStatus =
        taskData.taskStatus ??
        taskData.TaskStatus ??
        taskData.statusId ??
        taskData.StatusId ??
        taskData.statusID ??
        taskData.StatusID;

      const selectedPriority =
        taskData.priorityID ??
        taskData.PriorityID ??
        taskData.priorityId ??
        taskData.PriorityId;

      const selectedProject =
        taskData.projectId ??
        taskData.ProjectId;

      // Safe check for Assigned Student/User ID
      const selectedAssignedTo =
        taskData.assignedTo ??
        taskData.AssignedTo ??
        taskData.studentId ??
        taskData.StudentId ??
        taskData.userId ??
        taskData.UserId;

      setFormData({
        taskId: Number(id),
        projectId: selectedProject !== undefined && selectedProject !== null ? String(selectedProject) : "",
        taskTitle: taskData.taskTitle || taskData.TaskTitle || "",
        taskDescription: taskData.taskDescription || taskData.TaskDescription || "",
        taskStatus: selectedStatus !== undefined && selectedStatus !== null ? String(selectedStatus) : "",
        priorityID: selectedPriority !== undefined && selectedPriority !== null ? String(selectedPriority) : "",
        assignedTo: selectedAssignedTo !== undefined && selectedAssignedTo !== null ? String(selectedAssignedTo) : "", // Bound value
        assignedScore: (taskData.assignedScore ?? taskData.AssignedScore) ?? "",
        earnedScore: (taskData.earnedScore ?? taskData.EarnedScore) ?? "",
        progressPercentage: Number(taskData.progressPercentage ?? taskData.ProgressPercentage) || 0,
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
        facultyRemarks: taskData.facultyRemarks || taskData.FacultyRemarks || "",
        studentRemarks: taskData.studentRemarks || taskData.StudentRemarks || ""
      });
    } catch (err) {
      console.error("Fetch Task Detail Error:", err);
      alert(err.message);
      navigate("/admin/tasks");
    } finally {
      setLoading(false);
    }
  };

  // Run on component load
  useEffect(() => {
    const loadAllData = async () => {
      // Step A: Load Dropdown Options First (including Students)
      await Promise.all([fetchProjects(), fetchStatuses(), fetchPriorities(), fetchStudents()]);
      // Step B: Load Task Detail
      await fetchTaskById();
    };
    loadAllData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.taskTitle || !formData.taskTitle.toString().trim()) {
      newErrors.taskTitle = "Task Title is required";
    }
    if (!formData.projectId || formData.projectId === "0") {
      newErrors.projectId = "Please select a Project";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // DTO Payload Construction
      const taskDtoPayload = {
        TaskId: Number(id),
        ProjectId: Number(formData.projectId),
        TaskTitle: formData.taskTitle.toString().trim(),
        TaskDescription: formData.taskDescription || null,
        TaskStatus: formData.taskStatus !== "" ? Number(formData.taskStatus) : 0,
        PriorityID: formData.priorityID !== "" ? Number(formData.priorityID) : 0,
        AssignedTo: formData.assignedTo !== "" ? Number(formData.assignedTo) : null, // Send Assigned Student ID
        AssignedScore: formData.assignedScore !== "" ? Number(parseFloat(formData.assignedScore)) : 0,
        EarnedScore: formData.earnedScore !== "" ? Number(parseFloat(formData.earnedScore)) : null,
        ProgressPercentage: Number(formData.progressPercentage) || 0,
        StartDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        DueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        FacultyRemarks: formData.facultyRemarks || null,
        StudentRemarks: formData.studentRemarks || null
      };

      const response = await fetch(`${TASKS_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(taskDtoPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error (${response.status}): ${errorText}`);
      }

      alert(`Task #${id} has been updated successfully!`);
      navigate("/admin/tasks");
    } catch (err) {
      console.error("Update Error:", err);
      alert(err.message || "An error occurred while updating the task.");
    }
  };

  if (loading) {
    return (
      <div className="edit-loading-box" style={{ padding: "40px", textAlign: "center" }}>
        <p>Loading details for Task ID #{id}...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} />

      <div className="main-content">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="page-content">
          <div className="breadcrumb">
            <Link to="/AdminDashboard">Home</Link> /{" "}
            <Link to="/admin/tasks">Tasks</Link> / <span>Edit Task #{id}</span>
          </div>

          <div className="add-task-card">
            <div className="page-header">
              <h2>
                <EditNoteIcon fontSize="large" /> Edit Task (ID: #{id})
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="task-form">
              {/* Row 1: Project & Title */}
              <div className="form-row two-col">
                <div className="form-group">
                  <label htmlFor="projectId">Project Name *</label>
                  <select
                    id="projectId"
                    name="projectId"
                    value={String(formData.projectId)}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Project --</option>
                    {projects.map((p) => {
                      const pId = p.projectId ?? p.ProjectId ?? p.id;
                      const pTitle = p.projectTitle ?? p.ProjectTitle ?? p.projectName ?? p.title;
                      return (
                        <option key={pId} value={String(pId)}>
                          {pTitle}
                        </option>
                      );
                    })}
                  </select>
                  {errors.projectId && <span className="error-text">{errors.projectId}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="taskTitle">Task Title *</label>
                  <input
                    type="text"
                    id="taskTitle"
                    name="taskTitle"
                    value={formData.taskTitle}
                    onChange={handleChange}
                    placeholder="Enter Task Title"
                  />
                  {errors.taskTitle && <span className="error-text">{errors.taskTitle}</span>}
                </div>
              </div>

              {/* Row 2: Status, Priority & Assigned Student Dropdowns */}
              <div className="form-row three-col">
                <div className="form-group">
                  <label htmlFor="taskStatus">Status</label>
                  <select
                    id="taskStatus"
                    name="taskStatus"
                    value={String(formData.taskStatus)}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Status --</option>
                    {statuses.map((s) => {
                      const stId = s.statusID ?? s.StatusID ?? s.statusId ?? s.StatusId ?? s.id;
                      const stName = s.statusName ?? s.StatusName ?? s.name;
                      return (
                        <option key={stId} value={String(stId)}>
                          {stName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priorityID">Priority</label>
                  <select
                    id="priorityID"
                    name="priorityID"
                    value={String(formData.priorityID)}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Priority --</option>
                    {priorities.map((p) => {
                      const prId = p.priorityID ?? p.PriorityID ?? p.priorityId ?? p.PriorityId ?? p.id;
                      const prName = p.priorityName ?? p.PriorityName ?? p.name;
                      return (
                        <option key={prId} value={String(prId)}>
                          {prName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* NEW: Assigned Student Field */}
                <div className="form-group">
                  <label htmlFor="assignedTo">Assign To Student</label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={String(formData.assignedTo)}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Student --</option>
                    {students.map((st) => {
                      const sId = st.userId ?? st.UserId ?? st.studentId ?? st.StudentId ?? st.id;
                      const sName = st.fullName ?? st.FullName ?? st.userName ?? st.UserName ?? st.name;
                      return (
                        <option key={sId} value={String(sId)}>
                          {sName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Row 3: Dates */}
              <div className="form-row two-col">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Row 4: Scores & Progress */}
              <div className="form-row three-col">
                <div className="form-group">
                  <label htmlFor="assignedScore">Assigned Score</label>
                  <input
                    type="number"
                    id="assignedScore"
                    name="assignedScore"
                    value={formData.assignedScore}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="earnedScore">Earned Score</label>
                  <input
                    type="number"
                    id="earnedScore"
                    name="earnedScore"
                    value={formData.earnedScore}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="progressPercentage">Progress (%)</label>
                  <input
                    type="number"
                    id="progressPercentage"
                    name="progressPercentage"
                    min="0"
                    max="100"
                    value={formData.progressPercentage}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Row 5: Description */}
              <div className="form-group">
                <label htmlFor="taskDescription">Task Description</label>
                <textarea
                  id="taskDescription"
                  name="taskDescription"
                  rows="3"
                  value={formData.taskDescription}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Row 6: Remarks */}
              <div className="form-row two-col">
                <div className="form-group">
                  <label htmlFor="facultyRemarks">Faculty Remarks</label>
                  <textarea
                    id="facultyRemarks"
                    name="facultyRemarks"
                    rows="2"
                    value={formData.facultyRemarks}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="studentRemarks">Student Remarks</label>
                  <textarea
                    id="studentRemarks"
                    name="studentRemarks"
                    rows="2"
                    value={formData.studentRemarks}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button type="submit" className="add-btn">
                  <CheckIcon fontSize="small" /> Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/admin/tasks")}
                >
                  <ArrowBackIcon fontSize="small" /> Cancel
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

export default EditTask;