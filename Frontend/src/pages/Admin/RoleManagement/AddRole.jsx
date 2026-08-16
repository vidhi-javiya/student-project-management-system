import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddRole.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

const AddRole = () => {

  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = (e) => {
    e.preventDefault();

    alert("Role Saved Successfully");

    console.log({
      roleName,
      description,
    });

    navigate("/admin/roles");
  };

  return (

    <div className="dashboard-layout">

      {/* Sidebar */}

      <Sidebar open={open} />

      {/* Main Content */}

      <div className="main-content">

        {/* Navbar */}

        <Navbar />

        {/* Page */}

        <div className="add-role-page">

          <div className="page-header">

            <h2>Add Role</h2>

            <p className="breadcrumb">

              <Link to="/AdminDashboard">Home</Link>

              <span> / </span>

              <Link to="/admin/roles">Roles</Link>

              <span> / </span>

              <span className="active-page">Add</span>

            </p>

          </div>

          <div className="form-card">

            <h3>Role Details</h3>

            <form onSubmit={handleSave}>

              <div className="form-group">

                <label>Role Name</label>

                <input
                  type="text"
                  placeholder="Enter role name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  required
                />

              </div>

              <div className="form-group">

                <label>Description</label>

                <textarea
                  rows="5"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>

              </div>

              <div className="button-group">

                <button type="submit" className="save-btn">

                  <SaveOutlinedIcon />

                  Save

                </button>

                <button
                  type="button"
                  className="back-btn"
                  onClick={() => navigate("/admin/roles")}
                >

                  <ArrowBackOutlinedIcon />

                  Back

                </button>

              </div>

            </form>

          </div>

        </div>

        {/* Footer */}

        <Footer />

      </div>

    </div>

  );

};

export default AddRole;