import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./EditFaculty.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";


const EditFaculty = () => {


  const navigate = useNavigate();

  const [open] = useState(true);



  const [faculty,setFaculty] = useState({

    name:"Prof. Rajesh Patel",
    email:"rajesh@spms.com",
    mobile:"9876543210",
    password:"",
    department:"MCA",
    subject:"Java"

  });





  const handleChange = (e)=>{

    setFaculty({

      ...faculty,

      [e.target.name]:e.target.value

    });

  };





  const handleSubmit = (e)=>{

    e.preventDefault();


    console.log("Updated Faculty:",faculty);


    // API update call here


    navigate("/admin/faculty");


  };







return (

<div className="dashboard-layout">



<Sidebar open={open}/>





<div className="main-content">



<Navbar />






<div className="edit-faculty-page">






<div className="page-header">


<h2>
Edit Faculty
</h2>




<p className="breadcrumb">


<Link to="/admin/dashboard">
Home
</Link>


<span>
/
</span>



<Link to="/admin/faculty">
Faculty
</Link>



<span>
/
</span>



<span className="active-page">
Edit Faculty
</span>



</p>



</div>









<div className="faculty-form-card">



<form onSubmit={handleSubmit}>





<div className="form-row">



<div className="form-group">


<label>
Full Name
</label>



<input

type="text"

name="name"

value={faculty.name}

onChange={handleChange}

/>



</div>








<div className="form-group">


<label>
Email
</label>



<input

type="email"

name="email"

value={faculty.email}

onChange={handleChange}

/>



</div>



</div>









<div className="form-row">



<div className="form-group">


<label>
Mobile Number
</label>



<input

type="text"

name="mobile"

value={faculty.mobile}

onChange={handleChange}

/>



</div>







<div className="form-group">


<label>
Password
</label>



<input

type="password"

name="password"

placeholder="Enter new password"

value={faculty.password}

onChange={handleChange}

/>



</div>



</div>









<div className="form-row">



<div className="form-group">


<label>
Department
</label>



<select

name="department"

value={faculty.department}

onChange={handleChange}

>


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
Subject
</label>



<input

type="text"

name="subject"

value={faculty.subject}

onChange={handleChange}

/>



</div>



</div>









<div className="form-actions">



<button

type="submit"

className="update-btn"

>

Update Faculty

</button>






<button

type="button"

className="cancel-btn"

onClick={()=>navigate("/admin/faculty")}

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


export default EditFaculty;