import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./EditStudent.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";


const EditStudent = () => {


  const navigate = useNavigate();

  const [open] = useState(true);



  const [student, setStudent] = useState({

    name:"Aarav Patel",
    email:"aarav@gmail.com",
    mobile:"9876543210",
    password:"",
    department:"MCA",
    semester:"3"

  });





  const handleChange = (e)=>{


    setStudent({

      ...student,

      [e.target.name]:e.target.value

    });


  };






  const handleSubmit = (e)=>{


    e.preventDefault();


    console.log("Updated Student Data:",student);


    // API update call here


    navigate("/admin/students");


  };







return (

<div className="dashboard-layout">


<Sidebar open={open}/>



<div className="main-content">


<Navbar />




<div className="edit-student-page">





<div className="page-header">


<h2>
Edit Student
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
Edit Student
</span>


</p>


</div>









<div className="student-form-card">



<form onSubmit={handleSubmit}>






<div className="form-row">



<div className="form-group">


<label>
Full Name
</label>


<input

type="text"

name="name"

value={student.name}

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

value={student.email}

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

value={student.mobile}

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

value={student.password}

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

value={student.department}

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
Semester
</label>



<select

name="semester"

value={student.semester}

onChange={handleChange}

>


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


<option value="7">
Semester 7
</option>


<option value="8">
Semester 8
</option>


</select>


</div>




</div>









<div className="form-actions">



<button

type="submit"

className="update-btn"

>

Update Student

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


export default EditStudent;