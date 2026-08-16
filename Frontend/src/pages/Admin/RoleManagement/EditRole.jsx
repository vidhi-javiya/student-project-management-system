import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddRole.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

const EditRole = () => {

    const navigate = useNavigate();

    const [open] = useState(true);

    const [roleName, setRoleName] = useState("Admin");

    const [description, setDescription] = useState(
        "Full access to all modules and settings."
    );

    const handleUpdate = (e) => {

        e.preventDefault();

        alert("Role Updated Successfully");

        navigate("/admin/roles");

    };

    return (

        <div className="dashboard-layout">

            <Sidebar open={open} />

            <div className="main-content">

                <Navbar />

                <div className="add-role-page">

                    <div className="page-header">

                        <h2>Edit Role</h2>

                        <p className="breadcrumb">

                            <Link to="/AdminDashboard">Home</Link>

                            <span> / </span>

                            <Link to="/admin/roles">Roles</Link>

                            <span> / </span>

                            <span className="active-page">Edit</span>

                        </p>

                    </div>

                    <div className="form-card">

                        <h3>Role Details</h3>

                        <form onSubmit={handleUpdate}>

                            <div className="form-group">

                                <label>Role Name</label>

                                <input
                                    type="text"
                                    value={roleName}
                                    onChange={(e)=>setRoleName(e.target.value)}
                                />

                            </div>

                            <div className="form-group">

                                <label>Description</label>

                                <textarea
                                    rows="5"
                                    value={description}
                                    onChange={(e)=>setDescription(e.target.value)}
                                />

                            </div>

                            <div className="button-group">

                                <button
                                    className="save-btn"
                                    type="submit"
                                >

                                    <SaveOutlinedIcon />

                                    Update

                                </button>

                                <button
                                    type="button"
                                    className="back-btn"
                                    onClick={()=>navigate("/admin/roles")}
                                >

                                    <ArrowBackOutlinedIcon />

                                    Back

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

export default EditRole;