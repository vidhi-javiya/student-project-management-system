import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StudentManagement.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const StudentManagement = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [open] = useState(true);

  // Delete Alert Popup
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmDelete) {
      console.log("Deleted Student ID:", id);
      // API delete call here
    }
  };

  const handleReset = () => {
    setSearch("");
  };

  const students = [
    {
      id: 101,
      name: "Aarav Patel",
      email: "aarav@gmail.com",
      mobile: "9876543210",
      department: "MCA",
      semester: "3",
    },
    {
      id: 102,
      name: "Priya Shah",
      email: "priya@gmail.com",
      mobile: "9876543211",
      department: "BCA",
      semester: "5",
    },
    {
      id: 103,
      name: "Rohan Mehta",
      email: "rohan@gmail.com",
      mobile: "9876543212",
      department: "BE",
      semester: "7",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar open={open} />

      <div className="main-content">
        <Navbar />

        <div className="student-page">
          <div className="page-header">
            <h2>Manage Students</h2>

            <p className="breadcrumb">
              <Link to="/AdminDashboard">Home</Link>
              <span> / </span>
              <span className="active-page">Students</span>
            </p>
          </div>

          <div className="student-card">
            {/* Top Search & Actions */}
            <div className="top-bar">
              
              <button
                type="button"
                className="add-btn"
                onClick={() => navigate("/admin/students/add")}
              >
                <AddOutlinedIcon />
                Add Student
              </button>
            </div>

            {/* Filter Section */}
            <div className="filter-section">
              <div>
                <label>Search</label>
                <input
                  type="text"
                  placeholder="Student Name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="filter-actions">
                <button
                  type="button"
                  className="reset-btn"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Table */}
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students
                  .filter((item) =>
                    item.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>

                      <td>
                        <strong>{item.name}</strong>
                      </td>

                      <td>{item.email}</td>

                      <td>{item.mobile}</td>

                      <td>{item.department}</td>

                      <td>{item.semester}</td>

                      <td>
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => navigate("/admin/students/edit")}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDelete(item.id)}
                        >
                          <DeleteOutlineOutlinedIcon fontSize="small" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default StudentManagement;