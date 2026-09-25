import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./StudentDashboard.css";
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
  School
} from "@mui/icons-material";

const API_PROJECT_URL = "https://localhost:7187/api/Project";
const API_TASK_URL = "https://localhost:7187/api/Task";
const API_USER_URL = "https://localhost:7187/api/User";

const StudentDashboard = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedStudent = location.state?.student;

  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState({
    studentName: passedStudent?.studentName || "",
    mobileNo: passedStudent?.mobileNo || "-",
    email: passedStudent?.email || "-",
    roleName: "Student"
  });
  const [projectInfo, setProjectInfo] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Task Update Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedRemark, setUpdatedRemark] = useState("");
  const [taskFile, setTaskFile] = useState(null);

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
      alert("No file available to view.");
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

  // Helper Function: fetch to id user
  const findUserNameById = (id, userList) => {
    if (!id || !userList || userList.length === 0) return null;
    const targetId = String(id).trim();
    const found = userList.find((u) => {
      const uId = String(u.userId || u.Id || u.id || u.FacultyId || u.StudentId || "").trim();
      return uId === targetId;
    });
    return found ? (found.fullName || found.FullName || found.name || found.Name || found.userName) : null;
  };

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);

      const [projectRes, taskRes, userRes] = await Promise.allSettled([
        axios.get(API_PROJECT_URL),
        axios.get(API_TASK_URL),
        axios.get(API_USER_URL)
      ]);

      const projectData = projectRes.status === "fulfilled" ? (Array.isArray(projectRes.value.data) ? projectRes.value.data : projectRes.value.data?.data || []) : [];
      const taskData = taskRes.status === "fulfilled" ? (Array.isArray(taskRes.value.data) ? taskRes.value.data : taskRes.value.data?.data || []) : [];
      const userData = userRes.status === "fulfilled" ? (Array.isArray(userRes.value.data) ? userRes.value.data : userRes.value.data?.data || []) : [];

      const currentStudentUser = userData.find(
        (u) => String(u.userId || u.Id || u.id || u.studentId).trim() === String(studentId).trim()
      );

      const currentStudentName = (
        passedStudent?.studentName || 
        currentStudentUser?.fullName || 
        currentStudentUser?.FullName ||
        currentStudentUser?.name || 
        ""
      ).toLowerCase().trim();

      // ૧. સ્ટુડન્ટના ટાસ્ક ફિલ્ટર કરો
      const studentTasks = taskData.filter((t) => {
        const taskAssignedTo = String(t.assignedTo || t.AssignedTo || t.studentId || t.StudentId || "").trim();
        const taskStudentName = String(t.assignedStudentName || t.AssignedStudentName || "").toLowerCase().trim();
        const targetId = String(studentId).trim();

        const isIdMatch = taskAssignedTo !== "" && taskAssignedTo === targetId;
        const isNameMatch = currentStudentName !== "" && taskStudentName === currentStudentName;

        return isIdMatch || isNameMatch;
      });

      const firstTaskWithProject = studentTasks.find((t) => t.projectId || t.ProjectId || t.projectTitle || t.ProjectTitle);

      // ૨. મેચ થતો પ્રોજેક્ટ શોધો
      const matchedProject = projectData.find((p) => {
        const pStudentId = String(p.studentId || p.StudentId || p.userId || p.UserId || "").trim();
        const pProjectId = String(p.projectId || p.ProjectId || p.id || p.Id || "").trim();
        const targetId = String(studentId).trim();

        return (
          pStudentId === targetId ||
          (firstTaskWithProject && pProjectId === String(firstTaskWithProject.projectId || firstTaskWithProject.ProjectId).trim())
        );
      }) || null;

      setProjectInfo(matchedProject);

      // ૩. ફેકલ્ટી શોધો (પ્રોજેક્ટ અને યુઝર ડેટામાંથી)
      let facultyNameFromProject = "N/A";

      if (matchedProject) {
        const directFacultyName = 
          matchedProject.facultyName || 
          matchedProject.FacultyName || 
          matchedProject.assignedFacultyName || 
          matchedProject.guideName;

        if (directFacultyName) {
          facultyNameFromProject = directFacultyName;
        } else {
          const targetFacultyId = 
            matchedProject.facultyId || 
            matchedProject.FacultyId || 
            matchedProject.assignedFaculty || 
            matchedProject.guideId || 
            matchedProject.createdBy || 
            matchedProject.CreatedBy;

          const matchedName = findUserNameById(targetFacultyId, userData);
          if (matchedName) {
            facultyNameFromProject = matchedName;
          }
        }
      }

      // ૪. દરેક ટાસ્કમાં ફેકલ્ટીનું નામ સેટ કરો
      const updatedTasksWithFaculty = studentTasks.map((t) => {
        let taskFaculty = 
          t.assignedFacultyName || 
          t.FacultyName || 
          t.facultyName || 
          t.createdByName || 
          facultyNameFromProject;

        if (taskFaculty === "N/A") {
          const tFacultyId = t.facultyId || t.FacultyId || t.createdBy || t.CreatedBy || t.assignedBy;
          const foundName = findUserNameById(tFacultyId, userData);
          if (foundName) {
            taskFaculty = foundName;
          }
        }

        return {
          ...t,
          projectFacultyName: taskFaculty
        };
      });

      setTasks(updatedTasksWithFaculty);

      setStudentInfo({
        studentName: passedStudent?.studentName || currentStudentUser?.fullName || currentStudentUser?.FullName || currentStudentUser?.name || "Student",
        mobileNo: passedStudent?.mobileNo || currentStudentUser?.mobileNumber || currentStudentUser?.MobileNumber || "-",
        email: passedStudent?.email || currentStudentUser?.email || currentStudentUser?.Email || "-",
        roleName: "Student"
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, [studentId]);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setUpdatedRemark(task.studentRemarks || task.StudentRemarks || "");
    setTaskFile(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTask(null);
    setTaskFile(null);
  };

  // 👉 ટાસ્ક ઓટોમેટિક Completed કરવા માટેનું ફંક્શન
  const handleSaveTaskUpdate = async () => {
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
      
      // 🟢 Status Completed (ID = 3) સેટ કરવું
      formData.append("TaskStatus", 3);
      formData.append("StatusName", "Completed");
      formData.append("ProgressPercentage", 100);
      
      const sDate = selectedTask.startDate || selectedTask.StartDate;
      const dDate = selectedTask.dueDate || selectedTask.DueDate;

      if (sDate) formData.append("StartDate", sDate);
      if (dDate) formData.append("DueDate", dDate);
      
      formData.append("CompletedDate", new Date().toISOString());
      formData.append("FacultyRemarks", selectedTask.facultyRemarks || selectedTask.FacultyRemarks || "");
      formData.append("StudentRemarks", updatedRemark || "");
      
      if (taskFile) {
        formData.append("file", taskFile);
      } else if (selectedTask.fileUrl || selectedTask.FileUrl) {
        formData.append("FileUrl", selectedTask.fileUrl || selectedTask.FileUrl);
      }

      const response = await axios.put(`${API_TASK_URL}/${taskId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Task submitted successfully!");

      // 🟢 ઇન્સ્ટન્ટ સ્ક્રિન પર સ્ટેટસ 'Completed' બતાવવા માટે Local State અપડેટ કરવું
      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          const currentId = t.taskId || t.TaskId || t.id;
          if (String(currentId) === String(taskId)) {
            return {
              ...t,
              taskStatus: 3,
              TaskStatus: 3,
              statusName: "Completed",
              StatusName: "Completed",
              studentRemarks: updatedRemark,
              StudentRemarks: updatedRemark,
              fileUrl: response.data?.fileUrl || response.data?.FileUrl || t.fileUrl || t.FileUrl || "uploaded"
            };
          }
          return t;
        })
      );

      handleCloseModal();
      
      // Backend માંથી ફ્રેશ ડેટા ફેચ કરો
      fetchAllDashboardData();
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error);
      alert("Failed to update task status: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress className="spms-loader" />
      </Box>
    );
  }

  const defaultProjectTitle = tasks.length > 0 ? (tasks[0].projectTitle || tasks[0].ProjectTitle) : "N/A";
  const mainProjectTitle = projectInfo?.projectTitle || projectInfo?.ProjectTitle || projectInfo?.title || defaultProjectTitle;

  return (
    <Box id="spms-student-dashboard">
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

      <Paper className="spms-banner-hero">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" className="spms-hero-title">
              Welcome Back | {studentInfo.studentName} 
            </Typography>
            <Typography variant="body2" className="spms-hero-sub">
              Mobile: <b>{studentInfo.mobileNo}</b> | Email: <b>{studentInfo.email}</b>
            </Typography>
          </Box>
          <Chip
            icon={<Person sx={{ color: "#fff !important" }} />}
            label={`Role: ${studentInfo.roleName}`}
            className="spms-role-badge"
          />
        </Box>
      </Paper>

      <Paper className="spms-main-card">
        <Typography className="spms-card-header">
          📋 Tasks for {studentInfo.studentName}
        </Typography>

        <Box className="spms-table-responsive">
          <TableContainer>
            <Table>
              <TableHead className="spms-thead">
                <TableRow>
                  <TableCell>Task Title</TableCell>
                  <TableCell>Project Details</TableCell>
                  <TableCell>Assigned Faculty</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Rating & Score</TableCell>
                  <TableCell align="center">Submission</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length > 0 ? (
                  tasks.map((task, index) => {
                    const ratingVal = task.rating ?? task.Rating;
                    const earnedVal = task.earnedScore ?? task.EarnedScore;
                    const dueDateVal = task.dueDate || task.DueDate;
                    const statusVal = task.taskStatus ?? task.TaskStatus;
                    const fileUrlVal = task.fileUrl || task.FileUrl;

                    const hasRating = ratingVal !== null && ratingVal !== undefined && ratingVal > 0;
                    const earned = earnedVal !== null && earnedVal !== undefined ? earnedVal : null;
                    const formattedDueDate = dueDateVal ? String(dueDateVal).split("T")[0] : "-";
                    
                    // 🟢 Status 3 એટલે કે Completed હોય અથવા fileUrl હોય તો Submitted ગણાય
                    const isSubmitted = String(statusVal) === "3" || Boolean(fileUrlVal);
                    
                    const assignedFaculty = task.projectFacultyName || "N/A";

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
                          <b>Project:- </b> {task.projectTitle || task.ProjectTitle || mainProjectTitle}
                        </TableCell>

                        {/* Faculty Name Field */}
                        <TableCell className="spms-cell-text">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <School fontSize="small" color="action" />
                            <span>{assignedFaculty}</span>
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
                          {hasRating || earned !== null ? (
                            <Rating 
                              value={Number(ratingVal || 0)} 
                              precision={0.5} 
                              readOnly 
                              size="small" 
                            />
                          ) : (
                            <Typography variant="body2" sx={{ color: "#94a3b8", fontStyle: "italic" }}>
                              N/A
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell align="center">
                          {isSubmitted ? (
                            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                              <Button 
                                variant="contained" 
                                size="small" 
                                color="success"
                                startIcon={<TaskAlt />}
                                disabled
                                sx={{ opacity: 0.9 }}
                              >
                                Submitted
                              </Button>
                              {fileUrlVal && (
                                <Button 
                                  variant="outlined" 
                                  size="small" 
                                  className="spms-btn-view" 
                                  startIcon={<Visibility />} 
                                  onClick={() => handleViewFile(fileUrlVal)}
                                >
                                  View
                                </Button>
                              )}
                            </Box>
                          ) : (
                            <Button 
                              variant="contained" 
                              size="small" 
                              className="spms-btn-upload" 
                              startIcon={<CloudUpload />} 
                              onClick={() => handleOpenModal(task)}
                            >
                              Upload Task
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" className="spms-empty-cell">
                      No tasks found for {studentInfo.studentName}.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* Upload Task Dialog */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm" className="spms-dialog">
        <DialogTitle className="spms-dialog-title">Upload Task</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2, p: 1.5, bgcolor: "#f1f5f9", borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ color: "#1e293b", mb: 0.5 }}>
              Student Name: <b>{selectedTask?.assignedStudentName || selectedTask?.AssignedStudentName || studentInfo.studentName}</b>
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "#1e293b" }}>
              Task: <b>{selectedTask?.taskTitle || selectedTask?.TaskTitle}</b>
            </Typography>
          </Box>

          <TextField 
            fullWidth 
            multiline 
            rows={3} 
            label="Student Feedback / Remark" 
            value={updatedRemark} 
            onChange={(e) => setUpdatedRemark(e.target.value)} 
            placeholder="Mention your work progress or feedback..." 
            sx={{ mb: 2.5 }} 
          />

          <Typography variant="caption" sx={{ fontWeight: 600, display: "block", mb: 1, color: "#475569" }}>
            Attach Task Proof / File (Required)
          </Typography>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<CloudUpload />}
            className={`spms-file-picker ${taskFile ? "spms-file-selected" : ""}`}
          >
            {taskFile ? `Attached: ${taskFile.name}` : "Attach File"}
            <input
              type="file"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setTaskFile(e.target.files[0]);
                }
              }}
            />
          </Button>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal} color="inherit">Cancel</Button>
          <Button 
            onClick={handleSaveTaskUpdate} 
            variant="contained" 
            className="spms-btn-primary"
          >
            Submit
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

export default StudentDashboard;