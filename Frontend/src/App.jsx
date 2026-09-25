import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Authentication/Login";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import DashboardCard from "./components/DashboardCard/DashboardCards";
import RoleManagement from "./pages/Admin/RoleManagement/RoleManagement";
import AddRole from "./pages/Admin/RoleManagement/AddRole";
import EditRole from "./pages/Admin/RoleManagement/EditRole";
import UserManagement from "./pages/Admin/UserManagement/UserManagement";
import AddUser from "./pages/Admin/UserManagement/AddUser";
import EditUser from "./pages/Admin/UserManagement/EditUser";
import StudentManagement from "./pages/Admin/StudentManagement/StudentManagement";
import AddStudent from "./pages/Admin/StudentManagement/AddStudent";
import EditStudent from "./pages/Admin/StudentManagement/EditStudent";
import FacultyManagement from "./pages/Admin/FacultyManagement/FacultyManagement";
import AddFaculty from "./pages/Admin/FacultyManagement/AddFaculty";
import EditFaculty from "./pages/Admin/FacultyManagement/EditFaculty";
import RolePermission from "./pages/Admin/RolePermission/RolePermission";
import AssignRole from "./pages/Admin/RolePermission/AssignRole";
import EditAssignRole from "./pages/Admin/RolePermission/EditAssignRole";
import ProjectManagement from "./pages/Admin/ProjectManagement/ProjectManagement";
import AddProject from "./pages/Admin/ProjectManagement/AddProject";
import EditProject from "./pages/Admin/ProjectManagement/EditProject";
import ManageTasks from "./pages/Admin/TaskManagement/ManageTasks";
import EditTask from "./pages/Admin/TaskManagement/EditTask";
import AddTask from "./pages/Admin/TaskManagement/AddTask";
import PriorityManagement from "./pages/Admin/PriorityManagement/PriorityManagement";
import StatusManagement from "./pages/Admin/StatusManagement/StatusManagement";

// Student
import AssignedStudentsPage from "./pages/Student/Dashboard/AssignedStudentsPage"; 
import StudentDashboard from "./pages/Student/Dashboard";

// Faculty
import FacultyDashboard from "./pages/Faculty/FacultyDashboard";

// Protected Route Component
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 🔒 ADMIN PROTECTED ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/AdminDashboard" element={<Dashboard />} />
          <Route path="/Sidebar" element={<Sidebar />} />
          <Route path="/Navbar" element={<Navbar />} />
          <Route path="/Footer" element={<Footer />} />
          <Route path="/DashboardCard" element={<DashboardCard />} />
          <Route path="/admin/roles" element={<RoleManagement />} />
          <Route path="/admin/add-role" element={<AddRole />} />
          <Route path="/admin/edit-role" element={<EditRole />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/users/add" element={<AddUser />} />
          <Route path="/admin/users/edit" element={<EditUser />} /> 
          <Route path="/admin/users/edit/:id" element={<EditUser />} />
          <Route path="/admin/students" element={<StudentManagement />} />
          <Route path="/admin/students/add" element={<AddStudent />} />
          <Route path="/admin/students/edit" element={<EditStudent />} />
          <Route path="/admin/faculty" element={<FacultyManagement />} />
          <Route path="/admin/faculty/add" element={<AddFaculty />} />
          <Route path="/admin/faculty/edit" element={<EditFaculty />} />
          <Route path="/admin/permissions" element={<RolePermission />} />
          <Route path="/admin/assign-role" element={<AssignRole />} />
          <Route path="/admin/edit-role-permission" element={<EditAssignRole />} />
          <Route path="/admin/projects" element={<ProjectManagement />} />
          <Route path="/admin/projects/add" element={<AddProject />} />
          <Route path="/admin/projects/edit" element={<AddProject />} />
          <Route path="/admin/projects/edit/:id" element={<EditProject />} />
          <Route path="/admin/tasks" element={<ManageTasks />} />
          <Route path="/admin/tasks/add" element={<AddTask />} />
          <Route path="/admin/tasks/edit/:id" element={<EditTask />} />
          <Route path="/admin/priorities" element={<PriorityManagement />} />
          <Route path="/status-management" element={<StatusManagement />} />
        </Route>

        {/* 🔒 STUDENT PROTECTED ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
          <Route path="/StudentDashboard" element={<AssignedStudentsPage />} />
          <Route path="/StudentDashboard/:id" element={<StudentDashboard />} />
        </Route>

        {/* 🔒 FACULTY PROTECTED ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['Faculty']} />}>
          <Route path="/FacultyDashboard" element={<FacultyDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;