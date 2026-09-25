import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./FacultyDashboard.css";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  CircularProgress
} from "@mui/material";

import {
  Person,
  CloudUpload,
  Visibility,
  ArrowBack,
  CheckCircle,
  HourglassTop,
  PendingActions,
  RateReview,
  LogoutOutlined as LogoutOutlinedIcon,
  TaskAlt,
  School,
  Star
} from "@mui/icons-material";

const API_PROJECT_URL = "https://localhost:7187/api/Project";
const API_TASK_URL = "https://localhost:7187/api/Task";
const API_USER_URL = "https://localhost:7187/api/User";

const FacultyDashboard = () => {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedFaculty = location.state?.faculty;

  const [loading, setLoading] = useState(true);
  const [facultyInfo, setFacultyInfo] = useState({
    facultyName: passedFaculty?.facultyName || "",
    mobileNo: passedFaculty?.mobileNo || "-",
    email: passedFaculty?.email || "-",
    roleName: "Faculty"
  });
  const [tasks, setTasks] = useState([]);

  // Review & Rate Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [facultyRemark, setFacultyRemark] = useState("");
  const [rating, setRating] = useState(0);

  // Custom Logout Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleViewFile = (fileUrl) => {
    if (!fileUrl) {
      alert("No submission file available to view.");
      return;
    }
    const fullUrl = fileUrl.startsWith("http")
      ? fileUrl
      : `https://localhost:7187/${fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl}`;

    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  const renderStatusBadge = (statusName, statusId) => {
    let chipClass = "spms-status-pending";
    let icon = <PendingActions fontSize="small" />;
    let label = statusName || "Pending";

    const statusStr = String(statusId || statusName || "").toLowerCase();

    if (statusStr === "2" || statusStr.includes("progress")) {
      chipClass = "spms-status-progress";
      icon = <HourglassTop fontSize="small" />;
      label = statusName || "In Progress";
    } else if (statusStr === "3" || statusStr.includes("completed")) {
      chipClass = "spms-status-completed";
      icon = <CheckCircle fontSize="small" />;
      label = statusName || "Completed";
    } else if (statusStr === "4" || statusStr.includes("review")) {
      chipClass = "spms-status-review";
      icon = <RateReview fontSize="small" />;
      label = statusName || "Under Review";
    }

    return <Chip icon={icon} label={label} className={`spms-status-chip ${chipClass}`} />;
  };

  const findUserNameById = (id, userList) => {
    if (!id || !userList || userList.length === 0) return null;
    const targetId = String(id).trim();
    const found = userList.find((u) => {
      const uId = String(u.userId || u.Id || u.id || u.FacultyId || u.StudentId || "").trim();
      return uId === targetId;
    });
    return found ? found.fullName || found.FullName || found.name || found.Name || found.userName : null;
  };

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);

      const [projectRes, taskRes, userRes] = await Promise.allSettled([
        axios.get(API_PROJECT_URL),
        axios.get(API_TASK_URL),
        axios.get(API_USER_URL)
      ]);

      const projectData =
        projectRes.status === "fulfilled"
          ? Array.isArray(projectRes.value.data)
            ? projectRes.value.data
            : projectRes.value.data?.data || []
          : [];
      const taskData =
        taskRes.status === "fulfilled"
          ? Array.isArray(taskRes.value.data)
            ? taskRes.value.data
            : taskRes.value.data?.data || []
          : [];
      const userData =
        userRes.status === "fulfilled"
          ? Array.isArray(userRes.value.data)
            ? userRes.value.data
            : userRes.value.data?.data || []
          : [];

      const currentFacultyUser = userData.find(
        (u) => String(u.userId || u.Id || u.id || u.facultyId).trim() === String(facultyId).trim()
      );

      const currentFacultyName = (
        passedFaculty?.facultyName ||
        currentFacultyUser?.fullName ||
        currentFacultyUser?.FullName ||
        currentFacultyUser?.name ||
        ""
      )
        .toLowerCase()
        .trim();

      // Filter tasks managed by this faculty
      const facultyTasks = taskData.filter((t) => {
        const taskFacultyId = String(
          t.facultyId || t.FacultyId || t.assignedBy || t.CreatedBy || t.createdBy || ""
        ).trim();
        const taskFacultyName = String(
          t.assignedFacultyName || t.FacultyName || t.facultyName || ""
        )
          .toLowerCase()
          .trim();
        const targetId = String(facultyId).trim();

        const isIdMatch = taskFacultyId !== "" && taskFacultyId === targetId;
        const isNameMatch = currentFacultyName !== "" && taskFacultyName === currentFacultyName;

        return isIdMatch || isNameMatch;
      });

      // Map student name for each task
      const updatedTasksWithStudent = facultyTasks.map((t) => {
        let studentName =
          t.assignedStudentName || t.StudentName || t.studentName || "N/A";

        if (studentName === "N/A") {
          const tStudentId = t.assignedTo || t.AssignedTo || t.studentId || t.StudentId;
          const foundName = findUserNameById(tStudentId, userData);
          if (foundName) {
            studentName = foundName;
          }
        }

        return {
          ...t,
          assignedStudentNameResolved: studentName
        };
      });

      setTasks(updatedTasksWithStudent);

      setFacultyInfo({
        facultyName:
          passedFaculty?.facultyName ||
          currentFacultyUser?.fullName ||
          currentFacultyUser?.FullName ||
          currentFacultyUser?.name ||
          "Faculty Member",
        mobileNo:
          passedFaculty?.mobileNo ||
          currentFacultyUser?.mobileNumber ||
          currentFacultyUser?.MobileNumber ||
          "-",
        email:
          passedFaculty?.email || currentFacultyUser?.email || currentFacultyUser?.Email || "-",
        roleName: "Faculty"
      });
    } catch (error) {
      console.error("Error fetching faculty dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, [facultyId]);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setFacultyRemark(task.facultyRemarks || task.FacultyRemarks || "");
    setRating(Number(task.rating || task.Rating || 0));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTask(null);
  };

  // Submit Evaluation / Feedback
  const handleSaveEvaluation = async () => {
    try {
      const taskId = selectedTask.taskId || selectedTask.TaskId || selectedTask.id;

      const formData = new FormData();
      formData.append("TaskId", taskId);
      formData.append("ProjectId", selectedTask.projectId || selectedTask.ProjectId);

      const assignedToVal = selectedTask.assignedTo ?? selectedTask.AssignedTo;
      if (assignedToVal !== null && assignedToVal !== undefined && assignedToVal !== "") {
        formData.append("AssignedTo", assignedToVal);
      }

      formData.append("TaskTitle", selectedTask.taskTitle || selectedTask.TaskTitle || "");
      formData.append("TaskDescription", selectedTask.taskDescription || selectedTask.TaskDescription || "");
      formData.append("PriorityID", selectedTask.priorityID || selectedTask.PriorityID);
      formData.append("AssignedScore", selectedTask.assignedScore || selectedTask.AssignedScore || 0);

      // Keep or update status to Completed / Evaluated (Status = 3)
      formData.append("TaskStatus", 3);
      formData.append("StatusName", "Completed");

      const sDate = selectedTask.startDate || selectedTask.StartDate;
      const dDate = selectedTask.dueDate || selectedTask.DueDate;

      if (sDate) formData.append("StartDate", sDate);
      if (dDate) formData.append("DueDate", dDate);

      formData.append("FacultyRemarks", facultyRemark || "");
      formData.append("StudentRemarks", selectedTask.studentRemarks || selectedTask.StudentRemarks || "");
      formData.append("Rating", rating);

      if (selectedTask.fileUrl || selectedTask.FileUrl) {
        formData.append("FileUrl", selectedTask.fileUrl || selectedTask.FileUrl);
      }

      await axios.put(`${API_TASK_URL}/${taskId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Evaluation updated successfully!");

      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          const currentId = t.taskId || t.TaskId || t.id;
          if (String(currentId) === String(taskId)) {
            return {
              ...t,
              facultyRemarks: facultyRemark,
              FacultyRemarks: facultyRemark,
              rating: rating,
              Rating: rating
            };
          }
          return t;
        })
      );

      handleCloseModal();
      fetchAllDashboardData();
    } catch (error) {
      console.error("Error updating evaluation:", error.response?.data || error);
      alert("Failed to submit review: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress className="spms-loader" />
      </Box>
    );
  }

  return (
    <Box id="spms-faculty-dashboard">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          className="spms-btn-nav"
        >
          Back to Dashboard
        </Button>

        <Button
          variant="contained"
          startIcon={<LogoutOutlinedIcon />}
          onClick={handleLogoutClick}
          className="spms-btn-logout"
        >
          Logout
        </Button>
      </Box>

      {/* Hero Header Banner */}
      <Paper className="spms-banner-hero">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" className="spms-hero-title">
              Welcome Back | Prof. {facultyInfo.facultyName}
            </Typography>
            <Typography variant="body2" className="spms-hero-sub">
              Mobile: <b>{facultyInfo.mobileNo}</b> | Email: <b>{facultyInfo.email}</b>
            </Typography>
          </Box>
          <Chip
            icon={<School sx={{ color: "#fff !important" }} />}
            label={`Role: ${facultyInfo.roleName}`}
            className="spms-role-badge"
          />
        </Box>
      </Paper>

      {/* Main Table Card */}
      <Paper className="spms-main-card">
        <Typography className="spms-card-header">
          📋 Assigned Tasks & Student Submissions
        </Typography>

        <Box className="spms-table-responsive">
          <TableContainer>
            <Table>
              <TableHead className="spms-thead">
                <TableRow>
                  <TableCell>Task Title</TableCell>
                  <TableCell>Project Title</TableCell>
                  <TableCell>Assigned Student</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Rating & Score</TableCell>
                  <TableCell align="center">Action / Review</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length > 0 ? (
                  tasks.map((task, index) => {
                    const ratingVal = task.rating ?? task.Rating;
                    const dueDateVal = task.dueDate || task.DueDate;
                    const statusVal = task.taskStatus ?? task.TaskStatus;
                    const fileUrlVal = task.fileUrl || task.FileUrl;

                    const hasRating = ratingVal !== null && ratingVal !== undefined && ratingVal > 0;
                    const formattedDueDate = dueDateVal ? String(dueDateVal).split("T")[0] : "-";
                    const studentName = task.assignedStudentNameResolved || "N/A";

                    return (
                      <TableRow key={task.taskId || task.TaskId || index} hover className="spms-row">
                        <TableCell className="spms-cell-title">
                          <b>{task.taskTitle || task.TaskTitle}</b>
                          <br />
                          {(task.taskDescription || task.TaskDescription) && (
                            <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 0.5 }}>
                              {task.taskDescription || task.TaskDescription}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell className="spms-cell-text">
                          <b>Project:- </b> {task.projectTitle || task.ProjectTitle || "N/A"}
                        </TableCell>

                        {/* Student Name Field */}
                        <TableCell className="spms-cell-text">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Person fontSize="small" color="action" />
                            <span>{studentName}</span>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={task.priorityName || task.PriorityName || "medium"}
                            className={(task.priorityName || task.PriorityName)?.toLowerCase() === "high" ? "spms-prio-high" : "spms-prio-medium"}
                            size="small"
                          />
                        </TableCell>

                        <TableCell className="spms-cell-text">{formattedDueDate}</TableCell>

                        <TableCell>
                          {renderStatusBadge(task.statusName || task.StatusName, statusVal)}
                        </TableCell>

                        <TableCell>
                          {hasRating ? (
                            <Rating
                              value={Number(ratingVal || 0)}
                              precision={0.5}
                              readOnly
                              size="small"
                            />
                          ) : (
                            <Typography variant="body2" sx={{ color: "#94a3b8", fontStyle: "italic" }}>
                              Not Rated
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell align="center">
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                            {fileUrlVal && (
                              <Button
                                variant="outlined"
                                size="small"
                                className="spms-btn-view"
                                startIcon={<Visibility />}
                                onClick={() => handleViewFile(fileUrlVal)}
                              >
                                View File
                              </Button>
                            )}
                            <Button
                              variant="contained"
                              size="small"
                              className="spms-btn-upload"
                              startIcon={<RateReview />}
                              onClick={() => handleOpenModal(task)}
                            >
                              Evaluate
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" className="spms-empty-cell">
                      No tasks found for Prof. {facultyInfo.facultyName}.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* Evaluation / Review Dialog */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm" className="spms-dialog">
        <DialogTitle className="spms-dialog-title">Evaluate Student Submission</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2, p: 1.5, bgcolor: "#f1f5f9", borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ color: "#1e293b", mb: 0.5 }}>
              Student: <b>{selectedTask?.assignedStudentNameResolved || "N/A"}</b>
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "#1e293b", mb: 0.5 }}>
              Task: <b>{selectedTask?.taskTitle || selectedTask?.TaskTitle}</b>
            </Typography>
            <Typography variant="caption" sx={{ color: "#475569", display: "block" }}>
              Student Remark: <i>{selectedTask?.studentRemarks || selectedTask?.StudentRemarks || "None"}</i>
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: "#334155" }}>
              Task Rating
            </Typography>
            <Rating
              name="task-rating"
              value={rating}
              precision={0.5}
              onChange={(e, newValue) => setRating(newValue || 0)}
              emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Faculty Feedback / Remarks"
            value={facultyRemark}
            onChange={(e) => setFacultyRemark(e.target.value)}
            placeholder="Provide constructive feedback for the student..."
            sx={{ mb: 1 }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal} color="inherit">Cancel</Button>
          <Button
            onClick={handleSaveEvaluation}
            variant="contained"
            className="spms-btn-primary"
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <div className="modal-icon">
              <LogoutOutlinedIcon />
            </div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out of your account?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmLogout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default FacultyDashboard;