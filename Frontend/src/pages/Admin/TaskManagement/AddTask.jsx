import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import "./AddTask.css";

// MUI Icons
import AddTaskIcon from "@mui/icons-material/AddTask";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const TASK_API_URL = "https://localhost:7187/api/Task";
const PROJECT_API_URL = "https://localhost:7187/api/Project";
const STATUS_API_URL = "https://localhost:7187/api/Status";
const PRIORITY_API_URL = "https://localhost:7187/api/Priority";

const AddTask = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editTaskId = searchParams.get("id"); // URL મા થી edit માટે ID મળશે (દા.ત. /admin/add-task?id=5)

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dropdown options loaded from APIs
  const [projectOptions, setProjectOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // Form Field State
  const [formData, setFormData] = useState({
    taskId: 0,
    projectId: "",
    taskTitle: "",
    taskDescription: "",
    taskStatus: "",
    priorityID: "",
    assignedScore: "",
    earnedScore: "",
    progressPercentage: "0.00",
    startDate: "",
    dueDate: "",
    completedDate: "",
    facultyRemarks: "",
    studentRemarks: "",
    isDeleted: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load Dropdown Options and Edit Task Data if editTaskId exists
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoadingDropdowns(true);
        const [projRes, statusRes, priorityRes] = await Promise.all([
          fetch(PROJECT_API_URL),
          fetch(STATUS_API_URL),
          fetch(PRIORITY_API_URL),
        ]);

        if (projRes.ok) {
          const projData = await projRes.json();
          setProjectOptions(Array.isArray(projData) ? projData : []);
        }

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setStatusOptions(Array.isArray(statusData) ? statusData : []);
        }

        if (priorityRes.ok) {
          const priorityData = await priorityRes.json();
          setPriorityOptions(Array.isArray(priorityData) ? priorityData : []);
        }
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
      } finally {
        setLoadingDropdowns(false);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch Task Details if in Edit Mode
  useEffect(() => {
    if (!editTaskId) return;

    const fetchTaskById = async () => {
      try {
        const response = await fetch(`${TASK_API_URL}/${editTaskId}`);
        if (!response.ok) throw new Error("Failed to load task details");
        const data = await response.json();

        // Helper to format date string to YYYY-MM-DD for <input type="date" />
        const formatDate = (dateStr) => (dateStr ? dateStr.split("T")[0] : "");

        setFormData({
          taskId: data.taskId ?? data.TaskId ?? editTaskId,
          projectId: data.projectId ?? data.ProjectId ?? "",
          taskTitle: data.taskTitle ?? data.TaskTitle ?? "",
          taskDescription: data.taskDescription ?? data.TaskDescription ?? "",
          taskStatus: data.taskStatus ?? data.TaskStatus ?? "",
          priorityID: data.priorityID ?? data.PriorityID ?? "",
          assignedScore: data.assignedScore ?? data.AssignedScore ?? "",
          earnedScore: data.earnedScore ?? data.EarnedScore ?? "",
          progressPercentage:
            (
              data.progressPercentage ??
              data.ProgressPercentage ??
              0
            ).toString() || "0.00",
          startDate: formatDate(data.startDate ?? data.StartDate),
          dueDate: formatDate(data.dueDate ?? data.DueDate),
          completedDate: formatDate(data.completedDate ?? data.CompletedDate),
          facultyRemarks: data.facultyRemarks ?? data.FacultyRemarks ?? "",
          studentRemarks: data.studentRemarks ?? data.StudentRemarks ?? "",
          isDeleted: data.isDeleted ?? data.IsDeleted ?? false,
        });
      } catch (err) {
        console.error("Fetch Edit Task Error:", err);
        alert(err.message);
      }
    };

    fetchTaskById();
  }, [editTaskId]);

  // Dynamic Progress Percentage Calculation: (EarnedScore / AssignedScore) * 100
  useEffect(() => {
    const assigned = parseFloat(formData.assignedScore);
    const earned = parseFloat(formData.earnedScore);

    if (!isNaN(assigned) && assigned > 0 && !isNaN(earned) && earned >= 0) {
      let calculatedProgress = (earned / assigned) * 100;
      if (calculatedProgress > 100) calculatedProgress = 100;
      setFormData((prev) => ({
        ...prev,
        progressPercentage: calculatedProgress.toFixed(2),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        progressPercentage: "0.00",
      }));
    }
  }, [formData.assignedScore, formData.earnedScore]);

  // Change Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.projectId) newErrors.projectId = "Please select a project.";
    if (!formData.taskTitle.trim())
      newErrors.taskTitle = "Task title is required.";
    if (
      formData.assignedScore === "" ||
      parseFloat(formData.assignedScore) <= 0
    ) {
      newErrors.assignedScore = "Assigned score must be greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler (POST / PUT API Call)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const payload = {
      taskId: editTaskId ? parseInt(editTaskId) : 0,
      projectId: parseInt(formData.projectId),
      taskTitle: formData.taskTitle.trim(),
      taskDescription: formData.taskDescription.trim(),
      taskStatus: formData.taskStatus ? parseInt(formData.taskStatus) : null,
      priorityID: formData.priorityID ? parseInt(formData.priorityID) : null,
      assignedScore: parseFloat(formData.assignedScore) || 0,
      earnedScore: formData.earnedScore ? parseFloat(formData.earnedScore) : 0,
      progressPercentage: parseFloat(formData.progressPercentage) || 0,
      startDate: formData.startDate ? formData.startDate : null,
      dueDate: formData.dueDate ? formData.dueDate : null,
      completedDate: formData.completedDate ? formData.completedDate : null,
      facultyRemarks: formData.facultyRemarks.trim(),
      studentRemarks: formData.studentRemarks.trim(),
      isDeleted: formData.isDeleted,
    };

    try {
      const isEdit = !!editTaskId;
      const url = isEdit ? `${TASK_API_URL}/${editTaskId}` : TASK_API_URL;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          isEdit ? "Failed to update task." : "Failed to create task."
        );
      }

      alert(
        isEdit ? "Task updated successfully!" : "Task added successfully!"
      );
      navigate("/admin/tasks");
    } catch (err) {
      console.error("Save Task Error:", err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} />

      <div className="main-content">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="page-content">
          <div className="breadcrumb">
            <span
              className="home-link"
              onClick={() => navigate("/AdminDashboard")}
            >
              Home
            </span>
            <span
              className="home-link"
              onClick={() => navigate("/admin/tasks")}
            >
              {" "}
              / Tasks
            </span>
            <span> / {editTaskId ? "Edit Task" : "Add Task"}</span>
          </div>

          <div className="add-task-card">
            <div className="page-header">
              <h2>
                {editTaskId ? (
                  <>
                    <EditIcon style={{ verticalAlign: "middle" }} /> Edit Task
                  </>
                ) : (
                  <>
                    <AddTaskIcon style={{ verticalAlign: "middle" }} /> Add New
                    Task
                  </>
                )}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="task-form">
              {/* Project Selection */}
              <div className="form-row single-col">
                <div className="form-group">
                  <label htmlFor="projectId">
                    Select Project <span className="required-star">*</span>
                  </label>
                  <select
                    id="projectId"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                    className={errors.projectId ? "input-error" : ""}
                    disabled={loadingDropdowns}
                  >
                    <option value="">
                      {loadingDropdowns
                        ? "Loading Projects..."
                        : "-- Select Project --"}
                    </option>
                    {projectOptions.map((p) => {
                      const id = p.projectId ?? p.ProjectId;
                      const title = p.projectTitle ?? p.ProjectTitle;
                      return (
                        <option key={id} value={id}>
                          {title} (ID: {id})
                        </option>
                      );
                    })}
                  </select>
                  {errors.projectId && (
                    <span className="error-text">{errors.projectId}</span>
                  )}
                </div>
              </div>

              {/* Task Title */}
              <div className="form-row single-col">
                <div className="form-group">
                  <label htmlFor="taskTitle">
                    Task Title <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="taskTitle"
                    name="taskTitle"
                    placeholder="e.g. Implement User Authentication API"
                    value={formData.taskTitle}
                    onChange={handleChange}
                    className={errors.taskTitle ? "input-error" : ""}
                  />
                  {errors.taskTitle && (
                    <span className="error-text">{errors.taskTitle}</span>
                  )}
                </div>
              </div>

              {/* Task Description */}
              <div className="form-row single-col">
                <div className="form-group">
                  <label htmlFor="taskDescription">Task Description</label>
                  <textarea
                    id="taskDescription"
                    name="taskDescription"
                    rows="3"
                    placeholder="Enter detailed task description..."
                    value={formData.taskDescription}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Status and Priority Dropdowns */}
              <div className="form-row two-col">
                <div className="form-group">
                  <label htmlFor="taskStatus">Status</label>
                  <select
                    id="taskStatus"
                    name="taskStatus"
                    value={formData.taskStatus}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Status --</option>
                    {statusOptions.map((st) => {
                      const id = st.statusID ?? st.StatusID;
                      const name = st.statusName ?? st.StatusName;
                      return (
                        <option key={id} value={id}>
                          {name}
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
                    value={formData.priorityID}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Priority --</option>
                    {priorityOptions.map((pr) => {
                      const id = pr.priorityID ?? pr.PriorityID;
                      const name = pr.priorityName ?? pr.PriorityName;
                      return (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Scores & Dynamic Progress Calculation */}
              <div className="form-row three-col">
                <div className="form-group">
                  <label htmlFor="assignedScore">
                    Assigned Score <span className="required-star">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="assignedScore"
                    name="assignedScore"
                    placeholder="e.g. 100"
                    value={formData.assignedScore}
                    onChange={handleChange}
                    className={errors.assignedScore ? "input-error" : ""}
                  />
                  {errors.assignedScore && (
                    <span className="error-text">{errors.assignedScore}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="earnedScore">Earned Score</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="earnedScore"
                    name="earnedScore"
                    placeholder="e.g. 85"
                    value={formData.earnedScore}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="progressPercentage">
                    Progress (%) - Auto
                  </label>
                  <input
                    type="text"
                    id="progressPercentage"
                    name="progressPercentage"
                    value={`${formData.progressPercentage}%`}
                    readOnly
                    className="readonly-input"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="form-row three-col">
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

                <div className="form-group">
                  <label htmlFor="completedDate">Completed Date</label>
                  <input
                    type="date"
                    id="completedDate"
                    name="completedDate"
                    value={formData.completedDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Remarks */}
              <div className="form-row two-col">
                <div className="form-group">
                  <label htmlFor="facultyRemarks">Faculty Remarks</label>
                  <textarea
                    id="facultyRemarks"
                    name="facultyRemarks"
                    rows="2"
                    placeholder="Remarks from faculty..."
                    value={formData.facultyRemarks}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="studentRemarks">Student Remarks</label>
                  <textarea
                    id="studentRemarks"
                    name="studentRemarks"
                    rows="2"
                    placeholder="Remarks from student..."
                    value={formData.studentRemarks}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="add-btn"
                  disabled={submitting}
                >
                  <SaveIcon fontSize="small" />{" "}
                  {editTaskId ? "Update Task" : "Save Task"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/admin/tasks")}
                >
                  <CloseIcon fontSize="small" /> Cancel
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

export default AddTask;