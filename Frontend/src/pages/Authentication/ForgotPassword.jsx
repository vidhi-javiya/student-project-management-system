import React, { useState } from "react";
import "./ForgotPassword.css";

import {
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";

import {
  Email,
  LockReset,
} from "@mui/icons-material";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    if(email===""){
      alert("Please Enter Email");
      return;
    }

    alert("Password Reset Link Sent Successfully");

  };

  return (

    <div className="forgot-container">

      <Paper elevation={10} className="forgot-card">

        <div className="icon-box">
          <LockReset className="reset-icon"/>
        </div>

        <Typography variant="h4" className="heading">
          Forgot Password?
        </Typography>

        <Typography className="sub-heading">
          Enter your registered email address.
          We will send you a password reset link.
        </Typography>

        <form onSubmit={handleSubmit}>

          <TextField

            fullWidth
            label="Email Address"
            type="email"
            margin="normal"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            InputProps={{
              startAdornment:(
                <InputAdornment position="start">
                  <Email/>
                </InputAdornment>
              )
            }}

          />

          <Button

            fullWidth
            variant="contained"
            className="reset-btn"
            type="submit"

          >
            Send Reset Link

          </Button>

        </form>

        <a href="/" className="back-login">
          ← Back to Login
        </a>

      </Paper>

    </div>

  );

};

export default ForgotPassword;