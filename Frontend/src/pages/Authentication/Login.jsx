import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

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

  // પેજ રીડાયરેક્ટ કરવા માટે useNavigate હૂક
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!role || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    // લોગિન ડેટા સ્થાનિક સ્ટોરેજમાં સાચવી શકાય (જરૂરિયાત મુજબ)
    localStorage.setItem("userRole", role);
    localStorage.setItem("isLoggedIn", "true");

    // રોલ પ્રમાણે રીડાયરેક્ટ કરો
    if (role === "Admin") {
      navigate("/AdminDashboard");
    } else if (role === "Faculty") {
      navigate("/FacultyDashboard");
    } else if (role === "Student") {
      navigate("/StudentDashboard");
    } else {
      alert("Invalid Role selected!");
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