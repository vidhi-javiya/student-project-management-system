import React, { useState } from "react";
import "./Dashboard.css";

import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import DashboardCard from "../../../components/DashboardCard/DashboardCards";




function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="dashboard-layout">
     
      <Sidebar open={sidebarOpen} />
     
      <div className={`main-content ${sidebarOpen ? "" : "full"}`}>
        {/* Navbar */}
        <Navbar
          toggleSidebar={() =>
            setSidebarOpen(!sidebarOpen)
          }
        />
       
        <div className="dashboard">
        
          <div className="dashboard-header">
            <div>

              <h1>
                Dashboard
              </h1>
              <p>
                Welcome Admin
              </p>
            </div>
          </div>
         
          <DashboardCard />
        </div>

       
        <Footer />
      </div>
    </div>

  );

}


export default Dashboard;