import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Avatar,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
  CircularProgress
} from "@mui/material";
import { Person, Search, Assignment, Visibility, Clear, Refresh, Phone } from "@mui/icons-material";
import "./AssignedStudentsPage.css";

const AssignedStudentsPage = () => {
  const navigate = useNavigate();
  const [allStudents, setAllStudents] = useState([]);
  const [displayedStudents, setDisplayedStudents] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDynamicData();
  }, []);

  const fetchDynamicData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksRes, usersRes] = await Promise.all([
        fetch("https://localhost:7187/api/Task"),
        fetch("https://localhost:7187/api/User")
      ]);

      if (!tasksRes.ok || !usersRes.ok) {
        throw new Error("API માંથી ડેટા ફેચ થઈ શક્યો નથી.");
      }

      const tasksData = await tasksRes.json();
      const usersData = await usersRes.json();

      const tasksList = Array.isArray(tasksData) ? tasksData : tasksData.data || [];
      const usersList = Array.isArray(usersData) ? usersData : usersData.data || [];

      const taskCountsByUserId = {};
      
      tasksList.forEach((task) => {
        if (task.assignedTo) {
          taskCountsByUserId[task.assignedTo] = (taskCountsByUserId[task.assignedTo] || 0) + 1;
        }
      });

      const studentsOnly = usersList
        .filter((user) => user.roleId === 8 || user.role?.roleName?.toLowerCase() === "student")
        .map((user) => {
          return {
            studentId: user.userId,
            studentName: user.fullName || "N/A",
            mobileNo: user.mobileNumber || "N/A",
            email: user.email || "N/A",
            profilePic: user.profilePicturePath,
            totalTasks: taskCountsByUserId[user.userId] || 0
          };
        });

      setAllStudents(studentsOnly);
      setDisplayedStudents(studentsOnly);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("API Does Not Fetch Data....");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchInput.trim()) {
      setDisplayedStudents(allStudents);
      return;
    }
    const filtered = allStudents.filter((student) =>
      student.studentName.toLowerCase().includes(searchInput.toLowerCase()) ||
      student.mobileNo.toLowerCase().includes(searchInput.toLowerCase())
    );
    setDisplayedStudents(filtered);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setDisplayedStudents(allStudents);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box className="page-container">
      <Box className="content-wrapper">
        
        {/* Header Panel */}
        <Paper elevation={0} className="header-panel">
          <Box>
            <Typography variant="h4" className="header-title">
              👨‍🎓 Assigned Students
            </Typography>
            <Typography variant="body2" className="header-subtitle">
              Detailed list of all students assigned to tasks
            </Typography>
          </Box>
          <Tooltip title="Reset List">
            <IconButton onClick={fetchDynamicData} className="refresh-button">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Paper>

        {/* Search Bar Panel */}
        <Paper elevation={0} className="search-panel">
          <Box className="search-box-container">
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search by student name or mobile number..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="search-textfield"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person className="search-icon" />
                  </InputAdornment>
                ),
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <Clear fontSize="small" className="clear-icon" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              className="search-button"
            >
              Search
            </Button>
          </Box>
        </Paper>

        {/* Student Data Table */}
        <Paper elevation={0} className="table-paper">
          <TableContainer>
            <Table>
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center" className="table-header-cell">ID</TableCell>
                  <TableCell className="table-header-cell">Student Name</TableCell>
                  <TableCell className="table-header-cell">Mobile Number</TableCell>
                  <TableCell className="table-header-cell">Email</TableCell>
                  <TableCell align="center" className="table-header-cell">Assigned Tasks</TableCell>
                  <TableCell align="center" className="table-header-cell">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CircularProgress color="primary" />
                      <Typography sx={{ mt: 2 }} color="textSecondary">
                        Loading dynamic student data...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="error" variant="body1">
                        {error}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : displayedStudents.length > 0 ? (
                  displayedStudents.map((student, index) => (
                    <TableRow key={student.studentId || index} className="table-row">
                      <TableCell align="center" className="index-cell">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Box className="student-info">
                          <Avatar className="student-avatar">
                            {student.studentName ? student.studentName.charAt(0).toUpperCase() : <Person />}
                          </Avatar>
                          <Typography variant="subtitle2" className="student-name">
                            {student.studentName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell className="mobile-cell">
                        <Box className="mobile-wrapper">
                          <Phone className="phone-icon" />
                          {student.mobileNo}
                        </Box>
                      </TableCell>
                      <TableCell className="email-cell">
                        {student.email}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={<Assignment className="task-chip-icon" />}
                          label={`${student.totalTasks} Tasks`}
                          size="small"
                          className="task-chip"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Dashboard">
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(`/StudentDashboard/${student.studentId}`, {
                                state: { student }
                              })
                            }
                            className="action-button"
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="textSecondary" variant="body1">
                        No students found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

      </Box>
    </Box>
  );
};

export default AssignedStudentsPage;