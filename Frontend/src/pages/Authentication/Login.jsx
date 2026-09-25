import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setAuthData } from "../../utils/auth"; // auth.js હેલ્પર ફાઈલ માંથી ઇમ્પોર્ટ કર્યું

import {
  Paper,
  TextField,
  Typography,
  Button,
  MenuItem,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  Alert,
} from "@mui/material";

import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  School,
} from "@mui/icons-material";

const Login = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); 

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(""); 

    if (!role || !email || !password) {
      setErrorMsg("Please fill all fields.");
      return;
    }

    try {
      // 1. Backend API  Request 
      const response = await axios.post("https://localhost:7187/api/Auth/login", {
        email: email,
        password: password,
        role: role,
      });

      // 2. if login susses
      if (response.data.success) {
        // Token  User Info  localStorage to data save
        setAuthData(response.data.token, {
          email: response.data.email,
          role: response.data.role,
        });

        // Backend to fatch Role  Navigate the page
        const userRole = response.data.role;

        if (userRole === "Admin") {
          navigate("/AdminDashboard");
        } else if (userRole === "Faculty") {
          navigate("/FacultyDashboard");
        } else if (userRole === "Student") {
          navigate("/StudentDashboard");
        } else {
          navigate("/Dashboard");
        }
      }
    } catch (err) {
      // 3. Backend error handle
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Server error! Please check if backend is running.");
      }
    }
  };

  return (
    <div className="login-page">
      {/* Left Side */}
      <div className="left-side">
        <School className="school-icon" />

        <h1>Student Project Management System</h1>

        <p>
          Manage Projects, Faculty, Students and Tasks from one centralized
          platform.
        </p>

        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/student-learning-4268395-3551763.png"
          alt="login"
        />
      </div>

      {/* Right Side */}
      <Paper elevation={8} className="login-box">
        <Typography variant="h4" className="title">
          Welcome Back
        </Typography>

        <Typography className="subtitle">Login to your account</Typography>

        {/* 🔴 Error Alert Message */}
        {errorMsg && (
          <Alert severity="error" style={{ marginBottom: "15px" }}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            select
            fullWidth
            label="Select Role"
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Faculty">Faculty</MenuItem>
            <MenuItem value="Student">Student</MenuItem>
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Password</InputLabel>

            <OutlinedInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              startAdornment={
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <Link to="/forgot-password" className="forgot">
            Forgot Password?
          </Link>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            className="login-btn"
          >
            LOGIN
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default Login;