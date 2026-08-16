import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AssignRole.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";


const AssignRole = () => {


const [open] = useState(true);


const [assign,setAssign] = useState({

    userId:"",
    roleId:""

});



const [permissions,setPermissions] = useState([

{
    RolePermissionId:1,
    UserId:1,
    UserName:"Aarav Patel",
    RoleId:1,
    RoleName:"Admin"
},

{
    RolePermissionId:2,
    UserId:2,
    UserName:"Priya Shah",
    RoleId:3,
    RoleName:"Faculty"
},

{
    RolePermissionId:3,
    UserId:3,
    UserName:"Rohan Mehta",
    RoleId:2,
    RoleName:"Student"
}

]);





const handleChange=(e)=>{

setAssign({

...assign,

[e.target.name]:e.target.value

});

};







const handleAssign=(e)=>{

e.preventDefault();


if(!assign.userId || !assign.roleId){

alert("Please select User and Role");

return;

}


alert("Role Assigned Successfully");


};







const handleDelete=(id)=>{


const confirmDelete = window.confirm(
"Are you sure you want to remove this role?"
);


if(confirmDelete){

alert("Role Permission Deleted");


}

};






return(

<div className="dashboard-layout">


<Sidebar open={open}/>



<div className="main-content">


<Navbar />




<div className="permission-page">



<div className="page-header">


<h2>
Assign Role
</h2>


<p className="breadcrumb">

<Link to="/AdminDashboard">
Home
</Link>

<span>/</span>

<span className="active-page">
Assign Role
</span>


</p>


</div>






<div className="permission-card">



<h3>
Assign Role To User
</h3>





<form onSubmit={handleAssign}>


<div className="form-row">



<div className="form-group">

<label>
Select User
</label>


<select

name="userId"

value={assign.userId}

onChange={handleChange}

>


<option value="">
-- Select User --
</option>


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

name="roleId"

value={assign.roleId}

onChange={handleChange}

>


<option value="">
-- Select Role --
</option>


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


<button className="save-btn">

Assign Role

</button>


</div>



</form>


</div>









<div className="permission-card">


<h3>
Assigned Roles
</h3>




<table>


<thead>


<tr>

<th>
ID
</th>

<th>
User
</th>

<th>
Role
</th>

<th>
Actions
</th>


</tr>


</thead>




<tbody>


{

permissions.map((item)=>(


<tr key={item.RolePermissionId}>


<td>
{item.RolePermissionId}
</td>


<td>
{item.UserName}
</td>


<td>

<span className="role-badge">

{item.RoleName}

</span>

</td>



<td>


<button

className="delete-btn"

onClick={()=>handleDelete(item.RolePermissionId)}

>


<DeleteOutlineOutlinedIcon fontSize="small"/>


</button>


</td>


</tr>


))


}



</tbody>


</table>



</div>








</div>



<Footer />



</div>


</div>


);


};


export default AssignRole;