import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddStudent.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";


const AddStudent = () => {


  const navigate = useNavigate();

  const [open] = useState(true);



  const [student, setStudent] = useState({

    name:"",
    email:"",
    mobile:"",
    password:"",
    department:"",
    semester:""

  });




  const handleChange = (e)=>{

    setStudent({

      ...student,

      [e.target.name]:e.target.value

    });

  };





  const handleSubmit = (e)=>{

    e.preventDefault();


    console.log("Student Data:", student);


    // API Add Student Call Here


    navigate("/admin/students");

  };





return (

<div className="dashboard-layout">


  <Sidebar open={open}/>




  <div className="main-content">


    <Navbar />




    <div className="add-student-page">





      <div className="page-header">


        <h2>
          Add Student
        </h2>



        <p className="breadcrumb">


          <Link to="/admin/dashboard">
            Home
          </Link>


          <span>
            /
          </span>


          <Link to="/admin/students">
            Students
          </Link>


          <span>
            /
          </span>


          <span className="active-page">
            Add Student
          </span>


        </p>


      </div>









      <div className="student-form-card">



        <form onSubmit={handleSubmit}>




          {/* Row 1 */}

          <div className="form-row">



            <div className="form-group">


              <label>
                Full Name
              </label>


              <input

                type="text"

                name="name"

                placeholder="Enter student name"

                value={student.name}

                onChange={handleChange}

                required

              />


            </div>






            <div className="form-group">


              <label>
                Email
              </label>


              <input

                type="email"

                name="email"

                placeholder="Enter email address"

                value={student.email}

                onChange={handleChange}

                required

              />


            </div>



          </div>









          {/* Row 2 */}

          <div className="form-row">



            <div className="form-group">


              <label>
                Mobile Number
              </label>


              <input

                type="text"

                name="mobile"

                placeholder="Enter mobile number"

                value={student.mobile}

                onChange={handleChange}

                required

              />


            </div>






            <div className="form-group">


              <label>
                Password
              </label>


              <input

                type="password"

                name="password"

                placeholder="Enter password"

                value={student.password}

                onChange={handleChange}

                required

              />


            </div>



          </div>









          {/* Row 3 */}

          <div className="form-row">



            <div className="form-group">


              <label>
                Department
              </label>



              <select

                name="department"

                value={student.department}

                onChange={handleChange}

                required

              >


                <option value="">
                  Select Department
                </option>


                <option value="MCA">
                  MCA
                </option>


                <option value="BCA">
                  BCA
                </option>


                <option value="BE">
                  BE
                </option>


                <option value="MBA">
                  MBA
                </option>


              </select>



            </div>







            <div className="form-group">


              <label>
                Semester
              </label>



              <select

                name="semester"

                value={student.semester}

                onChange={handleChange}

                required

              >


                <option value="">
                  Select Semester
                </option>


                <option value="1">
                  Semester 1
                </option>


                <option value="2">
                  Semester 2
                </option>


                <option value="3">
                  Semester 3
                </option>


                <option value="4">
                  Semester 4
                </option>


                <option value="5">
                  Semester 5
                </option>


                <option value="6">
                  Semester 6
                </option>


              </select>



            </div>



          </div>









          {/* Buttons */}

          <div className="form-actions">



            <button

              type="submit"

              className="save-btn"

            >

              Save Student

            </button>





            <button

              type="button"

              className="cancel-btn"

              onClick={()=>navigate("/admin/students")}

            >

              Cancel

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


export default AddStudent;