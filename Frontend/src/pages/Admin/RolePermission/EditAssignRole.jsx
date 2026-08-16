import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AssignRole.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";


const EditAssignRole = () => {


const [open] = useState(true);



const [rolePermission,setRolePermission] = useState({

    RolePermissionId:1,
    UserId:"1",
    RoleId:"1"

});




const handleChange=(e)=>{

setRolePermission({

...rolePermission,

[e.target.name]:e.target.value

});

};





const handleUpdate=(e)=>{

e.preventDefault();


console.log(rolePermission);


alert("Role Permission Updated Successfully");


};





return(


<div className="dashboard-layout">


<Sidebar open={open}/>



<div className="main-content">


<Navbar />



<div className="permission-page">



<div className="page-header">


<h2>
Edit Assigned Role
</h2>



<p className="breadcrumb">


<Link to="/admin/dashboard">
Home
</Link>


<span>
/
</span>


<Link to="/admin/assign-role">
Assign Role
</Link>


<span>
/
</span>


<span className="active-page">
Edit
</span>


</p>


</div>








<div className="permission-card">



<h3>
Update Role Permission
</h3>





<form onSubmit={handleUpdate}>


<div className="form-row">





<div className="form-group">


<label>
Role Permission ID
</label>


<input

type="text"

value={rolePermission.RolePermissionId}

disabled

/>


</div>







<div className="form-group">


<label>
Select User
</label>


<select

name="UserId"

value={rolePermission.UserId}

onChange={handleChange}

>


<option value="1">
Aarav Patel
</option>


<option value="2">
Priya Shah
</option>


<option value="3">
Rohan Mehta
</option>


</select>


</div>







<div className="form-group">


<label>
Select Role
</label>


<select

name="RoleId"

value={rolePermission.RoleId}

onChange={handleChange}

>



<option value="1">
Admin
</option>


<option value="2">
Student
</option>


<option value="3">
Faculty
</option>



</select>


</div>






</div>







<div className="button-group">



<button

type="submit"

className="save-btn"

>

Update Role

</button>





<Link

to="/admin/assign-role"

className="back-btn"

>

Cancel

</Link>




</div>







</form>





</div>






</div>






<Footer />



</div>



</div>


);


};


export default EditAssignRole;