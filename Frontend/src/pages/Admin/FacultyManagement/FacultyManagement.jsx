import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FacultyManagement.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const FacultyManagement = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [open] = useState(true);

  // Delete Popup
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this faculty?"
    );

    if (confirmDelete) {
      console.log("Deleted Faculty ID:", id);
      // API delete call here
    }
  };

  const handleReset = () => {
    setSearch("");
  };

  const faculty = [
    {
      id: 201,
      name: "Prof. Rajesh Patel",
      email: "rajesh@spms.com",
      mobile: "9876543210",
      department: "MCA",
      subject: "Java",
    },
    {
      id: 202,
      name: "Prof. Neha Shah",
      email: "neha@spms.com",
      mobile: "9876543211",
      department: "BCA",
      subject: "Database",
    },
    {
      id: 203,
      name: "Prof. Amit Mehta",
      email: "amit@spms.com",
      mobile: "9876543212",
      department: "BE",
      subject: "React JS",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar open={open} />

      <div className="main-content">
        <Navbar />

        <div className="faculty-page">
          <div className="page-header">
            <h2>Manage Faculty</h2>

            <p className="breadcrumb">
              <Link to="/AdminDashboard">Home</Link>
              <span> / </span>
              <span className="active-page">Faculty</span>
            </p>
          </div>

          <div className="faculty-card">
            {/* Top Bar */}
            <div className="top-bar">
             

              <button
                type="button"
                className="add-btn"
                onClick={() => navigate("/admin/faculty/add")}
              >
                <AddOutlinedIcon />
                Add Faculty
              </button>
            </div>

            {/* Filter Section */}
            <div className="filter-section">
              <div>
                
                <input
                  type="text"
                  placeholder="Faculty Name..."
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
                  <th>Subject</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {faculty
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

                      <td>{item.subject}</td>

                      <td>
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => navigate("/admin/faculty/edit")}
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

export default FacultyManagement;