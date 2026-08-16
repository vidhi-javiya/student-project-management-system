import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddFaculty.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";


const AddFaculty = () => {


  const navigate = useNavigate();

  const [open] = useState(true);



  const [faculty, setFaculty] = useState({

    name:"",
    email:"",
    mobile:"",
    password:"",
    department:"",
    subject:""

  });




  const handleChange = (e)=>{

    setFaculty({

      ...faculty,

      [e.target.name]:e.target.value

    });

  };






  const handleSubmit = (e)=>{

    e.preventDefault();


    console.log("Faculty Data:", faculty);


    // API add faculty call here


    navigate("/admin/faculty");


  };







return (

<div className="dashboard-layout">


<Sidebar open={open}/>




<div className="main-content">


<Navbar />





<div className="add-faculty-page">





<div className="page-header">


<h2>
Add Faculty
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
Add Faculty
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

placeholder="Enter faculty name"

value={faculty.name}

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

value={faculty.email}

onChange={handleChange}

required

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

placeholder="Enter mobile number"

value={faculty.mobile}

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

value={faculty.password}

onChange={handleChange}

required

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
Subject
</label>



<input

type="text"

name="subject"

placeholder="Enter subject"

value={faculty.subject}

onChange={handleChange}

required

/>


</div>





</div>








<div className="form-actions">



<button

type="submit"

className="save-btn"

>

Save Faculty

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


export default AddFaculty;